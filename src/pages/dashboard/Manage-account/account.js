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
import info from "../../../assets/images/info.svg";
import edit from "../../../assets/images/edit-text.png";
import Cross from "../../../assets/images/Cross.png";
import delete1 from "../../../assets/images/delete.png";
import assign from "../../../assets/images/Unassign.png";
import Cross1 from "../../../assets/images/Cross_Button.png";
import {
  addSuperAdminMembers,
  changePasswordbyToken,
  changePrimaryById,
  editUserDetailsbyToken,
  getSuperAdminMembers,
  uploadFile,
  saveSetting,
  getSetting,
  sendNotifications,
  resetSetting,
  resetDefault,
  updateThreshHoldLimit,
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
import { MultiSelect } from "react-multi-select-component";
import CommonTooltip from "../../../common/toolTip";
import Card from "../../../common/card";
import CollapsibleDiv from "../../../common/collapsibleDiv";
import SwitchButton from "../../../common/switch";
import { editOption, getOptions } from "../../../services/claimServices";
import SingleView from "../../../common/singleView";

function Account() {
  const [repairValue, repair_status] = useState({});
  const [customerValue, customer_status] = useState({});
  const [coverageType, coverage_type] = useState({});
  const [claimvalues, claim_status] = useState({});
  const [shipment, shipment_type] = useState({});
  const [selectedAction, setSelectedAction] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPrimary, setIsPrimary] = useState(false);
  const [createAccountOption, setCreateAccountOption] = useState("yes");
  const [createthreshold, setCreatethreshold] = useState("no");
  const [firstMessage, setFirstMessage] = useState("");
  const [secondMessage, setSecondMessage] = useState("");
  const [lastMessage, setLastMessage] = useState("");
  const [tags, setTags] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [timer, setTimer] = useState(3);
  const [isSetDefalt, setIsSetDefalt] = useState(false);
  const [isprimary, SetIsprimary] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [memberList, setMemberList] = useState([]);
  const [editLoading, setEditLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [mainStatus, setMainStatus] = useState(true);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedFile2, setSelectedFile2] = useState(null);
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
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
  const [sections, setSections] = useState([]);
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
    fetchUserDetails12();
    setTimeout(() => {
      fetchUserMembers();
    }, 2000);
  }, []);

  useEffect(() => { }, []);

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

  const closeDefalt = () => {
    setIsSetDefalt(false);
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

  const handleRadioChange1 = (event) => {
    const selectedValue = event.target.value;
    userValues.setFieldValue("status", selectedValue === "yes" ? true : false);
    setCreatethreshold(selectedValue);
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
  });

  const handleAddition = (tag) => {
    const newTags = [...tag];
    setSelectedEmail(tag);
    formikEmail.setFieldValue(
      "notificationTo",
      newTags.map((tag) => tag.value)
    );
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
            className={` ${row.status === true ? "bg-[#6BD133]" : "bg-[#FF4747]"
              } absolute h-3 w-3 rounded-full top-[33%] ml-[8px]`}
          ></div>
          <select
            disabled={row.isPrimary}
            value={row.status === true ? "active" : "inactive"}
            onChange={(e) => handleStatusChange(row, e.target.value)}
            className="text-[12px] border border-gray-300 text-[#727378] pl-[20px] py-2 pr-1 font-semibold rounded-xl"
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
                    className={`absolute z-[9999] ${!row.isPrimary ? "w-[130px]" : "w-[80px]"
                      } drop-shadow-5xl -right-3 mt-2 bg-white text-light-black py-1 border rounded-lg shadow-md ${calculateDropdownPosition(
                        index
                      )}`}
                  >
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
            className={` ${row.status === true ? "bg-[#6BD133]" : "bg-[#FF4747]"
              } absolute h-3 w-3 rounded-full top-[33%] ml-[8px]`}
          ></div>
          <select
            disabled={true}
            value={row.status === true ? "active" : "inactive"}
            onChange={(e) => handleStatusChange(row, e.target.value)}
            className="text-[12px] border border-gray-300 text-[#727378] pl-[20px] py-2 pr-1 font-semibold rounded-xl"
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
    getClaimOptions()
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const fetchUserMembers = async () => {
    try {
      const members = await getSuperAdminMembers();
      console.log(members.loginMember.threshHoldLimit.value, "111111111111111111111111111111");
      setMemberList(members.result);
      setCreatethreshold(members.loginMember?.isThreshHoldLimit == false ? 'no' : 'yes')
      thresholdLimit.setFieldValue("value", members.loginMember.threshHoldLimit.value);
      let arr = [];
      let arr1 = [];
      members?.result?.map((email) => {
        let data = {
          label: email.email,
          value: email.email,
        };
        arr.push(data);
        if (email.isPrimary == true) {
          email?.notificationTo?.map((notificationEmail) => {
            console.log(notificationEmail);
            let emailData = {
              label: notificationEmail,
              value: notificationEmail,
            };
            arr1.push(emailData);
          });
        }
      });

      setEmails(arr);
      setSelectedEmail(arr1);
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
  const [selectedEmail, setSelectedEmail] = useState([]);
  const [emails, setEmails] = useState([]);
  const handleButtonClick = (button) => {
    setActiveButton(button);
  };
  const [activeButton, setActiveButton] = useState("myAccount");
  const [selectedFile1, setSelectedFile1] = useState();
  const [selectedFile, setSelectedFile] = useState();
  const handleFileChange = (event, setterFunction, fieldName) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      uploadFile(formData).then((res) => {
        console.log("API response:", res);
        if (res && res.result) {
          siteChange.setFieldValue(fieldName, res.result);
          setterFunction(res.result);
        } else {
          console.error("Unexpected response format:", res);
        }
      }).catch((error) => {
        console.error("Error uploading file:", error);
      });
    }
  };
  const handleRemoveFile = (setterFunction, fieldName) => {
    if (inputRef1.current) {
      inputRef1.current.value = null;
      siteChange.setFieldValue(fieldName, "");
      setterFunction(null);
    }
  };
  const [thresholdAmount, setThresholdAmount] = useState("");
  const [sideBarColor, setSideBarColor] = useState('');
  const [sideBarTextColor, setSideBarTextColor] = useState('');
  const [sideBarButtonColor, setSideBarButtonColor] = useState('');
  const [sideBarButtonTextColor, setSideBarButtonTextColor] = useState('');
  const [buttonColor, setButtonColor] = useState('');
  const [buttonTextColor, setButtonTextColor] = useState('');
  const [backGroundColor, setBackGroundColor] = useState('');
  const [modelBackgroundColor, setModelBackgroundColor] = useState('');
  const [modelColor, setModelColor] = useState('');
  const [cardBackGroundColor, setCardBackGroundColor] = useState('');
  const [cardColor, setCardColor] = useState('');
  const [textColor, setTextColor] = useState('');
  const [titleColor, setTitleColor] = useState('');
  const [title, setTitle] = useState('');
  const [bankDetails, setBankDetails] = useState('');
  const [address, setAddress] = useState('');
  const [defaults, setDefaults] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);
  const [showdata, setShowdata] = useState(true);
  const handleColorChange = (field, setter) => (event) => {
    const newColor = event.target.value;
    setter(newColor);
    siteChange.setFieldValue(field, newColor);
    setDefaults(false);
  };


  const fetchUserDetails12 = async () => {
    try {
      const userDetails = await getSetting();
      console.log(userDetails);

      if (userDetails.result && userDetails.result[0].colorScheme) {
        const colorScheme = userDetails.result[0].colorScheme;
        colorScheme.forEach(color => {
          switch (color.colorType) {
            case 'sideBarColor':
              setSideBarColor(color.colorCode);
              break;
            case 'sideBarTextColor':
              setSideBarTextColor(color.colorCode);
              break;
            case 'sideBarButtonColor':
              setSideBarButtonColor(color.colorCode);
              break;
            case 'sideBarButtonTextColor':
              setSideBarButtonTextColor(color.colorCode);
              break;
            case 'buttonColor':
              setButtonColor(color.colorCode);
              break;
            case 'buttonTextColor':
              setButtonTextColor(color.colorCode);
              break;
            case 'backGroundColor':
              setBackGroundColor(color.colorCode);
              break;
            case 'textColor':
              setTextColor(color.colorCode);
              break;
            case 'titleColor':
              setTitleColor(color.colorCode);
              break;
            case 'cardColor':
              setCardColor(color.colorCode);
              break;
            case 'cardBackGroundColor':
              setCardBackGroundColor(color.colorCode);
              break;
            case 'modelBackgroundColor':
              setModelBackgroundColor(color.colorCode);
              break;
            case 'modelColor':
              setModelColor(color.colorCode);
              break;
            default:
              break;
          }
        });
      }
      if (userDetails && userDetails.result) {
        setTitle(userDetails.result[0].title);
        setSelectedFile2(userDetails.result[0].favIcon || null);
        setSelectedFile1(userDetails.result[0].logoLight || null);
        setSelectedFile(userDetails.result[0].logoDark || null);
        setAddress(userDetails.result[0].address);
        setBankDetails(userDetails.result[0].paymentDetail);
        setDefaults(userDetails.result[0].setDefault === 0 ? true : false);

      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  const siteChange = useFormik({
    initialValues: {
      favIcon: selectedFile2,
      logoImage: selectedFile1,
      title: title,
      sideBarColor: sideBarColor,
      sideBarTextColor: sideBarTextColor,
      sideBarButtonColor: sideBarButtonColor,
      sideBarButtonTextColor: sideBarButtonTextColor,
      buttonColor: buttonColor,
      buttonTextColor: buttonTextColor,
      backGroundColor: backGroundColor,
      textColor: textColor,
      titleColor: titleColor,
      modelColor: modelColor,
      modelBackgroundColor: modelBackgroundColor,
      cardBackGroundColor: cardBackGroundColor,
      cardColor: cardColor,
      paymentDetail: bankDetails,
      address: address,

    },
    validationSchema: Yup.object({
      favIcon: Yup.mixed().nullable(),
    }),
    onSubmit: async (values) => {

      try {
        setLoading(true);
        const colorScheme = [
          { colorCode: values.sideBarColor || sideBarColor, colorType: "sideBarColor" },
          { colorCode: values.sideBarTextColor || sideBarTextColor, colorType: "sideBarTextColor" },
          { colorCode: values.sideBarButtonColor || sideBarButtonColor, colorType: "sideBarButtonColor" },
          { colorCode: values.sideBarButtonTextColor || sideBarButtonTextColor, colorType: "sideBarButtonTextColor" },
          { colorCode: values.buttonColor || buttonColor, colorType: "buttonColor" },
          { colorCode: values.buttonTextColor || buttonTextColor, colorType: "buttonTextColor" },
          { colorCode: values.backGroundColor || backGroundColor, colorType: "backGroundColor" },
          { colorCode: values.textColor || textColor, colorType: "textColor" },
          { colorCode: values.titleColor || titleColor, colorType: "titleColor" },
          { colorCode: values.cardColor || cardColor, colorType: "cardColor" },
          { colorCode: values.cardBackGroundColor || cardBackGroundColor, colorType: "cardBackGroundColor" },
          { colorCode: values.modelBackgroundColor || modelBackgroundColor, colorType: "modelBackgroundColor" },
          { colorCode: values.modelColor || modelColor, colorType: "modelColor" }
        ];
        const apiData = {
          favIcon: values.favIcon || selectedFile2,
          colorScheme: colorScheme,
          title: values.title || title,
          logoLight: values.logoLight || selectedFile1,
          logoDark: values.logoDark || selectedFile,
          address: values.address || address,
          paymentDetail: values.bankDetails || bankDetails,
        };
        console.log(apiData);
        const result = await saveSetting(apiData);
        console.log(result);
        if (result) {
          localStorage.setItem('siteSettings', JSON.stringify(result.result))
        }
        setFirstMessage("Site Setting Updated Successfully ");
        setSecondMessage("site setting updated successfully ");
        setLastMessage("site will be reloaded after setting has been updated successfully");
        setModalOpen(true);
        setTimer(3);

        setTimeout(() => {
          window.location.reload()
        }, 3000);
        // setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    },
  });

  const handleReset = async () => {
    setLoading(true);
    try {
      const data = await resetSetting();
      console.log(data)
      if (data) {
        localStorage.setItem('siteSettings', JSON.stringify(data.result))
      }
      setFirstMessage("Site Setting Reset Successfully ");
      setSecondMessage("Site setting Reset successfully ");
      setLastMessage("Site will be reloaded after setting has been reset successfully");
      setModalOpen(true);
      setTimer(3);
      fetchUserDetails12();
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error('Error resetting settings:', error);

    }
  };

  const handleDefault = async () => {
    setIsSetDefalt(false);
    setLoading(true);
    try {
      const data = await resetDefault();
      setFirstMessage(" Successfully ");
      setSecondMessage("Default color set successfully ");
      setModalOpen(true);
      setLoading(false);
      setTimer(3);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      setFirstMessage(" Error ");
      setSecondMessage(error.message);
      setModalOpen(true);
      console.error('Error Default settings:', error);
    }
  };

  const getClaimOptions = async () => {
    try {
      const data = [
        "repair_status",
        "shipment_type",
        "customer_status",
        "coverage_type",
        "claim_status",
      ];
      const result = await getOptions(data, 0);
      const stateSetters = {
        repair_status,
        shipment_type,
        customer_status,
        coverage_type,
        claim_status,
      };

      data.forEach((key, index) => {
        stateSetters[key]?.(result.result[index]);
      });

      setSections([
        { title: "Coverage Types", data: result.result[3] },
        { title: "Repair Status", data: result.result[0] },
        { title: "Customer Status", data: result.result[2] },
        { title: "Shipment Types", data: result.result[1] },
        { title: "Claim Status", data: result.result[4] },
      ]);
    } catch (error) {
      console.error("Error fetching claim options:", error);
    }
  };

  const [labels, setLabels] = useState(Array(sections.length).fill(""));
  const [values, setValues] = useState(Array(sections.length).fill(""));
  const [editingIndex, setEditingIndex] = useState(null);

  const [editingRowId, setEditingRowId] = useState(null);

  const handleEditOption = (id, sectionData, index) => {
    const row = sectionData.value.find(item => item._id === id);
    if (row) {
      setLabels((prev) => {
        const newLabels = [...prev];
        newLabels[index] = row.label;
        return newLabels;
      });

      setValues((prev) => {
        const newValues = [...prev];
        newValues[index] = row.value;
        return newValues;
      });
      setEditingRowId(id)
      setEditingIndex(index);
    }
  };

  const handleLabelChange = (index, value) => {
    const newLabels = [...labels];
    newLabels[index] = value;
    setLabels(newLabels);
  };

  const handleValueChange = (index, value) => {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
  };

  const handleAddOrUpdate = async (editingRowId, labelId, sectionIndex, toggleValue = false) => {
    const currentLabel = labels[sectionIndex];
    const currentValue = values[sectionIndex];
    if (!toggleValue && (!currentLabel || !currentValue)) {
      console.error('Label or value is empty, operation aborted.');
      return;
    }

    try {
      const updatedSections = [...sections];
      if (toggleValue) {
        updatedSections[sectionIndex].data.value = updatedSections[sectionIndex].data.value.map((item) =>
          item._id === editingRowId
            ? { ...item, status: !item.status }
            : item
        );
      }
      else {
        if (editingRowId !== null && labelId) {
          console.log('Updating row', editingRowId, labelId);
          updatedSections[sectionIndex].data.value = updatedSections[sectionIndex].data.value.map((item) =>
            item._id === editingRowId
              ? { ...item, label: currentLabel, value: currentValue }
              : item
          );
        } else {
          updatedSections[sectionIndex].data.value = [
            ...updatedSections[sectionIndex].data.value,
            { status: true, value: currentValue, label: currentLabel },
          ];
        }
      }
      setSections(updatedSections);
      const res = await editOption(updatedSections[sectionIndex]);
      console.log('API response:', res);
      if (res.code == 200) {
        getClaimOptions()
      }

      setLabels((prev) => {
        const newLabels = [...prev];
        newLabels[sectionIndex] = '';
        return newLabels;
      });

      setValues((prev) => {
        const newValues = [...prev];
        newValues[sectionIndex] = '';
        return newValues;
      });

      setEditingIndex(null);
    } catch (error) {
      console.error('Failed to add/update option:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setEditingIndex(null);
    setLabels((prev) => prev.map(() => ''));
    setValues((prev) => prev.map(() => ''));
  };

  const handleThresholdChange = (e) => {
    setThresholdAmount(e.target.value);
    formik.handleChange(e);
  };

  const thresholdLimit = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: Yup.object({
      value: Yup.number()
        .max(100, "Cannot enter more than 100%")
        .min(0, "Cannot enter less than 0%")
        .required("Threshold value is required"),
    }),
    onSubmit: async (values) => {
      const payload = {
        isThreshHoldLimit: createthreshold === 'yes' ? true : false,
        threshHoldLimit: {
          amountType: "percentage",
          value: parseFloat(values.value),
        },
      };

      try {
        const response = await updateThreshHoldLimit(payload);
        console.log("Threshold updated:", response);
      } catch (error) {
        console.error("Error updating threshold:", error);
      }
    },
  });


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
                <li className="text-sm text-neutral-grey font-semibold ml-1 pt-[1px]">
                  {" "}
                  Edit Account{" "}
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-5">
            <div
              className={` rounded-[30px] px-2 py-3 border-[1px] border-Light-Grey w-1/2 flex`}>
              <Button
                className={`flex self-center mr-2 w-[95%] !px-2 !py-1 rounded-xl border-[1px] border-Light-Grey ${activeButton != "myAccount" ? "!bg-grayf9 !text-black" : ""
                  }`}
                onClick={() => handleButtonClick("myAccount")}
              >   My Account</Button>
              <Button
                className={`flex self-center mr-2 w-[95%] !px-2 !py-1 rounded-xl border-[1px] border-Light-Grey ${activeButton != "siteSetting" ? "!bg-grayf9 !text-black" : ""
                  }`}
                onClick={() => handleButtonClick("siteSetting")}
              >   Site Setting</Button>
              <Button
                className={`flex self-center mr-2 w-[95%] !px-2 !py-1 rounded-xl border-[1px] border-Light-Grey ${activeButton != "Settings" ? "!bg-grayf9 !text-black" : ""
                  }`}
                onClick={() => handleButtonClick("Settings")}
              >   Option Settings</Button>
            </div>
          </div>

          {activeButton === "myAccount" && (
            <>
              <Card className="px-8 pb-8 pt-4 mt-5 mb-8 drop-shadow-4xl bg-white border-[1px] border-Light-Grey  rounded-xl relative z-10">
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
                              <div className="rounded-lg px-4 pb-2 pt-1" style={{ backgroundColor: backGroundColor, color: textColor }}>
                                <p className="text-sm m-0 p-0 text-light-black">Email</p>
                                <p className="font-semibold text-light-black">{email}</p>
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
                          <div className="block w-full text-base font-semibold bg-transparent rounded-lg border border-gray-300">
                            <MultiSelect
                              label="Email"
                              name="Email"
                              placeholder="Email"
                              value={selectedEmail}
                              options={emails}
                              pName="Email"
                              onChange={(value) => {
                                console.log("value", value);
                                setSelectedEmail(value);
                                handleAddition(value);
                                // handleFilterChange("priceBookId", value);
                              }}
                              labelledBy="Select"
                              overrideStrings={{
                                selectSomeItems: "Select Email",
                              }}
                              className="SearchSelect css-b62m3t-container red !border-[0px] p-[0.425rem]"
                            />
                          </div>
                        </div>
                        {formikEmail.errors.notificationTo && Array.isArray(formikEmail.errors.notificationTo) && (
                          <p className="text-red-500 text-sm pl-2 mt-1 mb-5">
                            {(() => {
                              const uniqueErrors = new Set();
                              return formikEmail.errors.notificationTo.map((error, index) => {
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
                              });
                            })()}
                          </p>
                        )}

                        <div className="col-span-12 text-right mt-5">
                          <Button type="submit">Save</Button>
                        </div>
                      </form>
                    </div>
                  </Grid>
                </>
                <p className="text-xl font-semibold mb-3">Threshold Limit</p>
                <Grid>
                  <div className="col-span-6">
                    <p className=" flex text-[16px] font-semibold mt-3 mb-6">
                      Do you want to add threshold limit?
                      <RadioButton
                        id="yes-add-threshold"
                        label="Yes"
                        value="yes"
                        checked={createthreshold === "yes"}
                        onChange={handleRadioChange1}
                      />
                      <RadioButton
                        id="no-add-threshold"
                        label="No"
                        value="no"
                        checked={createthreshold === "no"}
                        onChange={handleRadioChange1}
                      />
                    </p>
                  </div>
                  <div className="col-span-6">
                    {createthreshold === "yes" &&
                      <>
                        <form onSubmit={thresholdLimit.handleSubmit}>
                          <Grid className="">
                            <div className="relative col-span-9">
                              <Input
                                type="number"
                                name="value"
                                label="% of Contract value"
                                className="!bg-white"
                                maxDecimalPlaces={2}
                                minLength="1"
                                maxLength="10"
                                value={thresholdLimit.values.value}
                                onChange={thresholdLimit.handleChange}
                                onBlur={thresholdLimit.handleBlur}
                              />

                              <div className="absolute top-[10px] right-[13px]">
                                <p className="h-full text-2xl">%</p>
                              </div>
                              {thresholdLimit.errors.value && thresholdLimit.touched.value && (
                                <div className="text-red-500">{thresholdLimit.errors.value}</div>
                              )}
                            </div>
                            <div className="col-span-3 self-center text-right">
                              <Button type="submit" className='ml-3 '>
                                Save
                              </Button>
                            </div>
                          </Grid>
                        </form>

                      </>
                    }
                  </div>
                </Grid>


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
              </Card>
              {loading ? (
                <div className="h-[400px] w-full flex py-5">
                  <div className="self-center mx-auto">
                    <RotateLoader color="#333" />
                  </div>
                </div>
              ) : (
                <Card className="px-8 pb-8 pt-4 mt-5 mb-8 drop-shadow-4xl bg-white border-[1px] border-Light-Grey rounded-xl relative z-0">
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
                </Card>
              )}
            </>
          )}

          {activeButton === "siteSetting" && (
            <Card className="px-8 pb-8 pt-4 mt-5 mb-8 drop-shadow-4xl border-[1px] border-Light-Grey rounded-xl relative">
              <form onSubmit={siteChange.handleSubmit}>
                <p className="mb-3 font-bold">Logo Setting</p>
                <Grid container spacing={2}>
                  <div className="col-span-12">
                    <Input
                      type="text"
                      name={`title`}
                      className="!bg-white"
                      className1="h-11"
                      label="Company Name"
                      placeholder=""
                      value={siteChange.values.title || title}
                      onBlur={siteChange.handleBlur}
                      onChange={siteChange.handleChange}
                      error={
                        siteChange.touched.title &&
                        siteChange.errors.title
                      }
                    />
                  </div>
                  <div className="col-span-4">
                    <div className="relative">
                      <label
                        htmlFor="favicon-upload"
                        className="absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-white left-2 px-1 -translate-y-4 scale-75"
                      >
                        Favicon Upload
                      </label>
                      <input
                        type="file"
                        id="favicon-upload"
                        name="favIcon"
                        className="hidden"
                        onChange={(event) => handleFileChange(event, setSelectedFile2, "favIcon")}
                        ref={inputRef2}
                      />

                      <div className="block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold bg-white rounded-lg border-[1px] border-gray-300 appearance-none text-light-black peer">
                        {selectedFile2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(setSelectedFile2, "favIcon")}
                            className="absolute -right-2 -top-2 mx-auto mb-3"
                          >
                            <img src={Cross1} className="w-6 h-6" alt="Remove" />
                          </button>
                        )}
                        {selectedFile2 ? (
                          <p className="w-full break-words">{selectedFile2.name}</p>
                        ) : (
                          <p
                            className="w-full cursor-pointer"
                            onClick={() => inputRef2.current.click()}
                          >
                            Select File
                          </p>
                        )}
                      </div>
                      <p className="text-[12px]">The image size should be 50x50 px for the best display.</p>
                    </div>
                    <img src={`${selectedFile2?.baseUrl}uploads/logo/${encodeURIComponent(selectedFile2?.fileName)}`} className="upload w-[100px] h-[50px] mt-2 mr-auto object-contain	" alt="favicon" />
                  </div>
                  <div className="col-span-4 mb-2">
                    <div className="relative">
                      <label
                        htmlFor="logo-upload"
                        className="absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-white left-2 px-1 -translate-y-4 scale-75"
                      >
                        Light Logo Upload
                      </label>
                      <input
                        type="file"
                        id="logo-upload"
                        name="logoImage"
                        className="hidden"
                        onChange={(event) => handleFileChange(event, setSelectedFile1, "logoLight")}
                        ref={inputRef1}
                      />
                      <div className="block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold bg-white rounded-lg border-[1px] border-gray-300 appearance-none text-light-black peer">
                        {selectedFile1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(setSelectedFile1, "logoLight")}
                            className="absolute -right-2 -top-2 mx-auto mb-3"
                          >
                            <img src={Cross1} className="w-6 h-6" alt="Remove" />
                          </button>
                        )}
                        {selectedFile1 ? (
                          <p className="w-full break-words">{selectedFile1.name}</p>
                        ) : (
                          <p
                            className="w-full cursor-pointer"
                            onClick={() => inputRef1.current.click()}
                          >
                            Select File
                          </p>
                        )}
                      </div>
                      <p className="text-[12px]">The image size should be 150x50 px for the best display.</p>
                    </div>
                    <img src={`${selectedFile1?.baseUrl}uploads/logo/${encodeURIComponent(selectedFile1?.fileName)}`} style={{ backgroundColor: sideBarColor }} className={`upload w-[100px] mt-2 mr-auto object-contain`} alt="favicon" />
                  </div>
                  <div className="col-span-4">
                    <div className="relative">
                      <label
                        htmlFor="favicon-upload"
                        className="absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-white left-2 px-1 -translate-y-4 scale-75"
                      >
                        Dark Logo Upload
                      </label>
                      <input
                        type="file"
                        id="favicon-upload"
                        name="favIcon"
                        className="hidden"
                        onChange={(event) => handleFileChange(event, setSelectedFile, "logoDark")}
                        ref={inputRef3}
                      />
                      <div className="block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold bg-white rounded-lg border-[1px] border-gray-300 appearance-none text-light-black peer">
                        {selectedFile && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(setSelectedFile, "logoDark")}
                            className="absolute -right-2 -top-2 mx-auto mb-3"
                          >
                            <img src={Cross1} className="w-6 h-6" alt="Remove" />
                          </button>
                        )}
                        {selectedFile ? (
                          <p className="w-full break-words">{selectedFile.name}</p>
                        ) : (
                          <p
                            className="w-full cursor-pointer"
                            onClick={() => inputRef3.current.click()}
                          >
                            Select File
                          </p>
                        )}
                      </div>
                      <p className="text-[12px]">The image size should be 150x50 px for the best display.</p>
                    </div>
                    <img src={`${selectedFile?.baseUrl}uploads/logo/${encodeURIComponent(selectedFile?.fileName)}`} className="upload w-[100px] mt-2 object-contain mr-auto" alt="favicon" />
                  </div>
                  <div className="col-span-6">
                    <div className="relative">
                      <label
                        htmlFor="address"
                        className="absolute text-base text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-white left-2 px-1 -translate-y-4 scale-75"
                      >
                        Full Address
                      </label>
                      <textarea
                        id="address"
                        rows="4"
                        name="address"
                        value={siteChange.values.address || address}
                        onChange={siteChange.handleChange}
                        onBlur={siteChange.handleBlur}
                        maxLength={150}
                        className="resize-none block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold text-light-black bg-white rounded-lg border-[1px] border-gray-300 appearance-none peer"
                      ></textarea>
                      {formik.touched.address && formik.errors.address && (
                        <div className="text-red-500 text-sm pl-2 pt-2">
                          {formik.errors.address}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-6">
                    <div className="relative">
                      <label
                        htmlFor="bankDetails"
                        className="absolute text-base text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-white left-2 px-1 -translate-y-4 scale-75"
                      >
                        Bank Details
                      </label>
                      <textarea
                        id="bankDetails"
                        rows="4"
                        name="bankDetails"
                        value={siteChange.values.bankDetails || bankDetails}
                        onChange={siteChange.handleChange}
                        onBlur={siteChange.handleBlur}
                        maxLength={150}
                        className="resize-none block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold text-light-black bg-white rounded-lg border-[1px] border-gray-300 appearance-none peer"
                      ></textarea>
                      {formik.touched.bankDetails && formik.errors.bankDetails && (
                        <div className="text-red-500 text-sm pl-2 pt-2">
                          {formik.errors.bankDetails}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-12">
                    <p className="mb-3 font-bold">Color Setting </p>
                    <Grid >
                      <div className="col-span-2 relative">
                        <Input
                          type="color"
                          name={`sideBarColor`}
                          className1="h-11"
                          tooltip="1"
                          className="!bg-white  flex"
                          content='you can change the Theme Background color here'
                          label="Theme Color"
                          placeholder=""
                          value={sideBarColor} onChange={handleColorChange('sideBarColor', setSideBarColor)}
                        />
                      </div>
                      <div className="col-span-2 relative">
                        <Input
                          type="color"
                          name={`sideBarTextColor`}
                          className1="h-11"
                          tooltip="2"
                          className="!bg-white flex !w-[111%]"
                          content='you can change the Theme text color here'
                          label="Theme text Color"
                          placeholder=""
                          value={sideBarTextColor} onChange={handleColorChange('sideBarTextColor', setSideBarTextColor)}
                        />
                      </div>
                      <div className="col-span-2 relative">
                        <Input
                          type="color"
                          name={`sideBarButtonColor`}
                          tooltip="3"
                          className="!bg-white flex"
                          content='you can change the sideBar active page button color here'
                          className1="h-11"
                          label="SideBar Button "
                          placeholder=""
                          value={sideBarButtonColor} onChange={handleColorChange('sideBarButtonColor', setSideBarButtonColor)}
                        />
                      </div>
                      <div className="col-span-2 relative">
                        <Input
                          type="color"
                          name={`sideBarButtonTextColor`}
                          tooltip="4"
                          className="!bg-white flex !w-[111%]"
                          content='you can change the sideBar active page button text color here'
                          className1="h-11"
                          label="SideBar text Button "
                          placeholder=""
                          value={sideBarButtonTextColor} onChange={handleColorChange('sideBarButtonTextColor', setSideBarButtonTextColor)}
                        />
                      </div>
                      <div className="col-span-2 relative">
                        <Input
                          type="color"
                          name={`buttonColor`}
                          tooltip="5"
                          className="!bg-white flex"
                          content='you can change all button background color here'
                          className1="h-11"
                          label="Button Color"
                          placeholder=""
                          value={buttonColor} onChange={handleColorChange('buttonColor', setButtonColor)}
                        />
                      </div>
                      <div className="col-span-2 relative">
                        <Input
                          type="color"
                          name={`buttonTextColor`}
                          tooltip="6"
                          className="!bg-white flex !w-[111%]"
                          content='you can change all button text color here'
                          className1="h-11"
                          label="Button text Color"
                          placeholder=""
                          value={buttonTextColor} onChange={handleColorChange('buttonTextColor', setButtonTextColor)}
                        />
                      </div>
                      <div className="col-span-2 relative">
                        <Input
                          type="color"
                          name={`backGroundColor`}
                          tooltip="7"
                          className="!bg-white flex !w-[111%]"
                          content='you can change all backGround Color here'
                          className1="h-11"
                          label="Background Color"
                          placeholder=""
                          value={backGroundColor} onChange={handleColorChange('backGroundColor', setBackGroundColor)}
                        />
                      </div>
                      <div className="col-span-2 relative">
                        <Input
                          type="color"
                          name={`titleColor`}
                          tooltip="8"
                          className="!bg-white flex"
                          content='you can change website text color here'
                          className1="h-11"
                          label="Text Color"
                          placeholder=""
                          value={titleColor} onChange={handleColorChange('titleColor', setTitleColor)}
                        />
                      </div>
                      <div className="col-span-2 relative">
                        <Input
                          type="color"
                          name={`cardBackGroundColor`}
                          tooltip="10"
                          className="!bg-white flex"
                          content='you can change website Box backGround color here'
                          className1="h-11"
                          label="Box Color"
                          placeholder=""
                          value={cardBackGroundColor} onChange={handleColorChange('cardBackGroundColor', setCardBackGroundColor)}
                        />
                      </div>
                      <div className="col-span-2 relative">
                        <Input
                          type="color"
                          name={`cardColor`}
                          tooltip="9"
                          className="!bg-white flex"
                          content='you can change website Box color here'
                          className1="h-11"
                          label="Box Text Color"
                          placeholder=""
                          value={cardColor} onChange={handleColorChange('cardColor', setCardColor)}
                        />
                      </div>

                      <div className="col-span-2 relative">
                        <Input
                          type="color"
                          name={`modelBackgroundColor`}
                          tooltip="11"
                          className="!bg-white flex "
                          content='you can change website Popup Background color here'
                          className1="h-11 "
                          label="Popup Color"
                          placeholder=""
                          value={modelBackgroundColor} onChange={handleColorChange('modelBackgroundColor', setModelBackgroundColor)}
                        />
                      </div>
                      <div className="col-span-2 relative">
                        <Input
                          type="color"
                          name={`modelColor`}
                          tooltip="12"
                          className="!bg-white flex !w-[163px]"
                          content='you can change website Popup text color here'
                          className1="h-11"
                          label="Popup text Color"
                          placeholder=""
                          value={modelColor} onChange={handleColorChange('modelColor', setModelColor)}
                        />
                      </div>
                    </Grid>
                  </div>
                </Grid>
                <div className="text-right">
                  {defaults && <Button onClick={() => setIsSetDefalt(true)} className="mt-3 mr-3 text-sm !font-semibold !border-light-black !border-[1px]" type="button">Set As Default Color</Button>}

                  <Button onClick={() => handleReset()} className="mt-3 mr-3 text-sm !bg-[#fff] !text-light-black !font-semibold !border-light-black !border-[1px]" type="button">Reset</Button>
                  <Button className="mt-3" type="submit">Submit</Button>
                </div>
              </form>
            </Card>
          )}

          <>
            {activeButton === "Settings" && (
              sections.map((section, index) => (
                <div key={index} className="my-5">
                  <CollapsibleDiv
                    ShowData={showdata}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    index={index} // Pass the index to the child
                    imageClass="w-10 h-10"
                    title={
                      <SingleView className="border-Gray28 border bg-Dealer-detail bg-cover rounded-t-[22px]">
                        <Grid className=" !gap-2 ">
                          <div className="col-span-12 px-4 py-2">
                            <p className="text-lg font-bold text-white">{section.title}</p>
                          </div>
                        </Grid>
                      </SingleView>
                    }
                  >
                    <div className="p-4 border">
                      <Grid className="!grid-cols-11 !gap-2">
                        <div className="col-span-4">
                          <Input
                            type="text"
                            label="Coverage Type Label"
                            value={labels[index] || ''}
                            onChange={(e) => handleLabelChange(index, e.target.value)}
                            placeholder=""
                            className='!bg-white'
                          // Disable if not editing this section
                          />
                        </div>
                        <div className="col-span-4">
                          <Input
                            type="text"
                            label="Coverage Type Value"
                            value={values[index] || ''}
                            onChange={(e) => handleValueChange(index, e.target.value)}
                            disabled={editingIndex === index} // Disable in edit mode for the current section
                            className='!bg-white'
                            placeholder=""
                          />
                        </div>
                        <div className="col-span-3 self-center text-center">
                          {editingIndex === index ? (
                            <>
                              <Button
                                className="text-sm! font-semibold !border-light-black !border-[1px]"
                                type="button"
                                onClick={() => handleAddOrUpdate(editingRowId, labels[index], index)}
                              >
                                Update
                              </Button>
                              <Button
                                className="text-sm! font-semibold !border-light-black !border-[1px] ml-2"
                                type="button"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <Button
                              className="text-sm! font-semibold !border-light-black !border-[1px]"
                              type="button"
                              onClick={() => handleAddOrUpdate(null, labels[index], index)}
                            >
                              Add
                            </Button>
                          )}
                        </div>
                      </Grid>

                      <table className="w-full border-collapse border mt-5">
                        <thead className="w-full border-collapse border bg-[#F9F9F9]">
                          <tr>
                            <th>Label</th>
                            <th>Value</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="w-full border-collapse border text-center">
                          {section.data?.value.map((row) => (
                            <tr key={row._id} className="w-full border-collapse border">
                              <td className="py-3">{row.label}</td>
                              <td>{row.value}</td>
                              <td>
                                <SwitchButton
                                  isOn={row.status}
                                  handleToggle={() => handleAddOrUpdate(row._id, section.data, index, true)}
                                />
                              </td>
                              <td>
                                <Button
                                  onClick={() => handleEditOption(row._id, section.data, index)}
                                  className="text-sm! font-semibold !border-light-black !border-[1px]"
                                >
                                  Edit
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CollapsibleDiv>
                </div>
              ))
            )}
          </>
        </div >
      )
      }

      <Modal isOpen={isUserModalOpen} onClose={closeUserModal}>
        {addLoading ? (
          <div className="h-[400px] w-full flex py-5">
            <div className="self-center mx-auto">
              <RotateLoader color="#333" />
            </div>
          </div>
        ) : (
          <div className=" py-3">
            <p className=" text-center text-3xl mb-5 mt-2 font-bold">
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
                  <p className=" flex text-[12px] font-semibold mt-3 mb-6">
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
            <p className="text-3xl text-center mb-5 mt-2 font-semibold">
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
                    className="border w-full !border-Bright-Grey !bg-white !text-light-black !text-sm !font-Regular"
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
          <p className="text-3xl mb-0 mt-2 font-bold">
            {firstMessage}
          </p>
          <p className=" text-base font-medium mt-4">
            {secondMessage} {""} <br />
            {lastMessage == null ? '' : lastMessage} <br /> Redirecting Back to Detail page in{" "}
            {timer} Seconds
          </p>
        </div>
      </Modal>

      {/* Modal Delete Popop */}
      <Modal isOpen={isModalOpen1} onClose={closeModal1}>
        <div className="text-center py-3">
          <img src={assign} alt="email Image" className="mx-auto" />
          <p className="text-3xl mb-0 mt-2 font-semibold ">
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

      {/* Modal Delete Popop */}
      <Modal isOpen={isSetDefalt} onClose={closeDefalt}>
        <div className="text-center py-3">
          <img src={assign} alt="email Image" className="mx-auto" />
          <p className="text-3xl mb-0 mt-2 font-semibold ">
            Would you like to set it as the default color?
          </p>
          <Grid className="!grid-cols-4 my-5 ">
            <div className="col-span-1"></div>
            <Button
              onClick={() => {
                handleDefault();
              }}
            >
              Yes
            </Button>
            <Button
              className="border w-full !border-Bright-Grey !bg-[transparent] !text-light-black !text-sm !font-Regular"
              onClick={() => closeDefalt()}
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
          <p className="text-3xl mb-0 mt-2 font-semibold ">
            Deleted Successfully
          </p>
          <p className=" text-base font-medium mt-2">
            You have successfully deleted this user.
          </p>
          <p className=" text-base font-medium mt-2">
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
