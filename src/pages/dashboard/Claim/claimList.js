import React, { useEffect, useRef, useState } from "react";
import Button from "../../../common/button";
import Grid from "../../../common/grid";
import Input from "../../../common/input";

// Media Includes
import DeleteImage from "../../../assets/images/icons/Delete.svg";
import Search from "../../../assets/images/icons/SearchIcon.svg";
import productName from "../../../assets/images/icons/productName1.svg";
import Track from "../../../assets/images/track.png";
import Complete from "../../../assets/images/completed.png";
import Reject from "../../../assets/images/reject.png";
import Open from "../../../assets/images/open.png";
import Sendto from "../../../assets/images/double-arrow.png";
import AddItem from "../../../assets/images/icons/addItem.svg";
import model from "../../../assets/images/icons/ProductModel.svg";
import serial from "../../../assets/images/icons/ProductSerial.svg";
import Manufacturer from "../../../assets/images/icons/ProductManufacturer.svg";
import Edit from "../../../assets/images/icons/editIcon.svg";
import download from "../../../assets/images/download.png";
import request from "../../../assets/images/quote-request.png";
import productSent from "../../../assets/images/product.png";
import shiping from "../../../assets/images/shiping.png";
import labor from "../../../assets/images/labor.png";
import parts from "../../../assets/images/parts.png";
import productReceived from "../../../assets/images/received.png";
import chat from "../../../assets/images/icons/chatIcon.svg";
import DropActive from "../../../assets/images/icons/DropActive.svg";
import clearFilter from "../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import arrowImage from "../../../assets/images/dropdownArrow.png";
import upload from "../../../assets/images/icons/upload.svg";
import Select from "../../../common/select";
import Cross from "../../../assets/images/Cross.png";
import Headbar from "../../../common/headBar";
import { Link } from "react-router-dom";
import Modal from "../../../common/model";
import CollapsibleDiv from "../../../common/collapsibleDiv";
import {
  addClaimsRepairParts,
  editClaimStatus,
  getClaimList,
} from "../../../services/claimServices";
import { format } from "date-fns";
import { useFormik } from "formik";
import * as Yup from "yup";

