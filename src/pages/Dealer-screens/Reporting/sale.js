import React, { useEffect, useRef, useState } from "react";
import Headbar from "../../../common/headBar";
import { Link, useLocation } from "react-router-dom";
import Grid from "../../../common/grid";
import Button from "../../../common/button";
import all from "../../../assets/images/AciveAmount.svg";
import AllActive from "../../../assets/images/Amount.svg";
import wholesale from "../../../assets/images/AciveCount.svg";
import WholesaleActive from "../../../assets/images/Count.svg";
import SelectBoxWithSearch from "../../../common/selectBoxWIthSerach";

import All from "./Sale-Tab/all";
import { MultiSelect } from "react-multi-select-component";
import { getFilterListDropdown } from "../../../services/reportingServices";
import { useMyContext } from "./../../../context/context";
import { RotateLoader } from "react-spinners";

function Sale() {
  const location = useLocation();
  const isResellerReporting = location.pathname.includes("/reseller/sale");

  const getInitialActiveTab = () => {
    const storedTab = localStorage.getItem("SaleMenu");
    return storedTab ? storedTab : "Amount";
  };

  const [filterCategory, setFiltersCategory] = useState({
    dealerId: "",
    priceBookId: [],
    categoryId: "",
  });

  const [activeTab, setActiveTab] = useState(getInitialActiveTab());
  const [activeButton, setActiveButton] = useState("dealer");
  const [selectedCat, setSelectedCat] = useState([]);
  const [categoryListCat, setCategoryListCat] = useState([]);
  const [priceBookListCat, setPriceBookListCat] = useState([]);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { setAppliedFilters, setFiltersForCategory } = useMyContext();

  useEffect(() => {
    localStorage.setItem("SaleMenu", activeTab);
  }, [activeTab]);

  useEffect(() => {
    getDatasetAtEvent({
      dealerId: "",
      priceBookId: [],
      categoryId: "",
    });
  }, []);

  const getDatasetAtEvent = async (data) => {
    try {
      setLoading(true);
      const res = await getFilterListDropdown(
        data,
        isResellerReporting ? "resellerPortal" : "dealerPortal"
      );
      const { categories, priceBooks } = res.result;

      const getName = (obj) => obj.name;
      const mapToLabelValue = (value) =>
        value.map((obj) => ({ label: getName(obj), value: obj._id }));
      const mapPriceBooks = (value) =>
        value.map((obj) => ({ label: obj.name, value: obj.name }));
      setCategoryListCat(mapToLabelValue(categories));
      setPriceBookListCat(mapPriceBooks(priceBooks));
    } catch (error) {
      console.error("Error fetching sales data:", error);
      setLoading(false);
    }
    setLoading(false);
  };

  const tabs = [
    { id: "Amount", label: "Amount", icons: all, Activeicons: AllActive },
    {
      id: "Count",
      label: "Count",
      icons: wholesale,
      Activeicons: WholesaleActive,
    },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleFilterChangeforCategory = (name, value) => {
    setLoading(true);

    let updatedFilters = { ...filterCategory };

    if (name === "categoryId") {
      updatedFilters = { categoryId: value, priceBookId: [], dealerId: "" };
      setSelectedCat([]);
    } else if (name === "priceBookId") {
      updatedFilters.priceBookId = value.map((item) => item.label);
    }

    setFiltersCategory(updatedFilters);
    getDatasetAtEvent(updatedFilters);
    setLoading(false);
  };

  const handleApplyFilters = () => {
    setFiltersForCategory(filterCategory);
  };

  const handleResetFilters = () => {
    let data = {
      dealerId: "",
      priceBookId: [],
      categoryId: "",
    };
    setFiltersForCategory(data);
    setFiltersCategory(data);
    setSelectedCat([]);
  };

  return (
    <>
    {loading ?
      <div className=" h-[400px] w-full flex py-5">
        <div className="self-center mx-auto">
          <RotateLoader color="#333" />
        </div>
      </div>  
      :
      <div className="pb-8 mt-2 px-3 bg-grayf9">
          <Headbar />
          <div className="flex">
            <div className="pl-3">
              <p className="font-bold text-[36px] leading-9 mb-[3px]">Reporting</p>
              <ul className="flex self-center">
                <li className="text-sm text-neutral-grey font-Regular">
                  <Link to={"/"}>Reporting / </Link>
                </li>
                <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
                  Sale ({activeTab})
                </li>
              </ul>
            </div>
          </div>
          <div className="p-3 bg-white mt-4">
          <p className="p-0 self-center font-bold mr-4 mb-2">Filter by  </p>
            <Grid className={`${"!grid-cols-5"} !gap-0`}>
                <div className={`self-center pl-1 col-span-2`}>
                  <SelectBoxWithSearch
                    label="Category Name"
                    name="categoryId"
                    placeholder="Category Name"
                    value={filterCategory.categoryId}
                    className="!bg-white"
                    className1="filter"
                    options={categoryListCat}
                    pName="Category Name"
                    onChange={handleFilterChangeforCategory}
                  />
                </div>
                <div className="col-span-2 self-center pl-1 relative">
                  <MultiSelect
                    label=""
                    name="priceBookId"
                    placeholder="Category Name"
                    value={selectedCat}
                    options={priceBookListCat}
                    pName="Category Name"
                    onChange={(value) => {
                      setSelectedCat(value);
                      handleFilterChangeforCategory("priceBookId", value);
                    }}
                    labelledBy="Select"
                    overrideStrings={{
                      selectSomeItems: "Select ",
                    }}
                    className="SearchSelect css-b62m3t-container p-[0.425rem]"
                  />
                  <small className="absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-[12px] bg-grayf9 left-[17px] px-1 -translate-y-4 !hover:bg-grayf9 scale-75 !bg-white text-[#5D6E66]">
                    Product SKU
                  </small>
                </div>
                <div className="col-span-1 self-center mx-auto pl-3">
                  <Button onClick={handleApplyFilters}>Filter</Button>
                  <Button
                    className="!ml-2 !bg-white !border-[1px] !border-[#333] !text-[#333]"
                    onClick={handleResetFilters}
                  >
                    Reset
                  </Button>
                </div>
            </Grid>
          </div>
          <Grid className="mt-4 !gap-0">
            <div className="col-span-12">
              <Grid className=" grid-cols-9 !gap-0">
                <div className="col-span-3 relative">
                  <div
                    className={`rounded-[30px] px-2 py-3 border-[1px] flex border-Light-Grey`}
                    ref={containerRef}
                  >
                    {tabs.map((tab) => (
                      <Button
                        key={tab.id}
                        className={`flex self-center w-[190px] !px-2 !py-1 rounded-xl border-[1px] border-Light-Grey ${
                          activeTab === tab.id
                            ? "!bg-[#2A2A2A] !text-white"
                            : "!bg-grayf9 !text-black"
                        }`}
                        onClick={() => handleTabClick(tab.id)}
                      >
                        <img
                          src={activeTab === tab.id ? tab.Activeicons : tab.icons}
                          className="self-center pr-1 py-1 border-Light-Grey border-r-[1px]"
                          alt={tab.label}
                        />
                        <span
                          className={`ml-1 py-1 text-[12px] font-normal ${
                            activeTab === tab.id ? "text-white" : "text-black"
                          }`}
                        >
                          {tab.label}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              </Grid>
              <All activeTab={activeTab} activeButton={activeButton} />
            </div>
          </Grid>
      </div>
     }
    </>
  );
}

export default Sale;
