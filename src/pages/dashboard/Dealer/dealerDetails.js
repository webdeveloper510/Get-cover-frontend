import React, { useEffect, useState } from "react";
import Headbar from "../../../common/headBar";
import { Link, useNavigate } from "react-router-dom";
import Grid from "../../../common/grid";
import Button from "../../../common/button";

// Media Import 
import BackImage from "../../../assets/images/icons/backArrow.svg";
import address from "../../../assets/images/icons/address.svg";
import name from "../../../assets/images/icons/Name.svg";
import AddItem from "../../../assets/images/icons/addItem.svg";
import OrderActive from "../../../assets/images/Dealer/Order-active.svg";
import ContractsActive from "../../../assets/images/Dealer/Contract-active.svg";
import ClaimActive from "../../../assets/images/Dealer/Claim-active.svg";
import ServicerActive from "../../../assets/images/Dealer/Servicer-active.svg";
import CustomerActive from "../../../assets/images/Dealer/Customer-active.svg";
import UserActive from "../../../assets/images/Dealer/User-active.svg";
import PriceBookActive from "../../../assets/images/Dealer/PriceBook-active.svg";
import Order from "../../../assets/images/Dealer/Orders.svg";
import Contract from "../../../assets/images/Dealer/Contract.svg";
import Claim from "../../../assets/images/Dealer/Claim.svg";
import Servicer from "../../../assets/images/Dealer/Servicer.svg";
import Customer from "../../../assets/images/Dealer/Customers.svg";
import User from "../../../assets/images/Dealer/Users.svg";
import PriceBook from "../../../assets/images/Dealer/PriceBook.svg";
import email from "../../../assets/images/icons/Email.svg";
import phone from "../../../assets/images/icons/PhoneNumber.svg";
import OrderList from "./Dealer-Details/order";
import ContractList from "./Dealer-Details/contract";
import ClaimList from "./Dealer-Details/claim";
import ServicerList from "./Dealer-Details/servicer";

