import React, { useState } from 'react'
import Button from '../../../common/button'
import Grid from '../../../common/grid'
import Input from '../../../common/input'

// Media Includes 
import BackImage from "../../../assets/images/icons/backArrow.svg";
import Wholesale from "../../../assets/images/icons/wholePrice.svg";
import product from "../../../assets/images/icons/productName.svg";
import category1 from "../../../assets/images/icons/productCat.svg";
import dealer from "../../../assets/images/icons/dealerName.svg";
import claim from "../../../assets/images/icons/claimAmount.svg";
import contract from "../../../assets/images/icons/contract.svg";
import Eligibility from "../../../assets/images/icons/Eligibility.svg";
import delaerName from "../../../assets/images/icons/dealerNumber.svg";
import ServicerName from "../../../assets/images/icons/servicerNumber.svg";
import CustomerName from "../../../assets/images/icons/customerNumber.svg";
import AddDealer from "../../../assets/images/dealer-book.svg";
import Headbar from '../../../common/headBar';
import { Link } from 'react-router-dom';
import Select from '../../../common/select';
function EditClaim() {
    const [showTooltip, setShowTooltip] = useState(false);
    const status = [
        { label: "Active", value: true },
        { label: "Inactive", value: false },
      ];
      const CoverageStartDate = [
        { label: "11/09/2026", value: true },
        { label: "12/09/2026", value: false },
      ];
    return (
        <>
            <div className="my-8 ml-3">
                <Headbar />

                <div className="flex mt-2">
                    <Link
                        to={"/claimList"}
                        className="h-[60px] w-[60px] flex border-[1px] bg-white border-[#D1D1D1] rounded-[20px]"
                    >
                        <img
                            src={BackImage}
                            className="m-auto my-auto self-center bg-white"
                            alt="BackImage"
                        />{" "}
                    </Link>
                    <div className="pl-3">
                        <p className="font-bold text-[36px] leading-9	mb-[3px]"> Edit Claim</p>
                        <ul className="flex self-center">
                            <li className="text-sm text-neutral-grey font-Regular">
                                <Link to={"/"}>Claim  / </Link>{" "}
                            </li>
                            <li className="text-sm text-neutral-grey font-Regular">
                                <Link to={"/"}> Claim Listing  / </Link>{" "}
                            </li>
                            <li className="text-sm text-neutral-grey font-semibold ml-1">
                                Edit Claim
                            </li>
                        </ul>
                    </div>
                </div>

               

                <form className="mt-8 mr-4">
                  <div className="px-8 pb-8 pt-6 drop-shadow-4xl bg-white mb-5 border-[1px] border-[#D1D1D1]  rounded-3xl">
                    <p className='pb-5 text-lg font-semibold'>Repair Parts</p>
                    <Grid className='mb-5'>
                      <div className='col-span-3'>
                      <Select
                        name="ServiceType"
                        label="Service Type"
                        options={CoverageStartDate}
                        required={true}
                        className="!bg-[#fff]"
                        placeholder=""/>
                      </div>
                      <div className='col-span-5'>
                        <Input type='text' 
                         name="description"
                        className="!bg-[#fff]"
                        label="Description"
                        placeholder="" />
                      </div>
                      <div className='col-span-3'>
                        <Input type='number' 
                         name="price"
                        className="!bg-[#fff]"
                        label="Price ($)"
                        placeholder="" />
                      </div>
                      <div className='col-span-1 self-center flex justify-center'>
                       <Button>+</Button>
                      </div>
                    </Grid>
                    <hr className='my-4'/>
                    <Grid className='mb-5'>
                      <div className='col-span-3'>
                      <Select
                        name="ServiceType"
                        label="Service Type"
                        options={CoverageStartDate}
                        required={true}
                        className="!bg-[#fff]"
                        placeholder=""/>
                      </div>
                      <div className='col-span-5'>
                        <Input type='text' 
                         name="description"
                        className="!bg-[#fff]"
                        label="Description"
                        placeholder="" />
                      </div>
                      <div className='col-span-3'>
                        <Input type='number' 
                         name="price"
                        className="!bg-[#fff]"
                        label="Price ($)"
                        placeholder="" />
                      </div>
                      <div className='col-span-1 self-center  flex justify-center'>
                       <Button><b>-</b></Button>
                      </div>
                    </Grid>

                   
                  </div>
                  <div className="px-8 pb-8 pt-6 drop-shadow-4xl bg-white  border-[1px] border-[#D1D1D1]  rounded-3xl">
                  <div className="relative">
                      <label
                        htmlFor="description"
                        className="absolute text-base text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-[#fff] left-2 px-1 -translate-y-4 scale-75"
                      >
                        Note
                      </label>
                      <textarea
                        id="note"
                        rows="4"
                        name="Note"
                        maxLength={150}
                        className="block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold text-light-black bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer resize-none	"
                      ></textarea>
                    </div>
                    </div>

                  <div className='mt-8'>
                    <Button className='!bg-white !text-black' >Cancel</Button>
                    <Button>Update</Button>
                    </div>
                </form>
            </div>

        </>
    )
}


export default EditClaim