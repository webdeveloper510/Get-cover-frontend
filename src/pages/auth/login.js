import React, { useEffect, useState } from "react";
import Grid from "../../common/grid";
import Input from "../../common/input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../common/button";
import Layout from "../../utils/layout";

// Media imports
import Logo from "../../assets/images/logo.png";
import Logi from "../../assets/images/login.png";
import PasswordInput from "../../common/passwordInput";

//Importing services
import { authlogin } from "../../services/authServices";

function Login() {
  const [userDetails, setUserDetails] = useState();
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Get Cover | Login";
  }, []);

  const emailValidationRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,50}$/i;

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .matches(emailValidationRegex, "Invalid email address")
        .required("Email Required"),
      password: Yup.string().required("Password Required"),
    }),
    onSubmit: async (values) => {
      console.log("Form values:", values);
      const result = await authlogin(values);
      console.log(result.result);
      if (result.code === 401) {
        setError(true);
      } else {
        setError(false);
        setUserDetails(result.result);
        localStorage.setItem("userDetails", JSON.stringify(result.result) );
        navigate("/dashboard");
      }
    },
  });

  return (
    <Layout>
      <form onSubmit={formik.handleSubmit}>
        <div className="relative bg-hero-pattern bg-cover	bg-no-repeat	bg-center	">
          <Grid className="px-8">
            <div className="col-span-5">
              <img
                src={Logi}
                className="py-5 lg:h-screen h-full md:mx-auto"
                alt="Logo "
              />
            </div>
            <div className="col-span-6 self-center">
              <div className="mx-auto max-w-md">
                <img src={Logo} className="w-[224px]" alt="Logo " />
                <p className="text-3xl mb-3 mt-4 font-bold text-light-black">
                  <span className="text-neutral-grey"> Welcome to </span>{" "}
                  GetCover
                </p>
                <p className="text-neutral-grey text-xl font-medium mb-5">
                  <span className="font-semibold"> Sign in </span> to your
                  account
                </p>
                {error && (
                  <p className="text-red-500 text-sm pl-2">
                    <span className="font-semibold"> Invalid Credentials </span>
                  </p>
                )}
                <div className="my-3">
                  <Input
                    type="email"
                    name="email"
                    label="Email"
                    placeholder="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {formik.errors.email}
                    </div>
                  )}
                </div>
                <div>
                  <PasswordInput
                    type="password"
                    name="password"
                    label="Password"
                    placeholder=""
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isPassword
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {formik.errors.password}
                    </div>
                  )}
                </div>

                <div className="my-3 text-end">
                  <Link
                    to={"/forgot"}
                    className="text-base text-neutral-grey underline font-medium"
                  >
                    {" "}
                    Forgot my password?{" "}
                  </Link>
                </div>
                <div>
                  <Button
                    type="submit"
                    className="w-full h-[50px] text-xl font-semibold"
                  >
                    Sign in
                  </Button>

                  <p className="text-base text-neutral-grey font-medium mt-4">
                    Don’t have an account?{" "}
                    <Link
                      to={"/register"}
                      className="text-light-black ml-3 font-semibold"
                    >
                      <b> Register </b>
                    </Link>{" "}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-1"></div>
          </Grid>
        </div>
      </form>
    </Layout>
  );
}

export default Login;
