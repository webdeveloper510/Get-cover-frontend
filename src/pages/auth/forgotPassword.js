import React, { useState } from "react";
import Grid from "../../common/grid";
import Input from "../../common/input";
import { Link } from "react-router-dom";
import Button from "../../common/button";
import Modal from "../../common/model";
import { useFormik } from "formik";
import * as Yup from "yup";

// Media imports
import Logo from "../../assets/images/Get-Cover.png";
import forgot from "../../assets/images/forgot_banner.png";
import email from "../../assets/images/email.png";

//Importing services
import { sendResetPasswordLink } from "../../services/authServices";

function ForgotPassword() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState();

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const emailValidationRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,50}$/i;

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .matches(emailValidationRegex, "Invalid email address")
        .required("Email Required"),
    }),
    onSubmit: async (values) => {
      console.log("Form values:", values);
      const result = await sendResetPasswordLink(values);
      console.log(result);
      if (result.code !== 200) {
        setError(result.message);
      } else {
        setError("");
        setIsModalOpen(true);
      }
    },
  });

  return (
    <div className="bg-hero-pattern bg-cover	bg-no-repeat	bg-center	">
      <form onSubmit={formik.handleSubmit}>
        <Grid className="px-8 ">
          <div className="col-span-5">
            <img
              src={forgot}
              className="h-screen object-contain py-5 w-full"
              alt="Logo "
            />
          </div>
          <div className="col-span-6 self-center">
            <div className="mx-auto max-w-md">
              <img src={Logo} className="w-[224px]" alt="Logo " />
              <p className="text-3xl mb-0 mt-4 font-bold text-light-black">
                <span className="text-neutral-grey"> Forgot </span> Your
                Password?
              </p>
              <p className="text-neutral-grey text-xl font-medium mt-4 mb-5">
                Please enter the <b> email address </b> you'd like your password
                reset information sent to{" "}
              </p>
              {error && (
                <p className="text-red-500 text-sm pl-2 mb-4">
                  <span className="font-semibold"> {error} </span>
                </p>
              )}
              <Input
                type="email"
                name="email"
                label="Email"
                placeholder=""
                onBlur={formik.handleBlur}
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm pl-2 pt-2">
                  {formik.errors.email}
                </div>
              )}

              <div>
                <Button
                  type="submit"
                  className="w-full mt-3 h-[50px] text-lg font-semibold"
                >
                  Request Reset Password
                </Button>

                <p className="text-base font-medium mt-4">
                  <Link
                    to={"/"}
                    className="text-base font-medium text-light-black"
                  >
                    Back to Login
                  </Link>{" "}
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-1"></div>
        </Grid>
      </form>

      {/* Modal Email Popop */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center py-3">
          <img src={email} alt="email Image" className="mx-auto" />
          <p className="text-3xl mb-0 mt-2 font-semibold text-neutral-grey">
            Check your <span className="text-light-black"> Email </span>
          </p>
          <p className="text-neutral-grey text-base font-medium mt-4">
            We emailed a <b> magic link </b> to{" "}
            <span className="text-light-black">{formik.values.email} </span>
          </p>
          <Link to={"/"} className="font-semibold text-base text-light-black">
            Click the link to Sign In
          </Link>
        </div>
      </Modal>
    </div>
  );
}

export default ForgotPassword;
