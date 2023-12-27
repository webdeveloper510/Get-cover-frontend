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
  editDealerPriceBook,
  getDealerPricebookDetailById,
  getDealersList,
  getProductListbyProductCategoryId,
} from "../../../services/dealerServices";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getCategoryListActiveData } from "../../../services/priceBookService";

function AddDealerBook() {
  const [productNameOptions, setProductNameOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDealerList, setActiveDealerList] = useState([]);
  const [category, setCategoryList] = useState([]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(3);
  const [type, setType] = useState("");
  const [loader ,setLoader]=useState(false)
  const [priceBookById, setPriceBookById] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  const dealerDetailById = async (id) => {
    setLoader(true)
    const result = await getDealerPricebookDetailById(id);
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
    formik.setFieldValue("term", result?.result[0]?.term);
    formik.setFieldValue("brokerFee", result?.result[0]?.brokerFee);
    formik.setFieldValue("wholesalePrice", result?.result[0]?.wholesalePrice);
    formik.setFieldValue(
      "categoryId",
      result?.result[0]?.priceBooks?.category[0]?._id
    );
    formik.setFieldValue("dealerId", result?.result[0]?.dealerId);
    setLoader(false)
  };

  const dealerList = async () => {
    const result = await getDealersList();
    console.log(result.data);
    let arr = [];
    result.data.map((data) => {
      // console.log(data.dealerData);
      arr.push({ label: data.dealerData.name, value: data.dealerData._id });
    });
    setActiveDealerList(arr);
  };
  useEffect(() => {
    let intervalId;
    // console.log("navigate", id);
    if (id) {
      dealerDetailById(id);
      setType("Edit");
    } else {
      setType("Add");
    }
    dealerList();
    getProductList();
    if (isModalOpen && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    if (timer === 0) {
      closeModal();
      navigate("/dealerPriceList");
    }
    return () => clearInterval(intervalId);
  }, [isModalOpen, timer, id]);

  const getProductList = async () => {
    const result = await getCategoryListActiveData();
    // console.log(result.result);
    setCategoryList(
      result.result.map((item) => ({
        label: item.name,
        value: item._id,
      }))
    );
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleSelectChange = async (name, value) => {
    // console.log(name, value);
    formik.setFieldValue(name, value);
    if (name === "categoryId") {
      formik.setFieldValue(`priceBook`, "");
      formik.setFieldValue("wholesalePrice", "");
      formik.setFieldValue("description", "");
      formik.setFieldValue("term", "");
      const response = await getProductListbyProductCategoryId(value);
      console.log(response);
      setProductNameOptions(() => {
        return response.result.priceBooks.map((item) => ({
          label: item.name,
          value: item._id,
          description: item.description,
          term: item.term,
          wholesalePrice:
            item.frontingFee +
            item.reserveFutureFee +
            item.reinsuranceFee +
            item.adminFee,
          status: item.status,
        }));
      });
    }
    if (name === "priceBook") {
      const data = productNameOptions.find((list) => {
        return list.value === value;
      });
      console.log("data", data);
      formik.setFieldValue("wholesalePrice", data.wholesalePrice.toFixed(2));
      formik.setFieldValue("description", data.description);
      formik.setFieldValue("term", data.term + " Months");
    }
    console.log(productNameOptions);
  };

  const formik = useFormik({
    initialValues: {
      retailPrice: "",
      priceBook: "",
      dealerId: "",
      description: "",
      status: priceBookById?.status !== undefined ? priceBookById.status : true,
      categoryId: "",
      wholesalePrice: "",
      term: "",
      brokerFee: "",
    },
    validationSchema: Yup.object({
      retailPrice: Yup.number()
        .required("Required")
        .min(0, "Retail Price cannot be negative"),
      priceBook: Yup.string().trim().required("Required"),
      dealerId: Yup.string().trim().required("Required"),
      categoryId: Yup.string().trim().required("Required"),
      status: Yup.boolean().required("Required"),
    }),
    onSubmit: async (values) => {
     setLoader(true)
      console.log(values);
      values.brokerFee = (values.retailPrice - values.wholesalePrice).toFixed(
        2
      );

      const result = id
        ? await editDealerPriceBook(id, values)
        : await addDealerPriceBook(values);

      console.log("Form values:", values);

      console.log(result);
      if (result.code !== 200) {
        setError(result.message);
      } else {
        setLoader(false)
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

  return (
    <div className="my-8 ml-3">
      <Headbar />
     {loader==true ? (
      <div className="h-screen bg-[#f1f2f3] flex py-5">
      <img src={Loader} className="mx-auto bg-transparent self-center" alt="Loader" />
      </div>
     ) : (
      <>
        <div className="flex">
        <Link
          to={"/dealerPriceList"}
          className="h-[60px] w-[60px] flex border-[1px] bg-white border-[#D1D1D1] rounded-[20px]"
        >
          <img
            src={BackImage}
            className="m-auto my-auto self-center bg-white"
            alt="BackImage"
          />
        </Link>
        <div className="pl-3">
          <p className="font-bold text-[36px] leading-9 mb-[3px]">
            {type} Dealer Book
          </p>
          <ul className="flex self-center">
            <li className="text-sm text-neutral-grey font-Regular">
              <Link to={"/dashboard"}>Price Book </Link>{" "}
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
      {error && (
        <p className="text-red-500 text-sm pl-2">
          <span className="font-semibold"> {error} </span>
        </p>
      )}
      {type === "Edit" && (
        <div className="bg-Edit bg-cover px-8 mt-8 py-16 rounded-[30px]">
          <Grid className="mx-8 mx-auto ">
            <div className="col-span-3 self-center border-r border-[#4e4e4e]">
              <div className="flex">
                <div className="self-center bg-[#FFFFFF08] backdrop-blur border-[#D1D9E24D] border rounded-lg p-3 mr-4">
                  <img src={Wholesale} className="w-6 h-6" alt="Wholesale" />
                </div>
                <div className="self-center">
                  <p className="text-[#FFF] text-base font-medium leading-5	">
                    Wholesale Price($)
                  </p>
                  <p className="text-[#FFFFFF] opacity-50 text-sm	font-medium">
                    $ {priceBookById?.wholesalePrice?.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-3 border-r border-[#4e4e4e]">
              <div className="flex">
                <div className="self-center bg-[#FFFFFF08] backdrop-blur border-[#D1D9E24D] border rounded-lg p-3 mr-4">
                  <img src={category1} className="w-6 h-6" alt="category" />
                </div>
                <div className="self-center">
                  <p className="text-[#FFF] text-base font-medium leading-5	">
                    Product Category
                  </p>
                  <p className="text-[#FFFFFF] opacity-50 text-sm	font-medium">
                    {priceBookById?.priceBooks?.category[0]?.name}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-3 border-r border-[#4e4e4e]">
              <div className="flex">
                <div className="self-center bg-[#FFFFFF08] border-[#D1D9E24D] border rounded-lg p-3 mr-4">
                  <img src={dealer} className="w-6 h-6" alt="dealer" />
                </div>
                <div className="self-center">
                  <p className="text-[#FFF] text-base font-medium leading-5	">
                    Dealer Name
                  </p>
                  <p className="text-[#FFFFFF] opacity-50 text-sm	font-medium">
                    {priceBookById?.dealer?.name}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-3">
              <div className="flex">
                <div className="self-center bg-[#FFFFFF08] border-[#D1D9E24D] border rounded-lg p-3 mr-4">
                  <img src={product} className="w-6 h-6" alt="product" />
                </div>
                <div className="self-center">
                  <p className="text-[#FFF] text-lg font-medium leading-5	">
                    Product Name
                  </p>
                  <p className="text-[#FFFFFF] opacity-50	font-medium">
                    {priceBookById?.priceBooks?.name}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-2"></div>
            <div className="col-span-8">
              <div className="flex">
                <div className="self-center bg-[#FFFFFF08] border-[#D1D9E24D] border rounded-lg p-3 mr-4">
                  <img src={product} className="w-6 h-6" alt="product" />
                </div>
                <div className="self-center">
                  <p className="text-[#FFF] text-lg font-medium leading-5	">
                  Description
                  </p>
                  <p className="text-[#FFFFFF] opacity-50	font-medium">
                    {priceBookById?.priceBooks?.description}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-2"></div>
          </Grid>
        </div>
      )}
      <form className="mt-8" onSubmit={formik.handleSubmit}>
        <div className="px-8 py-8 drop-shadow-4xl bg-white  border-[1px] border-[#D1D1D1]  rounded-3xl">
          <Grid>
            {type !== "Edit" && (
              <>
                <div className="col-span-4">
                  <Select
                    name="dealerId"
                    label="Dealer Name"
                    options={activeDealerList}
                    required={true}
                    className="!bg-[#fff]"
                    placeholder=""
                    value={formik.values.dealerId}
                    onBlur={formik.handleBlur}
                    onChange={handleSelectChange}
                    error={formik.touched.dealerId && formik.errors.dealerId}
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
                    className="!bg-[#fff]"
                    placeholder=""
                    maxLength={"30"}
                    value={formik.values.categoryId}
                    onBlur={formik.handleBlur}
                    onChange={handleSelectChange}
                    error={
                      formik.touched.categoryId && formik.errors.categoryId
                    }
                  />
                  {formik.touched.categoryId && formik.errors.categoryId && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {formik.errors.categoryId}
                    </div>
                  )}
                </div>
                <div className="col-span-4">
                  <Select
                    name="priceBook"
                    label="Product Name"
                    options={productNameOptions}
                    required={true}
                    className="!bg-[#fff]"
                    placeholder=""
                    value={formik.values.priceBook}
                    onBlur={formik.handleBlur}
                    onChange={handleSelectChange}
                    error={formik.touched.priceBook && formik.errors.priceBook}
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
                    name="wholesalePrice"
                    className="!bg-[#fff]"
                    label="Wholesale Price($)"
                    required={true}
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
                    className="!bg-[#fff]"
                    label="Description"
                    required={true}
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
                    className="!bg-[#fff]"
                    label="Term"
                    required={true}
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
              </>
            )}

            <div className="col-span-4">
              <Input
                type="tel"
                name="retailPrice"
                className="!bg-[#fff]"
                label="Retail Price ($)"
                placeholder=""
                required={true}
                maxLength={"10"}
                onChange={formik.handleChange}
                onBlur={(e) => {
                  const inputValue = e.target.value.trim();
                  const formattedValue =
                    inputValue !== "" ? parseFloat(inputValue).toFixed(2) : "";
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
                label="Status*"
                name="status"
                placeholder=""
                onChange={handleSelectChange}
                className="!bg-[#fff]"
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
            <Button type="submit" className="mt-12 font-normal rounded-[25px]">
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
              <Button
                className="!bg-[transparent] !text-light-black"
                onClick={() => navigate("/dealerPriceList")}
              >
                Cancel
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
                  Submitted{" "}
                  <span className="text-light-black"> Successfully </span>
                </p>
                <p className="text-neutral-grey text-base font-medium mt-2">
                  <b> New Dealer Book </b> added successfully.{" "}
                </p>
                <p> Redirecting you on Dealer Book Page {timer} seconds.</p>
              </>
            ) : (
              <>
                <p className="text-3xl mb-0 mt-4 font-semibold text-neutral-grey">
                  Updated{" "}
                  <span className="text-light-black"> Successfully </span>
                </p>
                <p className="text-neutral-grey text-base font-medium mt-2">
                  <b> New Dealer Book </b> updated successfully.{" "}
                </p>
                <p> Redirecting you on Dealer Book Page {timer} seconds.</p>
              </>
            )}
          </>
        </div>
      </Modal>
    </div>
  );
}

export default AddDealerBook;
