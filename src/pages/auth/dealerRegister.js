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

// Media imports
import Logo from "../../assets/images/logo.png";
import Logi from "../../assets/images/login.png";
import email from "../../assets/images/approval-image.png";

//importing Json data for state and cities
import { cityData } from "../../stateCityJson";

//api funcation decaleration
import {
  authDealerRegister,
  authserviceProviderRegister,
} from "../../services/authServices";

function DealerRegister() {
  const history = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
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
      name: Yup.string().required("Account Name Required"),
      street: Yup.string().required("Street Required"),
      state: Yup.string().required("State Required"),
      city: Yup.string().required("City Required"),
      country: Yup.string().required("Country Required"),
      email: Yup.string()
        .matches(emailValidationRegex, "Invalid email address")
        .required("Email Required"),
      zip: Yup.string().required("Zip Required"),
      firstName: Yup.string().required("FirstName Required"),
      lastName: Yup.string().required("LastName Required"),
      phoneNumber: Yup.string()
        .required("Contact # Required")
        .min(10, "Must be at least 10 characters")
        .max(10, "Must be exactly 10 characters"),
    }),
    onSubmit: async (values) => {
      console.log("Form values:", values);
      const result =
        userType === "Dealer's"
          ? await authDealerRegister(values)
          : await authserviceProviderRegister(values);
      console.log(result.result);
      if (result.code === 401) {
        setError(result.message);
      } else {
        setError("");
        openModal();
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
        <Grid className="px-8">
          <div className="col-span-7 self-center">
            <div className="mx-auto max-w-md">
              <img src={Logo} className="w-[224px]" alt="Logo " />
              <p className="text-3xl mb-0 mt-3 font-bold text-light-black">
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
              <form>
                <Grid className="">
                  <div className="col-span-6">
                    <Input
                      type="text"
                      name="name"
                      label="Account Name"
                      placeholder=""
                      value={formik.values.name}
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
                      value={formik.values.email}
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
                      placeholder=""
                      value={formik.values.firstName}
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
                      placeholder=""
                      value={formik.values.lastName}
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
                      name="street"
                      label="Street Address"
                      placeholder=""
                      value={formik.values.street}
                      onChange={formik.handleChange}
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
                      value={formik.values.city}
                      onChange={formik.handleChange}
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
                      onChange={handleSelectChange}
                      options={state}
                      value={formik.values.state}
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
                      placeholder=""
                      value={formik.values.country}
                      onChange={formik.handleChange}
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
                      placeholder=""
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
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
                      type="number"
                      name="phoneNumber"
                      label="Mobile Number"
                      placeholder=""
                      value={formik.values.phoneNumber}
                      onChange={formik.handleChange}
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
                </Grid>
              </form>
              <div>
                <Button
                  type="submit"
                  className="w-full h-[50px] mt-3 text-xl font-semibold"
                >
                  Register
                </Button>

                <p className="text-base text-neutral-grey font-medium mt-4">
                  Don’t have an account?{" "}
                  <Link
                    to={"/"}
                    className="text-light-black ml-3 font-semibold"
                  >
                    <b> Sign In </b>
                  </Link>{" "}
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-5">
            <img src={Logi} className="py-5  h-screen md:mx-auto" alt="Logo " />
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
            <Link to={"/"} className="font-semibold text-base text-light-black">
              Click the link to Sign In
            </Link>
          </div>
        </Modal>
      </div>
    </form>
  );
}

export default DealerRegister;
