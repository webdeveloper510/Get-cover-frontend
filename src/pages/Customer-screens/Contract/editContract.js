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
import DateInput from '../../../common/dateInput';
function CustomerEditContract() {
    const [showTooltip, setShowTooltip] = useState(false);
    const status = [
        { label: "Active", value: true },
        { label: "Inactive", value: false },
      ];
      const CoverageStartDate = [
        { label: "11/09/2026", value: true },
        { label: "12/09/2026", value: false },
      ];
      const [item, setItem] = useState({
        requested_order_ship_date: '2024-02-05', 
      });
    return (
        <>
            <div className="mb-8 ml-3">
                <Headbar />

                <div className="flex mt-2">
                    <Link
                        to={"/contractList"}
                        className="h-[60px] w-[60px] flex border-[1px] bg-white border-Light-Grey rounded-[20px]"
                    >
                        <img
                            src={BackImage}
                            className="m-auto my-auto self-center bg-white"
                            alt="BackImage"
                        />{" "}
                    </Link>
                    <div className="pl-3">
                        <p className="font-bold text-[36px] leading-9	mb-[3px]"> Edit Contracts</p>
                        <ul className="flex self-center">
                            <li className="text-sm text-neutral-grey font-Regular">
                                <Link to={"/"}>Contracts  /</Link>{" "}
                            </li>
                            <li className="text-sm text-neutral-grey font-semibold ml-1">
                                Edit Contracts
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="bg-Edit bg-cover px-8 mt-8 mr-4 py-16 rounded-[30px]">
                    <Grid className="mx-8 mx-auto ">
                        <div className="col-span-3 self-center border-r border-[#4e4e4e]">
                            <div className="flex">
                                <div className="self-center backdrop-blur mr-4">
                                    <img src={contract}  alt="category" />
                                </div>
                                <div className="self-center">
                                    <p className="text-[#FFF] text-base font-medium leading-5	">
                                        Contract ID
                                    </p>
                                    <p className="text-[#FFFFFF] opacity-50 text-sm	font-medium">
                                        861910
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-3 border-r border-[#4e4e4e]">
                            <div className="flex">
                                <div className="self-center bg-[#FFFFFF08] backdrop-blur border-[#D1D9E24D] border rounded-lg p-3 mr-4">
                                    <img src={category1} className="w-6 h-6" alt="dealer" />
                                </div>
                                <div className="self-center">
                                    <p className="text-[#FFF] text-base font-medium leading-5	">
                                        Order ID
                                    </p>
                                    <p className="text-[#FFFFFF] opacity-50 text-sm	font-medium">
                                        315174
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-3">
                            <div className="flex w-full border-r border-[#4e4e4e]">
                                <div className="self-center backdrop-blur  mr-4">
                                    <img src={delaerName} alt="terms" />
                                </div>
                                <div className="self-center">
                                    <p className="text-[#FFF] text-base font-medium leading-5">
                                        Dealer P.O. #
                                    </p>
                                    <p className="text-[#FFFFFF] opacity-50	text-sm font-medium">
                                        MC-10554
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-3">
                            <div className="flex">
                                <div className="self-center backdrop-blur  mr-4">
                                    <img src={delaerName}  alt="product" />
                                </div>
                                <div className="self-center">
                                    <p className="text-[#FFF] text-base font-medium leading-5	">
                                        Dealer Name
                                    </p>
                                    <p className="text-[#FFFFFF] opacity-50 text-sm	font-medium">
                                        Edward Wilson
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid className="mx-8 mt-2  mx-auto ">
                        <div className="col-span-3 self-center pt-2 border-t border-[#4e4e4e]">
                            <div className="flex w-full border-r border-[#4e4e4e]">
                                <div className="self-center backdrop-blur  mr-4">
                                    <img src={CustomerName} alt="category" />
                                </div>
                                <div className="self-center">
                                    <p className="text-[#FFF] text-base font-medium leading-5	">
                                        Customer Name
                                    </p>
                                    <p className="text-[#FFFFFF] opacity-50 text-sm	font-medium">
                                        Ankush Grover
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-3 self-center pt-2 border-t border-[#4e4e4e]">
                            <div className="flex w-full border-r border-[#4e4e4e]">
                                <div className="self-center backdrop-blur   mr-4">
                                    <img src={ServicerName} alt="dealer" />
                                </div>
                                <div className="self-center">
                                    <p className="text-[#FFF] text-base font-medium leading-5	">
                                        Servicer Name
                                    </p>
                                    <p className="text-[#FFFFFF] opacity-50 text-sm	font-medium">
                                        Jameson Wills
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-3 self-center pt-2 border-t border-[#4e4e4e]">
                            <div className="flex w-full border-r border-[#4e4e4e]">
                                <div className="self-center backdrop-blur  mr-4">
                                    <img src={claim} alt="terms" />
                                </div>
                                <div className="self-center">
                                    <p className="text-[#FFF] text-base font-medium leading-5">
                                        Claim Amount
                                    </p>
                                    <p className="text-[#FFFFFF] opacity-50	text-sm font-medium">
                                        MC-10554
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-3 self-center pt-2 border-t border-[#4e4e4e]">
                            <div className="flex">
                                <div className="self-center backdrop-blur  mr-4">
                                    <img src={Eligibility} alt="product" />
                                </div>
                                <div className="self-center">
                                    <p className="text-[#FFF] text-base font-medium leading-5	">
                                        Eligibility
                                    </p>
                                    <p className="text-[#FFFFFF] opacity-50 text-sm	font-medium">
                                        Not Eligible
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </div>

                <form className="mt-8 mr-4">
                  <div className="px-8 pb-8 pt-6 drop-shadow-4xl bg-white  border-[1px] border-Light-Grey  rounded-3xl">
                    <p className='pb-5 text-lg font-semibold'>Contracts</p>
                    <Grid className='!grid-cols-4'>
                      <div className='col-span-1'>
                        <Input type='text' 
                         name="Manufacturer"
                        className="!bg-[#fff]"
                        label="Manufacturer"
                        required={true}
                        placeholder="" />
                      </div>
                      <div className='col-span-1'>
                        <Input type='text' 
                         name="Model"
                        className="!bg-[#fff]"
                        label="Model"
                        required={true}
                        placeholder="" />
                      </div>
                      <div className='col-span-1'>
                        <Input type='text' 
                         name="Serial"
                        className="!bg-[#fff]"
                        label="Serial"
                        required={true}
                        placeholder="" />
                      </div>
                     
                      <div className='col-span-1'>
                        <Input type='text' 
                         name="RetailPrice"
                        className="!bg-[#fff]"
                        label="Retail Price($)"
                        required={true}
                        placeholder="" />
                      </div>
                      <div className='col-span-1'>
                        <Input type='text' 
                         name="Condition"
                        className="!bg-[#fff]"
                        label="Condition"
                        required={true}
                        placeholder="" />
                      </div>
                      <div className='col-span-1'>
                      {/* <Input type='date' 
                        name="Coverage Start Date"
                        label="Coverage Start Date"
                        required={true}
                        className="!bg-[#fff]"
                        placeholder=""/> */}
                         <DateInput
                         name="Coverage Start Date"
                         label="Coverage Start Date"
                        required 
                        item={item}
                        setItem={setItem}
                        className="!bg-[#fff]" />
                      </div>
                      <div className='col-span-1'>
                      <Select
                        name="Status"
                        label="Status"
                        options={status}
                        required={true}
                        className="!bg-[#fff]"
                        placeholder=""/>
                      </div>
                    </Grid>

                    <div className='mt-8'>
                    <Button className='!bg-white !text-black' >Cancel</Button>
                    <Button>Update</Button>
                    </div>
                  </div>
                </form>
            </div>

        </>
    )
}

export default CustomerEditContract

