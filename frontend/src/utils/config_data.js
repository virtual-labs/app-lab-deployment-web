import { createContext, useContext, useEffect, useState } from "react";

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

const BASE_URL = "http://localhost:5005";

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

const DescriptorContext = createContext();

function useDescriptor() {
  return useContext(DescriptorContext);
}

function DescriptorTemplateProvider({ children }) {
  return (
    <DescriptorContext.Provider value={useDescriptorSource()}>
      {children}
    </DescriptorContext.Provider>
  );
}

export {
  DEFAULT_SECTION,
  DEFAULT_QUERY,
  SEARCH_API,
  DescriptorTemplateProvider,
  useDescriptor,
  AUTH_API,
  USER_API,
  LOGIN_API,
};
