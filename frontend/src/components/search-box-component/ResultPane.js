import React from "react";
import LoadingImg from "../../media/loading-73.gif";
import ResultBox from "./ResultBox";
import { useDeployLabList } from "../../utils/useLabList";

const ResultPane = ({ loader, results, setPresent, present }) => {
  const { deployLabList } = useDeployLabList();

  return (
    <>
      {loader && (
        <img
          src={LoadingImg}
          alt="loading-img"
          height={100}
          width={100}
          style={{ margin: "auto", display: "block", marginTop: "10%" }}
        ></img>
      )}
      {!loader && (
        <div className="flex flex-1 flex-col overflow-auto">
          {results?.map((result, i) => {
            return (
              <ResultBox
                key={i}
                result={result}
                setPresent={setPresent}
                present={present}
                inList={
                  deployLabList.filter(
                    (lab) => lab.repoName === result.repoName
                  ).length > 0
                }
              />
            );
          })}
        </div>
      )}
    </>
  );
};

export default ResultPane;
