import React , { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../../common/button'

import ActiveIcon from '../../../assets/images/icons/iconAction.svg';
import clearFilter from "../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import AddItem from '../../../assets/images/icons/addItem.svg';
import Search from '../../../assets/images/icons/SearchIcon.svg';
import Headbar from '../../../common/headBar';
import shorting from "../../../assets/images/icons/shorting.svg";
import Grid from '../../../common/grid';
import Input from '../../../common/input';
import DataTable from "react-data-table-component"
import Select from '../../../common/select';

function OrderList() {
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('');

  const handleSelectChange1 = (label , value) => {
    console.log(label, value , "selected")
    setSelectedProduct(value);
  };
  const handleActionChange = (action) => {
    // Implement the logic for the selected action (e.g., edit or delete)
    console.log(`Selected action: ${action}`);
    // You can replace the console.log statement with the actual logic you want to perform
  };

  const status = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false },
  ];

  const calculateDropdownPosition = (index) => {
    const isCloseToBottom = data.length - index <= 2;
    return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
  };

  
  const paginationOptions = {
    rowsPerPageText: 'Rows per page:',
    rangeSeparatorText: 'of',
  };

  const data = [
    {
      Categoryid: 1,
      Categoryname: "Category 1",
      Email: "abcd@gmail.com",
      Phoneno:"(095)413-1172",
      Dealername: "Active",
      order:"12",
      orderValue:"$123.00"
    },
    {
      Categoryid: 2,
      Categoryname: "Category 1",
      Email: "abcd@gmail.com",
      Phoneno:"(095)413-1172",
      Dealername: "Active",
      order:"12",
      orderValue:"$123.00"
    },
  ];

  const columns = [
    {
      name: "ID",
      selector: (row) => row.Categoryid,
      sortable: true,
      minWidth:'auto',
      maxWidth:'70px'
    },
    {
      name: "Dealer Order #",
      selector: (row) => row.Categoryname,
      sortable: true,
      minWidth:'180px',
    },
    {
      name: "Dealer",
      selector: (row) => row.Email,
      sortable: true,
    },
    {
      name: "Customer",
      selector: (row) => row.Phoneno,
      sortable: true,
      minWidth:'150px',
    },
    {
      name: "Servicer",
      selector: (row) => row.Dealername,
      sortable: true,
      minWidth:'130px',
    },
    {
      name: "# of Products",
      selector: (row) => row.order,
      sortable: true,
      minWidth:'150px',
    },
    {
      name: "Order Value",
      selector: (row) => row.orderValue,
      sortable: true,
      minWidth:'150px',
    },
    {
        name: "Status",
        cell: (row) => (
            <div className="relative">
              <div
                className={` ${
                  row.status === true ? "bg-[#6BD133]" : "bg-[#FF4747]"
                } absolute h-3 w-3 rounded-full top-[33%] ml-[8px]`}
              ></div>
              <select
                value={row.status === true ? "active" : "inactive"}
                // onChange={(e) => handleStatusChange(row, e.target.value)}
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
        sortable: true,
    },
    {
      name: "Action",
      minWidth:'auto',
      maxWidth:'80px',
      cell: (row, index) => {
        // console.log(index, index % 10 == 9)
        return (
          <div className="relative">
          <div onClick={() => setSelectedAction(selectedAction === row.Categoryid ? null : row.Categoryid)}>
            <img src={ActiveIcon} className='cursor-pointer	w-[35px]' alt="Active Icon" />
          </div>
          {selectedAction === row.Categoryid && (
            <div className={`absolute z-[2] w-[80px] drop-shadow-5xl -right-3 mt-2 p-2 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
              index
            )}`}>
              {/* <img src={arrowImage} className={`absolute  object-contain left-1/2 w-[12px] ${index%10 === 9 ? 'bottom-[-5px] rotate-180' : 'top-[-5px]'} `} alt='up arror'/> */}
                <div className='text-center py-1'>Edit</div>
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

        <Headbar />

        <div className='flex mt-2'>
          <div className='pl-3'>
            <p className='font-bold text-[36px] leading-9	mb-[3px]'>Order</p>
            <ul className='flex self-center'>
              <li className='text-sm text-neutral-grey font-Regular'><Link to={'/'}>Order </Link>  /  </li>
              <li className='text-sm text-neutral-grey font-semibold ml-2 pt-[1px]'> Order List </li>
            </ul>
          </div>
        </div>

        <Button className="!bg-white flex self-center mb-4 rounded-xl ml-auto border-[1px] border-[#D1D1D1]" > <Link to={'/addOrder'} className='flex'> <img src={AddItem} className='self-center' alt='AddItem' /> <span className='text-black ml-3 text-[14px] font-Regular'> Add New Order </span>  </Link></Button>
  
        <div className='bg-white mt-6 border-[1px] border-[#D1D1D1] rounded-xl'>
          <Grid className='!p-[26px] !pt-[14px] !pb-0'>
            <div className='col-span-5 self-center'>
              <p className='text-xl font-semibold'>Order List</p>
            </div>
            <div className='col-span-7'>
              <div className='bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]'>
                <Grid className='!grid-cols-11' >
                  <div className='col-span-3 self-center'>
                    <Input name='Name' type='text' className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]" label='' placeholder='Order ID' />
                  </div>
                  <div className='col-span-3 self-center'>
                    <Input name='orderNo' type='text'className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]" label='' placeholder='Dealer Order No.' />
                  </div>
                  <div className='col-span-3 self-center'>
                  <Select label=""
                      options={status}
                      OptionName='Dealer Name'
                      color='text-[#1B1D21] opacity-50'
                      className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      selectedValue={selectedProduct}
                      onChange={handleSelectChange1} />
                  </div>
                  
                  <div className='col-span-2 self-center flex'>
                    <img src={Search} className='cursor-pointer	'  alt='Search' />
                    <Button type="submit" className='!ml-2 !bg-transparent !p-0'>
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
          <div className='mb-5 relative'>
            <DataTable columns={columns} data={data} highlightOnHover sortIcon={<> <img src={shorting}  className="ml-2" alt="shorting"/> </>} pagination  paginationPerPage={10} paginationComponentOptions={paginationOptions} paginationRowsPerPageOptions={[10, 20, 50, 100]} />
          </div>
        </div>

      </div>
    </>
  )
}

export default OrderList