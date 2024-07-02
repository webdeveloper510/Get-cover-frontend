import React, { createContext, useContext, useState } from "react";

const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [flag, setFlag] = useState(false);
  const [flag1, setFlag1] = useState(false);
  const [filters, setFilters] = useState({
    dealerId: "",
    priceBookId: [],
    categoryId: "",
  });

  const toggleFlag = () => {
    setFlag((prevFlag) => !prevFlag);
  };

  const toggleFilterFlag = () => {
    setFlag1((prevFlag) => !prevFlag);
  };

  const setAppliedFilters = (newFilters) => {
    setFlag1(true);
    setFilters(newFilters);
  };

  return (
    <MyContext.Provider
      value={{ flag, toggleFlag, filters, setAppliedFilters, flag1 }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  return useContext(MyContext);
};
