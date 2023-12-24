import React from "react";
import { getResultText } from "../../utils/utils";
import HighlightedText from "../HighlightedText";

const ResultBox = ({ result, setPresent, searchQuery, highlight, present }) => {
  return (
    <div
      className={`result-box ${
        present?.repoName === result?.repoName ? "selected" : ""
      }`}
      onClick={() => {
        setPresent(result);
      }}
    >
      <div className="result-heading flex flex-row">
        <h3 className="heading flex-1">{result.labName}</h3>
      </div>
      <div className="result-page-title">{result.repoName}</div>
      <div className="result-page-url">{result.labLink}</div>
      <p className="paragraph"></p>
      <div className="result-heading flex flex-row">
        <h3 className="heading flex-1">{}</h3>
        <div className="flex flex-row result-box-tag-container">
          <div className={`file-type ${result.src}`}>{result.discipline}</div>
          <div className={`file-type uni`}>{result.university}</div>
          {/* <div
            className={
              result.accessibility === "public"
                ? "accessibility-2 public"
                : "accessibility-2 private"
            }
          >
            {result.accessibility}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ResultBox;
