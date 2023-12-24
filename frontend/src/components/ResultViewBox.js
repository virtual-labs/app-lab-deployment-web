import React, { useEffect } from "react";
import { JsonEditor as Editor } from "jsoneditor-react";
import "jsoneditor-react/es/editor.min.css";
import { useRef } from "react";
import axios from "axios";
import { SEARCH_API } from "../utils/config_data";
import ReactLoading from "react-loading";

const ResultViewBox = ({
  present,
  highlight,
  json,
  setJsonData,
  loading,
  setLoading,
}) => {
  const jsonEditorRef = useRef(null);

  useEffect(() => {
    if (jsonEditorRef.current !== null) {
      jsonEditorRef.current.set(json);
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

    try {
      const url = SEARCH_API + "/commit_descriptor";
      const body = {
        repoName: present.repoName,
        descriptor: jsonEditorRef.current.get(),
      };

      setLoading(true);
      const response = await axios.post(url, body);
      setLoading(false);

      if (response.status >= 200 && response.status < 300) {
        alert("Descriptor file updated successfully");
      } else {
        alert(response.data.msg);
      }
    } catch (error) {
      if (error.response.data.msg) alert(error.response.data.msg);
      else alert(error.message);
      console.error("Error updating JSON file:", error.message);
    }
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

      <div className=" container-header flex flex-row p-2 h-18">
        <div
          className="section-type view-box-link"
          onClick={() => window.open(present.descriptorLink, "_blank")}
        >
          Lab Descriptor
        </div>
        <button
          onClick={handleClick}
          className="px-2 submit-button text-gray-100 text-lg"
        >
          Save
        </button>
      </div>
      <div className="flex-1 flex flex-col p-0 overflow-auto">
        <Editor ref={setRef} value={json} />
      </div>
    </>
  );
};

export default ResultViewBox;
