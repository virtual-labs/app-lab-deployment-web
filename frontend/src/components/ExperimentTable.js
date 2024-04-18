import DataTable from "react-data-table-component";
import React from "react";
import axios from "axios";
import {
  SEARCH_API,
  tableStyle,
  capitalizeFirstLetter,
} from "../utils/config_data";

function ExperimentTable({ labName }) {
  const [pending, setPending] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const [title, setTitle] = React.useState("Deployed Experiments");

  React.useEffect(() => {
    const get = async () => {
      try {
        const response = await axios.get(
          SEARCH_API +
            "/get_deployed_labs?access_token=" +
            localStorage.getItem("accessToken") +
            "&repoName=" +
            labName
        );
        console.log(response.data);
        const { experimentList, labName: labname } = response.data;
        let newColumns = [];
        for (let key in experimentList[0]) {
          newColumns.push({
            name: capitalizeFirstLetter(key),
            selector: (row) => row[key],
            sortable: true,
            wrap: true,
          });
        }
        setColumns(newColumns);

        setRows(
          experimentList.map((exp, index) => ({
            ...exp,
            deploy: exp.deploy.toString(),
            repo: (
              <a
                href={exp.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="table-link"
              >
                {exp.repo}
              </a>
            ),
          }))
        );
        setTitle(labname);
      } catch (err) {
        console.log(err);
      } finally {
        setPending(false);
      }
    };
    get();
  }, []);
  return (
    <>
      <span className="text-xl p-2">{title}</span>
      <DataTable
        columns={columns}
        data={rows}
        progressPending={pending}
        customStyles={tableStyle}
        pagination
      />
    </>
  );
}

export default ExperimentTable;
