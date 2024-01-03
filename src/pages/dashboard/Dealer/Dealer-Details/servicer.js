import React , { useState } from 'react'

import { Link } from 'react-router-dom'
import Button from '../../../../common/button'

import ActiveIcon from '../../../../assets/images/icons/iconAction.svg';
import Primary from '../../../../assets/images/SetPrimary.png';
import unassign from '../../../../assets/images/Unassign.png';
import AddItem from '../../../../assets/images/icons/addItem.svg';
import Search from '../../../../assets/images/icons/SearchIcon.svg';
import clearFilter from "../../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import Headbar from '../../../../common/headBar';
import shorting from "../../../../assets/images/icons/shorting.svg";
import Grid from '../../../../common/grid';
import Input from '../../../../common/input';
import DataTable from "react-data-table-component"
import Modal from '../../../../common/model';

function ServicerList() {
    const [selectedAction, setSelectedAction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const closeModal = () => {
      setIsModalOpen(false);
    };
    const openModal = () => {
      setIsModalOpen(true);
    };

    const closeModal1 = () => {
      setIsModalOpen1(false);
    };
    const openModal1 = () => {
      setIsModalOpen1(true);
      setIsModalOpen(false);
    };
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
        name: "Name",
        selector: (row) => row.Categoryname,
        sortable: true,
      },
      {
        name: "Email",
        selector: (row) => row.description,
        sortable: true,
      },
      {
        name: "Phone No.",
        selector: (row) => row.description,
        sortable: true,
      },
      {
        name: "# of Claims",
        selector: (row) => row.description,
        sortable: true,
      },
      {
        name: "Total Claims Value",
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
              <option value="inactive">Inactive</option>
            </select>
          </div>
        ),
      },
      {
        name: "Action",
        minWidth: 'auto',  // Set a custom minimum width
        maxWidth: '70px',  // Set a custom maximum width
        cell: (row, index) => {
          // console.log(index, index % 10 == 9)
          return (
            <div className="relative">
            <div onClick={() => setSelectedAction(row.Categoryid)}>
              <img src={ActiveIcon} className='cursor-pointer	w-[35px]' alt="Active Icon" />
            </div>
            {selectedAction === row.Categoryid && (
              <div className={`absolute z-[2] w-[120px] drop-shadow-5xl -right-3 mt-2 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                  index
                )}`}>
                {/* <img src={arrowImage} className={`absolute  object-contain left-1/2 w-[12px] ${index%10 === 9 ? 'bottom-[-5px] rotate-180' : 'top-[-5px]'} `} alt='up arror'/> */}
                  <div className='text-center pt-3'>View</div>
                  <div className='text-center py-3 cursor-pointer' onClick={()=> openModal()}>Unassigned</div>
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
                <p className='text-xl font-semibold'>Servicer List</p>
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

           {/* Would you like to Unassigned it? */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center py-3">
          <img src={unassign} alt="email Image" className="mx-auto my-4" />
          <p className="text-3xl mb-0 mt-2 font-[800] text-light-black">
          Would you like to Unassigned it? 
          </p>
          <Grid className='!grid-cols-4 my-5 '>
            <div className='col-span-1'></div>
            <Button onClick={()=> openModal1()}>Yes</Button>
            <Button className="border w-full !border-[#535456] !bg-[transparent] !text-light-black !text-sm !font-Regular" onClick={() => closeModal()}>No</Button>
            <div className='col-span-1'></div>
           </Grid>
        </div>
      </Modal>

      <Modal isOpen={isModalOpen1} onClose={closeModal1}>
        <div className="text-center py-3">
          <img src={Primary} alt="email Image" className="mx-auto my-4" />
          <p className="text-3xl mb-0 mt-2 font-[800] text-light-black">
          Unassigned Successfully
          </p>
          <p className='text-neutral-grey text-base font-medium mt-2'>You have successfully Unassigned</p>
        </div>
      </Modal>
      </>
    )
  }

export default ServicerList