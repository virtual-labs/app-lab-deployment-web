import { useState } from "react";
import "./css/index.css";
import "./css/App.css";
import { DEFAULT_SECTION } from "./utils/config_data";
import { NavBar, SearchBox, ResultViewBox } from "./components";
import { useEffect } from "react";
import { SEARCH_API } from "./utils/config_data";
import AddLab from "./components/AddLab";

function App() {
  const [present, setPresent] = useState(DEFAULT_SECTION);
  const [highlight, setHighlight] = useState(true);

  const [jsonData, setJsonData] = useState({});

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const url = SEARCH_API + "/get_descriptor?link=" + present.descriptorLink;
    async function fetchData() {
      const config = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Connection: "keep-alive",
        },
      };
      setLoading(true);
      let response = await fetch(url, config);
      if (!response.ok) {
        response = await response.json();
        alert("Error fetching descriptor file : " + response.msg);
        setLoading(false);
        return;
      }
      response = await response.json();
      setJsonData(response);
      setLoading(false);
    }
    if (present.descriptorLink) fetchData();
  }, [present]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {modal && <AddLab setModal={setModal} />}
      <div className="flex">
        <NavBar setModal={setModal} />
      </div>
      <div className="flex flex-1 flex-row flex-block overflow-hidden">
        <div className="flex flex-col w-2/5 overflow-hidden">
          <SearchBox
            setPresent={setPresent}
            highlight={highlight}
            setHighlight={setHighlight}
            present={present}
          />
        </div>
        <div className="relative flex flex-col w-3/5 overflow-hidden">
          <ResultViewBox
            present={present}
            highlight={highlight}
            json={jsonData}
            setJsonData={setJsonData}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
