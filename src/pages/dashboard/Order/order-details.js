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
import Csv from "../../../assets/images/icons/csvWhite.svg";
import Primary from "../../../assets/images/SetPrimary.png";
import Coverage from "../../../assets/images/order/Coverage.svg";
import Cross from "../../../assets/images/Cross.png";
import CoverageType from "../../../assets/images/order/CoverageType.svg";
import Purchase from "../../../assets/images/order/Purchase.svg";
import DealerList from "../../../assets/images/icons/dealerList.svg";
import Name from "../../../assets/images/order/Name.svg";
import { useFormik } from "formik";
import * as Yup from "yup";
import OrderSummary from "./OrderDetails/orderSummary";
import { RotateLoader } from "react-spinners";
import {
  getContracts,
  orderDetailsById,
  updateOrderServicer,
} from "../../../services/orderServices";
import Edit from "../../../assets/images/Dealer/EditIcon.svg";
import PdfGenerator from "../../pdfViewer";
import ContractList from "../Contract/contractList";
import Modal from "../../../common/model";
import SelectBoxWithSearch from "../../../common/selectBoxWIthSerach";
import DocMakeOrderContainer from "../../docMakeOrder";

function OrderDetails() {
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});
  const [servicerList, setServicerList] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [invoiceData, setInvoiceData] = useState({});
  const [timer, setTimer] = useState(3);
  const { orderId } = useParams();
  const navigate = useNavigate();
  // const getInitialActiveTab = () => {
  //   const storedTab = localStorage.getItem("orderMenu");
  //   return storedTab ? storedTab : "Order Summary";
  // };
  const id = useParams();
  const [activeTab, setActiveTab] = useState("Order Summary");
  const [isServicerModal, setIsServicerModal] = useState(false);

  const openServicer = (data) => {
    setIsServicerModal(true);
  };
  const closeServicer = () => {
    setIsServicerModal(false);
  };

  const openModel = () => {
    getOrderDetails(true);
    setModalOpen(true);
  };
  const closeModel = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    getOrderDetails();
  }, [orderId]);

  useEffect(() => {
    let intervalId;
    if (modalOpen && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    if (timer <= 0) {
      getOrderDetails();
      closeModel();
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [modalOpen, timer]);

  useEffect(() => {
    setLoading(true);
    localStorage.setItem("orderMenu", activeTab);
    setLoading(false);
  }, [activeTab]);

  const validationSchema = Yup.object({
    servicerId: Yup.string().required("Servicer Name is required"),
  });

  const formik = useFormik({
    initialValues: {
      servicerId: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      console.log(orderDetails);
      const res = updateOrderServicer(orderDetails._id, values).then((res) => {
        console.log(res);
        setLoading(false);
        openModel();
        closeServicer();
        setTimer(3);
      });

      setLoading(false);
    },
  });
  const getOrderDetails = async (showLoader) => {
    if (!showLoader) {
      setLoading1(true);
    }
    const result = await orderDetailsById(orderId);
    setUserDetails(result.orderUserData);
    formik.setFieldValue("servicerId", result.result.servicerId);
    const filteredServicer = result.servicers.filter(
      (data) => data.servicerData.status === true
    );

    let arr = filteredServicer.map((data) => ({
      label: data.name,
      value: data._id,
    }));
    console.log(arr);
    setServicerList(arr);
    setOrderDetails(result.result);
    let data = {
      dealerName: result.orderUserData.dealerData,
      customerName: result.orderUserData.customerData,
      resellerName: result.orderUserData.resellerData,
      totalOrderAmount: result.result.orderAmount,
      ...result.result,
    };
    setInvoiceData(data);
    console.log(data);
    setLoading1(false);
  };
  const handleGOBack = () => {
    localStorage.removeItem("orderMenu");
    navigate(-1);
  };

  const handleSelectChange = async (name, value) => {
    formik.setFieldValue(name, value);
  };
  const tabs = [
    {
      id: "Order Summary",
      label: "Order Summary",
      icons: orderSummary,
      Activeicons: orderActive,
      content: activeTab === "Order Summary" && (
        <OrderSummary data={orderDetails.productsArray} />
      ),
    },
    {
      id: "Contracts",
      label: "Contracts",
      icons: contract,
      Activeicons: contractActive,
      content: activeTab === "Contracts" && (
        <ContractList orderId={orderId} flag={"contracts"} />
      ),
    },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <>
      {loading1 && (
        <div className=" fixed z-[999999] bg-[#333333c7] backdrop-blur-xl  h-screen w-full flex py-5">
          <div className="self-center mx-auto">
            <RotateLoader color="#fff" />
          </div>
        </div>
      )}

      <div className="py-8 px-3 relative overflow-x-hidden bg-[#F9F9F9]">
        <Headbar />
        <div className="flex">
          <Link
            onClick={handleGOBack}
            className="h-[60px] w-[60px] flex border-[1px] bg-white border-[#D1D1D1] rounded-[25px]"
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
                <Link to={"/"}>Order Lists / </Link>
              </li>
              <li className="text-sm text-neutral-grey font-Regular pl-2">
                <Link to={"/"}>Order Details / </Link>
              </li>
              <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
                {activeTab}
              </li>
            </ul>
          </div>
        </div>

        <Grid className="!grid-cols-4 mt-5">
          <div className="col-span-1 max-h-[85vh] overflow-y-scroll">
            <div className=" bg-Dealer-details bg-cover p-5 rounded-[20px]">
              <Grid>
                <div className="col-span-9">
                  <p className="text-sm text-neutral-grey font-Regular">
                    Order ID
                  </p>
                  <p className="text-xl text-white font-semibold">
                    {" "}
                    {orderDetails.unique_key}{" "}
                  </p>
                </div>
                <div className="col-span-3 text-end"></div>
              </Grid>
              <div className="flex my-4">
                <img
                  src={Purchase}
                  className="mr-3 bg-[#383838] rounded-[14px] my-auto"
                  alt="Purchase"
                />
                <div>
                  <p className="text-sm text-neutral-grey font-Regular mt-2">
                    Dealer Purchase Order
                  </p>
                  <p className="text-base text-white font-semibold leading-5">
                    {orderDetails.venderOrder}
                  </p>
                </div>
              </div>
              <div className="flex my-4">
                <img
                  src={Coverage}
                  className="mr-3 bg-[#383838] rounded-[14px] my-auto"
                  alt="Coverage"
                />
                <div>
                  <p className="text-sm text-neutral-grey font-Regular mt-2">
                    Service Coverage
                  </p>
                  <p className="text-base text-white font-semibold leading-5">
                    {orderDetails.serviceCoverageType}
                  </p>
                </div>
              </div>
              <div className="flex my-4">
                <img
                  src={CoverageType}
                  className="mr-3 bg-[#383838] rounded-[14px] my-auto"
                  alt="CoverageType"
                />
                <div>
                  <p className="text-sm text-neutral-grey font-Regular mt-2">
                    Coverage Type
                  </p>
                  <p className="text-base text-white font-semibold leading-5">
                    {orderDetails.coverageType}
                  </p>
                </div>
              </div>
              <div className="flex w-full my-4">
                <p className="text-[10px] mr-3 text-neutral-grey font-Regular">
                  Other Details
                </p>
                <hr className="self-center border-[#999999] w-[70%]" />
              </div>
              <div className="flex mb-4">
                <div className="relative">
                  <img
                    src={Name}
                    className="mr-3 bg-[#383838] rounded-[14px]"
                    alt="Name"
                  />
                  <Link to={`/dealerDetails/${orderDetails.dealerId}`}>
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
                    {userDetails?.dealerData?.name}
                  </p>
                </div>
              </div>
              {userDetails?.resellerData?.name == null ? (
                <></>
              ) : (
                <>
                  <div className="flex mb-4">
                    <div className="relative">
                      <img
                        src={Name}
                        className="mr-3 bg-[#383838] rounded-[14px]"
                        alt="Name"
                      />
                      <Link to={`/resellerDetails/${orderDetails.resellerId}`}>
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
                        Reseller Name
                      </p>
                      <p className="text-base text-white font-semibold ">
                        {userDetails?.resellerData?.name}
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex mb-4">
                <div className="relative">
                  <img
                    src={Name}
                    className="mr-3 bg-[#383838] rounded-[14px]"
                    alt="Name"
                  />
                  <Link to={`/customerDetails/${orderDetails.customerId}`}>
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
                    {userDetails?.customerData?.username}
                  </p>
                </div>
              </div>
              <div className="flex mb-4">
                <div className="relative">
                  <img
                    src={Name}
                    className="mr-3 bg-[#383838] rounded-[14px]"
                    alt="Name"
                  />
                  {userDetails?.servicerData?.name == null ||
                  userDetails?.servicerData?.resellerId != null ||
                  userDetails?.servicerData?.dealerId != null ? (
                    <></>
                  ) : (
                    <Link to={`/servicerDetails/${orderDetails.servicerId}`}>
                      <img
                        src={DealerList}
                        className="mr-3 bg-[#383838] cursor-pointer rounded-[14px] absolute top-3 -right-2"
                        alt="DealerList"
                      />{" "}
                    </Link>
                  )}
                </div>
                <div className="flex justify-between w-[85%] ml-auto">
                  <div>
                    <p className="text-sm text-neutral-grey font-Regular">
                      Servicer Name
                    </p>
                    <p className="text-base text-white font-semibold ">
                      {userDetails?.servicerData?.name}
                    </p>
                  </div>
                  <div className="self-center">
                    <div
                      onClick={() => openServicer(userDetails?.servicerData)}
                    >
                      <img
                        src={Edit}
                        className="mr-3 bg-[#383838] cursor-pointer rounded-[14px]"
                        alt="DealerList"
                      />{" "}
                    </div>
                  </div>
                </div>
              </div>

              <Grid className="!py-5">
                <div className="col-span-6">
                  <Button className="!bg-white !text-light-black !text-sm border flex">
                    {/* <img src={Csv} className="mr-3 self-center" alt="Csv" />{" "} */}
                    <span className="self-center">
                      {" "}
                      <PdfGenerator
                        setLoading={setLoading1}
                        data={orderDetails._id}
                      />
                    </span>
                  </Button>
                </div>
                <div className="col-span-6">
                  <Button className="!bg-white !text-light-black !text-sm border flex">
                    {/* <img src={Csv} className="mr-3 self-center" alt="Csv" />{" "} */}
                    <span className="self-center">
                      {" "}
                      <DocMakeOrderContainer
                        setLoading={setLoading1}
                        data={orderId}
                      />
                    </span>
                  </Button>
                </div>
              </Grid>
            </div>
          </div>
          <div className="col-span-3 max-h-[85vh] no-scrollbar overflow-y-scroll">
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
                            className={`ml-1 py-1 text-sm font-normal ${
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
                className={`${activeTab !== tab.id ? "hidden" : "pb-20"}`}
              >
                {tab.content}
              </div>
            ))}
          </div>
        </Grid>
      </div>

      <Modal isOpen={isServicerModal} onClose={closeServicer}>
        <Button
          onClick={closeServicer}
          className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]"
        >
          <img
            src={Cross}
            className="w-full h-full text-black rounded-full p-0"
          />
        </Button>
        <form onSubmit={formik.handleSubmit}>
          <div className="py-3 px-12">
            <p className="text-center text-3xl font-semibold">
              Update Servicer Name
            </p>
            <div className="my-5">
              <SelectBoxWithSearch
                label="Servicer Name"
                name="servicerId"
                onChange={handleSelectChange}
                options={servicerList} // Make sure to define servicerList
                value={formik.values.servicerId}
                className="!bg-[#fff]"
                onBlur={formik.handleBlur}
                error={formik.touched.servicerId && formik.errors.servicerId}
              />
              {formik.touched.servicerId && formik.errors.servicerId && (
                <div className="text-red-500">{formik.errors.servicerId}</div>
              )}
            </div>
            <div className="text-right">
              <Button type="submit">Save</Button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal isOpen={modalOpen} onClose={closeModel}>
        <div className="text-center py-3">
          <img src={Primary} alt="email Image" className="mx-auto" />
          <p className="text-3xl mb-0 mt-2 font-bold text-light-black">
            Servicer Updated Successfully
          </p>
          <p className="text-neutral-grey text-base font-medium mt-4">
            Redirecting Back to Order Detail page in {timer} Seconds
          </p>
        </div>
      </Modal>
    </>
  );
}

export default OrderDetails;