function DealerDetails() {
  const tabs = [
    { id: 'tab1', label: 'Tab 1', content: <div>Content for Tab 1</div> },
    { id: 'tab2', label: 'Tab 2', content: <div>Content for Tab 2</div> },
    { id: 'tab3', label: 'Tab 3', content: <div>Content for Tab 3</div> },
  ];
  return (

    <div className="py-8 px-3 relative overflow-x-hidden bg-[#F9F9F9]">

      <Headbar />

      <div className="flex">
        <Link
          to={"/dashboard"}
          className="h-[60px] w-[60px] flex border-[1px] bg-white border-[#D1D1D1] rounded-[25px]"
        >
          <img
            src={BackImage}
            className="m-auto my-auto self-center bg-white"
            alt="BackImage"
          />
        </Link>
        <div className="pl-3">
          <p className="font-semibold text-[36px] leading-9 mb-[3px]">
          Dealer Details
          </p>
          <ul className="flex self-center">
            <li className="text-sm text-neutral-grey font-Regular">
              <Link to={"/"}>Dealer  / </Link> /{" "}
            </li>
            <li className="text-sm text-neutral-grey font-Regular">
              <Link to={"/"}>  Dealer List   / </Link> /{" "}
            </li>
            <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
              {" "}
              Dealer Detail (Price Book) 
            </li>
          </ul>
        </div>
      </div>

      <Grid className="!grid-cols-4">
        <div className="col-span-1">
            <div className=" bg-Dealer-details bg-cover mt-5 p-5 rounded-[20px]">
            <Grid>
                <div className="col-span-9">
                    <p className="text-sm text-neutral-grey font-Regular">Account Name</p>
                    <p className="text-2xl text-white font-semibold">Edward26wilson</p>
                </div>
                <div className="col-span-3 text-end">
                    <Button className='border !border-[#535456] !font-Regular'>Edit</Button>
                </div>
            </Grid>
            <div className="flex my-4">
                <img src={address} className="mr-3 bg-[#D1D9E24D] rounded-[14px] my-auto" alt="Address"/>
                <div>
                    <p className="text-sm text-neutral-grey font-Regular mt-3">Address</p>
                    <p className="text-lg text-white font-semibold leading-5">1515 Holcombe Blvd, Houston, TX 77030, USA</p>
                </div>
            </div>
            <div className="flex w-full my-4">
              <p className="text-sm mr-3 text-[#999999] font-Regular">PRIMARY CONTACT DETAILS</p>
              <hr className="self-center border-[#999999] w-[50%]"/>
            </div>
            <div className="flex mb-4">
                <img src={name} className="mr-3 bg-[#D1D9E24D] rounded-[14px]" alt="Name"/>
                <div>
                    <p className="text-sm text-neutral-grey font-Regular">Name</p>
                    <p className="text-lg text-white font-semibold">Edward Wilson</p>
                </div>
            </div>
            <div className="flex mb-4">
                <img src={email} className="mr-3 bg-[#D1D9E24D] rounded-[14px]" alt="email"/>
                <div>
                    <p className="text-sm text-neutral-grey font-Regular">Email</p>
                    <p className="text-lg text-white font-semibold">26edward26@gmail.com</p>
                </div>
            </div>
            <div className="flex mb-4">
                <img src={phone}  className="mr-3 bg-[#D1D9E24D] rounded-[14px]" alt="name"/>
                <div>
                    <p className="text-sm text-neutral-grey font-Regular">Phone Number</p>
                    <p className="text-lg text-white font-semibold">+1 (869) 985-6741</p>
                </div>
            </div>
            <Grid className="mt-5">
              <div className="col-span-6 ">
                <div className="bg-[#2A2A2A] self-center px-4 py-6 rounded-xl">
                   <p className="text-white text-lg font-semibold">6,359</p>
                   <p className="text-[#999999] text-sm font-Regular">Total Number of Orders</p>
                </div>
              </div>
              <div className="col-span-6 ">
                <div className="bg-[#2A2A2A] self-center px-4 py-6 rounded-xl">
                   <p className="text-white text-lg font-semibold">$96,859.00</p>
                   <p className="text-[#999999] text-sm font-Regular">Total Value of Orders</p>
                </div>
              </div>
              <div className="col-span-6 ">
                <div className="bg-[#2A2A2A] self-center px-4 py-6 rounded-xl">
                   <p className="text-white text-lg font-semibold">3,843</p>
                   <p className="text-[#999999] text-sm font-Regular">Total number of Sales</p>
                </div>
              </div>
              <div className="col-span-6 ">
                <div className="bg-[#2A2A2A] self-center px-4 py-6 rounded-xl">
                   <p className="text-white text-lg font-semibold">$35,859.00</p>
                   <p className="text-[#999999] text-sm font-Regular">Total Value of Claims</p>
                </div>
              </div>
            </Grid>

            </div>
        </div>
        <div className="col-span-3">
          <Grid className="!mt-5">
            <div className="col-span-10">
              <div className="bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                 <Grid className="!grid-cols-7 !gap-1">
                    <div className="col-span-1">
                      <Button className="flex self-center !px-2 !py-1 w-full rounded-xl border-[1px] border-[#D1D1D1]">
                        <img src={OrderActive} className="self-center pr-1 py-1 border-[#474747] border-r-[1px]" alt="AddItem" />{" "}
                        <span className="text-white  text-[14px] ml-1 py-1 font-Regular">
                          Orders
                        </span>
                      </Button>
                    </div>
                    <div className="col-span-1">
                      <Button className="!bg-white flex self-center w-full !px-2 !py-1 rounded-xl border-[1px] border-[#D1D1D1]">
                        <img src={Contract} className="self-center pr-1 py-1 border-[#D1D1D1] border-r-[1px]" alt="Contract" />{" "}
                        <span className="text-black  text-[14px] ml-1 py-1 font-Regular">
                        Contracts
                        </span>
                      </Button>
                    </div>
                    <div className="col-span-1">
                      <Button className="!bg-white flex self-center w-full !px-2 !py-1 rounded-xl border-[1px] border-[#D1D1D1]">
                        <img src={Claim} className="self-center pr-1 py-1 border-[#D1D1D1] border-r-[1px]" alt="Claim" />{" "}
                        <span className="text-black  text-[14px] ml-1 py-1 font-Regular">
                        Claims
                        </span>
                      </Button>
                    </div>
                    <div className="col-span-1">
                      <Button className="!bg-white flex self-center w-full !px-2 !py-1 rounded-xl border-[1px] border-[#D1D1D1]">
                        <img src={Servicer} className="self-center pr-1 py-1 border-[#D1D1D1] border-r-[1px]" alt="Servicer" />{" "}
                        <span className="text-black  text-[14px] ml-1 py-1 font-Regular">
                        Servicer
                        </span>
                      </Button>
                    </div>
                    <div className="col-span-1">
                      <Button className="!bg-white flex self-center w-full !px-2 !py-1 rounded-xl border-[1px] border-[#D1D1D1]">
                        <img src={Customer} className="self-center pr-1 py-1 border-[#D1D1D1] border-r-[1px]" alt="Customer" />{" "}
                        <span className="text-black  text-[14px] ml-1 py-1 font-Regular">
                        Customers
                        </span>
                      </Button>
                    </div>
                    <div className="col-span-1">
                      <Button className="!bg-white flex self-center w-full !px-2 !py-1 rounded-xl border-[1px] border-[#D1D1D1]">
                        <img src={User} className="self-center pr-1 py-1 border-[#D1D1D1] border-r-[1px]" alt="User" />{" "}
                        <span className="text-black  text-[14px] ml-1 py-1 font-Regular">
                        Users
                        </span>
                      </Button>
                    </div>
                    <div className="col-span-1">
                      <Button className="!bg-white flex self-center w-full !px-2 !py-1 rounded-xl  border-[1px] border-[#D1D1D1]">
                        <img src={PriceBook} className="self-center pr-1 py-1 border-[#D1D1D1] border-r-[1px]" alt="Price Book" />{" "}
                        <span className="text-black  text-[14px] ml-1 py-1 font-Regular">
                        PriceBook
                        </span>
                      </Button>
                    </div>
                 </Grid>
              </div>
            </div>
            <div className="col-span-2">
                <Button className="!bg-white flex self-center mb-4 rounded-xl ml-auto border-[1px] border-[#D1D1D1]">
                  {" "}
                  <Link to={"/addCategory"} className="flex">
                    {" "}
                    <img src={AddItem} className="self-center" alt="AddItem" />{" "}
                    <span className="text-black ml-3 text-[14px] font-Regular !font-[700]">
                    Add Order
                    </span>{" "}
                  </Link>
                </Button>
            </div>
          </Grid>

          <OrderList/>
          <div className="py-6"></div>
          <ContractList/>
          <ClaimList/>
          <ServicerList />
        </div>
      </Grid>

    </div>

  );
}

export default DealerDetails;
