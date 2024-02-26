import React, { useState, useEffect } from "react";
import Button from "../../../common/button";
import Grid from "../../../common/grid";
import Input from "../../../common/input";

// Media Includes
import Search from "../../../assets/images/icons/SearchIcon.svg";
import AddItem from "../../../assets/images/icons/addItem.svg";
import Cross from "../../../assets/images/Cross.png";
import Edit from "../../../assets/images/Dealer/EditIcon.svg";
import view from "../../../assets/images/whiteView.png";
import clearFilter from "../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import Headbar from "../../../common/headBar";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../../../common/model";
import Select from "../../../common/select";
import {
  getAllContractsForAdmin,
  getContracts,
} from "../../../services/orderServices";
import { format } from "date-fns";
import { RotateLoader } from "react-spinners";
import CustomPagination from "../../pagination";
import { getContractValues } from "../../../services/extraServices";
import { getContractsforDealer } from "../../../services/dealerServices";
import { getContractsforCustomer } from "../../../services/customerServices";
import { getContractsforReseller } from "../../../services/reSellerServices";

function ContractList(props) {
  console.log(props);
  const [contractDetails, setContractDetails] = useState({});
  const [isDisapprovedOpen, setIsDisapprovedOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [contractList, setContractList] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const closeDisapproved = () => {
    setIsDisapprovedOpen(false);
  };

  const closeView = () => {
    setIsViewOpen(false);
  };

  const openView = (data) => {
    setIsViewOpen(true);
    getContractDetails(data);
  };

  const getContractDetails = async (data) => {
    setLoading(true);
    const result = await getContractValues(data);
    setContractDetails(result.result);
    setLoading(false);
    console.log("by ID -------------------", result);
  };

  useEffect(() => {
    if (props.activeTab === "Contracts" && flag) {
      getContract();
    }
  }, [props, flag]);

  const getContract = async (orderId = null, page = 1, rowsPerPage = 10) => {
    let data = {
      page: page,
      pageLimit: rowsPerPage,
    };
    console.log(orderId == null, props?.flag == undefined);
    const result =
      orderId == null && props?.flag == undefined
        ? await getAllContractsForAdmin(data)
        : props?.flag == "dealer" && props?.id
        ? await getContractsforDealer(props.id, data)
        : props?.flag == "customer" && props?.id
        ? await getContractsforCustomer(props.id, data)
        : props?.flag == "reseller" && props?.id
        ? await getContractsforReseller(props.id, data)
        : await getContracts(orderId, data);

    setContractList(result.result);
    setTotalRecords(result?.totalCount);
    setLoading(false);
    setFlag(true);
  };

  const formatOrderValue = (orderValue) => {
    if (Math.abs(orderValue) >= 1e6) {
      return (orderValue / 1e6).toFixed(2) + "M";
    } else {
      return orderValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  };
  // useEffect(() => {
  //   getContracts();
  // }, []);
  const openDisapproved = () => {
    setIsDisapprovedOpen(true);
  };

  const findDate = (data, index, type) => {
    if (contractList) {
      let foundDate = "Date Not Found";

      contractList.forEach((contract) => {
        const productsArray = contract?.order[0]?.productsArray;

        if (productsArray) {
          const matchingProduct = productsArray.find(
            (product) => product._id === data.orderProductId
          );
          console.log(productsArray);
          if (matchingProduct) {
            foundDate = format(
              new Date(
                type === "start"
                  ? matchingProduct.coverageStartDate
                  : matchingProduct.coverageEndDate
              ),
              "MM-dd-yyyy"
            );
          }
        }
      });

      return foundDate;
    }

    return "Date Not Found";
  };

  const handlePageChange = async (page, rowsPerPage) => {
    console.log(props, rowsPerPage);
    setLoading(true);
    try {
      if (props?.flag == "contracts") {
        await getContract(props?.orderId, page, rowsPerPage);
      } else if (props?.flag != "") {
        await getContract(null, page, rowsPerPage);
      } else {
        await getContract(null, page, rowsPerPage);
      }
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const status = [
    { label: "Active", value: true },
    { label: "Waiting", value: false },
    { label: "Expired", value: false },
  ];
  return (
    <>
      <div className="mb-8 ml-3">
        <Headbar />

        {props.orderId == null && props?.flag == undefined ? (
          <div className="flex mt-2">
            <div className="pl-3">
              <p className="font-bold text-[36px] leading-9	mb-[3px]">
                Contracts
              </p>
              <ul className="flex self-center">
                <li className="text-sm text-neutral-grey font-Regular">
                  <Link to={"/"}>Contracts /</Link>{" "}
                </li>
                <li className="text-sm text-neutral-grey font-semibold ml-1">
                  Contracts List
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <></>
        )}

        <div className="bg-white mt-6 border-[1px] border-[#D1D1D1] rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className="col-span-3 self-center">
              <p className="text-xl font-semibold">Contracts List</p>
            </div>
            <div className="col-span-9">
              <div className="bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                <Grid className="!grid-cols-9">
                  <div className="col-span-2 self-center">
                    <Input
                      name="Name"
                      type="text"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="Contract ID"
                    />
                  </div>
                  <div className="col-span-2 self-center">
                    <Input
                      name="Email"
                      type="text"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder=" Order ID"
                    />
                  </div>
                  <div className="col-span-2 self-center">
                    <Input
                      name="PhoneNo."
                      type="text"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="Dealer P.O. #"
                    />
                  </div>
                  <div className="col-span-1 self-center flex justify-center">
                    <Button type="submit" className="!p-0">
                      <img
                        src={Search}
                        className="cursor-pointer "
                        alt="Search"
                      />
                    </Button>
                    <Button type="submit" className="!bg-transparent !p-0">
                      <img
                        src={clearFilter}
                        className="cursor-pointer	mx-auto"
                        alt="clearFilter"
                      />
                    </Button>
                  </div>
                  <div className="col-span-2 self-center">
                    <Button
                      className="!text-[13px] !px-2"
                      onClick={() => openDisapproved()}
                    >
                      Advance Search
                    </Button>
                  </div>
                </Grid>
              </div>
            </div>
          </Grid>
          {loading ? (
            <div className=" h-[400px] w-full flex py-5">
              <div className="self-center mx-auto">
                <RotateLoader color="#333" />
              </div>
            </div>
          ) : (
            <>
              {contractList &&
                contractList.map((res, index) => {
                  return (
                    <div className="px-3 mt-5">
                      <div>
                        <Grid className="bg-[#333333] !gap-2 !grid-cols-11 rounded-t-xl">
                          <div className="col-span-3 self-center text-center bg-contract bg-cover bg-right bg-no-repeat rounded-ss-xl">
                            <p className="text-white py-2 font-Regular">
                              Contract ID : <b> {res.unique_key} </b>
                            </p>
                          </div>
                          {props.orderId == null ? (
                            <>
                              <div className="col-span-3 self-center text-center bg-contract bg-cover bg-right bg-no-repeat ">
                                <p className="text-white py-2 font-Regular">
                                  Order ID :{" "}
                                  <b> {res?.order[0]?.unique_key} </b>
                                </p>
                              </div>
                              <div className="col-span-3 self-center text-center bg-contract bg-cover bg-right bg-no-repeat ">
                                <p className="text-white py-2 font-Regular">
                                  Dealer P.O. # :{" "}
                                  <b> {res?.order[0]?.venderOrder} </b>
                                </p>
                              </div>
                            </>
                          ) : (<div className="col-span-6 self-center justify-end"></div>)}

                          <div className="col-span-1 self-center justify-end"></div>
                          <div className="col-span-1 self-center flex justify-end">
                            <div
                              onClick={() => openView(res._id)}
                              className="self-center bg-[#464646] rounded-full cursor-pointer mr-2 p-1 text-center"
                            >
                              {" "}
                              <img
                                src={view}
                                className="ml-auto w-[23px] h-[23px] "
                                alt="edit"
                              />{" "}
                            </div>
                            <Link to={`/editContract/${res._id}`}>
                              {" "}
                              <img
                                src={Edit}
                                className="ml-auto mr-2"
                                alt="edit"
                              />{" "}
                            </Link>
                          </div>
                        </Grid>

                        <Grid className="!gap-0 !grid-cols-5 bg-[#F9F9F9] mb-5">
                          <div className="col-span-1 border border-[#D1D1D1] rounded-es-xl">
                            <div className="py-4 pl-3">
                              <p className="text-[#5D6E66] text-sm font-Regular">
                                Manufacturer
                              </p>
                              <p className="text-[#333333] text-base font-semibold">
                                {res.manufacture}
                              </p>
                            </div>
                          </div>
                          <div className="col-span-1 border border-[#D1D1D1]">
                            <div className="py-4 pl-3">
                              <p className="text-[#5D6E66] text-sm font-Regular">
                                Model
                              </p>
                              <p className="text-[#333333] text-base font-semibold">
                                {res.model}
                              </p>
                            </div>
                          </div>
                          <div className="col-span-1 border border-[#D1D1D1]">
                            <div className="py-4 pl-3">
                              <p className="text-[#5D6E66] text-sm font-Regular">
                                Serial #
                              </p>
                              <p className="text-[#333333] text-base font-semibold">
                                {res.serial}
                              </p>
                            </div>
                          </div>
                          <div className="col-span-1 border border-[#D1D1D1]">
                            <div className="py-4 pl-3">
                              <p className="text-[#5D6E66] text-sm font-Regular">
                                Status
                              </p>
                              <p className="text-[#333333] text-base font-semibold">
                                {res.status}
                              </p>
                            </div>
                          </div>
                          <div className="col-span-1 border border-[#D1D1D1] rounded-ee-xl">
                            <div className="py-4 pl-3">
                              <p className="text-[#5D6E66] text-sm font-Regular">
                                Eligibility
                              </p>
                              <p className="text-[#333333] text-base font-semibold">
                                {res.eligibilty}
                              </p>
                            </div>
                          </div>
                        </Grid>
                      </div>
                    </div>
                  );
                })}
            </>
          )}
          <CustomPagination
            totalRecords={totalRecords}
            rowsPerPageOptions={[10, 20, 50, 100]}
            onPageChange={handlePageChange}
          />
          <Modal isOpen={isDisapprovedOpen} onClose={closeDisapproved}>
            <Button
              onClick={closeDisapproved}
              className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]"
            >
              <img
                src={Cross}
                className="w-full h-full text-black rounded-full p-0"
              />
            </Button>
            <div className="py-3">
              <p className="text-center text-3xl font-semibold ">
                Advance Search
              </p>
              <Grid className="mt-5 px-6">
                <div className="col-span-6">
                  <Input
                    type="text"
                    name="Contract ID"
                    className="!bg-[#fff]"
                    label="Contract ID"
                    placeholder=""
                  />
                </div>
                {props.orderId == null && props?.flag == undefined ? ( <>
                  <div className="col-span-6">
                  <Input
                    type="text"
                    name="Order ID"
                    className="!bg-[#fff]"
                    label="Order ID"
                    placeholder=""
                  />
                </div>
                <div className="col-span-6">
                  <Input
                    type="text"
                    name="Dealer P.O. No."
                    className="!bg-[#fff]"
                    label="Dealer P.O. #"
                    placeholder=""
                  />
                </div></>) : ( '') }
               
                <div className="col-span-6">
                  <Input
                    type="text"
                    name="Serial No."
                    className="!bg-[#fff]"
                    label="Serial #"
                    placeholder=""
                  />
                </div>
                <div className="col-span-6">
                  <Input
                    type="text"
                    name="Product Name"
                    className="!bg-[#fff]"
                    label="Product Name"
                    placeholder=""
                  />
                </div>
                {props.orderId == null && props?.flag == undefined ? ( <>  <div className="col-span-6">
                  <Input
                    type="text"
                    name="Dealer Name"
                    className="!bg-[#fff]"
                    label="Dealer Name"
                    placeholder=""
                  />
                </div>
                <div className="col-span-6">
                  <Input
                    type="text"
                    name="Customer Name"
                    className="!bg-[#fff]"
                    label="Customer Name"
                    placeholder=""
                  />
                </div>
                <div className="col-span-6">
                  <Input
                    type="text"
                    name="Servicer Name"
                    className="!bg-[#fff]"
                    label="Servicer Name"
                    placeholder=""
                  />
                </div></>) : ('') }
               
                <div className="col-span-6">
                  <Input
                    type="text"
                    name="Model"
                    className="!bg-[#fff]"
                    label="Model"
                    placeholder=""
                  />
                </div>
                <div className="col-span-6">
                  <Input
                    type="text"
                    name="Manufacturer"
                    className="!bg-[#fff]"
                    label="Manufacturer"
                    placeholder=""
                  />
                </div>
                <div className="col-span-6">
                  <Select
                    name="Status"
                    label="Status"
                    options={status}
                    className="!bg-[#fff]"
                    placeholder=""
                  />
                </div>
                <div className="col-span-12">
                  <Button className={"w-full"}>Search</Button>
                </div>
              </Grid>
            </div>
          </Modal>

          <Modal
            isOpen={isViewOpen}
            onClose={closeView}
            className="!w-[1100px]"
          >
              <Button onClick={() => { navigate(`/editContract/${contractDetails._id}`) }} className={`absolute left-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full ${props?.orderId == null && props?.flag == undefined ? ('!bg-[#343434]') : ('!bg-gradient-to-t !from-[#454545] !to-[#575757]') } `}>
              <img src={Edit} className="w-full h-full text-black rounded-full p-0" />
            </Button>
            <Button
              onClick={closeView}
              className={`absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full ${props?.orderId == null && props?.flag == undefined ? ('!bg-gradient-to-t !from-[#4f4f4f] !to-[#616060]') : ('!bg-[#5f5f5f]') } `}
            >
              <img
                src={Cross}
                className="w-full h-full text-black rounded-full p-0"
              />
            </Button>
            <div className="text-center mt-2">
              <p className="text-3xl font-semibold mb-4">Contract Details </p>
              <div>
                {loading ? (
                  <div className=" h-[400px] w-full flex py-5">
                    <div className="self-center mx-auto">
                      <RotateLoader color="#333" />
                    </div>
                  </div>
                ) : (
                  <>
                    <Grid className="bg-[#333333] !gap-2 !grid-cols-11 !px-3 rounded-t-xl">
                      <div className="col-span-3 self-center text-left bg-contract bg-contain bg-right bg-no-repeat rounded-ss-xl">
                        <p className="text-white py-2 font-Regular">
                          Contract ID : <b> {contractDetails.unique_key} </b>
                        </p>
                      </div>
                      <div className="col-span-3 self-center text-left bg-contract bg-contain bg-right bg-no-repeat ">
                        <p className="text-white py-2 font-Regular">
                          Order ID :{" "}
                          <b> {contractDetails?.order?.[0]?.unique_key} </b>
                        </p>
                      </div>
                      <div className="col-span-3 self-center text-left bg-contract bg-contain bg-right bg-no-repeat ">
                        <p className="text-white py-2 font-Regular">
                          Dealer P.O. # :{" "}
                          <b> {contractDetails?.order?.[0]?.venderOrder} </b>
                        </p>
                      </div>
                      <div className="col-span-1"></div>
                      <div className="col-span-1 self-center justify-end self-center"></div>
                    </Grid>

                    <Grid className="!gap-0 !grid-cols-5 bg-[#F9F9F9] mb-5">
                      <div className="col-span-1 border border-[#D1D1D1]">
                        <div className="py-4 pl-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            Manufacturer
                          </p>
                          <p className="text-[#333333] text-base font-semibold">
                            {contractDetails?.manufacture}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-1 border border-[#D1D1D1]">
                        <div className="py-4 pl-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            Model
                          </p>
                          <p className="text-[#333333] text-base font-semibold">
                            {contractDetails?.model}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-1 border border-[#D1D1D1]">
                        <div className="py-4 pl-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            Serial #
                          </p>
                          <p className="text-[#333333] text-base font-semibold">
                            {contractDetails?.serial}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-1 border border-[#D1D1D1] ">
                        <div className="py-4 pl-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            Condition
                          </p>
                          <p className="text-[#333333] text-base font-semibold">
                            {contractDetails.condition}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-1 border border-[#D1D1D1] ">
                        <div className="py-4 pl-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            Retail Price
                          </p>
                          <p className="text-[#333333] text-base font-semibold">
                            $
                            {contractDetails.productValue === undefined
                              ? parseInt(0).toLocaleString(2)
                              : formatOrderValue(
                                  contractDetails.productValue ?? parseInt(0)
                                )}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-1 border border-[#D1D1D1]">
                        <div className="py-4 pl-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            Dealer Name
                          </p>
                          <p className="text-[#333333] text-base font-semibold">
                            {
                              contractDetails?.order?.[0]?.customer?.[0]
                                ?.dealerName
                            }
                          </p>
                        </div>
                      </div>
                      <div className="col-span-1 border border-[#D1D1D1]">
                        <div className="py-4 pl-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            Reseller Name
                          </p>
                          <p className="text-[#333333] text-base font-semibold">
                            {contractDetails?.order?.[0]?.reseller?.[0]?.name}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-1 border border-[#D1D1D1]">
                        <div className="py-4 pl-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            Customer Name
                          </p>
                          <p className="text-[#333333] text-base font-semibold">
                            {
                              contractDetails?.order?.[0]?.customer?.[0]
                                ?.username
                            }
                          </p>
                        </div>
                      </div>
                      <div className="col-span-1 border border-[#D1D1D1]">
                        <div className="py-4 pl-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            Servicer Name
                          </p>
                          <p className="text-[#333333] text-base font-semibold">
                            {
                              contractDetails?.order?.[0]?.servicer?.[0]
                                ?.username
                            }
                          </p>
                        </div>
                      </div>
                      <div className="col-span-1 border border-[#D1D1D1]">
                        <div className="py-4 pl-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            Status
                          </p>
                          <p className="text-[#333333] text-base font-semibold">
                            {contractDetails?.status}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-1 border border-[#D1D1D1]">
                        <div className="py-4 pl-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            Product Category
                          </p>
                          <p className="text-[#333333] text-base font-semibold">
                            {
                              contractDetails?.order?.[0]?.productsArray?.[0]
                                ?.priceType
                            }
                          </p>
                        </div>
                      </div>
                      <div className="col-span-1 border border-[#D1D1D1]">
                        <div className="py-4 pl-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            Product Name
                          </p>
                          <p className="text-[#333333] text-base font-semibold">
                            {contractDetails?.productName}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-1 border border-[#D1D1D1]">
                        <div className="py-4 pl-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            Product Description
                          </p>
                          <p className="text-[#333333] text-base font-semibold">
                            {
                              contractDetails?.order?.[0]?.productsArray?.[0]
                                ?.description
                            }
                          </p>
                        </div>
                      </div>
                      <div className="col-span-1 border border-[#D1D1D1]">
                        <div className="py-4 pl-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            Price Type
                          </p>
                          <p className="text-[#333333] text-base font-semibold">
                            {
                              contractDetails?.order?.[0]?.productsArray?.[0]
                                ?.priceType
                            }
                          </p>
                        </div>
                      </div>
                      <div className="col-span-1 border border-[#D1D1D1]">
                        <div className="py-4 pl-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            Eligibility
                          </p>
                          <p className="text-[#333333] text-base font-semibold">
                            {contractDetails?.eligibilty}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-1 border border-[#D1D1D1] rounded-es-xl">
                        <div className="py-4 pl-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            Claim Amount
                          </p>
                          <p className="text-[#333333] text-base font-semibold">
                            $0.00
                          </p>
                        </div>
                      </div>
                      {contractDetails?.order?.[0]?.productsArray?.[0]
                        ?.priceType == "Flat Pricing" ? (
                        <>
                          <div className="col-span-1 border border-[#D1D1D1]">
                            <div className="py-4 pl-3">
                              <p className="text-[#5D6E66] text-sm font-Regular">
                                Start Range
                              </p>
                              <p className="text-[#333333] text-base font-semibold">
                                $
                                {contractDetails?.order?.[0]?.productsArray?.[0]
                                  ?.rangeStart === undefined
                                  ? parseInt(0).toLocaleString(2)
                                  : formatOrderValue(
                                      contractDetails?.order?.[0]
                                        ?.productsArray?.[0]?.rangeStart ??
                                        parseInt(0)
                                    )}
                              </p>
                            </div>
                          </div>
                          <div className="col-span-1 border border-[#D1D1D1]">
                            <div className="py-4 pl-3">
                              <p className="text-[#5D6E66] text-sm font-Regular">
                                End Range
                              </p>
                              <p className="text-[#333333] text-base font-semibold">
                                $
                                {contractDetails?.order?.[0]?.productsArray?.[0]
                                  ?.rangeEnd === undefined
                                  ? parseInt(0).toLocaleString(2)
                                  : formatOrderValue(
                                      contractDetails?.order?.[0]
                                        ?.productsArray?.[0]?.rangeEnd ??
                                        parseInt(0)
                                    )}{" "}
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        ""
                      )}

                    
                      <div className="col-span-1 border border-[#D1D1D1] ">
                        <div className="py-4 pl-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            Coverage Start Date
                          </p>
                          <p className="text-[#333333] text-base font-semibold">
                            {new Date(
                              contractDetails?.order?.[0]?.productsArray?.[0]?.coverageStartDate
                            ).toLocaleDateString("en-US", {
                              month: "2-digit",
                              day: "2-digit",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-1 border border-[#D1D1D1] rounded-ee-xl">
                        <div className="py-4 pl-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            Coverage End Date
                          </p>
                          <p className="text-[#333333] text-base font-semibold">
                            {new Date(
                              contractDetails?.order?.[0]?.productsArray?.[0]?.coverageEndDate
                            ).toLocaleDateString("en-US", {
                              month: "2-digit",
                              day: "2-digit",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      {contractDetails?.order?.[0]?.productsArray?.[0]
                        ?.priceType == "Quantity Pricing" ? (
                        <>
                          <div className="col-soan-5">
                            <table className="w-full border text-center">
                              <tr className="border bg-[#9999]">
                                <th colSpan={"2"}>Quantity Pricing List </th>
                              </tr>
                              <tr className="border bg-[#9999]">
                                <th>Name</th>
                                <th> Quantity Per Unit</th>
                                <th> Quantity</th>
                              </tr>
                              {contractDetails?.order?.[0].productsArray?.[0]
                                ?.QuantityPricing.length !== 0 &&
                                contractDetails?.order?.[0].productsArray?.[0]?.QuantityPricing.map(
                                  (item, index) => (
                                    <tr key={index} className="border">
                                      <td>{item.name}</td>
                                      <td>{item.quantity}</td>
                                      <td>{item.enterQuantity}</td>
                                    </tr>
                                  )
                                )}
                            </table>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                    </Grid>
                  </>
                )}
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default ContractList;
