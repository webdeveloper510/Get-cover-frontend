import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { getArchiveOrders, getOrders } from "../../../services/orderServices";
import Modal from "../../../common/model";
import Cross from "../../../assets/images/Cross.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getArchiveOrdersForDealerPortal, getArchiveOrdersForResellerPortal } from "../../../services/dealerServices/orderListServices";

function ArchiveOrderList() {
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [timer, setTimer] = useState(3);
  const [orderList, setOrderList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isDisapprovedOpen, setIsDisapprovedOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const closeDisapproved = () => {
    setIsDisapprovedOpen(false);
  };
  const location = useLocation();
  const validationSchema = Yup.object().shape({});

  const initialValues = {
    orderId: "",
    venderOrder: "",
    // serialNo: "",
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

  const handleFilterIconClick = () => {
    formik.resetForm();
    console.log(formik.values);
    getOrderList();
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

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      // Close the dropdown if the click is outside of it
      setSelectedAction(null);
    }
  };
  useEffect(() => {
    getOrderList();
  }, [location]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const getOrderList = async (data = {}) => {
    closeDisapproved();
    setLoading(true);
    const result = location.pathname.includes("/dealer/archiveOrder")
  ? await getArchiveOrdersForDealerPortal(data)
  : location.pathname.includes("/reseller/archiveOrder")
  ? await getArchiveOrdersForResellerPortal(data)
  : await getArchiveOrders(data);
    console.log(result.result);
    setOrderList(result.result);
    setLoading(false);
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
      maxWidth: "123px",
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
      name: "# of Contract",
      selector: (row) => (row?.noOfProducts == null ? 0 : row.noOfProducts),
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Order Value",
      selector: (row) => `$${row.orderAmount?.toLocaleString(2)}`,
      sortable: true,
      minWidth: "150px",
    },
  ];

  return (
    <>
      <div className="mb-8 ml-3">
        <Headbar />

        <div className="flex mt-2">
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9	mb-[3px]">
              {" "}
              Archive Order
            </p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/"}>Order </Link> /{" "}
              </li>
              <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
                {" "}
                Archive Order List{" "}
              </li>
            </ul>
          </div>
        </div>

        <Button className="!bg-white flex self-center mb-4 rounded-xl ml-auto border-[1px] border-Light-Grey">
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

        <div className="bg-white mt-6 border-[1px] border-Light-Grey rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className="col-span-5 self-center">
              <p className="text-xl font-semibold">Archive Order List</p>
            </div>
            <div className="col-span-7">
              <div className="bg-grayf9 rounded-[30px] p-3 border-[1px] border-Light-Grey">
                <form onSubmit={formik.handleSubmit}>
                  <Grid className="!grid-cols-7">
                    <div className="col-span-2 self-center">
                      <Input
                        name="Name"
                        type="text"
                        className="!text-[14px] !bg-White-Smoke"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
                        label=""
                        placeholder="ID"
                        {...formik.getFieldProps("orderId")}
                      />
                    </div>
                    <div className="col-span-2 self-center">
                      <Input
                        name="orderNo"
                        type="text"
                        className="!text-[14px] !bg-White-Smoke"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
                        label=""
                        placeholder="Dealer Order No."
                        {...formik.getFieldProps("venderOrder")}
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
              <DataTable draggableColumns={false}  columns={columns}
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
              className="border w-full !border-Bright-Grey !bg-[transparent] !text-light-black !text-sm !font-Regular"
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
          className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-Granite-Gray"
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
                  className="!bg-white"
                  label="Order ID"
                  placeholder=""
                  {...formik.getFieldProps("orderId")}
                />
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  id="venderOrder"
                  className="!bg-white"
                  label="Dealer P.O. #"
                  placeholder=""
                  {...formik.getFieldProps("venderOrder")}
                />
              </div>
              {location.pathname.includes("/dealer/archiveOrder") !== true ? ( <div className="col-span-6">
                <Input
                  type="text"
                  id="dealerName"
                  className="!bg-white"
                  label="Dealer Name"
                  placeholder=""
                  {...formik.getFieldProps("dealerName")}
                />
              </div>) : (<>
              </>)}
             
              <div className="col-span-6">
                <Input
                  type="text"
                  id="resellerName"
                  className="!bg-white"
                  label="Reseller Name"
                  placeholder=""
                  {...formik.getFieldProps("resellerName")}
                />
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  id="customerName"
                  className="!bg-white"
                  label="Customer Name"
                  placeholder=""
                  {...formik.getFieldProps("customerName")}
                />
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  id="servicerName"
                  className="!bg-white"
                  label="Servicer Name"
                  placeholder=""
                  {...formik.getFieldProps("servicerName")}
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

export default ArchiveOrderList;
