import React, { useEffect, useState } from "react";
import Headbar from "../../common/headBar";
import { Link } from "react-router-dom";
import Grid from "../../common/grid";
import ChartComponent from "../../common/chart";
import Button from "../../common/button";
import Input from "../../common/input";
import BarChart from "../../common/barChart";
import drop from "../../assets/images/icons/dropwhite.svg";
import Administration from "../../assets/images/Reporting/Breakdown.svg";
import Fronting from "../../assets/images/Reporting/Fronting.svg";
import insurance from "../../assets/images/Reporting/insurance.svg";
import Reserves from "../../assets/images/Reporting/Reserves.svg";
import Broker from "../../assets/images/Reporting/Broker.svg";
import Select from "../../common/select";
import { getDashboardDetails } from "../../services/dashboardServices";
import { RotateLoader } from "react-spinners";
import CommonTooltip from "../../common/toolTip";
import DataTable from "react-data-table-component";
import { getDealersList } from "../../services/dealerServices";
import { getOrders } from "../../services/orderServices";
import { addNewServicerRequest } from "../../services/servicerServices";
import {
  getClaimList,
  getClaimListForDealer,
} from "../../services/claimServices";

function Dashboard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dashboardDetail, setDashboardDetails] = useState({});
  const [customerList, setCustomerList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [servicerList, setServicerList] = useState([]);
  const [claimList, setClaimList] = useState([]);

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
    getDealerList();
    getOrderList();
    getServicerList();
    getAllClaims();
  }, []);
  const getAllClaims = async () => {
    setLoading(true);
    let data = {
      claimId: "",
      claimStatus: "",
      contractId: "",
      customerName: "",
      customerStatusValue: "",
      dealerName: "",
      orderId: "",
      pName: "",
      page: 1,
      pageLimit: 5,
      productName: "",
      repairStatus: "",
      serial: "",
      servicerName: "",
      trackingNumber: "",
      trackingType: "",
      venderOrder: "",
    };
    getClaimList(data)
      .then((res) => {
        console.log(res.result);
        setClaimList(res.result);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const getDealerList = async () => {
    try {
      const result = await getDealersList();
      console.log(result.data, "jjjjj");

      const trimmedData = result.data.slice(0, 5);
      setCustomerList(trimmedData);
    } catch (error) {
      console.error("Error fetching dealer list:", error);
    }
  };

  const getOrderList = async (data = {}) => {
    setLoading(true);
    const result = await getOrders(data);
    console.log(result.result);
    const trimmedData = result.result.slice(0, 5);
    setOrderList(trimmedData);
  };

  const getServicerList = async () => {
    setLoading(true);
    const result = await addNewServicerRequest("Approved", {});
    setServicerList(result.data);
    console.log(result.data);
    setLoading(false);
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
      name: "Dealer P.O #",
      selector: (row) => row?.venderOrder,
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
  ];

  const Claim = [
    {
      name: "Claim ID",
      selector: (row) => row.unique_key,
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: "Customer Status",
      selector: (row) => row.customerStatus?.[0]?.status,
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: "Claim Status",
      selector: (row) => row?.claimStatus?.[0]?.status,
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: "Repair Status",
      selector: (row) => row?.repairStatus?.[0]?.status,
      sortable: true,
    },
  ];

  const Dealer = [
    {
      name: "Name",
      selector: (row) => row.firstName,
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: "Phone #",
      selector: (row) => "+1 " + formatPhoneNumber(row.phoneNumber),
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: "# of Orders",
      selector: (row) => row?.ordersData?.noOfOrders ?? 0,
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: "Order Value",
      selector: (row) =>
        `$${
          row?.ordersData?.orderAmount === ""
            ? parseInt(0).toLocaleString(2)
            : formatOrderValue(row?.ordersData?.orderAmount ?? parseInt(0))
        }`,
      sortable: true,
    },
  ];

  const Servicer = [
    {
      name: "Name",
      selector: (row) => row.firstName,
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: "Phone #",
      selector: (row) => "+1 " + formatPhoneNumber(row.phoneNumber),
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: "# of Claim",
      selector: (row) => row?.claimNumber?.noOfOrders ?? 0,
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: "Claim Value",
      selector: (row) =>
        `$${
          row?.claimValue?.totalAmount === ""
            ? parseInt(0).toLocaleString(2)
            : formatOrderValue(row?.claimValue?.totalAmount ?? parseInt(0))
        }`,
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
                  Latest Five Order
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
                  Latest Five Claim
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
                    data={customerList}
                    highlightOnHover
                    draggableColumns={false}
                  />
                </div>
              </div>
              <div className="col-span-6 border-2  bg-white rounded-xl px-2 pb-2">
                <p className="text-xl font-semibold pl-1 pr-1 pt-2  inline-block">
                  Top Five Servicer
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
                  Top Five Performing SKU's Based on # of Sales
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
                      columns={Servicer}
                      data={servicerList}
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
                      columns={Servicer}
                      data={servicerList}
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
