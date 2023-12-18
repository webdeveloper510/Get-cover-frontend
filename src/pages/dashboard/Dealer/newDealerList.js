import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import Button from "../../../common/button";

import ActiveIcon from "../../../assets/images/icons/iconAction.svg";
import arrowImage from "../../../assets/images/dropdownArrow.png";
import disapproved from "../../../assets/images/Disapproved.png";
import request from "../../../assets/images/request.png";
import Search from "../../../assets/images/icons/SearchIcon.svg";
import Headbar from "../../../common/headBar";
import Grid from "../../../common/grid";
import Input from "../../../common/input";
import DataTable from "react-data-table-component";
import Modal from "../../../common/model";
import {
  getPendingDealersList,
  isApprovedOrDisapprovedStatus,
} from "../../../services/dealerServices";

function NewDealerList() {
  const [list, setList] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pendingDealerList, setPendingDealerList] = useState([]);

  const toggleDropdown = (index) => {
    setSelectedAction(index);
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleActionChange = async (action, id) => {
    console.log(`Selected action: ${(action, id)}`);
    let data = {
      status: action,
    };
    const result = await isApprovedOrDisapprovedStatus(id, data);
    console.log(result);
    if (result.code === 200) {
      dealerPendingList();
    } else {
      dealerPendingList();
    }

    setIsDropdownOpen(false);
  };

  useEffect(() => {
    dealerPendingList();
  }, []);

  const dealerPendingList = async () => {
    const result = await getPendingDealersList();
    console.log(result.result);
    setPendingDealerList(result.result);
  };
  const calculateDropdownPosition = (index) => {
    const isCloseToBottom = pendingDealerList.length - index <= 2;
    return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
  };
  const columns = [
    {
      name: "Account Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "First Name",
      selector: (row) => row.firstName,
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.lastName,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => row.street + "," + row.city,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Phone No.",
      selector: (row) => row.phoneNumber,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row, index) => (
        <div className="relative">
          <div onClick={() => toggleDropdown(index)}>
            <img
              src={ActiveIcon}
              className="cursor-pointer w-[35px]"
              alt="Active Icon"
            />
          </div>
          {isDropdownOpen && selectedAction === index && (
            <div
              className={`absolute z-[2] w-[80px] drop-shadow-5xl -right-3 mt-2 p-2 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                index
              )}`}
            >
              <div
                className="text-center py-3 border-b border-[#E6E6E6] text-[#40BF73] cursor-pointer"
                onClick={() => handleActionChange("Approved", row.accountId)}
              >
                Approve
              </div>
              <div
                className="text-center py-3 text-[#FF4747] cursor-pointer"
                onClick={() => handleActionChange("Rejected", row.accountId)}
              >
                Disapprove
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [isDisapprovedOpen, setIsDisapprovedOpen] = useState(false);

  const closeDisapproved = () => {
    setIsDisapprovedOpen(false);
  };

  return (
    <>
      <div className="my-8 ml-3">
        <Headbar />
        <div className="flex mt-14">
          <div className="pl-3">
            <p className="font-semibold text-[36px] leading-9 mb-[3px]">
              Dealer
            </p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/dashboard"}>Dealer </Link> /{" "}
              </li>
              <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
                {" "}
                New Dealer Requests{" "}
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white mt-10 border-[1px] border-[#D1D1D1] rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className="col-span-5 self-center">
              <p className="text-xl font-semibold">Request List</p>
            </div>
            <div className="col-span-7">
              <div className="bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                <Grid className="!grid-cols-7">
                  <div className="col-span-2 self-center">
                    <Input
                      name="Name"
                      type="text"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="Name"
                    />
                  </div>
                  <div className="col-span-2 self-center">
                    <Input
                      name="Email"
                      type="email"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="Email"
                    />
                  </div>
                  <div className="col-span-2 self-center">
                    <Input
                      name="PhoneNo."
                      type="number"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="Phone No."
                    />
                  </div>
                  <div className="col-span-1 self-center">
                    <img
                      src={Search}
                      className="cursor-pointer mx-auto"
                      alt="Search"
                    />
                  </div>
                </Grid>
              </div>
            </div>
          </Grid>
          <div className="mb-5">
            <DataTable columns={columns} data={pendingDealerList} pagination />
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {/* <Button onClick={closeModal} className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]">
          <img src={Cross} className="w-full h-full text-black rounded-full p-0" />
        </Button> */}
          <div className="text-center py-3">
            <img src={request} alt="email Image" className="mx-auto" />
            <p className="text-3xl mb-0 mt-4 font-semibold text-light-black">
              Do you really want to approve?
            </p>

            <Grid className="my-5">
              <div className="col-span-3"></div>
              <div className="col-span-3">
                <Button className="w-full !py-3">
                  <Link to={"/dealer"}> Yes </Link>
                </Button>
              </div>
              <div className="col-span-3">
                <Button
                  className="w-full !py-3 !bg-white border-[#D1D1D1] border !text-light-black"
                  onClick={() => setIsDisapprovedOpen(true)}
                >
                  No
                </Button>
              </div>
              <div className="col-span-3"></div>
            </Grid>
          </div>
        </Modal>

        <Modal isOpen={isDisapprovedOpen} onClose={closeDisapproved}>
          {/* <Button onClick={closeModal} className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]">
          <img src={Cross} className="w-full h-full text-black rounded-full p-0" />
        </Button> */}
          <div className="text-center py-3">
            <img src={disapproved} alt="email Image" className="mx-auto" />
            <p className="text-3xl mb-0 mt-4 font-semibold text-neutral-grey">
              {" "}
              <span className="text-light-black"> Disapproved </span>
            </p>
            <p className="text-neutral-grey text-base font-medium mt-2">
              This request has been disapproved by you.{" "}
            </p>
          </div>
        </Modal>
      </div>
    </>
  );
}
export default NewDealerList;
