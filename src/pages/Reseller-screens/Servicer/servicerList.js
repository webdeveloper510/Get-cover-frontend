import React, { useEffect, useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import Button from "../../../common/button";

import ActiveIcon from "../../../assets/images/icons/iconAction.svg";
import arrowImage from "../../../assets/images/dropdownArrow.png";
import clearFilter from "../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import Search from "../../../assets/images/icons/SearchIcon.svg";
import AddItem from "../../../assets/images/icons/addItem.svg";
import Headbar from "../../../common/headBar";
import shorting from "../../../assets/images/icons/shorting.svg";
import Grid from "../../../common/grid";
import Input from "../../../common/input";
import DataTable from "react-data-table-component";
import { RotateLoader } from "react-spinners";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getDealerServicers, getResellerServicers } from "../../../services/dealerServices/priceBookServices";

function ResellerServicerList() {
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

  const getServicerList = async (value = {}) => {
    setLoading(true);
    const result = await getResellerServicers(value);
    setServicerList(result.data);
    console.log(result.data);
    setLoading(false);
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
      getServicerList(values);
    },
  });

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
      selector: (row) => row?.email,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Phone #",
      selector: (row) => formatPhoneNumber(row.phoneNumber),
      sortable: true,
    },
    {
      name: "# of Claims",
      selector: (row) => row?.claimNumber?.noOfOrders,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Total Claims Value",
      selector: (row) => `$${row?.claimValue?.totalAmount}`,
      sortable: true,
      minWidth: "180px",
    }
  ];

  const CustomNoDataComponent = () => (
    <div className="text-center my-5">
      <p>No records found.</p>
    </div>
  );

  return (
    <>
      <div className="mb-8 ml-3">
        <Headbar />

        <div className="flex mt-2">
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9	mb-[3px]">Servicer</p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-Regular">
                {/* <Link to={"/"}>Servicer </Link>{" "} */}
                <div>Servicer</div>
              </li>
            </ul>
          </div>
        </div>
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
                        type="number"
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

export default ResellerServicerList;
