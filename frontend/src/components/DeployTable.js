import React from "react";
import "../css/index.css";
import "../css/App.css";
import { useDeployLabList } from "../utils/useLabList";

const DeployTable = ({ data }) => {
  const { deployLabList, setDeployLabList } = useDeployLabList();
  const remove = (repoName) => {
    setDeployLabList(deployLabList.filter((lab) => lab.repoName !== repoName));
  };

  return (
    <div className="w-full h-4/5 overflow-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-r"></th>
            <th className="py-2 px-4 border-r">University</th>
            <th className="py-2 px-4 border-r">Lab Name</th>
            <th className="py-2 px-4 border-r">Discipline</th>
            <th className="py-2 px-4 border-r">Lab Link</th>
            <th className="py-2 px-4 border-r">Repo</th>
            <th className="py-2 px-4 border-r">Descriptor URL</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeployTable;
