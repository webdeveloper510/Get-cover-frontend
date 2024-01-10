import React, { createContext, useContext, useState } from "react";

const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [flag, setFlag] = useState(false);

  const toggleFlag = () => {
    setFlag((prevFlag) => !prevFlag);
  };

  return (
    <MyContext.Provider value={{ flag, toggleFlag }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  return useContext(MyContext);
};
