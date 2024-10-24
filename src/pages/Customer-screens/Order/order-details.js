import React, { useEffect, useState } from "react";
import Headbar from "../../../common/headBar";
import { Link, useNavigate, useParams } from "react-router-dom";
import Grid from "../../../common/grid";
import Button from "../../../common/button";

// Media Import
import contract from "../../../assets/images/order/Contracts.svg";
import contractActive from "../../../assets/images/order/ContractsActive.svg";
import orderSummary from "../../../assets/images/order/orderSummary.svg";
import orderActive from "../../../assets/images/order/orderSummaryActive.svg";
import BackImage from "../../../assets/images/icons/backArrow.svg";
import Coverage from "../../../assets/images/order/Coverage.svg";
import CoverageType from "../../../assets/images/order/CoverageType.svg";
import Purchase from "../../../assets/images/order/Purchase.svg";
import Name from "../../../assets/images/order/Name.svg";
import { cityData } from "../../../stateCityJson";
import Contracts from "./OrderDetails/contracts";
import OrderSummary from "./OrderDetails/orderSummary";
import { RotateLoader } from "react-spinners";
import { getOrderDetailCustomer } from "../../../services/orderServices";
import ContractList from "../../dashboard/Contract/contractList";
import FileDownloader from "../../termAndCondition";
import CustomerOrderSummary from "./OrderDetails/orderSummary";
import SingleView from "../../../common/singleView";

