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
import UserList from "./Dealer-Details/user";
import PriceBookList from "./Dealer-Details/priceBook";
import CustomerList from "./Dealer-Details/customer";
import Modal from "../../../common/model";
import Input from "../../../common/input";
import Select from "../../../common/select";

function DealerDetails() {
  const [activeTab, setActiveTab] = useState('tab1'); // Set the initial active tab
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleSelectChange1 = (label, value) => {
    setSelectedProduct(value);
  };

  const city = [
    { label: "Country", value: "country" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ];

  const tabs = [
    { id: 'tab1', label: 'Orders', icons: Order, Activeicons: OrderActive, content: <OrderList /> },
    { id: 'tab2', label: 'Contracts', icons:Contract, Activeicons: ContractsActive, content: <ContractList /> },
    { id: 'tab3', label: 'Claims', icons: Claim, Activeicons: ClaimActive, content: <ClaimList /> },
    { id: 'tab4', label: 'Servicer', icons: Servicer, Activeicons: ServicerActive, content: <ServicerList /> },
    { id: 'tab5', label: 'Customers', icons: Customer, Activeicons: CustomerActive, content: <CustomerList /> },
    { id: 'tab6', label: 'Users', icons: User, Activeicons: UserActive, content: <UserList /> },
    { id: 'tab7', label: 'PriceBook', icons: PriceBook, Activeicons: PriceBookActive, content: <PriceBookList /> },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };
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
                    <Button className='border !border-[#535456] !text-sm !font-Regular'  onClick={openModal}>Edit</Button>
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
              <p className="text-[10px] mr-3 text-[#999999] font-Regular">PRIMARY CONTACT DETAILS</p>
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
                  {tabs.map((tab) => (
                    <div className="col-span-1" key={tab.id}>
                      <Button
                        className={`flex self-center w-full !px-2 !py-1 rounded-xl border-[1px] border-[#D1D1D1] ${activeTab === tab.id ? '!bg-[#2A2A2A] !text-white' : '!bg-[#F9F9F9] !text-black'}`}
                        onClick={() => handleTabClick(tab.id)}
                      >
                        <img src={activeTab === tab.id ? tab.Activeicons : tab.icons} className="self-center pr-1 py-1 border-[#D1D1D1] border-r-[1px]" alt={tab.label} />
                        <span className={`ml-1 py-1 text-sm font-Regular ${activeTab === tab.id ? 'text-white' : 'text-black'}`}>
                          {tab.label}
                        </span>
                      </Button>
                    </div>
                  ))}
                </Grid>
              </div>
            </div>
            <div className="col-span-2">
                <Button className="!bg-white flex self-center h-full  mb-4 rounded-xl ml-auto border-[1px] border-[#D1D1D1]">
                  {" "}
                  <Link to={"#"} className="flex self-center">
                    {" "}
                    <img src={AddItem} className="self-center" alt="AddItem" />{" "}
                    <span className="text-black ml-3 text-[14px] font-Regular !font-[700]">
                    Add Order
                    </span>{" "}
                  </Link>
                </Button>
            </div>
          </Grid>

          {tabs.map((tab) => (
            <div key={tab.id} className={`${activeTab !== tab.id ? 'hidden' : ''}`}>
              {tab.content}
            </div>
          ))}

        </div>
      </Grid>
  {/* Modal Email Popop */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center p-8">
         <p className="text-3xl font-semibold mb-4">Edit Dealer Details</p>
           <Grid>
            <div className="col-span-12">
              <Input
               name='accountName'
               className="!bg-[#fff]"
               type='text'
               label='Account Name'
              />
            </div>
            <div className="col-span-12">
              <Input
               name='streetAddress'
               className="!bg-[#fff]"
               type='text'
               label='Street Address'
              />
            </div>
            <div className="col-span-6">
              <Input
               name='zipCode'
               type='number'
               className="!bg-[#fff]"
               label='Zip Code'
              />
            </div>
            <div className="col-span-6">
            <Select
              label="City"
              options={city}
              className="!bg-[#fff]"
              selectedValue={selectedProduct}
              onChange={handleSelectChange1}
            />
            </div>
            <div className="col-span-6">
            <Select
              label="State"
              options={city}
              className="!bg-[#fff]"
              selectedValue={selectedProduct}
              onChange={handleSelectChange1}
            />
            </div>
            <div className="col-span-6">
            <Select
              label="Country"
              options={city}
              className="!bg-[#fff]"
              selectedValue={selectedProduct}
              onChange={handleSelectChange1}
            />
            </div>
            <div className="col-span-4">
             <Button className='border w-full !border-[#535456] !bg-[transparent] !text-light-black !text-sm !font-Regular' onClick={closeModal} >Cancel</Button>
            </div>
            <div className="col-span-8">
            <Button className='w-full' >Submit</Button>
            </div>
           </Grid>
        </div>
      </Modal>
    </div>

  );
}

export default DealerDetails;
