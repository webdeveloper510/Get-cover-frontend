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
import make from "../../../../assets/images/star.png";
import edit from "../../../../assets/images/edit-text.png";
import Grid from "../../../../common/grid";
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

function UserList(props) {
  console.log(props)
  const { toggleFlag } = useMyContext();
  const [selectedAction, setSelectedAction] = useState(null);
  const [userList, setUserList] = useState([]);
  const [isModalOpen, SetIsModalOpen] = useState(false);
  const [isprimary, SetIsprimary] = useState(false);
  const [mainStatus, setMainStatus] = useState(true);
  const [servicerStatus, setServiceStatus] = useState(true);
  const [deleteId, setDeleteId] = useState("");

  const [primaryText, SetPrimaryText] = useState("");
  const [secondaryText, SetSecondaryText] = useState("");
  const [timer, setTimer] = useState(3);
  const dropdownRef = useRef(null);

  const [isModalOpen12, setIsModalOpen12] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState({
    lastName: "",
    firstName: "",
    phoneNumber: "",
    position: "",
    status: true,
    id: "",
  });
  // console.log("toggleFlag", toggleFlag);
  const [loading, setLoading] = useState(false);

  const getUserList = async (data = {}) => {
    setLoading(true);
    switch (props.flag) {
      case "customer":
        const customerResult = await getCustomerUsersById(props.id, data);
        console.log(customerResult.result);
        setUserList(customerResult.result);
        break;
      case "servicer":
        const servicerResult = await getServicerUsersById(props.id, data);
        console.log(servicerResult);
        setServiceStatus(servicerResult.servicerStatus);
        setUserList(servicerResult.result);
        break;
      case "reseller":
        const resellerResult = await getResellerUsersById(props.id, data);
        console.log(resellerResult);
        setServiceStatus(resellerResult.servicerStatus);
        setUserList(resellerResult.data);
        break;
      default:
        const defaultResult = await getUserListByDealerId(props.id, data);
        console.log(defaultResult.result);
        setServiceStatus(defaultResult.dealerStatus);
        setUserList(defaultResult.result);
        break;
    }

    setLoading(false);
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setSelectedAction(null);
    }
  };
  useEffect(() => {
    if(props.activeTab == "Users")
    {
      getUserList();
    }
    else {
      getUserList();
    }
  //   {
  //     // getAllClaims();
  //   }
      
  }, []);

  useEffect(()=>{
    if(props.activeTab == 'Users')
    {
    getUserList();
      
    }
  },[props.activeTab])

  
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      // Cleanup the event listener on component unmount
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

      console.log(result);
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
      setLoading(true);
      const result = await updateUserDetailsById(values);
      if (result.code == 200) {
        setLoading(false);
        SetPrimaryText("User Edited Successfully ");
        SetSecondaryText("user edited successfully ");
        openModal();
        toggleFlag();
        setTimer(3);
        // getUserList();
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
      // getUserList();
      setIsModalOpen12(true);
      // closeModal1();
    }
  };
  const editUser = async (id) => {
    console.log(id);
    const result = await userDetailsById(id);
    console.log(result.result.status);
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

    openModal2();
  };

  const makeUserPrimary = async (row) => {
    console.log(row._id);
    const result = await changePrimaryByUserId(row._id);
    console.log(result);
    if (result.code === 200) {
      SetPrimaryText("It's set to Primary");
      SetSecondaryText("We have successfully made this user primary");
      toggleFlag();
      openModal();
    }
  };

  const handleFilterIconClick = () => {
    formikUSerFilter.resetForm();
    console.log(formikUSerFilter.values);
    getUserList();
  };
  const emailValidationRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const formikUSerFilter = useFormik({
    initialValues: {
      firstName: "",
      email: "",
      phone: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string(),
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
      selector: (row) => formatPhoneNumber(row.phoneNumber),
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
            disabled={row.isPrimary || !servicerStatus}
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
                  !row.isPrimary ? "w-[120px]" : "w-[80px]"
                } drop-shadow-5xl -right-3 mt-2 bg-white py-1 border rounded-lg shadow-md ${calculateDropdownPosition(
                  index
                )}`}
              >
                {!row.isPrimary && row.status && (
                  <div
                    onClick={() => makeUserPrimary(row)}
                    className="text-left cursor-pointer flex border-b hover:font-semibold py-1 px-2"
                  >
                    <img src={make} className="w-4 h-4 mr-2" />{" "}
                    <span className="self-center"> Make Primary </span>
                  </div>
                )}

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
        );
      },
    },
  ];

  const CustomNoDataComponent = () => (
    <div className="text-center my-5">
      <p>No records found.</p>
    </div>
  );

  return (
    <>
      <div className="my-8">
        <div className="bg-white mt-6 border-[1px] border-[#D1D1D1] rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className="col-span-3 self-center">
              <p className="text-xl font-semibold">Users List</p>
            </div>
            <div className="col-span-9">
              <div className="bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                <form className="" onSubmit={formikUSerFilter.handleSubmit}>
                  <Grid className="!grid-cols-9">
                    <div className="col-span-2 self-center">
                      <Input
                        name="firstName"
                        type="text"
                        className="!text-[14px] !bg-[#f7f7f7]"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
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
                        className="!text-[14px] !bg-[#f7f7f7]"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
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
                        className="!text-[14px] !bg-[#f7f7f7]"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
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
                        className="!text-[14px] !bg-[#f7f7f7]"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                        label=""
                        placeholder="Phone"
                        value={formikUSerFilter.values.phone}
                        onBlur={formikUSerFilter.handleBlur}
                        onChange={(e) => {
                          const sanitizedValue = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                          console.log(sanitizedValue);
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
                      <Button type="submit" className="!p-0">
                        <img
                          src={Search}
                          className="cursor-pointer "
                          alt="Search"
                        />
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          handleFilterIconClick();
                        }}
                        className="!bg-transparent !p-0"
                      >
                        <img
                          src={clearFilter}
                          className="cursor-pointer	mx-auto"
                          alt="clearFilter"
                        />
                      </Button>
                    </div>
                  </Grid>
                </form>
              </div>
            </div>
          </Grid>
          <div className="mb-5 relative dealer-detail">
            {loading ? (
              <div className=" h-[400px] w-full flex py-5">
                <div className="self-center mx-auto">
                  <RotateLoader color="#333" />
                </div>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={userList}
                highlightOnHover
                sortIcon={
                  <>
                    {" "}
                    <img src={shorting} className="ml-2" alt="shorting" />
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
        </div>
      </div>

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
              className="border w-full !border-[#535456] !bg-[transparent] !text-light-black !text-sm !font-Regular"
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

      {/* Modal Edit Popop */}
      <Modal isOpen={isModalOpen2} onClose={closeModal2}>
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
                  className="!bg-[#fff]"
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
                  className="!bg-[#fff]"
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
                  className="!bg-[#fff]"
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
                  label="Mobile Number"
                  required={true}
                  className="!bg-[#fff]"
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
                  disabled={isprimary || !mainStatus}
                  className="!bg-[#fff]"
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
                  className="border w-full !border-[#535456] !bg-[transparent] !text-light-black !text-sm !font-Regular"
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
    </>
  );
}

export default UserList;
