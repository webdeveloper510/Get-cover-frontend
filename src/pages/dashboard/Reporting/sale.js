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
import { RotateLoader } from "react-spinners";
import { MultiSelect } from "react-multi-select-component";

function Sale() {
  const getInitialActiveTab = () => {
    const storedTab = localStorage.getItem("SaleMenu");
    return storedTab ? storedTab : "Amount";
  };
  const [selected, setSelected] = useState([]);
  const [activeTab, setActiveTab] = useState(getInitialActiveTab()); // Set the initial active tab
  const state = cityData;
  const containerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("SaleMenu", activeTab);
  }, [activeTab]);
  const options = [
    { label: "Grapes ", value: "grapes" },
    { label: "Mango ", value: "mango" },
    { label: "Strawberry ", value: "strawberry", disabled: true },
    { label: "Watermelon ", value: "watermelon" },
    { label: "Pear ", value: "pear" },
    { label: "Apple ", value: "apple" },
    { label: "Tangerine ", value: "tangerine" },
    { label: "Pineapple ", value: "pineapple" },
    { label: "Peach ", value: "peach" },
  ];
  const tabs = [
    {
      id: "Amount",
      label: "Amount",
      icons: all,
      Activeicons: AllActive,
    },
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
  const [activeButton, setActiveButton] = useState("dealer");

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  return (
    <>
      <div className="pb-8 mt-2 px-3 relative overflow-x-hidden bg-grayf9">
        <Headbar />
        <div className="flex">
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9 mb-[3px]">
              Reporting
            </p>
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
          <div className="col-span-3 flex">
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
          <div className="col-span-9">
            <Grid
              className={`${
                activeButton === "dealer" ? "grid-cols-9" : "grid-cols-5"
              } !gap-0`}
            >
              {activeButton === "dealer" && (
                <>
                  <div className="col-span-2 self-center">
                    <SelectBoxWithSearch
                      label=""
                      name="state"
                      placeholder="Dealer Name"
                      className="!bg-white"
                      className1="filter"
                      options={state}
                      pName="Dealer Name"
                    />
                  </div>
                  <div className="col-span-2 self-center pl-1">
                    <SelectBoxWithSearch
                      label=""
                      name="state"
                      placeholder="Reseller Name"
                      className="!bg-white"
                      className1="filter"
                      options={state}
                      pName="Reseller Name"
                    />
                  </div>
                  <div className="col-span-2 self-center pl-1">
                    <SelectBoxWithSearch
                      label=""
                      name="state"
                      placeholder="Category Name"
                      className="!bg-white"
                      className1="filter"
                      options={state}
                      pName="Category Name"
                    />
                  </div>
                  <div className="col-span-2 self-center pl-1">
                    <MultiSelect
                      options={options}
                      value={selected}
                      onChange={setSelected}
                      labelledBy="Select"
                      overrideStrings={{
                        selectSomeItems: "Select Product SKU",
                      }}
                      className="SearchSelect css-b62m3t-container p-[0.425rem]"
                    />
                  </div>
                  <div className="col-span-1 self-center mx-auto pl-3">
                    <Button>Filter</Button>
                  </div>
                </>
              )}
              {activeButton === "category" && (
                <>
                  <div className="col-span-2 self-center pl-3">
                    <SelectBoxWithSearch
                      label=""
                      name="state"
                      placeholder="Category Name"
                      className="!bg-white"
                      className1="filter"
                      options={state}
                      pName="Enter Category"
                    />
                  </div>
                  <div className="col-span-2 self-center pl-3">
                    <MultiSelect
                      options={options}
                      value={selected}
                      onChange={setSelected}
                      labelledBy="Select"
                      overrideStrings={{
                        selectSomeItems: "Select Product SKU",
                      }}
                      className="SearchSelect css-b62m3t-container p-[0.425rem]"
                    />
                  </div>
                  <div className="col-span-1 self-center mx-auto pl-3">
                    <Button>Filter</Button>
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
    </>
  );
}

export default Sale;
