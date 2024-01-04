const { Octokit } = require("@octokit/rest");
const { StatusCodes } = require("http-status-codes");

const getUser = async (req, res) => {
  const { access_token } = req.query;
  {
    if (!access_token) {
      throw new BadRequestError(`access_token missing`);
    }
  }

  const accessToken = access_token;

  //   console.log("accessToken:", accessToken);

  const octokit = new Octokit({
    auth: accessToken,
  });

  async function getUserInfo() {
    try {
      const { data } = await octokit.users.getAuthenticated();
      return data;
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  }

  const info = await getUserInfo();

  return res.status(StatusCodes.OK).json({ info });
};

module.exports = {
  getUser,
};
