const axios = require("axios");

async function checkWorkflowStatus(repoOwner, repoName, workflowRunId, token) {
  try {
    const apiURL = `https://api.github.com/repos/${
      repoOwner || "virtual-labs"
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

const getStatus = async (item) => {
  const { status, conclusion } = await checkWorkflowStatus(
    item.repoOwner,
    item.repoName,
    item.workflowRunId,
    "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"
  );
  if (conclusion === null) {
    setTimeout(async () => await getStatus(item), 4000);
  }
};

getStatus({
  repoOwner: "virtual-labs",
  repoName: "lab-dummy-testing-iiith",
  workflowRunId: 7536481490,
});
