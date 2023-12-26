const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const { google } = require("googleapis");
const { SPREADSHEET_ID, SPREADSHEET_RANGE } = require("../secrets/spreadsheet");
const { Octokit } = require("@octokit/rest");
const { Base64 } = require("js-base64");
const { get } = require("../routes/lab");

const getDataFromSheet = async (spreadsheetId, range) => {
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
    return readData;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

const appendIntoSheet = async (row) => {
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
      spreadsheetId: SPREADSHEET_ID,
      range: SPREADSHEET_RANGE,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      resource: resource,
    });
    // console.log(result);
    return result.data.updates.updatedCells;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

const getLinkAndName = (obj) => {
  let link = "";
  let name = "";
  if (obj.userEnteredValue.stringValue) {
    name = obj.userEnteredValue.stringValue.trim();
  } else if (obj.userEnteredValue.formulaValue) {
    name = obj.userEnteredValue.formulaValue.trim();
    name = name.split('"');
    name = name[name.length - 2];
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
    const rows = readData.data.sheets[0].data[0].rowData;
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
  const { link } = req.query;

  if (!link) {
    throw new BadRequestError(`descriptor link missing`);
  }

  const octokit = new Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN,
  });

  const tokens = link.split("/");

  const owner = tokens[3];
  const repo = tokens[4];
  const branch = tokens[6];
  const file = tokens[7];

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
  const descriptorJson = JSON.parse(asciiString);

  return res.status(StatusCodes.OK).json(descriptorJson);
};

const getBlobSHA = async (owner, repo, path, branch) => {
  const octokit = new Octokit();
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
  const { repoName, descriptor } = req.body;

  if (!repoName) {
    throw new BadRequestError(`repository name missing`);
  }

  if (!descriptor) {
    throw new BadRequestError(`descriptor missing`);
  }

  const octokit = new Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN,
  });

  const content = JSON.stringify(descriptor, null, 2);
  const contentEncoded = Base64.encode(content);
  const sha = await getBlobSHA(
    process.env.GITHUB_OWNER,
    repoName,
    "lab-descriptor.json",
    process.env.GITHUB_BRANCH
  );

  await octokit.repos.createOrUpdateFileContents({
    owner: process.env.GITHUB_OWNER,
    repo: repoName,
    path: "lab-descriptor.json",
    message: "Updated lab-descriptor.json programatically",
    content: contentEncoded,
    branch: process.env.GITHUB_BRANCH,
    committer: {
      name: `Octokit Bot`,
      email: "abc@gmail.com",
    },
    sha,
    author: {
      name: "Octokit Bot",
      email: "abc@gmail.com",
    },
  });
  return res.status(StatusCodes.OK).json({ message: "success" });
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

  const f = labList.filter((lab) => lab.repoLink === labURL);
  if (f.length !== 0) {
    throw new BadRequestError(`lab already exists`);
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
  await appendIntoSheet(rows);
  return res.status(StatusCodes.OK).json({ message: "success" });
};

module.exports = {
  getLabs,
  getLabDescriptor,
  commitDescriptor,
  addLab,
};
