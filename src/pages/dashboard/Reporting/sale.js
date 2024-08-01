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
import RadioButton from "../../../common/radio";
import { RotateLoader } from "react-spinners";

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
  const [filterCategory, setFiltersCategory] = useState({
    dealerId: "",
    priceBookId: [],
    categoryId: "",
  });

  const [activeTab, setActiveTab] = useState(getInitialActiveTab());
  const [activeButton, setActiveButton] = useState("dealer");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [dealerList, setDealerList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [priceBookList, setPriceBookList] = useState([]);
  const [selectedCat, setSelectedCat] = useState([]);
  const [categoryListCat, setCategoryListCat] = useState([]);
  const [priceBookListCat, setPriceBookListCat] = useState([]);
  const state = cityData;
  const containerRef = useRef(null);

  const { setAppliedFilters, setFiltersForCategory } = useMyContext();

  useEffect(() => {
    localStorage.setItem("SaleMenu", activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (activeButton === "dealer") {
      getDatasetAtEvent({});
    } else {
      getDatasetAtEvent({
        dealerId: "",
        priceBookId: [],
        categoryId: "",
      });
    }
  }, [activeButton]);

  const getDatasetAtEvent = async (data) => {
    try {
      setLoading(true);
      const res = await getFilterList(data);
      if (activeButton === "dealer") {
        setDealerList(res.result.getDealers);
        setCategoryList(res.result.getCategories);
        setPriceBookList(res.result.getPriceBooks);
      } else {
        setCategoryListCat(res.result.getCategories);
        setPriceBookListCat(res.result.getPriceBooks);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sales data:", error);
      setLoading(false);
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
    let updatedFilters = { ...filter };
 
    if (name === "dealerId") {
      updatedFilters = { dealerId: value, categoryId: "", priceBookId: [] };
      setSelected([]);
    } else if (name === "categoryId") {
      updatedFilters.categoryId = value;
      setSelected([]);
    } else if (name === "priceBookId") {
      updatedFilters.priceBookId = value.map((item) => item.label);
    }

 ;
    setFilters(updatedFilters);
    getDatasetAtEvent(updatedFilters);
  };

  const handleFilterChangeforCategory = (name, value) => {

    let updatedFilters = { ...filterCategory };

    if (name === "categoryId") {
      updatedFilters = { categoryId: value, priceBookId: [], dealerId: "" };
      setSelectedCat([]);
    } else if (name === "priceBookId") {
      updatedFilters.priceBookId = value.map((item) => item.label);
    }

    setFiltersCategory(updatedFilters);
    getDatasetAtEvent(updatedFilters);
   
  };

  const handleRadioChange = (event) => {
    setActiveButton(event.target.value);
  };

  const handleApplyFilters = () => {
    setLoading(true);
    activeButton === "category"
      ? setFiltersForCategory(filterCategory)
      : setAppliedFilters(filter);
      setLoading(false);
  };

  const handleResetFilters = () => {
    let data = {
      dealerId: "",
      priceBookId: [],
      categoryId: "",
    };

    if (activeButton === "category") {
      setFiltersForCategory(data);
      setFiltersCategory(data);
      setSelectedCat([]);
    } else {
      setAppliedFilters(data);
      setFilters(data);
      setSelected([]);
    }
  };

  return (
    <>
    {loading ? <>
      <div className=" h-[400px] w-full flex py-5">
                  <div className="self-center mx-auto">
                    <RotateLoader color="#333" />
                  </div>
                </div> </> :
    
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
       <div className="flex w-full mb-3">
         <p className="p-0 font-bold self-center mr-4">Filter By :</p>{" "}
         <div className="self-center">
           <Button
             onClick={() => handleButtonClick("dealer")}
             className={`!rounded-e-[0px] !py-1 !px-2 border-[1px] ${
               activeButton !== "dealer" && "!bg-[white] !text-[#333] border-light-black"
             }`}
           >
             Dealer
           </Button>
           <Button
             onClick={() => handleButtonClick("category")}
             className={`!rounded-s-[0px] !px-2 !py-1 border-[1px] ${
               activeButton === "dealer" && "!bg-[white] !text-[#333] border-light-black "
             }`}
           >
             Category
           </Button>
         </div>
       </div>
       <Grid
         className={`${
           activeButton === "dealer" ? "grid-cols-12" : "!grid-cols-5"
         } !gap-0`}
       >
         {activeButton === "dealer" && (
           <>
             <div className="col-span-3 self-center">
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
                 <div className="col-span-3 self-center pl-1">
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
                 <div className="col-span-3 self-center pl-1 relative">
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
                       selectSomeItems: "Select",
                     }}
                     className="SearchSelect css-b62m3t-container p-[0.425rem]"
                   />
                   <small className="absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-[12px] left-[17px] px-1 -translate-y-4 !hover:bg-grayf9 scale-75 !bg-white">
                     Product SKU
                   </small>
                 </div>
             <div className="col-span-3 self-center ml-auto pl-3 flex">
               <Button onClick={handleApplyFilters}>Filter</Button>
               <Button
                 className="!ml-2 !bg-white !border-[1px] !border-[#333] !text-[#333]"
                 onClick={handleResetFilters}
               >
                 Reset
               </Button>
             </div>
           </>
         )}
         {activeButton === "category" && (
           <>
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
                   <small className="absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-[12px] left-[17px] px-1 -translate-y-4 !hover:bg-grayf9 scale-75 !bg-white">
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
           </>
         )}
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
                       ? ""
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