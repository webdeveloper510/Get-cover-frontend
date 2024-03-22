import React, { useEffect, useRef, useState } from "react";
import Button from "../../../common/button";
import Grid from "../../../common/grid";
import Input from "../../../common/input";
import {
  faFileImage,
  faFilePdf,
  faFileWord,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik, Form, Field, ErrorMessage } from "formik";

// Media Includes
import AddDealer from "../../../assets/images/dealer-book.svg";
import DeleteImage from "../../../assets/images/icons/Delete.svg";
import Search from "../../../assets/images/icons/SearchIcon.svg";
import productName from "../../../assets/images/icons/productName1.svg";
import Sendto from "../../../assets/images/double-arrow.png";
import AddItem from "../../../assets/images/icons/addItem.svg";
import model from "../../../assets/images/icons/ProductModel.svg";
import serial from "../../../assets/images/icons/ProductSerial.svg";
import Manufacturer from "../../../assets/images/icons/ProductManufacturer.svg";
import Edit from "../../../assets/images/icons/editIcon.svg";
import download from "../../../assets/images/download.png";
import disapproved from "../../../assets/images/Disapproved.png";
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
import { Link, useLocation } from "react-router-dom";
import Modal from "../../../common/model";
import CollapsibleDiv from "../../../common/collapsibleDiv";
import {
  addClaimMessages,
  addClaimsRepairParts,
  addUploadCommentImage,
  editClaimServicerValue,
  editClaimStatus,
  getClaimList,
  getClaimMessages,
} from "../../../services/claimServices";
import { format } from "date-fns";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RotateLoader } from "react-spinners";
import CustomPagination from "../../pagination";

