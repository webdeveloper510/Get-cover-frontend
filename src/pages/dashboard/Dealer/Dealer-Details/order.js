import React , { useState } from 'react'

import { Link } from 'react-router-dom'
import Button from '../../../../common/button'

import ActiveIcon from '../../../../assets/images/icons/iconAction.svg';
import arrowImage from '../../../../assets/images/dropdownArrow.png';
import AddItem from '../../../../assets/images/icons/addItem.svg';
import Search from '../../../../assets/images/icons/SearchIcon.svg';
import clearFilter from "../../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import Headbar from '../../../../common/headBar';
import shorting from "../../../../assets/images/icons/shorting.svg";
import Grid from '../../../../common/grid';
import Input from '../../../../common/input';
import DataTable from "react-data-table-component"

function OrderList() {
    const [selectedAction, setSelectedAction] = useState(null);

    const handleStatusChange = (action) => {
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
    };

    const calculateDropdownPosition = (index) => {
      const isCloseToBottom = data.length - index <= 2;
      return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
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
        name: "Dealer Order #",
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
        name: "# of Products",
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
        cell: (row) => (
          <div className="relative">
            <div
              className={` ${
                row.status === true ? "bg-[#6BD133]" : "bg-[#FF4747]"
              } absolute h-3 w-3 rounded-full top-[33%] ml-[8px]`}
            ></div>
            <select
              value={row.status === true ? "active" : "inactive"}
              onChange={(e) => handleStatusChange(row, e.target.value)}
              className="text-[12px] border border-gray-300 text-[#727378] rounded pl-[20px] py-2 pr-1 font-semibold rounded-xl"
            >
             <option value="active">Active</option>
                <option value="waiting">Waiting</option>
                <option value="expired">Expired</option>
                <option value="canceled">Canceled</option>
                <option value="refunded">Refunded</option>
            </select>
          </div>
        ),
      },
      {
        name: "Action",
        minWidth: 'auto', 
        maxWidth: '90px', 
        cell: (row, index) => {
          // console.log(index, index % 10 == 9)
          return (
            <div className="relative">
            <div onClick={() => setSelectedAction(row.Categoryid)}>
              <img src={ActiveIcon} className='cursor-pointer	w-[35px]' alt="Active Icon" />
            </div>
            {selectedAction === row.Categoryid && (
              <div className={`absolute z-[2] w-[70px] drop-shadow-5xl -right-3 mt-2 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                index
              )}`}>
                  <div className='text-center pt-3 pb-1 cursor-pointer'>Edit</div>
                  <div className='text-center pb-3 pt-2 border-t cursor-pointer'>View</div>
              </div>
            )}
          </div>
          )
        }
        
      },
    ];
  
    return (
      <>
        <div className='my-8'>    
          <div className='bg-white mt-6 border-[1px] border-[#D1D1D1] rounded-xl'>
            <Grid className='!p-[26px] !pt-[14px] !pb-0'>
              <div className='col-span-5 self-center'>
                <p className='text-xl font-semibold'>Orders List</p>
              </div>
              <div className='col-span-7'>
                <div className='bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]'>
                  <Grid className='!grid-cols-11' >
                    <div className='col-span-3 self-center'>
                      <Input name='Name' type='text' className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]" label='' placeholder='Order ID' />
                    </div>
                    <div className='col-span-3 self-center'>
                      <Input name='Email' type='email'className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]" label='' placeholder='Dealer Order no.' />
                    </div>
                    <div className='col-span-3 self-center'>
                      <Input name='PhoneNo.' type='text'className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]" label='' placeholder='Customer Name' />
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
            <div className='mb-5 relative dealer-detail'>
              <DataTable columns={columns} data={data} highlightOnHover sortIcon={<> <img src={shorting}  className="ml-2" alt="shorting"/>
              </>} pagination  paginationPerPage={10} paginationComponentOptions={paginationOptions} paginationRowsPerPageOptions={[10, 20, 50, 100]} />
            </div>
          </div>
  
        </div>
      </>
    )
  }

export default OrderList