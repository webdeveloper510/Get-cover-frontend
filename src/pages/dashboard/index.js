import React, { useEffect, useRef, useState } from "react";
import Headbar from "../../common/headBar";
import { Link } from "react-router-dom";
import Grid from "../../common/grid";
import ChartComponent from "../../common/chart";
import Button from "../../common/button";
import Input from "../../common/input";
import BarChart from "../../common/barChart";
import view from "../../assets/images/eye.png";
import edit from "../../assets/images/edit-text.png";
import remove from "../../assets/images/delete.png";
import mark from "../../assets/images/pay.png";
import process from "../../assets/images/return.png";
import drop from "../../assets/images/icons/dropwhite.svg";
import Administration from "../../assets/images/Reporting/Breakdown.svg";
import Fronting from "../../assets/images/Reporting/Fronting.svg";
import insurance from "../../assets/images/Reporting/insurance.svg";
import Reserves from "../../assets/images/Reporting/Reserves.svg";
import Broker from "../../assets/images/Reporting/Broker.svg";
import Select from "../../common/select";
import {
  getDashboardDetails,
  getDashboardList,
} from "../../services/dashboardServices";
import { RotateLoader } from "react-spinners";
import CommonTooltip from "../../common/toolTip";
import DataTable from "react-data-table-component";
import {
  getDealerPriceBook,
  getDealersList,
} from "../../services/dealerServices";
import { getOrders } from "../../services/orderServices";
import { addNewServicerRequest } from "../../services/servicerServices";
import {
  getClaimList,
  getClaimListForDealer,
} from "../../services/claimServices";
import PdfGenerator from "../pdfViewer";

