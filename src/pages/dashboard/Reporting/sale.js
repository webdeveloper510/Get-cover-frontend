import React, { useEffect, useRef, useState } from "react";
import Headbar from "../../../common/headBar";
import { Link } from "react-router-dom";
import Grid from "../../../common/grid";
import Button from "../../../common/button";
import all from "../../../assets/images/AciveAmount.svg";
import AllActive from "../../../assets/images/Amount.svg";
import wholesale from "../../../assets/images/AciveCount.svg";
import WholesaleActive from "../../../assets/images/Count.svg";
import SelectBoxWithSearch from "../../../common/selectBoxWIthSerach";
import { cityData } from "../../../stateCityJson";
import All from "./Sale-Tab/all";
import { MultiSelect } from "react-multi-select-component";
import { getFilterList } from "../../../services/reportingServices";
import { useMyContext } from "./../../../context/context";

function Sale() {
  const getInitialActiveTab = () => {
    const storedTab = localStorage.getItem("SaleMenu");
    return storedTab ? storedTab : "Amount";
  };
  const [filter, setFilters] = useState({
    dealerId: "",
    priceBookId: [],
    categoryId: "",
  });
  const [selected, setSelected] = useState([]);
  const [activeTab, setActiveTab] = useState(getInitialActiveTab());
  const [activeButton, setActiveButton] = useState("dealer");
  const [dealerList, setDealerList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [priceBookList, setPriceBookList] = useState([]);
  const state = cityData;
  const containerRef = useRef(null);

  const { filters, setAppliedFilters } = useMyContext();
  useEffect(() => {
    localStorage.setItem("SaleMenu", activeTab);
  }, [activeTab]);

  useEffect(() => {
    getDatasetAtEvent({});
  }, []);

  const getDatasetAtEvent = async (data) => {
    try {
      const res = await getFilterList(data);
      console.log(res.result);
      setDealerList(res.result.getDealers);
      setCategoryList(res.result.getCategories);
      setPriceBookList(res.result.getPriceBooks);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
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

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  const handleFilterChange = (name, value) => {
    console.log(name, value);
    if (name === "dealerId") {
      setFilters((prevFilters) => ({
        ...prevFilters,
        dealerId: value,
        categoryId: "",
        priceBookId: [],
      }));
      setSelected([]);
      getDatasetAtEvent({
        dealerId: value,
        categoryId: "",
        priceBookId: [],
      });
    } else if (name === "categoryId") {
      setFilters((prevFilters) => ({
        ...prevFilters,
        categoryId: value,
      }));

      getDatasetAtEvent({
        ...filter,
        categoryId: value,
      });
      setSelected([]);
    } else if (name === "priceBookId") {
      const priceBookLabels = value.map((item) => item.label);
      setFilters((prevFilters) => ({
        ...prevFilters,
        priceBookId: priceBookLabels,
      }));

      getDatasetAtEvent({
        ...filter,
        priceBookId: priceBookLabels,
      });
    }
  };
  const handleApplyFilters = () => {
    setAppliedFilters(filter);
  };

  return (
    <div className="pb-8 mt-2 px-3 relative overflow-x-hidden bg-grayf9">
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
      <Grid className="mt-4 !gap-0">
        <div className="col-span-3 flex my-4">
          <div className="self-center px-3 py-1">
            <small className="p-0">Filter By :</small>
          </div>
          <div className="self-center">
            <Button
              onClick={() => handleButtonClick("dealer")}
              className={`!rounded-e-[0px] !py-1 !px-2 !border-[1px] !border-[#333333] ${
                activeButton !== "dealer" && "!bg-[white] !text-[#333] "
              }`}
            >
              Dealer
            </Button>
            <Button
              onClick={() => handleButtonClick("category")}
              className={`!rounded-s-[0px] !px-2 !py-1 !border-[#333333] !border-[1px] ${
                activeButton === "dealer" && "!bg-[white] !text-[#333] "
              }`}
            >
              Category
            </Button>
          </div>
        </div>
        <div className="col-span-9 my-4">
          <Grid
            className={`${
              activeButton === "dealer" ? "grid-cols-10" : "grid-cols-5"
            } !gap-0`}
          >
            {activeButton === "dealer" && (
              <>
                <div className="col-span-3 self-center">
                  <SelectBoxWithSearch
                    label=""
                    name="dealerId"
                    value={filter.dealerId}
                    onChange={handleFilterChange}
                    placeholder="Dealer Name"
                    className="!bg-white"
                    className1="filter"
                    pName="Dealer Name"
                    options={dealerList}
                  />
                </div>
                <div className="col-span-3 self-center pl-1">
                  <SelectBoxWithSearch
                    label=""
                    name="categoryId"
                    placeholder="Category Name"
                    value={filter.categoryId}
                    className="!bg-white"
                    className1="filter"
                    options={categoryList}
                    pName="Category Name"
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="col-span-3 self-center pl-1">
                  <MultiSelect
                    label=""
                    name="priceBookId"
                    placeholder="Category Name"
                    value={selected}
                    options={priceBookList}
                    pName="Category Name"
                    onChange={(value) => {
                      setSelected(value);
                      handleFilterChange("priceBookId", value);
                    }}
                    labelledBy="Select"
                    overrideStrings={{ selectSomeItems: "Select Product SKU" }}
                    className="SearchSelect css-b62m3t-container p-[0.425rem]"
                  />
                </div>
                <div className="col-span-1 self-center mx-auto pl-3">
                  <Button onClick={handleApplyFilters}>Filter</Button>
                </div>
              </>
            )}
            {activeButton === "category" && (
              <>
                <div className="col-span-4 self-center pl-3">
                  <SelectBoxWithSearch
                    label=""
                    name="state"
                    placeholder="Category Name"
                    className="!bg-white"
                    className1="filter"
                    options={state}
                    pName="Enter Category"
                    onChange={(value) =>
                      handleFilterChange("categoryId", value)
                    }
                  />
                </div>
                {/* <div className="col-span-2 self-center pl-3">
                  <MultiSelect
                    options={options}
                    value={selected}
                    onChange={(value) => {
                      setSelected(value);
                      handleFilterChange("priceBookId", value);
                    }}
                    labelledBy="Select"
                    overrideStrings={{ selectSomeItems: "Select Product SKU" }}
                    className="SearchSelect css-b62m3t-container p-[0.425rem]"
                  />
                </div> */}
                <div className="col-span-1 self-center mx-auto pl-3">
                  <Button onClick={handleApplyFilters}>Filter</Button>
                </div>
              </>
            )}
          </Grid>
        </div>
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
          <All activeTab={activeTab} />
        </div>
      </Grid>
    </div>
  );
}

export default Sale;
