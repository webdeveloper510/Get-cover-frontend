import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
import Button from '../../../common/button'

import ActiveIcon from '../../../assets/images/icons/iconAction.svg';
import AddItem from '../../../assets/images/icons/addItem.svg';
import Search from '../../../assets/images/icons/SearchIcon.svg';
import down from '../../../assets/images/icons/Drop.svg';
import Headbar from '../../../common/headBar';
import Grid from '../../../common/grid';
import Input from '../../../common/input';
import Select from '../../../common/select';
import DataTable from "react-data-table-component";
import { editCompanyList, getCompanyPriceList } from '../../../services/priceBookService';

function CompanyPriceBook() {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedAction, setSelectedAction] = useState(null);
  const [companyPriceList, setCompanyPriceList] = useState([])


  const handleSelectChange1 = (name , value) => {
    setSelectedProduct(value);
  };

  useEffect (()=>{
    getPriceBookListData()
  },[])

  const getPriceBookListData = async () => {
    try {
      const res = await getCompanyPriceList();
      setCompanyPriceList(res.result);
    } catch (error) {
      console.error('Error fetching category list:', error);
    }
  };

  const handleStatusChange = async (row, newStatus) => {
    try {
      const updatedCompanyPriceList = companyPriceList.map((category) => {
        if (category._id === row._id) {
          return { ...category, status: newStatus === 'active' ? true : false };
        }
        return category;
      });

      setCompanyPriceList(updatedCompanyPriceList);

      const result = await editCompanyList(row._id, {
        category: row.category._id,
        reinsuranceFee: row.reinsuranceFee,
        adminFee: row.adminFee,
        reserveFutureFee: row.reserveFutureFee,
        frontingFee: row.frontingFee,
        description: row.description,
        status: newStatus === 'active' ? true : false,
      });

       console.log(result);

      if (result.code === 200 || result.code === 401) {
        console.log('Status updated successfully');
        getPriceBookListData();
      } else {
        getPriceBookListData();
      }
    }
     catch (error) {
      console.error('Error updating category status:', error);
      getPriceBookListData();
    }
  };
  const handleActionChange = (action, row) => {
    console.log(`Selected action: ${action} for Category ID: ${row._id}`);
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



  const columns = [
    {
      name: "Product ID",
      selector: (row) => row.unique_key,
      sortable: true,
    },
    {
      name: "Product Category",
      selector: (row) =>row.category.name, 
      sortable: true,
    },
    {
      name: "Product Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Product Term",
      selector: (row) => row.term,
      sortable: true,
    },
    {
      name: "WholeSale Cost",
      selector: (row) => row.frontingFee + row.reserveFutureFee + row.reinsuranceFee + row.adminFee,
      sortable: true,
    },

    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <div className="relative">
          <div className={` ${row.status === true ? 'bg-[#6BD133]' : 'bg-[#FF4747]'} absolute h-3 w-3 rounded-full top-[33%] ml-1`}></div>
          <select
            value={row.status === true ? "active" : "inactive"}
            onChange={(e) => handleStatusChange(row, e.target.value)}
            className="text-sm border border-gray-300 rounded pl-4 py-2 pr-1 font-semibold rounded-xl"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="relative">
          <div onClick={() => setSelectedAction(row.unique_key)}>
            <img src={ActiveIcon} alt="Active Icon" />
          </div>
          {selectedAction === row.unique_key && (
            <div className="absolute z-[2] w-[70px] drop-shadow-5xl	top-[1.7rem] right-0 mt-2 bg-white border rounded-lg shadow-md">
              <div className="h-0 w-0 border-x-8 absolute top-[-14px] left-1/2 border-x-transparent border-b-[16px] border-b-white"></div>
              <button
                onClick={() => {
                  handleActionChange('Edit', row);
                  setSelectedAction(null);
                }}
                className="block px-4 py-2 text-gray-800 rounded-lg  w-full text-left"
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
      <div className='my-8 ml-3 relative'>
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
                    <Input name='ProductName' type='text' className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-2 !pb-1" label='Product Name' />
                  </div>

                  <div className='col-span-5 self-center'>
                    <Select label="Product Category"
                      options={country}
                      className1="!pt-2 !pb-1 !text-[13px]"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      selectedValue={selectedProduct}
                      onChange={handleSelectChange1} />
                  </div>
                  <div className='col-span-1 self-center'>
                    <img src={Search} className='cursor-pointer	' alt='Search' />
                  </div>
                </Grid>

              </div>
            </div>
          </Grid>

          <div className="overflow-x-auto">
            <DataTable columns={columns} data={companyPriceList} pagination />
          </div>
        </div>
      </div>
    </>
  )
}

export default CompanyPriceBook