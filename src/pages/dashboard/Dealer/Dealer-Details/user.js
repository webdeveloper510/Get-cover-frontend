import React, { useEffect, useRef, useState } from "react";
import Button from "../../../../common/button";

import ActiveIcon from "../../../../assets/images/icons/iconAction.svg";
import star from "../../../../assets/images/icons/star.svg";
import Primary from "../../../../assets/images/SetPrimary.png";
import deleteUser10 from "../../../../assets/images/deleteUser.svg";
import assign from "../../../../assets/images/Unassign.png";
import Search from "../../../../assets/images/icons/SearchIcon.svg";
import clearFilter from "../../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import shorting from "../../../../assets/images/icons/shorting.svg";
import delete1 from "../../../../assets/images/delete.png";
import edit from "../../../../assets/images/edit-text.png";
import Cross from "../../../../assets/images/Cross.png";
import make from "../../../../assets/images/star.png";
import Grid from "../../../../common/grid";
import NotificationImage from "../../../../assets/images/icons/Notification-icon.svg";
import Input from "../../../../common/input";
import DataTable from "react-data-table-component";
import { RotateLoader } from "react-spinners";
import Modal from "../../../../common/model";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  changePrimaryByUserId,
  deleteUserByUserId,
  getUserListByDealerId,
  userDetailsById,
  updateUserDetailsById,
} from "../../../../services/userServices";
import Select from "../../../../common/select";
import { getCustomerUsersById } from "../../../../services/customerServices";
import { useMyContext } from "../../../../context/context";
import { getServicerUsersById } from "../../../../services/servicerServices";
import { getResellerUsersById } from "../../../../services/reSellerServices";
import Card from "../../../../common/card";
import InActiveButton from "../../../../common/inActiveButton";
import SingleView from "../../../../common/singleView";
import SwitchButton from "../../../../common/switch";
import CollapsibleDiv from "../../../../common/collapsibleDiv";
import { Notifications } from "../../../../notificationjson";
import { getUserNotificationData, updateNotificationData } from "../../../../services/extraServices";

