import React from "react";
import NavImg from "../media/download.png";
import { useDeployLabList } from "../utils/useLabList";
import { useDeployedLabList } from "../utils/useDeployList";

import axios from "axios";

import { SEARCH_API } from "../utils/config_data";

const NavBar = ({ setModal, showDeployTab, setShowDeployTab, userInfo }) => {
  const { deployLabList } = useDeployLabList();
  const { deployedLabList, setDeployedLabList } = useDeployedLabList();
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

  const deployLabs = async () => {
    try {
      if (isDeploying) return;
      console.log("deploying labs");
      setDeployedLabList(
        deployLabList.map((lab) => ({
          ...lab,
          status: "waiting",
          conclusion: null,
        }))
      );
      setDeployLoading(true);
      const responses = await Promise.all(
        deployLabList.map(async (lab) => {
          try {
            const response = await axios.post(SEARCH_API + "/deploy", {
              access_token: localStorage.getItem("accessToken"),
              repoName: lab.repoName,
            });
            let data = response.data;
            return { ...data, ...lab, status: "started", conclusion: null };
          } catch (error) {
            return {
              ...lab,
              status: "failed",
              conclusion: error.message || "failed",
            };
          }
        })
      );
      setDeployedLabList(responses);
      console.log("Data from all requests:", responses);
    } catch (error) {
      console.error(error);
      alert("Error deploying labs");
    } finally {
      setDeployLoading(false);
    }
  };

  deployedLabList.forEach((lab) => {
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
            {!isDeploying && (
              <span
                className="text-lg text-gray-100 hover:text-gray-200 hover:underline cursor-pointer mr-1"
                onClick={() => setShowDeployTab(!showDeployTab)}
              >
                {getDeployButtonText()}
              </span>
            )}
            {showDeployTab && (
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
