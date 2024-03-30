import React, { useEffect } from "react";
import { JsonEditor as Editor } from "jsoneditor-react";
import "jsoneditor-react/es/editor.min.css";
import { useRef } from "react";
import axios from "axios";
import { SEARCH_API } from "../utils/config_data";
import ReactLoading from "react-loading";
import { useState } from "react";
import Ajv from "ajv";
import { useConfig } from "../utils/config_data";

const ResultViewBox = ({ present, json, loading, setLoading }) => {
  const jsonEditorRef = useRef(null);
  const [isValid, setIsValid] = useState(true);
  const [validationErrors, setValidationErrors] = useState([]);

  const ajv = new Ajv();
  const { descriptor } = useConfig();

  useEffect(() => {
    if (jsonEditorRef.current !== null) {
      jsonEditorRef.current.set(json);
      valiadateJSON(json);
    }
  }, [json]);

  const setRef = (instance) => {
    if (instance) {
      jsonEditorRef.current = instance.jsonEditor;
    } else {
      jsonEditorRef.current = null;
    }
  };

  const handleClick = async () => {
    if (!jsonEditorRef.current) {
      alert("JSON editor not loaded");
      return;
    }
    if (!present.repoName) {
      alert("Repository name not found");
      return;
    }

    if (!isValid) {
      const conformMsg = window.confirm(
        `The descriptor file is not valid. Do you want to continue?`
      );
      if (!conformMsg) return;
    }

    try {
      setLoading(true);
      const url = SEARCH_API + "/commit_descriptor";
      const body = {
        repoName: present.repoName,
        descriptor: jsonEditorRef.current.get(),
        access_token: localStorage.getItem("accessToken"),
      };
      console.log(body);
      const response = await axios.post(url, body);
      if (response.status >= 200 && response.status < 300) {
        alert("Descriptor file updated successfully");
      } else {
        alert(
          "Error updating JSON file: " + response.data.msg + ". Try again later"
        );
      }
    } catch (error) {
      if (error.response.data.msg) {
        alert(
          "Error updating JSON file: " +
            error.response.data.msg +
            ". Try again later"
        );
      } else
        alert(
          "Error updating JSON file: " + error.message + ". Try again later"
        );
      console.error("Error updating JSON file:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const valiadateJSON = (data) => {
    const validate = ajv.compile(descriptor);
    const isValidData = validate(data);
    setIsValid(isValidData);
    if (!isValidData) {
      setValidationErrors(validate.errors || []);
      console.log("Validation failed. Errors:");
    } else {
      let targetDiv = document.querySelector(".jsoneditor-readonly");
      targetDiv.classList.remove("error");
      setValidationErrors([]);
    }
  };

  const handleChange = (data) => {
    if (!data) return;
    valiadateJSON(data);
  };

  return (
    <>
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50  h-full z-50 items-center justify-center">
          <ReactLoading
            type="bars"
            color="#28bfa4"
            width={100}
            className="m-auto"
          />
        </div>
      )}

      <div className=" container-header flex flex-row p-2 h-18 border-l-2 border-gray-200">
        <div
          className="section-type view-box-link"
          onClick={() => window.open(present.descriptorLink, "_blank")}
        >
          Lab Descriptor
        </div>
        <button
          id="valid-label"
          className={`px-2 ${
            isValid ? "bg-green-600" : "bg-red-600"
          } text-gray-100 text-base mr-2 rounded-full	 `}
          onClick={() => {
            if (!isValid) {
              alert(
                "The descriptor file is not valid. Please fix the errors and try again\n " +
                  JSON.stringify(validationErrors, null, 2)
              );
            }
          }}
        >
          {isValid ? "Valid Descriptor" : "Invalid Decsriptor"}
        </button>
        <button
          onClick={handleClick}
          className="px-2 submit-button text-gray-100 text-lg"
        >
          Save
        </button>
      </div>
      <div className="flex-1 flex flex-col p-0 overflow-auto border-l-2 border-gray-200">
        <Editor ref={setRef} value={json} onChange={handleChange} />
      </div>
    </>
  );
};

export default ResultViewBox;
