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
import view from "../../../../assets/images/eye.png";
import paper from "../../../../assets/images/paper.png";
import {
  changeServicerStatus,
  getServicerListByDealerId,
} from "../../../../services/servicerServices";
import { RotateLoader } from "react-spinners";
import { useFormik } from "formik";
import * as Yup from "yup";
import { unAssignedServicerForDealer } from "../../../../services/dealerServices";
import { getResellerServicers } from "../../../../services/reSellerServices";
import Card from "../../../../common/card";

function ServicerList(props) {
  console.log(props);
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
    getServicerList();
  };
  useEffect(() => {
    getServicerList();
  }, []);

  const getServicerList = async () => {
    setLoading(true);
    console.log(props.id);
    const result =
      props.flag == "reseller"
        ? await getResellerServicers(props.id)
        : await getServicerListByDealerId(props.id);
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

  useEffect(() => {
    console.log(props);
    if (props?.activeTab == "Servicer") {
      getServicerList();
    }
  }, [props]);

  const filterServicerRequest = async (data) => {
    try {
      setLoading(true);
      const res =
        props.flag == "reseller"
          ? await getResellerServicers(props.id, data)
          : await getServicerListByDealerId(props.id, data);
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
    const isCloseToBottom = servicerData.length - index <= 10000;
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

  const formatPhoneNumber = (phoneNumber) => {
    const cleaned = ("" + phoneNumber).replace(/\D/g, ""); // Remove non-numeric characters
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/); // Match groups of 3 digits

    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    return phoneNumber; // Return original phone number if it couldn't be formatted
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

  const columns =
    props.flag === "reseller"
      ? [
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
          name: "Phone #",
          selector: (row) => "+1 " + formatPhoneNumber(row.phoneNumber),
          sortable: true,
        },
        {
          name: "# of Claims",
          selector: (row) => row.claimNumber?.noOfOrders ?? 0,
          sortable: true,
        },
        {
          name: "Total Claims Value",
          selector: (row) =>
            `$${formatOrderValue(
              row?.claimValue?.totalAmount ?? parseInt(0)
            )}`,
          sortable: true,
        },
      ]
      : [
        {
          name: "Sr.#",
          selector: (row, index) => index + 1,
          sortable: true,
          minWidth: "auto", // Set a custom minimum width
          maxWidth: "90px", // Set a custom maximum width
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
          name: "Phone #",
          selector: (row) => "+1 " + formatPhoneNumber(row.phoneNumber),
          sortable: true,
        },
        {
          name: "# of Claims",
          selector: (row) => row.claimNumber?.noOfOrders ?? 0,
          sortable: true,
        },
        {
          name: "Total Claims Value",
          selector: (row) =>
            `$${formatOrderValue(
              row?.claimValue?.totalAmount ?? parseInt(0)
            )}`,
          sortable: true,
        },

        {
          name: "Action",
          minWidth: "auto", // Set a custom minimum width
          maxWidth: "70px", // Set a custom maximum width
          cell: (row, index) => {
            // console.log(index, index % 10 == 9)
            if (row.servicerData.isServicer) {
              return null;
            } else {
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
                      className={`absolute z-[2] w-[120px] drop-shadow-5xl -right-3 mt-2 py-1 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                        index
                      )}`}
                    >
                      <div
                        onClick={() => {
                          navigate(`/servicerDetails/${row.accountId}`);
                        }}
                        className="text-left cursor-pointer border-b  flex hover:font-semibold py-1 px-2"
                      >
                        <img src={view} className="w-4 h-4 mr-2" />{" "}
                        <span className="self-center"> View </span>
                      </div>
                      <div
                        onClick={() => openModal(row)}
                        className="text-left cursor-pointer flex hover:font-semibold py-1 px-2"
                      >
                        <img src={paper} className="w-4 h-4 mr-2" />{" "}
                        <span className="self-center">Unassigned </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            }
          },
        },
      ];

  return (
    <>
      <div className="my-8">
        <Card className="bg-white mt-6 border-[1px] border-Light-Grey rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className="col-span-5 self-center">
              <p className="text-xl font-semibold">Servicer List</p>
            </div>
            <div className="col-span-7">
              <div className="bg-grayf9 rounded-[30px] p-3 border-[1px] border-Light-Grey">
                <form onSubmit={formik.handleSubmit}>
                  <Grid className="!grid-cols-11">
                    <div className="col-span-3 self-center">
                      <Input
                        name="name"
                        type="text"
                        className="!text-[14px] !bg-White-Smoke"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
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
                        className="!text-[14px] !bg-White-Smoke"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
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
                        type="number"
                        className="!text-[14px] !bg-White-Smoke"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
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
                      <Button type="submit" className="!p-2">
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
              <DataTable draggableColumns={false} columns={columns}
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
        </Card>
      </div>

      {/* Would you like to Unassigned it? */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center py-3">
          <img src={unassign} alt="email Image" className="mx-auto my-4" />
          <p className="text-3xl mb-0 mt-2 font-[800]">
            Would you like to Unassigned it?
          </p>
          <Grid className="!grid-cols-4 my-5 ">
            <div className="col-span-1"></div>
            <Button onClick={() => openModal1()}>Yes</Button>
            <Button
              className="border w-full !border-Bright-Grey !bg-[transparent] !text-light-black !text-sm !font-Regular"
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
          <p className="text-3xl mb-0 mt-2 font-[800]">
            Unassigned Successfully
          </p>
          <p className=" text-base font-medium mt-2">
            You have successfully Unassigned
          </p>
        </div>
      </Modal>
    </>
  );
}

export default ServicerList;
