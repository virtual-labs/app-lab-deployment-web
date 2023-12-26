import React from "react";
import { DEFAULT_SECTION, SEARCH_API } from "../../utils/config_data";

const QueryBox = ({
  setQuery,
  loader,
  query,
  setLoading,
  setPresent,
  setResults,
  highlight,
  setHighlight,
  results,
  inpRef,
}) => {
  const getResults = async (e) => {
    e.preventDefault();
    query.search_query = inpRef.current.value;
    if (loader) return;
    if (query.search_query.trim() === "") {
      return;
    }

    const url = SEARCH_API + "?search=" + query.search_query;
    try {
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
      setPresent(DEFAULT_SECTION);
      let response = await fetch(url, config);
      if (response.ok) {
        response = await response.json();
        setResults(response.labs);
      } else {
        console.log(response);
      }
      // console.log(response);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex w-full pt-0">
        <form
          id="email-form"
          name="email-form"
          data-name="Email Form"
          method="get"
          className="form w-full flex flex-col"
        >
          <div className="flex flex-row w-full">
            <input
              type="text"
              className="search-query w-input"
              maxLength="256"
              name="name"
              data-name="Name"
              placeholder="Enter lab name..."
              id="name"
              ref={inpRef}
            />
            <input
              type="submit"
              value="Search"
              className="submit-button w-button w-32"
              onClick={getResults}
            />
          </div>
        </form>
      </div>
      <div className="flex m-2 mb-1">
        {results?.length === 0
          ? "No results"
          : results?.length + (results?.length === 1 ? " result" : " results")}
      </div>
    </>
  );
};

export default QueryBox;
