import React , { useState } from 'react'

import { Link } from 'react-router-dom'
import Button from '../../../../common/button'

import ActiveIcon from '../../../../assets/images/icons/iconAction.svg';
import arrowImage from '../../../../assets/images/dropdownArrow.png';
import Search from '../../../../assets/images/icons/SearchIcon.svg';
import AddItem from '../../../../assets/images/icons/addItem.svg';
import Headbar from '../../../../common/headBar';
import shorting from "../../../../assets/images/icons/shorting.svg";
import Grid from '../../../../common/grid';
import Input from '../../../../common/input';
import DataTable from "react-data-table-component"

function OrderList() {
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

    const paginationOptions = {
      rowsPerPageText: 'Rows per page:',
      rangeSeparatorText: 'of',
      selectAllRowsItem: true,
      selectAllRowsItemText: 'All',
    };
  
    const columns = [
      {
        name: "ID",
        selector: (row) => row.Categoryid,
        sortable: true,
        minWidth: 'auto',  // Set a custom minimum width
        maxWidth: '70px',  // Set a custom maximum width
      },
      {
        name: "Dealer Order no.",
        selector: (row) => row.Categoryname,
        sortable: true,
      },
      {
        name: "Customer Name",
        selector: (row) => row.description,
        sortable: true,
      },
      {
        name: "Servicer Name",
        selector: (row) => row.description,
        sortable: true,
      },
      {
        name: "No. of Products",
        selector: (row) => row.description,
        sortable: true,
      },
      {
        name: "Order Value",
        selector: (row) => row.status,
        sortable: true,
      },
      {
        name: "Status",
        selector: (row) => row.status,
        sortable: true,
      },
      {
        name: "Action",
        minWidth: 'auto',  // Set a custom minimum width
        maxWidth: '70px',  // Set a custom maximum width
        cell: (row, index) => {
          // console.log(index, index % 10 == 9)
          return (
            <div className="relative">
            <div onClick={() => setSelectedAction(row.unique_key)}>
              <img src={ActiveIcon} className='cursor-pointer	w-[35px]' alt="Active Icon" />
            </div>
            {selectedAction === row.unique_key && (
              <div className={`absolute z-[2] w-[70px] drop-shadow-5xl -right-3 mt-2 bg-white border rounded-lg shadow-md ${index%10 === 9 ? 'bottom-[1.3rem] ' : 'top-[1.3rem]'}`}>
                <img src={arrowImage} className={`absolute  object-contain left-1/2 w-[12px] ${index%10 === 9 ? 'bottom-[-5px] rotate-180' : 'top-[-5px]'} `} alt='up arror'/>
                  <div className='text-center py-3'>Edit</div>
              </div>
            )}
          </div>
          )
        }
        
      },
    ];
  
    return (
      <>
        <div className='my-8 ml-3'>    
          <div className='bg-white mt-6 border-[1px] border-[#D1D1D1] rounded-xl'>
            <Grid className='!p-[26px] !pt-[14px] !pb-0'>
              <div className='col-span-5 self-center'>
                <p className='text-xl font-semibold'>Orders List</p>
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
            <div className='mb-5 relative'>
              <DataTable columns={columns} data={data} highlightOnHover sortIcon={<> <img src={shorting}  className="ml-2" alt="shorting"/>
              </>} pagination  paginationPerPage={10} paginationComponentOptions={paginationOptions} paginationRowsPerPageOptions={[10, 20, 50, 100]} />
            </div>
          </div>
  
        </div>
      </>
    )
  }

export default OrderList