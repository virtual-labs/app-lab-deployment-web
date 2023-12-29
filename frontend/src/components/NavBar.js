import React from "react";
import NavImg from "../media/download.png";
import { useDeployLabList } from "../utils/useLabList";

const NavBar = ({ setModal, showDeployTab, setShowDeployTab }) => {
  const { deployLabList } = useDeployLabList();

  const getDeployButtonText = () => {
    if (showDeployTab) return "Show Labs";
    return (
      <>
        Deploy Lab{deployLabList.length > 1 ? "s" : ""}
        {deployLabList.length ? (
          <span className="lab-count flex items-center justify-center ml-1">
            {deployLabList.length}
          </span>
        ) : null}
      </>
    );
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
            <button
              className="insert-doc-button mr-2"
              onClick={() => setShowDeployTab(!showDeployTab)}
            >
              {getDeployButtonText()}
            </button>
            <button
              className="insert-doc-button"
              onClick={() => setModal(true)}
            >
              Add Lab
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
