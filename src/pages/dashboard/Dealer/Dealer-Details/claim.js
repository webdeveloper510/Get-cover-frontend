import React, { useState } from 'react'
import Button from '../../../../common/button'
import Grid from '../../../../common/grid'
import Input from '../../../../common/input'

// Media Includes 
import Search from '../../../../assets/images/icons/SearchIcon.svg';
import Edit from '../../../../assets/images/Dealer/EditIcon.svg';
import chat from '../../../../assets/images/Dealer/chatIcon.svg';
import clearFilter from "../../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import Select from '../../../../common/select';
function ClaimList() {
  const [selectedValue, setSelectedValue] = useState('');

  const handleSelectChange = (label, value) => {
    setSelectedValue(value);
  };

  const options = [
    { label: 'City', value: 'city' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  return (
    <>
      <div className='bg-white mt-6 border-[1px] border-[#D1D1D1] rounded-xl'>
        <Grid className='!p-[26px] !pt-[14px] !pb-0'>
          <div className='col-span-5 self-center'>
            <p className='text-xl font-semibold'>Claims List</p>
          </div>
          <div className='col-span-7'>
            <div className='bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]'>
              <Grid className='!grid-cols-11' >
                <div className='col-span-3 self-center'>
                  <Input name='Name' type='text' className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]" label='' placeholder='Contract ID' />
                </div>
                <div className='col-span-3 self-center'>
                  <Input name='Email' type='email' className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]" label='' placeholder='Claim' />
                </div>
                <div className='col-span-3 self-center'>
                  <Input name='PhoneNo.' type='text' className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]" label='' placeholder='Servicer Name' />
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

        <div className=' px-3 mt-5'>
          <div>
            <Grid className='bg-[#333333] !gap-2 rounded-t-xl'>
              <div className='col-span-3 self-center text-center bg-contract bg-cover bg-right bg-no-repeat rounded-ss-xl'>
                <p className='text-white py-2 font-Regular'>Claim :  <b> 861910 </b></p>
              </div>
              <div className='col-span-3 self-center text-center bg-contract bg-cover bg-right bg-no-repeat '>
                <p className='text-white py-2 font-Regular'>Contract ID :  <b> DFDSS1ghdf  </b></p>
              </div>
              <div className='col-span-3 self-center text-center bg-contract bg-cover bg-right bg-no-repeat '>
                <p className='text-white py-2 font-Regular'>Diagnosis : <b> sdaf </b></p>
              </div>
              <div className='col-span-3 self-center justify-end flex'>
                <img src={chat} className='ml-auto mr-2' alt='chat' />
                <img src={Edit} className=' mr-2' alt='edit' />
              </div>
            </Grid>

            <Grid className='!gap-0 bg-[#F9F9F9] mb-5'>
              <div className='col-span-3 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Product Name</p>
                  <p className='text-[#333333] text-base font-semibold'>Mac Book Air</p>
                </div>
              </div>
              <div className='col-span-3 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Product Manufacturer</p>
                  <p className='text-[#333333] text-base font-semibold'>Apple</p>
                </div>
              </div>
              <div className='col-span-3 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Product Model</p>
                  <p className='text-[#333333] text-base font-semibold'>Apple Mac Book Air 2nd Gen, 256 GB</p>
                </div>
              </div>
              <div className='col-span-3 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Product Serial</p>
                  <p className='text-[#333333] text-base font-semibold'>GG7W212JHLF10</p>
                </div>
              </div>
              <div className='col-span-3 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Service Type</p>
                  <p className='text-[#333333] text-base font-semibold'>Shipping, Labor</p>
                </div>
              </div>
              <div className='col-span-6 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Description</p>
                    <p className='text-[#333333] text-base font-semibold'>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate
                    form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used placeholder before final copy is available.</p>
                </div>
              </div>
              <div className='col-span-3 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Price($)</p>
                  <p className='text-[#333333] text-base font-semibold'>$18.00</p>
                </div>
              </div>
              <div className='col-span-12 border rounded-b-xl	 border-[#D1D1D1]'>
                <Grid className=''>
                <div className='col-span-3 py-4 pl-3'>
                  <p className='text-[#333333] text-sm font-Regular'>Customer Name : <span className='font-semibold'> Ankush Grover </span></p>
                  <p className='text-[#333333] text-sm font-Regular'>Servicer Name :   <span className='font-semibold'> Jameson Wills </span></p>
                  <p className='text-[#333333] text-sm font-Regular'>Claim Cost :  <span className='font-semibold'> $18.00  </span></p>
                </div>
                <div className='col-span-3 self-center'>
                  <p className='text-[#1B1D21] text-[11px] font-Regular'>Customer Status <span className='text-[#8d8e90]'>(Updated on: 16 Dec 2024)</span></p>
                  <Select label=""
                            options={options}
                            className1='!py-1'
                            selectedValue={selectedValue}
                            onChange={handleSelectChange}/>
                </div>
                <div className='col-span-3 self-center'>
                <p className='text-[#1B1D21] text-[11px] font-Regular'>Claim Status <span className='text-[#8d8e90]'>(Updated on: 16 Dec 2024)</span></p>
                <Select label=""
                            options={options}
                            className1='!py-1'
                            selectedValue={selectedValue}
                            onChange={handleSelectChange}/>
                </div>
                <div className='col-span-3 self-center'>
                <p className='text-[#1B1D21] text-[11px] font-Regular'>Repair Status <span className='text-[#8d8e90]'>(Updated on: 16 Dec 2024)</span></p>
                <Select label=""
                            options={options}
                            className1='!py-1'
                            selectedValue={selectedValue}
                            onChange={handleSelectChange}/>
                </div>
                </Grid>
               
              </div>
            </Grid>

            <Grid className='bg-[#333333] !gap-2 rounded-t-xl'>
              <div className='col-span-3 self-center text-center bg-contract bg-cover bg-right bg-no-repeat rounded-ss-xl'>
                <p className='text-white py-2 font-Regular'>Claim :  <b> 861910 </b></p>
              </div>
              <div className='col-span-3 self-center text-center bg-contract bg-cover bg-right bg-no-repeat '>
                <p className='text-white py-2 font-Regular'>Contract ID :  <b> DFDSS1ghdf  </b></p>
              </div>
              <div className='col-span-3 self-center text-center bg-contract bg-cover bg-right bg-no-repeat '>
                <p className='text-white py-2 font-Regular'>Diagnosis : <b> sdaf </b></p>
              </div>
              <div className='col-span-3 self-center justify-end flex'>
                <img src={chat} className='ml-auto mr-2' alt='chat' />
                <img src={Edit} className=' mr-2' alt='edit' />
              </div>
            </Grid>

            <Grid className='!gap-0 bg-[#F9F9F9] mb-5 rounded-b-xl'>
              <div className='col-span-3 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Product Name</p>
                  <p className='text-[#333333] text-base font-semibold'>Mac Book Air</p>
                </div>
              </div>
              <div className='col-span-3 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Product Manufacturer</p>
                  <p className='text-[#333333] text-base font-semibold'>Apple</p>
                </div>
              </div>
              <div className='col-span-3 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Product Model</p>
                  <p className='text-[#333333] text-base font-semibold'>Apple Mac Book Air 2nd Gen, 256 GB</p>
                </div>
              </div>
              <div className='col-span-3 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Product Serial</p>
                  <p className='text-[#333333] text-base font-semibold'>GG7W212JHLF10</p>
                </div>
              </div>
              <div className='col-span-3 border border-[#D1D1D1] rounded-es-xl'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Service Type</p>
                  <p className='text-[#333333] text-base font-semibold'>Shipping, Labor</p>
                </div>
              </div>
              <div className='col-span-6 border border-[#D1D1D1]'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Description</p>
                    <p className='text-[#333333] text-base font-semibold'>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate
                    form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used placeholder before final copy is available.</p>
                </div>
              </div>
              <div className='col-span-3 border border-[#D1D1D1] rounded-br-xl'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Price($)</p>
                  <p className='text-[#333333] text-base font-semibold'>$18.00</p>
                </div>
              </div>
            </Grid>

          </div>
        </div>
      </div>
    </>
  )
}


export default ClaimList