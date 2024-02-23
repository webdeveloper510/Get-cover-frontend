import React, { useState } from "react";
import Button from "../../../common/button";
import Grid from "../../../common/grid";
import Input from "../../../common/input";

// Media Includes
import BackImage from "../../../assets/images/icons/backArrow.svg";
import Wholesale from "../../../assets/images/icons/wholePrice.svg";
import product from "../../../assets/images/icons/productName.svg";
import category1 from "../../../assets/images/icons/productCat.svg";
import dealer from "../../../assets/images/icons/dealerName.svg";
import claim from "../../../assets/images/icons/claimAmount.svg";
import contract from "../../../assets/images/icons/contract.svg";
import Eligibility from "../../../assets/images/icons/Eligibility.svg";
import delaerName from "../../../assets/images/icons/dealerNumber.svg";
import ServicerName from "../../../assets/images/icons/servicerNumber.svg";
import CustomerName from "../../../assets/images/icons/customerNumber.svg";
import AddDealer from "../../../assets/images/dealer-book.svg";
import Headbar from "../../../common/headBar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  editContractById,
  getContractValues,
} from "../../../services/extraServices";
import { useEffect } from "react";
import { RotateLoader } from "react-spinners";
function EditContract() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [contractDetails, setContractDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);

  const validationSchema = Yup.object().shape({
    manufacture: Yup.string().required("Required"),
    model: Yup.string().required("Required"),
    serial: Yup.string().required("Required"),
    productValue: Yup.number()
      .typeError("Must be a number")
      .required("Required")
      .min(1, "Product value must be at least 1"),
    condition: Yup.string().required("Rrequired"),
    coverageStartDate: Yup.date().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      manufacture: "",
      model: "",
      serial: "",
      productValue: "",
      condition: "",
      coverageStartDate: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const res = await editContractById(id, values);
        console.log(res);
        navigate(-1);
      } catch (error) {
        setLoading(false);
        console.error("Error editing contract:", error);
      } finally {
        setLoading(false);
      }
    },
  });
  const getContractDetails = async () => {
    setLoading(true);
    const result = await getContractValues(id);
    setContractDetails(result.result);
    formik.setValues({
      manufacture: result.result.manufacture || "",
      model: result.result.model || "",
      serial: result.result.serial || "",
      productValue: result.result.productValue || "",
      condition: result.result.condition || "",
      coverageStartDate:
        result.result.order[0].productsArray[0].coverageStartDate || "",
    });
    console.log(result.result);
    setLoading(false);
  };

  useEffect(() => {
    getContractDetails();
  }, []);

  const handleGOBack = () => {
    navigate(-1);
  };
  return (
    <>
      <div className="my-8 ml-3">
        <Headbar />

        <div className="flex mt-2">
        <Link
            onClick={handleGOBack}
            className="h-[60px] w-[60px] flex border-[1px] bg-white border-[#D1D1D1] rounded-[20px]"
          >
            <img
              src={BackImage}
              className="m-auto my-auto self-center bg-white"
              alt="BackImage"
            />{" "}
          </Link>
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9	mb-[3px]">
              {" "}
              Edit Contracts
            </p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/"}>Contracts /</Link>{" "}
              </li>
              <li className="text-sm text-neutral-grey font-semibold ml-1">
                Edit Contracts
              </li>
            </ul>
          </div>
        </div>
        {loading ? (
          <div className=" h-[400px] w-full flex py-5">
            <div className="self-center mx-auto">
              <RotateLoader color="#333" />
            </div>
          </div>
        ) : (
          <>
            <div className="bg-Edit bg-cover px-8 mt-8 mr-4 py-16 rounded-[30px]">
              <Grid className="mx-8 mx-auto ">
                <div className="col-span-3 self-center border-r border-[#4e4e4e]">
                  <div className="flex">
                    <div className="self-center backdrop-blur mr-4">
                      <img src={contract} alt="category" />
                    </div>
                    <div className="self-center">
                      <p className="text-[#FFF] text-base font-medium leading-5	">
                        Contract ID
                      </p>
                      <p className="text-[#FFFFFF] opacity-50 text-sm	font-medium">
                        {contractDetails?.unique_key}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-3 border-r border-[#4e4e4e]">
                  <div className="flex">
                    <div className="self-center bg-[#FFFFFF08] backdrop-blur border-[#D1D9E24D] border rounded-lg p-3 mr-4">
                      <img src={category1} className="w-6 h-6" alt="dealer" />
                    </div>
                    <div className="self-center">
                      <p className="text-[#FFF] text-base font-medium leading-5	">
                        Order ID
                      </p>
                      <p className="text-[#FFFFFF] opacity-50 text-sm	font-medium">
                        {contractDetails?.order?.[0]?.unique_key}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="flex w-full border-r border-[#4e4e4e]">
                    <div className="self-center backdrop-blur  mr-4">
                      <img src={delaerName} alt="terms" />
                    </div>
                    <div className="self-center">
                      <p className="text-[#FFF] text-base font-medium leading-5">
                        Dealer P.O. #.
                      </p>
                      <p className="text-[#FFFFFF] opacity-50	text-sm font-medium">
                        {contractDetails?.order?.[0]?.venderOrder}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-3 self-center pt-2 ">
                  <div className="flex">
                    <div className="self-center backdrop-blur  mr-4">
                      <img src={Eligibility} alt="product" />
                    </div>
                    <div className="self-center">
                      <p className="text-[#FFF] text-base font-medium leading-5	">
                        Status
                      </p>
                      <p className="text-[#FFFFFF] opacity-50 text-sm	font-medium">
                        {contractDetails?.status}
                      </p>
                    </div>
                  </div>
                </div>
                
              </Grid>
              <Grid className="mx-8 mt-2  mx-auto ">
              <div className="col-span-3 self-center pt-2 border-t border-[#4e4e4e]">
                  <div className="flex border-r border-[#4e4e4e]">
                    <div className="self-center backdrop-blur  mr-4">
                      <img src={delaerName} alt="product" />
                    </div>
                    <div className="self-center">
                      <p className="text-[#FFF] text-base font-medium leading-5	">
                        Dealer Name
                      </p>
                      <p className="text-[#FFFFFF] opacity-50 text-sm	font-medium">
                        {contractDetails?.order?.[0]?.dealer?.[0]?.name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-3 self-center pt-2 border-t border-[#4e4e4e]">
                  <div className="flex w-full border-r border-[#4e4e4e]">
                    <div className="self-center backdrop-blur  mr-4">
                      <img src={delaerName} alt="terms" />
                    </div>
                    <div className="self-center">
                      <p className="text-[#FFF] text-base font-medium leading-5">
                        Reseller Name
                      </p>
                      <p className="text-[#FFFFFF] opacity-50	text-sm font-medium">
                        {contractDetails?.order?.[0]?.reseller?.[0]?.name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-3 self-center pt-2 border-t border-[#4e4e4e]">
                  <div className="flex w-full border-r border-[#4e4e4e]">
                    <div className="self-center backdrop-blur  mr-4">
                      <img src={CustomerName} alt="category" />
                    </div>
                    <div className="self-center">
                      <p className="text-[#FFF] text-base font-medium leading-5	">
                        Customer Name
                      </p>
                      <p className="text-[#FFFFFF] opacity-50 text-sm	font-medium">
                        {contractDetails?.order?.[0]?.customer?.[0]?.username}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-3 self-center pt-2 border-t border-[#4e4e4e]">
                  <div className="flex w-full ">
                    <div className="self-center backdrop-blur   mr-4">
                      <img src={ServicerName} alt="dealer" />
                    </div>
                    <div className="self-center">
                      <p className="text-[#FFF] text-base font-medium leading-5	">
                        Servicer Name
                      </p>
                      <p className="text-[#FFFFFF] opacity-50 text-sm	font-medium">
                        {contractDetails?.order?.[0]?.servicer?.[0]?.name}
                      </p>
                    </div>
                  </div>
                </div>
               
              </Grid>
              <Grid className="mx-8 mt-2  mx-auto ">
                <div className="col-span-3 self-center pt-2 border-t border-[#4e4e4e]">
                  <div className="flex w-full border-r border-[#4e4e4e]">
                    <div className="self-center backdrop-blur  mr-4">
                      <img src={CustomerName} alt="category" />
                    </div>
                    <div className="self-center">
                      <p className="text-[#FFF] text-base font-medium leading-5	">
                        Coverage Start Date
                      </p>
                      <p className="text-[#FFFFFF] opacity-50 text-sm	font-medium">
                        {new Date(
                          contractDetails?.order?.[0]?.productsArray?.[0]?.coverageStartDate
                        ).toLocaleDateString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-3 self-center pt-2 border-t border-[#4e4e4e]">
                  <div className="flex w-full border-r border-[#4e4e4e]">
                    <div className="self-center backdrop-blur   mr-4">
                      <img src={ServicerName} alt="dealer" />
                    </div>
                    <div className="self-center">
                      <p className="text-[#FFF] text-base font-medium leading-5	">
                        Coverage End Date
                      </p>
                      <p className="text-[#FFFFFF] opacity-50 text-sm	font-medium">
                        {new Date(
                          contractDetails?.order?.[0]?.productsArray?.[0]?.coverageEndDate
                        ).toLocaleDateString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-3 self-center pt-2 border-t border-[#4e4e4e]">
                  <div className="flex w-full border-r border-[#4e4e4e]">
                    <div className="self-center backdrop-blur  mr-4">
                      <img src={claim} alt="terms" />
                    </div>
                    <div className="self-center">
                      <p className="text-[#FFF] text-base font-medium leading-5">
                        Claimed Value
                      </p>
                      <p className="text-[#FFFFFF] opacity-50	text-sm font-medium">
                        ${parseInt(contractDetails?.claimAmount).toLocaleString(
                          2
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-3 self-center pt-2 border-t border-[#4e4e4e]">
                  <div className="flex">
                    <div className="self-center backdrop-blur  mr-4">
                      <img src={Eligibility} alt="product" />
                    </div>
                    <div className="self-center">
                      <p className="text-[#FFF] text-base font-medium leading-5	">
                        Eligibility
                      </p>
                      <p className="text-[#FFFFFF] opacity-50 text-sm	font-medium">
                        {contractDetails?.eligibilty}
                      </p>
                    </div>
                  </div>
                </div>
              </Grid>
            </div>

            <form className="mt-8 mr-4" onSubmit={formik.handleSubmit}>
              <div className="px-8 pb-8 pt-6 drop-shadow-4xl bg-white  border-[1px] border-[#D1D1D1]  rounded-3xl">
                <p className="pb-5 text-lg font-semibold">Contracts</p>
                <Grid className="!grid-cols-5">
                  <div className="col-span-1">
                    <Input
                      type="text"
                      name="manufacture"
                      className="!bg-[#fff]"
                      label="Manufacturer"
                      required={true}
                      placeholder=""
                      value={formik.values.manufacture}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.manufacture && formik.errors.manufacture
                      }
                    />
                    {formik.touched.manufacture &&
                      formik.errors.manufacture && (
                        <div className="text-red-500 text-sm pl-2 pt-2">
                          {formik.errors.manufacture}
                        </div>
                      )}
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="text"
                      name="model"
                      className="!bg-[#fff]"
                      label="Model"
                      required={true}
                      placeholder=""
                      value={formik.values.model}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      error={formik.touched.model && formik.errors.model}
                    />
                    {formik.touched.model && formik.errors.model && (
                      <div className="text-red-500 text-sm pl-2 pt-2">
                        {formik.errors.model}
                      </div>
                    )}
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="text"
                      name="serial"
                      className="!bg-[#fff]"
                      label="Serial"
                      required={true}
                      placeholder=""
                      value={formik.values.serial}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      error={formik.touched.serial && formik.errors.serial}
                    />
                    {formik.touched.serial && formik.errors.serial && (
                      <div className="text-red-500 text-sm pl-2 pt-2">
                        {formik.errors.serial}
                      </div>
                    )}
                  </div>

                  <div className="col-span-1">
                    <Input
                      type="number"
                      name="productValue"
                      className="!bg-[#fff]"
                      label="RetailPrice"
                      required={true}
                      placeholder=""
                      value={formik.values.productValue}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.productValue &&
                        formik.errors.productValue
                      }
                    />
                    {formik.touched.productValue &&
                      formik.errors.productValue && (
                        <div className="text-red-500 text-sm pl-2 pt-2">
                          {formik.errors.productValue}
                        </div>
                      )}
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="text"
                      name="condition"
                      className="!bg-[#fff]"
                      label="Condition"
                      required={true}
                      placeholder=""
                      value={formik.values.condition}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.condition && formik.errors.condition
                      }
                    />
                    {formik.touched.condition && formik.errors.condition && (
                      <div className="text-red-500 text-sm pl-2 pt-2">
                        {formik.errors.condition}
                      </div>
                    )}
                  </div>
                </Grid>

                <div className="mt-8">
                  <Button className="!bg-white !text-black">Cancel</Button>
                  <Button type="submit">Update</Button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
}

export default EditContract;
