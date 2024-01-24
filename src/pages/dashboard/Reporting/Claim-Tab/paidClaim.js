import React from 'react'
import BarChart from '../../../../common/barChart'
import Grid from '../../../../common/grid'
import drop from '../../../../assets/images/icons/dropwhite.svg'

function PaidClaim() {
  return (
    <div>
      <div className="bg-[#333333] text-white rounded-[20px] p-3 my-2 border-[1px] border-[#D1D1D1]">
              <Grid>
                <div className='col-span-7 self-center'>
                    <p className='text-xl font-bold'>Total Claims Paid</p>
                </div>
                <div className='col-span-2 self-center'></div>
                <div className='col-span-2 self-center'></div>
                  
                     <div className='col-span-1'>
                    <div className='flex border border-white px-2 py-1 h-full rounded-xl justify-between'>
                       <p className='self-center text-[13px]'>
                       Period
                       </p>
                       <img src={drop} className='w-4 h-4 self-center justify-end' alt='drop'/>
                    </div>
                    </div>
                    
                  
              </Grid>

              <BarChart/>
            </div>
    </div>
  )
}

export default PaidClaim