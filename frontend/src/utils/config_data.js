import { createContext, useContext, useEffect, useState } from "react";
import ini from "ini";

const DEFAULT_SECTION = {
  accessibility: "public",
  document: "Page title",
  heading: "Section Heading",
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.",
  type: "link",
  url: "#",
  base_url: "#",
  search_query: "",
};

const DEFAULT_QUERY = {
  search_query: "",
  limit: 10,
  thresh: 0.15,
  doc_filter: "Any",
  src_filter: "Any",
  acc_filter: "Any",
  page_title_filter: "",
};

let BASE_URL = "http://localhost:5005";

console.log("NODE_ENV:", process.env.REACT_APP_FRONTEND_ENV);

if (process.env.REACT_APP_FRONTEND_ENV === "production") {
  console.log("Production mode");
  BASE_URL = "https://lab-deployment-414310.as.r.appspot.com/";
}

// const BASE_URL = "https://lab-deployment-414310.as.r.appspot.com/";

const SEARCH_API = BASE_URL + "/api/lab";
const AUTH_API = BASE_URL + "/auth/github/access_token";
const USER_API = BASE_URL + "/api/user";
const LOGIN_API = BASE_URL + "/auth/github";

function useDescriptorSource() {
  const [descriptor, setDescriptor] = useState({});

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/virtual-labs/ph3-lab-mgmt/master/validation/schemas/labDescSchema.json"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("descriptorSchema:", data);
        setDescriptor(data);
      });
  }, []);

  return descriptor;
}

function useWorkflowConfigSource() {
  const [workflowName, setWorflowName] = useState({});

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/virtual-labs/app-lab-deployment-web/dev/config/workflow.cfg"
    )
      .then((response) => response.text())
      .then((data) => {
        const parsedConfig = ini.parse(data).workflow;
        console.log("workflowList:", parsedConfig);
        setWorflowName(parsedConfig);
      });
  }, []);

  return workflowName;
}

const GithubConfigContext = createContext();

function useConfig() {
  return useContext(GithubConfigContext);
}

function DescriptorTemplateProvider({ children }) {
  return (
    <GithubConfigContext.Provider
      value={{
        descriptor: useDescriptorSource(),
        workflowConfig: useWorkflowConfigSource(),
      }}
    >
      {children}
    </GithubConfigContext.Provider>
  );
}

function validateDate(dateString) {
  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;

  if (!dateRegex.test(dateString)) {
    return "Invalid date format. Please use mm/dd/yyyy.";
  }

  const parts = dateString.split("/");
  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  const isValidDate =
    !isNaN(year) &&
    !isNaN(month) &&
    !isNaN(day) &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= 31;

  if (!isValidDate) {
    return "Invalid date. Please enter a valid hosting request date.";
  }

  return null;
}

function validateURL(url) {
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

  if (!urlRegex.test(url)) {
    return "Invalid URL. Please enter a valid URL.";
  }
  return null;
}

export {
  DEFAULT_SECTION,
  DEFAULT_QUERY,
  SEARCH_API,
  DescriptorTemplateProvider,
  useConfig,
  AUTH_API,
  USER_API,
  LOGIN_API,
  validateDate,
  validateURL,
};
