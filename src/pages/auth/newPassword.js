import React, { useEffect, useState } from "react";
import Grid from "../../common/grid";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../common/button";
import { useFormik } from "formik";
import * as Yup from "yup";

// Media imports
import Logo from "../../assets/images/Get-Cover.png";
import NewPasswordImage from "../../assets/images/new_password.png";
import NewPasswordEmail from "../../assets/images/reset-password.png";
import Cross from "../../assets/images/Cross.png";
import PasswordInput from "../../common/passwordInput";
import Modal from "../../common/model";
import { checkLink, resetPassword } from "../../services/authServices";
import { getSetting } from "../../services/extraServices";

const NewPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

function NewPassword() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { id, token } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [siteDetails,setSiteDetails]= useState({})
 
  useEffect(() => {
    const data = localStorage.getItem("siteSettings")
    setSiteDetails(JSON.parse(data))
    console.log(JSON.parse(data))
  }, []);
  
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
      if (result.code !== 200) {
        setError(result.message);
      } else {
        setError(result.message);
        setIsModalOpen(true);
        setTimeout(() => {
          navigate('/'); // redirect to the login page after 3 seconds
        }, 3000);
      }
    },
  });

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    checkValidLink()
  }, [])

  const checkValidLink = () => {
    checkLink(id, token).then((res) => {
      if (res.code != 200) {
        navigate('/login')
      }
    })
  }
  return (
    <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
      <form onSubmit={formik.handleSubmit}>
        <Grid className="px-8 ">
          <div className="col-span-5">
            <img
              src={NewPasswordImage}
              loading="lazy"
              className="h-screen object-contain py-5 w-full"
              alt="Logo "
            />
          </div>
          <div className="col-span-6 self-center">
            <div className="mx-auto max-w-md">
              <img src={`${siteDetails?.logoDark?.fullUrl}uploads/logo/${encodeURIComponent(siteDetails?.logoDark?.fileName)}`} className="w-[224px]" alt="Logo " />
              <p className="text-3xl mb-0 mt-4 font-bold text-light-black">
                <span className="text-neutral-grey"> Enter </span> New Password
              </p>
              <p className="text-neutral-grey text-xl font-medium mt-4 mb-5">
                Strong passwords include <b> numbers, letters, </b> and{" "}
                <b> punctuation marks </b>.
              </p>
              {error && (
                <p className="text-red-500 text-sm pl-2 mb-3">
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
                  Set New Password
                </Button>
              </div>
            </div>
          </div>
          <div className="col-span-1"></div>
        </Grid>
      </form>

      {/* Modal Email Popop */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center py-3">
          <img src={NewPasswordEmail} alt="email Image" loading="lazy" className="mx-auto" />
          <p className="text-3xl mb-0 mt-4 font-semibold">
            Password{" "}
            <span className=""> Reset Successfully </span>
          </p>
          <p className="text-base font-medium mt-4">
            Your password has been changed. Now you can{" "}
          </p>

          <p className=" text-base font-medium"><Link to={"/"} className="font-bold text-base">
            {" "}
            login
          </Link> with your new password. </p>
        </div>
      </Modal>
    </div>
  );
}

export default NewPassword;
