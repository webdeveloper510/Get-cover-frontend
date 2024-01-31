import React, { useState } from 'react'
import Button from '../../../common/button'
import Grid from '../../../common/grid'
import Input from '../../../common/input'

// Media Includes 
import Search from '../../../assets/images/icons/SearchIcon.svg';
import productName from '../../../assets/images/icons/productName1.svg';
import attach from '../../../assets/images/Attachments.svg';
import AddItem from "../../../assets/images/icons/addItem.svg";
import model from '../../../assets/images/icons/ProductModel.svg';
import serial from '../../../assets/images/icons/ProductSerial.svg';
import Manufacturer from '../../../assets/images/icons/ProductManufacturer.svg';
import Edit from '../../../assets/images/icons/editIcon.svg';
import download from '../../../assets/images/download.png';
import Attachment from '../../../assets/images/attachment.png';
import chat from '../../../assets/images/icons/chatIcon.svg';
import DropActive from '../../../assets/images/icons/DropActive.svg';
import clearFilter from "../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import arrowImage from "../../../assets/images/dropdownArrow.png";
import upload from "../../../assets/images/icons/upload.svg";
import Select from '../../../common/select';
import Cross from "../../../assets/images/Cross.png";
import Headbar from '../../../common/headBar';
import { Link } from 'react-router-dom';
import Modal from '../../../common/model';
import CollapsibleDiv from '../../../common/collapsibleDiv';
function ServicerClaimList() {
  const [selectedValue, setSelectedValue] = useState('');
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAttachmentsOpen, setIsAttachmentsOpen] = useState(false);

  const closeEdit = () => {
    setIsEditOpen(false);
  };

  const openEdit = () => {
    setIsEditOpen(true);
  };
  const closeView = () => {
    setIsViewOpen(false);
  };

  const openAttachments = () => {
    setIsAttachmentsOpen(true);
  };
  const closeAttachments = () => {
    setIsAttachmentsOpen(false);
  };

  const openView = () => {
    setIsViewOpen(true);
  };
  const handleSelectChange = (label, value) => {
    setSelectedValue(value);
  };

  const CoverageStartDate = [
    { label: "11/09/2026", value: true },
    { label: "12/09/2026", value: false },
  ];

  return (
    <>
      <div className="my-8 ml-3">
        <Headbar />
        <div className="flex mt-2">
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9 mb-[3px]">
              Claim
            </p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/"}>Claim </Link>{" "}
                <span className="mx-2"> /</span>
              </li>
              <li className="text-sm text-neutral-grey font-semibold ml-1">
                {" "}
                Claim Listing
              </li>
            </ul>
          </div>
        </div>

        <Link
          to={"/addClaim"}
          className=" w-[150px] !bg-white font-semibold py-2 px-4 ml-auto flex self-center mb-3 rounded-xl ml-auto border-[1px] border-[#D1D1D1]"
        >
          {" "}
          <img src={AddItem} className="self-center" alt="AddItem" />{" "}
          <span className="text-black ml-3 text-[14px] font-Regular">
            Add Claim{" "}
          </span>{" "}
        </Link>

        <div className='bg-white my-8 border-[1px] border-[#D1D1D1] rounded-xl'>
          
          <Grid className='!p-[26px] !pt-[14px] !pb-0'>
            <div className='col-span-2 self-center'>
              <p className='text-xl font-semibold'>Claims List</p>
            </div>
            <div className='col-span-10'>
              <div className='bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]'>
                <Grid className='' >
                  <div className='col-span-8'>
                    <Grid className='' >
                      <div className='col-span-3 self-center'>
                        <Input name='Name' type='text' className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]" label='' placeholder='Contract ID' />
                      </div>
                      <div className='col-span-3 self-center'>
                        <Input name='Email' type='email' className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]" label='' placeholder='Claim' />
                      </div>
                      <div className='col-span-3 self-center'>
                        <Input name='PhoneNo.' type='text' className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]" label='' placeholder='Customer Status' />
                      </div>
                      <div className='col-span-3 self-center'>
                        <Input name='PhoneNo.' type='text' className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]" label='' placeholder='Repair Status' />
                      </div>

                    </Grid>

                  </div>

                  <div className='col-span-4 self-center flex justify-center'>
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
                    <Button
                      type="submit" className='ml-2 !text-sm'>
                      Advance Search
                    </Button>
                  </div>
                </Grid>
              </div>
            </div>
          </Grid>

          <div className=' px-3 mt-5'>

            <CollapsibleDiv title={ <> <Grid className='border-[#474747] border !gap-2 rounded-t-[22px]'>
                <div className='col-span-3 self-center border-[#474747] border-r rounded-ss-xl p-5'>
                  <p className='font-semibold leading-5 text-lg'> 861910  </p>
                  <p className='text-[#A3A3A3]'>Claim ID</p>
                </div>
                <div className='col-span-3 self-center border-[#474747] border-r p-5'>
                  <p className='font-semibold leading-5 text-lg'> DFDSS1ghdf  </p>
                  <p className='text-[#A3A3A3]'>Contract ID</p>
                </div>
                <div className='col-span-3 self-center border-[#474747] border-r p-5'>
                  <p className='font-semibold leading-5 text-lg'> 12 Dec 2023  </p>
                  <p className='text-[#A3A3A3]'>Loss Date</p>
                </div>
                <div className='col-span-3 self-center justify-center flex relative'>
                  <img src={chat} className=' mr-2 cursor-pointer' onClick={()=>openView()} alt='chat' />
               
                </div>
              </Grid>
            <Grid className='!gap-0 bg-[#F9F9F9] border-[#474747] border-x'>
            <div className='col-span-2 flex '>
              <img src={productName} className='self-center h-[50px] w-[50px] ml-3' alt='productName' />
              <div className='py-4 pl-3 self-center'>
                <p className='text-[#5D6E66] text-[11px] font-Regular'>Product Name</p>
                <p className='text-[#333333] text-sm font-semibold'>Mac Book Air</p>
              </div>
            </div>
            <div className='col-span-3 flex'>
              <img src={Manufacturer} className='self-center h-[50px] w-[50px] ml-3' alt='' />
              <div className='py-4 pl-3 self-center'>
                <p className='text-[#5D6E66] text-[11px] font-Regular'>Product Manufacturer</p>
                <p className='text-[#333333] text-sm font-semibold'>Apple</p>
              </div>
            </div>
            <div className='col-span-4 flex'>
              <img src={model} className='self-center h-[50px] w-[50px] ml-3' alt='' />
              <div className='py-4 pl-3 self-center'>
                <p className='text-[#5D6E66] text-[11px] font-Regular'>Product Model</p>
                <p className='text-[#333333] text-sm font-semibold'>Apple Mac Book Air 2nd Gen, 256 GB</p>
              </div>
            </div>
            <div className='col-span-3 flex'>
              <img src={serial} className='self-center h-[50px] w-[50px] ml-3' alt='' />
              <div className='py-4 pl-3 self-center'>
                <p className='text-[#5D6E66] text-[11px] font-Regular'>Product Serial</p>
                <p className='text-[#333333] text-sm font-semibold'>GG7W212JHLF10</p>
              </div>
            </div>
          </Grid> </>}>

              
              <Grid className='!gap-0 bg-[#333333] rounded-b-[22px] mb-5 border-[#474747] border-x'>
                <div className='col-span-2 bg-[#333333] border-r border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Service Type</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>Shipping, Labor</p>
                  </div>
                </div>
                <div className='col-span-8 bg-[#333333] border-r border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Description</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate
                      form of a document or a typeface without relying on meaningful content.</p>
                  </div>
                </div>
                <div className='col-span-2 bg-[#333333] border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Price($)</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>$18.00</p>
                  </div>
                </div>
                <div className='col-span-2 bg-[#333333] border-r border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Service Type</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>Shipping, Labor</p>
                  </div>
                </div>
                <div className='col-span-8 bg-[#333333] border-r border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Description</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate
                      form of a document or a typeface without relying on meaningful content.</p>
                  </div>
                </div>
                <div className='col-span-2 bg-[#333333] border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Price($)</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>$18.00</p>
                  </div>
                </div>
                <div className='col-span-2 bg-[#333333] border-r border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Service Type</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>Shipping, Labor</p>
                  </div>
                </div>
                <div className='col-span-8 bg-[#333333] border-r border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Description</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate
                      form of a document or a typeface without relying on meaningful content.</p>
                  </div>
                </div>
                <div className='col-span-2 bg-[#333333] border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Price($)</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>$18.00</p>
                  </div>
                </div>
                <div className='col-span-12 '>
                  <Grid className=''>
                    <div className='col-span-3 py-4 pl-1 '>
                      <div className='bg-[#3C3C3C] py-4 px-2'>
                        <p className='text-[#999999] mb-3 text-[11px] font-Regular '>Customer Name : <span className='font-semibold text-white'> Ankush Grover </span></p>
                        <p className='text-[#999999] mb-3 text-[11px] font-Regular'>Servicer Name :   <span className='font-semibold text-white'> Jameson Wills </span></p>
                        <p className='text-[#999999] text-[11px] font-Regular'>Claim Cost :  <span className='font-semibold text-white'> $18.00  </span></p>
                      </div>
                    </div>
                    <div className='col-span-4 self-center'>
                      <div className='border border-[#FFFFFF1A] mb-2 p-1 rounded-lg flex w-full'>
                        <div className='bg-[#474747] w-[40%] rounded-s-lg'>
                          <p className='text-white text-[11px] p-4'>Customer Status</p>
                        </div>
                        <div className='pl-1 self-center'>
                          <p className='text-white text-sm'>Shipping Label received</p>
                          <p className='text-[#686868]'>16 Dec 2024</p>
                        </div>
                        <div className='self-center ml-auto mr-2'>
                          <img src={DropActive} alt='DropActive' />
                        </div>
                      </div>
                      <div className='border border-[#FFFFFF1A] mb-2 p-1 rounded-lg flex w-full'>
                        <div className='bg-[#474747] w-[40%] rounded-s-lg'>
                          <p className='text-white text-[11px] p-4'>Claim Status</p>
                        </div>
                        <div className='pl-1 self-center'>
                          <p className='text-white text-sm'>Open</p>
                          <p className='text-[#686868]'>16 Dec 2024</p>
                        </div>
                        <div className='self-center ml-auto mr-2'>
                          <img src={DropActive} alt='DropActive' />
                        </div>
                      </div>
                      <div className='border border-[#FFFFFF1A] p-1 rounded-lg flex w-full'>
                        <div className='bg-[#474747] w-[40%] rounded-s-lg'>
                          <p className='text-white text-[11px] p-4'>Repair Status</p>
                        </div>
                        <div className='pl-1'>
                          <p className='text-white text-sm'>Parts Needed</p>
                          <p className='text-[#686868]'>16 Dec 2024</p>
                        </div>
                        <div className='self-center ml-auto mr-2'>
                          <img src={DropActive} alt='DropActive' />
                        </div>
                      </div>
                    </div>
                    <div className='col-span-3 self-center'>
                      <div className='m-2 p-2 bg-[#3C3C3C]'>
                        <p className='text-[11px] text-white'>Diagnosis</p>
                        <p className='text-sm text-[#686868]'>In publishing and graphic design, Lorem ipsum is a
                          placeholder. In publishing and graphic design, Lorem ipsum
                          is a placeholder. In publishing and graphic design, Lorem ipsum is a placeholder. In publishing and graphic design</p>
                      </div>
                    </div>
                    <div className='col-span-2 self-center'>
                     <div onClick={() => openAttachments()}> <img src={attach} alt='attach' /> </div> 
                    </div>
                  </Grid>
                </div>
              </Grid>
            </CollapsibleDiv>

            <CollapsibleDiv title={ <> <Grid className='border-[#474747] border !gap-2 rounded-t-[22px]'>
                <div className='col-span-3 self-center border-[#474747] border-r rounded-ss-xl p-5'>
                  <p className='font-semibold leading-5 text-lg'> 861910  </p>
                  <p className='text-[#A3A3A3]'>Claim ID</p>
                </div>
                <div className='col-span-3 self-center border-[#474747] border-r p-5'>
                  <p className='font-semibold leading-5 text-lg'> DFDSS1ghdf  </p>
                  <p className='text-[#A3A3A3]'>Contract ID</p>
                </div>
                <div className='col-span-3 self-center border-[#474747] border-r p-5'>
                  <p className='font-semibold leading-5 text-lg'> 12 Dec 2023  </p>
                  <p className='text-[#A3A3A3]'>Loss Date</p>
                </div>
                <div className='col-span-3 self-center justify-center flex relative'>
                  <img src={chat} className=' mr-2 cursor-pointer' onClick={()=>openView()} alt='chat' />
                 
                </div>
              </Grid>
            <Grid className='!gap-0 bg-[#F9F9F9] border-[#474747] border-x'>
            <div className='col-span-2 flex '>
              <img src={productName} className='self-center h-[50px] w-[50px] ml-3' alt='productName' />
              <div className='py-4 pl-3 self-center'>
                <p className='text-[#5D6E66] text-[11px] font-Regular'>Product Name</p>
                <p className='text-[#333333] text-sm font-semibold'>Mac Book Air</p>
              </div>
            </div>
            <div className='col-span-3 flex'>
              <img src={Manufacturer} className='self-center h-[50px] w-[50px] ml-3' alt='' />
              <div className='py-4 pl-3 self-center'>
                <p className='text-[#5D6E66] text-[11px] font-Regular'>Product Manufacturer</p>
                <p className='text-[#333333] text-sm font-semibold'>Apple</p>
              </div>
            </div>
            <div className='col-span-4 flex'>
              <img src={model} className='self-center h-[50px] w-[50px] ml-3' alt='' />
              <div className='py-4 pl-3 self-center'>
                <p className='text-[#5D6E66] text-[11px] font-Regular'>Product Model</p>
                <p className='text-[#333333] text-sm font-semibold'>Apple Mac Book Air 2nd Gen, 256 GB</p>
              </div>
            </div>
            <div className='col-span-3 flex'>
              <img src={serial} className='self-center h-[50px] w-[50px] ml-3' alt='' />
              <div className='py-4 pl-3 self-center'>
                <p className='text-[#5D6E66] text-[11px] font-Regular'>Product Serial</p>
                <p className='text-[#333333] text-sm font-semibold'>GG7W212JHLF10</p>
              </div>
            </div>
          </Grid> </>}>

              
              <Grid className='!gap-0 bg-[#333333] rounded-b-[22px] mb-5 border-[#474747] border-x'>
                <div className='col-span-2 bg-[#333333] border-r border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Service Type</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>Shipping, Labor</p>
                  </div>
                </div>
                <div className='col-span-8 bg-[#333333] border-r border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Description</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate
                      form of a document or a typeface without relying on meaningful content.</p>
                  </div>
                </div>
                <div className='col-span-2 bg-[#333333] border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Price($)</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>$18.00</p>
                  </div>
                </div>
                <div className='col-span-2 bg-[#333333] border-r border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Service Type</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>Shipping, Labor</p>
                  </div>
                </div>
                <div className='col-span-8 bg-[#333333] border-r border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Description</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate
                      form of a document or a typeface without relying on meaningful content.</p>
                  </div>
                </div>
                <div className='col-span-2 bg-[#333333] border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Price($)</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>$18.00</p>
                  </div>
                </div>
                <div className='col-span-2 bg-[#333333] border-r border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Service Type</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>Shipping, Labor</p>
                  </div>
                </div>
                <div className='col-span-8 bg-[#333333] border-r border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Description</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate
                      form of a document or a typeface without relying on meaningful content.</p>
                  </div>
                </div>
                <div className='col-span-2 bg-[#333333] border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Price($)</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>$18.00</p>
                  </div>
                </div>
                <div className='col-span-12 '>
                  <Grid className=''>
                    <div className='col-span-3 py-4 pl-1 '>
                      <div className='bg-[#3C3C3C] py-4 px-2'>
                        <p className='text-[#999999] mb-3 text-[11px] font-Regular '>Customer Name : <span className='font-semibold text-white'> Ankush Grover </span></p>
                        <p className='text-[#999999] mb-3 text-[11px] font-Regular'>Servicer Name :   <span className='font-semibold text-white'> Jameson Wills </span></p>
                        <p className='text-[#999999] text-[11px] font-Regular'>Claim Cost :  <span className='font-semibold text-white'> $18.00  </span></p>
                      </div>
                    </div>
                    <div className='col-span-4 self-center'>
                      <div className='border border-[#FFFFFF1A] mb-2 p-1 rounded-lg flex w-full'>
                        <div className='bg-[#474747] w-[40%] rounded-s-lg'>
                          <p className='text-white text-[11px] p-4'>Customer Status</p>
                        </div>
                        <div className='pl-1 self-center'>
                          <p className='text-white text-sm'>Shipping Label received</p>
                          <p className='text-[#686868]'>16 Dec 2024</p>
                        </div>
                        <div className='self-center ml-auto mr-2'>
                          <img src={DropActive} alt='DropActive' />
                        </div>
                      </div>
                      <div className='border border-[#FFFFFF1A] mb-2 p-1 rounded-lg flex w-full'>
                        <div className='bg-[#474747] w-[40%] rounded-s-lg'>
                          <p className='text-white text-[11px] p-4'>Claim Status</p>
                        </div>
                        <div className='pl-1 self-center'>
                          <p className='text-white text-sm'>Open</p>
                          <p className='text-[#686868]'>16 Dec 2024</p>
                        </div>
                        <div className='self-center ml-auto mr-2'>
                          <img src={DropActive} alt='DropActive' />
                        </div>
                      </div>
                      <div className='border border-[#FFFFFF1A] p-1 rounded-lg flex w-full'>
                        <div className='bg-[#474747] w-[40%] rounded-s-lg'>
                          <p className='text-white text-[11px] p-4'>Repair Status</p>
                        </div>
                        <div className='pl-1'>
                          <p className='text-white text-sm'>Parts Needed</p>
                          <p className='text-[#686868]'>16 Dec 2024</p>
                        </div>
                        <div className='self-center ml-auto mr-2'>
                          <img src={DropActive} alt='DropActive' />
                        </div>
                      </div>
                    </div>
                    <div className='col-span-3 self-center'>
                      <div className='m-2 p-2 bg-[#3C3C3C]'>
                        <p className='text-[11px] text-white'>Diagnosis</p>
                        <p className='text-sm text-[#686868]'>In publishing and graphic design, Lorem ipsum is a
                          placeholder. In publishing and graphic design, Lorem ipsum
                          is a placeholder. In publishing and graphic design, Lorem ipsum is a placeholder. In publishing and graphic design</p>
                      </div>
                    </div>
                    <div className='col-span-2 self-center'>
                      <div onClick={() => openAttachments()}> <img src={attach} alt='attach' /> </div> 
                    </div>
                  </Grid>
                </div>
              </Grid>
            </CollapsibleDiv>

            <CollapsibleDiv title={ <> <Grid className='border-[#474747] border !gap-2 rounded-t-[22px]'>
                <div className='col-span-3 self-center border-[#474747] border-r rounded-ss-xl p-5'>
                  <p className='font-semibold leading-5 text-lg'> 861910  </p>
                  <p className='text-[#A3A3A3]'>Claim ID</p>
                </div>
                <div className='col-span-3 self-center border-[#474747] border-r p-5'>
                  <p className='font-semibold leading-5 text-lg'> DFDSS1ghdf  </p>
                  <p className='text-[#A3A3A3]'>Contract ID</p>
                </div>
                <div className='col-span-3 self-center border-[#474747] border-r p-5'>
                  <p className='font-semibold leading-5 text-lg'> 12 Dec 2023  </p>
                  <p className='text-[#A3A3A3]'>Loss Date</p>
                </div>
                <div className='col-span-3 self-center justify-center flex relative'>
                  <img src={chat} className=' mr-2 cursor-pointer' onClick={()=>openView()} alt='chat' />
                 
                </div>
              </Grid>
            <Grid className='!gap-0 bg-[#F9F9F9] border-[#474747] border-x'>
            <div className='col-span-2 flex '>
              <img src={productName} className='self-center h-[50px] w-[50px] ml-3' alt='productName' />
              <div className='py-4 pl-3 self-center'>
                <p className='text-[#5D6E66] text-[11px] font-Regular'>Product Name</p>
                <p className='text-[#333333] text-sm font-semibold'>Mac Book Air</p>
              </div>
            </div>
            <div className='col-span-3 flex'>
              <img src={Manufacturer} className='self-center h-[50px] w-[50px] ml-3' alt='' />
              <div className='py-4 pl-3 self-center'>
                <p className='text-[#5D6E66] text-[11px] font-Regular'>Product Manufacturer</p>
                <p className='text-[#333333] text-sm font-semibold'>Apple</p>
              </div>
            </div>
            <div className='col-span-4 flex'>
              <img src={model} className='self-center h-[50px] w-[50px] ml-3' alt='' />
              <div className='py-4 pl-3 self-center'>
                <p className='text-[#5D6E66] text-[11px] font-Regular'>Product Model</p>
                <p className='text-[#333333] text-sm font-semibold'>Apple Mac Book Air 2nd Gen, 256 GB</p>
              </div>
            </div>
            <div className='col-span-3 flex'>
              <img src={serial} className='self-center h-[50px] w-[50px] ml-3' alt='' />
              <div className='py-4 pl-3 self-center'>
                <p className='text-[#5D6E66] text-[11px] font-Regular'>Product Serial</p>
                <p className='text-[#333333] text-sm font-semibold'>GG7W212JHLF10</p>
              </div>
            </div>
          </Grid> </>}>

              
              <Grid className='!gap-0 bg-[#333333] rounded-b-[22px] mb-5 border-[#474747] border-x'>
                <div className='col-span-2 bg-[#333333] border-r border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Service Type</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>Shipping, Labor</p>
                  </div>
                </div>
                <div className='col-span-8 bg-[#333333] border-r border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Description</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate
                      form of a document or a typeface without relying on meaningful content.</p>
                  </div>
                </div>
                <div className='col-span-2 bg-[#333333] border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Price($)</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>$18.00</p>
                  </div>
                </div>
                <div className='col-span-2 bg-[#333333] border-r border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Service Type</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>Shipping, Labor</p>
                  </div>
                </div>
                <div className='col-span-8 bg-[#333333] border-r border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Description</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate
                      form of a document or a typeface without relying on meaningful content.</p>
                  </div>
                </div>
                <div className='col-span-2 bg-[#333333] border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Price($)</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>$18.00</p>
                  </div>
                </div>
                <div className='col-span-2 bg-[#333333] border-r border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Service Type</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>Shipping, Labor</p>
                  </div>
                </div>
                <div className='col-span-8 bg-[#333333] border-r border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Description</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate
                      form of a document or a typeface without relying on meaningful content.</p>
                  </div>
                </div>
                <div className='col-span-2 bg-[#333333] border-b border-[#474747]'>
                  <div className='py-4 pl-3'>
                    <p className='text-[#fff] text-sm font-Regular'>Price($)</p>
                    <p className='text-[#5D6E66] text-base font-semibold'>$18.00</p>
                  </div>
                </div>
                <div className='col-span-12 '>
                  <Grid className=''>
                    <div className='col-span-3 py-4 pl-1 '>
                      <div className='bg-[#3C3C3C] py-4 px-2'>
                        <p className='text-[#999999] mb-3 text-[11px] font-Regular '>Customer Name : <span className='font-semibold text-white'> Ankush Grover </span></p>
                        <p className='text-[#999999] mb-3 text-[11px] font-Regular'>Servicer Name :   <span className='font-semibold text-white'> Jameson Wills </span></p>
                        <p className='text-[#999999] text-[11px] font-Regular'>Claim Cost :  <span className='font-semibold text-white'> $18.00  </span></p>
                      </div>
                    </div>
                    <div className='col-span-4 self-center'>
                      <div className='border border-[#FFFFFF1A] mb-2 p-1 rounded-lg flex w-full'>
                        <div className='bg-[#474747] w-[40%] rounded-s-lg'>
                          <p className='text-white text-[11px] p-4'>Customer Status</p>
                        </div>
                        <div className='pl-1 self-center'>
                          <p className='text-white text-sm'>Shipping Label received</p>
                          <p className='text-[#686868]'>16 Dec 2024</p>
                        </div>
                        <div className='self-center ml-auto mr-2'>
                          <img src={DropActive} alt='DropActive' />
                        </div>
                      </div>
                      <div className='border border-[#FFFFFF1A] mb-2 p-1 rounded-lg flex w-full'>
                        <div className='bg-[#474747] w-[40%] rounded-s-lg'>
                          <p className='text-white text-[11px] p-4'>Claim Status</p>
                        </div>
                        <div className='pl-1 self-center'>
                          <p className='text-white text-sm'>Open</p>
                          <p className='text-[#686868]'>16 Dec 2024</p>
                        </div>
                        <div className='self-center ml-auto mr-2'>
                          <img src={DropActive} alt='DropActive' />
                        </div>
                      </div>
                      <div className='border border-[#FFFFFF1A] p-1 rounded-lg flex w-full'>
                        <div className='bg-[#474747] w-[40%] rounded-s-lg'>
                          <p className='text-white text-[11px] p-4'>Repair Status</p>
                        </div>
                        <div className='pl-1'>
                          <p className='text-white text-sm'>Parts Needed</p>
                          <p className='text-[#686868]'>16 Dec 2024</p>
                        </div>
                        <div className='self-center ml-auto mr-2'>
                          <img src={DropActive} alt='DropActive' />
                        </div>
                      </div>
                    </div>
                    <div className='col-span-3 self-center'>
                      <div className='m-2 p-2 bg-[#3C3C3C]'>
                        <p className='text-[11px] text-white'>Diagnosis</p>
                        <p className='text-sm text-[#686868]'>In publishing and graphic design, Lorem ipsum is a
                          placeholder. In publishing and graphic design, Lorem ipsum
                          is a placeholder. In publishing and graphic design, Lorem ipsum is a placeholder. In publishing and graphic design</p>
                      </div>
                    </div>
                    <div className='col-span-2 self-center'>
                      <div onClick={() => openAttachments()}> <img src={attach} alt='attach' /> </div> 
                    </div>
                  </Grid>
                </div>
              </Grid>
            </CollapsibleDiv>

          </div>
        </div>
      </div>

      <Modal isOpen={isViewOpen} onClose={closeView}>
            <Button onClick={closeView} className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]">
              <img src={Cross} className="w-full h-full text-black rounded-full p-0" />
            </Button>
            <div className="py-3">
              <p className='text-center text-3xl font-semibold '>
                Comments Details
              </p>
              <div className='h-[350px] mt-3 p-3 max-h-[350px] overflow-y-scroll border-[#D1D1D1] bg-[#F0F0F0] border rounded-xl'>

                <Grid className='my-3'>
                  <div className='col-span-1'>
                    <div className='bg-[#333333] border-2 w-12 h-12 flex justify-center border-[#D1D1D1] rounded-full'>
                      <p className='text-white text-2xl self-center'>A</p>
                    </div>
                  </div>
                  <div className='col-span-11'>
                    <div className='bg-white rounded-md relative p-1'>
                      <img src={arrowImage} className='absolute -left-3 rotate-[270deg] top-2	' alt='arrowImage'/>
                    <Grid>
                      <div className='col-span-6'>
                        <p className='text-xl font-semibold'>Angela <span className='text-[12px]'>(Admin)</span> </p>
                      </div>
                      <div className='col-span-5 self-center flex justify-end'>
                        <p className='text-sm pr-3'>9:30 am</p>
                        <p className='text-sm'>12 Nov 2023</p>
                      </div>
                      <div className='col-span-1 self-center text-center'>
                       <img src={download} className='w-5 h-5 mx-auto cursor-pointer' alt='download'/>
                      </div>
                    </Grid>
                    <hr className='my-2'/>
                     <p className='text-sm'>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual.</p>
                    </div>
                  </div>
                </Grid>

                <Grid className='my-3'>
                  <div className='col-span-1'>
                    <div className='bg-[#333333] border-2 w-12 h-12 flex justify-center border-[#D1D1D1] rounded-full'>
                      <p className='text-white text-2xl self-center'>D</p>
                    </div>
                  </div>
                  <div className='col-span-11'>
                    <div className='bg-white rounded-md relative p-1'>
                      <img src={arrowImage} className='absolute -left-3 rotate-[270deg] top-2	' alt='arrowImage'/>
                    <Grid>
                      <div className='col-span-6'>
                        <p className='text-xl font-semibold'>Alison <span className='text-[12px]'>(Dealer)</span></p>
                      </div>
                      <div className='col-span-5 self-center flex justify-end'>
                        <p className='text-sm pr-3'>9:30 am</p>
                        <p className='text-sm'>12 Nov 2023</p>
                      </div>
                      <div className='col-span-1 self-center text-center'>
                       <img src={download} className='w-5 h-5 mx-auto cursor-pointer' alt='download'/>
                      </div>
                    </Grid>
                    <hr className='my-2'/>
                     <p className='text-sm'>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual.</p>
                    </div>
                  </div>
                </Grid>

                <Grid className='my-3'>
                  <div className='col-span-1'>
                    <div className='bg-[#333333] border-2 w-12 h-12 flex justify-center border-[#D1D1D1] rounded-full'>
                      <p className='text-white text-2xl self-center'>S</p>
                    </div>
                  </div>
                  <div className='col-span-11'>
                    <div className='bg-white rounded-md relative p-1'>
                      <img src={arrowImage} className='absolute -left-3 rotate-[270deg] top-2	' alt='arrowImage'/>
                    <Grid>
                      <div className='col-span-6'>
                        <p className='text-xl font-semibold'>Veronica <span className='text-[12px]'> (Servicer) </span></p>
                      </div>
                      <div className='col-span-5 self-center flex justify-end'>
                        <p className='text-sm pr-3'>9:30 am</p>
                        <p className='text-sm'>12 Nov 2023</p>
                      </div>
                      <div className='col-span-1 self-center text-center'>
                       <img src={download} className='w-5 h-5 mx-auto cursor-pointer' alt='download'/>
                      </div>
                    </Grid>
                    <hr className='my-2'/>
                     <p className='text-sm'>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual.</p>
                    </div>
                  </div>
                </Grid> 

                 <Grid className='my-3'>
                  <div className='col-span-1'>
                    <div className='bg-[#333333] border-2 w-12 h-12 flex justify-center border-[#D1D1D1] rounded-full'>
                      <p className='text-white text-2xl self-center'>A</p>
                    </div>
                  </div>
                  <div className='col-span-11'>
                    <div className='bg-white rounded-md relative p-1'>
                      <img src={arrowImage} className='absolute -left-3 rotate-[270deg] top-2	' alt='arrowImage'/>
                    <Grid>
                      <div className='col-span-6'>
                        <p className='text-xl font-semibold'>Angela <span className='text-[12px]'>(Admin)</span> </p>
                      </div>
                      <div className='col-span-5 self-center flex justify-end'>
                        <p className='text-sm pr-3'>9:30 am</p>
                        <p className='text-sm'>12 Nov 2023</p>
                      </div>
                      <div className='col-span-1 self-center text-center'>
                       <img src={download} className='w-5 h-5 mx-auto cursor-pointer' alt='download'/>
                      </div>
                    </Grid>
                    <hr className='my-2'/>
                     <p className='text-sm'>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual.</p>
                    </div>
                  </div>
                </Grid>

                 <Grid className='my-3'>
                  <div className='col-span-1'>
                    <div className='bg-[#333333] border-2 w-12 h-12 flex justify-center border-[#D1D1D1] rounded-full'>
                      <p className='text-white text-2xl self-center'>A</p>
                    </div>
                  </div>
                  <div className='col-span-11'>
                    <div className='bg-white rounded-md relative p-1'>
                      <img src={arrowImage} className='absolute -left-3 rotate-[270deg] top-2	' alt='arrowImage'/>
                    <Grid>
                      <div className='col-span-6'>
                        <p className='text-xl font-semibold'>Angela <span className='text-[12px]'>(Admin)</span> </p>
                      </div>
                      <div className='col-span-5 self-center flex justify-end'>
                        <p className='text-sm pr-3'>9:30 am</p>
                        <p className='text-sm'>12 Nov 2023</p>
                      </div>
                      <div className='col-span-1 self-center text-center'>
                       <img src={download} className='w-5 h-5 mx-auto cursor-pointer' alt='download'/>
                      </div>
                    </Grid>
                    <hr className='my-2'/>
                     <p className='text-sm'>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual.</p>
                    </div>
                  </div>
                </Grid>             
             
              </div>
              <div >
                <p className='text-sm my-3'><b> Attachment : </b>  <span className='text-neutral-grey'> Accepted file types: jpg, gif, png, Max. file size: 50 MB. </span></p>
              </div>
              <Grid>
                <div className='col-span-1'> 
                  <div className='border flex h-full justify-center'>
                    <img src={upload} className='self-center' alt='upload'/>
                  </div>
                </div>
                <div className='col-span-9'>
                  <Input type='text'
                  className1="!text-[16px] !pt-2 placeholder-opacity-50 !pb-2 placeholder-[#1B1D21] !bg-[white]"/>
                </div>
                <div className=''><Button>Submit</Button></div>
              </Grid>
            
            </div>
          </Modal>

          <Modal  isOpen={isAttachmentsOpen} onClose={closeAttachments}>
            <Button onClick={closeAttachments} className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-4 mt-[-9px] !rounded-full !bg-[#5f5f5f]">
                <img src={Cross} className="w-full h-full text-black rounded-full p-0" />
            </Button>
            <div className='py-1'>
            <p className='text-center text-3xl font-semibold '>
              View Attachment</p>

              <img src={Attachment} className='p-4' alt='Attachment' /> 
            </div>
          </Modal>
    </>
  )
}


export default ServicerClaimList