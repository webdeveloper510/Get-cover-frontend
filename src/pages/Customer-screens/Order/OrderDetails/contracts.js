import React, { useState } from 'react'
import Button from '../../../../common/button'
import Grid from '../../../../common/grid'
import Input from '../../../../common/input'

// Media Includes 
import Search from '../../../../assets/images/icons/SearchIcon.svg';
import Edit from '../../../../assets/images/Dealer/EditIcon.svg';
import clearFilter from "../../../../assets/images/icons/Clear-Filter-Icon-White.svg";
function CustomerContracts() {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <>
    <div className='my-8'>
      <div className='bg-white mt-6 border-[1px] border-Light-Grey rounded-xl'>
      <Grid className='!p-[26px] !pt-[14px] !pb-0'>
              <div className='col-span-5 self-center'>
                <p className='text-xl font-semibold'>Contracts List</p>
              </div>
              <div className='col-span-7'>
                <div className='bg-grayf9 rounded-[30px] p-3 border-[1px] border-Light-Grey'>
                  <Grid className='!grid-cols-11' >
                    <div className='col-span-3 self-center'>
                      <Input name='Name' type='text' className='!text-[14px] !bg-White-Smoke' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]" label='' placeholder='Order ID' />
                    </div>
                    <div className='col-span-3 self-center'>
                      <Input name='Email' type='email'className='!text-[14px] !bg-White-Smoke' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]" label='' placeholder='Dealer P.O. #' />
                    </div>
                    <div className='col-span-3 self-center'>
                      <Input name='PhoneNo.' type='text'className='!text-[14px] !bg-White-Smoke' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]" label='' placeholder='Customer Name' />
                    </div>
                    <div className='col-span-2 self-center flex justify-center'>
                    <Button
                        type="submit" className='!p-2'>
                          <img src={Search} className='cursor-pointer ' alt='Search' />
                          </Button>
                      <Button
                        type="submit"
                        className="!bg-transparent !p-0"
                      >
                        <img
                          src={clearFilter}
                          className="cursor-pointer	mx-auto"
                          alt="clearFilter"
                        />
                      </Button>
                    </div>
                  </Grid>
  
                </div>
              </div>
            </Grid>

        <div className='px-3 mt-5'>

          <div>
            <Grid className='bg-light-black !gap-2 !grid-cols-9 rounded-t-xl'>
              <div className='col-span-2 self-center text-center bg-contract bg-cover bg-right bg-no-repeat rounded-ss-xl'>
                <p className='text-white py-2 font-Regular'>Contract ID :  <b> 861910 </b></p>
              </div>
              <div className='col-span-6'>
              </div>
              
              <div className='col-span-1 self-center justify-end'>
                {/* <img src={Edit} className='ml-auto mr-2' alt='edit' /> */}
              </div>
            </Grid>

            <Grid className='!gap-0 !grid-cols-5 bg-grayf9 mb-5'>
              <div className='col-span-1 border border-Light-Grey'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Manufacturer</p>
                  <p className='text-light-black text-base font-semibold'>Apple iPad</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Model</p>
                  <p className='text-light-black text-base font-semibold'>Apple iPad 5th Gen, 30GB</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Serial</p>
                  <p className='text-light-black text-base font-semibold'>GG7W212JHLF12</p>
                </div>
              </div>
              <div className='col-span-2 border border-Light-Grey'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Product Description</p>
                  <p className='text-light-black text-base font-semibold'>Laptops are designed to be portable computers.</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Retail Price</p>
                  <p className='text-light-black text-base font-semibold'>$182</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Condition</p>
                  <p className='text-light-black text-base font-semibold'>Used</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Coverage Start Date</p>
                  <p className='text-light-black text-base font-semibold'>11/09/2026</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Coverage End Date</p>
                  <p className='text-light-black text-base font-semibold'>09/11/2030</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Claim Amount</p>
                  <p className='text-light-black text-base font-semibold'>$18.00</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey rounded-es-xl	'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Status</p>
                  <p className='text-light-black text-base font-semibold'>Waiting</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Eligibility</p>
                  <p className='text-light-black text-base font-semibold'>Not Eligible</p>
                </div>
              </div>
              <div className='col-span-3 border border-Light-Grey rounded-ee-xl'>
                
              </div>
             
            </Grid>
          </div>
          <div>
            <Grid className='bg-light-black !gap-2 !grid-cols-9 rounded-t-xl'>
              <div className='col-span-2 self-center text-center bg-contract bg-cover bg-right bg-no-repeat rounded-ss-xl'>
                <p className='text-white py-2 font-Regular'>Contract ID :  <b> 861910 </b></p>
              </div>
              <div className='col-span-6'>
              </div>
              
              <div className='col-span-1 self-center justify-end'>
                {/* <img src={Edit} className='ml-auto mr-2' alt='edit' /> */}
              </div>
            </Grid>

            <Grid className='!gap-0 !grid-cols-5 bg-grayf9 mb-5'>
              <div className='col-span-1 border border-Light-Grey'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Manufacturer</p>
                  <p className='text-light-black text-base font-semibold'>Apple iPad</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Model</p>
                  <p className='text-light-black text-base font-semibold'>Apple iPad 5th Gen, 30GB</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Serial</p>
                  <p className='text-light-black text-base font-semibold'>GG7W212JHLF12</p>
                </div>
              </div>
              <div className='col-span-2 border border-Light-Grey'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Product Description</p>
                  <p className='text-light-black text-base font-semibold'>Laptops are designed to be portable computers.</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Retail Price</p>
                  <p className='text-light-black text-base font-semibold'>$182</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Condition</p>
                  <p className='text-light-black text-base font-semibold'>Used</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Coverage Start Date</p>
                  <p className='text-light-black text-base font-semibold'>11/09/2026</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Coverage End Date</p>
                  <p className='text-light-black text-base font-semibold'>09/11/2030</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Claim Amount</p>
                  <p className='text-light-black text-base font-semibold'>$18.00</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey rounded-es-xl	'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Status</p>
                  <p className='text-light-black text-base font-semibold'>Waiting</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Eligibility</p>
                  <p className='text-light-black text-base font-semibold'>Not Eligible</p>
                </div>
              </div>
              <div className='col-span-3 border border-Light-Grey rounded-ee-xl'>
                
              </div>
             
            </Grid>
          </div>

        </div>
      </div>
    </div>
    </>
  )
}

export default CustomerContracts