import React , { useState } from 'react'

import { Link } from 'react-router-dom'
import Button from '../../../common/button'

import ActiveIcon from '../../../assets/images/icons/iconAction.svg';
import arrowImage from '../../../assets/images/dropdownArrow.png';
import Search from '../../../assets/images/icons/SearchIcon.svg';
import AddItem from '../../../assets/images/icons/addItem.svg';
import Headbar from '../../../common/headBar';
import Grid from '../../../common/grid';
import Input from '../../../common/input';
import DataTable from "react-data-table-component"
import TableComponent from '../../../common/TableComponent';

function ServicerList() {
    const [selectedAction, setSelectedAction] = useState(null);

    const handleActionChange = (action) => {
      // Implement the logic for the selected action (e.g., edit or delete)
      console.log(`Selected action: ${action}`);
      // You can replace the console.log statement with the actual logic you want to perform
    };
    const data = [
      {
        id: 1,
        name: "Item 1",
        description: "Description for Item 1",
        status: "Active",
      },
      {
        id: 2,
        name: "Item 2",
        description: "Description for Item 2",
        status: "Inactive",
      },
      {
        id: 3,
        name: "Item 3",
        description: "Description for Item 3",
        status: "Active",
      },
      {
        id: 4,
        name: "Item 1",
        description: "Description for Item 1",
        status: "Active",
      },
      {
        id: 5,
        name: "Item 2",
        description: "Description for Item 2",
        status: "Inactive",
      },
      {
        id: 6,
        name: "Item 3",
        description: "Description for Item 3",
        status: "Active",
      },
      {
        id: 7,
        name: "Item 1",
        description: "Description for Item 1",
        status: "Active",
      },
      {
        id: 8,
        name: "Item 2",
        description: "Description for Item 2",
        status: "Inactive",
      },
      {
        id: 9,
        name: "Item 3",
        description: "Description for Item 3",
        status: "Active",
      },
      {
        id: 10,
        name: "Item 1",
        description: "Description for Item 1",
        status: "Active",
      },
      {
        id: 11,
        name: "Item 2",
        description: "Description for Item 2",
        status: "Inactive",
      },
      {
        id: 12,
        name: "Item 3",
        description: "Description for Item 3",
        status: "Active",
      },
    ];

    const columns = [
      { key: "id", title: "ID" },
      { key: "name", title: "Name" },
      { key: "description", title: "Description" },
      { key: "status", title: "Status" },
    ];
  
    const pageSize = 2; // Number of items per page
  
  
    return (
      <>
        <div className='my-8 ml-3'>
  
          <Headbar />
  
          <div className='flex mt-14'>
            <div className='pl-3'>
              <p className='font-semibold text-[36px] leading-9	mb-[3px]'>Servicer</p>
              <ul className='flex self-center'>
                <li className='text-sm text-neutral-grey font-Regular'><Link to={'/'}>Servicer </Link> </li>
              </ul>
            </div>
          </div>

          <Button className="!bg-white flex self-center mb-4 rounded-xl ml-auto border-[1px] border-[#D1D1D1]" > <Link to={'/addServicer'} className='flex'> <img src={AddItem} className='self-center' alt='AddItem' /> <span className='text-black ml-3 text-[14px] font-semibold'>Add New Servicer </span>  </Link></Button>
    
          <div className='bg-white mt-6 border-[1px] border-[#D1D1D1] rounded-xl'>
            <Grid className='!p-[26px] !pt-[14px] !pb-0'>
              <div className='col-span-5 self-center'>
                <p className='text-xl font-semibold'>Servicer List</p>
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
                      <Input name='PhoneNo.' type='number'className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]" label='' placeholder='Phone' />
                    </div>
                    <div className='col-span-1 self-center'>
                      <img src={Search} className='cursor-pointer' alt='Search' />
                    </div>
                  </Grid>
  
                </div>
              </div>
            </Grid>
            {/* <div className='mb-5'>
              <DataTable columns={columns} data={data} pagination />
            </div> */}
            <div className="container mx-auto mt-8">
              <TableComponent data={data} columns={columns} pageSize={pageSize} />
            </div>
            
          </div>
  
        </div>
      </>
    )
  }

export default ServicerList