import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import Button from "../../../common/button";

import ActiveIcon from "../../../assets/images/icons/iconAction.svg";
import disapproved from "../../../assets/images/Disapproved.png";
import clearFilter from "../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import request from "../../../assets/images/request.png";
import Search from "../../../assets/images/icons/SearchIcon.svg";
import shorting from "../../../assets/images/icons/shorting.svg";
import Headbar from "../../../common/headBar";
import Grid from "../../../common/grid";
import Input from "../../../common/input";
import DataTable from "react-data-table-component";
import { getDealerList } from "../../../services/priceBookService";
import Modal from "../../../common/model";
import {
  addNewServicerRequest,
  isApprovedOrDisapprovedStatus,
} from "../../../services/servicerServices";
import { RotateLoader } from "react-spinners";
import { useFormik } from "formik";
import * as Yup from "yup";

function RequestServicer() {
  const [list, setList] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [timer, setTimer] = useState(3);
  const [approvalDetails, setApprovalDetails] = useState({
    id: null,
    action: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toggleDropdown = (index) => {
    setSelectedAction(index);
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleActionChange = async (action, id) => {
    console.log(action);
    console.log(`Selected action: ${(action, id)}`);
    if (action) {
      openConfirmModal(id, action);
    }
  };
  const openConfirmModal = async (id, action) => {
    setIsModalOpen(true);
    setApprovalDetails({ id, action });
    console.log(action);
    setStatus(action);
  };
  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
  };

  const getRequestServicerList = async () => {
    setLoading(true);
    const result = await addNewServicerRequest("Pending");
    setList(result.data);
    console.log(result.data);
    setLoading(false);
  };
  const calculateDropdownPosition = (index) => {
    const isCloseToBottom = list?.length - index <= 2;
    return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
    },
    validationSchema: Yup.object({
      name: Yup.string(),
      email: Yup.string(),
      phone: Yup.number(),
    }),
    onSubmit: async (values) => {
      console.log("Form values:", values);
      filterServicerRequest(values);
    },
  });
  const filterServicerRequest = async (data) => {
    try {
      setLoading(true);
      const res = await addNewServicerRequest("Pending", data);
      console.log(res.data);
      setList(res.data);
    } catch (error) {
      console.error("Error fetching category list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterIconClick = () => {
    formik.resetForm();
    console.log(formik.values);
    getRequestServicerList();
  };

  const columns = [
    {
      name: "Account Name",
      selector: (row) => row.servicerData.name,
      sortable: true,
      minWidth: "200px",
    },
    {
      name: "Name",
      selector: (row) => row.firstName + " " + row.lastName,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) =>
        row.servicerData.street +
        " " +
        row.servicerData.city +
        " " +
        row.servicerData.state,
      sortable: true,
      minWidth: "250px",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      minWidth: "200px",
    },
    {
      name: "Phone No.",
      selector: (row) => row.phoneNumber,
      sortable: true,
    },
    {
      name: "Action",
      minWidth: "auto",
      maxWidth: "80px",
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
              className={`absolute z-[2] w-[130px] drop-shadow-5xl -right-3 mt-2 p-1 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                index
              )}`}
            >
              <div
                className="text-center py-2 border-b cursor-pointer border-[#E6E6E6] text-[12px] text-[#40BF73]"
                onClick={() => handleActionChange("Approved", row.accountId)}
              >
                Approve
              </div>
              <div
                className="text-center py-2 text-[#FF4747] text-[12px] cursor-pointer"
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
  const [isDisapprovedOpen, setIsDisapprovedOpen] = useState(false);

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
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const CustomNoDataComponent = () => (
    <div className="text-center my-5">
      <p>No records found.</p>
    </div>
  );

  const approveApi = async () => {
    const { id, action } = approvalDetails;
    console.log(id, action);

    if (action === "Rejected") {
      console.log("yes");

      const result = await isApprovedOrDisapprovedStatus(approvalDetails);
      console.log(result);
      if (result.code === 200) {
        getRequestServicerList();
        setIsModalOpen(false);
        setIsDisapprovedOpen(true);
      } else {
        getRequestServicerList();
        setIsModalOpen(false);
        setIsDisapprovedOpen(false);
      }
    } else if (action === "Approved") {
      setIsModalOpen(false);
      navigate(`/addServicer/${id}`);
    }
  };

  const closeDisapproved = () => {
    setIsDisapprovedOpen(false);
  };

  useEffect(() => {
    getRequestServicerList();
  }, []);

  return (
    <>
      <div className="my-8 ml-3">
        <Headbar />
        <div className="flex mt-2">
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9 mb-[3px]">Servicer</p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/servicerList"}>Servicer </Link> /{" "}
              </li>
              <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
                {" "}
                New Servicer Requests{" "}
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
                <form onSubmit={formik.handleSubmit}>
                  <Grid className="!grid-cols-11">
                    <div className="col-span-3 self-center">
                      <Input
                        name="name"
                        type="text"
                        className="!text-[14px] !bg-[#f7f7f7]"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                        label=""
                        placeholder="Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    <div className="col-span-3 self-center">
                      <Input
                        name="email"
                        type="text"
                        className="!text-[14px] !bg-[#f7f7f7]"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                        label=""
                        placeholder="Email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    <div className="col-span-3 self-center">
                      <Input
                        name="phone"
                        type="tel"
                        className="!text-[14px] !bg-[#f7f7f7]"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                        label=""
                        placeholder="Phone No."
                        value={formik.values.phone}
                        onChange={(e) => {
                          const sanitizedValue = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                          console.log(sanitizedValue);
                          formik.handleChange({
                            target: {
                              name: "phone",
                              value: sanitizedValue,
                            },
                          });
                        }}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    <div className="col-span-2 self-center flex">
                      <Button type="submit" className="!p-0">
                        <img
                          src={Search}
                          className="cursor-pointer"
                          alt="Search"
                        />
                      </Button>
                      <Button
                        type="submit"
                        onClick={() => {
                          handleFilterIconClick();
                        }}
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
                </form>
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
                data={list}
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
                noDataComponent={<CustomNoDataComponent />}
              />
            )}
          </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
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
export default RequestServicer;
