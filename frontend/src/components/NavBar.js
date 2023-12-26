import React from "react";
import NavImg from "../media/download.png";
import { INSERT_DOC_URL } from "../utils/config_data";

const NavBar = ({ setModal }) => {
  return (
    <>
      <div className="navbar-no-shadow-container w-nav">
        <div className="navbar-wrapper">
          <img src={NavImg} loading="lazy" width="80" af-el="nav-img" alt="" />
          <div af-el="nav-title" className="text-block">
            Lab Deployment
          </div>
          <div style={{ float: "right", marginLeft: "auto" }}>
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
