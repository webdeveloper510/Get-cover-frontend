import React, { useEffect, useState } from "react";
import Headbar from "../../../common/headBar";
import { Link, useNavigate, useParams } from "react-router-dom";
import Grid from "../../../common/grid";
import Button from "../../../common/button";

// Media Import
import BackImage from "../../../assets/images/icons/backArrow.svg";
import DealerIcons from "../../../assets/images/icons/DealerIcons.svg";
import DealerList from "../../../assets/images/icons/dealerList.svg";
import address from "../../../assets/images/Dealer/Address.svg";
import name from "../../../assets/images/Dealer/Name.svg";
import AddItem from "../../../assets/images/icons/addItem.svg";
import DealerActive from "../../../assets/images/icons/dealerDetails.svg";
import ClaimActive from "../../../assets/images/Dealer/Claim-active.svg";
import UserActive from "../../../assets/images/Dealer/User-active.svg";
import Dealer from "../../../assets/images/icons/dealer.svg";
import Claim from "../../../assets/images/Dealer/Claim.svg";
import User from "../../../assets/images/Dealer/Users.svg";
import email from "../../../assets/images/Dealer/Email.svg";
import phone from "../../../assets/images/Dealer/Phone.svg";
import UserList from "../Dealer/Dealer-Details/user";
import Modal from "../../../common/model";
import Input from "../../../common/input";
import OrderActive from "../../../assets/images/Dealer/Order-active.svg";
import Order from "../../../assets/images/Dealer/Orders.svg";
import Select from "../../../common/select";
import { RotateLoader } from "react-spinners";
import OrderList from "../Dealer/Dealer-Details/order";

import {
  getCustomerDetailsById,
  getUserListByCustomerId,
  updateCustomerDetailsById,
} from "../../../services/customerServices";
import { useFormik } from "formik";
import * as Yup from "yup";
import { cityData } from "../../../stateCityJson";
import { addUserToCustomer } from "../../../services/userServices";
import RadioButton from "../../../common/radio";
import Primary from "../../.././assets/images/SetPrimary.png";
import { MyContextProvider, useMyContext } from "../../../context/context";
import ContractList from "../Contract/contractList";
import ClaimList from "../Claim/claimList";

