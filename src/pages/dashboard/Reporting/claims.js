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

function Claims() {
  const getInitialActiveTab = () => {
    const storedTab = localStorage.getItem("ClaimMenu");
    return storedTab ? storedTab : "Amount";
  };

  const [selected, setSelected] = useState([]);
  const [activeTab, setActiveTab] = useState(getInitialActiveTab());
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 14)),
    endDate: new Date(),
  });

  const state = cityData;

  useEffect(() => {
    localStorage.setItem("ClaimMenu", activeTab);
  }, [activeTab]);

  const options = [
    { label: "Grapes ", value: "grapes" },
    { label: "Mango ", value: "mango" },
    { label: "Strawberry ", value: "strawberry" },
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
  const [activeButton, setActiveButton] = useState("dealer");

  const handleButtonClick = (button) => {
    setActiveButton(button);
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
        <Grid className="mt-2">
          <div className="col-span-4 flex">
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
                className={`!rounded-[0px] !px-2 !py-1 !border-[#333333] !border-[1px] ${
                  activeButton !== "category" && "!bg-[white] !text-[#333] "
                }`}
              >
                Category
              </Button>
              <Button
                onClick={() => handleButtonClick("servicer")}
                className={`!rounded-s-[0px] !px-2 !py-1 !border-[#333333] !border-[1px] ${
                  activeButton !== "servicer" && "!bg-[white] !text-[#333] "
                }`}
              >
                Servicer
              </Button>
            </div>
          </div>
          <div className="col-span-8">
            <Grid
              className={`${
                activeButton === "dealer"
                  ? "grid-cols-9"
                  : activeButton === "category"
                  ? "grid-cols-5"
                  : "grid-cols-5"
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
                      placeholder="Servicer Name"
                      className="!bg-white"
                      className1="filter"
                      options={state}
                      pName="Servicer Name"
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
                      pName="Enter Category Name"
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
              {activeButton === "servicer" && (
                <>
                  <div className="col-span-2 self-center pl-3">
                    <SelectBoxWithSearch
                      label=""
                      name="state"
                      placeholder="Servicer Name"
                      className="!bg-white"
                      className1="filter"
                      options={state}
                      pName="Servicer Name"
                    />
                  </div>
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
                  <div className="col-span-1 self-center mx-auto pl-3">
                    <Button>Filter</Button>
                  </div>
                </>
              )}
            </Grid>
          </div>
        </Grid>
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
              setSelectedRange={setSelectedRange}
            />
          </div>
        </Grid>
      </div>
    </>
  );
}

export default Claims;