function UserList(props) {
  console.log(props, 'hello world');
  const { toggleFlag } = useMyContext();
  const [selectedAction, setSelectedAction] = useState(null);
  const [userList, setUserList] = useState([]);
  const [isModalOpen, SetIsModalOpen] = useState(false);
  const [isprimary, SetIsprimary] = useState(false);
  const [mainStatus, setMainStatus] = useState(true);
  const [servicerStatus, setServiceStatus] = useState(true);
  const [deleteId, setDeleteId] = useState("");
  const [dealerStatus, setDealerStatus] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [primaryText, SetPrimaryText] = useState("");
  const [secondaryText, SetSecondaryText] = useState("");
  const [activeIndex1, setActiveIndex1] = useState(null);
  const [timer, setTimer] = useState(3);
  const dropdownRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [showdata, setShowdata] = useState(true);
  const [isModalOpen12, setIsModalOpen12] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState([]);
  const [notificationList, setNotificationList] = useState(Notifications)
  const [notification, setNotification] = useState({})
  const [title, setTitle] = useState('');
  const [initialFormValues, setInitialFormValues] = useState({
    lastName: "",
    firstName: "",
    phoneNumber: "",
    position: "",
    status: true,
    id: "",
  });
  const [initialFormValues12, setInitialFormValues12] = useState({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
  });
  // console.log("toggleFlag", toggleFlag);
  const [loading1, setLoading1] = useState(false);

  useEffect(() => {
    if (props.activeTab === "Users") {
      getUserList();
    }
  }, [props]);

  useEffect(() => {
    getUserList();
  }, []);

  const getUserList = async (data = {}) => {
    setLoading1(true);
    switch (props.flag) {
      case "customer":
        const customerResult = await getCustomerUsersById(props.id, data);
        setServiceStatus(true);
        setUserList(customerResult.result);
        setDealerStatus(customerResult.isAccountCreate);
        break;
      case "servicer":
        const servicerResult = await getServicerUsersById(props.id, data);
        console.log(servicerResult);
        setServiceStatus(servicerResult.servicerStatus);
        setUserList(servicerResult.result);
        setDealerStatus(servicerResult.isAccountCreate);
        break;
      case "reseller":
        const resellerResult = await getResellerUsersById(props.id, data);
        console.log(resellerResult);
        setServiceStatus(resellerResult.resellerStatus);
        setUserList(resellerResult.data);
        setDealerStatus(resellerResult.isAccountCreate);
        break;
      default:
        const defaultResult = await getUserListByDealerId(props.id, data);
        console.log(defaultResult.result);
        setServiceStatus(defaultResult.dealerStatus);
        setDealerStatus(defaultResult.isAccountCreate);
        setUserList(defaultResult.result);
        break;
    }

    setLoading1(false);
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setSelectedAction(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
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
    formik.setFieldValue(name, value);
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
    formik.resetForm();
  };
  const openModal2 = () => {
    setIsModalOpen2(true);
  };

  const closeModal12 = () => {
    setIsModalOpen12(false);
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
    } catch (error) {
      console.error("Error in handleStatusChange:", error);
    }
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
      setLoading1(true);
      const result = await updateUserDetailsById(values);
      if (result.code == 200) {
        setLoading1(false);
        SetPrimaryText("User Updated Successfully ");
        SetSecondaryText("user updated successfully ");
        openModal();
        toggleFlag();
        setTimer(3);
        // getUserList();
      } else {
        setLoading1(false);
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

    if (result.code === 200) {
      // getUserList();
      setIsModalOpen12(true);
      // closeModal1();
    }
  };
  const editUser = async (id) => {
    const result = await userDetailsById(id);

    SetIsprimary(result.result.isPrimary);
    setMainStatus(result.mainStatus);
    setInitialFormValues({
      id: id,
      firstName: result?.result?.firstName,
      lastName: result?.result?.lastName,
      phoneNumber: result?.result?.phoneNumber,
      position: result?.result?.position,
      status: result?.result?.status,
    });

    openModal2();
  };

  const makeUserPrimary = async (row) => {
    // setLoading1(true);
    props.setLoading(true);
    const result = await changePrimaryByUserId(row._id);

    if (result.code === 200) {
      SetPrimaryText("It's set to Primary");
      SetSecondaryText("We have successfully made this user primary");
      toggleFlag();
      openModal();
      // setLoading1(false);
      props.setLoading(false);
    }
    // setLoading1(false);
    props.setLoading(false);

  };

  const handleAddOrUpdate12 = (actionType) => {
    switch (actionType) {
      case "newAdminUserCreated":
        console.log("Handling: New Admin User Created");
        // Add logic for new admin user creation
        break;
      case "pricebookCategoryAdded":
        console.log("Handling: Pricebook Category Added");
        // Add logic for pricebook category addition
        break;
      case "pricebookCategoryUpdated":
        console.log("Handling: Pricebook Category Updated");
        // Add logic for pricebook category update
        break;
      case "pricebookCategoryStatusChange":
        console.log("Handling: Pricebook Category Status Change");
        // Add logic for pricebook category status change
        break;
      // Add cases for other actions
      default:
        console.log("Unknown action:", actionType);
    }
  };

  const handleFilterIconClick = () => {
    // formikUSerFilter.resetForm();
    console.log(formikUSerFilter, "11---------------");
    getUserList();
    formikUSerFilter.resetForm();
  };
  const emailValidationRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const formikUSerFilter = useFormik({
    initialValues: initialFormValues12,
    validationSchema: Yup.object({
      firstName: Yup.string(),
      lastName: Yup.string(),
      email: Yup.string(),
      phone: Yup.number(),
    }),
    onSubmit: async (values) => {
      getUserList(values);
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
      name: "Email Address",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row) => "+1 " + formatPhoneNumber(row.phoneNumber),
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
            disabled={row.isPrimary || !servicerStatus || !dealerStatus}
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
      minWidth: "auto", // Set a custom minimum width
      maxWidth: "90px", // Set a custom maximum width
      cell: (row, index) => {
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
              <SingleView
                ref={dropdownRef}
                className={`absolute z-[9999] ${!row.isPrimary ? "w-[130px]" : "w-[130px]"
                  } drop-shadow-5xl -right-3 mt-2 py-1 border rounded-lg shadow-md ${calculateDropdownPosition(
                    index
                  )}`}
              >
                {!row.isPrimary && row.status && (
                  <div
                    onClick={() => makeUserPrimary(row)}
                    className="text-left cursor-pointer flex border-b py-1 px-2"
                  >
                    <div
                      style={{
                        maskImage: `url(${make})`,
                        WebkitMaskImage: `url(${make})`,
                        maskRepeat: "no-repeat",
                        WebkitMaskRepeat: "no-repeat",
                        maskPosition: "center",
                        WebkitMaskPosition: "center",
                        maskSize: "contain",
                        WebkitMaskSize: "contain",
                      }}
                      className="self-center singleViews mr-2 h-4 w-4 "
                    />
                    {/* <img src={make} className="w-4 h-4 mr-2" />{" "} */}
                    <span className="self-center"> Make Primary </span>
                  </div>
                )}
                <div
                  onClick={() => openNotification(row._id)}
                  className={`text-left cursor-pointer flex border-b py-1 px-2`}
                >
                  <div
                    style={{
                      maskImage: `url(${NotificationImage})`,
                      WebkitMaskImage: `url(${NotificationImage})`,
                      maskRepeat: "no-repeat",
                      WebkitMaskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskPosition: "center",
                      maskSize: "contain",
                      WebkitMaskSize: "contain",
                    }}
                    className="self-center singleViews mr-2 h-4 w-4 "
                  />
                  {/* {/* <img src={edit} className="w-4 h-4 mr-2" />{" "}  */}
                  <span className="self-center">Notification </span>
                </div>
                <div
                  onClick={() => editUser(row._id)}
                  className={`text-left cursor-pointer flex ${!row.isPrimary && 'border-b'} py-1 px-2`}
                >
                  <div
                    style={{
                      maskImage: `url(${edit})`,
                      WebkitMaskImage: `url(${edit})`,
                      maskRepeat: "no-repeat",
                      WebkitMaskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskPosition: "center",
                      maskSize: "contain",
                      WebkitMaskSize: "contain",
                    }}
                    className="self-center singleViews mr-2 h-4 w-4 "
                  />
                  {/* <img src={edit} className="w-4 h-4 mr-2" />{" "} */}
                  <span className="self-center">Edit </span>
                </div>
                {!row.isPrimary && (
                  <div
                    onClick={() => openModal1(row._id)}
                    className="text-left cursor-pointer flex py-1 px-2"
                  >
                    <div
                      style={{
                        maskImage: `url(${delete1})`,
                        WebkitMaskImage: `url(${delete1})`,
                        maskRepeat: "no-repeat",
                        WebkitMaskRepeat: "no-repeat",
                        maskPosition: "center",
                        WebkitMaskPosition: "center",
                        maskSize: "contain",
                        WebkitMaskSize: "contain",
                      }}
                      className="self-center singleViews mr-2 h-4 w-4 "
                    />
                    {/* <img src={delete1} className="w-4 h-4 mr-2" />{" "} */}
                    <span className="self-center">Delete</span>
                  </div>
                )}
              </SingleView>
            )}
          </div>
        );
      },
    },
  ];

  const CustomNoDataComponent = () => (
    <Card className="text-center my-5">
      <p>No records found.</p>
    </Card>
  );
  const openNotification = async (id) => {
    const capitalizedFlag = props.flag.charAt(0).toUpperCase() + props.flag.slice(1);
    const data = await getUserNotificationData(id, capitalizedFlag);
    const notifications = data.result.notifications;
    const filteredNotifications = Notifications.filter(notification => {
      const apiFieldName = notification.apiFieldName;
      return data.result.notifications[apiFieldName] !== null;
    });
    setNotificationList(filteredNotifications)
    // Map settings for toggles
    // const mappedSettings = {};
    // Object.entries(notifications).forEach(([categoryKey, categoryValue]) => {
    //   if (typeof categoryValue === "object" && categoryValue != null) {
    //     Object.entries(categoryValue).forEach(([key, value]) => {
    //       if (typeof value === "boolean") {
    //         mappedSettings[key] = value;
    //       }
    //     });
    //   }
    // });

    // Update notificationList to reflect the new settings

    const unifiedNotifications = filteredNotifications.map(notification => {
      const apiSection = notifications[notification.apiFieldName];
      return {
        index: notification.index,
        title: notification.title,
        apiFieldName: notification.apiFieldName,
        sections: notification.sections.map(section => ({
          label: section.label,
          action: section.action,
          status: apiSection ? apiSection[section.action] : null
        }))
      };
    });
    console.log(unifiedNotifications)
    setNotificationSettings(unifiedNotifications);
    setNotification(data.result);
    setIsNotificationOpen(true);
  };


  // const checkAllStatusTrue = (sections, notificationSettings) => {
  //   return sections.every(({ action }) => {
  //     const section = notificationSettings?.find((n) =>
  //       n.sections.some((s) => s.action === action)
  //     );
  //     return section?.sections?.find((s) => s.action === action)?.status ?? false;
  //   });
  // };

  const checkAllStatusTrue = (notificationSettings, index) => {

    const section = notificationSettings.find((n) => n.index === index);
    console.log(section)
    if (!section) return false;
    return section.sections.every((s) => s.status === true);
  };


  const handleToggleAll = (allStatusTrue, setNotificationSettings, i) => {
    const updatedSettings = notificationSettings[i].sections.reduce((acc, { action, status }) => {
      acc[action] = !allStatusTrue;
      return acc;
    }, {});
    setNotificationSettings((prevSettings) => {
      const newSettings = [...prevSettings];
      newSettings[i] = {
        ...newSettings[i],
        sections: newSettings[i].sections.map((section) => ({
          ...section,
          status: !allStatusTrue,
        })),
      };
      const updatedNotifications = transformDataForAPI(newSettings);
      updateNotification(updatedNotifications);

      return newSettings;
    });


    setNotificationSettings((prev) => {
      return prev.map((notification, index) => {
        if (index === i && notification.sections) {
          notification.sections = notification.sections.map((section) => ({
            ...section,
            status: updatedSettings[section.action]
          }));
        }
        return notification;
      });
    });
  };

  const handleAddOrUpdate1 = (value, allStatusTrue, setNotificationSettings, i) => {
    // Update the notification settings for the specified index
    setNotificationSettings((prevSettings) =>
      prevSettings.map((group, index) => {
        if (index === i) {
          return {
            ...group,
            sections: group.sections.map((section) =>
              section.action === value
                ? { ...section, status: !section.status }
                : section
            ),
          };
        }
        return group;
      })
    );

    // Pass the updated settings to the API
    setNotificationSettings((prevSettings) => {
      const updatedNotifications = transformDataForAPI(prevSettings);
      updateNotification(updatedNotifications);
      return prevSettings;
    });
  };

  // Transform function to structure data as per API requirements
  const transformDataForAPI = (notificationSettings) => {
    const transformedData = notificationSettings.reduce((acc, group) => {
      const apiFieldName = group.apiFieldName;
      const sections = group.sections.reduce((innerAcc, section) => {
        innerAcc[section.action] = section.status;
        return innerAcc;
      }, {});

      acc[apiFieldName] = sections;
      return acc;
    }, {});

    return {
      ...transformedData,
    };
  };

  // Update notification function
  const updateNotification = (updatedNotifications) => {
    console.log(notification)
    updateNotificationData(notification._id, updatedNotifications).then((res) => {
      console.log(res);
    });
  };
  // const openNotification = async (id) => {
  //   const capitalizedFlag = props.flag.charAt(0).toUpperCase() + props.flag.slice(1);
  //   const data = await getUserNotificationData(id, capitalizedFlag);
  //   const notifications = data.result.notifications;
  //   const filteredNotifications = Notifications.filter(notification => {
  //     const apiFieldName = notification.apiFieldName;
  //     return data.result.notifications[apiFieldName] !== null;
  //   });
  //   console.log(filteredNotifications)
  //   setNotificationList(filteredNotifications)

  //   // Map settings for toggles
  //   const mappedSettings = {};
  //   Object.entries(notifications).forEach(([categoryKey, categoryValue]) => {
  //     if (typeof categoryValue === "object" && categoryValue != null) {
  //       console.log(categoryValue)
  //       Object.entries(categoryValue).forEach(([key, value]) => {
  //         if (typeof value === "boolean") {
  //           mappedSettings[key] = value;
  //         }
  //       });
  //     }
  //   });

  //   // Update notificationList to reflect the new settings


  // };


  // const handleAddOrUpdate1 = (actionKey) => {
  //   setNotificationSettings((prevSettings) => ({
  //     ...prevSettings,
  //     [actionKey]: !prevSettings[actionKey],
  //   }));

  //   setNotification((prevNotifications) =>
  //     toggleNotification(prevNotifications, actionKey)
  //   );
  // };

  // const toggleNotification = (prevNotifications, actionKey) => {
  //   const updatedNotifications = { ...prevNotifications };
  //   for (const category in updatedNotifications.notifications) {
  //     if (updatedNotifications.notifications[category] && typeof updatedNotifications.notifications[category] === "object") {
  //       if (actionKey in updatedNotifications.notifications[category]) {
  //         updatedNotifications.notifications[category][actionKey] = !updatedNotifications.notifications[category][actionKey];
  //         break;
  //       }
  //     }
  //   }
  //   updateNotificationData(updatedNotifications._id, updatedNotifications.notifications).then((res) => {
  //     console.log(res)
  //   })
  //   return updatedNotifications;
  // };
  // const handleSelectAll = (sectionKey, apiFieldName) => {
  //   console.log(title, apiFieldName);
  //   setNotificationSettings((prevSettings) => {
  //     const updatedSettings = { ...prevSettings };
  //     const section = Notifications.find((notification) => notification.index === sectionKey);

  //     if (section && section.sections) {
  //       section.sections.forEach(({ action, actionKey }) => {
  //         const actionKeyToUse = actionKey || action;
  //         updatedSettings[actionKeyToUse] = true;
  //       });
  //     }

  //     console.log(updatedSettings);

  //     return updatedSettings;
  //   });
  //   setNotification((prevNotifications) =>
  //     toggleAllActionsInSection(prevNotifications, apiFieldName, true)
  //   );
  // };

  // const toggleAllActionsInSection = (notifications, apiFieldName, value) => {
  //   const updatedNotifications = { ...notifications };
  //   console.log(notifications, apiFieldName)

  //   if (updatedNotifications.notifications[apiFieldName]) {
  //     const section = updatedNotifications.notifications[apiFieldName];
  //     for (const key in section) {
  //       if (key !== "_id" && typeof section[key] === "boolean") {
  //         section[key] = value;
  //       }
  //     }
  //   }
  //   updateNotificationData(updatedNotifications._id, updatedNotifications.notifications).then((res) => {
  //     console.log(res)
  //   })
  //   console.log(updatedNotifications)
  //   return updatedNotifications;
  // };

  const closeNotification = () => {
    setIsNotificationOpen(false);
  }



  return (
    <>
      <div className="my-8">
        <Card className="mt-6 border-[1px] border-Light-Grey rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className="col-span-3 self-center">
              <p className="text-xl font-semibold">Users List</p>
            </div>
            <div className="col-span-9">
              <div className="bg-grayf9 rounded-[30px] p-3 border-[1px] border-Light-Grey">
                <form className="" onSubmit={formikUSerFilter.handleSubmit}>
                  <Grid className="!grid-cols-9">
                    <div className="col-span-2 self-center">
                      <Input
                        name="firstName"
                        type="text"
                        className="!text-[14px] !bg-White-Smoke"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
                        label=""
                        placeholder="First Name"
                        value={formikUSerFilter.values.firstName}
                        onBlur={formikUSerFilter.handleBlur}
                        onChange={formikUSerFilter.handleChange}
                      />
                    </div>
                    <div className="col-span-2 self-center">
                      <Input
                        name="lastName"
                        type="text"
                        className="!text-[14px] !bg-White-Smoke"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
                        label=""
                        placeholder="Last Name"
                        value={formikUSerFilter.values.lastName}
                        onBlur={formikUSerFilter.handleBlur}
                        onChange={formikUSerFilter.handleChange}
                      />
                    </div>
                    <div className="col-span-2 self-center">
                      <Input
                        name="email"
                        type="text"
                        className="!text-[14px] !bg-White-Smoke"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
                        label=""
                        placeholder="Email"
                        value={formikUSerFilter.values.email}
                        onBlur={formikUSerFilter.handleBlur}
                        onChange={formikUSerFilter.handleChange}
                      />
                    </div>
                    <div className="col-span-2 self-center">
                      <Input
                        name="phone"
                        type="tel"
                        className="!text-[14px] !bg-White-Smoke"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
                        label=""
                        placeholder="Phone"
                        value={formikUSerFilter.values.phone}
                        onBlur={formikUSerFilter.handleBlur}
                        onChange={(e) => {
                          const sanitizedValue = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );

                          formikUSerFilter.handleChange({
                            target: {
                              name: "phone",
                              value: sanitizedValue,
                            },
                          });
                        }}
                      />
                    </div>
                    <div className="col-span-1 self-center flex justify-center">
                      <Button type="submit" className="!p-2">
                        <img
                          src={Search}
                          className="cursor-pointer "
                          alt="Search"
                        />
                      </Button>
                      <InActiveButton
                        type="button"
                        onClick={() => {
                          handleFilterIconClick();
                        }}
                      >
                        <div
                          style={{
                            maskImage: `url(${clearFilter})`,
                            WebkitMaskImage: `url(${clearFilter})`,
                            maskRepeat: "no-repeat",
                            WebkitMaskRepeat: "no-repeat",
                            maskPosition: "center",
                            WebkitMaskPosition: "center",
                            maskSize: "contain",
                            WebkitMaskSize: "contain",
                          }}
                          className="self-center pr-1 py-1 h-4 w-4 cursor-pointer mx-auto"
                        />
                      </InActiveButton>
                    </div>
                  </Grid>
                </form>
              </div>
            </div>
          </Grid>
          <div className="mb-5 relative dealer-detail">
            {loading1 ? (
              <div className=" h-[400px] w-full flex py-5">
                <div className="self-center mx-auto">
                  <RotateLoader color="#333" />
                </div>
              </div>
            ) : (
              <DataTable
                draggableColumns={false}
                columns={columns}
                data={userList}
                highlightOnHover
                sortIcon={
                  <>
                    {" "}
                    <div
                      style={{
                        maskImage: `url(${shorting})`,
                        WebkitMaskImage: `url(${shorting})`,
                        maskRepeat: "no-repeat",
                        WebkitMaskRepeat: "no-repeat",
                        maskPosition: "center",
                        WebkitMaskPosition: "center",
                        maskSize: "contain",
                        WebkitMaskSize: "contain",
                      }}
                      className="ml-2 tabless"
                    />
                    {/* <img src={shorting} className="ml-2" alt="shorting" /> */}
                  </>
                }
                noDataComponent={<CustomNoDataComponent />}
                pagination
                paginationPerPage={10}
                paginationComponentOptions={paginationOptions}
                paginationRowsPerPageOptions={[10, 20, 50, 100]}
              />
            )}
          </div>
        </Card>
      </div>

      {/* Modal Primary Popop */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center py-3">
          <img src={Primary} alt="email Image" className="mx-auto" />
          <p className="text-3xl mb-0 mt-2 font-bold">
            {primaryText}
          </p>
          <p className="text-base font-medium mt-4">
            {secondaryText} <br />
            Redirecting Back to User List in {timer} Seconds
          </p>
        </div>
      </Modal>

      {/* Modal Delete Popop */}
      <Modal isOpen={isModalOpen1} onClose={closeModal1}>
        <div className="text-center py-3">
          <img src={assign} alt="email Image" className="mx-auto" />
          <p className="text-3xl mb-0 mt-2 font-semibold">
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
            <InActiveButton
              className="border w-full !text-sm !font-Regular"
              onClick={() => closeModal1()}
            >
              No
            </InActiveButton>
            <div className="col-span-1"></div>
          </Grid>
        </div>
      </Modal>

      {/* Modal Delete Msg Popop */}
      <Modal isOpen={isModalOpen12} onClose={closeModal12}>
        <div className="text-center py-3">
          <img src={deleteUser10} alt="email Image" className="mx-auto" />
          <p className="text-3xl mb-0 mt-2 font-semibold">
            Deleted Successfully
          </p>
          <p className="text-base font-medium mt-2">
            You have successfully deleted this user.
          </p>
          <p className="text-base font-medium mt-2">
            Redirecting Back to User List in {timer} seconds
          </p>
        </div>
      </Modal>

      {/* Modal Edit Popop */}
      <Modal isOpen={isModalOpen2} onClose={closeModal2}>
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
                  // required={true}
                  placeholder=""
                  maxLength={"30"}
                  value={formik.values.position}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={formik.touched.position && formik.errors.position}
                />
                {/* {formik.touched.position && formik.errors.position && (
                <div className="text-red-500 text-sm pl-2 pt-2">
                  {formik.errors.position}
                </div>
              )} */}
              </div>
              <div className="col-span-6">
                <Input
                  type="tel"
                  name="phoneNumber"
                  label="Phone Number"
                  required={true}
                  nonumber={true}
                  className="!bg-white"
                  placeholder=""
                  value={formik.values.phoneNumber}
                  onChange={(e) => {
                    const sanitizedValue = e.target.value.replace(
                      /[^0-9]/g,
                      ""
                    );

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
                  disabled={isprimary || !mainStatus || !dealerStatus}
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
                <InActiveButton
                  type="button"
                  className="border w-full !text-sm !font-Regular"
                  onClick={() => closeModal2()}
                >
                  Cancel
                </InActiveButton>
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



      <Modal isOpen={isNotificationOpen} onClose={closeNotification} className="!w-[90%]">
        <Button
          onClick={closeNotification}
          className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-Granite-Gray"
        >
          <img src={Cross} className="w-full h-full text-black rounded-full p-0" />
        </Button>
        <div className="py-3">
          <p className="text-3xl font-bold text-center mb-5">Notification Settings</p>
          <div className="overflow-y-scroll min-h-[200px] max-h-[400px]">
            <Grid className="!grid-cols-2 !gap-1">
              {Object.entries(notificationList || []).map(([key, value], i) => {
                if (!value) {
                  return null;
                }

                const { index, title, sections, apiFieldName } = value;
                const allStatusTrue = checkAllStatusTrue(notificationSettings, activeIndex1);

                return (
                  <div key={index} className="mb-1">
                    <CollapsibleDiv
                      key={index}
                      ShowData={showdata}
                      activeIndex={activeIndex1}
                      setActiveIndex={setActiveIndex1}
                      imageClass="w-10 h-10"
                      className="!my-2"
                      index={index}
                      title={
                        <SingleView className="border-Gray28 border px-4 py-2 rounded-t-[22px]">
                          <p className="text-lg font-bold">{title}</p>
                        </SingleView>
                      }
                    >
                      <div className="px-4 pt-2 pb-4 border">
                        <div className="text-end ml-auto mb-2">
                          <Button
                            type="button"
                            className="!text-sm"
                            onClick={() =>
                              handleToggleAll(allStatusTrue, setNotificationSettings, i)
                            }
                          >
                            {allStatusTrue ? "Unselect All" : "Select All"}
                          </Button>
                        </div>
                        <Grid className="!grid-cols-12 !gap-2">
                          {sections.map(({ label, action }, itemIdx) => (
                            <div className="col-span-6" key={itemIdx}>
                              <Grid className="!gap-0">
                                <div className="col-span-8 self-center">
                                  <p className="flex text-[12px] font-semibold justify-between">{label}</p>
                                </div>
                                <div className="col-span-4">
                                  <SwitchButton
                                    isOn={
                                      notificationSettings?.find((n) => n.index === activeIndex1)
                                        ?.sections.find((s) => s.action === action)?.status ?? false
                                    }
                                    handleToggle={() =>
                                      handleAddOrUpdate1(action, allStatusTrue, setNotificationSettings, i)
                                    }
                                  />
                                </div>
                              </Grid>
                            </div>
                          ))}
                        </Grid>
                      </div>
                    </CollapsibleDiv>
                  </div>
                );
              })}

            </Grid>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default UserList;
