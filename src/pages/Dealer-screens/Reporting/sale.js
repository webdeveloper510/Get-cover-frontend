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
import Card from "../../../common/card";
import { getUserDetailsFromLocalStorage } from "../../../services/extraServices";

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
  const [activeButton, setActiveButton] = useState("category");
  const [selectedCat, setSelectedCat] = useState([]);
  const [categoryListCat, setCategoryListCat] = useState([]);
  const [priceBookListCat, setPriceBookListCat] = useState([]);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const {  setFiltersCategoryTab,setFiltersForCategory,resetAllFilters } = useMyContext();

  useEffect(() => {
    localStorage.setItem("SaleMenu", activeTab);
  }, [activeTab]);

  // useEffect(() => {
  //   getDatasetAtEvent({
  //     dealerId: "",
  //     priceBookId: [],
  //     categoryId: "",
  //   });
  // }, []);
  useEffect(() => {
    resetAllFilters();
    getDatasetAtEvent();
  }, []);
  const getDatasetAtEvent = async (data) => {
    try {
      // setLoading(true);
      const res = await getFilterListDropdown(
        isResellerReporting ? "resellerPortal" : "dealerPortal"
      );
   
      const transformedData = res.result[0].categories.map((category) => ({
        label: category?.categoryName , 
        value: category?.categoryId , 
        priceBooks: (category?.priceBooks).map((priceBook) => ({
          label: priceBook?.priceBookName ,
          value: priceBook?.priceBookId ,
        })),
      }));
      const allPriceBooks = res.result[0].categories.flatMap((category) =>
        category?.priceBooks.map((priceBook) => ({
          label: priceBook?.priceBookName ,
          value: priceBook?.priceBookId ,
        }))
      );
      console.log("allPriceBooks",allPriceBooks)
       setCategoryListCat(transformedData);
       setPriceBookListCat(allPriceBooks);
    } catch (error) {
 
    }
    // setLoading(false);
  };
  const [buttonTextColor, setButtonTextColor] = useState('');
  const [backGroundColor, setBackGroundColor] = useState('');

  useEffect(() => {
    const storedUserDetails = getUserDetailsFromLocalStorage();

    if (storedUserDetails) {
      const colorScheme = storedUserDetails.colorScheme;
      colorScheme?.forEach(color => {
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
    setFiltersCategory(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === "categoryId") {
      const filteredCategory = categoryListCat.find(category => category.value === value);
      if (filteredCategory) {    
        setPriceBookListCat(filteredCategory.priceBooks);
      }
      setSelectedCat([])
      handleFilterChangeforCategory('priceBookId', []);
    }
    if (name === "priceBookId" && value) {
      const selectedValues = value.map(item => item.value);
      console.log(selectedValues)
      const matchingPriceBooks = priceBookListCat.filter(priceBook => selectedValues.includes(priceBook.value));
      // setSelectedCat(matchingPriceBooks);
    console.log(matchingPriceBooks)
      setFiltersCategory(prev => ({
        ...prev,
        [name]: matchingPriceBooks.map(item => item.value)
      }));
   }
   };

  const handleApplyFilters = () => {
    setFiltersForCategory(filterCategory);
  };

  // const handleResetFilters = () => {
  //   let data = {
  //     dealerId: "",
  //     priceBookId: [],
  //     categoryId: "",
  //   };
 
  // };
  const handleResetFilters = () => {
    resetAllFilters();
    let data = {
      dealerId: "",
      priceBookId: [],
      categoryId: "",
    };
    console.log(data)
    setFiltersForCategory(data)
    setFiltersCategory(data);
    setSelectedCat([]);
    // handleApplyFilters()

  };

  return (
    <>
      {loading || loading1 ?
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
                  <Link to={`${location.pathname.includes("/reseller/sale") ? '/reseller/dashboard' : '/dealer/dashboard'}`}>Home / </Link>
                </li>
                <li className="text-sm text-neutral-grey font-semibold ml-1 pt-[1px]">
                  Sale ({activeTab})
                </li>
              </ul>
            </div>
          </div>
          <Card className="p-3 mt-4">
            <p className="p-0 self-center font-bold mr-4 mb-2">Filter by </p>
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
                <small className="absolute text-base font-Regular leading-6 duration-300 transform origin-[0] top-[12px] left-[17px] px-1 -translate-y-4 !hover:bg-grayf9 scale-75 !bg-white text-[#5D6E66]">
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
          </Card>
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
                        className={`flex self-center w-full !px-2 !py-1 rounded-xl border-[1px] border-Light-Grey ${activeTab === tab.id
                          ? ""
                          : "!bg-grayf9 !text-black"
                          }`}
                        onClick={() => handleTabClick(tab.id)}
                      >
                        <div
                          style={{
                            maskImage: `url(${activeTab === tab.id ? tab.Activeicons : tab.icons})`,
                            WebkitMaskImage: `url(${activeTab === tab.id ? tab.Activeicons : tab.icons})`,
                            backgroundColor: activeTab === tab.id ? buttonTextColor : 'black',
                            maskRepeat: 'no-repeat',
                            WebkitMaskRepeat: 'no-repeat',

                            maskPosition: 'center',
                            WebkitMaskPosition: 'center',
                            maskSize: 'contain',
                            WebkitMaskSize: 'contain'
                          }}
                          className="self-center pr-1 py-1 h-4 w-4"
                        />
                        <span
                          style={{
                            borderColor: activeTab === tab.id ? buttonTextColor : 'black',
                            borderLeftWidth: '1px',
                            paddingLeft: '7px',
                            color: activeTab === tab.id ? buttonTextColor : 'black',
                          }}
                          className={`ml-1 py-1 text-sm font-Regular ${activeTab === tab.id ? "text-white" : "text-black"
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
