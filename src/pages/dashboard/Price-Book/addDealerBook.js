import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Headbar from "../../../common/headBar";
import Select from "../../../common/select";
import Grid from "../../../common/grid";
import Input from "../../../common/input";
import Loader from "../../../assets/images/Loader.gif";

// Media Include
import BackImage from "../../../assets/images/icons/backArrow.svg";
import Button from "../../../common/button";
import Modal from "../../../common/model";
import Wholesale from "../../../assets/images/priceBook/Wholesale.svg";
import product from "../../../assets/images/priceBook/ProductN.svg";
import productS from "../../../assets/images/priceBook/ProductS.svg";
import Description from "../../../assets/images/priceBook/Description.svg";
import Coverage from "../../../assets/images/priceBook/CoverageT.svg";
import priceType from "../../../assets/images/priceBook/PriceT.svg";
import category1 from "../../../assets/images/priceBook/ProductC.svg";
import dealer from "../../../assets/images/priceBook/Dealer.png";
import AddDealer from "../../../assets/images/dealer-book.svg";
import {
  addDealerPriceBook,
  checkDealerPriceBook,
  editDealerPriceBook,
  getDealerPricebookDetailById,
  getDealersList,
  getDealersSettingsByid,
  getProductListbyProductCategoryId,
} from "../../../services/dealerServices";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getCategoryListActiveData,
  getCategoryListCoverage,
  getCoverageTypeAndAdhDays,
} from "../../../services/priceBookService";
import { RotateLoader } from "react-spinners";
import Card from "../../../common/card";
import Checkbox from "../../../common/checkbox";
import RadioButton from "../../../common/radio";

