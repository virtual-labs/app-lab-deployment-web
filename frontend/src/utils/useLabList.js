import { createContext, useContext, useState } from "react";

const DeployLabList = createContext();

const LabListProvider = ({ children }) => {
  const [deployLabList, setList] = useState([]);

  const setDeployLabList = (updatedData) => {
    setList(updatedData);
  };

  return (
    <DeployLabList.Provider value={{ deployLabList, setDeployLabList }}>
      {children}
    </DeployLabList.Provider>
  );
};

const useDeployLabList = () => {
  const context = useContext(DeployLabList);
  if (!context) {
    throw new Error("useDeployLabList must be used within a MyProvider");
  }
  return context;
};

export { LabListProvider, useDeployLabList };
