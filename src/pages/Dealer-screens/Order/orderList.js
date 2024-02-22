import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../common/button";

import ActiveIcon from "../../../assets/images/icons/iconAction.svg";
import clearFilter from "../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import AddItem from "../../../assets/images/icons/addItem.svg";
import Search from "../../../assets/images/icons/SearchIcon.svg";
import unassign from "../../../assets/images/Unassign.png";
import AddDealer from "../../../assets/images/Disapproved.png";
import Headbar from "../../../common/headBar";
import Edit from "../../../assets/images/Dealer/EditIcon.svg";
import shorting from "../../../assets/images/icons/shorting.svg";
import Grid from "../../../common/grid";
import Input from "../../../common/input";
import DataTable from "react-data-table-component";
import Primary from "../../../assets/images/SetPrimary.png";
import Select from "../../../common/select";
import { RotateLoader } from "react-spinners";
import {
  archiveOrders,
  markPaid,
  processOrders,
} from "../../../services/orderServices";
import Modal from "../../../common/model";
import Cross from "../../../assets/images/Cross.png";
import download from "../../../assets/images/download.png";
import view from "../../../assets/images/eye.png";
import edit from "../../../assets/images/edit-text.png";
import remove from "../../../assets/images/delete.png";
import mark from "../../../assets/images/pay.png";
import process from "../../../assets/images/return.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import PdfGenerator from "../../pdfViewer";
import PdfMake from "../../pdfMakeOrder";
import { getOrdersForDealerPortal } from "../../../services/dealerServices/orderListServices";

