// App.js or your main component where routes are defined
import React from "react";
// import { HashRouter as Router, Route, Routes } from "react-router-dom";

import { Routes, Route } from "react-router-dom";
// import Callback from "./Callback";
import Protected from "./Protected";
import Callback from "./Callback";

const Default = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center m-4">Workflow App</h1>
      <button
        className="submit-button w-button w-32 m-4"
        onClick={() => (window.location.href = "/dashboard")}
      >
        Login
      </button>
    </div>
  );
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
