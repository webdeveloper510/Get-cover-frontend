import React, { useState } from 'react'
import BarChart from '../../../../common/barChart'
import Grid from '../../../../common/grid'
import drop from '../../../../assets/images/icons/dropwhite.svg'

function ServicerUnpaidClaim() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <div>
      <div className="bg-[#333333] text-white rounded-[20px] p-3 my-2 border-[1px] border-Light-Grey">
              <Grid>
                <div className='col-span-7 self-center'>
                    <p className='text-xl font-bold'>Total Claims Unpaid</p>
                </div>
                <div className='col-span-2 self-center'></div>
                <div className='col-span-1 self-center'></div>
                  
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
                    
                  
              </Grid>

              <BarChart/>
            </div>
    </div>
  )
}

export default ServicerUnpaidClaim