import React, { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";
import Button from "../../../common/button";

import ActiveIcon from "../../../assets/images/icons/iconAction.svg";
import arrowImage from "../../../assets/images/dropdownArrow.png";
import Search from "../../../assets/images/icons/SearchIcon.svg";
import Headbar from "../../../common/headBar";
import AddItem from "../../../assets/images/icons/addItem.svg";
import Grid from "../../../common/grid";
import view from "../../../assets/images/eye.png";
import Input from "../../../common/input";
import DataTable from "react-data-table-component";
import clearFilter from "../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import {
  changeDealerStatus,
  getDealersList,
} from "../../../services/dealerServices";
import shorting from "../../../assets/images/icons/shorting.svg";
import Loader from "../../../assets/images/Loader.gif";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RotateLoader } from "react-spinners";
import axios from "axios";

const url = process.env.REACT_APP_API_KEY_LOCAL

function DealerList() {
  const [selectedAction, setSelectedAction] = useState(null);
  const [dealerList, setDealerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
  };

  const handleStatusChange = async (row, newStatus) => {
    // console.log("row", row);
    try {
      setDealerList((dealerData) => {
        return dealerData.map((data) => {
          console.log(data);
          if (data.accountId === row.accountId) {
            return {
              ...data,
              dealerData: {
                ...data.dealerData,
                accountStatus: newStatus === "active" ? true : false,
              },
            };
          }
          return data;
        });
      });

      const result = await changeDealerStatus(row.accountId, {
        status: newStatus === "active" ? true : false,
      });

      console.log(result);
    } catch (error) {
      console.error("Error in handleStatusChange:", error);
    }
  };
  const getDealerList = async () => {
    setLoading(true);
    const result = await getDealersList({});
    console.log(result.data);
    setDealerList(result.data);
    setLoading(false);
  };
  const calculateDropdownPosition = (index) => {
    const isCloseToBottom = dealerList.length - index <= 10000;
    return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      // Close the dropdown if the click is outside of it
      setSelectedAction(null);
    }
  };
  useEffect(() => {
    getDealerList();

    document.addEventListener("click", handleClickOutside);

    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleFilterIconClick = () => {
    formik.resetForm();
    console.log(formik.values);
    getDealerList();
  };

  const filterDealerListGet = async (data) => {
    try {
      setLoading(true);
      const res = await getDealersList(data);
      console.log(res.data);
      setDealerList(res.data);
    } catch (error) {
      console.error("Error fetching category list:", error);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      // status: categoryDetails.status ? categoryDetails.status : true,
    },
    validationSchema: Yup.object({
      name: Yup.string().trim(),
      email: Yup.string(),
      phoneNumber: Yup.number(),
    }),
    onSubmit: async (values) => {
      console.log("Form values:", values.name.replace(/\s+/g, " "));

      filterDealerListGet(values);
    },
  });

  const CustomNoDataComponent = () => (
    <div className="text-center my-5">
      <p>No records found.</p>
    </div>
  );

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

  const columns = [
    {
      name: "ID",
      selector: (row) => row?.dealerData.unique_key,
      sortable: true,
      minWidth: "auto",
      maxWidth: "70px",
    },
    {
      name: "Name",
      selector: (row) => row?.dealerData.name.trim(),
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row?.email,
      sortable: true,
      minWidth: "220px",
    },
    {
      name: "Phone #",
      selector: (row) => "+1 " + formatPhoneNumber(row.phoneNumber),
      sortable: true,
    },
    {
      name: "# of Orders",
      selector: (row) => row?.ordersData?.noOfOrders ?? 0,
      sortable: true,
    },
    {
      name: "Order Values",
      selector: (row) =>
        `$${
          row?.ordersData?.orderAmount === undefined
            ? parseInt(0).toLocaleString(2)
            : formatOrderValue(row?.ordersData?.orderAmount ?? parseInt(0))
        }`,
      sortable: true,
      minWidth: "auto",
      maxWidth: "170px",
    },
    {
      name: "Status",
      selector: (row) => row.dealerData.accountStatus,
      sortable: true,
      cell: (row) => (
        <div className="relative">
          <div
            className={` ${
              row.dealerData.accountStatus === true
                ? "bg-[#6BD133]"
                : "bg-[#FF4747]"
            } absolute h-3 w-3 rounded-full top-[33%] ml-[8px]`}
          ></div>
          <select
            value={
              row.dealerData.accountStatus === true ? "active" : "inactive"
            }
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
          <div className="relative">
            <div onClick={() => setSelectedAction(row.dealerData.unique_key)}>
              <img
                src={ActiveIcon}
                className="cursor-pointer	w-[35px]"
                alt="Active Icon"
              />
            </div>
            {selectedAction === row.dealerData.unique_key && (
              <div
                ref={dropdownRef}
                className={`absolute z-[2] w-[80px] drop-shadow-5xl -right-3 mt-2 py-1 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                  index
                )}`}
                onClick={() => localStorage.removeItem("menu")}
              >
                <Link
                  to={`/dealerDetails/${row?.dealerData._id}`}
                  className="text-left cursor-pointer flex hover:font-semibold py-2 px-2"
                >
                  <img src={view} className="w-4 h-4 mr-2" /> View
                </Link>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="mb-8 ml-3">
        <Headbar />

        <div className="flex mt-2">
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9	mb-[3px]">Dealer</p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/"}>Dealer </Link> /{" "}
              </li>
              <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
                {" "}
                Dealer List{" "}
              </li>
            </ul>
          </div>
        </div>

        <Button className="!bg-white flex self-center mb-3 rounded-xl ml-auto border-[1px] border-[#D1D1D1]">
          {" "}
          <Link to={"/addDealer"} className="flex">
            {" "}
            <img src={AddItem} className="self-center" alt="AddItem" />{" "}
            <span className="text-black ml-3 text-[14px] font-Regular">
              {" "}
              Add New Dealer{" "}
            </span>{" "}
          </Link>
        </Button>

        <div className="bg-white mt-3 border-[1px] border-[#D1D1D1] rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className="col-span-5 self-center">
              <p className="text-xl font-semibold">Dealers List</p>
            </div>
            <div className="col-span-7">
              <div className="bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                <form onSubmit={formik.handleSubmit}>
                  <Grid className="!grid-cols-11">
                    <div className="col-span-3 self-center">
                      <Input
                        name="name"
                        type="text"
                        placeholder="Name"
                        className="!text-[14px] !bg-[#f7f7f7]"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
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
                          className="!text-[14px] !bg-[#f7f7f7]"
                          className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                          label=""
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {/* {formik.touched.email && formik.errors.email && (
                          <div className="text-red-500">
                            {formik.errors.email}
                          </div>
                        )} */}
                      </div>
                    </div>
                    <div className="col-span-3 self-center">
                      <Input
                        name="phoneNumber"
                        type="tel"
                        nonumber={true}
                        placeholder="Phone No."
                        className="!text-[14px] !bg-[#f7f7f7]"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
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
                      <Button type="submit" className="!p-0">
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
          <div className="mb-5 relative">
            {loading ? (
              <div className=" h-[400px] w-full flex py-5">
                <div className="self-center mx-auto">
                  <RotateLoader color="#333" />
                </div>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={dealerList}
                highlightOnHover
                sortIcon={
                  <>
                    {" "}
                    <img src={shorting} className="ml-2" alt="shorting" />{" "}
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
    </>
  );
}

export default DealerList;
