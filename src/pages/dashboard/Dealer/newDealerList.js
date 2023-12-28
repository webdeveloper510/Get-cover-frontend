import React, { useEffect, useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import Button from "../../../common/button";

import ActiveIcon from "../../../assets/images/icons/iconAction.svg";
import arrowImage from "../../../assets/images/dropdownArrow.png";
import clearFilter from "../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import disapproved from "../../../assets/images/Disapproved.png";
import request from "../../../assets/images/request.png";
import Search from "../../../assets/images/icons/SearchIcon.svg";
import Headbar from "../../../common/headBar";
import Grid from "../../../common/grid";
import Input from "../../../common/input";
import DataTable from "react-data-table-component";
import Modal from "../../../common/model";
import shorting from "../../../assets/images/icons/shorting.svg";
import Loader from "../../../assets/images/Loader.gif";
import {
  getPendingDealersList,
  isApprovedOrDisapprovedStatus,
} from "../../../services/dealerServices";
import { RotateLoader } from "react-spinners";

function NewDealerList() {
  const [approvalDetails, setApprovalDetails] = useState({
    id: null,
    action: null,
  });
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pendingDealerList, setPendingDealerList] = useState([]);
  const [timer, setTimer] = useState(3);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleDropdown = (index) => {
    setSelectedAction(index);
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleActionChange = async (action, id) => {
    // setIsModalOpen(true);
    console.log(action);

    console.log(`Selected action: ${(action, id)}`);

    // setEditDetails(data);
    if (action) {
      openConfirmModal(id, action);
    }
  };

  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
  };

  useEffect(() => {
    dealerPendingList();
  }, []);

  const dealerPendingList = async () => {
    setLoading(true);

    const result = await getPendingDealersList();
    console.log(result.data);
    setPendingDealerList(result.data);
    setLoading(false);
  };
  const truncateText = (text, maxLength) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };
  const calculateDropdownPosition = (index) => {
    const isCloseToBottom = pendingDealerList.length - index <= 2;
    return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
  };
  const columns = [
    {
      name: "ID",
      selector: (row) => row.dealerData.unique_key,
      sortable: true,
      minWidth: "auto",
      maxWidth: "90px",
    },
    {
      name: "Account Name",
      selector: (row) => row.dealerData.name,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.firstName + " " + row.lastName,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => row.dealerData.street + "," + row.dealerData.city,
      sortable: true,
      minWidth: "220px",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      minWidth: "220px",
    },
    {
      name: "Phone No.",
      selector: (row) => row.phoneNumber,
      sortable: true,
    },
    {
      name: "Action",
      minWidth: "auto",
      maxWidth: "90px",
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
              className={`absolute z-[2] w-[150px] drop-shadow-5xl -right-3 mt-2 p-2 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                index
              )}`}
            >
              <div
                className="text-center py-2 border-b border-[#E6E6E6] text-[#40BF73] cursor-pointer"
                onClick={() => handleActionChange("Approved", row.accountId)}
              >
                Approve
              </div>
              <div
                className="text-center py-2 text-[#FF4747] cursor-pointer"
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
  const [status, setStatus] = useState("");

  const handleClickOutside = (event) => {
    console.log("here");
    setIsDropdownOpen(false);
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openConfirmModal = async (id, action) => {
    setIsDropdownOpen(false);
    setIsModalOpen(true);
    setApprovalDetails({ id, action });
    setStatus(action);
  };
  const approveApi = async () => {
    const { id, action } = approvalDetails;
    console.log(id, action);

    if (action === "Rejected") {
      console.log("yes");
      const result = await isApprovedOrDisapprovedStatus(approvalDetails);
      console.log(result);
      if (result.code === 200) {
        dealerPendingList();
        setIsModalOpen(false);
        setIsDisapprovedOpen(true);
      } else {
        dealerPendingList();
        setIsModalOpen(false);
        setIsDisapprovedOpen(false);
      }
    } else if (action === "Approved") {
      setIsModalOpen(false);
      navigate(`/dealer/${id}`);
    }
  };

  const [isDisapprovedOpen, setIsDisapprovedOpen] = useState(false);

  const closeDisapproved = () => {
    setIsDisapprovedOpen(false);
  };
  useEffect(() => {
    let intervalId;
    if (isDisapprovedOpen && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    if (timer === 0) {
      closeDisapproved();
    }
    return () => clearInterval(intervalId);
  }, [isDisapprovedOpen, timer]);
  return (
    <>
      <div className="my-8 ml-3">
        <Headbar />
        <div className="flex mt-2">
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9 mb-[3px]">Dealer</p>
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
                <Grid className="!grid-cols-11">
                  <div className="col-span-3 self-center">
                    <Input
                      name="Name"
                      type="text"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="Name"
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
                      type="number"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="Phone No."
                    />
                  </div>
                  <div className="col-span-2 self-center flex justify-center">
                    <Button className="!p-0">
                      <img
                        src={Search}
                        className="cursor-pointer	mx-auto"
                        alt="Search"
                      />
                    </Button>
                    <Button
                      type="submit"
                      className="!bg-transparent !ml-2 !p-0"
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
          <div className="mb-5 relative">
            {loading ? (
              <div className=" h-[400px] w-full flex py-5">
                <div className="self-center mx-auto">
                  <RotateLoader color="#333" />
                </div>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={pendingDealerList}
                highlightOnHover
                sortIcon={
                  <>
                    {" "}
                    <img src={shorting} className="ml-2" alt="shorting" />{" "}
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

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {/* <Button onClick={closeModal} className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]">
          <img src={Cross} className="w-full h-full text-black rounded-full p-0" />
        </Button> */}
          <div className="text-center py-3">
            <img src={request} alt="email Image" className="mx-auto" />
            <p className="text-3xl mb-0 mt-4 font-semibold text-light-black">
              {status == "Approved"
                ? "Are you sure you want to continue"
                : " Do you really want to Disapprove"}{" "}
              ?
            </p>

            <Grid className="my-5">
              <div className="col-span-3"></div>
              <div className="col-span-3">
                <Button className="w-full !py-3" onClick={() => approveApi()}>
                  Yes
                </Button>
              </div>
              <div className="col-span-3">
                <Button
                  className="w-full !py-3 !bg-white border-[#D1D1D1] border !text-light-black"
                  onClick={() => setIsModalOpen(false)}
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
            <p className="text-neutral-grey text-base font-medium mt-2">
              Redirecting you to the Dealer Request Page in {timer} seconds.
            </p>
          </div>
        </Modal>
      </div>
    </>
  );
}
export default NewDealerList;
