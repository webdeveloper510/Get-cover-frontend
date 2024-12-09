import React, { useEffect, useRef, useState } from 'react'
import Headbar from '../../common/headBar'
// import { Link } from 'react-router-dom'
import Grid from '../../common/grid'
import BarChart from '../../common/barChart'
import Button from '../../common/button'
import Input from '../../common/input'
import view from "../../assets/images/eye.png";
import drop from '../../assets/images/icons/dropwhite.svg'
import shorting from "../../assets/images/icons/shorting.svg";
import { getCustomerDashboardDetails, getCustomerDashboardList, getDashboardForCustomer } from '../../services/dashboardServices'
import { RotateLoader } from 'react-spinners'
import DataTable from 'react-data-table-component'
import ActiveIcon from "../../assets/images/icons/iconAction.svg";
import { Link } from 'react-router-dom'
import Card from '../../common/card'
import MultiColorView from '../../common/multiColorView'
function CustomerDashboard() {
  const [loading, setLoading] = useState(false);
  const [customerDashboardDetail, setCustomerDashboardDetail] = useState({});
  // const [orderAmount, setOrderAmount] = useState([]);
  // const [claimAmount, setClaimAmount] = useState([]);
  // const [orderList, setOrderList] = useState([]);
  // const [claimList, setClaimList] = useState([]);
  // const dropdownRef = useRef(null);
  const customerDashboardDetails = async () => {
    setLoading(true)
    try {
      const result = await getCustomerDashboardDetails();
      console.log(result);
      setCustomerDashboardDetail(result.result);

    } catch (error) {
      console.error(error);
    }
    setLoading(false)
  };
  useEffect(() => {
    customerDashboardDetails();
  }, []);

  // const getDashboardData = async () => {
  //   try {
  //     const result = await getCustomerDashboardList();
  //     console.log(result, "-------------------");
  //     setClaimList(result.result.lastFiveClaims);
  //     setOrderList(result.result.lastFiveOrder);
  //   } catch (error) {
  //     console.error("Error fetching dealer list:", error);
  //   }
  // };

  // const getDashboardCart = async () => {
  //   setLoading(true);
  //   const result = await getDashboardForCustomer();
  //   const countData = result.order_result.map((item) => {
  //     return {
  //       weekStart: item.weekStart,
  //       total_orders: item.order_amount,
  //     };
  //   });
  //   const claimData = result.claim_result.map((item) => {
  //     return {
  //       weekStart: item.weekStart,
  //       total_orders: item.total_amount,
  //     };
  //   });
  //   console.log(countData);
  //   setOrderAmount(countData);
  //   setClaimAmount(claimData);
  //   setLoading(false);
  // };

  useEffect(() => {
    setLoading(true);
    if (window.location.pathname === '/customer/dashboard') {
      const reloadFlag = localStorage.getItem('reloadDashboard');

      if (reloadFlag === 'true') {
        localStorage.setItem('reloadDashboard', 'false');
        setTimeout(() => {
          window.location.reload(true);
          setLoading(false);
        }, 3000)
      }
    }
  }, []);


  return (
    <>
      <div className='my-8 ml-3'>
        <Headbar />
        <div className='flex mt-2'>
          <div className='pl-3'>
            <p className='font-bold text-[36px] leading-9	mb-[3px]'>Dashboard</p>
          </div>
        </div>
        {loading ? (
          <div className=" fixed h-screen w-full bg-[#f9f9f954] backdrop-blur-xl top-0 left-0 flex py-5">
            <div className="self-center mx-auto">
              <RotateLoader color="#333" />
            </div>
          </div>
        ) : (
          <div className='mt-5'>
            <Grid className='s:grid-cols-3 md:grid-cols-6 xl:grid-cols-9'>
              <MultiColorView className='col-span-3 cursor-pointer rounded-xl p-8'>
                <p className='text-2xl font-bold'>{customerDashboardDetail?.numberOfDevices}</p>
                <p className=' text-sm'>Number of Devices</p>
              </MultiColorView>
              <MultiColorView className='col-span-3 cursor-pointer rounded-xl p-8'>
                <p className='text-2xl font-bold'>{customerDashboardDetail?.numberOfSubmittedClaims}</p>
                <p className=' text-sm'>Total Number of Submitted claims</p>
              </MultiColorView>
              <MultiColorView className='col-span-3 cursor-pointer rounded-xl p-8'>
                <p className='text-2xl font-bold'>{customerDashboardDetail?.numberOfCompletedClaims}</p>
                <p className=' text-sm'>Total Number of Completed Claims</p>
              </MultiColorView>

            </Grid>
          </div>
        )}
      </div>
    </>
  )
}

export default CustomerDashboard