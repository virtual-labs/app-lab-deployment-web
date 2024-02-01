const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const { google } = require("googleapis");
const {
  SPREADSHEET_ID,
  SPREADSHEET_RANGE,
  SPREADSHEET_NAME,
  SPREADSHEET_HOSTING_NAME,
  SPREADSHEET_HOSTING_RANGE,
} = require("../secrets/spreadsheet");
const { Octokit } = require("@octokit/rest");
const { Base64 } = require("js-base64");
const axios = require("axios");
const { raw } = require("express");

const getDataFromSheet = async (spreadsheetId, range, req = null) => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "./secrets/service-account-secret.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    const authClientObject = await auth.getClient();
    const googleSheetsInstance = google.sheets({
      version: "v4",
      auth: authClientObject,
    });
    const readData = await googleSheetsInstance.spreadsheets.get({
      auth,
      spreadsheetId,
      ranges: range,
      fields: "sheets(data(rowData(values(hyperlink,userEnteredValue))))",
    });
    if (req === "RAW") {
      const rawData = await googleSheetsInstance.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: range,
        dateTimeRenderOption: "FORMATTED_STRING",
      });
      return { readData, rawData: rawData.data.values };
    }

    return readData;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

const appendIntoSheet = async (row, spreadsheetId, range) => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "./secrets/service-account-secret.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    const authClientObject = await auth.getClient();
    const googleSheetsInstance = google.sheets({
      version: "v4",
      auth: authClientObject,
    });
    const resource = {
      majorDimension: "ROWS",
      values: row,
    };
    const result = await googleSheetsInstance.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      resource: resource,
    });
    return result.data.updates.updatedCells;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

const getLinkAndName = (obj) => {
  let link = "";
  let name = "";
  if (!obj.userEnteredValue) return { link, name };
  if (obj.userEnteredValue.stringValue) {
    name = obj.userEnteredValue.stringValue.trim();
  }
  if (obj.userEnteredValue.formulaValue) {
    name = obj.userEnteredValue.formulaValue.trim();
    name = name.split('"');
    name = name[name.length - 2];
  }
  if (obj.userEnteredValue.numberValue) {
    return {
      link,
      number: obj.userEnteredValue.numberValue,
    };
  }
  if (obj.hyperlink) {
    link = obj.hyperlink;
  }
  return { link, name };
};

