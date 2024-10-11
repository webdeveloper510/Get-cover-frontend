import React, { createRef, useEffect, useRef, useState } from "react";
import Headbar from "../../../common/headBar";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Select from "../../../common/select";
import Grid from "../../../common/grid";
import Input from "../../../common/input";
import {  addMonths, subDays,format, parseISO } from "date-fns";
// Media Include
import BackImage from "../../../assets/images/icons/backArrow.svg";
import Spinner from "../../../assets/images/icons/Spinner.svg";
import disapproved from "../../../assets/images/Disapproved.png";
import csvFile from "../../../assets/images/icons/csvFile.svg";
import AddDealer from "../../../assets/images/dealer-book.svg";
import Cross1 from "../../../assets/images/Cross_Button.png";
import Delete from "../../../assets/images/icons/DeleteIcon.svg";
import check from "../../../assets/images/icons/check.svg";
import Button from "../../../common/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getDealersList,
  getDealersSettingsByid,
  uploadTermsandCondition,
} from "../../../services/dealerServices";
import {
  getCustomerListByDealerIdAndResellerId,
  getServiceCoverageDetails,
} from "../../../services/customerServices";
import Dropbox from "../../../assets/images/icons/dropBox.svg";
import { getTermList } from "../../../services/priceBookService";
import RadioButton from "../../../common/radio";
import {
  addOrder,
  checkEditFileValidations,
  checkMultipleFileValidation,
  editOrder,
  fileValidation,
  getCategoryAndPriceBooks,
  getServicerListInOrders,
  getStep2Validation,
  orderDetailsById,
} from "../../../services/orderServices";
import Modal from "../../../common/model";
import {
  getResellerListOrderByDealerId,
  getResellerListOrderByDealerIdCustomerId,
} from "../../../services/reSellerServices";
import Cross from "../../../assets/images/Cross.png";
import { RotateLoader } from "react-spinners";
import SelectBoxWIthSerach from "../../../common/selectBoxWIthSerach";
import Card from "../../../common/card";
import { MultiSelect } from "react-multi-select-component";

