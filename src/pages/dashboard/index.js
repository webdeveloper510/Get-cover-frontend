import React, { useEffect, useRef, useState } from "react";
import Headbar from "../../common/headBar";
import { Link, useLocation } from "react-router-dom";
import Grid from "../../common/grid";
import BarChart from "../../common/barChart";
import view from "../../assets/images/eye.png";
import {
  getDashboard,
  getDashboardDetails,
  getDashboardList,
} from "../../services/dashboardServices";
import shorting from "../../assets/images/icons/shorting.svg";
import { RotateLoader } from "react-spinners";
import DataTable from "react-data-table-component";
import PdfGenerator from "../pdfViewer";
import ActiveIcon from "../../assets/images/icons/iconAction.svg";
import { getSetting } from "../../services/extraServices";
import Card from "../../common/card";
import MultiColorView from "../../common/multiColorView";
import SingleView from "../../common/singleView";

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [dashboardDetail, setDashboardDetails] = useState({});
  const [dealerList, setDealerList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [servicerList, setServicerList] = useState([]);
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
      const result = await getDashboardDetails();
      console.log(result);
      setDashboardDetails(result.result);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  const getDashboardCart = async () => {
    setLoading(true);
    const result = await getDashboard();
    const countData = result.order_result.map((item) => {
      return {
        weekStart: item.weekStart,
        total_orders: item.order_amount,
      };
    });
    const claimData = result.claim_result.map((item) => {
      return {
        weekStart: item.weekStart,
        total_claims: item.total_amount,
        type:'claim'
      };
    });
    setOrderAmount(countData);
    setClaimAmount(claimData);
    const trimmedData = result.monthly_sku.slice(0, 5);
    const trimmedData1 = result.yealy_sku.slice(0, 5);
    setDealerPriceBook(trimmedData);
    setDealerPriceBookYear(trimmedData1);
  };
  useEffect(() => {
    getDashboardCart();
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

  useEffect(() => {
    setLoading1(true);
    if (window.location.pathname === '/dashboard') {
      const reloadFlag = localStorage.getItem('reloadDashboard');

      if (reloadFlag === 'true') {
        localStorage.setItem('reloadDashboard', 'false');
        setTimeout(() => {
          window.location.reload(true);
        }, 2000)
      }
      setLoading1(false);
    }
  }, []);

  const locationState = useLocation();
  console.log("locationState", locationState);

  useEffect(() => {
    fetchUserDetails();
    if (locationState && locationState?.route === "login") {
      window.location.reload()
    }
  }, []);

  const fetchUserDetails = async () => {
    try {
      console.log("Fetching user details...");
      const userDetails = await getSetting();
      console.log("User details fetched:----->", userDetails.result[0]);
      const fetchedData = userDetails.result[0];
      let local = JSON.parse(localStorage.getItem("siteSettings"));
      // localStorage.removeItem('userDetails')
      local.siteSettings = fetchedData
      localStorage.setItem("siteSettings", JSON.stringify(local));
      setLoading(false);

    } catch (error) {
      console.error("Error fetching user details:", error);
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
      name: "Orders Value",
      selector: (row) =>
        `$${row?.orderAmount === undefined
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
              <SingleView
                ref={dropdownRef}
                onClick={() => setSelectedAction(null)}
                className={`absolute z-[2] w-[80px] drop-shadow-5xl -right-3 mt-2 border rounded-lg shadow-md top-[1rem]`}
              >
                {/* <img src={downArrow} className={`absolute  object-contain left-1/2 w-[12px] ${index%10 === 9 ? 'bottom-[-5px] rotate-180' : 'top-[-5px]'} `} alt='up arror'/> */}

                <>
                  <div onClick={() => localStorage.removeItem("orderMenu")}>
                    <Link
                      to={`/orderDetails/${row._id}`}
                      className="text-left py-2 px-2 cursor-pointer w-full flex justify-start"
                    >
                      <div
                        style={{
                          maskImage: `url(${view})`,
                          WebkitMaskImage: `url(${view})`,
                          maskRepeat: "no-repeat",
                          WebkitMaskRepeat: "no-repeat",
                          maskPosition: "center",
                          WebkitMaskPosition: "center",
                          maskSize: "contain",
                          WebkitMaskSize: "contain",
                        }}
                        className="self-center singleViews mr-2 h-4 w-4 "
                      />
                      {/* <img
                        src={view}
                        className="w-4 h-4 mr-2"
                        alt="eye Image"
                      />{" "} */}
                      View
                    </Link>
                  </div>
                </>
              </SingleView>
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
      selector: (row) => row.contract?.unique_key,
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: "Claim Amount",
      selector: (row) =>
        `$${row?.totalAmount === undefined
          ? parseInt(0).toLocaleString(2)
          : formatOrderValue(row?.totalAmount ?? parseInt(0))
        } `,
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
              <SingleView
                ref={dropdownRef}
                onClick={() => setSelectedAction(null)}
                className={`absolute z-[2] w-[80px] drop-shadow-5xl -right-3 mt-2 border rounded-lg shadow-md top-[1rem]`}
              >
                <>
                  <div onClick={() => localStorage.removeItem("orderMenu")}>
                    <Link
                      to={`/claimList/${row.unique_key}`}
                      className="text-left py-2 px-2 cursor-pointer w-full flex justify-start"
                    >
                      <div
                        style={{
                          maskImage: `url(${view})`,
                          WebkitMaskImage: `url(${view})`,
                          maskRepeat: "no-repeat",
                          WebkitMaskRepeat: "no-repeat",
                          maskPosition: "center",
                          WebkitMaskPosition: "center",
                          maskSize: "contain",
                          WebkitMaskSize: "contain",
                        }}
                        className="self-center singleViews mr-2 h-4 w-4 "
                      />
                      {/* <img
                        src={view}
                        className="w-4 h-4 mr-2"
                        alt="eye Image"
                      />{" "} */}
                      View
                    </Link>
                  </div>
                </>
              </SingleView>
            )}
          </div>
        );
      },
    },
  ];

  const Dealer = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: "# of Orders",
      selector: (row) => row?.totalOrder ?? 0,
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: "Orders Value",
      selector: (row) =>
        `$${row?.totalAmount === ""
          ? parseInt(0).toLocaleString(2)
          : formatOrderValue(row?.totalAmount ?? parseInt(0))
        }`,
      sortable: true,
    },
    {
      name: "Action",
      minWidth: "auto",
      maxWidth: "90px",
      cell: (row, index) => {
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
              <SingleView
                ref={dropdownRef}
                className={`absolute z-[2] w-[80px] drop-shadow-5xl -right-3 mt-2 border rounded-lg shadow-md top-[1rem]`}
                onClick={() => localStorage.removeItem("menu")}
              >
                <Link
                  to={`/dealerDetails/${row?._id}`}
                  className="text-left cursor-pointer flex py-2 px-2"
                >
                  <div
                    style={{
                      maskImage: `url(${view})`,
                      WebkitMaskImage: `url(${view})`,
                      maskRepeat: "no-repeat",
                      WebkitMaskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskPosition: "center",
                      maskSize: "contain",
                      WebkitMaskSize: "contain",
                    }}
                    className="self-center singleViews mr-2 h-4 w-4 "
                  />
                  {/* <img src={view} className="w-4 h-4 mr-2" alt="eye Image" />{" "} */}
                  View
                </Link>
              </SingleView>
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
      name: "# of Claims",
      selector: (row) => row?.totalClaim ?? 0,
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: "Claims Value",
      selector: (row) =>
        `$${row?.totalClaimAmount === ""
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
              <SingleView
                ref={dropdownRef}
                className={`absolute z-[2] w-[80px] drop-shadow-5xl -right-3 mt-2 border rounded-lg shadow-md top-[1rem]`}
                onClick={() => localStorage.removeItem("servicer")}
              >
                <Link
                  to={`/servicerDetails/${row?._id}`}
                  className="text-left cursor-pointer flex  py-2 px-2"
                >
                  <div
                    style={{
                      maskImage: `url(${view})`,
                      WebkitMaskImage: `url(${view})`,
                      maskRepeat: "no-repeat",
                      WebkitMaskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskPosition: "center",
                      maskSize: "contain",
                      WebkitMaskSize: "contain",
                    }}
                    className="self-center singleViews mr-2 h-4 w-4 "
                  />
                  {/* <img src={view} className="w-4 h-4 mr-2" alt="eye Image" />{" "} */}
                  View
                </Link>
              </SingleView>
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
      selector: (row) => row?.name,
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: "Category",
      selector: (row) => row?.category.name,
      sortable: true,
      style: { whiteSpace: "pre-wrap" },
    },
    {
      name: "Term",
      selector: (row) => {
        const months = row?.term;
        if (months) {
          const years = (months / 12);
          return `${years} ${years == 1 ? 'Year' : 'Years'} `;
        }
        return "N/A";
      },
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
        `$${row?.reinsuranceFee +
          row?.frontingFee +
          row?.adminFee +
          row?.reserveFutureFee ===
          undefined
          ? parseInt(0).toLocaleString(2)
          : formatOrderValue(
            row?.reinsuranceFee +
            row?.frontingFee +
            row?.adminFee +
            row?.reserveFutureFee ?? parseInt(0)
          )
        } `,
      sortable: true,
    },
  ];

  const CustomNoDataComponent = () => (
    <Card className="text-center my-5">
      <p>No records found.</p>
    </Card>
  );

  return (
    <>
      {loading1 && (
        <div className=" fixed z-[999999] backdrop-blur-xl top-0 h-screen w-full left-0 flex py-5">
          <div className="self-center ml-[50%]">
            <RotateLoader color="#333" />
          </div>
        </div>
      )}
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
              <MultiColorView className="col-span-3 cursor-pointer rounded-xl p-8">
                <p className="text-2xl font-bold">
                  {dashboardDetail?.orderData?.totalOrder
                    ? dashboardDetail.orderData.totalOrder
                    : 0}
                </p>
                <p className=" text-sm">
                  Total Number of Orders
                </p>
              </MultiColorView>
              <MultiColorView className="col-span-3 cursor-pointer rounded-xl p-8">
                <p className="text-2xl font-bold">
                  $
                  {dashboardDetail?.orderData?.totalAmount === ""
                    ? parseInt(0).toLocaleString(2)
                    : formatOrderValue(
                      dashboardDetail?.orderData?.totalAmount ?? parseInt(0)
                    )}
                </p>
                <p className=" text-sm">
                  Total Value of Orders
                </p>
              </MultiColorView>
              <MultiColorView className="col-span-3 cursor-pointer text-white rounded-xl p-8">
                <p className="text-2xl font-bold">
                  {dashboardDetail?.claimData?.numberOfClaims
                    ? dashboardDetail?.claimData?.numberOfClaims
                    : 0}
                </p>
                <p className=" text-sm">
                  Total Completed Claims
                </p>
              </MultiColorView>
              <MultiColorView className="col-span-3 cursor-pointer rounded-xl p-8">
                <p className="text-2xl font-bold">
                  $
                  {dashboardDetail?.claimData?.valueClaim === ""
                    ? parseInt(0).toLocaleString(2)
                    : formatOrderValue(
                      dashboardDetail?.claimData?.valueClaim ?? parseInt(0)
                    )}
                </p>
                <p className=" text-sm">
                  Total Value of Claims
                </p>
              </MultiColorView>
            </Grid>
            <div className="s:hidden md:hidden xl:block">
              <Grid className="s:grid-cols-3 md:grid-cols-6 xl:grid-cols-12 mt-3 ">
                <div className="col-span-6">
                  <MultiColorView className=" p-3 rounded-xl">
                    <p className="font-lg font-bold pl-2 mb-3">
                      Amount of Orders
                    </p>
                    <BarChart graphData={orderAmount} />
                  </MultiColorView>
                </div>
                <div className="col-span-6">
                  <MultiColorView className=" p-3 rounded-xl">
                    <p className="font-lg font-bold pl-2 mb-3">
                      Amount of Claims
                    </p>
                    <BarChart graphData={claimAmount} />
                  </MultiColorView>
                </div>
                <div className="col-span-6 border-2 rounded-xl">
                  <Card>
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
                            <div
                              style={{
                                maskImage: `url(${shorting})`,
                                WebkitMaskImage: `url(${shorting})`,
                                maskRepeat: "no-repeat",
                                WebkitMaskRepeat: "no-repeat",
                                maskPosition: "center",
                                WebkitMaskPosition: "center",
                                maskSize: "contain",
                                WebkitMaskSize: "contain",
                              }}
                              className="ml-2 tabless"
                            />
                          </>
                        }
                        highlightOnHover
                        draggableColumns={false}
                        noDataComponent={<CustomNoDataComponent />}
                      />
                    </div>
                  </Card>
                </div>

                <div className="col-span-6 border-2 rounded-xl">
                  <Card>
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
                            <div
                              style={{
                                maskImage: `url(${shorting})`,
                                WebkitMaskImage: `url(${shorting})`,
                                maskRepeat: "no-repeat",
                                WebkitMaskRepeat: "no-repeat",
                                maskPosition: "center",
                                WebkitMaskPosition: "center",
                                maskSize: "contain",
                                WebkitMaskSize: "contain",
                              }}
                              className="ml-2 tabless"
                            />
                          </>
                        }
                        highlightOnHover
                        draggableColumns={false}
                        noDataComponent={<CustomNoDataComponent />}
                      />
                    </div>
                  </Card>
                </div>
              </Grid>

              <Grid className="s:grid-cols-3 md:grid-cols-6 xl:grid-cols-12 mt-3">
                <div className="col-span-6 border-2 rounded-xl">
                  <Card>
                    <p className="text-xl font-semibold pl-1 pr-1 pt-2  inline-block">
                      Top 5 Dealers
                    </p>
                    <div className="">
                      <DataTable
                        columns={Dealer}
                        data={dealerList}
                        sortIcon={
                          <>
                            {" "}
                            <div
                              style={{
                                maskImage: `url(${shorting})`,
                                WebkitMaskImage: `url(${shorting})`,
                                maskRepeat: "no-repeat",
                                WebkitMaskRepeat: "no-repeat",
                                maskPosition: "center",
                                WebkitMaskPosition: "center",
                                maskSize: "contain",
                                WebkitMaskSize: "contain",
                              }}
                              className="ml-2 tabless"
                            />
                          </>
                        }
                        highlightOnHover
                        draggableColumns={false}
                        noDataComponent={<CustomNoDataComponent />}
                      />
                    </div>
                  </Card>
                </div>
                <div className="col-span-6 border-2 rounded-xl">
                  <Card>
                    <p className="text-xl font-semibold pl-1 pr-1 pt-2  inline-block">
                      Top 5 Servicers
                    </p>
                    <div className="">
                      <DataTable
                        columns={Servicer}
                        data={servicerList}
                        sortIcon={
                          <>
                            {" "}
                            <div
                              style={{
                                maskImage: `url(${shorting})`,
                                WebkitMaskImage: `url(${shorting})`,
                                maskRepeat: "no-repeat",
                                WebkitMaskRepeat: "no-repeat",
                                maskPosition: "center",
                                WebkitMaskPosition: "center",
                                maskSize: "contain",
                                WebkitMaskSize: "contain",
                              }}
                              className="ml-2 tabless"
                            />
                          </>
                        }
                        highlightOnHover
                        draggableColumns={false}
                        noDataComponent={<CustomNoDataComponent />}
                      />
                    </div>
                  </Card>
                </div>
              </Grid>

              <Grid className="s:grid-cols-3 md:grid-cols-6 xl:grid-cols-12 mt-3">
                <div className="col-span-6 mt-4 border-2 rounded-xl">
                  <Card>
                    <div className="">
                      <p className="text-xl font-semibold pl-1 pr-1 pt-2">
                        Top 5 Performing SKU's 30 Days
                      </p>
                    </div>
                    <DataTable
                      columns={Product}
                      data={dealerPriceBook}
                      sortIcon={
                        <>
                          {" "}
                          <div
                            style={{
                              maskImage: `url(${shorting})`,
                              WebkitMaskImage: `url(${shorting})`,
                              maskRepeat: "no-repeat",
                              WebkitMaskRepeat: "no-repeat",
                              maskPosition: "center",
                              WebkitMaskPosition: "center",
                              maskSize: "contain",
                              WebkitMaskSize: "contain",
                            }}
                            className="ml-2 tabless"
                          />
                        </>
                      }
                      highlightOnHover
                      draggableColumns={false}
                      noDataComponent={<CustomNoDataComponent />}
                    />
                  </Card>
                </div>
                <div className="col-span-6 mt-4 border-2 rounded-xl">
                  <Card>
                    <div className="">
                      <p className="text-xl font-semibold pl-1 pr-1 pt-2">
                        Top 5 Performing SKU's 1 Year
                      </p>
                    </div>
                    <DataTable
                      columns={Product}
                      data={dealerPriceBookYear}
                      sortIcon={
                        <>
                          {" "}
                          <div
                            style={{
                              maskImage: `url(${shorting})`,
                              WebkitMaskImage: `url(${shorting})`,
                              maskRepeat: "no-repeat",
                              WebkitMaskRepeat: "no-repeat",
                              maskPosition: "center",
                              WebkitMaskPosition: "center",
                              maskSize: "contain",
                              WebkitMaskSize: "contain",
                            }}
                            className="ml-2 tabless"
                          />
                        </>
                      }
                      noDataComponent={<CustomNoDataComponent />}
                      highlightOnHover
                      draggableColumns={false}
                    />
                  </Card>
                </div>
              </Grid>
            </div>

          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
