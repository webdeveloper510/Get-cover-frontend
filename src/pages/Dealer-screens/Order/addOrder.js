import React, { createRef, useEffect, useRef, useState } from "react";
import Headbar from "../../../common/headBar";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Select from "../../../common/select";
import Grid from "../../../common/grid";
import Input from "../../../common/input";
import { format, addMonths } from "date-fns";
// Media Include
import BackImage from "../../../assets/images/icons/backArrow.svg";
import Spinner from "../../../assets/images/icons/Spinner.svg";
import disapproved from "../../../assets/images/Disapproved.png";
import csvFile from "../../../assets/images/icons/csvFile.svg";
import AddDealer from "../../../assets/images/dealer-book.svg";
import Delete from "../../../assets/images/icons/DeleteIcon.svg";
import check from "../../../assets/images/icons/check.svg";
import Button from "../../../common/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import Dropbox from "../../../assets/images/icons/dropBox.svg";
import { getTermList } from "../../../services/priceBookService";
import RadioButton from "../../../common/radio";
import {
  checkEditFileValidations,
  checkMultipleFileValidation,
  fileValidation,
  getStep2Validation,
  orderDetailsById,
} from "../../../services/orderServices";
import Modal from "../../../common/model";
import Cross from "../../../assets/images/Cross.png";
import { RotateLoader } from "react-spinners";
import SelectBoxWIthSerach from "../../../common/selectBoxWIthSerach";
import Cross1 from "../../../assets/images/Cross_Button.png";
import {
  addOrderforDealerPortal,
  editOrderforDealerPortal,
  getCategoryAndPriceBooksforDealerPortal,
  getCustomerListforDealerPortal,
  getResellerListforDealerPortal,
  getServicerListInOrdersforDealerPortal,
} from "../../../services/dealerServices/orderListServices";
import { getServiceCoverageDetails } from "../../../services/customerServices";
import Card from "../../../common/card";
import { MultiSelect } from "react-multi-select-component";
import {
  getDealersSettingsByid,
  uploadTermsandCondition,
} from "../../../services/dealerServices";

