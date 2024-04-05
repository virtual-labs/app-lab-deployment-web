import { useState } from "react";
import "./css/index.css";
import "./css/App.css";
import { DEFAULT_SECTION } from "./utils/config_data";
import { NavBar, SearchBox, ResultViewBox } from "./components";
import { useEffect } from "react";
import { SEARCH_API, DescriptorTemplateProvider } from "./utils/config_data";
import { LabListProvider } from "./utils/useLabList";
import { SearchListProvider } from "./utils/useSearchList";
import AddLab from "./components/AddLab";
import DeployTable from "./components/DeployTable";
import { useDeployLabList } from "./utils/useLabList";
import { USER_API } from "./utils/config_data";
import AnalyticsTable from "./components/AnalyticsTable";
import { useParams } from "react-router-dom";
import ExperimentTable from "./components/ExperimentTable";

function Main() {
  const [present, setPresent] = useState(DEFAULT_SECTION);
  const [jsonData, setJsonData] = useState({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [showDeployTab, setShowDeployTab] = useState(false);
  const [viewAnalytics, setViewAnalytics] = useState(false);

  const { labname } = useParams();

  const viewExpInfo = labname !== undefined;

  useEffect(() => {
    const url =
      SEARCH_API +
      "/get_descriptor?reponame=" +
      present.repoName +
      "&access_token=" +
      localStorage.getItem("accessToken");
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

  useEffect(() => {
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
      let response = await fetch(
        USER_API + `?access_token=${localStorage.getItem("accessToken")}`,
        config
      );
      if (!response.ok) {
        response = await response.json();
        alert("Error fetching user info : " + response.msg);
        return;
      }
      response = await response.json();
      setUserInfo(response.info);
    }
    fetchData();
  }, []);

  return (
    <SearchListProvider>
      <LabListProvider>
        <DescriptorTemplateProvider>
          <div className="flex flex-col h-screen w-screen overflow-hidden">
            {modal && <AddLab setModal={setModal} />}
            <div className="flex">
              <NavBar
                setModal={setModal}
                setShowDeployTab={setShowDeployTab}
                showDeployTab={showDeployTab}
                userInfo={userInfo}
                setViewAnalytics={setViewAnalytics}
                viewAnalytics={viewAnalytics}
                viewExpInfo={viewExpInfo}
              />
            </div>
            {!viewExpInfo &&
              !viewAnalytics &&
              (showDeployTab ? (
                <DeployLabComponent />
              ) : (
                <LabComponent
                  {...{
                    setPresent,
                    jsonData,
                    loading,
                    present,
                    setLoading,
                  }}
                />
              ))}
            {!viewExpInfo && viewAnalytics && <AnalyticsComponent />}
            {viewExpInfo && <ExperimentTable labName={labname} />}
          </div>
        </DescriptorTemplateProvider>
      </LabListProvider>
    </SearchListProvider>
  );
}

const DeployLabComponent = () => {
  const { deployLabList } = useDeployLabList();
  return (
    <>
      <DeployTable data={deployLabList} />
    </>
  );
};

const LabComponent = ({
  setPresent,
  jsonData,
  loading,

  present,
  setLoading,
}) => {
  return (
    <div className="flex flex-1 flex-row flex-block overflow-hidden">
      <div className="flex flex-col w-2/5 overflow-hidden">
        <SearchBox setPresent={setPresent} present={present} />
      </div>
      <div className="relative flex flex-col w-3/5 overflow-hidden">
        <ResultViewBox
          present={present}
          json={jsonData}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
};

const AnalyticsComponent = () => {
  return (
    <div className="flex flex-1 flex-row flex-block overflow-hidden">
      <div className="atable-parent flex flex-col w-full overflow-hidden">
        <AnalyticsTable />
      </div>
    </div>
  );
};

export default Main;
