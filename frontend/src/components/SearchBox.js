import React, { useRef } from "react";
import { useState } from "react";
import { DEFAULT_QUERY } from "../utils/config_data";
import { QueryBox, ResultPane } from "./search-box-component";
import { useSearchList } from "../utils/useSearchList";

const SearchBox = ({ setPresent, present }) => {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const { searchList: results, setSearchList: setResults } = useSearchList();

  const [loader, setLoading] = useState(false);
  const inpRef = useRef();

  return (
    <>
      <QueryBox
        setQuery={setQuery}
        loader={loader}
        query={query}
        setLoading={setLoading}
        setPresent={setPresent}
        setResults={setResults}
        results={results}
        inpRef={inpRef}
      />
      <ResultPane
        loader={loader}
        results={results}
        setPresent={setPresent}
        present={present}
      />
    </>
  );
};

export default SearchBox;