function CustomerDetails() {
  const getInitialActiveTab = () => {
    const storedTab = localStorage.getItem("customer");
    return storedTab ? storedTab : "Orders";
  };
  const [activeTab, setActiveTab] = useState(getInitialActiveTab()); // Set the initial active tab
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [firstMessage, setFirstMessage] = useState("");
  const [secondMessage, setSecondMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [customerDetail, setCustomerDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isStatus, setIsStatus] = useState(true);
  const [isAccountCreate, setIsAccountCreate] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [refreshList, setRefreshUserList] = useState([]);
  const [createAccountOption, setCreateAccountOption] = useState("yes");
  const [createAccount, setCreateAccount] = useState(false);
  const [timer, setTimer] = useState(3);
  const { customerId } = useParams();
  const [initialFormValues, setInitialFormValues] = useState({
    username: "",
    dealerId: "",
    street: "",
    city: "",
    zip: "",
    state: "",
    country: "USA",
    oldName: "",
  });
  const [initialUserFormValues, setInitialUserFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    position: "",
    status: "yes",
    customerId: customerId,
    isPrimary: false,
  });
  const { flag } = useMyContext();
  const emailValidationRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  console.log(isStatus, "isStatus");
  const state = cityData;
  console.log(customerId);

  const closeModal = () => {
    setIsModalOpen(false);
    formik.resetForm();
  };
  useEffect(() => {
    setLoading(true);
    let intervalId;

    if (modalOpen && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0) {
      closeModal10();
    }

    if (!modalOpen) {
      clearInterval(intervalId);
      setTimer(3);
    }

    setLoading(false);

    return () => {
      clearInterval(intervalId);
    };
  }, [modalOpen, timer]);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal10 = () => {
    setModalOpen(false);
    setActiveTab("Users");
  };
  //console.log("bhhj")
  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setActiveTab("Users");
    userValues.resetForm();
  };
  const getUserList = async () => {
    const result = await getUserListByCustomerId({}, customerId);
    console.log(result, "----------");
    setRefreshUserList(result.result);

    setCreateAccountOption(result.isAccountCreate ? "yes" : "no");
  };
  const userValues = useFormik({
    initialValues: initialUserFormValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      firstName: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .required("Required")
        .max(500, "Must be exactly 500 characters"),
      lastName: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .required("Required")
        .max(500, "Must be exactly 500 characters"),
      phoneNumber: Yup.string()
        .required("Required")
        .min(10, "Must be at least 10 characters")
        .max(10, "Must be exactly 10 characters")
        .matches(/^[0-9]+$/, "Must contain only digits"),
      email: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .matches(emailValidationRegex, "Invalid email address")
        .required("Required"),
    }),

    onSubmit: async (values, { setFieldError }) => {
      localStorage.setItem("customer", "Users");
      console.log(values);
      if (values.status === "yes") {
        values.status = true;
      }
      setLoading(true);
      const result = await addUserToCustomer(values);
      console.log(result.code);
      if (result.code == 200) {
        getUserList();
        // dealerData();
        setModalOpen(true);
        setFirstMessage("New User Added Successfully");
        setSecondMessage("New User Added Successfully");
        setMessage("Dealer updated Successfully");
        setLoading(false);
        closeUserModal();
        setTimer(3);
        // window.location.reload();
        // setIsModalOpen(false);
      } else {
        console.log(result);
        console.log("here");
        if (result.code === 401) {
          setFieldError("email", "Email already in use");
        }
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    getUserList();
  }, []);
  const handleRadioChange = (event) => {
    const selectedValue = event.target.value;
    userValues.setFieldValue("status", selectedValue === "yes" ? true : false);
    setCreateAccountOption(selectedValue);
  };

  const handleSelectChange = async (name, value) => {
    formik.setFieldValue(name, value);
  };
  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      username: Yup.string()
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
      zip: Yup.string()
        .required("Required")
        .min(5, "Must be at least 5 characters")
        .max(6, "Must be exactly 6 characters"),
    }),

    onSubmit: async (values) => {
      setLoading(true);
      const result = await updateCustomerDetailsById(customerId, values);
      console.log(result);
      if (result.code == 200) {
        customerDetails();
        setModalOpen(true);
        setFirstMessage("User Data Updated Successfully");
        setSecondMessage("User Data Updated Successfully");
        setMessage("Dealer updated Successfully");
        setLoading(false);
        setIsModalOpen(false);
      } else {
        setLoading(false);
        formik.setFieldError("username", "Name Already Used");
      }
    },
  });
  const openUserModal = () => {
    setActiveTab("Users123");
    setIsUserModalOpen(true);
  };
  useEffect(() => {
    customerDetails();
  }, [customerId, flag]);
  const routeToPage = (data) => {
    // console.log(data, id.id);
    switch (data) {
      case "Orders":
        const resellerIdParam = customerDetail?.meta?.resellerId
          ? `/${customerDetail?.meta?.resellerId}`
          : "";

        navigate(
          `/addOrderforCustomer/${customerId}/${customerDetail?.meta?.dealerId}${resellerIdParam}`
        );
        break;
      case "Claims":
        navigate(`/customer/addClaim/${customerDetail?.meta?.username}`);

        break;
      case "Users":
        openUserModal();
        break;

      default:
        console.log("Invalid data, no navigation");
    }
  };

  const formatPhoneNumber = (phoneNumber) => {
    const cleaned = ("" + phoneNumber).replace(/\D/g, ""); // Remove non-numeric characters
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/); // Match groups of 3 digits

    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    return phoneNumber; // Return original phone number if it couldn't be formatted
  };

  const customerDetails = async () => {
    setLoading(true);
    console.log(customerId);
    const result = await getCustomerDetailsById(customerId);
    setCustomerDetail(result.result);

    setIsStatus(result.result.dealerStatus);
    console.log(result.result.meta.isAccountCreate, " --------- ????????");
    setCreateAccount(result.result.meta.isAccountCreate);
    setIsAccountCreate(result.result.userAccount);
    setCreateAccountOption(result.result.userAccount ? "yes" : "no");
    setInitialFormValues({
      username: result?.result?.meta?.username,
      oldName: result?.result?.meta?.username,
      // dealerId: id.id,
      street: result?.result?.meta?.street,
      city: result?.result?.meta?.city,
      zip: result?.result?.meta?.zip,
      state: result?.result?.meta?.state,
      country: "USA",
    });
    setLoading(false);
  };
  useEffect(() => {
    localStorage.setItem("customer", activeTab);
  }, [activeTab]);
  const handleAccountChange = (event) => {
    const valueAsBoolean = JSON.parse(event.target.value.toLowerCase());
    setCreateAccount(valueAsBoolean);
    formik.setFieldValue("isAccountCreate", valueAsBoolean);
  };
  const tabs = [
    {
      id: "Orders",
      label: "Orders",
      icons: Order,
      Activeicons: OrderActive,
      content: activeTab === "Orders" && (
        <OrderList flag={"customer"} id={customerId} activeTab={activeTab} />
      ),
    },
    {
      id: "Contracts",
      label: "Contracts",
      icons: Dealer,
      Activeicons: DealerActive,
      content: activeTab === "Contracts" && (
        <ContractList flag={"customer"} id={customerId} activeTab={activeTab} />
      ),
    },
    {
      id: "Claims",
      label: "Claims",
      icons: Claim,
      Activeicons: ClaimActive,
      content: activeTab === "Claims" && (
        <ClaimList id={customerId} flag={"customer"} activeTab={activeTab} />
      ),
    },
    {
      id: "Users",
      label: "Users",
      icons: User,
      Activeicons: UserActive,
      content: (
        <UserList
          flag={"customer"}
          id={customerId}
          activeTab={activeTab}
          customerDetail={customerDetail}
        />
      ),
    },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };
  const navigate = useNavigate();
  const handleGOBack = () => {
    localStorage.removeItem("customer");
    navigate("/customerList");
  };

  const formatOrderValue = (orderValue) => {
    if (Math.abs(orderValue) >= 1e6) {
      return (orderValue / 1e6).toFixed(2) + "M";
    } else {
      return orderValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  };
  return (
    <>
      {loading && (
        <div className=" fixed z-[999999] bg-[#333333c7] backdrop-blur-xl  h-screen w-full flex py-5">
          <div className="self-center mx-auto">
            <RotateLoader color="#fff" />
          </div>
        </div>
      )}
      <div className="py-8 pl-3 relative overflow-x-hidden bg-grayf9">
        <Headbar />

        <div className="flex">
          <Link
            to={"/customerList"}
            className="h-[60px] w-[60px] flex border-[1px] bg-white border-Light-Grey rounded-[25px]"
          >
            <img
              src={BackImage}
              className="m-auto my-auto self-center bg-white"
              alt="BackImage"
            />
          </Link>
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9 mb-[3px]">
              Customer Details
            </p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/customerList"}>Customer / </Link>{" "}
              </li>
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/customerList"}> Customer List / </Link>{" "}
              </li>
              <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
                {" "}
                Customer Details ({activeTab})
              </li>
            </ul>
          </div>
        </div>

        <Grid className="!grid-cols-4 mt-5">
          <div className="col-span-1 max-h-[85vh] overflow-y-scroll">
            <div className=" bg-Dealer-details bg-cover p-5 rounded-[20px]">
              <Grid>
                <div className="col-span-9">
                  <p className="text-sm text-neutral-grey font-Regular">
                    Account Name
                  </p>
                  <p className="text-xl text-white font-semibold break-words">
                    {customerDetail?.meta?.username}
                  </p>
                </div>
                <div className="col-span-3 text-end">
                  <Button
                    className="border !border-[#535456] !text-sm !font-Regular"
                    onClick={openModal}
                  >
                    Edit
                  </Button>
                </div>
              </Grid>
              <div className="flex my-4">
                <img
                  src={address}
                  className="mr-3 bg-[#383838] rounded-[14px] my-auto"
                  alt="Address"
                />
                <div>
                  <p className="text-sm text-neutral-grey font-Regular mt-3">
                    Address
                  </p>
                  <p className="text-base text-white font-semibold leading-5">
                    {customerDetail?.meta?.street} {", "}
                    {customerDetail?.meta?.state}
                    {", "}
                    {customerDetail?.meta?.country}
                  </p>
                </div>
              </div>
              <div className="flex w-full my-4">
                <p className="text-[10px] mr-3 text-neutral-grey font-Regular">
                  PRIMARY CONTACT DETAILS
                </p>
                <hr className="self-center border-[#999999] w-[40%]" />
              </div>
              <div className="flex mb-4">
                <div className="relative">
                  <img
                    src={DealerIcons}
                    className="mr-3 bg-[#383838] rounded-[14px]"
                    alt="DealerIcons"
                  />
                  <Link to={`/dealerDetails/${customerDetail?.meta?.dealerId}`}>
                    {" "}
                    <img
                      src={DealerList}
                      className="mr-3 bg-[#383838] cursor-pointer rounded-[14px] absolute top-3 -right-2"
                      alt="DealerList"
                    />{" "}
                  </Link>
                </div>
                <div className="w-[75%]">
                  <p className="text-sm text-neutral-grey font-Regular">
                    Dealer Name
                  </p>
                  <p className="text-base text-white font-semibold ">
                    {customerDetail?.meta?.dealerName}
                  </p>
                </div>
              </div>
              {customerDetail?.meta?.resellerId && (
                <div className="flex mb-4">
                  <div className="relative">
                    <img
                      src={DealerIcons}
                      className="mr-3 bg-[#383838] rounded-[14px]"
                      alt="DealerIcons"
                    />
                    <Link
                      to={`/resellerDetails/${customerDetail?.meta?.resellerId}`}
                    >
                      {" "}
                      <img
                        src={DealerList}
                        className="mr-3 bg-[#383838] cursor-pointer rounded-[14px] absolute top-3 -right-2"
                        alt="DealerList"
                      />{" "}
                    </Link>
                  </div>
                  <div className="w-[75%]">
                    <p className="text-sm text-neutral-grey font-Regular">
                      Reseller Name
                    </p>
                    <p className="text-base text-white font-semibold ">
                      {customerDetail?.resellerName}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex mb-4">
                <img
                  src={name}
                  className="mr-3 bg-[#383838] rounded-[14px]"
                  alt="Name"
                />
                <div>
                  <p className="text-sm text-neutral-grey font-Regular">Name</p>
                  <p className="text-base text-white font-semibold ">
                    {customerDetail?.primary?.firstName}{" "}
                    {customerDetail?.primary?.lastName}
                  </p>
                </div>
              </div>
              <div className="flex mb-4">
                <img
                  src={email}
                  className="mr-3 bg-[#383838] rounded-[14px]"
                  alt="email"
                />
                <div className="w-[80%]">
                  <p className="text-sm text-neutral-grey font-Regular">
                    Email
                  </p>
                  <p className="text-base text-white leading-[13px] font-semibold break-words">
                    {customerDetail?.primary?.email}
                  </p>
                </div>
              </div>
              <div className="flex mb-4">
                <img
                  src={phone}
                  className="mr-3 bg-[#383838] rounded-[14px]"
                  alt="name"
                />
                <div>
                  <p className="text-sm text-neutral-grey font-Regular">
                    Phone Number
                  </p>
                  <p className="text-base text-white font-semibold ">
                    +1 {formatPhoneNumber(customerDetail?.primary?.phoneNumber)}
                  </p>
                </div>
              </div>
              <Grid className="mt-5">
                <div className="col-span-6 ">
                  <div className="bg-[#2A2A2A] self-center px-4 py-6 rounded-xl">
                    <p className="text-white text-lg !font-[600]">
                      {" "}
                      {customerDetail?.orderData?.[0]?.noOfOrders ?? 0}
                    </p>
                    <p className="text-neutral-grey text-sm font-Regular">
                      Total number of Orders
                    </p>
                  </div>
                </div>
                <div className="col-span-6 ">
                  <div className="bg-[#2A2A2A] self-center px-4 py-6 rounded-xl">
                    <p className="text-white text-lg  !font-[600]">
                      $
                      {formatOrderValue(
                        customerDetail?.orderData?.[0]?.orderAmount ??
                          parseInt(0)
                      )}
                    </p>
                    <p className="text-neutral-grey text-sm font-Regular">
                      Total Value of Orders
                    </p>
                  </div>
                </div>
                <div className="col-span-6 ">
                  <div className="bg-[#2A2A2A] self-center px-4 py-6 rounded-xl">
                    <p className="text-white text-lg !font-[600]">
                      {customerDetail?.claimData?.numberOfClaims ?? 0}
                    </p>
                    <p className="text-neutral-grey text-sm font-Regular">
                      Total number of Claims
                    </p>
                  </div>
                </div>
                <div className="col-span-6 ">
                  <div className="bg-[#2A2A2A] self-center px-4 py-6 rounded-xl">
                    <p className="text-white text-lg  !font-[600]">
                      $
                      {formatOrderValue(
                        customerDetail?.claimData?.valueClaim ?? parseInt(0)
                      )}
                    </p>
                    <p className="text-neutral-grey text-sm font-Regular">
                      Total Value of Claims
                    </p>
                  </div>
                </div>
              </Grid>
            </div>
          </div>
          <div className="col-span-3 max-h-[85vh] pr-3 overflow-y-scroll">
            <Grid className="">
              <div className="col-span-6">
                <div className="bg-white rounded-[30px] p-3 border-[1px] border-Light-Grey">
                  <Grid className="!grid-cols-4 !gap-1">
                    {tabs.map((tab) => (
                      <div className="col-span-1" key={tab.id}>
                        <Button
                          className={`flex self-center w-full !px-2 !py-1 rounded-xl border-[1px] border-Light-Grey ${
                            activeTab === tab.id
                              ? "!bg-[#2A2A2A] !text-white"
                              : "!bg-grayf9 !text-black"
                          }`}
                          onClick={() => handleTabClick(tab.id)}
                        >
                          <img
                            src={
                              activeTab === tab.id ? tab.Activeicons : tab.icons
                            }
                            className="self-center pr-1 py-1 border-Light-Grey border-r-[1px]"
                            alt={tab.label}
                          />
                          <span
                            className={`ml-1 py-1 text-sm font-Regular ${
                              activeTab === tab.id ? "text-white" : "text-black"
                            }`}
                          >
                            {tab.label}
                          </span>
                        </Button>
                      </div>
                    ))}
                  </Grid>
                </div>
              </div>
              <div className="col-span-4"></div>
              <div className="col-span-2">
                {activeTab !== "Contracts" &&
                  !(activeTab === "Orders" && isStatus === false) && (
                    <Button
                      className="!bg-white flex self-center h-full  mb-4 rounded-xl ml-auto border-[1px] border-Light-Grey"
                      onClick={() => routeToPage(activeTab)}
                    >
                      {" "}
                      <img
                        src={AddItem}
                        className="self-center"
                        alt="AddItem"
                      />{" "}
                      <span className="text-black ml-2 self-center text-[14px] font-Regular !font-[700]">
                        Add {activeTab}
                      </span>{" "}
                    </Button>
                  )}
              </div>
            </Grid>

            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`${activeTab !== tab.id ? "hidden" : "pb-20"}`}
              >
                {tab.content}
              </div>
            ))}
          </div>
        </Grid>

        <Modal isOpen={isUserModalOpen} onClose={closeUserModal}>
          <div className=" py-3">
            <p className=" text-center text-3xl mb-5 mt-2 font-bold text-light-black">
              Add New User
            </p>
            <form onSubmit={userValues.handleSubmit}>
              <Grid className="px-8">
                <div className="col-span-6">
                  <Input
                    type="text"
                    name="firstName"
                    label="First Name"
                    required={true}
                    placeholder=""
                    className="!bg-white"
                    maxLength={"30"}
                    value={userValues.values.firstName}
                    onBlur={userValues.handleBlur}
                    onChange={userValues.handleChange}
                    error={
                      userValues.touched.firstName &&
                      userValues.errors.firstName
                    }
                  />
                  {userValues.touched.firstName &&
                    userValues.errors.firstName && (
                      <div className="text-red-500 text-sm pl-2 pt-2">
                        {userValues.errors.firstName}
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
                    className="!bg-white"
                    maxLength={"30"}
                    value={userValues.values.lastName}
                    onBlur={userValues.handleBlur}
                    onChange={userValues.handleChange}
                    error={
                      userValues.touched.lastName && userValues.errors.lastName
                    }
                  />
                  {userValues.touched.lastName &&
                    userValues.errors.lastName && (
                      <div className="text-red-500 text-sm pl-2 pt-2">
                        {userValues.errors.lastName}
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
                    value={userValues.values.email}
                    onBlur={userValues.handleBlur}
                    onChange={userValues.handleChange}
                    error={userValues.touched.email && userValues.errors.email}
                  />
                  {userValues.touched.email && userValues.errors.email && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {userValues.errors.email}
                    </div>
                  )}
                </div>
                <div className="col-span-6">
                  <Input
                    type="tel"
                    name="phoneNumber"
                    label="Phone"
                    required={true}
                    className="!bg-white"
                    placeholder=""
                    value={userValues.values.phoneNumber}
                    onChange={(e) => {
                      const sanitizedValue = e.target.value.replace(
                        /[^0-9]/g,
                        ""
                      );
                      console.log(sanitizedValue);
                      userValues.handleChange({
                        target: {
                          name: "phoneNumber",
                          value: sanitizedValue,
                        },
                      });
                    }}
                    onBlur={userValues.handleBlur}
                    minLength={"10"}
                    maxLength={"10"}
                    error={
                      userValues.touched.phoneNumber &&
                      userValues.errors.phoneNumber
                    }
                  />
                  {(userValues.touched.phoneNumber ||
                    userValues.submitCount > 0) &&
                    userValues.errors.phoneNumber && (
                      <div className="text-red-500 text-sm pl-2 pt-2">
                        {userValues.errors.phoneNumber}
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
                    value={userValues.values.position}
                    onBlur={userValues.handleBlur}
                    onChange={userValues.handleChange}
                    error={
                      userValues.touched.position && userValues.errors.position
                    }
                  />
                </div>
                <div className="col-span-6">
                  <p className="text-light-black flex text-[12px] font-semibold mt-3 mb-6">
                    Do you want to create an account?
                    <RadioButton
                      id="yes-create-account"
                      label="Yes"
                      value="yes"
                      disabled={createAccount == false}
                      checked={createAccountOption === "yes"}
                      onChange={handleRadioChange}
                    />
                    <RadioButton
                      id="no-create-account"
                      label="No"
                      value="no"
                      disabled={createAccount == false}
                      checked={createAccountOption === "no"}
                      onChange={handleRadioChange}
                    />
                  </p>
                </div>
              </Grid>
              <Grid className="px-8 drop-shadow-5xl">
                <div className="col-span-4">
                  <Button
                    type="button"
                    className="border w-full !border-[#535456] !bg-[transparent] !text-light-black !text-sm !font-Regular"
                    onClick={closeUserModal}
                  >
                    Cancel
                  </Button>
                </div>
                <div className="col-span-8">
                  <Button type="submit" className="w-full">
                    Submit
                  </Button>
                </div>
              </Grid>
            </form>
          </div>
        </Modal>
        {/* Modal Email Popop */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="px-8 py-4">
            <p className="text-3xl text-center font-bold mb-8">
              Edit Customer Details
            </p>
            <form className="mt-8" onSubmit={formik.handleSubmit}>
              <Grid>
                <div className="col-span-12">
                  <Input
                    type="text"
                    name="username"
                    className="!bg-white"
                    label="Account Name"
                    required={true}
                    placeholder=""
                    maxLength={"500"}
                    value={formik.values.username}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    error={formik.touched.username && formik.errors.username}
                  />
                  {formik.touched.username && formik.errors.username && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {formik.errors.username}
                    </div>
                  )}
                </div>
                <div className="col-span-12">
                  <Input
                    type="text"
                    name="street"
                    className="!bg-white"
                    label="Street Address"
                    required={true}
                    placeholder=""
                    maxLength={"500"}
                    value={formik.values.street}
                    onBlur={formik.handleBlur}
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
                    type="number"
                    name="zip"
                    label="Zip Code"
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
                <div className="col-span-6">
                  <Input
                    type="text"
                    name="city"
                    label="City"
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
                <div className="col-span-6">
                  <Select
                    label="State"
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
                </div>
                <div className="col-span-12">
                  <p className="text-light-black flex text-[11px] mb-3 mt-2 font-semibold ">
                    Do you want to create an account?
                    <RadioButton
                      id="yes-create-account"
                      label="Yes"
                      value={true}
                      disabled={!isAccountCreate && !customerDetail?.meta?.isAccountCreate}
                      checked={createAccount === true}
                      onChange={handleAccountChange}
                    />
                    <RadioButton
                      id="no-create-account"
                      label="No"
                      value={false}
                      checked={createAccount === false}
                       disabled={!isAccountCreate && !customerDetail?.meta?.isAccountCreate}
                      onChange={handleAccountChange}
                    />
                  </p>
                </div>
                <div className="col-span-4">
                  <Button
                    type="button"
                    className="border w-full !border-[#535456] !bg-[transparent] !text-light-black !text-sm !font-Regular"
                    onClick={closeModal}
                  >
                    Cancel
                  </Button>
                </div>
                <div className="col-span-8">
                  <Button type="submit" className="w-full">
                    Submit
                  </Button>
                </div>
              </Grid>
            </form>
          </div>
        </Modal>
        <Modal isOpen={modalOpen} onClose={closeModal10}>
          <div className="text-center py-3">
            <img src={Primary} alt="email Image" className="mx-auto" />
            <p className="text-3xl mb-0 mt-2 font-bold text-light-black">
              {firstMessage}
            </p>
            <p className="text-neutral-grey text-base font-medium mt-4">
              {secondMessage} {""} <br /> Redirecting Back to Detail page in{" "}
              {timer} Seconds
            </p>
          </div>
        </Modal>
      </div>
    </>
  );
}
export default CustomerDetails;
