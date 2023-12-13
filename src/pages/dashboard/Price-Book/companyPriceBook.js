import React, { useState } from 'react'

import { Link } from 'react-router-dom'
import Button from '../../../common/button'

import ActiveIcon from '../../../assets/images/icons/iconAction.svg';
import AddItem from '../../../assets/images/icons/addItem.svg';
import Search from '../../../assets/images/icons/SearchIcon.svg';
import Headbar from '../../../common/headBar';
import Grid from '../../../common/grid';
import Input from '../../../common/input';
import Select from '../../../common/select';
import DataTable from "react-data-table-component";
function CompanyPriceBook() {
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
      Categoryid: 1,
      Categoryname: "Category 1",
      description: "Product A",
      productTerm: "12 months",
      wholesaleCost: "$50.00",
      status: "Active",
    },
    {
      Categoryid: 2,
      Categoryname: "Category 2",
      description: "Product B",
      productTerm: "6 months",
      wholesaleCost: "$35.00",
      status: "Inactive",
    },
    // Add more objects as needed
  ];

  const columns = [
    {
      name: "Product ID",
      selector: (row) => row.Categoryid,
      sortable: true,
    },
    {
      name: "Product Category",
      selector: (row) => row.Categoryname,
      sortable: true,
    },
    {
      name: "Product Name",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Product Term",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "WholeSale Cost",
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
          <div onClick={() => setSelectedAction((prev) => !prev)}>
            <img src={ActiveIcon} alt='Active Icon'/>
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
        <div className='flex'>
          <div className='pl-3'>
            <p className='font-bold text-[38px] leading-9	mb-[3px]'>Company Price Book</p>
            <ul className='flex self-center'>
              <li className='text-sm text-neutral-grey font-Regular'><Link to={'/'}>Price Book </Link>  /  </li>
              <li className='text-sm text-neutral-grey font-semibold ml-2 pt-[1px]'> Company Price Book </li>
            </ul>
          </div>
        </div>
        <Button className="!bg-white flex self-center mb-4 rounded-xl ml-auto border-[1px] border-[#D1D1D1]" > <Link to={'/addCompanyPriceBook'} className='flex'> <img src={AddItem} className='self-center' alt='AddItem' /> <span className='text-black ml-3 text-[14px] font-semibold'>Add Company Price Book </span>  </Link></Button>

        <div className='bg-white border-[1px] border-[#D1D1D1] rounded-xl'>
          <Grid className='!p-[26px] !pb-0'>
            <div className='col-span-5 self-center'>
              <p className='text-xl font-semibold'>Product Price List</p>
            </div>
            <div className='col-span-7'>
              <div className='bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]'>
                <Grid className='!grid-cols-11' >
                  <div className='col-span-5 self-center'>
                    <Input name='ProductName' type='text' className1="!pt-2 !pb-1" label='Product Name' />
                  </div>

                  <div className='col-span-5 self-center'>
                    <Select label="Product Category"
                      options={country}
                      className1="!pt-2 !pb-0"
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

export default CompanyPriceBook