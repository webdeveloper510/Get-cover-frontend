import React, { useEffect, useState } from "react";
import Headbar from "../../../common/headBar";
import { Link, useNavigate, useParams } from "react-router-dom";
import Grid from "../../../common/grid";
import Button from "../../../common/button";

// Media Import
import AllActive from "../../../assets/images/Reporting/icons/Activeall.svg";
import all from "../../../assets/images/Reporting/icons/all.svg";
import BrokerActive from "../../../assets/images/Reporting/icons/activeBroker.svg";
import broker from "../../../assets/images/Reporting/icons/Broker.svg";
import Select from "../../../common/select";
import { cityData } from "../../../stateCityJson";
import DealerAll from "./Sale-Tab/all";
import DealerBroker from "./Sale-Tab/broker";

function ResellerSale() {
  const getInitialActiveTab = () => {
    const storedTab = localStorage.getItem("DealerSaleMenu");
    return storedTab ? storedTab : "All";
  };
  const id = useParams();
  const [activeTab, setActiveTab] = useState(getInitialActiveTab()); // Set the initial active tab
  const state = cityData;

  useEffect(() => {
    localStorage.setItem("DealerSaleMenu", activeTab);
  }, [activeTab]);



  const tabs = [
    {
      id: "All",
      label: "All",
      icons: all,
      className:'col-span-1',
      Activeicons: AllActive,
      content: <DealerAll />,
    },
    // {
    //   id: "Wholesale",
    //   label: "Wholesale",
    //   className:'col-span-2',
    //   icons: wholesale,
    //   Activeicons: WholesaleActive,
    //   content: <DealerWholeSale />,
    // },
    // {
    //   id: "Breakdown for Administration",
    //   label: "Breakdown for Administration",
    //   icons: breakdown,
    //   className:'col-span-3',
    //   Activeicons: BreakdownActive,
    //   content: <DealerBreakdown />,
    // },
    // {
    //   id: "Fronting Fees",
    //   label: "Fronting Fees",
    //   icons: fronting,
    //   className:'col-span-2',
    //   Activeicons: FrontingActive,
    //   content: <DealerFronting />,
    // },
    // {
    //   id: "Re-insurance Premium",
    //   label: "Re-insurance Premium",
    //   icons: insurance,
    //   className:'col-span-3',
    //   Activeicons: insuranceActive,
    //   content: <DealerReInsurance />,
    // },
    // {
    //   id: "Reserves Future Claims",
    //   label: "Reserves Future Claims",
    //   icons: reserves,
    //   className:'col-span-3',
    //   Activeicons: ReservesActive,
    //   content: <DealerReserves />,
    // },
    {
      id: "Broker Fees",
      label: "Broker Fees",
      icons: broker,
      className:'col-span-2',
      Activeicons: BrokerActive,
      content: <DealerBroker />,
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

        <Grid className="!grid-cols-3">

          <div className="col-span-3">
            <Grid className="">
              
              <div className="col-span-4">
                <div className="bg-[#fff] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                  <Grid className="!gap-1 !grid-cols-3">
                    {tabs.map((tab) => (
                      <div className={tab.className} key={tab.id}>
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
              <div className="col-span-6">

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

export default ResellerSale