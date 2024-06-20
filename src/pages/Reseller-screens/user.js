import React, { useEffect, useRef, useState } from "react";
import Button from "../../common/button";

import ActiveIcon from "../../assets/images/icons/iconAction.svg";
import star from "../../assets/images/icons/star.svg";
import terms from "../../assets/images/Dealer/Address.svg";
import dealer from "../../assets/images/Dealer/Name.svg";
import Primary from "../../assets/images/SetPrimary.png";
import deleteUser10 from "../../assets/images/deleteUser.svg";
import assign from "../../assets/images/Unassign.png";
import Search from "../../assets/images/icons/SearchIcon.svg";
import clearFilter from "../../assets/images/icons/Clear-Filter-Icon-White.svg";
import shorting from "../../assets/images/icons/shorting.svg";
import Grid from "../../common/grid";
import Input from "../../common/input";
import DataTable from "react-data-table-component";
import { RotateLoader } from "react-spinners";
import Modal from "../../common/model";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  changePrimaryByUserId,
  deleteUserByUserId,
  getUserListByDealerId,
  userDetailsById,
  updateUserDetailsById,
  addUserToCustomerPortal,
  changePrimaryByUserIdCustomerPortal,
} from "../../services/userServices";
import Select from "../../common/select";
import {
  getCustomerUsersByIdCustomerPortal,
  getUserDetailsByIdResellerPortal,
  getUsersByIdresellerPortal,
} from "../../services/customerServices";
import { useMyContext } from "../../context/context";
import AddItem from "../../assets/images/icons/addItem.svg";
import Headbar from "../../common/headBar";
import RadioButton from "../../common/radio";
import Tabs from "../../common/tabs";
import {
  addSuperAdminMembers,
  changePasswordbyToken,
} from "../../services/extraServices";
import make from "../../assets/images/star.png";
import edit from "../../assets/images/edit-text.png";
import delete1 from "../../assets/images/delete.png";
import PasswordInput from "../../common/passwordInput";
import deleteUser123 from "../../assets/images/Disapproved.png";
import Cross from "../../assets/images/Cross.png";

