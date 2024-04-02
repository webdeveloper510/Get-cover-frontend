import React, { useEffect, useState } from "react";
import Headbar from "../../../common/headBar";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "../../../common/select";
import Grid from "../../../common/grid";
import Input from "../../../common/input";

// Media Include
import BackImage from "../../../assets/images/icons/backArrow.svg";
import DeleteImage from "../../../assets/images/icons/Delete.svg";
import AddDealer from "../../../assets/images/dealer-book.svg";
import Button from "../../../common/button";
import RadioButton from "../../../common/radio";
import Modal from "../../../common/model";
import { cityData } from "../../../stateCityJson";
import { useFormik } from "formik";
import disapprove from "../../../assets/images/Disapproved.png";
import * as Yup from "yup";
import {
  checkDealersEmailValidation,
  getDealersList,
} from "../../../services/dealerServices";
import Cross from "../../../assets/images/Cross.png";
import { addNewReseller } from "../../../services/reSellerServices";
import { RotateLoader } from "react-spinners";
import { addNewResellerForDealer } from "../../../services/dealerServices/resellerServices";

function DealerAddReseller() {
  const [timer, setTimer] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [createAccountOption, setCreateAccountOption] = useState("yes");
  const [isEmailAvailable, setIsEmailAvailable] = useState(true);
  const [dealerList, setDealerList] = useState([]);
  const [createServicerAccountOption, setServicerCreateAccountOption] =
    useState(false);
  const navigate = useNavigate();
  const { dealerValueId } = useParams();

  const [initialFormValues, setInitialFormValues] = useState({
    accountName: "",
    // dealerName: "",
    status: true,
    street: "",
    city: "",
    zip: "",
    state: "",
    country: "USA",
    lastName: "",
    firstName: "",
    email: "",
    phoneNumber: "",
    position: "",
    members: [],
    isServicer: createServicerAccountOption,
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleServiceChange = (event) => {
    const valueAsBoolean = JSON.parse(event.target.value.toLowerCase());
    setServicerCreateAccountOption(valueAsBoolean);
  };
  const emailValidationRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  const handleRadioChangeDealers = (value, index) => {
    const updatedMembers = [...formik.values.members];
    updatedMembers[index].status = value === "yes";
    formik.setFieldValue("members", updatedMembers);
  };

  const handleSelectChange = async (name, value) => {
    formik.setFieldValue(name, value);
  };
  const handleRadioChange = (event) => {
    const selectedValue = event.target.value;
    setCreateAccountOption(selectedValue);

    
    if (selectedValue === "no") {
      const updatedMembers = formik.values.members.map((service) => ({
        ...service,
        status: false,
      }));

      formik.setFieldValue("members", updatedMembers);
      formik.setFieldValue("status", false);
    }
  };
  const state = cityData;
  useEffect(() => {
    getDealerListData();
  }, []);
  useEffect(() => {
    setLoading(true);
    let intervalId;
    if (isModalOpen && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0 && message === "Reseller Created Successfully") {
      closeModal();
      if (dealerValueId) {
        navigate(`/dealerDetails/${dealerValueId}`);
      } else {
        navigate("/dealer/resellerList");
      }
    }
    setLoading(false);
    return () => {
      clearInterval(intervalId);
    };
  }, [isModalOpen, timer, closeModal, message]);

  const handleAddTeamMember = () => {
    const members = {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      position: "",
      status: createAccountOption === "no"?false:true,
      isPrimary: false,
    };

    formik.setFieldValue("members", [...formik.values.members, members]);
  };
  const checkEmailAvailability = async (email) => {
    console.log(emailValidationRegex.test(email));
    if (emailValidationRegex.test(email) != false) {
      const result = await checkDealersEmailValidation(email);
      console.log(result);
      if (result.code === 200) {
        setIsEmailAvailable(true);
        formik.setFieldError("email", "");
      } else if (result.code === 401) {
        setIsEmailAvailable(false);
        // setMessage("Some Errors Please Check Form Validations ");
        // setIsModalOpen(true);

        return false;
      }
    }
  };
  const handleDeleteMembers = (index) => {
    const updatedMembers = [...formik.values.members];
    updatedMembers.splice(index, 1);
    formik.setFieldValue("members", updatedMembers);
  };

  const checkDealerEmailAndSetError = async (email, formik, fieldPath) => {
    if (emailValidationRegex.test(email)) {
      try {
        const result = await checkDealersEmailValidation(email);
        console.log(result);
        if (result.code === 200) {
          formik.setFieldError(fieldPath, "");
          return true;
        } else if (
          result.message === "Reseller already exist with this account name"
        ) {
          formik.setFieldError("accountName", "Already Exist");
        } else if (result.code === 401) {
          formik.setFieldError(fieldPath, "Email is already in use");
          setMessage("Some Errors Please Check Form Validations ");
          setIsModalOpen(true);
          return false;
        }
      } catch (error) {
        console.error("Error checking dealer email availability:", error);
      }
    } else {
      formik.setFieldError(fieldPath, "Invalid email address");
    }
    return false;
  };
  console.log(loading1, '-----------------loader');
  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      // dealerName: Yup.string().required("Required"),
      accountName: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .required("Required")
        .max(500, "Must be exactly 500 characters"),
      street: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .required("Required")
        .max(500, "Must be exactly 500 characters"),
      state: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .required("Required"),
      city: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .required("Required"),
      country: Yup.string().required("Required"),
      email: Yup.string()
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
      members: Yup.array().of(
        Yup.object().shape({
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
          email: Yup.string()
            .matches(emailValidationRegex, "Invalid email address")
            .required("Required"),

          status: Yup.boolean().required("Required"),
        })
      ),
    }),

  
    onSubmit: async (values) => {
      setLoading1(true);
      console.log(values, '-----------------values');
      const isEmailValid = !formik.errors.email;
      if (formik.values.members.length > 0) {
        console.log(formik.values.members.length);
        let emailValues = [];
        for (let i = 0; i < formik.values.members.length; i++) {
          const result = await checkDealerEmailAndSetError(
            formik.values.members[i].email,
            formik,
            `members[${i}].email`
          );
          emailValues.push(result);
        }

        // console.log(emailValues);
        if (emailValues.some((value) => value === false)) {
          setLoading(false);
          return;
        }
      }
      const newObject = {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        isPrimary: true,
        position: values.position,
        status: formik.values.status,
      };
      values.isServicer = createServicerAccountOption;

      const newValues = {
        ...values,
        members: [newObject, ...values.members],
      };
      console.log(newValues);
      const result = await addNewResellerForDealer(newValues);
      console.log(result.message);
      if (result.code == 200) {
        setMessage("Reseller Created Successfully");
        setLoading1(false);
        setIsModalOpen(true);
        setTimer(3);
      } else if (
        result.message == "Reseller already exist with this account name"
      ) {
        setLoading1(false);
        formik.setFieldError("accountName", "Name Already Used");
        setMessage("Some Errors Please Check Form Validations ");
        setIsModalOpen(true);
      } else if (result.message == "Primary user email already exist") {
        setLoading1(false);
        formik.setFieldError("email", "Email Already Used");
        setMessage("Some Errors Please Check Form Validations ");
        setIsModalOpen(true);
      } else {
        setLoading1(false);
        setIsModalOpen(true);
        setMessage(result.message);
      }
    },
  });
  console.log(formik.errors);
  const handleLinkClick = () => {
    if (dealerValueId !== undefined) {
      navigate(`/dealer/dealerDetails/${dealerValueId}`);
    } else {
      navigate("/dealer/resellerList");
    }
  };
  const getDealerListData = async () => {
    // if (dealerValueId !== undefined) {
    //   formik.setFieldValue("dealerName", dealerValueId);
    // }
    const result = await getDealersList();
    console.log(result.data);
    let arr = [];
    const filteredDealers = result?.data?.filter(
      (data) => data.dealerData.accountStatus === true
    );
    filteredDealers?.map((res) => {
      console.log(res.name);
      arr.push({
        label: res.dealerData.name,
        value: res.dealerData._id,
      });
    });
    setDealerList(arr);
  };
  return (
    <div className="mb-8 ml-3">
      {loading && (
        <div className=" h-[400px] w-full flex py-5">
          <div className="self-center mx-auto">
            <RotateLoader color="#333" />
          </div>
        </div>
      )}
       
      <Headbar />
      <div className="flex mt-2">
        <div
          onClick={handleLinkClick}
          className="h-[60px] w-[60px] flex border-[1px] bg-white border-[#D1D1D1] rounded-[25px]"
        >
          <img
            src={BackImage}
            className="m-auto my-auto self-center bg-white"
            alt="BackImage"
          />
        </div>
        <div className="pl-3">
          <p className="font-bold text-[36px] leading-9 mb-[3px]">
            Add Reseller
          </p>
          <ul className="flex self-center">
            <li className="text-sm text-neutral-grey font-Regular">
              <Link to={"/dealer/resellerList"}>Reseller </Link> /{" "}
            </li>
            <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
              {" "}
              Add Reseller{" "}
            </li>
          </ul>
        </div>
      </div>
      {loading1 ? (
        <div className=" h-[400px] w-full flex py-5">
          <div className="self-center mx-auto">
            <RotateLoader color="#333" />
          </div>
        </div>
      ) : (<>
        {/* Form Start */}
        <form className="mt-8" onSubmit={formik.handleSubmit}>
        {/* <Grid>
          <div className="col-span-4 mb-3">
            <Select
              label="Dealer Name"
              name="dealerName"
              placeholder=""
              // className="!bg-white"
              required={true}
              onChange={handleSelectChange}
              disabled={dealerValueId != undefined ? true : false}
              options={dealerList}
              value={formik.values.dealerName}
              onBlur={formik.handleBlur}
              error={formik.touched.dealerName && formik.errors.dealerName}
            />
            {formik.touched.dealerName && formik.errors.dealerName && (
              <div className="text-red-500 text-sm pl-2 pt-2">
                {formik.errors.dealerName}
              </div>
            )}
          </div>
        </Grid> */}
        <div className="bg-white p-4 drop-shadow-4xl border-[1px] border-[#D1D1D1] rounded-xl">
          <Grid>
            <div className="col-span-4 border-e-[1px] border-[#D1D1D1] pr-3">
              <p className="text-light-black text-lg font-bold">
                Create Account
              </p>
              <Grid>
                <div className="col-span-12 mt-4">
                  <div className="col-span-12 mt-4">
                    <Input
                      type="text"
                      name="accountName"
                      className="!bg-white"
                      label="Reseller Account Name"
                      required={true}
                      placeholder=""
                      maxLength={"500"}
                      value={formik.values.accountName}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.accountName && formik.errors.accountName
                      }
                    />
                    {formik.touched.accountName &&
                      formik.errors.accountName && (
                        <div className="text-red-500 text-sm pl-2 pt-2">
                          {formik.errors.accountName}
                        </div>
                      )}
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="flex">
                    <p className="text-neutral-grey">Address</p>
                    <hr className="self-center ml-3 border-[#D1D1D1] w-full" />
                  </div>
                </div>
                <div className="col-span-12">
                  <Input
                    type="text"
                    name="street"
                    label="Reseller Street Address"
                    className="!bg-white"
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
                <div className="col-span-12">
                  <Input
                    type="text"
                    name="city"
                    label="Reseller City"
                    className="!bg-white"
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
                <div className="col-span-12">
                  <Select
                    label="Reseller State"
                    name="state"
                    placeholder=""
                    className="!bg-white"
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
                <div className="col-span-12">
                  <Input
                    type="number"
                    name="zip"
                    label="Reseller Zipcode"
                    className="!bg-white"
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
              </Grid>
            </div>
            <div className="col-span-8">
              <p className="text-light-black text-lg font-bold mb-4">
                Contact Information
              </p>

              <Grid>
                <div className="col-span-6">
                  <div className="col-span-6">
                    <Input
                      type="text"
                      name="firstName"
                      label="First Name"
                      required={true}
                      placeholder=""
                      className="!bg-white"
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
                </div>
                <div className="col-span-6">
                  <Input
                    type="text"
                    name="lastName"
                    label="Last Name"
                    className="!bg-white"
                    required={true}
                    placeholder=""
                    maxLength={"30"}
                    value={formik.values.lastName}
                    onBlur={formik.handleBlur}
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
                  <div className="col-span-6">
                    <Input
                      type="text"
                      name="email"
                      label="Email"
                      placeholder=""
                      className="!bg-white"
                      required={true}
                      value={formik.values.email}
                      onBlur={formik.handleBlu}
                      onChange={formik.handleChange}
                      error={
                        (formik.touched.email && formik.errors.email) ||
                        (formik.touched.email &&
                          !isEmailAvailable &&
                          "Email is already in use")
                      }
                    />
                    {formik.touched.email && (
                      <div className="text-red-500 text-sm pl-2 pt-2">
                        {isEmailAvailable
                          ? formik.errors.email
                          : "Email is already in use"}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-span-6">
                  <Input
                    type="tel"
                    name="phoneNumber"
                    label="Phone"
                    required={true}
                    className="!bg-white"
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
                <div className="col-span-6">
                  <Input
                    type="text"
                    name="position"
                    label="Position"
                    className="!bg-white"
                    placeholder=""
                    maxLength={"50"}
                    value={formik.values.position}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    error={formik.touched.position && formik.errors.position}
                  />
                </div>
                <div className="col-span-6 self-center">
                  <p className="text-light-black flex text-[13px]  font-semibold self-center">
                    {" "}
                    Do you want to create an account?
                    <RadioButton
                      id="yes"
                      label="Yes"
                      value="yes"
                      checked={createAccountOption === "yes"}
                      onChange={handleRadioChange}
                    />
                    <RadioButton
                      id="no"
                      label="No"
                      value="no"
                      checked={createAccountOption === "no"}
                      onChange={handleRadioChange}
                    />
                  </p>
                </div>
                <div className="col-span-12 self-center mt-5">
                  <p className="text-light-black flex text-[12px]  font-semibold self-center">
                    {" "}
                    Do you want work as a servicer ?
                    <RadioButton
                      id="yes"
                      label="Yes"
                      value={true}
                      checked={createServicerAccountOption === true}
                      onChange={handleServiceChange}
                    />
                    <RadioButton
                      id="no"
                      label="No"
                      value={false}
                      checked={createServicerAccountOption === false}
                      onChange={handleServiceChange}
                    />
                  </p>
                </div>
              </Grid>

              <div className="mt-24">
                <Grid>
                  <div className="col-span-4 self-center">
                    <Button
                      className="text-sm !font-light w-full"
                      type="button"
                      onClick={handleAddTeamMember}
                    >
                      + Add More Team Members
                    </Button>
                  </div>
                  <div className="col-span-8 self-center">
                    <hr />
                  </div>
                </Grid>
              </div>
            </div>
          </Grid>
        </div>

        {formik.values.members.map((dealer, index) => (
          <div className="bg-white p-8 relative drop-shadow-4xl mt-8 rounded-xl">
            <p className="text-light-black text-lg mb-6 font-semibold">
              Add Team Members
            </p>
            <div className="">
              <Grid className="">
                <div className="col-span-11">
                  <Grid className="pr-12 pl-4">
                    <div className="col-span-4">
                      <Input
                        type="text"
                        name={`members[${index}].firstName`}
                        label="First Name"
                        required={true}
                        className="!bg-white"
                        placeholder=""
                        maxLength={"30"}
                        value={formik.values.members[index].firstName}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.members &&
                          formik.touched.members[index] &&
                          formik.errors.members &&
                          formik.errors.members[index] &&
                          formik.errors.members[index].firstName
                        }
                      />
                      {formik.touched.members &&
                        formik.touched.members[index] &&
                        formik.errors.members &&
                        formik.errors.members[index] &&
                        formik.errors.members[index].firstName && (
                          <div className="text-red-500 text-sm pl-2 pt-2">
                            {formik.errors.members[index].firstName}
                          </div>
                        )}
                    </div>

                    <div className="col-span-4">
                      <Input
                        type="text"
                        name={`members[${index}].lastName`}
                        className="!bg-white"
                        label="Last Name"
                        required={true}
                        placeholder=""
                        value={formik.values.members[index].lastName}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.members &&
                          formik.touched.members[index] &&
                          formik.errors.members &&
                          formik.errors.members[index] &&
                          formik.errors.members[index].lastName
                        }
                      />
                      {formik.touched.members &&
                        formik.touched.members[index] &&
                        formik.errors.members &&
                        formik.errors.members[index] &&
                        formik.errors.members[index].lastName && (
                          <div className="text-red-500 text-sm pl-2 pt-2">
                            {formik.errors.members[index].lastName}
                          </div>
                        )}
                    </div>
                    <div className="col-span-4">
                      <Input
                        type="text"
                        name={`members[${index}].email`}
                        label="Email"
                        placeholder=""
                        className="!bg-white"
                        required={true}
                        value={formik.values.members[index].email}
                        onBlur={async () => {
                          formik.handleBlur(`members[${index}].email`);
                        }}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.members &&
                          formik.touched.members[index] &&
                          formik.errors.members &&
                          formik.errors.members[index] &&
                          formik.errors.members[index].email
                        }
                      />
                      {formik.touched.members &&
                        formik.touched.members[index] &&
                        formik.errors.members &&
                        formik.errors.members[index] &&
                        formik.errors.members[index].email && (
                          <div className="text-red-500 text-sm pl-2 pt-2">
                            {formik.errors.members[index].email}
                          </div>
                        )}
                    </div>
                    <div className="col-span-4">
                      <Input
                        type="tel"
                        name={`members[${index}].phoneNumber`}
                        className="!bg-white"
                        label="Phone"
                        required={true}
                        placeholder=""
                        value={formik.values.members[index].phoneNumber}
                        onChange={(e) => {
                          const sanitizedValue = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                          console.log(sanitizedValue);
                          formik.handleChange({
                            target: {
                              name: `members[${index}].phoneNumber`,
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
                          formik.touched.members &&
                          formik.touched.members[index] &&
                          formik.errors.members &&
                          formik.errors.members[index] &&
                          formik.errors.members[index].phoneNumber
                        }
                      />
                      {formik.touched.members &&
                        formik.touched.members[index] &&
                        formik.errors.members &&
                        formik.errors.members[index] &&
                        formik.errors.members[index].phoneNumber && (
                          <div className="text-red-500 text-sm pl-2 pt-2">
                            {formik.errors.members[index].phoneNumber}
                          </div>
                        )}
                    </div>
                    <div className="col-span-4">
                      <Input
                        type="text"
                        name={`members[${index}].position`}
                        className="!bg-white"
                        label="Position"
                        placeholder=""
                        value={formik.values.members[index].position}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                      />
                    </div>
                    <div className="col-span-4">
                      <p className="text-light-black flex text-[12px] font-semibold mt-3 mb-6">
                        {" "}
                        Do you want to create an account?
                        <RadioButton
                          id={`yes-${index}`}
                          label="Yes"
                          value="yes"
                          disabled={createAccountOption === "no"}
                          checked={
                            formik.values.members &&
                            formik.values.members[index] &&
                            formik.values.members[index].status === true
                          }
                          onChange={() =>
                            handleRadioChangeDealers("yes", index)
                          }
                        />
                        <RadioButton
                          id={`no-${index}`}
                          label="No"
                          value="no"
                          disabled={createAccountOption === "no"}
                          checked={
                            formik.values.members &&
                            formik.values.members[index] &&
                            formik.values.members[index].status === false
                          }
                          onChange={() => handleRadioChangeDealers("no", index)}
                        />
                      </p>
                    </div>
                  </Grid>
                </div>
                <div
                  className="col-span-1"
                  onClick={() => {
                    handleDeleteMembers(index);
                  }}
                >
                  <div className="flex mx-3 h-full bg-[#EBEBEB] justify-center">
                    <img
                      src={DeleteImage}
                      className="self-center cursor-pointer"
                      alt="Delete Icon"
                    />
                  </div>
                </div>
              </Grid>
            </div>
          </div>
        ))}

        <Button type="submit" className="mt-8">
          Submit
        </Button>
      </form>

      </>)}
    
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {message === "Reseller Created Successfully" ? (
          <></>
        ) : (
          <>
            <Button
              onClick={closeModal}
              className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]"
            >
              <img
                src={Cross}
                className="w-full h-full text-black rounded-full p-0"
              />
            </Button>{" "}
          </>
        )}
        <div className="text-center py-3">
          {message === "Reseller Created Successfully" ? (
            <>
              <img src={AddDealer} alt="email Image" className="mx-auto" />
              <p className="text-3xl mb-0 mt-4 font-semibold text-neutral-grey">
                Submitted
                <span className="text-light-black"> Successfully </span>
              </p>
              <p className="text-neutral-grey text-base font-medium mt-2">
                {message}
              </p>
              <p className="text-neutral-grey text-base font-medium mt-2">
                Redirecting you on Reseller Page {timer} seconds.
              </p>
            </>
          ) : (
            <>
              <img src={disapprove} alt="email Image" className="mx-auto" />
              <p className="text-3xl mb-0 mt-4 font-semibold text-neutral-grey">
                Error
              </p>
              <p className="text-neutral-grey text-base font-medium mt-2">
                {message}
              </p>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default DealerAddReseller;
