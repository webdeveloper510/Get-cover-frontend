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
  const [selected, setSelected] = useState([]);
  const [coverage, setCoverage] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("start");
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
    savePriceBookType: selectedOption,
    dealers: [],

    priceBook: [
      {
        priceBookId: "",
        categoryId: "",
        wholesalePrice: "",
        terms: "",
        pName: "",
        description: "",
        retailPrice: "",
        status: "",
        dealerSku: "",
      },
    ],
    isAccountCreate: false,
    customerAccountCreated: false,
    serviceCoverageType: "",
    coverageType: [],
    isShippingAllowed: false,
    noOfClaim: {
      period: "",
      value: -1,
    },
    isManufacturerWarranty: false,
    file: "",
    oldName: "",
    oldEmail: "",
    isServicer: createServicerAccountOption,
    termCondition: {},
    adhDays: coverage.reduce((acc, type) => {
      acc.push({
        label: type.value,
        value: 0,
        value1: 0,
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

  const period = [
    { label: "Monthly ", value: "monthly " },
    { label: "Annually ", value: "Annually " },
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
        savePriceBookType: selectedOption,
        serviceCoverageType: "",
        coverageType: [],
        noOfClaim: {
          period: "",
          value: -1,
        },
        isShippingAllowed: false,
        isManufacturerWarranty: false,
        dealers: [],
        priceBook: [
          {
            priceBookId: "",
            categoryId: "",
            wholesalePrice: "",
            terms: "",
            description: "",
            pName: "",
            retailPrice: "",
            status: "",
          },
        ],
        isAccountCreate: false,
        customerAccountCreated: false,
        isServicer: createServicerAccountOption,
        file: "",
        termCondition: {},
        adhDays: coverage.reduce((acc, type) => {
          acc.push({
            label: type.value,
            value: 0,
            value1: 0,
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
            savePriceBookType: selectedOption,
            serviceCoverageType: "",
            coverageType: [],
            isShippingAllowed: false,
            isManufacturerWarranty: false,
            noOfClaim: {
              period: "",
              value: -1,
            },
            priceBook: [
              {
                priceBookId: "",
                categoryId: "",
                wholesalePrice: "",
                terms: "",
                pName: "",
                description: "",
                retailPrice: "",
                status: "",
              },
            ],
            file: "",
            isAccountCreate: false,
            customerAccountCreated: false,
            isServicer: createServicerAccountOption,
            termCondition: {},
            adhDays: coverage.reduce((acc, type) => {
              acc.push({
                label: type.value,
                value: 0,
                value1: 0,
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
      navigate("/dealerList");
    }
    return () => clearInterval(intervalId);
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

    if (file.size > maxSize) {
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
    formik.setFieldValue("savePriceBookType", event.target.value);
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
      coverageType: Yup.array().min(1, "Required"),
      phoneNumber: Yup.string()
        .required("Required")
        .min(10, "Must be at least 10 characters")
        .max(10, "Must be exactly 10 characters")
        .matches(/^[0-9]+$/, "Must contain only digits"),
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
      // priceBook:
      //   selectedOption === "no"
      //     ? Yup.array().notRequired()
      //     : Yup.array().of(
      //         Yup.object().shape({
      //           priceBookId: Yup.string().required("Required"),
      //           categoryId: Yup.string().required("Required"),
      //           dealerSku: Yup.string().required("Required"),
      //           retailPrice: Yup.number()
      //             .typeError("Required")
      //             .required("Required")
      //             .min(0, "Retail Price cannot be negative")
      //             .nullable(),
      //           status: Yup.boolean().required("Required"),
      //         })
      //       ),
      // file:
      //   selectedOption === "yes"
      //     ? Yup.string().notRequired()
      //     : Yup.string().required("File is required"),
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
      console.log(values.priceBook);
      var valueArr = values.priceBook.map(function (item) {
        return item.priceBookId;
      });
      var isDuplicate = valueArr.some(function (item, idx) {
        return valueArr.indexOf(item) != idx;
      });
      if (isDuplicate) {
        setLoading(false);
        setMessage("PriceBook Exist with Same Name ");
        setIsModalOpen(true);
        return;
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
            Object.entries(item).forEach(([subKey, subValue]) => {
              formData.append(`${key}[${index}][${subKey}]`, subValue);
            });
          });
        } else {
          formData.append(key, value);
        }
      });

      if (id !== undefined) {
        formData.append("dealerId", id);
      }

      const result = await addNewOrApproveDealer(formData);
      console.log(result);

      if (result.message === "Successfully Created") {
        setLoading(false);
        setError("done");
        setIsModalOpen(true);
        setMessage("New Dealer Created Successfully");
        setTimer(3);
        setSelected([]);
      } else if (result.message === "Dealer name already exists") {
        setLoading(false);
        formik.setFieldError("name", "Name Already Used");
        setMessage("Some Errors Please Check Form Validations ");
        setIsModalOpen(true);
      } else if (result.message === "Primary user email already exist") {
        setLoading(false);
        formik.setFieldError("email", "Email Already Used");
        setMessage("Some Errors Please Check Form Validations ");
        setIsModalOpen(true);
      } else if (result.message === "Invalid priceBook field") {
        if (
          result.message ===
          "Invalid file format detected. The sheet should contain exactly two columns."
        ) {
          setFileError(
            "Invalid file format detected. The sheet should contain exactly two columns."
          );
          setLoading(false);
          setIsModalOpen(true);
          setMessage(
            "Invalid file format detected. The sheet should contain exactly two columns."
          );
        } else {
          setFileError(null);
        }
      } else {
        setLoading(false);
        setIsModalOpen(true);
        setMessage(result.message);
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
        <form className="mt-8" onSubmit={formik.handleSubmit}>
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
                <p className="text-lg mb-3 font-semibold">Dealer Information</p>
                <Grid className="mt-5">
                  <div className="col-span-6 mt-2">
                    <Grid>
                      <div className="col-span-12">
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

                      <div className="col-span-12">
                        <div className="relative">
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
                    </Grid>
                  </div>
                  <div className="col-span-6 pt-2 mt-2">
                    <p className="flex text-[12px] mb-7 font-semibold ">
                      Do you want to create an account?
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
                    </p>
                    <p className="flex text-[12px] mb-7 font-semibold ">
                      <span className="mr-[0.58rem]">
                        Do you want to Provide Shipping?
                      </span>
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
                    </p>

                    <p className="flex text-[12px] mb-7 font-semibold self-center">
                      {" "}
                      <span className="mr-[0.2rem]">
                        {" "}
                        Do you want to work as a servicer?
                      </span>
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
                    </p>
                    <p className="flex text-[12px] font-semibold">
                      <span className="w-[60%]">
                        {" "}
                        Do you want to create separate account for customer?{" "}
                      </span>
                      <RadioButton
                        id="yes-separate-account"
                        label="Yes"
                        value="yes"
                        className="!pl-2"
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
                    </p>
                  </div>
                </Grid>
                <p className="mt-4 text-lg mb-3 font-semibold">
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
                      error={
                        formik.touched.firstName && formik.errors.firstName
                      }
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
              </div>
            </Grid>
          </Card>
          <Card className="bg-white p-8 relative drop-shadow-4xl mt-8 rounded-xl z-10">
            <p className="text-lg mb-3 font-semibold">Dealer Settings</p>
            <Grid>
              <div className="col-span-6 ">
                <p className="text-base mb-3 font-semibold self-center mr-4">
                  # of claims in a certain period Period can be:
                </p>
                <div className="flex flex-wrap">
                  {/* <Select
                    name={`period`}
                    options={period}
                    className="!bg-grayf9 "
                    placeholder=""
                    className1="!pt-2.5"
                    OptionName={"Period"}
                    maxLength={"30"}
                    value={formik.values.period}
                    onBlur={formik.handleBlur}
                    onChange={handleSelectChange}
                  /> */}
                  <Select
                    name={`noOfClaim.period`}
                    options={period}
                    className="!bg-grayf9 "
                    placeholder=""
                    className1="!pt-2.5"
                    OptionName={"Period"}
                    maxLength={"30"}
                    value={formik.values.noOfClaim.period}
                    onBlur={formik.handleBlur}
                    onChange={(name, value) =>
                      formik.setFieldValue(name, value)
                    }
                  />
                  {/* <div className="ml-3">
                    <Input
                      className1="!pt-2.5"
                      placeholder="# of claims"
                      type="number"
                    />
                  </div> */}
                </div>
              </div>
              <div className="col-span-6 flex">
                <p className="self-center text-lg mb-3 font-semibold">
                  {" "}
                  Is manufacturer warranty{" "}
                  {formik.values.isManufacturerWarranty} ?
                  <RadioButton
                    id="yes-warranty"
                    label="Yes"
                    value={true}
                    checked={formik.values.isManufacturerWarranty == true}
                    onChange={() =>
                      formik.setFieldValue("isManufacturerWarranty", true)
                    }
                  />
                  <RadioButton
                    id="no-warranty"
                    label="No"
                    value={false}
                    checked={formik.values.isManufacturerWarranty === false}
                    onChange={() =>
                      formik.setFieldValue("isManufacturerWarranty", false)
                    }
                  />
                </p>
              </div>
              <div className="col-span-12">
                <p className="text-base mb-3 font-semibold">Coverage Type :</p>
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
                              ? selected.filter((item) => item !== type.value)
                              : [...selected, type.value];

                            formik.setFieldValue(
                              "coverageType",
                              updatedCoverage
                            );

                            let updatedadhDays = formik.values.adhDays || [];

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
                                    value: 0,
                                    value1: 0,
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
                        <p className="font-medium">{type.label}</p>
                      </div>

                      {formik?.values?.coverageType?.includes(type.value) && (
                        <>
                          <div className="my-3">
                            <Input
                              type="number"
                              name={`adhDays[${type.value}].value`}
                              label={`${type.label} Days`}
                              className="!bg-white"
                              value={
                                formik?.values?.adhDays?.find(
                                  (item) => item.label === type.value
                                )?.value || 0
                              }
                              onBlur={formik.handleBlur}
                              onChange={(e) => {
                                const updatedadhDays =
                                  formik?.values?.adhDays?.map((item) =>
                                    item.label === type.value
                                      ? {
                                        ...item,
                                        value: Number(e.target.value),
                                      }
                                      : item
                                  );
                                formik.setFieldValue("adhDays", updatedadhDays);
                              }}
                            />
                          </div>

                          <Input
                            type="number"
                            name={`adhDays[${type.value}].value1`}
                            label={`${type.label} Deduction Amount ($)`}
                            className="!bg-white w-[220px]"
                            value={
                              formik?.values?.adhDays?.find(
                                (item) => item.label === type.value
                              )?.value1 || 0
                            }
                            onBlur={formik.handleBlur}
                            onChange={(e) => {
                              const updatedadhDays =
                                formik?.values?.adhDays?.map((item) =>
                                  item.label === type.value
                                    ? {
                                      ...item,
                                      value1: Number(e.target.value),
                                    }
                                    : item
                                );
                              formik.setFieldValue("adhDays", updatedadhDays);
                            }}
                          />
                        </>
                      )}
                    </div>
                  ))}

                  {formik.touched.coverageType &&
                    formik.errors.coverageType && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.coverageType}
                      </div>
                    )}
                </Grid>
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
