import React, { useEffect, useState } from "react";
import Headbar from "../../common/headBar";
import { Link } from "react-router-dom";
import Grid from "../../common/grid";
import BarChart from "../../common/barChart";
import drop from '../../assets/images/icons/dropwhite.svg'
import Button from "../../common/button";
import DateInput from "../../common/dateInput";
import { getDashboardDetailsforServicerPortal } from "../../services/dealerServices/resellerServices";
import { RotateLoader } from "react-spinners";
function ServicerDashboard() {
  const [loading, setLoading] = useState(false);
  const [dashboardDetail, setDashboardDetails] = useState({});
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
          <Grid className="s:grid-cols-3 md:grid-cols-6 xl:grid-cols-12">
            <div className="col-span-3 bg-gradient-to-r from-[#000000] to-[#333333] cursor-pointer text-white rounded-xl p-8">
              <p className="text-2xl font-bold">{dashboardDetail?.claimData?.numberOfClaims}</p>
              <p className="text-neutral-grey text-sm">Total Number of Claims</p>
            </div>
            <div className="col-span-3 bg-gradient-to-r from-[#000000] to-[#333333] cursor-pointer text-white rounded-xl p-8">
              <p className="text-2xl font-bold">${dashboardDetail?.claimData?.valueClaim === undefined
                                ? parseInt(0).toLocaleString(2)
                                : formatOrderValue(
                                    dashboardDetail?.claimData?.valueClaim ?? parseInt(0)
                                )}</p>
              <p className="text-neutral-grey text-sm">Total Value of Claims</p>
            </div>
            <div className="col-span-3 bg-gradient-to-r from-[#000000] to-[#333333] cursor-pointer text-white rounded-xl p-8">
              <p className="text-2xl font-bold">${dashboardDetail?.claimData?.paidClaimValue === undefined
                                ? parseInt(0).toLocaleString(2)
                                : formatOrderValue(
                                    dashboardDetail?.claimData?.paidClaimValue ?? parseInt(0)
                                )}</p>
              <p className="text-neutral-grey text-sm">Total Value of Paid Claims</p>
            </div>
            <div className="col-span-3 bg-gradient-to-r from-[#000000] to-[#333333] cursor-pointer text-white rounded-xl p-8">
              <p className="text-2xl font-bold">${dashboardDetail?.claimData?.unPaidClaimValue === undefined
                                ? parseInt(0).toLocaleString(2)
                                : formatOrderValue(
                                    dashboardDetail?.claimData?.unPaidClaimValue ?? parseInt(0)
                                )}</p>
              <p className="text-neutral-grey text-sm">Total Value of Unpaid Claims</p>
            </div>
          </Grid>

          {/* <Grid className='s:hidden md:block xl:block'>
            <div className='col-span-12'>
            <div className="bg-[#333333] text-white rounded-[20px] p-3 my-4 border-[1px] border-Light-Grey">
              <Grid>
                <div className='col-span-3 self-center'>
                    <p className='text-xl font-bold'>Total Claims <span className='text-sm font-normal'> Monthly </span></p>
                </div>
                <div className='col-span-9 self-center'>
                  <Grid className='!grid-cols-9 !gap-1'>
                     <div className='col-span-3 text-right'>
                        <Button className='!bg-[#FFFFFF2B] !text-white !text-[11px] !rounded-xl'>Compare Years by Month</Button>
                     </div>
                     <div className='col-span-2 text-center'>
                        <Button className='!bg-[#FFFFFF2B] !text-white !text-[11px] ml-1 !rounded-xl'>Year To Date</Button>
                     </div>
                     <div className='col-span-2'>
                        <div className='flex border border-white px-2 py-1 h-full rounded-xl justify-between relative'>
                            <div className='flex justify-between w-full cursor-pointer' onClick={toggleDropdown}>
                                <p className='self-center text-[13px]'>
                                    Period
                                </p>
                                <img src={drop} className='w-4 h-4 self-center justify-end' alt='drop'/>
                            </div>  
                            {isDropdownOpen && (
                            <div className='absolute top-8 w-full text-center '>
                                <div className='bg-white text-light-black border rounded-xl py-2 px-4'>
                                    <p className='font-semibold border-b'>Period</p>
                                    <p className='border-b'>Days</p>
                                    <p>Monthly</p>
                                </div>
                            </div>
                            )}
                        </div>
                    </div>
                    <div className='col-span-2'>
                        <div className='flex border border-white px-2 py-1 h-full rounded-xl justify-between relative'>
                            <div className='flex justify-between w-full cursor-pointer '  onClick={toggleRange}>
                            <p className='self-center text-[13px] '>
                                Date Range
                            </p>
                            <img src={drop} className='w-4 h-4 self-center' alt='drop'/>
                            </div>
                        {isRangeOpen && (
                                <div className='absolute top-10 w-full right-[100%]'>
                                    <div className='bg-white w-[350px] p-3 text-light-black border rounded-xl py-2 px-4'>
                                        <p className='font-semibold text-base border-b pb-2 mb-3'>Date Range</p>
                                        <Grid>
                                            <div className='col-span-6'>
                                             <DateInput
                                                label="Loss Date"
                                                name="lossDate"
                                                required 
                                                item={item}
                                                setItem={setItem}
                                                className="!bg-white" />
                                            </div>
                                            <div className='col-span-6'>
                                            <DateInput
                                                label="Loss Date"
                                                name="lossDate"
                                                required 
                                                item={item}
                                                setItem={setItem}
                                                className="!bg-white" />
                                            </div>
                                        </Grid>
                                        <div className='mt-4'>
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

              <BarChart/>
            </div>
            </div>
          </Grid> */}
        </div>
                    )}
      </div>
    </>
  );
}

export default ServicerDashboard;
