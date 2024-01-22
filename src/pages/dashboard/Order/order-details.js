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
import FrontingActive from "../../../assets/images/Reporting/icons/activeFrontingFees.svg";
import fronting from "../../../assets/images/Reporting/icons/frontingFees.svg";
import insuranceActive from "../../../assets/images/Reporting/icons/activeRe-insurance.svg";
import insurance from "../../../assets/images/Reporting/icons/Re-insurance.svg";
import ReservesActive from "../../../assets/images/Reporting/icons/activeReservesFutureClaims.svg";
import reserves from "../../../assets/images/Reporting/icons/ReservesFutureClaims.svg";
import BrokerActive from "../../../assets/images/Reporting/icons/activeBroker.svg";
import broker from "../../../assets/images/Reporting/icons/Broker.svg";
import Select from "../../../common/select";
import Dealer from "../../../assets/images/icons/dealer.svg";
import Claim from "../../../assets/images/Dealer/Claim.svg";
import User from "../../../assets/images/Dealer/Users.svg";
import address from "../../../assets/images/Dealer/Address.svg";
import name from "../../../assets/images/Dealer/Name.svg";
import email from "../../../assets/images/Dealer/Email.svg";
import phone from "../../../assets/images/Dealer/Phone.svg";
import { cityData } from "../../../stateCityJson";
import All from "./Sale-Tab/all";
import WholeSale from "./Sale-Tab/wholeSale";
import Breakdown from "./Sale-Tab/breakdown";
import Reserves from "./Sale-Tab/reserves";
import ReInsurance from "./Sale-Tab/reInsurance";
import Fronting from "./Sale-Tab/fronting";
import Broker from "./Sale-Tab/broker";

