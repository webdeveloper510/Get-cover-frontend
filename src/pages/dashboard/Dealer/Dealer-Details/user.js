import React, { useEffect, useRef, useState } from "react";
import Button from "../../../../common/button";

import ActiveIcon from '../../../../assets/images/icons/iconAction.svg';
import star from '../../../../assets/images/icons/star.svg';
import Primary from '../../../../assets/images/SetPrimary.png';
import assign from '../../../../assets/images/Unassign.png';
import Search from '../../../../assets/images/icons/SearchIcon.svg';
import clearFilter from "../../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import shorting from "../../../../assets/images/icons/shorting.svg";
import Grid from "../../../../common/grid";
import Input from "../../../../common/input";
import DataTable from "react-data-table-component";
import { RotateLoader } from "react-spinners";
import Modal from "../../../../common/model";
import { getUserListByDealerId } from "../../../../services/userServices";

function UserList(props) {
  const [selectedAction, setSelectedAction] = useState(null);
  const [userList, setUserList] = useState([]);
  const [isModalOpen, SetIsModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const getUserList = async () => {
    const result = await getUserListByDealerId(props.id);
    console.log(result.result);
    setUserList(result.result);
  };
  useEffect(() => {
    getUserList();
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Close the dropdown if the click is outside of it
        setSelectedAction(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const closeModal = () => {
    isModalOpen(false);
  };
  const openModal = () => {
    SetIsModalOpen(true);
  };
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const closeModal1 = () => {
    setIsModalOpen1(false);
  };
  const openModal1 = () => {
    setIsModalOpen1(true);
  };

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          // Close the dropdown if the click is outside of it
          setSelectedAction(null);
        }
      };
  
      document.addEventListener("click", handleClickOutside);
  
      return () => {
        // Cleanup the event listener on component unmount
        document.removeEventListener("click", handleClickOutside);
      };
    }, []);
    
  const calculateDropdownPosition = (index) => {
    const isCloseToBottom = userList.length - index <= 2;
    return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
  };

  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
  };

  const columns = [
    {
      name: 'Name',
      selector: 'name',
      sortable: true,
      cell: (row) => (
        <div className="flex relative">
          <img src={star} alt='' className="absolute -left-3" />
          <span className="self-center ml-3">{row.firstName} {row.lastName}</span>
        </div>
      ),
    },
    {
      name: "Email Address",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row) => row.phoneNumber,
      sortable: true,
    },
    {
      name: "Position",
      selector: (row) => (row.position !== "" ? row.position : "N/A"),
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
            // onChange={(e) => handleStatusChange(row, e.target.value)}
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
      minWidth: "auto", // Set a custom minimum width
      maxWidth: "90px", // Set a custom maximum width
      cell: (row, index) => {
        // console.log(index, index % 10 == 9)
        return (
          <div className="relative">
            <div
              onClick={() =>
                setSelectedAction(
                  selectedAction === row.email ? null : row.email
                )
              }
            >
              <img
                src={ActiveIcon}
                className="cursor-pointer	w-[35px]"
                alt="Active Icon"
              />
            </div>
            {selectedAction === row.email && (
              <div ref={dropdownRef} className={`absolute z-[9999] w-[120px] drop-shadow-5xl -right-3 mt-2 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                index
              )}`}>
                  <div className='text-center py-2 cursor-pointer border-b' onClick={() => openModal()}>Make Primary</div>
                  <div className='text-center py-2 cursor-pointer border-b'>Edit</div>
                  <div className='text-center text-red-500 py-2 cursor-pointer' onClick={() => openModal1()}>Delete</div>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="my-8">
        <div className="bg-white mt-6 border-[1px] border-[#D1D1D1] rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className="col-span-5 self-center">
              <p className="text-xl font-semibold">Users List</p>
            </div>
            <div className="col-span-7">
              <div className="bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                <Grid className="!grid-cols-11">
                  <div className="col-span-3 self-center">
                    <Input
                      name="Name"
                      type="text"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="First Name"
                    />
                  </div>
                  <div className="col-span-3 self-center">
                    <Input
                      name="Email"
                      type="email"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="Email"
                    />
                  </div>
                  <div className="col-span-3 self-center">
                    <Input
                      name="PhoneNo."
                      type="text"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="Phone "
                    />
                  </div>
                  <div className="col-span-2 self-center flex justify-center">
                    <Button type="submit" className="!p-0 mr-2">
                      <img
                        src={Search}
                        className="cursor-pointer "
                        alt="Search"
                      />
                    </Button>
                    <Button type="submit" className="!bg-transparent !p-0">
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
          <div className="mb-5 relative dealer-detail">
            {loading ? (
              <div className=" h-[400px] w-full flex py-5">
                <div className="self-center mx-auto">
                  <RotateLoader color="#333" />
                </div>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={userList}
                highlightOnHover
                sortIcon={
                  <>
                    {" "}
                    <img src={shorting} className="ml-2" alt="shorting" />
                  </>
                }
                pagination
                paginationPerPage={10}
                paginationComponentOptions={paginationOptions}
                paginationRowsPerPageOptions={[10, 20, 50, 100]}
              />
            )}
          </div>
        </div>
        </div>

        {/* Modal Primary Popop */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="text-center py-3">
            <img src={Primary} alt="email Image" className="mx-auto" />
            <p className="text-3xl mb-0 mt-2 font-semibold text-light-black">
              It's set to Primary
            </p>
            <p className="text-neutral-grey text-base font-medium mt-4">
              We have successfully made this primary
          </p>
        </div>
      </Modal>

            {/* Modal Primary Popop */}
            <Modal isOpen={isModalOpen1} onClose={closeModal1}>
        <div className="text-center py-3">
          <img src={assign} alt="email Image" className="mx-auto" />
          <p className="text-3xl mb-0 mt-2 font-semibold text-light-black">
          Would you like to delete it?
          </p>
           <Grid className='!grid-cols-4 my-5 '>
            <div className='col-span-1'></div>
            <Button >Yes</Button>
            <Button className="border w-full !border-[#535456] !bg-[transparent] !text-light-black !text-sm !font-Regular" onClick={() => closeModal1()}>No</Button>
            <div className='col-span-1'></div>
           </Grid>
        </div>
      </Modal>
      </>
    )
  }

export default UserList;
