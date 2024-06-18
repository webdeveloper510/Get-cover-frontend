import React, { useEffect, useRef, useState } from "react";
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
import { cityData } from "../../../stateCityJson";
import All from "./Sale-Tab/all";
import WholeSale from "./Sale-Tab/wholeSale";
import Breakdown from "./Sale-Tab/breakdown";
import Reserves from "./Sale-Tab/reserves";
import ReInsurance from "./Sale-Tab/reInsurance";
import Fronting from "./Sale-Tab/fronting";
import Broker from "./Sale-Tab/broker";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import SelectBoxWithSearch from "../../../common/selectBoxWIthSerach";
function Sale() {
  const getInitialActiveTab = () => {
    const storedTab = localStorage.getItem("SaleMenu");
    return storedTab ? storedTab : "All";
  };
  const id = useParams();
  const [activeTab, setActiveTab] = useState(getInitialActiveTab()); // Set the initial active tab
  const state = cityData;
  const containerRef = useRef(null);
  useEffect(() => {
    localStorage.setItem("SaleMenu", activeTab);
  }, [activeTab]);



  const tabs = [
    {
      id: "All",
      label: "All",
      icons: all,
      className:'col-span-1',
      Activeicons: AllActive,
      content: <All />,
    },
    {
      id: "Wholesale",
      label: "Wholesale",
      className:'col-span-2',
      icons: wholesale,
      Activeicons: WholesaleActive,
      content: <WholeSale />,
    },
    {
      id: "Administration Fees",
      label: "Administration Fees",
      icons: breakdown,
      className:'col-span-3',
      Activeicons: BreakdownActive,
      content: <Breakdown />,
    },
    {
      id: "Fronting Fees",
      label: "Fronting Fees",
      icons: fronting,
      className:'col-span-2',
      Activeicons: FrontingActive,
      content: <Fronting />,
    },
    {
      id: "Re-insurance Fees",
      label: "Re-insurance Fees",
      icons: insurance,
      className:'col-span-3',
      Activeicons: insuranceActive,
      content: <ReInsurance />,
    },
    {
      id: "Reserves Future Claims",
      label: "Reserves Future Claims",
      icons: reserves,
      className:'col-span-3',
      Activeicons: ReservesActive,
      content: <Reserves />,
    },
    {
      id: "Broker Fees",
      label: "Broker Fees",
      icons: broker,
      className:'col-span-2',
      Activeicons: BrokerActive,
      content: <Broker />,
    },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4,
      slidesToSlide: 3 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
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

        <Grid className="!grid-cols-3">

          <div className="col-span-3">
            <Grid className="mt-10">
              
              <div className="col-span-9 relative">
              <div
                  className={` rounded-[30px] px-2 py-3 border-[1px] border-Light-Grey`}
                  ref={containerRef}
                  // onTransitionEnd={handleTransitionEnd}
                >
                  <Carousel  className="!gap-1"
                    ssr={true}
                    // ref={carouselRef}
                    responsive={responsive}
                    containerClass="carousel">
                  {tabs.map((tab) => (
                      <Button
                      className={`flex self-center w-[190px] !px-2 !py-1 rounded-xl border-[1px] border-Light-Grey ${
                        activeTab === tab.id
                          ? "!bg-[#2A2A2A] !text-white"
                          : "!bg-grayf9 !text-black"
                      }`}
                      onClick={() => handleTabClick(tab.id)}
                    > <img
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
                  >{tab.label} </span></Button>
                      ))}
                    </Carousel>
                    </div>
                {/* <div className="bg-white rounded-[30px] p-3 border-[1px] border-Light-Grey">
                  <Grid className="!gap-1 !grid-cols-11">
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
                </div> */}
              </div>
              <div
                className="col-span-3 self-center pl-3">
                <SelectBoxWithSearch
                 label=""
                 name="state"
                 placeholder="Dealer Name"
                 className="!bg-white"
                 options={state}
                 pName={'Enter Dealer Name'}
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

export default Sale