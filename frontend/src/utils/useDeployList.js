import { createContext, useContext, useState } from "react";

const DeployedLabList = createContext();

const DeployLabListProvider = ({ children }) => {
  const [deployedLabList, setList] = useState([]);

  const setDeployedLabList = (updatedData) => {
    setList(updatedData);
  };

  return (
    <DeployedLabList.Provider value={{ deployedLabList, setDeployedLabList }}>
      {children}
    </DeployedLabList.Provider>
  );
};

const useDeployedLabList = () => {
  const context = useContext(DeployedLabList);
  if (!context) {
    throw new Error("useDeployLabList must be used within a MyProvider");
  }
  return context;
};

export { DeployLabListProvider, useDeployedLabList };
