import React, { useState } from 'react'

import { Link } from 'react-router-dom'
import Button from '../../../common/button'


import AddItem from '../../../assets/images/icons/addItem.svg';
import Search from '../../../assets/images/icons/SearchIcon.svg';
import ActiveIcon from '../../../assets/images/icons/actionIcon.svg';
import Headbar from '../../../common/headBar';
import Grid from '../../../common/grid';
import Input from '../../../common/input';
import Select from '../../../common/select';
import DataTable from "react-data-table-component";

function DealerPriceList() {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedAction, setSelectedAction] = useState(null);

  const handleActionChange = (action) => {
    // Implement the logic for the selected action (e.g., edit or delete)
    console.log(`Selected action: ${action}`);
    // You can replace the console.log statement with the actual logic you want to perform
  };
  const handleSelectChange1 = (e) => {
    setSelectedProduct(e.target.value);
  };

  const country = [
    { label: 'Country', value: 'country' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
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
      name: "Status",
      selector: (row) => row.Status,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="relative">
          <div onClick={() => setSelectedAction((prev) => !prev)}><img src={} alt='Active Icon'/></div>
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
        <div className='flex'>
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
          <Grid className='!p-[26px] !pb-0'>
            <div className='col-span-5 self-center'>
              <p className='text-xl font-semibold'>Dealer Price List</p>
            </div>
            <div className='col-span-7'>
              <div className='bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]'>
                <Grid className='!grid-cols-9' >
                  <div className='col-span-2 self-center'>
                    <Input name='Category' type='text' className1="!pt-2 !pb-1" label='Category' />
                  </div>
                  <div className='col-span-2 self-center'>
                    <Input name='Name' type='text' className1="!pt-2 !pb-1" label='Name' />
                  </div>
                  <div className='col-span-2 self-center'>
                    <Select label="Term"
                      options={country}
                      className1="!pt-2 !pb-1"
                      className="!bg-[#f7f7f7]"
                      selectedValue={selectedProduct}
                      onChange={handleSelectChange1} />
                  </div>
                  <div className='col-span-2 self-center'>
                    <Select label="Status"
                      options={country}
                      className1="!pt-2 !pb-1"
                      className="!bg-[#f7f7f7]"
                      selectedValue={selectedProduct}
                      onChange={handleSelectChange1} />
                  </div>
                  <div className='col-span-1 self-center'>
                    <img src={Search} alt='Search' />
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