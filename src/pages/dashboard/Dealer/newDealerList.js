import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
import Button from '../../../common/button'

import ActiveIcon from '../../../assets/images/icons/iconAction.svg';
import approved from '../../../assets/images/approved.png';
import disapproved from '../../../assets/images/Disapproved.png';
import request from '../../../assets/images/request.png';
import Search from '../../../assets/images/icons/SearchIcon.svg';
import Headbar from '../../../common/headBar';
import Grid from '../../../common/grid';
import Input from '../../../common/input';
import DataTable from "react-data-table-component";
import { getDealerList } from '../../../services/priceBookService';
import Modal from '../../../common/model';
function NewDealerList() {
  const [selectedAction, setSelectedAction] = useState(null);
  const [list, setList] = useState(null);

  const handleActionChange = (action) => {
    console.log(`Selected action: ${action}`);
    // You can replace the console.log statement with the actual logic you want to perform
  };
  const data = [
    {
      DealerName: "Dealer Name",
      FirstName: "First ",
      LastName: "Last",
      Address: "Address",
      Email: "Email ",
      PhoneNo: "Phone No.",
      status: "Active",
    },
    {
        DealerName: "Dealer Name 1",
        FirstName: "First ",
        LastName: "Last",
        Address: "Address",
        Email: "Email ",
        PhoneNo: "Phone No.",
        status: "Active",
      },
      {
        DealerName: "Dealer Name 2",
        FirstName: "First ",
        LastName: "Last",
        Address: "Address",
        Email: "Email ",
        PhoneNo: "Phone No.",
        status: "Active",
      },
  ];

  const getDealerListData = async () => {
    try {
      const res = await getDealerList();
      console.log(res.result);
      let arr = [];
      res?.result?.length>0 && res?.result?.map((item)=>{
        arr.push({label:item.name, value:item._id})
      })

      setList(arr);

    
      
    } catch (error) {
      console.error('Error fetching dealer list:', error);
    }
  };
  const columns = [
    {
      name: "Dealer Name",
      selector: (row) => row.DealerName,
      sortable: true,
    },
    {
      name: "First Name",
      selector: (row) => row.FirstName,
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.LastName,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => row.Address,
      sortable: true,
    },
    {
        name: "Email",
        selector: (row) => row.Email,
        sortable: true,
      },
      {
        name: "Phone No.",
        selector: (row) => row.PhoneNo,
        sortable: true,
      },
    {
      name: "Action",
      cell: (row) => (
        <div className="relative">
           <div onClick={() => setIsModalOpen(true)}>
            <img src={ActiveIcon} className='w-[35px] cursor-pointer' alt="Active Icon" />
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [isApprovedOpen, setIsApprovedOpen] = useState(false);

  const openApproved = () => {
    setIsApprovedOpen(true);
    setIsModalOpen(false);
  };

  const closeApproved = () => {
    setIsApprovedOpen(false);
  };

  const [isDisapprovedOpen, setIsDisapprovedOpen] = useState(false);

  const openDisapproved = () => {
    setIsDisapprovedOpen(true);
    setIsModalOpen(false);
  };

  const closeDisapproved = () => {
    setIsDisapprovedOpen(false);
  };

  useEffect(() => {
    getDealerListData()
  }, [])

  return (
    <>
      <div className='my-8 ml-3'>
        <Headbar />
        <div className='flex mt-14'>
          <div className='pl-3'>
            <p className='font-bold text-[36px] leading-9 mb-[3px]'>Dealer</p>
            <ul className='flex self-center'>
              <li className='text-sm text-neutral-grey font-Regular'><Link to={'/dashboard'}>Dealer </Link>  /  </li>
              <li className='text-sm text-neutral-grey font-semibold ml-2 pt-[1px]'> New Dealer Requests </li>
            </ul>
          </div>
        </div>

        <div className='bg-white mt-10 border-[1px] border-[#D1D1D1] rounded-xl'>
          <Grid className='!p-[26px] !pb-0'>
            <div className='col-span-5 self-center'>
              <p className='text-xl font-semibold'>Request List</p>
            </div>
            <div className='col-span-7'>
              <div className='bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]'>
                <Grid className='!grid-cols-7' >
                  <div className='col-span-2 self-center'>
                    <Input name='Name' type='text' className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]" label='' placeholder='Name' />
                  </div>
                  <div className='col-span-2 self-center'>
                    <Input name='Email' type='email' className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]" label='' placeholder='Email' />
                  </div>
                  <div className='col-span-2 self-center'>
                    <Input name='PhoneNo.' type='number' className='!text-[14px] !bg-[#f7f7f7]' className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]" label='' placeholder='Phone No.' />
                  </div>
                  <div className='col-span-1 self-center'>
                    <img src={Search} className='cursor-pointer' alt='Search' />
                  </div>
                </Grid>

              </div>
            </div>
          </Grid>
          <DataTable columns={columns} data={data} pagination />
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
       {/* <Button onClick={closeModal} className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]">
          <img src={Cross} className="w-full h-full text-black rounded-full p-0" />
        </Button> */}
        <div className='text-center py-3'>
          <img src={request} alt='email Image' className='mx-auto'/>
          <p className='text-3xl mb-0 mt-4 font-semibold text-light-black'>Do you really want to approve?</p>
          
          <Grid className='my-5'>
            <div className='col-span-3'></div>
            <div className='col-span-3'>
              <Button className='w-full !py-3' onClick={() => setIsApprovedOpen(true)}>Yes</Button>
            </div>
            <div className='col-span-3'>
              <Button className='w-full !py-3 !bg-white border-[#D1D1D1] border !text-light-black' onClick={() => setIsDisapprovedOpen(true)}>No</Button>
            </div>
            <div className='col-span-3'></div>
          </Grid>

        </div>
        
      </Modal>

      <Modal isOpen={isApprovedOpen} onClose={closeApproved}>
       {/* <Button onClick={closeModal} className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]">
          <img src={Cross} className="w-full h-full text-black rounded-full p-0" />
        </Button> */}
        <div className='text-center py-3'>
          <img src={approved} alt='email Image' className='mx-auto'/>
          <p className='text-3xl mb-0 mt-4 font-semibold text-neutral-grey'><span className='text-light-black'> Approved </span></p>
          <p className='text-neutral-grey text-base font-medium mt-2'>This request has been approved by you.</p>

        </div>
        
      </Modal>
      <Modal isOpen={isDisapprovedOpen} onClose={closeDisapproved}>
       {/* <Button onClick={closeModal} className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]">
          <img src={Cross} className="w-full h-full text-black rounded-full p-0" />
        </Button> */}
        <div className='text-center py-3'>
          <img src={disapproved} alt='email Image' className='mx-auto'/>
          <p className='text-3xl mb-0 mt-4 font-semibold text-neutral-grey'> <span className='text-light-black'> Disapproved </span></p>
          <p className='text-neutral-grey text-base font-medium mt-2'>This request has been disapproved by you. </p>

        </div>
        
      </Modal>
      </div>
    </>
  )
}
export default NewDealerList