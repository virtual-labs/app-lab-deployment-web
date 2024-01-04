import React from "react";
import Main from "./Main";

const Protected = () => {
  if (
    localStorage.getItem("accessToken") === null ||
    localStorage.getItem("accessToken") === "undefined"
  ) {
    window.location.href = "http://localhost:5005/auth/github";
    return <div>Redirecting to GitHub Login...</div>;
  }

  return <Main />;
};

export default Protected;
