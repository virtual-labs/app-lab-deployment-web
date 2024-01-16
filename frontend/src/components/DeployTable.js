import React from "react";
import "../css/index.css";
import "../css/App.css";
import { useDeployLabList } from "../utils/useLabList";
import { useDeployedLabList } from "../utils/useDeployList";
import axios from "axios";
import { SEARCH_API } from "../utils/config_data";
import ReactLoading from "react-loading";
import Tick from "../media/accept.png";
import Failed from "../media/remove.png";
import Start from "../media/play.png";

const DeployTable = ({ data }) => {
  const { deployLabList, setDeployLabList } = useDeployLabList();
  const { deployedLabList, setDeployedLabList } = useDeployedLabList();

  const remove = (repoName) => {
    setDeployLabList(deployLabList.filter((lab) => lab.repoName !== repoName));
  };

  const getDeploymentStatus = (repoName) => {
    const lab = deployedLabList?.find((lab) => lab.repoName === repoName);
    if (lab) {
      if (lab.status === "started") {
        getStatus(lab);
      }
      return { status: lab.status, conclusion: lab.conclusion };
    }
    return { status: "-", conclusion: null };
  };

  const getStatus = async (item) => {
    const response = await axios.post(SEARCH_API + "/status", {
      repoName: item.repoName,
      workflowRunId: item.workflowRunId,
      access_token: localStorage.getItem("accessToken"),
    });
    const { status, conclusion } = response.data;
    setDeployedLabList((prev) =>
      prev.map((lab) => {
        if (lab.repoName === item.repoName) {
          return { ...lab, status, conclusion };
        }
        return lab;
      })
    );
    if (conclusion === null) {
      setTimeout(async () => await getStatus(item), 5000);
    }
  };

  const format = (str) => {
    if (str === null) return "";

    function capitalizeFirstLetter(str) {
      str = str.split("_").join(" ");
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    if (str === "queued" || str === "in_progress" || str === "waiting")
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

    if (str === "success" || str === "completed") {
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

    if (str === "failed") {
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
            <th className="py-2 px-4 border-r">Lab Link</th>
            <th className="py-2 px-4 border-r">Repo</th>
            <th className="py-2 px-4 border-r">Descriptor URL</th>
            <th className="py-2 px-4 border-r">Status</th>
            <th className="py-2 px-4 border-r">Conclusion</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const { status, conclusion } = getDeploymentStatus(item.repoName);
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
                  {format(status)}
                </td>
                <td className="py-2 px-4 border-r">{format(conclusion)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DeployTable;
