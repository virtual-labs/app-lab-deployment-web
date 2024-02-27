import React from "react";
import "../css/index.css";
import "../css/App.css";
import { useDeployLabList } from "../utils/useLabList";
import ReactLoading from "react-loading";
import Tick from "../media/accept.png";
import Failed from "../media/remove.png";
import Start from "../media/play.png";

const DeployTable = ({ data }) => {
  const { deployLabList, setDeployLabList } = useDeployLabList();

  let isDeploying = false;

  const waitingList = [
    "started",
    "queued",
    "in_progress",
    "waiting",
    "adding_tag",
    "adding_analytics",
    "reverting",
  ];

  deployLabList.forEach((lab) => {
    isDeploying = isDeploying || waitingList.includes(lab.status);
  });

  const remove = (repoName) => {
    if (isDeploying) return;
    setDeployLabList(deployLabList.filter((lab) => lab.repoName !== repoName));
  };

  const format = (str) => {
    if (str === null) return "";

    function capitalizeFirstLetter(str) {
      str = str.split("_").join(" ");
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const waiting = [
      "queued",
      "in_progress",
      "waiting",
      "adding_tag",
      "adding_analytics",
      "reverting",
    ];

    if (waiting.includes(str))
      return (
        <span className="flex flex-row items-center justify-center">
          <ReactLoading
            type="spin"
            color="#28bfa4"
            width={30}
            height={30}
            className="flex p-1"
          ></ReactLoading>
          <span className="flex-1">{capitalizeFirstLetter(str)}</span>
        </span>
      );

    if (str === "success" || str === "completed" || str === "done") {
      return (
        <span className="flex flex-row items-center justify-center">
          <img src={Tick} alt="tick" className="w-6 h-6" />
          <span className="flex-1 p-1">{capitalizeFirstLetter(str)}</span>
        </span>
      );
    }

    if (str === "started") {
      return (
        <span className="flex flex-row items-center justify-center">
          <img src={Start} alt="tick" className="w-6 h-6" />
          <span className="flex-1 p-1">{capitalizeFirstLetter(str)}</span>
        </span>
      );
    }

    if (str.includes("fail")) {
      return (
        <span className="flex flex-row items-center justify-center">
          <img src={Failed} alt="tick" className="w-6 h-6" />
          <span className="flex-1 p-1">{capitalizeFirstLetter(str)}</span>
        </span>
      );
    }

    str = capitalizeFirstLetter(str);
    return str;
  };

  const getNextTag = (latestTag) => {
    if (latestTag === "") return "1.0.0";
    latestTag = latestTag.slice(1);
    const [major, minor, patch] = latestTag.split(".");
    return `${major}.${minor}.${parseInt(patch) + 1}`;
  };

  const handleRevert = (checked, item) => {
    if (isDeploying) return;
    if (checked) {
      setDeployLabList(
        deployLabList.map((lab) => {
          if (lab.repoName === item.repoName) {
            lab.revert = true;
          }
          return lab;
        })
      );
    } else {
      setDeployLabList(
        deployLabList.map((lab) => {
          if (lab.repoName === item.repoName) {
            lab.revert = false;
          }
          return lab;
        })
      );
    }
  };

  const changeWorkflow = (workflow, item) => {
    if (isDeploying) return;
    setDeployLabList(
      deployLabList.map((lab) => {
        if (lab.repoName === item.repoName) {
          lab.selectedWorkflow = workflow;
        }
        return lab;
      })
    );
  };
  console.log(deployLabList);
  return (
    <div className="w-full h-full overflow-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-r">
              {deployLabList.length > 1 && (
                <button
                  className="bg-red-400 text-white px-2 py-1 hover:bg-red-600 active:bg-red-700 rounded"
                  onClick={() => setDeployLabList([])}
                >
                  X
                </button>
              )}
            </th>
            <th className="py-2 px-4 border-r">University</th>
            <th className="py-2 px-4 border-r">Lab Name</th>
            <th className="py-2 px-4 border-r">Discipline</th>
            <th className="py-2 px-4 border-r">Phase</th>
            <th className="py-2 px-4 border-r">Lab Link</th>
            <th className="py-2 px-4 border-r">Repo</th>
            <th className="py-2 px-4 border-r">Descriptor URL</th>
            <th className="py-2 px-4 border-r">Exp. count</th>
            <th className="py-2 px-4 border-r">Existing tag</th>
            <th className="py-2 px-4 border-r">New tag</th>
            <th className="py-2 px-4 border-r">Revert to Previous</th>
            <th className="py-2 px-4 border-r">Hosting URL</th>
            <th className="py-2 px-4 border-r">Requester</th>
            <th className="py-2 px-4 border-r">Hosting Request Date</th>
            <th className="py-2 px-4 border-r">Workflow</th>
            <th className="py-2 px-4 border-r">Status</th>
            <th className="py-2 px-4 border-r">Conclusion</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const newTag = getNextTag(item.latestTag);
            return (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-r">
                  <button
                    className="bg-red-400 text-white px-2 py-1 hover:bg-red-600 active:bg-red-700 rounded"
                    onClick={() => remove(item.repoName)}
                  >
                    X
                  </button>
                </td>
                <td className="py-2 px-4 border-r">{item.university}</td>
                <td className="py-2 px-4 border-r">{item.labName}</td>
                <td className="py-2 px-4 border-r">{item.discipline}</td>
                <td className="py-2 px-4 border-r">{item.phase}</td>
                <td className="py-2 px-4 border-r">
                  <a
                    href={`${item.labLink}`}
                    target="_blank"
                    className="table-link"
                    rel="noopener noreferrer"
                  >
                    {item.labLink}
                  </a>
                </td>
                <td className="py-2 px-4 border-r">
                  <a
                    href={item.repoLink}
                    target="_blank"
                    className="table-link"
                    rel="noopener noreferrer"
                  >
                    {item.repoName}
                  </a>
                </td>
                <td className="py-2 px-4 border-r">
                  <a
                    href={item.descriptorLink}
                    target="_blank"
                    className="table-link"
                    rel="noopener noreferrer"
                  >
                    {"Link"}
                  </a>
                </td>
                <td className="py-2 px-4 border-r h-16 items-center justify-center">
                  {
                    <a
                      href={`/dashboard/${item.repoName}`}
                      target="_blank"
                      className="table-link"
                      rel="noopener noreferrer"
                    >
                      {item.experimentCount}
                    </a>
                  }
                </td>
                <td className="py-2 px-4 border-r h-16 items-center justify-center">
                  {item.latestTag}
                </td>
                <td className="py-2 px-4 border-r h-16 items-center justify-center">
                  {"v" + newTag}
                </td>
                <td className="py-2 px-4 border-r h-16 items-center justify-center">
                  {item.prevTag ? (
                    <>
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={item.revert}
                        disabled={isDeploying}
                        onChange={(e) => handleRevert(e.target.checked, item)}
                      />
                      <span className="ml-1">{item.prevTag}</span>
                    </>
                  ) : null}
                </td>
                <td className="py-2 px-4 border-r">
                  <a
                    href={item.hostingURL}
                    target="_blank"
                    className="table-link"
                    rel="noopener noreferrer"
                  >
                    {"Link"}
                  </a>
                </td>
                <td className="py-2 px-4 border-r">{item.hostingRequester}</td>
                <td className="py-2 px-4 border-r h-16 items-center justify-center">
                  {item.hostingRequestDate}
                </td>
                <td className="py-2 px-4 border-r">
                  <select
                    onChange={(e) => {
                      changeWorkflow(e.target.value, item);
                    }}
                    className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg  p-2.5"
                    disabled={isDeploying}
                  >
                    {item.workflows.map((workflow, index) => {
                      return (
                        <option
                          value={workflow}
                          key={index}
                          selected={item.selectedWorkflow === workflow}
                        >
                          {workflow}
                        </option>
                      );
                    })}
                  </select>
                </td>
                <td className="py-2 px-4 border-r h-16 items-center justify-center">
                  {format(item.status)}
                </td>
                <td className="py-2 px-4 border-r">
                  {format(item.conclusion)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DeployTable;
