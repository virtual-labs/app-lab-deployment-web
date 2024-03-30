import { createContext, useContext, useState } from "react";

const SearchList = createContext();

const SearchListProvider = ({ children }) => {
  const [searchList, setList] = useState([]);

  const setSearchList = (updatedData) => {
    setList(updatedData);
  };

  return (
    <SearchList.Provider value={{ searchList, setSearchList }}>
      {children}
    </SearchList.Provider>
  );
};

const useSearchList = () => {
  const context = useContext(SearchList);
  if (!context) {
    throw new Error("useDeployLabList must be used within a MyProvider");
  }
  return context;
};

export { SearchListProvider, useSearchList };
