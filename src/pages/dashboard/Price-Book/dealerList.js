import React, { useState } from 'react'

import { Link } from 'react-router-dom'
import Button from '../../../common/button'


import AddItem from '../../../assets/images/icons/addItem.svg';
import Search from '../../../assets/images/icons/SearchIcon.svg';
import down from '../../../assets/images/icons/Drop.svg';
import ActiveIcon from '../../../assets/images/icons/iconAction.svg';
import Headbar from '../../../common/headBar';
import Grid from '../../../common/grid';
import Input from '../../../common/input';
import Select from '../../../common/select';
import DataTable from "react-data-table-component";

function DealerPriceList() {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedTearm, setSelectedTearm] = useState(false);
  const handleActionChange = (action) => {
    // Implement the logic for the selected action (e.g., edit or delete)
    console.log(`Selected action: ${action}`);
    // You can replace the console.log statement with the actual logic you want to perform
  };
  const handleSelectChange1 = (name, value) => {
    setSelectedProduct(value);
  };

  const handleSelectChange = (name, value) => {
    setSelectedTearm(value);
  };

  const country = [
    { label: 'Country', value: 'country' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  const status = [
    { label: 'Active', value: 'true' },
    { label: 'Inactive', value: 'false' },
  ];

  const data = [
    {
      ProductID: 1,
      DealerName: "Dealer 1",
      ProductName: "Product A",
      ProductCategory: "Category 1",
      Term: "12 months",
      WholesaleCost: "$50.00",
      RetailCost: "$70.00",
      Status: "Active",
    },
    {
      ProductID: 2,
      DealerName: "Dealer 2",
      ProductName: "Product B",
      ProductCategory: "Category 2",
      Term: "6 months",
      WholesaleCost: "$35.00",
      RetailCost: "$45.00",
      Status: "Inactive",
    },
    // Add more objects as needed
  ];

  

  const columns = [
    {
      name: "Product ID",
      selector: (row) => row.ProductID,
      sortable: true,
    },
    {
      name: "Dealer Name",
      selector: (row) => row.DealerName,
      sortable: true,
    },
    // {
    //   name: "Product Name",
    //   selector: (row) => row.ProductName,
    //   sortable: true,
    // },
    // {
    //   name: "Product Category",
    //   selector: (row) => row.ProductCategory,
    //   sortable: true,
    // },
    {
      name: "Term",
      selector: (row) => row.Term,
      sortable: true,
    },
    {
      name: "WholeSale Cost",
      selector: (row) => row.WholesaleCost,
      sortable: true,
    },
    {
      name: "Retail Cost",
      selector: (row) => row.RetailCost,
      sortable: true,
    },

    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
       

        <div className="relative">
        <div className={` ${row.status === true ? 'bg-[#6BD133]' : 'bg-[#FF4747]'} absolute h-3 w-3 rounded-full top-[33%] ml-[8px]`}></div>
        <select
          value={row.status === true ? "active" : "inactive"}
          // onChange={(e) => handleStatusChange(row, e.target.value)}
          className="text-[12px] border border-gray-300 text-[#727378] rounded pl-[20px] py-2 pr-1 font-semibold rounded-xl">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
       // <div className="relative" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        //   <span className='flex border-[1px] p-2 rounded-xl font-semibold w-full'><div className={` ${row.status === 'Active' ? 'bg-[#6BD133]' : 'bg-[#FF4747]'} h-3 w-3 rounded-full mr-2 self-center`}></div>{row.Status} <img src={down} className='self-center ml-3' alt='down'/></span>

          // <div className='bg-Dropdown bg-cover bg-no-repeat	'>
          //    hello
          // </div> 

        // </div>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="relative">
          <div onClick={() => setSelectedAction((prev) => !prev)}>
            <img src={ActiveIcon} className='w-[35px] cursor-pointer' alt='Active Icon'/>
          </div>
          {/* {selectedAction && (
            <div className="absolute z-[2] top-4 right-0 mt-2 bg-white border rounded shadow-md">
              <div className="h-0 w-0 border-x-8 absolute top-[-17px] left-1/2 border-x-transparent border-b-[16px] border-b-white"></div>
              <button
                onClick={() => {
                  handleActionChange('Edit');
                  setSelectedAction(null);
                }}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
              >
                Edit
              </button>
            </div>
          )} */}
        </div>
      ),
    },
    
  ];

  
  return (
    <>
      <div className='my-8 ml-3'>
        <Headbar />
        <div className='flex mt-14'>
          <div className='pl-3'>
            <p className='font-bold text-[38px] leading-9	mb-[3px]'>Dealer Book</p>
            <ul className='flex self-center'>
              <li className='text-sm text-neutral-grey font-Regular'><Link to={'/'}>Price Book </Link>  /  </li>
              <li className='text-sm text-neutral-grey font-semibold ml-2 pt-[1px]'> Dealer Book </li>
            </ul>
          </div>
        </div>
        <Button className="!bg-white flex self-center mb-4 rounded-xl ml-auto border-[1px] border-[#D1D1D1]" > <Link to={'/addDealerBook'} className='flex'> <img src={AddItem} className='self-center' alt='AddItem' /> <span className='text-black ml-3 text-[14px] font-semibold'>Add Dealer Book </span>  </Link></Button>

        <div className='bg-white  border-[1px] border-[#D1D1D1] rounded-xl'>
          <Grid className='!px-[26px] !pt-[14px] !pb-0'>
            <div className='col-span-5 self-center'>
              <p className='text-xl font-semibold'>Dealer Price List</p>
            </div>
            <div className='col-span-7'>
              <div className='bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]'>
                <Grid className='!grid-cols-9' >
                  <div className='col-span-2 self-center'>
                    <Input name='Category' type='text'  className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 !pb-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21]" label='' placeholder='Category' />
                  </div>
                  <div className='col-span-2 self-center'>
                    <Input name='Name' type='text' className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 !pb-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21]" label='' placeholder='Name' />
                  </div>
                  <div className='col-span-2 self-center'>
                    <Select label=""
                      options={country}
                      OptionName='Term'
                      color='text-[#1B1D21] opacity-50'
                      className1="!pt-1 !pb-1 !text-[13px]"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      selectedValue={selectedProduct}
                      onChange={handleSelectChange1} />
                  </div>
                  <div className='col-span-2 self-center'>
                    <Select label=""
                      options={status}
                      OptionName='Status'
                      color='text-[#1B1D21] opacity-50'
                      className1="!pt-1 !pb-1 !text-[13px]"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      selectedValue={selectedTearm}
                      onChange={handleSelectChange} />
                  </div>
                  <div className='col-span-1 self-center'>
                    <img src={Search}  className='cursor-pointer' alt='Search' />
                  </div>
                </Grid>
              </div>
            </div>
          </Grid>

          <div className="overflow-x-auto">
            <DataTable columns={columns} data={data} pagination />
          </div>
        </div>
      </div>
    </>
  )
}

export default DealerPriceList