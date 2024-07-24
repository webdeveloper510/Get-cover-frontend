import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Grid from "../../common/grid";
import Input from "../../common/input";
import Button from "../../common/button";
import PasswordInput from "../../common/passwordInput";
import Select from "../../common/select";
import Modal from "../../common/model";
import { useFormik } from "formik";
import * as Yup from "yup";

import Logo from "../../assets/images/Get-Cover.png";
import Logi from "../../assets/images/login.png";
import email from "../../assets/images/approval-image.png";

import { cityData } from "../../stateCityJson";

import {
  authDealerRegister,
  authserviceProviderRegister,
} from "../../services/authServices";
import { RotateLoader } from "react-spinners";

function DealerRegister() {
  const history = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [userType, setUserType] = useState("");
  const [error, setError] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const state = cityData;

  const emailValidationRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const formik = useFormik({
    initialValues: {
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
      role: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .required("Required")
        .max(50, "Must be exactly 50 characters"),
      street: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .required("Required")
        .max(50, "Must be exactly 50 characters"),
      state: Yup.string().required("Required"),
      city: Yup.string()
        .required("Required")
        .transform((originalValue) => originalValue.trim()),
      country: Yup.string().required("Required"),
      email: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .matches(emailValidationRegex, "Invalid email address")
        .required("Required"),
      zip: Yup.string()
        .required("Required")
        .min(5, "Must be at least 5 characters")
        .max(6, "Must be exactly 6 characters"),
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
    }),
    onSubmit: async (values) => {
      setLoader(true);
      console.log("Form values:", values);
      const result =
        userType === "Dealer's"
          ? await authDealerRegister(values)
          : await authserviceProviderRegister(values);
      console.log(result.result);
      if (result.code !== 200) {
        setError(result.message);
        setLoader(false);
      } else {
        setError("");
        openModal();
        setLoader(false);
      }
    },
  });

  useEffect(() => {
    if (history.pathname == "/registerDealer") {
      setUserType("Dealer's");
    } else {
      setUserType("Service Provider");
    }
    formik.setFieldValue(
      "role",
      userType === "Dealer's" ? "Dealer" : "Servicer"
    );
  }, [history.pathname, userType]);

  const handleSelectChange = (name, selectedValue) => {
    formik.setFieldValue(name, selectedValue);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="relative bg-hero-pattern bg-cover	bg-no-repeat bg-center">
        <Grid className="px-8 s:grid-cols-6 md:grid-cols-12 xl:grid-cols-12">
          <div className="col-span-7 self-center min-h-screen flex relative">
            <div className="mx-auto md:w-4/6	s:w-full py-5 self-center  ">
              <img src={Logo} className="w-[224px]" alt="Logo " />
              <p className="text-3xl mb-0 mt-1 font-bold text-light-black">
                <span className="text-neutral-grey"> Welcome to </span> GetCover
              </p>
              <p className="text-neutral-grey text-xl font-medium mb-4 mt-2">
                {" "}
                Sign up to your{" "}
                <span className="font-semibold"> {userType} Account </span>{" "}
              </p>
              {error && (
                <p className="text-red-500 text-sm pl-2 mb-4">
                  <span className="font-semibold"> {error} </span>
                </p>
              )}
              {loader ? (
                <div className=" h-[400px] w-full flex py-5">
                  <div className="self-center mx-auto">
                    <RotateLoader color="#333" />
                  </div>
                </div>
              ) : (
                <form>
                  <Grid className="">
                    <div className="col-span-6">
                      <Input
                        type="text"
                        name="name"
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
                    <div className="col-span-6">
                      <Input
                        type="text"
                        name="email"
                        label="Email"
                        placeholder=""
                        required={true}
                        value={formik.values.email}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={formik.touched.email && formik.errors.email}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <div className="text-red-500 text-sm pl-2 pt-2">
                          {formik.errors.email}
                        </div>
                      )}
                    </div>
                    <div className="col-span-6">
                      <Input
                        type="text"
                        name="firstName"
                        label="First Name"
                        required={true}
                        placeholder=""
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
                        required={true}
                        placeholder=""
                        maxLength={"30"}
                        value={formik.values.lastName}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.lastName && formik.errors.lastName
                        }
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
                        name="street"
                        label="Street Address"
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
                    <div className="col-span-6">
                      <Input
                        type="text"
                        name="city"
                        label="City"
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
                    <div className="col-span-6">
                      <Select
                        label="State"
                        name="state"
                        placeholder=""
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
                    <div className="col-span-6">
                      <Input
                        type="text"
                        name="country"
                        label="Country"
                        required={true}
                        placeholder=""
                        value={formik.values.country}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        defaultValue="USA"
                        error={formik.touched.country && formik.errors.country}
                        disabled
                      />
                      {formik.touched.country && formik.errors.country && (
                        <div className="text-red-500 text-sm pl-2 pt-2">
                          {formik.errors.country}
                        </div>
                      )}
                    </div>
                    <div className="col-span-6">
                      <Input
                        type="number"
                        name="zip"
                        label="Zip Code"
                        required={true}
                        placeholder=""
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
                    <div className="col-span-6">
                      <Input
                        type="tel"
                        name="phoneNumber"
                        label="Phone Number"
                        required={true}
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
                          formik.touched.phoneNumber &&
                          formik.errors.phoneNumber
                        }
                      />
                      {(formik.touched.phoneNumber || formik.submitCount > 0) &&
                        formik.errors.phoneNumber && (
                          <div className="text-red-500 text-sm pl-2 pt-2">
                            {formik.errors.phoneNumber}
                          </div>
                        )}
                    </div>
                  </Grid>
                </form>
              )}

              <div>
                <Button
                  type="submit"
                  className="w-full h-[50px] mt-3 text-xl font-semibold"
                >
                  Register
                </Button>

                <p className="text-base text-neutral-grey font-medium mt-4">
                  Already have an account?{" "}
                  <Link
                    to={"/"}
                    className="text-light-black ml-3 font-semibold"
                  >
                    {" "}
                    Sign In
                  </Link>{" "}
                </p>
                <div>
                    <p className="text-base text-neutral-grey font-medium mt-4 text-center " style={{bottom : '20px'}}>Design, Develop & Maintain by <a href="https://codenomad.net/" target="_blank">Codenomad.net </a></p>
                  </div>
              </div>
            </div>
          
          </div>
          <div className="col-span-5">
            <img
              src={Logi}
              className="py-5  h-screen mx-auto hidden md:block"
              alt="Logo "
            />
          </div>
        </Grid>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="text-center py-3">
            <img src={email} alt="email Image" className="mx-auto w-1/2 py-8" />
            <p className="text-3xl mb-0 mt-2 font-semibold text-neutral-grey">
              Please wait it will take time for{" "}
              <span className="text-light-black"> Approval </span>
            </p>
            <p className="text-neutral-grey text-base font-medium mt-4">
              For some security reasons you <b> require an approval. </b> It
              will be executed{" "}
            </p>
            <p className="font-medium text-base text-neutral-grey">
              as soon as the approver will validate the action. 
            </p>
            <Link to={"/"} className="font-bold text-base text-light-black">
              Click the link to Sign In
            </Link>
          </div>
        </Modal>
      </div>
    </form>
  );
}

export default DealerRegister;
