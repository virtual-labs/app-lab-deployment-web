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
  const [originalRows, setOriginalRows] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const [filterList, setFilterList] = React.useState([]);
  const ref = React.useRef();

  React.useEffect(() => {
    const get = async () => {
      try {
        const response = await axios.get(SEARCH_API + "/get_deployed_lab_list");
        let { deployedLabs } = response.data;
        // console.log(deployedLabs);
        deployedLabs = deployedLabs.map((lab, index) => {
          const num = lab["No.of Experiment"];
          const lab_url = lab["Lab Name"].link;
          if (lab_url && lab_url.includes("https://github.com/virtual-labs/")) {
            lab["No.of Experiment"] = {
              ...num,
              link: `/dashboard/${lab_url.replace(
                "https://github.com/virtual-labs/",
                ""
              )}`,
            };
          }

          return lab;
        });
        let newColumns = [];

        for (let key in deployedLabs[0]) {
          if (key === "S.No.") continue;
          newColumns.push({
            name: key,
            selector: (row) => row[key],
            sortable: notToBeSorted.indexOf(key) === -1 ? true : false,
            wrap: true,
          });
        }
        setColumns(newColumns);
        setRows(deployedLabs.reverse());
        setOriginalRows(deployedLabs);
      } catch (err) {
        console.log(err);
      } finally {
        setPending(false);
      }
    };
    get();
  }, []);

  let newRows = [];
  for (let lab of rows) {
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

  const setNewRows = (newFilterList) => {
    let date = document.querySelector("select[name=date]").value;
    let refList = originalRows.filter((row) => {
      let date1 = new Date(row["Hosting Date"].text);
      let date2 = new Date();
      if (date === "today") {
        date2.setDate(date2.getDate() - 1);
      } else if (date === "last-week") {
        date2.setDate(date2.getDate() - 7);
      } else if (date === "last-month") {
        date2.setMonth(date2.getMonth() - 1);
      } else return true;
      return date1 > date2;
    });

    if (newFilterList.length === 0) {
      setRows(refList);
      return;
    }
    let newRows = refList.filter((row) => {
      let retVal = false;
      for (let filter of newFilterList) {
        if (
          row[filter.key].text &&
          row[filter.key].text
            .toLowerCase()
            .includes(filter.value.toLowerCase())
        ) {
          retVal = true;
          break;
        }
      }
      return retVal;
    });
    setRows(newRows);
  };

  const applyFilter = (e) => {
    e.preventDefault();
    const filterValue = ref.current.value.trim();
    const filterKey = document.querySelector("select[name=filter]").value;
    if (filterValue === "") {
      return;
    }
    let newFilterList = [...filterList, { key: filterKey, value: filterValue }];
    setFilterList(newFilterList);
    setNewRows(newFilterList);
  };

  const dateFilter = (e) => {
    setNewRows(filterList);
  };
  return (
    <>
      <DataTable
        columns={columns}
        data={newRows}
        progressPending={pending}
        customStyles={customStyles}
        pagination
      />
      <div className="flex flex-col p-2">
        <div className="flex flex-row">
          <form className="flex " onSubmit={applyFilter}>
            <label className="flex text-lg items-center">Add filters</label>
            <select
              className="form-input"
              style={{ marginLeft: "10px" }}
              name="filter"
            >
              {columns.map((column, index) => {
                return (
                  <option key={index} value={column.name}>
                    {column.name}
                  </option>
                );
              })}
            </select>
            <input
              type="text"
              className="bg-gray-100 p-2 rounded-md border-none w-48"
              placeholder="Filter value"
              style={{ marginLeft: "10px" }}
              ref={ref}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md ml-2 hover:bg-blue-600"
            >
              Apply
            </button>
          </form>
          <select
            className="form-input"
            style={{ marginLeft: "10px" }}
            onChange={dateFilter}
            name="date"
          >
            <option value="all-time">All time</option>
            <option value="today">Today</option>
            <option value="last-week">Last Week</option>
            <option value="last-month">Last Month</option>
          </select>
        </div>

        <div className="flex">
          {filterList.map((filter, index) => {
            return (
              <div
                key={index}
                className="flex flex-row bg-gray-100 p-2 rounded-md border-none m-2"
              >
                <span>
                  {filter.key} : {filter.value}
                </span>

                <button
                  className="ml-2 bg-red-500 text-white p-1 py-0 rounded-md hover:bg-red-600 active:bg-red-700"
                  onClick={() => {
                    let newFilterList = filterList.filter(
                      (f, i) => i !== index
                    );
                    setFilterList(newFilterList);
                    setNewRows(newFilterList);
                  }}
                >
                  &times;
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default AnalyticsTable;
