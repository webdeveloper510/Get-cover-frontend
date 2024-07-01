import React, { useEffect, useRef, useState } from "react";
import Headbar from "../../../common/headBar";
import { Link } from "react-router-dom";
import BackImage from "../../../assets/images/icons/backArrow.svg";
import Grid from "../../../common/grid";
import Input from "../../../common/input";
import Button from "../../../common/button";
import shorting from "../../../assets/images/icons/shorting.svg";
import ActiveIcon from "../../../assets/images/icons/iconAction.svg";
import DataTable from "react-data-table-component";
import Modal from "../../../common/model";
import RadioButton from "../../../common/radio";
import { RotateLoader } from "react-spinners";
import Primary from "../../.././assets/images/SetPrimary.png";
import deleteUser10 from "../../../assets/images/deleteUser.svg";
import deleteUser123 from "../../../assets/images/Disapproved.png";
import make from "../../../assets/images/star.png";
import edit from "../../../assets/images/edit-text.png";
import Cross from "../../../assets/images/Cross.png";
import delete1 from "../../../assets/images/delete.png";
import assign from "../../../assets/images/Unassign.png";
import {
  addSuperAdminMembers,
  changePasswordbyToken,
  changePrimaryById,
  editUserDetailsbyToken,
  getSuperAdminMembers,
  getUserDetailsbyToken,
  sendNotifications,
} from "../../../services/extraServices";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import star from "../../../assets/images/icons/star.svg";
import {
  deleteUserByUserId,
  updateUserDetailsById,
  userDetailsById,
} from "../../../services/userServices";
import Select from "../../../common/select";
import PasswordInput from "../../../common/passwordInput";
import { WithContext as ReactTags } from "react-tag-input";

