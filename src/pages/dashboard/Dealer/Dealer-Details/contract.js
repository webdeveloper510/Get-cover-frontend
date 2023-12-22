import React, { useState } from 'react'
import Button from '../../../../common/button'
import Grid from '../../../../common/grid'
import Input from '../../../../common/input'

// Media Includes 
import Search from '../../../../assets/images/icons/SearchIcon.svg';
import Edit from '../../../../assets/images/Dealer/EditIcon.svg';
import clearFilter from "../../../../assets/images/icons/Clear-Filter-Icon-White.svg";
function ContractList() {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };
  return (
    <>
      <div className='bg-white mt-6 border-[1px] border-[#D1D1D1] rounded-xl'>
      <Grid className='!p-[26px] !pt-[14px] !pb-0'>
              <div className='col-span-5 self-center'>
                <p className='text-xl font-semibold'>Contracts List</p>
              </div>
              <div className='col-span-7'>
                <div className='bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]'>
                  <Grid className='!grid-cols-11' >
                    <div className='col-span-3 self-center'>
                      <Input name='Name' type='text' className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]" label='' placeholder='Order ID' />
                    </div>
                    <div className='col-span-3 self-center'>
                      <Input name='Email' type='email'className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]" label='' placeholder='Dealer Order no.' />
                    </div>
                    <div className='col-span-3 self-center'>
                      <Input name='PhoneNo.' type='text'className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]" label='' placeholder='Customer Name' />
                    </div>
                    <div className='col-span-2 self-center flex justify-center'>
                    <Button
                        type="submit" className='!p-0 mr-2'>
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
            <Grid className='bg-[#333333] !gap-2 !grid-cols-9 rounded-t-xl'>
              <div className='col-span-2 self-center text-center bg-contract bg-cover bg-right bg-no-repeat rounded-ss-xl'>
                <p className='text-white py-2 font-Regular'>Contract ID :  <b> 861910 </b></p>
              </div>
              <div className='col-span-2 self-center text-center bg-contract bg-cover bg-right bg-no-repeat '>
                <p className='text-white py-2 font-Regular'>Manufacturer :  <b> Apple iPad  </b></p>
              </div>
              <div className='col-span-2 self-center text-center bg-contract bg-cover bg-right bg-no-repeat '>
                <p className='text-white py-2 font-Regular'>Product Name :  <b> MC-10554 </b></p>
              </div>
              <div className='col-span-2 self-center text-center bg-contract bg-cover bg-right bg-no-repeat '>
                <p className='text-white py-2 font-Regular'>Serial :  <b> GG7W212JHLF12 </b></p>
              </div>
              <div className='col-span-1 self-center justify-end'>
                <img src={Edit} className='ml-auto mr-2' alt='edit' />
              </div>
            </Grid>

            <Grid className='!gap-0 bg-[#F9F9F9] mb-5'>
              <div className='col-span-3 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>MHHC WS Order</p>
                  <p className='text-[#333333] text-base font-semibold'>315174</p>
                </div>
              </div>
              <div className='col-span-3 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Model</p>
                  <p className='text-[#333333] text-base font-semibold'>Apple iPad 5th Gen, 30GB</p>
                </div>
              </div>
              <div className='col-span-3 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Servicer Name</p>
                  <p className='text-[#333333] text-base font-semibold'>Jameson Wills</p>
                </div>
              </div>
              <div className='col-span-3 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Customer Name</p>
                  <p className='text-[#333333] text-base font-semibold'>Ankush Grover</p>
                </div>
              </div>
              <div className='col-span-3 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Dealer P.O.</p>
                  <p className='text-[#333333] text-base font-semibold'>QAZWSX</p>
                </div>
              </div>
              <div className='col-span-3 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Coverage Start Date</p>
                  <p className='text-[#333333] text-base font-semibold'>11/09/2026</p>
                </div>
              </div>
              <div className='col-span-6 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Coverage End Date</p>
                  <p className='text-[#333333] text-base font-semibold'>09/11/2030</p>
                </div>
              </div>
              <div className='col-span-12 border rounded-b-xl	 border-[#D1D1D1]'>
                <Grid className=''>
                <div className='col-span-7 py-4 pl-3'>
                  <p className='text-[#333333] text-base font-Regular'>Retail Price : <span className='font-semibold'> $182 </span></p>
                  <p className='text-[#333333] text-base font-Regular'>Condition :   <span className='font-semibold'> Used </span></p>
                  <p className='text-[#333333] text-base font-Regular'>Claim Amount :  <span className='font-semibold'> $18.00  </span></p>
                </div>
                <div className='col-span-5 self-center'>
                    <Grid>
                      <div className='col-span-6'>
                        <div className=''>
                          <p className='text-base font-Regular'> Status :  <b> Waiting </b> </p> 
                        </div>
                        <div ></div>
                      </div>
                      <div className='col-span-6'>
                        <div className=''>
                          <p className='text-base font-Regular'>Eligibility : <b> Not Eligible </b></p>
                        </div>
                      </div>
                    </Grid>
                </div>
                </Grid>
               
              </div>
            </Grid>

            <Grid className='bg-[#333333] !gap-2 !grid-cols-9 rounded-t-xl'>
              <div className='col-span-2 self-center text-center bg-contract bg-cover bg-right bg-no-repeat rounded-ss-xl'>
                <p className='text-white py-2 font-Regular'>Contract ID :  <b> 861910 </b></p>
              </div>
              <div className='col-span-2 self-center text-center bg-contract bg-cover bg-right bg-no-repeat '>
                <p className='text-white py-2 font-Regular'>Manufacturer :  <b> Apple iPad  </b></p>
              </div>
              <div className='col-span-2 self-center text-center bg-contract bg-cover bg-right bg-no-repeat '>
                <p className='text-white py-2 font-Regular'>Product Name :  <b> MC-10554 </b></p>
              </div>
              <div className='col-span-2 self-center text-center bg-contract bg-cover bg-right bg-no-repeat '>
                <p className='text-white py-2 font-Regular'>Serial :  <b> GG7W212JHLF12 </b></p>
              </div>
              <div className='col-span-1 self-center justify-end'>
                <img src={Edit} className='ml-auto mr-2' alt='edit' />
              </div>
            </Grid>
            <Grid className='!gap-0 bg-[#F9F9F9] mb-5'>
              <div className='col-span-3 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>MHHC WS Order</p>
                  <p className='text-[#333333] text-base font-semibold'>315174</p>
                </div>
              </div>
              <div className='col-span-3 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Model</p>
                  <p className='text-[#333333] text-base font-semibold'>Apple iPad 5th Gen, 30GB</p>
                </div>
              </div>
              <div className='col-span-3 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Servicer Name</p>
                  <p className='text-[#333333] text-base font-semibold'>Jameson Wills</p>
                </div>
              </div>
              <div className='col-span-3 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Customer Name</p>
                  <p className='text-[#333333] text-base font-semibold'>Ankush Grover</p>
                </div>
              </div>
              <div className='col-span-3 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Dealer P.O.</p>
                  <p className='text-[#333333] text-base font-semibold'>QAZWSX</p>
                </div>
              </div>
              <div className='col-span-3 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Coverage Start Date</p>
                  <p className='text-[#333333] text-base font-semibold'>11/09/2026</p>
                </div>
              </div>
              <div className='col-span-6 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Coverage End Date</p>
                  <p className='text-[#333333] text-base font-semibold'>09/11/2030</p>
                </div>
              </div>
              <div className='col-span-12 border rounded-b-xl	 border-[#D1D1D1]'>
                <Grid className=''>
                <div className='col-span-7 py-4 pl-3'>
                  <p className='text-[#333333] text-base font-Regular'>Retail Price : <span className='font-semibold'> $182 </span></p>
                  <p className='text-[#333333] text-base font-Regular'>Condition :   <span className='font-semibold'> Used </span></p>
                  <p className='text-[#333333] text-base font-Regular'>Claim Amount :  <span className='font-semibold'> $18.00  </span></p>
                </div>
                <div className='col-span-5 self-center'>
                    <Grid>
                      <div className='col-span-6'>
                        <div className=''>
                          <p className='text-base font-Regular'> Status :  <b> Waiting </b> </p> 
                        </div>
                        <div ></div>
                      </div>
                      <div className='col-span-6'>
                        <div className=''>
                          <p className='text-base font-Regular'>Eligibility : <b> Not Eligible </b></p>
                        </div>
                      </div>
                    </Grid>
                </div>
                </Grid>
               
              </div>
            </Grid>

          </div>
        </div>
      </div>
    </>
  )
}

export default ContractList