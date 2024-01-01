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
import Input from "../../../common/input";
import DataTable from "react-data-table-component";
import Select from "../../../common/select";

function CustomerList() {
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const navigate = useNavigate();
  const handleSelectChange1 = (label, value) => {
    console.log(label, value, "selected");
    setSelectedProduct(value);
  };
  const dropdownRef = useRef(null);

  const status = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];



  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
  };

  const data = [
    {
      Categoryid: 1,
      Categoryname: "Category 1",
      Email: "abcd@gmail.com",
      Phoneno: "(095)413-1172",
      Dealername: "Active",
      order: "12",
      orderValue: "$123.00",
    },
    {
      Categoryid: 2,
      Categoryname: "Category 1",
      Email: "abcd@gmail.com",
      Phoneno: "(095)413-1172",
      Dealername: "Active",
      order: "12",
      orderValue: "$123.00",
    },
  ];
  const calculateDropdownPosition = (index) => {
    const isCloseToBottom = data.length - index <= 2;
    return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
  };
  const columns = [
    {
      name: "ID",
      selector: (row) => row.Categoryid,
      sortable: true,
      minWidth: "auto",
      maxWidth: "70px",
    },
    {
      name: "Name",
      selector: (row) => row.Categoryname,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.Email,
      sortable: true,
    },
    {
      name: "Phone No.",
      selector: (row) => row.Phoneno,
      sortable: true,
    },
    {
      name: "Dealer Name",
      selector: (row) => row.Dealername,
      sortable: true,
    },
    {
      name: "Orders",
      selector: (row) => row.order,
      sortable: true,
    },
    {
      name: "Order Value",
      selector: (row) => row.orderValue,
      sortable: true,
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
                  selectedAction === row.Categoryid ? null : row.Categoryid
                )
              }
            >
              <img
                src={ActiveIcon}
                className="cursor-pointer	w-[35px]"
                alt="Active Icon"
              />
            </div>
            {selectedAction === row.Categoryid && (
              <div
                ref={dropdownRef}
                className={`absolute z-[2] w-[80px] drop-shadow-5xl -right-3 mt-2 p-2 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                  index
                )}`}
              >
                {/* <img src={arrowImage} className={`absolute  object-contain left-1/2 w-[12px] ${index%10 === 9 ? 'bottom-[-5px] rotate-180' : 'top-[-5px]'} `} alt='up arror'/> */}
                <div
                  className="text-center cursor-pointer py-1"
                  onClick={() => {
                    navigate(`/addCustomer`);
                  }}
                >
                  View
                </div>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Close the dropdown if the click is outside of it
        setSelectedAction(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <>
      <div className="my-8 ml-3">
        <Headbar />

        <div className="flex mt-2">
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9	mb-[3px]">Customer</p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/"}>Customer </Link>{" "}
              </li>
            </ul>
          </div>
        </div>

        <Link
          to={"/addCustomer"}
          className=" w-[200px] !bg-white font-semibold py-2 px-4 ml-auto flex self-center mb-4 rounded-xl ml-auto border-[1px] border-[#D1D1D1]"
        >
          {" "}
          <img src={AddItem} className="self-center" alt="AddItem" />{" "}
          <span className="text-black ml-3 text-[14px] font-Regular">
            {" "}
            Add New Customer{" "}
          </span>{" "}
        </Link>

        <div className="bg-white mt-6 border-[1px] border-[#D1D1D1] rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className="col-span-5 self-center">
              <p className="text-xl font-semibold">Customers List</p>
            </div>
            <div className="col-span-7">
              <div className="bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                <Grid className="!grid-cols-10">
                  <div className="col-span-2 self-center">
                    <Input
                      name="Name"
                      type="text"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="Name"
                    />
                  </div>
                  <div className="col-span-2 self-center">
                    <Input
                      name="Email"
                      type="email"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="Email"
                    />
                  </div>
                  <div className="col-span-2 self-center">
                    <Input
                      name="PhoneNo."
                      type="number"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="Phone No."
                    />
                  </div>
                  <div className="col-span-2 self-center">
                    <Select
                      label=""
                      options={status}
                      OptionName="Dealer Name"
                      color="text-[#1B1D21] opacity-50"
                      className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      selectedValue={selectedProduct}
                      onChange={handleSelectChange1}
                    />
                  </div>

                  <div className="col-span-2 self-center flex">
                    <img src={Search} className="cursor-pointer	" alt="Search" />
                    <Button
                      type="submit"
                      className="!ml-2 !bg-transparent !p-0"
                    >
                      <img
                        src={clearFilter}
                        className="cursor-pointer	mx-auto"
                        alt="clearFilter"
                      />
                    </Button>
                  </div>
                </Grid>
              </div>
            </div>
          </Grid>
          <div className="mb-5 relative">
            <DataTable
              columns={columns}
              data={data}
              highlightOnHover
              sortIcon={
                <>
                  {" "}
                  <img src={shorting} className="ml-2" alt="shorting" />{" "}
                </>
              }
              pagination
              paginationPerPage={10}
              paginationComponentOptions={paginationOptions}
              paginationRowsPerPageOptions={[10, 20, 50, 100]}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomerList;