function AddOrder() {
  const [productNameOptions, setProductNameOptions] = useState([]);
  const [dealerName, setDealerName] = useState("");
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [servicerName, setServicerName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const inputRef = useRef(null);
  const [claimOver, setClaimOver] = useState([true]);
  const [claimInCoveragePeriod, setClaimInCoveragePeriod] = useState([true]);
  const [resellerName, setResellerName] = useState("");
  const [termList, setTermList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [dealerList, setDealerList] = useState([]);
  const [servicerData, setServicerData] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [resellerList, setResllerList] = useState([]);
  const [categoryName, setCategoryName] = useState([]);
  const [priceBookName, setPriceBookName] = useState([]);
  const [dealerSkuName, setDealerSkuName] = useState([]);
  const [coverage, setCoverage] = useState([]);
  const [dealerSkuList, setDealerSkuList] = useState([]);
  const [serviceCoverage, setServiceCoverage] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [selected, setSelected] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [loading4, setLoading4] = useState(false);
  const [loading5, setLoading5] = useState(false);
  const [fileValues, setFileValues] = useState([]);
  const [timer, setTimer] = useState(3);
  const [sendNotification, setSendNotification] = useState(true);
  const [numberOfOrders, setNumberOfOrders] = useState([]);
  const [error, setError] = useState("");
  const [type, setType] = useState("Add");
  const [order, orderDetail] = useState({});
  const navigate = useNavigate();
  const { orderId, dealerId, resellerId, dealerValue, customerId } =
    useParams();
  const location = useLocation();

  const period = [
    { label: "Monthly", value: "Monthly" },
    { label: "Annually", value: "Annually" },
  ];
  const optiondeductibles = [
    { label: "$", value: "amount" },
    { label: "%", value: "percentage" },
  ];
  const downloadCSVTemplate = async () => {
    window.open(
      "https://docs.google.com/spreadsheets/d/1IKZGYxlL4Bo3ifJsDR2QCqmVcwq5XwOQ/edit?pli=1&gid=1553032734#gid=1553032734",
      "_blank"
    );
  };
 
  useEffect(() => {
    if (orderId || dealerId || resellerId || dealerValue || customerId) {
      setLoading(true);
      getDealerSettingsDetails(dealerId != undefined ? dealerId : dealerValue);
      const timer = setTimeout(() => {}, 3000);

      return () => clearTimeout(timer);
    }
  }, [orderId, dealerId, resellerId, dealerValue, customerId]);

  const handleRemoveFile = () => {
    if (inputRef) {
      formikStep2.setFieldValue("termCondition", null);
      setSelectedFile2(null);
    }
  };

  const handleAddFile = () => {
    if (inputRef) {
      inputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const maxSize = 10048576; 

    if (file?.size > maxSize) {
      formikStep2.setFieldError(
        "termCondition",
        "File is too large. Please upload a file smaller than 10MB."
      );
      console.log("Selected file:", file);
    } else {
      setSelectedFile2(file);
      const formData = new FormData();
      formData.append("file", file);
      const result = uploadTermsandCondition(formData).then((res) => {
        console.log(result);
        formikStep2.setFieldValue("termCondition", {
          fileName: res?.file?.filename,
          name: res?.file?.originalname,
          size: res?.file?.size,
        });
      });
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

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setError("");
    setCurrentStep(currentStep - 1);
  };

  const getTermListData = async () => {
    try {
      const res = await getTermList();
    } catch (error) {
      console.error("Error fetching category list:", error);
    }
  };

  const getDealerListData = async () => {
    setLoading1(true);
    try {
      const result = await getDealersList();

      let arr = [];
      const filteredDealers = result?.data?.filter(
        (data) => data.dealerData.accountStatus === true
      );
      filteredDealers?.map((res) => {
        arr.push({
          label: res.dealerData.name,
          value: res.dealerData._id,
        });
      });
      setDealerList(arr);
      setLoading1(false);
    } catch (error) {
      console.error("Error while getting dealer list data:", error);
      setLoading1(false);
    }
  };

  const handleGOBack = () => {
    navigate(-1);
  };

  const getServicerList = async (data) => {
    setLoading1(true);
    try {
      let arr = [];

      const result = await getServicerListInOrders(data);

      const filteredServicers = result.result;
      filteredServicers?.map((res) => {
        arr.push({
          label: res.name,
          value: res._id,
        });
      });

      setServicerData(arr);
      const isResellerIdEmpty = data?.resellerId == "";

      if (!isResellerIdEmpty && formik.values.servicerId) {
        const matchedServicer = filteredServicers.find(
          (res) => res._id === formik.values.servicerId
        );

        formik.setFieldValue(
          "servicerId",
          matchedServicer ? matchedServicer._id : ""
        );
      }
      setLoading1(false);
    } catch (error) {
      console.error("Error while getting servicer list:", error);

      setLoading1(false);
    } finally {
      console.log(orderId);
      if (orderId == undefined) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    let intervalId;
    if (isModalOpen && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0) {
      closeModal();
      if (customerId) {
        navigate(`/customerDetails/${customerId}`);
      } else if (resellerId) {
        navigate(`/resellerDetails/${resellerId}`);
      } else if (dealerId) {
        navigate(`/dealerDetails/${dealerId}`);
      } else {
        navigate("/orderList");
      }
    }
    return () => clearInterval(intervalId);
  }, [isModalOpen, timer]);

  const getCustomerList = async (data) => {
    let arr = [];
    const resellerId = data?.resellerId == null ? "" : data.resellerId;
    const result = await getCustomerListByDealerIdAndResellerId({
      ...data,
      resellerId: resellerId,
    });

    result?.result?.map((res) => {
      arr.push({
        label: res?.username,
        value: res?._id,
        customerData: res,
        emailKey: res?.email,
      });
    });
    setCustomerList(arr);
  };

  const getResellerList = async (dealerId) => {
    let arr = [];
    const result = await getResellerListOrderByDealerId({ dealerId });
    result?.result?.map((res) => {
      arr.push({
        label: res.resellerData.name,
        value: res.resellerData._id,
      });
    });
    setResllerList(arr);
  };

  const getResellerListByDealerCustomerId = async (
    dealerid,
    customerid,
    resellerId
  ) => {
    let arr = [];
    let data = {
      dealerId: dealerid,
      customerId: customerid,
    };
    const result = await getResellerListOrderByDealerIdCustomerId(data);
    result?.result?.map((res) => {
      arr.push({
        label: res.resellerData[0].name,
        value: res.resellerData[0]._id,
      });
    });
    setResllerList(arr);
    formik.setFieldValue("resellerId", resellerId);
  };

  useEffect(() => {
    if (orderId != undefined) {
      orderDetails();
      setType("Edit");
    } else {
      setType("Add");
    }
    if (dealerId && customerId == undefined) {
      formik.setFieldValue("dealerId", dealerId);
      getServiceCoverage(dealerId);
      getResellerList(dealerId);
      getCustomerList({
        dealerId: dealerId,
        resellerId: "",
      });
      getServicerList({
        dealerId: dealerId,
        resellerId: "",
      });
    }
    if (resellerId && customerId == undefined) {
      formik.setFieldValue("resellerId", resellerId);
      formik.setFieldValue("dealerId", dealerValue);
      getServiceCoverage(dealerValue);
      getResellerList(dealerValue);
      getCustomerList({
        dealerId: dealerValue,
        resellerId: resellerId,
      });
      getServicerList({
        dealerId: dealerValue,
        resellerId: resellerId,
      });
    }
    if (customerId) {
      formik.setFieldValue("resellerId", resellerId);
      formik.setFieldValue("customerId", customerId);
      formik.setFieldValue("dealerId", dealerValue);
      getResellerListByDealerCustomerId(dealerValue, customerId, resellerId);
      getServiceCoverage(dealerValue);
      getCustomerList({
        dealerId: dealerValue,
        resellerId: resellerId,
      });
      getServicerList({
        dealerId: dealerValue,
        resellerId: resellerId,
      });
    }
    getDealerListData();
    getTermListData();
  }, []);

  const getServiceCoverage = async (value, type = "Add") => {
    const result = await getServiceCoverageDetails(value);
    setCoverage(result.result.coverageType);
    let serviceCoverage = [];

    if (type === "Edit") {
      serviceCoverage = [
        { label: "Parts", value: "Parts" },
        { label: "Labor ", value: "Labor" },
        { label: "Parts & Labor ", value: "Parts & Labor" },
      ];
    } else {
      switch (result?.result?.serviceCoverageType) {
        case "Parts & Labour":
          serviceCoverage = [
            { label: "Parts", value: "Parts" },
            { label: "Labor ", value: "Labour" },
            { label: "Parts & Labor ", value: "Parts & Labour" },
          ];
          break;
        case "Labour":
          serviceCoverage = [{ label: "Labor ", value: "Labour" }];
          break;
        case "Parts":
          serviceCoverage = [{ label: "Parts", value: "Parts" }];
          break;
        default:
          serviceCoverage = [{ label: "Parts", value: "Parts" }];
          break;
      }
    }
    setServiceCoverage(serviceCoverage);
  };

  const formik4 = useFormik({
    initialValues: {
      paymentStatus: "Unpaid",
      paidAmount: 0.0,
      pendingAmount: 0.0,
    },
    validationSchema: Yup.object().shape({
      paidAmount: Yup.number().when(["paymentStatus"], {
        is: (status) => status === "PartlyPaid",
        then: (schema) =>
          schema
            .max(
              calculateTotalAmount(formikStep3.values.productsArray),
              "Paid amount cannot be more than the total amount"
            )
            .moreThan(0, "Paid amount cannot be less than One")

            .required("Paid Amount is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),

    onSubmit: (values) => {
      setLoading2(true);
      const arr = [];
      formikStep3.values.productsArray.map((res, index) => {
        arr.push(res.file);
      });
      const totalAmount = calculateTotalAmount(
        formikStep3.values.productsArray
      );

      const data = {
        ...formik.values,
        ...formikStep2.values,
        ...formikStep3.values,
        paidAmount: parseFloat(values.paidAmount),
        file: arr,
        dueAmount: parseFloat(values.pendingAmount),
        sendNotification: sendNotification,
        paymentStatus: values.paymentStatus,
        orderAmount: parseFloat(totalAmount),
      };

      if (orderId != undefined) {
        editOrder(orderId, data).then((res) => {
          if (res.code == 200) {
            setLoading2(false);
            openModal();
          } else {
            setLoading2(false);
            setError(res.message);
          }
        });
      } else {
        addOrder(data).then((res) => {
          if (res.code == 200) {
            setLoading2(false);
            openModal();
          } else {
            setLoading2(false);

            setError(res.message);
          }
        });
      }
    },
  });

  const orderDetails = async () => {
    setLoading(true);

    try {
      const result = await orderDetailsById(orderId);

      if (result && result.result) {
        getServiceCoverage(result.result.dealerId, "Edit");
        const {
          dealerId,
          resellerId,
          servicerId,
          billDetail,
          productsArray,
          venderOrder,
          serviceCoverageType,
          orderAmount,
          paidAmount,
          coverageType,
          paymentStatus,
          termCondition,
        } = result.result;
        setSelected(result.result.coverageType);
        getResellerList(dealerId);
        getServiceCoverage(dealerId, "Edit");
        getCustomerList({ dealerId, resellerId });
        getServicerList({ dealerId, resellerId });
        productsArray?.forEach((product, index) => {
          getCategoryList(
            dealerId,
            {
              priceBookId: product.priceBookId,
              priceCatId: product.categoryId,
              term: product.term,
              dealerSku: "", //add this
              pName: product.pName,
              coverageType: coverageType.map((item) => item.value),
            },
            index
          );

          setFileValues((prevFileValues) => {
            const newArray = [...prevFileValues];
            newArray[index] = product.orderFile.name ? product.orderFile : null;
            return newArray;
          });

          setNumberOfOrders((prevFileValues) => {
            const newArray = [...prevFileValues];
            newArray[index] = product.noOfProducts;
            return newArray;
          });
        });

        orderDetail(result.result);

        formik.setFieldValue("servicerId", servicerId);
        formik.setFieldValue("billTo", billDetail?.billTo);
        formik.setFieldValue("name", billDetail?.detail?.name);
        formik.setFieldValue("address", billDetail?.detail?.address);
        formik.setFieldValue("phoneNumber", billDetail?.detail?.phoneNumber);
        formik.setFieldValue("email", billDetail?.detail?.email);

        setClaimOver(
          productsArray?.map((product) => product?.noOfClaim?.value === -1)
        );
        setClaimInCoveragePeriod(
          productsArray?.map((product) => product?.noOfClaimPerPeriod === -1)
        );

        formikStep3.setValues({
          ...formikStep3.values,
          productsArray: productsArray?.map((product, index) => ({
            categoryId: product.categoryId || "",
            priceBookId: product.priceBookId || "",
            unitPrice: product.unitPrice || null,
            noOfProducts: product.noOfProducts || "",
            price: product.price || null,
            file: product.orderFile || "",
            coverageStartDate: product.coverageStartDate1 || "",
            coverageStartDate1: product.coverageStartDate1 || "",
            coverageEndDate: product.coverageEndDate || "",
            description: product.description || "",
            term: product.term || "",
            priceType: product.priceType || "",
            adh: product.adh || 0,
            adhDays: product?.mergedData || [],
            additionalNotes: product.additionalNotes || "",
            QuantityPricing: product.QuantityPricing || [],
            pName: product.pName || "",
            rangeStart: product.rangeStart || 0,
            rangeEnd: product.rangeEnd || 0,
            checkNumberProducts: product.checkNumberProducts || "",
            orderFile: product.orderFile || "",
            fileValue: "",
            priceBookDetails: product?.priceBookDetail || {},
            dealerSku: product.dealerSku || "",
            dealerPriceBookDetails: product?.dealerPriceBookDetail || {},
            noOfClaim: product?.noOfClaim || {},
            noOfClaimPerPeriod: product?.noOfClaimPerPeriod || 1,
            isManufacturerWarranty: product?.isManufacturerWarranty,
            isMaxClaimAmount: product?.isMaxClaimAmount,
          })),
        });

        formik.setFieldValue("resellerId", resellerId);
        formik.setFieldValue("dealerId", dealerId);
        formik.setFieldValue("customerId", result?.result?.customerId);
        formik4.setFieldValue("pendingAmount", orderAmount - paidAmount);
        formik4.setFieldError("paidAmount", "");
        formikStep2.setFieldValue("dealerPurchaseOrder", venderOrder);
        setSelectedFile2(termCondition);
        formikStep2.setFieldValue("termCondition", termCondition);
        formikStep2.setFieldValue("serviceCoverageType", serviceCoverageType);
        formikStep2.setFieldValue("coverageType", coverageType);
        formik4.setFieldValue("paymentStatus", paymentStatus);
        formik4.setFieldValue("paidAmount", paidAmount);
      } else {
        console.error("Result or result.result is undefined");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      // setLoading(false);
      console.log("Order details process completed.");
    }
  };

  useEffect(() => {
   

// Assuming you retrieved this timestamp from MongoDB
const timestampFromDB = "2032-10-08T18:30:00.000Z";

// Parse the ISO string into a Date object
const date = parseISO(timestampFromDB);

// Format to MM-DD-YYYY in the local timezone
const formattedDate = format(date, 'MM-dd-yyyy');

console.log('new date',new Date(timestampFromDB)); 
// Output will be in local time
    if (location.pathname.includes("/editOrder")) {
      // setLoading1(true);
    }
    if (location.pathname == "/addOrder") {
      setType("Add");
      setCurrentStep(1);
      formik.resetForm();
      setNumberOfOrders([]);
      setFileValues([]);
      setSelected([]); //add this
      formikStep2.resetForm();
      formikStep3.resetForm();
      formik4.resetForm();
    }
  }, [location]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  const handleRadioChange = (event) => {
    setSendNotification(event.target.value === "true");
  };

  const formik = useFormik({
    initialValues: {
      dealerId: "",
      servicerId: "",
      customerId: "",
      resellerId: "",
      billTo: "Dealer",
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
    },

    validationSchema: Yup.object().shape({
      dealerId: Yup.string().required("Dealer Name is required"),
      name: Yup.string().when("billTo", {
        is: (value) => value === "custom",
        then: (schema) =>
          schema.transform((value) => value.trim()).required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      phoneNumber: Yup.string().when("billTo", {
        is: "custom",
        then: (schema) =>
          schema
            .required("Required")
            .required("Required")
            .min(10, "Must be at least 10 characters")
            .max(10, "Must be exactly 10 characters")
            .matches(/^[0-9]+$/, "Must contain only digits"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    onSubmit: (values) => {
      nextStep();
      const findAndSetLabel = (list, id, setter) => {
        const foundItem = list.find((data) => data.value === id);
        setter(foundItem ? foundItem.label : "");
      };

      findAndSetLabel(dealerList, values.dealerId, setDealerName);
      findAndSetLabel(servicerData, values.servicerId, setServicerName);
      findAndSetLabel(customerList, values.customerId, setCustomerName);
      findAndSetLabel(resellerList, values.resellerId, setResellerName);
    },
  });

  const formikStep2 = useFormik({
    initialValues: {
      dealerPurchaseOrder: "",
      serviceCoverageType: "",
      coverageType: [],
      termCondition: selectedFile2,
    },
    validationSchema: Yup.object().shape({
      dealerPurchaseOrder: Yup.string().required(
        "Dealer Purchase Order is Required"
      ),
      serviceCoverageType: Yup.string().required(
        "Service Coverage Type is Required"
      ),
      coverageType: Yup.array().min(1, "Coverage Type is Required"),
    }),
    onSubmit: (values) => {
      console.log(values);
      let data = {
        dealerPurchaseOrder: values.dealerPurchaseOrder,
        dealerId: formik.values.dealerId,
        oldDealerPurchaseOrder: order?.venderOrder,
      };
      const result = getStep2Validation(data).then((res) => {
        if (res.code == 401) {
          formikStep2.setFieldError(
            "dealerPurchaseOrder",
            "Dealer Purchase Order Number is already Used"
          );
        } else {
          nextStep();
        }
      });
    },
  });

  const formikStep3 = useFormik({
    initialValues: {
      productsArray: [
        {
          categoryId: "",
          priceBookId: "",
          unitPrice: null,
          noOfProducts: "",
          price: null,
          file: "",
          coverageStartDate: "",
          coverageStartDate1: "",
          coverageEndDate: "",
          description: "",
          term: "",
          pName: "",
          priceType: "",
          adh: 0,
          additionalNotes: "",
          coverageEndDate: "",
          QuantityPricing: [],
          rangeStart: "",
          rangeEnd: "",
          checkNumberProducts: "",
          orderFile: {},
          fileValue: "",
          priceBookDetails: {},
          dealerPriceBookDetails: {},
          dealerSku: "",
          adhDays: [], // add this
          noOfClaimPerPeriod: -1,
          noOfClaim: {
            period: "Monthly",
            value: -1,
          },
          isManufacturerWarranty: false,
          isMaxClaimAmount: false,
        },
      ],
    },
    validationSchema: Yup.object().shape({
      productsArray: Yup.array().of(
        Yup.object().shape({
          categoryId: Yup.string().required("Required"),
          priceBookId: Yup.string().required("Required"),
          term: Yup.string().required("Required"),
          pName: Yup.string().required("Required"),
          // file: Yup.string().required("Valid File is required"),
          unitPrice: Yup.number()
            .typeError("Required")
            .required("Required")
            .nullable(),
          adhDays: Yup.array().of(
            Yup.object().shape({
              label: Yup.string(),
              waitingDays: Yup.number()
                .required("Required")
                .min(0, "Value cannot be negative")
                .nullable(),
              deductible: Yup.number()
                .required("Required")
                .min(0, "Must be at least 0")
                .when("amountType", {
                  is: (value) => value === "percentage",
                  then: () =>
                    Yup.number()
                      .max(99.99, "Cannot exceed 99.99%")
                      .test(
                        "is-decimal",
                        "Percentage must have up to 2 decimal places",
                        (value) =>
                          value === undefined ||
                          value === null ||
                          /^\d+(\.\d{1,2})?$/.test(value)
                      ),
                  otherwise: () => Yup.number().min(0, "Must be at least 0"),
                }),
            })
          ),

          noOfProducts: Yup.number()
            .typeError("Must be a number")
            .required("Required")
            .integer("value should be an integer")
            .min(0, "value cannot be negative"),
          // additionalNotes: Yup.string().required("Required"),
          QuantityPricing: Yup.array().when("priceType", {
            is: (value) => value === "Quantity Pricing",
            then: (schema) => {
              return schema
                .of(
                  Yup.object().shape({
                    value: Yup.number(),
                    enterQuantity: Yup.number()
                      .typeError("Required")
                      .required("Required")
                      .min(1, "Quantity cannot be Less Then One")
                      .integer("Quantity must be an integer")
                      .nullable(),
                  })
                )
                .required("Required");
            },
            otherwise: (schema) => schema.notRequired(),
          }),
          price: Yup.number()
            .typeError("Required")
            .required("Required")
            .nullable(),

          // coverageStartDate: Yup.date().required("Date is required")
        })
      ),
    }),
    onSubmit: (values) => {
      console.log(values);
      setLoading5(true);
      checkMultipleEmailCheck(values);
      let arr = [];
      let arr1 = [];
      let arr2 = [];
      console.log(productNameOptions);
      values.productsArray.map((data, index) => {
        const value = categoryList
          .map((val) => ({
            ...val,
            data: val.data.filter((res) => res.value === data.categoryId),
          }))
          .filter((value) => value.data.length > 0)[0].data[0];
        arr.push(value ? value.label : "");

        const value1 = productNameOptions
          .map((val) => ({
            ...val,
            data: val.data.filter((res) => res.value === data.priceBookId),
          }))
          .filter((value) => value.data.length > 0)[0].data[0];
        arr1.push(value1 ? value1.label : "");
        arr2.push(value1 ? value1.dealerSku : "");
      });

      productNameOptions.forEach((item, index) => {
        item.data.forEach((subItem) => {
          console.log(subItem, index);
          formikStep3.setFieldValue(
            `productsArray[${index}].priceBookDetails`,
            subItem.priceBookDetails
          );
          formikStep3.setFieldValue(
            `productsArray[${index}].dealerPriceBookDetails`,
            subItem.dealerPriceBookDetails
          );
        });
      });
      console.log(arr2);
      setCategoryName(arr);
      setPriceBookName(arr1);
      setDealerSkuName(arr2);
      setLoading5(false);
    },
  });

  const BillTo = [
    { label: "Dealer", value: "Dealer" },
    ...(formik.values.resellerId !== "" && formik.values.resellerId !== null
      ? [{ label: "Reseller", value: "Reseller" }]
      : []),
    { label: "Custom", value: "Custom" },
  ];

  const checkMultipleEmailCheck = (data) => {
    const formData = new FormData();
    const arr = [];
    data.productsArray.map((res, index) => {
      arr[index] = res.file;
    });

    arr.forEach((res, index) => {
      if (res === "") {
        data.productsArray[index].fileValue = false;
      } else if (res?.file?.name == " ") {
        data.productsArray[index].fileValue = false;
      } else {
        data.productsArray[index].fileValue = true;
      }
    });

    data.productsArray.map((res, index) => {
      let sumOfValues = 0;
      if (res.priceType == "Quantity Pricing") {
        res.QuantityPricing.map((data) => {
          let value = parseInt(data.enterQuantity);

          sumOfValues += value;
        });

        data.productsArray[index][`checkNumberProducts`] = sumOfValues;
      } else {
        data.productsArray[index][`checkNumberProducts`] = parseInt(
          res.noOfProducts
        );
      }
    });
    let newValues = {
      ...data,
    };
    if (type == "Edit") {
      let dataValue = {
        ...data,
      };
      checkEditFileValidations(dataValue).then((res) => {
        // order.orderAmount=calculateTotalAmount(res.productDetail.productsArray)

        if (res.code === 200) {
          const totalAmount = calculateTotalAmount(
            res.productDetail.productsArray
          );
          const amountDifference = totalAmount - order.paidAmount;
          if (amountDifference > 0 && order.paymentStatus != "Unpaid") {
            formik4.setFieldValue("paymentStatus", "PartlyPaid");
            formik4.setFieldValue("paidAmount", parseInt(order.paidAmount));
            formik4.setFieldValue(
              "pendingAmount",
              totalAmount - order.paidAmount
            );
          } else if (amountDifference <= 0 && order.paymentStatus != "Unpaid") {
            formik4.setFieldValue("paymentStatus", "Paid");
            formik4.setFieldValue("pendingAmount", "0.0");
            formik4.setFieldValue("paidAmount", totalAmount);
          }

          nextStep();
        } else {
          for (let key of res.message) {
            setIsErrorOpen(true);
            formikStep3.setFieldError(
              `productsArray[${key.key}].file`,
              key.message
            );
          }
        }
      });
    } else {
      Object.entries(newValues).forEach(([key, value]) => {
        if (key === "productsArray") {
          value.forEach((item, index) => {
            Object.entries(item).forEach(([key1, value1]) => {
              if (key1 !== "orderFile") {
                formData.append(`${key}[${index}][${key1}]`, value1);
              } else {
                formData.append(
                  `${key}[${index}][${key1}]`,
                  JSON.stringify(value1)
                );
              }
            });
            if (item.QuantityPricing && Array.isArray(item.QuantityPricing)) {
              item.QuantityPricing.forEach((qpItem, qpIndex) => {
                Object.entries(qpItem).forEach(([qpKey, qpValue]) => {
                  formData.append(
                    `${key}[${index}][QuantityPricing][${qpIndex}][${qpKey}]`,
                    qpValue
                  );
                });
              });
            }
            //add this
            if (item.adhDays && Array.isArray(item.adhDays)) {
              item.adhDays.forEach((qpItem, qpIndex) => {
                Object.entries(qpItem).forEach(([qpKey, qpValue]) => {
                  formData.append(
                    `${key}[${index}][adhDays][${qpIndex}][${qpKey}]`,
                    qpValue
                  );
                });
              });
            }
          });
        } else {
          formData.append(key, value);
        }
      });

      checkMultipleFileValidation(formData).then((res) => {
        if (res.code == 200) {
          setLoading4(false);
          nextStep();
        } else {
          for (let key of res.message) {
            setIsErrorOpen(true);
            formikStep3.setFieldError(
              `productsArray[${key.key}].file`,
              key.message
            );
          }
        }
      });
    }
  };

  const fileInputRef = useRef([]);

  const handleInputClick = (index, event) => {
    setFileValues((prevFileValues) => {
      const newArray = [...prevFileValues];
      newArray[index] = null;
      return newArray;
    });
    event.currentTarget.value = null;
    formikStep3.setFieldValue(`productsArray[${index}].file`, "");
    formikStep3.setFieldValue(`productsArray[${index}].orderFile`, {});
  };

  const handleFileSelect = (event, index) => {
    setLoading4(true);
    const file = event.target.files[0];

    setFileValues((prevFileValues) => {
      const newArray = [...prevFileValues];
      newArray[index] = null;

      return newArray;
    });
    formikStep3.setFieldValue(`productsArray[${index}].file`, {});
    formikStep3.setFieldValue(`productsArray[${index}].orderFile`, {});
    if (file) {
      setFileValues((prevFileValues) => {
        const newArray = [...prevFileValues];
        if (newArray[index]) {
          newArray[index] = file;
        } else {
          newArray[index] = file;
        }
        return newArray;
      });
      fileInputRef.current[index].current.file = file;
      checkFileError(file, index);
    } else {
      formikStep3.setFieldError(`productsArray[${index}].file`, "");
      formikStep3.setFieldValue(`productsArray[${index}].orderFile`, {});
      setFileValues((prevFileValues) => {
        const newArray = [...prevFileValues];
        newArray[index] = null;

        return newArray;
      });
    }
    setLoading4(false);
  };

  const checkFileError = async (file, index) => {
    try {
      setLoading3(true);
      formikStep3.setFieldValue(`productsArray[${index}].file`, file);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("noOfProducts", numberOfOrders[index]);
      const fileValue = await fileValidation(formData);

      if (fileValue.code !== 200) {
        formikStep3.setFieldError(
          `productsArray[${index}].file`,
          fileValue.message
        );
      } else {
        formikStep3.setFieldValue(
          `productsArray[${index}].orderFile`,
          fileValue.orderFile
        );
        formikStep3.setFieldValue(
          `productsArray[${index}].file`,
          fileValue.orderFile
        );
        formikStep3.setFieldError(`productsArray[${index}].file`, "");
      }
    } catch (error) {
      setLoading3(false);
      console.error("An error occurred while checking file:", error);
    } finally {
      setLoading3(false);
    }
  };

  const calculateTotalAmount = (data) => {
    let totalAmount = 0;
    data?.map((product, index) => {
      totalAmount += parseFloat(product.price);
    });
    console.log(totalAmount);
    return totalAmount.toFixed(2);
  };

  const handleDateChange = (e, index) => {
    const inputValue = e.target.value;
    const selectedDate = new Date(inputValue);
    selectedDate.setDate(selectedDate.getDate());

    const gmtDate = selectedDate.toISOString();
    console.log(gmtDate,selectedDate)
    formikStep3.setFieldValue(
      `productsArray[${index}].coverageStartDate`,
      selectedDate
    );

    const termInMonths = formikStep3.values.productsArray[index].term || 0;
    const newEndDate = addMonths(selectedDate, termInMonths); 
    const adjustedEndDate = subDays(newEndDate, 1); 
    const formattedEndDate = adjustedEndDate.toISOString(); 
    
    formikStep3.setFieldValue(
      `productsArray[${index}].coverageEndDate`,
      formattedEndDate
    );
  };

  const handlePaymentStatusChange = (e) => {
    const newPaymentStatus = e.target.value;
    if (newPaymentStatus === "Unpaid") {
      formik4.setFieldValue("paidAmount", 0.0);
      formik4.setFieldValue(
        "pendingAmount",
        calculateTotalAmount(formikStep3.values.productsArray)
      );
    } else if (newPaymentStatus === "Paid") {
      if (type === "Edit") {
        order.dueAmount == 0
          ? formik4.setFieldValue("paidAmount", order.orderAmount)
          : formik4.setFieldValue("paidAmount", order.dueAmount);
        formik4.setFieldValue("pendingAmount", 0.0);
      } else {
        formik4.setFieldValue(
          "paidAmount",
          calculateTotalAmount(formikStep3.values.productsArray)
        );
        formik4.setFieldValue("pendingAmount", 0.0);
      }

      //
    } else if (newPaymentStatus === "PartlyPaid") {
      // if(!order.paidAmount<=0){

      if (type === "Edit") {
        const pendingAmount =
          calculateTotalAmount(formikStep3.values.productsArray) -
          order.paidAmount;
        formik4.setFieldError("paidAmount", "");
        formik4.setFieldValue("paidAmount", order.paidAmount);
        formik4.setFieldValue("pendingAmount", pendingAmount);
      } else {
        formik4.setFieldValue("paidAmount", 0);
        formik4.setFieldError("paidAmount", "");
        formik4.setFieldValue(
          "pendingAmount",
          calculateTotalAmount(formikStep3.values.productsArray)
        );
      }
    }
  };

  useEffect(() => {
    fileInputRef.current = Array.from(
      { length: formikStep3?.values?.productsArray?.length },
      () => createRef()
    );
  }, [formikStep3?.values?.productsArray?.length]);

  const handleDropdownClick = (index) => {
    if (fileInputRef.current[index]) {
      fileInputRef.current[index].current.click();
    }
  };

  const handleAddProduct = () => {
    const productsArray = {
      categoryId: "",
      priceBookId: "",
      unitPrice: null,
      noOfProducts: "",
      price: null,
      file: "",
      coverageStartDate: "",
      coverageStartDate1: "",
      coverageEndDate: "",
      description: "",
      term: "",
      priceType: "",
      additionalNotes: "",
      QuantityPricing: [],
      pName: "",
      rangeStart: "",
      rangeEnd: "",
      checkNumberProducts: "",
      orderFile: {},
      fileValue: "",
      dealerSku: "",
      adhDays: [],
      noOfClaimPerPeriod: -1,
      noOfClaim: {},
      isManufacturerWarranty: false,
      isMaxClaimAmount: false,
    };
    getCategoryList(
      formik.values.dealerId,
      {
        priceBookId: "",
        priceCatId: "",
        pName: "",
        term: "",
        dealerSku: "",
        coverageType: formikStep2?.values?.coverageType.map(
          (item) => item.value
        ),
      },
      formikStep3.values.productsArray.length
    );

    formikStep3.setFieldValue("productsArray", [
      ...formikStep3.values.productsArray,
      productsArray,
    ]);
  };

  const handleDeleteProduct = (index) => {
    handleInputClickReset(index);
    const updatedProduct = [...formikStep3.values.productsArray];
    console.log(formikStep3.values.productsArray.splice(index, 1));
    updatedProduct.splice(index, 1);
    formikStep3.setFieldValue("productsArray", updatedProduct);
    setFileValues((prevFileValues) => {
      const newArray = [...prevFileValues];
      newArray[index] = null;

      return newArray;
    });

   
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeError = () => {
    setIsErrorOpen(false);
  };

 const handleSelectChange2 = async (name, selectedValue) => {
  const match = name.match(/\[(\d+)\]/);
  if (!match) {
    return;
  }

  const productIndex = match[1];

  const clearProductFields = () => {
    const fieldsToClear = {
      priceBookId: "",
      term: "",
      price: "",
      pName: "",
      noOfProducts: "",
      dealerSku: "",
      unitPrice: "",
      description: "",
      rangeEnd: "",
      rangeStart: "",
      priceType: "",
      adh: "",
      adhDays:[]
    };
    Object.keys(fieldsToClear).forEach((field) => {
      formikStep3.setFieldValue(`productsArray[${productIndex}].${field}`, fieldsToClear[field]);
    });
  };

  const updateQuantityPricing = (quantityPriceDetail) => {
    return quantityPriceDetail.map((item) => ({
      ...item,
      enterQuantity: "",
    }));
  };
  const updateProductFields = (selectedValue) => {
    const productData = productNameOptions[productIndex]?.data.find(
      (value) => value.value === selectedValue
    );
    console.log(productData)
    const dealerSkuData = dealerSkuList[productIndex]?.data.find(
      (value) => value.priceBookId === selectedValue
    );

    if (dealerSkuData) {
      setClaimOver((prevState) => {
        const newClaimOver = [...prevState];
        newClaimOver[productIndex] = dealerSkuData.noOfClaim?.value === -1;
        return newClaimOver;
      });
      setClaimInCoveragePeriod((prevState) => {
        const newClaimInCoveragePeriod = [...prevState];
        newClaimInCoveragePeriod[productIndex] =
          dealerSkuData.noOfClaimPerPeriod === -1;
        return newClaimInCoveragePeriod;
      });

      formikStep3.setFieldValue(`productsArray[${productIndex}].noOfClaim`, dealerSkuData.noOfClaim);
      formikStep3.setFieldValue(`productsArray[${productIndex}].noOfClaimPerPeriod`, dealerSkuData.noOfClaimPerPeriod);
      formikStep3.setFieldValue(`productsArray[${productIndex}].isManufacturerWarranty`, dealerSkuData.isManufacturerWarranty);
      formikStep3.setFieldValue(`productsArray[${productIndex}].isMaxClaimAmount`, dealerSkuData.isMaxClaimAmount);
    }

    if (productData) {
      const updatedQuantityPricing = updateQuantityPricing(productData.quantityPriceDetail);
      formikStep3.setFieldValue(`productsArray[${productIndex}].QuantityPricing`, updatedQuantityPricing);
      formikStep3.setFieldValue(`productsArray[${productIndex}].dealerSku`, productData.dealerSku);
      formikStep3.setFieldValue(`productsArray[${productIndex}].price`, productData.price);
      formikStep3.setFieldValue(`productsArray[${productIndex}].priceType`, productData.priceType);
      formikStep3.setFieldValue(`productsArray[${productIndex}].adh`, productData.adh);
      formikStep3.setFieldValue(`productsArray[${productIndex}].description`, productData.description);
      formikStep3.setFieldValue(`productsArray[${productIndex}].rangeEnd`, productData.rangeEnd);
      formikStep3.setFieldValue(`productsArray[${productIndex}].rangeStart`, productData.rangeStart);
      formikStep3.setFieldValue(`productsArray[${productIndex}].unitPrice`, productData.wholesalePrice);
      formikStep3.setFieldValue(`productsArray[${productIndex}].term`, productData.term);
      formikStep3.setFieldValue(`productsArray[${productIndex}].pName`, productData.pName);
    }
  };

  if (name.includes("categoryId")) {
    clearProductFields();
    formikStep3.setFieldValue(`productsArray[${productIndex}].categoryId`, selectedValue);
    await getCategoryList(
      formik.values.dealerId,
      {
        priceCatId: selectedValue,
        pName: "",
        term: "",
        priceBookId: "",
        dealerSku: "", // add this
        coverageType: formikStep2?.values?.coverageType.map((item) => item.value),
      },
      productIndex
    );
  } else if (name.includes("priceBookId")) {
 clearProductFields();
  const priceBookData=  await getCategoryList(
      formik.values.dealerId,
      {
        priceCatId: formikStep3.values.productsArray[productIndex].categoryId,
        priceBookId: selectedValue,
        dealerSku: "", // add this
        pName: selectedValue ? formikStep3.values.productsArray[productIndex].pName : "",
        term: selectedValue ? formikStep3.values.productsArray[productIndex].term : "",
        coverageType: formikStep2?.values?.coverageType.map((item) => item.value),
      },
      productIndex
    );
    formikStep3.setFieldValue(`productsArray[${productIndex}].adhDays`,priceBookData.result.mergedData);
    updateProductFields(selectedValue);
  } else if (name.includes("dealerSku")) {
    clearProductFields();
    const data = dealerSkuList[productIndex]?.data.find(
      (value) => value.value === selectedValue
    );
    handleSelectChange2(
      `productsArray[${productIndex}].priceBookId`,
      data ? data.priceBookId : ""
    );
  } else if (name.includes("term")) {
    await getCategoryList(
      formik.values.dealerId,
      {
        priceCatId: formikStep3.values.productsArray[productIndex].categoryId,
        dealerSku: "", // add this
        priceBookId: formikStep3.values.productsArray[productIndex].priceBookId,
        pName: formikStep3.values.productsArray[productIndex].pName || "",
        term: selectedValue,
        coverageType: formikStep2?.values?.coverageType.map((item) => item.value),
      },
      productIndex
    );
  } else if (name.includes("pName")) {
    await getCategoryList(
      formik.values.dealerId,
      {
        priceCatId: formikStep3.values.productsArray[productIndex].categoryId,
        dealerSku: "", // add this
        priceBookId: formikStep3.values.productsArray[productIndex].priceBookId,
        pName: selectedValue,
        term: formikStep3.values.productsArray[productIndex].term,
        coverageType: formikStep2?.values?.coverageType.map((item) => item.value),
      },
      productIndex
    );
  }
  const data = dealerSkuList[productIndex]?.data.find(
    (value) => value.value === selectedValue
  );
  console.log(selectedValue,dealerSkuList)
  formikStep3.setFieldValue(name, selectedValue);
};

  useEffect(() => {
    for (let i = 0; i < formikStep3?.values?.productsArray?.length; i++) {
      if (
        formikStep3.values.productsArray[i].priceType === "Quantity Pricing"
      ) {
        let maxRoundedValue = 0;

        for (
          let j = 0;
          j < formikStep3.values.productsArray[i].QuantityPricing.length;
          j++
        ) {
          const enteredValue =
            formikStep3.values.productsArray[i].QuantityPricing[j]
              .enterQuantity;
          const quantity =
            formikStep3.values.productsArray[i].QuantityPricing[j].quantity;
          const data = parseFloat(enteredValue / quantity);
          const roundedValue = Math.max(1, Math.ceil(data));
          if (roundedValue > maxRoundedValue) {
            maxRoundedValue = roundedValue;
          }
        }
        const unitPrice = parseFloat(
          formikStep3.values.productsArray[i].unitPrice
        );
        setNumberOfOrders((prevFileValues) => {
          const newArray = [...prevFileValues];
          newArray[i] = maxRoundedValue;

          return newArray;
        });
        formikStep3.setFieldValue(
          `productsArray[${i}].price`,
          (unitPrice.toFixed(2) * maxRoundedValue).toFixed(2)
        );
        formikStep3.setFieldValue(
          `productsArray[${i}].noOfProducts`,
          maxRoundedValue
        );
      }
    }
  }, [formikStep3.values.productsArray]);

  const handleSelectChange1 = (name, value) => {
    formikStep2.setFieldValue(name, value);
    if (name == "coverageType") {
      getCategoryList(
        formik.values.dealerId,
        {
          priceBookId: "",
          priceCatId: "",
          pName: "",
          term: "",
          dealerSku: "", //add this
          coverageType: value.map((item) => item.value),
        },
        0
      );
      formikStep3.resetForm();
    }
  };
 
  const getDealerSettingsDetails = async (dealerId) => {
    const res = await getDealersSettingsByid(dealerId);
    console.log(res.result[0]);
    setSelectedFile2(
      res.result[0].termCondition.fileName === ""
        ? null
        : res.result[0].termCondition
    );
    formikStep2.setFieldValue(
      "termCondition",
      res.result[0].termCondition.fileName === ""
        ? null
        : res.result[0].termCondition
    );
  };

  const handleSelectChange = (name, value) => {
    formik.handleChange({ target: { name, value } });

    if (name == "dealerId") {
      getDealerSettingsDetails(value);
      setProductNameOptions([]);
      formikStep3.resetForm();
      setFileValues([]);
      formik.setFieldValue("servicerId", "");
      formik.setFieldValue("customerId", "");
      formik.setFieldValue("resellerId", "");
      formik.setFieldValue("dealerId", value);
      setSelected([]); //add this
      formikStep2.resetForm();
      let data = {
        dealerId: value,
        resellerId: formik.values.resellerId,
      };
      getServicerList(data);
      getServiceCoverage(value);
      getCustomerList({
        dealerId: value,
        resellerId: formik.values.resellerId,
      });
      getResellerList(value);
      getCategoryList(
        value,
        {
          priceBookId: "",
          dealerSku: "", //add this
          priceCatId: "",
          pName: "",
          term: "",
          coverageType: formikStep2?.values?.coverageType.map(
            (item) => item.value
          ),
        },
        0
      );
    }
    if (name == "resellerId") {
      if (value == "") {
        formik.setFieldValue("billTo", "Dealer");
      }
      getCustomerList({
        dealerId: formik.values.dealerId,
        resellerId: value,
      });
      formik.setFieldValue("customerId", "");
      let data = {
        dealerId: formik.values.dealerId,
        resellerId: value,
      };
      getServicerList(data);
    }

    if (name == "customerId") {
      let data = {
        dealerId: formik.values.dealerId,
        resellerId: formik.values.resellerId,
      };

      customerList.length &&
        customerList.find((res) => {
          if (res.value == value) {
            if (res.customerData.resellerStatus != false)
           {
            formik.setFieldValue("resellerId", res.customerData.resellerId);
            let data = {
              dealerId: formik.values.dealerId,
              resellerId: res.customerData.resellerId,
            };
            getServicerList(data);
            getCustomerList(data);
           }
          }
        });

      let customerEmail = null;
      customerList.forEach((customer) => {
        if (customer.customerData._id === formik.values.customerId) {
          customerEmail = customer.customerData.email;
        }
      });

      setCustomerEmail(customerEmail);
    }

    if (value === "Custom") {
      formik.setFieldValue("name", "");
      formik.setFieldValue("email", "");
      formik.setFieldValue("phoneNumber", "");
      formik.setFieldValue("address", "");
    }
  };

  const getCategoryList = async (value, data, index) => {
    try {
      setLoading3(true);

      const result = await getCategoryAndPriceBooks(value, data);
      if (data.priceBookId !== "" && data.priceCatId === "") {
        console.log("result.result", result.result);
        formikStep3.setFieldValue(
          `productsArray[${index}].categoryId`,
          result.result.selectedCategory._id
        );

        getCategoryList(
          formik.values?.dealerId,
          {
            priceBookId: data.priceBookId,
            priceCatId: result.result.selectedCategory._id,
            coverageType: formikStep2?.values?.coverageType.map(
              (item) => item.value
            ),
            term: data.term,
            pName: data.pName,
            dealerSku: "", //add this
          },
          index
        );
      }

      if (formikStep3.values.productsArray.length !== 0) {
        const updateOptions = (stateSetter, data) => {
          stateSetter((prevOptions) => {
            const newOptions = [...prevOptions];
            newOptions[index] = { data };
            return newOptions;
          });
        };

        const priceBookDetails = result?.result?.priceBookDetail;
        const dealerPriceBookDetails = result?.result?.dealerPriceBookDetail;
        console.log("result.result?.priceBooks", result.result?.mergedData);
        const priceBooksData = result.result?.priceBooks.map((item) => ({
          label: item.name,
          value: item._id,
          description: item.description,
          term: item.term,
          priceType: item.priceType,
          adh: item.adh,
          quantityPriceDetail: item.quantityPriceDetail,
          wholesalePrice: item?.retailPrice?.toFixed(2),
          status: item.status,
          pName: item.pName,
          rangeStart: item?.rangeStart?.toFixed(2),
          rangeEnd: item?.rangeEnd?.toFixed(2),
          priceBookDetails: priceBookDetails,
          dealerPriceBookDetails: dealerPriceBookDetails,
          dealerSku: item.dealerSku, // add this
          adhDays: result.result?.mergedData, // add this
        }));

        const category = result.result?.priceCategories.map((item) => ({
          label: item.name,
          value: item._id,
        }));
        const termsData = result.result?.terms.map((item) => ({
          label: item.label,
          value: item.value,
        }));

        const productListData = result.result?.productName.map((item) => ({
          label: item.pName,
          value: item.pName,
        }));
        const dealerSkuListData = result.result?.dealerPriceBook.map(
          (item) => ({
            label: item.dealerSku,
            value: item.dealerSku,
            priceBookId: item.priceBook,
            adhDays: result?.result?.mergedData,
            isManufacturerWarranty: item.isManufacturerWarranty,
            isMaxClaimAmount: item.isMaxClaimAmount,
            noOfClaim: item.noOfClaim,
            noOfClaimPerPeriod: item.noOfClaimPerPeriod,
          })
        );

        updateOptions(setCategoryList, category);
        updateOptions(setDealerSkuList, dealerSkuListData);
        updateOptions(setProductNameOptions, priceBooksData);
        updateOptions(setTermList, termsData);
        updateOptions(setProductList, productListData);
        return result
      }
    } catch (error) {
      setLoading3(false);
      setLoading(false);
    } finally {
      setLoading3(false);
      setLoading(false);
    }
  };

  const handleInputClickResetStep1 = () => {
    const currentValues = formik.values;
    const newValues = { ...formik.initialValues };
    if (
      (dealerId && dealerValue) ||
      window.location.pathname.includes("/editOrder")
    ) {
      console.log("formik.values", formik.values);
      newValues.dealerId = currentValues.dealerId;
    } else if (resellerId) {
      Object.assign(newValues, {
        dealerId: currentValues.dealerId,
        dealerValue: currentValues.dealerValue,
        resellerId: currentValues.resellerId,
      });
    } else if (customerId) {
      Object.assign(newValues, {
        dealerId: currentValues.dealerId,
        dealerValue: currentValues.dealerValue,
        resellerId: currentValues.resellerId,
        customerId: currentValues.customerId,
      });
    } else {
      setCustomerList([]);
      setResllerList([]);
      setServicerData([]);
    }
    formik.resetForm({ values: newValues });
  };

  const handleInputClickReset = (index) => {
    const updatedProductsArray = formikStep3.values.productsArray.map(
      (product, i) => i === index ? {
        ...product,
        coverageStartDate: "",
        coverageStartDate1: "",
        coverageEndDate: "",
        unitPrice: 0,
        price: 0,
        ...Object.fromEntries(Object.keys(product).map(key => [
          key,
          Array.isArray(product[key]) ? [] : (typeof product[key] === "object" && product[key] !== null ? {} : "")
        ]))
      } : product
    );
  
    formikStep3.setFieldValue("productsArray", updatedProductsArray);
  
    const fieldsToReset = ["priceBookId", "categoryId", "term", "dealerSku", "pName", "noOfProducts"];
    fieldsToReset.forEach(field => {
      formikStep3.setFieldTouched(`productsArray[${index}].${field}`, false, false);
      formikStep3.setFieldError(`productsArray[${index}].${field}`, "");
    });
  
    getCategoryList(
      formik.values.dealerId,
      {
        priceBookId: "",
        priceCatId: "",
        pName: "",
        term: "",
        dealerSku: "",
        coverageType: formikStep2?.values?.coverageType.map(item => item.value),
      },
      index
    );
  };
  
  const calculatePendingAmount = (paidAmount) => {
    const totalAmount = calculateTotalAmount(formikStep3.values.productsArray);

    const pendingAmount = totalAmount - parseFloat(paidAmount || 0);
    formik4.setFieldValue("pendingAmount", pendingAmount.toFixed(2));
  };

  const renderStep1 = () => {
    return (
      <>
        {loading ? (
          <div className=" h-[400px] w-full flex py-5">
            <div className="self-center mx-auto">
              <RotateLoader color="#333" />
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={formik.handleSubmit}>
              <Card className="px-8 pb-8 pt-4 mb-8 drop-shadow-4xl border-[1px] border-Light-Grey  rounded-xl">
                <Grid>
                  <div className="col-span-8">
                    <div className="flex justify-between w-full">
                      <p className="text-2xl font-bold mb-4">Order Details</p>
                      <Button
                        className="text-sm !py-0 h-[30px] self-center !bg-[transparent] !text-light-black !font-semibold !border-light-black !border-[1px]"
                        onClick={handleInputClickResetStep1}
                      >
                        Reset
                      </Button>
                    </div>
                    <Grid>
                      <div className="col-span-4">
                        <SelectBoxWIthSerach
                          label="Dealer Name"
                          name="dealerId"
                          required={true}
                          className={`${
                            orderId ||
                            dealerId ||
                            resellerId ||
                            dealerValue ||
                            customerId
                              ? "!bg-gradient-to-t from-[#f2f2f2] to-white"
                              : "!bg-white"
                          }`}
                          onChange={handleSelectChange}
                          value={formik.values?.dealerId}
                          onBlur={formik.handleBlur}
                          isDisabled={
                            orderId ||
                            dealerId ||
                            resellerId ||
                            dealerValue ||
                            customerId
                          }
                          error={
                            formik.touched.dealerId && formik.errors.dealerId
                          }
                          options={dealerList}
                        />

                        {formik.touched.dealerId && formik.errors.dealerId && (
                          <div className="text-red-500 text-sm pl-2 pt-2">
                            {formik.errors.dealerId}
                          </div>
                        )}
                      </div>
                      <div className="col-span-4">
                        <SelectBoxWIthSerach
                          label="Reseller Name"
                          name="resellerId"
                          placeholder=""
                          className={`${
                            resellerId
                              ? "!bg-gradient-to-t from-[#f2f2f2] to-white"
                              : "!bg-white"
                          }`}
                          isDisabled={resellerId || customerId}
                          onChange={handleSelectChange}
                          options={resellerList}
                          value={
                            resellerList.length == 0
                              ? ""
                              : formik.values?.resellerId
                          }
                          onBlur={formik.handleBlur}
                        />
                      </div>
                      <div className="col-span-4">
                        <SelectBoxWIthSerach
                          label="Servicer Name"
                          name="servicerId"
                          placeholder=""
                          className={`!bg-white`}
                          onChange={handleSelectChange}
                          options={servicerData}
                          value={
                            servicerData.length == 0
                              ? ""
                              : formik.values.servicerId
                          }
                          onBlur={formik.handleBlur}
                        />
                      </div>
                      <div className="col-span-8">
                        <SelectBoxWIthSerach
                          label="Customer Name"
                          name="customerId"
                          placeholder=""
                          className={`${
                            customerId
                              ? "!bg-gradient-to-t from-[#f2f2f2] to-white"
                              : "!bg-white"
                          }`}
                          isDisabled={customerId}
                          onChange={handleSelectChange}
                          options={customerList}
                          value={
                            customerList.length == 0
                              ? ""
                              : formik.values.customerId
                          }
                          onBlur={formik.handleBlur}
                        />
                        <span className="ml-3 mt-2">{}</span>
                      </div>
                      <div className="col-span-4">
                        <SelectBoxWIthSerach
                          label="Bill Address"
                          name="billTo"
                          placeholder=""
                          disableFirstOption={true}
                          className={`!bg-white`}
                          onChange={handleSelectChange}
                          options={BillTo}
                          value={formik.values.billTo}
                          onBlur={formik.handleBlur}
                        />
                      </div>
                    </Grid>
                  </div>
                </Grid>
                {formik.values.billTo === "Custom" && (
                  <div>
                    <p className="text-2xl font-bold mb-4">Bill Details : </p>
                    <Grid>
                      <div className="col-span-4">
                        <Input
                          type="text"
                          name="name"
                          className="!bg-white"
                          label="Name"
                          required={true}
                          placeholder=""
                          value={formik.values.name}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          error={formik.touched.name && formik.errors.name}
                        />
                        {formik.touched.name && formik.errors.name && (
                          <div className="text-red-500 text-sm pl-2 pt-2">
                            {formik.errors.name}
                          </div>
                        )}
                      </div>

                      <div className="col-span-4">
                        <Input
                          type="email"
                          name="email"
                          className="!bg-white"
                          label="Email"
                          // required={true}
                          placeholder=""
                          value={formik.values.email}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          error={formik.touched.email && formik.errors.email}
                        />
                      </div>
                      <div className="col-span-4">
                        <Input
                          type="tel"
                          name="phoneNumber"
                          label="Phone"
                          className="!bg-white"
                          placeholder=""
                          value={formik.values.phoneNumber}
                          onChange={(e) => {
                            const sanitizedValue = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                            formik.handleChange({
                              target: {
                                name: "phoneNumber",
                                value: sanitizedValue,
                              },
                            });
                          }}
                          onBlur={formik.handleBlur}
                          minLength={"10"}
                          maxLength={"10"}
                          error={
                            formik.touched.phoneNumber &&
                            formik.errors.phoneNumber
                          }
                        />
                        {formik.touched.phoneNumber &&
                          formik.errors.phoneNumber && (
                            <div className="text-red-500 text-sm pl-2 pt-2">
                              {formik.errors.phoneNumber}
                            </div>
                          )}
                      </div>

                      <div className="col-span-8">
                        <Input
                          type="text"
                          name="address"
                          className="!bg-white"
                          label="Address"
                          required={true}
                          placeholder=""
                          value={formik.values.address}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.address && formik.errors.address
                          }
                        />
                      </div>
                    </Grid>
                  </div>
                )}
              </Card>

              <div className="flex">
                {dataLoading ? (
                  <Button
                    type="button"
                    className="!bg-indigo-500 !flex"
                    disabled
                  >
                    <img src={Spinner} className="w-5 h-5 mr-2" alt="Spinner" />
                    Processing...
                  </Button>
                ) : (
                  <Button type="submit" className="mr-3" onClick={() => {}}>
                    Next
                  </Button>
                )}
              </div>
            </form>
          </>
        )}
      </>
    );
  };

  const renderStep2 = () => {
    return (
      <>
        <Card className="px-8 pb-8 pt-4 mb-8 drop-shadow-4xl border-[1px] border-Light-Grey  rounded-xl">
          <p className="text-2xl font-bold">Dealer Order Details</p>
          <Grid>
            <div className="col-span-10">
              <Grid>
                <div className="col-span-6">
                  <div className="col-span-12 mt-8">
                    <Input
                      type="text"
                      name="dealerPurchaseOrder"
                      className="!bg-white"
                      label="Dealer Purchase Order #"
                      required={true}
                      placeholder=""
                      maxLength={"500"}
                      value={formikStep2.values.dealerPurchaseOrder}
                      onBlur={formikStep2.handleBlur}
                      onChange={formikStep2.handleChange}
                      error={
                        formikStep2.touched.dealerPurchaseOrder &&
                        formikStep2.errors.dealerPurchaseOrder
                      }
                    />
                    {formikStep2.touched.dealerPurchaseOrder &&
                      formikStep2.errors.dealerPurchaseOrder && (
                        <div className="text-red-500 text-sm pl-2 pt-2">
                          {formikStep2.errors.dealerPurchaseOrder}
                        </div>
                      )}
                  </div>
                </div>
                <div className="col-span-6 ">
                  <small className="text-neutral-grey p-10p">
                    Attachment size limit is 10 MB
                  </small>
                  <div className="relative mt-[0.6rem]">
                    <label
                      htmlFor="term"
                      className={`absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-white left-2 px-1 -translate-y-4 scale-75 `}
                    >
                      Term And Condition
                    </label>
                    <input
                      type="file"
                      name="term"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="application/pdf"
                      ref={inputRef}
                    />
                    <div
                      className={`block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer `}
                    >
                      {selectedFile2 && (
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="absolute -right-2 -top-2 mx-auto mb-3"
                        >
                          <img src={Cross1} className="w-6 h-6" alt="Dropbox" />
                        </button>
                      )}
                      {selectedFile2 ? (
                        <p className="w-full break-words">
                          {selectedFile2.name}
                        </p>
                      ) : (
                        <p
                          className="w-full cursor-pointer"
                          onClick={handleAddFile}
                        >
                          {" "}
                          Select File
                        </p>
                      )}
                    </div>
                  </div>
                  {formik.errors.termCondition && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {formik.errors.termCondition}
                    </div>
                  )}
                </div>
                <div className="col-span-6">
                  <Select
                    label="Service Coverage"
                    name="serviceCoverageType"
                    disabled={type == "Edit"}
                    placeholder=""
                    className={`${
                      type == "Edit"
                        ? "!bg-gradient-to-t from-[#f2f2f2] to-white"
                        : "!bg-white"
                    }`}
                    required={true}
                    onChange={handleSelectChange1}
                    options={serviceCoverage}
                    value={formikStep2.values.serviceCoverageType}
                    onBlur={formikStep2.handleBlur}
                    error={
                      formikStep2.touched.serviceCoverageType &&
                      formikStep2.errors.serviceCoverageType
                    }
                  />
                  {formikStep2.touched.serviceCoverageType &&
                    formikStep2.errors.serviceCoverageType && (
                      <div className="text-red-500 text-sm pl-2 pt-2">
                        {formikStep2.errors.serviceCoverageType}
                      </div>
                    )}
                </div>
                <div className="col-span-6">
                  {type === "Edit" ? (
                    <>
                      <p className="text-[12px]">Coverage Type</p>
                      <ol className="flex flex-wrap">
                        {selected.map((data) => {
                          return (
                            <li
                              key={data.label}
                              className="font-bold text-sm list-disc mx-[19px]"
                            >
                              {data.label}
                            </li>
                          );
                        })}
                      </ol>
                    </>
                  ) : (
                    <div className="relative">
                      <label
                        htmlFor="coverageType"
                        className="absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-white left-2 px-1 -translate-y-4 scale-75"
                      >
                        Coverage Type
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="block w-full text-base font-semibold bg-transparent rounded-lg border border-gray-300">
                        <MultiSelect
                          label="Coverage Type"
                          name="coverageType"
                          placeholder=""
                          className={`SearchSelect css-b62m3t-container red !border-[0px] p-[0.425rem] `}
                          required={true}
                          styles={{
                            chips: (provided) => ({
                              ...provided,
                              backgroundColor:
                                type === "Edit" ? "#e0e0e0" : "#f0ad4e", 
                              color: type === "Edit" ? "#a0a0a0" : "white", 
                            }),
                            searchBox: (provided) => ({
                              ...provided,
                              backgroundColor:
                                type === "Edit" ? "#f0f0f0" : "#f7f7f7",
                              border:
                                type === "Edit"
                                  ? "1px solid #ccc"
                                  : "1px solid #ddd",
                              cursor:
                                type === "Edit" ? "not-allowed" : "pointer",
                            }),
                            option: (provided, state) => ({
                              ...provided,
                              backgroundColor: state.isSelected
                                ? "#f0ad4e"
                                : "white",
                              color: state.isSelected ? "white" : "black",
                              "&:hover": {
                                backgroundColor:
                                  type === "Edit" ? "white" : "#f0ad4e", 
                                color: type == "Edit" ? "black" : "white",
                              },
                            }),
                          }}
                          disabled={type == "Edit"}
                          onChange={(value) => {
                            setSelected(value);
                            handleSelectChange1("coverageType", value);
                          }}
                          options={coverage}
                          value={selected}
                          onBlur={formikStep2.handleBlur}
                          error={
                            formikStep2.touched.coverageType &&
                            formikStep2.errors.coverageType
                          }
                        />
                      </div>
                      {formikStep2.touched.coverageType &&
                        formikStep2.errors.coverageType && (
                          <div className="text-red-500 text-sm pl-2 pt-2">
                            {formikStep2.errors.coverageType}
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </Grid>
            </div>
          </Grid>
        </Card>

        <div className="flex">
          <Button onClick={prevStep} className="!bg-[transparent] !text-black">
            Previous
          </Button>
          <Button onClick={formikStep2.handleSubmit}>Next</Button>
        </div>
      </>
    );
  };

  const renderStep3 = () => {
    return (
      <>
        {loading3 || loading4 || loading5 ? (
          <div className=" h-[400px] w-full flex py-5">
            <div className="self-center mx-auto">
              <RotateLoader color="#333" />
            </div>
          </div>
        ) : (
          <div className="mb-3">
            {formikStep3?.values?.productsArray.map((data, index) => (
              <Card
                key={index}
                className="px-8 pb-8 pt-4 mb-8 drop-shadow-4xl bg-white border-[1px] border-Light-Grey  rounded-xl relative"
              >
                <div className="flex justify-between w-[66%]">
                  <p className="text-2xl font-bold mb-4">Add Product</p>
                  <Button
                    className="text-sm !py-0 h-[30px] self-center !bg-[transparent] !text-light-black !font-semibold !border-light-black !border-[1px]"
                    onClick={() => {
                      handleInputClickReset(index);
                    }}
                  >
                    Reset
                  </Button>
                </div>
                <div className="absolute -right-3 -top-3 bg-gradient-to-r from-[#dbdbdb] to-[#e7e7e7] rounded-xl p-3 ">
                  {index === 0 ? (
                    <Button
                      className="text-sm !font-light"
                      onClick={handleAddProduct}
                    >
                      + Add More Product
                    </Button>
                  ) : (
                    <div
                      onClick={() => {
                        handleDeleteProduct(index);
                      }}
                    >
                      <div className="flex h-full mx-3 bg-white rounded-[30px] justify-center">
                        <img
                          src={Delete}
                          alt="Delete"
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <Grid>
                  <div className="col-span-4">
                    <Select
                      name={`productsArray[${index}].categoryId`}
                      label="Product Category"
                      options={categoryList[index]?.data}
                      required={true}
                      className="!bg-white"
                      placeholder=""
                      value={formikStep3.values.productsArray[index].categoryId}
                      onBlur={formikStep3.handleBlur}
                      onChange={handleSelectChange2}
                      index={index}
                      error={
                        formikStep3.values.productsArray &&
                        formikStep3.values.productsArray[index] &&
                        formikStep3.values.productsArray &&
                        formikStep3.values.productsArray[index] &&
                        formikStep3.values.productsArray[index].categoryId
                      }
                    />
                    {formikStep3.touched.productsArray &&
                      formikStep3.touched.productsArray[index] &&
                      formikStep3.touched.productsArray[index].categoryId && (
                        <div className="text-red-500 text-sm pl-2 pt-2">
                          {formikStep3.errors.productsArray &&
                            formikStep3.errors.productsArray[index] &&
                            formikStep3.errors.productsArray[index].categoryId}
                        </div>
                      )}
                  </div>
                  <div className="col-span-4">
                    <>
                      <Select
                        name={`productsArray[${index}].priceBookId`}
                        label="Product SKU"
                        options={productNameOptions[index]?.data}
                        required={true}
                        className="!bg-white"
                        disableFirstOption={true}
                        placeholder=""
                        disabled={
                          formikStep3.values.productsArray[index].categoryId ==
                          ""
                        }
                        value={
                          formikStep3.values.productsArray[index].priceBookId
                        }
                        onBlur={formikStep3.handleBlur}
                        onChange={handleSelectChange2}
                        index={index}
                        error={
                          formikStep3.values.productsArray &&
                          formikStep3.values.productsArray[index] &&
                          formikStep3.values.productsArray &&
                          formikStep3.values.productsArray[index] &&
                          formikStep3.values.productsArray[index].priceBookId
                        }
                      />
                      {formikStep3.touched.productsArray &&
                        formikStep3.touched.productsArray[index] &&
                        formikStep3.touched.productsArray[index]
                          .priceBookId && (
                          <div className="text-red-500 text-sm pl-2 pt-2">
                            {formikStep3.errors.productsArray &&
                              formikStep3.errors.productsArray[index] &&
                              formikStep3.errors.productsArray[index]
                                .priceBookId}
                          </div>
                        )}
                    </>
                    {/* )} */}
                  </div>

                  <div className="col-span-4">
                    <>
                      <Select
                        name={`productsArray[${index}].dealerSku`}
                        label="Dealer SKU"
                        options={dealerSkuList[index]?.data}
                        required={true}
                        className="!bg-white"
                        placeholder=""
                        disableFirstOption={true}
                        disabled={
                          formikStep3.values.productsArray[index].categoryId ==
                          ""
                        }
                        value={
                          formikStep3.values.productsArray[index].dealerSku
                        }
                        onBlur={formikStep3.handleBlur}
                        onChange={handleSelectChange2}
                        index={index}
                      />
                    </>
                  </div>
                  <div className="col-span-8">
                    <Select
                      label="Product Name"
                      name={`productsArray[${index}].pName`}
                      placeholder=""
                      onChange={handleSelectChange2}
                      disableFirstOption={true}
                      disabled={
                        formikStep3.values.productsArray[index].categoryId == ""
                      }
                      className="!bg-white"
                      options={productList[index]?.data}
                      value={formikStep3.values.productsArray[index].pName}
                      onBlur={formikStep3.handleBlur}
                      index={index}
                      error={
                        formikStep3.values.productsArray &&
                        formikStep3.values.productsArray[index] &&
                        formikStep3.values.productsArray &&
                        formikStep3.values.productsArray[index] &&
                        formikStep3.values.productsArray[index].pName
                      }
                    />
                    {formikStep3.touched.productsArray &&
                      formikStep3.touched.productsArray[index] &&
                      formikStep3.touched.productsArray[index].pName && (
                        <div className="text-red-500 text-sm pl-2 pt-2">
                          {formikStep3.errors.productsArray &&
                            formikStep3.errors.productsArray[index] &&
                            formikStep3.errors.productsArray[index].pName}
                        </div>
                      )}
                  </div>
                  <div className="col-span-4">
                    <>
                      <Select
                        name={`productsArray[${index}].term`}
                        label="Terms"
                        options={termList[index]?.data}
                        required={true}
                        className="!bg-white"
                        disableFirstOption={true}
                        placeholder=""
                        disabled={
                          formikStep3.values.productsArray[index].categoryId ==
                          ""
                        }
                        value={formikStep3.values.productsArray[index].term}
                        onBlur={formikStep3.handleBlur}
                        onChange={handleSelectChange2}
                        index={index}
                        error={
                          formikStep3.values.productsArray &&
                          formikStep3.values.productsArray[index] &&
                          formikStep3.values.productsArray &&
                          formikStep3.values.productsArray[index] &&
                          formikStep3.values.productsArray[index].term
                        }
                      />
                      {formikStep3.touched.productsArray &&
                        formikStep3.touched.productsArray[index] &&
                        formikStep3.touched.productsArray[index].term && (
                          <div className="text-red-500 text-sm pl-2 pt-2">
                            {formikStep3.errors.productsArray &&
                              formikStep3.errors.productsArray[index] &&
                              formikStep3.errors.productsArray[index].term}
                          </div>
                        )}
                    </>
                  </div>
                  <div className="col-span-8 border-r pr-5">
                    <Grid>
                      <div className="col-span-4">
                        <Input
                          type="text"
                          name={`productsArray[${index}].unitPrice`}
                          className="!bg-white"
                          label="Unit Price($)"
                          placeholder=""
                          value={
                            formikStep3.values.productsArray[index].unitPrice
                          }
                          onChange={formikStep3.handleChange}
                          onBlur={formikStep3.handleBlur}
                          disabled={true}
                          onWheelCapture={(e) => {
                            e.preventDefault();
                          }}
                        />
                      </div>
                      <div className="col-span-4">
                        <Input
                          type="number"
                          name={`productsArray[${index}].noOfProducts`}
                          className="!bg-white"
                          label="# of Products"
                          required={true}
                          placeholder=""
                          disabled={
                            formikStep3.values.productsArray[index]
                              .priceType !== "Quantity Pricing"
                              ? false
                              : true
                          }
                          value={
                            formikStep3.values.productsArray[index].noOfProducts
                          }
                          onChange={(e) => {
                            const unitPrice =
                              formikStep3.values.productsArray[index].unitPrice;
                            const enteredValue = parseFloat(e.target.value);
                            const calculatedPrice = unitPrice * enteredValue;
                            setNumberOfOrders((prevFileValues) => {
                              const newArray = [...prevFileValues];
                              newArray[index] = enteredValue;

                              return newArray;
                            });
                            formikStep3.setFieldValue(
                              `productsArray[${index}].price`,
                              calculatedPrice.toFixed(2)
                            );
                            formikStep3.handleChange(e);
                          }}
                          onBlur={formikStep3.handleBlur}
                          onWheelCapture={(e) => {
                            e.preventDefault();
                          }}
                          error={
                            formikStep3.values.productsArray &&
                            formikStep3.values.productsArray[index] &&
                            formikStep3.values.productsArray &&
                            formikStep3.values.productsArray[index] &&
                            formikStep3.values.productsArray[index].noOfProducts
                          }
                        />
                        {formikStep3.touched.productsArray &&
                          formikStep3.touched.productsArray[index] &&
                          formikStep3.touched.productsArray[index]
                            .noOfProducts && (
                            <div className="text-red-500 text-sm pl-2 pt-2">
                              {formikStep3.errors.productsArray &&
                                formikStep3.errors.productsArray[index] &&
                                formikStep3.errors.productsArray[index]
                                  .noOfProducts}
                            </div>
                          )}
                      </div>
                      <div className="col-span-4">
                        <Input
                          type="number"
                          name={`productsArray[${index}].price`}
                          className="!bg-white"
                          label="Price($)"
                          placeholder=""
                          value={formikStep3.values.productsArray[index].price}
                          onChange={formikStep3.handleChange}
                          onBlur={formikStep3.handleBlur}
                          disabled={true}
                          onWheelCapture={(e) => {
                            e.preventDefault();
                          }}
                        />
                      </div>
                      <div className="col-span-4">
                        <Input
                          type="date"
                          name={`productsArray[${index}].coverageStartDate`}
                          className="!bg-white"
                          label="Coverage Start Date"
                          placeholder=""
                          readOnly
                          value={
                            formikStep3.values.productsArray[index]
                              .coverageStartDate === ""
                              ? formikStep3.values.productsArray[index]
                                  .coverageStartDate
                              : format(
                                  new Date(
                                    formikStep3.values.productsArray[
                                      index
                                    ].coverageStartDate
                                  ),
                                  "MM/dd/yyyy"
                                )
                          }
                          onChange={(e) => handleDateChange(e, index)}
                          onBlur={formikStep3.handleBlur}
                          error={
                            formikStep3.errors.productsArray &&
                            formikStep3.errors.productsArray[index] &&
                            formikStep3.errors.productsArray[index]
                              .coverageStartDate
                          }
                        />

                        {formikStep3.touched.productsArray &&
                          formikStep3.touched.productsArray[index] &&
                          formikStep3.touched.productsArray[index]
                            .coverageStartDate && (
                            <div className="text-red-500 text-sm pl-2 pt-2">
                              {formikStep3.errors.productsArray &&
                                formikStep3.errors.productsArray[index] &&
                                formikStep3.errors.productsArray[index]
                                  .coverageStartDate}
                            </div>
                          )}
                      </div>
                      <div className="col-span-4">
                        <Input
                          type="text"
                          name={`productsArray[${index}].priceType`}
                          className="!bg-white"
                          label="Product Price Type"
                          placeholder=""
                          value={
                            formikStep3.values.productsArray[index].priceType
                          }
                          onChange={formikStep3.handleChange}
                          onBlur={formikStep3.handleBlur}
                          disabled={true}
                          onWheelCapture={(e) => {
                            e.preventDefault();
                          }}
                        />
                      </div>
                      <div className="col-span-4"></div>
                      {(formikStep3.values.productsArray[index].priceType ===
                        "FlatPricing" ||
                        formikStep3.values.productsArray[index].priceType ===
                          "Flat Pricing") && (
                        <>
                          <div className="col-span-4">
                            <Input
                              type="text"
                              name={`productsArray[${index}].rangeStart`}
                              className="!bg-white"
                              label="Start Range"
                              placeholder=""
                              value={
                                formikStep3.values.productsArray[index]
                                  .rangeStart
                              }
                              onChange={formikStep3.handleChange}
                              onBlur={formikStep3.handleBlur}
                              disabled={true}
                              onWheelCapture={(e) => {
                                e.preventDefault();
                              }}
                            />
                          </div>
                          <div className="col-span-4">
                            <Input
                              type="text"
                              name={`productsArray[${index}].rangeEnd`}
                              className="!bg-white"
                              label="End Range"
                              placeholder=""
                              value={
                                formikStep3.values.productsArray[index].rangeEnd
                              }
                              onChange={formikStep3.handleChange}
                              onBlur={formikStep3.handleBlur}
                              disabled={true}
                              onWheelCapture={(e) => {
                                e.preventDefault();
                              }}
                            />
                          </div>
                        </>
                      )}
                      <div className="col-span-12">
                        <Input
                          type="text"
                          name={`productsArray[${index}].description`}
                          className="!bg-white"
                          label="Product Description"
                          placeholder=""
                          value={
                            formikStep3.values.productsArray[index].description
                          }
                          onChange={formikStep3.handleChange}
                          onBlur={formikStep3.handleBlur}
                          disabled={true}
                          onWheelCapture={(e) => {
                            e.preventDefault();
                          }}
                        />
                      </div>
                      <div className="col-span-12">
                        <Grid className="!grid-cols-3 gap-0">
                          {formikStep3?.values?.productsArray?.[index]?.priceType ===
                            "Quantity Pricing" &&
                            (() => {
                              return formikStep3.values.productsArray[
                                index
                              ].QuantityPricing.map((data, index1) => (
                                <div
                                  className="bg-grayf9  relative rounded-xl"
                                  key={index1}
                                >
                                  <div className=" p-4 pl-0 relative rounded-xl">
                                    <Grid className="">
                                      <div className="col-span-12">
                                        <Input
                                          type="text"
                                          name={`productsArray[${index}].QuantityPricing[${index1}].name`}
                                          className="!bg-grayf9"
                                          label="Name"
                                          value={
                                            formikStep3.values.productsArray[
                                              index
                                            ].QuantityPricing[index1].name
                                          }
                                          // required={true}
                                          disabled={true}
                                          onChange={formikStep3.handleChange}
                                          placeholder=""
                                          onBlur={() => {
                                            formikStep3.setFieldTouched(
                                              `QuantityPricing[${index1}].name`,
                                              true,
                                              false
                                            );
                                          }}
                                        />
                                      </div>
                                      <div className="col-span-12">
                                        <Input
                                          type="number"
                                          name={`productsArray[${index}].QuantityPricing[${index1}].quantity`}
                                          className="!bg-grayf9"
                                          label="Max Quantity"
                                          maxLength={"10"}
                                          maxDecimalPlaces={2}
                                          value={
                                            formikStep3.values.productsArray[
                                              index
                                            ].QuantityPricing[index1].quantity
                                          }
                                          // required={true}
                                          disabled={true}
                                          onChange={formikStep3.handleChange}
                                          onBlur={() => {
                                            formikStep3.setFieldTouched(
                                              `QuantityPricing[${index1}].quantity`,
                                              true,
                                              false
                                            );
                                          }}
                                          placeholder=""
                                        />
                                      </div>
                                      <div className="col-span-12">
                                        <Input
                                          type="number"
                                          name={`productsArray[${index}].QuantityPricing[${index1}].enterQuantity`}
                                          className="!bg-grayf9"
                                          label="# of Quantity"
                                          required={true}
                                          placeholder=""
                                          value={
                                            formikStep3.values.productsArray[
                                              index
                                            ].QuantityPricing[index1]
                                              .enterQuantity
                                          }
                                          onChange={(e) => {
                                            formikStep3.handleChange(e);
                                          }}
                                          onBlur={formikStep3.handleBlur}
                                          onWheelCapture={(e) => {
                                            e.preventDefault();
                                          }}
                                        />
                                        {formikStep3.touched.productsArray &&
                                          formikStep3.touched.productsArray[
                                            index
                                          ] &&
                                          formikStep3.touched.productsArray[
                                            index
                                          ].QuantityPricing &&
                                          formikStep3.touched.productsArray[
                                            index
                                          ].QuantityPricing[index1] &&
                                          formikStep3.touched.productsArray[
                                            index
                                          ].QuantityPricing[index1]
                                            .enterQuantity && (
                                            <div className="text-red-500 text-sm pl-2 pt-2">
                                              {formikStep3.errors
                                                .productsArray &&
                                                formikStep3.errors
                                                  .productsArray[index] &&
                                                formikStep3.errors
                                                  .productsArray[index]
                                                  .QuantityPricing &&
                                                formikStep3.errors
                                                  .productsArray[index]
                                                  .QuantityPricing[index1] &&
                                                formikStep3.errors
                                                  .productsArray[index]
                                                  .QuantityPricing[index1]
                                                  .enterQuantity}
                                            </div>
                                          )}
                                      </div>
                                    </Grid>
                                  </div>
                                </div>
                              ));
                            })()}
                        </Grid>
                      </div>

                      <div className="col-span-12">
                        <Grid className=" mb-3">
                          {formikStep3?.values?.productsArray?.[index]?.adhDays &&
                            formikStep3?.values?.productsArray?.[index]?.adhDays.map(
                              (coverage, idx) => (
                                <div
                                  className="col-span-4 capitalize"
                                  key={idx}
                                >
                                  <div className="my-4">
                                    <Input
                                      type="text"
                                      name={`productsArray[${index}].adhDays[${idx}].waitingDays`}
                                      className="!bg-white"
                                      label={`${coverage?.label} Days `}
                                      placeholder={`${coverage.label} Days`}
                                      value={
                                        formikStep3.values.productsArray[index]
                                          .adhDays[idx].waitingDays ?? 0
                                      }
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d+(\.\d{0,2})?$/.test(value)) {
                                          formikStep3.setFieldValue(
                                            `productsArray[${index}].adhDays[${idx}].waitingDays`,
                                            value === "" ? 0 : value
                                          );
                                        }
                                      }}
                                      onBlur={formikStep3.handleBlur}
                                    />
                                    {formikStep3.errors.productsArray &&
                                      formikStep3.errors.productsArray[index] &&
                                      formikStep3.errors.productsArray[index]
                                        .adhDays &&
                                      formikStep3.errors.productsArray[index]
                                        .adhDays[idx] &&
                                      formikStep3.errors.productsArray[index]
                                        .adhDays[idx].waitingDays && (
                                        <div className="text-red-500 text-sm pl-2 pt-2">
                                          {
                                            formikStep3.errors.productsArray[
                                              index
                                            ].adhDays[idx].waitingDays
                                          }
                                        </div>
                                      )}
                                  </div>
                                  <div className="relative">
                                    <Input
                                      type="text"
                                      name={`productsArray[${index}].adhDays[${idx}].deductible`}
                                      className="!bg-white"
                                      label="Deductible"
                                      placeholder=""
                                      value={
                                        formikStep3.values.productsArray[index]
                                          .adhDays[idx].deductible ?? 0
                                      }
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d+(\.\d{0,2})?$/.test(value)) {
                                          formikStep3.setFieldValue(
                                            `productsArray[${index}].adhDays[${idx}].deductible`,
                                            value === "" ? 0 : value
                                          );
                                        }
                                      }}
                                      onBlur={formikStep3.handleBlur}
                                    />
                                    <div className="absolute top-[1px] right-[1px]">
                                      <Select
                                        name={`productsArray[${index}].adhDays[${idx}].amountType`}
                                        label=""
                                        disableFirstOption={true}
                                        onChange={(e, name) =>
                                          formikStep3.setFieldValue(
                                            `productsArray[${index}].adhDays[${idx}].amountType`,
                                            name
                                          )
                                        }
                                        value={
                                          formikStep3.values.productsArray[
                                            index
                                          ].adhDays[idx].amountType
                                        }
                                        classBox="!bg-transparent"
                                        className1="!border-0 !border-l !rounded-s-[0px] !text-light-black !pr-2"
                                        options={optiondeductibles}
                                      />
                                    </div>
                                    {formikStep3.errors.productsArray &&
                                      formikStep3.errors.productsArray[index] &&
                                      formikStep3.errors.productsArray[index]
                                        .adhDays &&
                                      formikStep3.errors.productsArray[index]
                                        .adhDays[idx] &&
                                      formikStep3.errors.productsArray[index]
                                        .adhDays[idx].deductible && (
                                        <div className="text-red-500 text-sm">
                                          {
                                            formikStep3.errors.productsArray[
                                              index
                                            ].adhDays[idx].deductible
                                          }
                                        </div>
                                      )}
                                  </div>
                                </div>
                              )
                            )}
                        </Grid>
                      </div>
                      <div className="col-span-12">
                        <div className="relative mb-4">
                          <label
                            htmlFor="description"
                            className="absolute text-base text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-white left-2 px-1 -translate-y-4 scale-75"
                          >
                            Note
                          </label>
                          <textarea
                            id={`productsArray[${index}].additionalNotes`}
                            rows="4"
                            name={`productsArray[${index}].additionalNotes`}
                            maxLength={150}
                            value={
                              formikStep3.values.productsArray[index]
                                .additionalNotes
                            }
                            onChange={formikStep3.handleChange}
                            onBlur={formikStep3.handleBlur}
                            className="block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold text-light-black bg-transparent rounded-lg border-[1px] bg-white border-gray-300 appearance-none peer"
                          ></textarea>
                          {formikStep3.errors.productsArray &&
                            formikStep3.errors.productsArray[index] &&
                            formikStep3.errors.productsArray[index]
                              .additionalNotes && (
                              <div className="text-red-500 text-sm pl-2 pt-2">
                                {
                                  formikStep3.errors.productsArray[index]
                                    .additionalNotes
                                }
                              </div>
                            )}
                        </div>
                      </div>
                    </Grid>
                  </div>
                  <div className="col-span-4">
                    <div className="border border-dashed w-full h-[40%] relative flex justify-center">
                      <label
                        htmlFor="description"
                        className="absolute z-[999] text-base text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-white left-2 px-1 -translate-y-4 scale-75"
                      >
                        Upload File
                      </label>
                      <div className="self-center text-center">
                        <button
                          type="button"
                          onClick={() => handleDropdownClick(index)}
                          className={`bg-[#F2F2F2] py-10 w-full rounded-md focus:outline-none focus:border-blue-500 !bg-transparent`}
                        >
                          {fileValues[index] ? (
                            <div className="self-center flex text-center relative bg-white border w-full p-3">
                              {/* <img src={cross} className="absolute -right-2 -top-2 mx-auto mb-3" alt="Dropbox" /> */}
                              <img
                                src={csvFile}
                                className="mr-2"
                                alt="Dropbox"
                              />
                              <div className="flex justify-between w-full">
                                <p className="self-center text-sm pr-3 text-black">
                                  {" "}
                                  {fileValues[index].name}
                                </p>
                                <p className="self-center text-sm text-black">
                                  {(fileValues[index].size / 1000).toFixed(2)}{" "}
                                  kb
                                </p>
                              </div>
                            </div>
                          ) : (
                            <>
                              <img
                                src={Dropbox}
                                className="mx-auto mb-3"
                                alt="Dropbox"
                              />
                              <p className="mx-4">
                                Accepted file types: csv, xlsx, xls Max. file
                                size: 50 MB.
                              </p>
                            </>
                          )}
                        </button>

                        <input
                          type="file"
                          ref={fileInputRef.current[index]}
                          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            handleFileSelect(e, index);
                          }}
                          onClick={(event) => handleInputClick(index, event)}
                          disabled={
                            Boolean(numberOfOrders[index]) === true
                              ? false
                              : true
                          }
                        />
                      </div>
                    </div>
                    <p className="text-[12px] mt-1 font-medium">
                      Please click on file option and make a copy. Upload the
                      list of Product Name and Price using our provided Google
                      Sheets template, by{" "}
                      <span
                        className="underline cursor-pointer"
                        onClick={downloadCSVTemplate}
                      >
                        Clicking here{" "}
                      </span>
                      The file must be saved with csv , xls and xlsx Format.
                    </p>
                    {formikStep3.errors.productsArray &&
                      formikStep3.errors.productsArray[index] &&
                      formikStep3.errors.productsArray &&
                      formikStep3.errors.productsArray[index] &&
                      formikStep3.errors.productsArray[index].file && (
                        <div className="text-red-500 text-sm pl-2 pt-2">
                          {formikStep3.errors.productsArray[index].file}
                        </div>
                      )}

                    {formikStep3.values.productsArray[index].dealerSku ===
                    "" ? (
                      ""
                    ) : (
                      <div className="col-span-12 my-4 border-t py-3">
                        <div className="flex justify-between w-full">
                          <p className="text-[12px] mb-3 font-semibold">
                            # of Claims Over the Certain Period
                          </p>
                          <div className="flex">
                            <RadioButton
                              className="self-start"
                              id="yes-warranty"
                              label="Unlimited"
                              value={true}
                              checked={claimOver[index] === true}
                              onChange={() => {
                                setClaimOver((prevState) => {
                                  const newClaimOver = [...prevState];
                                  newClaimOver[index] = true;
                                  return newClaimOver;
                                });
                                formikStep3.setFieldValue(
                                  `productsArray[${index}].noOfClaim`,
                                  {
                                    period: "Monthly",
                                    value: -1,
                                  }
                                );
                              }}
                            />
                            <RadioButton
                              className="self-start"
                              id="no-warranty"
                              label="Fixed"
                              value={false}
                              checked={claimOver[index] === false}
                              onChange={() => {
                                setClaimOver((prevState) => {
                                  const newClaimOver = [...prevState];
                                  newClaimOver[index] = false;
                                  return newClaimOver;
                                });
                                formikStep3.setFieldValue(
                                  `productsArray[${index}].noOfClaim`,
                                  {
                                    period: "Monthly",
                                    value: 1,
                                  }
                                );
                              }}
                            />
                          </div>
                        </div>
                        {claimOver[index] === false && (
                          <div className="flex">
                            <Select
                              name={`productsArray[${index}].noOfClaim.period`}
                              options={period}
                              className="!bg-grayf9"
                              placeholder=""
                              className1="!pt-2.5"
                              OptionName={"Period"}
                              disableFirstOption={true}
                              maxLength={"30"}
                              value={
                                formikStep3?.values?.productsArray[index]
                                  ?.noOfClaim?.period
                              }
                              onBlur={formik.handleBlur}
                              onChange={(name, value) =>
                                formikStep3.setFieldValue(
                                  `productsArray[${index}].noOfClaim.period`,
                                  value
                                )
                              }
                            />

                            <div className="ml-3">
                              <Input
                                className1="!pt-2.5"
                                placeholder="# of claims"
                                type="tel"
                                name={`productsArray[${index}].noOfClaim.value`}
                                value={
                                  formikStep3?.values?.productsArray[index]
                                    ?.noOfClaim?.value
                                }
                                onBlur={formik.handleBlur}
                                onChange={(e) => {
                                  const value =
                                    e.target.value === ""
                                      ? 1
                                      : Math.max(
                                          1,
                                          parseInt(e.target.value, 10)
                                        );
                                  formikStep3.setFieldValue(
                                    `productsArray[${index}].noOfClaim.value`,
                                    value
                                  );
                                }}
                              />
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between my-4 w-full">
                          <p className="text-[12px] font-semibold">
                            # of Claims in Coverage Period
                          </p>
                          <div className="flex">
                            <RadioButton
                              className="self-start"
                              id="yes-warranty"
                              label="Unlimited"
                              value={true}
                              checked={claimInCoveragePeriod[index] === true}
                              onChange={() => {
                                setClaimInCoveragePeriod((prevState) => {
                                  const newClaimInCoveragePeriod = [
                                    ...prevState,
                                  ];
                                  newClaimInCoveragePeriod[index] = true;
                                  return newClaimInCoveragePeriod;
                                });

                                formikStep3.setFieldValue(
                                  `productsArray[${index}].noOfClaimPerPeriod`,
                                  -1
                                );
                              }}
                            />
                            <RadioButton
                              className="self-start"
                              id="no-warranty"
                              label="Fixed"
                              value={false}
                              checked={claimInCoveragePeriod[index] === false}
                              onChange={() => {
                                setClaimInCoveragePeriod((prevState) => {
                                  const newClaimInCoveragePeriod = [
                                    ...prevState,
                                  ];
                                  newClaimInCoveragePeriod[index] = false;
                                  return newClaimInCoveragePeriod;
                                });
                                formikStep3.setFieldValue(
                                  `productsArray[${index}].noOfClaimPerPeriod`,
                                  1
                                );
                              }}
                            />
                          </div>
                        </div>
                        {claimInCoveragePeriod[index] === false && (
                          <div className="flex ">
                            <div className="">
                              <Input
                                className1="!pt-2.5"
                                placeholder="# of claims"
                                type="tel"
                                name={`productsArray[${index}].noOfClaimPerPeriod`}
                                value={
                                  formikStep3?.values?.productsArray[index]
                                    ?.noOfClaimPerPeriod
                                }
                                onBlur={formik.handleBlur}
                                onChange={(e) => {
                                  const value =
                                    e.target.value === ""
                                      ? 1
                                      : Math.max(
                                          1,
                                          parseInt(e.target.value, 10)
                                        );
                                  formikStep3.setFieldValue(
                                    `productsArray[${index}].noOfClaimPerPeriod`,
                                    value
                                  );
                                }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <p className=" text-[12px] mb-3 font-semibold">
                            {" "}
                            Is manufacturer warranty included?
                          </p>
                          <div className="flex">
                            <RadioButton
                              className="self-start"
                              id="yes-warranty"
                              label="Yes"
                              value={true}
                              checked={
                                formikStep3.values.productsArray[index]
                                  .isManufacturerWarranty == true
                              }
                              onChange={() =>
                                formikStep3.setFieldValue(
                                  `productsArray[${index}].isManufacturerWarranty`,
                                  true
                                )
                              }
                            />
                            <RadioButton
                              className="self-start"
                              id="no-warranty"
                              label="No"
                              value={false}
                              checked={
                                formikStep3.values.productsArray[index]
                                  .isManufacturerWarranty === false
                              }
                              onChange={() =>
                                formikStep3.setFieldValue(
                                  `productsArray[${index}].isManufacturerWarranty`,
                                  false
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <p className=" text-[12px] mb-3 font-semibold">
                            {" "}
                            Is There a Maximum Claim Amount?
                          </p>
                          <div className="flex">
                            <RadioButton
                              className="self-start"
                              id="yes-warranty"
                              label="Yes"
                              value={true}
                              checked={
                                formikStep3.values.productsArray[index]
                                  .isMaxClaimAmount == true
                              }
                              onChange={() =>
                                formikStep3.setFieldValue(
                                  `productsArray[${index}].isMaxClaimAmount`,
                                  true
                                )
                              }
                            />
                            <RadioButton
                              className="self-start"
                              id="no-warranty"
                              label="No"
                              value={false}
                              checked={
                                formikStep3.values.productsArray[index]
                                  .isMaxClaimAmount === false
                              }
                              onChange={() =>
                                formikStep3.setFieldValue(
                                  `productsArray[${index}].isMaxClaimAmount`,
                                  false
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Grid>
              </Card>
            ))}
            <Button
              className="!bg-[transparent] !text-black"
              onClick={prevStep}
            >
              Previous
            </Button>
            <Button onClick={formikStep3.handleSubmit}>Next</Button>
            {/* <Button className="ml-2" onClick={()=>openError()}>Error</Button> */}
          </div>
        )}
      </>
    );
  };

  const renderStep4 = () => {
    // Step 4 content
    return (
      <>
        {loading ? (
          <div className=" h-[400px] w-full flex py-5">
            <div className="self-center mx-auto">
              <RotateLoader color="#333" />
            </div>
          </div>
        ) : (
          <form onSubmit={formik4.handleSubmit}>
            <Card className="px-8 pb-8 pt-4 mb-8 drop-shadow-4xl border-[1px] border-Light-Grey  rounded-xl">
              <Grid>
                <div className="col-span-6">
                  <p className="text-2xl font-bold mb-4">Order Details</p>
                  <Grid className=" border-Light-Grey border rounded-xl px-4 ">
                    <div className="col-span-3 py-4 border-r">
                      <p className="text-[12px]">Dealer Name</p>
                      <p className="font-bold text-sm break-words">
                        {dealerName}
                      </p>
                    </div>
                    <div className="col-span-3 py-4 border-r">
                      <p className="text-[12px]">Reseller Name</p>
                      <p className="font-bold text-sm break-words">
                        {resellerName}
                      </p>
                    </div>
                    <div className="col-span-3 py-4 border-r">
                      <p className="text-[12px]">Customer Name</p>
                      <p className="font-bold text-sm break-words">
                        {customerName}
                      </p>
                    </div>
                    <div className="col-span-3 py-4 ">
                      <p className="text-[12px]">Servicer Name</p>
                      <p className="font-bold text-sm break-words">
                        {servicerName}
                      </p>
                    </div>
                  </Grid>
                </div>
                <div className="col-span-6">
                  <p className="text-2xl font-bold mb-4">
                    Dealer Order Details
                  </p>
                  <Grid className=" !gap-2 border-Light-Grey border rounded-xl px-2 ">
                    <div className="col-span-4 py-4 border-r">
                      <p className="text-[12px]">Dealer Purchase Order</p>
                      <p className="font-bold text-sm">
                        {formikStep2.values.dealerPurchaseOrder}
                      </p>
                    </div>
                    <div className="col-span-3 py-4 border-r">
                      <p className="text-[12px]">Service Coverage</p>
                      <p className="font-bold text-sm">
                        {formikStep2.values.serviceCoverageType === "Labour"
                          ? "Labor"
                          : formikStep2.values.serviceCoverageType ===
                            "Parts & Labour"
                          ? "Parts & Labor"
                          : formikStep2.values.serviceCoverageType}
                      </p>
                    </div>
                    <div className="col-span-5 py-4 ">
                      <p className="text-[12px]">Term And Condition</p>
                      <div className="flex self-center">
                        <img
                          src={csvFile}
                          className="mr-2 h-[23px]"
                          alt="Dropbox"
                        />
                        <p className="self-center text-[11px] font-bold pl-2 text-black">
                          {formikStep2?.values?.termCondition?.fileName ===
                            "" || formikStep2?.values?.termCondition === null
                            ? "No File Selected"
                            : formikStep2?.values?.termCondition?.name}
                        </p>

                        {/* <p className="self-center font-bold text-[11px]">
                          {formikStep2?.values?.termCondition?.fileName ===
                            "" || formikStep2?.values?.termCondition === null
                            ? ""
                            : (
                                formikStep2?.values?.termCondition?.size / 1000
                              )?.toFixed(2) + "kb"}
                        </p> */}
                      </div>
                      {/* <div className="self-center flex">
                        <img src={csvFile} className="mr-2 h-[23px]" alt="Dropbox" />
                        <div className="flex justify-between w-full">
                          <p className="self-center font-bold text-sm text-black">
                            No File Selected

                          </p>

                          <p className="self-center font-bold text-sm">
                            232kb
                          </p>
                        </div>
                      </div> */}
                      {/* <p className="text-[12px]">Coverage Type</p>
                      <ol className="flex flex-wrap">
                        {formikStep2.values.coverageType.map((data) => {
                          return (
                            <li
                              key={data.label}
                              className="font-bold text-sm list-disc mx-[19px]"
                            >
                              {data.label}
                            </li>
                          );
                        })}
                      </ol> */}
                    </div>
                  </Grid>
                </div>
              </Grid>

              {formikStep3.values.productsArray.map((data, index) => {
                return (
                  <>
                    <Grid className="mt-4">
                      <div className="col-span-8">
                        <p className="text-2xl font-bold mb-2 pl-3">
                          Product Details
                        </p>
                      </div>
                      <div className="col-span-4">
                        <p className="text-2xl font-bold mb-2">Uploaded Data</p>
                      </div>
                    </Grid>
                    <Grid className=" !border-Light-Grey !border !rounded-xl !gap-0">
                      <div className="col-span-8">
                        <div className=" border-r border-b">
                          <Grid className="border-b px-4">
                            <div className="col-span-3 py-4 border-r">
                              <p className="text-[12px]">Product Category</p>
                              <p className="font-bold text-sm">
                                {categoryName[index]}
                              </p>
                            </div>
                            <div className="col-span-3 py-4 border-r">
                              <p className="text-[12px]">Product SKU</p>
                              <p className="font-bold text-sm">
                                {priceBookName[index]}
                              </p>
                            </div>
                            <div className="col-span-3 py-4 border-r">
                              <p className="text-[12px]">Dealer SKU</p>
                              <p className="font-bold text-sm">
                                {dealerSkuName[index]}
                              </p>
                            </div>
                            <div className="col-span-3 py-4">
                              <p className="text-[12px]">Product Name</p>
                              <p className="font-bold text-sm">{data.pName}</p>
                            </div>
                          </Grid>
                          <Grid className="border-b px-4">
                            <div className="col-span-12 py-4">
                              <p className="text-[12px]">Product Description</p>
                              <p className="font-bold text-sm">
                                {data.description}
                              </p>
                            </div>
                          </Grid>
                          <Grid className="border-b px-4">
                            <div className="col-span-3 py-4 border-r">
                              <p className="text-[12px]">Term</p>
                              <p className="font-bold text-sm">
                                {data.term} Months
                              </p>
                            </div>
                            <div className="col-span-3 py-4 border-r">
                              <p className="text-[12px]">Unit Price</p>
                              <p className="font-bold text-sm">
                                $
                                {data.unitPrice === undefined
                                  ? parseInt(0).toLocaleString(2)
                                  : formatOrderValue(
                                      Number(data.unitPrice) ?? parseInt(0)
                                    )}
                              </p>
                            </div>
                            <div className="col-span-3 py-4 border-r">
                              <p className="text-[12px]"># of Products</p>
                              <p className="font-bold text-sm">
                                {Math.round(
                                  data.price / parseFloat(data.unitPrice)
                                )}
                              </p>
                            </div>
                            <div className="col-span-3 py-4">
                              <p className="text-[12px]">Price</p>
                              <p className="font-bold text-sm">
                                $
                                {data.price === undefined
                                  ? parseInt(0).toLocaleString(2)
                                  : formatOrderValue(
                                      Number(data.price) ?? parseInt(0)
                                    )}{" "}
                              </p>
                            </div>
                          </Grid>

                          {data.priceType == "Flat Pricing" && (
                            <Grid className="border-b px-4">
                              <div className="col-span-6 py-4 border-r">
                                <p className="text-[12px]">Start Range</p>
                                <p className="font-bold text-sm">
                                  $
                                  {data.rangeStart === undefined
                                    ? parseInt(0).toLocaleString(2)
                                    : formatOrderValue(
                                        Number(data.rangeStart) ?? parseInt(0)
                                      )}
                                </p>
                              </div>
                              <div className="col-span-6 py-4">
                                <p className="text-[12px]">End Range</p>
                                <p className="font-bold text-sm">
                                  $
                                  {data.rangeEnd === undefined
                                    ? parseInt(0).toLocaleString(2)
                                    : formatOrderValue(
                                        data.rangeEnd ?? parseInt(0)
                                      )}
                                </p>
                              </div>
                            </Grid>
                          )}

                          {/* Add this */}

                          <Grid>
                            {data.priceType == "Quantity Pricing" && (
                              <div className="col-span-12">
                                <table className="w-full border text-center">
                                  <tr className="border bg-white">
                                    <td
                                      colSpan={"4"}
                                      className="font-bold text-sm"
                                    >
                                      Quantity Pricing List{" "}
                                    </td>
                                  </tr>
                                  <tr className="border bg-white">
                                    <th className="font-bold text-sm">Name</th>
                                    <th className="font-bold text-sm">
                                      Quantity Per Unit
                                    </th>
                                    <th className="font-bold text-sm">
                                      Quantity
                                    </th>
                                    <th className="font-bold text-sm">
                                      # of Unit
                                    </th>
                                  </tr>
                                  {data.QuantityPricing &&
                                    data.QuantityPricing.map((value, index) => {
                                      return (
                                        <tr
                                          key={index}
                                          className="border bg-white"
                                        >
                                          <td className="text-[12px]">
                                            {value.name}
                                          </td>
                                          <td className="text-[12px]">
                                            {value.quantity}
                                          </td>
                                          <td className="text-[12px]">
                                            {value.enterQuantity}
                                          </td>
                                          <td className="text-[12px]">
                                            {Math.max(
                                              1,
                                              Math.ceil(
                                                value.enterQuantity /
                                                  parseFloat(value.quantity)
                                              )
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                </table>
                              </div>
                            )}
                          </Grid>
                          <Grid className=" px-4">
                            <div className="col-span-8 border-r py-4">
                              <p className="text-[12px]">Note</p>
                              <p className="font-bold text-sm">
                                {data.additionalNotes}
                              </p>
                            </div>
                            <div className="col-span-4 py-4">
                              <p className="text-[12px]">Coverage Start Date</p>
                              <p className="font-bold text-sm">
                                {data?.coverageStartDate == "" ? (
                                  <></>
                                ) : (
                                  <>
                                    {format(
                                      new Date(data?.coverageStartDate),
                                      "MM/dd/yyyy"
                                    )}
                                  </>
                                )}
                              </p>
                            </div>
                          </Grid>

                          {/* Loops */}
                        </div>
                      </div>
                      <div className="col-span-4 pt-3 px-2">
                        <div className="border border-dashed w-full h-[30%] relative mb-4 flex ">
                          <div className="self-center flex text-center mx-4 relative bg-white border w-full rounded-md p-3">
                            <img src={csvFile} className="mr-2" alt="Dropbox" />
                            <div className="flex justify-between w-full">
                              <p className="self-center text-black">
                                {data?.file === "" || data?.file?.name === ""
                                  ? "No File Selected"
                                  : data?.file?.name}
                              </p>

                              <p className="self-center">
                                {data?.file === "" || data?.file?.name === ""
                                  ? ""
                                  : (data?.file?.size / 1000)?.toFixed(2) +
                                    "kb"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-12 my-4 border-t py-3">
                          <div className=" w-full">
                            <p className="text-base mb-1 font-semibold">
                              # of Claims Over the Certain Period
                            </p>
                            <p className="text-sm">
                              {" "}
                              {" "}
{
  formikStep3?.values?.productsArray[index]?.noOfClaim?.value == "-1"
    ? ""
    : `${formikStep3?.values?.productsArray[index]?.noOfClaim?.period} - `
}
{" "}

                              {formikStep3?.values?.productsArray[index]
                                ?.noOfClaim?.value == "-1"
                                ? "Unlimited"
                                : formikStep3?.values?.productsArray[index]
                                    ?.noOfClaim?.value}{" "}
                            </p>
                          </div>

                          <div className=" my-1 w-full">
                            <p className="text-base font-semibold">
                              # of Claims in Coverage Period
                            </p>
                          </div>
                          <p className="text-sm">
                            {" "}
                            {formikStep3?.values?.productsArray[index]
                              ?.noOfClaimPerPeriod == "-1"
                              ? "Unlimited"
                              : formikStep3?.values?.productsArray[index]
                                  ?.noOfClaimPerPeriod}{" "}
                          </p>

                          <div className="">
                            <p className=" text-base mb-1 font-semibold">
                              {" "}
                              Is manufacturer warranty included?
                            </p>
                          </div>
                          <p className="text-sm">
                            {formikStep3.values.productsArray[index]
                              .isManufacturerWarranty == true
                              ? "Yes"
                              : "No"}
                          </p>
                          <div className="">
                            <p className=" text-base mb-1 font-semibold">
                              {" "}
                              Is There a Maximum Claim Amount?
                            </p>
                          </div>
                          <p className="text-sm">
                            {formikStep3.values.productsArray[index]
                              .isMaxClaimAmount == true
                              ? "Yes"
                              : "No"}
                          </p>
                        </div>
                      </div>

                      <div className="col-span-12">
                        <p className="text-base font-bold mb-4 pl-3">
                          Coverage Type Details
                        </p>
                        <div className=" border-Light-Grey border rounded-b-xl ">
                          <Grid className="!gap-0">
                            {data.adhDays &&
                              data.adhDays.map((Data, idx) => (
                                <div
                                  key={idx}
                                  className="col-span-3 py-4  border-r"
                                >
                                  <div className="pb-3 border-b px-4">
                                    <p className="text-[12px] capitalize">
                                      {" "}
                                      {Data.label} Waiting{" "}
                                    </p>
                                    <p className="font-bold text-sm">
                                      {Data.waitingDays} Days
                                    </p>
                                  </div>
                                  <div className="pt-3 px-4">
                                    <p className="text-[12px] capitalize">
                                      {" "}
                                      Deductible
                                    </p>
                                    <p className="font-bold text-sm">
                                      {Data.amountType === "percentage"
                                        ? `${formatOrderValue(
                                            Number(Data.deductible) ?? 0
                                          )} %`
                                        : `$${formatOrderValue(
                                            Number(Data.deductible) ?? 0
                                          )}`}
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </Grid>
                        </div>
                      </div>
                    </Grid>
                  </>
                );
              })}

              <Grid className="mt-5">
                <div className="col-span-4 pt-2">
                  <div className="flex  w-full text-base font-semibold bg-grayf9 rounded-lg border-[1px] border-gray-300 appearance-none peer text-light-black">
                    <p className="self-center w-[40%] text-sm px-3">
                      Payment Status
                    </p>
                    <div className="relative w-[60%]">
                      <div
                        className={`
                      absolute h-3 w-3 rounded-full top-[33%] ml-[8px]
                      ${
                        formik4.values.paymentStatus === "Unpaid"
                          ? "bg-[#FFAA47]"
                          : ""
                      }
                      ${
                        formik4.values.paymentStatus === "Paid"
                          ? "bg-[#6BD133]"
                          : ""
                      }
                      ${
                        formik4.values.paymentStatus !== "Unpaid" &&
                        formik4.values.paymentStatus !== "Paid"
                          ? "bg-[#338FD1]"
                          : ""
                      }
                    `}
                      ></div>

                      <select
                        name="paymentStatus"
                        className="text-[12px] bg-[transparent] border-l w-full border-gray-300 text-[#727378] pl-[20px] py-2 pr-1 font-semibold "
                        onChange={(e) => {
                          handlePaymentStatusChange(e);
                          formik4.handleChange(e);
                        }}
                        // onChange={handlePaymentStatusChange}
                        onBlur={formik4.handleBlur}
                        value={formik4.values.paymentStatus}
                        error={formik4.errors.paymentStatus}
                      >
                        <option value="Paid">Paid</option>
                        <option value="Unpaid">Unpaid</option>
                        <option value="PartlyPaid">Partly Paid</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-span-4">
                  <Grid>
                    {formik4.values.paymentStatus == "PartlyPaid" && (
                      <>
                        {
                          <div className="col-span-6">
                            <Input
                              type="number"
                              name="paidAmount"
                              className="!bg-white !w-[168px]"
                              label="Total Paid Amount ($)"
                              maxLength={10}
                              maxDecimalPlaces={2}
                              disabled={formik4.values.paymentStatus === "Paid"}
                              placeholder=""
                              onChange={(e) => {
                                calculatePendingAmount(e.target.value);
                                formik4.handleChange(e);
                              }}
                              onBlur={formik4.handleBlur}
                              value={formik4.values.paidAmount}
                            />
                            {formik4.errors.paidAmount && (
                              <div className="text-red-500">
                                {formik4.errors.paidAmount}
                              </div>
                            )}
                          </div>
                        }

                        {formik4.values.paymentStatus == "PartlyPaid" && (
                          <div className="col-span-6">
                            <Input
                              type="number"
                              name="pendingAmount"
                              className="!bg-white"
                              label="Pending Amount ($)"
                              maxLength={10}
                              maxDecimalPlaces={2}
                              disabled={true}
                              placeholder=""
                              onChange={formik4.handleChange}
                              onBlur={formik4.handleBlur}
                              value={formik4.values.pendingAmount}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </Grid>
                </div>
                <div className="col-span-4 flex justify-center pt-4">
                  <p className="text-base pr-3">Total Amount :</p>
                  <p className="font-bold text-lg">
                    $
                    {formatOrderValue(
                      Number(
                        calculateTotalAmount(formikStep3.values.productsArray)
                      )
                    ).toLocaleString(2)}
                  </p>
                </div>
                <div className="col-span-12">
                  <p className="flex text-sm font-semibold mt-3 mb-6">
                    Do you want to sent notifications ?
                    <RadioButton
                      id="yes-create-account"
                      label="Yes"
                      value={true}
                      checked={sendNotification === true}
                      onChange={handleRadioChange}
                    />
                    <RadioButton
                      id="no-create-account"
                      label="No"
                      value={false}
                      checked={sendNotification === false}
                      onChange={handleRadioChange}
                    />
                  </p>
                </div>
              </Grid>
              {error && <p className="text-red-500">{error}</p>}
            </Card>

            <Button
              className="!bg-[transparent] !text-black"
              onClick={prevStep}
            >
              Previous
            </Button>
            <Button type="submit">Submit</Button>
          </form>
        )}
        {/* )} */}
      </>
    );
  };

  return (
    <div className="mb-8 ml-3">
      <Headbar />
      <div className="flex mt-2">
        <Link
          onClick={handleGOBack}
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
            {type} Order
          </p>
          <ul className="flex self-center">
            <li className="text-sm text-neutral-grey font-Regular">
              <Link to={"/"}>Home </Link> {" / "}
            </li>
            <li className="text-sm text-neutral-grey ml-1 font-Regular">
              {" "}
              {type} Order /{" "}
            </li>
            <li className="text-sm text-neutral-grey font-semibold ml-1 pt-[1px]">
              {" "}
              Order Details{" "}
            </li>
          </ul>
        </div>
      </div>

      {/* Form Start */}
      <div className="flex my-4 ml-3">
        <div className="text-center">
          {currentStep > 1 ? (
            <img src={check} className="text-center mx-auto" />
          ) : (
            <p className="border border-black rounded-full mx-auto w-[26px]">
              1
            </p>
          )}

          <p
            className={` ${
              currentStep == 1 ? "text-black" : "text-[#ADADAD] "
            } text-sm font-bold`}
          >
            Order Details
          </p>
        </div>
        <hr className="w-[150px] border-black mt-3" />
        <div className="text-center">
          {currentStep > 2 ? (
            <img src={check} className="text-center mx-auto" />
          ) : (
            <p
              className={`border ${
                currentStep > 1
                  ? "text-black border-black"
                  : "text-[#ADADAD] border-[#ADADAD]"
              }  rounded-full mx-auto w-[26px]`}
            >
              2
            </p>
          )}
          <p
            className={` ${
              currentStep == 2 ? "text-black" : "text-[#ADADAD] "
            } text-sm font-bold`}
          >
            Dealer Order Details
          </p>
        </div>
        <hr
          className={`w-[150px]  ${
            currentStep > 2 ? "border-black" : "border-[#ADADAD]"
          } mt-3`}
        />
        <div className="text-center">
          {currentStep > 3 ? (
            <img src={check} className="text-center mx-auto" />
          ) : (
            <p
              className={`border ${
                currentStep > 2
                  ? "text-black border-black"
                  : "text-[#ADADAD] border-[#ADADAD]"
              } rounded-full mx-auto w-[26px]`}
            >
              3
            </p>
          )}
          <p
            className={` ${
              currentStep == 3 ? "text-black" : "text-[#ADADAD] "
            }text-sm font-bold`}
          >
            Add Product
          </p>
        </div>
        <hr
          className={`w-[150px]  ${
            currentStep > 3 ? "border-black" : "border-[#ADADAD]"
          } mt-3`}
        />
        <div className="text-center">
          <p
            className={`border ${
              currentStep > 3
                ? "text-black border-black"
                : "text-[#ADADAD] border-[#ADADAD]"
            } rounded-full mx-auto w-[26px]`}
          >
            4
          </p>
          <p
            className={` ${
              currentStep == 4 ? "text-black" : "text-[#ADADAD] "
            }text-sm font-bold`}
          >
            Order Details
          </p>
        </div>
      </div>
      {loading1 ? (
        <div className=" h-[400px] w-full flex py-5">
          <div className="self-center mx-auto">
            <RotateLoader color="#333" />
          </div>
        </div>
      ) : (
        <>
          {" "}
          {loading2 ? (
            <div className=" h-[400px] w-full flex py-5">
              <div className="self-center mx-auto">
                <RotateLoader color="#333" />
              </div>
            </div>
          ) : (
            <>{renderStep()} </>
          )}
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center py-3">
          <img src={AddDealer} alt="email Image" className="mx-auto" />

          <p className="text-3xl mb-0 mt-4 font-semibold ">
            {type == "Edit" ? "Update" : "Add"} Order
            <span className=""> Successfully </span>
          </p>

          <p className="text-base font-medium mt-2">
            <b> {type == "Edit" ? "" : "New Order"} </b>{" "}
            {type == "Edit" ? "Updated" : "Added"} Successfully
          </p>
          <p className="text-base font-medium mt-2">
            Redirecting you on Order List Page {timer} seconds.
          </p>
        </div>
      </Modal>

      <Modal isOpen={isErrorOpen} onClose={closeError}>
        <Button
          onClick={closeError}
          className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-Granite-Gray"
        >
          <img
            src={Cross}
            className="w-full h-full text-black rounded-full p-0"
          />
        </Button>
        <div className="text-center py-3">
          <img src={disapproved} alt="email Image" className="mx-auto" />

          <p className="text-3xl mb-0 mt-4 font-semibold">
            <span className=""> Error </span>
          </p>

          <p className="text-base font-medium mt-2">
            Some Errors Please Check Form Validations
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default AddOrder;
