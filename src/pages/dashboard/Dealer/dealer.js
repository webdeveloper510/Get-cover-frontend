import React, { useEffect, useRef, useState } from "react";
import Headbar from "../../../common/headBar";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "../../../common/select";
import Grid from "../../../common/grid";
import Input from "../../../common/input";
import { useFormik } from "formik";
import * as Yup from "yup";

// Media Include
import DeleteImage from "../../../assets/images/icons/Delete.svg";
import disapprove from "../../../assets/images/Disapproved.png";
import Cross from "../../../assets/images/Cross.png";
import Cross1 from "../../../assets/images/Cross_Button.png";
import Button from "../../../common/button";
import csvFile from "../../../assets/images/icons/csvFile.svg";
import RadioButton from "../../../common/radio";
import FileDropdown from "../../../common/fileDropbox";
import { cityData } from "../../../stateCityJson";
import AddDealer from "../../../assets/images/dealer-book.svg";
import {
  addNewOrApproveDealer,
  checkDealersEmailValidation,
  getDealersDetailsByid,
  getProductListbyProductCategoryId,
  getTermList,
} from "../../../services/dealerServices";
import {
  getCategoryListActiveData,
  getCategoryListCoverage,
  getCovrageList,
} from "../../../services/priceBookService";
import { validateDealerData } from "../../../services/dealerServices";
import Modal from "../../../common/model";
import Dropbox from "../../../assets/images/icons/dropBox.svg";
import { RotateLoader } from "react-spinners";
import Card from "../../../common/card";
import { MultiSelect } from "react-multi-select-component";
import Checkbox from "../../../common/checkbox";
function Dealer() {
  const [productNameOptions, setProductNameOptions] = useState([]);
  const [category, setCategoryList] = useState([]);
  const [termList, setTermList] = useState([]);
  const [createAccountOption, setCreateAccountOption] = useState("yes");
  const [shipping, setShipping] = useState("yes");
  const [createServicerAccountOption, setServicerCreateAccountOption] =
    useState(false);
  const [separateAccountOption, setSeparateAccountOption] = useState("yes");
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [selectedOption, setSelectedOption] = useState("yes");
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(true);
  const [coverageType, setCoverageType] = useState([]);
  const [message, setMessage] = useState("");
  const [types, setTypes] = useState("");
  const [dealerId, setDealerId] = useState("");
  const [selected, setSelected] = useState([]);
  const [coverage, setCoverage] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("start");
  const [claimOver, setClaimOver] = useState(true);
  const [claimInCoveragePeriod, setClaimInCoveragePeriod] = useState(true);
  const [timer, setTimer] = useState(3);
  const [fileError, setFileError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const [initialFormValues, setInitialFormValues] = useState({
    name: "",
    street: "",
    zip: "",
    state: "",
    country: "USA",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    city: "",
    position: "",
    createdBy: "Super admin",
    role: "dealer",
    // savePriceBookType: selectedOption,
    dealers: [],
    noOfClaimPerPeriod: 0,

    // priceBook: [
    //   {
    //     priceBookId: "",
    //     categoryId: "",
    //     wholesalePrice: "",
    //     terms: "",
    //     pName: "",
    //     description: "",
    //     retailPrice: "",
    //     status: "",
    //     dealerSku: "",
    //   },
    // ],
    isAccountCreate: false,
    customerAccountCreated: false,
    isMaxClaimAmount: false,
    serviceCoverageType: "",
    coverageType: [],
    isShippingAllowed: false,
    noOfClaim: {
      period: "Monthly",
      value: -1,
    },
    isManufacturerWarranty: false,
    noOfClaimPerPeriod: 0,
    file: "",
    oldName: "",
    oldEmail: "",
    isServicer: createServicerAccountOption,
    termCondition: {},
    adhDays: coverage.reduce((acc, type) => {
      acc.push({
        label: type.value,
        value: type.value,
        waitingDays: 0,
        deductible: 0,
        amountType: "amount",
      });
      return acc;
    }, []),
  });

  const navigate = useNavigate();
  const { id } = useParams();

  const handleDropdownClick = () => {
    if (fileInputRef) {
      fileInputRef.current.click();
      setSelectedFile(null);
      formik.setFieldValue("file", "");
      console.log("-fun trigger------------------------------------");
    }
  };
  const optiondeductibles = [
    { label: "$", value: "amount" },
    { label: "%", value: "percentage" },
  ];

  const period = [
    { label: "Monthly", value: "Monthly" },
    { label: "Annually", value: "Annually" },
  ];

  const status = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];

  const handleAddPriceBook = () => {
    const priceBook = {
      priceBookId: "",
      categoryId: "",
      wholesalePrice: "",
      terms: "",
      pName: "",
      description: "",
      retailPrice: "",
      status: "",
    };

    formik.setFieldValue("priceBook", [...formik.values.priceBook, priceBook]);
  };

  const handleDeletePriceBook = (index) => {
    const updatedPriceBook = [...formik.values.priceBook];
    updatedPriceBook.splice(index, 1);
    formik.setFieldValue("priceBook", updatedPriceBook);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    console.log("here1");
    getCovrageListData();
    if (id === undefined) {
      setInitialFormValues({
        name: "",
        street: "",
        zip: "",
        state: "",
        country: "USA",
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        city: "",
        position: "",
        createdBy: "Super admin",
        role: "dealer",
        // savePriceBookType: selectedOption,
        serviceCoverageType: "",
        coverageType: [],
        noOfClaim: {
          period: "Monthly",
          value: -1,
        },
        isShippingAllowed: false,
        isManufacturerWarranty: false,
        isMaxClaimAmount: false,
        noOfClaimPerPeriod: 0,
        dealers: [],
        // priceBook: [
        //   {
        //     priceBookId: "",
        //     categoryId: "",
        //     wholesalePrice: "",
        //     terms: "",
        //     description: "",
        //     pName: "",
        //     retailPrice: "",
        //     status: "",
        //   },
        // ],
        isAccountCreate: false,
        customerAccountCreated: false,
        isServicer: createServicerAccountOption,
        file: "",
        termCondition: {},
        adhDays: coverage.reduce((acc, type) => {
          acc.push({
            label: type.value,
            value: type.value,
            waitingDays: 0,
            deductible: 0,
            amountType: "amount",
          });
          return acc;
        }, []),
      });
    }

    getTermListData();
    getProductList("");

    if (id != undefined) {
      setLoading1(true);
      getDealersDetailsByid(id).then((res) => {
        if (res?.result) {
          setInitialFormValues({
            name: res?.result[0]?.dealerData?.name,
            street: res?.result[0]?.dealerData?.street,
            zip: res?.result[0]?.dealerData?.zip,
            state: res?.result[0]?.dealerData?.state,
            country: "USA",
            email: res?.result[0]?.email,
            firstName: res?.result[0]?.firstName,
            lastName: res?.result[0]?.lastName,
            phoneNumber: res?.result[0]?.phoneNumber,
            city: res?.result[0]?.dealerData?.city,
            position: res?.result[0]?.position,
            oldName: res?.result[0]?.dealerData?.name,
            oldEmail: res?.result[0]?.email,
            createdBy: "Super admin",
            role: "dealer",
            dealers: [],
            // savePriceBookType: selectedOption,
            serviceCoverageType: "",
            coverageType: [],
            isShippingAllowed: false,
            isManufacturerWarranty: false,
            isMaxClaimAmount: false,
            noOfClaimPerPeriod: 0,
            noOfClaim: {
              period: "Monthly",
              value: -1,
            },
            // priceBook: [
            //   {
            //     priceBookId: "",
            //     categoryId: "",
            //     wholesalePrice: "",
            //     terms: "",
            //     pName: "",
            //     description: "",
            //     retailPrice: "",
            //     status: "",
            //   },
            // ],
            file: "",
            isAccountCreate: false,
            customerAccountCreated: false,
            isServicer: createServicerAccountOption,
            termCondition: {},
            adhDays: coverage.reduce((acc, type) => {
              acc.push({
                label: type.value,
                value: type.value,
                waitingDays: 0,
                deductible: 0,
                amountType: "amount",
              });
              return acc;
            }, []),
          });
        }
      });
      setLoading1(false);
    }
  }, [id]);

  useEffect(() => {
    let intervalId;
    if (isModalOpen && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0 && message === "New Dealer Created Successfully") {
      closeModal();
      navigate(`/dealerDetails/${dealerId}`);
      localStorage.setItem("menu", "PriceBook");
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isModalOpen, timer]);

  const getTermListData = async () => {
    setLoading(true);
    try {
      const res = await getTermList();
      console.log(res.result.terms);
      setTermList(
        res.result.terms.map((item) => ({
          label: item.terms + " Months",
          value: item.terms,
        }))
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching category list:", error);
    }
  };

  const getProductList = async () => {
    const result = await getCategoryListActiveData();
    console.log(result.result);
    setCategoryList(
      result.result.map((item) => ({
        label: item.name,
        value: item._id,
      }))
    );
  };

  const handleServiceChange = (event) => {
    const valueAsBoolean = JSON.parse(event.target.value.toLowerCase());
    setServicerCreateAccountOption(valueAsBoolean);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const maxSize = 10048576; // 10MB in bytes

    if (file?.size > maxSize) {
      formik.setFieldError(
        "termCondition",
        "File is too large. Please upload a file smaller than 10MB."
      );
      console.log("Selected file:", file);
    } else {
      setSelectedFile2(file);
      formik.setFieldValue("termCondition", file);
      console.log("Selected file:", file);
    }
  };

  const getCovrageListData = async () => {
    try {
      const res = await getCovrageList();
      setCoverage(res.result.value);
    } catch (error) {
      console.error("Error fetching category list:", error);
    }
  };

  const handleRemoveFile = () => {
    if (inputRef) {
      inputRef.current.click();
      formik.setFieldValue("termCondition", {});
      setSelectedFile2(null);
    }
  };

  const handleRadioChange = (event) => {
    const selectedValue = event.target.value;
    setCreateAccountOption(selectedValue);

    if (selectedValue === "no") {
      setSeparateAccountOption("no");

      const updatedDealers = formik.values.dealers.map((dealer) => ({
        ...dealer,
        status: false,
      }));

      formik.setFieldValue("dealers", updatedDealers);
      formik.setFieldValue("isAccountCreate", false);
      formik.setFieldValue("customerAccountCreated", false);
    } else {
      formik.setFieldValue("isAccountCreate", true);
    }
  };

  const handleSeparateAccountRadioChange = (event) => {
    setSeparateAccountOption(event.target.value);
  };

  const handleRadio = (event) => {
    setShipping(event.target.value);
  };

  const handleRadioChangeforBulk = (event) => {
    console.log(event.target.value);
    if (event.target.value === "no") {
      formik.setFieldValue("file", "");
      setSelectedFile(null);
    }
    setSelectedOption(event.target.value);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    formik.setFieldValue("file", file);
    setFileError(null);
    event.target.value = null;
  };

  const handleRadioChangeDealers = (value, index) => {
    const updatedDealers = [...formik.values.dealers];
    updatedDealers[index].status = value === "yes" ? true : false;
    formik.setFieldValue("dealers", updatedDealers);
  };

  const handleSelectChange = async (name, selectedValue) => {
    if (name.includes("categoryId")) {
      const match = name.match(/\[(\d+)\]/);
      console.log(match[1]);
      formik.setFieldValue(`priceBook[${match[1]}].priceBookId`, "");
      formik.setFieldValue(`priceBook[${match[1]}].pName`, "");
      formik.setFieldValue(`priceBook[${match[1]}].wholesalePrice`, "");
      formik.setFieldValue(`priceBook[${match[1]}].status`, "");
      formik.setFieldValue(`priceBook[${match[1]}].terms`, "");
      formik.setFieldValue(`priceBook[${match[1]}].description`, "");
      formik.setFieldValue(`priceBook[${match[1]}].retailPrice`, "");
      if (match) {
        const response = await getProductListbyProductCategoryId(
          selectedValue,
          { coverageType: formik.values.coverageType }
        );

        setProductNameOptions((prevOptions) => {
          const newOptions = [...prevOptions];
          newOptions[match[1]] = {
            data: response.result.priceBooks.map((item) => ({
              label: item.name,
              value: item._id,
              description: item.description,
              term: item.term,
              pName: item.pName,
              wholesalePrice:
                item.frontingFee +
                item.reserveFutureFee +
                item.reinsuranceFee +
                item.adminFee,
              status: item.status,
            })),
          };
          return newOptions;
        });
      }
    }
    if (name.includes("priceBookId")) {
      const match = name.match(/\[(\d+)\]/);
      const data = productNameOptions[match[1]].data.find((value) => {
        return value.value === selectedValue;
      });
      console.log(data);
      formik.setFieldValue(
        `priceBook[${match[1]}].description`,
        data.description
      );
      formik.setFieldValue(`priceBook[${match[1]}].dealerSku`, data.label);
      formik.setFieldValue(
        `priceBook[${match[1]}].wholesalePrice`,
        data.wholesalePrice.toFixed(2)
      );
      formik.setFieldValue(`priceBook[${match[1]}].status`, data.status);
      formik.setFieldValue(`priceBook[${match[1]}].terms`, data.term);
      formik.setFieldValue(`priceBook[${match[1]}].pName`, data.pName);
      const res = await getCategoryListCoverage(data.value);
      console.log(res.result);
      setCoverageType(res.result);
    }
    formik.setFieldValue(name, selectedValue);
  };

  const serviceCoverage = [
    { label: "Parts", value: "Parts" },
    { label: "Labor ", value: "Labour" },
    { label: "Parts & Labor ", value: "Parts & Labour" },
  ];

  const handleSelectChange1 = (name, value) => {
    formik.setFieldValue(name, value);
  };

  const emailValidationRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      serviceCoverageType: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .required("Required"),
      isShippingAllowed: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .required("Required"),
      name: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .required("Required")
        .max(50, "Must be exactly 50 characters"),
      street: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .required("Required")
        .max(50, "Must be exactly 50 characters"),
      state: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .required("Required"),
      city: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .required("Required"),
      country: Yup.string().required("Required"),
      email: Yup.string()
        .matches(emailValidationRegex, "Invalid email address")
        .required("Required"),
      zip: Yup.string()
        .required("Required")
        .min(5, " Zip code must be 5-6 characters ")
        .max(6, " Zip code must be 6 characters "),
      firstName: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .required("Required")
        .max(30, "Must be exactly 30 characters"),
      lastName: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .required("Required")
        .max(30, "Must be exactly 30 characters"),
      // coverageType: Yup.array().min(1, "Required"),

      phoneNumber: Yup.string()
        .required("Required")
        .min(10, "Must be at least 10 characters")
        .max(10, "Must be exactly 10 characters")
        .matches(/^[0-9]+$/, "Must contain only digits"),
      adhDays: Yup.array().of(
        Yup.object().shape({
          deductible: Yup.number()
            .required("Required")
            .min(0, "Must be at least 0")
            .when("amountType", {
              is: (value) => value === "percentage",
              then: () =>
                Yup.number()
                  .max(99.9, "Cannot exceed 99.9%")
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
          amountType: Yup.string().required("Amount type is required"),
        })
      ),

      dealers: Yup.array().of(
        Yup.object().shape({
          firstName: Yup.string()
            .transform((originalValue) => originalValue.trim())
            .required("Required")
            .max(30, "Must be exactly 30 characters"),
          lastName: Yup.string()
            .transform((originalValue) => originalValue.trim())
            .required("Required")
            .max(30, "Must be exactly 30 characters"),
          phoneNumber: Yup.string()
            .required("Required")
            .min(10, "Must be at least 10 characters")
            .max(10, "Must be exactly 10 characters")
            .matches(/^[0-9]+$/, "Must contain only digits"),
          email: Yup.string()
            .matches(emailValidationRegex, "Invalid email address")
            .required("Required"),

          status: Yup.boolean().required("Required"),
        })
      ),

      adhDays: Yup.array().of(
        Yup.object().shape({
          deductible: Yup.number()
            .required("Required")
            .min(0, "Must be at least 0"),
        })
      ),
      coverageType: Yup.array()
        .min(1, "Required")
        .test(
          "validate-adhDays-errors",
          "Value cannot be more than 99.9%",
          function () {
            const { adhDays } = this.parent;
            const hasErrors = adhDays.some((item) => {
              if (item.amountType === "percentage" && item.deductible > 99.9) {
                return true;
              }
              return false;
            });

            return !hasErrors;
          }
        ),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      values.priceBook =
        selectedOption === "no"
          ? [
              {
                priceBookId: "",
                categoryId: "",
                wholesalePrice: "",
                terms: "",
                description: "",
                retailPrice: "",
                pName: "",
                status: "",
              },
            ]
          : formik.errors.priceBook || values.priceBook;
      values.file =
        selectedOption === "yes" ? "" : formik.errors.file || values.file;

      if (formik.values.dealers.length > 0) {
        let emailValues = [];
        for (let i = 0; i < formik.values.dealers.length; i++) {
          const result = await checkDealerEmailAndSetError(
            formik.values.dealers[i].email,
            formik,
            `dealers[${i}].email`
          );
          emailValues.push(result);
        }
        if (emailValues.some((value) => value === false)) {
          setLoading(false);

          return;
        }
      }

      const newObject = {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        isPrimary: true,
        position: values.position,
        status: true,
      };
      values.isServicer = createServicerAccountOption;
      values.isShippingAllowed = shipping === "yes" ? true : false;
      values.customerAccountCreated =
        separateAccountOption === "yes" ? true : false;
      if (createAccountOption === "yes" || createAccountOption === "no") {
        values.isAccountCreate = createAccountOption === "yes" ? true : false;
      } else {
        values.isAccountCreate = createAccountOption;
      }

      const newValues = {
        ...values,
        dealers: [newObject, ...values.dealers],
      };
      const formData = new FormData();
      Object.entries(newValues).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (key === "coverageType") {
              formData.append(`${key}[${index}]`, item);
            } else {
              Object.entries(item).forEach(([subKey, subValue]) => {
                formData.append(`${key}[${index}][${subKey}]`, subValue);
              });
            }
          });
        } else if (key === "noOfClaim") {
          let noOfClaim = value;
          for (let prop in noOfClaim) {
            if (noOfClaim.hasOwnProperty(prop)) {
              formData.append(`noOfClaim[${prop}]`, noOfClaim[prop]);
            }
          }
        } else {
          formData.append(key, value);
        }
      });
      if (id !== undefined) {
        formData.append("dealerId", id);
      }

      const result = await addNewOrApproveDealer(formData);
      const { message, result: dealerResult } = result;

      if (dealerResult?._id) {
        console.log(dealerResult._id);
        setDealerId(dealerResult._id);
      }

      setLoading(false);
      setLoading1(false); // Assuming setLoading1 is required in all cases

      switch (message) {
        case "Successfully Created":
          setError("done");
          setIsModalOpen(true);
          setMessage("New Dealer Created Successfully");
          setTimer(3);
          setSelected([]);
          break;

        case "Dealer name already exists":
          formik.setFieldError("name", "Name Already Used");
          setMessage("Some Errors Please Check Form Validations");
          setIsModalOpen(true);
          break;

        case "Primary user email already exist":
          formik.setFieldError("email", "Email Already Used");
          setMessage("Some Errors Please Check Form Validations");
          setIsModalOpen(true);
          break;

        case "Invalid priceBook field":
          if (
            message ===
            "Invalid file format detected. The sheet should contain exactly two columns."
          ) {
            const errorMessage =
              "Invalid file format detected. The sheet should contain exactly two columns.";
            setFileError(errorMessage);
            setMessage(errorMessage);
          } else {
            setFileError(null);
          }
          setIsModalOpen(true);
          break;

        default:
          setIsModalOpen(true);
          setMessage(message);
          break;
      }
    },
  });

  const checkDealerEmailAndSetError = async (email, formik, fieldPath) => {
    if (emailValidationRegex.test(email)) {
      try {
        const result = await checkDealersEmailValidation(email);
        console.log(result);
        if (result.code === 200) {
          formik.setFieldError(fieldPath, "");
          return true;
        } else if (result.code === 401) {
          formik.setFieldError(fieldPath, "Email is already in use");
          setMessage("Some Errors Please Check Form Validations ");
          setIsModalOpen(true);
          return false;
        }
      } catch (error) {
        console.error("Error checking dealer email availability:", error);
      }
    } else {
      formik.setFieldError(fieldPath, "Invalid email address");
    }
    return false;
  };

  const handleAddTeamMember = () => {
    console.log("createAccountOption", createAccountOption);
    const dealers = {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      position: "",
      status: createAccountOption === "yes" ? true : false,
      isPrimary: false,
    };

    formik.setFieldValue("dealers", [...formik.values.dealers, dealers]);
  };

  const handleDeleteDealers = (index) => {
    const updatedDealers = [...formik.values.dealers];
    updatedDealers.splice(index, 1);
    formik.setFieldValue("dealers", updatedDealers);
  };

  const downloadCSVTemplate = async () => {
    window.open(
      "https://docs.google.com/spreadsheets/d/1hwQfZ-5f80JwcocWAbPF7texOezSAXi-UEp_qSnSQa0/edit#gid=0",
      "_blank"
    );
  };

  const state = cityData;

  return (
    <div className="mb-8 ml-3">
      <Headbar />

      <div className="flex mt-2">
        <div className="pl-3">
          <p className="font-bold text-[36px] leading-9 mb-[3px]">Dealer</p>
          <ul className="flex self-center">
            <li className="text-sm text-neutral-grey font-Regular">
              <Link to={"/"}>Home </Link> /{" "}
            </li>
            <li className="text-sm text-neutral-grey font-semibold ml-1 pt-[1px]">
              {" "}
              Add New Dealer{" "}
            </li>
          </ul>
        </div>
      </div>

      {/* Form Start */}
      {loading || loading1 ? (
        <div className=" fixed top-0 h-screen bg-[#cfcfcf8f] left-0 w-full flex py-5">
          <div className="self-center mx-auto">
            <RotateLoader color="#333" />
          </div>
        </div>
      ) : (
        <form className="mt-8 pb-10" onSubmit={formik.handleSubmit}>
          <Card className="bg-white p-8 drop-shadow-4xl rounded-xl">
            <Grid>
              <div className="col-span-4 border-e-[1px] border-Light-Grey pr-3">
                <p className="text-lg mb-3 font-semibold">
                  Create Dealer Account
                </p>
                <Grid>
                  <div className="col-span-12 mt-4">
                    <Input
                      type="text"
                      name="name"
                      className="!bg-white"
                      label="Account Name"
                      required={true}
                      placeholder=""
                      maxLength={"50"}
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
                  <div className="col-span-12">
                    <div className="flex">
                      <p className="text-sm">ADDRESS</p>
                      <hr className="self-center ml-3 border-Light-Grey w-full" />
                    </div>
                  </div>
                  <div className="col-span-12">
                    <Input
                      type="text"
                      name="street"
                      label="Business Street Address"
                      className="!bg-white"
                      required={true}
                      placeholder=""
                      maxLength={"50"}
                      value={formik.values.street}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.street && formik.errors.street}
                    />
                    {formik.touched.street && formik.errors.street && (
                      <div className="text-red-500 text-sm pl-2 pt-2">
                        {formik.errors.street}
                      </div>
                    )}
                  </div>
                  <div className="col-span-12">
                    <Input
                      type="text"
                      name="city"
                      label="Business City"
                      className="!bg-white"
                      placeholder=" "
                      required={true}
                      maxLength={"20"}
                      value={formik.values.city}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.city && formik.errors.city}
                    />
                    {formik.touched.city && formik.errors.city && (
                      <div className="text-red-500 text-sm pl-2 pt-2">
                        {formik.errors.city}
                      </div>
                    )}
                  </div>
                  <div className="col-span-12">
                    <Select
                      label="Business State"
                      name="state"
                      placeholder=""
                      className="!bg-white"
                      required={true}
                      onChange={handleSelectChange}
                      options={state}
                      value={formik.values.state}
                      onBlur={formik.handleBlur}
                      error={formik.touched.state && formik.errors.state}
                    />
                    {formik.touched.state && formik.errors.state && (
                      <div className="text-red-500 text-sm pl-2 pt-2">
                        {formik.errors.state}
                      </div>
                    )}
                  </div>
                  <div className="col-span-12">
                    <Input
                      type="number"
                      name="zip"
                      label="Business Zipcode"
                      className="!bg-white"
                      required={true}
                      placeholder=""
                      zipcode={true}
                      value={formik.values.zip}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      minLength={"5"}
                      maxLength={"6"}
                      error={formik.touched.zip && formik.errors.zip}
                    />
                    {formik.touched.zip && formik.errors.zip && (
                      <div className="text-red-500 text-sm pl-2 pt-2">
                        {formik.errors.zip}
                      </div>
                    )}
                  </div>
                </Grid>
              </div>
              <div className="col-span-8">
                <p className="text-lg mb-3 font-semibold">Dealer Setting</p>
                <Grid className="!gap-1">
                  <div className="col-span-6 mt-4">
                    <Select
                      label="Service Coverage"
                      name="serviceCoverageType"
                      placeholder=""
                      className="!bg-white"
                      required={true}
                      onChange={handleSelectChange1}
                      options={serviceCoverage}
                      value={formik.values.serviceCoverageType}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.serviceCoverageType &&
                        formik.errors.serviceCoverageType
                      }
                    />
                    {formik.touched.serviceCoverageType &&
                      formik.errors.serviceCoverageType && (
                        <div className="text-red-500 text-sm pl-2 pt-2">
                          {formik.errors.serviceCoverageType}
                        </div>
                      )}
                  </div>
                  <div className="col-span-6">
                    <div className="relative mt-4">
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
                            <img
                              src={Cross1}
                              className="w-6 h-6"
                              alt="Dropbox"
                            />
                          </button>
                        )}
                        {selectedFile2 ? (
                          <p className="w-full break-words">
                            {selectedFile2.name}
                          </p>
                        ) : (
                          <p
                            className="w-full cursor-pointer"
                            onClick={handleRemoveFile}
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
                    <small className="text-neutral-grey p-10p">
                      Attachment size limit is 10 MB
                    </small>
                  </div>
                  <div className="col-span-6">
                    <Grid className="!gap-0">
                      <div className="col-span-8">
                        <p className="flex text-[12px] font-semibold justify-between ">
                          Do you want to create an account?
                        </p>
                      </div>
                      <div className="col-span-4 flex">
                        <RadioButton
                          id="yes-create-account"
                          label="Yes"
                          value="yes"
                          checked={createAccountOption === "yes"}
                          onChange={handleRadioChange}
                        />
                        <RadioButton
                          id="no-create-account"
                          label="No"
                          value="no"
                          checked={createAccountOption === "no"}
                          onChange={handleRadioChange}
                        />
                      </div>
                    </Grid>

                    <Grid className="!gap-0 mt-3">
                      <div className="col-span-8">
                        <p className="flex text-[12px] font-semibold justify-between">
                          <span className="mr-[0.58rem]">
                            Do you want to Provide Shipping?
                          </span>
                        </p>
                      </div>
                      <div className="col-span-4 flex">
                        <RadioButton
                          id="yes-create-account"
                          label="Yes"
                          value="yes"
                          checked={shipping === "yes"}
                          onChange={handleRadio}
                        />
                        <RadioButton
                          id="no-create-account"
                          label="No"
                          value="no"
                          checked={shipping === "no"}
                          onChange={handleRadio}
                        />
                      </div>
                    </Grid>
                    <Grid className="!gap-0 mt-3">
                      <div className="col-span-8">
                        <p className=" text-[12px] font-semibold">
                          {" "}
                          Is Maximum Claim Amount ?
                        </p>
                      </div>
                      <div className="col-span-4 flex">
                        <RadioButton
                          className="self-start"
                          id="yes-max-claim"
                          label="Yes"
                          value={true}
                          checked={formik.values.isMaxClaimAmount == true}
                          onChange={() =>
                            formik.setFieldValue("isMaxClaimAmount", true)
                          }
                        />
                        <RadioButton
                          className="self-start"
                          id="no-max-claim"
                          label="No"
                          value={false}
                          checked={formik.values.isMaxClaimAmount === false}
                          onChange={() =>
                            formik.setFieldValue("isMaxClaimAmount", false)
                          }
                        />
                      </div>
                    </Grid>
                  </div>
                  <div className="col-span-6">
                    <Grid className="!gap-0">
                      <div className="col-span-8">
                        <p className="flex text-[12px] font-semibold self-center justify-between">
                          {" "}
                          <span className="mr-[0.2rem]">
                            {" "}
                            Do you want to work as a servicer?
                          </span>
                        </p>
                      </div>
                      <div className="col-span-4 flex">
                        <RadioButton
                          id="yes"
                          label="Yes"
                          value={true}
                          checked={createServicerAccountOption === true}
                          onChange={handleServiceChange}
                        />
                        <RadioButton
                          id="no"
                          label="No"
                          value={false}
                          checked={createServicerAccountOption === false}
                          onChange={handleServiceChange}
                        />
                      </div>
                    </Grid>
                    <Grid className="!gap-0 mt-3">
                      <div className="col-span-8">
                        <p className="flex text-[12px] font-semibold justify-between">
                          <span className="">
                            {" "}
                            Do you want account for customer?{" "}
                          </span>
                        </p>
                      </div>
                      <div className="col-span-4 flex">
                        <RadioButton
                          id="yes-separate-account"
                          label="Yes"
                          value="yes"
                          // className="!pl-2"
                          checked={separateAccountOption === "yes"}
                          disabled={createAccountOption === "no"}
                          onChange={handleSeparateAccountRadioChange}
                        />
                        <RadioButton
                          id="no-separate-account"
                          label="No"
                          value="no"
                          checked={separateAccountOption === "no"}
                          onChange={handleSeparateAccountRadioChange}
                        />
                      </div>
                    </Grid>
                    <Grid className="!gap-0 mt-3">
                      <div className="col-span-8">
                        <p className=" text-[12px] font-semibold">
                          {" "}
                          Is Include manufacturer warranty?
                        </p>
                      </div>
                      <div className="col-span-4 flex">
                        <RadioButton
                          className="self-start"
                          id="yes-warranty"
                          label="Yes"
                          value={true}
                          checked={formik.values.isManufacturerWarranty == true}
                          onChange={() =>
                            formik.setFieldValue("isManufacturerWarranty", true)
                          }
                        />
                        <RadioButton
                          className="self-start"
                          id="no-warranty"
                          label="No"
                          value={false}
                          checked={
                            formik.values.isManufacturerWarranty === false
                          }
                          onChange={() =>
                            formik.setFieldValue(
                              "isManufacturerWarranty",
                              false
                            )
                          }
                        />
                      </div>
                    </Grid>
                  </div>
                  <div className="col-span-12">
                    <Grid>
                      <div className="col-span-7">
                        <Grid className="!gap-0 mt-3">
                          <div className="col-span-7">
                            <p className="text-[12px] font-semibold">
                              # of Claims Over the Certain Period
                            </p>
                          </div>
                          <div className="col-span-5 flex">
                            <RadioButton
                              className="self-start"
                              id="yes-warranty"
                              label="Unlimited"
                              value={true}
                              checked={claimOver === true}
                              onChange={() => {
                                setClaimOver(true);
                                formik.setFieldValue("noOfClaim", {
                                  period: "Monthly",
                                  value: -1,
                                });
                              }}
                            />
                            <RadioButton
                              className="self-start"
                              id="no-warranty"
                              label="Fixed"
                              value={false}
                              checked={claimOver === false}
                              onChange={() => {
                                setClaimOver(false);
                                formik.setFieldValue("noOfClaim", {
                                  period: "Monthly",
                                  value: 1,
                                });
                              }}
                            />
                          </div>
                        </Grid>
                      </div>
                      <div className="col-span-5">
                        {claimOver === false && (
                          <Grid>
                            <div className="col-span-6">
                              <Select
                                name={`noOfClaim.period`}
                                options={period}
                                className="!bg-grayf9"
                                placeholder=""
                                className1="!pt-2.5"
                                disableFirstOption={true}
                                OptionName={"Period"}
                                maxLength={"30"}
                                value={formik.values.noOfClaim.period}
                                onBlur={formik.handleBlur}
                                onChange={(name, value) =>
                                  formik.setFieldValue(name, value)
                                }
                              />
                            </div>
                            <div className="col-span-6">
                              <div className="">
                                <Input
                                  className1="!pt-2.5"
                                  placeholder="# of claims"
                                  type="tel"
                                  name={`noOfClaim.value`}
                                  value={formik.values.noOfClaim.value}
                                  onBlur={formik.handleBlur}
                                  onChange={(e) => {
                                    const sanitizedValue =
                                      e.target.value === ""
                                        ? 1
                                        : Math.max(
                                            1,
                                            parseInt(e.target.value, 10)
                                          );
                                    formik.setFieldValue(
                                      "noOfClaim.value",
                                      Math.max(1, sanitizedValue)
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          </Grid>
                        )}
                      </div>
                    </Grid>
                  </div>
                  <div className="col-span-12">
                    <Grid>
                      <div className="col-span-7">
                        <Grid className="!gap-0 mt-3">
                          <div className="col-span-7">
                            <p className="text-[12px] mb-3 font-semibold">
                              # of Claims in Coverage Period
                            </p>
                          </div>
                          <div className="col-span-5 flex">
                            <RadioButton
                              className="self-start"
                              id="yes-warranty"
                              label="Unlimited"
                              value={true}
                              checked={claimInCoveragePeriod === true}
                              onChange={() => {
                                setClaimInCoveragePeriod(true);
                                formik.setFieldValue("noOfClaimPerPeriod", -1);
                              }}
                            />
                            <RadioButton
                              className="self-start"
                              id="no-warranty"
                              label="Fixed"
                              value={false}
                              checked={claimInCoveragePeriod === false}
                              onChange={() => {
                                setClaimInCoveragePeriod(false);
                                formik.setFieldValue("noOfClaimPerPeriod", 1);
                              }}
                            />
                          </div>
                        </Grid>
                      </div>
                      <div className="col-span-5">
                        {claimInCoveragePeriod === false && (
                          <Grid className="!gap-0 ">
                            <div className="col-span-12">
                              <Input
                                className1="!pt-2.5"
                                placeholder="# of claims"
                                type="tel"
                                name={`noOfClaimPerPeriod`}
                                value={formik.values.noOfClaimPerPeriod.value}
                                onBlur={formik.handleBlur}
                                onChange={(e) => {
                                  const sanitizedValue =
                                    e.target.value === ""
                                      ? 1
                                      : Math.max(
                                          1,
                                          parseInt(e.target.value, 10)
                                        );
                                  formik.setFieldValue(
                                    "noOfClaimPerPeriod",
                                    Math.max(1, sanitizedValue)
                                  );
                                }}
                              />
                            </div>
                          </Grid>
                        )}
                      </div>
                    </Grid>
                  </div>
                  <div className="col-span-12">
                    <p className="text-base mb-3 font-semibold">
                      Coverage Type<span className="text-red text-sm">* </span>{" "}
                      :
                    </p>
                    <Grid>
                      {coverage.map((type) => (
                        <div key={type._id} className="col-span-3">
                          <div className="flex">
                            <Checkbox
                              name={`coverageType[${type.value}]`}
                              checked={formik.values.coverageType.includes(
                                type.value
                              )}
                              onChange={() => {
                                const selected = formik.values.coverageType;
                                const updatedCoverage = selected.includes(
                                  type.value
                                )
                                  ? selected.filter(
                                      (item) => item !== type.value
                                    )
                                  : [...selected, type.value];

                                formik.setFieldValue(
                                  "coverageType",
                                  updatedCoverage
                                );

                                let updatedadhDays =
                                  formik.values.adhDays || [];

                                if (updatedCoverage.includes(type.value)) {
                                  if (
                                    !updatedadhDays?.find(
                                      (item) => item.label === type.value
                                    )
                                  ) {
                                    updatedadhDays = [
                                      ...updatedadhDays,
                                      {
                                        label: type.value,
                                        value: type.value,
                                        waitingDays: 0,
                                        deductible: 0,
                                        amountType: "amount",
                                      },
                                    ];
                                  }
                                } else {
                                  updatedadhDays = updatedadhDays.filter(
                                    (item) => item.label !== type.value
                                  );
                                }

                                formik.setFieldValue("adhDays", updatedadhDays);
                              }}
                            />
                            <p className="font-semibold">{type.label}</p>
                          </div>

                          {formik?.values?.coverageType?.includes(
                            type.value
                          ) && (
                            <>
                              <div className="my-3">
                                <Input
                                  type="tel"
                                  name={`adhDays[${type.value}].waitingDays`}
                                  label={`Waiting Days`}
                                  className="!bg-white"
                                  maxDecimalPlaces={2}
                                  minLength={"1"}
                                  maxLength={"10"}
                                  value={
                                    formik?.values?.adhDays?.find(
                                      (item) => item.label === type.value
                                    )?.waitingDays || 0
                                  }
                                  onBlur={formik.handleBlur}
                                  onChange={(e) => {
                                    let newValue =
                                      e.target.value === ""
                                        ? 0
                                        : Math.max(
                                            1,
                                            parseInt(e.target.value, 10)
                                          );
                                    const updatedadhDays =
                                      formik?.values?.adhDays?.map((item) =>
                                        item.label === type.value
                                          ? {
                                              ...item,
                                              waitingDays: Number(newValue),
                                            }
                                          : item
                                      );
                                    formik.setFieldValue(
                                      "adhDays",
                                      updatedadhDays
                                    );
                                  }}
                                />
                              </div>
                              <div className="relative">
                                <Input
                                  type="number"
                                  name={`adhDays[${type.value}].deductible`}
                                  label="Deductible"
                                  className="!bg-white"
                                  maxDecimalPlaces={2}
                                  minLength={"1"}
                                  maxLength={"10"}
                                  onBlur={formik.handleBlur}
                                  onChange={(e) => {
                                    let newValue =
                                      parseFloat(e.target.value) || 0;
                                    newValue = newValue.toFixed(2);
                                    const updatedadhDays =
                                      formik?.values?.adhDays?.map((item) =>
                                        item.label === type.value
                                          ? {
                                              ...item,
                                              deductible: Number(newValue),
                                            }
                                          : item
                                      );

                                    formik.setFieldValue(
                                      "adhDays",
                                      updatedadhDays
                                    );
                                  }}
                                  value={
                                    formik?.values?.adhDays?.find(
                                      (item) => item.label === type.value
                                    )?.deductible || 0
                                  }
                                />

                                {formik.errors?.adhDays?.[type.value]
                                  ?.deductible ? (
                                  <div className="text-red-500 text-sm mt-1">
                                    {
                                      formik.errors?.adhDays?.[type.value]
                                        ?.deductible
                                    }
                                  </div>
                                ) : null}

                                <div className="absolute top-[1px] right-[1px]">
                                  <Select
                                    name={`adhDays[${type.value}].amountType`}
                                    label=""
                                    onChange={(e, value) => {
                                      const updatedadhDays =
                                        formik?.values?.adhDays?.map((item) =>
                                          item.label === type.value
                                            ? {
                                                ...item,
                                                amountType: value,
                                              }
                                            : item
                                        );
                                      formik.setFieldValue(
                                        "adhDays",
                                        updatedadhDays
                                      );
                                    }}
                                    value={
                                      formik?.values?.adhDays?.find(
                                        (item) => item.label === type.value
                                      )?.amountType || 0
                                    }
                                    classBox="!bg-transparent"
                                    className1="!border-0 !border-l !rounded-s-[0px] !text-light-black !pr-2"
                                    options={optiondeductibles}
                                  />
                                </div>
                              </div>
                              {formik.touched.coverageType &&
                                formik.errors.coverageType && (
                                  <div className="text-red-500 text-sm">
                                    {formik.errors.coverageType}
                                  </div>
                                )}
                            </>
                          )}
                        </div>
                      ))}
                    </Grid>
                  </div>
                </Grid>
              </div>
            </Grid>
          </Card>
          <Card className="bg-white p-8 relative drop-shadow-4xl mt-8 rounded-xl z-10">
            <p className="text-lg mb-3 font-semibold">
              {" "}
              Primary Contact Information
            </p>
            <Grid className="mt-5">
              <div className="col-span-6">
                <Input
                  type="text"
                  name="firstName"
                  label="First Name"
                  required={true}
                  placeholder=""
                  className="!bg-white"
                  maxLength={"30"}
                  value={formik.values.firstName}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={formik.touched.firstName && formik.errors.firstName}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className="text-red-500 text-sm pl-2 pt-2">
                    {formik.errors.firstName}
                  </div>
                )}
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  name="lastName"
                  label="Last Name"
                  className="!bg-white"
                  required={true}
                  placeholder=""
                  maxLength={"30"}
                  value={formik.values.lastName}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={formik.touched.lastName && formik.errors.lastName}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <div className="text-red-500 text-sm pl-2 pt-2">
                    {formik.errors.lastName}
                  </div>
                )}
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  name="email"
                  label="Email"
                  placeholder=""
                  className="!bg-white"
                  required={true}
                  value={formik.values.email}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={
                    (formik.touched.email && formik.errors.email) ||
                    (formik.touched.email &&
                      !isEmailAvailable &&
                      "Email is already in use")
                  }
                />
                {formik.touched.email && (
                  <div className="text-red-500 text-sm pl-2 pt-2">
                    {formik.errors.email &&
                      !isEmailAvailable &&
                      "Email is already in use"}
                    {formik.errors.email &&
                      isEmailAvailable &&
                      formik.errors.email}
                    {!formik.errors.email &&
                      !isEmailAvailable &&
                      "Email is already in use"}
                  </div>
                )}
              </div>
              <div className="col-span-6">
                <Input
                  type="tel"
                  name="phoneNumber"
                  label="Phone"
                  required={true}
                  className="!bg-white"
                  placeholder=""
                  value={formik.values.phoneNumber}
                  onChange={(e) => {
                    const sanitizedValue = e.target.value.replace(
                      /[^0-9]/g,
                      ""
                    );
                    console.log(sanitizedValue);
                    formik.handleChange({
                      target: {
                        name: "phoneNumber",
                        value: sanitizedValue,
                      },
                    });
                  }}
                  onBlur={formik.handleBlur}
                  onWheelCapture={(e) => {
                    e.preventDefault();
                  }}
                  minLength={"10"}
                  maxLength={"10"}
                  error={
                    formik.touched.phoneNumber && formik.errors.phoneNumber
                  }
                />
                {(formik.touched.phoneNumber || formik.submitCount > 0) &&
                  formik.errors.phoneNumber && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {formik.errors.phoneNumber}
                    </div>
                  )}
              </div>
              <div className="col-span-6 mb-0">
                <Input
                  type="text"
                  name="position"
                  label="Position"
                  className="!bg-white"
                  placeholder=""
                  maxLength={"50"}
                  value={formik.values.position}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={formik.touched.position && formik.errors.position}
                />
              </div>

              <div className="col-span-2 mb-0"> </div>
              <div className="col-span-4 self-end mb-0">
                <Button
                  type="button"
                  className="text-sm self-end !font-light w-full"
                  onClick={handleAddTeamMember}
                >
                  + Add More Team Members
                </Button>
              </div>
            </Grid>
          </Card>
          {formik.values.dealers.map((dealer, index) => (
            <Card
              key={index}
              className="bg-white p-8 z-0 relative drop-shadow-4xl mt-8 rounded-xl"
            >
              <p className="text-lg mb-6 font-semibold">
                Add Dealer’s Team Members
              </p>
              <div className="">
                <Grid className="">
                  <div className="col-span-11">
                    <Grid className="pr-12 pl-4">
                      <div className="col-span-4">
                        <Input
                          type="text"
                          name={`dealers[${index}].firstName`}
                          label="First Name"
                          required={true}
                          className="!bg-white"
                          placeholder=""
                          maxLength={"30"}
                          value={formik.values.dealers[index].firstName}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.dealers &&
                            formik.touched.dealers[index] &&
                            formik.errors.dealers &&
                            formik.errors.dealers[index] &&
                            formik.errors.dealers[index].firstName
                          }
                        />
                        {formik.touched.dealers &&
                          formik.touched.dealers[index] &&
                          formik.errors.dealers &&
                          formik.errors.dealers[index] &&
                          formik.errors.dealers[index].firstName && (
                            <div className="text-red-500 text-sm pl-2 pt-2">
                              {formik.errors.dealers[index].firstName}
                            </div>
                          )}
                      </div>

                      <div className="col-span-4">
                        <Input
                          type="text"
                          name={`dealers[${index}].lastName`}
                          className="!bg-white"
                          label="Last Name"
                          required={true}
                          placeholder=""
                          value={formik.values.dealers[index].lastName}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.dealers &&
                            formik.touched.dealers[index] &&
                            formik.errors.dealers &&
                            formik.errors.dealers[index] &&
                            formik.errors.dealers[index].lastName
                          }
                        />
                        {formik.touched.dealers &&
                          formik.touched.dealers[index] &&
                          formik.errors.dealers &&
                          formik.errors.dealers[index] &&
                          formik.errors.dealers[index].lastName && (
                            <div className="text-red-500 text-sm pl-2 pt-2">
                              {formik.errors.dealers[index].lastName}
                            </div>
                          )}
                      </div>
                      <div className="col-span-4">
                        <Input
                          type="text"
                          name={`dealers[${index}].email`}
                          label="Email"
                          placeholder=""
                          className="!bg-white"
                          required={true}
                          value={formik.values.dealers[index].email}
                          onBlur={async () => {
                            formik.handleBlur(`dealers[${index}].email`);
                          }}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.dealers &&
                            formik.touched.dealers[index] &&
                            formik.errors.dealers &&
                            formik.errors.dealers[index] &&
                            formik.errors.dealers[index].email
                          }
                        />
                        {formik.touched.dealers &&
                          formik.touched.dealers[index] &&
                          formik.errors.dealers &&
                          formik.errors.dealers[index] &&
                          formik.errors.dealers[index].email && (
                            <div className="text-red-500 text-sm pl-2 pt-2">
                              {formik.errors.dealers[index].email}
                            </div>
                          )}
                      </div>
                      <div className="col-span-4">
                        <Input
                          type="tel"
                          name={`dealers[${index}].phoneNumber`}
                          className="!bg-white"
                          label="Phone"
                          required={true}
                          placeholder=""
                          value={formik.values.dealers[index].phoneNumber}
                          onChange={(e) => {
                            const sanitizedValue = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                            console.log(sanitizedValue);
                            formik.handleChange({
                              target: {
                                name: `dealers[${index}].phoneNumber`,
                                value: sanitizedValue,
                              },
                            });
                          }}
                          onBlur={formik.handleBlur}
                          onWheelCapture={(e) => {
                            e.preventDefault();
                          }}
                          minLength={"10"}
                          maxLength={"10"}
                          error={
                            formik.touched.dealers &&
                            formik.touched.dealers[index] &&
                            formik.errors.dealers &&
                            formik.errors.dealers[index] &&
                            formik.errors.dealers[index].phoneNumber
                          }
                        />
                        {formik.touched.dealers &&
                          formik.touched.dealers[index] &&
                          formik.errors.dealers &&
                          formik.errors.dealers[index] &&
                          formik.errors.dealers[index].phoneNumber && (
                            <div className="text-red-500 text-sm pl-2 pt-2">
                              {formik.errors.dealers[index].phoneNumber}
                            </div>
                          )}
                      </div>
                      <div className="col-span-4">
                        <Input
                          type="text"
                          name={`dealers[${index}].position`}
                          className="!bg-white"
                          label="Position"
                          placeholder=""
                          value={formik.values.dealers[index].position}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                        />
                      </div>
                      <div className="col-span-4">
                        <p className="flex text-[12px] font-semibold mt-3 mb-6">
                          {" "}
                          Do you want to create an account?
                          <RadioButton
                            id={`yes-${index}`}
                            label="Yes"
                            value="yes"
                            disabled={createAccountOption === "no"}
                            checked={
                              formik.values.dealers &&
                              formik.values.dealers[index] &&
                              formik.values.dealers[index].status === true
                            }
                            onChange={() =>
                              handleRadioChangeDealers("yes", index)
                            }
                          />
                          <RadioButton
                            id={`no-${index}`}
                            label="No"
                            value="no"
                            checked={
                              formik.values.dealers &&
                              formik.values.dealers[index] &&
                              formik.values.dealers[index].status === false
                            }
                            onChange={() =>
                              handleRadioChangeDealers("no", index)
                            }
                          />
                        </p>
                      </div>
                    </Grid>
                  </div>
                  <div
                    className="col-span-1"
                    onClick={() => {
                      handleDeleteDealers(index);
                    }}
                  >
                    <div className="flex mx-3 h-full bg-Smoke justify-center">
                      <img
                        src={DeleteImage}
                        className="self-center cursor-pointer"
                        alt="Delete Icon"
                      />
                    </div>
                  </div>
                </Grid>
              </div>
            </Card>
          ))}
          {/* {formik.values.coverageType.length > 0 && (
            <Card className="z-0 p-8 relative drop-shadow-4xl border-[1px] mt-8 border-Light-Grey rounded-xl">
              <Grid>
                <div className="col-span-2">
                  <p className="text-lg mb-3 font-semibold">
                    {selectedOption === "yes"
                      ? "Add Price Book"
                      : "Upload Price Book"}{" "}
                  </p>
                </div>
                <div className="col-span-6 self-center">
                  <hr className="self-center ml-3 border-Light-Grey w-full" />
                </div>
                <div className="col-span-4 flex justify-end">
                  <RadioButton
                    id="yes"
                    label="Add Single Price Book"
                    value="yes"
                    checked={selectedOption === "yes"}
                    onChange={handleRadioChangeforBulk}
                  />
                  <RadioButton
                    id="no"
                    label="Upload In Bulk"
                    value="no"
                    checked={selectedOption === "no"}
                    onChange={handleRadioChangeforBulk}
                  />
                </div>
              </Grid>

              {selectedOption === "yes" ? (
                <>
                  {formik.values.priceBook.map((dealer, index) => (
                    <div className="bg-grayf9 p-4 relative mt-8 rounded-xl">
                      <div className="bg-white rounded-[30px] absolute top-[-17px] right-[-12px] p-3">
                        {index == 0 ? (
                          <Button
                            className="text-sm !font-light"
                            onClick={handleAddPriceBook}
                          >
                            {" "}
                            + Add More{" "}
                          </Button>
                        ) : (
                          <div
                            onClick={() => {
                              handleDeletePriceBook(index);
                            }}
                          >
                            <div className="flex h-full mx-3 bg-white justify-center">
                              <img
                                src={DeleteImage}
                                className="self-center cursor-pointer"
                                alt="Delete Icon"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className=" p-4 pl-0 relative rounded-xl">
                        <Grid className="">
                          <div className="col-span-4">
                            <Select
                              name={`priceBook[${index}].categoryId`}
                              label="Product Category"
                              options={category}
                              required={true}
                              className="!bg-grayf9"
                              placeholder=""
                              maxLength={"30"}
                              value={formik.values.priceBook[index].categoryId}
                              onBlur={formik.handleBlur}
                              onChange={handleSelectChange}
                              index={index}
                              error={
                                formik.touched.priceBook &&
                                formik.touched.priceBook[index] &&
                                formik.errors.priceBook &&
                                formik.errors.priceBook[index] &&
                                formik.errors.priceBook[index].categoryId
                              }
                            />
                            {formik.touched.priceBook &&
                              formik.touched.priceBook[index] &&
                              formik.errors.priceBook &&
                              formik.errors.priceBook[index] &&
                              formik.errors.priceBook[index].categoryId && (
                                <div className="text-red-500 text-sm pl-2 pt-2">
                                  {formik.errors.priceBook[index].categoryId}
                                </div>
                              )}
                          </div>

                          <div className="col-span-4">
                            <Select
                              name={`priceBook[${index}].priceBookId`}
                              label="Product SKU"
                              options={productNameOptions[index]?.data}
                              required={true}
                              className="!bg-grayf9"
                              placeholder=""
                              value={
                                formik.values?.priceBook[index].priceBookId
                              }
                              onBlur={formik.handleBlur}
                              onChange={handleSelectChange}
                              index={index}
                              disabled={
                                formik.values.priceBook[index].categoryId == ""
                              }
                              error={
                                formik.touched.priceBook &&
                                formik.touched.priceBook[index] &&
                                formik.errors.priceBook &&
                                formik.errors.priceBook[index] &&
                                formik.errors.priceBook[index].priceBookId
                              }
                            />
                            {formik.touched.priceBook &&
                              formik.touched.priceBook[index] &&
                              formik.errors.priceBook &&
                              formik.errors.priceBook[index] &&
                              formik.errors.priceBook[index].priceBookId && (
                                <div className="text-red-500 text-sm pl-2 pt-2">
                                  {formik.errors.priceBook[index].priceBookId}
                                </div>
                              )}
                          </div>

                          <div className="col-span-3">
                            <Input
                              type="text"
                              name={`priceBook[${index}].pName`}
                              className="!bg-grayf9"
                              label="Product Name"
                              required={true}
                              placeholder=""
                              value={formik.values.priceBook[index].pName}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              disabled={true}
                              onWheelCapture={(e) => {
                                e.preventDefault();
                              }}
                            />
                          </div>
                          <div className="col-span-4">
                            <Input
                              type="text"
                              name={`priceBook[${index}].wholesalePrice`}
                              className="!bg-grayf9"
                              label="Wholesale Price($)"
                              required={true}
                              placeholder=""
                              value={
                                formik.values.priceBook[index].wholesalePrice
                              }
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              disabled={true}
                              onWheelCapture={(e) => {
                                e.preventDefault();
                              }}
                            />
                          </div>

                          <div className="col-span-8">
                            <Input
                              type="text"
                              name={`priceBook[${index}].description`}
                              className="!bg-grayf9"
                              label="Description"
                              required={true}
                              placeholder=""
                              value={formik.values.priceBook[index].description}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              disabled={true}
                              onWheelCapture={(e) => {
                                e.preventDefault();
                              }}
                            />
                          </div>

                          <div className="col-span-4">
                            <Input
                              label="Terms"
                              name={`priceBook[${index}].terms`}
                              required={true}
                              placeholder=""
                              onChange={formik.handleChange}
                              className="!bg-grayf9"
                              options={termList}
                              disabled={true}
                              value={
                                formik.values.priceBook[index].terms + " Months"
                              }
                              onBlur={formik.handleBlur}
                              error={formik.touched.term && formik.errors.term}
                            />
                            {formik.touched.term && formik.errors.term && (
                              <div className="text-red-500 text-sm pl-2 pt-2">
                                {formik.errors.term}
                              </div>
                            )}
                          </div>
                          <div className="col-span-4">
                            <Input
                              type="number"
                              name={`priceBook[${index}].retailPrice`}
                              className="!bg-grayf9"
                              label="Retail Price($)"
                              maxLength={"10"}
                              maxDecimalPlaces={2}
                              required={true}
                              placeholder=""
                              value={formik.values.priceBook[index].retailPrice}
                              onChange={formik.handleChange}
                              onBlur={(e) => {
                                const formattedValue = parseFloat(
                                  e.target.value
                                ).toFixed(2);
                                formik.handleBlur(e);
                                formik.setFieldValue(
                                  `priceBook[${index}].retailPrice`,
                                  formattedValue
                                );
                              }}
                              onWheelCapture={(e) => {
                                e.preventDefault();
                              }}
                              error={
                                formik.touched.priceBook &&
                                formik.touched.priceBook[index] &&
                                formik.errors.priceBook &&
                                formik.errors.priceBook[index] &&
                                formik.errors.priceBook[index].retailPrice
                              }
                            />
                            {formik.touched.priceBook &&
                              formik.touched.priceBook[index] &&
                              formik.errors.priceBook &&
                              formik.errors.priceBook[index] &&
                              formik.errors.priceBook[index].retailPrice && (
                                <div className="text-red-500 text-sm pl-2 pt-2">
                                  {formik.errors.priceBook[index].retailPrice}
                                </div>
                              )}
                          </div>
                          <div className="col-span-4">
                            <Input
                              type="text"
                              name={`priceBook[${index}].dealerSku`}
                              className="!bg-grayf9"
                              label="Dealer  SKU"
                              required={true}
                              placeholder=""
                              value={formik.values.priceBook[index].dealerSku}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched.priceBook &&
                                formik.touched.priceBook[index] &&
                                formik.errors.priceBook &&
                                formik.errors.priceBook[index] &&
                                formik.errors.priceBook[index].dealerSku
                              }
                            />
                            {formik.touched.priceBook &&
                              formik.touched.priceBook[index] &&
                              formik.errors.priceBook &&
                              formik.errors.priceBook[index] &&
                              formik.errors.priceBook[index].dealerSku && (
                                <div className="text-red-500 text-sm pl-2 pt-2">
                                  {formik.errors.priceBook[index].dealerSku}
                                </div>
                              )}
                          </div>
                          <div className="col-span-4">
                            <Select
                              name={`priceBook[${index}].status`}
                              label="Status"
                              options={status}
                              required={true}
                              className="!bg-grayf9"
                              value={formik.values.priceBook[index].status}
                              onBlur={formik.handleBlur}
                              onChange={handleSelectChange}
                              error={
                                formik.touched.priceBook &&
                                formik.touched.priceBook[index] &&
                                formik.errors.priceBook &&
                                formik.errors.priceBook[index] &&
                                formik.errors.priceBook[index].status
                              }
                            />
                            {formik.touched.priceBook &&
                              formik.touched.priceBook[index] &&
                              formik.errors.priceBook &&
                              formik.errors.priceBook[index] &&
                              formik.errors.priceBook[index].status && (
                                <div className="text-red-500 text-sm pl-2 pt-2">
                                  {formik.errors.priceBook[index].status}
                                </div>
                              )}
                          </div>
                          <div className="col-span-8">
                            <div className="relative">
                              <label
                                htmlFor="coverageType"
                                className="absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-white left-2 px-1 -translate-y-4 scale-75"
                              >
                                Coverage Type
                              </label>
                              <div className="block w-full text-base font-semibold min-h-[50px] bg-transparent p-2.5 rounded-lg border border-gray-300">
                                {coverageType && coverageType.length > 0 ? (
                                  <ol className="flex flex-wrap">
                                    {coverageType.map((type, index) => (
                                      <li
                                        className="font-semibold list-disc mx-[19px] text-[#5D6E66]"
                                        key={index}
                                      >
                                        {type.label}
                                      </li>
                                    ))}
                                  </ol>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </div>
                          </div>
                        </Grid>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="bg-grayf9 p-4 relative drop-shadow-4xl border-[1px] mt-8 border-Light-Grey rounded-xl">
                  <p className="text-[#717275] text-lg mb-5 font-semibold">
                    Upload In Bulk
                  </p>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={handleDropdownClick}
                      className={`bg-[#F2F2F2] border-[1px] border-[#D1D9E2] border-dashed	py-10 w-full rounded-md focus:outline-none focus:border-blue-500 !bg-transparent`}
                    >
                      {selectedFile ? (
                        <div className="self-center flex text-center relative bg-white border w-[80%] mx-auto p-3">
                          <img src={csvFile} className="mr-2" alt="Dropbox" />
                          <div className="flex justify-between w-full">
                            <p className="self-center">{selectedFile.name}</p>
                            <p className="self-center">
                              {(selectedFile.size / 1000).toFixed(2)} kb
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
                            Accepted file types: csv, xlsx, xls Max. file size:
                            50 MB.
                          </p>
                        </>
                      )}
                    </button>

           
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      style={{ display: "none" }}
                      onChange={handleFileSelect}
                    />
                  </div>
                  {formik.touched.file && formik.errors.file && (
                    <p className="text-red-500 text-sm mt-1 font-medium">
                      {formik.errors.file}
                    </p>
                  )}
                  {formik.touched.file && fileError && (
                    <p className="text-red-500 text-sm mt-1 font-medium">
                      {fileError}
                    </p>
                  )}
                  <p className="text-[11px] mt-1 text-[#5D6E66] font-medium">
                    Please click on file option and make a copy. Upload the list
                    of Product Name and Price using our provided Google Sheets
                    template, by{" "}
                    <span
                      className="underline cursor-pointer"
                      onClick={downloadCSVTemplate}
                    >
                      Clicking here{" "}
                    </span>
                    . The file must be saved with csv , xls and xlsx Format.
                  </p>
                </div>
              )}
            </Card>
          )} */}

          <div className="fixed bottom-0 w-full z-[99999]">
            <div className="bg-white pb-4 pl-10">
              <Button type="submit" className="mt-4 mx-auto">
                Submit
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Modal Email Popop */}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {message === "New Dealer Created Successfully" ? (
          <></>
        ) : (
          <>
            <Button
              onClick={closeModal}
              className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-Granite-Gray"
            >
              <img
                src={Cross}
                className="w-full h-full text-black rounded-full p-0"
              />
            </Button>{" "}
          </>
        )}
        <div className="text-center py-3">
          {message === "New Dealer Created Successfully" ? (
            <>
              <img src={AddDealer} alt="email Image" className="mx-auto" />
              <p className="text-3xl mb-0 mt-4 font-semibold text-neutral-grey">
                Submitted
                <span className="text-light-black"> Successfully </span>
              </p>
              <p className="text-neutral-grey text-base font-medium mt-2">
                {message}
              </p>
              <p className="text-neutral-grey text-base font-medium mt-2">
                Redirecting you on Dealer Page {timer} seconds.
              </p>
            </>
          ) : (
            <>
              <img src={disapprove} alt="email Image" className="mx-auto" />
              <p className="text-3xl mb-0 mt-4 font-semibold text-light-black">
                Error
              </p>
              <p className="text-neutral-grey text-base font-medium mt-2">
                {message}
              </p>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default Dealer;
