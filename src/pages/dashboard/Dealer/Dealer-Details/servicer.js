import React, { useEffect, useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import Button from "../../../../common/button";

import ActiveIcon from "../../../../assets/images/icons/iconAction.svg";
import Primary from "../../../../assets/images/SetPrimary.png";
import unassign from "../../../../assets/images/Unassign.png";
import AddItem from "../../../../assets/images/icons/addItem.svg";
import Search from "../../../../assets/images/icons/SearchIcon.svg";
import clearFilter from "../../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import Headbar from "../../../../common/headBar";
import shorting from "../../../../assets/images/icons/shorting.svg";
import Grid from "../../../../common/grid";
import Input from "../../../../common/input";
import DataTable from "react-data-table-component";
import Modal from "../../../../common/model";
import {
  changeServicerStatus,
  getServicerListByDealerId,
} from "../../../../services/servicerServices";
import { RotateLoader } from "react-spinners";
import { useFormik } from "formik";
import * as Yup from "yup";
import { unAssignedServicerForDealer } from "../../../../services/dealerServices";

function ServicerList(props) {
  const [selectedAction, setSelectedAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [timer, setTimer] = useState(3);
  const [servicerData, setServicerData] = useState([]);
  const [rowValue, setRowValue] = useState({});
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModal = (row) => {
    setRowValue(row);
    setIsModalOpen(true);
  };

  const closeModal1 = () => {
    setIsModalOpen1(false);
  };
  useEffect(() => {
    setLoading(true);
    let intervalId;

    if (isModalOpen1 && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0) {
      closeModal1();
    }

    if (!isModalOpen1) {
      clearInterval(intervalId);
      setTimer(3);
    }

    setLoading(false);

    return () => {
      clearInterval(intervalId);
    };
  }, [isModalOpen1, timer]);
  const openModal1 = async () => {
    setLoading(true);
    console.log(rowValue);
    let bodyValue = {
      dealerId: props.id,
      servicerId: rowValue.servicerData._id,
    };
    const data = await unAssignedServicerForDealer(bodyValue);
    console.log(data);
    if (data) {
      setIsModalOpen(false);
      setLoading(false);
      getServicerList();
    } else {
      setIsModalOpen(false);
      setLoading(false);
      getServicerList();
    }
    setIsModalOpen1(true);
  };
  useEffect(() => {
    getServicerList();
  }, []);
  useEffect(() => {
    if (props.flag) {
      getServicerList();
    }
  }, [props?.flag]);

  const getServicerList = async () => {
    setLoading(true);
    console.log(props.id);
    const result = await getServicerListByDealerId(props.id);
    setServicerData(result.data);
    console.log(result.data);
    setLoading(false);
  };
  const CustomNoDataComponent = () => (
    <div className="text-center my-5">
      <p>No records found.</p>
    </div>
  );

  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
  };
  const handleFilterIconClick = () => {
    formik.resetForm();
    console.log(formik.values);
    getServicerList();
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
    },
    validationSchema: Yup.object({
      name: Yup.string(),
      email: Yup.string(),
      phone: Yup.number(),
    }),
    onSubmit: async (values) => {
      console.log("Form values:", values);
      filterServicerRequest(values);
    },
  });
  const filterServicerRequest = async (data) => {
    try {
      setLoading(true);
      const res = await getServicerListByDealerId(props.id, data);
      console.log(res.data);
      setServicerData(res.data);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching category list:", error);
    } finally {
      setLoading(false);
    }
  };
  const calculateDropdownPosition = (index) => {
    const isCloseToBottom = servicerData.length - index <= 2;
    return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
  };
  const handleStatusChange = async (row, newStatus) => {
    console.log("row", row);
    try {
      setServicerData((servicerData) => {
        return servicerData.map((data) => {
          console.log("data", data);
          if (data.accountId === row.accountId) {
            return {
              ...data,
              servicerData: {
                ...data.servicerData,
                status: newStatus === "active" ? true : false,
              },
            };
          }
          return data;
        });
      });
      const result = await changeServicerStatus(row.accountId, {
        status: newStatus === "active" ? true : false,
        userId: row._id,
      });
      console.log(result);
    } catch (error) {
      console.error("Error in handleStatusChange:", error);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSelectedAction(null);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const columns = [
    {
      name: "ID",
      selector: (row) => row.servicerData.unique_key,
      sortable: true,
      minWidth: "auto", // Set a custom minimum width
      maxWidth: "70px", // Set a custom maximum width
    },
    {
      name: "Name",
      selector: (row) => row.servicerData.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Phone No.",
      selector: (row) => row.phoneNumber,
      sortable: true,
    },
    {
      name: "# of Claims",
      selector: (row) => 0,
      sortable: true,
    },
    {
      name: "Total Claims Value",
      selector: (row) => "$ 0.00",
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <div className="relative">
          <div
            className={` ${
              row.servicerData.status === true ? "bg-[#6BD133]" : "bg-[#FF4747]"
            } absolute h-3 w-3 rounded-full top-[33%] ml-[8px]`}
          ></div>
          <select
            value={row.servicerData.status === true ? "active" : "inactive"}
            onChange={(e) => handleStatusChange(row, e.target.value)}
            className="text-[12px] border border-gray-300 text-[#727378] rounded pl-[20px] py-2 pr-1 font-semibold rounded-xl"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      ),
      sortable: true,
    },

    {
      name: "Action",
      minWidth: "auto", // Set a custom minimum width
      maxWidth: "70px", // Set a custom maximum width
      cell: (row, index) => {
        // console.log(index, index % 10 == 9)
        return (
          <div className="relative">
            <div
              onClick={() =>
                setSelectedAction(
                  selectedAction === row.servicerData.unique_key
                    ? null
                    : row.servicerData.unique_key
                )
              }
            >
              <img
                src={ActiveIcon}
                className="cursor-pointer	w-[35px]"
                alt="Active Icon"
              />
            </div>
            {selectedAction === row.servicerData.unique_key && (
              <div
                ref={dropdownRef}
                className={`absolute z-[2] w-[80px] drop-shadow-5xl -right-3 mt-2 p-2 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                  index
                )}`}
              >
                <div
                  className="text-center cursor-pointer py-1"
                  onClick={() => {
                    navigate(`/servicerDetails/${row.accountId}`);
                  }}
                >
                  View
                </div>
                <div
                  className="text-center py-3 cursor-pointer"
                  onClick={() => openModal(row)}
                >
                  Unassigned
                </div>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="my-8">
        <div className="bg-white mt-6 border-[1px] border-[#D1D1D1] rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className="col-span-5 self-center">
              <p className="text-xl font-semibold">Servicer List</p>
            </div>
            <div className="col-span-7">
              <div className="bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                <form onSubmit={formik.handleSubmit}>
                  <Grid className="!grid-cols-11">
                    <div className="col-span-3 self-center">
                      <Input
                        name="name"
                        type="text"
                        className="!text-[14px] !bg-[#f7f7f7]"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                        label=""
                        placeholder="Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    <div className="col-span-3 self-center">
                      <Input
                        name="email"
                        type="text"
                        className="!text-[14px] !bg-[#f7f7f7]"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                        label=""
                        placeholder="Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        that
                      />
                    </div>
                    <div className="col-span-3 self-center">
                      <Input
                        name="phone"
                        type="tel"
                        className="!text-[14px] !bg-[#f7f7f7]"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                        label=""
                        placeholder="Phone"
                        value={formik.values.phone}
                        onChange={(e) => {
                          const sanitizedValue = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                          console.log(sanitizedValue);
                          formik.handleChange({
                            target: {
                              name: "phone",
                              value: sanitizedValue,
                            },
                          });
                        }}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    <div className="col-span-2 self-center flex justify-center">
                      <Button type="submit" className="!p-0">
                        <img
                          src={Search}
                          className="cursor-pointer"
                          alt="Search"
                        />
                      </Button>
                      <Button
                        type="submit"
                        onClick={() => {
                          handleFilterIconClick();
                        }}
                        className=" !bg-transparent !p-0"
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
                data={servicerData}
                highlightOnHover
                sortIcon={
                  <>
                    {" "}
                    <img src={shorting} className="ml-2" alt="shorting" />
                  </>
                }
                pagination
                paginationPerPage={10}
                paginationComponentOptions={paginationOptions}
                paginationRowsPerPageOptions={[10, 20, 50, 100]}
                noDataComponent={<CustomNoDataComponent />}
              />
            )}
          </div>
        </div>
      </div>

      {/* Would you like to Unassigned it? */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center py-3">
          <img src={unassign} alt="email Image" className="mx-auto my-4" />
          <p className="text-3xl mb-0 mt-2 font-[800] text-light-black">
            Would you like to Unassigned it?
          </p>
          <Grid className="!grid-cols-4 my-5 ">
            <div className="col-span-1"></div>
            <Button onClick={() => openModal1()}>Yes</Button>
            <Button
              className="border w-full !border-[#535456] !bg-[transparent] !text-light-black !text-sm !font-Regular"
              onClick={() => closeModal()}
            >
              No
            </Button>
            <div className="col-span-1"></div>
          </Grid>
        </div>
      </Modal>

      <Modal isOpen={isModalOpen1} onClose={closeModal1}>
        <div className="text-center py-3">
          <img src={Primary} alt="email Image" className="mx-auto my-4" />
          <p className="text-3xl mb-0 mt-2 font-[800] text-light-black">
            Unassigned Successfully
          </p>
          <p className="text-neutral-grey text-base font-medium mt-2">
            You have successfully Unassigned
          </p>
        </div>
      </Modal>
    </>
  );
}

export default ServicerList;