function OrderDetails() {
  const getInitialActiveTab = () => {
    const storedTab = localStorage.getItem("SaleMenu");
    return storedTab ? storedTab : "Servicer";
  };
  const id = useParams();
  const [activeTab, setActiveTab] = useState(getInitialActiveTab()); // Set the initial active tab
  const state = cityData;

  useEffect(() => {
    localStorage.setItem("SaleMenu", activeTab);
  }, [activeTab]);



  const tabs = [
    {
      id: "All",
      label: "All",
      icons: all,
      Activeicons: AllActive,
      content: <All />,
    },
    {
      id: "Wholesale",
      label: "Wholesale",
      icons: wholesale,
      Activeicons: WholesaleActive,
      content: <WholeSale />,
    },
    {
      id: "Breakdown for Administration",
      label: "Breakdown for Administration",
      icons: breakdown,
      Activeicons: BreakdownActive,
      content: <Breakdown />,
    },
    {
      id: "Fronting Fees",
      label: "Fronting Fees",
      icons: fronting,
      Activeicons: FrontingActive,
      content: <Fronting />,
    },
    {
      id: "Re-insurance Premium",
      label: "Re-insurance Premium",
      icons: insurance,
      Activeicons: insuranceActive,
      content: <ReInsurance />,
    },
    {
      id: "Reserves Future Claims",
      label: "Reserves Future Claims",
      icons: reserves,
      Activeicons: ReservesActive,
      content: <Reserves />,
    },
    {
      id: "Broker Fees",
      label: "Broker Fees",
      icons: broker,
      Activeicons: BrokerActive,
      content: <Broker />,
    },
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
      <div className="py-8 px-3 relative overflow-x-hidden bg-[#F9F9F9]">
        <Headbar />

        <div className="flex">
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9 mb-[3px]">
             Reporting
            </p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/"}>Reporting / </Link>{" "}
              </li>
              <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
                {" "}
                Sale ({activeTab})
              </li>
            </ul>
          </div>
        </div>

        <Grid className="!grid-cols-4">
        <div className="col-span-1">
            <div className=" bg-Dealer-details bg-cover mt-5 p-5 rounded-[20px]">
              <Grid>
                <div className="col-span-9">
                  <p className="text-sm text-neutral-grey font-Regular">
                    Account Name
                  </p>
                  <p className="text-xl text-white font-semibold">
                    {customerDetail?.meta?.username}
                  </p>
                </div>
                <div className="col-span-3 text-end">
                  <Button
                    className="border !border-[#535456] !text-sm !font-Regular"
                    onClick={openModal}
                  >
                    Edit
                  </Button>
                </div>
              </Grid>
              <div className="flex my-4">
                <img
                  src={address}
                  className="mr-3 bg-[#383838] rounded-[14px] my-auto"
                  alt="Address"
                />
                <div>
                  <p className="text-sm text-neutral-grey font-Regular mt-3">
                    Address
                  </p>
                  <p className="text-base text-white font-semibold leading-5">
                    {customerDetail?.meta?.street} {", "}
                    {customerDetail?.meta?.state}
                    {", "}
                    {customerDetail?.meta?.country}
                  </p>
                </div>
              </div>
              <div className="flex w-full my-4">
                <p className="text-[10px] mr-3 text-[#999999] font-Regular">
                  PRIMARY CONTACT DETAILS
                </p>
                <hr className="self-center border-[#999999] w-[50%]" />
              </div>
              <div className="flex mb-4">
                <div className="relative">
                  <img
                    src={DealerIcons}
                    className="mr-3 bg-[#383838] rounded-[14px]"
                    alt="DealerIcons"
                  />
                  <Link to={`/dealerDetails/${customerDetail?.meta?.dealerId}`}>
                    {" "}
                    <img
                      src={DealerList}
                      className="mr-3 bg-[#383838] cursor-pointer rounded-[14px] absolute top-3 -right-2"
                      alt="DealerList"
                    />{" "}
                  </Link>
                </div>
                <div>
                  <p className="text-sm text-neutral-grey font-Regular">
                    Dealer Name
                  </p>
                  <p className="text-base text-white font-semibold ">
                    {customerDetail?.meta?.dealerName}
                  </p>
                </div>
              </div>
              <div className="flex mb-4">
                <img
                  src={name}
                  className="mr-3 bg-[#383838] rounded-[14px]"
                  alt="Name"
                />
                <div>
                  <p className="text-sm text-neutral-grey font-Regular">Name</p>
                  <p className="text-base text-white font-semibold ">
                    {customerDetail?.primary?.firstName}{" "}
                    {customerDetail?.primary?.lastName}
                  </p>
                </div>
              </div>
              <div className="flex mb-4">
                <img 
                  src={email}
                  className="mr-3 bg-[#383838] rounded-[14px]"
                  alt="email"
                />
                <div>
                  <p className="text-sm text-neutral-grey font-Regular">
                    Email
                  </p>
                  <p className="text-base text-white font-semibold ">
                    {customerDetail?.primary?.email}
                  </p>
                </div>
              </div>
              <div className="flex mb-4">
                <img
                  src={phone}
                  className="mr-3 bg-[#383838] rounded-[14px]"
                  alt="name"
                />
                <div>
                  <p className="text-sm text-neutral-grey font-Regular">
                    Phone Number
                  </p>
                  <p className="text-base text-white font-semibold ">
                    +1 {customerDetail?.primary?.phoneNumber}
                  </p>
                </div>
              </div>
              <Grid className="mt-5">
                <div className="col-span-6 ">
                  <div className="bg-[#2A2A2A] self-center px-4 py-6 rounded-xl">
                    <p className="text-white text-lg !font-[600]">0</p>
                    <p className="text-[#999999] text-sm font-Regular">
                      Total number of Orders
                    </p>
                  </div>
                </div>
                <div className="col-span-6 ">
                  <div className="bg-[#2A2A2A] self-center px-4 py-6 rounded-xl">
                    <p className="text-white text-lg  !font-[600]">$0.00</p>
                    <p className="text-[#999999] text-sm font-Regular">
                      Total Value of Orders
                    </p>
                  </div>
                </div>
                <div className="col-span-6 ">
                  <div className="bg-[#2A2A2A] self-center px-4 py-6 rounded-xl">
                    <p className="text-white text-lg !font-[600]">0</p>
                    <p className="text-[#999999] text-sm font-Regular">
                      Total number of Claims
                    </p>
                  </div>
                </div>
                <div className="col-span-6 ">
                  <div className="bg-[#2A2A2A] self-center px-4 py-6 rounded-xl">
                    <p className="text-white text-lg  !font-[600]">$0.00</p>
                    <p className="text-[#999999] text-sm font-Regular">
                      Total Value of Claims
                    </p>
                  </div>
                </div>
              </Grid>
            </div>
          </div>
          <div className="col-span-3">
            <Grid className="!mt-5">
              
              <div className="col-span-10">
                <div className="bg-[#fff] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                  <Grid className="!grid-cols-7 !gap-1">
                    {tabs.map((tab) => (
                      <div className="col-span-1" key={tab.id}>
                        <Button
                          className={`flex self-center w-full !px-2 !py-1 rounded-xl border-[1px] border-[#D1D1D1] ${
                            activeTab === tab.id
                              ? "!bg-[#2A2A2A] !text-white"
                              : "!bg-[#F9F9F9] !text-black"
                          }`}
                          onClick={() => handleTabClick(tab.id)}
                        >
                          <img
                            src={
                              activeTab === tab.id ? tab.Activeicons : tab.icons
                            }
                            className="self-center pr-1 py-1 border-[#D1D1D1] border-r-[1px]"
                            alt={tab.label}
                          />
                          <span
                            className={`ml-1 py-1 text-[13px] font-normal ${
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

export default OrderDetails