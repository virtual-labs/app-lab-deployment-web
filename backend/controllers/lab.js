const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const { google } = require("googleapis");
const { SPREADSHEET_ID, SPREADSHEET_RANGE } = require("../secrets/spreadsheet");
const { Octokit } = require("@octokit/rest");
const { Base64 } = require("js-base64");

const getDataFromSheet = async (spreadsheetId, range) => {
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
};

const getLabList = async () => {
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
      let labName = values[2].userEnteredValue.stringValue.trim();
      let labLink = values[2].hyperlink || "#";
      let discipline = values[3].userEnteredValue.stringValue.trim();
      let repoName = values[4].hyperlink.split("/").pop();
      let repoLink = values[4].hyperlink || "#";
      let descriptorLink = values[5].hyperlink || "#";
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
  filteredLabs.push({
    university: "TEMP",
    labName: "Test Lab",
    labLink: "http://mrmsmtbs-iitk.vlabs.ac.in/",
    discipline: "Mechanical Engineering",
    repoLink: "https://github.com/chir263/lab-mrmsmtbs-iitk-cj",
    repoName: "lab-mrmsmtbs-iitk-cj",
    descriptorLink:
      "https://github.com/chir263/lab-mrmsmtbs-iitk-cj/blob/master/lab-descriptor.json",
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

module.exports = {
  getLabs,
  getLabDescriptor,
  commitDescriptor,
};