function ClaimList() {
  const [selectedValue, setSelectedValue] = useState("");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isAttachmentsOpen, setIsAttachmentsOpen] = useState(false);
  const [isDisapprovedOpen, setIsDisapprovedOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownVisible2, setDropdownVisible2] = useState(false);
  const [dropdownVisible1, setDropdownVisible1] = useState(false);
  const [claimList, setClaimList] = useState({});
  const [serviceType, setServiceType] = useState([]);
  const [claimId, setClaimId] = useState("");
  const [claimType, setClaimType] = useState({ bdAdh: "" });
  const [servicer, setServicer] = useState("");
  const [servicerList, setServicerList] = useState([]);
  const [customerStatus, setCustomerStatus] = useState({
    status: "",
    date: "",
  });
  const [claimStatus, setClaimStatus] = useState({ status: "", date: "" });
  const [repairStatus, setRepairStatus] = useState({ status: "", date: "" });
  const [initialValues, setInitialValues] = useState({
    repairParts: [{ serviceType: "", description: "", price: "" }],
    note: "",
  });
  const dropdownRef = useRef(null);
  const handleToggleDropdown = (value) => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleSelectChange = (selectedValue, value) => {
    const updateAndCallAPI = (setter) => {
      setter((prevRes) => ({ ...prevRes, status: value }));
      editClaimValue(claimList.result[activeIndex]._id, selectedValue, value);
    };

    switch (selectedValue) {
      case "customerStatus":
        updateAndCallAPI(setCustomerStatus);
        break;
      case "claimStatus":
        updateAndCallAPI(setClaimStatus);
        break;
      case "repairStatus":
        updateAndCallAPI(setRepairStatus);
        break;
      default:
        updateAndCallAPI(setClaimType);
    }
  };

  const updateAndSetStatus = (statusObject, name, res) => {
    if (res.code === 200) {
      const resultData = res.result || {};
      console.log(resultData[`${name}`][0]);
      statusObject({
        status: resultData[`${name}`][0].status,
        date: resultData[`${name}`][0].date,
      });
    }
  };
  const editClaimValue = (claimId, statusType, statusValue) => {
    let data = {
      [statusType]: statusValue,
    };
    console.log(data);
    editClaimStatus(claimId, data).then((res) => {
      updateAndSetStatus(setClaimStatus, "claimStatus", res);
      updateAndSetStatus(setRepairStatus, "repairStatus", res);
      updateAndSetStatus(setCustomerStatus, "customerStatus", res);
    });
  };

  const getAllClaims = async () => {
    const result = await getClaimList();
    setClaimList(result);
    console.log(result.result);
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

  const handleToggleDropdown1 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  const handleToggleDropdown2 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };
  const closeDisapproved = () => {
    setIsDisapprovedOpen(false);
  };

  const openDisapproved = () => {
    setIsDisapprovedOpen(true);
  };
  const closeEdit = () => {
    // formik.resetForm();
    setIsEditOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
        setDropdownVisible1(false);
        setDropdownVisible2(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const openEdit = (res, index) => {
    if (res.repairParts.length != 0) {
      const repairPartsValues = res?.repairParts?.map((part) => ({
        serviceType: part.serviceType || "",
        description: part.description || "",
        price: part.price || "",
      }));
      formik.setValues({
        repairParts: repairPartsValues,
        note: claimList.result[index].note || " ",
      });
    } else {
      formik.setValues({
        repairParts: [{ serviceType: "", description: "", price: "" }],
        note: claimList.result[index].note || " ",
      });
    }
    const getServiceType = (coverageType) => {
      console.log(coverageType);
      switch (coverageType) {
        case "Parts":
          return [
            { label: "Parts", value: "Parts" },
            { label: "Shipping", value: "Shipping" },
          ];
        case "Labour":
          return [
            { label: "Labour", value: "Labour" },
            { label: "Shipping", value: "Shipping" },
          ];
        default:
          return [
            { label: "Parts", value: "Parts" },
            { label: "Labour", value: "Labour" },
            { label: "Shipping", value: "Shipping" },
          ];
      }
    };
    setServiceType(getServiceType(res.action));
    setClaimId(res._id);
    setIsEditOpen(true);
  };

  const calculateTotalCost = (repairParts) => {
    // Calculate the total cost by summing up the prices of all repair parts
    const totalCost = repairParts.reduce((sum, part) => {
      // Convert the price to a number and add it to the sum
      return sum + Number(part.price || 0);
    }, 0);

    // Return the total cost rounded to two decimal places
    return totalCost.toFixed(2);
  };

  const closeView = () => {
    formik.resetForm();
    setIsViewOpen(false);
  };

  const openAttachments = () => {
    setIsAttachmentsOpen(true);
  };
  const closeAttachments = () => {
    setIsAttachmentsOpen(false);
  };

  const openView = () => {
    setIsViewOpen(true);
  };

  // Conditionally define initialValues based on repairParts length
  useEffect(() => {
    if (claimList?.result?.repairParts?.length !== 0) {
      const mappedValues = claimList?.result?.repairParts?.map((part) => ({
        serviceType: part.serviceType || "",
        description: part.description || "",
        price: part.price || "",
      }));
      console.log(mappedValues);
      setInitialValues({
        repairParts: mappedValues,
        note: "",
      });
    }
  }, [claimList]);

  const downloadAttachments = (res) => {
    const attachments = res || [];
    const container = document.createElement("div");

    attachments.forEach((attachment, index) => {
      const anchor = document.createElement("a");
      anchor.href = `http://15.207.221.207:3002/uploads/claimFile/${attachment.filename}`;
      anchor.download = `file_${index + 1}`;

      if (
        attachment.contentType &&
        !attachment.contentType.startsWith("image")
      ) {
        anchor.type = attachment.contentType;
      }
      anchor.target = "_blank";

      container.appendChild(anchor);
    });

    document.body.appendChild(container);

    container.childNodes.forEach((anchor) => {
      anchor.click();
    });

    document.body.removeChild(container);
  };

  useEffect(() => {
    if (activeIndex != null) {
      console.log(claimList.result[activeIndex].bdAdh);
      const bdAdhValue = claimList.result[activeIndex]?.bdAdh;
      const customerValue = claimList.result[activeIndex]?.customerStatus[0];
      const claimStatus = claimList.result[activeIndex]?.claimStatus[0];
      const repairStatus = claimList.result[activeIndex]?.repairStatus[0];
      setServicer(claimList.result[activeIndex].servicerId);
      let arr = [];
      const filterServicer = claimList.result[
        activeIndex
      ].contracts.allServicer.map((res) => ({
        label: res.name,
        value: res._id,
      }));

      setServicerList(filterServicer);
      console.log(
        claimList.result[activeIndex].contracts.allServicer,
        filterServicer
      );

      setClaimType({ bdAdh: bdAdhValue });
      setCustomerStatus({
        status: customerValue.status,
        date: customerValue.date,
      });
      setClaimStatus({ status: claimStatus.status, date: claimStatus.date });
      setRepairStatus({ status: repairStatus.status, date: repairStatus.date });
    }
  }, [activeIndex]);

  // Use useFormik with the correct initialValues
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      repairParts: Yup.array().of(
        Yup.object().shape({
          serviceType: Yup.string().required("Service Type is required"),
          description: Yup.string().required("Description is required"),
          price: Yup.number()
            .required("Price is required")
            .min(0.1, "Price must be at least 0.1"),
        })
      ),
    }),
    onSubmit: (values) => {
      addClaimsRepairParts(claimId, values).then((res) => {
        console.log(res);
        closeEdit();
        getAllClaims();
      });
      // Handle form submission here
      console.log(values);
    },
  });

  console.log(initialValues);
  const handleRemove = (index) => {
    const updatedRepairParts = [...formik.values.repairParts];
    updatedRepairParts.splice(index, 1);
    formik.setFieldValue("repairParts", updatedRepairParts);
  };
  const handleAddMore = () => {
    formik.setFieldValue("repairParts", [
      ...formik.values.repairParts,
      { serviceType: "", description: "", price: "" },
    ]);
  };
  const status = [
    { label: "Active", value: true },
    { label: "Waiting", value: false },
    { label: "Expired", value: false },
  ];

  useEffect(() => {
    getAllClaims();
  }, []);

  const state = [
    { label: "Admin", value: "65e030feb6c38c56a9951fc8" },
    { label: "Dealer", value: false },
    { label: "Reseller", value: false },
    { label: "Servicer", value: false },
    { label: "Customer", value: false },
  ];

  const claim = [
    { label: "Breakdown", value: "Breakdown" },
    { label: "Accidental", value: "Accidental" },
  ];

  const customerValue = [
    {
      value: "Request Submitted",
      label: "Request Submitted",
    },
    {
      value: "Shipping Label Received",
      label: "Shipping Label Received",
    },
    {
      value: "Product Sent",
      label: "Product Sent",
    },
    {
      value: "Product Received",
      label: "Product Received",
    },
  ];

  const repairValue = [
    {
      value: "Request Approved",
      label: "Request Approved",
    },
    {
      value: "Product Received",
      label: "Product Received",
    },
    {
      value: "Repair in Process",
      label: "Repair in Process",
    },
    {
      value: "Parts Needed",
      label: "Parts Needed",
    },
    {
      value: "Parts Ordered",
      label: "Parts Ordered",
    },
    {
      value: "Parts Received",
      label: "Parts Received",
    },
    {
      value: "Repair Complete",
      label: "Repair Complete",
    },
    {
      value: "Servicer Shipped",
      label: "Servicer Shipped",
    },
    {
      value: "Invoice Sent",
      label: "Invoice Sent",
    },
    {
      value: "Invoice Paid",
      label: "Invoice Paid",
    },
  ];
  const claimvalues = [
    {
      value: "Open",
      label: "Open",
    },
    {
      value: "Completed",
      label: "Completed",
    },
    {
      value: "Rejected",
      label: "Rejected",
    },
  ];

  const handleChange = (name, value) => {
    formik.setFieldValue(name, value);
  };
  return (
    <>
      <div className="mb-8 ml-3">
        <Headbar />
        <div className="flex mt-2">
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9 mb-[3px]">Claim</p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/"}>Claim </Link> <span className="mx-2"> /</span>
              </li>
              <li className="text-sm text-neutral-grey font-semibold ml-1">
                {" "}
                Claim Listing
              </li>
            </ul>
          </div>
        </div>

        <Link
          to={"/addClaim"}
          className=" w-[150px] !bg-white font-semibold py-2 px-4 ml-auto flex self-center mb-3 rounded-xl ml-auto border-[1px] border-[#D1D1D1]"
        >
          {" "}
          <img src={AddItem} className="self-center" alt="AddItem" />{" "}
          <span className="text-black ml-3 text-[14px] font-Regular">
            Add Claim{" "}
          </span>{" "}
        </Link>

        <div className="bg-white my-4 pb-4 border-[1px] border-[#D1D1D1] rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className="col-span-2 self-center">
              <p className="text-xl font-semibold">Claims List</p>
            </div>
            <div className="col-span-10">
              <div className="bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                <Grid className="">
                  <div className="col-span-8">
                    <Grid className="">
                      <div className="col-span-3 self-center">
                        <Input
                          name="Name"
                          type="text"
                          className="!text-[14px] !bg-[#f7f7f7]"
                          className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                          label=""
                          placeholder="Contract ID"
                        />
                      </div>
                      <div className="col-span-3 self-center">
                        <Input
                          name="Email"
                          type="email"
                          className="!text-[14px] !bg-[#f7f7f7]"
                          className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                          label=""
                          placeholder="Claim"
                        />
                      </div>
                      <div className="col-span-3 self-center">
                        <Input
                          name="PhoneNo."
                          type="text"
                          className="!text-[14px] !bg-[#f7f7f7]"
                          className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                          label=""
                          placeholder="Customer Status"
                        />
                      </div>
                      <div className="col-span-3 self-center">
                        <Input
                          name="PhoneNo."
                          type="text"
                          className="!text-[14px] !bg-[#f7f7f7]"
                          className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                          label=""
                          placeholder="Repair Status"
                        />
                      </div>
                    </Grid>
                  </div>

                  <div className="col-span-4 self-center flex justify-center">
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
                    <Button
                      type="submit"
                      className="ml-2 !text-sm"
                      onClick={() => openDisapproved()}
                    >
                      Advance Search
                    </Button>
                  </div>
                </Grid>
              </div>
            </div>
          </Grid>

          <div className="px-3 mt-5">
            {claimList?.result &&
              claimList?.result?.length !== 0 &&
              claimList?.result?.map((res, index) => {
                return (
                  <CollapsibleDiv
                    index={index}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    title={
                      <>
                        {" "}
                        <Grid className="border-[#474747] border !gap-2 bg-[#fff] rounded-t-[22px]">
                          <div className="col-span-3 self-center border-[#474747] border-r rounded-ss-xl p-5">
                            <p className="font-semibold leading-5 text-lg">
                              {" "}
                              {res.unique_key}{" "}
                            </p>
                            <p className="text-[#A3A3A3]">Claim ID</p>
                          </div>
                          <div className="col-span-3 self-center border-[#474747] border-r p-5">
                            <p className="font-semibold leading-5 text-lg">
                              {" "}
                              {res?.contracts?.unique_key}{" "}
                            </p>
                            <p className="text-[#A3A3A3]">Contract ID</p>
                          </div>
                          <div className="col-span-3 self-center border-[#474747] border-r p-5">
                            <p className="font-semibold leading-5 text-lg">
                              {" "}
                              {format(new Date(res.lossDate), "yyyy-MM-dd")}
                            </p>
                            <p className="text-[#A3A3A3]">Loss Date</p>
                          </div>
                          <div className="col-span-3 self-center justify-left pl-4 flex relative">
                            <img
                              src={chat}
                              className=" mr-2 cursor-pointer"
                              onClick={() => openView()}
                              alt="chat"
                            />
                            <img
                              src={Edit}
                              className=" mr-2 cursor-pointer"
                              onClick={() => openEdit(res, index)}
                              alt="edit"
                            />
                          </div>
                        </Grid>
                        <Grid className="!gap-0 bg-[#F9F9F9] border-[#474747] border-x">
                          <div className="col-span-2 flex ">
                            <img
                              src={productName}
                              className="self-center h-[50px] w-[50px] ml-3"
                              alt="productName"
                            />
                            <div className="py-4 pl-3 self-center">
                              <p className="text-[#5D6E66] text-[11px] font-Regular">
                                Product Name
                              </p>
                              <p className="text-[#333333] text-sm font-semibold">
                                {res?.contracts?.productName}
                              </p>
                            </div>
                          </div>
                          <div className="col-span-3 flex">
                            <img
                              src={Manufacturer}
                              className="self-center h-[50px] w-[50px] ml-3"
                              alt=""
                            />
                            <div className="py-4 pl-3 self-center">
                              <p className="text-[#5D6E66] text-[11px] font-Regular">
                                Product Manufacturer
                              </p>
                              <p className="text-[#333333] text-sm font-semibold">
                                {res?.contracts?.manufacture}
                              </p>
                            </div>
                          </div>
                          <div className="col-span-4 flex">
                            <img
                              src={model}
                              className="self-center h-[50px] w-[50px] ml-3"
                              alt=""
                            />
                            <div className="py-4 pl-3 self-center">
                              <p className="text-[#5D6E66] text-[11px] font-Regular">
                                Product Model
                              </p>
                              <p className="text-[#333333] text-sm font-semibold">
                                {res?.contracts?.model}
                              </p>
                            </div>
                          </div>
                          <div className="col-span-3 flex">
                            <img
                              src={serial}
                              className="self-center h-[50px] w-[50px] ml-3"
                              alt=""
                            />
                            <div className="py-4 pl-3 self-center">
                              <p className="text-[#5D6E66] text-[11px] font-Regular">
                                Product Serial
                              </p>
                              <p className="text-[#333333] text-sm font-semibold">
                                {res?.contracts?.serial}
                              </p>
                            </div>
                          </div>
                        </Grid>{" "}
                      </>
                    }
                  >
                    <Grid className="!gap-0 bg-[#333333] rounded-b-[22px] mb-5 border-[#474747] border-x">
                      {res?.repairParts.length > 0 &&
                        res?.repairParts.map((part, index) => (
                          <>
                            <div className="col-span-2 bg-[#333333] border-r border-b border-[#474747]">
                              <div className="py-4 pl-3">
                                <p className="text-[#fff] text-sm font-Regular">
                                  Service Type
                                </p>
                                <p className="text-[#5D6E66] text-base font-semibold">
                                  {part.serviceType}
                                </p>
                              </div>
                            </div>
                            <div className="col-span-8 bg-[#333333] border-r border-b border-[#474747]">
                              <div className="py-4 pl-3">
                                <p className="text-[#fff] text-sm font-Regular">
                                  Description
                                </p>
                                <p className="text-[#5D6E66] text-base font-semibold">
                                  {part.description}
                                </p>
                              </div>
                            </div>
                            <div className="col-span-2 bg-[#333333] border-b border-[#474747]">
                              <div className="py-4 pl-3">
                                <p className="text-[#fff] text-sm font-Regular">
                                  Price
                                </p>
                                <p className="text-[#5D6E66] text-base font-semibold">
                                  $
                                  {part.price === undefined
                                    ? parseInt(0).toLocaleString(2)
                                    : formatOrderValue(
                                        part.price ?? parseInt(0)
                                      )}
                                </p>
                              </div>
                            </div>
                          </>
                        ))}

                      <div className="col-span-12 ">
                        <Grid className="">
                          <div className="col-span-3 py-4 pl-1 ">
                            <div className="bg-[#3C3C3C] py-4 px-2">
                              <p className="text-neutral-grey mb-3 text-[11px] font-Regular ">
                                Customer Name :{" "}
                                <span className="font-semibold text-white">
                                  {" "}
                                  {
                                    res?.contracts?.orders?.customer.username
                                  }{" "}
                                </span>
                              </p>
                              <p className="text-neutral-grey text-[11px] mb-3 font-Regular">
                                Claim Cost :{" "}
                                <span className="font-semibold text-white ml-3">
                                  {" "}
                                  ${calculateTotalCost(res.repairParts)}{" "}
                                </span>
                              </p>
                              <p className="text-neutral-grey mb-4 text-[11px] font-Regular flex self-center">
                                {" "}
                                <span className="self-center mr-4">
                                  Servicer Name :{" "}
                                </span>
                                <Select
                                  name="servicer"
                                  label=""
                                  value={servicer}
                                  onChange={handleSelectChange}
                                  white
                                  classBox="w-[55%]"
                                  options={servicerList}
                                />
                              </p>

                              <div className="flex mt-3">
                                <div className="self-center  mr-8">
                                  <p className="text-neutral-grey text-[11px] font-Regular">
                                    Claim Type :
                                  </p>
                                </div>
                                <Select
                                  name="claimType"
                                  label=""
                                  value={claimType.bdAdh}
                                  onChange={handleSelectChange}
                                  white
                                  classBox="w-[55%]"
                                  options={claim}
                                  className1="!py-0 text-white mb-2 !bg-[#3C3C3C] !text-[13px] !border-1 !font-[400]"
                                />
                              </div>
                              <div className="flex mt-2">
                                <div className="self-center  mr-3">
                                  <p className="text-neutral-grey text-[11px] font-Regular">
                                    Damage Code :
                                  </p>
                                </div>
                                <Select
                                  name="claimType"
                                  label=""
                                  white
                                  classBox="w-[55%]"
                                  options={state}
                                  className1="!py-0 text-white !bg-[#3C3C3C] !text-[13px] !border-1 !font-[400]"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-span-4 pt-4">
                            <div className="border border-[#FFFFFF1A] mb-2 p-1 relative rounded-lg flex w-full">
                              <div className="bg-[#474747] w-[40%] rounded-s-lg">
                                <p className="text-white text-[11px] p-4">
                                  Customer Status
                                </p>
                              </div>
                              <div
                                className="pl-1 self-center cursor-pointer w-[50%]"
                                onClick={handleToggleDropdown}
                              >
                                <p className="text-white text-sm">
                                  {customerStatus.status}
                                </p>

                                {format(
                                  new Date(
                                    repairStatus.date
                                      ? customerStatus?.date
                                      : new Date()
                                  ),
                                  "MMM-dd-yyyy"
                                )}
                              </div>
                              <div
                                className="self-center ml-auto w-[10%] mr-2 cursor-pointer py-6"
                                ref={dropdownRef}
                                onClick={handleToggleDropdown}
                              >
                                <img
                                  src={DropActive}
                                  className={`cursor-pointer ml-auto ${
                                    dropdownVisible ? "rotate-180 " : ""
                                  }`}
                                  alt="DropActive"
                                />
                                <Select
                                  name="customerStatus"
                                  label=""
                                  value={customerStatus.status}
                                  onChange={handleSelectChange}
                                  white
                                  classBox="w-[55%]"
                                  options={customerValue}
                                  visible={dropdownVisible}
                                />
                              </div>
                            </div>
                            <div className="border border-[#FFFFFF1A] mb-2 p-1 relative rounded-lg flex w-full">
                              <div className="bg-[#474747] w-[40%] rounded-s-lg">
                                <p className="text-white text-[11px] p-4">
                                  Claim Status
                                </p>
                              </div>
                              <div
                                className="pl-1 self-center w-[50%] cursor-pointer "
                                onClick={handleToggleDropdown2}
                              >
                                <p className="text-white text-sm">
                                  {" "}
                                  {claimStatus.status}
                                </p>
                                <p className="text-[#686868]">
                                  {" "}
                                  {format(
                                    new Date(
                                      repairStatus.date
                                        ? claimStatus?.date
                                        : new Date()
                                    ),
                                    "MMM-dd-yyyy"
                                  )}
                                </p>
                              </div>

                              <div
                                className="self-center ml-auto w-[10%] mr-2 cursor-pointer py-6"
                                ref={dropdownRef}
                              >
                                <Select
                                  name="claimStatus"
                                  label=""
                                  value={claimStatus.status}
                                  onChange={handleSelectChange}
                                  white
                                  classBox="w-[55%]"
                                  options={claimvalues}
                                  visible={dropdownVisible}
                                />
                              </div>
                            </div>
                            <div className="border border-[#FFFFFF1A] p-1 relative rounded-lg flex w-full">
                              <div className="bg-[#474747] w-[40%] rounded-s-lg">
                                <p className="text-white text-[11px] p-4">
                                  Repair Status
                                </p>
                              </div>
                              <div
                                className="pl-1 cursor-pointer w-[50%]"
                                onClick={handleToggleDropdown1}
                              >
                                <p className="text-white text-sm">
                                  {repairStatus.status}
                                </p>
                                <p className="text-[#686868]">
                                  {format(
                                    new Date(
                                      repairStatus.date
                                        ? repairStatus.date
                                        : new Date()
                                    ),
                                    "MMM-dd-yyyy"
                                  )}
                                </p>
                              </div>
                              <div
                                className="self-center ml-auto w-[10%] mr-2 cursor-pointer py-6"
                                ref={dropdownRef}
                                onClick={handleToggleDropdown1}
                              >
                                <Select
                                  name="repairStatus"
                                  label=""
                                  value={repairStatus.status}
                                  onChange={handleSelectChange}
                                  white
                                  classBox="w-[55%]"
                                  options={repairValue}
                                  visible={dropdownVisible}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-span-5 pt-2">
                            <div className="m-2 p-2 bg-[#3C3C3C] ">
                              <p className="text-[11px] text-white">
                                Diagnosis
                              </p>
                              <div className="h-[130px] max-h-[130px] overflow-y-scroll Diagnosis">
                                <p className="text-sm text-[#686868]">
                                  {res.diagnosis}
                                </p>
                              </div>
                            </div>
                            <div>
                              <Grid className="!grid-cols-12 px-3 mb-3">
                                <Button
                                  className="!bg-[#fff] col-span-5 !rounded-[11px] !text-light-black !text-[14px] flex"
                                  onClick={() => openAttachments()}
                                >
                                  <img
                                    src={Track}
                                    className="w-5 h-5 mr-1"
                                    alt="Track"
                                  />{" "}
                                  Track Status
                                </Button>
                                <Button
                                  className="!bg-[#fff] col-span-7 !rounded-[11px] !text-light-black !text-[14px] flex"
                                  onClick={() => {
                                    downloadAttachments(res.receiptImage);
                                  }}
                                >
                                  <img
                                    src={download}
                                    className="w-5 h-5 mr-2"
                                    alt="download"
                                  />
                                  <p className="text-sm font-semibold text-center">
                                    Download Attachments
                                  </p>
                                </Button>
                              </Grid>
                            </div>
                          </div>
                        </Grid>
                      </div>
                    </Grid>
                  </CollapsibleDiv>
                );
              })}
          </div>
        </div>
      </div>

      <Modal isOpen={isViewOpen} onClose={closeView}>
        <Button
          onClick={closeView}
          className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]"
        >
          <img
            src={Cross}
            className="w-full h-full text-black rounded-full p-0"
          />
        </Button>
        <div className="py-3">
          <p className="text-center text-3xl font-semibold ">
            Comments Details
          </p>
          <div className="h-[350px] mt-3 p-3 max-h-[350px] overflow-y-scroll border-[#D1D1D1] bg-[#F0F0F0] border rounded-xl">
            <Grid className="my-3">
              <div className="col-span-1">
                <div className="bg-[#333333] border-2 w-12 h-12 flex justify-center border-[#D1D1D1] rounded-full">
                  <p className="text-white text-2xl self-center">A</p>
                </div>
              </div>
              <div className="col-span-11">
                <div className="bg-white rounded-md relative p-1">
                  <img
                    src={arrowImage}
                    className="absolute -left-3 rotate-[270deg] top-2	"
                    alt="arrowImage"
                  />
                  <Grid>
                    <div className="col-span-6">
                      <p className="text-xl font-semibold">
                        Angela <span className="text-[12px]">(Admin)</span>{" "}
                      </p>
                    </div>
                    <div className="col-span-5 self-center flex justify-end">
                      <p className="text-sm pr-3">9:30 am</p>
                      <p className="text-sm">12 Nov 2023</p>
                    </div>
                    <div className="col-span-1 self-center text-center">
                      <img
                        src={download}
                        className="w-5 h-5 mx-auto cursor-pointer"
                        alt="download"
                      />
                    </div>
                  </Grid>
                  <hr className="my-2" />
                  <p className="text-sm">
                    In publishing and graphic design, Lorem ipsum is a
                    placeholder text commonly used to demonstrate the visual.
                  </p>
                  <p className="text-right">
                    <span className="text-[11px]">(To Admin)</span>
                  </p>
                </div>
              </div>
            </Grid>

            <Grid className="my-3">
              <div className="col-span-1">
                <div className="bg-[#333333] border-2 w-12 h-12 flex justify-center border-[#D1D1D1] rounded-full">
                  <p className="text-white text-2xl self-center">D</p>
                </div>
              </div>
              <div className="col-span-11">
                <div className="bg-white rounded-md relative p-1">
                  <img
                    src={arrowImage}
                    className="absolute -left-3 rotate-[270deg] top-2	"
                    alt="arrowImage"
                  />
                  <Grid>
                    <div className="col-span-6">
                      <p className="text-xl font-semibold">
                        Alison <span className="text-[12px]">(Dealer)</span>
                      </p>
                    </div>
                    <div className="col-span-5 self-center flex justify-end">
                      <p className="text-sm pr-3">9:30 am</p>
                      <p className="text-sm">12 Nov 2023</p>
                    </div>
                    <div className="col-span-1 self-center text-center">
                      <img
                        src={download}
                        className="w-5 h-5 mx-auto cursor-pointer"
                        alt="download"
                      />
                    </div>
                  </Grid>
                  <hr className="my-2" />
                  <p className="text-sm">
                    In publishing and graphic design, Lorem ipsum is a
                    placeholder text commonly used to demonstrate the visual.
                  </p>
                  <p className="text-right">
                    <span className="text-[11px]">(To Admin)</span>
                  </p>
                </div>
              </div>
            </Grid>

            <Grid className="my-3">
              <div className="col-span-1">
                <div className="bg-[#333333] border-2 w-12 h-12 flex justify-center border-[#D1D1D1] rounded-full">
                  <p className="text-white text-2xl self-center">S</p>
                </div>
              </div>
              <div className="col-span-11">
                <div className="bg-white rounded-md relative p-1">
                  <img
                    src={arrowImage}
                    className="absolute -left-3 rotate-[270deg] top-2	"
                    alt="arrowImage"
                  />
                  <Grid>
                    <div className="col-span-6">
                      <p className="text-xl font-semibold">
                        Veronica{" "}
                        <span className="text-[12px]"> (Servicer) </span>
                      </p>
                    </div>
                    <div className="col-span-5 self-center flex justify-end">
                      <p className="text-sm pr-3">9:30 am</p>
                      <p className="text-sm">12 Nov 2023</p>
                    </div>
                    <div className="col-span-1 self-center text-center">
                      <img
                        src={download}
                        className="w-5 h-5 mx-auto cursor-pointer"
                        alt="download"
                      />
                    </div>
                  </Grid>
                  <hr className="my-2" />
                  <p className="text-sm">
                    In publishing and graphic design, Lorem ipsum is a
                    placeholder text commonly used to demonstrate the visual.
                  </p>
                  <p className="text-right">
                    <span className="text-[11px]">(To Admin)</span>
                  </p>
                </div>
              </div>
            </Grid>

            <Grid className="my-3">
              <div className="col-span-1">
                <div className="bg-[#333333] border-2 w-12 h-12 flex justify-center border-[#D1D1D1] rounded-full">
                  <p className="text-white text-2xl self-center">A</p>
                </div>
              </div>
              <div className="col-span-11">
                <div className="bg-white rounded-md relative p-1">
                  <img
                    src={arrowImage}
                    className="absolute -left-3 rotate-[270deg] top-2	"
                    alt="arrowImage"
                  />
                  <Grid>
                    <div className="col-span-6">
                      <p className="text-xl font-semibold">
                        Angela <span className="text-[12px]">(Admin)</span>{" "}
                      </p>
                    </div>
                    <div className="col-span-5 self-center flex justify-end">
                      <p className="text-sm pr-3">9:30 am</p>
                      <p className="text-sm">12 Nov 2023</p>
                    </div>
                    <div className="col-span-1 self-center text-center">
                      <img
                        src={download}
                        className="w-5 h-5 mx-auto cursor-pointer"
                        alt="download"
                      />
                    </div>
                  </Grid>
                  <hr className="my-2" />
                  <p className="text-sm">
                    In publishing and graphic design, Lorem ipsum is a
                    placeholder text commonly used to demonstrate the visual.
                  </p>
                  <p className="text-right">
                    <span className="text-[11px]">(To Admin)</span>
                  </p>
                </div>
              </div>
            </Grid>

            <Grid className="my-3">
              <div className="col-span-1">
                <div className="bg-[#333333] border-2 w-12 h-12 flex justify-center border-[#D1D1D1] rounded-full">
                  <p className="text-white text-2xl self-center">A</p>
                </div>
              </div>
              <div className="col-span-11">
                <div className="bg-white rounded-md relative p-1">
                  <img
                    src={arrowImage}
                    className="absolute -left-3 rotate-[270deg] top-2	"
                    alt="arrowImage"
                  />
                  <Grid>
                    <div className="col-span-6">
                      <p className="text-xl font-semibold">
                        Angela <span className="text-[12px]">(Admin)</span>{" "}
                      </p>
                    </div>
                    <div className="col-span-5 self-center flex justify-end">
                      <p className="text-sm pr-3">9:30 am</p>
                      <p className="text-sm">12 Nov 2023</p>
                    </div>
                    <div className="col-span-1 self-center text-center">
                      <img
                        src={download}
                        className="w-5 h-5 mx-auto cursor-pointer"
                        alt="download"
                      />
                    </div>
                  </Grid>
                  <hr className="my-2" />
                  <p className="text-sm">
                    In publishing and graphic design, Lorem ipsum is a
                    placeholder text commonly used to demonstrate the visual.
                  </p>
                  <p className="text-right">
                    <span className="text-[11px]">(To Admin)</span>
                  </p>
                </div>
              </div>
            </Grid>
          </div>
          <div>
            <p className="text-sm my-3">
              <b> Attachment : </b>{" "}
              <span className="text-black">
                {" "}
                Accepted file types: jpg, pdf, jpeg, doc, xls, xlxs, png, Max.
                file size: 50 MB.{" "}
              </span>
            </p>
          </div>
          <Grid>
            <div className="col-span-1">
              <div className="border flex h-full justify-center">
                <img src={upload} className="self-center" alt="upload" />
              </div>
            </div>
            <div className="col-span-6">
              <textarea
                id="note"
                rows="2"
                name="Note"
                maxLength={150}
                className="block px-2.5 pb-2.5 pt-1.5 w-full text-[11px] font-semibold text-light-black bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer resize-none	"
              ></textarea>
            </div>
            <div className="col-span-3 flex">
              <img
                src={Sendto}
                className="self-center w-6 h-6 mr-2"
                alt="Sendto"
              />
              <Select
                name="state"
                options={state}
                placeholder=""
                className="!bg-white "
                classBox="w-full"
                className1="!p-2 w-full"
              />
            </div>
            <div className="">
              <Button>Submit</Button>
            </div>
          </Grid>
        </div>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={closeEdit} className="!w-[1100px]">
        <Button
          onClick={closeEdit}
          className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-4 mt-[-9px] !rounded-full !bg-[#5f5f5f]"
        >
          <img
            src={Cross}
            className="w-full h-full text-black rounded-full p-0"
          />
        </Button>
        <div className="py-1">
          <p className="text-center text-3xl font-semibold ">Edit Claim</p>
          <form className="mt-3 mr-4" onSubmit={formik.handleSubmit}>
            <div className="px-8 pb-4 pt-2 drop-shadow-4xl bg-white mb-5 border-[1px] border-[#D1D1D1] rounded-3xl">
              <p className="pb-5 text-lg font-semibold">Repair Parts</p>
              <div className="w-full h-[180px] pr-4 mb-3 pt-4 overflow-y-scroll overflow-x-hidden">
                {formik?.values?.repairParts?.map((part, index) => {
                  console.log(part, index);
                  return (
                    <div className="mb-5 grid grid-cols-12 gap-4">
                      <div className="col-span-2">
                        {/* <label htmlFor={`serviceType-${index}`}>
                          Service Type
                        </label> */}
                        <Select
                          name={`repairParts[${index}].serviceType`}
                          label="Service Type"
                          options={serviceType}
                          required={true}
                          className="!bg-[#fff]"
                          placeholder=""
                          maxLength={"30"}
                          value={
                            formik.values.repairParts[index].serviceType || ""
                          }
                          onChange={handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.repairParts &&
                            formik.touched.repairParts[index] &&
                            formik.errors.repairParts &&
                            formik.errors.repairParts[index] &&
                            formik.errors.repairParts[index].serviceType
                          }
                        >
                          {/* Add your options for Service Type here */}
                        </Select>
                        {formik.touched.repairParts &&
                          formik.touched.repairParts[index] &&
                          formik.errors.repairParts &&
                          formik.errors.repairParts[index]?.serviceType && (
                            <div className="text-red-500">
                              {formik.errors.repairParts[index].serviceType}
                            </div>
                          )}
                      </div>

                      <div className="col-span-7">
                        {/* <label htmlFor={`description-${index}`}>
                          Description
                        </label> */}
                        <Input
                          type="text"
                          label="Description"
                          id={`description-${index}`}
                          name={`repairParts[${index}].description`}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.repairParts[index].description}
                          className="!bg-[#fff]"
                          className1="w-full !p-2 border rounded-md"
                        />
                        {formik.touched.repairParts &&
                          formik.touched.repairParts[index] &&
                          formik.errors.repairParts &&
                          formik.errors.repairParts[index]?.description && (
                            <div className="text-red-500">
                              {formik.errors.repairParts[index].description}
                            </div>
                          )}
                      </div>

                      <div
                        className={`${
                          index > 0 ? "col-span-2" : "col-span-3"
                        }  `}
                      >
                        {/* <label htmlFor={`price-${index}`}>Price ($)</label> */}
                        <Input
                          type="number"
                          id={`price-${index}`}
                          label="Price ($)"
                          name={`repairParts[${index}].price`}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.repairParts[index].price}
                          className="!bg-[#fff]"
                          className1="w-full !p-2 border rounded-md"
                        />
                        {formik.touched.repairParts &&
                          formik.touched.repairParts[index] &&
                          formik.errors.repairParts &&
                          formik.errors.repairParts[index]?.price && (
                            <div className="text-red-500">
                              {formik.errors.repairParts[index].price}
                            </div>
                          )}
                      </div>

                      {index > 0 && (
                        <div className="col-span-1 self-center bg-[#EBEBEB] rounded-[4px] flex justify-center">
                          <div
                            className="flex h-full bg-[#EBEBEB] justify-center cursor-pointer"
                            onClick={() => handleRemove(index)}
                          >
                            <img
                              src={DeleteImage}
                              className="self-center p-1 py-[8px] cursor-pointer"
                              alt="Delete Icon"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between">
                <div>
                  <p className="text-red-500">Error </p>
                </div>
                <Button
                  type="button"
                  className="!text-sm "
                  onClick={handleAddMore}
                >
                  + Add More
                </Button>
              </div>
            </div>
            <div className="px-5 pb-5 pt-5 drop-shadow-4xl bg-white  border-[1px] border-[#D1D1D1]  rounded-3xl">
              <div className="relative">
                <label
                  htmlFor="description"
                  className="absolute text-base text-[#e1e1e1] leading-6 duration-300 transform origin-[0] top-1 bg-[#fff] left-2 px-1 -translate-y-4 scale-75"
                >
                  Note
                </label>
                <textarea
                  id="note"
                  rows="3"
                  name="note"
                  maxLength={150}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.note}
                  className="block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold text-light-black bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer resize-none	"
                ></textarea>
              </div>
            </div>

            <div className="mt-3">
              <Button className="!bg-white !text-black" onClick={closeEdit}>
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal isOpen={isAttachmentsOpen} onClose={closeAttachments}>
        <Button
          onClick={closeAttachments}
          className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-4 mt-[-9px] !rounded-full !bg-[#333434]"
        >
          <img
            src={Cross}
            className="w-full h-full text-black rounded-full p-0"
          />
        </Button>
        <div className="py-1">
          <p className="text-center text-3xl font-semibold ">Track Status</p>
        </div>
      </Modal>

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
          <p className="text-center text-3xl font-semibold ">Advance Search</p>
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
                name="Dealer P.O. #."
                className="!bg-[#fff]"
                label="Dealer P.O. #."
                placeholder=""
              />
            </div>
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
            <div className="col-span-6">
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
            <div className="col-span-6">
              <Select
                name="ClaimStatus"
                label="Claim Status"
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
    </>
  );
}

export default ClaimList;