function ResellerUser() {
  const { toggleFlag } = useMyContext();
  const [selectedAction, setSelectedAction] = useState(null);
  const [userList, setUserList] = useState([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isModalOpen, SetIsModalOpen] = useState(false);
  const [isprimary, SetIsprimary] = useState(false);
  const [active, SetActive] = useState(false);
  const [mainStatus, setMainStatus] = useState(true);
  const [details, setDetails] = useState(true);
  const [servicerStatus, setServiceStatus] = useState(true);
  const [firstMessage, setFirstMessage] = useState("");
  const [secondMessage, setSecondMessage] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [createAccountOption, setCreateAccountOption] = useState("yes");
  const [primaryText, SetPrimaryText] = useState("");
  const [secondaryText, SetSecondaryText] = useState("");
  const [timer, setTimer] = useState(3);
  const dropdownRef = useRef(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [isModalOpen12, setIsModalOpen12] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState({
    lastName: "",
    firstName: "",
    phoneNumber: "",
    position: "",
    status: createAccountOption == "yes" ? true : false,
    id: "",
  });
  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setInitialFormValues({
      lastName: "",
      firstName: "",
      phoneNumber: "",
      position: "",
      status: createAccountOption == "yes" ? true : false,
      id: "",
    });
  };
  // console.log("toggleFlag", toggleFlag);
  const [loading, setLoading] = useState(false);
  const handleRadioChange = (event) => {
    const selectedValue = event.target.value;
    console.log(selectedValue);
    userValues.setFieldValue("status", selectedValue === "yes" ? true : false);
    setCreateAccountOption(selectedValue);
  };
  const getUserList = async () => {
    const result = await getUsersByIdresellerPortal();
    console.log(result.data);
    setUserList(result.data);
  };
  const getCustomerDetails = async () => {
    setLoading1(true);
    const result = await getUserDetailsByIdResellerPortal();
    console.log(result.result);
    setDetails(result.result);
    SetIsprimary(result.loginMember.isPrimary);
    setLoading1(false);
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      // Close the dropdown if the click is outside of it
      setSelectedAction(null);
    }
  };
  useEffect(() => {
    getUserList();
    getCustomerDetails();
  }, []);
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    let intervalId;

    if ((isModalOpen || (isModalOpen12 && timer > 0)) && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0) {
      closeModal1();
      setSelectedAction(null);
      closeModal();
      closeModal12();
      getUserList();
    }

    if (!isModalOpen && !isModalOpen12) {
      clearInterval(intervalId);
      setTimer(3);
    }

    setLoading(false);

    return () => {
      clearInterval(intervalId);
    };
  }, [isModalOpen, isModalOpen12, timer]);

  const closeModal = () => {
    SetIsModalOpen(false);
  };

  const openModal = () => {
    SetIsModalOpen(true);
    getUserList();
  };

  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const handleSelectChange = async (name, value) => {
    formik1.setFieldValue(name, value);
  };
  const closeModal1 = () => {
    setIsModalOpen1(false);
  };
  const openModal1 = (id) => {
    setDeleteId(id);
    setIsModalOpen1(true);
  };
  const status = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const closeModal2 = () => {
    setIsModalOpen2(false);
    userValues.resetForm();
  };
  const openModal2 = () => {
    setIsModalOpen2(true);
  };
  const openUserModal = () => {
    setInitialFormValues({
      lastName: "",
      firstName: "",
      phoneNumber: "",
      position: "",
      status: createAccountOption == "yes" ? true : false,
      id: "",
    });
    setIsUserModalOpen(true);
  };
  const closeModal12 = () => {
    setIsModalOpen12(false);
    formik.resetForm();
  };
  const openModal12 = () => {
    setIsModalOpen12(true);
  };
  const handleStatusChange = async (row, newStatus) => {
    console.log(row);
    try {
      setUserList((userData) => {
        return userData.map((user) => {
          if (user._id === row._id) {
            return {
              ...user,
              status: newStatus === "active" ? true : false,
            };
          }
          return user;
        });
      });

      const result = await updateUserDetailsById({
        id: row._id,
        status: newStatus === "active" ? true : false,
      });

      console.log(result);
    } catch (error) {
      console.error("Error in handleStatusChange:", error);
    }
  };
  const emailValidationRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      firstName: Yup.string()
        .required("Required")
        .max(30, "Must be exactly 30 characters"),
      lastName: Yup.string()
        .required("Required")
        .max(30, "Must be exactly 30 characters"),
      email: Yup.string()
        .required("Required")
        .matches(emailValidationRegex, "Invalid email address")
        .transform((originalValue) => originalValue.trim()),
      phoneNumber: Yup.string()
        .required("Required")
        .min(10, "Must be at least 10 characters")
        .max(10, "Must be exactly 10 characters")
        .matches(/^[0-9]+$/, "Must contain only digits"),
      status: Yup.boolean().required("Required"),
    }),
    onSubmit: async (values) => {
      console.log("Form values:", values);
      setLoading(true);
      const result = await addUserToCustomerPortal(values);
      console.log(result);
      if (result.code == 200) {
        setLoading(false);
        SetPrimaryText("User Added Successfully ");
        SetSecondaryText("user Added successfully ");
        openModal();
        toggleFlag();
        setTimer(3);
        getUserList();
      } else {
        setLoading(false);
      }
      closeModal2();
    },
  });

  const calculateDropdownPosition = (index) => {
    const isCloseToBottom = userList.length - index <= 10000;
    return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
  };

  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
  };

  const deleteUser = async () => {
    const result = await deleteUserByUserId(deleteId);
    console.log(result);
    if (result.code === 200) {
      getUserList();
      setIsModalOpen12(true);
      // closeModal1();
    }
  };
  const editUser = async (id) => {
    console.log(id);
    const result = await userDetailsById(id);
    console.log(result.result.status);
    SetActive(result.result.isPrimary);
    setMainStatus(result.mainStatus);
    setInitialFormValues({
      id: id,
      lastName: result?.result?.lastName,
      firstName: result?.result?.firstName,
      phoneNumber: result?.result?.phoneNumber,
      position: result?.result?.position,
      status: result?.result?.status,
    });
    openModal2();
  };

  const makeUserPrimary = async (row) => {
    console.log(row._id);
    const result = await changePrimaryByUserIdCustomerPortal(row._id);
    console.log(result);
    if (result.code === 200) {
      SetPrimaryText("It's set to Primary");
      SetSecondaryText("We have successfully made this user primary");
      toggleFlag();
      openModal();
    }
    getCustomerDetails();
  };

  const filterUserDetails = async (data) => {
    try {
      setLoading(true);
      const res = await getUsersByIdresellerPortal("", data);
      setUserList(res.data);
      console.log(res, "---------------");
      let local = JSON.parse(localStorage.getItem("userDetails"));
      // localStorage.removeItem('userDetails')
      local.userInfo = {
        lastName: res?.data?.[0]?.lastName,
        firstName: res?.data?.[0]?.firstName,
      };
      localStorage.setItem("userDetails", JSON.stringify(local));
    } catch (error) {
      console.error("Error fetching category list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterIconClick = () => {
    formikUSerFilter.resetForm();
    console.log(formikUSerFilter.values);
    getUserList();
  };
  const formikUSerFilter = useFormik({
    initialValues: {
      firstName: "",
      email: "",
      phone: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string(),
      email: Yup.string(),
      phone: Yup.string().nullable(), // ensure that the phone number consists of only digits
    }),
    onSubmit: async (values) => {
      if (values.phone && values.phone.includes("-")) {
        values.phone = values.phone.replace(/-/g, "");
      }
      filterUserDetails(values);
    },
  });

  const formatPhoneNumber = (phoneNumber) => {
    const cleaned = ("" + phoneNumber).replace(/\D/g, ""); // Remove non-numeric characters
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/); // Match groups of 3 digits

    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    return phoneNumber; // Return original phone number if it couldn't be formatted
  };

  const columns = [
    {
      name: "Name",
      selector: "name",
      // sortable: true,
      cell: (row) => (
        <div className="flex relative">
          {row?.isPrimary && (
            <img src={star} alt="" className="absolute -left-3 top-0" />
          )}
          <span className="self-center pt-2 ml-3">
            {row?.firstName} {row?.lastName}
          </span>
        </div>
      ),
    },
    {
      name: "Email Address",
      selector: (row) => row.email,
      // sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row) => "+1 " + formatPhoneNumber(row.phoneNumber),
      // sortable: true,
    },
    {
      name: "Position",
      selector: (row) => row.position,
      // sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      // sortable: true,
      cell: (row) => (
        <div className="relative">
          <div
            className={` ${
              row.status === true ? "bg-[#6BD133]" : "bg-[#FF4747]"
            } absolute h-3 w-3 rounded-full top-[33%] ml-[8px]`}
          ></div>
          <select
            disabled={row?.isPrimary || !servicerStatus}
            value={row.status === true ? "active" : "inactive"}
            onChange={(e) => handleStatusChange(row, e.target.value)}
            className="text-[12px] border border-gray-300 text-[#727378] rounded pl-[20px] py-2 pr-1 font-semibold rounded-xl"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      ),
    },
    {
      name: "Action",
      minWidth: "auto", // Set a custom minimum width
      maxWidth: "90px", // Set a custom maximum width
      cell: (row, index) => {
        // console.log(index, index % 10 == 9)
        return (
          <div className="relative">
            <div
              onClick={() =>
                setSelectedAction(
                  selectedAction === row.email ? null : row.email
                )
              }
            >
              <img
                src={ActiveIcon}
                className="cursor-pointer	w-[35px]"
                alt="Active Icon"
              />
            </div>
            {selectedAction === row.email && (
              <div
                ref={dropdownRef}
                className={`absolute z-[9999] ${
                  !row?.isPrimary ? "w-[140px]" : "w-[80px]"
                } drop-shadow-5xl -right-3 mt-2 py-1 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                  index
                )}`}
              >
                {!row?.isPrimary && row.status && (
                  <div
                    className="text-left cursor-pointer flex hover:font-semibold py-1 px-2 border-b"
                    onClick={() => makeUserPrimary(row)}
                  >
                    <img src={make} className="w-4 h-4 mr-2" />{" "}
                    <span className="self-center"> Make Primary </span>
                  </div>
                )}

                <div
                  className="text-left cursor-pointer flex hover:font-semibold py-1 px-2 border-b"
                  onClick={() => editUser(row._id)}
                >
                  <img src={edit} className="w-4 h-4 mr-2" />{" "}
                  <span className="self-center">Edit </span>
                </div>
                {!row?.isPrimary && (
                  <div
                    className="text-left cursor-pointer flex hover:font-semibold py-1 px-2"
                    onClick={() => openModal1(row._id)}
                  >
                    <img src={delete1} className="w-4 h-4 mr-2" />{" "}
                    <span className="self-center">Delete</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const columns12 = [
    {
      name: "Name",
      selector: "name",
      // sortable: true,
      cell: (row) => (
        <div className="flex relative">
          {row?.isPrimary && (
            <img src={star} alt="" className="absolute -left-3 top-0" />
          )}
          <span className="self-center pt-2 ml-3">
            {row.firstName} {row.lastName}
          </span>
        </div>
      ),
    },
    {
      name: "Email Address",
      selector: (row) => row.email,
      // sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row) => "+1 " + formatPhoneNumber(row.phoneNumber),
      // sortable: true,
    },
    {
      name: "Position",
      selector: (row) => row.position,
      // sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      // sortable: true,
      cell: (row) => (
        <div className="relative">
          <div
            className={` ${
              row.status === true ? "bg-[#6BD133]" : "bg-[#FF4747]"
            } absolute h-3 w-3 rounded-full top-[33%] ml-[8px]`}
          ></div>
          <select
            disabled={true}
            value={row.status === true ? "active" : "inactive"}
            onChange={(e) => handleStatusChange(row, e.target.value)}
            className="text-[12px] border border-gray-300 text-[#727378] rounded pl-[20px] py-2 pr-1 font-semibold rounded-xl"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      ),
    },
  ];
  const initialValues2 = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log(values);
    passwordChange(values);
    setSubmitting(false);
  };

  const passwordChange = async (value) => {
    setLoading1(true);
    delete value.confirmPassword;

    try {
      const res = await changePasswordbyToken(value);
      console.log(res);
      if (res.code == 200) {
        setFirstMessage("Updated  Successfully ");
        setSecondMessage("User Password updated  successfully ");
        SetIsModalOpen(true);
        setTimer(3);
      } else {
        setFirstMessage("Error");
        setSecondMessage(res.message);
        setIsPasswordOpen(true);
      }
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setLoading1(false);
    }
    console.log(value);
  };
  const passwordChnageForm = useFormik({
    initialValues: initialValues2,
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Required"),
      newPassword: Yup.string().required("Required"),
      confirmPassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
    }),
    onSubmit: handleSubmit,
  });
  const closePassword = () => {
    setIsPasswordOpen(false);
  };
  const CustomNoDataComponent = () => (
    <div className="text-center my-5">
      <p>No records found.</p>
    </div>
  );
  const userValues = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      firstName: Yup.string()
        .required("Required")
        .transform((originalValue) => originalValue.trim())
        .max(30, "Must be exactly 30 characters"),
      lastName: Yup.string()
        .required("Required")
        .transform((originalValue) => originalValue.trim())
        .max(30, "Must be exactly 30 characters"),
      email: Yup.string()
        .required("Required")
        .matches(emailValidationRegex, "Invalid email address")
        .transform((originalValue) => originalValue.trim()),
      phoneNumber: Yup.string()
        .required("Required")
        .min(10, "Must be at least 10 characters")
        .max(10, "Must be exactly 10 characters")
        .matches(/^[0-9]+$/, "Must contain only digits"),
      status: Yup.boolean().required("Required"),
    }),
    onSubmit: async (values) => {
      console.log("Form values:", values);
      setLoading(true);
      const result = await addSuperAdminMembers(values);
      console.log(result);
      if (result.code == 200) {
        setLoading(false);
        setTimer(3);
        SetPrimaryText("User Add Successfully ");
        SetSecondaryText("user Add successfully ");

        SetIsModalOpen(true);
        setIsUserModalOpen(false);
        getUserList();
      } else {
        setLoading(false);
        if (result.code === 401) {
          userValues.setFieldError("email", "Email already in use");
        }
        SetIsModalOpen(true);
      }
      closeModal2();
    },
  });
  const formik1 = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      firstName: Yup.string()
        .required("Required")
        .transform((originalValue) => originalValue.trim())
        .max(30, "Must be exactly 30 characters"),
      lastName: Yup.string()
        .required("Required")
        .transform((originalValue) => originalValue.trim())
        .max(30, "Must be exactly 30 characters"),
      phoneNumber: Yup.string()
        .required("Required")
        .min(10, "Must be at least 10 characters")
        .max(10, "Must be exactly 10 characters")
        .matches(/^[0-9]+$/, "Must contain only digits"),
      status: Yup.boolean().required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      const result = await updateUserDetailsById(values);
      console.log(result);
      if (result.code == 200) {
        setLoading(false);

        SetPrimaryText("User Updated Successfully ");
        SetSecondaryText("user updated successfully ");

        openModal();
        setTimer(3);
        filterUserDetails();
      } else {
        setLoading(false);
      }
      closeModal2();
    },
  });

  return (
    <>
      {loading1 ? (
        <div className=" h-[500px] w-full flex py-5">
          <div className="self-center mx-auto">
            <RotateLoader color="#333" />
          </div>
        </div>
      ) : (
        <div className="my-8">
          <Headbar />
          <div className="flex mt-2">
            <div className="pl-3">
              <p className="font-bold text-[36px] leading-9	mb-[3px]">
                Manage Users
              </p>
              <ul className="flex self-center">
                <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
                  {" "}
                  Users{" "}
                </li>
              </ul>
            </div>
          </div>

          <div className="px-8 pb-8 pt-4 mt-5 mb-8 drop-shadow-4xl bg-white border-[1px] border-Light-Grey  rounded-xl relative">
            <div className="bg-Edit bg-cover px-8 py-4 rounded-[30px]">
              <Grid>
                <div className="col-span-2 text-left">
                  <p className="text-base text-white font-semibold my-3">
                    {" "}
                    Dealer Details
                  </p>
                </div>
                <div className="col-span-10 self-center">
                  <hr />
                </div>
              </Grid>
              <Grid className="mx-8 mx-auto ">
                <div className="col-span-2 self-center border-r border-[#4e4e4e]"></div>
                <div className="col-span-3 border-r border-[#4e4e4e]">
                  <div className="flex">
                    <div className="self-center bg-[#FFFFFF08] backdrop-blur rounded-xl mr-4">
                      <img src={dealer} alt="dealer" />
                    </div>
                    <div className="self-center w-[80%]">
                      <p className="text-white text-base font-medium leading-5	">
                        Account Name
                      </p>
                      <p className="text-[#FFFFFF] opacity-50 text-sm	font-medium">
                        {details?.dealer?.name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-5">
                  <div className="flex justify-center">
                    <div className="self-center bg-[#FFFFFF08] rounded-xl mr-4">
                      <img src={terms} className="" alt="terms" />
                    </div>
                    <div className="self-center">
                      <p className="text-white text-base font-medium leading-5">
                        Address
                      </p>
                      <p className="text-[#FFFFFF] opacity-50	text-sm font-medium">
                        {details?.dealer?.street} {", "}
                        {details?.dealer?.city}
                        {", "}
                        {details?.dealer?.state} {details?.dealer?.zip}
                        {", "}
                        {details?.dealer?.country}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2"></div>
              </Grid>
              <Grid className="mt-5">
                <div className="col-span-2 text-left">
                  <p className="text-base text-white font-semibold">
                    {" "}
                    My Details
                  </p>
                </div>
                <div className="col-span-10 self-center">
                  <hr />
                </div>
              </Grid>

              <Grid className="mx-8 mx-auto mt-4">
                <div className="col-span-2 self-center border-r border-[#4e4e4e]"></div>
                <div className="col-span-3 border-r border-[#4e4e4e]">
                  <div className="flex">
                    <div className="self-center bg-[#FFFFFF08] backdrop-blur rounded-xl mr-4">
                      <img src={dealer} alt="dealer" />
                    </div>
                    <div className="self-center w-[80%]">
                      <p className="text-white text-base font-medium leading-5	">
                        Account Name
                      </p>
                      <p className="text-[#FFFFFF] opacity-50 text-sm	font-medium">
                        {details?.name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-5">
                  <div className="flex justify-center">
                    <div className="self-center bg-[#FFFFFF08] rounded-xl mr-4">
                      <img src={terms} className="" alt="terms" />
                    </div>
                    <div className="self-center">
                      <p className="text-white text-base font-medium leading-5">
                        Address
                      </p>
                      <p className="text-[#FFFFFF] opacity-50	text-sm font-medium">
                        {details?.street} {", "}
                        {details?.city}
                        {", "}
                        {details?.state} {details?.zip}
                        {", "}
                        {details?.country}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2"></div>
              </Grid>
            </div>
            <div className="px-8 pb-8 pt-4 mt-5 mb-8 drop-shadow-4xl bg-white border-[1px] border-Light-Grey  rounded-xl relative">
              <p className="text-xl font-semibold mb-5">Change Password</p>
              <form onSubmit={passwordChnageForm.handleSubmit}>
                <Grid>
                  <div className="col-span-4">
                    <PasswordInput
                      type="password"
                      name="oldPassword"
                      label="Old Password"
                      value={passwordChnageForm.values.oldPassword}
                      onChange={passwordChnageForm.handleChange}
                      onBlur={passwordChnageForm.handleBlur}
                      isPassword
                      className="!bg-white"
                    />
                    {passwordChnageForm.touched.oldPassword &&
                      passwordChnageForm.errors.oldPassword && (
                        <div className="text-red-500">
                          {passwordChnageForm.errors.oldPassword}
                        </div>
                      )}
                  </div>

                  <div className="col-span-4">
                    <PasswordInput
                      type="password"
                      name="newPassword"
                      label="New Password"
                      isPassword
                      className="!bg-white"
                      value={passwordChnageForm.values.newPassword}
                      onChange={passwordChnageForm.handleChange}
                      onBlur={passwordChnageForm.handleBlur}
                    />
                    {passwordChnageForm.touched.newPassword &&
                      passwordChnageForm.errors.newPassword && (
                        <div className="text-red-500">
                          {passwordChnageForm.errors.newPassword}
                        </div>
                      )}
                  </div>
                  <div className="col-span-4">
                    <PasswordInput
                      type="password"
                      name="confirmPassword"
                      label="Confirm Password"
                      isPassword
                      className="!bg-white"
                      value={passwordChnageForm.values.confirmPassword}
                      onChange={passwordChnageForm.handleChange}
                      onBlur={passwordChnageForm.handleBlur}
                    />
                    {passwordChnageForm.touched.confirmPassword &&
                      passwordChnageForm.errors.confirmPassword && (
                        <div className="text-red-500">
                          {passwordChnageForm.errors.confirmPassword}
                        </div>
                      )}
                  </div>
                </Grid>
                <div className="mt-4 text-right">
                  <Button type="submit">Change Password</Button>
                </div>
              </form>
            </div>

            {loading ? (
              <div className=" h-[400px] w-full flex py-5">
                <div className="self-center mx-auto">
                  <RotateLoader color="#333" />
                </div>
              </div>
            ) : (
              <div className="px-8 pb-8 pt-4 mt-5 mb-8 drop-shadow-4xl bg-white border-[1px] border-Light-Grey  rounded-xl relative">
                {isprimary && (
                  <div className="bg-gradient-to-r from-[#f3f3f3] to-[#ededed] rounded-[20px] absolute top-[-17px] right-[-12px] p-3">
                    <Button onClick={() => openUserModal()}>
                      {" "}
                      + Add Member
                    </Button>
                  </div>
                )}
                <p className="text-xl font-semibold mb-3">Users List</p>
                <DataTable
                  columns={isprimary ? columns : columns12}
                  data={userList}
                  highlightOnHover
                  sortIcon={
                    <>
                      {" "}
                      <img
                        src={shorting}
                        className="ml-2"
                        alt="shorting"
                      />{" "}
                    </>
                  }
                  noDataComponent={<CustomNoDataComponent />}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Primary Popop */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center py-3">
          <img src={Primary} alt="email Image" className="mx-auto" />
          <p className="text-3xl mb-0 mt-2 font-bold text-light-black">
            {primaryText}
          </p>
          <p className="text-neutral-grey text-base font-medium mt-4">
            {secondaryText} <br />
            Redirecting Back to User List in {timer} Seconds
          </p>
        </div>
      </Modal>

      {/* Modal Delete Popop */}
      <Modal isOpen={isModalOpen1} onClose={closeModal1}>
        <div className="text-center py-3">
          <img src={assign} alt="email Image" className="mx-auto" />
          <p className="text-3xl mb-0 mt-2 font-semibold text-light-black">
            Would you like to delete it?
          </p>
          <Grid className="!grid-cols-4 my-5 ">
            <div className="col-span-1"></div>
            <Button
              onClick={() => {
                deleteUser();
              }}
            >
              Yes
            </Button>
            <Button
              className="border w-full !border-Bright-Grey !bg-[transparent] !text-light-black !text-sm !font-Regular"
              onClick={() => closeModal1()}
            >
              No
            </Button>
            <div className="col-span-1"></div>
          </Grid>
        </div>
      </Modal>

      {/* Modal Delete Msg Popop */}
      <Modal isOpen={isModalOpen12} onClose={closeModal12}>
        <div className="text-center py-3">
          <img src={deleteUser10} alt="email Image" className="mx-auto" />
          <p className="text-3xl mb-0 mt-2 font-semibold text-light-black">
            Deleted Successfully
          </p>
          <p className="text-neutral-grey text-base font-medium mt-2">
            You have successfully deleted this user.
          </p>
          <p className="text-neutral-grey text-base font-medium mt-2">
            Redirecting Back to User List in {timer} seconds
          </p>
        </div>
      </Modal>

      <Modal isOpen={isUserModalOpen} onClose={closeUserModal}>
        <div className=" py-3">
          <p className="text-3xl text-center mb-5 mt-2 font-semibold text-light-black">
            Add New User
          </p>
          <form className="mt-8" onSubmit={userValues.handleSubmit}>
            <Grid className="px-8">
              <div className="col-span-6">
                <Input
                  type="text"
                  name="firstName"
                  label="First Name"
                  required={true}
                  className="!bg-white"
                  placeholder=""
                  maxLength={"30"}
                  value={userValues.values.firstName}
                  onBlur={userValues.handleBlur}
                  onChange={userValues.handleChange}
                  error={
                    userValues.touched.firstName && userValues.errors.firstName
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
                {userValues.touched.lastName && userValues.errors.lastName && (
                  <div className="text-red-500 text-sm pl-2 pt-2">
                    {userValues.errors.lastName}
                  </div>
                )}
              </div>
              <div className="col-span-6">
                <Input
                  type="email"
                  name="email"
                  label="Email"
                  className="!bg-white"
                  required={true}
                  placeholder=""
                  maxLength={"30"}
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
                  onWheelCapture={(e) => {
                    e.preventDefault();
                  }}
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
                  // required={true}
                  placeholder=""
                  maxLength={"30"}
                  value={userValues.values.position}
                  onBlur={userValues.handleBlur}
                  onChange={userValues.handleChange}
                  error={
                    userValues.touched.position && userValues.errors.position
                  }
                />
                {/* {userValues.touched.position && userValues.errors.position && (
        <div className="text-red-500 text-sm pl-2 pt-2">
          {userValues.errors.position}
        </div>
      )} */}
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
            </Grid>
            <Grid className="!grid-cols-5 my-5  px-8">
              <div className="col-span-2">
                <Button
                  className="border w-full !border-Bright-Grey !bg-[transparent] !text-light-black !text-sm !font-Regular"
                  onClick={() => closeUserModal()}
                >
                  Cancel
                </Button>
              </div>

              <div className="col-span-3">
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </div>
            </Grid>
          </form>
        </div>
      </Modal>

      <Modal isOpen={isModalOpen2} onClose={closeModal2}>
        <div className=" py-3">
          <p className="text-3xl text-center mb-5 mt-2 font-semibold text-light-black">
            Edit User
          </p>
          <form className="mt-8" onSubmit={formik1.handleSubmit}>
            <Grid className="px-8">
              <div className="col-span-6">
                <Input
                  type="text"
                  name="firstName"
                  label="First Name"
                  required={true}
                  className="!bg-white"
                  placeholder=""
                  maxLength={"30"}
                  value={formik1.values.firstName}
                  onBlur={formik1.handleBlur}
                  onChange={formik1.handleChange}
                  error={formik1.touched.firstName && formik1.errors.firstName}
                />
                {formik1.touched.firstName && formik1.errors.firstName && (
                  <div className="text-red-500 text-sm pl-2 pt-2">
                    {formik1.errors.firstName}
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
                  value={formik1.values.lastName}
                  onBlur={formik1.handleBlur}
                  onChange={formik1.handleChange}
                  error={formik1.touched.lastName && formik1.errors.lastName}
                />
                {formik1.touched.lastName && formik1.errors.lastName && (
                  <div className="text-red-500 text-sm pl-2 pt-2">
                    {formik1.errors.lastName}
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
                  maxLength={"30"}
                  value={formik1.values.position}
                  onBlur={formik1.handleBlur}
                  onChange={formik1.handleChange}
                  error={formik1.touched.position && formik1.errors.position}
                />
              </div>
              <div className="col-span-6">
                <Input
                  type="tel"
                  name="phoneNumber"
                  label="Phone #"
                  required={true}
                  className="!bg-white"
                  placeholder=""
                  value={formik1.values.phoneNumber}
                  onChange={(e) => {
                    const sanitizedValue = e.target.value.replace(
                      /[^0-9]/g,
                      ""
                    );
                    console.log(sanitizedValue);
                    formik1.handleChange({
                      target: {
                        name: "phoneNumber",
                        value: sanitizedValue,
                      },
                    });
                  }}
                  onBlur={formik1.handleBlur}
                  onWheelCapture={(e) => {
                    e.preventDefault();
                  }}
                  minLength={"10"}
                  maxLength={"10"}
                  error={
                    formik1.touched.phoneNumber && formik1.errors.phoneNumber
                  }
                />
                {(formik1.touched.phoneNumber || formik1.submitCount > 0) &&
                  formik1.errors.phoneNumber && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {formik1.errors.phoneNumber}
                    </div>
                  )}
              </div>
              <div className="col-span-6">
                <Select
                  label="Status"
                  required={true}
                  name="status"
                  placeholder=""
                  onChange={handleSelectChange}
                  disabled={active}
                  className="!bg-white"
                  options={status}
                  value={formik1.values.status}
                  onBlur={formik1.handleBlur}
                  error={formik1.touched.status && formik1.errors.status}
                />
                {formik1.touched.status && formik1.errors.status && (
                  <div className="text-red-500 text-sm pl-2 pt-2">
                    {formik1.errors.status}
                  </div>
                )}
              </div>
            </Grid>
            <Grid className="!grid-cols-5 my-5  px-8">
              <div className="col-span-2">
                <Button
                  className="border w-full !border-Bright-Grey !bg-[transparent] !text-light-black !text-sm !font-Regular"
                  onClick={() => closeModal2()}
                >
                  Cancel
                </Button>
              </div>

              <div className="col-span-3">
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </div>
            </Grid>
          </form>
        </div>
      </Modal>

      <Modal isOpen={isPasswordOpen} onClose={closePassword}>
        <Button
          onClick={closePassword}
          className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-Granite-Gray"
        >
          <img
            src={Cross}
            className="w-full h-full text-black rounded-full p-0"
          />
        </Button>
        <div className="text-center py-3">
          <img src={deleteUser123} alt="email Image" className="mx-auto" />
          <p className="text-3xl mb-0 mt-2 font-bold text-light-black">
            {firstMessage}
          </p>
          <p className="text-neutral-grey text-base font-medium mt-4">
            {secondMessage}
          </p>
        </div>
      </Modal>
    </>
  );
}

export default ResellerUser;
