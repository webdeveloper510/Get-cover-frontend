import React, { useState } from 'react'
import Grid from '../../../../common/grid'
import Arrow from '../../../../assets/images/Reporting/icons/arrows.svg'
import Select from '../../../../common/select'
import Button from '../../../../common/button'
import SelectWhite from '../../../../common/selectWhite'
import Administration from '../../../../assets/images/Reporting/Breakdown.svg'
import Fronting from '../../../../assets/images/Reporting/Fronting.svg'
import insurance from '../../../../assets/images/Reporting/insurance.svg'
import Reserves from '../../../../assets/images/Reporting/Reserves.svg'
import drop from '../../../../assets/images/icons/dropwhite.svg'
import ChartComponent from '../../../../common/chart'
import LineChart from '../../../../common/lineChart'

function WholeSale() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };
    const time = [
        { label: "march 2024", value: true },
        { label: "Inactive", value: false },
      ];
  return (
    <>
    <Grid>
        <div className='col-span-8'>
        <div className="bg-[#333333] text-white rounded-[20px] p-3 my-4 border-[1px] border-[#D1D1D1]">
              <Grid>
                <div className='col-span-3 self-center'>
                    <p className='text-xl font-bold'>Total sales<span className='text-sm font-normal'> Monthly </span></p>
                </div>
                <div className='col-span-9 self-center'>
                  <Grid className='!grid-cols-9 !gap-1'>
                     <div className='col-span-3'>
                        <Button className='!bg-[#FFFFFF2B] !text-white !text-[11px] !rounded-xl'>Compare Years by Month</Button>
                     </div>
                     <div className='col-span-2'>
                        <Button className='!bg-[#FFFFFF2B] !text-white !text-[11px] ml-1 !rounded-xl'>Year To Date</Button>
                     </div>
                     <div className='col-span-2'>
                        <div className='flex border border-white px-2 py-1 h-full rounded-xl justify-between relative'>
                              <div className='flex justify-between w-full cursor-pointer' onClick={toggleDropdown}>
                                <p className='self-center text-[13px]'>Period</p>
                                <img src={drop} className='w-4 h-4 self-center justify-end' alt='drop'/>
                              </div>  
                              {isDropdownOpen && (
                              <div className='absolute top-8 w-full text-center '>
                                  <div className='bg-[#fff] text-light-black border rounded-xl py-2 px-4'>
                                      <p className='font-semibold border-b'>Period</p>
                                      <p className='border-b'>Days</p>
                                      <p>Monthly</p>
                                  </div>
                              </div>
                              )}
                        </div>
                    </div>
                    <div className='col-span-2'>
                    <div className='flex border border-white px-2 py-1 h-full rounded-xl justify-between'>
                       <p className='self-center text-[13px]'>
                        Date Range
                       </p>
                       <img src={drop} className='w-4 h-4 self-center' alt='drop'/>
                    </div>
                    </div>
                  </Grid>
                </div>
              </Grid>

              <LineChart/>
            </div>
        </div>
        <div className='col-span-4'>
            <div className="bg-[#fff] rounded-[20px] p-3 my-4 border-[1px] border-[#D1D1D1]">
                <p className='text-xl font-bold mb-3'>Years Comparison</p>
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
            <Grid className='!gap-5 mt-5 '>
                <div className='col-span-6 relative'>
                    <label className='text-[11px] text-[#727378] font-bold'>Select Current Year</label>
                    <Select
                    label=""
                    name="state"
                    placeholder=""
                    className="!bg-white"
                    className1='!text-sm !p-1'
                    options={time}
                />
                <img src={Arrow} className='absolute -right-5 top-9' alt='Arrow'/>
                </div>
                <div className='col-span-6'>
                    <label className='text-[11px] text-[#727378] font-bold'>Select Previous Year</label>
                    <Select
                    label=""
                    name="state"
                    placeholder=""
                    className="!bg-white"
                    className1='!text-sm !p-1'
                    options={time}
                />
                </div>
            </Grid>
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
                    className1='!p-1'
                    options={time}
                />
            </div>
        </Grid>
        <Grid className='!grid-cols-4'>
            <div className='col-span-1 border-r bg-gradient-to-t from-[#FFFFFF00] via-[#AAAAAA] to-[#FFFFFF00] pr-[1px]'>
                <div className='bg-white'>
                <div className='flex mb-4'>
                    <img src={Administration} alt='Administration'/>
                    <p className='text-sm font-bold self-center pl-3'>Breakdown for <br/> Administration</p>
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
                    <p className='text-sm font-bold self-center pl-3'>Re-insurance <br/> Premium</p>
                </div>
                <div>
                    <p className='text-3xl font-bold'>$159.00</p>
                    <p className='text-base opacity-50 font-normal'>$10,000.00</p>
                </div>
            </div>
            </div>
            <div className='col-span-1'>
                <div className='flex mb-4'>
                    <img src={Reserves} alt='Administration'/>
                    <p className='text-sm font-bold self-center pl-3'>Reserves Future <br/> Claims</p>
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


export default WholeSale