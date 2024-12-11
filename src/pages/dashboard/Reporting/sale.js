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
import { RotateLoader } from "react-spinners";
import Card from "../../../common/card";
import { getUserDetailsFromLocalStorage } from "../../../services/extraServices";
import InActiveButton from "../../../common/inActiveButton";
import { getDropDownValueForDealer } from "../../../services/userServices";

function Sale() {
  const [loading, setLoading] = useState(false)
  const [filterLoading, setFilterLoading] = useState(false)
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

  const [selected, setSelected] = useState([]);
  const [dealerSkuSelected, setDealerSkuSelected] = useState([]);
  const [dealerSkuSelectedCat, setDealerSkuSelectedCat] = useState([]);
  const [dealerList, setDealerList] = useState([]);
  const [dealerSkuList, setDealerSkuList] = useState([]);
  const [dealerSkuListCat, setDealerSkuListCat] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [priceBookList, setPriceBookList] = useState([]);
  const [selectedCat, setSelectedCat] = useState([]);
  const [categoryListCat, setCategoryListCat] = useState([]);
  const [priceBookListCat, setPriceBookListCat] = useState([]);

  const containerRef = useRef(null);

  const { setAppliedFilters, setFiltersForCategory, resetAllFilters } =
    useMyContext();

  useEffect(() => {
    localStorage.setItem("SaleMenu", activeTab);
  }, [activeTab]);

  useEffect(() => {
    getDropDownValues(activeButton)
  }, [activeButton]);

  useEffect(() => {
    resetAllFilters();

  }, []);


  const [buttonTextColor, setButtonTextColor] = useState('');
  const [backGroundColor, setBackGroundColor] = useState('');
  const [buttonTextColor1, setButtonTextColor1] = useState('');
  const [backGroundColor1, setBackGroundColor1] = useState('');

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
          case 'inActiveButtonBackgroundColor':
            setBackGroundColor1(color.colorCode);
            break;
          case 'inActiveButtonColor':
            setButtonTextColor1(color.colorCode);
            break;
          default:
            break;
        }
      });
    }
  }, []);

  const getDropDownValues = async () => {
    const data = await getDropDownValueForDealer(activeButton);

    if (activeButton == "dealer") {
      const dealers = data.result.map(dealer => {
        const categories = (dealer.categories || []).map(category => {
          const priceBooks = (category.priceBooks || []).map(priceBook => ({
            label: priceBook.priceBookName,
            value: priceBook.priceBookId,
            categoryId: category.categoryId,
            dealerSku: (priceBook.dealerSku || []).map(skuObj => ({
              label: skuObj.sku,
              value: priceBook.priceBookId
            }))
          }));

          return {
            label: category.categoryName,
            value: category.categoryId,
            priceBooks, // Nested priceBooks within each category
          };
        });

        console.log('All Categories:', categories);

        return {
          label: dealer.name,
          value: dealer._id,
          categories
        };
      });

      setDealerList(dealers);
    }
    else {
      const categoriesWithPriceBooks = [];
      const allPriceBooks = [];
      const allDealerSkus = [];
      (data.result || []).forEach(category => {
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
      console.log(allDealerSkus);
      setDealerSkuListCat(allDealerSkus); // Call a function or update state to store the list
    }


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

      // Automatically filter by category if no category is selected
      // if (!filter.categoryId) {
      //   const selectedPriceBook = matchingPriceBooks[0]; // Assuming the first match
      //   if (selectedPriceBook) {
      //     handleFilterChange('categoryId', selectedPriceBook.categoryId);
      //   }
      // }
    }

  };

  const handleFilterChangeforCategory = (name, value) => {
    let filteredPriceBooks = [];
    let dealerSkuList = [];
    setFiltersCategory(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === "categoryId") {
      if (!value) {
        filteredPriceBooks = categoryListCat.flatMap(category => category.priceBooks || []);
        dealerSkuList = filteredPriceBooks.flatMap(priceBook => priceBook.dealerSku || []);

        setPriceBookListCat(filteredPriceBooks);
        setDealerSkuListCat(dealerSkuList);
      } else {
        const filteredCategory = categoryListCat.find(category => category.value === value);
        filteredPriceBooks = filteredCategory?.priceBooks || [];
        dealerSkuList = filteredPriceBooks.flatMap(priceBook => priceBook.dealerSku || []);

        setPriceBookListCat(filteredPriceBooks);
        setDealerSkuListCat(dealerSkuList);
      }
      setSelectedCat([]);
      setDealerSkuSelectedCat([]);
      handleFilterChangeforCategory('priceBookId', []);
    }

    if (name === "priceBookId" && value) {
      const selectedValues = value.map(item => item.value);
      const matchingPriceBooks = priceBookListCat.filter(priceBook => selectedValues.includes(priceBook.value));
      console.log(matchingPriceBooks)
      setSelectedCat(matchingPriceBooks);
      setDealerSkuSelectedCat(matchingPriceBooks.flatMap(priceBook => priceBook.dealerSku || []));

      setFiltersCategory(prev => ({
        ...prev,
        [name]: matchingPriceBooks.map(item => item.value)
      }));
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

  const handleApplyFilters = () => {
    setFilterLoading(true);
    activeButton === "category"
      ? setFiltersForCategory(filterCategory)
      : setAppliedFilters(filter);
    console.log("hello", loading);
    setFilterLoading(false);
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
      setDealerSkuSelected([]);
    }
    setDealerSkuSelectedCat([])

  };
  const InactiveTabButton = ({ tab, onClick }) => (
    <InActiveButton
      className="flex self-center mr-2 w-[95%] !px-2 !py-1 rounded-xl border-[1px] border-Light-Grey "
      onClick={onClick}
    >
      <div
        style={{
          maskImage: `url(${tab.icons})`,
          WebkitMaskImage: `url(${tab.icons})`,
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
          borderLeftWidth: "1px",
          paddingLeft: "7px",
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
          </div>{" "}
        </>
      ) : (
        <div className="pb-8 mt-2 px-3">
          <Headbar />
          <div className="flex">
            <div className="pl-3">
              <p className="font-bold text-[36px] leading-9 mb-[3px]">
                Reporting
              </p>
              <ul className="flex self-center">
                <li className="text-sm text-neutral-grey font-Regular">
                  <Link to={"/"}>Home / </Link>
                </li>
                <li className="text-sm text-neutral-grey font-semibold ml-1 pt-[1px]">
                  Sale ({activeTab})
                </li>
              </ul>
            </div >
          </div >
          <Card className="p-3 mt-4 rounded-[30px] border-[1px] border-Light-Grey">
            <div className="flex w-full mb-3">
              <p className="p-0 font-bold self-center mr-4">Filter By :</p>{" "}
              <div className="self-center">

                {activeButton === "dealer" ?
                  <>
                    <Button
                      onClick={() => handleButtonClick("dealer")}
                      className={`!rounded-e-[0px] !py-1 !px-2 !border-[1px] `}
                    >
                      Dealer
                    </Button>
                    <InActiveButton
                      onClick={() => handleButtonClick("category")}
                      className={`!rounded-s-[0px] !px-2 !py-1 !border-[1px]  `}
                    >
                      Category
                    </InActiveButton>
                  </>
                  :
                  <>
                    <InActiveButton
                      onClick={() => handleButtonClick("dealer")}
                      className={`!rounded-e-[0px] !py-1 !px-2 !border-[1px] `}
                    >
                      Dealer
                    </InActiveButton>
                    <Button
                      onClick={() => handleButtonClick("category")}
                      className={`!rounded-s-[0px] !px-2 !py-1 !border-[1px]  `}
                    >
                      Category
                    </Button></>

                }

              </div>
            </div>
            <Grid
              className={`${activeButton === "dealer" ? "!grid-cols-10" : "!grid-cols-7"
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
                  {
                    filter.dealerId != "" ? (
                      <>
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
                        <div className="col-span-2 self-center pl-1 relative">
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
                      </>
                    ) :
                      (
                        <div className="col-span-6"></div>
                      )
                  }
                  <div className="col-span-2 self-center ml-auto pl-3 flex">
                    <Button onClick={handleApplyFilters}>Filter</Button>
                    <InActiveButton
                      className="!ml-2 !border-[1px] !border-[#333]"
                      onClick={handleResetFilters}
                    >
                      Reset
                    </InActiveButton>
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
                  <div className="col-span-2 self-center pl-1 relative">
                    <MultiSelect
                      label="Dealer SKU"
                      name="dealerSku"
                      placeholder="Dealer SKU"
                      value={dealerSkuSelectedCat}
                      options={dealerSkuListCat}
                      pName="dealer SKU"
                      onChange={(value) => {
                        setDealerSkuSelectedCat(value);
                        handleFilterChangeforCategory("priceBookId", value);
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

                  <div className="col-span-1 self-center mx-auto pl-3">
                    <Button onClick={handleApplyFilters}>Filter</Button>
                    <InActiveButton
                      className="!ml-2 !border-[1px] !border-[#333]"
                      onClick={handleResetFilters}
                    >
                      Reset
                    </InActiveButton>
                  </div>
                </>
              )}
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
                    {tabs.map((tab) =>
                      activeTab === tab.id ? (
                        <ActiveTabButton key={tab.id} tab={tab} onClick={() => handleTabClick(tab.id)} />
                      ) : (
                        <InactiveTabButton key={tab.id} tab={tab} onClick={() => handleTabClick(tab.id)} />
                      )
                    )}
                  </div>
                </div>
              </Grid>

              <All activeTab={activeTab} activeButton={activeButton} />
            </div>
          </Grid>
        </div >
      )}
    </>
  );
}

export default Sale;