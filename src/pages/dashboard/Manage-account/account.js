import React, { useEffect, useRef, useState } from 'react'
import Headbar from '../../../common/headBar'
import { Link } from 'react-router-dom'
import BackImage from "../../../assets/images/icons/backArrow.svg";
import Grid from '../../../common/grid';
import Input from '../../../common/input';
import Button from '../../../common/button';
import shorting from "../../../assets/images/icons/shorting.svg";
import ActiveIcon from "../../../assets/images/icons/iconAction.svg";
import DataTable from 'react-data-table-component';
import Modal from '../../../common/model';
import RadioButton from '../../../common/radio';
import { RotateLoader } from 'react-spinners';
import Tabs from '../../../common/tabs';

function Account() {
    const [selectedAction, setSelectedAction] = useState(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [createAccountOption, setCreateAccountOption] = useState("yes");
    const dropdownRef = useRef(null);
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          // Close the dropdown if the click is outside of it
          setSelectedAction(null);
        }
    }
    const closeUserModal = () => {
        setIsUserModalOpen(false);
      };
      const openUserModal = () => {
        setIsUserModalOpen(true);
      };

    const calculateDropdownPosition = (index) => {
        const isCloseToBottom = Data.length - index <= 10000;
        return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
      };

      const handleRadioChange = (event) => {
        const selectedValue = event.target.value;
        // setFieldValue("status", selectedValue === "yes" ? true : false);
        setCreateAccountOption(selectedValue);
      };

    const Data = [
        {
            id : 1,
            name : 'Super Admin',
            email : 'Super@codenomad.net',
            phoneNumber : '9876543210',
            position : 'Admin',
            status: 'active'
        },
        {
            id : 2,
            name : 'Super Admin 1',
            email : 'Super1@codenomad.net',
            phoneNumber : '9871065432',
            position : 'Admin',
            status: 'active'
        }
    ]

    const columns = [
        {
          name: "Name",
          selector: (row) => row?.name,
          sortable: true,
        },
        {
          name: "Email",
          selector: (row) => row?.email,
          sortable: true,
          minWidth: "220px",
        },
        {
          name: "Phone #",
          selector: (row) => row?.phoneNumber,
          sortable: true,
        },
        {
          name: "Position",
          selector: (row) => row.position,
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
                //   onChange={(e) => handleStatusChange(row, e.target.value)}
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
          minWidth: "auto",
          maxWidth: "90px",
          cell: (row, index) => {
            // console.log(index, index % 10 == 9)
            return (
              <div className="relative">
                <div onClick={() => setSelectedAction(row.id)}>
                  <img
                    src={ActiveIcon}
                    className="cursor-pointer	w-[35px]"
                    alt="Active Icon"
                  />
                </div>
                {selectedAction === row.id && (
                  <div
                    ref={dropdownRef}
                    className={`absolute z-[2] w-[80px] drop-shadow-5xl -right-3 mt-2 p-3 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                      index
                    )}`}
                  >
                    <p className='text-center cursor-pointer border-b  pb-2 mb-2' onClick={()=> openUserModal()}>
                      Edit
                    </p>
                    <p className='text-center cursor-pointer'>
                      Delete
                    </p>
                  </div>
                )}
              </div>
            );
          },
        },
      ];

    const CustomNoDataComponent = () => (
        <div className="text-center my-5">
          <p>No records found.</p>
        </div>
      );

      useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
          // Cleanup the event listener on component unmount
          document.removeEventListener("click", handleClickOutside);
        };
      }, []);

      const tabsData = [
        { id: 1, label: 'My Account', content: (
          <>
          <Grid >
          <div className='col-span-4'>
               <div className='bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1'>
                 <p className='text-sm m-0 p-0'>Email</p>
                 <p className='font-semibold'>Super@codenomad.net</p>
               </div>
             </div>
            
             <div className='col-span-4'>
                 <Input 
                     type='text'
                     label='First Name'
                     className='!bg-[#fff]'
                 />
             </div>
             <div className='col-span-4'>
                 <Input 
                     type='text'
                     label='Last Name'
                     className='!bg-[#fff]'
                 />
             </div>
             <div className='col-span-4'>
                 <Input 
                     type='tel'
                     label='Phone #'
                     className='!bg-[#fff]'
                 />
             </div>
             <div className='col-span-4'>
                 <Input 
                     type='text'
                     label='Postion'
                     className='!bg-[#fff]'
                 />
             </div>
             <div className='col-span-4 text-right'>
              
             </div>
             <div className='col-span-12 text-right'>
               <Button> Save Changes</Button>
             </div>
          </Grid>
           
          </>
        ) },
        { id: 2, label: 'Change Password', content: (
          <>
          <Grid>
             <div className='col-span-4'>
                 <Input 
                     type='password'
                     label='Old Password'
                     className='!bg-[#fff]'
                 />
             </div>
             <div className='col-span-4'>
                 <Input 
                     type='password'
                     label='New Password'
                     className='!bg-[#fff]'
                 />
             </div>
             <div className='col-span-4'>
                 <Input 
                     type='password'
                     label='Confirm Password'
                     className='!bg-[#fff]'
                 />
             </div>
          </Grid>
          <div className='mt-4 text-right'>
             <Button>Change Password</Button>
          </div>
          </>
        ) },
      ];

  return (
    <>
     <div className='my-8 ml-3'>
        <Headbar/>
            <div className='flex mt-2'>
            <Link to={'/dashboard'} className='h-[60px] w-[60px] flex border-[1px] bg-white border-[#D1D1D1] rounded-[25px]'>
                <img src={BackImage} className='m-auto my-auto self-center bg-white' alt='BackImage'/>
            </Link>
            <div className='pl-3'>
                <p className='font-bold text-[36px] leading-9 mb-[3px]'>Manage Account</p>
                <ul className='flex self-center'>
                <li className='text-sm text-neutral-grey font-semibold ml-2 pt-[1px]'> Edit Account  </li>
                </ul>
            </div>
            </div>

            <div className='px-8 pb-8 pt-4 mt-5 mb-8 drop-shadow-4xl bg-white border-[1px] border-[#D1D1D1]  rounded-xl relative'>
                 
           
                  <Tabs tabs={tabsData} />
            </div>
            {loading ? (
              <div className=" h-[400px] w-full flex py-5">
                <div className="self-center mx-auto">
                  <RotateLoader color="#333" />
                </div>
              </div>
            ) : (
            <div className='px-8 pb-8 pt-4 mt-5 mb-8 drop-shadow-4xl bg-white border-[1px] border-[#D1D1D1]  rounded-xl relative'>
                <div className='bg-gradient-to-r from-[#dfdfdf] to-[#e9e9e9] rounded-[20px] absolute top-[-17px] right-[-12px] p-3'>
                    <Button onClick={()=> openUserModal()}> + Add Member</Button>
                </div>
                 <p className='text-xl font-semibold mb-3'>Other Super admin details</p>

                 <DataTable
                  columns={columns}
                  data={Data}
                  highlightOnHover
                  sortIcon={
                    <>
                      {" "}
                      <img src={shorting} className="ml-2" alt="shorting" />{" "}
                    </>
                  }
                  noDataComponent={<CustomNoDataComponent />}
                  />
            </div>
            )}
        </div>

        <Modal isOpen={isUserModalOpen} onClose={closeUserModal}>
        <div className=" py-3">
          <p className=" text-center text-3xl mb-5 mt-2 font-bold text-light-black">
            Add New User
          </p>
          <form >
            <Grid className="px-8">
              <div className="col-span-6">
                <Input
                  type="text"
                  name="firstName"
                  label="First Name"
                  required={true}
                  placeholder=""
                  className="!bg-white"
                  maxLength={"30"}
                //   value={userValues.values.firstName}
                //   onBlur={userValues.handleBlur}
                //   onChange={userValues.handleChange}
                //   error={
                //     userValues.touched.firstName && userValues.errors.firstName
                //   }
                />
                {/* {userValues.touched.firstName &&
                  userValues.errors.firstName && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {userValues.errors.firstName}
                    </div>
                  )} */}
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  name="lastName"
                  label="Last Name"
                  required={true}
                  placeholder=""
                  className="!bg-white"
                  maxLength={"30"}
                //   value={userValues.values.lastName}
                //   onBlur={userValues.handleBlur}
                //   onChange={userValues.handleChange}
                //   error={
                //     userValues.touched.lastName && userValues.errors.lastName
                //   }
                />
                {/* {userValues.touched.lastName && userValues.errors.lastName && (
                  <div className="text-red-500 text-sm pl-2 pt-2">
                    {userValues.errors.lastName}
                  </div>
                )} */}
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  name="email"
                  label="Email"
                  placeholder=""
                  className="!bg-white"
                  required={true}
                //   value={userValues.values.email}
                //   onBlur={userValues.handleBlur}
                //   onChange={userValues.handleChange}
                //   error={userValues.touched.email && userValues.errors.email}
                />
                {/* {userValues.touched.email && userValues.errors.email && (
                  <div className="text-red-500 text-sm pl-2 pt-2">
                    {userValues.errors.email}
                  </div>
                )} */}
              </div>
              <div className="col-span-6">
                <Input
                  type="tel"
                  name="phoneNumber"
                  label="Phone"
                  required={true}
                  className="!bg-white"
                  placeholder=""
                //   value={userValues.values.phoneNumber}
                //   onChange={(e) => {
                //     const sanitizedValue = e.target.value.replace(
                //       /[^0-9]/g,
                //       ""
                //     );
                //     console.log(sanitizedValue);
                //     userValues.handleChange({
                //       target: {
                //         name: "phoneNumber",
                //         value: sanitizedValue,
                //       },
                //     });
                //   }}
                //   onBlur={userValues.handleBlur}
                  minLength={"10"}
                  maxLength={"10"}
                //   error={
                //     userValues.touched.phoneNumber &&
                //     userValues.errors.phoneNumber
                //   }
                />
                {/* {(userValues.touched.phoneNumber ||
                  userValues.submitCount > 0) &&
                  userValues.errors.phoneNumber && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {userValues.errors.phoneNumber}
                    </div>
                  )} */}
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  name="position"
                  label="Position"
                  className="!bg-white"
                  placeholder=""
                  maxLength={"50"}
                //   value={userValues.values.position}
                //   onBlur={userValues.handleBlur}
                //   onChange={userValues.handleChange}
                //   error={
                //     userValues.touched.position && userValues.errors.position
                //   }
                />
              </div>
              <div className="col-span-6">
                <p className="text-light-black flex text-[12px] font-semibold mt-3 mb-6">
                  Do you want to create an account?
                  <RadioButton
                    id="yes-create-account"
                    label="Yes"
                    value="yes"
                    checked={createAccountOption === "yes"}
                    onChange={handleRadioChange}
                  />
                  <RadioButton
                    id="no-create-account"
                    label="No"
                    value="no"
                    checked={createAccountOption === "no"}
                    onChange={handleRadioChange}
                  />
                </p>
              </div>
            </Grid>
            <Grid className="drop-shadow-5xl px-8">
              <div className="col-span-4">
                <Button
                  type="button"
                  className="border w-full !border-[#535456] !bg-[transparent] !text-light-black !text-sm !font-Regular"
                  onClick={closeUserModal}
                >
                  Cancel
                </Button>
              </div>
              <div className="col-span-8">
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </div>
            </Grid>
          </form>
        </div>
      </Modal>
    </>
  )
}

export default Account