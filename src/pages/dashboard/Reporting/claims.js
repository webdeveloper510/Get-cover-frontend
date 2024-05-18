import React, { useEffect, useState } from "react";
import Headbar from "../../../common/headBar";
import { Link, useNavigate, useParams } from "react-router-dom";
import Grid from "../../../common/grid";
import Button from "../../../common/button";

// Media Import
import AllActive from "../../../assets/images/Reporting/icons/Activeall.svg";
import all from "../../../assets/images/Reporting/icons/all.svg";
import WholesaleActive from "../../../assets/images/Reporting/icons/activeWholesale.svg";
import wholesale from "../../../assets/images/Reporting/icons/Wholesale.svg";
import BreakdownActive from "../../../assets/images/Reporting/icons/activeAdministration.svg";
import breakdown from "../../../assets/images/Reporting/icons/Administration.svg";
import Select from "../../../common/select";
import { cityData } from "../../../stateCityJson";
import All from "./Claim-Tab/all";
import PaidClaim from "./Claim-Tab/paidClaim";
import UnpaidClaim from "./Claim-Tab/unpaidClaim";

function Claims() {
  const getInitialActiveTab = () => {
    const storedTab = localStorage.getItem("ClaimMenu");
    return storedTab ? storedTab : "All";
  };
  const id = useParams();
  const [activeTab, setActiveTab] = useState(getInitialActiveTab()); // Set the initial active tab
  const state = cityData;

  useEffect(() => {
    localStorage.setItem("ClaimMenu", activeTab);
  }, [activeTab]);



  const tabs = [
    {
      id: "All",
      label: "All",
      icons: all,
      className:'col-span-3',
      Activeicons: AllActive,
      content: <All />,
    },
    {
      id: "Paid Claims",
      label: "Paid Claims",
      className:'col-span-4',
      icons: wholesale,
      Activeicons: WholesaleActive,
      content: <PaidClaim />,
    },
    {
      id: "Unpaid Claims",
      label: "Unpaid Claims",
      icons: breakdown,
      className:'col-span-5',
      Activeicons: BreakdownActive,
      content: <UnpaidClaim />,
    }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };
  return (
    <>
      {/* {loading && (
        <div className=" fixed z-[999999] bg-[#333333c7] backdrop-blur-xl  h-screen w-full flex py-5">
          <div className="self-center mx-auto">
            <RotateLoader color="#fff" />
          </div>
        </div>
      )} */}
      <div className="pb-8 mt-2 px-3 relative overflow-x-hidden bg-grayf9">
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

        <Grid className="!grid-cols-3">
          <div className="col-span-3">
            <Grid className="mt-10">
              <div className="col-span-5">
                <div className="bg-[#fff] rounded-[30px] p-3 border-[1px] border-Light-Grey">
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
              <div className="col-span-3"></div>
              <div
                className="col-span-2 self-center">
                <Select
                 label=""
                 name="state"
                 placeholder=""
                 className="!bg-white"
                 options={state}
                  />
              </div>
              <div
                className="col-span-2 self-center">
                <Select
                 label=""
                 name="state"
                 placeholder=""
                 className="!bg-white"
                 options={state}
                  />
              </div>
            </Grid>

            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`${activeTab !== tab.id ? "hidden" : ""}`}
              >
                {tab.content}
              </div>
            ))}
          </div>
        </Grid>
      </div>
    </>
  );
}


export default Claims