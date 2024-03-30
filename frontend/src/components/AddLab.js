import React from "react";
import { useState } from "react";
import { SEARCH_API } from "../utils/config_data";
import ReactLoading from "react-loading";
import axios from "axios";

const AddLab = ({ setModal }) => {
  const [lab_url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [lab, setLab] = useState({});

  const loadLab = async (e) => {
    e.preventDefault();
    if (lab_url.trim() === "") {
      return;
    }
    if (loading || addLoading) return;
    const labURL = lab_url.slice();
    const repoName = labURL.split("/").slice(-1)[0];
    const url =
      SEARCH_API +
      "/get_descriptor?reponame=" +
      repoName +
      "&access_token=" +
      localStorage.getItem("accessToken") +
      "&want_descriptor_url=1";
    async function fetchData() {
      const config = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Connection: "keep-alive",
        },
      };
      setLoading(true);
      let response = await fetch(url, config);
      if (!response.ok) {
        response = await response.json();
        alert("Error fetching descriptor file : " + response.msg);
        setLoading(false);
        return;
      }
      response = await response.json();
      const labObject = {
        university: response.collegeName,
        labName: response.lab,
        labLink: response.baseUrl,
        discipline: response.broadArea.name,
        labURL,
        descriptorURL: response.descriptorURL,
      };
      setLab(labObject);
      console.log(labObject);
      setLoading(false);
    }
    fetchData();
  };

  const addLab = async (e) => {
    try {
      setAddLoading(true);
      const url = SEARCH_API + "/add_lab";
      const body = lab;
      const response = await axios.post(url, body);
      if (response.status >= 200 && response.status < 300) {
        alert(response.data.message);
      } else {
        alert("Error adding Lab: " + response.data.msg + ". Try again later");
        console.log("Error updating JSON file:", response.data.msg);
      }
    } catch (error) {
      if (error.response.data.msg) {
        alert(
          "Error adding Lab: " + error.response.data.msg + ". Try again later"
        );
        console.log("Error updating JSON file:", error.response.data.msg);
      } else alert("Error adding Lab: " + error.message + ". Try again later");
      console.log("Error updating JSON file:", error.message);
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 h-full z-50 flex items-center justify-center">
      <div className="flex flex-col bg-gray-200 h-auto w-3/5 add-lab-container p-2">
        <div className="flex flex-row">
          <h2 className="flex-1 text-2xl text-gray-600 mt-0">Add Lab</h2>
          <span
            className="text-2xl cursor-pointer hover:text-red-600 active:text-red-800"
            onClick={() => setModal(false)}
          >
            &times;
          </span>
        </div>
        <form className="flex flex-row mb-4" onSubmit={loadLab}>
          <input
            type="text"
            id="url"
            name="url"
            className="search-query w-input"
            placeholder="Enter lab URL"
            value={lab_url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button type="submit" className="submit-button w-button w-32">
            Load
          </button>
        </form>
        <div className="flex flex-row">
          {loading ? (
            <div className="flex items-center justify-center w-full">
              <ReactLoading
                type="bars"
                color="#28bfa4"
                width={50}
                className="flex"
              ></ReactLoading>
            </div>
          ) : (
            <div className="flex flex-col  w-full">
              {lab.labName ? (
                <>
                  <LabInformationTable labInfo={lab} />
                  <div className="flex flex-row">
                    <div className="flex-1 items-center justify-center"></div>
                    {addLoading && (
                      <ReactLoading
                        type="spin"
                        color="#28bfa4"
                        width={40}
                        height={40}
                        className="flex p-1 mt-2"
                      ></ReactLoading>
                    )}
                    <button
                      type="submit"
                      className="submit-button w-button w-32 mt-2"
                      onClick={addLab}
                    >
                      Add
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LabInformationTable = ({ labInfo }) => {
  return (
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr className="table-tr text-white">
          <th className="py-2 px-4 border-b">Attribute</th>
          <th className="py-2 px-4 border-b">Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(labInfo).map(([key, value], index) => (
          <tr
            key={key}
            className={
              index % 2 === 0
                ? "bg-gray-100 hover:bg-gray-200"
                : "hover:bg-gray-200"
            }
          >
            <td className="py-2 px-4 border-b font-semibold">{key}</td>
            <td className="py-2 px-4 border-b">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AddLab;
