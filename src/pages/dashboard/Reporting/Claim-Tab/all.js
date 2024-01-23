import React from 'react'
import Grid from '../../../../common/grid'
import Request from '../../../../assets/images/icons/requestServices.svg'
import Complete from '../../../../assets/images/icons/completeClaim.svg'
import insurance from '../../../../assets/images/Reporting/insurance.svg'
import Reserves from '../../../../assets/images/Reporting/Reserves.svg'
import Broker from '../../../../assets/images/Reporting/Broker.svg'
import Arrow from '../../../../assets/images/Reporting/icons/arrows.svg'
import Select from '../../../../common/select'
import Button from '../../../../common/button'
import drop from '../../../../assets/images/icons/dropwhite.svg'
import ChartComponent from '../../../../common/chart'
import BarChart from '../../../../common/barChart'

function All() {
    const time = [
        { label: "march 2024", value: true },
        { label: "Inactive", value: false },
      ];
      const year = [
        { label: "2024", value: true },
        { label: "2023", value: false },
      ];
  return (
    <>
    <Grid className='mt-3'>
       <div className='col-span-6'>
            <div className="bg-[#fff] rounded-[30px] p-3 border-[1px] border-[#D1D1D1] flex w-full justify-between">
               <div className='flex'>
                    <img src={Request} className='w-12 h-12' alt='Request'/>
                    <p className='self-center pl-2 font-bold'>Total requests for service</p>
                </div>
                <p className='self-center font-bold text-xl'>3698</p>
            </div>
       </div>
       <div className='col-span-6'>
            <div className="bg-[#fff] rounded-[30px] p-3 border-[1px] border-[#D1D1D1] flex w-full justify-between">
                <div className='flex'>
                    <img src={Complete} className='w-12 h-12' alt='Complete'/>
                    <p className='self-center pl-2 font-bold'>Total Completed claims</p>
                </div> 
                <p className='self-center font-bold text-xl'>1698</p>
            </div>
       </div>
       <div className='col-span-6'>
       <div className="bg-[#333333] text-white rounded-[20px] p-3 my-2 border-[1px] border-[#D1D1D1]">
              <Grid>
                <div className='col-span-7 self-center'>
                    <p className='text-xl font-bold'>Total Claims Paid</p>
                </div>
                <div className='col-span-2 self-center'></div>
                <div className='col-span-3 self-center'>
                  
                     <div className='col-span-2'>
                    <div className='flex border border-white px-2 py-1 h-full rounded-xl justify-between'>
                       <p className='self-center text-[13px]'>
                       Period
                       </p>
                       <img src={drop} className='w-4 h-4 self-center justify-end' alt='drop'/>
                    </div>
                    </div>
                    </div>
                    
                  
              </Grid>

              <BarChart/>
            </div>
       </div>
       <div className='col-span-6'>
       <div className="bg-[#333333] text-white rounded-[20px] p-3 my-2 border-[1px] border-[#D1D1D1]">
              <Grid>
                <div className='col-span-7 self-center'>
                    <p className='text-xl font-bold'>Total Claims Pending</p>
                </div>
                <div className='col-span-2 self-center'></div>
                <div className='col-span-3 self-center'>
                  
                     <div className='col-span-2'>
                    <div className='flex border border-white px-2 py-1 h-full rounded-xl justify-between'>
                       <p className='self-center text-[13px]'>
                       Period
                       </p>
                       <img src={drop} className='w-4 h-4 self-center justify-end' alt='drop'/>
                    </div>
                    </div>
                    </div>
                    
                  
              </Grid>

              <BarChart/>
            </div>
       </div>
    </Grid>
    </>
  )
}

export default All