import ActiveIcon from "../../assets/images/icons/iconAction.svg";
function Dashboard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dashboardDetail, setDashboardDetails] = useState({});
  const [dealerList, setDealerList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [servicerList, setServicerList] = useState([]);
  const [dealerPriceBook, setDealerPriceBook] = useState([]);
  const [claimList, setClaimList] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const dropdownRef = useRef(null);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleRange = () => {
    setIsRangeOpen(!isRangeOpen);
  };

  const dashboardDetails = async () => {
    try {
      setLoading(true);
      const result = await getDashboardDetails();
      console.log(result);
      setDashboardDetails(result.result);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const time = [
    { label: "march 2024", value: true },
    { label: "April 2024", value: false },
  ];

  useEffect(() => {
    dashboardDetails();
    getDashboardData();
  }, []);
  const getDashboardData = async () => {
    try {
      const result = await getDashboardList();
      console.log(result, "---------------------------------");
      setDealerList(result.result.topFiveDealer);
      setClaimList(result.result.lastFiveClaims);
      setOrderList(result.result.lastFiveOrder);
      setServicerList(result.result.topFiveServicer);
    } catch (error) {
      console.error("Error fetching dealer list:", error);
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
      name: "Order ID",
      selector: (row) => row?.unique_key,
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: "# Contracts",
      selector: (row) =>
        row?.noOfProducts == null ? 0 : row.noOfProducts.toLocaleString(2),
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: "Order Value",
      selector: (row) =>
        `$${
          row?.orderAmount === undefined
            ? parseInt(0).toLocaleString(2)
            : formatOrderValue(row?.orderAmount ?? parseInt(0))
        }`,
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
                  selectedAction === row.unique_key ? null : row.unique_key
                )
              }
            >
              <img
                src={ActiveIcon}
                className="cursor-pointer w-[35px]"
                alt="Active Icon"
              />
            </div>
            {selectedAction === row.unique_key && (
              <div
                ref={dropdownRef}
                onClick={() => setSelectedAction(null)}
                className={`absolute z-[2] w-[140px] drop-shadow-5xl -right-3 mt-2 py-2 bg-white border rounded-lg shadow-md top-[1rem]`}
              >
                {/* <img src={downArrow} className={`absolute  object-contain left-1/2 w-[12px] ${index%10 === 9 ? 'bottom-[-5px] rotate-180' : 'top-[-5px]'} `} alt='up arror'/> */}

                <>
                  <div onClick={() => localStorage.removeItem("orderMenu")}>
                    <Link
                      to={`/orderDetails/${row._id}`}
                      className="text-left py-1 px-2 cursor-pointer hover:font-semibold border-b w-full flex justify-start"
                    >
                      <img src={view} className="w-4 h-4 mr-2" /> View
                    </Link>
                  </div>
                  <div className="">
                    <PdfGenerator data={row._id} setLoading={setLoading} />
                  </div>
                </>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const Claim = [
    {
      name: "Claim ID",
      selector: (row) => row.unique_key,
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: "Contract ID",
      selector: (row) => row.contracts?.unique_key,
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: "Claim Amount",
      selector: (row) => row?.totalAmount,
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
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
                  selectedAction === row.unique_key ? null : row.unique_key
                )
              }
            >
              <img
                src={ActiveIcon}
                className="cursor-pointer w-[35px]"
                alt="Active Icon"
              />
            </div>
            {selectedAction === row.unique_key && (
              <div
                ref={dropdownRef}
                onClick={() => setSelectedAction(null)}
                className={`absolute z-[2] w-[80px] drop-shadow-5xl -right-3 mt-2 py-1 bg-white border rounded-lg shadow-md top-[1rem]`}
              >
                <>
                  <div onClick={() => localStorage.removeItem("orderMenu")}>
                    <Link
                      to={`/claimList/${row._id}`}
                      className="text-left py-1 px-2 cursor-pointer hover:font-semibold w-full flex justify-start"
                    >
                      <img src={view} className="w-4 h-4 mr-2" /> View
                    </Link>
                  </div>
                </>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const Dealer = [
    {
      name: "Name",
      selector: (row) => row.users.firstName,
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: "# of Orders",
      selector: (row) => row?.order?.totalOrder ?? 0,
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: "Order Value",
      selector: (row) =>
        `$${
          row?.order?.totalAmount === ""
            ? parseInt(0).toLocaleString(2)
            : formatOrderValue(row?.order?.totalAmount ?? parseInt(0))
        }`,
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
            <div onClick={() => setSelectedAction(row.unique_key)}>
              <img
                src={ActiveIcon}
                className="cursor-pointer	w-[35px]"
                alt="Active Icon"
              />
            </div>
            {selectedAction === row.unique_key && (
              <div
                ref={dropdownRef}
                className={`absolute z-[2] w-[80px] drop-shadow-5xl -right-3 mt-2 py-1 bg-white border rounded-lg shadow-md top-[1rem]`}
                onClick={() => localStorage.removeItem("menu")}
              >
                <Link
                  to={`/dealerDetails/${row?._id}`}
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

  const Servicer = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: "# of Claim",
      selector: (row) => row?.totalClaim ?? 0,
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: "Claim Value",
      selector: (row) =>
        `$${
          row?.totalClaimAmount === ""
            ? parseInt(0).toLocaleString(2)
            : formatOrderValue(row?.totalClaimAmount ?? parseInt(0))
        }`,
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
            <div onClick={() => setSelectedAction(row._id)}>
              <img
                src={ActiveIcon}
                className="cursor-pointer	w-[35px]"
                alt="Active Icon"
              />
            </div>
            {selectedAction === row._id && (
              <div
                ref={dropdownRef}
                className={`absolute z-[2] w-[80px] drop-shadow-5xl -right-3 mt-2 py-1 bg-white border rounded-lg shadow-md top-[1rem]`}
                onClick={() => localStorage.removeItem("servicer")}
              >
                <Link
                  to={`/servicerDetails/${row?._id}`}
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

  const Product = [
    {
      name: (
        <div>
          Product <br /> SKU
        </div>
      ),
      selector: (row) => row.priceBooks?.name,
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: "Category",
      selector: (row) => row.category[0]?.name,
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: "Term",
      selector: (row) => row.priceBooks?.term + " Months",
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: (
        <div>
          Wholesale <br /> Cost{" "}
        </div>
      ),
      selector: (row) =>
        `$${
          row?.retailPrice === undefined
            ? parseInt(0).toLocaleString(2)
            : formatOrderValue(row?.retailPrice ?? parseInt(0))
        } `,
      sortable: true,
    },
  ];

  const formatPhoneNumber = (phoneNumber) => {
    const cleaned = ("" + phoneNumber).replace(/\D/g, ""); // Remove non-numeric characters
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/); // Match groups of 3 digits

    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    return phoneNumber; // Return original phone number if it couldn't be formatted
  };

  return (
    <>
      <div className="mb-8 ml-3">
        <Headbar />
        <div className="flex mt-2">
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9	mb-[3px]">Dashboard</p>
          </div>
        </div>
        {loading ? (
          <div className=" h-[400px] w-full flex py-5">
            <div className="self-center mx-auto">
              <RotateLoader color="#333" />
            </div>
          </div>
        ) : (
          <div className="mt-5">
            <Grid className=" s:grid-cols-3 md:grid-cols-6 xl:grid-cols-12">
              <div className="col-span-3 bg-gradient-to-r from-[#000000] cursor-pointer to-[#333333] text-white rounded-xl p-8">
                <p className="text-2xl font-bold">
                  {dashboardDetail?.orderData?.totalOrder
                    ? dashboardDetail.orderData.totalOrder
                    : 0}
                </p>
                <p className="text-neutral-grey text-sm">
                  Total Number of Orders
                </p>
              </div>
              <div className="col-span-3 bg-gradient-to-r from-[#000000] to-[#333333] cursor-pointer text-white rounded-xl p-8">
                <p className="text-2xl font-bold">
                  $
                  {dashboardDetail?.orderData?.totalAmount === ""
                    ? parseInt(0).toLocaleString(2)
                    : formatOrderValue(
                        dashboardDetail?.orderData?.totalAmount ?? parseInt(0)
                      )}
                </p>
                <p className="text-neutral-grey text-sm">
                  Total Value of Orders
                </p>
              </div>
              <div className="col-span-3 bg-gradient-to-r from-[#000000] to-[#333333] cursor-pointer text-white rounded-xl p-8">
                <p className="text-2xl font-bold">
                  {dashboardDetail?.claimData?.numberOfClaims
                    ? dashboardDetail?.claimData?.numberOfClaims
                    : 0}
                </p>
                <p className="text-neutral-grey text-sm">
                  Total Completed Claims
                </p>
              </div>
              <div className="col-span-3 bg-gradient-to-r from-[#000000] to-[#333333] cursor-pointer text-white rounded-xl p-8">
                <p className="text-2xl font-bold">
                  $
                  {dashboardDetail?.claimData?.valueClaim === ""
                    ? parseInt(0).toLocaleString(2)
                    : formatOrderValue(
                        dashboardDetail?.claimData?.valueClaim ?? parseInt(0)
                      )}
                </p>
                <p className="text-neutral-grey text-sm">
                  Total Value of Claims
                </p>
              </div>
            </Grid>

            <Grid className="s:grid-cols-3 md:grid-cols-6 xl:grid-cols-12 mt-3">
              <div className="col-span-6">
                <div className="bg-gradient-to-r from-[#000000] to-[#333333] p-3 rounded-xl">
                  <p className="font-lg font-bold text-white pl-2">
                    Amount of Orders
                  </p>
                  <BarChart />
                </div>
              </div>
              <div className="col-span-6">
                <div className="bg-gradient-to-r from-[#000000] to-[#333333] p-3 rounded-xl">
                  <p className="font-lg font-bold text-white pl-2">
                    Amount of Claim
                  </p>
                  <BarChart />
                </div>
              </div>
              <div className="col-span-6 border-2  bg-white rounded-xl px-2 pb-2">
                <p className="text-xl font-semibold pl-3 pt-2">
                  Last 5 Completed Order
                </p>
                <div className="">
                  <DataTable
                    columns={columns}
                    data={orderList}
                    highlightOnHover
                    draggableColumns={false}
                  />
                </div>
              </div>

              <div className="col-span-6 border-2  bg-white rounded-xl px-2 pb-2">
                <p className="text-xl font-semibold pl-3 pt-2">
                  Last 5 Completed Claim
                </p>
                <div className="">
                  <DataTable
                    columns={Claim}
                    data={claimList}
                    highlightOnHover
                    draggableColumns={false}
                  />
                </div>
              </div>
            </Grid>

            <Grid className="s:grid-cols-3 md:grid-cols-6 xl:grid-cols-12 mt-3">
              <div className="col-span-6 border-2  bg-white rounded-xl px-2 pb-2">
                <p className="text-xl font-semibold pl-1 pr-1 pt-2  inline-block">
                  Top 5 Dealer
                </p>
                <div className="">
                  <DataTable
                    columns={Dealer}
                    data={dealerList}
                    highlightOnHover
                    draggableColumns={false}
                  />
                </div>
              </div>
              <div className="col-span-6 border-2  bg-white rounded-xl px-2 pb-2">
                <p className="text-xl font-semibold pl-1 pr-1 pt-2  inline-block">
                  Top 5 Servicer
                </p>
                <div className="">
                  <DataTable
                    columns={Servicer}
                    data={servicerList}
                    highlightOnHover
                    draggableColumns={false}
                  />
                </div>
              </div>
            </Grid>

            <Grid className="s:hidden md:block px-2 pb-2 mt-4 border-2  bg-white rounded-xl">
              <div className="col-span-12">
                <p className="text-xl font-semibold pl-1 pr-1 pt-2 inline-block">
                  Top 5 Performing SKU's
                </p>
                <hr />
                <Grid>
                  <div className="col-span-6">
                    <div className="">
                      <p className="text-xl font-semibold pl-1 pr-1 pt-2 inline-block">
                        30 Days
                      </p>
                    </div>
                    <DataTable
                      columns={Product}
                      data={dealerPriceBook}
                      highlightOnHover
                      draggableColumns={false}
                    />
                  </div>
                  <div className="col-span-6">
                    <div className="">
                      <p className="text-xl font-semibold pl-1 pr-1 pt-2  inline-block">
                        One Years
                      </p>
                    </div>
                    <DataTable
                      columns={Product}
                      data={dealerPriceBook}
                      highlightOnHover
                      draggableColumns={false}
                    />
                  </div>
                </Grid>
              </div>
            </Grid>
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
