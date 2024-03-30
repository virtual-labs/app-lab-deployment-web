import DataTable from "react-data-table-component";
import React from "react";
import axios from "axios";
import { SEARCH_API } from "../utils/config_data";

const customStyles = {
  headRow: {
    style: {
      border: "none",
      backgroundColor: "#F5F5F5",
    },
  },
  headCells: {
    style: {
      color: "#202124",
      fontSize: "16px",
      whiteSpace: "unset",
      textOverflow: "unset",
    },
  },
  rows: {
    highlightOnHoverStyle: {
      backgroundColor: "rgb(230, 244, 244)",
      borderBottomColor: "#FFFFFF",
      borderRadius: "25px",
      outline: "1px solid #FFFFFF",
      whiteSpace: "unset",
      textOverflow: "unset",
    },
  },
  pagination: {
    style: {
      border: "none",
    },
  },
};

function capitalizeFirstLetter(str) {
  str = str.split("-").join(" ");
  return str.charAt(0).toUpperCase() + str.slice(1);
}

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
        customStyles={customStyles}
        pagination
      />
    </>
  );
}

export default ExperimentTable;
