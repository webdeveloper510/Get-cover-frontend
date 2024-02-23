import React, { useEffect, useState } from "react";
import Headbar from "../../../common/headBar";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "../../../common/select";
import Grid from "../../../common/grid";
import Input from "../../../common/input";

// Media Include
import BackImage from "../../../assets/images/icons/backArrow.svg";
import DeleteImage from "../../../assets/images/icons/Delete.svg";
import Button from "../../../common/button";
import RadioButton from "../../../common/radio";
import { cityData } from "../../../stateCityJson";
import { useFormik } from "formik";
import * as Yup from "yup";
import { checkDealersEmailValidation } from "../../../services/dealerServices";
import {
  addNewServicer,
  approveServicer,
  getServicerDetailsByid,
} from "../../../services/servicerServices";
import AddDealer from "../../../assets/images/dealer-book.svg";
import disapprove from "../../../assets/images/Disapproved.png";
import Modal from "../../../common/model";
import Cross from "../../../assets/images/Cross.png";

function ResellerAddServicer() {
  const [selectedCity, setSelectedCity] = useState("");
  const [createAccountOption, setCreateAccountOption] = useState("yes");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(3);
  const [isEmailAvailable, setIsEmailAvailable] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const id = useParams();
  const navigate = useNavigate();
  const [initialFormValues, setInitialFormValues] = useState({
    accountName: "",
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
    flag: "create",
  });
  const closeModal = () => {
    setIsModalOpen(false);
    console.log(message);
    if (message === "Servicer Created Successfully") {
      navigate("/servicerList");
    }
  };
  useEffect(() => {
    setLoading(true);
    let intervalId;
    if (isModalOpen && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0 && message === "Servicer Created Successfully") {
      console.log("here");
      closeModal();
    }

    setLoading(false);
    return () => {
      clearInterval(intervalId);
    };
  }, [isModalOpen, timer, message]);

  useEffect(() => {
    if (id === undefined || (id.id !== undefined && id.id === "")) {
      setInitialFormValues({
        oldName: "",
        oldEmail: "",
        accountName: "",
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
        flag: "create",
      });
    }
    if (id && id.id !== undefined && id.id !== "") {
      getServicerDetailsByid(id).then((res) => {
        console.log(res.message);
        if (res?.message) {
          setCreateAccountOption(
            res?.message?.meta?.status === true ? "yes" : "no"
          );
          setInitialFormValues({
            accountName: res.message.meta.name,
            oldName: res.message.meta.name,
            oldEmail: res?.message?.email,
            status: res.message.meta.status,
            street: res?.message?.meta.street,
            city: res?.message?.meta.city,
            zip: res?.message?.meta.zip,
            state: res?.message?.meta?.state,
            country: "USA",
            lastName: res?.message?.lastName,
            firstName: res?.message?.firstName,
            email: res?.message?.email,
            phoneNumber: res?.message?.phoneNumber,
            position: res?.message?.position,
            members: [],
            flag: "approve",
            providerId: id.id,
          });
        }
      });
    }
  }, [id]);

  const handleRadioChangeDealers = (value, index) => {
    const updatedMembers = [...formik.values.members];
    updatedMembers[index].status = value === "yes" ? true : false;
    formik.setFieldValue("members", updatedMembers);
  };

  const handleSelectChange = async (name, value) => {
    formik.setFieldValue(name, value);
  };

  const handleRadioChange = (event) => {
    const selectedValue = event.target.value;
    setCreateAccountOption(selectedValue);

    if (selectedValue === "no") {
      const updateServicer = formik.values.members.map((service) => ({
        ...service,
        status: false,
      }));

      formik.setFieldValue("members", updateServicer);
      formik.setFieldValue("status", false);
    } else {
      formik.setFieldValue("status", true);
    }
  };
  const state = cityData;

  const handleAddTeamMember = () => {
    const members = {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      position: "",
      status: true,
      isPrimary: false,
    };

    formik.setFieldValue("members", [...formik.values.members, members]);
  };
  const handleDeleteMembers = (index) => {
    const updatedMembers = [...formik.values.members];
    updatedMembers.splice(index, 1);
    formik.setFieldValue("members", updatedMembers);
  };

  const emailValidationRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const checkDealerEmailAndSetError = async (email, formik, fieldPath) => {
    if (emailValidationRegex.test(email)) {
      try {
        const result = await checkDealersEmailValidation(email);
        console.log(result);
        if (result.code === 200) {
          formik.setFieldError(fieldPath, "");
          return true;
        } else if (result.code === 401) {
          formik.setFieldError(fieldPath, "Email is already in use");
          setMessage("Some Errors Please Check Form Validations ");
          setIsModalOpen(true);
          return false;
        }
      } catch (error) {
        console.error("Error checking Servicer email availability:", error);
      }
    } else {
      formik.setFieldError(fieldPath, "Invalid email address");
    }
    return false;
  };
  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      accountName: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .required("Required")
        .max(500, "Must be exactly 50 characters"),
      street: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .required("Required")
        .max(50, "Must be exactly 50 characters"),
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

      const newValues = {
        ...values,
        members: [newObject, ...values.members],
      };
      console.log(id.isValid);
      const result = id.isValid
        ? await approveServicer(id.id, newValues)
        : await addNewServicer(newValues);
      // const result = await addNewServicer(newValues);
      console.log(result);
      if (result.code === 200) {
        setMessage("Servicer Created Successfully");
        setIsModalOpen(true);
        setLoading(false);
        setTimer(3);
        // navigate("/servicerList");
      } else if (result.message == "User already exist with this email ") {
        setIsModalOpen(true);
        setMessage(result.message);
        formik.setFieldError("email", "Email Already Used");
      } else if (
        result.message == "Servicer already exist with this account name"
      ) {
        setLoading(false);
        formik.setFieldError("accountName", "Name Already Used");
        setMessage("Some Errors Please Check Form Validations ");
        setIsModalOpen(true);
      } else {
        setIsModalOpen(true);
        setLoading(false);

        // setMessage(result.message);
      }
    },
  });
  const handleGOBack = () => {
    navigate(-1);
  };
  return (
    <div className="my-8 ml-3">
      <Headbar />
      <div className="flex mt-2">
        <Link
          onClick={handleGOBack}
          className="h-[60px] w-[60px] flex border-[1px] bg-white border-[#D1D1D1] rounded-[25px]"
        >
          <img
            src={BackImage}
            className="m-auto my-auto self-center bg-white"
            alt="BackImage"
          />
        </Link>
        <div className="pl-3">
          <p className="font-bold text-[36px] leading-9 mb-[3px]">
            Add Servicer
          </p>
          <ul className="flex self-center">
            <li className="text-sm text-neutral-grey font-Regular">
              <Link to={"/"}>Servicer </Link> /{" "}
            </li>
            <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
              {" "}
              Add Servicer{" "}
            </li>
          </ul>
        </div>
      </div>

      <form className="mt-8" onSubmit={formik.handleSubmit}>
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
                      label="Servicer Account Name"
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
                    label="Servicer Street Address"
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
                    label="Servicer City"
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
                    label="Servicer State"
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
                    label="Servicer Zipcode"
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
                      onBlur={formik.handleBlur}
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
                    value={formik.values.phoneNumber}
                    className="!bg-white"
                    placeholder=""
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
              </Grid>

              <div className="mt-32">
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
              Add Servicer's Team Members
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
                          disabled={formik.values.status === false}
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
                          disabled={formik.values.status === false}
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
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {message === "Servicer Created Successfully" ? (
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
          {message === "Servicer Created Successfully" ? (
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
                Redirecting you on Dealer Page {timer} seconds.
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

export default ResellerAddServicer;
