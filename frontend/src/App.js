// App.js or your main component where routes are defined
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Protected />} />
        <Route path="/dashboard/:labname" element={<Protected />} />
        <Route path="/" element={<Default />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
