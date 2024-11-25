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
  const [filtersCategoryTab1, setFiltersCategoryTab] = useState({
    dealerId: "",
    priceBookId: [],
    categoryId: "",
  });
  const [filtersClaimCategory, setFiltersClaimCategory] = useState({
    dealerId: "",
    priceBookId: [],
    categoryId: "",
    servicer: "",
    primary: "category",
  });
  const [filtersClaimServicer, setFiltersClaimServicer] = useState({
    dealerId: "",
    priceBookId: [],
    categoryId: "",
    servicer: "",
    primary: "servicer",
  });
  const [filtersClaimDealer, setFiltersClaimDealer] = useState({
    dealerId: "",
    priceBookId: [],
    categoryId: "",
    servicer: "",
    primary: "dealer",
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
  const setFiltersForCategory = (newFilters) => {
    console.log("newFilters",newFilters)
    setFlag1(true);
    setFiltersCategoryTab(newFilters);
  };
  const setFiltersForClaimCategory = (newFilters) => {
    setFlag1(true);
    setFiltersClaimCategory(newFilters);
  };
  const setFiltersForClaimDealer = (newFilters) => {
    setFiltersClaimDealer(newFilters);
    setFlag1(true);
  };
  const setFiltersForClaimServicer = (newFilters) => {
    setFlag1(true);
    console.log(newFilters)
    setFiltersClaimServicer(newFilters);
  };

  const resetAllFilters = () => {
    setFlag1(false);
    setFilters({
      dealerId: "",
      priceBookId: [],
      categoryId: "",
    });
    setFiltersCategoryTab({
      dealerId: "",
      priceBookId: [],
      categoryId: "",
    });
    setFiltersClaimCategory({
      dealerId: "",
      priceBookId: [],
      categoryId: "",
      servicer: "",
      primary: "category",
    });
    setFiltersClaimServicer({
      dealerId: "",
      priceBookId: [],
      categoryId: "",
      servicer: "",
      primary: "servicer",
    });
    setFiltersClaimDealer({
      dealerId: "",
      priceBookId: [],
      categoryId: "",
      servicer: "",
      primary: "dealer",
    });
  };


  return (
    <MyContext.Provider
      value={{
        flag,
        toggleFlag,
        filters,
        setAppliedFilters,
        flag1,
        filtersCategoryTab1,
        filtersClaimCategory,
        filtersClaimServicer,
        filtersClaimDealer,
        toggleFilterFlag,
        setFiltersForCategory,
        setFiltersForClaimServicer,
        setFiltersForClaimDealer,
        setFiltersForClaimCategory,
        resetAllFilters
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  return useContext(MyContext);
};
