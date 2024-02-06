import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import Button from "../../../../common/button";

import ActiveIcon from "../../../../assets/images/icons/iconAction.svg";
import arrowImage from "../../../../assets/images/dropdownArrow.png";
import AddItem from "../../../../assets/images/icons/addItem.svg";
import Search from "../../../../assets/images/icons/SearchIcon.svg";
import clearFilter from "../../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import Headbar from "../../../../common/headBar";
import shorting from "../../../../assets/images/icons/shorting.svg";
import Grid from "../../../../common/grid";
import Input from "../../../../common/input";
import DataTable from "react-data-table-component";
import Select from "../../../../common/select";
import { getOrderListByDealerId } from "../../../../services/dealerServices";
import { getOrderListByResellerId } from "../../../../services/reSellerServices";
import { getOrderListByCustomerId } from "../../../../services/customerServices";

function OrderList(props) {
  console.log(props);
  const [selectedAction, setSelectedAction] = useState(null);
  const [orderList, setOrderList] = useState([]);

  const handleStatusChange = (action) => {
    // Implement the logic for the selected action (e.g., edit or delete)
    console.log(`Selected action: ${action}`);
    // You can replace the console.log statement with the actual logic you want to perform
  };
  useEffect(() => {
    if (props.activeTab === "Orders" || props.activeTab === "Order") {
      getOrderList();
    }
  }, [props]);
  const getOrderList = async () => {
    let result = {};
    if (props.flag == "reseller") {
      result = await getOrderListByResellerId(props.id);
    } else if (props.flag == "customer") {
      result = await getOrderListByCustomerId(props.id);
    } else if (props.flag == "dealer") {
      result = await getOrderListByDealerId(props.id);
    }
    setOrderList(result.result);
    console.log(result);
  };

  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
  };

  const calculateDropdownPosition = (index) => {
    const isCloseToBottom = orderList.length - index <= 10000;
    return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row.unique_key,
      sortable: true,
      minWidth: "auto", // Set a custom minimum width
      maxWidth: "70px", // Set a custom maximum width
    },
    {
      name: "Dealer Order #",
      selector: (row) => row.venderOrder,
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row.customerName.username,
      sortable: true,
    },
    {
      name: "Servicer Name",
      selector: (row) => row.servicerName.name,
      sortable: true,
    },
    {
      name: "Reseller Name",
      selector: (row) => row.resellerName.name,
      sortable: true,
    },
    {
      name: "# of Products",
      selector: (row) => row.noOfProducts,
      sortable: true,
    },
    {
      name: "Order Value",
      selector: (row) => "$" + (row?.orderAmount ?? 0).toFixed(2),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <div className="flex border py-2 rounded-lg w-[80%] mx-auto">
          <div
            className={` ${
              row.status === "Pending" ? "bg-[#8B33D1]" : "bg-[#6BD133]"
            }  h-3 w-3 rounded-full self-center  mr-2 ml-[8px]`}
          ></div>
          <p className="self-center"> {row.status} </p>
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
            <div onClick={() => setSelectedAction(row.Categoryid)}>
              <img
                src={ActiveIcon}
                className="cursor-pointer	w-[35px]"
                alt="Active Icon"
              />
            </div>
            {selectedAction === row.Categoryid && (
              <div
                className={`absolute z-[2] w-[70px] drop-shadow-5xl px-3 -right-3 mt-2 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                  index
                )}`}
              >
                <div className="text-center py-3 cursor-pointer ">Edit</div>
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

  const status = [
    { label: "Active", value: true },
    { label: "Pending", value: false },
  ];

  return (
    <>
      <div className="my-8">
        <div className="bg-white mt-6 border-[1px] border-[#D1D1D1] rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className="col-span-5 self-center">
              <p className="text-xl font-semibold">Orders List</p>
            </div>
            <div className="col-span-7">
              <div className="bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                <Grid className="!grid-cols-11">
                  <div className="col-span-3 self-center">
                    <Input
                      name="Name"
                      type="text"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="ID"
                    />
                  </div>
                  <div className="col-span-3 self-center">
                    <Input
                      name="Email"
                      type="email"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="Dealer Order no."
                    />
                  </div>
                  <div className="col-span-3 self-center">
                    <Select
                      label=""
                      options={status}
                      color="text-[#1B1D21] opacity-50"
                      className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                      className="!text-[14px] !bg-[#f7f7f7]"
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
                    <Button type="submit" className="!bg-transparent !p-0">
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
          <div className="mb-5 relative dealer-detail">
            <DataTable
              columns={columns}
              data={orderList}
              highlightOnHover
              sortIcon={
                <>
                  {" "}
                  <img src={shorting} className="ml-2" alt="shorting" />
                </>
              }
              pagination
              paginationPerPage={10}
              noDataComponent={<CustomNoDataComponent />}
              paginationComponentOptions={paginationOptions}
              paginationRowsPerPageOptions={[10, 20, 50, 100]}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderList;