function Account() {
  const [selectedAction, setSelectedAction] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPrimary, setIsPrimary] = useState(false);
  const [createAccountOption, setCreateAccountOption] = useState("yes");
  const [firstMessage, setFirstMessage] = useState("");
  const [secondMessage, setSecondMessage] = useState("");
  const [tags, setTags] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [timer, setTimer] = useState(3);
  const [isprimary, SetIsprimary] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [memberList, setMemberList] = useState([]);
  const [editLoading, setEditLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [mainStatus, setMainStatus] = useState(true);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [email, setEmail] = useState("");

  const [isModalOpen12, setIsModalOpen12] = useState(false);
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
  });
  const [initialFormValues, setInitialFormValues] = useState({
    lastName: "",
    firstName: "",
    phoneNumber: "",
    position: "",
    status: true,
    id: "",
  });
  const [userDetails, setUserDetails] = useState({});
  const dropdownRef = useRef(null);
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setSelectedAction(null);
    }
  };
  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setInitialFormValues({
      lastName: "",
      firstName: "",
      phoneNumber: "",
      position: "",
      status: true,
      id: "",
    });
    userValues.resetForm();
  };
  useEffect(() => {
    setLoading(true);
    fetchUserDetails();
    setTimeout(() => {
      fetchUserMembers();
    }, 2000);
  }, []);

  useEffect(() => {}, []);

  const fetchUserDetails = async () => {
    try {
      const userDetails = await getSuperAdminMembers();
      // console.log(userDetails?.loginMember, "---------------->>>>>>>>>>>>");
      setIsPrimary(userDetails.loginMember.isPrimary);
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        position,
        notificationTo,
      } = userDetails.loginMember;

      setInitialValues({
        firstName,
        lastName,
        email,
        phoneNumber,
        position,
      });

      const transformedData = notificationTo.map((email) => ({
        id: email,
        text: email,
      }));
      setTags(transformedData);
      const emailStrings = transformedData.map((item) => item.id);

      formikEmail.setFieldValue("notificationTo", emailStrings);
      setEmail(userDetails?.loginMember.email);

      setUserDetails(userDetails.result);
    } catch (error) {
      // setLoading(false);
      console.error("Error fetching user details:", error);
    } finally {
      // setLoading(false);
    }
  };

  const openUserModal = () => {
    setInitialFormValues({
      lastName: "",
      firstName: "",
      phoneNumber: "",
      position: "",
      status: true,
      id: "",
    });
    setIsUserModalOpen(true);
  };
  const status = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];
  const closeModal2 = () => {
    setIsModalOpen2(false);
    setInitialFormValues({
      lastName: "",
      firstName: "",
      phoneNumber: "",
      position: "",
      status: true,
      id: "",
    });
  };
  const closeModal1 = () => {
    setIsModalOpen1(false);
  };
  const openModal2 = () => {
    setIsModalOpen2(true);
  };
  const openModal1 = (id) => {
    setDeleteId(id);
    setIsModalOpen1(true);
  };
  useEffect(() => {
    let intervalId;

    if ((modalOpen || (isModalOpen12 && timer > 0)) && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0) {
      closeModal1();
      setSelectedAction(null);
      setModalOpen(false);
      closeModal12();
      fetchUserMembers();
    }

    if (!modalOpen && !isModalOpen12) {
      clearInterval(intervalId);
      setTimer(3);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [modalOpen, isModalOpen12, timer]);

  const closeModal10 = () => {
    setInitialFormValues({
      lastName: "",
      firstName: "",
      phoneNumber: "",
      position: "",
      status: true,
      id: "",
    });
    setIsUserModalOpen(false);
    setModalOpen(false);
  };

  // const makeUserPrimary = async (row) => {
  //   console.log(row._id);
  //   const result = await changePrimaryById(row._id);
  //   console.log(result);
  //   if (result.code == 200) {
  //     setFirstMessage("It's set to Primary");
  //     setSecondMessage("We have successfully made this user primary");
  //     setModalOpen(true);
  //   }
  // };

  const editUser = async (id) => {
    // console.log(id);
    const result = await userDetailsById(id);
    // console.log(result.result.status);
    SetIsprimary(result.result.isPrimary);
    setMainStatus(result.mainStatus);
    setInitialFormValues({
      id: id,
      lastName: result?.result?.lastName,
      firstName: result?.result?.firstName,
      phoneNumber: result?.result?.phoneNumber,
      position: result?.result?.position,
      status: result?.result?.status,
    });

    setIsUserModalOpen(false);
    openModal2();
    fetchUserMembers();
  };

  const deleteUser = async () => {
    const result = await deleteUserByUserId(deleteId);
    // console.log(result);
    if (result.code === 200) {
      setIsModalOpen12(true);
    }
  };
  const closeModal12 = () => {
    setIsModalOpen12(false);
  };

  const closePassword = () => {
    setIsPasswordOpen(false);
  };

  const handleStatusChange = async (row, newStatus) => {
    // console.log(row);

    try {
      setMemberList((userData) => {
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

      const result = await editUserDetailsbyToken({
        email: row.email,
        status: newStatus === "active" ? true : false,
      });

      // console.log(result);
    } catch (error) {
      console.error("Error in handleStatusChange:", error);
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

  const emailValidationRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
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
      // console.log("Form values:", values);

      setAddLoading(true);
      const result = await addSuperAdminMembers(values);
      if (result.code == 200) {
        setAddLoading(false);
        setFirstMessage("User Added Successfully ");
        setSecondMessage("user added successfully ");
        setModalOpen(true);
        setTimer(3);
        setIsModalOpen1(false);
        setIsUserModalOpen(false);
        userValues.resetForm();
      } else {
        setAddLoading(false);
        if (result.code === 401) {
          userValues.setFieldError("email", "Email already in use");
        }
      }
      closeModal2();
    },
  });

  const handleSelectChange = async (name, value) => {
    formik.setFieldValue(name, value);
  };
  const formik = useFormik({
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
      // console.log("Form values:", values);
      setEditLoading(true);
      const result = await updateUserDetailsById(values);
      // console.log(result);
      if (result.code == 200) {
        // setLoading(false);
        setEditLoading(false);
        setFirstMessage("User Updated Successfully ");
        setSecondMessage("user updated successfully ");
        setModalOpen(true);
        setTimer(3);
        fetchUserMembers();
      } else {
        setEditLoading(false);
      }
      closeModal2();
    },
  });

  const initialValues2 = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const handleSubmit = (values, { setSubmitting }) => {
    // console.log(values);
    passwordChange(values);
    setSubmitting(false);
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

  const calculateDropdownPosition = (index) => {
    const isCloseToBottom = memberList.length - index <= 10000;
    return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
  };

  const handleRadioChange = (event) => {
    const selectedValue = event.target.value;
    // console.log(selectedValue);
    userValues.setFieldValue("status", selectedValue === "yes" ? true : false);
    setCreateAccountOption(selectedValue);
  };
  const formikEmail = useFormik({
    initialValues: {
      notificationTo: [],
    },
    validationSchema: Yup.object({
      notificationTo: Yup.array()
        .of(
          Yup.string()
            .matches(emailValidationRegex, "Invalid email address")
            .required("Email is required")
        )
        .min(1, "At least one email is required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const result = await sendNotifications(values);
        // console.log(result);
        if (result.code == 200) {
          fetchUserMembers();
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    },
  });
  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .transform((originalValue) => originalValue.trim())
      .required("First Name is required"),
    lastName: Yup.string()
      .transform((originalValue) => originalValue.trim())
      .required("Last Name is required"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Invalid phone number")
      .required("Phone number is required"),
    // position: Yup.string().required("Position is required"),
  });

  const KeyCodes = {
    comma: 188,
    space: 32,
    enter: 13,
  };
  const delimiters = [188, 13]; // comma and enter

  const handleDelete = (i) => {
    const newTags = tags.slice(0);
    newTags.splice(i, 1);
    setTags(newTags);
    formikEmail.setFieldValue(
      "notificationTo",
      newTags.map((tag) => tag.text)
    );
  };

  const handleAddition = (tag) => {
    const newTags = [...tags, tag];
    setTags(newTags);
    formikEmail.setFieldValue(
      "notificationTo",
      newTags.map((tag) => tag.text)
    );
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice(0);
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    setTags(newTags);
    formikEmail.setFieldValue(
      "notificationTo",
      newTags.map((tag) => tag.text)
    );
  };

  const handleTagClick = (index) => {
    console.log(`Tag at index ${index} was clicked`);
  };

  const columns = [
    {
      name: "Name",
      selector: "name",
      // sortable: true,
      cell: (row) => (
        <div className="flex relative">
          {row.isPrimary && (
            <img src={star} alt="" className="absolute -left-3 top-0" />
          )}
          <span className="self-center pt-2 ml-3">
            {row.firstName} {row.lastName}
          </span>
        </div>
      ),
    },

    {
      name: "Email",
      selector: (row) => row?.email,
      // sortable: true,
      minWidth: "220px",
    },
    {
      name: "Phone #",
      selector: (row) => "+1 " + formatPhoneNumber(row?.phoneNumber),
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
            disabled={row.isPrimary}
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
      minWidth: "auto",
      maxWidth: "90px",
      cell: (row, index) => {
        // console.log(index, index % 10 == 9)
        return (
          <>
            {!row.isPrimary && (
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
                    className="cursor-pointer w-[35px]"
                    alt="Active Icon"
                  />
                </div>
                {selectedAction === row.email && (
                  <div
                    ref={dropdownRef}
                    className={`absolute z-[9999] ${
                      !row.isPrimary ? "w-[130px]" : "w-[80px]"
                    } drop-shadow-5xl -right-3 mt-2 bg-white py-1 border rounded-lg shadow-md ${calculateDropdownPosition(
                      index
                    )}`}
                  >
                    {/* {!row.isPrimary && row.status && (
                      <div
                        onClick={() => makeUserPrimary(row)}
                        className="text-left cursor-pointer flex border-b hover:font-semibold py-1 px-2"
                      >
                        <img src={make} className="w-4 h-4 mr-2" />{" "}
                        <span className="self-center"> Make Primary </span>
                      </div>
                    )} */}

                    <div
                      onClick={() => editUser(row._id)}
                      className="text-left cursor-pointer flex border-b hover:font-semibold py-1 px-2"
                    >
                      <img src={edit} className="w-4 h-4 mr-2" />{" "}
                      <span className="self-center">Edit </span>
                    </div>
                    {!row.isPrimary && (
                      <div
                        onClick={() => openModal1(row._id)}
                        className="text-left cursor-pointer flex hover:font-semibold py-1 px-2"
                      >
                        <img src={delete1} className="w-4 h-4 mr-2" />{" "}
                        <span className="self-center">Delete</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        );
      },
    },
  ];
  const columns1 = [
    {
      name: "Name",
      selector: "name",
      sortable: true,
      cell: (row) => (
        <div className="flex relative">
          {row.isPrimary && (
            <img src={star} alt="" className="absolute -left-3 top-0" />
          )}
          <span className="self-center pt-2 ml-3">
            {row.firstName} {row.lastName}
          </span>
        </div>
      ),
    },

    {
      name: "Email",
      selector: (row) => row?.email,
      sortable: true,
      minWidth: "220px",
    },
    {
      name: "Phone #",
      selector: (row) => "+1 " + formatPhoneNumber(row?.phoneNumber),
      sortable: true,
    },
    {
      name: "Position",
      selector: (row) => row.position,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
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

  const CustomNoDataComponent = () => (
    <div className="text-center my-5">
      <p>No records found.</p>
    </div>
  );

  const editDetail = async (values) => {
    setLoading(true);
    console.log(values);

    try {
      const res = await editUserDetailsbyToken(values);
      console.log(res);
      await fetchUserDetails();
      fetchUserMembers();
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const fetchUserMembers = async () => {
    try {
      const members = await getSuperAdminMembers();
      console.log(members, "111111111111111111111111111111");
      setMemberList(members.result);
      let local = JSON.parse(localStorage.getItem("userDetails"));
      // localStorage.removeItem('userDetails')
      local.userInfo = {
        lastName: members?.loginMember?.lastName,
        firstName: members?.loginMember?.firstName,
      };
      localStorage.setItem("userDetails", JSON.stringify(local));
      console.log(local, "---------------");
    } catch (error) {
      setLoading(false);
      console.error("Error fetching user members:", error);
    } finally {
      setLoading(false);
    }
  };

  const passwordChange = async (value) => {
    setLoading(true);
    delete value.confirmPassword;

    try {
      const res = await changePasswordbyToken(value);
      if (res.code == 200) {
        setFirstMessage("Updated  Successfully ");
        setSecondMessage("User Password Updated  successfully ");
        setModalOpen(true);
        setTimer(3);
        passwordChnageForm.resetForm();
      } else {
        setFirstMessage("Error");
        setSecondMessage(res.message);
        setIsPasswordOpen(true);
        passwordChnageForm.resetForm();
      }
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setLoading(false);
    }

    console.log(value);
  };

  return (
    <>
      {loading ? (
        <>
          <div className=" h-[500px] w-full flex py-5">
            <div className="self-center mx-auto">
              <RotateLoader color="#333" />
            </div>
          </div>
        </>
      ) : (
        <div className="mb-8 ml-3">
          <Headbar />
          <div className="flex mt-2">
            <Link
              to={"/dashboard"}
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
                Manage Account
              </p>
              <ul className="flex self-center">
                <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
                  {" "}
                  Edit Account{" "}
                </li>
              </ul>
            </div>
          </div>

          <div className="px-8 pb-8 pt-4 mt-5 mb-8 drop-shadow-4xl bg-white border-[1px] border-Light-Grey  rounded-xl relative">
            <p className="text-xl font-semibold mb-3">My Account</p>

            <>
              <Grid>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={(values, { setSubmitting }) => {
                    editDetail(values);
                    setSubmitting(false);
                    fetchUserDetails();
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form className="col-span-12">
                      <Grid>
                        <div className="col-span-4">
                          <div className="bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1">
                            <p className="text-sm m-0 p-0">Email</p>
                            <p className="font-semibold">{email}</p>
                          </div>
                        </div>
                        <div className="col-span-4">
                          <div className="relative">
                            <label
                              htmlFor="First Name"
                              className={`absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-white left-2 px-1 -translate-y-4 scale-75`}
                            >
                              First Name
                            </label>

                            <Field
                              type="text"
                              name="firstName"
                              placeholder=""
                              className="block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer"
                            />
                            <ErrorMessage
                              name="firstName"
                              component="div"
                              className="text-red-500"
                            />
                          </div>
                        </div>
                        <div className="col-span-4">
                          <div className="relative">
                            <label
                              htmlFor="Last Name"
                              className={`absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-white left-2 px-1 -translate-y-4 scale-75`}
                            >
                              Last Name
                            </label>
                            <Field
                              type="text"
                              name="lastName"
                              placeholder=""
                              className="block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer"
                            />
                            <ErrorMessage
                              name="lastName"
                              component="div"
                              className="text-red-500"
                            />
                          </div>
                        </div>
                        <div className="col-span-4">
                          <div className="relative">
                            <label
                              htmlFor="Phone #"
                              className={`absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-white left-2 px-1 -translate-y-4 scale-75`}
                            >
                              Phone #
                            </label>
                            <div className="text-base font-semibold absolute top-[17px] left-[10px]">
                              +1
                            </div>
                            <Field
                              type="tel"
                              name="phoneNumber"
                              placeholder=""
                              minLength={10}
                              maxLength={10}
                              className="block pr-2.5 pb-2.5 pl-[30px] pt-4 w-full text-base font-semibold bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer"
                            />
                            <ErrorMessage
                              name="phoneNumber"
                              component="div"
                              className="text-red-500"
                            />
                          </div>
                        </div>
                        <div className="col-span-4">
                          <div className="relative">
                            <label
                              htmlFor="Position"
                              className={`absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-white left-2 px-1 -translate-y-4 scale-75`}
                            >
                              Position
                            </label>
                            <Field
                              type="text"
                              name="position"
                              placeholder=""
                              className="block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer"
                            />
                            <ErrorMessage
                              name="position"
                              component="div"
                              className="text-red-500"
                            />
                          </div>
                        </div>

                        <div className="col-span-4 text-right">
                          <Button type="submit" disabled={isSubmitting}>
                            Save Changes
                          </Button>
                        </div>
                      </Grid>
                    </Form>
                  )}
                </Formik>
                <div className="col-span-12">
                  <form onSubmit={formikEmail.handleSubmit}>
                    <p className="text-xl font-semibold mb-4">
                      Send Notification
                    </p>
                    <div className="relative">
                      <label
                        htmlFor="email"
                        className="absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-white left-2 px-1 -translate-y-4 scale-75"
                      >
                        Send Notification to
                      </label>
                      <div className="block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold bg-transparent rounded-lg border border-gray-300 appearance-none peer">
                        <ReactTags
                          tags={tags}
                          delimiters={delimiters}
                          name="email"
                          handleDelete={handleDelete}
                          handleAddition={handleAddition}
                          handleDrag={handleDrag}
                          handleTagClick={handleTagClick}
                          inputFieldPosition="bottom"
                          autocomplete
                          editable
                          placeholder=""
                        />
                      </div>
                    </div>
                    {formikEmail.errors.notificationTo && (
                      <p className="text-red-500 text-sm pl-2 mt-1 mb-5">
                        {(() => {
                          const uniqueErrors = new Set();
                          return formikEmail.errors.notificationTo.map(
                            (error, index) => {
                              if (!uniqueErrors.has(error)) {
                                uniqueErrors.add(error);

                                return (
                                  <span key={index}>
                                    {index > 0 && " "}{" "}
                                    <span className="font-semibold">
                                      {" "}
                                      {error}{" "}
                                    </span>
                                  </span>
                                );
                              }
                              return null;
                            }
                          );
                        })()}
                      </p>
                    )}

                    <div className="col-span-12 text-right mt-5">
                      <Button type="submit">Save</Button>
                    </div>
                  </form>
                </div>
                {/* <div className="col-span-12">
                  <p className="text-xl font-semibold mb-4">
                    Send Notification
                  </p>
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-white left-2 px-1 -translate-y-4 scale-75"
                    >
                      Send Notification to
                    </label>
                    <div className="block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold bg-transparent rounded-lg border border-gray-300 appearance-none peer ">
                      <ReactTags
                        tags={tags}
                        delimiters={delimiters}
                        name="email"
                        handleDelete={handleDelete}
                        handleAddition={handleAddition}
                        autocomplete="off"
                        handleDrag={handleDrag}
                        handleTagClick={handleTagClick}
                        inputFieldPosition="bottom"
                        editable
                        placeholder=""
                      />
                    </div>
                  </div>
                  {formik.errors.email && (
                    <p className="text-red-500 text-sm pl-2 mt-1 mb-5">
                      {formik.errors.email &&
                        (Array.isArray(formik.errors.email)
                          ? formik.errors.email.map((error, index) => (
                              <span key={index}>
                                {index > 0 && " "}
                                <span className="font-semibold"> {error} </span>
                              </span>
                            ))
                          : formik.errors.email)}
                    </p>
                  )}
                </div>
                <div className="col-span-12 text-right">
                  <Button type="submit">Save</Button>
                </div> */}
              </Grid>
            </>

            <p className="text-xl font-semibold mb-3">Change Password</p>

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
            <div className="h-[400px] w-full flex py-5">
              <div className="self-center mx-auto">
                <RotateLoader color="#333" />
              </div>
            </div>
          ) : (
            <div className="px-8 pb-8 pt-4 mt-5 mb-8 drop-shadow-4xl bg-white border-[1px] border-Light-Grey rounded-xl relative">
              {isPrimary && (
                <div className="bg-gradient-to-r from-[#dfdfdf] to-[#e9e9e9] rounded-[20px] absolute top-[-17px] right-[-12px] p-3">
                  <Button onClick={() => openUserModal()}>+ Add Member</Button>
                </div>
              )}

              <p className="text-xl font-semibold mb-3">
                Other Super admin details
              </p>

              <DataTable
                draggableColumns={false}
                columns={isPrimary ? columns : columns1}
                data={memberList}
                highlightOnHover
                sortIcon={
                  <img src={shorting} className="ml-2" alt="shorting" />
                }
                noDataComponent={<CustomNoDataComponent />}
              />
            </div>
          )}
        </div>
      )}

      <Modal isOpen={isUserModalOpen} onClose={closeUserModal}>
        {addLoading ? (
          <div className="h-[400px] w-full flex py-5">
            <div className="self-center mx-auto">
              <RotateLoader color="#333" />
            </div>
          </div>
        ) : (
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
                    type="email"
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
              <Grid className="drop-shadow-5xl px-8">
                <div className="col-span-4">
                  <Button
                    type="button"
                    className="border w-full !border-Bright-Grey !bg-[transparent] !text-light-black !text-sm !font-Regular"
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
        )}
      </Modal>

      <Modal isOpen={isModalOpen2} onClose={closeModal2}>
        {editLoading ? (
          <div className="h-[400px] w-full flex py-5">
            <div className="self-center mx-auto">
              <RotateLoader color="#333" />
            </div>
          </div>
        ) : (
          <div className=" py-3">
            <p className="text-3xl text-center mb-5 mt-2 font-semibold text-light-black">
              Edit User
            </p>
            <form className="mt-8" onSubmit={formik.handleSubmit}>
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
                    required={true}
                    placeholder=""
                    className="!bg-white"
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
                    name="position"
                    label="Position"
                    className="!bg-white"
                    placeholder=""
                    maxLength={"30"}
                    value={formik.values.position}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    error={formik.touched.position && formik.errors.position}
                  />
                </div>
                <div className="col-span-6">
                  <Input
                    type="tel"
                    name="phoneNumber"
                    label="Phone Number"
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
                  <Select
                    label="Status"
                    required={true}
                    name="status"
                    placeholder=""
                    onChange={handleSelectChange}
                    disabled={isprimary}
                    className="!bg-white"
                    options={status}
                    value={formik.values.status}
                    onBlur={formik.handleBlur}
                    error={formik.touched.status && formik.errors.status}
                  />
                  {formik.touched.status && formik.errors.status && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {formik.errors.status}
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
        )}
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

export default Account;
