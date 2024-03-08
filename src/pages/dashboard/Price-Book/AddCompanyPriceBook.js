import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Headbar from "../../../common/headBar";
import Select from "../../../common/select";
import Grid from "../../../common/grid";
import Input from "../../../common/input";
import { useFormik } from "formik";
import * as Yup from "yup";
import Loader from "../../../assets/images/Loader.gif";
// Media Include
import BackImage from "../../../assets/images/icons/backArrow.svg";
import Button from "../../../common/button";
import Modal from "../../../common/model";
import AddDealer from "../../../assets/images/dealer-book.svg";
import terms from "../../../assets/images/icons/terms.svg";
import dealer from "../../../assets/images/icons/dealerName.svg";
import DeleteImage from "../../../assets/images/icons/Delete.svg";

import {
  addCompanyPricBook,
  editCompanyList,
  getCategoryListActiveData,
  getCompanyPriceBookById,
  getTermList,
} from "../../../services/priceBookService";
import { RotateLoader } from "react-spinners";

function AddCompanyPriceBook() {
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [termList, setTermList] = useState([]);
  const [totalAmount, setTotalAmount] = useState();
  const [type, setType] = useState("");
  const { id } = useParams();
  const [detailsById, setDetailsById] = useState();
  const [active, setinActive] = useState(false);
  const [value, setValue] = useState("");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  console.log(id);
  const pricetype = [
    { label: "Regular Pricing", value: "Regular Pricing" },
    { label: "Flat Pricing", value: "Flat Pricing" },
    { label: "Quantity Pricing", value: "Quantity Pricing" },
  ];


  const formik = useFormik({
    initialValues: {
      priceCatId: "",
      name: "",
      description: "",
      term: "",
      frontingFee: "",
      reinsuranceFee: "",
      reserveFutureFee: "",
      adminFee: "",
      status: "",
      priceType: "Regular Pricing",
      rangeStart: "",
      rangeEnd: "",
      quantityPriceDetail: [{
        name: "",
        quantity: ""
      }
      ]
    },
    validationSchema: Yup.object({
      priceCatId: Yup.string().required("Required"),
      name: Yup.string().required("Required").transform((originalValue) => originalValue.trim()),
      description: Yup.string().required("Required"),
      term: Yup.number().required("Required"),
      frontingFee: Yup.number()
        .typeError("Required")
        .required("Required")
        .min(0, "Fronting fee cannot be negative")
        .nullable(),
      reinsuranceFee: Yup.number()
        .typeError("Required")
        .required("Required")
        .nullable()
        .min(0, "Re-insurance fee cannot be negative"),
      reserveFutureFee: Yup.number()
        .typeError("Required")
        .required("Required")
        .nullable()
        .min(0, "Reserve for future claims cannot be negative"),
      adminFee: Yup.number()
        .typeError("Required")
        .required("Required")
        .nullable()
        .min(0, "Administration  fee cannot be negative"),
      status: Yup.string().required("Required"),
      priceType: Yup.string().required("Required"),

      rangeStart:
        value !== "Flat Pricing"
          ? Yup.number().notRequired()
          : Yup.number()
            .typeError("Required")
            .required("Required")
            .nullable()
            .min(0, "Range Start cannot be negative"),
            rangeEnd: value !== "Flat Pricing"
            ? Yup.number().notRequired()
            : Yup.number()
              .typeError("Required")
              .required("Required")
              .nullable()
              .min(0, "Range End cannot be negative")
              .test('endRange', 'End Range should be greater than start range', function (value) {
                const { rangeStart } = this.parent;
                return value > rangeStart;
              }),

      quantityPriceDetail:
        value !== "Quantity Pricing"
          ? Yup.array().notRequired()
          : Yup.array().of(
            Yup.object().shape({
              name: Yup.string().required("Required").transform((originalValue) => originalValue.trim()),
              quantity: Yup.number()
                .typeError("Required")
                .required("Required")
                .nullable()
                .min(1, "quantity cannot be less then Zero"),
            })
          )

    }),

    onSubmit: async (values) => {
      if(value !='Flat Pricing'){
        delete values.rangeStart
        delete values.rangeEnd
        }
      let result;
      let checkErrors = false
      try {
        console.log(values, value)
        setLoader(true);
        if (id) {
          if (value == "Quantity Pricing") {
            formik.values.quantityPriceDetail.forEach((item, index) => {
              console.log(item);
              try {
                Yup.object().shape({
                  name: Yup.string().required("Required").transform((originalValue) => originalValue.trim()),
                  quantity: Yup.number()
                    .typeError("Required")
                    .required("Required")
                    .test('is-positive', 'Required', (value) => value != null && value >= 1),
                }).validateSync(item, { abortEarly: true });
              } catch (error) {
                console.log(error.errors);
                checkErrors = true;

                if (item.name === "") {
                  formik.setFieldError(`quantityPriceDetail[${index}].name`, "Required");
                }
                if (item.quantity == null || item.quantity < 1) {
                  formik.setFieldError(`quantityPriceDetail[${index}].quantity`, "Quantity must be greater than or equal to 1");
                  console.log(error.errors);
                }
              }
            });

          }

          console.log(checkErrors)

          if (checkErrors) {
            return false

          }
          else {
            console.log('here')
            result = await editCompanyList(id, values);
          }

        } else {
          result = await addCompanyPricBook(values);
        }

        if (result.code !== 200) {
          setLoader(true);
          setError(result.message);
          setLoader(false);
        } else {
          setLoader(true);
          setError(false);
          setIsModalOpen(true);
          setTimer(3);
        }
      } catch (error) {
        setLoader(true);
        setError(error);
        console.error("Error:", error);
      } finally {
        setLoader(false);
      }
      setLoader(false);
    },
  });
  const handleAddQuantity = () => {
    const quantityPriceDetail = {
      name: "",
      quantity: ""
    };
    formik.setFieldValue("quantityPriceDetail", [
      ...formik.values.quantityPriceDetail,
      quantityPriceDetail
    ]);
  };
  const handleDeleteQuantity = (index) => {
    const updatedQuantity = [...formik.values.quantityPriceDetail];
    updatedQuantity.splice(index, 1);
    formik.setFieldValue("quantityPriceDetail", updatedQuantity);
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
  const calculateTotal = () => {
    const frontingFee = parseFloat(formik.values.frontingFee) || 0;
    const reinsuranceFee = parseFloat(formik.values.reinsuranceFee) || 0;
    const reserveFutureFee = parseFloat(formik.values.reserveFutureFee) || 0;
    const adminFee = parseFloat(formik.values.adminFee) || 0;

    const total = frontingFee + reinsuranceFee + reserveFutureFee + adminFee;

    const roundedTotal = total;
    setTotalAmount(roundedTotal);
  };
  useEffect(() => {
    getCategoryListActiveData11();
    getTermListData();
  }, []);
  useEffect(() => {
    calculateTotal();
  }, [formik.values]);

  useEffect(() => {
    let isMounted = true;

    const getPriceBookDetailsById = async () => {
      setLoader(true);
      const data = await getCategoryListActiveData11();
      console.log(data);

      try {
        if (id) {
          setType("Edit");
          const result = await getCompanyPriceBookById(id);
          setDetailsById(result.result);
          if (isMounted) {
            console.log(result.result.rangeEnd)
            if (result.result.startRange !== "") {
              formik.setValues({
                startRange: result.result.startRange
              })
            }
            else {

            }
            setDetailsById(result.result);
            setValue(result.result.priceType)
            formik.setValues({
              priceCatId: result.result.category._id,
              name: result.result.name,
              description: result.result.description,
              term: result.result.term,
              frontingFee: result?.result?.frontingFee?.toFixed(2),
              reinsuranceFee: result?.result?.reinsuranceFee?.toFixed(2),
              reserveFutureFee: result?.result?.reserveFutureFee?.toFixed(2),
              adminFee: result?.result?.adminFee?.toFixed(2),
              status: result.result.status,
              priceType: result.result.priceType,
              rangeStart: result?.result?.rangeStart?.toFixed(2),
              rangeEnd: result?.result?.rangeEnd?.toFixed(2),
              quantityPriceDetail: result?.result?.quantityPriceDetail
            });

            setLoader(false);
          }
        } else {
          setLoader(false);
          setType("Add");
        }
        // setLoader(false);
      } catch (error) {
        setLoader(false);
        console.error("Error fetching data:", error);
      }
    };

    getPriceBookDetailsById();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    let intervalId;
    if (isModalOpen && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    if (timer === 0) {
      closeModal();
      navigate("/companyPriceBook");
    }
    return () => clearInterval(intervalId);
  }, [isModalOpen, timer]);

  const getTermListData = async () => {
    try {
      const res = await getTermList();
      console.log(res);
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

  const getCategoryListActiveData11 = async () => {
    try {
      const res = await getCategoryListActiveData(id);
      console.log(res.result);
      if (res.result[0].status) {
        setinActive(res.result[0].status);
      }
      setCategoryList(
        res.result.map((item) => ({
          label: item.name,
          value: item._id,
          status: item.status,
        }))
      );
    } catch (error) {
      console.error("Error fetching category list:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleSelectChange = (name, selectedValue) => {
    console.log(name)
    if (name === "priceCatId") {
      const data = categoryList.find((value) => {
        if (value.status == false) {
          formik.setFieldValue("status", value.status);
        }
        return value.value === selectedValue;
      });
      setinActive(data.status);
    }
    if (name === "priceType") {
      console.log(selectedValue)
      setValue(selectedValue)
    }
    formik.setFieldValue(name, selectedValue);
  };

  const status = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];

  const defaultValue = formik.values.status === "" ? false : true;
  const handleGOBack = () => {
    navigate(-1);
  };
  return (
    <div className="mb-8 ml-3">
      <Headbar />

      <div className="flex mt-14">
        <Link
          to={"/companyPriceBook"}
          className="h-[60px] w-[60px] flex border-[1px] bg-[#fff] border-[#D1D1D1] rounded-[25px]"
        >
          <img
            src={BackImage}
            className="m-auto my-auto self-center bg-white"
            alt="BackImage"
          />{" "}
        </Link>
        <div className="pl-3">
          <p className="font-bold  text-[36px] leading-9 mb-[3px]">
            {type} Company Price Book
          </p>
          <ul className="flex self-center">
            <li className="text-sm text-neutral-grey font-Regular">
              <Link onClick={handleGOBack}>Price Book </Link>{" "}
              <span className="mx-2"> /</span>{" "}
            </li>
            <li className="text-sm text-neutral-grey font-Regular ml-1">
              <Link
                to={"/companyPriceBook"}
                className="text-sm text-neutral-grey font-Regular"
              >
                Company Price Book{" "}
              </Link>{" "}
              <span className="mx-2"> /</span>{" "}
            </li>
            <li className="text-sm text-neutral-grey font-semibold ml-1">
              {" "}
              {type} Company Price Book{" "}
            </li>
          </ul>
        </div>
      </div>
      {loader !== false ? (
        <div className=" h-screen w-full flex py-5">
          <div className="self-center mx-auto">
            <RotateLoader color="#333" />
          </div>
        </div>
      ) : (
        <>
          {/* {error && (
            <p className="text-red-500 text-sm pl-2">
              <span className="font-semibold"> {error} </span>
            </p>
          )} */}
          {type == "Edit" && (
            <div className="bg-Edit bg-cover px-8 mt-8 py-16 rounded-[30px]">
              <Grid className="mx-8 mx-auto ">
                <div className="col-span-3 self-center border-r border-[#4e4e4e]">
                </div>
                <div className="col-span-3 border-r border-[#4e4e4e]">
                  <div className="flex">
                    <div className="self-center bg-[#FFFFFF08] backdrop-blur border-[#D1D9E24D] border rounded-lg p-3 mr-4">
                      <img src={dealer} className="w-6 h-6" alt="dealer" />
                    </div>
                    <div className="self-center">
                      <p className="text-[#FFF] text-base font-medium leading-5	">
                        Product Name
                      </p>
                      <p className="text-[#FFFFFF] opacity-50 text-sm	font-medium">
                        {detailsById?.name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="flex justify-center">
                    <div className="self-center bg-[#FFFFFF08] border-[#D1D9E24D] border rounded-lg p-3 mr-4">
                      <img src={terms} className="w-6 h-6" alt="terms" />
                    </div>
                    <div className="self-center">
                      <p className="text-[#FFF] text-base font-medium leading-5">
                        Terms
                      </p>
                      <p className="text-[#FFFFFF] opacity-50	text-sm font-medium">
                        {detailsById?.term} Months
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-3">
                </div>
              </Grid>
            </div>
          )}
          <form className="mt-8" onSubmit={formik.handleSubmit}>
            <div className="px-8 pb-8 pt-6 drop-shadow-4xl bg-white  border-[1px] border-[#D1D1D1]  rounded-3xl">
              {error ? (
                <p className="text-red-500 text-sm pl-2 mt-3 mb-5">
                  <span className="font-semibold"> {error} </span>
                </p>
              ) : (
                <p className="text-red-500 text-sm pl-2 mt-3 mb-5 opacity-0	">
                  <span className="font-semibold"> error </span>
                </p>
              )}
              <Grid
                className={`${type == "Edit" ? "!grid-cols-4" : "!grid-cols-5"
                  } `}
              >
                <div className="col-span-1">
                  <Select
                    label="Price Type"
                    name="priceType"
                    required={true}
                    placeholder=""
                    onChange={handleSelectChange}
                    className="!bg-[#fff]"
                    options={pricetype}
                    value={
                      (
                        pricetype.find(
                          (option) =>
                            option.value ==
                            (formik.values.priceType
                              ? formik.values.priceType.toString()
                              : "")
                        ) || {}
                      ).value || ""
                    }
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.priceType && formik.errors.priceType
                    }
                  />
                  {formik.touched.priceType && formik.errors.priceType && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {formik.errors.priceType}
                    </div>
                  )}
                </div>
                <div className="col-span-1">
                  <Select
                    label="Product Category"
                    name="priceCatId"
                    placeholder=""
                    onChange={handleSelectChange}
                    required={true}
                    className="!bg-[#fff]"
                    options={categoryList}
                    value={
                      (
                        categoryList.find(
                          (option) => option.value === formik.values.priceCatId
                        ) || {}
                      ).value || ""
                    }
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.priceCatId && formik.errors.priceCatId
                    }
                  />

                  {formik.touched.priceCatId && formik.errors.priceCatId && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {formik.errors.priceCatId}
                    </div>
                  )}
                </div>
                {type == "Edit" ? (
                  <></>
                ) : (
                  <div className="col-span-1">
                    <Input
                      type="text"
                      name="name"
                      className="!bg-[#fff]"
                      label="Product Name "
                      placeholder=""
                      required={true}
                      maxLength={50}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.name}
                      disabled={type === "Edit"}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <div className="text-red-500 text-sm pl-2 pt-2">
                        {formik.errors.name}
                      </div>
                    )}
                  </div>
                )}

                <div className="col-span-2">
                  <Input
                    type="text"
                    name="description"
                    className="!bg-[#fff]"
                    label="Description "
                    maxLength={100}
                    placeholder=""
                    required={true}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {formik.errors.description}
                    </div>
                  )}
                </div>
              </Grid>
              <Grid className="!grid-cols-6 mt-5">
                <div className="col-span-1">
                  <Input
                    type="number"
                    name="frontingFee"
                    className="!bg-[#fff]"
                    label="Fronting fee($)"
                    placeholder=""
                    required={true}
                    maxLength={"10"}
                    onChange={formik.handleChange}
                    onBlur={(e) => {
                      const formattedValue = parseFloat(e.target.value).toFixed(
                        2
                      );
                      formik.handleBlur(e);
                      formik.setFieldValue("frontingFee", formattedValue);
                    }}
                    value={formik.values.frontingFee}
                    maxDecimalPlaces={2}
                  />
                  {formik.touched.frontingFee && formik.errors.frontingFee && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {formik.errors.frontingFee}
                    </div>
                  )}
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    name="reinsuranceFee"
                    className="!bg-[#fff] !px-0 w-[155px]"
                    label="Re-insurance fee($)"
                    minLength={"1"}
                    maxLength={"10"}
                    required={true}
                    placeholder=""
                    onChange={formik.handleChange}
                    onBlur={(e) => {
                      const formattedValue = parseFloat(e.target.value).toFixed(
                        2
                      );
                      formik.handleBlur(e);
                      formik.setFieldValue("reinsuranceFee", formattedValue);
                    }}
                    value={formik.values.reinsuranceFee}
                    maxDecimalPlaces={2}
                  />
                  {formik.touched.reinsuranceFee &&
                    formik.errors.reinsuranceFee && (
                      <div className="text-red-500 text-sm pl-2 pt-2">
                        {formik.errors.reinsuranceFee}
                      </div>
                    )}
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    name="reserveFutureFee"
                    required={true}
                    minLength={"1"}
                    maxLength={"10"}
                    className="!bg-[#fff] !px-0 w-[220px]"
                    label="Reserve for future claims($)"
                    placeholder=""
                    onChange={formik.handleChange}
                    onBlur={(e) => {
                      const formattedValue = parseFloat(e.target.value).toFixed(
                        2
                      );
                      formik.handleBlur(e);
                      formik.setFieldValue("reserveFutureFee", formattedValue);
                    }}
                    value={formik.values.reserveFutureFee}
                    maxDecimalPlaces={2}
                  />
                  {formik.touched.reserveFutureFee &&
                    formik.errors.reserveFutureFee && (
                      <div className="text-red-500 text-sm pl-2 pt-2">
                        {formik.errors.reserveFutureFee}
                      </div>
                    )}
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    name="adminFee"
                    required={true}
                    minLength={"1"}
                    maxLength={"10"}
                    className="!bg-[#fff] !px-0 w-[160px]"
                    label="Administration fee($)"
                    placeholder=""
                    onChange={formik.handleChange}
                    onBlur={(e) => {
                      const formattedValue = parseFloat(e.target.value).toFixed(
                        2
                      );
                      formik.handleBlur(e);
                      formik.setFieldValue("adminFee", formattedValue);
                    }}
                    value={formik.values.adminFee}
                    maxDecimalPlaces={2}
                  />

                  {formik.touched.adminFee && formik.errors.adminFee && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {formik.errors.adminFee}
                    </div>
                  )}
                </div>

                {type == "Edit" ? (
                  <></>
                ) : (
                  <div className="col-span-1">
                    <Select
                      label="Terms"
                      name="term"
                      required={true}
                      placeholder=""
                      onChange={handleSelectChange}
                      className="!bg-[#fff]"
                      options={termList}
                      value={
                        (
                          termList.find(
                            (option) =>
                              option.value ==
                              (formik.values.term
                                ? formik.values.term.toString()
                                : "")
                          ) || {}
                        ).value || ""
                      }
                      onBlur={formik.handleBlur}
                      error={formik.touched.term && formik.errors.term}
                      disabled={type === "Edit"}
                    />
                    {formik.touched.term && formik.errors.term && (
                      <div className="text-red-500 text-sm pl-2 pt-2">
                        {formik.errors.term}
                      </div>
                    )}
                  </div>
                )}

                <div className="col-span-1">
                  <Select
                    label="Status"
                    name="status"
                    placeholder=""
                    required={true}
                    onChange={handleSelectChange}
                    className="!bg-[#fff]"
                    options={status}
                    value={
                      formik.values.status === ""
                        ? formik.setFieldValue("status", true)
                        : formik.values.status
                    }
                    disabled={active === false ? true : false}
                    onBlur={formik.handleBlur}
                    error={formik.touched.status && formik.errors.status}
                    defaultValue={defaultValue}
                  />
                  {formik.touched.status && formik.errors.status && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {formik.errors.status}
                    </div>
                  )}
                </div>
                {formik.values.priceType === "Flat Pricing" && (
                  <>
                    <div className="col-span-1">
                      <Input
                        type="number"
                        name="rangeStart"
                        required={true}
                        minLength={"1"}
                        maxLength={"10"}
                        className="!bg-[#fff]"
                        label="Start Range($)"
                        placeholder=""
                        onChange={formik.handleChange}
                        onBlur={(e) => {
                          const formattedValue = parseFloat(
                            e.target.value
                          ).toFixed(2);
                          formik.handleBlur(e);
                          formik.setFieldValue("rangeStart", formattedValue);
                        }}
                        value={formik.values.rangeStart}
                        maxDecimalPlaces={2}
                      />

                      {formik.touched.rangeStart &&
                        formik.errors.rangeStart && (
                          <div className="text-red-500 text-sm pl-2 pt-2">
                            {formik.errors.rangeStart}
                          </div>
                        )}
                    </div>
                    <div className="col-span-1">
                      <Input
                        type="number"
                        name="rangeEnd"
                        required={true}
                        minLength={"1"}
                        maxLength={"10"}
                        className="!bg-[#fff]"
                        label="End Range($)"
                        placeholder=""
                        onChange={formik.handleChange}
                        onBlur={(e) => {
                          const formattedValue = parseFloat(
                            e.target.value
                          ).toFixed(2);
                          formik.handleBlur(e);
                          formik.setFieldValue("rangeEnd", formattedValue);
                        }}
                        value={formik.values.rangeEnd}
                        maxDecimalPlaces={2}
                      />
                      {formik.touched.rangeEnd && formik.errors.rangeEnd && (
                        <div className="text-red-500 text-sm pl-2 pt-2">
                          {formik.errors.rangeEnd}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </Grid>
              <Grid className="!grid-cols-4">
                {formik.values.priceType === "Quantity Pricing" && (
                  <>
                    {formik.values.quantityPriceDetail.map((dealer, index) => {
                      return (
                        <div key={index} className="bg-[#f9f9f9] p-4 relative mt-8 rounded-xl">
                          <div className="bg-[#fff] rounded-[30px] absolute top-[-17px] right-[-12px] p-3">
                            {index == 0 ? (
                              <Button
                                className="text-sm  !font-light"
                                onClick={handleAddQuantity}
                              >
                                {" "}
                                + Add More{" "}
                              </Button>
                            ) : (
                              <div
                                onClick={() => {
                                  handleDeleteQuantity(index);
                                }}
                              >
                                <div className="flex h-full mx-3 bg-[#fff] justify-center">
                                  <img
                                    src={DeleteImage}
                                    className="self-center cursor-pointer"
                                    alt="Delete Icon"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          <div className=" p-4 pl-0 mt-4 relative rounded-xl">
                            <Grid className="">
                              <div className="col-span-12">
                                <Input
                                  type="text"
                                  name={`quantityPriceDetail[${index}].name`}
                                  className="!bg-[#f9f9f9]"
                                  label="Name"
                                  required={true}
                                  placeholder=""
                                  value={formik.values.quantityPriceDetail?.[index]?.name || ''}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  onWheelCapture={(e) => e.preventDefault()}
                                  error={
                                    formik.touched.quantityPriceDetail &&
                                    formik.touched.quantityPriceDetail[index] &&
                                    formik.errors.quantityPriceDetail &&
                                    formik.errors.quantityPriceDetail[index]?.name
                                  }
                                />
                                {formik.touched.quantityPriceDetail && formik.touched.quantityPriceDetail[index] &&
                                  formik.errors.quantityPriceDetail && formik.errors.quantityPriceDetail[index]?.name && (
                                    <div className="text-red-500 text-sm pl-2 pt-2">
                                      {formik.errors.quantityPriceDetail[index]?.name}
                                    </div>
                                  )}
                              </div>

                              <div className="col-span-12">
                                <Input
                                  type="number"
                                  name={`quantityPriceDetail[${index}].quantity`}
                                  className="!bg-[#f9f9f9]"
                                  label="Max Quantity"
                                  maxLength={"10"}
                                  maxDecimalPlaces={2}
                                  required={true}
                                  placeholder=""
                                  value={formik.values.quantityPriceDetail?.[index]?.quantity || ''}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  onWheelCapture={(e) => e.preventDefault()}
                                  error={
                                    formik.touched.quantityPriceDetail &&
                                    formik.touched.quantityPriceDetail[index] &&
                                    formik.errors.quantityPriceDetail &&
                                    formik.errors.quantityPriceDetail[index]?.quantity
                                  }
                                />
                                {formik.touched.quantityPriceDetail && formik.touched.quantityPriceDetail[index] &&
                                  formik.errors.quantityPriceDetail && formik.errors.quantityPriceDetail[index]?.quantity && (
                                    <div className="text-red-500 text-sm pl-2 pt-2">
                                      {formik.errors.quantityPriceDetail[index]?.quantity}
                                    </div>
                                  )}
                              </div>
                            </Grid>
                          </div>
                        </div>
                      )
                    })}
                  </>
                )}
              </Grid>
              <p className="mt-8 font-semibold text-lg">
                Total Amount: <span> ${
          totalAmount === undefined
            ? parseInt(0).toLocaleString(2)
            : formatOrderValue(totalAmount ?? parseInt(0))}</span>
              </p>
              <Button
                type="submit"
                className="mt-12 font-normal rounded-[25px]"
              >
                Submit
              </Button>
            </div>
          </form>
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center py-3">
          <img src={AddDealer} alt="email Image" className="mx-auto" />
          {type == "Edit" ? (
            <p className="text-3xl mb-0 mt-4 font-semibold text-neutral-grey">
              Updated <span className="text-light-black"> Successfully </span>
            </p>
          ) : (
            <p className="text-3xl mb-0 mt-4 font-semibold text-neutral-grey">
              Submitted <span className="text-light-black"> Successfully </span>
            </p>
          )}
          {type == "Edit" ? (
            <>
              <p className="text-neutral-grey text-base font-medium mt-2">
                You have Successfully Updated the
                <b> Company Price Book </b>
              </p>
              <p className="text-neutral-grey text-base font-medium mt-2">
                Redirecting you on Company Price Book Page {timer} seconds.
              </p>
            </>
          ) : (
            <>
              <p className="text-neutral-grey text-base font-medium mt-2">
                <b> Company Price Book </b> added successfully.{" "}
              </p>
              <p className="text-neutral-grey text-base font-medium mt-2">
                Redirecting you on Company Price Book Page {timer} seconds.
              </p>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default AddCompanyPriceBook;
