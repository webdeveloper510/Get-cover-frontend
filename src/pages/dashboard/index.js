import React, { useEffect, useState } from 'react'
import Headbar from '../../common/headBar'
import { Link } from 'react-router-dom'
import Grid from '../../common/grid'

function Dashboard() {
  useEffect(()=>{
    console.log("yes")
  })
  return (
    <>
     <div className='my-8 ml-3'>
        <Headbar/>
        <div className='flex mt-2'>
          <div className='pl-3'>
            <p className='font-bold text-[36px] leading-9	mb-[3px]'>Dashboard</p>
          </div>
        </div>
        <div className='mt-5'>
          <Grid>
            <div className='col-span-3 bg-gradient-to-r from-[#000000] to-[#333333] text-white rounded-xl p-8'>
               <p className='text-2xl font-bold'>6,359</p>
               <p className='text-[#999999] text-sm'>Total Number of Orders</p>
            </div>
            <div className='col-span-3 bg-gradient-to-r from-[#000000] to-[#333333] text-white rounded-xl p-8'>
               <p className='text-2xl font-bold'>$96,859.00</p>
               <p className='text-[#999999] text-sm'>Total Value of Orders</p>
            </div>
            <div className='col-span-3 bg-gradient-to-r from-[#000000] to-[#333333] text-white rounded-xl p-8'>
               <p className='text-2xl font-bold'>6,359</p>
               <p className='text-[#999999] text-sm'>Total Number of Claims</p>
            </div>
            <div className='col-span-3 bg-gradient-to-r from-[#000000] to-[#333333] text-white rounded-xl p-8'>
               <p className='text-2xl font-bold'>$35,859.00</p>
               <p className='text-[#999999] text-sm'>Total Value of Claims</p>
            </div>
          </Grid>
        </div>
     </div>
    </>
  )
}

export default Dashboard