import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../common/button";

import ActiveIcon from "../../../assets/images/icons/iconAction.svg";
import clearFilter from "../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import AddItem from "../../../assets/images/icons/addItem.svg";
import Search from "../../../assets/images/icons/SearchIcon.svg";
import unassign from "../../../assets/images/Unassign.png";
import view from "../../../assets/images/eye.png";
import AddDealer from "../../../assets/images/dealer-book.svg";
import Headbar from "../../../common/headBar";
import shorting from "../../../assets/images/icons/shorting.svg";
import Grid from "../../../common/grid";
import Input from "../../../common/input";
import DataTable from "react-data-table-component";
import Primary from "../../../assets/images/SetPrimary.png";
import Select from "../../../common/select";
import { RotateLoader } from "react-spinners";
import { getOrderCustomer } from "../../../services/orderServices";
import Modal from "../../../common/model";
import Cross from "../../../assets/images/Cross.png";
import { useFormik } from "formik";
import * as Yup from "yup";

function CustomerOrderList() {
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
    { label: "Active", value: 'Active' },
    { label: "Pending", value: 'Pending' },
  ];

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      // Close the dropdown if the click is outside of it
      setSelectedAction(null);
    }
  };


  useEffect(() => {
    getOrderList();

    document.addEventListener("click", handleClickOutside);

    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const getOrderList = async (data = {}) => {
    setLoading(true);
    const result = await getOrderCustomer(data);
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
      name: "Order ID",
      selector: (row) => row?.unique_key,
      sortable: true,
      minWidth: "auto",
    },
    {
      name: "Dealer P.O #",
      selector: (row) => row.venderOrder,
      sortable: true,
    },
    // {
    //   name: "Dealer Name",
    //   selector: (row) => row.dealerName.name,
    //   sortable: true,
    // },
    // {
    //   name: "Reseller Name",
    //   selector: (row) => row.resellerName.name,
    //   sortable: true,
    // },
    {
      name: "# of Contract",
      selector: (row) => (row?.noOfProducts == null ? 0 : row.noOfProducts.toLocaleString(2)),
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <div className="flex border py-2 rounded-lg w-[80%] mx-auto">
          <div
            className={` ${row.status === "Pending" ? "bg-[#8B33D1]" : "bg-[#6BD133]"
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
        return (
          <div className="relative">
            {row.status == 'Active' && <div
              onClick={() =>
                setSelectedAction(selectedAction === row.unique_key ? null : row.unique_key)
              }
            >
              <img
                src={ActiveIcon}
                className="cursor-pointer	w-[35px]"
                alt="Active Icon"
              />
            </div>}

            {selectedAction === row.unique_key && (
              <div
                ref={dropdownRef}
                className={`absolute z-[2] w-[80px] drop-shadow-5xl -right-3 mt-2 bg-white border rounded-lg shadow-md bottom-1`}
                onClick={() => localStorage.removeItem("orderMenu")}
              >

                <div className="text-center py-1 cursor-pointer">
                  <Link
                    to={`/customer/orderDetails/${row._id}`}
                    className="text-left cursor-pointer flex hover:font-semibold py-1 px-2"
                  >
                    <img src={view} className="w-4 h-4 mr-2" /> View
                  </Link>
                </div>
              </div>
            )}
          </div>
        );
      },
    },
  ];
  const initialValues = {
    orderId: "",
    venderOrder: "",
    dealerName: "",
    resellerName: "",
    customerName: "",
    servicerName: "",
    status: "",
  };
  const handleFilterIconClick = () => {
    formik.resetForm();
    console.log(formik.values);
    getOrderList();
  };
  const validationSchema = Yup.object().shape({});
  const handleSelectChange = (name, selectedValue) => {
    formik.setFieldValue(name, selectedValue);
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      getOrderList(values);
      closeDisapproved();
      console.log(values);
    },
  });
  return (
    <>
      <div className="mb-8 ml-3">
        <Headbar />

        <div className="flex mt-2">
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9	mb-[3px]">Order</p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/"}>Home </Link> /{" "}
              </li>
              <li className="text-sm text-neutral-grey font-semibold ml-1 pt-[1px]">
                {" "}
                Order List{" "}
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white mt-6 border-[1px] border-Light-Grey rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className="col-span-3 self-center">
              <p className="text-xl font-semibold">Order List</p>
            </div>
            <div className="col-span-9">
              <div className="bg-grayf9 rounded-[30px] p-3 border-[1px] border-Light-Grey">
                <form onSubmit={formik.handleSubmit}>
                  <Grid className="!grid-cols-9">
                    <div className="col-span-2 self-center">
                      <Input
                        name="Name"
                        type="text"
                        className="!text-[14px] !bg-White-Smoke"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
                        label=""
                        placeholder="Order ID"
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
                        placeholder="Dealer P.O #"
                        {...formik.getFieldProps("venderOrder")}
                      />
                    </div>
                    <div className="col-span-2 self-center">
                      <Select
                        label=""
                        options={status}
                        OptionName="Status"
                        color="text-Black-Russian opacity-50"
                        className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                        className="!text-[14px] !bg-White-Smoke"
                        selectedValue={selectedProduct}
                        onChange={handleSelectChange}
                        name="status"
                        value={formik.values.status}
                      />
                    </div>

                    <div className="col-span-3 self-center flex">
                      <Button type="submit" className="!p-2">
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
                reorder={'no'}
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
                draggableColumns={false}
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
        <div className="py-3">
          <p className="text-center text-3xl font-semibold ">Advance Search</p>
          <form onSubmit={formik.handleSubmit}>
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
                  label="Dealer P.O. No."
                  placeholder=""
                  {...formik.getFieldProps("venderOrder")}
                />
              </div>
              {/* <div className="col-span-6">
              <Input
                type="text"
                name="Serial No."
                className="!bg-white"
                label="Serial #"
                placeholder=""
              />
            </div> */}


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

              <div className="col-span-6">
                <Select
                  id="status"
                  label="Status"
                  name="status"
                  options={status}
                  className="!bg-white"
                  placeholder=""
                  value={formik.values.status}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="col-span-12">
                <Button className={"w-full"} type='submit'>Search</Button>
              </div>
            </Grid>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default CustomerOrderList;
