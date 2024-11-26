import React, { useEffect, useState } from "react";
import Headbar from "../../../common/headBar";
import { Link, useLocation } from "react-router-dom";
import Grid from "../../../common/grid";
import Button from "../../../common/button";

// Media Import
import all from "../../../assets/images/AciveAmount.svg";
import AllActive from "../../../assets/images/Amount.svg";
import wholesale from "../../../assets/images/AciveCount.svg";
import WholesaleActive from "../../../assets/images/Count.svg";

import SelectBoxWithSearch from "../../../common/selectBoxWIthSerach";
import { MultiSelect } from "react-multi-select-component";
import ClaimContent from "./Claim-Tab/ClaimContent";
import { useMyContext } from "./../../../context/context";
import {
  getFilterListForClaim,
  getFilterListForServicerClaim,
  getReportingFilterListForClaim,
} from "../../../services/reportingServices";
import Card from "../../../common/card";
import { RotateLoader } from "react-spinners";
import { getUserDetailsFromLocalStorage } from "../../../services/extraServices";
import InActiveButton from "../../../common/inActiveButton";

function Claims() {
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const location = useLocation();
  const isServicerClaims = location.pathname.includes("/servicer/claims");
  const isResellerClaims = location.pathname.includes("/reseller/reporting");
  const isCustomerClaims = location.pathname.includes("/customer/claims");
  const getInitialActiveTab = () => {
    const storedTab = localStorage.getItem("ClaimMenu");
    return storedTab ? storedTab : "Amount";
  };

  const [selected, setSelected] = useState([]);
  const [activeTab, setActiveTab] = useState(getInitialActiveTab());
  const [dealerList, setDealerList] = useState([]);
  const [dealerSkuSelected, setDealerSkuSelected] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [priceBookList, setPriceBookList] = useState([]);
  const [servicerList, setServicerList] = useState([]);
  const [dealerSkuList, setDealerSkuList] = useState([]);
  const [selectedCat, setSelectedCat] = useState([]);
  const [categoryListCat, setCategoryListCat] = useState([]);
  const [priceBookListCat, setPriceBookListCat] = useState([]);
  const [categoryListServicer, setCategoryListServicer] = useState([]);
  const [priceBookListServicer, setPriceBookListServicer] = useState([]);
  const [servicerListServicer, setServicerListServicer] = useState([]);
  const [dealerListServicer, setDealerListServicer] = useState([]);
  const [dealerSkuSelectedServicer, setDealerSkuSelectedServicer] = useState([]);
  const [selectedSer, setSelectedSer] = useState([]);
  const [dealerSkuListServicer, setDealerSkuListServicer] = useState([]);
  const [activeButton, setActiveButton] = useState(
    isResellerClaims ? "servicer" : "dealer"
  );

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

  useEffect(() => {
    localStorage.setItem("ClaimMenu", activeTab);
  }, [activeTab]);

  const {
    setFiltersForClaimServicer,
    setFiltersForClaimDealer,
    setFiltersForClaimCategory,
    resetAllFilters,
  } = useMyContext();

  useEffect(() => {
    resetAllFilters();
  }, []);

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
    setLoading1(true)
    try {
      const res =
        isServicerClaims || isResellerClaims
          ? await getFilterListForServicerClaim(
            activeButton,
            !isResellerClaims ? "servicerPortal" : "resellerPortal"
          )
          : await getReportingFilterListForClaim(activeButton);
      if (activeButton == "dealer") {
        const dealers = res?.result.map((dealer) => {
          // Map over dealer's categories
          const categories = (dealer.categories || []).map((category) => {
            const priceBooks = (category.priceBooks || []).map((priceBook) => ({
              label: priceBook.priceBookName,
              value: priceBook.priceBookId,
              categoryId: category.categoryId,
              dealerSku: (priceBook.dealerSku || []).map((skuObj) => ({
                label: skuObj.sku,
                value: priceBook.priceBookId,
              })),
            }));

            return {
              label: category.categoryName,
              value: category.categoryId,
              priceBooks, // Nested priceBooks within each category
            };
          });

          // Map over dealer's servicer
          const servicer = (dealer.servicer || []).map((servicer) => {
            return {
              label: servicer.name,
              value: servicer._id,
              dealer: dealer._id,
            };
          });

          // Return structured dealer object
          return {
            label: dealer.name,
            value: dealer._id,
            categories,
            servicer,
          };
        });
        setDealerList(dealers);
      }
      else if (activeButton == "category") {
        const categoriesWithPriceBooks = [];
        const allPriceBooks = [];
        const allDealerSkus = [];

        (res.result || []).forEach(category => {
          const priceBooks = (category.priceBooks || []).map(priceBook => {
            const dealerSkuObjects = (priceBook.dealerSku || []).map(skuObj => ({
              label: skuObj.sku,
              value: priceBook.priceBookId
            }));

            allDealerSkus.push(...dealerSkuObjects);

            const priceBookObj = {
              label: priceBook.priceBookName,
              value: priceBook.priceBookId,
              categoryId: category.categoryId,
              dealerSku: dealerSkuObjects
            };

            allPriceBooks.push(priceBookObj);

            return priceBookObj;
          });

          categoriesWithPriceBooks.push({
            label: category.categoryName,
            value: category.categoryId,
            priceBooks
          });
        });

        setCategoryListCat(categoriesWithPriceBooks);
        setPriceBookListCat(allPriceBooks);
        setDealerSkuListServicer(allDealerSkus);
      }

      else {
        const servicer = res?.result.map((servicer) => {
          // Map over dealer's categories
          const categories = (servicer.categories || []).map((category) => {
            const priceBooks = (category.priceBooks || []).map((priceBook) => ({
              label: priceBook.priceBookName,
              value: priceBook.priceBookId,
              categoryId: category.categoryId,
              dealerSku: (priceBook.dealerSku || []).map((skuObj) => ({
                label: skuObj.sku,
                value: priceBook.priceBookId,
              })),
            }));

            return {
              label: category.categoryName,
              value: category.categoryId,
              priceBooks, 
            };
          });

          const dealer = (servicer.dealer || []).map((dealer) => {
            return {
              label: dealer.name,
              value: dealer._id,
              servicer: servicer._id,
            };
          });

          // Return structured dealer object
          return {
            label: servicer.name,
            value: servicer._id,
            categories,
            dealer,
          };
        });
        console.log(servicer)
         setServicerListServicer(servicer)
      }

    } catch (error) {
      console.error("Error fetching sales data:", error);

    }
    finally {
      setLoading1(false);
    }
  };

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === "dealerId" && value) {
      const filteredDealer = dealerList.find(dealer => dealer.value === value);

      if (filteredDealer) {
        const allPriceBooks = filteredDealer.categories.flatMap(category => category.priceBooks || []);
        const allDealerSku = allPriceBooks.flatMap(priceBook => priceBook.dealerSku || []);

        setCategoryList(filteredDealer.categories);
        setServicerList(filteredDealer.servicer)
        setPriceBookList(allPriceBooks);
        setDealerSkuList(allDealerSku)
      }

    }
    if (name === "categoryId" && filter.dealerId) {
      let filteredPriceBooks = [];
      let dealerSkuList = [];
      setSelected([]);
      setDealerSkuSelected([]);
      handleFilterChange('priceBookId', []);
      if (value) {
        const filteredCategory = categoryList.find(category => category.value === value);
        filteredPriceBooks = filteredCategory?.priceBooks || [];
      } else {
        filteredPriceBooks = categoryList.flatMap(category => category.priceBooks || []);
      }
      dealerSkuList = filteredPriceBooks.flatMap(priceBook => priceBook.dealerSku || []);

      setDealerSkuList(dealerSkuList);
      setPriceBookList(filteredPriceBooks);
    }
    if (name === "priceBookId" && value && filter.dealerId) {
      const selectedValues = value.map(item => item.value);
      const matchingPriceBooks = priceBookList.filter(priceBook => selectedValues.includes(priceBook.value));
      setSelected(matchingPriceBooks);
      setDealerSkuSelected(matchingPriceBooks.flatMap(priceBook => priceBook.dealerSku || []));

      setFilters(prev => ({
        ...prev,
        [name]: matchingPriceBooks.map(item => item.value)
      }));

      // // Automatically filter by category if no category is selected
      // if (!filter.categoryId) {
      //   const selectedPriceBook = matchingPriceBooks[0]; 
      //   if (selectedPriceBook) {
      //     handleFilterChange('categoryId', selectedPriceBook.categoryId);
      //   }
      // }
    }

  };

  const handleFilterChangeCat = (name, value) => {
    let filteredPriceBooks = [];
    let dealerSkuList = [];

    setFiltersCategory(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === "categoryId") {
      if (!value) {
        // Show all priceBooks and dealerSkus when category is not selected
        filteredPriceBooks = categoryListCat.flatMap(category => category.priceBooks || []);
        dealerSkuList = filteredPriceBooks.flatMap(priceBook => priceBook.dealerSku || []);

        setPriceBookListCat(filteredPriceBooks);
        setDealerSkuListServicer(dealerSkuList);
      } else {
        const filteredCategory = categoryListCat.find(category => category.value === value);
        filteredPriceBooks = filteredCategory?.priceBooks || [];
        dealerSkuList = filteredPriceBooks.flatMap(priceBook => priceBook.dealerSku || []);

        setPriceBookListCat(filteredPriceBooks);
        setDealerSkuListServicer(dealerSkuList);
      }
      // Reset dependent filters
      setSelectedCat([]);
      setDealerSkuSelectedServicer([]);
      handleFilterChangeCat('priceBookId', []);
    }

    if (name === "priceBookId" && value) {
      const selectedValues = value.map(item => item.value);
      const matchingPriceBooks = priceBookListCat.filter(priceBook => selectedValues.includes(priceBook.value));
      console.log(priceBookListCat)
      setSelectedCat(matchingPriceBooks);

      // Automatically select related dealer SKUs
      const selectedDealerSkus = matchingPriceBooks.flatMap(priceBook => priceBook.dealerSku || []);
      setDealerSkuSelectedServicer(selectedDealerSkus);

      setFiltersCategory(prev => ({
        ...prev,
        [name]: matchingPriceBooks.map(item => item.value)
      }));
    }
  };


  const handleFilterChangeServicer = (name, value) => {
    setFiltersServicer(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === "servicerId" && value) {
      const filteredServicer = servicerListServicer.find(servicer => servicer.value === value);
      console.log(filteredServicer)
      if (filteredServicer) {
        const allPriceBooks = filteredServicer?.categories?.flatMap(category => category.priceBooks || []);
          const allDealerSku = allPriceBooks?.flatMap(priceBook => priceBook.dealerSku || []);
        setCategoryListServicer(filteredServicer.categories);
        setDealerListServicer(filteredServicer.dealer)
        setPriceBookListServicer(allPriceBooks);
          setDealerSkuListServicer(allDealerSku)
           setFiltersServicer({
            dealerId: "",
            priceBookId: [],
            categoryId:""
        } )
          setSelected([]);
          setDealerSkuSelected([]);
      }
      setSelectedSer([]);
      setDealerSkuSelectedServicer([]);
    }
    if (name === "categoryId") {
      let filteredPriceBooks = [];
      let dealerSkuList = [];
      setSelectedSer([]);
      setDealerSkuSelectedServicer([]);
      handleFilterChangeServicer('priceBookId', []);
      if (value) {
        const filteredCategory = categoryListCat.find(category => category.value === value);
        filteredPriceBooks = filteredCategory?.priceBooks || [];
      } else {
        filteredPriceBooks = categoryListCat.flatMap(category => category.priceBooks || []);
      }
      dealerSkuList = filteredPriceBooks.flatMap(priceBook => priceBook.dealerSku || []);

      setDealerSkuSelectedServicer(dealerSkuList);
      setPriceBookListServicer(filteredPriceBooks);

    }
    if (name === "priceBookId" ) {
      console.log(value)
      const selectedValues = value.map(item => item.value);
      console.log(selectedValues,priceBookListServicer)
      const matchingPriceBooks = priceBookListServicer.filter(priceBook => selectedValues.includes(priceBook.value));
      console.log(matchingPriceBooks)
      setSelectedSer(matchingPriceBooks);
      setDealerSkuSelectedServicer(matchingPriceBooks.flatMap(priceBook => priceBook.dealerSku || []));

      setFiltersServicer(prev => ({
        ...prev,
        [name]: matchingPriceBooks.map(item => item.value)
      }));

      // // Automatically filter by category if no category is selected
      // if (!filter.categoryId) {
      //   const selectedPriceBook = matchingPriceBooks[0]; 
      //   if (selectedPriceBook) {
      //     handleFilterChange('categoryId', selectedPriceBook.categoryId);
      //   }
      // }
    }

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
    setFilterLoading(true);
    if (activeButton == "category") {
      setFiltersForClaimCategory(filterCategory);
    } else if (activeButton == "dealer") {
      setFiltersForClaimDealer(filter);
    } else if (activeButton == "servicer") {
      setFiltersForClaimServicer(filterServicer);
    }
    setFilterLoading(false);
  };

  const handleResetFilters = () => {
    setSelectedRange({
      startDate: new Date(new Date().setDate(new Date().getDate() - 14)),
      endDate: new Date(),
    });
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
    setDealerSkuSelected([]);
    setSelectedCat([]);
    setSelectedSer([]);
    setDealerSkuSelectedServicer([])
    // getDatasetAtEvent(data);
  };
  const [buttonTextColor, setButtonTextColor] = useState('');
  const [backGroundColor, setBackGroundColor] = useState('');

  useEffect(() => {
    const storedUserDetails = getUserDetailsFromLocalStorage();

    if (storedUserDetails) {
      const colorScheme = storedUserDetails.colorScheme;
      colorScheme.forEach(color => {
        switch (color.colorType) {
          case 'buttonColor':
            setBackGroundColor(color.colorCode);
            break;
          case 'buttonTextColor':
            setButtonTextColor(color.colorCode);
            break;
          default:
            break;
        }
      });
    }
  }, []);


  const InactiveTabButton = ({ tab, onClick }) => (
    <InActiveButton
      className="flex self-center mr-2 w-[95%] !px-2 !py-1 rounded-xl border-[1px] border-Light-Grey "
      onClick={onClick}
    >
      <div
        style={{
          maskImage: `url(${tab.icons})`,
          WebkitMaskImage: `url(${tab.icons})`,
          backgroundColor: backGroundColor,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskSize: "contain",
          WebkitMaskSize: "contain",
        }}
        className="self-center pr-1 py-1 h-4 w-4"
      />
      <span
        style={{
          borderColor: backGroundColor,
          borderLeftWidth: "1px",
          paddingLeft: "7px",
          color: backGroundColor,
        }}
        className="ml-1 py-1 text-sm font-Regular"
      >
        {tab.label}
      </span>
    </InActiveButton>
  );

  // ActiveTabButton Component
  const ActiveTabButton = ({ tab, onClick }) => (
    <Button
      className="flex self-center mr-2 w-[95%] !px-2 !py-1 rounded-xl border-[1px] border-Light-Grey"
      onClick={onClick}
    >
      <div
        style={{
          maskImage: `url(${tab.Activeicons})`,
          WebkitMaskImage: `url(${tab.Activeicons})`,
          backgroundColor: buttonTextColor,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskSize: "contain",
          WebkitMaskSize: "contain",
        }}
        className="self-center pr-1 py-1 h-4 w-4"
      />
      <span
        style={{
          borderColor: buttonTextColor,
          borderLeftWidth: "1px",
          paddingLeft: "7px",
          color: buttonTextColor,
        }}
        className="ml-1 py-1 text-sm font-Regular"
      >
        {tab.label}
      </span>
    </Button>
  );
  return (
    <>
      {loading ? (
        <>
          <div className=" h-[400px] w-full flex py-5">
            <div className="self-center mx-auto">
              <RotateLoader color="#333" />
            </div>
          </div>
        </>
      ) : (
        <div className="pb-8 mt-2 px-3 ">
          <Headbar />
          <div className="flex">
            <div className="pl-3">
              <p className="font-bold text-[36px] leading-9 mb-[3px]">
                Reporting
              </p>
              <ul className="flex self-center">
                <li className="text-sm font-Regular">
                  <Link to={"/"}>Home / </Link>
                </li>
                <li className="text-sm font-semibold ml-1 pt-[1px]">
                  {activeTab}
                </li>
              </ul>
            </div >
          </div >
          <Card className="p-3 mt-4 rounded-[30px] !border-[1px] !border-Light-Grey">
            <div className="flex w-full mb-3">
              <p className="p-0 self-center font-bold mr-4">Filter By :</p>
              <div className="self-center">
                {!isResellerClaims && (
                  <>
                    {activeButton !== "dealer" ?
                      <InActiveButton
                        onClick={() => handleButtonClick("dealer")}
                        className={`!rounded-e-[0px] !py-1 !px-2 !border-light-black !border-[1px] `}
                      >
                        Dealer
                      </InActiveButton>
                      :
                      <Button
                        onClick={() => handleButtonClick("dealer")}
                        className={`!rounded-e-[0px] !py-1 !px-2 !border-light-black !border-[1px] `}
                      >
                        Dealer
                      </Button>
                    }
                  </>
                )}
                {!isServicerClaims && (
                  <>
                    {activeButton !== "servicer" ?
                      <InActiveButton
                        onClick={() => handleButtonClick("servicer")}
                        className={` !px-2 !py-1 !border-light-black !border-[1px]  ${isResellerClaims ? "!rounded-e-[0px]" : "!rounded-[0px]"
                          }`}
                      >
                        Servicer
                      </InActiveButton>
                      :
                      <Button
                        onClick={() => handleButtonClick("servicer")}
                        className={` !px-2 !py-1 !border-light-black !border-[1px]  ${isResellerClaims ? "!rounded-e-[0px]" : "!rounded-[0px]"
                          }`}
                      >
                        Servicer
                      </Button>}
                  </>


                )}
                {activeButton !== "category" ? <InActiveButton
                  onClick={() => handleButtonClick("category")}
                  className={`!rounded-s-[0px] !px-2 !py-1 !border-light-black !border-[1px]  `}
                >
                  Category
                </InActiveButton>
                  :
                  <Button
                    onClick={() => handleButtonClick("category")}
                    className={`!rounded-s-[0px] !px-2 !py-1 !border-light-black !border-[1px]  `}
                  >
                    Category
                  </Button>}
              </div>
            </div>
            <Grid
              className={`${activeButton === "dealer"
                ? "!grid-cols-12"
                : activeButton === "category"
                  ? "!grid-cols-7"
                  : "!grid-cols-10"
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
                  <div
                    className="col-span-2 self-center pl-1"
                    style={{ display: isServicerClaims ? "none" : "block" }}
                  >
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
                  <div className="col-span-2 self-center relative pl-1">
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
                        selectSomeItems: "Select ",
                      }}
                      className="SearchSelect css-b62m3t-container p-[0.425rem]"
                    />
                    <small className="absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-[12px] left-[17px] px-1 -translate-y-4 !hover:bg-grayf9 scale-75 !bg-white ">
                      Product SKU
                    </small>
                  </div>
                  <div className="col-span-2 self-center pl-1 relative">
                    <MultiSelect
                      label="Dealer SKU"
                      name="dealerSku"
                      placeholder="Dealer SKU"
                      value={dealerSkuSelected}
                      options={dealerSkuList}
                      pName="dealer SKU"
                      onChange={(value) => {
                        setDealerSkuSelected(value);
                        handleFilterChange("priceBookId", value);
                      }}
                      labelledBy="Select"
                      overrideStrings={{
                        selectSomeItems: "Select",
                      }}
                      className="SearchSelect css-b62m3t-container p-[0.425rem]"
                    />
                    <small className="absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-[12px] left-[17px] px-1 -translate-y-4 !hover:bg-grayf9 scale-75 !bg-white">
                      Dealer SKU
                    </small>
                  </div>
                  <div className="col-span-2 self-center ml-auto pl-3">
                    <Button className="mr-2" onClick={handleApplyFilters}>
                      Filter
                    </Button>
                    <InActiveButton
                      className=" border-[1px] border-[#333]"
                      onClick={handleResetFilters}
                    >
                      Reset
                    </InActiveButton>
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
                    <small className="absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-[12px] left-[25px] px-1 -translate-y-4 !hover:bg-grayf9 scale-75 !bg-white">
                      Product SKU
                    </small>
                  </div>
                  <div className="col-span-1 self-center ml-auto pl-3">
                    <Button className="mr-2" onClick={handleApplyFilters}>
                      Filter
                    </Button>
                    <InActiveButton
                      className="border-[1px] border-[#333]"
                      onClick={handleResetFilters}
                    >
                      Reset
                    </InActiveButton>
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
                  {isResellerClaims ? (
                    ""
                  ) : (
                    <div className="col-span-2 self-center pl-3">
                      <SelectBoxWithSearch
                        label="Dealer Name"
                        name="dealerId"
                        value={filterServicer.dealerId}
                        onChange={handleFilterChangeServicer}
                        placeholder="Dealer Name"
                        className="!bg-white"
                        className1="filter"
                        pName="Dealer Name"
                        options={dealerListServicer}
                      />
                    </div>
                  )}

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
                    <small className="absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-[12px] left-[17px] px-1 -translate-y-4 !hover:bg-grayf9 scale-75 !bg-white ">
                      Product SKU
                    </small>
                  </div>
                  <div className="col-span-2 self-center pl-1 relative">
                    <MultiSelect
                      label="Dealer SKU"
                      name="dealerSku"
                      placeholder="Dealer SKU"
                      value={dealerSkuSelectedServicer}
                      options={dealerSkuListServicer}
                      pName="dealer SKU"
                      onChange={(value) => {
                        setDealerSkuSelectedServicer(value);
                        handleFilterChangeServicer("priceBookId", value);
                      }}
                      labelledBy="Select"
                      overrideStrings={{
                        selectSomeItems: "Select",
                      }}
                      className="SearchSelect css-b62m3t-container p-[0.425rem]"
                    />
                    <small className="absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-[12px] left-[17px] px-1 -translate-y-4 !hover:bg-grayf9 scale-75 !bg-white">
                      Dealer SKU
                    </small>
                  </div>
                  {isResellerClaims && <div className="col-span-2"></div>}
                  <div className="col-span-2 self-center ml-auto pl-3">
                    <Button className="mr-2" onClick={handleApplyFilters}>
                      Filter
                    </Button>
                    <InActiveButton
                      className="border-[1px] border-[#333]"
                      onClick={handleResetFilters}
                    >
                      Reset
                    </InActiveButton>
                  </div>
                </>
              )}
            </Grid>
          </Card >

          <Grid className="!grid-cols-3">
            <div className="col-span-3">
              <Grid className="mt-2">
                <div className="col-span-5">
                  <div className="bg-white rounded-[30px] p-3 border-[1px] border-Light-Grey">
                    <Grid className="!gap-1 !grid-cols-2">
                      {tabs.map((tab) =>
                        activeTab === tab.id ? (
                          <ActiveTabButton key={tab.id} tab={tab} onClick={() => handleTabClick(tab.id)} />
                        ) : (
                          <InactiveTabButton key={tab.id} tab={tab} onClick={() => handleTabClick(tab.id)} />
                        )
                      )}
                    </Grid>
                  </div >
                </div>
              </Grid>
            </div >
            <div className="col-span-1 self-center"></div>
          </Grid >
          {filterLoading ? <>
            <div className=" h-[400px] w-full flex py-5">
              <div className="self-center mx-auto">
                <RotateLoader color="#333" />
              </div>
            </div>{" "}
          </> :
            <ClaimContent
              activeTab={activeTab}
              selectedRange={selectedRange}
              activeButton={activeButton}
              setSelectedRange={setSelectedRange}
            />
          }
        </div >
      )
      }
    </>
  );
}

export default Claims;