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
import SelectBoxWithSearch from "../../../common/selectBoxWIthSerach";
import { MultiSelect } from "react-multi-select-component";
import ClaimContent from "./Sale-Tab/ClaimContent";
import { useMyContext } from "./../../../context/context";
import { getFilterListForDealerClaim } from "../../../services/reportingServices";
import { RotateLoader } from "react-spinners";

function DealerClaims() {
  const getInitialActiveTab = () => {
    const storedTab = localStorage.getItem("ClaimMenu");
    return storedTab ? storedTab : "Amount";
  };

  const [activeTab, setActiveTab] = useState(getInitialActiveTab());
  const [selectedCat, setSelectedCat] = useState([]);
  const [categoryListCat, setCategoryListCat] = useState([]);
  const [priceBookListCat, setPriceBookListCat] = useState([]);
  const [categoryListServicer, setCategoryListServicer] = useState([]);
  const [priceBookListServicer, setPriceBookListServicer] = useState([]);
  const [servicerListServicer, setServicerListServicer] = useState([]);
  const [selectedSer, setSelectedSer] = useState([]);
  const [activeButton, setActiveButton] = useState("servicer");
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [filterCategory, setFiltersCategory] = useState({
    priceBookId: [],
    servicerId: "",
    categoryId: "",
    primary: "category",
  });
  const [filterServicer, setFiltersServicer] = useState({
    priceBookId: [],
    servicerId: "",
    categoryId: "",
    primary: "servicer",
  });
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 14)),
    endDate: new Date(),
  });

  useEffect(() => {
    localStorage.setItem("ClaimMenu", activeTab);
  }, [activeTab]);

  const {
    setFiltersForClaimServicer,
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
      setLoading(true);
      const res = await getFilterListForDealerClaim(data);
      const { dealers, categories, priceBooks, servicers } = res.result;

      const getName = (obj) => obj.name;
      const mapToLabelValue = (value) =>
        value.map((obj) => ({ label: getName(obj), value: obj._id }));
      const mapPriceBooks = (value) =>
        value.map((obj) => ({ label: obj.name, value: obj.name }));
      if (activeButton === "category") {
        setCategoryListCat(mapToLabelValue(categories));
        setPriceBookListCat(mapPriceBooks(priceBooks));
      } else {
        setServicerListServicer(mapToLabelValue(servicers));
        setCategoryListServicer(mapToLabelValue(categories));
        setPriceBookListServicer(mapPriceBooks(priceBooks));
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching sales data:", error);
    }
    setLoading(false);
  };

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  const handleFilterChangeCat = (name, value) => {
    setLoading1(true);
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
    setLoading1(false);
  };

  const handleFilterChangeServicer = (name, value) => {
    setLoading1(true);
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
    setLoading1(false);
  };

  useEffect(() => {
    getDatasetAtEvent({
      priceBookId: [],
      categoryId: "",
      servicerId: "",
      primary: activeButton,
    });
  }, [activeButton]);

  const handleApplyFilters = () => {
    setLoading1(true);
    if (activeButton == "category") {
      setFiltersForClaimCategory(filterCategory);
    } else if (activeButton == "servicer") {
      setFiltersForClaimServicer(filterServicer);
      setLoading1(false);
    }
  };

  const handleResetFilters = () => {
    let data = {
      priceBookId: [],
      servicerId: "",
      categoryId: "",
      primary: activeButton,
    };
    if (activeButton === "category") {
      setFiltersCategory(data);
      setFiltersForClaimCategory(data);
    } else if (activeButton === "servicer") {
      setFiltersServicer(data);
      setFiltersForClaimServicer(data);
    }
    setSelectedCat([]);
    setSelectedSer([]);
    getDatasetAtEvent(data);
  };

  return (
    <>
     {loading || loading1 ? <>
        <div className=" h-[400px] w-full flex py-5">
          <div className="self-center mx-auto">
            <RotateLoader color="#333" />
          </div>
        </div> </> :
        <div className="pb-8 mt-2 px-3 bg-grayf9">
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
                  onClick={() => handleButtonClick("servicer")}
                  className={`!rounded-e-[0px] !px-2 !py-1 !border-[#333333] !border-[1px] ${
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
                  <div className="col-span-2 self-center pl-3 relative">
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
                        selectSomeItems: "Select",
                      }}
                      className="SearchSelect css-b62m3t-container p-[0.425rem]"
                    />
                    <small className="absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-[12px] bg-grayf9 left-[25px] px-1 -translate-y-4 !hover:bg-grayf9 scale-75 !bg-white text-[#5D6E66]">
                      Product SKU
                    </small>
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
                  <div className="col-span-2 self-center pl-1 relative">
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
                        selectSomeItems: "Select",
                      }}
                      className="SearchSelect css-b62m3t-container p-[0.425rem]"
                    />
                    <small className="absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-[12px] bg-grayf9 left-[17px] px-1 -translate-y-4 !hover:bg-grayf9 scale-75 !bg-white text-[#5D6E66]">
                      Product SKU
                    </small>
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
        }
    </>
  );
}

export default DealerClaims;
