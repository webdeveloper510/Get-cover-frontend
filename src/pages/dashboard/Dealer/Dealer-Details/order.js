import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import Button from "../../../../common/button";

import ActiveIcon from "../../../../assets/images/icons/iconAction.svg";
import arrowImage from "../../../../assets/images/dropdownArrow.png";
import AddItem from "../../../../assets/images/icons/addItem.svg";
import Search from "../../../../assets/images/icons/SearchIcon.svg";
import clearFilter from "../../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import Headbar from "../../../../common/headBar";
import shorting from "../../../../assets/images/icons/shorting.svg";
import Grid from "../../../../common/grid";
import Input from "../../../../common/input";
import DataTable from "react-data-table-component";
import Select from "../../../../common/select";
import { getOrderListByDealerId } from "../../../../services/dealerServices";
import { getOrderListByResellerId } from "../../../../services/reSellerServices";
import { getOrderListByCustomerId } from "../../../../services/customerServices";
import { RotateLoader } from "react-spinners";
import Modal from "../../../../common/model";
import Cross from "../../../../assets/images/Cross.png";
import unassign from "../../../../assets/images/Unassign.png";
import Primary from "../../../../assets/images/SetPrimary.png";
import AddDealer from "../../../../assets/images/Disapproved.png";
import {
  archiveOrders,
  getOrders,
  processOrders,
} from "../../../../services/orderServices";
function OrderList(props) {
  console.log(props);
  const [selectedAction, setSelectedAction] = useState(null);
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorList, SetErrorList] = useState([]);
  const [processOrderErrors, setProcessOrderErrors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timer, setTimer] = useState(3);
  const [isDisapprovedOpen, setIsDisapprovedOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const navigate = useNavigate();

    const closeDisapproved = () => {
    setIsDisapprovedOpen(false);
  };

  const openDisapproved = () => {
    setIsDisapprovedOpen(true);
  };

  const openArchive = (id) => {
    setIsArchiveOpen(true);
  };

  const openModal = (id) => {
    processOrders(id).then((res) => {
      setProcessOrderErrors(res.result);
      SetErrorList(res.result);
      console.log(res.result);
    });
    setIsModalOpen(true);
  };
 
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeModal1 = () => {
    setIsModalOpen1(false);
  };
  const openModal1 = () => {
    // console.log(orderId);
    // archiveOrders(orderId).then((res) => {
    //   console.log(res);
    // });
    setTimer(3);
    setIsModalOpen1(true);
  };

  const closeArchive = () => {
    setIsArchiveOpen(false);
  };
  useEffect(() => {
    if (props.activeTab === "Orders" || props.activeTab === "Order") {
      getOrderList();
    }
  }, [props]);
  const getOrderList = async () => {
    setLoading(true);
    let result = {};
    if (props.flag == "reseller") {
      result = await getOrderListByResellerId(props.id);
    } else if (props.flag == "customer") {
      result = await getOrderListByCustomerId(props.id);
    } else if (props.flag == "dealer") {
      result = await getOrderListByDealerId(props.id);
    }
    setOrderList(result.result);
    setLoading(false);
    console.log(result);
  };

  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
  };

  const calculateDropdownPosition = (index) => {
    const isCloseToBottom = orderList.length - index <= 10000;
    return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row.unique_key,
      sortable: true,
      minWidth: "auto", // Set a custom minimum width
      maxWidth: "70px", // Set a custom maximum width
    },
    {
      name: "Dealer P.O #",
      selector: (row) => row.venderOrder,
      sortable: true,
    },
    {
      name: "Reseller",
      selector: (row) => row.resellerName.name,
      sortable: true,
    },
    {
      name: "Customer",
      selector: (row) => row.customerName.username,
      sortable: true,
    },
    {
      name: "# of Products",
      selector: (row) => row.noOfProducts,
      sortable: true,
    },
    {
      name: "Order Value",
      selector: (row) => "$" + (row?.orderAmount ?? 0).toFixed(2),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <div className="flex border py-2 rounded-lg w-[80%]">
          <div
            className={` ${
              row.status === "Pending" ? "bg-[#8B33D1]" : "bg-[#6BD133]"
            }  h-3 w-3 rounded-full self-center  mr-2 ml-[8px]`}
          ></div>
          <p className="self-center"> {row.status} </p>
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
            <div onClick={() => setSelectedAction(row.unique_key)}>
              <img
                src={ActiveIcon}
                className="cursor-pointer	w-[35px]"
                alt="Active Icon"
              />
            </div>
            {selectedAction === row.unique_key && (
              <div
                className={`absolute z-[2] w-[120px] drop-shadow-5xl px-3 py-2 -right-3 mt-2 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                  index
                )}`}
              >
                {row.status == "Pending" ? (
                  <>
                    <div
                      className="text-center py-1 border-b cursor-pointer"
                      onClick={() => navigate(`/editOrder/${row._id}`)}
                    >
                      Edit
                    </div>
                    <div
                      className="text-center py-1 border-b cursor-pointer"
                      onClick={() => openModal(row._id)}
                    >
                      Process Order
                    </div>
                    <div
                      className="text-center py-1 cursor-pointer"
                      onClick={() => openArchive(row._id)}
                    >
                      Archive
                    </div>
                  </>
                ) : (
                    <Link to={`/orderDetails/${row._id}`} className="text-center py-1 cursor-pointer w-full flex justify-center">View</Link>
                
                )}
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

  const status = [
    { label: "Active", value: true },
    { label: "Pending", value: false },
  ];

  return (
    <>
      <div className="my-8">
        <div className="bg-white mt-6 border-[1px] border-[#D1D1D1] rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className="col-span-5 self-center">
              <p className="text-xl font-semibold">Orders List</p>
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
                      placeholder="ID"
                    />
                  </div>
                  <div className="col-span-3 self-center">
                    <Input
                      name="Email"
                      type="email"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="Dealer Order no."
                    />
                  </div>
                  <div className="col-span-3 self-center">
                    <Select
                      label=""
                      options={status}
                      color="text-[#1B1D21] opacity-50"
                      className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                      className="!text-[14px] !bg-[#f7f7f7]"
                    />
                  </div>
                  <div className="col-span-2 self-center flex justify-center">
                    <Button type="submit" className="!p-0">
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
          </div> ) : (
            <DataTable
              columns={columns}
              data={orderList}
              highlightOnHover
              sortIcon={
                <>
                  {" "}
                  <img src={shorting} className="ml-2" alt="shorting" />
                </>
              }
              pagination
              paginationPerPage={10}
              noDataComponent={<CustomNoDataComponent />}
              paginationComponentOptions={paginationOptions}
              paginationRowsPerPageOptions={[10, 20, 50, 100]}
            />
          )}
          </div>
        </div>
      </div>

      <Modal isOpen={isArchiveOpen} onClose={closeArchive}>
        <div className="text-center py-3">
          <img src={unassign} alt="email Image" className="mx-auto my-4" />
          <p className="text-3xl mb-0 mt-2 font-[800] text-light-black">
            Would you like to Archive it?
          </p>
          <Grid className="!grid-cols-4 my-5 ">
            <div className="col-span-1"></div>
            <Button onClick={() => openModal1()}>Yes</Button>
            <Button
              className="border w-full !border-[#535456] !bg-[transparent] !text-light-black !text-sm !font-Regular"
              onClick={() => closeArchive()}
            >
              No
            </Button>
            <div className="col-span-1"></div>
          </Grid>
        </div>
      </Modal>

      <Modal isOpen={isModalOpen1} onClose={closeModal1}>
        <div className="text-center py-3">
          <img src={Primary} alt="email Image" className="mx-auto my-4" />
          <p className="text-3xl mb-0 mt-2 font-[800] text-light-black">
            Archive Order Successfully
          </p>
          <p className="text-neutral-grey text-base font-medium mt-2">
            You have successfully archive the order
          </p>
          <p className="text-neutral-grey text-base font-medium mt-2">
            Redirecting you on Order List Page {timer} seconds.
          </p>
        </div>
      </Modal>

      <Modal isOpen={isDisapprovedOpen} onClose={closeDisapproved}>
        <Button
          onClick={closeDisapproved}
          className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]"
        >
          <img
            src={Cross}
            className="w-full h-full text-black rounded-full p-0"
          />
        </Button>
        <div className="py-3">
          <p className="text-center text-3xl font-semibold ">Advance Search</p>
          <Grid className="mt-5 px-6">
            <div className="col-span-6">
              <Input
                type="text"
                name="Order ID"
                className="!bg-[#fff]"
                label="Order ID"
                placeholder=""
              />
            </div>
            <div className="col-span-6">
              <Input
                type="text"
                name="Dealer P.O. No."
                className="!bg-[#fff]"
                label="Dealer P.O. No."
                placeholder=""
              />
            </div>
            <div className="col-span-6">
              <Input
                type="text"
                name="Serial No."
                className="!bg-[#fff]"
                label="Serial No."
                placeholder=""
              />
            </div>
            <div className="col-span-6">
              <Input
                type="text"
                name="Reseller Name"
                className="!bg-[#fff]"
                label="Reseller Name"
                placeholder=""
              />
            </div>

            <div className="col-span-6">
              <Input
                type="text"
                name="Customer Name"
                className="!bg-[#fff]"
                label="Customer Name"
                placeholder=""
              />
            </div>
            <div className="col-span-6">
              <Input
                type="text"
                name="Servicer Name"
                className="!bg-[#fff]"
                label="Servicer Name"
                placeholder=""
              />
            </div>

            <div className="col-span-12">
              <Select
                name="Status"
                label="Status"
                options={status}
                className="!bg-[#fff]"
                placeholder=""
              />
            </div>
            <div className="col-span-12">
              <Button className={"w-full"}>Search</Button>
            </div>
          </Grid>
        </div>
      </Modal>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <Button
          onClick={closeModal}
          className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]"
        >
          <img
            src={Cross}
            className="w-full h-full text-black rounded-full p-0"
          />
        </Button>
        <div className="text-center py-3">
          <img src={AddDealer} alt="email Image" className="mx-auto" />

          <p className="text-3xl mb-0 mt-4 font-bold text-neutral-grey ">
            <span className="text-light-black">Error</span>{" "}
          </p>

          <p className="text-neutral-grey text-base font-medium mt-2">
            {errorList &&
              errorList.map((res) => {
                console.log(res);
                return (
                  <p className="text-neutral-grey text-base font-medium mt-2">
                    {res}
                  </p>
                );
              })}
          </p>
        </div>
      </Modal>
    </>
  );
}

export default OrderList;