function AddDealerBook() {
  const [productNameOptions, setProductNameOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDealerList, setActiveDealerList] = useState([]);
  const [category, setCategoryList] = useState([]);
  const [error, setError] = useState("");
  const [claimOver, setClaimOver] = useState(true);
  const [claimInCoveragePeriod, setClaimInCoveragePeriod] = useState(true);
  const [timer, setTimer] = useState(3);
  const [type, setType] = useState("");
  const [coverageType, setCoverageType] = useState([]);
  const [loader, setLoader] = useState(false);
  const [priceBookById, setPriceBookById] = useState({});
  const navigate = useNavigate();
  const { id, dealerIdValue } = useParams();

  useEffect(() => {
    if (id) {
      dealerDetailById(id);
      setType("Edit");
    } else if (dealerIdValue) {
      getDealerSettings(dealerIdValue);
      formik.setFieldValue("dealerId", dealerIdValue);
      getProductList(dealerIdValue);
    } else {
      setType("Add");
    }
    dealerList();
  }, []);

  const dealerDetailById = async (id) => {
    setLoader(true);
    const result = await getDealerPricebookDetailById(id);
    const data = result.result[0];
    console.log(data);
    setPriceBookById(data);
    getDealerSettings(data?.dealerId);
    formik.setFieldValue("retailPrice", data.retailPrice.toFixed(2));
    formik.setFieldValue("status", data.status);
    formik.setFieldValue("dealerSku", data.dealerSku);
    formik.setFieldValue("priceBook", data?.priceBook);
    formik.setFieldValue("description", data?.description);
    formik.setFieldValue("priceType", data?.priceType);
    formik.setFieldValue("term", data?.term);
    formik.setFieldValue("brokerFee", data?.brokerFee);
    formik.setFieldValue("wholesalePrice", data?.wholesalePrice);
    formik.setFieldValue("pName", data?.priceBooks.pName);
    formik.setFieldValue("coverageType", data.priceBooks.coverageType);
    formik.setFieldValue("adhDays", data.adhDays);
    formik.setFieldValue("categoryId", data?.priceBooks?.category[0]?._id);
    formik.setFieldValue("dealerId", data?.dealerId);
    setClaimInCoveragePeriod(data?.noOfClaimPerPeriod === -1);
    setClaimOver(data?.noOfClaim?.value === -1);
    formik.setFieldValue(
      "isManufacturerWarranty",
      data?.isManufacturerWarranty
    );
    formik.setFieldValue("noOfClaim", data?.noOfClaim);
    formik.setFieldValue("noOfClaimPerPeriod", data?.noOfClaimPerPeriod);

    setLoader(false);
  };

  const period = [
    { label: "Monthly", value: "Monthly" },
    { label: "Annually", value: "Annually" },
  ];

  const dealerList = async () => {
    try {
      const result = await getDealersList();
      console.log(result.data);
      const filteredDealers = result.data.filter(
        (data) => data.dealerData.accountStatus === true
      );

      let arr = filteredDealers.map((data) => ({
        label: data.dealerData.name,
        value: data.dealerData._id,
        adhDays: data.dealerData.adhDays,
      }));

      setActiveDealerList(arr);
    } catch (error) {
      console.error("Error fetching dealer list:", error);
    }
  };
  const optiondeductibles = [
    { label: "$", value: "amount" },
    { label: "%", value: "percentage" },
  ];
  useEffect(() => {
    let intervalId;
    if (isModalOpen && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    if (timer === 0) {
      closeModal();
      handleLinkClick();
    }
    return () => clearInterval(intervalId);
  }, [isModalOpen, timer]);

  const getProductList = async (id) => {
    setLoader(true);
    const result = await getCategoryListActiveData({ dealerId: id });
    // console.log(result.result);
    setCategoryList(
      result.result.map((item) => ({
        label: item.name,
        value: item._id,
      }))
    );
    setCoverageType(result.coverageType);
    setLoader(false);
  };
  const handleLinkClick = () => {
    if (dealerIdValue !== undefined) {
      console.log("Navigating to /dealerDetails/" + dealerIdValue);
      navigate(`/dealerDetails/${dealerIdValue}`);
    } else {
      navigate(`/dealerPriceList`);
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectChange = async (name, value) => {
    setError("");
    if (name === "dealerId") {
      if (name === "dealerId") {
        getDealerSettings(value);
        formik.setValues({
          ...formik.initialValues,
          dealerId: value,
        });
      }
      const result = await getCategoryListActiveData({ dealerId: value });
      setCoverageType(result.coverageType);
      setCategoryList(
        result.result.map((item) => ({
          label: item.name,
          value: item._id,
        }))
      );
    }
    if (name === "categoryId") {
      formik.setValues({
        ...formik.values,
        priceBook: "",
        wholesalePrice: "",
        description: "",
        term: "",
        pName: "",
        categoryId: value,
      });
      const response = await getProductListbyProductCategoryId(value, {
        coverageType: coverageType,
      });
      setProductNameOptions(() => {
        return response.result.priceBooks.map((item) => ({
          label: item.name,
          value: item._id,
          description: item.description,
          term: item.term,
          pName: item.pName,
          coverageType: item.coverageType,
          wholesalePrice:
            item.frontingFee +
            item.reserveFutureFee +
            item.reinsuranceFee +
            item.adminFee,
          status: item.status,
          priceType: item.priceType,
        }));
      });
    }

    if (name === "priceBook") {
      const selectedProduct = productNameOptions.find(
        (item) => item.value === value
      );
      // const filteredAdhDays = dealerDetails.adhDays.filter((adhDay) =>
      //   selectedProduct.coverageType.find(
      //     (coverage) => coverage.value === adhDay.label
      //   )
      // );
      // console.log(filteredAdhDays);

      const response = await getCoverageTypeAndAdhDays(
        selectedProduct?.value,
        formik.values.dealerId
      );
      console.log(response.result);
      formik.setFieldValue("priceBook", value);
      formik.setFieldValue("adhDays", response.result.dealerData.adhDays);
      formik.setFieldValue(
        "wholesalePrice",
        selectedProduct.wholesalePrice.toFixed(2)
      );

      formik.setFieldValue("priceType", selectedProduct.priceType);
      formik.setFieldValue("description", selectedProduct.description);
      formik.setFieldValue("pName", selectedProduct.pName);
      formik.setFieldValue("term", selectedProduct.term + " Months");
      formik.setFieldValue("dealerSku", selectedProduct.label);
      formik.setFieldValue(
        "coverageType",
        response.result.priceBook.coverageType
      );
    }

    formik.setFieldValue(name, value);
  };

  const formik = useFormik({
    initialValues: {
      retailPrice: "",
      priceBook: "",
      pName: "",
      dealerId: "",
      description: "",
      status: priceBookById?.status !== undefined ? priceBookById.status : true,
      categoryId: "",
      wholesalePrice: "",
      term: "",
      brokerFee: "",
      priceType: "",
      dealerSku: "",
      coverageType: "",
      adhDays: [
        {
          label: type.value,
          waitingDays: 0,
          deductible: 0,
          amountType: "amount",
        },
      ],
      noOfClaimPerPeriod: -1,
      noOfClaim: {
        period: "Monthly",
        value: -1,
      },
      isManufacturerWarranty: false,
    },
    validationSchema: Yup.object({
      retailPrice: Yup.number()
        .typeError("Required")
        .required("Required")
        .min(0, "Retail Price cannot be negative")
        .nullable(),
      priceBook: Yup.string().trim().required("Required"),
      dealerId: Yup.string().trim().required("Required"),
      categoryId: Yup.string().trim().required("Required"),
      status: Yup.boolean().required("Required"),
      dealerSku: Yup.string().required("Required"),
      adhDays: Yup.array().of(
        Yup.object().shape({
          label: Yup.string(),
          waitingDays: Yup.number()
            .required("Required")
            .min(0, "Value cannot be negative"),
          deductible: Yup.number()
            .required("Required")
            .min(0, "Value cannot be negative"),
          amountType: Yup.string().required(""),
        })
      ),
    }),
    onSubmit: async (values) => {
      setLoader(true);
      values.brokerFee = (values.retailPrice - values.wholesalePrice).toFixed(
        2
      );
      console.log(values);

      delete values.pName;
      const result = id
        ? await editDealerPriceBook(id, values)
        : await addDealerPriceBook(values);

      console.log("Form values:", values);

      console.log(result);
      if (result.code !== 200) {
        setLoader(false);
        setError(result.message);
      } else {
        setLoader(false);
        setError(false);
        setIsModalOpen(true);
        setTimer(3);
      }
    },
  });

  const getDealerSettings = async (dealerId) => {
    const res = await getDealersSettingsByid(dealerId);
    console.log(res.result[0]);
    setClaimInCoveragePeriod(res.result[0].settings?.noOfClaimPerPeriod === -1);
    setClaimOver(res.result[0].settings?.noOfClaim?.value === -1);
    formik.setFieldValue("noOfClaim", res.result[0].settings?.noOfClaim);
    formik.setFieldValue(
      "noOfClaimPerPeriod",
      res.result[0].settings?.noOfClaimPerPeriod
    );
    formik.setFieldValue(
      "isManufacturerWarranty",
      res.result[0].settings?.isManufacturerWarranty
    );
  };

  const status = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];
  const handleGOBack = () => {
    navigate(-1);
  };
  console.log(coverageType);
  return (
    <div className="mb-8 ml-3">
      <Headbar />
      {loader == true ? (
        <div className=" h-screen w-full flex py-5">
          <div className="self-center mx-auto">
            <RotateLoader color="#333" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex">
            <div
              onClick={handleLinkClick}
              className="h-[60px] w-[60px] flex border-[1px] bg-white border-Light-Grey rounded-[20px]"
            >
              <img
                src={BackImage}
                className="m-auto my-auto self-center bg-white"
                alt="BackImage"
              />
            </div>
            <div className="pl-3">
              <p className="font-bold text-[36px] leading-9 mb-[3px]">
                {type} Dealer Book
              </p>
              <ul className="flex self-center">
                <li className="text-sm text-neutral-grey font-Regular">
                  <Link to={"/"}>Home </Link> <span className=""> /</span>{" "}
                </li>
                <li className="text-sm text-neutral-grey font-Regular ml-1">
                  <Link
                    to={"/dealerPriceList"}
                    className="text-sm text-neutral-grey font-Regular"
                  >
                    Dealer Book{" "}
                  </Link>{" "}
                  <span className=""> /</span>{" "}
                </li>
                <li className="text-sm text-neutral-grey font-semibold ml-1">
                  {" "}
                  {type} Dealer Book{" "}
                </li>
              </ul>
            </div>
          </div>

          {/* Form Start */}
          {/* {error && (
            <p className="text-red-500 text-sm pl-2">
              <span className="font-semibold"> {error} </span>
            </p>
          )} */}
          {type === "Edit" && (
            <div className="bg-Edit bg-cover px-8 mt-8 py-16 rounded-[30px]">
              <Grid className="mx-auto ">
                <div className="col-span-4 self-center ">
                  <div className="flex">
                    <div className="self-center mr-4">
                      <img src={Wholesale} alt="Wholesale" />
                    </div>
                    <div className="self-center">
                      <p className="text-white text-base font-medium leading-5	">
                        Wholesale Price
                      </p>
                      <p className="text-[#FFFFFF] opacity-50 text-sm	font-medium">
                        ${priceBookById?.wholesalePrice?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-4 ">
                  <div className="flex">
                    <div className="self-center mr-4">
                      <img src={category1} alt="category" />
                    </div>
                    <div className="self-center">
                      <p className="text-white text-base font-medium leading-5	">
                        Product Category
                      </p>
                      <p className="text-[#FFFFFF] opacity-50 text-sm	font-medium">
                        {priceBookById?.priceBooks?.category[0]?.name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="flex">
                    <div className="self-center mr-4">
                      <img src={dealer} alt="dealer" />
                    </div>
                    <div className="self-center">
                      <p className="text-white text-base font-medium leading-5	">
                        Dealer Name
                      </p>
                      <p className="text-[#FFFFFF] opacity-50 text-sm	font-medium">
                        {priceBookById?.dealer?.name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-4 ">
                  <div className="flex">
                    <div className="self-center mr-4">
                      <img src={product} alt="product" />
                    </div>
                    <div className="self-center">
                      <p className="text-white text-lg font-medium leading-5	">
                        Product Name
                      </p>
                      <p className="text-[#FFFFFF] opacity-50	font-medium">
                        {priceBookById?.priceBooks?.pName}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-4 ">
                  <div className="flex">
                    <div className="self-center mr-4">
                      <img src={productS} alt="product" />
                    </div>
                    <div className="self-center">
                      <p className="text-white text-lg font-medium leading-5	">
                        Product SKU
                      </p>
                      <p className="text-[#FFFFFF] opacity-50	font-medium">
                        {priceBookById?.priceBooks?.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-span-4">
                  <div className="flex">
                    <div className="self-center mr-4">
                      <img src={priceType} alt="product" />
                    </div>
                    <div className="self-center">
                      <p className="text-white text-lg font-medium leading-5	">
                        Price Type
                      </p>
                      <p className="text-[#FFFFFF] opacity-50	font-medium">
                        {priceBookById?.priceBooks?.priceType}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex">
                    <div className="self-center mr-4">
                      <img src={Coverage} alt="product" />
                    </div>
                    <div className="self-center">
                      <p className="text-white text-lg font-medium leading-5	">
                        Coverage Type
                      </p>
                      <p className="text-[#FFFFFF] opacity-50	font-medium">
                        {priceBookById?.priceBooks?.coverageType &&
                        priceBookById?.priceBooks?.coverageType.length > 0 ? (
                          <ol className="flex flex-wrap">
                            {priceBookById?.priceBooks?.coverageType.map(
                              (type, index) => (
                                <li
                                  className="font-semibold list-disc mx-[19px]"
                                  key={index}
                                >
                                  {type.label}
                                </li>
                              )
                            )}
                          </ol>
                        ) : (
                          "No coverage types available"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex">
                    <div className="self-center mr-4">
                      <img src={Description} alt="product" />
                    </div>
                    <div className="self-center">
                      <p className="text-white text-lg font-medium leading-5	">
                        Description
                      </p>
                      <p className="text-[#FFFFFF] opacity-50	font-medium">
                        {priceBookById?.priceBooks?.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Grid>
            </div>
          )}
          <form className="mt-8" onSubmit={formik.handleSubmit}>
            <Card className="px-8 pb-8 pt-6 drop-shadow-4xl border-[1px] border-Light-Grey  rounded-3xl">
              {error ? (
                <p className="text-red-500 text-sm pl-2 my-3">
                  <span className="font-semibold"> {error} </span>
                </p>
              ) : (
                <p className="text-red-500 text-sm pl-2 my-3 opacity-0	">
                  <span className="font-semibold"> error </span>
                </p>
              )}
              <Grid>
                {type !== "Edit" && (
                  <>
                    <div className="col-span-4">
                      <Select
                        name="dealerId"
                        label="Dealer Name"
                        options={activeDealerList}
                        disabled={dealerIdValue != undefined ? true : false}
                        required={true}
                        className="!bg-white"
                        placeholder=""
                        value={formik.values.dealerId}
                        onBlur={formik.handleBlur}
                        onChange={handleSelectChange}
                        error={
                          formik.touched.dealerId && formik.errors.dealerId
                        }
                      />
                      {formik.touched.dealerId && formik.errors.dealerId && (
                        <div className="text-red-500 text-sm pl-2 pt-2">
                          {formik.errors.dealerId}
                        </div>
                      )}
                    </div>
                    <div className="col-span-4">
                      <Select
                        name="categoryId"
                        label="Product Category"
                        options={category}
                        required={true}
                        className="!bg-white"
                        placeholder=""
                        maxLength={"30"}
                        value={formik.values.categoryId}
                        onBlur={formik.handleBlur}
                        onChange={handleSelectChange}
                        error={
                          formik.touched.categoryId && formik.errors.categoryId
                        }
                      />
                      {formik.touched.categoryId &&
                        formik.errors.categoryId && (
                          <div className="text-red-500 text-sm pl-2 pt-2">
                            {formik.errors.categoryId}
                          </div>
                        )}
                    </div>
                    <div className="col-span-4">
                      <Select
                        name="priceBook"
                        label="Product SKU"
                        options={productNameOptions}
                        required={true}
                        className="!bg-white"
                        placeholder=""
                        value={formik.values.priceBook}
                        onBlur={formik.handleBlur}
                        onChange={handleSelectChange}
                        error={
                          formik.touched.priceBook && formik.errors.priceBook
                        }
                      />
                      {formik.touched.priceBook && formik.errors.priceBook && (
                        <div className="text-red-500 text-sm pl-2 pt-2">
                          {formik.errors.priceBook}
                        </div>
                      )}
                    </div>
                    <div className="col-span-4">
                      <Input
                        type="text"
                        name="pName"
                        className="!bg-white"
                        label="Product Name"
                        // required={true}
                        placeholder=""
                        value={formik.values.pName}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        disabled={true}
                        onWheelCapture={(e) => {
                          e.preventDefault();
                        }}
                      />
                    </div>
                    <div className="col-span-4">
                      <Input
                        type="text"
                        name="wholesalePrice"
                        className="!bg-white"
                        label="Wholesale Price($)"
                        // required={true}
                        placeholder=""
                        value={formik.values.wholesalePrice}
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
                        name="term"
                        className="!bg-white"
                        label="Term"
                        // required={true}
                        placeholder=""
                        value={formik.values.term}
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
                        name="priceType"
                        className="!bg-white"
                        label="Price Type"
                        // required={true}
                        placeholder=""
                        value={formik.values.priceType}
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
                        name="description"
                        className="!bg-white"
                        label="Description"
                        // required={true}
                        placeholder=""
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={true}
                        onWheelCapture={(e) => {
                          e.preventDefault();
                        }}
                      />
                    </div>
                  </>
                )}
                <div className="col-span-4">
                  <Input
                    type="text"
                    name="dealerSku"
                    className="!bg-white"
                    label="Dealer SKU"
                    required={true}
                    placeholder=""
                    value={formik.values.dealerSku}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    onWheelCapture={(e) => {
                      e.preventDefault();
                    }}
                    error={formik.touched.dealerSku && formik.errors.dealerSku}
                  />
                  {formik.touched.dealerSku && formik.errors.dealerSku && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {formik.errors.dealerSku}
                    </div>
                  )}
                </div>
                <div className="col-span-4">
                  <Input
                    type="number"
                    name="retailPrice"
                    className="!bg-white"
                    label="Retail Price($)"
                    placeholder=""
                    required={true}
                    maxLength={"10"}
                    onChange={formik.handleChange}
                    onBlur={(e) => {
                      const inputValue = e.target.value.trim();
                      const formattedValue =
                        inputValue !== ""
                          ? parseFloat(inputValue).toFixed(2)
                          : "";
                      formik.handleBlur(e);
                      formik.setFieldValue("retailPrice", formattedValue);
                    }}
                    value={formik.values.retailPrice}
                    maxDecimalPlaces={2}
                  />
                  {formik.touched.retailPrice && formik.errors.retailPrice && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {formik.errors.retailPrice}
                    </div>
                  )}
                </div>

                <div className="col-span-4">
                  <Select
                    label="Status"
                    required={true}
                    name="status"
                    placeholder=""
                    onChange={handleSelectChange}
                    disabled={
                      priceBookById.dealer?.accountStatus === false ||
                      priceBookById.priceBooks?.status === false ||
                      priceBookById?.priceBooks?.category[0]?.status === false
                    }
                    className="!bg-white"
                    options={status}
                    value={formik.values.status}
                    onBlur={formik.handleBlur}
                    error={formik.touched.status && formik.errors.status}
                  />
                  {formik.touched.status && formik.errors.status && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {formik.errors.status}
                    </div>
                  )}
                </div>
              </Grid>
              <Grid className="">
                <div className="col-span-8 ">
                  <Grid>
                    {formik.values.adhDays &&
                      formik.values.adhDays.length > 0 &&
                      formik.values.adhDays.map((adhDay, index) => (
                        <div key={index} className="col-span-6 mt-4">
                          <div>
                            <p className="text-lg font-semibold mb-4 capitalize text-left">
                              {adhDay.label}
                            </p>
                          </div>
                          <div className="mb-3">
                            <Input
                              type="number"
                              label="Waiting Days"
                              name={`adhDays[${index}].waitingDays`}
                              id={`adhDays[${index}].waitingDays`}
                              value={adhDay.waitingDays}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="form-input"
                            />
                            {formik.touched.adhDays?.[index]?.waitingDays &&
                              formik.errors.adhDays?.[index]?.waitingDays && (
                                <div className="text-red-500 text-sm">
                                  {formik.errors.adhDays[index].waitingDays}
                                </div>
                              )}
                          </div>

                          <div className="relative">
                            <Input
                              label={"Deductible "}
                              type="number"
                              name={`adhDays[${index}].deductible`}
                              id={`adhDays[${index}].deductible`}
                              value={adhDay.deductible}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="form-input"
                            />
                            {/* 
                             this one is not working  */}
                            <div className="absolute top-[1px] right-[1px]">
                              <Select
                                name={`adhDays[${index}].amountType`}
                                label=""
                                disableFirstOption={true}
                                onChange={(e, value) => {
                                  const updatedadhDays =
                                    formik?.values?.adhDays?.map((item) =>
                                      item.label == adhDay.label
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
                                    (item) => item.label === adhDay.label
                                  )?.amountType || 0
                                }
                                classBox="!bg-transparent"
                                className1="!border-0 !border-l !rounded-s-[0px] !text-light-black !pr-2"
                                options={optiondeductibles}
                              />
                            </div>
                            {formik.touched.adhDays?.[index]?.deductible &&
                              formik.errors.adhDays?.[index]?.deductible && (
                                <div className="text-red-500 text-sm">
                                  {formik.errors.adhDays[index].deductible}
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                  </Grid>
                </div>
                {formik.values.priceBook == "" ? (
                  ""
                ) : (
                  <div className="col-span-4">
                    <Grid className=" my-4 py-3 !gap-0">
                      <div className="col-span-6">
                        <p className="text-[12px] mb-3 font-semibold">
                          # of Claims Over the Certain Period
                        </p>
                      </div>
                      <div className="col-span-6 flex justify-between">
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
                              value: 0,
                            });
                          }}
                        />
                      </div>
                      {claimOver === false && (
                        <div className="flex col-span-12">
                          <Select
                            name={`noOfClaim.period`}
                            options={period}
                            className="!bg-grayf9"
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

                          <div className="ml-3">
                            <Input
                              className1="!pt-2.5"
                              placeholder="# of claims"
                              type="number"
                              name={`noOfClaim.value`}
                              value={formik.values.noOfClaim.value}
                              onBlur={formik.handleBlur}
                              onChange={(e) =>
                                formik.setFieldValue(
                                  "noOfClaim.value",
                                  Number(e.target.value)
                                )
                              }
                            />
                          </div>
                        </div>
                      )}
                      <div className="col-span-6 mt-4">
                        <p className="text-[12px] mb-3 font-semibold">
                          # of Claims in Coverage Period
                        </p>
                      </div>
                      <div className="col-span-6 flex mt-4 justify-between ">
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
                            formik.setFieldValue("noOfClaimPerPeriod", 0);
                          }}
                        />
                      </div>
                      {claimInCoveragePeriod === false && (
                        <div className="flex col-span-12">
                          <div className="">
                            <Input
                              className1="!pt-2.5"
                              placeholder="# of claims"
                              type="number"
                              name={`noOfClaimPerPeriod`}
                              value={formik.values.noOfClaimPerPeriod}
                              onBlur={formik.handleBlur}
                              onChange={(e) =>
                                formik.setFieldValue(
                                  "noOfClaimPerPeriod",
                                  Number(e.target.value)
                                )
                              }
                            />
                          </div>
                        </div>
                      )}

                      <div className="col-span-6 mt-4">
                        <p className=" text-[12px] mb-3 font-semibold">
                          {" "}
                          Is Include manufacturer <br /> warranty?
                        </p>
                      </div>
                      <div className="flex col-span-6 mt-4 justify-between w-full">
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
                            formik.values.isManufacturerWarranty == false
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
                )}
              </Grid>

              {type !== "Edit" && (
                <Button
                  type="submit"
                  className="mt-12 font-normal rounded-[25px]"
                >
                  Submit
                </Button>
              )}
              {type === "Edit" && (
                <div className="mt-8">
                  <Button
                    type="submit"
                    className="mt-12 font-normal rounded-[25px]"
                  >
                    Update
                  </Button>
                </div>
              )}
            </Card>
          </form>
        </>
      )}

      {/* Modal Email Popop */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center py-1">
          <img src={AddDealer} alt="email Image" className="mx-auto" />
          <>
            {type === "Edit" ? (
              <>
                <p className="text-3xl mb-0 mt-4 font-semibold">
                  Updated <span className=""> Successfully </span>
                </p>
                <p className="text-base font-medium mt-2">
                  <b> Dealer Book </b> Updated successfully.{" "}
                </p>
                <p className="text-base font-medium mt-2">
                  {" "}
                  Redirecting you on Dealer Book Page {timer} seconds.
                </p>
              </>
            ) : (
              <>
                <p className="text-3xl mb-0 mt-4 font-semibold">
                  Submitted <span className=""> Successfully </span>
                </p>
                <p className="text-base font-medium mt-2">
                  <b> New Dealer Book </b> added successfully.{" "}
                </p>
                <p className=" text-base font-medium mt-2">
                  {" "}
                  Redirecting you on Dealer Book Page {timer} seconds.
                </p>
              </>
            )}
          </>
        </div>
      </Modal>
    </div>
  );
}

export default AddDealerBook;
