import React from "react";
import NavImg from "../media/download.png";
import { useDeployLabList } from "../utils/useLabList";

import axios from "axios";

import { SEARCH_API } from "../utils/config_data";

const NavBar = ({
  setModal,
  showDeployTab,
  setShowDeployTab,
  userInfo,
  viewAnalytics,
  setViewAnalytics,
  viewExpInfo,
}) => {
  const { deployLabList, setDeployLabList } = useDeployLabList();
  const [deployLoading, setDeployLoading] = React.useState(false);
  let isDeploying = false || deployLoading;

  const getDeployButtonText = () => {
    if (showDeployTab) return "Back to Dashboard";
    return (
      <>
        Go to deploy
        {` (${deployLabList.length})`}
      </>
    );
  };

  const getUser = () => {
    const name = userInfo?.login;
    if (name) return name;
    return "";
  };

  const getNextTag = (latestTag) => {
    if (latestTag === "") return "1.0.0";
    latestTag = latestTag.slice(1);
    const [major, minor, patch] = latestTag.split(".");
    return `${major}.${minor}.${parseInt(patch) + 1}`;
  };

  const updateDeployList = async (repoName, obj) => {
    setDeployLabList((prev) =>
      prev.map((lab) => {
        if (lab.repoName === repoName) {
          return { ...lab, ...obj };
        }
        return lab;
      })
    );
  };

  const getStatus = async (item) => {
    const response = await axios.post(SEARCH_API + "/status", {
      repoName: item.repoName,
      workflowRunId: item.workflowRunId,
      access_token: localStorage.getItem("accessToken"),
    });
    const { status, conclusion } = response.data;
    updateDeployList(item.repoName, { status, conclusion });

    if (conclusion === null) {
      setTimeout(async () => await getStatus(item), 5000);
    } else if (conclusion === "success") {
      try {
        let newTag = "v" + getNextTag(item.latestTag);
        let resp;
        if (!item.revert) {
          updateDeployList(item.repoName, { status: "adding_tag" });
          let resp = await axios.post(SEARCH_API + "/create_tag", {
            repo: item.repoName,
            tagName: newTag,
            access_token: localStorage.getItem("accessToken"),
          });
          if (resp.status !== 200) {
            throw new Error("Error creating tag");
          }
          updateDeployList(item.repoName, { status: "adding_analytics" });
          resp = await axios.post(SEARCH_API + "/add_analytics", item);
          if (resp.status !== 200) {
            throw new Error("Error adding analytics");
          }
          updateDeployList(item.repoName, {
            status: "done",
            latestTag: newTag,
          });
        } else {
          updateDeployList(item.repoName, { status: "adding_analytics" });
          resp = await axios.post(SEARCH_API + "/add_analytics", item);
          if (resp.status !== 200) {
            throw new Error("Error adding analytics");
          }
          updateDeployList(item.repoName, { status: "done" });
        }
      } catch (err) {
        console.log(err);
        setDeployLabList((prev) =>
          prev.map((lab) => {
            if (lab.repoName === item.repoName) {
              return { ...lab, status: "failed", conclusion: "failed" };
            }
            return lab;
          })
        );
      }
    }
  };

  const deployLab = async (lab) => {
    const response = await axios.post(SEARCH_API + "/deploy", {
      access_token: localStorage.getItem("accessToken"),
      repoName: lab.repoName,
    });
    let data = response.data;
    return data;
  };

  const deployLabs = async () => {
    try {
      if (isDeploying) return;

      console.log("deploying labs", deployLabList);
      // return;
      console.log("deploying labs");
      setDeployLabList(
        deployLabList.map((lab) => ({
          ...lab,
          status: "waiting",
        }))
      );
      setDeployLoading(true);
      const responses = await Promise.all(
        deployLabList.map(async (lab) => {
          try {
            if (lab.revert) {
              updateDeployList(lab.repoName, { status: "reverting" });
              await axios.post(SEARCH_API + "/revert_tag", {
                access_token: localStorage.getItem("accessToken"),
                repoName: lab.repoName,
                tagName: lab.prevTag,
              });
              const data = await deployLab(lab);
              return { ...lab, ...data, status: "started", conclusion: null };
            } else {
              const data = await deployLab(lab);
              return { ...lab, ...data, status: "started", conclusion: null };
            }
          } catch (error) {
            return {
              ...lab,
              status: "failed",
              conclusion: error.message || "failed",
            };
          }
        })
      );
      setDeployLabList(responses);
      responses.forEach((lab) => {
        if (lab.status === "started") {
          setTimeout(() => getStatus(lab), 1000);
        }
      });
      console.log("Data from all requests:", responses);
    } catch (error) {
      console.error(error);
      alert("Error deploying labs");
    } finally {
      setDeployLoading(false);
    }
  };

  deployLabList.forEach((lab) => {
    isDeploying =
      isDeploying ||
      lab.status === "started" ||
      lab.status === "queued" ||
      lab.status === "in_progress" ||
      lab.status === "waiting";
  });

  return (
    <>
      <div className="navbar-no-shadow-container w-nav">
        <div className="navbar-wrapper h-14">
          <img src={NavImg} loading="lazy" width="80" af-el="nav-img" alt="" />
          <div af-el="nav-title" className="text-block">
            Lab Deployment
          </div>
          <div style={{ float: "right", marginLeft: "auto" }}>
            {!isDeploying && !viewAnalytics && !viewExpInfo && (
              <span
                className="text-lg text-gray-100 hover:text-gray-200 hover:underline cursor-pointer mr-1"
                onClick={() => setShowDeployTab(!showDeployTab)}
              >
                {getDeployButtonText()}
              </span>
            )}
            {showDeployTab && !viewAnalytics && !viewExpInfo && (
              <button className="insert-doc-button mr-2" onClick={deployLabs}>
                {isDeploying ? "Deploying " : "Deploy "}Lab
                {deployLabList.length > 1 ? "s" : ""}{" "}
                {`(${deployLabList.length})`}
              </button>
            )}
            <button
              className="insert-doc-button mr-2"
              onClick={() => setModal(true)}
            >
              Add Lab
            </button>

            {!viewExpInfo && (
              <button
                className={`${
                  viewAnalytics ? "active" : ""
                } insert-doc-button mr-2`}
                onClick={() => {
                  if (isDeploying) return;
                  setViewAnalytics(!viewAnalytics);
                }}
              >
                Hosting Info
              </button>
            )}
            <button
              className="logout-button"
              onClick={() => {
                localStorage.removeItem("accessToken");
                window.location.href = "/";
              }}
            >
              {`Logout (${getUser()})`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
