import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../../common/button";

import ActiveIcon from "../../../assets/images/icons/iconAction.svg";
import clearFilter from "../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import AddItem from "../../../assets/images/icons/addItem.svg";
import Search from "../../../assets/images/icons/SearchIcon.svg";
import unassign from "../../../assets/images/Unassign.png";
import AddDealer from "../../../assets/images/dealer-book.svg";
import Headbar from "../../../common/headBar";
import shorting from "../../../assets/images/icons/shorting.svg";
import Grid from "../../../common/grid";
import Input from "../../../common/input";
import DataTable from "react-data-table-component";
import Primary from "../../../assets/images/SetPrimary.png";
import Select from "../../../common/select";
import { RotateLoader } from "react-spinners";
import { getOrders } from "../../../services/orderServices";
import Modal from "../../../common/model";
import Cross from "../../../assets/images/Cross.png";

function OrderList() {
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [timer, setTimer] = useState(3);
  const [orderList, setOrderList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isDisapprovedOpen, setIsDisapprovedOpen] = useState(false);

  const closeDisapproved = () => {
    setIsDisapprovedOpen(false);
  };

  const openDisapproved = () => {
    setIsDisapprovedOpen(true);
  };

  const openArchive = () => {
    setIsArchiveOpen(true);
  };

  const closeModal1 = () => {
    setIsModalOpen1(false);
  };

  const openModal1 = () => {
    setIsModalOpen1(true);
  };

  const closeArchive = () => {
    setIsArchiveOpen(false);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleSelectChange1 = (label, value) => {
    console.log(label, value, "selected");
    setSelectedProduct(value);
  };
  const [loading, setLoading] = useState(false);

  const status = [
    { label: "Active", value: true },
    { label: "Pending", value: false },
  ];

  useEffect(() => {
    getOrderList();
  }, []);

  const getOrderList = async () => {
    setLoading(true);
    const result = await getOrders({});
    console.log(result.result);
    setOrderList(result.result);
    setLoading(false);
  };
  const calculateDropdownPosition = (index) => {
    const isCloseToBottom = orderList.length - index <= 10000;
    return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
  };

  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
  };

  const CustomNoDataComponent = () => (
    <div className="text-center my-5">
      <p>No records found.</p>
    </div>
  );

  const columns = [
    {
      name: "ID",
      selector: (row) => row?.unique_key,
      sortable: true,
      minWidth: "auto",
      maxWidth: "70px",
    },
    {
      name: "Dealer Order #",
      selector: (row) => row.venderOrder,
      sortable: true,
      minWidth: "180px",
    },
    {
      name: "Dealer",
      selector: (row) => row.dealerName.name,
      sortable: true,
    },
    {
      name: "Customer",
      selector: (row) => row.customerName.username,
      sortable: true,
    },
    // {
    //   name: "Servicer",
    //   selector: (row) => row.servicerName.name,
    //   sortable: true,
    // },
    {
      name: "# of Contract",
      selector: (row) => (row?.noOfProducts == null ? 0 : row.noOfProducts),
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Order Value",
      selector: (row) => `$ ${row.orderAmount?.toFixed(2)}`,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Status",
      cell: (row) => (
        <div className="flex border py-2 rounded-lg w-full">
          <div
            className={` ${
              row.status === "Pending" ? "bg-[#6BD133]" : "bg-[#6BD133]"
            }  h-3 w-3 rounded-full self-center  mr-2 ml-[8px]`}
          ></div>
          <p className="self-center"> {row.status} </p>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Action",
      minWidth: "auto",
      maxWidth: "80px",
      cell: (row, index) => {
        // console.log(index, index % 10 == 9)
        return (
          <div className="relative">
            <div
              onClick={() =>
                setSelectedAction(
                  selectedAction === row.unique_key ? null : row.unique_key
                )
              }
            >
              <img
                src={ActiveIcon}
                className="cursor-pointer	w-[35px]"
                alt="Active Icon"
              />
            </div>
            {selectedAction === row.unique_key && (
              <div
                className={`absolute z-[2] w-[120px] drop-shadow-5xl -right-3 mt-2 p-2 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                  index
                )}`}
              >
                {/* <img src={arrowImage} className={`absolute  object-contain left-1/2 w-[12px] ${index%10 === 9 ? 'bottom-[-5px] rotate-180' : 'top-[-5px]'} `} alt='up arror'/> */}
                {row.status == "Pending" ? (
                  <>
                    <div className="text-center py-1 border-b cursor-pointer">
                      Edit
                    </div>
                    <div
                      className="text-center py-1 border-b cursor-pointer"
                      onClick={() => openModal()}
                    >
                      Process Order
                    </div>
                    <div
                      className="text-center py-1 border-b cursor-pointer"
                      onClick={() => openArchive()}
                    >
                      Archive
                    </div>
                  </>
                ) : (
                  <div className="text-center py-1 cursor-pointer">
                    <Link to={"/orderDetails"}>View</Link>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="my-8 ml-3">
        <Headbar />

        <div className="flex mt-2">
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9	mb-[3px]">Order</p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/"}>Order </Link> /{" "}
              </li>
              <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
                {" "}
                Order List{" "}
              </li>
            </ul>
          </div>
        </div>

        <Button className="!bg-white flex self-center mb-4 rounded-xl ml-auto border-[1px] border-[#D1D1D1]">
          {" "}
          <Link to={"/addOrder"} className="flex">
            {" "}
            <img src={AddItem} className="self-center" alt="AddItem" />{" "}
            <span className="text-black ml-3 text-[14px] font-Regular">
              {" "}
              Add New Order{" "}
            </span>{" "}
          </Link>
        </Button>

        <div className="bg-white mt-6 border-[1px] border-[#D1D1D1] rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className="col-span-3 self-center">
              <p className="text-xl font-semibold">Order List</p>
            </div>
            <div className="col-span-9">
              <div className="bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                <Grid className="!grid-cols-9">
                  <div className="col-span-2 self-center">
                    <Input
                      name="Name"
                      type="text"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="ID"
                    />
                  </div>
                  <div className="col-span-2 self-center">
                    <Input
                      name="orderNo"
                      type="text"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="Dealer Order No."
                    />
                  </div>
                  <div className="col-span-2 self-center">
                    <Select
                      label=""
                      options={status}
                      color="text-[#1B1D21] opacity-50"
                      className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      selectedValue={selectedProduct}
                      onChange={handleSelectChange1}
                    />
                  </div>

                  <div className="col-span-3 self-center flex">
                    <img src={Search} className="cursor-pointer	" alt="Search" />
                    <Button type="submit" className=" !bg-transparent !p-0">
                      <img
                        src={clearFilter}
                        className="cursor-pointer	mx-auto"
                        alt="clearFilter"
                      />
                    </Button>
                    <Button
                      type="submit"
                      className="ml-2 !text-sm"
                      onClick={() => openDisapproved()}
                    >
                      Advance Search
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
                data={orderList}
                highlightOnHover
                sortIcon={
                  <>
                    {" "}
                    <img src={shorting} className="ml-2" alt="shorting" />{" "}
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
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center py-3">
          <img src={AddDealer} alt="email Image" className="mx-auto" />

          <p className="text-3xl mb-0 mt-4 font-bold text-neutral-grey ">
            <span className="text-light-black"> Order Processed </span>{" "}
            Successfully
          </p>

          <p className="text-neutral-grey text-base font-medium mt-2">
            Order Processed Successfully
          </p>
          <p className="text-neutral-grey text-base font-medium mt-2">
            Redirecting you on Order List Page {timer} seconds.
          </p>
        </div>
      </Modal>

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
                name="Dealer Name"
                className="!bg-[#fff]"
                label="Dealer Name"
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

            <div className="col-span-6">
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
    </>
  );
}

export default OrderList;
