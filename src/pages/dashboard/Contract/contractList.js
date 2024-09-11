import React, { useState, useEffect } from "react";
import Button from "../../../common/button";
import Grid from "../../../common/grid";
import Input from "../../../common/input";

// Media Includes
import Search from "../../../assets/images/icons/SerachWhite.svg";
import Cross from "../../../assets/images/Cross.png";
import Edit from "../../../assets/images/Dealer/EditIcon.svg";
import view from "../../../assets/images/whiteView.png";
import clearFilter from "../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import Headbar from "../../../common/headBar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Modal from "../../../common/model";
import Select from "../../../common/select";
import { useFormik } from "formik";
import * as Yup from "yup";
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
import {
  getContractsforReseller,
  getContractsforResellerPortal,
} from "../../../services/reSellerServices";
import CommonTooltip from "../../../common/toolTip";
import Card from "../../../common/card";

function ContractList(props) {
  console.log(props);
  const [contractDetails, setContractDetails] = useState({});
  const [isDisapprovedOpen, setIsDisapprovedOpen] = useState(false);
  const [disable, setDisable] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [contractList, setContractList] = useState([]);
  const [contractCount, setContractCount] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageValue, setPageValue] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
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
    setDisable(true);
    setLoading(true);
    const result = await getContractValues(data);
    setContractDetails(result.result);
    setLoading(false);
    console.log("by ID -------------------", result);
    setDisable(false);
  };

  // useEffect(() => {
  //   if (props.activeTab === "Contracts") {
  //     getContract();
  //   }
  // }, [props.activeTab]);

  useEffect(() => {
    if (!flag) {
      getContract(props?.orderId ?? null);
    }
  }, [flag]);

  const handleSelectChange1 = (label, value) => {
    console.log(label, value, "selected");
    formik.setFieldValue("status", value);
    setSelectedProduct(value);
  };

  const handleSelectChange2 = (label, value) => {
    formik.setFieldValue("eligibilty", value);
    setValue(value);
  };

  const getContract = async (orderId = null, page = 1, rowsPerPage = 10) => {
    setDisable(true);
    setLoading(true);
    setPageValue(page);
    let data = {
      page: page,
      pageLimit: rowsPerPage,
      ...formik.values,
    };
    console.log(location.pathname.includes("/reseller"));

    try {
      const result = await (orderId == null && props?.flag == undefined
        ? location.pathname.includes("/reseller")
          ? getContractsforResellerPortal(data)
          : getAllContractsForAdmin(data)
        : props?.flag == "dealer" && props?.id
          ? getContractsforDealer(props.id, data)
          : props?.flag == "customer" && props?.id
            ? getContractsforCustomer(props.id, data)
            : props?.flag == "reseller" && props?.id
              ? getContractsforReseller(props.id, data)
              : getContracts(orderId, data));

      setContractCount(result.contractCount);
      setContractList(result.result);
      setTotalRecords(result?.totalCount);
    } catch (error) {
      setTotalRecords(0);
      console.error("Error fetching contracts:", error);
    } finally {
      setLoading(false);
      setDisable(false);
    }
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

  const openDisapproved = () => {
    setIsDisapprovedOpen(true);
  };
  const validationSchema = Yup.object().shape({});

  const initialValues = {
    orderId: "",
    venderOrder: "",
    contractId: "",
    dealerName: "",
    customerName: "",
    servicerName: "",
    manufacture: "",
    status: "",
    model: "",
    dealerSku: "",
    serial: "",
    productName: "",
    pName: "",
    eligibilty: "",
    resellerName: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      getContract(props?.orderId ?? null, 1, recordsPerPage);
      console.log(values);
      setIsDisapprovedOpen(false);
    },
  });

  const handlePageChange = async (page, rowsPerPage) => {
    setRecordsPerPage(rowsPerPage);
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
    { label: "Active", value: "Active" },
    { label: "Waiting", value: "Waiting" },
    { label: "Expired", value: "Expired" },
  ];
  const Eligible = [
    { label: "Eligible", value: true },
    { label: "Not Eligible", value: false },
  ];

  const handleSelectChange = (name, selectedValue) => {
    formik.setFieldValue(name, selectedValue);
  };
  const handleFilterIconClick = () => {
    formik.resetForm();
    setValue("");
    console.log(formik.values);
    setSelectedProduct("");
    // getContract();
  };
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
                  <Link to={"/"}>Home /</Link>{" "}
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

        <div className="mt-6 border-[1px] border-Light-Grey rounded-xl">
          <Card>
            <Grid className="!p-[26px] !pt-[14px] !pb-0">
              <div className="col-span-3 self-center">
                <p className="text-xl font-semibold">Contracts List</p>
              </div>
              <div className="col-span-9">
                <form onSubmit={formik.handleSubmit}>
                  <div className="bg-grayf9 rounded-[30px] p-3 border-[1px] border-Light-Grey">
                    <Grid className={`!grid-cols-9`}>
                      <div className="col-span-2 self-center">
                        <Input
                          type="text"
                          className="!text-[14px] !bg-White-Smoke"
                          className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
                          label=""
                          placeholder="Contract ID"
                          name="contractId"
                          {...formik.getFieldProps("contractId")}
                        />
                      </div>
                      {props.orderId == null ? (
                        <>
                          <div className="col-span-2 self-center">
                            <Input
                              name="orderId"
                              type="text"
                              className="!text-[14px] !bg-White-Smoke"
                              className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
                              label=""
                              placeholder=" Order ID"
                              {...formik.getFieldProps("orderId")}
                            />
                          </div>
                          <div className="col-span-2 self-center">
                            <Input
                              name="venderOrder"
                              type="text"
                              className="!text-[14px] !bg-White-Smoke"
                              className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
                              label=""
                              placeholder="Dealer P.O. #"
                              {...formik.getFieldProps("venderOrder")}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="col-span-2 self-center">
                            <Input
                              type="text"
                              name="serial"
                              className="!text-[14px] !bg-White-Smoke"
                              className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
                              label=""
                              placeholder="Serial # / Device ID"
                              {...formik.getFieldProps("serial")}
                            />
                          </div>
                          <div className="col-span-2 self-center">
                            <Select
                              label=""
                              options={Eligible}
                              color="text-Black-Russian opacity-50"
                              value={value}
                              OptionName="Eligible"
                              className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                              className="!text-[14px] !bg-white"
                              selectedValue={value}
                              onChange={handleSelectChange2}
                            />
                          </div>
                        </>
                      )}

                      <div className="col-span-1 self-center flex justify-center">
                        <Button
                          type="submit"
                          disabled={disable}
                          className={`${disable ? "!bg-[#817878] !p-2" : " !p-2"
                            }`}
                        >
                          <img
                            src={Search}
                            className="cursor-pointer "
                            alt="Search"
                          />
                        </Button>
                        <Button
                          type="submit"
                          disabled={disable}
                          className="!bg-transparent !p-0"
                          onClick={() => {
                            handleFilterIconClick();
                          }}
                        >
                          <img
                            src={clearFilter}
                            className="cursor-pointer	mx-auto"
                            alt="clearFilter"
                          />
                        </Button>
                      </div>
                      <div
                        className={`${props.orderId == null ? "" : "text-center"
                          } col-span-2 self-center`}
                      >
                        <Button
                          className={`${disable ? "!bg-[#817878]" : ""
                            } !text-[13px]`}
                          disabled={disable}
                          onClick={() => openDisapproved()}
                        >
                          Advance Search
                        </Button>
                      </div>
                    </Grid>
                  </div>
                </form>
              </div>
            </Grid>
            {/* {contractList?.length == 0   ? (
           
              <div className="text-center my-5">
                <p>No records found.</p>
              </div>
          ) : ( */}
            <div>
              <>
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
                          <div className="px-3 mt-5" key={index}>
                            <div>
                              <Grid className="bg-light-black !gap-2 !grid-cols-11 rounded-t-xl">
                                <div className="col-span-3 self-center text-center bg-contract bg-cover bg-right bg-no-repeat rounded-ss-xl">
                                  <p className="text-white py-2 font-Regular">
                                    Contract ID : <b> {res?.unique_key} </b>
                                  </p>
                                </div>
                                {props.orderId == null ? (
                                  <>
                                    <div className="col-span-3 self-center text-center bg-contract bg-cover bg-right bg-no-repeat ">
                                      <p className="text-white py-2 font-Regular">
                                        Order ID : <b> {res?.orderUniqueKey} </b>
                                      </p>
                                    </div>
                                    <div className="col-span-4 self-center text-le bg-contract bg-cover bg-right bg-no-repeat ">
                                      <p className="text-white py-2 font-Regular">
                                        Dealer P.O. # :{" "}
                                        <b> {res?.venderOrder} </b>
                                      </p>
                                    </div>
                                  </>
                                ) : (
                                  <div className="col-span-7 self-center justify-end"></div>
                                )}

                                {/* <div className="col-span-1 self-center justify-end"></div> */}
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
                                  {!window.location.pathname.includes(
                                    "/reseller/"
                                  ) || !window.location.pathname.includes(
                                    "/dealer/"
                                  ) || !window.location.pathname.includes(
                                    "/reseller/contractList") ?
                                    (props.shownEdit ||
                                      props.shownEdit === undefined ? (
                                      <Link to={`/editContract/${res._id}`}>
                                        <img
                                          src={Edit}
                                          className="ml-auto mr-2"
                                          alt="edit"
                                        />
                                      </Link>
                                    ) : null) : ''}
                                </div>
                              </Grid>

                              <Grid className="!gap-0 !grid-cols-5 bg-grayf9 mb-5">
                                <div className="col-span-1 border border-Light-Grey rounded-es-xl">
                                  <div className="py-4 pl-3">
                                    <p className="text-[#5D6E66] text-sm font-Regular">
                                      Manufacturer
                                    </p>
                                    <p className="text-light-black text-base font-semibold">
                                      {res.manufacture}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-span-1 border border-Light-Grey">
                                  <div className="py-4 pl-3">
                                    <p className="text-[#5D6E66] text-sm font-Regular">
                                      Model
                                    </p>
                                    <p className="text-light-black text-base font-semibold">
                                      {res.model}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-span-1 border border-Light-Grey">
                                  <div className="py-4 pl-3">
                                    <p className="text-[#5D6E66] text-sm font-Regular">
                                      Serial # / Device ID
                                    </p>
                                    <p className="text-light-black text-base font-semibold">
                                      {res.serial}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-span-1 border border-Light-Grey">
                                  <div className="py-4 pl-3">
                                    <p className="text-[#5D6E66] text-sm font-Regular">
                                      Status
                                    </p>
                                    <p className="text-light-black text-base font-semibold">
                                      {res.status}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-span-1 border border-Light-Grey rounded-ee-xl">
                                  <div className="py-4 pl-3">
                                    <p className="text-[#5D6E66] text-sm font-Regular">
                                      Eligibility
                                    </p>
                                    {res?.eligibilty === false ? (
                                      <>
                                        <CommonTooltip
                                          place="left"
                                          id={`tooltip-${index}`}
                                          content={res?.reason}
                                        >
                                          <p className="text-light-black cursor-pointer text-base font-semibold">
                                            Not Eligible
                                          </p>
                                        </CommonTooltip>
                                      </>
                                    ) : (
                                      <p className="text-light-black text-base font-semibold">
                                        Eligible
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </Grid>
                            </div>
                          </div>
                        );
                      })}
                  </>
                )}
              </>

              {totalRecords == 0 && !loading ? (
                <div className="text-center my-5">
                  <p>No records found</p>
                </div>
              ) : (
                <>
                  <CustomPagination
                    totalRecords={totalRecords}
                    page={pageValue}
                    className={loading ? "opacity-0	" : "opacity-100"}
                    rowsPerPageOptions={[10, 20, 50, 100]}
                    onPageChange={handlePageChange}
                    setRecordsPerPage={setRecordsPerPage}
                  />
                </>
              )}
            </div>
          </Card>
          {/* )} */}

        </div>
      </div>
      <Modal isOpen={isDisapprovedOpen} onClose={closeDisapproved}>
        <Button
          onClick={closeDisapproved}
          className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-Granite-Gray"
        >
          <img
            src={Cross}
            className="w-full h-full text-black rounded-full p-0"
          />
        </Button>
        <form onSubmit={formik.handleSubmit}>
          <div className="py-3">
            <p className="text-center text-3xl font-semibold ">
              Advance Search
            </p>
            <div className="max-h-[70vh] overflow-y-scroll">
              <Grid className="my-5 px-6">
                <div className="col-span-6">
                  <Input
                    type="text"
                    name="contractId"
                    className="!bg-white"
                    label="Contract ID"
                    placeholder=""
                    {...formik.getFieldProps("contractId")}
                  />
                </div>
                {props.orderId == null ? (
                  <>
                    <div className="col-span-6">
                      <Input
                        type="text"
                        name="orderId"
                        className="!bg-white"
                        label="Order ID"
                        {...formik.getFieldProps("orderId")}
                        placeholder=""
                      />
                    </div>
                    <div className="col-span-6">
                      <Input
                        type="text"
                        name="venderOrder"
                        className="!bg-white"
                        label="Dealer P.O. #"
                        {...formik.getFieldProps("venderOrder")}
                        placeholder=""
                      />
                    </div>
                  </>
                ) : (
                  ""
                )}

                <div className="col-span-6">
                  <Input
                    type="text"
                    name="serial"
                    className="!bg-white"
                    label="Serial # / Device ID"
                    placeholder=""
                    {...formik.getFieldProps("serial")}
                  />
                </div>
                {window.location.pathname.includes(
                  "/reseller/") || window.location.pathname.includes(
                    "/dealer/") ? '' : <div className="col-span-6">
                  <Input
                    type="text"
                    name="productName"
                    className="!bg-white"
                    label="Product SKU"
                    placeholder=""
                    {...formik.getFieldProps("productName")}
                  />
                </div>}
                <div className="col-span-6">
                  <Input
                    type="text"
                    name="dealerSku"
                    className="!bg-white"
                    label="Dealer SKU"
                    placeholder=""
                    {...formik.getFieldProps("dealerSku")}
                  />
                </div>
                <div className="col-span-6">
                  <Input
                    type="text"
                    name="pName"
                    className="!bg-white"
                    label="Product Name"
                    placeholder=""
                    {...formik.getFieldProps("pName")}
                  />
                </div>
                {props.orderId == null ? (
                  <>
                    {props.flag === "customer" ? (
                      <>
                        {/* Hide dealerName, resellerName, and customerName for customer */}
                        <div className="col-span-6">
                          <Input
                            type="text"
                            name="servicerName"
                            className="!bg-white"
                            label="Servicer Name"
                            {...formik.getFieldProps("servicerName")}
                            placeholder=""
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        {props.flag === "reseller" ||
                          location.pathname.includes("/reseller") ||
                          location.pathname.includes("/reseller/") ? (
                          <>
                            {/* Hide dealerName and resellerName for reseller */}
                            <div className="col-span-6">
                              <Input
                                type="text"
                                name="customerName"
                                className="!bg-white"
                                label="Customer Name"
                                {...formik.getFieldProps("customerName")}
                                placeholder=""
                              />
                            </div>
                            <div className="col-span-6">
                              <Input
                                type="text"
                                name="servicerName"
                                className="!bg-white"
                                label="Servicer Name"
                                {...formik.getFieldProps("servicerName")}
                                placeholder=""
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            {props.flag === "dealer" ? (
                              <>
                                {/* Hide dealerName for dealer */}
                                <div className="col-span-6">
                                  <Input
                                    type="text"
                                    name="resellerName"
                                    className="!bg-white"
                                    label="Reseller Name"
                                    {...formik.getFieldProps("resellerName")}
                                    placeholder=""
                                  />
                                </div>
                                <div className="col-span-6">
                                  <Input
                                    type="text"
                                    name="customerName"
                                    className="!bg-white"
                                    label="Customer Name"
                                    {...formik.getFieldProps("customerName")}
                                    placeholder=""
                                  />
                                </div>
                                <div className="col-span-6">
                                  <Input
                                    type="text"
                                    name="servicerName"
                                    className="!bg-white"
                                    label="Servicer Name"
                                    {...formik.getFieldProps("servicerName")}
                                    placeholder=""
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                {/* Default case, show all fields */}
                                <div className="col-span-6">
                                  <Input
                                    type="text"
                                    name="dealerName"
                                    className="!bg-white"
                                    label="Dealer Name"
                                    {...formik.getFieldProps("dealerName")}
                                    placeholder=""
                                  />
                                </div>
                                <div className="col-span-6">
                                  <Input
                                    type="text"
                                    name="resellerName"
                                    className="!bg-white"
                                    label="Reseller Name"
                                    {...formik.getFieldProps("resellerName")}
                                    placeholder=""
                                  />
                                </div>
                                <div className="col-span-6">
                                  <Input
                                    type="text"
                                    name="customerName"
                                    className="!bg-white"
                                    label="Customer Name"
                                    {...formik.getFieldProps("customerName")}
                                    placeholder=""
                                  />
                                </div>
                                <div className="col-span-6">
                                  <Input
                                    type="text"
                                    name="servicerName"
                                    className="!bg-white"
                                    label="Servicer Name"
                                    {...formik.getFieldProps("servicerName")}
                                    placeholder=""
                                  />
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  ""
                )}

                <div className="col-span-6">
                  <Input
                    type="text"
                    name="model"
                    className="!bg-white"
                    label="Model"
                    placeholder=""
                    {...formik.getFieldProps("model")}
                  />
                </div>
                <div className="col-span-6">
                  <Input
                    type="text"
                    name="manufacture"
                    className="!bg-white"
                    label="Manufacturer"
                    placeholder=""
                    {...formik.getFieldProps("manufacture")}
                  />
                </div>
                <div className="col-span-6">
                  <Select
                    label="Status"
                    options={status}
                    color="text-Black-Russian opacity-50"
                    value={selectedProduct}
                    // className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                    className="!text-[14px] !bg-white"
                    selectedValue={selectedProduct}
                    onChange={handleSelectChange1}
                  />
                </div>
                <div className="col-span-6">
                  <Select
                    label="Eligibility"
                    options={Eligible}
                    color="text-Black-Russian opacity-50"
                    value={value}
                    // className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                    className="!text-[14px] !bg-white"
                    selectedValue={value}
                    onChange={handleSelectChange2}
                  />
                </div>

              </Grid>
            </div>

            <div className="px-6">
              <Button type="submit" className={"w-full"}>
                Search
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isViewOpen}
        onClose={closeView}
        className="!w-[1100px]"
      >
        { }
        {window.location.pathname.includes(
          "/reseller"
        ) ? null : props.shownEdit || props.shownEdit === undefined ? ( // Check if location includes "/reseller"
          <Button
            onClick={() => {
              navigate(`/editContract/${contractDetails._id}`);
            }}
            className={`absolute left-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full ${props?.orderId == null && props?.flag == undefined
              ? "!bg-[#343434]"
              : "!bg-gradient-to-t !from-[#454545] !to-[#575757]"
              } `}
          >
            <img
              src={Edit}
              className="w-full h-full text-black rounded-full p-0"
            />
          </Button>
        ) : null}

        <Button
          onClick={closeView}
          className={`absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full ${props?.orderId == null && props?.flag == undefined
            ? "!bg-gradient-to-t !from-[#4f4f4f] !to-[#616060]"
            : "!bg-Granite-Gray"
            } `}
        >
          <img
            src={Cross}
            className="w-full h-full text-black rounded-full p-0"
          />
        </Button>
        <div className="text-center mt-2">
          <p className="text-3xl font-semibold mb-4">Contract Details</p>
          <div>
            {loading ? (
              <div className=" h-[400px] w-full flex py-5">
                <div className="self-center mx-auto">
                  <RotateLoader color="#333" />
                </div>
              </div>
            ) : (
              <>
                <Grid className="bg-light-black !gap-2 !grid-cols-11 !px-3 rounded-t-xl">
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
                  <div className="col-span-4 self-center text-left bg-contract bg-contain bg-right bg-no-repeat ">
                    <p className="text-white py-2 font-Regular">
                      Dealer P.O. # :{" "}
                      <b> {contractDetails?.order?.[0]?.venderOrder} </b>
                    </p>
                  </div>
                  <div className="col-span-1 self-center justify-end"></div>
                </Grid>

                <Grid className="!gap-0 !grid-cols-5 bg-grayf9 mb-5 max-h-[70vh] overflow-y-scroll">
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Manufacturer
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {contractDetails?.manufacture}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Model
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {contractDetails?.model}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Serial # / Device ID
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {contractDetails?.serial}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey ">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Condition
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {contractDetails.condition}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey ">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Retail Price
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        $
                        {contractDetails.productValue === undefined
                          ? parseInt(0).toLocaleString(2)
                          : formatOrderValue(
                            Number(contractDetails.productValue) ??
                            parseInt(0)
                          )}
                      </p>
                    </div>
                  </div>
                  {props.flag === "dealer" ? null : (
                    <>
                      {!window.location.pathname.includes("/reseller") &&
                        !window.location.pathname.includes(
                          "/customerDetails"
                        ) &&
                        (props.shownEdit ||
                          props.shownEdit === undefined ? (
                          <div className="col-span-1 border border-Light-Grey">
                            <div className="py-4 pl3">
                              <p className="text-[#5D6E66] text-sm font-Regular">
                                Dealer Name
                              </p>
                              <p className="text-light-black text-base font-semibold">
                                {
                                  contractDetails?.order?.[0]?.customer?.[0]
                                    ?.dealerName
                                }
                              </p>
                            </div>
                          </div>
                        ) : null)}
                    </>
                  )}

                  {!window.location.pathname.includes("/reseller") &&
                    !window.location.pathname.includes(
                      "/customerDetails"
                    ) &&
                    (props.isShow || props.isShown === undefined ? (
                      <div className="col-span-1 border border-Light-Grey">
                        <div className="py-4 pl-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            Reseller Name
                          </p>
                          <p className="text-light-black text-base font-semibold">
                            {
                              contractDetails?.order?.[0]?.reseller?.[0]
                                ?.name
                            }
                          </p>
                        </div>
                      </div>
                    ) : null)}

                  {!window.location.pathname.includes("/customerDetails") &&
                    (props.type != "customer" || props.type == undefined) ? (
                    <div className="col-span-1 border border-Light-Grey">
                      <div className="py-4 pl-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Customer Name
                        </p>
                        <p className="text-light-black text-base font-semibold">
                          {
                            contractDetails?.order?.[0]?.customer?.[0]
                              ?.username
                          }
                        </p>
                      </div>
                    </div>
                  ) : null}
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Servicer Name
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {contractDetails?.order?.[0]?.servicer?.[0]?.name}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Status
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {contractDetails?.status}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Product Category
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {
                          contractDetails?.order?.[0]?.productsArray?.[0]
                            ?.priceBook?.[0].category.name
                        }
                      </p>
                    </div>
                  </div>
                  {window.location.pathname.includes(
                    "/reseller/") || window.location.pathname.includes(
                      "/dealer/") ? '' :
                    <div className="col-span-1 border border-Light-Grey">
                      <div className="py-4 pl-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Product SKU
                        </p>
                        <p className="text-light-black text-base font-semibold">
                          {contractDetails?.productName}
                        </p>
                      </div>
                    </div>
                  }
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Dealer SKU
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {contractDetails?.dealerSku}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Product Name
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {contractDetails?.pName}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Product Description
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {
                          contractDetails?.order?.[0]?.productsArray?.[0]
                            ?.description
                        }
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Price Type
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {
                          contractDetails?.order?.[0]?.productsArray?.[0]
                            ?.priceType
                        }
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Eligibility
                      </p>
                      {contractDetails?.eligibilty === false ? (
                        <>
                          <CommonTooltip
                            place="top"
                            id="tooltip-default"
                            content={contractDetails?.reason}
                          >
                            <p className="text-light-black cursor-pointer text-base font-semibold">
                              Not Eligible
                            </p>
                          </CommonTooltip>
                        </>
                      ) : (
                        <p className="text-light-black text-base font-semibold">
                          Eligible
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Claim Amount
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        $
                        {contractDetails.claimAmount === undefined
                          ? parseInt(0).toLocaleString(2)
                          : formatOrderValue(
                            contractDetails.claimAmount ?? parseInt(0)
                          )}
                      </p>
                    </div>
                  </div>
                  {contractDetails?.order?.[0]?.productsArray?.[0]
                    ?.priceType == "Flat Pricing" ? (
                    <>
                      <div className="col-span-1 border border-Light-Grey">
                        <div className="py-4 pl-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            Start Range
                          </p>
                          <p className="text-light-black text-base font-semibold">
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
                      <div className="col-span-1 border border-Light-Grey">
                        <div className="py-4 pl-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            End Range
                          </p>
                          <p className="text-light-black text-base font-semibold">
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
                  <div className="col-span-1 border border-Light-Grey ">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Coverage Start Date
                      </p>
                      <p className="text-light-black text-base font-semibold">
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
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Coverage End Date
                      </p>
                      <p className="text-light-black text-base font-semibold">
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
                  <div className="col-span-1 border border-Light-Grey ">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Labour Warranty Start Date
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {new Date(
                          contractDetails?.labourWarranty
                        ).toLocaleDateString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey ">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Part Warranty Start Date
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {new Date(
                          contractDetails?.partsWarranty
                        ).toLocaleDateString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey ">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Purchase Date
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {new Date(
                          contractDetails?.purchaseDate
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
                      <div className="col-span-5">
                        <table className="w-full border text-center">
                          <tr className="border bg-[#9999]">
                            <th colSpan={"3"}>Quantity Pricing List </th>
                          </tr>
                          <tr className="border bg-[#9999]">
                            <th className="w-1/3">Name</th>
                            <th className="w-1/3"> Quantity Per Unit</th>
                            <th className="w-1/3"> Quantity</th>
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
    </>
  );
}

export default ContractList;
