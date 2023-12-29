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

const SRC_TYPES = [
  { type: "Any", title: "" },
  { type: "github", title: "Github File" },
  { type: "drive", title: "Google Drive File" },
  { type: "web", title: "Web" },
];

const INSERT_DOC_URL =
  "https://document-search-398511.et.r.appspot.com/insert_doc/login";
const SEARCH_API = "http://localhost:5005/api/lab";

const stopWords = [
  "a",
  "about",
  "above",
  "after",
  "again",
  "against",
  "all",
  "am",
  "an",
  "and",
  "any",
  "are",
  "aren't",
  "as",
  "at",
  "be",
  "because",
  "been",
  "before",
  "being",
  "below",
  "between",
  "both",
  "but",
  "by",
  "can't",
  "cannot",
  "could",
  "couldn't",
  "did",
  "didn't",
  "do",
  "does",
  "doesn't",
  "doing",
  "don't",
  "down",
  "during",
  "each",
  "few",
  "for",
  "from",
  "further",
  "had",
  "hadn't",
  "has",
  "hasn't",
  "have",
  "haven't",
  "having",
  "he",
  "he'd",
  "he'll",
  "he's",
  "her",
  "here",
  "here's",
  "hers",
  "herself",
  "him",
  "himself",
  "his",
  "how",
  "how's",
  "i",
  "i'd",
  "i'll",
  "i'm",
  "i've",
  "if",
  "in",
  "into",
  "is",
  "isn't",
  "it",
  "it's",
  "its",
  "itself",
  "let's",
  "me",
  "more",
  "most",
  "mustn't",
  "my",
  "myself",
  "no",
  "nor",
  "not",
  "of",
  "off",
  "on",
  "once",
  "only",
  "or",
  "other",
  "ought",
  "our",
  "ours",
  "ourselves",
  "out",
  "over",
  "own",
  "same",
  "shan't",
  "she",
  "she'd",
  "she'll",
  "she's",
  "should",
  "shouldn't",
  "so",
  "some",
  "such",
  "than",
  "that",
  "that's",
  "the",
  "their",
  "theirs",
  "them",
  "themselves",
  "then",
  "there",
  "there's",
  "these",
  "they",
  "they'd",
  "they'll",
  "they're",
  "they've",
  "this",
  "those",
  "through",
  "to",
  "too",
  "under",
  "until",
  "up",
  "very",
  "was",
  "wasn't",
  "we",
  "we'd",
  "we'll",
  "we're",
  "we've",
  "were",
  "weren't",
  "what",
  "what's",
  "when",
  "when's",
  "where",
  "where's",
  "which",
  "while",
  "who",
  "who's",
  "whom",
  "why",
  "why's",
  "with",
  "won't",
  "would",
  "wouldn't",
  "you",
  "you'd",
  "you'll",
  "you're",
  "you've",
  "your",
  "yours",
  "yourself",
  "yourselves",
  // Add more as needed
];

const stopWordsMap = new Map();

stopWords.forEach((word) => {
  stopWordsMap.set(word, 1);
});

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
  INSERT_DOC_URL,
  DEFAULT_QUERY,
  SEARCH_API,
  SRC_TYPES,
  stopWordsMap,
  descriptorSchema,
  DescriptorTemplateProvider,
  useDescriptor,
};
