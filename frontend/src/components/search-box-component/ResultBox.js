import React from "react";

const ResultBox = ({ result, setPresent, addToList, present, inList }) => {
  const handleClick = (event) => {
    event.stopPropagation();
    addToList(result);
  };
  return (
    <div
      className={`result-box ${
        present?.repoName === result?.repoName ? "selected" : ""
      } `}
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
        {inList ? (
          <span className="italic tex-base text-gray-500 flex items-center">
            {"Added to deploy"}
          </span>
        ) : (
          <button className="add-deploy-button" onClick={handleClick}>
            Add to deploy
          </button>
        )}

        <h3 className="heading flex-1">{}</h3>
        <div className="flex flex-row result-box-tag-container">
          <div className={`file-type ${result.src}`}>{result.discipline}</div>
          <div className={`file-type uni`}>{result.university}</div>
        </div>
      </div>
    </div>
  );
};

export default ResultBox;