function DealerAddOrder() {
  const [productNameOptions, setProductNameOptions] = useState([]);
  const [servicerName, setServicerName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [resellerName, setResellerName] = useState("");
  const [termList, setTermList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [servicerData, setServicerData] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectedFile2, setSelectedFile2] = useState(null);
  const inputRef = useRef(null);
  const [resellerList, setResllerList] = useState([]);
  const [categoryName, setCategoryName] = useState([]);
  const [priceBookName, setPriceBookName] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [fileValues, setFileValues] = useState([]);
  const [loading3, setLoading3] = useState(false);
  const [loading14, setloader] = useState(false);
  const [loading5, setLoading5] = useState(false);
  const [claimOver, setClaimOver] = useState([true]);
  const [claimInCoveragePeriod, setClaimInCoveragePeriod] = useState([true]);
  const [timer, setTimer] = useState(3);
  const [sendNotification, setSendNotification] = useState(true);
  const [numberOfOrders, setNumberOfOrders] = useState([]);
  const [error, setError] = useState("");
  const [order, orderDetail] = useState({});
  const [type, setType] = useState("Add");
  const navigate = useNavigate();
  const { orderId, resellerId, customerId, typeValue } = useParams();
  const location = useLocation();
  const [serviceCoverage, setServiceCoverage] = useState([]);
  const [coverage, setCoverage] = useState([]);

  useEffect(() => {
    if (orderId || resellerId || customerId) {
      console.log("orderId", typeValue);
      getDealerSettingsDetails(undefined);
      setLoading1(true);
      return () => clearTimeout(timer);
    }
  }, [orderId, resellerId, customerId]);

  const period = [
    { label: "Monthly", value: "Monthly" },
    { label: "Annually", value: "Annually" },
  ];
  const optiondeductibles = [
    { label: "$", value: "amount" },
    { label: "%", value: "percentage" },
  ];

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

  const downloadCSVTemplate = async () => {
    window.open(
      "https://docs.google.com/spreadsheets/d/1IKZGYxlL4Bo3ifJsDR2QCqmVcwq5XwOQ/edit?pli=1&gid=1553032734#gid=1553032734",
      "_blank"
    );
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  useEffect(() => {
    console.log(location);
    if (location.pathname.includes("/editOrder")) {
      // setLoading1(true);
    }
    if (location.pathname == "/dealer/addOrder") {
      setType("Add");
      setCurrentStep(1);
      formik.resetForm();
      setNumberOfOrders([]);
      setSelected([]); //add this
      setFileValues([]);
      formikStep2.resetForm();
      formikStep3.resetForm();
      formik4.resetForm();
    }
  }, [location]);
  const getTermListData = async () => {
    try {
      const res = await getTermList();
      setTermList(
        res.result.terms.map((item) => ({
          label: item.terms + " Months",
          value: item.terms,
        }))
      );
    } catch (error) {
      console.error("Error fetching category list:", error);
    }
  };

  const getServicerList = async (data) => {
    try {
      const result = await getServicerListInOrdersforDealerPortal(data);
      const filteredServicers = result.result;
      console.log(filteredServicers);

      const isResellerIdEmpty = data?.resellerId == "";
      console.log(formik.values.servicerId);

      if (!isResellerIdEmpty && formik.values.servicerId) {
        const matchedServicer = filteredServicers.find(
          (res) => res._id === formik.values.servicerId
        );

        formik.setFieldValue(
          "servicerId",
          matchedServicer ? matchedServicer._id : ""
        );
      }

      const arr = filteredServicers.map((res) => ({
        label: res.name,
        value: res._id,
      }));
      setServicerData(arr);
    } catch (error) {
      console.error("Error fetching servicer list:", error);
      setLoading1(false);
    } finally {
      setLoading1(false);
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
        navigate(`/dealer/customerDetails/${customerId}`);
      } else if (resellerId) {
        navigate(`/dealer/resellerDetails/${resellerId}`);
      } else {
        navigate("/dealer/orderList");
      }
    }
    return () => clearInterval(intervalId);
  }, [isModalOpen, timer]);

  const getCustomerList = async (data) => {
    // setLoading1(true);
    let arr = [];
    try {
      const resellerId = data?.resellerId == null ? "" : data.resellerId;
      const result = await getCustomerListforDealerPortal({
        resellerId: resellerId,
      });
      console.log(result);
      result?.result?.map((res) => {
        arr.push({
          label: res?.username,
          value: res?._id,
          customerData: res,
          emailKey: res?.email,
        });
      });
      setCustomerList(arr);
      // console.log(arr, "----customer");
    } catch (error) {
      console.error("Error occurred while fetching customer list:", error);
      setLoading1(false);
    } finally {
      //  setLoading1(false);
      console.log("customer api ");
    }
  };

  //add this line
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

  const getResellerList = async (id) => {
    setLoading1(true);
    let arr = [];
    try {
      const result = await getResellerListforDealerPortal({});
      result?.result?.map((res) => {
        // console.log("ssssssssssssssssssssss", res.resellerData.status);
        if (res.resellerData.status) {
          // Check if status is true
          arr.push({
            label: res.resellerData.name,
            value: res.resellerData._id,
          });
        }
      });
      setResllerList(arr);
    } catch (error) {
      console.error("Error occurred while fetching reseller list:", error);
      setLoading1(false);
    } finally {
    }
  };

  useEffect(() => {
    console.log(orderId);
    if (orderId != undefined) {
      orderDetails();
      setType("Edit");
    } else {
      getDealerSettingsDetails(undefined);
      setType("Add");
    }
    if (resellerId && customerId == undefined) {
      formik.setFieldValue("resellerId", resellerId);
      getResellerList();
      getCustomerList({
        resellerId: resellerId,
      });
      getServicerList({
        resellerId: resellerId,
      });
      // getCategoryList(
      //   {
      //     priceBookId: "",
      //     priceCatId: "",
      //     pName: "",
      //     term: "",
      //     coverageType: formikStep2?.values?.coverageType,
      //   },
      //   0
      // );
    }
    if (customerId) {
      formik.setFieldValue("customerId", customerId);
      formik.setFieldValue("resellerId", resellerId);
      getResellerList();
      getCustomerList({
        resellerId: resellerId,
      });
      getServicerList({
        resellerId: resellerId,
      });
      getCategoryList(
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
        0
      );
    } else if (
      orderId == undefined &&
      resellerId == undefined &&
      customerId == undefined
    ) {
      getResellerList();
      getServicerList();
      getCustomerList();
      getCategoryList(
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
        0
      );
    }
    // getProductList()
    getTermListData();
    getServiceCoverage();
  }, [orderId, resellerId, customerId]);

  const orderDetails = async () => {
    setLoading1(true);
    const result = await orderDetailsById(orderId);
    console.log(result.result);
    setSelected(result.result.coverageType);
    getResellerList();
    getCustomerList({
      resellerId: result?.result?.resellerId,
    });
    getServicerList({
      resellerId: result?.result?.resellerId,
    });
    getServiceCoverage(undefined, "Edit");
    //     console.log (result.result.paymentStatus)
    // alert (result.result.paymentStatus)
    formik4.setFieldValue("paymentStatus", result.result.paymentStatus);
    formik4.setFieldValue("paidAmount", result.result.paidAmount);
    formik4.setFieldValue("dueAmount", result.result.dueAmount);
    result?.result?.productsArray?.forEach((product, index) => {
      getCategoryList(
        {
          priceBookId: product.priceBookId,
          priceCatId: product.categoryId,
          term: product.term,
          pName: product.pName,
          dealerSku: "",
          coverageType: result?.result?.coverageType.map((item) => item.value),
        },
        index
      );
      if (product.orderFile.name != "") {
        setFileValues((prevFileValues) => {
          const newArray = [...prevFileValues];
          newArray[index] = product.orderFile;
          return newArray;
        });
      } else {
        setFileValues((prevFileValues) => {
          const newArray = [...prevFileValues];
          newArray[index] = null;
          return newArray;
        });
      }

      setNumberOfOrders((prevFileValues) => {
        const newArray = [...prevFileValues];
        newArray[index] = product.noOfProducts;

        return newArray;
      });
    });
    orderDetail(result.result);
    formik.setFieldValue("servicerId", result?.result?.servicerId);
    formik.setFieldValue("billTo", result?.result?.billDetail?.billTo);
    formik.setFieldValue("name", result?.result?.billDetail?.detail?.name);
    formik.setFieldValue(
      "address",
      result?.result?.billDetail?.detail?.address
    );
    formik.setFieldValue(
      "phoneNumber",
      result?.result?.billDetail?.detail?.phoneNumber
    );
    formikStep3.setValues({
      ...formikStep3.values,
      productsArray: result?.result?.productsArray?.map((product, index) => ({
        categoryId: product.categoryId || "",
        priceBookId: product.priceBookId || "",
        unitPrice: product.unitPrice || null,
        noOfProducts: product.noOfProducts || "",
        price: product.price || null,
        file: product.orderFile || "",
        coverageStartDate: product.coverageStartDate || "",
        coverageEndDate: product.coverageEndDate || "",
        description: product.description || "",
        term: product.term || "",
        pName: product.pName || "",
        adh: product.adh || 0,
        priceType: product.priceType || "",
        additionalNotes: product.additionalNotes || "",
        QuantityPricing: product.QuantityPricing || [],
        rangeStart: product.rangeStart || 0,
        rangeEnd: product.rangeEnd || 0,
        checkNumberProducts: product.checkNumberProducts || "",
        orderFile: product.orderFile || "",
        dealerSku: product.dealerSku || "",
        fileValue: "",
        priceBookDetails: product?.priceBookDetail || {},
        adhDays: product.adhDays || [],
        dealerPriceBookDetails: product?.dealerPriceBookDetail || {},
        noOfClaim: product?.noOfClaim || {},
        noOfClaimPerPeriod: product?.noOfClaimPerPeriod || 0,
        isManufacturerWarranty: product?.isManufacturerWarranty,
      })),
    });

    setClaimOver(
      result.result.productsArray?.map(
        (product) => product?.noOfClaim?.value === -1
      )
    );
    setClaimInCoveragePeriod(
      result.result.productsArray?.map(
        (product) => product?.noOfClaimPerPeriod === -1
      )
    );
    orderDetail(result.result);
    formik.setFieldValue("dealerId", result?.result?.dealerId);
    formik.setFieldValue("servicerId", result?.result?.servicerId);
    formik.setFieldValue("name", result?.result?.billDetail?.detail?.name);
    setSelectedFile2(result.result.termCondition);
    formikStep2.setFieldValue("termCondition", result.result.termCondition);
    formik.setFieldValue(
      "address",
      result?.result?.billDetail?.detail?.address
    );
    formik.setFieldValue(
      "phoneNumber",
      result?.result?.billDetail?.detail?.phoneNumber
    );
    formik.setFieldValue("email", result?.result?.billDetail?.detail?.email);
    formik.setFieldValue("billTo", result?.result?.billDetail?.billTo);
    formik.setFieldValue("customerId", result?.result?.customerId);
    formik.setFieldValue("resellerId", result?.result?.resellerId);
    formikStep2.setFieldValue(
      "dealerPurchaseOrder",
      result?.result?.venderOrder
    );
    formikStep2.setFieldValue(
      "serviceCoverageType",
      result?.result?.serviceCoverageType
    );
    formikStep2.setFieldValue("coverageType", result?.result?.coverageType);
    // coverageType: coverageType.map((item) => item.value),
  };

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
        oldDealerPurchaseOrder: order?.venderOrder,
      };

      const result = getStep2Validation(data).then((res) => {
        console.log(res);
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
          dealerSku: "",
          checkNumberProducts: "",
          fileValue: "",
          orderFile: {},
          priceBookDetails: {},
          dealerPriceBookDetails: {},
          adhDays: [], // add this
          noOfClaimPerPeriod: -1,
          noOfClaim: {
            period: "Monthly",
            value: -1,
          },
          isManufacturerWarranty: false,
        },
      ],
    },
    validationSchema: Yup.object().shape({
      productsArray: Yup.array().of(
        Yup.object().shape({
          categoryId: Yup.string().required("Required"),
          priceBookId: Yup.string().required("Required"),
          pName: Yup.string().required("Required"),
          term: Yup.string().required("Required"),
          // file: Yup.string().required("Valid File is required"),
          unitPrice: Yup.number()
            .typeError("Required")
            .required("Required")
            .nullable(),
          noOfProducts: Yup.number()
            .typeError("Must be a number")
            .required("Required")
            .integer("value should be an integer")
            .min(0, "value cannot be negative"),
          // additionalNotes: Yup.string().required("Required"),
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
              amountType: Yup.string().required(""),
            })
          ),
          QuantityPricing: Yup.array().when("priceType", {
            is: (value) => value === "Quantity Pricing",
            then: (schema) => {
              return schema
                .of(
                  Yup.object().shape({
                    // name: Yup.string().required("Required"),
                    // quantity: Yup.number().required("Required"),
                    value: Yup.number(),
                    enterQuantity: Yup.number()
                      .typeError("Required")
                      .required("Required")
                      .min(1, "Quantity cannot be Less Then Zero")
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
      setLoading5(true);
      console.log(values);
      checkMultipleEmailCheck(values);
      let arr = [];
      let arr1 = [];
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
      setCategoryName(arr);
      setPriceBookName(arr1);
      setTimeout(() => {
        setLoading5(false);
      }, 1000);
    },
  });

  const checkMultipleEmailCheck = (data) => {
    const formData = new FormData();
    const arr = data.productsArray.map((res) => res.file);
    data.productsArray.forEach((res, index) => {
      data.productsArray[index].fileValue =
        res.file !== "" && res.file?.name !== " ";
    });
    data.productsArray.forEach((res, index) => {
      let sumOfValues = 0;
      if (res.priceType === "Quantity Pricing") {
        sumOfValues = res.QuantityPricing.reduce(
          (sum, data) => sum + parseInt(data.enterQuantity),
          0
        );
      } else {
        sumOfValues = parseInt(res.noOfProducts);
      }
      data.productsArray[index].checkNumberProducts = sumOfValues;
    });

    let newValues = {
      ...data,
      file: arr,
    };

    if (type == "Edit") {
      let dataValue = {
        ...data,
      };
      checkEditFileValidations(dataValue).then((res) => {
        if (res.code == 200) {
          nextStep();
        } else {
          for (let key of res.message) {
            console.log("res", res.message);
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
          nextStep();
        } else {
          for (let key of res.message) {
            console.log("res", res.message);
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

  // add this
  useEffect(() => {
    if (type == "Add") {
      const selectedCoverages = formikStep2.values.coverageType;

      if (selectedCoverages.length) {
        const updatedProductsArray = selectedCoverages.map((data) => ({
          label: data.label,
          value: "00",
          value1: "",
        }));
        formikStep3.setFieldValue(
          "productsArray[0].adhDays",
          updatedProductsArray
        );
      }
    }
  }, [formikStep2.values.coverageType]);

  const handleInputClick = (index, event) => {
    // setloader(true)
    setFileValues((prevFileValues) => {
      const newArray = [...prevFileValues];
      newArray[index] = null;
      console.log(newArray);
      return newArray;
    });
    event.currentTarget.value = null;
    formikStep3.setFieldValue(`productsArray[${index}].file`, "");
    formikStep3.setFieldValue(`productsArray[${index}].orderFile`, {});
    // setloader(false);
  };
  const handleFileSelect = (event, index) => {
    setloader(true);
    // alert('hello');
    const file = event.target.files[0];
    if (file) {
      setFileValues((prevFileValues) => {
        const newArray = [...prevFileValues];
        if (newArray[index]) {
          newArray[index] = file;
        } else {
          newArray[index] = file;
        }
        console.log(newArray);
        return newArray;
      });

      fileInputRef.current[index].current.file = file;

      checkFileError(file, index);
    } else {
      formikStep3.setFieldError(`productsArray[${index}].file`, "");
      formikStep3.setFieldValue(`productsArray[${index}].file`, "");
      setFileValues((prevFileValues) => {
        const newArray = [...prevFileValues];
        newArray.splice(index, 1);
        console.log(newArray);
        return newArray;
      });
    }
    setTimeout(() => {
      setloader(false);
    }, 1000);
  };

  const checkFileError = async (file, index) => {
    // setloader(true)
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
    // setloader(false);
  };
  const calculateTotalAmount = (data) => {
    let totalAmount = 0;
    data.map((product, index) => {
      totalAmount += parseFloat(product.price);
    });
    return totalAmount.toFixed(2);
  };
  const formik4 = useFormik({
    initialValues: {
      paymentStatus: "Unpaid",
      paidAmount: 0.0,
    },
    onSubmit: (values) => {
      console.log(values);
      setLoading(true);

      const totalAmount = calculateTotalAmount(
        formikStep3.values.productsArray
      );
      console.log(totalAmount);
      const data = {
        ...formik.values,
        ...formikStep2.values,
        ...formikStep3.values,
        // paidAmount: values.paidAmount,
        dueAmount: parseFloat(totalAmount),
        sendNotification: sendNotification,
        paymentStatus: values.paymentStatus,
        orderAmount: parseFloat(totalAmount),
      };

      if (orderId != undefined) {
        editOrderforDealerPortal(orderId, data).then((res) => {
          if (res.code == 200) {
            openModal();
          } else {
            setError(res.message);
          }
          setLoading(false);
        });
      } else {
        addOrderforDealerPortal(data).then((res) => {
          if (res.code == 200) {
            openModal();
          } else {
            setError(res.message);
            console.log("here", res);
          }
          setLoading(false);
        });
      }
    },
  });

  useEffect(() => {
    fileInputRef.current = Array.from(
      { length: formikStep3.values.productsArray.length },
      () => createRef()
    );
  }, [formikStep3.values.productsArray.length]);

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
      coverageEndDate: "",
      description: "",
      term: "",
      priceType: "",
      additionalNotes: "",
      QuantityPricing: [],
      rangeStart: "",
      rangeEnd: "",
      checkNumberProducts: "",
      fileValue: "",
      pName: "",
      orderFile: {},
      adhDays: [],
      noOfClaimPerPeriod: "",
      noOfClaim: {},
      isManufacturerWarranty: false,
    };
    getCategoryList(
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

  // const handleDeleteProduct = (index) => {
  //   const updatedProduct = [...formikStep3.values.productsArray];
  //   updatedProduct.splice(index, 1);
  //   formikStep3.setFieldValue("productsArray", updatedProduct);
  // };
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

    console.log(formikStep3.values.productsArray, updatedProduct);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };
  const [BillCheck, setbillCheck] = useState();
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openError = () => {
    setIsErrorOpen(true);
  };

  const closeError = () => {
    setIsErrorOpen(false);
  };

  const handleSelectChange2 = async (name, selectedValue) => {
    if (name.includes("categoryId")) {
      const match = name.match(/\[(\d+)\]/);
      if (!match) {
        return;
      }

      formikStep3.setFieldValue(
        `productsArray[${match[1]}].categoryId`,
        selectedValue
      );
      formikStep3.setFieldValue(`productsArray[${match[1]}].priceBookId`, "");
      formikStep3.setFieldValue(`productsArray[${match[1]}].term`, "");
      formikStep3.setFieldValue(`productsArray[${match[1]}].price`, "");
      formikStep3.setFieldValue(`productsArray[${match[1]}].noOfProducts`, "");
      formikStep3.setFieldValue(`productsArray[${match[1]}].unitPrice`, "");
      formikStep3.setFieldValue(`productsArray[${match[1]}].description`, "");
      formikStep3.setFieldValue(`productsArray[${match[1]}].rangeEnd`, "");
      formikStep3.setFieldValue(`productsArray[${match[1]}].rangeStart`, "");
      formikStep3.setFieldValue(`productsArray[${match[1]}].priceType`, "");
      if (match) {
        setNumberOfOrders((prevFileValues) => {
          const newArray = [...prevFileValues];
          newArray.splice(match[1], 1);
          console.log(newArray);
          return newArray;
        });
        getCategoryList(
          {
            priceCatId: selectedValue,
            pName: "",
            term: "",
            dealerSku: "",
            priceBookId: "",
            coverageType: formikStep2?.values?.coverageType.map(
              (item) => item.value
            ),
          },
          match[1]
        );
      }
    }
    if (name.includes("priceBookId")) {
      const match = name.match(/\[(\d+)\]/);
      const data = productNameOptions[match[1]].data.find((value) => {
        return value.value === selectedValue;
      });
      const data1 = data.dealerPriceBookDetails.find(
        (value) => value.priceBook === selectedValue
      );
      if (data1) {
        setClaimOver((prevState) => {
          const newClaimOver = [...prevState];
          newClaimOver[match[1]] = data1?.noOfClaim?.value === -1;
          return newClaimOver;
        });
        setClaimInCoveragePeriod((prevState) => {
          const newClaimInCoveragePeriod = [...prevState];
          newClaimInCoveragePeriod[match[1]] = data1?.noOfClaimPerPeriod === -1;
          return newClaimInCoveragePeriod;
        });
        formikStep3.setFieldValue(
          `productsArray[${match[1]}].adhDays`,
          data1.adhDays
        );
        formikStep3.setFieldValue(
          `productsArray[${match[1]}].noOfClaim`,
          data1.noOfClaim
        );
        formikStep3.setFieldValue(
          `productsArray[${match[1]}].noOfClaimPerPeriod`,
          data1.noOfClaimPerPeriod
        );

        formikStep3.setFieldValue(
          `productsArray[${match[1]}].isManufacturerWarranty`,
          data1.isManufacturerWarranty
        );
      }

      console.log(data);
      getCategoryList(
        {
          priceCatId: formikStep3.values.productsArray[match[1]].categoryId,
          priceBookId: selectedValue,
          coverageType: formikStep2?.values?.coverageType.map(
            (item) => item.value
          ),
          dealerSku: "",
          pName:
            selectedValue == ""
              ? ""
              : formikStep3.values.productsArray[match[1]].pName,
          term:
            selectedValue == ""
              ? ""
              : formikStep3.values.productsArray[match[1]].term,
        },
        match[1]
      );

      const updatedQuantityPricing = data?.quantityPriceDetail.map(
        (item, index) => {
          const updatedItem = {
            ...item,
            enterQuantity: "",
          };
          console.log(index);
          formikStep3.setFieldError(
            `productsArray[${match[1]}].QuantityPricing[${index}].enterQuantity`,
            ""
          );
          return updatedItem;
        }
      );

      formikStep3.setFieldValue(
        `productsArray[${match[1]}].QuantityPricing`,
        updatedQuantityPricing
      );
      formikStep3.setFieldValue(`productsArray[${match[1]}].price`, "");
      formikStep3.setFieldValue(`productsArray[${match[1]}].noOfProducts`, "");
      formikStep3.setFieldValue(
        `productsArray[${match[1]}].priceType`,
        data?.priceType
      );
      formikStep3.setFieldValue(
        `productsArray[${match[1]}].priceType`,
        data?.priceType
      );
      formikStep3.setFieldValue(
        `productsArray[${match[1]}].description`,
        data?.description
      );
      formikStep3.setFieldValue(
        `productsArray[${match[1]}].rangeEnd`,
        data?.rangeEnd
      );
      formikStep3.setFieldValue(
        `productsArray[${match[1]}].rangeStart`,
        data?.rangeStart
      );
      formikStep3.setFieldValue(
        `productsArray[${match[1]}].dealerSku`,
        data?.dealerSku
      );
      formikStep3.setFieldValue(
        `productsArray[${match[1]}].adhDays`,
        data.adhDays
      );
      formikStep3.setFieldValue(
        `productsArray[${match[1]}].unitPrice`,
        data?.wholesalePrice
      );
      formikStep3.setFieldValue(`productsArray[${match[1]}].term`, data?.term);
      formikStep3.setFieldValue(
        `productsArray[${match[1]}].pName`,
        data?.pName
      );
    }
    if (name.includes("term")) {
      const match = name.match(/\[(\d+)\]/);
      console.log(
        "formikStep3.values.productsArray[match[1]].pName",
        formikStep3.values.productsArray[match[1]].pName
      );
      // updateProductFields(selectedValue);
      getCategoryList(
        {
          priceCatId: formikStep3.values.productsArray[match[1]].categoryId,
          priceBookId: formikStep3.values.productsArray[match[1]].priceBookId,
          term: selectedValue,
          dealerSku: "",
          pName:
            formikStep3.values.productsArray[match[1]].pName == undefined
              ? ""
              : formikStep3.values.productsArray[match[1]].pName,
          coverageType: formikStep2?.values?.coverageType.map(
            (item) => item.value
          ),
        },
        match[1]
      );

      // console.log(name,selectedValue)
    }
    if (name.includes("pName")) {
      const match = name.match(/\[(\d+)\]/);
      // updateProductFields(selectedValue);
      getCategoryList(
        {
          priceCatId: formikStep3.values.productsArray[match[1]].categoryId,
          priceBookId: formikStep3.values.productsArray[match[1]].priceBookId,
          pName: selectedValue,
          dealerSku: "",
          term: formikStep3.values.productsArray[match[1]].term,
          coverageType: formikStep2?.values?.coverageType.map(
            (item) => item.value
          ),
        },
        match[1]
      );
    }
    formikStep3.setFieldValue(name, selectedValue);
  };

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
    const maxSize = 10048576; // 10MB in bytes

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
  useEffect(() => {
    for (let i = 0; i < formikStep3.values.productsArray.length; i++) {
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
          console.log(newArray);
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
    if (name == "coverageType") {
      getCategoryList(
        {
          priceBookId: "",
          priceCatId: "",
          pName: "",
          term: "",
          dealerSku: "",
          coverageType: value.map((item) => item.value),
        },
        0
      );
      formikStep3.resetForm();
    }
    formikStep2.setFieldValue(name, value);
  };
  const handleInputClickResetStep1 = () => {
    const currentValues = formik.values;
    const newValues = { ...formik.initialValues };

    // if ((dealerId && dealerValue) || window.location.pathname.includes("/editOrder")) {
    //   newValues.dealerId = currentValues.dealerId;
    //   newValues.dealerId = currentValues.dealerValue;
    // }

    if (resellerId) {
      Object.assign(newValues, {
        dealerId: currentValues.dealerId,
        dealerValue: currentValues.dealerValue,
        resellerId: currentValues.resellerId,
      });
    }

    if (customerId) {
      Object.assign(newValues, {
        dealerId: currentValues.dealerId,
        dealerValue: currentValues.dealerValue,
        resellerId: currentValues.resellerId,
        customerId: currentValues.customerId,
      });
    }

    formik.resetForm({ values: newValues });
  };

  const handleSelectChange = (name, value) => {
    formik.handleChange({ target: { name, value } });
    console.log(name, value, "onchange------------------->>");
    if (name == "resellerId") {
      if (value == "") {
        formik.setFieldValue("billTo", "Dealer");
      }
      getCustomerList({
        resellerId: value,
      });
      formik.setFieldValue("customerId", "");

      let data = {
        resellerId: value,
      };
      getServicerList(data);
    }
    if (name == "customerId") {
      let data = {
        resellerId: formik.values.resellerId,
      };

      customerList.length &&
        customerList.find((res) => {
          if (res.value == value) {
            if (res.customerData.resellerId != null);
            formik.setFieldValue("resellerId", res.customerData.resellerId);
            let data = {
              resellerId: res.customerData.resellerId,
            };
            // getServicerList(data);
            // getCustomerList(data);
          }
        });
    }
    if (value === "Custom") {
      formik.setFieldValue("name", "");
      formik.setFieldValue("email", "");
      formik.setFieldValue("phoneNumber", "");
      formik.setFieldValue("address", "");
    }
  };

  const BillTo = [
    { label: "Self", value: "Dealer" },
    ...(formik.values.resellerId !== "" && formik.values.resellerId !== null
      ? [{ label: "Reseller", value: "Reseller" }]
      : []),
    { label: "Custom", value: "Custom" },
  ];
  const getServiceCoverage = async (value, type = "Add") => {
    const result = await getServiceCoverageDetails(value);
    let serviceCoverage = [];

    if (type == "Edit") {
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

    console.log(coverage, serviceCoverage, type);
    setCoverage(result?.result?.coverageType);
    setServiceCoverage(serviceCoverage);
  };

  const getCategoryList = async (data, index) => {
    try {
      setLoading3(true);
      const result = await getCategoryAndPriceBooksforDealerPortal(data);
      if (data.priceBookId !== "" && data.priceCatId === "") {
        formikStep3.setFieldValue(
          `productsArray[${index}].categoryId`,
          result.result.selectedCategory._id
        );
        getCategoryList(
          {
            priceBookId: data.priceBookId,
            priceCatId: result.result.selectedCategory._id,
            coverageType: formikStep2?.values?.coverageType.map(
              (item) => item.value
            ),
            term: data.term,
            dealerSku: "",
            pName: data.pName,
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
        const dealerPriceBookDetails = result.result?.dealerPriceBook;

        const priceBooksData = result.result?.priceBooks.map((item) => ({
          label: item.dealerSku,
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
          dealerSku: item.dealerSku, // add this
          dealerPriceBookDetails: dealerPriceBookDetails,
          adhDays: result.result.mergedData,
        }));

        const category = result.result?.priceCategories.map((item) => ({
          label: item.name,
          value: item._id,
        }));

        const termsData = result.result?.terms.map((item) => ({
          label: item.label,
          value: item.value,
        }));

        const productListData = result.result?.priceBooks.map((item) => ({
          label: item.pName,
          value: item.pName,
        }));

        updateOptions(setCategoryList, category);
        updateOptions(setProductNameOptions, priceBooksData);
        updateOptions(setTermList, termsData);
        updateOptions(setProductList, productListData);
      }
    } catch (error) {
      setLoading3(false);
      // setLoading1(false);
    } finally {
      setLoading3(false);
      // setLoading1(false);
    }
  };
  const handleInputClickReset = (index) => {
    const updatedProductsArray = formikStep3.values.productsArray.map(
      (product, i) => {
        if (i === index) {
          setFileValues((prevFileValues) => {
            const newArray = [...prevFileValues];
            newArray[index] = null;
            console.log(newArray);
            return newArray;
          });
          const newProduct = { ...product };
          Object.keys(newProduct).forEach((key) => {
            if (key === "unitPrice" || key === "price") {
              newProduct[key] = 0; // Resetting to 0
            } else if (Array.isArray(newProduct[key])) {
              newProduct[key] = [];
            } else if (
              typeof newProduct[key] === "object" &&
              newProduct[key] !== null
            ) {
              newProduct[key] = {};
            } else {
              newProduct[key] = "";
            }
          });
          return newProduct;
        }

        return product;
      }
    );

    formikStep3.setFieldValue("productsArray", updatedProductsArray);
    getCategoryList(
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
      index
    );
  };
  const renderStep1 = () => {
    return (
      <>
        {loading1 ? (
          <div className=" h-[400px] w-full flex py-5">
            <div className="self-center mx-auto">
              <RotateLoader color="#333" />
            </div>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <Card className="px-8 pb-8 pt-4 mb-8 drop-shadow-4xl border-[1px] border-Light-Grey rounded-xl">
              <Grid>
                <div className="col-span-8">
                  <div className="flex justify-between">
                    <p className="text-2xl font-bold mb-4">Order Details</p>
                    <Button
                      className="text-sm !py-0 h-[30px] self-center !bg-[white] !text-light-black !font-semibold !border-light-black !border-[1px]"
                      onClick={handleInputClickResetStep1}
                    >
                      Reset
                    </Button>
                  </div>
                  <Grid>
                    <div className="col-span-6">
                      <SelectBoxWIthSerach
                        // <Select
                        label="Reseller Name"
                        name="resellerId"
                        placeholder=""
                        className="!bg-white"
                        isDisabled={
                          resellerId ||
                          customerId ||
                          typeValue == "customer" ||
                          typeValue == "reseller"
                        }
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

                    <div className="col-span-6">
                      {/* <Select */}
                      {console.log(
                        servicerData.length,
                        "length ",
                        servicerData
                      )}
                      <SelectBoxWIthSerach
                        label="Servicer Name"
                        name="servicerId"
                        placeholder=""
                        className="!bg-white"
                        onChange={handleSelectChange}
                        // onChange={handleSelectChange}
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
                      {/* <Select */}
                      <SelectBoxWIthSerach
                        label="Customer Name"
                        name="customerId"
                        placeholder=""
                        isDisabled={customerId || typeValue == "customer"}
                        className="!bg-white"
                        // onChange={handleSelectChange}
                        onChange={handleSelectChange}
                        options={customerList}
                        value={
                          customerList.length == 0
                            ? ""
                            : formik.values.customerId
                        }
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    <div className="col-span-4">
                      <SelectBoxWIthSerach
                        label="Bill Address"
                        name="billTo"
                        placeholder=""
                        className={`!bg-white`}
                        disableFirstOption={true}
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
                  <p className="text-2xl font-bold my-4">Bill Details : </p>
                  <Grid>
                    <div className="col-span-4">
                      <Input
                        name="name"
                        label="Name"
                        type="text"
                        className="bg-white"
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
                        name="email"
                        label="Email"
                        className="bg-white"
                        type="email"
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
                        name="phoneNumber"
                        label="Phone Number"
                        className="bg-white"
                        type="number"
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
                        name="address"
                        label="Address"
                        className="bg-white"
                        type="text"
                        placeholder=""
                        required={true}
                        value={formik.values.address}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={formik.touched.address && formik.errors.address}
                      />
                    </div>
                  </Grid>
                </div>
              )}
            </Card>
            <div className="flex">
              <Button
                type="submit"
                className="!mr-3"
                onClick={() => {
                  console.log(formik.values);
                }}
              >
                Next
              </Button>
            </div>
          </form>
        )}
      </>
    );
  };

  const renderStep2 = () => {
    // Step 2 content
    return (
      <>
        <Card className="px-8 pb-8 pt-4 mb-8 drop-shadow-4xl border-[1px] border-Light-Grey  rounded-xl">
          <p className="text-2xl font-bold mb-4">Dealer Order Details</p>
          <Grid>
            <div className="col-span-10">
              <Grid>
                <div className="col-span-6">
                  <div className="col-span-12 mt-4">
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
                    placeholder=""
                    className="!bg-white"
                    disabled={type == "Edit"}
                    className1={`${
                      type == "Edit" ? "!bg-[#ededed]" : "!bg-white"
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
                  <div className={`relative `}>
                    <label
                      htmlFor="coverageType"
                      className={`absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1  left-2 px-1 -translate-y-4 scale-75 bg-white z-10`}
                    >
                      Coverage Type
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="block w-full text-base font-semibold bg-transparent rounded-lg border border-gray-300">
                      <MultiSelect
                        label="Coverage Type"
                        name="coverageType"
                        placeholder=""
                        className={`SearchSelect css-b62m3t-container red !border-[0px] p-[0.425rem]  ${
                          type == "Edit" ? "readonly !bg-[#ededed]" : ""
                        }`}
                        required={true}
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
        {loading14 || loading3 || loading5 ? (
          <div className=" h-[400px] w-full flex py-5">
            <div className="self-center mx-auto">
              <RotateLoader color="#333" />
            </div>
          </div>
        ) : (
          <>
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
                    <div className="col-span-8 border-r pr-5">
                      <Grid>
                        <div className="col-span-6">
                          <Select
                            name={`productsArray[${index}].categoryId`}
                            label="Product Category"
                            options={categoryList[index]?.data}
                            required={true}
                            className="!bg-white"
                            placeholder=""
                            value={
                              formikStep3.values.productsArray[index].categoryId
                            }
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
                            formikStep3.touched.productsArray[index]
                              .categoryId && (
                              <div className="text-red-500 text-sm pl-2 pt-2">
                                {formikStep3.errors.productsArray &&
                                  formikStep3.errors.productsArray[index] &&
                                  formikStep3.errors.productsArray[index]
                                    .categoryId}
                              </div>
                            )}
                        </div>
                        <div className="col-span-6">
                          <Select
                            name={`productsArray[${index}].priceBookId`}
                            label="Dealer SKU"
                            options={productNameOptions[index]?.data}
                            required={true}
                            className="!bg-white"
                            placeholder=""
                            value={
                              formikStep3.values.productsArray[index]
                                .priceBookId
                            }
                            onBlur={formikStep3.handleBlur}
                            onChange={handleSelectChange2}
                            index={index}
                            disabled={
                              formikStep3.values.productsArray[index]
                                .categoryId == ""
                            }
                            error={
                              formikStep3.values.productsArray &&
                              formikStep3.values.productsArray[index] &&
                              formikStep3.values.productsArray &&
                              formikStep3.values.productsArray[index] &&
                              formikStep3.values.productsArray[index]
                                .priceBookId
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
                        </div>
                        <div className="col-span-8">
                          <Select
                            label="Product Name"
                            name={`productsArray[${index}].pName`}
                            placeholder=""
                            onChange={handleSelectChange2}
                            disabled={
                              formikStep3.values.productsArray[index]
                                .categoryId == ""
                            }
                            className="!bg-white"
                            options={productList[index]?.data}
                            value={
                              formikStep3.values.productsArray[index].pName
                            }
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
                              placeholder=""
                              disabled={
                                formikStep3.values.productsArray[index]
                                  .categoryId == ""
                              }
                              value={
                                formikStep3.values.productsArray[index].term
                              }
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
                                    formikStep3.errors.productsArray[index]
                                      .term}
                                </div>
                              )}
                          </>
                        </div>
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
                              formikStep3.values.productsArray[index]
                                .noOfProducts
                            }
                            onChange={(e) => {
                              const unitPrice =
                                formikStep3.values.productsArray[index]
                                  .unitPrice;
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
                              formikStep3.values.productsArray[index]
                                .noOfProducts
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
                            value={
                              formikStep3.values.productsArray[index].price
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
                            type="date"
                            name={`productsArray[${index}].coverageStartDate`}
                            className="!bg-white"
                            label="Coverage Start Date"
                            placeholder=""
                            readOnly
                            value={
                              formikStep3.values.productsArray[index]
                                .coverageStartDate == ""
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
                            onChange={(e) => {
                              formikStep3.handleChange(e);
                              const selectedDate = new Date(e.target.value);
                              selectedDate.setDate(selectedDate.getDate());

                              const gmtDate = selectedDate.toISOString();
                              formikStep3.setFieldValue(
                                `productsArray[${index}].coverageStartDate`,
                                gmtDate
                              );
                              const termInMonths =
                                formikStep3.values.productsArray[index].term ||
                                0;
                              const newEndDate = addMonths(
                                selectedDate,
                                termInMonths
                              );
                              const formattedEndDate = newEndDate.toISOString();

                              formikStep3.setFieldValue(
                                `productsArray[${index}].coverageEndDate`,
                                formattedEndDate
                              );
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
                              formikStep3.values.productsArray[index]
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
                                  formikStep3.values.productsArray[index]
                                    .rangeEnd
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
                              formikStep3.values.productsArray[index]
                                .description
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
                          <Grid className="!grid-cols-3">
                            {formikStep3.values.productsArray[index]
                              .priceType === "Quantity Pricing" &&
                              (() => {
                                return formikStep3.values.productsArray[
                                  index
                                ].QuantityPricing.map((data, index1) => (
                                  <div
                                    className="bg-grayf9 p-4 relative rounded-xl"
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
                        {formikStep3.values.productsArray[index].dealerSku ===
                        "" ? (
                          ""
                        ) : (
                          <div className="col-span-12">
                            <Grid className=" mb-3">
                              {formikStep3.values.productsArray[index]
                                .adhDays &&
                                formikStep3.values.productsArray[
                                  index
                                ].adhDays.map((coverage, idx) => (
                                  <div
                                    className="col-span-4 capitalize"
                                    key={idx}
                                  >
                                    <div className="my-4">
                                      <Input
                                        type="text"
                                        name={`productsArray[${index}].adhDays[${idx}].waitingDays`}
                                        className="!bg-white"
                                        label={`${coverage.label} Days `}
                                        placeholder={`${coverage.label} Days`}
                                        value={
                                          formikStep3.values.productsArray[
                                            index
                                          ].adhDays[idx].waitingDays ?? 0
                                        }
                                        onChange={(e) =>
                                          formikStep3.setFieldValue(
                                            `productsArray[${index}].adhDays[${idx}].waitingDays`,
                                            e.target.value === ""
                                              ? 0
                                              : e.target.value
                                          )
                                        }
                                        onBlur={formikStep3.handleBlur}
                                      />
                                      {formikStep3.errors.productsArray &&
                                        formikStep3.errors.productsArray[
                                          index
                                        ] &&
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
                                          formikStep3.values.productsArray[
                                            index
                                          ].adhDays[idx].deductible ?? 0
                                        }
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          // Allow up to two decimal places
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
                                        formikStep3.errors.productsArray[
                                          index
                                        ] &&
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
                                ))}
                            </Grid>
                          </div>
                        )}
                        <div className="col-span-12">
                          <div className="relative">
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
                              className="block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold text-light-black bg-white rounded-lg border-[1px]  border-gray-300 appearance-none peer"
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
                                  <p className="self-center text-sm pr-3">
                                    {" "}
                                    {fileValues[index].name}
                                  </p>
                                  <p className="self-center text-sm">
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
                                <p className="text-[#5D6E66]">
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
                      <p className="text-[12px] mt-1 text-[#5D6E66] font-medium">
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

                      {formikStep3.values.productsArray[index].priceBookId ==
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
                                      value: 0,
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
                                  type="number"
                                  name={`productsArray[${index}].noOfClaim.value`}
                                  value={
                                    formikStep3?.values?.productsArray[index]
                                      ?.noOfClaim?.value
                                  }
                                  onBlur={formik.handleBlur}
                                  onChange={(e) =>
                                    formikStep3.setFieldValue(
                                      `productsArray[${index}].noOfClaim.value`,
                                      Number(e.target.value)
                                    )
                                  }
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
                                    0
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
                                  type="number"
                                  name={`productsArray[${index}].noOfClaimPerPeriod`}
                                  value={
                                    formikStep3?.values?.productsArray[index]
                                      ?.noOfClaimPerPeriod
                                  }
                                  onBlur={formik.handleBlur}
                                  onChange={(e) =>
                                    formikStep3.setFieldValue(
                                      `productsArray[${index}].noOfClaimPerPeriod`,
                                      Number(e.target.value)
                                    )
                                  }
                                />
                              </div>
                            </div>
                          )}

                          <div className="flex justify-between">
                            <p className=" text-[12px] mb-3 font-semibold">
                              {" "}
                              Is Include manufacturer <br /> warranty?
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
                        </div>
                      )}
                    </div>
                    <div className="col-span-12"></div>
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
          </>
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
            <Card className="px-8 pb-8 pt-4 mb-8 drop-shadow-4xl border-[1px] border-Light-Grey rounded-xl">
              <Grid>
                <div className="col-span-6">
                  <p className="text-2xl font-bold text-[#bbbbbc] mb-4">
                    Order Details
                  </p>
                  <Grid className="bg-grayf9 border-Light-Grey border rounded-xl px-4 ">
                    <div className="col-span-4 py-4 border-r">
                      <p className="text-[12px]">Reseller Name</p>
                      <p className="font-bold text-sm">{resellerName}</p>
                    </div>
                    <div className="col-span-4 py-4 border-r">
                      <p className="text-[12px]">Customer Name</p>
                      <p className="font-bold text-sm">{customerName}</p>
                    </div>
                    <div className="col-span-4 py-4 ">
                      <p className="text-[12px]">Servicer Name</p>
                      <p className="font-bold text-sm">{servicerName}</p>
                    </div>
                  </Grid>
                </div>
                <div className="col-span-6">
                  <p className="text-2xl font-bold text-[#bbbbbc] mb-4">
                    Dealer Order Details
                  </p>
                  <Grid className="bg-grayf9 !gap-2 border-Light-Grey border rounded-xl px-2 ">
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
                    <div className="col-span-5 py-4">
                      <p className="text-[12px]">Coverage Type</p>
                      <p className="font-bold text-sm">
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
                      </p>
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
                              <p className="text-[12px]">Dealer SKU</p>
                              <p className="font-bold text-sm">
                                {priceBookName[index]}
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
                              {
                                formikStep3?.values?.productsArray[index]
                                  ?.noOfClaim?.period
                              }{" "}
                              -{" "}
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
                              Is Include manufacturer warranty?
                            </p>
                          </div>
                          <p className="text-sm">
                            {formikStep3.values.productsArray[index]
                              .isManufacturerWarranty == true
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
                <div className="col-span-5 pt-2">
                  <p className="text-light-black flex text-sm font-semibold mt-3 mb-6">
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
                <div className="col-span-3"></div>
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
                <div className="col-span-12"></div>
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

  const handleGOBack = () => {
    navigate(-1);
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
              <Link to={"/"}>Home </Link> /{" "}
            </li>
            <li className="text-sm text-neutral-grey ml-1 font-Regular">
              {" "}
              {type} Order /{" "}
            </li>
            <li className="text-sm text-neutral-grey font-semibold ml-1 pt-[1px]">
              {" "}
              {type} Details{" "}
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
      {loading ? (
        <div className=" h-[400px] w-full flex py-5">
          <div className="self-center mx-auto">
            <RotateLoader color="#333" />
          </div>
        </div>
      ) : (
        <>{renderStep()}</>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center py-3">
          <img src={AddDealer} alt="email Image" className="mx-auto" />

          <p className="text-3xl mb-0 mt-4 font-semibold text-neutral-grey">
            {type == "Edit" ? "Update" : "Added"} Order
            <span className="text-light-black"> Successfully </span>
          </p>

          <p className="text-neutral-grey text-base font-medium mt-2">
            <b> {type == "Order " ? "" : "New Order"} </b>{" "}
            {type == "Edit" ? "Updated" : "Added"} Successfully
          </p>
          <p className="text-neutral-grey text-base font-medium mt-2">
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

          <p className="text-3xl mb-0 mt-4 font-semibold text-neutral-grey">
            <span className="text-light-black"> Error </span>
          </p>

          <p className="text-neutral-grey text-base font-medium mt-2">
            Some Errors Please Check Form Validations
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default DealerAddOrder;
