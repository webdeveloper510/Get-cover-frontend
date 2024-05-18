import React, { useEffect, useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import Button from "../../../common/button";

import ActiveIcon from "../../../assets/images/icons/iconAction.svg";
import arrowImage from "../../../assets/images/dropdownArrow.png";
import clearFilter from "../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import Search from "../../../assets/images/icons/SearchIcon.svg";
import AddItem from "../../../assets/images/icons/addItem.svg";
import view from "../../../assets/images/eye.png";
import Headbar from "../../../common/headBar";
import shorting from "../../../assets/images/icons/shorting.svg";
import Grid from "../../../common/grid";
import Input from "../../../common/input";
import DataTable from "react-data-table-component";
import {
  addNewServicerRequest,
  changeServicerStatus,
  updateServicerStatus,
} from "../../../services/servicerServices";
import { RotateLoader } from "react-spinners";
import { useFormik } from "formik";
import * as Yup from "yup";

function ServicerList() {
  const [selectedAction, setSelectedAction] = useState(null);
  const [servicerList, setServicerList] = useState([]);
  const dropdownRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const calculateDropdownPosition = (index) => {
    const isCloseToBottom = servicerList.length - index <= 10000;
    return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
  };

  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
  };
  useEffect(() => {
    getServicerList();
  }, []);

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

  const getServicerList = async () => {
    setLoading(true);
    const result = await addNewServicerRequest("Approved", {});
    setServicerList(result.data);
    console.log(result.data);
    setLoading(false);
  };

  const handleStatusChange = async (row, newStatus) => {
    console.log("row", row);
    try {
      setServicerList((servicerData) => {
        return servicerData.map((data) => {
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
      const result = await updateServicerStatus(row.accountId, {
        status: newStatus === "active" ? true : false,
        userId: row._id,
      });
      console.log(result);
    } catch (error) {
      console.error("Error in handleStatusChange:", error);
    }
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
      const res = await addNewServicerRequest("Approved", data);
      console.log(res.data);
      setServicerList(res.data);
    } catch (error) {
      console.error("Error fetching category list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterIconClick = () => {
    formik.resetForm();
    console.log(formik.values);
    getServicerList();
  };

  const formatPhoneNumber = (phoneNumber) => {
    const cleaned = ('' + phoneNumber).replace(/\D/g, ''); // Remove non-numeric characters
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/); // Match groups of 3 digits
  
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
  
    return phoneNumber; // Return original phone number if it couldn't be formatted
  }; 

  const columns = [
    {
      name: "ID",
      selector: (row) => row.servicerData.unique_key,
      sortable: true,
      minWidth: "auto",
      maxWidth: "80px",
    },
    {
      name: "Servicer Name",
      selector: (row) => row.servicerData.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      minWidth: "150px",
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
      minWidth: "150px",
    },
    {
      name: "Total Claims Value",
      selector: (row) =>`$${(formatOrderValue(row?.claimValue?.totalAmount ?? parseInt(0)))}`,
      sortable: true,
      minWidth: "180px",
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
      minWidth: "auto",
      maxWidth: "80px",
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
                className={`absolute z-[2] w-[80px] drop-shadow-5xl -right-3 mt-2 py-1 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                  index
                )}`}
              >
                <div
                  onClick={() => {
                    localStorage.removeItem("servicer");
                    navigate(`/servicerDetails/${row.accountId}`);
                  }}
                  className="text-left cursor-pointer flex hover:font-semibold py-1 px-2"
                  >
                   <img src={view} className="w-4 h-4 mr-2"/> View
                </div>
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

  return (
    <>
      <div className="mb-8 ml-3">
        <Headbar />

        <div className="flex mt-2">
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9	mb-[3px]">Servicer</p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/"}>Servicer </Link> /
              </li>
              <li className="text-sm text-neutral-grey font-semibold ml-1">
                <Link to={"/servicerList"}>Servicer List </Link>{" "}
              </li>
            </ul>
          </div>
        </div>

        <Link
          to={"/addServicer"}
          className=" w-[200px] !bg-white font-semibold py-2 px-4 ml-auto flex self-center mb-4 rounded-xl ml-auto border-[1px] border-Light-Grey"
        >
          {" "}
          <img src={AddItem} className="self-center" alt="AddItem" />{" "}
          <span className="text-black ml-3 text-[14px] font-semibold">
            Add New Servicer{" "}
          </span>{" "}
        </Link>

        <div className="bg-white mt-6 border-[1px] border-Light-Grey rounded-xl">
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
                        nonumber={true}
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
                data={servicerList}
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
    </>
  );
}

export default ServicerList;
