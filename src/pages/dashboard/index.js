import React, { useEffect, useState } from 'react'
import Headbar from '../../common/headBar'
import { Link } from 'react-router-dom'
import Grid from '../../common/grid'
import ChartComponent from '../../common/chart'

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
          <Grid>
            <div className='col-span-8'></div>
            <div className='col-span-4'>
              <div className="bg-[#fff] rounded-[20px] p-3 my-4 border-[1px] border-[#D1D1D1]">
                  <p className='text-xl font-bold mb-3'>Sales Per Years</p>
                  <ChartComponent/>
                  <Grid className='!gap-1'>
                <div className='col-span-6'>
                    <div className='border-2 p-2 rounded-xl border-[#D1D1D1]'>
                      <div className='flex'>
                            <div className='bg-[#3D3D3D] mt-2 w-4 h-4 rounded-full'></div>
                            <div className='ml-1'>
                                <p className='text-xl font-bold '>$159.00</p>
                                <p> 2023</p>
                            </div>
                      </div>
                    </div>
                </div>
                <div className='col-span-6'>
                    <div className='border-2 p-2 rounded-xl border-[#D1D1D1]'>
                      <div className='flex'>
                            <div className='bg-[#939393] mt-2 w-4 h-4 rounded-full'></div>
                            <div className='ml-1'>
                                <p className='text-xl font-bold '>$107.00</p>
                                <p> 2022</p>
                            </div>
                      </div>
                    </div>
                </div>
            </Grid>
              </div>
            </div>
          </Grid>
        </div>
     </div>
    </>
  )
}

export default Dashboard