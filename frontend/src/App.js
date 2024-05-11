// App.js or your main component where routes are defined
import React from "react";
import { Routes, Route } from "react-router-dom";
import Protected from "./Protected";
import Callback from "./Callback";
import Landing from "./Landing";

const Default = () => {
  if (
    localStorage.getItem("accessToken") !== null &&
    localStorage.getItem("accessToken") !== "undefined"
  ) {
    window.location.href = "/dashboard";
    return <div>Redirecting to Dashboard...</div>;
  }
  return <Landing />;
};

const Test = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center m-4">Workflow App</h1>
      tesing
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Default />} />
      <Route path="/dashboard" element={<Protected />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/test" element={<Test />} />
      <Route path="/dashboard/:labname" element={<Protected />} />
    </Routes>
  );
};

export default App;
