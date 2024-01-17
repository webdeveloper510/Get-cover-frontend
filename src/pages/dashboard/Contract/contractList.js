import React, { useState } from 'react'
import Button from '../../../common/button'
import Grid from '../../../common/grid'
import Input from '../../../common/input'

// Media Includes 
import Search from '../../../assets/images/icons/SearchIcon.svg';
import AddItem from "../../../assets/images/icons/addItem.svg";
import Cross from "../../../assets/images/Cross.png";
import Edit from '../../../assets/images/Dealer/EditIcon.svg';
import clearFilter from "../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import Headbar from '../../../common/headBar';
import { Link } from 'react-router-dom';
import Modal from '../../../common/model';
import Select from '../../../common/select';
function ContractList() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDisapprovedOpen, setIsDisapprovedOpen] = useState(false);

  const closeDisapproved = () => {
    setIsDisapprovedOpen(false);
  };

  const openDisapproved = () => {
    setIsDisapprovedOpen(true);
  };

  const status = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];
  return (
    <>
          <div className="my-8 ml-3">
        <Headbar />

        <div className="flex mt-2">
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9	mb-[3px]">Contracts</p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/"}>Contracts  /</Link>{" "}
              </li>
              <li className="text-sm text-neutral-grey font-semibold ml-1">
              Contracts List
            </li>
            </ul>
          </div>
        </div>

      <div className='bg-white mt-6 border-[1px] border-[#D1D1D1] rounded-xl'>
           <Grid className='!p-[26px] !pt-[14px] !pb-0'>
              <div className='col-span-4 self-center'>
                <p className='text-xl font-semibold'>Contracts List</p>
              </div>
              <div className='col-span-8'>
                <div className='bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]'>
                  <Grid className='!grid-cols-9' >
                    <div className='col-span-2 self-center'>
                      <Input name='Name' type='text' className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]" label='' placeholder='Contract ID' />
                    </div>
                    <div className='col-span-2 self-center'>
                      <Input name='Email' type='text'className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]" label='' placeholder=' Order ID' />
                    </div>
                    <div className='col-span-2 self-center'>
                      <Input name='PhoneNo.' type='text'className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]" label='' placeholder='Dealer P.O. No.' />
                    </div>
                    <div className='col-span-1 self-center flex justify-center'>
                    <Button
                        type="submit" className='!p-0'>
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
                    <div className='col-span-2 self-center'>
                     <Button className='!text-sm' onClick={()=> openDisapproved()}>Advance Search</Button>
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
              <Link to={'/editContract'}> <img src={Edit} className='ml-auto mr-2' alt='edit' /> </Link>
              </div>
            </Grid>

            <Grid className='!gap-0 bg-[#F9F9F9] mb-5'>
              <div className='col-span-3 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>GetCover WS Order</p>
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
               <Link to={'/editContract'}> <img src={Edit} className='ml-auto mr-2' alt='edit' /> </Link>
              </div>
            </Grid>
            <Grid className='!gap-0 bg-[#F9F9F9] mb-5'>
              <div className='col-span-3 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>GetCover WS Order</p>
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

        <Modal isOpen={isDisapprovedOpen} onClose={closeDisapproved}>
          <Button onClick={closeDisapproved} className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]">
          <img src={Cross} className="w-full h-full text-black rounded-full p-0" />
        </Button>
          <div className="py-3">
            <p className='text-center text-3xl font-semibold '>
            Advance Search
            </p>
           <Grid className='mt-5 px-6'>
            <div className='col-span-6'>
               <Input type='text' 
                         name="Contract ID"
                        className="!bg-[#fff]"
                        label="Contract ID"
                        placeholder="" />
            </div>
            <div className='col-span-6'>
               <Input type='text' 
                         name="Order ID"
                        className="!bg-[#fff]"
                        label="Order ID"
                        placeholder="" />
            </div>
            <div className='col-span-6'>
               <Input type='text' 
                         name="Dealer P.O. No."
                        className="!bg-[#fff]"
                        label="Dealer P.O. No."
                        placeholder="" />
            </div>
            <div className='col-span-6'>
               <Input type='text' 
                         name="Serial No."
                        className="!bg-[#fff]"
                        label="Serial No."
                        placeholder="" />
            </div>
            <div className='col-span-6'>
               <Input type='text' 
                         name="Product Name"
                        className="!bg-[#fff]"
                        label="Product Name"
                        placeholder="" />
            </div>
            <div className='col-span-6'>
               <Input type='text' 
                         name="Customer Name"
                        className="!bg-[#fff]"
                        label="Customer Name"
                        placeholder="" />
            </div>
            <div className='col-span-6'>
               <Input type='text' 
                         name="Servicer Name"
                        className="!bg-[#fff]"
                        label="Servicer Name"
                        placeholder="" />
            </div>
            <div className='col-span-6'>
               <Input type='text' 
                         name="Dealer Name"
                        className="!bg-[#fff]"
                        label="Dealer Name"
                        placeholder="" />
            </div>
            <div className='col-span-6'>
            <Select
                        name="Status"
                        label="Status"
                        options={status}
                        className="!bg-[#fff]"
                        placeholder=""/>
            </div>
            <div className='col-span-6'>
            <Select
                        name="ClaimStatus"
                        label="Claim Status"
                        options={status}
                        className="!bg-[#fff]"
                        placeholder=""/>
            </div>
            <div className='col-span-12'>
             <Button className={'w-full'}>Search</Button>
            </div>
           </Grid>
          </div>
        </Modal>
      </div>
    </div>
    </>
  )
}

export default ContractList