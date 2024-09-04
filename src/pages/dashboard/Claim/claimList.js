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
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";

// Media Includes
import AddDealer from "../../../assets/images/dealer-book.svg";
import DeleteImage from "../../../assets/images/icons/Delete.svg";
import Search from "../../../assets/images/icons/SearchIcon.svg";
import productName from "../../../assets/images/icons/productName1.svg";
import pen from "../../../assets/images/pencil.png";
import Sendto from "../../../assets/images/double-arrow.png";
import AddItem from "../../../assets/images/icons/addItem.svg";
import model from "../../../assets/images/icons/ProductModel.svg";
import serial from "../../../assets/images/icons/ProductSerial.svg";
import Manufacturer from "../../../assets/images/icons/ProductManufacturer.svg";
import Edit from "../../../assets/images/icons/editIcon.svg";
import download from "../../../assets/images/download.png";
import disapproved from "../../../assets/images/Disapproved.png";
import chat from "../../../assets/images/icons/chatIcon.svg";
import clearFilter from "../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import arrowImage from "../../../assets/images/dropdownArrow.png";
import checkIcon from "../../../assets/images/check-mark.png";
import upload from "../../../assets/images/icons/upload.svg";
import Select from "../../../common/select";
import Cross from "../../../assets/images/Cross.png";
import Headbar from "../../../common/headBar";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Modal from "../../../common/model";
import CollapsibleDiv from "../../../common/collapsibleDiv";
import {
  addClaimMessages,
  addClaimsRepairParts,
  addUploadCommentImage,
  editClaimServicerValue,
  editClaimStatus,
  editClaimTypeValue,
  getClaimList,
  getClaimListForCustomer,
  getClaimListForDealer,
  getClaimListForReseller,
  getClaimListForResellerPortal,
  getClaimListForServicer,
  getClaimMessages,
  getContractPrice,
} from "../../../services/claimServices";
import { format } from "date-fns";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RotateLoader } from "react-spinners";
import CustomPagination from "../../pagination";
import SelectSearch from "../../../common/selectSearch";
import { apiUrl } from "../../../services/authServices";
import Card from "../../../common/card";
import { downloadFile } from "../../../services/userServices";

