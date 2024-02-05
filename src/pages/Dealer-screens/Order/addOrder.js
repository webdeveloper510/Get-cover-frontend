import React, { createRef, useEffect, useRef, useState } from "react";
import Headbar from "../../../common/headBar";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "../../../common/select";
import Grid from "../../../common/grid";
import Input from "../../../common/input";
import { format, addMonths } from "date-fns";
// Media Include
import BackImage from "../../../assets/images/icons/backArrow.svg";
import cross from "../../../assets/images/icons/CrossButton.svg";
import disapproved from "../../../assets/images/Disapproved.png";
import csvFile from "../../../assets/images/icons/csvFile.svg";
import AddDealer from "../../../assets/images/dealer-book.svg";
import Delete from "../../../assets/images/icons/DeleteIcon.svg";
import check from "../../../assets/images/icons/check.svg";
import Button from "../../../common/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getDealersList,
  getProductListbyProductCategoryId,
} from "../../../services/dealerServices";
import { getServicerListByDealerId } from "../../../services/servicerServices";
import { getCustomerListByDealerIdAndResellerId } from "../../../services/customerServices";
import Dropbox from "../../../assets/images/icons/dropBox.svg";
import {
  getCategoryListActiveData,
  getTermList,
} from "../../../services/priceBookService";
import RadioButton from "../../../common/radio";
import {
  addOrder,
  checkMultipleFileValidation,
  fileValidation,
  getCategoryAndPriceBooks,
  getServicerListInOrders,
  getStep2Validation,
  orderDetailsById,
} from "../../../services/orderServices";
import Modal from "../../../common/model";
import { getResellerListByDealerId } from "../../../services/reSellerServices";
import Cross from "../../../assets/images/Cross.png";
import { RotateLoader } from "react-spinners";
import SelectBoxWIthSerach from "../../../common/selectBoxWIthSerach";

