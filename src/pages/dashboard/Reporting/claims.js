import React, { useEffect, useState } from "react";
import Headbar from "../../../common/headBar";
import { Link } from "react-router-dom";
import Grid from "../../../common/grid";
import Button from "../../../common/button";

// Media Import
import all from "../../../assets/images/AciveAmount.svg";
import AllActive from "../../../assets/images/Amount.svg";
import wholesale from "../../../assets/images/AciveCount.svg";
import WholesaleActive from "../../../assets/images/Count.svg";

import { cityData } from "../../../stateCityJson";
import SelectBoxWithSearch from "../../../common/selectBoxWIthSerach";
import { MultiSelect } from "react-multi-select-component";
import ClaimContent from "./Claim-Tab/ClaimContent";
import { useMyContext } from "./../../../context/context";
import { getFilterListForClaim } from "../../../services/reportingServices";

function Claims() {
  const getInitialActiveTab = () => {
    const storedTab = localStorage.getItem("ClaimMenu");
    return storedTab ? storedTab : "Amount";
  };

  const [selected, setSelected] = useState([]);
  const [activeTab, setActiveTab] = useState(getInitialActiveTab());
  const [dealerList, setDealerList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [priceBookList, setPriceBookList] = useState([]);
  const [servicerList, setServicerList] = useState([]);
  const [selectedCat, setSelectedCat] = useState([]);
  const [categoryListCat, setCategoryListCat] = useState([]);
  const [priceBookListCat, setPriceBookListCat] = useState([]);
  const [categoryListServicer, setCategoryListServicer] = useState([]);
  const [priceBookListServicer, setPriceBookListServicer] = useState([]);
  const [servicerListServicer, setServicerListServicer] = useState([]);
  const [selectedSer, setSelectedSer] = useState([]);
  const [activeButton, setActiveButton] = useState("dealer");

  const [filter, setFilters] = useState({
    dealerId: "",
    priceBookId: [],
    servicerId: "",
    categoryId: "",
    primary: "dealer",
  });
  const [filterCategory, setFiltersCategory] = useState({
    dealerId: "",
    priceBookId: [],
    servicerId: "",
    categoryId: "",
    primary: "category",
  });
  const [filterServicer, setFiltersServicer] = useState({
    dealerId: "",
    priceBookId: [],
    servicerId: "",
    categoryId: "",
    primary: "servicer",
  });
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 14)),
    endDate: new Date(),
  });

  const state = cityData;

  useEffect(() => {
    localStorage.setItem("ClaimMenu", activeTab);
  }, [activeTab]);

  const {
    setFiltersForClaimServicer,
    setFiltersForClaimDealer,
    setFiltersForClaimCategory,
    toggleFilterFlag,
  } = useMyContext();

  const tabs = [
    {
      id: "Amount",
      label: "Amount",
      icons: all,
      className: "col-span-6",
      Activeicons: AllActive,
    },
    {
      id: "Count",
      label: "Count",
      className: "col-span-6",
      icons: wholesale,
      Activeicons: WholesaleActive,
    },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const getDatasetAtEvent = async (data) => {
    try {
      const res = await getFilterListForClaim(data);
      const { dealers, categories, priceBooks, servicers } = res.result;

      const getName = (obj) => obj.name;
      const mapToLabelValue = (value) =>
        value.map((obj) => ({ label: getName(obj), value: obj._id }));
      const mapPriceBooks = (value) =>
        value.map((obj) => ({ label: obj.name, value: obj.name }));

      if (activeButton === "dealer") {
        setDealerList(mapToLabelValue(dealers));
        setCategoryList(mapToLabelValue(categories));
        setPriceBookList(mapPriceBooks(priceBooks));
        setServicerList(mapToLabelValue(servicers));
      } else if (activeButton === "category") {
        setCategoryListCat(mapToLabelValue(categories));
        setPriceBookListCat(mapPriceBooks(priceBooks));
      } else {
        setServicerListServicer(mapToLabelValue(servicers));
        setCategoryListServicer(mapToLabelValue(categories));
        setPriceBookListServicer(mapPriceBooks(priceBooks));
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  const handleFilterChange = (name, value) => {
    let updatedFilters = { ...filter };
    const commonUpdates = {
      categoryId: "",
      priceBookId: [],
      servicerId: "",
      primary: activeButton,
    };
    switch (name) {
      case "dealerId":
        updatedFilters = { dealerId: value, ...commonUpdates };
        setSelected([]);
        break;
      case "servicerId":
        updatedFilters = { ...updatedFilters, servicerId: value };
        setSelected([]);
        break;
      case "categoryId":
        updatedFilters.categoryId = value;
        setSelected([]);
        break;
      case "priceBookId":
        updatedFilters.priceBookId = value.map((item) => item.label);
        break;
      default:
        return;
    }
    console.log(updatedFilters);
    setFilters(updatedFilters);
    getDatasetAtEvent(updatedFilters);
  };

  const handleFilterChangeCat = (name, value) => {
    let updatedFilters = { ...filterCategory };
    switch (name) {
      case "categoryId":
        updatedFilters.categoryId = value;
        updatedFilters.priceBookId = [];
        setSelectedCat([]);
        break;
      case "priceBookId":
        updatedFilters.priceBookId = value.map((item) => item.label);
        break;
      default:
        return;
    }
    setFiltersCategory(updatedFilters);
    getDatasetAtEvent(updatedFilters);
  };

  const handleFilterChangeServicer = (name, value) => {
    let updatedFilters = { ...filterServicer };
    switch (name) {
      case "servicerId":
        updatedFilters = { ...updatedFilters, servicerId: value };
        setSelectedSer([]);
        break;
      case "categoryId":
        updatedFilters.categoryId = value;
        setSelectedSer([]);
        break;
      case "priceBookId":
        updatedFilters.priceBookId = value.map((item) => item.label);
        break;
      default:
        return;
    }
    setFiltersServicer(updatedFilters);
    getDatasetAtEvent(updatedFilters);
  };

  useEffect(() => {
    getDatasetAtEvent({
      dealerId: "",
      priceBookId: [],
      categoryId: "",
      servicerId: "",
      primary: activeButton,
    });
  }, [activeButton]);

  const handleApplyFilters = () => {
    console.log("i am hit this button", activeButton);
    if (activeButton == "category") {
      setFiltersForClaimCategory(filterCategory);
    } else if (activeButton == "dealer") {
      setFiltersForClaimDealer(filter);
    } else if (activeButton == "servicer") {
      setFiltersForClaimServicer(filterServicer);
    }
  };

  const handleResetFilters = () => {
    let data = {
      dealerId: "",
      priceBookId: [],
      servicerId: "",
      categoryId: "",
      primary: activeButton,
    };
    if (activeButton === "category") {
      setFiltersCategory(data);
      setFiltersForClaimCategory(data);
    } else if (activeButton === "dealer") {
      setFilters(data);
      setFiltersForClaimDealer(data);
    } else if (activeButton === "servicer") {
      setFiltersServicer(data);
      setFiltersForClaimServicer(data);
    }
    setSelected([]);
    setSelectedCat([]);
    setSelectedSer([]);
    getDatasetAtEvent(data);
  };

  return (
    <>
      <div className="pb-8 mt-2 px-3 relative overflow-x-hidden bg-grayf9 min-h-[90vh]">
        <Headbar />

        <div className="flex">
          <div className="pl-3 mb-4">
            <p className="font-bold text-[36px] leading-9 mb-[3px]">
              Reporting
            </p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/"}>Reporting / </Link>{" "}
              </li>
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/"}>Claims / </Link>{" "}
              </li>
              <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
                {activeTab}
              </li>
            </ul>
          </div>
        </div>
        <div className="p-3 bg-white mt-4">
          <div className="flex w-full mb-3">
            <p className="p-0 self-center font-bold mr-4">Filter By :</p>
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
                onClick={() => handleButtonClick("servicer")}
                className={`!rounded-[0px] !px-2 !py-1 !border-[#333333] !border-[1px] ${
                  activeButton !== "servicer" && "!bg-[white] !text-[#333] "
                }`}
              >
                Servicer
              </Button>
              <Button
                onClick={() => handleButtonClick("category")}
                className={`!rounded-s-[0px] !px-2 !py-1 !border-[#333333] !border-[1px] ${
                  activeButton !== "category" && "!bg-[white] !text-[#333] "
                }`}
              >
                Category
              </Button>
            </div>
          </div>
          <Grid
            className={`${
              activeButton === "dealer"
                ? "!grid-cols-10"
                : activeButton === "category"
                ? "!grid-cols-6"
                : "!grid-cols-8"
            } !gap-0`}
          >
            {activeButton === "dealer" && (
              <>
                <div className="col-span-2 self-center">
                  <SelectBoxWithSearch
                    label="Dealer Name"
                    name="dealerId"
                    value={filter.dealerId}
                    onChange={handleFilterChange}
                    placeholder="Dealer Name"
                    className="!bg-white"
                    required={true}
                    className1="filter"
                    pName="Dealer Name"
                    options={dealerList}
                  />
                </div>
                <div className="col-span-2 self-center pl-1">
                  <SelectBoxWithSearch
                    label="Servicer Name"
                    name="servicerId"
                    value={filter.servicerId}
                    onChange={handleFilterChange}
                    placeholder="Servicer Name"
                    className="!bg-white"
                    className1="filter"
                    pName="Servicer Name"
                    options={servicerList}
                  />
                </div>
                <div className="col-span-2 self-center pl-1">
                  <SelectBoxWithSearch
                    label="Category Name"
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
                <div className="col-span-2 self-center pl-1">
                  {/* <MultiSelect
                    label="Product SKU"
                    name="priceBookId"
                    placeholder="Product SKU"
                    value={selected}
                    options={priceBookList}
                    pName="Product SKU"
                    onChange={(value) => {
                      setSelected(value);
                      handleFilterChange("priceBookId", value);
                    }}
                    labelledBy="Select"
                    overrideStrings={{
                      selectSomeItems: "Select Product SKU",
                    }}
                    className="SearchSelect css-b62m3t-container p-[0.425rem]"
                  /> */}
                    <MultiSelect
                      label="Product SKU"
                      name="priceBookId"
                      placeholder="Product SKU"
                      value={selected}
                      options={priceBookList}
                      pName="Product SKU"
                      onChange={(value) => {
                        setSelected(value);
                        handleFilterChange("priceBookId", value);
                      }}
                      labelledBy="Select"
                      overrideStrings={{
                        selectSomeItems: "Select Product SKU",
                      }}
                      className="SearchSelect css-b62m3t-container p-[0.425rem]"
                    />
                </div>
                <div className="col-span-2 self-center ml-auto pl-3">
                  <Button className="mr-2" onClick={handleApplyFilters}>
                    Filter
                  </Button>
                  <Button
                    className="!bg-white !text-[#333] border-[1px] border-[#333]"
                    onClick={handleResetFilters}
                  >
                    Reset
                  </Button>
                </div>
              </>
            )}
            {activeButton === "category" && (
              <>
                <div className="col-span-2 self-center pl-3">
                  <SelectBoxWithSearch
                    label="Category Name"
                    name="categoryId"
                    placeholder="Category Name"
                    value={filterCategory.categoryId}
                    className="!bg-white"
                    className1="filter"
                    options={categoryListCat}
                    pName="Category Name"
                    onChange={handleFilterChangeCat}
                  />
                </div>
                <div className="col-span-2 self-center pl-3">
                  <MultiSelect
                    label="Product SKU"
                    name="priceBookId"
                    placeholder="Product SKU"
                    value={selectedCat}
                    options={priceBookListCat}
                    pName="Product SKU"
                    onChange={(value) => {
                      setSelectedCat(value);
                      handleFilterChangeCat("priceBookId", value);
                    }}
                    labelledBy="Select"
                    overrideStrings={{
                      selectSomeItems: "Select Product SKU",
                    }}
                    className="SearchSelect css-b62m3t-container p-[0.425rem]"
                  />
                </div>
                <div className="col-span-2 self-center ml-auto pl-3">
                  <Button className="mr-2" onClick={handleApplyFilters}>
                    Filter
                  </Button>
                  <Button
                    className="!bg-white !text-[#333] border-[1px] border-[#333]"
                    onClick={handleResetFilters}
                  >
                    Reset
                  </Button>
                </div>
              </>
            )}
            {activeButton === "servicer" && (
              <>
                <div className="col-span-2 self-center pl-3">
                  <SelectBoxWithSearch
                    label="Servicer Name"
                    name="servicerId"
                    value={filterServicer.servicerId}
                    onChange={handleFilterChangeServicer}
                    placeholder="Servicer Name"
                    className="!bg-white"
                    required={true}
                    className1="filter"
                    pName="Servicer Name"
                    options={servicerListServicer}
                  />
                </div>
                <div className="col-span-2 self-center pl-3">
                  <SelectBoxWithSearch
                    label="Category Name"
                    name="categoryId"
                    placeholder="Category Name"
                    value={filterServicer.categoryId}
                    className="!bg-white"
                    className1="filter"
                    options={categoryListServicer}
                    pName="Category Name"
                    onChange={handleFilterChangeServicer}
                  />
                </div>
                <div className="col-span-2 self-center pl-1">
                  <MultiSelect
                    label="Product SKU"
                    name="priceBookId"
                    placeholder="Product SKU"
                    value={selectedSer}
                    options={priceBookListServicer}
                    pName="Product SKU"
                    onChange={(value) => {
                      setSelectedSer(value);
                      handleFilterChangeServicer("priceBookId", value);
                    }}
                    labelledBy="Select"
                    overrideStrings={{
                      selectSomeItems: "Select Product SKU",
                    }}
                    className="SearchSelect css-b62m3t-container p-[0.425rem]"
                  />
                </div>
                <div className="col-span-2 self-center ml-auto pl-3">
                  <Button className="mr-2" onClick={handleApplyFilters}>
                    Filter
                  </Button>
                  <Button
                    className="!bg-white !text-[#333] border-[1px] border-[#333]"
                    onClick={handleResetFilters}
                  >
                    Reset
                  </Button>
                </div>
              </>
            )}
          </Grid>
        </div>

        <Grid className="!grid-cols-3">
          <div className="col-span-3">
            <Grid className="mt-2">
              <div className="col-span-5">
                <div className="bg-white rounded-[30px] p-3 border-[1px] border-Light-Grey">
                  <Grid className="!gap-1">
                    {tabs.map((tab) => (
                      <div className={tab.className} key={tab.id}>
                        <Button
                          className={`flex self-center w-full !px-2 !py-1 rounded-xl border-[1px] border-Light-Grey ${
                            activeTab === tab.id
                              ? "!bg-[#2A2A2A] !text-white"
                              : "!bg-grayf9 !text-black"
                          }`}
                          onClick={() => handleTabClick(tab.id)}
                        >
                          <img
                            src={
                              activeTab === tab.id ? tab.Activeicons : tab.icons
                            }
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
                      </div>
                    ))}
                  </Grid>
                </div>
              </div>
              <div className="col-span-1 self-center"></div>
            </Grid>

            <ClaimContent
              activeTab={activeTab}
              selectedRange={selectedRange}
              activeButton={activeButton}
              setSelectedRange={setSelectedRange}
            />
          </div>
        </Grid>
      </div>
    </>
  );
}

export default Claims;
