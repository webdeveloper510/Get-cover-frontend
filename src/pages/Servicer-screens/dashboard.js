import React, { useEffect, useRef, useState } from "react";
import Headbar from "../../common/headBar";
import { Link } from "react-router-dom";
import Grid from "../../common/grid";
import BarChart from "../../common/barChart";
import view from "../../assets/images/eye.png";
import {
  getDashboardForServicer,
  getServicerDashboardList,
} from "../../services/dashboardServices";
import shorting from "../../assets/images/icons/shorting.svg";
import { RotateLoader } from "react-spinners";
import DataTable from "react-data-table-component";
import PdfGenerator from "../pdfViewer";
import ActiveIcon from "../../assets/images/icons/iconAction.svg";
import { getDashboardDetailsforServicerPortal } from "../../services/dealerServices/resellerServices";

function ServicerDashboard() {
  const [loading, setLoading] = useState(false);
  const [dashboardDetail, setDashboardDetails] = useState({});
  const [orderList, setOrderList] = useState([]);
  const [dealerPriceBook, setDealerPriceBook] = useState([]);
  const [dealerPriceBookYear, setDealerPriceBookYear] = useState([]);
  const [claimList, setClaimList] = useState([]);
  const [orderAmount, setOrderAmount] = useState([]);
  const [claimAmount, setClaimAmount] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const dropdownRef = useRef(null);

  const dashboardDetails = async () => {
    try {
      setLoading(true);
      const result = await getDashboardDetailsforServicerPortal();
      console.log(result);
      setDashboardDetails(result.result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const getDashboardCart = async () => {
    setLoading(true);
    const result = await getDashboardForServicer();

    const claimData = result.claim_result.map((item) => {
      return {
        weekStart: item.weekStart,
        total_orders: item.total_amount,
      };
    });
    setClaimAmount(claimData);
    setLoading(false);
  };

  useEffect(() => {
    getDashboardCart();
    dashboardDetails();
    getDashboardData();
  }, []);

  const getDashboardData = async () => {
    try {
      const result = await getServicerDashboardList();
      console.log(result, "---------------------------------");
      setClaimList(result.result.lastFiveClaims);
      setOrderList(result.result.lastFiveOrder);
    } catch (error) {
      console.error("Error fetching dealer list:", error);
    }
  };

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

  const Claim = [
    {
      name: "Claim ID",
      selector: (row) => row.unique_key,
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: "Contract ID",
      selector: (row) => row.contract?.unique_key,
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
                      to={`/servicer/claimList/${row.unique_key}`}
                      className="text-left py-1 px-2 cursor-pointer hover:font-semibold w-full flex justify-start"
                    >
                      <img
                        src={view}
                        className="w-4 h-4 mr-2"
                        alt="eye Image"
                      />{" "}
                      View
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
                className={`absolute z-[2] w-[140px] drop-shadow-5xl -right-3 mt-2 py-1 bg-white border rounded-lg shadow-md top-[1rem]`}
              >
                {/* <img src={downArrow} className={`absolute  object-contain left-1/2 w-[12px] ${index%10 === 9 ? 'bottom-[-5px] rotate-180' : 'top-[-5px]'} `} alt='up arror'/> */}

                <>
                  <div onClick={() => localStorage.removeItem("orderMenu")}>
                    <Link
                      to={`/dealer/orderDetails/${row._id}`}
                      className="text-left py-1 px-2 cursor-pointer hover:font-semibold border-b w-full flex justify-start"
                    >
                      <img
                        src={view}
                        className="w-4 h-4 mr-2"
                        alt="eye Image"
                      />{" "}
                      View
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
              <div className="col-span-3 bg-gradient-to-r from-[#000000] to-light-black cursor-pointer text-white rounded-xl p-8">
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
                  <p className="font-lg font-bold text-white pl-2 mb-3">
                    Amount of Claims
                  </p>
                  <BarChart graphData={claimAmount} />
                </div>
              </div>

              <div className="col-span-6 border-2  bg-white rounded-xl px-2 pb-2">
                <p className="text-xl font-semibold pl-3 pt-2">
                  Last 5 Completed Claims
                </p>
                <div className="">
                  <DataTable
                    columns={Claim}
                    data={claimList}
                    sortIcon={
                      <>
                        {" "}
                        <img
                          src={shorting}
                          className="ml-2"
                          alt="shorting"
                        />{" "}
                      </>
                    }
                    highlightOnHover
                    draggableColumns={false}
                  />
                </div>
              </div>
            </Grid>
            <div className="col-span-6 border-2  bg-white rounded-xl px-2 pb-2">
              <p className="text-xl font-semibold pl-3 pt-2">
                Last 5 Completed Orders
              </p>
              <div className="">
                <DataTable
                  columns={columns}
                  data={orderList}
                  sortIcon={
                    <>
                      {" "}
                      <img
                        src={shorting}
                        className="ml-2"
                        alt="shorting"
                      />{" "}
                    </>
                  }
                  highlightOnHover
                  draggableColumns={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ServicerDashboard;