function ClaimList(props) {
  console.log(props);
  const location = useLocation();
  const [timer, setTimer] = useState(3);
  const [showDetails, setShowDetails] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [loaderType, setLoaderType] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isAttachmentsOpen, setIsAttachmentsOpen] = useState(false);
  const [isDisapprovedOpen, setIsDisapprovedOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownVisible2, setDropdownVisible2] = useState(false);
  const [dropdownVisible1, setDropdownVisible1] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimList, setClaimList] = useState({});
  const [totalRecords, setTotalRecords] = useState(0);
  const [serviceType, setServiceType] = useState([]);
  const [claimId, setClaimId] = useState("");
  const [claimType, setClaimType] = useState({ bdAdh: "" });
  const [servicer, setServicer] = useState("");
  const [servicerList, setServicerList] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [claimDetail, setClaimDetail] = useState({});
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("");
  const [selfServicer, setSelfServicer] = useState("");
  const [customerStatus, setCustomerStatus] = useState({
    status: "",
    date: "",
  });
  const [claimStatus, setClaimStatus] = useState({ status: "", date: "" });
  const [repairStatus, setRepairStatus] = useState({ status: "", date: "" });
  const [initialValues, setInitialValues] = useState({
    repairParts: [{ serviceType: "", description: "", price: "" }],
    note: "",
    totalAmount: "",
  });
  const [sendto, setSendto] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (location.pathname.includes("/dealer")) {
      setUserType("dealer");
    } else {
      setUserType("admin"); // Reset userType if condition doesn't match
    }
  }, [location.pathname]);
  const dropdownRef = useRef(null);
  const handleToggleDropdown = (value) => {
    setDropdownVisible(!dropdownVisible);
  };
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]); // Assuming messageList is the dependency that triggers data loading

  const downloadImage = (file) => {
    console.log("hello");
    const url = `http://15.207.221.207:3002/uploads/claimFile/${file.messageFile.fileName}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch the file. Status: ${response.status}`
          );
        }
        return response.blob();
      })
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);

        const anchor = document.createElement("a");
        anchor.href = blobUrl;
        anchor.download = file.messageFile.fileName || "downloaded_image";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => {
        console.error("Error fetching the file:", error);
      });
  };

  useEffect(() => {
    let intervalId;
    if (isAttachmentsOpen && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0) {
      setIsAttachmentsOpen(false);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isAttachmentsOpen, timer]);

  const handleSelectChange2 = (selectedValue, value) => {
    formik1.setFieldValue(selectedValue, value);
    console.log(selectedValue, value);
  };

  const handleSelectChange = (selectedValue, value) => {
    console.log(selectedValue);
    if (selectedValue == "claimStatus") {
      if (value == "Rejected") {
        setIsRejectOpen(true);
      } else if (value?.content) {
        console.log(value);
        value.claimStatus = "Rejected";
        editClaimRejectedValue(claimList.result[activeIndex]._id, value);
      } else {
        const updateAndCallAPI = (setter) => {
          setter((prevRes) => ({ ...prevRes, status: value }));

          editClaimValue(
            claimList.result[activeIndex]._id,
            selectedValue,
            value
          );

          console.log(selectedValue);
        };

        switch (selectedValue) {
          case "claimStatus":
            updateAndCallAPI(setClaimStatus);
            break;
          default:
            updateAndCallAPI(setClaimType);
        }
      }
    } else {
      const updateAndCallAPI = (setter) => {
        setter((prevRes) => ({ ...prevRes, status: value }));
        if (selectedValue === "servicer") {
          editClaimServicer(
            claimList.result[activeIndex]._id,
            selectedValue,
            value
          );
        } else {
          editClaimValue(
            claimList.result[activeIndex]._id,
            selectedValue,
            value
          );

          console.log(selectedValue);
          //
        }
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
    }
  };

  const editClaimRejectedValue = (claimId, data) => {
    editClaimStatus(claimId, data).then((res) => {
      updateAndSetStatus(setClaimStatus, "claimStatus", res);
      updateAndSetStatus(setRepairStatus, "repairStatus", res);
      updateAndSetStatus(setCustomerStatus, "customerStatus", res);
    });
    closeReject();
  };
  const updateAndSetStatus = (statusObject, name, res) => {
    if (res.code === 200) {
      const resultData = res.result || {};

      statusObject({
        status: resultData[`${name}`][resultData[`${name}`].length - 1].status,
        date: resultData[`${name}`][resultData[`${name}`].length - 1].date,
      });
    }
  };
  const editClaimValue = (claimId, statusType, statusValue) => {
    let data = {
      [statusType]: statusValue,
    };

    editClaimStatus(claimId, data).then((res) => {
      updateAndSetStatus(setClaimStatus, "claimStatus", res);
      updateAndSetStatus(setRepairStatus, "repairStatus", res);
      updateAndSetStatus(setCustomerStatus, "customerStatus", res);
    });
  };
  const editClaimServicer = (claimId, statusType, statusValue) => {
    let data = {
      servicerId: statusValue,
    };

    editClaimServicerValue(claimId, data).then((res) => {
      setServicer(res.result.servicerId);
    });
  };

  const getAllClaims = async (page = 1, rowsPerPage = 10) => {
    setLoaderType(true);
    let data = {
      page: page,
      pageLimit: rowsPerPage,
      ...formik1.values,
    };
    getClaimList(data).then((res) => {
      console.log(res);
      if (res) {
        setClaimList(res);
        setTotalRecords(res?.totalCount);
        setLoaderType(false);
      } else {
        setLoaderType(false);
      }
    });
  };

  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const handlePageChange = async (page, rowsPerPage) => {
    setRecordsPerPage(rowsPerPage);
    setLoading(true);
    try {
      if (props?.flag == "claim") {
        await getAllClaims(page, rowsPerPage);
      } else if (props?.flag != "") {
        await getAllClaims(page, rowsPerPage);
      } else {
        await getAllClaims(page, rowsPerPage);
      }
      setLoading(false);
    } finally {
      setLoading(false);
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
    setError("");
    setIsEditOpen(false);
  };

  const openReject = () => {
    setIsRejectOpen(true);
  };
  const closeReject = () => {
    setIsRejectOpen(false);
    setShowForm(false); // Reset the form state
  };
  const handleYesClick = () => {
    setShowForm(true);
  };

  const handleToggle = () => {
    setShowDetails(!showDetails);
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
    setServiceType(getServiceType(res.contracts.orders.serviceCoverageType));
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
    setIsEditOpen(false);
  };
  const closeAttachments = () => {
    setIsAttachmentsOpen(false);
  };

  const openView = (claim) => {
    let isValidReseller =
      claim?.contracts.orders.resellerId != null ? true : false;
    console.log(isValidReseller);
    setSendto(
      [
        { label: "Admin (By Self)", value: "Admin" },
        { label: "Dealer", value: "Dealer" },
        isValidReseller ? { label: "Reseller", value: "Reseller" } : null,
        { label: "Servicer", value: "Servicer" },
        { label: "Customer", value: "Customer" },
      ].filter((item) => item !== null)
    );
    console.log(claim);
    setClaimDetail(claim);
    getClaimMessage(claim._id, true);
    setIsViewOpen(true);
  };

  const getClaimMessage = (claimId, loader = true) => {
    setModelLoading(loader);
    getClaimMessages(claimId)
      .then((res) => {
        setMessageList(res.result);
        console.log(res.result);
      })
      .catch((error) => {
        console.error("Error fetching claim messages:", error);
      })
      .finally(() => {
        setModelLoading(false);
      });
  };

  // Conditionally define initialValues based on repairParts length
  useEffect(() => {
    if (claimList?.result?.repairParts?.length !== 0) {
      const mappedValues = claimList?.result?.repairParts?.map((part) => ({
        serviceType: part.serviceType || "",
        description: part.description || "",
        price: part.price || "",
      }));

      setInitialValues({
        repairParts: mappedValues,
        note: "",
      });
    }
  }, [claimList]);

  const downloadAttachments = (res) => {
    console.log("hello", res);
    const attachments = res || [];

    attachments.forEach((attachment, index) => {
      const url = `http://15.207.221.207:3002/uploads/claimFile/${attachment.filename}`;

      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          const blobUrl = URL.createObjectURL(blob);
          const anchor = document.createElement("a");
          anchor.href = blobUrl;
          anchor.download = `file_${index + 1}`;
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
          URL.revokeObjectURL(blobUrl);
        })
        .catch((error) => {
          console.error("Error fetching the file:", error);
        });
    });
  };
  const initialValues2 = {
    content: "",
    orderId: "",
    type: "Admin",
    messageFile: {},
  };
  const formik2 = useFormik({
    initialValues: initialValues2,
    validationSchema: Yup.object({
      content: Yup.string().required(),
    }),

    onSubmit: (values) => {
      values.orderId = claimDetail?.contracts?.orders?._id;
      console.log(values, claimDetail);
      const userInfo = JSON.parse(localStorage.getItem("userDetails"));
      const temporaryMessage = {
        _id: "temp-id",
        content: values.content,
        type: values.type || "Admin",
        messageFile: {
          fileName: values.fileName || "",
          originalName: values.originalName || "",
          size: values.size || "",
          _id: "temp-file-id", // You can use a temporary ID for the file or any unique identifier
        },
        date: new Date().toISOString(),
        commentTo: {
          firstName: values.commentToFirstName || "",
          lastName: values.commentToLastName || "",
        },
        commentBy: {
          firstName: userInfo.userInfo?.firstName || "",
          lastName: userInfo.userInfo?.lastName || "",
          roles: {
            role: userInfo?.role || "",
          },
        },
      };

      console.log(temporaryMessage);
      // Update the state with the temporary message
      setMessageList((prevClaimMessages) => [
        ...prevClaimMessages,
        temporaryMessage,
      ]);

      console.log(userInfo);
      addClaimMessages(claimDetail?._id, values).then((res) => {
        console.log(res);
        getClaimMessage(claimDetail._id, false);
      });

      formik2.resetForm();
      formik2.setFieldValue("content", "");
      setPreviewImage(null);
    },
  });

  // const handleFileChange = (event) => {
  //   // Handle file change and set it in formik2
  //   formik2.setFieldValue("file", event.currentTarget.files[0]);
  // };

  useEffect(() => {
    if (activeIndex != null) {
      setError("");
      const bdAdhValue = claimList.result[activeIndex]?.bdAdh;
      const getLastItem = (array) => array?.[array.length - 1];
      setSelfServicer(claimList.result[activeIndex]?.selfServicer);
      const customerValue = getLastItem(
        claimList.result[activeIndex]?.customerStatus
      );
      const claimStatus = getLastItem(
        claimList.result[activeIndex]?.claimStatus
      );
      const repairStatus = getLastItem(
        claimList.result[activeIndex]?.repairStatus
      );

      let arr = [];
      const filterServicer = claimList.result[
        activeIndex
      ].contracts.allServicer.map((res) => ({
        label: res.name,
        value: res._id,
      }));

      setServicerList(filterServicer);
      if (filterServicer.length != 0) {
        setServicer(claimList.result[activeIndex].servicerId);
      }

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
      setError("");
      let totalPrice = 0;
      values.repairParts.forEach((part) => {
        totalPrice += Number(part.price);
      });
      values.totalAmount = totalPrice;
      addClaimsRepairParts(claimId, values).then((res) => {
        console.log(res);
        if (res.code == 401) {
          setError(res.message);
        } else {
          openAttachments();
          getAllClaims();
          setActiveIndex(null);
        }
      });
    },
  });

  const handleRemove = (index) => {
    setError("");
    const updatedErrors = { ...formik.errors };
    if (updatedErrors.repairParts) {
      const updatedRepairPartsErrors = updatedErrors.repairParts.slice();
      updatedRepairPartsErrors.splice(index, 1);
      updatedErrors.repairParts = updatedRepairPartsErrors;
    }
    formik.setErrors(updatedErrors);
    const updatedRepairParts = [...formik.values.repairParts];
    updatedRepairParts.splice(index, 1);
    formik.setFieldValue("repairParts", updatedRepairParts);
  };

  const handleAddMore = () => {
    // Update the formik values with the new item
    setError("");
    formik.setFieldValue("repairParts", [
      ...formik.values.repairParts,
      { serviceType: "", description: "", price: "" },
    ]);
  };

  const Claimstatus = [
    { label: "Open", value: "open" },
    { label: "Completed", value: "completed" },
    { label: "Rejected", value: "rejected" },
  ];

  useEffect(() => {
    getAllClaims();
  }, []);

  const state = [
    { label: "Admin", value: "Admin" },
    { label: "Dealer", value: "Dealer" },
    { label: "Reseller", value: "Reseller" },
    { label: "Servicer", value: "Servicer" },
    { label: "Customer", value: "Customer" },
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
      value: "Request Sent",
      label: "Request Sent",
    },
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

  const validationSchema = Yup.object().shape({});

  const formik1 = useFormik({
    initialValues: {
      contractId: "",
      claimId: "",
      venderOrder: "",
      serial: "",
      productName: "",
      dealerName: "",
      customerName: "",
      servicerName: "",
      repairStatus: "",
      customerStatusValue: "",
      claimStatus: "",
      orderId: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setIsDisapprovedOpen(false);
      getAllClaims();
      console.log(values);
    },
  });

  const handleChange = (name, value) => {
    formik.setFieldValue(name, value);
  };

  const handleChange2 = (name, value) => {
    formik2.setFieldValue(name, value);
  };
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [fileType, setFileType] = useState(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleInputClick = (event) => {
    setPreviewImage((prevFileValue) => {
      return null;
    });
    event.currentTarget.value = null;
    formik2.setFieldValue(`messageFile`, {});
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      const formData = new FormData();
      formData.append("file", file);

      addUploadCommentImage(formData).then((res) => {
        console.log(res.messageFile);
        formik2.setFieldValue("messageFile", res.messageFile);
      });
      reader.onload = (event) => {
        // Get the data URL of the selected file
        const imageDataUrl = event.target.result;

        // Update the preview image state
        setPreviewImage(imageDataUrl);
        const fileType = getFileType(file.type);

        setFileType(fileType);
      };
      reader.readAsDataURL(file);
    }
  };

  const getFileType = (fileType) => {
    if (fileType.includes("image")) {
      return "image";
    } else if (fileType.includes("pdf")) {
      return "pdf";
    } else if (
      fileType.includes("spreadsheetml.sheet") ||
      fileType.includes("excel")
    ) {
      return "xlsx";
    } else if (fileType.includes("csv")) {
      return "csv";
    } else if (fileType.includes("ms-excel")) {
      return "xls";
    } else {
      return "file";
    }
  };

  const handleFilterIconClick = () => {
    formik1.values = {};
    formik1.resetForm();
    getAllClaims();
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
                <Link to={"/"}>Claim </Link> /
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
          <Grid className="!p-[26px] !gap-2 !pt-[14px] !pb-0">
            <div className="col-span-2 self-center">
              <p className="text-xl font-semibold">Claims List</p>
            </div>
            <div className="col-span-10">
              <div className="bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                <form onSubmit={formik1.handleSubmit}>
                  <Grid className="!gap-1">
                    <div className="col-span-9 self-center">
                      <Grid className="!gap-2">
                        <div className="col-span-3 self-center">
                          <Input
                            name="contractId"
                            type="text"
                            className="!text-[14px] !bg-[#f7f7f7]"
                            className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                            label=""
                            placeholder="Contract ID"
                            {...formik1.getFieldProps("contractId")}
                          />
                        </div>
                        <div className="col-span-3 self-center">
                          <Input
                            name="claimId"
                            type="text"
                            className="!text-[14px] !bg-[#f7f7f7]"
                            className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                            label=""
                            placeholder="Claim ID"
                            {...formik1.getFieldProps("claimId")}
                          />
                        </div>
                        <div className="col-span-3 self-center">
                          <Select
                            name="customerStatusValue"
                            label=""
                            options={customerValue}
                            OptionName="Customer Status"
                            className="!text-[14px] !bg-[#f7f7f7]"
                            className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                            onChange={handleSelectChange2}
                            value={formik1.values.customerStatusValue}
                          />
                        </div>
                        <div className="col-span-3 self-center">
                          <Select
                            name="repairStatus"
                            className="!text-[14px] !bg-[#f7f7f7]"
                            className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                            label=""
                            OptionName="Repair Status"
                            options={repairValue}
                            onChange={handleSelectChange2}
                            value={formik1.values.repairStatus}
                          />
                        </div>
                      </Grid>
                    </div>
                    <div className="col-span-3 self-center flex justify-center">
                      <Button type="submit" className="!p-0 !bg-transparent">
                        <img
                          src={Search}
                          className="cursor-pointer "
                          alt="Search"
                        />
                      </Button>
                      <Button
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
                      <Button
                        type="button"
                        className="ml-2 !text-[12px]"
                        onClick={() => openDisapproved()}
                      >
                        Advance Search
                      </Button>
                    </div>
                  </Grid>
                </form>
              </div>
            </div>
          </Grid>

          <div className="px-3 mt-5">
            {loaderType == true ? (
              <div className=" h-[400px] w-full flex py-5">
                <div className="self-center mx-auto">
                  <RotateLoader color="#333" />
                </div>
              </div>
            ) : (
              <>
                {claimList?.result &&
                  claimList?.result?.length !== 0 &&
                  claimList?.result?.map((res, index) => {
                    // console.log(res);
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
                                  {format(new Date(res.lossDate), "MM/dd/yyyy")}
                                </p>
                                <p className="text-[#A3A3A3]">Loss Date</p>
                              </div>
                              <div className="col-span-3 self-center justify-left pl-4 flex relative">
                                <img
                                  src={chat}
                                  className=" mr-2 cursor-pointer"
                                  onClick={() => openView(res)}
                                  alt="chat"
                                />
                                {userType === "admin" &&
                                  res?.claimStatus?.[0]?.status === "Open" && (
                                    <img
                                      src={Edit}
                                      className="mr-2 cursor-pointer"
                                      onClick={() => openEdit(res, index)}
                                      alt="edit"
                                    />
                                  )}

                                {userType !== "admin" &&
                                  res.selfServicer &&
                                  res?.claimStatus?.[0]?.status === "Open" && (
                                    <img
                                      src={Edit}
                                      className="mr-2 cursor-pointer"
                                      onClick={() => openEdit(res, index)}
                                      alt="edit"
                                    />
                                  )}
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
                                  <p className="text-[#4a4a4a] text-[11px] font-Regular">
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
                                  <p className="text-[#4a4a4a] text-[11px] font-Regular">
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
                                  <p className="text-[#4a4a4a] text-[11px] font-Regular">
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
                                  <p className="text-[#4a4a4a] text-[11px] font-Regular">
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
                                    <p className="text-light-green text-base font-semibold">
                                      {part.serviceType}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-span-8 bg-[#333333] border-r border-b border-[#474747]">
                                  <div className="py-4 pl-3">
                                    <p className="text-[#fff] text-sm font-Regular">
                                      Description
                                    </p>
                                    <p className="text-light-green text-base font-semibold">
                                      {part.description}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-span-2 bg-[#333333] border-b border-[#474747]">
                                  <div className="py-4 pl-3">
                                    <p className="text-[#fff] text-sm font-Regular">
                                      Price
                                    </p>
                                    <p className="text-light-green text-base font-semibold">
                                      $
                                      {part.price === undefined
                                        ? (0).toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          })
                                        : parseFloat(
                                            part.price === undefined
                                              ? 0
                                              : part.price
                                          ).toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          })}
                                    </p>
                                  </div>
                                </div>
                              </>
                            ))}
                          <div className="col-span-12 ">
                            <Grid className="">
                              <div className="col-span-3 py-4 pl-1 ">
                                <div className="bg-[#3C3C3C] py-4 px-2">
                                  <p className="text-light-green mb-3 text-[11px] font-Regular ">
                                    Customer Name :{" "}
                                    <span className="font-semibold text-white">
                                      {" "}
                                      {
                                        res?.contracts?.orders?.customer
                                          ?.username
                                      }{" "}
                                    </span>
                                  </p>
                                  <p className="text-light-green text-[11px] mb-3 font-Regular">
                                    Claim Cost :{" "}
                                    <span className="font-semibold text-white ml-3">
                                      {" "}
                                      ${calculateTotalCost(
                                        res.repairParts
                                      )}{" "}
                                    </span>
                                  </p>
                                  <p className="text-light-green mb-4 text-[11px] font-Regular flex self-center">
                                    {" "}
                                    <span className="self-center mr-4">
                                      Servicer Name :{" "}
                                    </span>
                                    {userType != "dealer" ? (
                                      <Select
                                        name="servicer"
                                        label=""
                                        value={servicer}
                                        disabled={
                                          claimStatus.status == "Rejected" ||
                                          claimStatus.status == "Completed"
                                        }
                                        onChange={handleSelectChange}
                                        white
                                        className1="!py-0 text-white !bg-[#3C3C3C] !text-[13px] !border-1 !font-[400]"
                                        classBox="w-[55%]"
                                        options={servicerList}
                                      />
                                    ) : (
                                      <>{res?.servicerData?.name}</>
                                    )}
                                  </p>

                                  {userType == "admin" && (
                                    <>
                                      <div className="flex mt-3">
                                        <div className="self-center  mr-8">
                                          <p className="text-light-green text-[11px] font-Regular">
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
                                          <p className="text-light-green text-[11px] font-Regular">
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
                                    </>
                                  )}
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
                                    <span className="text-light-green">
                                      {format(
                                        new Date(
                                          repairStatus.date
                                            ? customerStatus?.date
                                            : new Date()
                                        ),
                                        "MM/dd/yyyy"
                                      )}
                                    </span>
                                  </div>
                                  <div
                                    className="self-center ml-auto w-[10%] mr-2 cursor-pointer"
                                    ref={dropdownRef}
                                    onClick={handleToggleDropdown}
                                  >
                                    {/* <img
                                    src={DropActive}
                                    className={`cursor-pointer ml-auto ${
                                      dropdownVisible ? "rotate-180 " : ""
                                    }`}
                                    alt="DropActive"
                                  /> */}
                                    <Select
                                      name="customerStatus"
                                      label=""
                                      value={customerStatus.status}
                                      onChange={handleSelectChange}
                                      disabled={
                                        claimStatus.status == "Rejected" ||
                                        claimStatus.status == "Completed"
                                      }
                                      white
                                      className1="!border-0 !text-[#333333]"
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
                                    <p className="text-light-green">
                                      {" "}
                                      {format(
                                        new Date(
                                          repairStatus.date
                                            ? claimStatus?.date
                                            : new Date()
                                        ),
                                        "MM/dd/yyyy"
                                      )}
                                    </p>
                                  </div>
                                  <div
                                    className="self-center ml-auto w-[10%] mr-2 cursor-pointer"
                                    ref={dropdownRef}
                                  >
                                    <Select
                                      name="claimStatus"
                                      label=""
                                      value={claimStatus.status}
                                      disabled={
                                        claimStatus.status == "Rejected" ||
                                        claimStatus.status == "Completed"
                                      }
                                      onChange={handleSelectChange}
                                      white
                                      className1="!border-0 !text-[#333333]"
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
                                    <p className="text-light-green">
                                      {format(
                                        new Date(
                                          repairStatus.date
                                            ? repairStatus.date
                                            : new Date()
                                        ),
                                        "MM/dd/yyyy"
                                      )}
                                    </p>
                                  </div>
                                  <div
                                    className="self-center ml-auto w-[10%] mr-2 cursor-pointer"
                                    ref={dropdownRef}
                                    onClick={handleToggleDropdown1}
                                  >
                                    <Select
                                      name="repairStatus"
                                      label=""
                                      value={repairStatus.status}
                                      onChange={handleSelectChange}
                                      disabled={
                                        claimStatus.status == "Rejected" ||
                                        claimStatus.status == "Completed"
                                      }
                                      white
                                      className1="!border-0 !text-[#333333]"
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
                                  <div
                                    className={` overflow-y-scroll Diagnosis ${
                                      res?.receiptImage == ""
                                        ? "h-[164px] max-h-[164px]"
                                        : "h-[130px] max-h-[130px]"
                                    }`}
                                  >
                                    <p className="text-sm text-light-green">
                                      {res.diagnosis}
                                    </p>
                                  </div>
                                </div>
                                {res?.receiptImage == "" ? (
                                  ""
                                ) : (
                                  <div>
                                    <Grid className="!grid-cols-12 !gap-1 px-3 mb-3">
                                      <div className="col-span-6"></div>
                                      {/* <Button
                                      className="!bg-[#fff] col-span-6 !rounded-[11px] !text-light-black !text-[12px] flex"
                                      onClick={handleToggle}
                                    >
                                      <img
                                        src={Track}
                                        className="w-5 h-5 mr-1"
                                        alt="Track"
                                      />
                                      Track Repair Status
                                    </Button> */}
                                      {res.receiptImage != null && (
                                        <Button
                                          className="!bg-[#fff] col-span-6 !rounded-[11px] !text-light-black !text-[13px] flex"
                                          onClick={() => {
                                            downloadAttachments(
                                              res.receiptImage
                                            );
                                          }}
                                        >
                                          <img
                                            src={download}
                                            className="w-5 h-5 mr-2"
                                            alt="download"
                                          />
                                          <p className="text-[13px] font-semibold text-center">
                                            Download Attachments
                                          </p>
                                        </Button>
                                      )}
                                    </Grid>
                                  </div>
                                )}
                              </div>
                            </Grid>
                          </div>
                        </Grid>
                      </CollapsibleDiv>
                    );
                  })}
              </>
            )}
          </div>
          <div>
            {claimList?.result?.length == 0 ? (
              <>
                <div className="text-center my-5">
                  <p>No records found.</p>
                </div>
              </>
            ) : (
              <CustomPagination
                totalRecords={totalRecords}
                rowsPerPageOptions={[10, 20, 50, 100]}
                onPageChange={handlePageChange}
                setRecordsPerPage={setRecordsPerPage}
              />
            )}
          </div>
        </div>
      </div>
      <Modal isOpen={isRejectOpen} onClose={closeReject}>
        <Button onClick={closeReject}  className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]">
          <img
            src={Cross}
            className="w-full h-full text-black rounded-full p-0"
          />
        </Button>
        <div className="text-center py-3">
          <img src={disapproved} alt="email Image" className="mx-auto" />

          {!showForm ? (
            <Grid>
              <div className="col-span-12">
              <p className="text-3xl mb-0 mt-4 font-semibold text-neutral-grey">
              {" "}
              <span className="text-light-black"> Reject </span>
            </p>
              <p className="text-neutral-grey text-base font-medium mt-2 ">
              Do you really want to Reject the Claim ?
              </p>
              </div>
              <div className="col-span-1"></div>
              <div className="col-span-5">
                <Button onClick={handleYesClick}>Yes</Button>
              </div>
              <div className="col-span-5">
                <Button type="button" onClick={closeReject}>
                  No
                </Button>
              </div>
              <div className="col-span-1"></div>
            </Grid>
          ) : (
            <div className="col-span-12">
              <div className="relative my-4">
                <label
                  htmlFor="content"
                  className="absolute text-base text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-[#fff] left-2 px-1 -translate-y-4 scale-75"
                >
                  Enter Your Reason <span className="text-red-500">*</span>
                </label>
                <Formik
                  initialValues={{ content: "" }}
                  validate={(values) => {
                    const errors = {};
                    if (!values.content) {
                      errors.content = "Required";
                    }
                    return errors;
                  }}
                  onSubmit={(values, { setSubmitting }) => {
                    handleSelectChange("claimStatus", values);
                    // Submit logic here
                    console.log(values);
                    setSubmitting(false);
                  }}
                >
                  {({ isSubmitting, errors, touched }) => (
                    <Form>
                      <Field
                        as="textarea"
                        id="content"
                        rows="4"
                        name="content"
                        maxLength={150}
                        className={`block px-2.5 pb-2.5 pt-1.5 w-full text-sm font-semibold text-light-black bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer resize-none focus:text-sm ${
                          errors.content && touched.content && "border-red-500"
                        }`}
                      />
                      <ErrorMessage
                        name="content"
                        component="div"
                        className="text-red-500"
                      />
                      <div className="mt-4">
                        <Button type="submit" disabled={isSubmitting}>
                          Submit
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          )}
        </div>
      </Modal>

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
            {modelLoading ? (
              <div className=" h-[350px] w-full flex py-5">
                <div className="self-center mx-auto">
                  <RotateLoader color="#333" />
                </div>
              </div>
            ) : (
              <>
                {messageList && messageList.length != 0 ? (
                  messageList.map((msg, key) => (
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
                                {msg.commentBy.firstName}{" "}
                                {msg.commentBy.lastName}
                                <span className="text-[12px] pl-1">
                                  ({msg.commentBy.roles.role})
                                </span>{" "}
                              </p>
                            </div>
                            <div
                              className={` self-center flex justify-end ${
                                msg.messageFile.originalName !== ""
                                  ? "col-span-5"
                                  : "col-span-6 text-right"
                              }`}
                            >
                              <p className="text-sm pr-3">
                                {" "}
                                {format(
                                  new Date(msg.date ? msg?.date : new Date()),
                                  "hh:mm aaaaa'm'"
                                )}
                              </p>
                              <p className="text-sm">
                                {format(
                                  new Date(msg.date ? msg?.date : new Date()),
                                  "MM/dd/yyyy"
                                )}
                              </p>
                            </div>
                            {msg.messageFile.originalName !== "" && (
                              <div
                                className="col-span-1 self-center text-center"
                                onClick={() => downloadImage(msg)}
                              >
                                <img
                                  src={download}
                                  className="w-5 h-5 mx-auto cursor-pointer"
                                  alt="download"
                                />
                              </div>
                            )}
                          </Grid>
                          <hr className="my-2" />
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-right">
                            <span className="text-[11px]">(To {msg.type})</span>
                          </p>
                        </div>
                      </div>
                    </Grid>
                  ))
                ) : (
                  <p className="text-center">No Record Found</p>
                )}
              </>
            )}

            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={formik2.handleSubmit}>
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
                <div className="border flex h-full justify-center relative">
                  {previewImage ? (
                    <>
                      <div className="absolute -top-2 -right-2">
                        <img
                          src={Cross}
                          alt="Preview"
                          className="cursor-pointer"
                          style={{
                            width: "20px",
                            height: "20px",
                            marginTop: "5px",
                          }}
                          onClick={() => {
                            setPreviewImage("");
                            formik2.setFieldValue("messageFile", {});
                          }}
                        />
                      </div>
                      {fileType === "image" && (
                        <img
                          src={previewImage}
                          alt="Preview"
                          style={{
                            width: "100px",
                            height: "40px",
                            marginTop: "5px",
                          }}
                        />
                      )}
                      {fileType === "pdf" && (
                        <FontAwesomeIcon icon={faFilePdf} size="3x" />
                      )}
                      {(fileType === "csv" ||
                        fileType === "xlsx" ||
                        fileType === "xls") && (
                        <FontAwesomeIcon icon={faFileImage} size="3x" />
                      )}
                      {fileType === "word" && (
                        <FontAwesomeIcon icon={faFileWord} size="3x" />
                      )}
                      {fileType === "excel" && (
                        <FontAwesomeIcon icon={faFileExcel} size="3x" />
                      )}
                    </>
                  ) : (
                    <img
                      src={upload}
                      className="self-center"
                      alt="upload"
                      onClick={handleImageClick}
                    />
                  )}

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".jpg, .jpeg, .png, .csv, .pdf, .xls, .xlsx"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    onClick={(event) => handleInputClick(event)}
                  />
                </div>
              </div>
              <div className="col-span-6">
                <textarea
                  id="content"
                  rows="2"
                  name="content"
                  maxLength={150}
                  className={`block px-2.5 pb-2.5 pt-1.5 w-full text-[11px] font-semibold text-light-black bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer resize-none focus:text-sm`}
                  value={formik2.values.content}
                  onChange={formik2.handleChange}
                  onBlur={formik2.handleBlur}
                ></textarea>
              </div>
              <div className="col-span-3 flex">
                {/* Image */}
                <img
                  src={Sendto}
                  className="self-center w-6 h-6 mr-2"
                  alt="Sendto"
                />
                <Select
                  name="type"
                  options={sendto}
                  placeholder=""
                  className="!bg-white "
                  classBox="w-full self-center"
                  className1="!p-2 w-full !pr-[40px]"
                  value={formik2.values.type}
                  onChange={handleChange2}
                  onBlur={formik2.handleBlur}
                />
              </div>
              <div className="col-span-2 self-center">
                <Button type="submit" className="self-center">
                  Submit
                </Button>
              </div>
            </Grid>
          </form>
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
        <div className="">
          <p className="text-center text-3xl font-semibold ">Edit Claim</p>

          <form className="mt-3 mr-4" onSubmit={formik.handleSubmit}>
            <div className="px-8 pb-4 pt-2 drop-shadow-4xl bg-white mb-5 border-[1px] border-[#D1D1D1] rounded-3xl">
              <p className="pb-5 text-lg font-semibold">Repair Parts</p>
              <div className="w-full h-[180px] pr-4 mb-3 pt-4 overflow-y-scroll overflow-x-hidden">
                {formik?.values?.repairParts?.map((part, index) => {
                  return (
                    <div className="mb-5 grid grid-cols-12 gap-4">
                      <div className="col-span-2">
                        <Select
                          name={`repairParts[${index}].serviceType`}
                          label="Service Type"
                          options={serviceType}
                          required={true}
                          className="!bg-[#fff]"
                          placeholder=""
                          maxLength={"30"}
                          className1="!pt-[0.4rem]"
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
                            <div className="text-red-500 text-[13px]">
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
                            <div className="text-red-500 text-[13px]">
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
                            <div className="text-red-500 text-[13px]">
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
              <Grid>
                <div className="col-span-6">
                  {Object.keys(formik.errors).some(
                    (key) =>
                      Array.isArray(formik.touched[key]) &&
                      formik.touched[key].some((t) => t) &&
                      Array.isArray(formik.errors[key]) &&
                      formik.errors[key].some((e) => Boolean(e))
                  ) ? (
                    <div>
                      <p className="text-red-500">
                        Error Please Check the Repair Parts Form
                      </p>
                    </div>
                  ) : null}
                  {error && <p className="text-red-500">{error}</p>}
                </div>

                <div className="col-span-6 text-end">
                  <Button
                    type="button"
                    className="!text-sm"
                    onClick={handleAddMore}
                  >
                    + Add More
                  </Button>
                </div>
              </Grid>
            </div>
            <div className="px-5 pb-5 pt-3 drop-shadow-4xl bg-white  border-[1px] border-[#D1D1D1]  rounded-3xl">
              <div className="relative">
                <label
                  htmlFor="description"
                  className="absolute text-base text-[#999] leading-6 duration-300 transform origin-[0] top-1 bg-[#fff] left-2 px-1 -translate-y-4 scale-75"
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
        <div className="py-1 text-center">
          <img src={AddDealer} alt="email Image" className="mx-auto" />
          <p className="text-3xl mb-0 mt-4 font-semibold text-neutral-grey">
            Submitted
            <span className="text-light-black"> Successfully </span>
          </p>
          <p className="text-neutral-grey text-base font-medium mt-2">
            Edit Claim Successfully
          </p>
          <p className="text-neutral-grey text-base font-medium mt-2">
            Redirecting you on Claim Page {timer} seconds.
          </p>
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
          <form onSubmit={formik1.handleSubmit}>
            <Grid className="mt-5 px-6">
              <div className="col-span-6">
                <Input
                  type="text"
                  name="contractId"
                  className="!bg-[#fff]"
                  label="Contract ID"
                  placeholder=""
                  {...formik1.getFieldProps("contractId")}
                />
              </div>
              <div className="col-span-6">
                <Input
                  name="claimId"
                  type="text"
                  className="!bg-[#fff]"
                  label="Claim ID"
                  placeholder=""
                  {...formik1.getFieldProps("claimId")}
                />
              </div>

              <div className="col-span-6">
                <Input
                  type="text"
                  name="orderId"
                  className="!bg-[#fff]"
                  label="Order ID"
                  placeholder=""
                  {...formik1.getFieldProps("orderId")}
                />
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  name="venderOrder"
                  className="!bg-[#fff]"
                  label="Dealer P.O. #."
                  placeholder=""
                  {...formik1.getFieldProps("venderOrder")}
                />
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  name="serial"
                  className="!bg-[#fff]"
                  label="Serial #"
                  placeholder=""
                  {...formik1.getFieldProps("serial")}
                />
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  name="productName"
                  className="!bg-[#fff]"
                  label="Product Name"
                  placeholder=""
                  {...formik1.getFieldProps("productName")}
                />
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  name="dealerName"
                  className="!bg-[#fff]"
                  label="Dealer Name"
                  placeholder=""
                  {...formik1.getFieldProps("dealerName")}
                />
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  name="customerName"
                  className="!bg-[#fff]"
                  label="Customer Name"
                  placeholder=""
                  {...formik1.getFieldProps("customerName")}
                />
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  name="servicerName"
                  className="!bg-[#fff]"
                  label="Servicer Name"
                  placeholder=""
                  {...formik1.getFieldProps("servicerName")}
                />
              </div>
              <div className="col-span-6">
                <Select
                  name="claimStatus"
                  label="Claim Status"
                  options={Claimstatus}
                  className="!bg-[#fff]"
                  onChange={handleSelectChange2}
                  value={formik1.values.claimStatus}
                />
              </div>
              <div className="col-span-6">
                <Select
                  options={customerValue}
                  name="customerStatusValue"
                  label="Customer Status"
                  className="!bg-[#fff]"
                  onChange={handleSelectChange2}
                  value={formik1.values.customerStatusValue}
                />
              </div>
              <div className="col-span-6">
                <Select
                  options={repairValue}
                  name="repairStatus"
                  label="Repair Status"
                  className="!bg-[#fff]"
                  onChange={handleSelectChange2}
                  value={formik1.values.repairStatus}
                />
              </div>
              <div className="col-span-12">
                <Button type="submit" className={"w-full"}>
                  Search
                </Button>
              </div>
            </Grid>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default ClaimList;
