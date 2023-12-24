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

const DOCUMENT_TYPES = [
  { type: "Any", title: "" },
  { type: "md", title: "Markdown Github" },
  { type: "org", title: "ORG mode File" },
  { type: "gdoc", title: "Google Document" },
  { type: "xlsx", title: "Google Sheet" },
  { type: "github", title: "Github File" },
  // { type: "drive", title: "Google Drive File" },
  { type: "link", title: "Link" },
  { type: "pdf", title: "PDF file" },
  { type: "dir", title: "Google Drive Folder" },
];

const ACCESSIBILITY_TYPES = [
  { type: "Any", title: "" },
  { type: "private" },
  { type: "public" },
];

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

export {
  DEFAULT_SECTION,
  DOCUMENT_TYPES,
  INSERT_DOC_URL,
  DEFAULT_QUERY,
  SEARCH_API,
  ACCESSIBILITY_TYPES,
  SRC_TYPES,
  stopWordsMap,
};
