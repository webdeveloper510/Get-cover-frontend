import React, { useEffect, useState } from 'react'
import Headbar from '../../common/headBar'
// import { Link } from 'react-router-dom'
import Grid from '../../common/grid'
import BarChart from '../../common/barChart'
import Button from '../../common/button'
import Input from '../../common/input'
import drop from '../../assets/images/icons/dropwhite.svg'
import { getCustomerDashboardDetails } from '../../services/dashboardServices'
import { RotateLoader } from 'react-spinners'
function CustomerDashboard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [customerDashboardDetail, setCustomerDashboardDetail] = useState({});
    const customerDashboardDetails = async () => {
      try {
        setLoading(true)
        const result = await getCustomerDashboardDetails();
        console.log(result);
        setCustomerDashboardDetail(result.result);
        setLoading(false)
      } catch (error) {
        console.error(error);
      }
    };
    const formatOrderValue = (orderValue) => {
      if (Math.abs(orderValue) >= 1e6) {
        return (orderValue / 1e6).toFixed(2) + "M";
      } else {
        return orderValue.toLocaleString(0);
      }
    };
    useEffect(() => {
      customerDashboardDetails();
    }, []);
  return (
    <>
     <div className='my-8 ml-3'>
        <Headbar/>
        <div className='flex mt-2'>
          <div className='pl-3'>
            <p className='font-bold text-[36px] leading-9	mb-[3px]'>Dashboard</p>
          </div>
        </div>
        {loading ? (
              <div className=" h-[400px] w-full flex py-5">
                <div className="self-center mx-auto">
                  <RotateLoader color="#333" />
                </div>
              </div>
            ) : (
        <div className='mt-5'>
          <Grid className='s:grid-cols-3 md:grid-cols-6 xl:grid-cols-12'>
            <div className='col-span-3 bg-gradient-to-r from-[#000000] to-[#333333] cursor-pointer text-white rounded-xl p-8'>
               <p className='text-2xl font-bold'>{customerDashboardDetail?.ordersCount}</p>
               <p className='text-neutral-grey text-sm'>Total Number of Orders</p>
            </div>
            <div className='col-span-3 bg-gradient-to-r from-[#000000] to-[#333333] cursor-pointer text-white rounded-xl p-8'>
               <p className='text-2xl font-bold'>{ formatOrderValue(customerDashboardDetail?.contractCount ?? parseInt(0))}</p>
               <p className='text-neutral-grey text-sm'>Total Numbers of Contracts</p>
            </div>
            <div className='col-span-3 bg-gradient-to-r from-[#000000] to-[#333333] cursor-pointer text-white rounded-xl p-8'>
               <p className='text-2xl font-bold'>1,000</p>
               <p className='text-neutral-grey text-sm'>Total Numbers of Claims</p>
            </div>
            <div className='col-span-3 bg-gradient-to-r from-[#000000] to-[#333333] cursor-pointer text-white rounded-xl p-8'>
               <p className='text-2xl font-bold'>$35,859.00</p>
               <p className='text-neutral-grey text-sm'>Total Value of Claims</p>
            </div>
          </Grid>
        </div>
            )}
     </div>
    </>
  )
}

export default CustomerDashboard