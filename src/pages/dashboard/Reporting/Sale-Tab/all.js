import React from 'react'
import Grid from '../../../../common/grid'
import Administration from '../../../../assets/images/Reporting/Breakdown.svg'
import Fronting from '../../../../assets/images/Reporting/Fronting.svg'
import insurance from '../../../../assets/images/Reporting/insurance.svg'
import Reserves from '../../../../assets/images/Reporting/Reserves.svg'
import Broker from '../../../../assets/images/Reporting/Broker.svg'
import Select from '../../../../common/select'
import Button from '../../../../common/button'
import SelectWhite from '../../../../common/selectWhite'
import drop from '../../../../assets/images/icons/dropwhite.svg'

function All() {
    const time = [
        { label: "march 2024", value: true },
        { label: "Inactive", value: false },
      ];
  return (
    <>
    <Grid>
        <div className='col-span-9'>
            <div className="bg-[#333333] text-white rounded-[20px] p-3 my-4 border-[1px] border-[#D1D1D1]">
              <Grid>
                <div className='col-span-3 self-center'>
                    <p className='text-2xl font-bold'>Total sales<span className='text-sm font-normal'> Monthly </span></p>
                </div>
                <div className='col-span-9 self-center'>
                  <Grid className='!grid-cols-4 !gap-1'>

                     <Button className='!bg-[#FFFFFF2B] !text-white !text-[11px] !p-0 !rounded-xl'>Compare Years by Month</Button>
                    
                    <Button className='!bg-[#FFFFFF2B] !text-white !text-[11px] ml-1 !rounded-xl'>Year To Date</Button>

                    <div className='flex border border-white px-3 py-1 rounded-xl justify-between'>
                       <p className='self-center'>
                       Period
                       </p>
                       <img src={drop} className='w-6 h-6 pl-3 ml-3 self-center justify-end' alt='drop'/>
                    </div>
                    <div className='flex border border-white px-3 py-1 rounded-xl justify-between'>
                       <p className='self-center'>
                        Date Range
                       </p>
                       <img src={drop} className='w-6 h-6 pl-2 self-center' alt='drop'/>
                    </div>
                  </Grid>
                </div>
              </Grid>
            </div>
        </div>
        <div className='col-span-3'>
            <div className="bg-[#fff] rounded-[20px] p-3 my-4 border-[1px] border-[#D1D1D1]">
                <p className='text-2xl font-bold'>Years Comparison</p>
            {/* <ChartComponent/> */}
            </div>
        </div>
    </Grid>

    <div className="bg-[#fff] rounded-[20px] p-3 my-4 border-[1px] border-[#D1D1D1]">
        <Grid>
            <div className='col-span-2 my-3'>
                <Select
                    label=""
                    name="state"
                    placeholder=""
                    className="!bg-white"
                    options={time}
                />
            </div>
        </Grid>
        <Grid className='!grid-cols-5'>
            <div className='col-span-1 border-r bg-gradient-to-t from-[#FFFFFF00] via-[#AAAAAA] to-[#FFFFFF00] pr-[1px]'>
                <div className='bg-white'>
                <div className='flex mb-4'>
                    <img src={Administration} alt='Administration'/>
                    <p className='text-sm font-bold self-center pl-3'>Breakdown for Administration</p>
                </div>
                <div>
                    <p className='text-3xl font-bold'>$159.00</p>
                    <p className='text-base opacity-50 font-normal'>$10,000.00</p>
                </div>
                </div>
            </div>
            <div className='col-span-1 border-r bg-gradient-to-t from-[#FFFFFF00] via-[#AAAAAA] to-[#FFFFFF00] pr-[1px]'>
                <div className='bg-white'>
                <div className='flex mb-4'>
                    <img src={Fronting} alt='Administration'/>
                    <p className='text-sm font-bold self-center pl-3'>Fronting <br/> Fees</p>
                </div>
                <div>
                    <p className='text-3xl font-bold'>$159.00</p>
                    <p className='text-base opacity-50 font-normal'>$10,000.00</p>
                </div>
                </div>
            </div>
            <div className='col-span-1 border-r bg-gradient-to-t from-[#FFFFFF00] via-[#AAAAAA] to-[#FFFFFF00] pr-[1px]'>
                <div className='bg-white'>
                <div className='flex mb-4'>
                    <img src={insurance} alt='Administration'/>
                    <p className='text-sm font-bold self-center pl-3'>Re-insurance Premium</p>
                </div>
                <div>
                    <p className='text-3xl font-bold'>$159.00</p>
                    <p className='text-base opacity-50 font-normal'>$10,000.00</p>
                </div>
            </div>
            </div>
            <div className='col-span-1 border-r bg-gradient-to-t from-[#FFFFFF00] via-[#AAAAAA] to-[#FFFFFF00] pr-[1px]'>
                <div className='bg-white'>
                <div className='flex mb-4'>
                    <img src={Reserves} alt='Administration'/>
                    <p className='text-sm font-bold self-center pl-3'>Reserves Future Claims</p>
                </div>
                <div>
                    <p className='text-3xl font-bold'>$159.00</p>
                    <p className='text-base opacity-50 font-normal'>$10,000.00</p>
                </div>
            </div>
            </div>
            <div className='col-span-1'>
                <div className='flex mb-4'>
                    <img src={Broker} alt='Administration'/>
                    <p className='text-sm font-bold self-center pl-3'>Broker <br/> Fees</p>
                </div>
                <div>
                    <p className='text-3xl font-bold'>$159.00</p>
                    <p className='text-base opacity-50 font-normal'>$10,000.00</p>
                </div>
            </div>
        </Grid>
    </div>
    </>
  )
}

export default All