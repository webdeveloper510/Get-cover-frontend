import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Headbar from "../../../common/headBar";
import Select from "../../../common/select";
import Grid from "../../../common/grid";
import Input from "../../../common/input";
import { useFormik } from "formik";
import * as Yup from "yup";

// Media Include
import BackImage from "../../../assets/images/icons/backArrow.svg";
import Button from "../../../common/button";
import Modal from "../../../common/model";
import AddDealer from "../../../assets/images/dealer-book.svg";
import terms from "../../../assets/images/icons/terms.svg";
import product from "../../../assets/images/icons/productName.svg";
import category from "../../../assets/images/icons/productCat.svg";
import dealer from "../../../assets/images/icons/dealerName.svg";

import {
  addCompanyPricBook,
  editCompanyList,
  getCategoryListActiveData,
  getCompanyPriceBookById,
  getTermList,
} from "../../../services/priceBookService";

function AddCompanyPriceBook() {
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [termList, setTermList] = useState([]);
  const [totalAmount, setTotalAmount] = useState();
  const [type, setType] = useState("");
  const { id } = useParams();
  const [detailsById, setDetailsById] = useState();

  const navigate = useNavigate();
  console.log(id);
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
    },
    validationSchema: Yup.object({
      priceCatId: Yup.string().required("Required"),
      name: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      term: Yup.number().required("Required"),
      frontingFee: Yup.number()
        .required("Required")
        .min(0.1, "Fronting fee cannot be negative"),
      reinsuranceFee: Yup.number()
        .required("Required")
        .min(0.1, "Re-insurance fee cannot be negative"),
      reserveFutureFee: Yup.number()
        .required("Required")
        .min(0.1, "ReserveFuture fee cannot be negative"),
      adminFee: Yup.number()
        .required("Required")
        .min(0.1, "Admin fee cannot be negative"),
      status: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      console.log("Form values:", values);
      const result = id
        ? await editCompanyList(id, values)
        : await addCompanyPricBook(values);
      console.log(result);
      if (result.code !== 200) {
        setError(result.message);
      } else {
        setError(false);
        setIsModalOpen(true);
        setTimer(3);
      }
    },
  });
  const calculateTotal = () => {
    const frontingFee = parseFloat(formik.values.frontingFee) || 0;
    const reinsuranceFee = parseFloat(formik.values.reinsuranceFee) || 0;
    const reserveFutureFee = parseFloat(formik.values.reserveFutureFee) || 0;
    const adminFee = parseFloat(formik.values.adminFee) || 0;

    const total = frontingFee + reinsuranceFee + reserveFutureFee + adminFee;
    setTotalAmount(total);
  };

  useEffect(() => {
    calculateTotal();
  }, [formik.values]);

  useEffect(() => {
    let isMounted = true;

    const getPriceBookDetailsById = async () => {
      try {
        if (id) {
          setType("Edit");
          const result = await getCompanyPriceBookById(id);
          setDetailsById(result.result);
          console.log(result.result);
          if (isMounted) {
            setDetailsById(result.result);
            formik.setValues({
              priceCatId: result.result.category._id,
              name: result.result.name,
              description: result.result.description,
              term: result.result.term,
              frontingFee: result.result.frontingFee,
              reinsuranceFee: result.result.reinsuranceFee,
              reserveFutureFee: result.result.reserveFutureFee,
              adminFee: result.result.adminFee,
              status: result.result.status,
            });
          }
        } else {
          setType("Add");
        }
      } catch (error) {
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

  useEffect(() => {
    getCategoryListActiveData11();
    getTermListData();
  }, []);

  const getTermListData = async () => {
    try {
      const res = await getTermList();
      console.log(res.result.terms);
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
      const res = await getCategoryListActiveData();
      setCategoryList(
        res.result.map((item) => ({
          label: item.name,
          value: item._id,
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
    formik.setFieldValue(name, selectedValue);
  };

  const status = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];

  const defaultValue = formik.values.status === "" ? false : true;

  return (
    <div className="my-8 ml-3">
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
          <p className="font-ExtraBold text-[36px] leading-9 mb-[3px]">
            {type} Company Price Book
          </p>
          <ul className="flex self-center">
            <li className="text-sm text-neutral-grey font-Regular">
              <Link to={"/dashboard"}>Price Book </Link>{" "}
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

      {error && (
        <p className="text-red-500 text-sm pl-2">
          <span className="font-semibold"> {error} </span>
        </p>
      )}
      {type == "Edit" && (
        <div className="bg-Edit bg-cover px-8 mt-8 py-16 rounded-[30px]">
          <Grid className="mx-8 mx-auto ">
            <div className="col-span-3 self-center border-r border-[#4e4e4e]">
              <div className="flex">
                <div className="self-center bg-[#FFFFFF08] backdrop-blur border-[#D1D9E24D] border rounded-lg p-3 mr-4">
                  <img src={category} className="w-6 h-6" alt="category" />
                </div>
                <div className="self-center">
                  <p className="text-[#FFF] text-base font-medium leading-5	">
                    Product Category
                  </p>
                  <p className="text-[#FFFFFF] opacity-50 text-sm	font-medium">
                    {detailsById?.category?.name}
                  </p>
                </div>
              </div>
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
            <div className="col-span-3 border-r border-[#4e4e4e]">
              <div className="flex">
                <div className="self-center bg-[#FFFFFF08] border-[#D1D9E24D] border rounded-lg p-3 mr-4">
                  <img src={product} className="w-6 h-6" alt="product" />
                </div>
                <div className="self-center">
                  <p className="text-[#FFF] text-base font-medium leading-5	">
                    Description
                  </p>
                  <p className="text-[#FFFFFF] opacity-50 text-sm	font-medium">
                    {detailsById?.description}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-3">
              <div className="flex">
                <div className="self-center bg-[#FFFFFF08] border-[#D1D9E24D] border rounded-lg p-3 mr-4">
                  <img src={terms} className="w-6 h-6" alt="terms" />
                </div>
                <div className="self-center">
                  <p className="text-[#FFF] text-base font-medium leading-5">
                    Terms
                  </p>
                  <p className="text-[#FFFFFF] opacity-50	text-sm font-medium">
                    {detailsById?.term} MonThs
                  </p>
                </div>
              </div>
            </div>
          </Grid>
        </div>
      )}
      <form className="mt-8" onSubmit={formik.handleSubmit}>
        <div className="px-8 py-8 drop-shadow-4xl bg-white border-[1px] border-[#D1D1D1]  rounded-xl">
          <Grid className="!grid-cols-5">
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
                error={formik.touched.priceCatId && formik.errors.priceCatId}
              />

              {formik.touched.priceCatId && formik.errors.priceCatId && (
                <div className="text-red-500 text-sm pl-2 pt-2">
                  {formik.errors.priceCatId}
                </div>
              )}
            </div>
            <div className="col-span-1">
              <Input
                type="text"
                name="name"
                className="!bg-[#fff]"
                label="Product Name "
                placeholder=""
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
            <div className="col-span-2">
              <Input
                type="text"
                name="description"
                className="!bg-[#fff]"
                label="Description "
                placeholder=""
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
            <div className="col-span-1">
              <Select
                label="Terms"
                name="term"
                placeholder=""
                onChange={handleSelectChange}
                className="!bg-[#fff]"
                options={termList}
                value={
                  (
                    termList.find(
                      (option) =>
                        option.value ===
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
            <div className="col-span-1">
              <Input
                type="number"
                name="frontingFee"
                className="!bg-[#fff]"
                label="Fronting fee ($)"
                placeholder=""
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
                className="!bg-[#fff]"
                label="Re-insurance fee "
                placeholder=""
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
                className="!bg-[#fff] !px-0 w-[200px]"
                label="Reserve for future claims"
                placeholder=""
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
                className="!bg-[#fff]"
                required={true}
                label="Administration fee "
                placeholder=""
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.adminFee}
                maxDecimalPlaces={2}
              />

              {formik.touched.adminFee && formik.errors.adminFee && (
                <div className="text-red-500 text-sm pl-2 pt-2">
                  {formik.errors.adminFee}
                </div>
              )}
            </div>
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
          </Grid>
          <p className="mt-8 font-semibold text-lg">
            Total Amount: <span> ${totalAmount}</span>
          </p>
          <Button type="submit" className="mt-12 font-normal rounded-[25px]">
            Submit
          </Button>
        </div>
      </form>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center py-3">
          <img src={AddDealer} alt="email Image" className="mx-auto" />
          <p className="text-3xl mb-0 mt-4 font-semibold text-neutral-grey">
            Submitted <span className="text-light-black"> Successfully </span>
          </p>
          <p className="text-neutral-grey text-base font-medium mt-2">
            <b> Company Price Book </b> {type} successfully.{" "}
          </p>
          <p className="text-neutral-grey text-base font-medium mt-2">
            Redirecting you on Company Price Book Page {timer} seconds.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default AddCompanyPriceBook;