const getLabList = async () => {
  try {
    const spreadsheetId = SPREADSHEET_ID;
    const range = SPREADSHEET_RANGE;
    const readData = await getDataFromSheet(spreadsheetId, range);
    let rows = readData.data.sheets[0].data[0].rowData;
    rows = rows.map((row, i) => {
      return { ...row, index: i };
    });
    let labs = rows.filter(
      (row) => row.hasOwnProperty("values") && row.values.length === 6
    );
    let instituteName = "";

    let labList = [];

    for (let lab of labs) {
      let values = lab.values;
      if (!values[2]) continue;
      let university = "";

      if (values[1].userEnteredValue)
        university = values[1].userEnteredValue.stringValue.trim();

      if (university === "College Name") continue;

      if (university === "") {
        university = instituteName;
      } else {
        instituteName = university;
      }
      if (university) {
        let { link: labLink, name: labName } = getLinkAndName(values[2]);
        let discipline = values[3].userEnteredValue.stringValue.trim();
        let { link: repoLink } = getLinkAndName(values[4]);
        let repoName = repoLink.split("/").pop();
        let { link: descriptorLink } = getLinkAndName(values[5]);

        labList.push({
          university,
          labName,
          labLink,
          discipline,
          repoLink,
          repoName,
          descriptorLink,
          index: lab.index,
        });
      }
    }
    return labList;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

const getLabs = async (req, res) => {
  let { search } = req.query;
  console.log("search request for: ", search);
  search = search.toLowerCase().trim();

  const labList = await getLabList();

  let filteredLabs = labList.filter((lab) => {
    return (
      lab.labName.toLowerCase().includes(search) ||
      lab.university.toLowerCase().includes(search) ||
      lab.discipline.toLowerCase().includes(search) ||
      lab.repoName.toLowerCase().includes(search)
    );
  });

  return res
    .status(StatusCodes.OK)
    .json({ labs: filteredLabs, len: filteredLabs.length });
};

const getLabDescriptor = async (req, res) => {
  const { reponame, access_token, want_descriptor_url } = req.query;

  if (!reponame) {
    throw new BadRequestError(`repository name missing`);
  }

  if (!access_token) {
    throw new BadRequestError(`github access_token missing`);
  }

  const octokit = new Octokit({
    auth: access_token,
  });

  const owner = process.env.GITHUB_OWNER;
  const repo = reponame;
  const branch = await getDefaultGithubBranch(repo, owner, access_token);
  const file = "lab-descriptor.json";
  const resp = await octokit.request(
    `GET /repos/${owner}/${repo}/contents/${file}?ref=${branch}`,
    {
      owner,
      repo,
      path: file,
      ref: branch,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const asciiString = atob(resp.data.content);
  let descriptorJson = JSON.parse(asciiString);

  if (want_descriptor_url) {
    descriptorJson.descriptorURL = resp.data.html_url;
  }
  return res.status(StatusCodes.OK).json(descriptorJson);
};

const getBlobSHA = async (owner, repo, path, branch, access_token) => {
  const octokit = new Octokit({ auth: access_token });
  const response = await octokit.repos.getContent({
    owner,
    repo,
    path,
    ref: branch,
  });
  const blobSHA = response.data.sha;
  return blobSHA;
};

const commitDescriptor = async (req, res) => {
  const { repoName, descriptor, access_token } = req.body;

  if (!repoName) {
    throw new BadRequestError(`repository name missing`);
  }

  if (!descriptor) {
    throw new BadRequestError(`descriptor missing`);
  }

  const octokit = new Octokit({
    auth: access_token,
  });

  const content = JSON.stringify(descriptor, null, 2);
  const contentEncoded = Base64.encode(content);
  const branch = await getDefaultGithubBranch(
    repoName,
    process.env.GITHUB_OWNER,
    access_token
  );
  const sha = await getBlobSHA(
    process.env.GITHUB_OWNER,
    repoName,
    "lab-descriptor.json",
    branch,
    access_token
  );

  console.log("Got SHA");

  await octokit.repos.createOrUpdateFileContents({
    owner: process.env.GITHUB_OWNER,
    repo: repoName,
    path: "lab-descriptor.json",
    message: "Updated lab-descriptor.json programatically",
    content: contentEncoded,
    branch: branch,
    committer: {
      name: `Lab Deployment Bot`,
      email: "vlabs-lab-deployment@gmail.com",
    },
    sha,
    author: {
      name: "Lab Deployment Bot",
      email: "vlabs-lab-deployment@gmail.com",
    },
  });
  return res.status(StatusCodes.OK).json({ message: "success" });
};

const updateRow = async (
  spreadsheetId,
  sheetName,
  repoName,
  university,
  labName,
  labLink,
  discipline,
  labURL,
  descriptorURL,
  rowIndex
) => {
  const sheetsAuth = new google.auth.GoogleAuth({
    keyFile: "./secrets/service-account-secret.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const authClient = await sheetsAuth.getClient();

  try {
    const rows = [
      [
        rowIndex,
        university,
        `=HYPERLINK("${labLink}", "${labName}")`,
        discipline,
        `=HYPERLINK("${labURL}", "Repo Link")`,
        `=HYPERLINK("${descriptorURL}", "Lab Descriptor Link")`,
      ],
    ];

    await google.sheets("v4").spreadsheets.values.update({
      auth: authClient,
      spreadsheetId,
      range: `${sheetName}!A${rowIndex}:Z${rowIndex}`,
      valueInputOption: "USER_ENTERED",
      resource: {
        majorDimension: "ROWS",
        values: rows,
      },
    });
  } catch (error) {
    console.error("Error updating row:", error);
    throw error;
  }
};

const addLab = async (req, res) => {
  const { university, labName, labLink, discipline, labURL, descriptorURL } =
    req.body;
  {
    if (!university) {
      throw new BadRequestError(`institute name missing`);
    }

    if (!labName) {
      throw new BadRequestError(`lab name missing`);
    }
    if (!labLink) {
      throw new BadRequestError(`lab link missing`);
    }

    if (!discipline) {
      throw new BadRequestError(`discipline name missing`);
    }
    if (!labURL) {
      throw new BadRequestError(`lab url missing`);
    }

    if (!descriptorURL) {
      throw new BadRequestError(`descriptor url missing`);
    }
  }
  const labList = await getLabList();
  const f = labList.filter((lab, i) => {
    return lab.repoLink === labURL;
  });
  if (f.length !== 0) {
    await updateRow(
      SPREADSHEET_ID,
      SPREADSHEET_NAME,
      f[0].repoName,
      university,
      labName,
      labLink,
      discipline,
      labURL,
      descriptorURL,
      f[0].index + 1
    );
    return res
      .status(StatusCodes.OK)
      .json({ message: "Lab updated successfully" });
  }

  const rows = [
    [
      labList.length + 1,
      university,
      `=HYPERLINK("${labLink}", "${labName}")`,
      discipline,
      `=HYPERLINK("${labURL}", "Repo Link")`,
      `=HYPERLINK("${descriptorURL}", "Lab Descriptor Link")`,
    ],
  ];
  await appendIntoSheet(rows, SPREADSHEET_ID, SPREADSHEET_RANGE);
  return res.status(StatusCodes.OK).json({ message: "Lab added successfully" });
};

async function getLatestWorkflowRunId(repoOwner, repoName, workflowId, token) {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${repoOwner}/${repoName}/actions/workflows/${workflowId}/runs`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    return response.data.workflow_runs[0].id;
  } catch (error) {
    console.error("Error getting latest workflow run ID:", error.message);
    throw error;
  }
}

const deployLab = async (req, res) => {
  const { access_token, repoName } = req.body;
  const repoOwner = process.env.GITHUB_OWNER;
  const branch = await getDefaultGithubBranch(
    repoName,
    repoOwner,
    access_token
  );
  const workflowName = process.env.GITHUB_DEPLOYMENT_WORKFLOW;

  const token = access_token;

  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/actions/workflows`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
  };

  try {
    const response = await axios.get(apiUrl, { headers });
    const workflow = response.data.workflows.find(
      (w) => w.name === workflowName
    );
    const workflowId = workflow.id;

    const dispatchResponse = await axios.post(
      `${apiUrl}/${workflowId}/dispatches`,
      {
        ref: branch,
      },
      { headers }
    );

    setTimeout(async () => {
      const workflowRunId = await getLatestWorkflowRunId(
        repoOwner,
        repoName,
        workflowId,
        token
      );
      console.log(
        `Workflow "${workflowName}" triggered successfully for branch "${branch}". Workflow Run ID: ${workflowRunId}`
      );
      return res
        .status(StatusCodes.OK)
        .json({ message: "success", workflowRunId });
    }, 5000);
  } catch (error) {
    console.error("Error triggering workflow:", error.message);
    return res.status(400).json({ message: error.message });
  }
};

async function checkWorkflowStatus(repoOwner, repoName, workflowRunId, token) {
  try {
    const apiURL = `https://api.github.com/repos/${
      repoOwner || process.env.GITHUB_OWNER
    }/${repoName}/actions/runs/${workflowRunId}`;
    console.log("Checking workflow status:", apiURL);
    const workflowRunResponse = await axios.get(apiURL, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const status = workflowRunResponse.data.status;
    const conclusion = workflowRunResponse.data.conclusion;
    console.log(
      `Workflow Run ID ${workflowRunId} Status: ${status} Conclusion: ${conclusion}`,
      new Date().toLocaleString()
    );

    return { status, conclusion };
  } catch (error) {
    console.error("Error checking workflow status:", error.message);
    throw error;
  }
}

const statusLab = async (req, res) => {
  const { access_token, repoName, workflowRunId } = req.body;
  const repoOwner = process.env.GITHUB_OWNER;
  try {
    const { status, conclusion } = await checkWorkflowStatus(
      repoOwner,
      repoName,
      workflowRunId,
      access_token
    );
    return res.status(StatusCodes.OK).json({ status, conclusion });
  } catch (error) {
    console.error("Error getting workflow status:", error.message);
    return res.status(400).json({ message: error.message });
  }
};

const getDefaultGithubBranch = async (repoName, owner, access_token) => {
  const octokit = new Octokit({ auth: access_token });
  const response = await octokit.repos.get({
    owner,
    repo: repoName,
  });
  return response.data.default_branch;
};

const getNextTag = (latestTag) => {
  if (latestTag === "") return "1.0.0";
  latestTag = latestTag.slice(1);
  const [major, minor, patch] = latestTag.split(".");
  return `${major}.${minor}.${parseInt(patch) + 1}`;
};

const createTag = async (req, res) => {
  try {
    const { repo, access_token, tagName } = req.body;
    const owner = process.env.GITHUB_OWNER;
    const octokit = new Octokit({
      auth: access_token,
    });
    const tagMessage = `Release version ${tagName}`;
    const branch = await getDefaultGithubBranch(repo, owner, access_token);

    const { data: latestCommit } = await octokit.repos.getBranch({
      owner,
      repo,
      branch,
    });

    await octokit.git.createTag({
      owner,
      repo,
      tag: tagName,
      message: tagMessage,
      object: latestCommit.commit.sha,
      type: "commit",
    });

    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/tags/${tagName}`,
      sha: latestCommit.commit.sha,
    });
    return res.status(StatusCodes.OK).json({ message: "success" });
  } catch (err) {
    if (err.status === 422) {
      return res.status(StatusCodes.OK).json({ message: "success" });
    }
    console.log(err);
    return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
  }
};

const addAnalytics = async (req, res) => {
  const {
    university,
    repoLink,
    labName,
    labLink,
    repoName,
    latestTag,
    hostingURL,
    hostingRequester,
    revert,
    prevTag,
  } = req.body;

  const newTag = revert ? prevTag : `v${getNextTag(latestTag)}`;
  const currentTagURL = `https://github.com/${process.env.GITHUB_OWNER}/${repoName}/releases/tag/${newTag}`;
  const prevTagURL = `https://github.com/${process.env.GITHUB_OWNER}/${repoName}/releases/tag/${latestTag}`;
  const prevTagHyperlink =
    latestTag === "" ? `` : `=HYPERLINK("${prevTagURL}", "${latestTag}")`;
  const currentTagHyperlink = `=HYPERLINK("${currentTagURL}", "${newTag}")`;

  let currentDate = new Date();
  let day = currentDate.getDate();
  let month = currentDate.getMonth() + 1;
  let year = currentDate.getFullYear();
  let formattedDate = `${month}/${day}/${year}`;

  const rows = [
    [
      "",
      university,
      `=HYPERLINK("${repoLink}", "${labName}")`,
      `=HYPERLINK("${labLink}", "Hosted")`,
      `GitHub VL`,
      currentTagHyperlink,
      prevTagHyperlink,
      formattedDate,
      formattedDate,
      `=HYPERLINK("${hostingURL}", "Link")`,
      hostingRequester,
      revert ? "Reverted" : "Approved",
    ],
  ];
  await appendIntoSheet(rows, SPREADSHEET_ID, SPREADSHEET_HOSTING_RANGE);
  return res
    .status(StatusCodes.OK)
    .json({ message: "Analytics added successfully" });
};

const latestTag = async (repo, owner, access_token) => {
  const octokit = new Octokit({ auth: access_token });
  const response = await octokit.repos.listTags({
    owner,
    repo,
  });
  const tags = response.data.map((tag) => tag.name);
  const latestTag = tags[0] || "";
  const prevTag = tags[1] || "";
  return [latestTag, prevTag];
};

const getLatestTag = async (req, res) => {
  const { access_token, repoName } = req.query;
  const tag = await latestTag(repoName, process.env.GITHUB_OWNER, access_token);
  return res
    .status(StatusCodes.OK)
    .json({ latestTag: tag[0], prevTag: tag[1], repoName });
};

const getDeployedLabList = async (req, res) => {
  let { readData: data, rawData } = await getDataFromSheet(
    SPREADSHEET_ID,
    SPREADSHEET_HOSTING_RANGE,
    "RAW"
  );

  let rows = data.data.sheets[0].data[0].rowData;

  let newRows = [];

  for (let j = 0; j < rows.length; j++) {
    let values = rows[j].values;
    if (!values) continue;
    let r = [];
    for (let i = 0; i < values.length; i++)
      r.push({ ...getLinkAndName(values[i]), raw: rawData[j][i] });
    newRows.push(r);
  }

  const columns = newRows[0]
    .map((_, i) => ({ key: i, name: newRows[0][i].raw }))
    .filter((col) => col.name !== "");

  newRows = newRows.slice(2);

  let deployedLabs = [];
  let index = 0;
  for (let row of newRows) {
    let lab = { id: index };
    index++;
    for (let col of columns) {
      if (row[col.key])
        lab[col.name] = {
          text: row[col.key].raw,
          link: row[col.key].link || undefined,
        };
      else lab[col.name] = { text: "" };
    }
    deployedLabs.push(lab);
  }

  return res.status(StatusCodes.OK).json({ deployedLabs });
};

const revertTag = async (req, res) => {
  try {
    const { access_token, repoName, tagName } = req.body;
    const octokit = new Octokit({
      auth: access_token,
    });
    const repoOwner = process.env.GITHUB_OWNER;
    const tagToRevert = tagName;
    const branch = await getDefaultGithubBranch(
      repoName,
      repoOwner,
      access_token
    );

    const { data: tagInfo } = await octokit.repos.listTags({
      owner: repoOwner,
      repo: repoName,
    });

    const tag = tagInfo.find((t) => t.name === tagToRevert);

    if (!tag) {
      throw new Error(`Tag '${tagToRevert}' not found.`);
    }

    const commitSHA = tag.commit.sha;

    await octokit.git.updateRef({
      owner: repoOwner,
      repo: repoName,
      ref: "heads/" + branch,
      sha: commitSHA,
      force: true,
    });

    console.log(
      `Repository reverted to commit ${commitSHA} associated with tag ${tagToRevert}.`
    );
    res.status(StatusCodes.OK).json({ message: "success" });
  } catch (error) {
    console.error("Error reverting repository:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLabs,
  getLabDescriptor,
  commitDescriptor,
  addLab,
  deployLab,
  statusLab,
  addAnalytics,
  getLatestTag,
  createTag,
  getDeployedLabList,
  revertTag,
};
