import React, { useState } from 'react'

import { Link } from 'react-router-dom'
import Button from '../../../common/button'

import ActiveIcon from '../../../assets/images/icons/iconAction.svg';
import AddItem from '../../../assets/images/icons/addItem.svg';
import Search from '../../../assets/images/icons/SearchIcon.svg';
import Headbar from '../../../common/headBar';
import Grid from '../../../common/grid';
import Input from '../../../common/input';
import DataTable from "react-data-table-component";
function DealerList() {
  const [selectedAction, setSelectedAction] = useState(null);

  const handleActionChange = (action) => {
    // Implement the logic for the selected action (e.g., edit or delete)
    console.log(`Selected action: ${action}`);
    // You can replace the console.log statement with the actual logic you want to perform
  };
  const data = [
    {
      Categoryid: 1,
      Categoryname: "Category 1",
      description: "Description for Category 1",
      status: "Active",
    },
    {
      Categoryid: 2,
      Categoryname: "Category 2",
      description: "Description for Category 2",
      status: "Inactive",
    },
  ];
  const columns = [
    {
      name: "Category ID",
      selector: (row) => row.Categoryid,
      sortable: true,
    },
    {
      name: "Category Name",
      selector: (row) => row.Categoryname,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="relative">
           <div onClick={() => setSelectedAction(row.unique_key)}>
            <img src={ActiveIcon} className='w-[35px] cursor-pointer' alt="Active Icon" />
          </div>
          {selectedAction && (
            <div className="absolute z-[2] top-4 right-0 mt-2 bg-white border rounded shadow-md">
              <div class="h-0 w-0 border-x-8 absolute top-[-17px] left-1/2 border-x-transparent border-b-[16px] border-b-white"></div>
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
          )}
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
            <p className='font-bold text-[36px] leading-9	mb-[3px]'>Dealer</p>
            <ul className='flex self-center'>
              <li className='text-sm text-neutral-grey font-Regular'><Link to={'/'}>Dealer </Link>  /  </li>
              <li className='text-sm text-neutral-grey font-semibold ml-2 pt-[1px]'> Dealer List </li>
            </ul>
          </div>
        </div>
        {/* <Button className="!bg-white flex self-center mb-4 rounded-xl ml-auto border-[1px] border-[#D1D1D1]" > <Link to={'/addCategory'} className='flex'> <img src={AddItem} className='self-center' alt='AddItem' /> <span className='text-black ml-3 text-[14px] font-semibold'>Add Category </span>  </Link></Button> */}

        <div className='bg-white mt-10 border-[1px] border-[#D1D1D1] rounded-xl'>
          <Grid className='!p-[26px] !pt-[14px] !pb-0'>
            <div className='col-span-5 self-center'>
              <p className='text-xl font-semibold'>Dealers List</p>
            </div>
            <div className='col-span-7'>
              <div className='bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]'>
                <Grid className='!grid-cols-7' >
                  <div className='col-span-2 self-center'>
                    <Input name='Name' type='text' className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]" label='' placeholder='Name' />
                  </div>
                  <div className='col-span-2 self-center'>
                    <Input name='Email' type='email'className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]" label='' placeholder='Email' />
                  </div>
                  <div className='col-span-2 self-center'>
                    <Input name='PhoneNo.' type='number'className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]" label='' placeholder='Phone No.' />
                  </div>
                  <div className='col-span-1 self-center'>
                    <img src={Search} alt='Search' />
                  </div>
                </Grid>

              </div>
            </div>
          </Grid>
          <div className='mb-5'>
            <DataTable columns={columns} data={data} pagination />
          </div>
        </div>
      </div>
    </>
  )
}
export default DealerList