import React, { useEffect, useState } from "react";
import Headbar from "../../../common/headBar";
import { Link, useParams } from "react-router-dom";
import Select from "../../../common/select";
import Grid from "../../../common/grid";
import Input from "../../../common/input";
import { useFormik } from "formik";
import * as Yup from "yup";

// Media Include
import DeleteImage from "../../../assets/images/icons/Delete.svg";
import Button from "../../../common/button";
import RadioButton from "../../../common/radio";
import FileDropdown from "../../../common/fileDropbox";
import { cityData } from "../../../stateCityJson";
import {
  checkDealersEmailValidation,
  getDealersDetailsByid,
  getProductListbyProductCategoryId,
  getTermList,
} from "../../../services/dealerServices";
import { getCategoryListActiveData } from "../../../services/priceBookService";

function Dealer() {
  const [productNameOptions, setProductNameOptions] = useState([]);
  const [category, setCategoryList] = useState([]);
  const [termList, setTermList] = useState([]);
  const [createAccountOption, setCreateAccountOption] = useState("yes");
  const [separateAccountOption, setSeparateAccountOption] = useState("yes");
  const [selectedOption, setSelectedOption] = useState("yes");
  const [isEmailAvailable, setIsEmailAvailable] = useState(true);
  const [initialFormValues, setInitialFormValues] = useState({
    name: "",
    flag: "approved",
    street: "",
    zip: "",
    state: "",
    country: "USA",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    city: "",
    position: "",
    createdBy: "Super admin",
    dealers: [],
    priceBook: [
      {
        priceBookId: "",
        categoryId: "",
        wholesalePrice: "",
        terms: "",
        description: "",
        retailPrice: "",
        status: "",
      },
    ],
    isAccountCreate: false,
    customerAccountCreated: false,
  });

  const { id } = useParams();
  const status = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];

  const handleAddPriceBook = () => {
    const priceBook = {
      priceBookId: "",
      categoryId: "",
      wholesalePrice: "",
      terms: "",
      description: "",
      retailPrice: "",
      status: "",
    };

    formik.setFieldValue("priceBook", [...formik.values.priceBook, priceBook]);
  };
  const handleDeletePriceBook = (index) => {
    const updatedPriceBook = [...formik.values.priceBook];
    updatedPriceBook.splice(index, 1);
    formik.setFieldValue("priceBook", updatedPriceBook);
  };

  useEffect(() => {
    getTermListData();
    getProductList("");
    if (id != "null") {
      getDealersDetailsByid(id).then((res) => {
        // setGetUserDetails(res.result[0]);
        // console.log();
        setInitialFormValues({
          name: res.result[0].dealerData.name,
          flag: "approved",
          street: res.result[0].dealerData.street,
          zip: res.result[0].dealerData.zip,
          state: res.result[0].dealerData.state,
          country: "USA",
          email: res.result[0].email,
          firstName: res.result[0].firstName,
          lastName: res.result[0].lastName,
          phoneNumber: res.result[0].phoneNumber,
          city: res.result[0].dealerData.city,
          position: res.result[0].position,
          createdBy: "Super admin",
          dealers: [],
          priceBook: [
            {
              priceBookId: "",
              categoryId: "",
              wholesalePrice: "",
              terms: "",
              description: "",
              retailPrice: "",
              status: "",
            },
          ],
          isAccountCreate: false,
          customerAccountCreated: false,
        });
      });
    }
  }, []);

  const getTermListData = async () => {
    try {
      const res = await getTermList();
      console.log(res.result.terms);
      setTermList(
        res.result.terms.map((item) => ({
          label: item.terms + " Months",
          value: item.terms,
        }))
      );
    } catch (error) {
      console.error("Error fetching category list:", error);
    }
  };
  const getProductList = async () => {
    const result = await getCategoryListActiveData();
    console.log(result.result);
    setCategoryList(
      result.result.map((item) => ({
        label: item.name,
        value: item._id,
      }))
    );
  };

  const handleRadioChange = (event) => {
    const selectedValue = event.target.value;
    setCreateAccountOption(selectedValue);

    if (selectedValue === "no") {
      setSeparateAccountOption("no");

      const updatedDealers = formik.values.dealers.map((dealer) => ({
        ...dealer,
        status: false,
      }));

      formik.setFieldValue("dealers", updatedDealers);
      formik.setFieldValue("isAccountCreate", false);
      formik.setFieldValue("customerAccountCreated", false);
    }
  };

  const handleSeparateAccountRadioChange = (event) => {
    setSeparateAccountOption(event.target.value);
  };
  const handleRadioChangeforBulk = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleRadioChangeDealers = (value, index) => {
    const updatedDealers = [...formik.values.dealers];
    updatedDealers[index].status = value === "yes";
    formik.setFieldValue("dealers", updatedDealers);
  };
  const handleSelectChange = async (name, selectedValue) => {
    if (name.includes("categoryId")) {
      const match = name.match(/\[(\d+)\]/);
      console.log(match[1]);
      formik.setFieldValue(`priceBook[${match[1]}].priceBookId`, "");
      if (match) {
        const response = await getProductListbyProductCategoryId(selectedValue);
        // console.log(`priceBook[${index].description`);
        setProductNameOptions((prevOptions) => {
          const newOptions = [...prevOptions];
          newOptions[match[1]] = {
            data: response.result.priceBooks.map((item) => ({
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
            })),
          };
          return newOptions;
        });
      }
    }
    if (name.includes("priceBookId")) {
      const match = name.match(/\[(\d+)\]/);
      const data = productNameOptions[match[1]].data.find((value) => {
        return value.value === selectedValue;
      });
      formik.setFieldValue(
        `priceBook[${match[1]}].description`,
        data.description
      );
      formik.setFieldValue(
        `priceBook[${match[1]}].wholesalePrice`,
        data.wholesalePrice.toFixed(2)
      );
      formik.setFieldValue(`priceBook[${match[1]}].status`, data.status);
      formik.setFieldValue(`priceBook[${match[1]}].terms`, data.term);
      console.log(match[1], data);
    }

    console.log(name);
    formik.setFieldValue(name, selectedValue);
  };
  const emailValidationRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Required")
        .max(50, "Must be exactly 50 characters"),
      street: Yup.string()
        .required("Required")
        .max(50, "Must be exactly 50 characters"),
      state: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
      country: Yup.string().required("Required"),
      email: Yup.string()
        .matches(emailValidationRegex, "Invalid email address")
        .required("Required"),
      // .test(
      //   "email-availability",
      //   "Email is already in use",
      //   async (value) => {
      //     const response = await checkDealersEmailValidation(value);
      //     console.log(response.status);
      //     const isEmailAvailable = response.status === 200;
      //     setIsEmailAvailable(isEmailAvailable);
      //     return isEmailAvailable;
      //   }
      // ),

      zip: Yup.string()
        .required("Required")
        .min(5, "Must be at least 5 characters")
        .max(6, "Must be exactly 6 characters"),
      firstName: Yup.string()
        .required("Required")
        .max(30, "Must be exactly 30 characters"),
      lastName: Yup.string()
        .required("Required")
        .max(30, "Must be exactly 30 characters"),
      phoneNumber: Yup.string()
        .required("Required")
        .min(10, "Must be at least 10 characters")
        .max(10, "Must be exactly 10 characters")
        .matches(/^[0-9]+$/, "Must contain only digits"),
      dealers: Yup.array().when("dealers", {
        is: (dealers) => dealers && dealers.length > 0,
        then: Yup.array().of(
          Yup.object().shape({
            firstName: Yup.string()
              .required("Required")
              .max(30, "Must be exactly 30 characters"),
            lastName: Yup.string()
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
      priceBook: Yup.array().of(
        Yup.object().shape({
          priceBookId: Yup.string().required("Required"),
          categoryId: Yup.string().required("Required"),
          retailPrice: Yup.string().required("Required"),
          status: Yup.boolean().required("Required"),
        })
      ),
    }),
    onSubmit: (values) => {
      console.log("Form submitted with values:", values);
      values.isAccountCreate = createAccountOption === "yes";
      values.customerAccountCreated = separateAccountOption === "yes";
      console.log("Form submitted with values:", values);
    },
  });

  const handleAddTeamMember = () => {
    const dealers = {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      position: "",
      status: false,
      isPrimary: false,
    };

    formik.setFieldValue("dealers", [...formik.values.dealers, dealers]);
  };
  const handleDeleteDealers = (index) => {
    const updatedDealers = [...formik.values.dealers];
    updatedDealers.splice(index, 1);
    formik.setFieldValue("dealers", updatedDealers);
  };

  const checkEmailAvailability = async (email) => {
    console.log(emailValidationRegex.test(email));
    if (emailValidationRegex.test(email) != false) {
      const result = await checkDealersEmailValidation(email);
      console.log(result);
      setIsEmailAvailable(false);
    }
  };
  const state = cityData;
  return (
    <div className="my-8 ml-3">
      <Headbar />
      <div className="flex mt-2">
        {/* <div className='p-5 border-2 border-[#D1D1D1] rounded-xl'>
          <img src={BackImage} alt='BackImage'/>
        </div> */}
        <div className="pl-3">
          <p className="font-semibold text-[36px] leading-9 mb-[3px]">Dealer</p>
          <ul className="flex self-center">
            <li className="text-sm text-neutral-grey font-Regular">
              <Link to={"/"}>Dealer </Link> /{" "}
            </li>
            <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
              {" "}
              Add New Dealer{" "}
            </li>
          </ul>
        </div>
      </div>

      {/* Form Start */}

      <form className="mt-8" onSubmit={formik.handleSubmit}>
        <div className="bg-white p-8 drop-shadow-4xl rounded-xl">
          <Grid>
            <div className="col-span-4 border-e-[1px] border-[#D1D1D1] pr-3">
              <p className="text-light-black text-lg mb-3 font-semibold">
                Create Dealer Account
              </p>
              <Grid>
                <div className="col-span-12 mt-4">
                  <Input
                    type="text"
                    name="name"
                    className="!bg-white"
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
                <div className="col-span-12">
                  <div className="flex">
                    <p className="text-neutral-grey">ADDRESS</p>
                    <hr className="self-center ml-3 border-[#D1D1D1] w-full" />
                  </div>
                </div>
                <div className="col-span-12">
                  <Input
                    type="text"
                    name="street"
                    label="Business Street Address"
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
                    label="Business City"
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
                    label="Business State"
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
                    label="Business Zipcode"
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
              <p className="text-light-black text-lg mb-3 font-semibold">
                Dealer Contact Information
              </p>

              <Grid className="mt-5">
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
                    error={formik.touched.firstName && formik.errors.firstName}
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
                    type="number"
                    name="phoneNumber"
                    label="Phone"
                    required={true}
                    className="!bg-white"
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
                <div className="col-span-6">
                  <p className="text-light-black flex text-[12px] font-semibold mt-3 mb-6">
                    Do you want to create an account?
                    <RadioButton
                      id="yes-create-account"
                      label="Yes"
                      value="yes"
                      checked={createAccountOption === "yes"}
                      onChange={handleRadioChange}
                    />
                    <RadioButton
                      id="no-create-account"
                      label="No"
                      value="no"
                      checked={createAccountOption === "no"}
                      onChange={handleRadioChange}
                    />
                  </p>
                </div>
                <div className="col-span-12 mt-3">
                  <p className="text-light-black flex text-[12px] font-semibold mt-3 mb-6">
                    Does this Dealer's Customer will have a separate account?
                    <RadioButton
                      id="yes-separate-account"
                      label="Yes"
                      value="yes"
                      checked={separateAccountOption === "yes"}
                      disabled={createAccountOption === "no"}
                      onChange={handleSeparateAccountRadioChange}
                    />
                    <RadioButton
                      id="no-separate-account"
                      label="No"
                      value="no"
                      checked={separateAccountOption === "no"}
                      onChange={handleSeparateAccountRadioChange}
                    />
                  </p>
                </div>
              </Grid>

              <div className="mt-14">
                <Grid>
                  <div className="col-span-4">
                    <Button
                      type="button"
                      className="text-sm !font-light w-full"
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

        {formik.values.dealers.map((dealer, index) => (
          <div
            key={index}
            className="bg-white p-8 relative drop-shadow-4xl mt-8 rounded-xl"
          >
            <p className="text-light-black text-lg mb-6 font-semibold">
              Add Dealer’s Team Members
            </p>
            <div className="">
              <Grid className="">
                <div className="col-span-11">
                  <Grid className="pr-12 pl-4">
                    <div className="col-span-4">
                      <Input
                        type="text"
                        name={`dealers[${index}].firstName`}
                        label="First Name"
                        required={true}
                        className="!bg-white"
                        placeholder=""
                        maxLength={"30"}
                        value={formik.values.dealers[index].firstName}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.dealers &&
                          formik.touched.dealers[index] &&
                          formik.errors.dealers &&
                          formik.errors.dealers[index] &&
                          formik.errors.dealers[index].firstName
                        }
                      />
                      {formik.touched.dealers &&
                        formik.touched.dealers[index] &&
                        formik.errors.dealers &&
                        formik.errors.dealers[index] &&
                        formik.errors.dealers[index].firstName && (
                          <div className="text-red-500 text-sm pl-2 pt-2">
                            {formik.errors.dealers[index].firstName}
                          </div>
                        )}
                    </div>

                    <div className="col-span-4">
                      <Input
                        type="text"
                        name={`dealers[${index}].lastName`}
                        className="!bg-white"
                        label="Last Name"
                        required={true}
                        placeholder=""
                        value={formik.values.dealers[index].lastName}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.dealers &&
                          formik.touched.dealers[index] &&
                          formik.errors.dealers &&
                          formik.errors.dealers[index] &&
                          formik.errors.dealers[index].lastName
                        }
                      />
                      {formik.touched.dealers &&
                        formik.touched.dealers[index] &&
                        formik.errors.dealers &&
                        formik.errors.dealers[index] &&
                        formik.errors.dealers[index].lastName && (
                          <div className="text-red-500 text-sm pl-2 pt-2">
                            {formik.errors.dealers[index].lastName}
                          </div>
                        )}
                    </div>
                    <div className="col-span-4">
                      <Input
                        type="text"
                        name={`dealers[${index}].email`}
                        label="Email"
                        placeholder=""
                        className="!bg-white"
                        required={true}
                        value={formik.values.dealers[index].email}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.dealers &&
                          formik.touched.dealers[index] &&
                          formik.errors.dealers &&
                          formik.errors.dealers[index] &&
                          formik.errors.dealers[index].email
                        }
                      />
                      {formik.touched.dealers &&
                        formik.touched.dealers[index] &&
                        formik.errors.dealers &&
                        formik.errors.dealers[index] &&
                        formik.errors.dealers[index].email && (
                          <div className="text-red-500 text-sm pl-2 pt-2">
                            {formik.errors.dealers[index].email}
                          </div>
                        )}
                    </div>
                    <div className="col-span-4">
                      <Input
                        type="text"
                        name={`dealers[${index}].phoneNumber`}
                        className="!bg-white"
                        label="Phone"
                        required={true}
                        placeholder=""
                        value={formik.values.dealers[index].phoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        onWheelCapture={(e) => {
                          e.preventDefault();
                        }}
                        minLength={"10"}
                        maxLength={"10"}
                        error={
                          formik.touched.dealers &&
                          formik.touched.dealers[index] &&
                          formik.errors.dealers &&
                          formik.errors.dealers[index] &&
                          formik.errors.dealers[index].phoneNumber
                        }
                      />
                      {formik.touched.dealers &&
                        formik.touched.dealers[index] &&
                        formik.errors.dealers &&
                        formik.errors.dealers[index] &&
                        formik.errors.dealers[index].phoneNumber && (
                          <div className="text-red-500 text-sm pl-2 pt-2">
                            {formik.errors.dealers[index].phoneNumber}
                          </div>
                        )}
                    </div>
                    <div className="col-span-4">
                      <Input
                        type="text"
                        name={`dealers[${index}].position`}
                        className="!bg-white"
                        label="Position"
                        required={true}
                        placeholder=""
                        value={formik.values.dealers[index].position}
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
                            formik.values.dealers &&
                            formik.values.dealers[index] &&
                            formik.values.dealers[index].status === true
                          }
                          onChange={() =>
                            handleRadioChangeDealers("yes", index)
                          }
                        />
                        <RadioButton
                          id={`no-${index}`}
                          label="No"
                          value="no"
                          checked={
                            formik.values.dealers &&
                            formik.values.dealers[index] &&
                            formik.values.dealers[index].status === false
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
                    handleDeleteDealers(index);
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

        <div className="bg-[#fff] p-8 relative drop-shadow-4xl border-[1px] mt-8 border-[#D1D1D1] rounded-xl">
          <Grid>
            <div className="col-span-2">
              <p className="text-light-black text-lg mb-3 font-semibold">
                {selectedOption === "yes"
                  ? "Add  Price Book"
                  : "Upload Price Book"}{" "}
              </p>
            </div>
            <div className="col-span-6 self-center">
              <hr className="self-center ml-3 border-[#D1D1D1] w-full" />
            </div>
            <div className="col-span-4 flex justify-end">
              <RadioButton
                id="yes"
                label="Add Single Price Book"
                value="yes"
                checked={selectedOption === "yes"}
                onChange={handleRadioChangeforBulk}
              />
              <RadioButton
                id="no"
                label="Upload In Bulk"
                value="no"
                checked={selectedOption === "no"}
                onChange={handleRadioChangeforBulk}
              />
            </div>
          </Grid>

          {selectedOption === "yes" ? (
            <>
                  {formik.values.priceBook.map((dealer, index) => (
              <div className="bg-[#f9f9f9] p-4 relative mt-8 rounded-xl">
                <div className="bg-[#fff] rounded-[30px] absolute top-[-17px] right-[-12px] p-4">
                {index == 0 ? (<Button
                    className="text-sm !font-light"
                    onClick={handleAddPriceBook}
                  >
                    {" "}
                    + Add More{" "}
                  </Button>) : (
                        <div
                          className=""
                          onClick={() => {
                            handleDeletePriceBook(index);
                          }}
                        >
                          <div className="flex h-full mx-3  justify-center">
                            <img
                              src={DeleteImage}
                              className="self-center cursor-pointer"
                              alt="Delete Icon"
                            />
                          </div>
                        </div>
                      )}
                  
                </div>
                  <div className="bg-[#f9f9f9] p-4 relative mt-5 rounded-xl">
                    <Grid className="">
                      <div className="col-span-4">
                        <Select
                          name={`priceBook[${index}].categoryId`}
                          label="Product Category"
                          options={category}
                          required={true}
                          className="!bg-white"
                          placeholder=""
                          maxLength={"30"}
                          value={formik.values.priceBook[index].categoryId}
                          onBlur={formik.handleBlur}
                          onChange={handleSelectChange}
                          index={index}
                          error={
                            formik.touched.priceBook &&
                            formik.touched.priceBook[index] &&
                            formik.errors.priceBook &&
                            formik.errors.priceBook[index] &&
                            formik.errors.priceBook[index].categoryId
                          }
                        />
                        {formik.touched.priceBook &&
                          formik.touched.priceBook[index] &&
                          formik.errors.priceBook &&
                          formik.errors.priceBook[index] &&
                          formik.errors.priceBook[index].categoryId && (
                            <div className="text-red-500 text-sm pl-2 pt-2">
                              {formik.errors.priceBook[index].categoryId}
                            </div>
                          )}
                      </div>

                      <div className="col-span-4">
                        <Select
                          name={`priceBook[${index}].priceBookId`}
                          label="Product Name"
                          options={productNameOptions[index]?.data}
                          required={true}
                          className="!bg-white"
                          placeholder=""
                          value={formik.values?.priceBook[index].priceBookId}
                          onBlur={formik.handleBlur}
                          onChange={handleSelectChange}
                          index={index}
                          error={
                            formik.touched.priceBook &&
                            formik.touched.priceBook[index] &&
                            formik.errors.priceBook &&
                            formik.errors.priceBook[index] &&
                            formik.errors.priceBook[index].priceBookId
                          }
                        />
                        {formik.touched.priceBook &&
                          formik.touched.priceBook[index] &&
                          formik.errors.priceBook &&
                          formik.errors.priceBook[index] &&
                          formik.errors.priceBook[index].priceBookId && (
                            <div className="text-red-500 text-sm pl-2 pt-2">
                              {formik.errors.priceBook[index].priceBookId}
                            </div>
                          )}
                      </div>

                      <div className="col-span-4">
                        <Input
                          type="text"
                          name={`priceBook[${index}].wholesalePrice`}
                          className="!bg-white"
                          label="Wholesale Price($)"
                          required={true}
                          placeholder=""
                          value={formik.values.priceBook[index].wholesalePrice}
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
                          name={`priceBook[${index}].description`}
                          className="!bg-white"
                          label="Description"
                          required={true}
                          placeholder=""
                          value={formik.values.priceBook[index].description}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          disabled={true}
                          onWheelCapture={(e) => {
                            e.preventDefault();
                          }}
                        />
                      </div>

                      <div className="col-span-2">
                        <Select
                          label="Terms"
                          name={`priceBook[${index}].terms`}
                          required={true}
                          placeholder=""
                          onChange={handleSelectChange}
                          className="!bg-[#f9f9f9]"
                          options={termList}
                          disabled={true}
                          value={formik.values.priceBook[index].terms}
                          onBlur={formik.handleBlur}
                          error={formik.touched.term && formik.errors.term}
                        />
                        {formik.touched.term && formik.errors.term && (
                          <div className="text-red-500 text-sm pl-2 pt-2">
                            {formik.errors.term}
                          </div>
                        )}
                      </div>
                      <div className="col-span-4">
                        <Input
                          type="number"
                          name={`priceBook[${index}].retailPrice`}
                          className="!bg-white"
                          label="Retail Price"
                          maxLength={"10"}
                          maxDecimalPlaces={2}
                          required={true}
                          placeholder=""
                          value={formik.values.priceBook[index].retailPrice}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          onWheelCapture={(e) => {
                            e.preventDefault();
                          }}
                          error={
                            formik.touched.priceBook &&
                            formik.touched.priceBook[index] &&
                            formik.errors.priceBook &&
                            formik.errors.priceBook[index] &&
                            formik.errors.priceBook[index].retailPrice
                          }
                        />
                        {formik.touched.priceBook &&
                          formik.touched.priceBook[index] &&
                          formik.errors.priceBook &&
                          formik.errors.priceBook[index] &&
                          formik.errors.priceBook[index].retailPrice && (
                            <div className="text-red-500 text-sm pl-2 pt-2">
                              {formik.errors.priceBook[index].retailPrice}
                            </div>
                          )}
                      </div>
                      <div className="col-span-2">
                        <Select
                          name={`priceBook[${index}].status`}
                          label="Status"
                          options={status}
                          required={true}
                          className="!bg-white"
                          value={formik.values.priceBook[index].status}
                          onBlur={formik.handleBlur}
                          onChange={handleSelectChange}
                          error={
                            formik.touched.priceBook &&
                            formik.touched.priceBook[index] &&
                            formik.errors.priceBook &&
                            formik.errors.priceBook[index] &&
                            formik.errors.priceBook[index].status
                          }
                        />
                        {formik.touched.priceBook &&
                          formik.touched.priceBook[index] &&
                          formik.errors.priceBook &&
                          formik.errors.priceBook[index] &&
                          formik.errors.priceBook[index].status && (
                            <div className="text-red-500 text-sm pl-2 pt-2">
                              {formik.errors.priceBook[index].status}
                            </div>
                          )}
                      </div>
                     
                    </Grid>
                  </div>
              </div>
                ))}
            </>
          ) : (
            <div className="bg-[#f9f9f9] p-4 relative drop-shadow-4xl border-[1px] mt-8 border-[#D1D1D1] rounded-xl">
              <p className="text-[#717275] text-lg mb-5 font-semibold">
                Upload In Bulk
              </p>
              <FileDropdown />
              <p className="text-[11px] mt-1 text-[#5D6E66] font-medium">
                Please click on file option and make a copy. Upload the list of
                Product Name and Price using our provided Google Sheets
                template, by <span className="underline">Clicking here </span>.
                The file must be saved with csv , xls and xlsx Format.
              </p>
            </div>
          )}
        </div>
        <Button type="submit" className="mt-4">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default Dealer;
