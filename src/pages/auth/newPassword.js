import React, { useState } from "react";
import Grid from "../../common/grid";
import { Link, useParams } from "react-router-dom";
import Button from "../../common/button";
import { useFormik } from "formik";
import * as Yup from "yup";

// Media imports
import Logo from "../../assets/images/logo.png";
import NewPasswordImage from "../../assets/images/new_password.png";
import NewPasswordEmail from "../../assets/images/reset-password.png";
import Cross from "../../assets/images/Cross.png";
import PasswordInput from "../../common/passwordInput";
import Modal from "../../common/model";
import { resetPassword } from "../../services/authServices";

const NewPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

function NewPassword() {
  const [error, setError] = useState("");
  const { id, token } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: NewPasswordSchema,
    onSubmit: async (values) => {
      delete values.confirmPassword;
      console.log("Form submitted with values:", values);
      const result = await resetPassword(values, id, token);
      console.log(result.message);
      if (result.code === 401) {
        setError(result.message);
      } else {
        setError(result.message);
        setIsModalOpen(true);
      }
    },
  });
  // console.log(id, token);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
      <form onSubmit={formik.handleSubmit}>
        <Grid className="px-8 ">
          <div className="col-span-5">
            <img
              src={NewPasswordImage}
              className="h-screen object-contain py-5 w-full"
              alt="Logo "
            />
          </div>
          <div className="col-span-6 self-center">
            <div className="mx-auto max-w-md">
              <img src={Logo} className="w-[224px]" alt="Logo " />
              <p className="text-3xl mb-0 mt-4 font-bold text-light-black">
                <span className="text-neutral-grey"> Enter </span> New Password
              </p>
              <p className="text-neutral-grey text-xl font-medium mt-4 mb-5">
                Strong passwords include <b> numbers, letters, </b> and{" "}
                <b> punctuation marks </b>.
              </p>
              {error && (
                <p className="text-red-500 text-sm pl-2">
                  <span className="font-semibold"> {error} </span>
                </p>
              )}
              <PasswordInput
                type="password"
                name="password"
                label="New Password"
                placeholder=""
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                error={formik.touched.password && formik.errors.password}
                isPassword
              />
              <div className="my-3"></div>

              <PasswordInput
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                placeholder=""
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                error={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
                isPassword
              />
              <div>
                <Button
                  className="w-full h-[50px] text-lg mt-3 font-semibold"
                  type="submit"
                >
                  Reset Password
                </Button>
              </div>
            </div>
          </div>
          <div className="col-span-1"></div>
        </Grid>
      </form>

      {/* Modal Email Popop */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <Button
          onClick={closeModal}
          className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]"
        >
          <img
            src={Cross}
            className="w-full h-full text-black rounded-full p-0"
          />
        </Button>
        <div className="text-center py-3">
          <img src={NewPasswordEmail} alt="email Image" className="mx-auto" />
          <p className="text-3xl mb-0 mt-4 font-semibold text-neutral-grey">
            Password{" "}
            <span className="text-light-black"> Reset Successfully </span>
          </p>
          <p className="text-neutral-grey text-base font-medium mt-4">
            Your password has been changed. Now you can{" "}
          </p>
          <Link to={"/"} className="font-medium text-base text-neutral-grey">
            {" "}
            <b> login </b> with your new password.
          </Link>
        </div>
      </Modal>
    </div>
  );
}

export default NewPassword;