function DealerAddOrder() {
  const [productNameOptions, setProductNameOptions] = useState([]);
  const [dealerName, setDealerName] = useState("");
  const [servicerName, setServicerName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [resellerName, setResellerName] = useState("");
  const [termList, setTermList] = useState([]);
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
  const [loading, setLoading] = useState(false);
  const [fileValues, setFileValues] = useState([]);
  const [timer, setTimer] = useState(3);
  const [sendNotification, setSendNotification] = useState(true);
  const [numberOfOrders, setNumberOfOrders] = useState([]);
  const [error, setError] = useState("");
  const [order, orderDetail] = useState({});
  const navigate = useNavigate();
  const { orderId } = useParams();

  const downloadCSVTemplate = async () => {
    window.open(
      "https://docs.google.com/spreadsheets/d/1BKGAJLFhjQXN8Wg4nYkUdFKpiPZ3h12-CMlrlkzAZE0/edit#gid=0",
      "_blank"
    );
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

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

  const getDealerListData = async () => {
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
  };

  const getServicerList = async (data) => {
    let arr = [];

    const result = await getServicerListInOrders(data);
    console.log(result);

    const filteredServicers = result.result;
    filteredServicers?.map((res) => {
      arr.push({
        label: res.name,
        value: res._id,
      });
    });
    setServicerData(arr);
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
      navigate("/orderList");
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
    console.log(result);
    result?.result?.map((res) => {
      console.log(res);
      arr.push({
        label: res?.username,
        value: res?._id,
        customerData: res,
      });
    });
    setCustomerList(arr);
  };

  const getResellerList = async (id) => {
    console.log(id);

    let arr = [];
    const result = await getResellerListByDealerId({}, id);
    result?.result?.map((res) => {
      console.log(res);
      arr.push({
        label: res.resellerData.name,
        value: res.resellerData._id,
      });
    });
    setResllerList(arr);
  };

  useEffect(() => {
    console.log(orderId);
    if (orderId != undefined) {
      orderDetails();
    }
    getDealerListData();
    // getProductList()
    getTermListData();
  }, []);
  const orderDetails = async () => {
    const result = await orderDetailsById(orderId);
    console.log(result.result);
    getResellerList(result?.result?.dealerId);
    getCustomerList({
      dealerId: result?.result?.dealerId,
      resellerId: result?.result?.resellerId,
    });
    getServicerList({
      dealerId: result?.result?.dealerId,
      resellerId: result?.result?.resellerId,
    });
    orderDetail(result.result);
    formik.setFieldValue("dealerId", result?.result?.dealerId);
    formik.setFieldValue("servicerId", result?.result?.servicerId);
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
      dealerId: "",
      servicerId: "",
      customerId: "",
      resellerId: "",
    },
    validationSchema: Yup.object().shape({
      dealerId: Yup.string().required("Dealer Name is required"),
    }),
    onSubmit: (values) => {
      console.log(values.error);
      nextStep();
      const foundDealer = dealerList.find(
        (data) => data.value === values.dealerId
      );
      setDealerName(foundDealer ? foundDealer.label : "");

      if (values.servicerId) {
        const foundServicer = servicerData.find(
          (data) => data.value === values.servicerId
        );
        setServicerName(foundServicer ? foundServicer.label : "");
      }
      if (values.customerId) {
        const foundCustomer = customerList.find(
          (data) => data.value === values.customerId
        );
        setCustomerName(foundCustomer ? foundCustomer.label : "");
      }
      if (values.resellerId) {
        const foundReseller = resellerList.find(
          (data) => data.value === values.resellerId
        );
        setResellerName(foundReseller ? foundReseller.label : "");
      }
    },
  });

  const formikStep2 = useFormik({
    initialValues: {
      dealerPurchaseOrder: "",
      serviceCoverageType: "",
      coverageType: "",
    },
    validationSchema: Yup.object().shape({
      dealerPurchaseOrder: Yup.string().required(
        "Dealer Purchase Order is Required"
      ),
      serviceCoverageType: Yup.string().required(
        "Service Coverage Type is Required"
      ),
      coverageType: Yup.string().required("Coverage Type is Required"),
    }),
    onSubmit: (values) => {
      let data = {
        dealerPurchaseOrder: values.dealerPurchaseOrder,
        dealerId: formik.values.dealerId,
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
          priceType: "",
          additionalNotes: "",
          coverageEndDate: "",
          QuantityPricing: [],
          rangeStart: "",
          rangeEnd: "",
          checkNumberProducts: "",
          anil: 100,
        },
      ],
    },
    validationSchema: Yup.object().shape({
      productsArray: Yup.array().of(
        Yup.object().shape({
          categoryId: Yup.string().required("Required"),
          priceBookId: Yup.string().required("Required"),
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
      console.log(values);
      checkMultipleEmailCheck(values);

      let arr = [];
      let arr1 = [];

      values.productsArray.map((data, index) => {
        const value = categoryList.find((val) => val.value === data.categoryId);
        arr.push(value ? value.label : "");
        const value1 = productNameOptions
          .map((val) => ({
            ...val,
            data: val.data.filter((res) => res.value === data.priceBookId),
          }))
          .filter((value) => value.data.length > 0)[0].data[0];
        arr1.push(value1 ? value1.label : "");
      });
      setCategoryName(arr);
      setPriceBookName(arr1);
    },
  });

  const checkMultipleEmailCheck = (data) => {
    // setLoading(true);
    const formData = new FormData();
    const arr = [];
    let arrayOfObjects = data.productsArray.map((res, index) => {
      console.log(res);
      arr.push(res.file);
    });
    data.productsArray.map((res, index) => {
      let sumOfValues = 0;
      if (res.priceType == "Quantity Pricing") {
        res.QuantityPricing.map((data) => {
          let value = parseInt(data.enterQuantity);

          sumOfValues += value;
          console.log(parseInt(sumOfValues));
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
      file: arr,
    };

    Object.entries(newValues).forEach(([key, value]) => {
      if (key === "file") {
        if (value) {
          value.forEach((val, index) => {
            formData.append(`file`, val);
          });
        } else {
          formData.append(`file`, null);
        }
      } else if (key === "productsArray") {
        value.forEach((item, index) => {
          Object.entries(item).forEach(([key1, value1]) => {
            if (key1 !== "file") {
              formData.append(`${key}[${index}][${key1}]`, value1);
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
        });
      } else {
        formData.append(key, value);
      }
    });

    console.log("formData", formData);
    checkMultipleFileValidation(formData).then((res) => {
      console.log(res);

      if (res.code == 200) {
        nextStep();
      } else {
        for (let key of res.message) {
          console.log(key.key);
          setIsErrorOpen(true);
          // setLoading(false);
          formikStep3.setFieldError(
            `productsArray[${key.key - 1}].file`,
            key.message
          );
        }
      }
    });
    // console.log(data)
  };

  const fileInputRef = useRef([]);

  const handleFileSelect = (event, index) => {
    console.log(index);
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
  };

  const checkFileError = async (file, index) => {
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
      formikStep3.setFieldError(`productsArray[${index}].file`, "");
    }
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
      paidAmount: "",
      pendingAmount: 0.0,
    },
    validationSchema: Yup.object().shape({
      paidAmount: Yup.number().when("paymentStatus", {
        is: (status) => status === "PartlyPaid",
        then: (schema) =>
          schema
            .min(1, "Paid amount cannot be less than 1")
            .max(
              calculateTotalAmount(formikStep3.values.productsArray),
              "Paid amount cannot be more than the total amount"
            )
            .required("Paid Amount is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    onSubmit: (values) => {
      console.log(values);
      setLoading(true);
      const arr = [];
      formikStep3.values.productsArray.map((res, index) => {
        arr.push(res.file);
      });
      const totalAmount = calculateTotalAmount(
        formikStep3.values.productsArray
      );
      console.log(totalAmount);
      const data = {
        ...formik.values,
        ...formikStep2.values,
        ...formikStep3.values,
        paidAmount: values.paidAmount,
        file: arr,
        dueAmount: values.pendingAmount,
        sendNotification: sendNotification,
        paymentStatus: values.paymentStatus,
        orderAmount: parseFloat(totalAmount),
      };
      const formData = new FormData();
      console.log("--------------data", data);
      Object.entries(data).forEach(([key, value]) => {
        if (key === "file") {
          if (value) {
            value.forEach((val, index) => {
              formData.append(`file`, val);
            });
          } else {
            formData.append(`file`, null);
          }
        } else if (key === "productsArray") {
          value.forEach((item, index) => {
            Object.entries(item).forEach(([key1, value1]) => {
              // if (!Array.isArray(value1) ) {
              if (key1 !== "file") {
                formData.append(`${key}[${index}][${key1}]`, value1);
              } else {
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
          });
        } else {
          formData.append(key, value);
        }
      });
      console.log("here");
      addOrder(formData).then((res) => {
        if (res.code == 200) {
          setLoading(false);
          openModal();

          //  navigate('/orderList')
        } else {
          setLoading(false);
          setError(res.message);
          console.log("here", res);
        }
      });
      setLoading(false);
    },
  });

  const handlePaymentStatusChange = (e) => {
    const newPaymentStatus = e.target.value;
    if (newPaymentStatus === "Unpaid") {
      formik4.setFieldValue(
        "paidAmount",
        calculateTotalAmount(formikStep3.values.productsArray)
      );
      formik4.setFieldError("paidAmount", "");
      formik4.setFieldValue(
        "paidAmount",
        calculateTotalAmount(formikStep3.values.productsArray)
      );
      formik4.setFieldValue("pendingAmount", "0.00");
    } else {
      formik4.setFieldError("paidAmount", "");
    }

    // Update the paymentStatus field
    formik4.handleChange(e);
  };

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
      anil: 100,
    };
    getCategoryList(
      formik.values.dealerId,
      {
        priceBookId: "",
        priceCatId: "",
      },
      formikStep3.values.productsArray.length
    );

    formikStep3.setFieldValue("productsArray", [
      ...formikStep3.values.productsArray,
      productsArray,
    ]);
  };

  const handleDeleteProduct = (index) => {
    const updatedProduct = [...formikStep3.values.productsArray];
    updatedProduct.splice(index, 1);
    formikStep3.setFieldValue("productsArray", updatedProduct);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

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
          formik.values.dealerId,
          {
            priceCatId: selectedValue,
            priceBookId: formikStep3.values.productsArray[match[1]].priceBookId,
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
      getCategoryList(
        formik.values.dealerId,
        {
          priceCatId: formikStep3.values.productsArray[match[1]].categoryId,
          priceBookId: selectedValue,
        },
        match[1]
      );
      console.log(formikStep3.values.productsArray[match[1]].categoryId);
      // formikStep3.setFieldValue(
      //   `productsArray[${match[1]}].QuantityPricing`,
      //   data.quantityPriceDetail
      // );
      const updatedQuantityPricing = data.quantityPriceDetail.map(
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
        data.priceType
      );
      formikStep3.setFieldValue(
        `productsArray[${match[1]}].priceType`,
        data.priceType
      );
      formikStep3.setFieldValue(
        `productsArray[${match[1]}].description`,
        data.description
      );
      formikStep3.setFieldValue(
        `productsArray[${match[1]}].rangeEnd`,
        data.rangeEnd
      );
      formikStep3.setFieldValue(
        `productsArray[${match[1]}].rangeStart`,
        data.rangeStart
      );

      formikStep3.setFieldValue(
        `productsArray[${match[1]}].unitPrice`,
        data.wholesalePrice
      );
      formikStep3.setFieldValue(`productsArray[${match[1]}].term`, data.term);
    }
    formikStep3.setFieldValue(name, selectedValue);
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
    formik4.setFieldValue(
      "paidAmount",
      calculateTotalAmount(formikStep3.values.productsArray)
    );
  }, [formikStep3.values.productsArray]);

  const handleSelectChange1 = (name, value) => {
    formikStep2.setFieldValue(name, value);
  };

  const handleSelectChange = (name, value) => {
    formik.handleChange({ target: { name, value } });
    if (name == "dealerId") {
      setProductNameOptions([]);
      formik.setFieldValue("servicerId", "");
      formik.setFieldValue("customerId", "");
      formik.setFieldValue("resellerId", "");
      formik.setFieldValue("dealerId", value);
      let data = {
        dealerId: value,
        resellerId: formik.values.resellerId,
      };
      getServicerList(data);
      getCustomerList({
        dealerId: value,
        resellerId: formik.values.resellerId,
      });
      getResellerList(value);
      getCategoryList(
        value,
        {
          priceBookId: "",
          priceCatId: "",
        },
        0
      );
    }
    if (name == "resellerId") {
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
            console.log("----", res.customerData.resellerId);
            if (res.customerData.resellerId != null);
            formik.setFieldValue("resellerId", res.customerData.resellerId);
            let data = {
              dealerId: formik.values.dealerId,
              resellerId: res.customerData.resellerId,
            };
            getServicerList(data);
            getCustomerList(data);
          }
        });
    }
  };

  const coverage = [
    { label: "Breakdown", value: "Breakdown" },
    { label: "Accidental", value: "Accidental" },
    { label: "Breakdown & Accidental", value: "Breakdown & Accidental" },
  ];

  const serviceCoverage = [
    { label: "Parts", value: "Parts" },
    { label: "Labour", value: "Labour" },
    { label: "Parts & Labour", value: "Parts & Labour" },
  ];

  const getCategoryList = async (value, data, index) => {
    console.log("here", data.priceBookId !== "", data.priceCatId === "");
    const result = await getCategoryAndPriceBooks(value, data);
    if (data.priceBookId !== "" && data.priceCatId === "") {
      formikStep3.setFieldValue(
        `productsArray[${index}].categoryId`,
        result.result.selectedCategory._id
      );
      getCategoryList(
        formik.values?.dealerId,
        {
          priceBookId: data.priceBookId,
          priceCatId: result.result.selectedCategory._id,
        },
        index
      );
    }
    console.log(result.result);
    setCategoryList(
      result.result?.priceCategories.map((item) => ({
        label: item.name,
        value: item._id,
      }))
    );
    if (formikStep3.values.productsArray.length !== 0) {
      console.log(
        "formikStep3.values.productsArray.length",
        formikStep3.values.productsArray.length
      );
      for (let i = 0; i < index + 1; i++) {
        console.log(i, index);
        setProductNameOptions((prevOptions) => {
          const newOptions = [...prevOptions];
          console.log(newOptions);

          newOptions[index] = {
            data: result.result?.priceBooks.map((item) => ({
              label: item.name,
              value: item._id,
              description: item.description,
              term: item.term,
              priceType: item.priceType,
              quantityPriceDetail: item.quantityPriceDetail,
              wholesalePrice: item?.retailPrice?.toFixed(2),
              status: item.status,
              rangeStart: item?.rangeStart?.toFixed(2),
              rangeEnd: item?.rangeEnd?.toFixed(2),
            })),
          };
          return newOptions;
        });
      }
    }
  };

  const calculatePendingAmount = (paidAmount) => {
    const totalAmount = calculateTotalAmount(formikStep3.values.productsArray);
    const pendingAmount = totalAmount - parseFloat(paidAmount) || 0; // Ensure a valid number
    formik4.setFieldValue("pendingAmount", pendingAmount.toFixed(2));
  };

  const renderStep1 = () => {
    return (
      <form onSubmit={formik.handleSubmit}>
        <div className="px-8 pb-8 pt-4 mb-8 drop-shadow-4xl bg-white border-[1px] border-[#D1D1D1]  rounded-xl">
          <p className="text-2xl font-bold mb-4">Order Details</p>
          <Grid>
            <div className="col-span-6">
              <Grid>
                <div className="col-span-6">
                  <SelectBoxWIthSerach
                    label="Dealer Name"
                    name="dealerId"
                    className="!bg-[#fff]"
                    onChange={handleSelectChange}
                    value={formik.values?.dealerId}
                    onBlur={formik.handleBlur}
                    error={formik.touched.dealerId && formik.errors.dealerId}
                    options={dealerList}
                  />

                  {formik.touched.dealerId && formik.errors.dealerId && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {formik.errors.dealerId}
                    </div>
                  )}
                </div>
                <div className="col-span-6">
                  <SelectBoxWIthSerach
                    // <Select
                    label="Reseller Name"
                    name="resellerId"
                    placeholder=""
                    className="!bg-white"
                    // onChange={handleSelectChange}
                    onChange={handleSelectChange}
                    options={resellerList}
                    value={
                      resellerList.length == 0 ? "" : formik.values?.resellerId
                    }
                    onBlur={formik.handleBlur}
                  />
                </div>

                <div className="col-span-6">
                  {/* <Select */}
                  <SelectBoxWIthSerach
                    label="Customer Name"
                    name="customerId"
                    placeholder=""
                    className="!bg-white"
                    // onChange={handleSelectChange}
                    onChange={handleSelectChange}
                    options={customerList}
                    value={
                      customerList.length == 0 ? "" : formik.values.customerId
                    }
                    onBlur={formik.handleBlur}
                  />
                </div>
                <div className="col-span-6">
                  {/* <Select */}
                  {console.log(servicerData.length, "length ", servicerData)}
                  <SelectBoxWIthSerach
                    label="Servicer Name"
                    name="servicerId"
                    placeholder=""
                    className="!bg-white"
                    onChange={handleSelectChange}
                    // onChange={handleSelectChange}
                    options={servicerData}
                    value={
                      servicerData.length == 0 ? "" : formik.values.servicerId
                    }
                    onBlur={formik.handleBlur}
                  />
                </div>

                {/* <div className="col-span-6">
                   <Select
                    label="Dealer Name"
                    name="dealerId"
                    placeholder=""
                    className="!bg-white"
                    required={true}
                    onChange={handleSelectChange}
                    options={dealerList}
                    value={formik.values.dealerId}
                    onBlur={formik.handleBlur}
                    error={formik.touched.dealerId && formik.errors.dealerId}
                  />
                </div>
                <div className="col-span-6">
                 <Select
                    label="Reseller Name"
                    name="resellerId"
                    placeholder=""
                    className="!bg-white"
                    // onChange={handleSelectChange}
                    onChange={handleSelectChange}
                    options={resellerList}
                    value={formik.values.resellerId}
                    onBlur={formik.handleBlur}
                  />
                </div>
                <div className="col-span-6">
                  <Select
                    label="Customer Name"
                    name="customerId"
                    placeholder=""
                    className="!bg-white"
                    // onChange={handleSelectChange}
                    onChange={handleSelectChange}
                    options={customerList}
                    value={formik.values.customerId}
                    onBlur={formik.handleBlur}
                  />
                </div>
                <div className="col-span-6">
                  <Select
                    label="Servicer Name"
                    name="servicerId"
                    placeholder=""
                    className="!bg-white"
                    onChange={handleSelectChange}
                    // onChange={handleSelectChange}
                    options={servicerData}
                    value={formik.values.servicerId}
                    onBlur={formik.handleBlur}
                  />
                </div> */}
              </Grid>
            </div>
          </Grid>
        </div>
        <div className="flex">
          <Button
            type="submit"
            onClick={() => {
              console.log(formik.errors);
            }}
          >
            Next
          </Button>
        </div>
      </form>
    );
  };

  const renderStep2 = () => {
    // Step 2 content
    return (
      <>
        <div className="px-8 pb-8 pt-4 mb-8 drop-shadow-4xl bg-white border-[1px] border-[#D1D1D1]  rounded-xl">
          <p className="text-2xl font-bold mb-4">Dealer Order Details</p>
          <Grid>
            <div className="col-span-6">
              <Grid>
                <div className="col-span-12">
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
                <div className="col-span-6">
                  <Select
                    label="Service Coverage"
                    name="serviceCoverageType"
                    placeholder=""
                    className="!bg-white"
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
                  <Select
                    label="Coverage Type"
                    name="coverageType"
                    placeholder=""
                    className="!bg-white"
                    required={true}
                    onChange={handleSelectChange1}
                    options={coverage}
                    value={formikStep2.values.coverageType}
                    onBlur={formikStep2.handleBlur}
                    error={
                      formikStep2.touched.coverageType &&
                      formikStep2.errors.coverageType
                    }
                  />
                  {formikStep2.touched.coverageType &&
                    formikStep2.errors.coverageType && (
                      <div className="text-red-500 text-sm pl-2 pt-2">
                        {formikStep2.errors.coverageType}
                      </div>
                    )}
                </div>
              </Grid>
            </div>
          </Grid>
        </div>

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
        {/* {loading ? (
              <div className=" h-[400px] w-full flex py-5">
                <div className="self-center mx-auto">
                  <RotateLoader color="#333" />
                </div>
              </div>
            ) : ( */}
        <div className="mb-3">
          {formikStep3?.values?.productsArray.map((data, index) => (
            <div
              key={index}
              className="px-8 pb-8 pt-4 mb-8 drop-shadow-4xl bg-white border-[1px] border-[#D1D1D1]  rounded-xl relative"
            >
              <p className="text-2xl font-bold mb-4">Add Product</p>
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
                    <div className="flex h-full mx-3 bg-[#fff] rounded-[30px] justify-center">
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
                        options={categoryList}
                        required={true}
                        className="!bg-[#fff]"
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
                        formikStep3.touched.productsArray[index].categoryId && (
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
                        label="Product Name"
                        options={productNameOptions[index]?.data}
                        required={true}
                        className="!bg-[#fff]"
                        placeholder=""
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
                    </div>
                    <div className="col-span-12">
                      <Input
                        type="text"
                        name={`productsArray[${index}].description`}
                        className="!bg-[#fff]"
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
                    <div className="col-span-4">
                      <Select
                        label="Terms"
                        name={`productsArray[${index}].term`}
                        placeholder=""
                        onChange={handleSelectChange2}
                        className="!bg-[#fff]"
                        options={termList}
                        disabled={true}
                        value={formikStep3.values.productsArray[index].term}
                        onBlur={formikStep3.handleBlur}
                      />
                    </div>
                    <div className="col-span-4">
                      <Input
                        type="text"
                        name={`productsArray[${index}].priceType`}
                        className="!bg-[#fff]"
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
                    <div className="col-span-4">
                      <Input
                        type="text"
                        name={`productsArray[${index}].unitPrice`}
                        className="!bg-[#fff]"
                        label="Unit Price ($)"
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
                        className="!bg-[#fff]"
                        label="# of Products"
                        required={true}
                        placeholder=""
                        disabled={
                          formikStep3.values.productsArray[index].priceType !==
                          "Quantity Pricing"
                            ? false
                            : true
                        }
                        value={
                          formikStep3.values.productsArray[index].noOfProducts
                        }
                        onChange={(e) => {
                          formikStep3.handleChange(e);
                          const unitPrice =
                            formikStep3.values.productsArray[index].unitPrice;
                          const enteredValue = parseFloat(e.target.value);
                          const calculatedPrice = unitPrice * enteredValue;
                          setNumberOfOrders((prevFileValues) => {
                            const newArray = [...prevFileValues];
                            newArray[index] = enteredValue;
                            console.log(newArray);
                            return newArray;
                          });
                          formikStep3.setFieldValue(
                            `productsArray[${index}].price`,
                            calculatedPrice.toFixed(2)
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
                        className="!bg-[#fff]"
                        label="Price ($)"
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
                        className="!bg-[#fff]"
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
                                "yyyy-MM-dd"
                              )
                        }
                        onChange={(e) => {
                          formikStep3.handleChange(e);
                          const selectedDate = new Date(e.target.value);
                          const gmtDate = selectedDate.toISOString();
                          formikStep3.setFieldValue(
                            `productsArray[${index}].coverageStartDate`,
                            gmtDate
                          );
                          const termInMonths =
                            formikStep3.values.productsArray[index].term || 0;
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
                    {(formikStep3.values.productsArray[index].priceType ===
                      "FlatPricing" ||
                      formikStep3.values.productsArray[index].priceType ===
                        "Flat Pricing") && (
                      <>
                        <div className="col-span-4">
                          <Input
                            type="text"
                            name={`productsArray[${index}].rangeStart`}
                            className="!bg-[#fff]"
                            label="Start Range"
                            placeholder=""
                            value={
                              formikStep3.values.productsArray[index].rangeStart
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
                            className="!bg-[#fff]"
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
                      <Grid className="!grid-cols-3">
                        {formikStep3.values.productsArray[index].priceType ===
                          "Quantity Pricing" &&
                          (() => {
                            return formikStep3.values.productsArray[
                              index
                            ].QuantityPricing.map((data, index1) => (
                              <div
                                className="bg-[#f9f9f9] p-4 relative rounded-xl"
                                key={index1}
                              >
                                <div className=" p-4 pl-0 relative rounded-xl">
                                  <Grid className="">
                                    <div className="col-span-12">
                                      <Input
                                        type="text"
                                        name={`productsArray[${index}].QuantityPricing[${index1}].name`}
                                        className="!bg-[#f9f9f9]"
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
                                        className="!bg-[#f9f9f9]"
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
                                        type="tel"
                                        name={`productsArray[${index}].QuantityPricing[${index1}].enterQuantity`}
                                        className="!bg-[#f9f9f9]"
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
                                        formikStep3.touched.productsArray[index]
                                          .QuantityPricing &&
                                        formikStep3.touched.productsArray[index]
                                          .QuantityPricing[index1] &&
                                        formikStep3.touched.productsArray[index]
                                          .QuantityPricing[index1]
                                          .enterQuantity && (
                                          <div className="text-red-500 text-sm pl-2 pt-2">
                                            {formikStep3.errors.productsArray &&
                                              formikStep3.errors.productsArray[
                                                index
                                              ] &&
                                              formikStep3.errors.productsArray[
                                                index
                                              ].QuantityPricing &&
                                              formikStep3.errors.productsArray[
                                                index
                                              ].QuantityPricing[index1] &&
                                              formikStep3.errors.productsArray[
                                                index
                                              ].QuantityPricing[index1]
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
                      <div className="relative">
                        <label
                          htmlFor="description"
                          className="absolute text-base text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-[#fff] left-2 px-1 -translate-y-4 scale-75"
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
                          className="block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold text-light-black bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer"
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
                  <div className="border border-dashed w-full h-[80%] relative flex justify-center">
                    <label
                      htmlFor="description"
                      className="absolute z-[999] text-base text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-[#fff] left-2 px-1 -translate-y-4 scale-75"
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
                            <img src={csvFile} className="mr-2" alt="Dropbox" />
                            <div className="flex justify-between w-full">
                              <p className="self-center text-sm pr-3">
                                {" "}
                                {fileValues[index].name}
                              </p>
                              <p className="self-center text-sm">
                                {(fileValues[index].size / 1000).toFixed(2)} kb
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
                        onChange={(e) => handleFileSelect(e, index)}
                        disabled={
                          Boolean(numberOfOrders[index]) === true ? false : true
                        }
                      />
                    </div>
                  </div>
                  <p className="text-[12px] mt-1 text-[#5D6E66] font-medium">
                    Please click on file option and make a copy. Upload the list
                    of Product Name and Price using our provided Google Sheets
                    template, by{" "}
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
                </div>
                <div className="col-span-12"></div>
              </Grid>
            </div>
          ))}
          <Button className="!bg-[transparent] !text-black" onClick={prevStep}>
            Previous
          </Button>
          <Button onClick={formikStep3.handleSubmit}>Next</Button>
          {/* <Button className="ml-2" onClick={()=>openError()}>Error</Button> */}
        </div>
        {/* )} */}
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
            <div className="px-8 pb-8 pt-4 mb-8 drop-shadow-4xl bg-white border-[1px] border-[#D1D1D1]  rounded-xl">
              <Grid>
                <div className="col-span-6">
                  <p className="text-2xl font-bold text-[#bbbbbc] mb-4">
                    Order Details
                  </p>
                  <Grid className="bg-[#F9F9F9] border-[#D1D1D1] border rounded-xl px-4 ">
                    <div className="col-span-3 py-4 border-r">
                      <p className="text-[12px]">Dealer Name</p>
                      <p className="font-bold text-sm">{dealerName}</p>
                    </div>
                    <div className="col-span-3 py-4 border-r">
                      <p className="text-[12px]">Reseller Name</p>
                      <p className="font-bold text-sm">{resellerName}</p>
                    </div>
                    <div className="col-span-3 py-4 border-r">
                      <p className="text-[12px]">Customer Name</p>
                      <p className="font-bold text-sm">{customerName}</p>
                    </div>
                    <div className="col-span-3 py-4 ">
                      <p className="text-[12px]">Servicer Name</p>
                      <p className="font-bold text-sm">{servicerName}</p>
                    </div>
                  </Grid>
                </div>
                <div className="col-span-6">
                  <p className="text-2xl font-bold text-[#bbbbbc] mb-4">
                    Dealer Order Details
                  </p>
                  <Grid className="bg-[#F9F9F9] !gap-2 border-[#D1D1D1] border rounded-xl px-2 ">
                    <div className="col-span-4 py-4 border-r">
                      <p className="text-[12px]">Dealer Purchase Order</p>
                      <p className="font-bold text-sm">
                        {formikStep2.values.dealerPurchaseOrder}
                      </p>
                    </div>
                    <div className="col-span-4 py-4 border-r">
                      <p className="text-[12px]">Service Coverage</p>
                      <p className="font-bold text-sm">
                        {formikStep2.values.serviceCoverageType}
                      </p>
                    </div>
                    <div className="col-span-4 py-4">
                      <p className="text-[12px]">Coverage Type</p>
                      <p className="font-bold text-sm">
                        {formikStep2.values.coverageType}
                      </p>
                    </div>
                  </Grid>
                </div>
                {formikStep3.values.productsArray.map((data, index) => {
                  return (
                    <>
                      <div className="col-span-8">
                        <p className="text-2xl font-bold text-[#bbbbbc] mb-4">
                          Product Details
                        </p>
                        <div className="bg-[#F9F9F9] border-[#D1D1D1] border rounded-xl ">
                          <Grid className="border-b px-4">
                            <div className="col-span-4 py-4 border-r">
                              <p className="text-[12px]">Product Category</p>
                              <p className="font-bold text-sm">
                                {categoryName[index]}
                              </p>
                            </div>
                            <div className="col-span-4 py-4 border-r">
                              <p className="text-[12px]">Product Name</p>
                              <p className="font-bold text-sm">
                                {priceBookName[index]}
                              </p>
                            </div>
                            <div className="col-span-4 py-4">
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
                                ${data.unitPrice}
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
                              <p className="font-bold text-sm">${data.price}</p>
                            </div>
                          </Grid>
                          {data.priceType == "Flat Pricing" && (
                            <Grid className="border-b px-4">
                              <div className="col-span-6 py-4 border-r">
                                <p className="text-[12px]">Start Range</p>
                                <p className="font-bold text-sm">
                                  {data.rangeStart}
                                </p>
                              </div>
                              <div className="col-span-6 py-4">
                                <p className="text-[12px]">End Range</p>
                                <p className="font-bold text-sm">
                                  {data.rangeEnd}
                                </p>
                              </div>
                            </Grid>
                          )}

                          <Grid>
                            {data.priceType == "Quantity Pricing" && (
                              <div className="col-span-12">
                                <table className="w-full border text-center">
                                  <tr className="border bg-[#fff]">
                                    <td
                                      colSpan={"4"}
                                      className="font-bold text-sm"
                                    >
                                      Quantity Pricing List{" "}
                                    </td>
                                  </tr>
                                  <tr className="border bg-[#fff]">
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
                                          className="border bg-[#fff]"
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
                            <div className="col-span-12 py-4">
                              <p className="text-[12px]">Note</p>
                              <p className="font-bold text-sm">
                                {data.additionalNotes}
                              </p>
                            </div>
                          </Grid>

                          {/* Loops */}
                        </div>
                      </div>
                      <div className="col-span-4">
                        <p className="text-2xl font-bold text-[#bbbbbc] mb-4">
                          Uploaded Data
                        </p>
                        <div className="border border-dashed bg-[#F9F9F9] w-full h-[83%] relative flex">
                          <div className="self-center flex text-center mx-4 relative bg-white border w-full rounded-md p-3">
                            <img src={csvFile} className="mr-2" alt="Dropbox" />
                            <div className="flex justify-between w-full">
                              <p className="self-center">
                                {data?.file === ""
                                  ? "No File Selected"
                                  : data?.file?.name}
                              </p>
                              <p className="self-center">
                                {data?.file === ""
                                  ? ""
                                  : (data?.file?.size / 1000)?.toFixed(2) +
                                    "kb"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </Grid>

              <Grid className="mt-5">
                <div className="col-span-4 pt-2">
                  <div className="flex block  w-full text-base font-semibold bg-[#f9f9f9] rounded-lg border-[1px] border-gray-300 appearance-none peer undefined  border-gray-300  text-light-black">
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
                        onChange={handlePaymentStatusChange}
                        onBlur={formik4.handleBlur}
                        value={formik4.values.paymentStatus}
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
                              className="!bg-[#fff]"
                              label="Paid Amount"
                              maxLength={10}
                              maxDecimalPlaces={2}
                              disabled={formik4.values.paymentStatus === "Paid"}
                              placeholder=""
                              onChange={(e) => {
                                formik4.handleChange(e);
                                calculatePendingAmount(e.target.value);
                              }}
                              onBlur={formik4.handleBlur}
                              value={formik4.values.paidAmount}
                            />
                            {formik4.errors.paidAmount &&
                              formik4.touched.paidAmount && (
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
                              className="!bg-[#fff]"
                              label="Pending Amount"
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
                    ${calculateTotalAmount(formikStep3.values.productsArray)}
                  </p>
                </div>
                <div className="col-span-12">
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
              </Grid>
            </div>

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
    <div className="my-8 ml-3">
      <Headbar />
      <div className="flex mt-2">
        <Link
          to={"/orderList"}
          className="h-[60px] w-[60px] flex border-[1px] bg-white border-[#D1D1D1] rounded-[25px]"
        >
          <img
            src={BackImage}
            className="m-auto my-auto self-center bg-white"
            alt="BackImage"
          />
        </Link>
        <div className="pl-3">
          <p className="font-bold text-[36px] leading-9 mb-[3px]">Add Order</p>
          <ul className="flex self-center">
            <li className="text-sm text-neutral-grey font-Regular">
              <Link to={"/"}>Order </Link> /{" "}
            </li>
            <li className="text-sm text-neutral-grey font-Regular">
              {" "}
              Add Order /{" "}
            </li>
            <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
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
      {renderStep()}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center py-3">
          <img src={AddDealer} alt="email Image" className="mx-auto" />

          <p className="text-3xl mb-0 mt-4 font-semibold text-neutral-grey">
            Added
            <span className="text-light-black"> Successfully </span>
          </p>

          <p className="text-neutral-grey text-base font-medium mt-2">
            <b> New Order </b> Added Successfully
          </p>
          <p className="text-neutral-grey text-base font-medium mt-2">
            Redirecting you on Order List Page {timer} seconds.
          </p>
        </div>
      </Modal>

      <Modal isOpen={isErrorOpen} onClose={closeError}>
        <Button
          onClick={closeError}
          className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]"
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
