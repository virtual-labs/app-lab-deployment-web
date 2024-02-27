import React from "react";
import { useDeployLabList } from "../../utils/useLabList";
import axios from "axios";
import { SEARCH_API, validateDate, validateURL } from "../../utils/config_data";
import ReactLoading from "react-loading";

const ResultBox = ({ result, setPresent, present, inList }) => {
  const { deployLabList, setDeployLabList } = useDeployLabList();

  const [loading, setLoading] = React.useState(false);

  const addToList = async (lab) => {
    try {
      if (loading) return;
      setLoading(true);
      let response = await axios.get(
        SEARCH_API +
          "/get_latest_tag?access_token=" +
          localStorage.getItem("accessToken") +
          "&repoName=" +
          lab.repoName
      );
      const { latestTag, prevTag } = response.data;
      response = await axios.get(
        SEARCH_API +
          "/get_deployed_labs?access_token=" +
          localStorage.getItem("accessToken") +
          "&repoName=" +
          lab.repoName
      );
      const { len, phase } = response.data;

      let response2 = await axios.get(
        SEARCH_API +
          "/get_workflow_list?access_token=" +
          localStorage.getItem("accessToken") +
          "&repoName=" +
          lab.repoName
      );

      const { workflows } = response2.data;

      if (workflows.length === 0) {
        alert("No workflows found for the lab with your credentials");
        setLoading(false);
        return;
      }

      let hostingURL = prompt("Enter hosting request URL:");
      if (validateURL(hostingURL)) {
        alert("Please enter a valid URL");
        setLoading(false);
        return;
      }
      let hostingRequester = prompt("Enter hosting requester:");
      if (!hostingRequester) {
        alert("Please enter a valid hosting requester");
        setLoading(false);
        return;
      }

      let hostingRequestDate = prompt(
        "Enter hosting request date (mm/dd/yyyy):"
      );

      const errorMessage = validateDate(hostingRequestDate);

      if (errorMessage) {
        alert(errorMessage);
        setLoading(false);
        return;
      } else {
        console.log("Date is valid!");
      }

      let newLab = {
        ...lab,
        latestTag,
        hostingURL,
        prevTag,
        hostingRequester,
        status: "-",
        conclusion: null,
        hostingRequestDate,
        experimentCount: len,
        phase,
        workflows,
        selectedWorkflow: workflows[0],
      };
      setDeployLabList([...deployLabList, newLab]);
    } catch (err) {
      alert(
        "Error adding lab to deploy list: Not able to fetch latest tag or workflow list"
      );
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

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
          <button
            className="add-deploy-button flex flex-row"
            onClick={handleClick}
          >
            Add to deploy
            {loading && (
              <ReactLoading
                className="flex ml-1"
                type="bars"
                color="#28bfa4"
                height={20}
                width={20}
              />
            )}
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
