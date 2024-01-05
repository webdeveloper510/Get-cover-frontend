import React, { createContext, useContext, useState } from "react";

const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [flag, setFlag] = useState(false);
  const [lastLocation, setLastLocation] = useState(null);

  const toggleFlag = () => {
    setFlag((prevFlag) => !prevFlag);
  };


  const LastLocationContext = (value) =>{
    setLastLocation(value);
  }

  return (
    <MyContext.Provider value={{ flag, toggleFlag ,lastLocation, LastLocationContext }}>
      {children}
    </MyContext.Provider>
  );
};




export const useMyContext = () => {
  return useContext(MyContext);
};