function OrderList() {
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [orderId, SetOrderId] = useState("");
  const [timer, setTimer] = useState(3);
  const [orderList, setOrderList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [processOrderErrors, setProcessOrderErrors] = useState([]);
  const [errorList, SetErrorList] = useState([]);
  const [isDisapprovedOpen, setIsDisapprovedOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [primaryMessage, setPrimaryMessage] = useState("");
  const [secondaryMessage, setSecondaryMessage] = useState("");
  const dropdownRef = useRef(null);
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const closeDisapproved = () => {
    setIsDisapprovedOpen(false);
  };

  const openDisapproved = () => {
    setIsDisapprovedOpen(true);
  };

  const openArchive = (id) => {
    setMessage("Would you like to Archive it?");
    SetOrderId(id);
    setIsArchiveOpen(true);
  };

  const closeModal1 = () => {
    setIsModalOpen1(false);
  };
  const handleSelectChange = (name, selectedValue) => {
    formik.setFieldValue(name, selectedValue);
  };
  const handleFilterIconClick = () => {
    formik.resetForm();
    console.log(formik.values);
    getOrderList();
  };
  useEffect(() => {
    let intervalId;
    if (isModalOpen1 && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    if (timer === 0) {
      closeArchive();
      getOrderList();
      closeModal1();
    }
    return () => clearInterval(intervalId);
  }, [isModalOpen1, timer]);

  const openModal1 = () => {
    console.log(orderId);
    if (message == "Would you like to Archive it?") {
      archiveOrders(orderId).then((res) => {
        setPrimaryMessage("Archive Order Successfully");
        setSecondaryMessage("You have successfully archive the order");
        // console.log(res);
        setTimer(3);
        setIsModalOpen1(true);
      });
    } else {
      markPaid(orderId).then((res) => {
        if (res.code == 200) {
          setPrimaryMessage("Order Successfully Paid.");
          setSecondaryMessage("You have successfully marked the order as paid");
          setTimer(3);
          setIsModalOpen1(true);
        }
      });
    }
  };

  const closeArchive = () => {
    setIsArchiveOpen(false);
  };

  const validationSchema = Yup.object().shape({});

  const initialValues = {
    orderId: "",
    venderOrder: "",
    dealerName: "",
    resellerName: "",
    customerName: "",
    servicerName: "",
    status: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      getOrderList(values);

      console.log(values);
    },
  });

  const openModal = (id) => {
    setData(id);
    processOrders(id).then((res) => {
      setSelectedAction(null);
      setProcessOrderErrors(res.result);
      SetErrorList(res.result);
      // console.log(res.result);
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [loading, setLoading] = useState(false);

  const status = [
    { label: "Active", value: "Active" },
    { label: "Pending", value: "Pending" },
  ];

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setSelectedAction(null);
    }
  };

  useEffect(() => {
    getOrderList();

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const getOrderList = async (data = {}) => {
    closeDisapproved(false);
    setLoading(true);
    const result = await getOrdersForDealerPortal(data);
    console.log(result.result);
    setOrderList(result.result);
    setLoading(false);
  };
  const calculateDropdownPosition = (index) => {
    const isCloseToBottom = 1 - index <= 1;
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

  const markasPaid = async (row) => {
    setMessage(
      `Would you prefer to make the full payment $ ${row.orderAmount} ?`
    );
    SetOrderId(row._id);
    setIsArchiveOpen(true);
  };

  const formatOrderValue = (orderValue) => {
    if (Math.abs(orderValue) >= 1e6) {
      return (orderValue / 1e6).toFixed(2) + "M";
    } else {
      return orderValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row?.unique_key,
      sortable: true,
      minWidth: "auto",
      maxWidth: "123px",
    },
    {
      name: "Dealer P.O #",
      selector: (row) => row.venderOrder,
      sortable: true,
      minWidth: "180px",
    },
    {
      name: "Customer",
      selector: (row) => row.customerName.username,
      sortable: true,
    },
    {
      name: "# Contracts",
      selector: (row) => (row?.noOfProducts == null ? 0 : row.noOfProducts),
      sortable: true,
      minWidth: "100px",
    },
    {
      name: "Order Value",
      selector: (row) =>   `$ ${
        row?.orderAmount === undefined
          ? parseInt(0).toLocaleString(2)
          :  formatOrderValue(row?.orderAmount) 
      }`,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Status",
      cell: (row) => (
        <div className="flex border py-2 rounded-lg w-[80%] mx-auto">
          <div
            className={` ${
              row.status === "Pending" ? "bg-[#8B33D1]" : "bg-[#6BD133]"
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
              onClick={()=> setSelectedAction(null)}
                ref={dropdownRef}
                className={`absolute z-[2] w-[140px] drop-shadow-5xl -right-3 mt-2 p-2 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                  index
                )}`}
              >
                {/* <img src={arrowImage} className={`absolute  object-contain left-1/2 w-[12px] ${index%10 === 9 ? 'bottom-[-5px] rotate-180' : 'top-[-5px]'} `} alt='up arror'/> */}
                {row.status == "Pending" ? (
                  <>
                    <div
                      className="text-left py-1 flex border-b hover:font-semibold cursor-pointer"
                      onClick={() => navigate(`/dealer/editOrder/${row._id}`)}
                    >
                      <img src={edit} className="w-4 h-4 mr-2" /> Edit
                    </div>
                    <div
                      className="text-left py-1 flex border-b hover:font-semibold cursor-pointer"
                      onClick={() => openModal(row._id)}
                    >
                      <img src={process} className="w-4 h-4 mr-2" /> Process
                      Order
                    </div>
                    <>
                      <PdfGenerator
                        data={row._id}
                        onClick={() => setSelectedAction(null)}
                      />
                    </>
                    <div
                      className="text-left py-1 flex cursor-pointer hover:font-semibold"
                      onClick={() => openArchive(row._id)}
                    >
                      <img src={remove} className="w-4 h-4 mr-2" /> Archive
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      to={`/dealer/orderDetails/${row._id}`}
                      className="text-left py-1 cursor-pointer hover:font-semibold border-b w-full flex justify-start"
                    >
                      <img src={view} className="w-4 h-4 mr-2" /> View
                    </Link>
                    <PdfGenerator
                      data={row._id}
                      onClick={() => setSelectedAction(null)}
                    />
                    <PdfMake data={row._id} />
                  </>
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
          <Link to={"/dealer/addOrder"} className="flex">
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
                <form onSubmit={formik.handleSubmit}>
                  <Grid className="!grid-cols-9">
                    <div className="col-span-2 self-center">
                      <Input
                        name="Name"
                        type="text"
                        className="!text-[14px] !bg-[#f7f7f7]"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                        label=""
                        placeholder="ID"
                        {...formik.getFieldProps("orderId")}
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
                        {...formik.getFieldProps("venderOrder")}
                      />
                    </div>
                    <div className="col-span-2 self-center">
                      <Select
                        label=""
                        options={status}
                        OptionName='Status'
                        color="text-[#1B1D21] opacity-50"
                        className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                        className="!text-[14px] !bg-[#f7f7f7]"
                        selectedValue={selectedProduct}
                        onChange={handleSelectChange}
                        name="status"
                        value={formik.values.status}
                      />
                    </div>

                    <div className="col-span-3 self-center flex">
                      <Button type="submit" className=" !bg-transparent !p-0">
                        <img
                          src={Search}
                          className="cursor-pointer	"
                          alt="Search"
                        />
                      </Button>

                      <Button
                        type="submit"
                        className=" !bg-transparent !p-0"
                        onClick={() => {
                          handleFilterIconClick();
                        }}
                      >
                        <img
                          src={clearFilter}
                          className="cursor-pointer	mx-auto"
                          alt="clearFilter"
                        />
                      </Button>
                      <Button
                        type="button"
                        className="ml-2 !text-sm"
                        onClick={() => openDisapproved()}
                      >
                        Advance Search
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
        <Button
          onClick={() => {
            navigate(`/editOrder/${data}`);
          }}
          className="absolute left-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]"
        >
          <img
            src={Edit}
            className="w-full h-full text-black rounded-full p-0"
          />
        </Button>
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
            Order can not be process to the following reasons : <br />
            <span>{errorList} . </span>
          </p>
        </div>
      </Modal>

      <Modal isOpen={isArchiveOpen} onClose={closeArchive}>
        <div className="text-center py-3">
          <img src={unassign} alt="email Image" className="mx-auto my-4" />
          <p className="text-3xl mb-0 mt-2 font-[800] text-light-black">
            {message}
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
            {primaryMessage}
          </p>
          <p className="text-neutral-grey text-base font-medium mt-2">
            {secondaryMessage}
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
        <form onSubmit={formik.handleSubmit}>
          <div className="py-3">
            <p className="text-center text-3xl font-semibold ">
              Advance Search
            </p>
            <Grid className="mt-5 px-6">
              <div className="col-span-6">
                <Input
                  type="text"
                  id="orderId"
                  className="!bg-[#fff]"
                  label="Order ID"
                  placeholder=""
                  {...formik.getFieldProps("orderId")}
                />
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  id="venderOrder"
                  className="!bg-[#fff]"
                  label="Dealer P.O. No."
                  placeholder=""
                  {...formik.getFieldProps("venderOrder")}
                />
              </div>
              {/* <div className="col-span-6">
                  <Input
                    type="text"
                    id="serialNo"
                    className="!bg-[#fff]"
                    label="Serial No."
                    placeholder=""
                    {...formik.getFieldProps("serialNo")}
                  />
                </div> */}
              <div className="col-span-6">
                <Input
                  type="text"
                  id="dealerName"
                  className="!bg-[#fff]"
                  label="Dealer Name"
                  placeholder=""
                  {...formik.getFieldProps("dealerName")}
                />
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  id="resellerName"
                  className="!bg-[#fff]"
                  label="Reseller Name"
                  placeholder=""
                  {...formik.getFieldProps("resellerName")}
                />
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  id="customerName"
                  className="!bg-[#fff]"
                  label="Customer Name"
                  placeholder=""
                  {...formik.getFieldProps("customerName")}
                />
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  id="servicerName"
                  className="!bg-[#fff]"
                  label="Servicer Name"
                  placeholder=""
                  {...formik.getFieldProps("servicerName")}
                />
              </div>
              <div className="col-span-6">
                <Select
                  id="status"
                  label="Status"
                  name="status"
                  options={status}
                  className="!bg-[#fff]"
                  placeholder=""
                  value={formik.values.status}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="col-span-12">
                <Button type="submit" className={"w-full"}>
                  Search
                </Button>
              </div>
            </Grid>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default OrderList;
