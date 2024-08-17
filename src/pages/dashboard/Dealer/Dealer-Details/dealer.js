import React, { useEffect, useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import Button from "../../../../common/button";

import ActiveIcon from "../../../../assets/images/icons/iconAction.svg";
import unassign from "../../../../assets/images/Unassign.png";

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

import { RotateLoader } from "react-spinners";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getServicerDealers } from "../../../../services/servicerServices";
import {
  changeDealerStatus,
  unAssignedServicerForDealer,
} from "../../../../services/dealerServices";
import Primary from "../../../../assets/images/SetPrimary.png";
import Card from "../../../../common/card";

function DealerDetailList(props) {
  const [selectedAction, setSelectedAction] = useState(null);
  const dropdownRef = useRef(null);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [servicerDealersList, setServicerDealersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [timer, setTimer] = useState(3);
  const [rowValue, setRowValue] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const closeModal1 = () => {
    setIsModalOpen1(false);
  };
  const CustomNoDataComponent = () => (
    <div className="text-center my-5">
      <p>No records found.</p>
    </div>
  );
  const servicerDealers = async () => {
    console.log(props.id);
    setLoading(true);
    const result = await getServicerDealers(props.id);
    setServicerDealersList(result.data);
    console.log(result.data);
    setLoading(false);
  };
  const openModal1 = async () => {
    setLoading(true);
    console.log(rowValue);
    let bodyValue = {
      dealerId: rowValue.dealerData._id,
      servicerId: props.id,
    };
    const data = await unAssignedServicerForDealer(bodyValue);
    console.log(data);
    if (data) {
      setIsModalOpen(false);
      setLoading(false);
      servicerDealers();
    } else {
      setIsModalOpen(false);
      setLoading(false);
      servicerDealers();
    }
    setIsModalOpen1(true);
  };

  const formatPhoneNumber = (phoneNumber) => {
    const cleaned = ("" + phoneNumber).replace(/\D/g, ""); // Remove non-numeric characters
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/); // Match groups of 3 digits

    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    return phoneNumber; // Return original phone number if it couldn't be formatted
  };

  useEffect(() => {
    if (props.flag && props.activeTab === "Dealer") {
      servicerDealers();
    }
  }, [props?.flag]);

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
  const handleStatusChange = async (row, newStatus) => {
    // console.log("row", row);
    try {
      setServicerDealersList((dealerData) => {
        return dealerData.map((data) => {
          console.log(data);
          if (data.metaId.toString() === row.metaId.toString()) {
            return {
              ...data,
              status: newStatus === "active" ? true : false,
            };
          }
          return data;
        });
      });

      const result = await changeDealerStatus(row.metaId.toString(), {
        status: newStatus === "active" ? true : false,
      });

      console.log(result);
    } catch (error) {
      console.error("Error in handleStatusChange:", error);
    }
  };
  useEffect(() => {
    servicerDealers();
  }, []);
  const filterDealerListGet = async (data) => {
    try {
      setLoading(true);
      const res = await getServicerDealers(props.id, data);
      console.log(res.data);
      setServicerDealersList(res.data);
    } catch (error) {
      console.error("Error fetching category list:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleFilterIconClick = () => {
    formik.resetForm();
    console.log(formik.values);
    getServicerDealers();
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
    },
    validationSchema: Yup.object({
      name: Yup.string(),
      email: Yup.string(),
      phoneNumber: Yup.number(),
    }),
    onSubmit: async (values) => {
      console.log("Form values:", values);
      filterDealerListGet(values);
    },
  });
  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
  };
  const calculateDropdownPosition = (index) => {
    const isCloseToBottom = servicerDealersList.length - index <= 10000;
    return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
  };
  const openModal = (row) => {
    setRowValue(row);
    setIsModalOpen(true);
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

  const columns = [
    {
      name: "Sr.#",
      selector: (row, index) => index + 1,
      sortable: true,
      minWidth: "auto",
      maxWidth: "90px",
    },
    {
      name: "Dealer Name",
      selector: (row) => row.dealerData.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.dealerData.userData.email,
      sortable: true,
    },
    {
      name: "# Phone",
      selector: (row) =>
        "+1 " + formatPhoneNumber(row.dealerData.userData.phoneNumber),
      sortable: true,
    },
    {
      name: "# of Claim",
      selector: (row) =>
        row?.dealerData?.claimsData?.[0]?.numberOfClaims === undefined
          ? 0
          : row?.dealerData?.claimsData?.[0]?.numberOfClaims,
      sortable: true,
    },
    {
      name: "Claims Values",
      selector: (row) =>
        `$${row?.dealerData?.claimsData?.[0]?.totalAmount === undefined
          ? parseInt(0).toLocaleString(2)
          : formatOrderValue(row?.dealerData?.claimsData?.[0]?.totalAmount)
        }`,
      sortable: true,
    },
    // {
    //   name: "Status",
    //   selector: (row) => row.status,
    //   sortable: true,
    //   cell: (row) => (
    //     <div className="relative">
    //       <div
    //         className={` ${
    //           row.status === true ? "bg-[#6BD133]" : "bg-[#FF4747]"
    //         } absolute h-3 w-3 rounded-full top-[33%] ml-[8px]`}
    //       ></div>
    //       <select
    //         // disabled={row.isPrimary === true ? true : false}
    //         value={row.status === true ? "active" : "inactive"}
    //         onChange={(e) => handleStatusChange(row, e.target.value)}
    //         className="text-[12px] border border-gray-300 text-[#727378] rounded pl-[20px] py-2 pr-1 font-semibold rounded-xl"
    //       >
    //         <option value="active">Active</option>
    //         <option value="inactive">Inactive</option>
    //       </select>
    //     </div>
    //   ),
    // },
    {
      name: "Action",
      minWidth: "auto",
      maxWidth: "90px",
      cell: (row, index) => {
        // console.log(index, index % 10 == 9)
        return (
          <div className="relative">
            <div
              onClick={() =>
                setSelectedAction(
                  selectedAction === row.dealerData.unique_key
                    ? null
                    : row.dealerData.unique_key
                )
              }
            >
              <img
                src={ActiveIcon}
                className="cursor-pointer	w-[35px]"
                alt="Active Icon"
              />
            </div>
            {selectedAction === row.dealerData.unique_key && (
              <div
                ref={dropdownRef}
                className={`absolute z-[2] w-[120px] drop-shadow-5xl -right-3 mt-2 py-1 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                  index
                )}`}
              >
                <div
                  className="text-center cursor-pointer flex py-1 border-b px-2 text-black"
                  onClick={() => {
                    navigate(`/dealerDetails/${row.dealerId}`);
                  }}
                >
                  <img src={view} className="w-4 h-4 mr-2" />{" "}
                  <span className="self-center"> View </span>
                </div>
                <div
                  className="text-center py-1 px-2 flex cursor-pointer text-black"
                  onClick={() => openModal(row)}
                >
                  <img src={paper} className="w-4 h-4 mr-2" />{" "}
                  <span className="self-center">Unassigned </span>
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
        <Card className="bg-white mt-6 border-[1px] border-Light-Grey rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className="col-span-5 self-center">
              <p className="text-xl font-semibold">Dealer List</p>
            </div>
            <div className="col-span-7">
              <div className="bg-grayf9 rounded-[30px] p-3 border-[1px] border-Light-Grey">
                <form onSubmit={formik.handleSubmit}>
                  <Grid className="!grid-cols-11">
                    <div className="col-span-3 self-center">
                      <Input
                        name="name"
                        type="text"
                        placeholder="Name"
                        className="!text-[14px] !bg-White-Smoke"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
                        label=""
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    <div className="col-span-3 self-center">
                      <div className="col-span-3 self-center">
                        <Input
                          name="email"
                          type="text"
                          placeholder="Email"
                          className="!text-[14px] !bg-White-Smoke"
                          className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
                          label=""
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </div>
                    </div>
                    <div className="col-span-3 self-center">
                      <Input
                        name="phoneNumber"
                        type="number"
                        placeholder="Phone No."
                        className="!text-[14px] !bg-White-Smoke"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
                        label=""
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
                      />
                    </div>
                    <div className="col-span-2 self-center flex justify-center">
                      <Button type="submit" className="!p-2">
                        <img
                          src={Search}
                          className="cursor-pointer	mx-auto"
                          alt="Search"
                        />
                      </Button>

                      <Button
                        type="submit"
                        onClick={() => {
                          handleFilterIconClick();
                        }}
                        className="!bg-transparent  !p-0"
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
                draggableColumns={false}
                data={servicerDealersList}
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
          <p className="text-3xl mb-0 mt-2 font-[800] text-light-black">
            Unassigned Successfully
          </p>
          <p className="text-neutral-grey text-base font-medium mt-2">
            You have successfully Unassigned
          </p>
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

export default DealerDetailList;