function CustomerOrderDetails() {
  const [loading, setLoading] = useState(false);
  const [orderList, setOrderList] = useState();
  const [userDetails, setUserDetails] = useState(null);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const getInitialActiveTab = () => {
    const storedTab = localStorage.getItem("orderMenu");
    return storedTab ? storedTab : "Order Summary";
  };
  const id = useParams();
  const [activeTab, setActiveTab] = useState(getInitialActiveTab());
  const state = cityData;

  useEffect(() => {
    setLoading(true);
    localStorage.setItem("orderMenu", activeTab);
    setLoading(false);
  }, [activeTab]);

  // const getOrderdetails = async () => {
  //   setLoading(true);
  //   
  //   
  //   console.log(result.result);
  //   setOrderList(result.result);
  //   setLoading(false);
  // };
  const getOrderdetails = async () => {
    setLoading(true);
    const result = await getOrderDetailCustomer([orderId]);
    if (result.code === 200) {
      setUserDetails(result.orderUserData);
      setOrderList(result.result);
    } else {
      navigate(`/`);
    }
    setLoading(false);
  };
  useEffect(() => {
    getOrderdetails();
  }, [orderId]);

  const tabs = [
    {
      id: "Order Summary",
      label: "Order Summary",
      icons: orderSummary,
      Activeicons: orderActive,
      content: (
        <CustomerOrderSummary
          data={orderList?.productsArray}
          shown={orderList?.coverageType === "Breakdown"}
        />
      ),
    },
    {
      id: "Contracts",
      label: "Contracts",
      icons: contract,
      Activeicons: contractActive,
      content: (
        <ContractList
          orderId={orderId}
          flag={"contracts"}
          type={"customer"}
          isShown={false}
          shownEdit={false}
        />
      ),
    },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };
  return (
    <>
      {loading && (
        <div className=" fixed z-[999999] bg-[#333333c7] backdrop-blur-xl  h-screen w-full flex py-5">
          <div className="self-center mx-auto">
            <RotateLoader color="#fff" />
          </div>
        </div>
      )}
      <div className="py-8 pl-3 relative overflow-x-hidden bg-grayf9">
        <Headbar />
        <div className="flex">
          <Link
            to={"/customer/orderList"}
            className="h-[60px] w-[60px] flex border-[1px] bg-white border-Light-Grey rounded-[25px]"
          >
            <img
              src={BackImage}
              className="m-auto my-auto self-center bg-white"
              alt="BackImage"
            />
          </Link>
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9 mb-[3px]">
              Order Details
            </p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/"}>Home / </Link>
              </li>
              <li className="text-sm text-neutral-grey font-Regular ml-1">
                <Link to={"/customer/orderList"}>Order Details / </Link>
              </li>
              <li className="text-sm text-neutral-grey font-semibold ml-1 pt-[1px]">
                {activeTab}
              </li>
            </ul>
          </div>
        </div>

        <Grid className="!grid-cols-4 mt-5">
          <div className="col-span-1 max-h-[80vh] overflow-y-scroll">
            <SingleView className=" bg-Dealer-details bg-cover h-[80vh]  p-5 rounded-[20px]">
              <Grid>
                <div className="col-span-9">
                  <p className="text-sm text-neutral-grey font-Regular">
                    Order ID
                  </p>
                  <p className="text-xl text-white font-semibold">
                    {orderList?.unique_key}
                  </p>
                </div>
                <div className="col-span-3 text-end">
                  {/* <Button
                    className="border !border-Bright-Grey !text-sm !font-Regular"
                  >
                    Edit
                  </Button> */}
                </div>
              </Grid>
              <div className="flex my-4">
                <img
                  src={Purchase}
                  className="mr-3 bg-Onyx rounded-[14px] my-auto"
                  alt="Purchase"
                />
                <div>
                  <p className="text-sm text-neutral-grey font-Regular mt-2">
                    Dealer Purchase Order
                  </p>
                  <p className="text-base text-white font-semibold leading-5">
                    {orderList?.venderOrder}
                  </p>
                </div>
              </div>
              <div className="flex my-4">
                <img
                  src={Coverage}
                  className="mr-3 bg-Onyx rounded-[14px] my-auto"
                  alt="Coverage"
                />
                <div>
                  <p className="text-sm text-neutral-grey font-Regular mt-2">
                    Service Coverage
                  </p>
                  <p className="text-base text-white font-semibold leading-5">
                    {orderList?.serviceCoverageType}
                  </p>
                </div>
              </div>
              <div className="flex my-4">
                <img
                  src={CoverageType}
                  className="mr-3 bg-Onyx rounded-[14px] my-auto"
                  alt="CoverageType"
                />
                <div>
                  <p className="text-sm text-neutral-grey font-Regular mt-2">
                    Coverage Type
                  </p>
                  <p className="text-base text-white font-semibold leading-5">
                    {orderList?.coverageType?.map((data) => {
                      return (
                        <li
                          key={data.label}
                          className="font-bold text-sm list-disc mx-[19px]"
                        >
                          {data.label}
                        </li>
                      );
                    })}
                  </p>
                </div>
              </div>
              <div className="flex mb-4">
                <div className="relative">
                  <img
                    src={Name}
                    className="mr-3 bg-Onyx rounded-[14px]"
                    alt="Name"
                  />
                </div>

                <div className="flex justify-between w-[85%] ml-auto">
                  <div>
                    <p className="text-sm text-neutral-grey font-Regular">
                      Servicer Name
                    </p>
                    <p className="text-base text-white font-semibold">
                      {userDetails?.servicerData?.status
                        ? userDetails?.servicerData?.name
                        : ""}
                    </p>
                  </div>

                </div>
              </div>

              {orderList?.termCondition?.fileName == "" || orderList?.termCondition == undefined ? (
                <></>
              ) : (
                <Button className="!bg-white !text-light-black w-full justify-center mt-[10%] !text-sm border flex cursor-pointer hover:font-semibold">
                  <span className="self-center">
                    {" "}
                    <FileDownloader data={orderId} setLoading={setLoading} />
                  </span>
                </Button>
              )}
            </SingleView>
          </div>
          <div className="col-span-3 max-h-[85vh] pr-3 overflow-y-scroll">
            <Grid className="">
              <div className="col-span-4">
                <div className="bg-white rounded-[30px] p-3 border-[1px] border-Light-Grey">
                  <Grid className="!grid-cols-2 !gap-1">
                    {tabs.map((tab) => (
                      <div className="col-span-1" key={tab.id}>
                        <Button
                          className={`flex self-center w-full !px-2 !py-1 rounded-xl border-[1px] border-Light-Grey ${activeTab === tab.id
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
                            className={`ml-1 py-1 text-sm font-normal ${activeTab === tab.id ? "text-white" : "text-black"
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

export default CustomerOrderDetails;
