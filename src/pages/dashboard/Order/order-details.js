import React, { useEffect, useState } from "react";
import Headbar from "../../../common/headBar";
import { Link, useNavigate, useParams } from "react-router-dom";
import Grid from "../../../common/grid";
import Button from "../../../common/button";

// Media Import
import AllActive from "../../../assets/images/Reporting/icons/Activeall.svg";
import all from "../../../assets/images/Reporting/icons/all.svg";
import BackImage from "../../../assets/images/icons/backArrow.svg";
import DealerIcons from "../../../assets/images/icons/DealerIcons.svg";
import DealerList from "../../../assets/images/icons/dealerList.svg";
import WholesaleActive from "../../../assets/images/Reporting/icons/activeWholesale.svg";
import wholesale from "../../../assets/images/Reporting/icons/Wholesale.svg";
import Select from "../../../common/select";
import address from "../../../assets/images/Dealer/Address.svg";
import { cityData } from "../../../stateCityJson";
import Contracts from "./OrderDetails/contracts";
import OrderSummary from "./OrderDetails/orderSummary";


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
      id: "Order Summary",
      label: "Order Summary",
      icons: all,
      Activeicons: AllActive,
      content: <OrderSummary />,
    },
    {
      id: "Contracts",
      label: "Contracts",
      icons: wholesale,
      Activeicons: WholesaleActive,
      content: <Contracts />,
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
      <div className="py-8 px-3 relative overflow-x-hidden bg-[#F9F9F9]">
        <Headbar />

        <div className="flex">
        <div
          className="h-[60px] w-[60px] flex border-[1px] bg-white border-[#D1D1D1] rounded-[25px]"
        >
          <img
            src={BackImage}
            className="m-auto my-auto self-center bg-white"
            alt="BackImage"
          />
        </div>
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9 mb-[3px]">
            Order Details
            </p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/"}>Servicer / </Link>{" "}
              </li>
              <li className="text-sm text-neutral-grey font-Regular pl-2">
                <Link to={"/"}>Order Details / </Link>{" "}
              </li>
              <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
                {" "}
                 {activeTab}
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
                   Order ID
                  </p>
                  <p className="text-xl text-white font-semibold">
                    315174
                  </p>
                </div>
                <div className="col-span-3 text-end">
                  <Button
                    className="border !border-[#535456] !text-sm !font-Regular"
                    // onClick={openModal}
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
                  Dealer Purchase Order
                  </p>
                  <p className="text-base text-white font-semibold leading-5">
                  12345678900987
                  </p>
                </div>
              </div>
              <div className="flex my-4">
                <img
                  src={address}
                  className="mr-3 bg-[#383838] rounded-[14px] my-auto"
                  alt="Address"
                />
                <div>
                  <p className="text-sm text-neutral-grey font-Regular mt-3">
                  Service Coverage
                  </p>
                  <p className="text-base text-white font-semibold leading-5">
                  Parts
                  </p>
                </div>
              </div>
              <div className="flex my-4">
                <img
                  src={address}
                  className="mr-3 bg-[#383838] rounded-[14px] my-auto"
                  alt="Address"
                />
                <div>
                  <p className="text-sm text-neutral-grey font-Regular mt-3">
                  Coverage Type
                  </p>
                  <p className="text-base text-white font-semibold leading-5">
                  Breakdown (BD)
                  </p>
                </div>
              </div>
              <div className="flex w-full my-4">
                <p className="text-[10px] mr-3 text-[#999999] font-Regular">
                Other Details
                </p>
                <hr className="self-center border-[#999999] w-[70%]" />
              </div>
              <div className="flex mb-4">
                <div className="relative">
                  <img
                    src={DealerIcons}
                    className="mr-3 bg-[#383838] rounded-[14px]"
                    alt="DealerIcons"
                  />
                  <Link to={`/dealerDetails/vscjhc`}>
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
                  Edward Wilson
                  </p>
                </div>
              </div>
              <div className="flex mb-4">
                <div className="relative">
                  <img
                    src={DealerIcons}
                    className="mr-3 bg-[#383838] rounded-[14px]"
                    alt="DealerIcons"
                  />
                  <Link to={`/dealerDetails/fgfgh`}>
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
                  Customer Name
                  </p>
                  <p className="text-base text-white font-semibold ">
                  Ankush Grover
                  </p>
                </div>
              </div>
              <div className="flex mb-4">
                <div className="relative">
                  <img
                    src={DealerIcons}
                    className="mr-3 bg-[#383838] rounded-[14px]"
                    alt="DealerIcons"
                  />
                  <Link to={`/dealerDetails/sgdfg`}>
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
                  Servicer Name
                  </p>
                  <p className="text-base text-white font-semibold ">
                  Jameson Wills
                  </p>
                </div>
              </div>
              
            </div>
          </div>
          <div className="col-span-3">
            <Grid className="!mt-5">
              
              <div className="col-span-4">
                <div className="bg-[#fff] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                  <Grid className="!grid-cols-2 !gap-1">
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