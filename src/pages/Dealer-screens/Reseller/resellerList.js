import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../common/button";

import ActiveIcon from "../../../assets/images/icons/iconAction.svg";
import clearFilter from "../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import AddItem from "../../../assets/images/icons/addItem.svg";
import Search from "../../../assets/images/icons/SearchIcon.svg";
import Headbar from "../../../common/headBar";
import shorting from "../../../assets/images/icons/shorting.svg";
import Grid from "../../../common/grid";
import view from "../../../assets/images/eye.png";
import Input from "../../../common/input";
import DataTable from "react-data-table-component";
import Select from "../../../common/select";
import { getDealersList } from "../../../services/dealerServices";
import { RotateLoader } from "react-spinners";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getResellerList } from "../../../services/dealerServices/priceBookServices";
import { changeResellerStatus } from "../../../services/reSellerServices";
// Declare the base URL of the API
function DealerResellerList() {
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [resellerList, setResellerList] = useState([]);
  const [dealerList, setDealerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSelectChange1 = (name, value) => {
    console.log(value);
    setSelectedProduct(value);
    formik.setFieldValue(name, value);
  };

  const status = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];

  const getResellersList = async () => {
    setLoading(true);
    const result = await getResellerList({});
    console.log(result.result);
    setResellerList(result.result);
    setLoading(false);
  };

  const formatPhoneNumber = (phoneNumber) => {
    const cleaned = ("" + phoneNumber).replace(/\D/g, ""); // Remove non-numeric characters
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/); // Match groups of 3 digits

    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    return phoneNumber; // Return original phone number if it couldn't be formatted
  };
  const dropdownRef = useRef(null);

  const calculateDropdownPosition = (index) => {
    const isCloseToBottom = resellerList.length - index <= 10000;
    return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
  };

  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      status: "",
    },
    validationSchema: Yup.object({
      name: Yup.string(),
      email: Yup.string(),
      phone: Yup.number(),
    }),
    onSubmit: async (values) => {
      if (values.status === "true" || values.status === "false") {
        values.status = values.status === "true";
      }
      console.log("Form values:", values);
      getFilteredResellerList(values);
    },
  });

  const CustomNoDataComponent = () => (
    <div className="text-center my-5">
      <p>No records found.</p>
    </div>
  );

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
      selector: (row) => row.resellerData.unique_key,
      sortable: true,
      minWidth: "auto",
      maxWidth: "70px",
    },
    {
      name: "Name",
      selector: (row) => row?.resellerData?.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Phone No.",
      selector: (row) => formatPhoneNumber(row.phoneNumber),
      sortable: true,
    },
    {
      name: "# of Orders",
      selector: (row) => row?.orders?.noOfOrders ?? 0,
      sortable: true,
    },
    {
      name: "Order Value",
      selector: (row) =>
        `$${
          row?.orders?.orderAmount === undefined
            ? parseInt(0).toLocaleString(2)
            : formatOrderValue(row?.orders?.orderAmount)
        }`,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.dealerData.accountStatus,
      sortable: true,
      cell: (row) => (
        <div className="relative">
          <div
            className={` ${
              row.resellerData.status === true ? "bg-[#6BD133]" : "bg-[#FF4747]"
            } absolute h-3 w-3 rounded-full top-[33%] ml-[8px]`}
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
      maxWidth: "90px",
      cell: (row, index) => {
        // console.log(index, index % 10 == 9)
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
                className={`absolute z-[2] w-[80px] drop-shadow-5xl -right-3 mt-2 p-2 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                  index
                )}`}
              >
                {/* <img src={arrowImage} className={`absolute  object-contain left-1/2 w-[12px] ${index%10 === 9 ? 'bottom-[-5px] rotate-180' : 'top-[-5px]'} `} alt='up arror'/> */}
                <div
                  onClick={() => {
                    localStorage.removeItem("Resellermenu");
                    navigate(`/dealer/resellerDetails/${row?.accountId}`);
                  }}
                  className="text-left cursor-pointer flex hover:font-semibold py-1"
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

  useEffect(() => {
    getResellersList();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSelectedAction(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleFilterIconClick = () => {
    formik.resetForm();
    console.log(formik.values);
    getResellersList();
  };

  const getFilteredResellerList = async (data) => {
    try {
      setLoading(true);
      const res = await getResellerList(data);
      console.log(res.result);
      setResellerList(res.result);
    } catch (error) {
      console.error("Error fetching category list:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="my-8 ml-3">
        <Headbar />

        <div className="flex mt-2">
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9	mb-[3px]">Reseller</p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/dealer/dashboard"}>Reseller /</Link>{" "}
              </li>
              <li className="text-sm text-neutral-grey font-semibold ml-1">
                Resellers List
              </li>
            </ul>
          </div>
        </div>

        <Link
          to={"/dealer/addReseller"}
          className=" w-[200px] !bg-white font-semibold py-2 px-4 ml-auto flex self-center mb-4 rounded-xl ml-auto border-[1px] border-[#D1D1D1]"
        >
          <img src={AddItem} className="self-center" alt="AddItem" />{" "}
          <span className="text-black ml-3 text-[14px] font-Regular">
            {" "}
            Add New Reseller{" "}
          </span>{" "}
        </Link>

        <div className="bg-white mt-6 border-[1px] border-[#D1D1D1] rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className="col-span-4 self-center">
              <p className="text-xl font-semibold">Resellers List</p>
            </div>
            <div className="col-span-8">
              <div className="bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                <form onSubmit={formik.handleSubmit}>
                  <Grid className="!grid-cols-9">
                    <div className="col-span-2 self-center">
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
                    <div className="col-span-2 self-center">
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
                    <div className="col-span-2 self-center">
                      <Input
                        name="phone"
                        type="tel"
                        className="!text-[14px] !bg-[#f7f7f7]"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                        label=""
                        placeholder="Phone No."
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
                    <div className="col-span-2 self-center">
                      <Select
                        label=""
                        name="status"
                        OptionName="Status"
                        options={status}
                        color="text-[#1B1D21] opacity-50"
                        className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                        className="!text-[14px] !bg-[#f7f7f7] "
                        value={formik.values.status}
                        onChange={formik.setFieldValue}
                      />
                    </div>
                    <div className="col-span-1 self-center flex">
                      <Button type="submit" className="!p-0">
                        <img
                          src={Search}
                          className="cursor-pointer	"
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
                data={resellerList}
                highlightOnHover
                sortIcon={
                  <>
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

export default DealerResellerList;
