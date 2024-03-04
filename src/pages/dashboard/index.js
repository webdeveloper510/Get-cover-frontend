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

function Dashboard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dashboardDetail, setDashboardDetails] = useState({});

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const toggleRange = () => {
    setIsRangeOpen(!isRangeOpen);
  };

  const dashboardDetails = async () => {
    try {
      setLoading(true)
      const result = await getDashboardDetails();
      console.log(result);
      setDashboardDetails(result.result);
      setLoading(false)
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
                    {dashboardDetail?.totalOrder}
                  </p>
                  <p className="text-neutral-grey text-sm">Total Number of Orders</p>
                </div>
                <div className="col-span-3 bg-gradient-to-r from-[#000000] to-[#333333] cursor-pointer text-white rounded-xl p-8">
                  <p className="text-2xl font-bold">
                  ${ dashboardDetail.totalAmount === undefined
                    ? parseInt(0).toLocaleString(2)
                    : formatOrderValue(dashboardDetail.totalAmount ?? parseInt(0))}
                  </p>
                  <p className="text-neutral-grey text-sm">Total Value of Orders</p>
                </div>
                <div className="col-span-3 bg-gradient-to-r from-[#000000] to-[#333333] cursor-pointer text-white rounded-xl p-8">
                  <p className="text-2xl font-bold">6,359</p>
                  <p className="text-neutral-grey text-sm">Total Number of Claims</p>
                </div>
                <div className="col-span-3 bg-gradient-to-r from-[#000000] to-[#333333] cursor-pointer text-white rounded-xl p-8">
                  <p className="text-2xl font-bold">$35,859.00</p>
                  <p className="text-neutral-grey text-sm">Total Value of Claims</p>
                </div>
              </Grid>
              <Grid className="s:hidden md:block ">
                <div className="col-span-12">
                  <div className="bg-[#333333] text-white rounded-[20px] p-3 my-4 border-[1px] border-[#D1D1D1]">
                    <Grid>
                      <div className="col-span-3 self-center">
                        <p className="text-xl font-bold">
                          Total Order Value{" "}
                          <span className="text-sm font-normal"> Monthly </span>
                        </p>
                      </div>
                      <div className="col-span-9 self-center">
                        <Grid className="!grid-cols-9 !gap-1">
                          <div className="col-span-3 text-right">
                            <Button className="!bg-[#FFFFFF2B] !text-white !text-[11px] !rounded-xl">
                              Compare Years by Month
                            </Button>
                          </div>
                          <div className="col-span-2 text-center">
                            <Button className="!bg-[#FFFFFF2B] !text-white !text-[11px] ml-1 !rounded-xl">
                              Year To Date
                            </Button>
                          </div>
                          <div className="col-span-2">
                            <div className="flex border border-white px-2 py-1 h-full rounded-xl justify-between relative">
                              <div
                                className="flex justify-between w-full cursor-pointer"
                                onClick={toggleDropdown}
                              >
                                <p className="self-center text-[13px]">Period</p>
                                <img
                                  src={drop}
                                  className="w-4 h-4 self-center justify-end"
                                  alt="drop"
                                />
                              </div>
                              {isDropdownOpen && (
                                <div className="absolute top-8 w-full text-center ">
                                  <div className="bg-[#fff] text-light-black border rounded-xl py-2 px-4">
                                    <p className="font-semibold border-b">Period</p>
                                    <p className="border-b">Days</p>
                                    <p>Monthly</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-span-2">
                            <div className="flex border border-white px-2 py-1 h-full rounded-xl justify-between relative">
                              <div
                                className="flex justify-between w-full cursor-pointer "
                                onClick={toggleRange}
                              >
                                <p className="self-center text-[13px] ">
                                  Date Range
                                </p>
                                <img
                                  src={drop}
                                  className="w-4 h-4 self-center"
                                  alt="drop"
                                />
                              </div>
                              {isRangeOpen && (
                                <div className="absolute top-10 w-full right-[100%]">
                                  <div className="bg-[#fff] w-[350px] p-3 text-light-black border rounded-xl py-2 px-4">
                                    <p className="font-semibold text-base border-b pb-2 mb-3">
                                      Date Range
                                    </p>
                                    <Grid>
                                      <div className="col-span-6">
                                        <Input type="date" className1='!pt-2.5' />
                                      </div>
                                      <div className="col-span-6">
                                        <Input type="date" className1='!pt-2.5' />
                                      </div>
                                    </Grid>
                                    <div className="mt-4">
                                      <Button>Show Results</Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </Grid>
                      </div>
                    </Grid>

                    <BarChart />
                  </div>
                </div>
              </Grid>
              <div className="bg-[#fff] rounded-[20px] p-3 my-4 border-[1px] border-[#D1D1D1]">
                <Grid className="s:grid-cols-2 md:grid-cols-12 xl:grid-cols-12">
                  <div className="col-span-2 my-3">
                    <Select
                      label=""
                      name="state"
                      placeholder=""
                      className="!bg-white"
                      className1="!p-1"
                      options={time}
                    />
                  </div>
                </Grid>
                <Grid className="  s:grid-cols-1 md:grid-cols-3 xl:grid-cols-5">
                  <div className="col-span-1 s:border-0 md:border-r xl:border-r s:bg-[none] md:bg-gradient-to-t from-[#FFFFFF00] via-[#AAAAAA] to-[#FFFFFF00] s:pr-0 md:pr-[1px] xl:pr-[1px]">
                    <div className="bg-white pl-2">
                      <div className="flex mb-4">
                        <img src={Administration} alt="Administration" />
                        <p className="text-sm font-bold self-center pl-3">
                          Breakdown for Administration
                        </p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold">$5,666,159.00</p>
                        <p className="text-base opacity-50 font-normal">
                          $10,000.00
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 border-r s:border-0 md:border-r xl:border-r s:bg-[none] md:bg-gradient-to-t from-[#FFFFFF00] via-[#AAAAAA] to-[#FFFFFF00] s:pr-0 md:pr-[1px] xl:pr-[1px]">
                    <div className="bg-white pl-4">
                      <div className="flex mb-4">
                        <img src={Fronting} alt="Administration" />
                        <p className="text-sm font-bold self-center pl-3">
                          Fronting <br /> Fees
                        </p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold">$232,159.00</p>
                        <p className="text-base opacity-50 font-normal">
                          $10,000.00
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 s:border-0 md:border-r xl:border-r s:bg-[none] md:bg-gradient-to-t from-[#FFFFFF00] via-[#AAAAAA] to-[#FFFFFF00] s:pr-0 md:pr-[1px] xl:pr-[1px]">
                    <div className="bg-white pl-4">
                      <div className="flex mb-4">
                        <img src={insurance} alt="Administration" />
                        <p className="text-sm font-bold self-center pl-3">
                          Re-insurance Premium
                        </p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold">$1,523,239.00</p>
                        <p className="text-base opacity-50 font-normal">
                          $10,000.00
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 s:border-0 md:border-r xl:border-r s:bg-[none] md:bg-gradient-to-t from-[#FFFFFF00] via-[#AAAAAA] to-[#FFFFFF00] s:pr-0 md:pr-[1px] xl:pr-[1px]">
                    <div className="bg-white pl-3">
                      <div className="flex mb-4">
                        <img src={Reserves} alt="Administration" />
                        <p className="text-sm font-bold self-center pl-3">
                          Reserves Future Claims
                        </p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold">$123,259.00</p>
                        <p className="text-base opacity-50 font-normal">
                          $10,000.00
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 pl-5">
                    <div className="flex mb-4">
                      <img src={Broker} alt="Administration" />
                      <p className="text-sm font-bold self-center pl-3">
                        Broker <br /> Fees
                      </p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">$1,552,369.00</p>
                      <p className="text-base opacity-50 font-normal">$10,000.00</p>
                    </div>
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
