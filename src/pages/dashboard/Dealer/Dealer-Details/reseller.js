import React, { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";
import Button from "../../../../common/button";

import ActiveIcon from "../../../../assets/images/icons/iconAction.svg";
import Search from "../../../../assets/images/icons/SearchIcon.svg";
import clearFilter from "../../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import shorting from "../../../../assets/images/icons/shorting.svg";
import Grid from "../../../../common/grid";
import Input from "../../../../common/input";
import DataTable from "react-data-table-component";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RotateLoader } from "react-spinners";
import view from "../../../../assets/images/eye.png";
import {
  getResellerListByDealerId,
  changeResellerStatus,
} from "../../../../services/reSellerServices";
function Reseller(props) {
  const [selectedAction, setSelectedAction] = useState(null);
  const [resellerList, setResellerList] = useState([]);
  const dropdownRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dealerList, setDealerList] = useState([]);

  const calculateDropdownPosition = (index) => {
    const isCloseToBottom = resellerList.length - index <= 10000;
    return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
  };

  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
  };
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

  const handleStatusChange = async (row, newStatus) => {
    try {
      setResellerList((prevResellers) => {
        return prevResellers.map((data) => {
          if (data.accountId === row.accountId) {
            return {
              ...data,
              resellerData: {
                ...data.resellerData,
                status: newStatus === "active" ? true : false,
              },
            };
          }
          return data;
        });
      });
      const result = await changeResellerStatus(row.accountId, {
        status: newStatus === "active" ? true : false,
      });

      console.log(result);
      // getResellersList(); // You might want to refresh the data from the server if needed
    } catch (error) {
      console.error("Error in handleStatusChange:", error);
    }
  };
  const columns = [
    {
      name: "ID",
      selector: (row) => row?.resellerData?.unique_key,
      sortable: true,
      minWidth: "auto", // Set a custom minimum width
      maxWidth: "70px", // Set a custom maximum width
    },
    {
      name: "Name",
      selector: (row) => row.resellerData.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Phone #",
      selector: (row) => formatPhoneNumber(row.phoneNumber),
      sortable: true,
    },
    {
      name: "# of Orders",
      selector: (row) => row?.orderData?.noOfOrders ?? 0,
      sortable: true,
    },
    {
      name: "Order Value",
      selector: (row) =>
        `$${formatOrderValue(row?.orderData?.orderAmount ?? parseInt(0))}`,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.resellerData.status,
      sortable: true,
      cell: (row) => (
        <div className="relative">
          <div
            className={` 
            ${
              row.resellerData.status === true ? "bg-[#6BD133]" : "bg-[#FF4747]"
            }
             absolute h-3 w-3 rounded-full top-[33%] ml-[8px]`}
          ></div>
          <select
            value={row.resellerData.status === true ? "active" : "inactive"}
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
      maxWidth: "70px",
      cell: (row, index) => {
        console.log(row);
        return (
          <div className="relative">
            <div
              onClick={() =>
                setSelectedAction(
                  selectedAction === row.resellerData.unique_key
                    ? null
                    : row.resellerData.unique_key
                )
              }
            >
              <img
                src={ActiveIcon}
                className="cursor-pointer	w-[35px]"
                alt="Active Icon"
              />
            </div>
            {selectedAction === row.resellerData.unique_key && (
              <div
                ref={dropdownRef}
                className={`absolute z-[2] w-[70px] drop-shadow-5xl -right-3 mt-2 p-2 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                  index
                )}`}
              >
                {/* <img src={arrowImage} className={`absolute  object-contain left-1/2 w-[12px] ${index%10 === 9 ? 'bottom-[-5px] rotate-180' : 'top-[-5px]'} `} alt='up arror'/> */}
                <div
                  onClick={() => {
                    localStorage.setItem("menu", "Reseller");
                  }}
                  className="text-left cursor-pointer flex hover:font-semibold py-1"
                >
                  <img src={view} className="w-4 h-4 mr-2" />
                  <Link
                    className="self-center"
                    to={`/resellerDetails/${row.resellerData._id}`}
                  >
                    View{" "}
                  </Link>
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

  const getResellerList = async () => {
    setLoading(true);
    const result = await getResellerListByDealerId({}, props.id);
    setResellerList(result.result);
    console.log(result.result);
    setLoading(false);
  };
  useEffect(() => {
    if (props.activeTab === "Reseller") {
      getResellerList();
    }
  }, [props]);
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

  const [DealserValue, setDealerValue] = useState(null);

  const filterDealerCustomer = async (data) => {
    try {
      setLoading(true);
      const res = await getResellerListByDealerId(data, props.id);
      console.log(res.result);
      setResellerList(res.result);
    } catch (error) {
      console.error("Error fetching category list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterIconClick = () => {
    formik.resetForm();
    console.log(formik.values);
    getResellerList();
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
      console.log(values);
      try {
        await filterDealerCustomer(values);
      } catch (error) {
        console.error("Error filtering customer list:", error);
      }
    },
  });

  return (
    <>
      <div className="my-8">
        <div className="bg-white mt-6 border-[1px] border-[#D1D1D1] rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className="col-span-5 self-center">
              <p className="text-xl font-semibold">Resellers List</p>
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
                          className="cursor-pointer "
                          alt="Search"
                        />
                      </Button>
                      <Button
                        type="submit"
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
                data={resellerList}
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
    </>
  );
}

export default Reseller;
