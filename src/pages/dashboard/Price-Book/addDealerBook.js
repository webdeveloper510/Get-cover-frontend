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
import Wholesale from "../../../assets/images/icons/wholePrice.svg";
import product from "../../../assets/images/icons/productName.svg";
import category1 from "../../../assets/images/icons/productCat.svg";
import dealer from "../../../assets/images/icons/dealerName.svg";
import AddDealer from "../../../assets/images/dealer-book.svg";
import {
  addDealerPriceBook,
  checkDealerPriceBook,
  editDealerPriceBook,
  getDealerPricebookDetailById,
  getDealersList,
  getProductListbyProductCategoryId,
} from "../../../services/dealerServices";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getCategoryListActiveData } from "../../../services/priceBookService";
import { RotateLoader } from "react-spinners";

function AddDealerBook() {
  const [productNameOptions, setProductNameOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDealerList, setActiveDealerList] = useState([]);
  const [category, setCategoryList] = useState([]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(3);
  const [type, setType] = useState("");
  const [coverageType, setCoverageType] = useState("");
  const [loader, setLoader] = useState(false);
  const [priceBookById, setPriceBookById] = useState({});
  const navigate = useNavigate();
  const { id, dealerIdValue } = useParams();

  useEffect(() => {
    if (id) {
      dealerDetailById(id);
      setType("Edit");
    } else if (dealerIdValue) {
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
    console.log(result?.result[0]?.priceBooks?.pName);
    formik.setFieldValue("status", result.result[0].status);
    const data = result.result[0];
    console.log(data);

    setPriceBookById(data);
    formik.setFieldValue(
      "retailPrice",
      result.result[0].retailPrice.toFixed(2)
    );
    formik.setFieldValue("priceBook", result?.result[0]?.priceBook);
    formik.setFieldValue("description", result?.result[0]?.description);
    formik.setFieldValue("priceType", result?.result[0]?.priceType);
    formik.setFieldValue("term", result?.result[0]?.term);
    formik.setFieldValue("brokerFee", result?.result[0]?.brokerFee);
    formik.setFieldValue("wholesalePrice", result?.result[0]?.wholesalePrice);
    formik.setFieldValue("pName", result?.result[0]?.priceBooks.pName);
    formik.setFieldValue(
      "categoryId",
      result?.result[0]?.priceBooks?.category[0]?._id
    );
    formik.setFieldValue("dealerId", result?.result[0]?.dealerId);
    setLoader(false);
  };

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
      }));

      setActiveDealerList(arr);
    } catch (error) {
      console.error("Error fetching dealer list:", error);
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
      // console.log("Navigating to /dealerbook/" + dealerIdValue);
      //navigate(-1);
      navigate(`/dealerPriceList`);
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleSelectChange = async (name, value) => {
    setError("");
    if (name === "dealerId") {
      formik.setValues({
        ...formik.values,
        dealerId: "",
      });
      const result = await getCategoryListActiveData({ dealerId: value });
      console.log(result.result);
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
      });
      console.log(
        value,
        "---------------------{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}"
      );
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
      formik.setFieldValue(
        "wholesalePrice",
        selectedProduct.wholesalePrice.toFixed(2)
      );
      formik.setFieldValue("priceType", selectedProduct.priceType);
      formik.setFieldValue("description", selectedProduct.description);
      formik.setFieldValue("pName", selectedProduct.pName);
      formik.setFieldValue("term", selectedProduct.term + " Months");
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
        pName: Yup.string().trim().required("Required"),
      status: Yup.boolean().required("Required"),
    }),
    onSubmit: async (values) => {
       setLoader(true);
   
      values.brokerFee = (values.retailPrice - values.wholesalePrice).toFixed(
        2
      );
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
  const status = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];
  const handleGOBack = () => {
    navigate(-1);
  };
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
                  <Link onClick={handleGOBack}>Price Book </Link>{" "}
                  <span className="mx-2"> /</span>{" "}
                </li>
                <li className="text-sm text-neutral-grey font-Regular ml-1">
                  <Link
                    to={"/dealerPriceList"}
                    className="text-sm text-neutral-grey font-Regular"
                  >
                    Dealer Book{" "}
                  </Link>{" "}
                  <span className="mx-2"> /</span>{" "}
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
              <Grid className="mx-8 mx-auto ">
                <div className="col-span-4 self-center ">
                  <div className="flex">
                    <div className="self-center bg-[#FFFFFF08] backdrop-blur border-[#D1D9E24D] border rounded-lg p-3 mr-4">
                      <img
                        src={Wholesale}
                        className="w-6 h-6"
                        alt="Wholesale"
                      />
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
                    <div className="self-center bg-[#FFFFFF08] backdrop-blur border-[#D1D9E24D] border rounded-lg p-3 mr-4">
                      <img src={category1} className="w-6 h-6" alt="category" />
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
                    <div className="self-center bg-[#FFFFFF08] border-[#D1D9E24D] border rounded-lg p-3 mr-4">
                      <img src={dealer} className="w-6 h-6" alt="dealer" />
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
                    <div className="self-center bg-[#FFFFFF08] border-[#D1D9E24D] border rounded-lg p-3 mr-4">
                      <img src={product} className="w-6 h-6" alt="product" />
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
                    <div className="self-center bg-[#FFFFFF08] border-[#D1D9E24D] border rounded-lg p-3 mr-4">
                      <img src={product} className="w-6 h-6" alt="product" />
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
                    <div className="self-center bg-[#FFFFFF08] border-[#D1D9E24D] border rounded-lg p-3 mr-4">
                      <img src={product} className="w-6 h-6" alt="product" />
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
                <div className="col-span-4">
                  <div className="flex">
                    <div className="self-center bg-[#FFFFFF08] border-[#D1D9E24D] border rounded-lg p-3 mr-4">
                      <img src={product} className="w-6 h-6" alt="product" />
                    </div>
                    <div className="self-center">
                      <p className="text-white text-lg font-medium leading-5	">
                        Coverage Type
                      </p>
                      <p className="text-[#FFFFFF] opacity-50	font-medium">
                        {priceBookById?.priceBooks?.coverageType}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-8">
                  <div className="flex">
                    <div className="self-center bg-[#FFFFFF08] border-[#D1D9E24D] border rounded-lg p-3 mr-4">
                      <img src={product} className="w-6 h-6" alt="product" />
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
            <div className="px-8 pb-8 pt-6 drop-shadow-4xl bg-white  border-[1px] border-Light-Grey  rounded-3xl">
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
                    <div className="col-span-3">
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
                    <div className="col-span-3">
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
                    <div className="col-span-3">
                      <Select
                        name="priceBook"
                        label="Product SkU"
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
                    <div className="col-span-3">
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
                  </>
                )}

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
                    // disabled={
                    //   priceBookById?.priceBooks?.category[0]?.status === false
                    //     ? true
                    //     : false
                    // }
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
            </div>
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
                <p className="text-3xl mb-0 mt-4 font-semibold text-neutral-grey">
                  Updated{" "}
                  <span className="text-light-black"> Successfully </span>
                </p>
                <p className="text-neutral-grey text-base font-medium mt-2">
                  <b> Dealer Book </b> Updated successfully.{" "}
                </p>
                <p className="text-neutral-grey text-base font-medium mt-2">
                  {" "}
                  Redirecting you on Dealer Book Page {timer} seconds.
                </p>
              </>
            ) : (
              <>
                <p className="text-3xl mb-0 mt-4 font-semibold text-neutral-grey">
                  Submitted{" "}
                  <span className="text-light-black"> Successfully </span>
                </p>
                <p className="text-neutral-grey text-base font-medium mt-2">
                  <b> New Dealer Book </b> added successfully.{" "}
                </p>
                <p className="text-neutral-grey text-base font-medium mt-2">
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
