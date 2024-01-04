import React from "react";
import NavImg from "../media/download.png";
import { useDeployLabList } from "../utils/useLabList";

const NavBar = ({ setModal, showDeployTab, setShowDeployTab, userInfo }) => {
  const { deployLabList } = useDeployLabList();

  const getDeployButtonText = () => {
    if (showDeployTab) return "Back to labs";
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

  return (
    <>
      <div className="navbar-no-shadow-container w-nav">
        <div className="navbar-wrapper h-14">
          <img src={NavImg} loading="lazy" width="80" af-el="nav-img" alt="" />
          <div af-el="nav-title" className="text-block">
            Lab Deployment
          </div>
          <div style={{ float: "right", marginLeft: "auto" }}>
            <span
              className="text-lg text-gray-100 hover:text-gray-200 hover:underline cursor-pointer mr-1"
              onClick={() => setShowDeployTab(!showDeployTab)}
            >
              {getDeployButtonText()}
            </span>
            {showDeployTab && (
              <button className="insert-doc-button mr-2">
                Deploy Lab{deployLabList.length > 1 ? "s" : ""}{" "}
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