function ClaimList(props) {
  const baseUrl = apiUrl();
  console.log(baseUrl.bucket)
  const location = useLocation();
  const [timer, setTimer] = useState(3);
  const [showDetails, setShowDetails] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [pageValue, setPageValue] = useState(1);
  const [loaderType, setLoaderType] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isAttachmentsOpen, setIsAttachmentsOpen] = useState(false);
  const [isDisapprovedOpen, setIsDisapprovedOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [trackerView, setTrackerView] = useState(false);
  const [dropdownVisible2, setDropdownVisible2] = useState(false);
  const [dropdownVisible1, setDropdownVisible1] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimList, setClaimList] = useState({});
  const [totalRecords, setTotalRecords] = useState(0);
  const [price, setPrice] = useState("");
  const [serviceType, setServiceType] = useState([]);
  const isFormSubmittedRef = useRef(false);
  const [serviceType1, setServiceType1] = useState([
    { label: "Parts", value: "Parts" },
    { label: "labor", value: "Labour" },
    { label: "Shipping", value: "Shipping" },
  ]);
  const [claimId, setClaimId] = useState("");
  const [claimUnique, setClaimUnique] = useState("");
  const [claimType, setClaimType] = useState("");
  const [servicer, setServicer] = useState("");
  const [servicerList, setServicerList] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [claimDetail, setClaimDetail] = useState({});
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("");
  const [selfServicer, setSelfServicer] = useState("");
  const [showdata, setShowdata] = useState(false);
  const [showdata1, setShowdata1] = useState(true);
  const [customerStatus, setCustomerStatus] = useState({
    status: "",
    date: "",
  });
  const [coverage, setCoverage] = useState([]);
  const [claim, setClaim] = useState([
    { label: "Breakdown", value: "Breakdown" },
    { label: "Accidental", value: "Accidental" },
  ]);
  const navigate = useNavigate();
  const [claimStatus, setClaimStatus] = useState({ status: "", date: "" });
  const [repairStatus, setRepairStatus] = useState({ status: "", date: "" });
  const [initialValues, setInitialValues] = useState({
    repairParts: [{ serviceType: "", description: "", price: "" }],
    note: "",
    totalAmount: "",
  });
  const [sendto, setSendto] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { claimIdValue } = useParams();

  const excludedPaths = [
    "/customer/claimList",
    "/reseller/claimList",
    "/reseller/customerDetails/",
    "/dealer/customerDetails/",
    "/dealer/claimList",
    "/dealer/resellerDetails",
  ];

  const isExcludedPath = excludedPaths.some((path) =>
    location.pathname.includes(path)
  );

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    setRole(userDetails.role);
  }, [location.pathname]);

  const dropdownRef = useRef(null);
  const handleToggleDropdown = (value) => {
    setDropdownVisible(!dropdownVisible);
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    setModelLoading(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList, claimId]);

  const downloadImage = async (file) => {
    try {
      let data = {
        key: file.messageFile.fileName,
      };
      const binaryString = await downloadFile(data);
      const blob = new Blob([binaryString]);
      const blobUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = file.messageFile.fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error fetching the file:", error);
    }
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
    // console.log(selectedValue, value);
  };
  const handleSelectChange21 = (selectedValue, value) => {
    Shipment.setFieldValue(selectedValue, value);
  };

  useEffect(() => {
    if (claimIdValue != undefined) {
      formik1.setFieldValue("claimId", claimIdValue);
    } else {
      handleFilterIconClick();
    }
  }, [location]);

  const handleSelectChange = (selectedValue, value) => {

    if (selectedValue === "claimStatus") {
      if (value === "Rejected") {
        setIsRejectOpen(true);
      } else if (value?.reason) {
        setLoading1(true);
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
        };

        switch (selectedValue) {
          case "claimStatus":
            updateAndCallAPI(setClaimStatus);
            break;
          default:
            console.error("here");
        }
      }
    } else if (selectedValue === "claimType") {
      setLoading1(true);
      console.log(loading1, "------2--------------");
      const updateAndCallAPI = (setter) => {
        editClaimClaimType(
          claimList.result[activeIndex]._id,
          selectedValue,
          value
        );
      };
      updateAndCallAPI(setClaimType);
    } else if (selectedValue === "servicer") {
      setLoading1(true);
      console.log(loading1, "------3--------------");
      const updateAndCallAPI = (setter) => {
        setter((prevRes) => ({ ...prevRes, status: value }));
        editClaimServicer(
          claimList.result[activeIndex]._id,
          selectedValue,
          value
        );
      };
      // Call updateAndCallAPI function to handle servicer
      updateAndCallAPI(setServicer);
    } else {
      setLoading1(true);
      console.log(loading1, "-------4-------------");
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
          console.error("here");
      }
    }
    setTimeout(() => {
      setLoading1(false);
    }, 3000);
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
      const updatedClaimListCopy = { ...claimList };
      if (updatedClaimListCopy.result) {
        updatedClaimListCopy.result[activeIndex][name] = resultData[`${name}`];
        updatedClaimListCopy.result[activeIndex][`reason`] = resultData.reason;
      }
      setClaimList(updatedClaimListCopy);
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

    editClaimServicerValue(claimId, data)
      .then((res) => {
        setServicer(res.result.servicerId);
        const updatedClaimListCopy = { ...claimList };
        if (updatedClaimListCopy.result) {
          updatedClaimListCopy.result[activeIndex]["servicerId"] =
            res.result.servicerId;
          updatedClaimListCopy.result[activeIndex].selfServicer =
            res.result.isPureServicer;
        }
        setClaimList(updatedClaimListCopy);
      })
      .catch((error) => {
        console.error("Error occurred while editing claim servicer:", error);
      });
  };

  const editClaimClaimType = (claimId, statusType, statusValue) => {
    let data = {
      claimType: statusValue,
    };

    editClaimTypeValue(claimId, data).then((res) => {
      const updatedClaimListCopy = { ...claimList };
      console.log(res.result.claimType, updatedClaimListCopy.result.claimType);

      if (updatedClaimListCopy.result) {
        updatedClaimListCopy.result[activeIndex]["claimType"] =
          res.result.claimType;
      }
      setClaimList(updatedClaimListCopy);
      setClaimType(res.result.claimType);
    });
  };

  const handleAddClaim = () => {
    const path = window.location.pathname;
    let newPath = "/addClaim";
    if (path.includes("/dealer/claimList")) {
      newPath = "/dealer/addClaim";
    } else if (path.includes("/reseller/claimList")) {
      newPath = "/reseller/addClaim";
    } else if (path.includes("/customer/claimList")) {
      newPath = "/customer/addClaim";
    }

    navigate(newPath);
  };

  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const handlePageChange = async (page, rowsPerPage) => {
    setShowdata(false);
    setShowdata1(false);
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

      setTimeout(function () {
        setShowdata(true);
      }, 1000);
    } finally {
      localStorage.removeItem("activeIndex");
      setActiveIndex(null);
      setLoading(false);
      setTimeout(function () {
        setShowdata(true);
      }, 1000);
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
    formik.resetForm();
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

  const handleSetActiveIndex = (index) => {
    setActiveIndex(index); // Update active index based on user action
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
    scrollToBottom();

    if (res.repairParts.length != 0) {
      const repairPartsValues = res?.repairParts?.map((part) => ({
        serviceType: part.serviceType || "",
        description: part.description || "",
        price: part.price || "",
        value: true,
      }));
      console.log("repairPartsValues", repairPartsValues);
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
    const getServiceType = (coverageType, shipping) => {
      switch (coverageType) {
        case "Parts":
          return shipping
            ? [
              { label: "Parts", value: "Parts" },
              { label: "Shipping", value: "Shipping" },
            ]
            : [{ label: "Parts", value: "Parts" }];
        case "Labour":
          return shipping
            ? [
              { label: "Labor ", value: "Labour" },
              { label: "Shipping", value: "Shipping" },
            ]
            : [{ label: "labor", value: "Labour" }];
        default:
          return shipping
            ? [
              { label: "Parts", value: "Parts" },
              { label: "Labor ", value: "Labour" },
              { label: "Shipping", value: "Shipping" },
            ]
            : [
              { label: "Parts", value: "Parts" },
              { label: "Labor ", value: "Labour" },
            ];
      }
    };
    setServiceType(
      getServiceType(
        res.contracts.orders.serviceCoverageType,
        res.contracts.orders.dealers.isShippingAllowed
      )
    );
    setClaimUnique(res.unique_key);
    setClaimId(res._id);
    setIsEditOpen(true);
    setError("");

    getClaimPrice(res.contractId);
  };

  const getClaimPrice = async (id) => {
    setClaimLoading(true);
    const response = await getContractPrice(id);
    setPrice(response.result);
    setClaimLoading(false);
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
    // setIsEditOpen(false);
  };

  const closeAttachments = () => {
    setIsAttachmentsOpen(false);
  };

  const closeComplete = () => {
    setIsComplete(false);
  };

  const openView = (claim) => {
    let typeValue = "Admin";
    const isValidReseller = !!claim?.contracts.orders.resellerId;
    const selfServicer = claim?.selfServicer;
    const isAdminView = window.location.pathname.includes("/dealer/claimList");
    const isResellerPath =
      window.location.pathname.includes("/reseller/claimList") ||
      window.location.pathname.includes("/reseller/customerDetails");
    const isCustomerPath = window.location.pathname.includes(
      "/customer/claimList"
    );

    console.log("isResellerPath", isResellerPath);

    if (!isAdminView && !isResellerPath && !isCustomerPath) {
      typeValue = "Admin";
    } else if (isAdminView && !isResellerPath && !isCustomerPath) {
      typeValue = "Dealer";
    } else if (!isAdminView && isResellerPath && !isCustomerPath) {
      typeValue = "Reseller";
    } else if (!isAdminView && !isResellerPath && isCustomerPath) {
      typeValue = "Customer";
    }

    formik2.setFieldValue("type", typeValue);

    setSendto(
      [
        {
          label:
            !isAdminView && !isResellerPath && !isCustomerPath
              ? "Admin (To Self)"
              : "Admin ",
          value: "Admin",
        },
        {
          label:
            isAdminView && !isResellerPath && !isCustomerPath
              ? "Dealer (To Self)"
              : "Dealer ",
          value: "Dealer",
        },
        isValidReseller && {
          label:
            !isAdminView && isResellerPath && !isCustomerPath
              ? "Reseller (To Self)"
              : "Reseller",
          value: "Reseller",
        },
        !selfServicer ? { label: "Servicer", value: "Servicer" } : null,
        {
          label:
            !isAdminView && !isResellerPath && isCustomerPath
              ? "Customer (To Self)"
              : "Customer",
          value: "Customer",
        },
      ].filter(Boolean)
    );

    setClaimDetail(claim);
    getClaimMessage(claim._id, true);
    setIsViewOpen(true);
  };

  const getClaimMessage = (claimId, loader = true) => {
    setModelLoading(loader);
    getClaimMessages(claimId)
      .then((res) => {
        setMessageList(res.result);
      })
      .catch((error) => {
        console.error("Error fetching claim messages:", error);
      })
      .finally(() => {
        scrollToBottom();
      });
  };

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

  const downloadAttachments = async (res) => {
    const attachments = res || [];

    for (const [index, attachment] of attachments.entries()) {
      try {
        const binaryString = await downloadFile({ key: attachment.key });
        const fileExtension = attachment.key.split(".").pop();
        let mimeType = "";

        switch (fileExtension) {
          case "pdf":
            mimeType = "application/pdf";
            break;
          case "jpg":
          case "jpeg":
            mimeType = "image/jpeg";
            break;
          case "png":
            mimeType = "image/png";
            break;
          case "doc":
          case "docx":
            mimeType = "application/msword";
            break;
          case "xlsx":
            mimeType =
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            break;
          default:
            mimeType = "application/octet-stream";
        }
        const blob = new Blob([binaryString], { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = blobUrl;
        anchor.download = attachment.key.split("/").pop();
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Error fetching the file:", error);
      }
    }
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

      const userInfo = JSON.parse(localStorage.getItem("userDetails"));
      const temporaryMessage = {
        _id: "temp-id",
        content: values.content,
        type: values.type || "Admin",
        messageFile: {
          fileName: values.fileName || "",
          originalName: values.originalName || "",
          size: values.size || "",
          _id: "temp-file-id",
        },
        date: new Date().toISOString(),
        commentTo: {
          firstName: values.commentToFirstName || "",
          lastName: values.commentToLastName || "",
        },
        commentBy: {
          firstName: userInfo?.userInfo?.firstName || "",
          lastName: userInfo?.userInfo?.lastName || "",
          roles: {
            role: userInfo?.role || "",
          },
        },
      };
      // Update the state with the temporary message
      setMessageList((prevClaimMessages) => [
        ...prevClaimMessages,
        temporaryMessage,
      ]);

      addClaimMessages(claimDetail?._id, values).then((res) => {
        getClaimMessage(claimDetail._id, false);
      });

      formik2.resetForm();
      formik2.setFieldValue("content", "");
      setPreviewImage(null);
      const pathname = window.location.pathname;
      const type = pathname.includes("/dealer/claimList")
        ? "Dealer"
        : pathname.includes("/customer/claimList")
          ? "Customer"
          : pathname.includes("/reseller/claimList") ||
            pathname.includes("/reseller/customerDetails")
            ? "Reseller"
            : pathname.includes("/servicer/claimList")
              ? "Servicer"
              : null;

      if (type) {
        formik2.setFieldValue("type", type);
      }
    },
  });

  useEffect(() => {
    if (activeIndex != null) {
      const coverageType =
        claimList.result[activeIndex].contracts.orders.coverageType;
      const claims =
        coverageType === "Breakdown"
          ? [{ label: "Breakdown", value: "Breakdown" }]
          : coverageType === "Accidental"
            ? [{ label: "Accidental", value: "Accidental" }]
            : [
              { label: "Breakdown", value: "Breakdown" },
              { label: "Accidental", value: "Accidental" },
            ];
      setClaim(claims);
      const bdAdhValue = claimList.result[activeIndex]?.claimType;

      setClaimType(bdAdhValue);

      setError("");

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
      const filterServicer = claimList?.result[
        activeIndex
      ]?.contracts?.allServicer?.map((res) => ({
        label: res?.name,
        value: res?._id,
      }));

      setServicerList(filterServicer);
      if (
        filterServicer.length !== 0 &&
        claimList.result[activeIndex].servicerId !== null
      ) {
        setServicer(claimList.result[activeIndex].servicerId);
      } else {
        setServicer("");
      }

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
        // console.log(res);
        if (res.code == 401) {
          setError(res.message);
        } else {
          openAttachments();
          setTimer(3);
          getAllClaims();
          // setActiveIndex();
          setIsEditOpen(false);
        }
      });
    },
  });

  const Shipment = useFormik({
    initialValues: {
      trackingNumber: "",
      trackingType: "",
    },
    onSubmit: (values) => {
      setLoading1(true);
      setShowdata1(false);
      addClaimsRepairParts(claimList.result[activeIndex]._id, values).then(
        (res) => {
          getAllClaims(undefined, undefined, true);
          setActiveIndex(activeIndex);
          setTrackerView(false);
          Shipment.resetForm();
        }
      );
      setTimeout(() => {
        setLoading1(false);
        setShowdata1(true);
      }, 3000);
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
    { label: "Open", value: "Open" },
    { label: "Completed", value: "Completed" },
    { label: "Rejected", value: "Rejected" },
  ];

  useEffect(() => {
    getAllClaims();
  }, []);

  useEffect(() => {
    if (props.activeTab == "Claims") {
      getAllClaims();
    }
  }, [props]);

  const tracker = [
    { label: "UPS", value: "ups" },
    { label: "USPS", value: "usps" },
    { label: "FedX", value: "fedx" },
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

  const claimPaid = [
    {
      value: "Unpaid",
      label: "Unpaid",
    },
    {
      value: "Paid",
      label: "Paid",
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
      pName: "",
      dealerName: "",
      customerName: "",
      dealerSku: "",
      servicerName: "",
      repairStatus: "",
      customerStatusValue: "",
      claimStatus: "",
      orderId: "",
      trackingNumber: "",
      trackingType: "",
      claimPaidStatus: "",
    },
    validationSchema,
    onSubmit: (values) => {
      isFormSubmittedRef.current = true;
      console.log("Form submitted with values:", values);
      setIsDisapprovedOpen(false);
      getAllClaims();
      setShowdata(false);
      setActiveIndex(null);
      setTimeout(function () {
        setShowdata(true);
      }, 1000);
      setShowdata(false);
    },
  });

  const getAllClaims = async (page = 1, rowsPerPage, loader) => {
    console.log(isFormSubmittedRef.current);
    if (loader) {
      setLoaderType(false);
    } else setLoaderType(true);
    setPageValue(page);
    let data = {
      page,
      pageLimit: rowsPerPage == undefined ? recordsPerPage : rowsPerPage,
      ...(isFormSubmittedRef.current ? formik1.values : {}),
    };
    let getClaimListPromise;

    if (props.flag === "dealer") {
      getClaimListPromise = getClaimListForDealer(props.id, data);
    } else if (props.flag === "servicer") {
      getClaimListPromise = getClaimListForServicer(props.id, data);
    } else if (props.flag === "reseller") {
      getClaimListPromise = getClaimListForReseller(props.id, data);
    } else if (window.location.pathname.includes("/reseller/claimList")) {
      getClaimListPromise = getClaimListForResellerPortal(props.id, data);
    } else if (props.flag === "customer") {
      getClaimListPromise = getClaimListForCustomer(props.id, data);
    } else {
      if (claimIdValue == undefined) {
        getClaimListPromise = getClaimList(data);
      } else {
        let newData = {
          ...data,
          claimId: claimIdValue,
        };
        getClaimListPromise = getClaimList(newData);
      }
    }

    getClaimListPromise
      .then((res) => {
        localStorage.removeItem("activeIndex");
        setActiveIndex(null);
        if (res) {
          setClaimList(res);
          setTotalRecords(res?.totalCount);
        }
        setLoaderType(false);
        setTimeout(function () {
          setShowdata(true);
        }, 1000);
      })
      .catch(() => {
        setLoaderType(false);
        setShowdata(false);
      });
  };
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
        // console.log(res.messageFile);
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
    isFormSubmittedRef.current = false;
    getAllClaims();
  };
  // console.log(activeIndex, "++++++++++++++++_-------------------");
  const addTracker = () => { };
  return (
    <>
      {loading1 && (
        <div className=" fixed z-[999999] bg-[#f9f9f99c] backdrop-blur-xl top-0 h-screen w-full flex py-5">
          <div className="self-center ml-[40%]">
            <RotateLoader color="#333" />
          </div>
        </div>
      )}
      <div className="mb-8 ml-3">
        {props && Object.keys(props).length === 0 && (
          <>
            <Headbar />
            <div className="flex mt-2">
              <div className="pl-3">
                <p className="font-bold text-[36px] leading-9 mb-[3px]">
                  Claim
                </p>
                <ul className="flex self-center">
                  <li className="text-sm text-neutral-grey font-Regular">
                    <Link to={"/"}>Home </Link> /
                  </li>
                  <li className="text-sm text-neutral-grey font-semibold ml-1">
                    {" "}
                    Claim Listing
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={handleAddClaim}
              className="w-[150px] bg-white font-semibold py-2 px-4 ml-auto flex self-center mb-3 rounded-xl border-[1px] border-Light-Grey"
            >
              <img src={AddItem} className="self-center" alt="AddItem" />
              <span className="text-black ml-3 text-[14px] font-Regular">
                Add Claim
              </span>
            </button>
          </>
        )}

        <Card className="my-4 pb-4 border-[1px] border-Light-Grey rounded-xl">
          <Grid className="!p-[26px] !gap-2 !pt-[14px] !pb-0">
            <div className="col-span-2 self-center">
              <p className="text-xl font-semibold">Claims List</p>
            </div>
            <div className="col-span-10">
              <div className="bg-grayf9 rounded-[30px] p-3 border-[1px] border-Light-Grey">
                <form onSubmit={formik1.handleSubmit}>
                  <Grid className="!gap-1">
                    <div className="col-span-8 self-center">
                      <Grid className="!gap-2">
                        <div className="col-span-4 self-center">
                          <Input
                            name="contractId"
                            type="text"
                            className="!text-[14px] !bg-White-Smoke"
                            className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
                            label=""
                            placeholder="Contract ID"
                            {...formik1.getFieldProps("contractId")}
                          />
                        </div>
                        <div className="col-span-4 self-center">
                          <Input
                            name="claimId"
                            type="text"
                            className="!text-[14px] !bg-White-Smoke"
                            className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
                            label=""
                            placeholder="Claim ID"
                            {...formik1.getFieldProps("claimId")}
                          />
                        </div>
                        <div className="col-span-4 self-center">
                          <SelectSearch
                            name="claimStatus"
                            label=""
                            options={Claimstatus}
                            OptionName="Claim Status"
                            className="!text-[14px] !bg-White-Smoke"
                            className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
                            onChange={handleSelectChange2}
                            value={formik1.values.claimStatus}
                          />
                        </div>
                      </Grid>
                    </div>
                    <div className="col-span-4 self-center flex justify-center">
                      <Button type="submit" className="!p-2">
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
                        className="ml-2 !text-[14px] !px-2"
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
                    return (
                      <CollapsibleDiv
                        index={index}
                        activeIndex={activeIndex}
                        ShowData={showdata}
                        setActiveIndex={handleSetActiveIndex}
                        title={
                          <>
                            <Grid className="border-Gray28 border !gap-2 bg-white rounded-t-[22px]">
                              <div className="col-span-3 self-center border-Gray28 border-r rounded-ss-xl p-5">
                                <p className="font-semibold leading-5 text-black text-lg">
                                  {" "}
                                  {res.unique_key}{" "}
                                </p>
                                <p className="text-[#A3A3A3]">Claim ID</p>
                              </div>
                              <div className="col-span-3 self-center border-Gray28 border-r p-5">
                                <p className="font-semibold leading-5 text-black text-lg">
                                  {" "}
                                  {res?.contracts?.unique_key}{" "}
                                </p>
                                <p className="text-[#A3A3A3]">Contract ID</p>
                              </div>
                              <div className="col-span-3 self-center border-Gray28 border-r p-5">
                                <p className="font-semibold leading-5 text-black text-lg">
                                  {" "}
                                  {format(new Date(res.lossDate), "MM/dd/yyyy")}
                                </p>
                                <p className="text-[#A3A3A3]">Damage Date</p>
                              </div>
                              <div className="col-span-3 self-center justify-left pl-4 flex relative">
                                <img
                                  src={chat}
                                  className=" mr-2 cursor-pointer"
                                  onClick={() => openView(res)}
                                  alt="chat"
                                />
                                {role === "Super Admin" &&
                                  res?.claimStatus?.[0]?.status === "Open" && (
                                    <img
                                      src={Edit}
                                      className="mr-2 cursor-pointer"
                                      onClick={() => openEdit(res, index)}
                                      alt="edit"
                                    />
                                  )}

                                {role != "Super Admin" &&
                                  res.selfServicer &&
                                  res?.claimStatus?.[0]?.status === "Open" &&
                                  !location.pathname.includes(
                                    "customer/claimList"
                                  ) &&
                                  !location.pathname.includes(
                                    "/reseller/claimList"
                                  ) &&
                                  !location.pathname.includes(
                                    "/dealer/claimList"
                                  ) && (
                                    <img
                                      src={Edit}
                                      className="mr-2 cursor-pointer"
                                      onClick={() => openEdit(res, index)}
                                      alt="edit"
                                    />
                                  )}
                              </div>
                            </Grid>
                            <Grid className={`${isExcludedPath ? '!grid-cols-4' : '!grid-cols-5'} !gap-0 bg-grayf9  border-Gray28 border-x`}>
                              <div className="col-span-1 flex ">
                                <img
                                  src={productName}
                                  className="self-center h-[50px] w-[50px] ml-3"
                                  alt="productName"
                                />
                                <div className="py-4 pl-3 self-center">
                                  <p className="text-[#4a4a4a] text-[11px] font-Regular">
                                    Dealer SKU
                                  </p>
                                  <p className="text-light-black text-sm font-semibold">
                                    {res?.dealerSku}
                                  </p>
                                </div>
                              </div>
                              {isExcludedPath ? '' : <div className="col-span-1 flex ">
                                <img
                                  src={productName}
                                  className="self-center h-[50px] w-[50px] ml-3"
                                  alt="productName"
                                />
                                <div className="py-4 pl-3 self-center">
                                  <p className="text-[#4a4a4a] text-[11px] font-Regular">
                                    Product SKU
                                  </p>
                                  <p className="text-light-black text-sm font-semibold">
                                    {res?.contracts?.productName}
                                  </p>
                                </div>
                              </div>}

                              <div className="col-span-1 flex">
                                <img
                                  src={Manufacturer}
                                  className="self-center h-[50px] w-[50px] ml-3"
                                  alt=""
                                />
                                <div className="py-4 pl-3 self-center">
                                  <p className="text-[#4a4a4a] text-[11px] font-Regular">
                                    Product Manufacturer
                                  </p>
                                  <p className="text-light-black text-sm font-semibold">
                                    {res?.contracts?.manufacture}
                                  </p>
                                </div>
                              </div>
                              <div className="col-span-1 flex">
                                <img
                                  src={model}
                                  className="self-center h-[50px] w-[50px] ml-3"
                                  alt=""
                                />
                                <div className="py-4 pl-3 self-center">
                                  <p className="text-[#4a4a4a] text-[11px] font-Regular">
                                    Product Model
                                  </p>
                                  <p className="text-light-black text-sm font-semibold">
                                    {res?.contracts?.model}
                                  </p>
                                </div>
                              </div>
                              <div className="col-span-1 flex">
                                <img
                                  src={serial}
                                  className="self-center h-[50px] w-[50px] ml-3"
                                  alt=""
                                />
                                <div className="py-4 pl-3 self-center">
                                  <p className="text-[#4a4a4a] text-[11px] font-Regular">
                                    Product Serial  / Device ID
                                  </p>
                                  <p className="text-light-black text-sm font-semibold">
                                    {res?.contracts?.serial}
                                  </p>
                                </div>
                              </div>
                            </Grid>
                          </>
                        }
                      >
                        {showdata && (
                          <Grid className="!gap-0 bg-light-black rounded-b-[22px] mb-5 border-Gray28 border-x">
                            <>
                              {res?.repairParts.length > 0 &&
                                res?.repairParts.map((part, index) => (
                                  <>
                                    <div className="col-span-2 bg-light-black border-r border-b border-Gray28">
                                      <div className="py-4 pl-3">
                                        <p className="text-white text-sm font-Regular">
                                          Service Type
                                        </p>
                                        <p className="text-light-green text-base font-semibold">
                                          {part.serviceType == "Labour"
                                            ? "labor"
                                            : part.serviceType}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="col-span-8 bg-light-black border-r border-b border-Gray28">
                                      <div className="py-4 pl-3">
                                        <p className="text-white text-sm font-Regular">
                                          Description
                                        </p>
                                        <p className="text-light-green text-base font-semibold">
                                          {part.description}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="col-span-2 bg-light-black border-b border-Gray28">
                                      <div className="py-4 pl-3">
                                        <p className="text-white text-sm font-Regular">
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
                                <Grid className="!gap-2">
                                  <div className="col-span-4 py-4 pl-1 ">
                                    <div className="bg-Eclipse py-2 px-2">
                                      {!location.pathname.includes(
                                        "customer/claimList"
                                      ) && (
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
                                        )}

                                      <p className="text-light-green text-[11px] mb-3 font-Regular">
                                        Claim Cost :{" "}
                                        <span className="font-semibold text-white ml-3">
                                          {" "}
                                          ${calculateTotalCost(
                                            res.repairParts
                                          )}{" "}
                                        </span>
                                      </p>
                                      {location.pathname.includes(
                                        "/reseller/claimList"
                                      ) ? (
                                        <p className="text-light-green mb-4 text-[11px] font-Regular flex self-center">
                                          {" "}
                                          <span className="self-center mr-4">
                                            Servicer Name :{" "}
                                          </span>
                                          {res?.servicerData?.name}
                                        </p>
                                      ) : (
                                        <p className="text-light-green mb-4 text-[11px] font-Regular flex self-center">
                                          {" "}
                                          <span className="self-center mr-4">
                                            Servicer Name :{" "}
                                          </span>
                                          {role == "Super Admin" ? (
                                            <Select
                                              name="servicer"
                                              label=""
                                              value={servicer}
                                              disabled={
                                                claimStatus.status ===
                                                "Rejected" ||
                                                claimStatus.status ===
                                                "Completed" ||
                                                location.pathname.includes(
                                                  "/reseller/customerDetails"
                                                )
                                              }
                                              onChange={handleSelectChange}
                                              OptionName="Servicer"
                                              white
                                              className1="!py-0 text-white !bg-Eclipse !text-[13px] !border-1 !font-[400]"
                                              classBox="w-[55%]"
                                              options={servicerList}
                                            />
                                          ) : (
                                            <>{res?.servicerData?.name}</>
                                          )}
                                        </p>
                                      )}

                                      {!isExcludedPath && (
                                        <p className="text-light-green mb-4 text-[11px] font-Regular flex self-center">
                                          <span className="self-center mr-8">
                                            {" "}
                                            Claim Type :
                                          </span>
                                          <Select
                                            name="claimType"
                                            label=""
                                            value={claimType}
                                            onChange={handleSelectChange}
                                            white
                                            disableFirstOption={true}
                                            disabled={
                                              claimStatus.status ===
                                              "Rejected" ||
                                              claimStatus.status === "Completed"
                                            }
                                            options={claim}
                                            OptionName="Claim Type"
                                            className1="!py-0 text-white !bg-Eclipse !text-[13px] !border-1 !font-[400]"
                                            classBox="w-[55%]"
                                          />
                                        </p>
                                      )}
                                      <p className="text-light-green mb-4 text-[11px] font-Regular flex self-center">
                                        <span className="self-center w-[75px]  mr-[1rem]">
                                          Shipment :
                                        </span>
                                        {trackerView ? (
                                          <>
                                            {claimStatus.status == "Rejected" ||
                                              claimStatus.status ==
                                              "Completed" ? (
                                              <></>
                                            ) : (
                                              <form
                                                onSubmit={Shipment.handleSubmit}
                                              >
                                                <div className="relative flex w-full">
                                                  <Select
                                                    name="trackingType"
                                                    label=""
                                                    value={
                                                      Shipment.values
                                                        .trackingType
                                                    }
                                                    onChange={
                                                      handleSelectChange21
                                                    }
                                                    white
                                                    // OptionName="Tracker"
                                                    options={tracker}
                                                    className1="!py-0 !rounded-r-[0px] text-white !bg-Eclipse !text-[13px] !border-1 !font-[400]"
                                                    classBox="w-[35%]"
                                                  />
                                                  <Input
                                                    name="trackingNumber"
                                                    label=""
                                                    placeholder="Tracking #"
                                                    white
                                                    value={
                                                      Shipment.values
                                                        .trackingNumber
                                                    }
                                                    disabled={
                                                      claimStatus.status ==
                                                      "Rejected" ||
                                                      claimStatus.status ==
                                                      "Completed"
                                                    }
                                                    // options={state}
                                                    className1="!py-0 !rounded-l-[0px] !border-l-[0px] text-white !bg-Eclipse !text-[13px] !border-1 !font-[400]"
                                                    classBox="w-[50%]"
                                                    {...Shipment.getFieldProps(
                                                      "trackingNumber"
                                                    )}
                                                  />
                                                  <Button
                                                    className="absolute right-[30px] !p-0 top-[2px]"
                                                    type="submit"
                                                  >
                                                    <img
                                                      src={checkIcon}
                                                      className="w-[21px]"
                                                    />
                                                  </Button>
                                                </div>
                                              </form>
                                            )}
                                          </>
                                        ) : (
                                          <>
                                            {res?.trackingType == "" ? (
                                              <>
                                                {claimStatus.status ==
                                                  "Rejected" ||
                                                  claimStatus.status ==
                                                  "Completed" ? (
                                                  <></>
                                                ) : (
                                                  <>
                                                    <form
                                                      onSubmit={
                                                        Shipment.handleSubmit
                                                      }
                                                    >
                                                      <div className="relative flex w-full">
                                                        <Select
                                                          name="trackingType"
                                                          label=""
                                                          value={
                                                            Shipment.values
                                                              .trackingType
                                                          }
                                                          onChange={
                                                            handleSelectChange21
                                                          }
                                                          white
                                                          // OptionName="Tracker"
                                                          options={tracker}
                                                          className1="!py-0 !rounded-r-[0px] text-white !bg-Eclipse !text-[13px] !border-1 !font-[400]"
                                                          classBox="w-[35%]"
                                                        />
                                                        <Input
                                                          name="trackingNumber"
                                                          label=""
                                                          placeholder="Tracking #"
                                                          white
                                                          value={
                                                            Shipment.values
                                                              .trackingNumber
                                                          }
                                                          // options={state}
                                                          className1="!py-0 !rounded-l-[0px] !border-l-[0px] text-white !bg-Eclipse !text-[13px] !border-1 !font-[400]"
                                                          classBox="w-[50%]"
                                                          {...Shipment.getFieldProps(
                                                            "trackingNumber"
                                                          )}
                                                        />
                                                        <Button
                                                          className="absolute right-[30px] !p-0 top-[2px]"
                                                          type="submit"
                                                        >
                                                          <img
                                                            src={checkIcon}
                                                            className="w-[21px]"
                                                          />
                                                        </Button>
                                                      </div>
                                                    </form>
                                                  </>
                                                )}
                                              </>
                                            ) : (
                                              <div className="flex w-[65%] justify-between">
                                                {res?.trackingType == "ups" && (
                                                  <a
                                                    className="text-[white] text-base border-2 border-[white] rounded-3xl px-4"
                                                    href={`https://www.ups.com/track?track=yes&trackNums=${res?.trackingNumber}&loc=en_US&requester=ST/`}
                                                    target="_blank"
                                                  >
                                                    UPS Tracker
                                                  </a>
                                                )}

                                                {res?.trackingType ==
                                                  "usps" && (
                                                    <a
                                                      className="text-[white] text-base border-2 border-[white] rounded-3xl px-4"
                                                      href={`https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${res?.trackingNumber}`}
                                                      target="_blank"
                                                    >
                                                      USPS Tracker
                                                    </a>
                                                  )}

                                                {res?.trackingType ==
                                                  "fedx" && (
                                                    <a
                                                      className="text-[white] text-base border-2 border-[white] rounded-3xl px-4"
                                                      href={`https://www.fedex.com/fedextrack/system-error?trknbr=${res?.trackingNumber}`}
                                                      target="_blank"
                                                    >
                                                      FedX Tracker
                                                    </a>
                                                  )}
                                                {claimStatus.status ==
                                                  "Rejected" ||
                                                  claimStatus.status ==
                                                  "Completed" ? (
                                                  <></>
                                                ) : (
                                                  <img
                                                    src={pen}
                                                    onClick={() =>
                                                      setTrackerView(true)
                                                    }
                                                    className="cursor-pointer object-contain ml-4"
                                                  />
                                                )}
                                              </div>
                                            )}
                                          </>
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="col-span-4 pt-4">
                                    <div className="border border-[#FFFFFF1A] mb-2 p-1 relative rounded-lg flex w-full">
                                      <div className="bg-Gray28 w-[40%] rounded-s-lg">
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
                                      {claimStatus.status == "Rejected" ||
                                        claimStatus.status == "Completed" ? (
                                        <></>
                                      ) : (
                                        <div
                                          className="self-center ml-auto w-[10%] mr-2 cursor-pointer"
                                          ref={dropdownRef}
                                          onClick={handleToggleDropdown}
                                        >
                                          <Select
                                            name="customerStatus"
                                            label=""
                                            disableFirstOption={true}
                                            value={customerStatus.status}
                                            onChange={handleSelectChange}
                                            classBox='!bg-transparent'
                                            disabled={
                                              claimStatus.status ==
                                              "Rejected" ||
                                              claimStatus.status == "Completed"
                                            }
                                            white
                                            className1="!border-0 !text-light-black"
                                            options={customerValue}
                                            visible={dropdownVisible}
                                          />
                                        </div>
                                      )}
                                    </div>
                                    <div className="border border-[#FFFFFF1A] mb-2 p-1 relative rounded-lg flex w-full">
                                      <div className="bg-Gray28 w-[40%] rounded-s-lg">
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
                                      {role == "Super Admin" && (
                                        <>
                                          {claimStatus.status == "Rejected" ||
                                            claimStatus.status == "Completed" ? (
                                            <></>
                                          ) : (
                                            <div
                                              className="self-center ml-auto w-[10%] mr-2 cursor-pointer"
                                              ref={dropdownRef}
                                            >
                                              <Select
                                                name="claimStatus"
                                                label=""
                                                disableFirstOption={true}
                                                value={claimStatus.status}
                                                classBox='!bg-transparent'
                                                disabled={
                                                  claimStatus.status ==
                                                  "Rejected" ||
                                                  claimStatus.status ==
                                                  "Completed"
                                                }
                                                onChange={handleSelectChange}
                                                white
                                                className1="!border-0 !text-light-black"
                                                options={claimvalues}
                                                visible={dropdownVisible}
                                              />
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </div>
                                    <div className="border border-[#FFFFFF1A] p-1 relative rounded-lg flex w-full">
                                      <div className="bg-Gray28 w-[40%] rounded-s-lg">
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
                                      {/* {res?.selfServicer === true && 
                                  <>
                                   { claimStatus.status == "Rejected" ||
                                      claimStatus.status == "Completed" ? (
                                   <></>
                                   ) : (
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
                                         className1="!border-0 !text-light-black"
                                         options={repairValue}
                                         visible={dropdownVisible}
                                       />
                                     </div>
                                   )}
                                 </>} */}
                                      {(role == "Super Admin" ||
                                        claimList.result[activeIndex]
                                          ?.selfServicer) &&
                                        !location.pathname.includes(
                                          "customer/claimList"
                                        ) && (
                                          <>
                                            {claimStatus.status == "Rejected" ||
                                              claimStatus.status ==
                                              "Completed" ? (
                                              <></>
                                            ) : (
                                              <div
                                                className="self-center ml-auto w-[10%] mr-2 cursor-pointer"
                                                ref={dropdownRef}
                                                onClick={handleToggleDropdown1}
                                              >
                                                <Select
                                                  name="repairStatus"
                                                  label=""
                                                  disableFirstOption={true}
                                                  classBox='!bg-transparent'
                                                  value={repairStatus.status}
                                                  onChange={handleSelectChange}
                                                  disabled={
                                                    claimStatus.status ==
                                                    "Rejected" ||
                                                    claimStatus.status ==
                                                    "Completed"
                                                  }
                                                  white
                                                  className1="!border-0 !text-light-black"
                                                  options={repairValue}
                                                  visible={dropdownVisible}
                                                />
                                              </div>
                                            )}
                                          </>
                                        )}
                                    </div>
                                  </div>
                                  <div className="col-span-4 pt-2">
                                    <div className="m-2 p-2 bg-Eclipse ">
                                      <p className="text-[11px] text-white">
                                        Diagnosis
                                      </p>
                                      <div
                                        className={` overflow-y-scroll Diagnosis ${res?.receiptImage != ""
                                          ? "h-[130px] max-h-[130px]"
                                          : "h-[164px] max-h-[164px]"
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
                                          <div className="col-span-3"></div>
                                          {/* <Button
                                     className="!bg-white col-span-6 !rounded-[11px] !text-light-black !text-[12px] flex"
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
                                              className="!bg-white col-span-9 !rounded-[11px] !text-light-black !text-[13px] flex"
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
                                {res.reason != "" && (
                                  <div className="px-3 mb-4">
                                    <Grid>
                                      <div className="col-span-12">
                                        <p className="text-white">
                                          <b>Reason For Rejection : </b>{" "}
                                          <span>{res.reason}</span>
                                        </p>
                                      </div>
                                    </Grid>
                                  </div>
                                )}
                                {res.note != "" && (
                                  <div className="px-3 mb-4">
                                    <Grid>
                                      <div className="col-span-12">
                                        <p className="text-white">
                                          <b>Note : </b> <span>{res.note}</span>
                                        </p>
                                      </div>
                                    </Grid>
                                  </div>
                                )}
                              </div>
                            </>
                          </Grid>
                        )}
                      </CollapsibleDiv>
                    );
                  })}
              </>
            )}
          </div>
          <div>
            {totalRecords === 0 && !loaderType ? (
              <>
                <div className="text-center my-5">
                  <p>No records found.</p>
                </div>
              </>
            ) : (
              <>
                <CustomPagination
                  totalRecords={totalRecords}
                  page={pageValue}
                  className={loaderType ? "opacity-0	" : "opacity-100"}
                  rowsPerPageOptions={[10, 20, 50, 100]}
                  onPageChange={handlePageChange}
                  setRecordsPerPage={setRecordsPerPage}
                />
              </>
              // <CustomPagination
              //   totalRecords={totalRecords}
              //   rowsPerPageOptions={[10, 20, 50, 100]}
              //   onPageChange={handlePageChange}
              //   setRecordsPerPage={setRecordsPerPage}
              // />
            )}
          </div>
        </Card>
      </div>
      <Modal isOpen={isRejectOpen} onClose={closeReject}>
        <Button
          onClick={closeReject}
          className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-Granite-Gray"
        >
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
                <p className="text-3xl mb-0 mt-4 font-semibold">
                  {" "}
                  <span className=""> Reject </span>
                </p>
                <p className="text-base font-medium mt-2 ">
                  Do you really want to Reject the Claim ?
                </p>
              </div>
              <div className="col-span-3"></div>
              <div className="col-span-3">
                <Button onClick={handleYesClick} className="w-full">
                  Yes
                </Button>
              </div>
              <div className="col-span-3">
                <Button
                  type="button"
                  className="w-full !bg-[transparent] !text-light-black !border-light-black !border-[1px]"
                  onClick={closeReject}
                >
                  No
                </Button>
              </div>
              <div className="col-span-3"></div>
            </Grid>
          ) : (
            <div className="col-span-12">
              <div className="relative my-4">
                <label
                  htmlFor="reason"
                  className="absolute text-base text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-white left-2 px-1 -translate-y-4 scale-75"
                >
                  Enter Your Reason <span className="text-red-500">*</span>
                </label>
                <Formik
                  initialValues={{ reason: "" }}
                  validate={(values) => {
                    const errors = {};
                    if (!values.reason) {
                      errors.reason = "Required";
                    }
                    return errors;
                  }}
                  onSubmit={(values, { setSubmitting }) => {
                    handleSelectChange("claimStatus", values);
                    // Submit logic here
                    // console.log(values);
                    setSubmitting(false);
                    setActiveIndex(null);
                  }}
                >
                  {({ isSubmitting, errors, touched }) => (
                    <Form>
                      <Field
                        as="textarea"
                        id="reason"
                        rows="4"
                        name="reason"
                        maxLength={150}
                        className={`block px-2.5 pb-2.5 pt-1.5 w-full text-sm font-semibold text-light-black bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer resize-none focus:text-sm ${errors.reason && touched.reason && "border-red-500"
                          }`}
                      />
                      <ErrorMessage
                        name="reason"
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
          className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-Granite-Gray"
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
          <div className="h-[350px] mt-3 p-3 max-h-[350px] overflow-y-scroll border-Light-Grey  border rounded-xl">
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
                        <div className="bg-light-black border-2 w-12 h-12 flex justify-center border-Light-Grey rounded-full">
                          <p className="text-white text-2xl self-center">A</p>
                        </div>
                      </div>
                      <div className="col-span-11">
                        <div className="bg-white text-light-black rounded-md relative p-1">
                          <img
                            src={arrowImage}
                            className="absolute -left-3 rotate-[270deg] top-2"
                            alt="arrowImage"
                          />
                          <Grid>
                            <div className="col-span-6">
                              <p className="text-xl text-light-black font-semibold">
                                {msg?.commentBy?.firstName} {"  "}
                                {msg?.commentBy?.lastName}
                                <span className="text-[12px] pl-1">
                                  ({msg.commentBy.roles.role})
                                </span>
                              </p>
                            </div>
                            <div
                              className={` self-center flex justify-end ${msg.messageFile.originalName !== ""
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
                <div className="border bg-white flex h-full justify-center relative">
                  {previewImage ? (
                    <>
                      <div className="absolute -top-2 -right-2">
                        <img
                          src={Cross}
                          alt="Preview"
                          className="cursor-pointer "
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
                      className="self-center bg-white"
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
                  className={`block px-2.5 pb-2.5 pt-1.5 w-full text-[11px] font-semibold text-light-black bg-transparent rounded-lg border-[1px] bg-white border-gray-300 appearance-none peer resize-none focus:text-sm`}
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
                  disableFirstOption={true}
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
          className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-4 mt-[-9px] !rounded-full !bg-Granite-Gray"
        >
          <img
            src={Cross}
            className="w-full h-full text-black rounded-full p-0"
          />
        </Button>
        <div className="">
          <p className="text-center text-3xl font-semibold ">
            Edit Claim / {claimUnique}
          </p>
          {claimLoading ? (
            <div className=" h-[400px] w-full flex py-5">
              <div className="self-center mx-auto">
                <RotateLoader color="#333" />
              </div>
            </div>
          ) : (
            <form className="mt-3 mr-4" onSubmit={formik.handleSubmit}>
              <Card className="px-8 pb-4 pt-2 drop-shadow-4xl bg-white mb-5 border-[1px] border-Light-Grey rounded-3xl">
                <div className="flex justify-between">
                  <p className="pb-5 text-lg font-semibold">Repair Parts</p>
                  <p className="pb-5 text-lg font-semibold">
                    {" "}
                    Max Claim Amount : $
                    {price === undefined
                      ? parseInt(0).toLocaleString(2)
                      : formatOrderValue(price ?? parseInt(0))}
                  </p>
                </div>
                <div className="w-full h-[180px] pr-4 mb-3 pt-4 overflow-y-scroll overflow-x-hidden">
                  {formik?.values?.repairParts?.map((part, index) => {
                    return (
                      <div className="mb-5 grid grid-cols-12 gap-4">
                        <div className="col-span-2">
                          {formik?.values?.repairParts[index]?.value ? (
                            <Select
                              name={`repairParts[${index}].serviceType`}
                              label="Service Type"
                              options={serviceType1}
                              required={true}
                              className="!bg-white"
                              disabled={true} // or you can keep it as formik?.values?.repairParts[index]?.value
                              placeholder=""
                              maxLength={"30"}
                              className1="!pt-[0.4rem]"
                              value={
                                formik.values.repairParts[index].serviceType ||
                                ""
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
                            />
                          ) : (
                            <Select
                              name={`repairParts[${index}].serviceType`}
                              label="Service Type"
                              options={
                                index === 0
                                  ? serviceType.filter(
                                    (option) => option.label !== "Shipping"
                                  )
                                  : serviceType
                              }
                              required={true}
                              className="!bg-white"
                              disabled={
                                formik?.values?.repairParts[index]?.value
                              }
                              placeholder=""
                              maxLength={"30"}
                              className1="!pt-[0.4rem]"
                              value={
                                formik.values.repairParts[index].serviceType ||
                                ""
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
                            />
                          )}
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
                          <Input
                            type="text"
                            label="Description"
                            id={`description-${index}`}
                            name={`repairParts[${index}].description`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.repairParts[index].description}
                            className="!bg-white"
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
                          className={`${index > 0 ? "col-span-2" : "col-span-3"
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
                            className="!bg-white"
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
                          <div className="col-span-1 self-center bg-Smoke rounded-[4px] flex justify-center">
                            <div
                              className="flex h-full bg-Smoke justify-center cursor-pointer"
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
                  <div ref={messagesEndRef} />
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
              </Card>
              <div className="px-5 pb-5 pt-3 drop-shadow-4xl bg-white  border-[1px] border-Light-Grey  rounded-3xl">
                <div className="relative">
                  <label
                    htmlFor="description"
                    className="absolute text-base text-[#999] leading-6 duration-300 transform origin-[0] top-1 bg-white left-2 px-1 -translate-y-4 scale-75"
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
                <Button className="!bg-white !text-black mr-2" onClick={closeEdit}>
                  Cancel
                </Button>
                <Button type="submit">Update</Button>
              </div>
            </form>
          )}
        </div>
      </Modal>

      <Modal isOpen={isAttachmentsOpen} onClose={closeAttachments}>
        <div className="py-1 text-center">
          <img src={AddDealer} alt="email Image" className="mx-auto" />
          <p className="text-3xl mb-0 mt-4 font-semibold">
            Submitted
            <span className=""> Successfully </span>
          </p>
          <p className=" text-base font-medium mt-2">
            Edit Claim Successfully
          </p>
          <p className=" text-base font-medium mt-2">
            Redirecting you on Claim Page {timer} seconds.
          </p>
        </div>
      </Modal>

      <Modal isOpen={isComplete} onClose={closeComplete}>
        <div className="py-1 text-center">
          <img src={AddDealer} alt="email Image" className="mx-auto" />
          <p className="text-3xl mb-0 mt-4 font-semibold">
            Are you
            <span className=""> sure ? </span>
          </p>
          <p className="text-base font-medium mt-2">
            You want to complete this Claim ?
          </p>
          <div className="mt-3">
            <Button type="submit">Yes</Button>
            <Button className="!bg-white !text-black" onClick={closeComplete}>
              No
            </Button>
          </div>
        </div>
      </Modal>

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
        <div className="py-3">
          <p className="text-center text-3xl font-semibold ">Advance Search</p>
          <form onSubmit={formik1.handleSubmit}>
            <Grid className="mt-5 px-6">
              <div className="col-span-6">
                <Input
                  type="text"
                  name="contractId"
                  className="!bg-white"
                  label="Contract ID"
                  placeholder=""
                  {...formik1.getFieldProps("contractId")}
                />
              </div>
              <div className="col-span-6">
                <Input
                  name="claimId"
                  type="text"
                  className="!bg-white"
                  label="Claim ID"
                  placeholder=""
                  {...formik1.getFieldProps("claimId")}
                />
              </div>

              <div className="col-span-6">
                <Input
                  type="text"
                  name="orderId"
                  className="!bg-white"
                  label="Order ID"
                  placeholder=""
                  {...formik1.getFieldProps("orderId")}
                />
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  name="venderOrder"
                  className="!bg-white"
                  label="Dealer P.O. #."
                  placeholder=""
                  {...formik1.getFieldProps("venderOrder")}
                />
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  name="serial"
                  className="!bg-white"
                  label="Serial # / Device ID"
                  placeholder=""
                  {...formik1.getFieldProps("serial")}
                />
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  name="productName"
                  className="!bg-white"
                  label="Product SKU"
                  placeholder=""
                  {...formik1.getFieldProps("productName")}
                />
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  name="dealerSku"
                  className="!bg-white"
                  label="Dealer SKU"
                  placeholder=""
                  {...formik1.getFieldProps("dealerSku")}
                />
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  name="pName"
                  className="!bg-white"
                  label="Product Name"
                  placeholder=""
                  {...formik1.getFieldProps("pName")}
                />
              </div>
              {props?.flag == "" && (
                <div className="col-span-6">
                  <Input
                    type="text"
                    name="dealerName"
                    className="!bg-white"
                    label="Dealer Name"
                    placeholder=""
                    {...formik1.getFieldProps("dealerName")}
                  />
                </div>
              )}

              {window.location.pathname.includes("/customer/claimList") || props?.flag == "customer" ? '' : <div className="col-span-6">
                <Input
                  type="text"
                  name="customerName"
                  className="!bg-white"
                  label="Customer Name"
                  placeholder=""
                  {...formik1.getFieldProps("customerName")}
                />
              </div>}
              <div className="col-span-6">
                <Input
                  type="text"
                  name="servicerName"
                  className="!bg-white"
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
                  className="!bg-white"
                  onChange={handleSelectChange2}
                  value={formik1.values.claimStatus}
                />
              </div>
              {formik1.values.claimStatus == "Completed" ? (
                <div className="col-span-6">
                  <Select
                    options={claimPaid}
                    name="claimPaidStatus"
                    label="Paid Status"
                    className="!bg-white"
                    onChange={handleSelectChange2}
                    value={formik1.values.claimPaidStatus}
                  />
                </div>
              ) : (
                <>
                  <div className="col-span-6">
                    <Select
                      options={customerValue}
                      name="customerStatusValue"
                      label="Customer Status"
                      className="!bg-white"
                      onChange={handleSelectChange2}
                      value={formik1.values.customerStatusValue}
                    />
                  </div>
                  <div className="col-span-6">
                    <Select
                      options={repairValue}
                      name="repairStatus"
                      label="Repair Status"
                      className="!bg-white"
                      onChange={handleSelectChange2}
                      value={formik1.values.repairStatus}
                    />
                  </div>
                </>
              )}
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
