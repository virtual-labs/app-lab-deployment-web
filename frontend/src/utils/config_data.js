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

const SEARCH_API = "http://localhost:5005/api/lab";
const AUTH_API = "http://localhost:5005/auth/github/access_token";
const USER_API = "http://localhost:5005/api/user";

const descriptorSchema = {
  $schema: "http://json-schema.org/schema#",
  $id: "https://schema.vlabs.ac.in/lab-descriptor.schema.json",
  title: "Lab Descriptor",
  description:
    "Schema for a Lab Descriptor defining the properties of a Virtual Lab",
  type: "object",
  required: [
    "lab",
    "broadArea",
    "phase",
    "collegeName",
    "baseUrl",
    "introduction",
    "objective",
    "targetAudience",
    "courseAlignment",
  ],
  properties: {
    lab: { type: "string" },
    lab_display_name: {
      type: "string",
      default: "Default Lab Display Name",
    },
    broadArea: {
      type: "object",
      properties: {
        name: { type: "string" },
        link: { type: "string", format: "uri" },
        code: {
          enum: [
            "BIO",
            "CHEMENG",
            "CHEMSCI",
            "CIVIL",
            "CSE",
            "DESIGN",
            "ECE",
            "EE",
            "MECH",
            "PHYSCI",
          ],
        },
      },
      required: ["code"],
    },
    phase: { enum: [2, 3, "3-ext"] },
    collegeName: {
      enum: [
        "AMRT",
        "COEP",
        "DLBG",
        "IIITH",
        "IITB",
        "IITD",
        "IITG",
        "IITK",
        "IITKGP",
        "IITR",
        "NITK",
      ],
    },
    baseUrl: {
      type: "string",
      format: "hostname",
    },
    introduction: { type: "string" },
    objective: { type: "string" },
    experiments: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["name", "short-name", "repo", "tag", "deploy"],
        properties: {
          name: { type: "string" },
          "short-name": { type: "string" },
          repo: { type: "string", format: "uri" },
          tag: {
            type: "string",
            minLength: 6,
            maxLength: 6,
            pattern: "^v([0-9]{1,2}\\.){2}[0-9]$",
          },
          deploy: { type: "boolean" },
        },
        additionalProperties: false,
      },
    },
    "experiment-sections": {
      type: "array",
      items: {
        type: "object",
        required: ["sect-name", "experiments"],
        properties: {
          "sect-name": { type: "string" },
          experiments: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: ["name", "short-name", "repo", "tag", "deploy"],
              properties: {
                name: { type: "string" },
                "short-name": { type: "string" },
                repo: { type: "string", format: "uri" },
                tag: {
                  type: "string",
                  minLength: 6,
                  maxLength: 6,
                  pattern: "^v([0-9]{1,2}\\.){2}[0-9]$",
                },
                deploy: { type: "boolean" },
              },
              additionalProperties: false,
            },
          },
        },
      },
    },
    targetAudience: {
      type: "object",
      properties: {
        UG: {
          type: "array",
          items: { type: "string" },
        },
        PG: {
          type: "array",
          items: { type: "string" },
        },
      },
    },
    courseAlignment: {
      type: "object",
      properties: {
        description: { type: "string" },
        universities: {
          type: "array",
          minItems: 1,
          items: { type: "string" },
        },
      },
    },
  },
};

function useDescriptorSource() {
  const [descriptor, setDescriptor] = useState({});

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/virtual-labs/ph3-lab-mgmt/master/validation/schemas/labDescSchema.json"
    )
      .then((response) => response.json())
      .then((data) => setDescriptor(data));
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
  descriptorSchema,
  DescriptorTemplateProvider,
  useDescriptor,
  AUTH_API,
  USER_API,
};
