import React from "react";
import Main from "./Main";

import { LOGIN_API } from "./utils/config_data";

const Protected = () => {
  if (
    localStorage.getItem("accessToken") === null ||
    localStorage.getItem("accessToken") === "undefined"
  ) {
    window.location.href = LOGIN_API;
    console.log("Redirecting to GitHub Login...", LOGIN_API);

    return <div>Redirecting to GitHub Login...</div>;
  }

  return (
      <Main />
  );
};

export default Protected;
