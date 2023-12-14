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
import { useEffect } from 'react';
import { editCategoryList, getCategoryList } from '../../../services/priceBookService';

function Category() {
  const [selectedAction, setSelectedAction] = useState(null);
  const [categoryList, setCategoryList] = useState([])

  useEffect(() => {
    getCategoryListData()
  }, [])

  const getCategoryListData = async () => {
    try {
      const res = await getCategoryList();
      setCategoryList(res.result);
    } catch (error) {
      console.error('Error fetching category list:', error);
    }
  };

  const handleActionChange = (action, row) => {
    console.log(`Selected action: ${action} for Category ID: ${row._id}`);
  };

  const columns = [
    {
      name: "Category ID",
      selector: (row) => row.unique_key,
      sortable: true,
    },
    {
      name: "Category Name",
      selector: (row) => row.name,
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
      cell: (row) => (
        <div className="relative">
          <div className={` ${row.status === true ? 'bg-[#6BD133]' : 'bg-[#FF4747]'} absolute h-3 w-3 rounded-full top-[33%] ml-[10px]`}></div>
          <select
            value={row.status === true ? "active" : "inactive"}
            onChange={(e) => handleStatusChange(row, e.target.value)}
            className="text-sm border border-gray-300 text-[#727378] rounded pl-[20px] py-2 pr-1 font-semibold rounded-xl"
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
            <img src={ActiveIcon} className='cursor-pointer	' alt="Active Icon" />
          </div>
          {/* {selectedAction === row.unique_key && (
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
          )} */}
        </div>
      ),
    },
  ];

  const handleStatusChange = async (row, newStatus) => {
    try {
      const updatedCategoryList = categoryList.map((category) => {
        if (category._id === row._id) {
          return { ...category, status: newStatus === 'active' ? true : false };
        }
        return category;
      });

      setCategoryList(updatedCategoryList);

      const result = await editCategoryList(row._id, {
        name: row.name,
        description: row.description,
        status: newStatus === 'active' ? true : false,
      });

      console.log(result);

      if (result.code === 200 || result.code === 401) {
        console.log('Status updated successfully');
        getCategoryListData();
      } else {
        getCategoryListData();
      }
    } catch (error) {
      console.error('Error updating category status:', error);
      getCategoryListData();
    }
  };


  return (
    <>
      <div className='my-8 ml-3 relative'>
        <Headbar />
        <div className='flex'>
          <div className='pl-3'>
            <p className='font-bold text-[38px] leading-9	mb-[3px]'>Category</p>
            <ul className='flex self-center'>
              <li className='text-sm text-neutral-grey font-Regular'><Link to={'/'}>Price Book </Link>  /  </li>
              <li className='text-sm text-neutral-grey font-semibold ml-2 pt-[1px]'> Category </li>
            </ul>
          </div>
        </div>
        <Button className="!bg-white flex self-center mb-4 rounded-xl ml-auto border-[1px] border-[#D1D1D1]" > <Link to={'/addCategory'} className='flex'> <img src={AddItem} className='self-center' alt='AddItem' /> <span className='text-black ml-3 text-[14px] font-semibold'>Add Category </span>  </Link></Button>

        <div className='bg-white  border-[1px] border-[#D1D1D1] rounded-xl '>
          <Grid className='!px-[26px] !pt-[14px] !pb-0'>
            <div className='col-span-7 self-center'>
              <p className='text-xl font-semibold'>Categories List</p>
            </div>
            <div className='col-span-5'>
              <div className='bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]'>
                <Grid className='!grid-cols-6' >
                  <div className='col-span-5 self-center'>
                    <Input name='CategoryName' type='text'  className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-2 !pb-1" label='Category Name' />
                  </div>
                  <div className='col-span-1 self-center'>
                    <img src={Search} className='cursor-pointer	' alt='Search' />
                  </div>
                </Grid>

              </div>
            </div>
          </Grid>
          <DataTable columns={columns} data={categoryList} pagination />
        </div>
      </div>
    </>
  )
}
export default Category