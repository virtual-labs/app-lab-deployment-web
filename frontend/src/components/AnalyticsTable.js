import DataTable from "react-data-table-component";
import React from "react";
import axios from "axios";
import { SEARCH_API } from "../utils/config_data";

const notToBeSorted = [
  "Hosted URL",
  "Current Tag",
  "Previous Tag",
  "Link to Hosting Request",
  "Status 2",
  "Linked on vlab.co.in",
  "Location of Exp Repos",
  "Requester",
  "Status",
  "No.of Experiment",
];

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

function AnalyticsTable() {
  const [pending, setPending] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);

  React.useEffect(() => {
    const get = async () => {
      try {
        const response = await axios.get(SEARCH_API + "/get_deployed_lab_list");
        const { deployedLabs } = response.data;
        console.log(deployedLabs);
        let newColumns = [];
        let newRows = [];
        console.log(deployedLabs[0]);
        for (let key in deployedLabs[0]) {
          if (key === "S.No.") continue;
          newColumns.push({
            name: key,
            selector: (row) => row[key],
            sortable: notToBeSorted.indexOf(key) === -1 ? true : false,
            wrap: true,
            // compact: true,
          });
        }
        for (let lab of deployedLabs) {
          let newRow = {};
          for (let key in lab) {
            if (key === "S.No.") continue;

            newRow[key] = lab[key].text || "";

            newRow[key] = (
              <span
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {lab[key].text || ""}
              </span>
            );

            if (lab[key].link) {
              newRow[key] = (
                <a
                  href={lab[key].link}
                  rel="noreferrer"
                  target="_blank"
                  className="table-link"
                >
                  {lab[key].text}
                </a>
              );
            }
            if (key === "id") {
              newRow[key] = lab[key];
            }
            if (key === "Status") {
              newRow[key] = (
                <span
                  className={`flex flex-row items-center justify-center status ${lab[key].text}`}
                >
                  {lab[key].text}
                </span>
              );
            }
          }
          newRows.push(newRow);
        }
        console.log(newColumns);
        console.log(newRows);
        setColumns(newColumns);

        setRows(newRows.reverse());
      } catch (err) {
        console.log(err);
      } finally {
        setPending(false);
      }
    };
    get();
  }, []);
  return (
    <DataTable
      columns={columns}
      data={rows}
      progressPending={pending}
      customStyles={customStyles}
      pagination
    />
  );
}

export default AnalyticsTable;
