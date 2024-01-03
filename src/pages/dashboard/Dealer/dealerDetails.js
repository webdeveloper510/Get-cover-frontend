import React, { useEffect, useState } from "react";
import Headbar from "../../../common/headBar";
import { Link, useNavigate, useParams } from "react-router-dom";
import Grid from "../../../common/grid";
import Button from "../../../common/button";

// Media Import
import BackImage from "../../../assets/images/icons/backArrow.svg";
import address from "../../../assets/images/Dealer/Address.svg";
import name from "../../../assets/images/Dealer/Name.svg";
import AddItem from "../../../assets/images/icons/addItem.svg";
import OrderActive from "../../../assets/images/Dealer/Order-active.svg";
import Order from "../../../assets/images/Dealer/Orders.svg";
import ContractsActive from "../../../assets/images/Dealer/Contract-active.svg";
import ClaimActive from "../../../assets/images/Dealer/Claim-active.svg";
import ServicerActive from "../../../assets/images/Dealer/Servicer-active.svg";
import CustomerActive from "../../../assets/images/Dealer/Customer-active.svg";
import UserActive from "../../../assets/images/Dealer/User-active.svg";
import PriceBookActive from "../../../assets/images/Dealer/PriceBook-active.svg";
import Contract from "../../../assets/images/Dealer/Contract.svg";
import Claim from "../../../assets/images/Dealer/Claim.svg";
import Servicer from "../../../assets/images/Dealer/Servicer.svg";
import Customer from "../../../assets/images/Dealer/Customers.svg";
import User from "../../../assets/images/Dealer/Users.svg";
import PriceBook from "../../../assets/images/Dealer/PriceBook.svg";
import email from "../../../assets/images/Dealer/Email.svg";
import phone from "../../../assets/images/Dealer/Phone.svg";
import OrderList from "./Dealer-Details/order";
import ContractList from "./Dealer-Details/contract";
import ClaimList from "./Dealer-Details/claim";
import ServicerList from "./Dealer-Details/servicer";
import UserList from "./Dealer-Details/user";
import PriceBookList from "./Dealer-Details/priceBook";
import CustomerList from "./Dealer-Details/customer";
import Modal from "../../../common/model";
import shorting from "../../../assets/images/icons/shorting.svg";
import Input from "../../../common/input";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import Select from "../../../common/select";
import {
  editDealerData,
  getDealersDetailsByid,
} from "../../../services/dealerServices";
import { cityData } from "../../../stateCityJson";
import { RotateLoader } from "react-spinners";
import DataTable from "react-data-table-component";
import RadioButton from "../../../common/radio";

function DealerDetails() {
  const getInitialActiveTab = () => {
    const storedTab = localStorage.getItem("menu");
    return storedTab ? storedTab : "Orders";
  };
  const [activeTab, setActiveTab] = useState(getInitialActiveTab()); // Set the initial active tab
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [dealerDetails, setDealerDetails] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [initialFormValues, setInitialFormValues] = useState({
    accountName: "",
    dealerId: "",
    street: "",
    city: "",
    zip: "",
    state: "",
    country: "USA",
    oldName: "",
  });
  const id = useParams();
  const state = cityData;

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModal1 = () => {
    setIsModalOpen1(true);
  };
  const closeModal1 = () => {
    setIsModalOpen1(false);
  };

  useEffect(() => {
    dealerData();
  }, [id.id]);
  useEffect(() => {
    localStorage.setItem("menu", activeTab);
  }, [activeTab]);

  const dealerData = async () => {
    console.log(id);
    const result = await getDealersDetailsByid(id?.id);
    setDealerDetails(result.result[0]);
    console.log(result.result[0].dealerData);
    setInitialFormValues({
      accountName: result?.result[0]?.dealerData?.name,
      oldName: result?.result[0]?.dealerData?.name,
      dealerId: id.id,
      street: result?.result[0]?.dealerData?.street,
      city: result?.result[0]?.dealerData?.city,
      zip: result?.result[0]?.dealerData?.zip,
      state: result?.result[0]?.dealerData?.state,
      country: "USA",
    });
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleSelectChange = async (name, value) => {
    formik.setFieldValue(name, value);
  };
  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      dealerId: Yup.string().required("Required"),
      accountName: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .required("Required")
        .max(500, "Must be exactly 500 characters"),
      street: Yup.string()
        .required("Required")
        .max(500, "Must be exactly 500 characters"),
      state: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .required("Required"),
      city: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .required("Required"),
      country: Yup.string().required("Required"),
      zip: Yup.string()
        .required("Required")
        .min(5, "Must be at least 5 characters")
        .max(6, "Must be exactly 6 characters"),
    }),

    onSubmit: async (values) => {
      console.log(values);
      setLoading(true);
      const result = await editDealerData(values);
      console.log(result.code);
      if (result.code == 200) {
        dealerData();
        setMessage("Dealer updated Successfully");
        setLoading(false);
        setIsModalOpen(false);
      }
    },
  });

  const columns = [
    {
      name: "Dealer ID",
      selector: (row) => row.id,
      sortable: true,
      minWidth: "33%",
      center: true,
    },
    {
      name: "Dealer Name",
      selector: (row) => row.Servicername,
      sortable: true,
      minWidth: "50%",
      center: true,
    },
    {
      name: "Action",
      center: true,
      minWidth: "12%",
      cell: (row, index) => {
        // console.log(index, index % 10 == 9)
        return (
          <div>
            <input type="checkbox" className="accent-gray-600	" />
          </div>
        );
      },
    },
  ];

  const data = [
    {
      id: 1899,
      Servicername: "Ankush Grover",
    },
    {
      id: 1900,
      Servicername: "Ankush Grover",
    },
    {
      id: 1901,
      Servicername: "Ankush Grover",
    },
    {
      id: 1902,
      Servicername: "Ankush Grover",
    },
    {
      id: 1903,
      Servicername: "Ankush Grover",
    },
    {
      id: 1904,
      Servicername: "Ankush Grover",
    },
    {
      id: 1905,
      Servicername: "Ankush Grover",
    },
    {
      id: 1906,
      Servicername: "Ankush Grover",
    },
  ];

  const CustomNoDataComponent = () => (
    <div className="text-center">
      <p>No records found.</p>
    </div>
  );

  const tabs = [
    {
      id: "Orders",
      label: "Orders",
      icons: Order,
      Activeicons: OrderActive,
      content: <OrderList />,
    },
    {
      id: "Contracts",
      label: "Contracts",
      icons: Contract,
      Activeicons: ContractsActive,
      content: <ContractList />,
    },
    {
      id: "Claims",
      label: "Claims",
      icons: Claim,
      Activeicons: ClaimActive,
      content: <ClaimList />,
    },
    {
      id: "Servicer",
      label: "Servicer",
      icons: Servicer,
      Activeicons: ServicerActive,
      content: <ServicerList />,
    },
    {
      id: "Customers",
      label: "Customers",
      icons: Customer,
      Activeicons: CustomerActive,
      content: <CustomerList id={id.id} />,
    },
    {
      id: "Users",
      label: "Users",
      icons: User,
      Activeicons: UserActive,
      content: <UserList id={id.id} />,
    },
    {
      id: "PriceBook",
      label: "PriceBook",
      icons: PriceBook,
      Activeicons: PriceBookActive,
      content: <PriceBookList id={id.id} />,
    },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };
  const routeToPage = (data) => {
    console.log(data, id.id);
    switch (data) {
      case "PriceBook":
        localStorage.setItem("menu", "PriceBook");
        navigate(`/addDealerBook/${id.id}`);
        break;
      case "Customers":
        localStorage.setItem("menu", "Customers");
        navigate(`/addCustomer/${id.id}`);
        break;
      default:
        console.log("Invalid data, no navigation");
    }
  };
  return (
    <>
      {loading && (
        <div className=" fixed z-[999999] bg-[#333333c7] backdrop-blur-xl  h-screen w-full flex py-5">
          <div className="self-center mx-auto">
            <RotateLoader color="#fff" />
          </div>
        </div>
      )}
      <div className="py-8 px-3 relative overflow-x-hidden bg-[#F9F9F9]">
        <Headbar />

        <div className="flex">
          <div onClick={() => localStorage.removeItem("menu")}>
            <Link
              to={"/dashboard"}
              className="h-[60px] w-[60px] flex border-[1px] bg-white border-[#D1D1D1] rounded-[25px]"
            >
              <img
                src={BackImage}
                className="m-auto my-auto self-center bg-white"
                alt="BackImage"
              />
            </Link>
          </div>
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9 mb-[3px]">
              Dealer Details
            </p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/"}>Dealer / </Link>{" "}
              </li>
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/"}> Dealer List / </Link>{" "}
              </li>
              <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
                {" "}
                Dealer Detail ({activeTab})
              </li>
            </ul>
          </div>
        </div>

        <Grid className="!grid-cols-4">
          <div className="col-span-1">
            <div className=" bg-Dealer-details bg-cover mt-5 p-5 rounded-[20px]">
              <Grid>
                <div className="col-span-9">
                  <p className="text-sm text-neutral-grey font-Regular">
                    Account Name
                  </p>
                  <p className="text-xl text-white font-semibold">
                    {dealerDetails?.dealerData?.name}
                  </p>
                </div>
                <div className="col-span-3 text-end">
                  <Button
                    className="border !border-[#535456] !text-sm !font-Regular"
                    onClick={openModal}
                  >
                    Edit
                  </Button>
                </div>
              </Grid>
              <div className="flex my-4">
                <img
                  src={address}
                  className="mr-3 bg-[#383838] rounded-[14px] my-auto"
                  alt="Address"
                />
                <div>
                  <p className="text-sm text-neutral-grey font-Regular mt-3">
                    Address
                  </p>
                  <p className="text-base text-white font-semibold leading-5">
                    {dealerDetails?.dealerData?.street},{" "}
                    {dealerDetails?.dealerData?.city},{" "}
                    {dealerDetails?.dealerData?.state}{" "}
                    {dealerDetails?.dealerData?.zip}, USA
                  </p>
                </div>
              </div>
              <div className="flex w-full my-4">
                <p className="text-[10px] mr-3 text-[#999999] font-Regular">
                  PRIMARY CONTACT DETAILS
                </p>
                <hr className="self-center border-[#999999] w-[50%]" />
              </div>
              <div className="flex mb-4">
                <img
                  src={name}
                  className="mr-3 bg-[#383838] rounded-[14px]"
                  alt="Name"
                />
                <div>
                  <p className="text-sm text-neutral-grey font-Regular">Name</p>
                  <p className="text-base text-white font-semibold ">
                    {dealerDetails?.firstName} {dealerDetails?.lastName}
                  </p>
                </div>
              </div>
              <div className="flex mb-4">
                <img
                  src={email}
                  className="mr-3 bg-[#383838] rounded-[14px]"
                  alt="email"
                />
                <div>
                  <p className="text-sm text-neutral-grey font-Regular">
                    Email
                  </p>
                  <p className="text-base text-white font-semibold ">
                    {dealerDetails?.email}
                  </p>
                </div>
              </div>
              <div className="flex mb-4">
                <img
                  src={phone}
                  className="mr-3 bg-[#383838] rounded-[14px]"
                  alt="name"
                />
                <div>
                  <p className="text-sm text-neutral-grey font-Regular">
                    Phone Number
                  </p>
                  <p className="text-base text-white font-semibold ">
                    +1 {dealerDetails?.phoneNumber}
                  </p>
                </div>
              </div>
              <Grid className="mt-5">
                <div className="col-span-6 ">
                  <div className="bg-[#2A2A2A] self-center px-4 py-6 rounded-xl">
                    <p className="text-white text-lg font-semibold ">0</p>
                    <p className="text-[#999999] text-sm font-Regular ">
                      Total Number of Orders
                    </p>
                  </div>
                </div>
                <div className="col-span-6 ">
                  <div className="bg-[#2A2A2A] self-center px-4 py-6 rounded-xl">
                    <p className="text-white text-lg  !font-[600]">$0.00</p>
                    <p className="text-[#999999] text-sm font-Regular">
                      Total Value of Orders
                    </p>
                  </div>
                </div>
                <div className="col-span-6 ">
                  <div className="bg-[#2A2A2A] self-center px-4 py-6 rounded-xl">
                    <p className="text-white text-lg !font-[600]">0</p>
                    <p className="text-[#999999] text-sm font-Regular">
                      Total number of Claims
                    </p>
                  </div>
                </div>
                <div className="col-span-6 ">
                  <div className="bg-[#2A2A2A] self-center px-4 py-6 rounded-xl">
                    <p className="text-white text-lg  !font-[600]">$0.00</p>
                    <p className="text-[#999999] text-sm font-Regular">
                      Total Value of Claims
                    </p>
                  </div>
                </div>
              </Grid>
            </div>
          </div>
          <div className="col-span-3">
            <Grid className="!mt-5">
              <div className="col-span-10">
                <div className="bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                  <Grid className="!grid-cols-7 !gap-1">
                    {tabs.map((tab) => (
                      <div className="col-span-1" key={tab.id}>
                        <Button
                          className={`flex self-center w-full !px-2 !py-1 rounded-xl border-[1px] border-[#D1D1D1] ${
                            activeTab === tab.id
                              ? "!bg-[#2A2A2A] !text-white"
                              : "!bg-[#F9F9F9] !text-black"
                          }`}
                          onClick={() => handleTabClick(tab.id)}
                        >
                          <img
                            src={
                              activeTab === tab.id ? tab.Activeicons : tab.icons
                            }
                            className="self-center pr-1 py-1 border-[#D1D1D1] border-r-[1px]"
                            alt={tab.label}
                          />
                          <span
                            className={`ml-1 py-1 text-sm font-Regular ${
                              activeTab === tab.id ? "text-white" : "text-black"
                            }`}
                          >
                            {tab.label}
                          </span>
                        </Button>
                      </div>
                    ))}
                  </Grid>
                </div>
              </div>
              <div className="col-span-2">
                <Button
                  className="!bg-white flex self-center h-full  mb-4 rounded-xl ml-auto border-[1px] border-[#D1D1D1]"
                  onClick={() => {
                    routeToPage(activeTab);
                  }}
                >
                  {" "}
                  <Link to={"#"} className="flex self-center">
                    {" "}
                    <img
                      src={AddItem}
                      className="self-center"
                      alt="AddItem"
                    />{" "}
                    <span className="text-black ml-2 text-[12px] font-Regular !font-[700]">
                      Add {activeTab}
                    </span>{" "}
                  </Link>
                </Button>
              </div>
            </Grid>

            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`${activeTab !== tab.id ? "hidden" : ""}`}
              >
                {tab.content}
              </div>
            ))}
          </div>
        </Grid>
        {/* Modal Email Popop */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="text-center p-8">
            <p className="text-3xl font-semibold mb-4">Edit Dealer Details</p>
            <form className="mt-8" onSubmit={formik.handleSubmit}>
              <Grid>
                <div className="col-span-12">
                  <Input
                    type="text"
                    name="accountName"
                    className="!bg-white"
                    label="Account Name"
                    required={true}
                    placeholder=""
                    maxLength={"500"}
                    value={formik.values.accountName}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.accountName && formik.errors.accountName
                    }
                  />
                  {formik.touched.accountName && formik.errors.accountName && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {formik.errors.accountName}
                    </div>
                  )}
                </div>
                <div className="col-span-12">
                  <Input
                    type="text"
                    name="street"
                    className="!bg-white"
                    label="Street Address"
                    required={true}
                    placeholder=""
                    maxLength={"500"}
                    value={formik.values.street}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    error={formik.touched.street && formik.errors.street}
                  />
                  {formik.touched.street && formik.errors.street && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {formik.errors.street}
                    </div>
                  )}
                </div>
                <div className="col-span-6">
                  <Input
                    type="number"
                    name="zip"
                    label="Zip Code"
                    className="!bg-white"
                    required={true}
                    placeholder=""
                    value={formik.values.zip}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    minLength={"5"}
                    maxLength={"6"}
                    error={formik.touched.zip && formik.errors.zip}
                  />
                  {formik.touched.zip && formik.errors.zip && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {formik.errors.zip}
                    </div>
                  )}
                </div>
                <div className="col-span-6">
                  <Input
                    type="text"
                    name="city"
                    label="City"
                    className="!bg-white"
                    placeholder=" "
                    required={true}
                    maxLength={"20"}
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.city && formik.errors.city}
                  />
                  {formik.touched.city && formik.errors.city && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {formik.errors.city}
                    </div>
                  )}
                </div>
                <div className="col-span-6">
                  <Select
                    label="State"
                    name="state"
                    placeholder=""
                    className="!bg-white"
                    required={true}
                    onChange={handleSelectChange}
                    options={state}
                    value={formik.values.state}
                    onBlur={formik.handleBlur}
                    error={formik.touched.state && formik.errors.state}
                  />
                  {formik.touched.state && formik.errors.state && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {formik.errors.state}
                    </div>
                  )}
                </div>
                <div className="col-span-6">
                  <Input
                    type="text"
                    name="country"
                    label="Country"
                    required={true}
                    placeholder=""
                    value={formik.values.country}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    defaultValue="USA"
                    error={formik.touched.country && formik.errors.country}
                    disabled
                  />
                </div>
                <div className="col-span-4">
                  <Button
                    type="button"
                    className="border w-full !border-[#535456] !bg-[transparent] !text-light-black !text-sm !font-Regular"
                    onClick={closeModal}
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

        {/* Modal Primary Popop */}
        <Modal isOpen={isModalOpen1} onClose={closeModal1}>
          <div className="text-center py-3">
            <p className="text-3xl mb-0 mt-2 font-bold text-light-black">
              Assign Servicer
            </p>
            <form>
            <div className="my-4 h-[350px] max-h-[350px] overflow-y-scroll">
              <DataTable
                columns={columns}
                data={data}
                highlightOnHover
                sortIcon={
                  <>
                    {" "}
                    <img src={shorting} className="ml-2" alt="shorting" />
                  </>
                }
                noDataComponent={<CustomNoDataComponent />}
              />
            </div>
            <Grid className="drop-shadow-5xl">
              <div className="col-span-4">
                <Button
                  type="button"
                  className="border w-full !border-[#535456] !bg-[transparent] !text-light-black !text-sm !font-Regular"
                  onClick={closeModal1}
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

        {/* Modal Primary Popop */}
        <Modal isOpen={isModalOpen1} onClose={closeModal1}>
          <div className="text-center py-3">
           
            <p className="text-3xl mb-0 mt-2 font-bold text-light-black">
            Assign  Servicer
            </p>
           <div className="my-4 h-[350px] max-h-[350px] overflow-y-scroll">
           <DataTable columns={columns} data={data} highlightOnHover sortIcon={<> <img src={shorting}  className="ml-2" alt="shorting"/>
              </>}   noDataComponent={<CustomNoDataComponent />} />
           </div>
            <Grid className="drop-shadow-5xl">
            <div className="col-span-4">
                          <Button
                            type="button"
                            className="border w-full !border-[#535456] !bg-[transparent] !text-light-black !text-sm !font-Regular"
                            onClick={closeModal1}
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
        </div>
      </Modal>

        {/* Modal Add User Popop */}
        <Modal isOpen={isModalOpen1} onClose={closeModal1}>
          <div className="text-center py-3">
           
            <p className="text-3xl mb-5 mt-2 font-bold text-light-black">
            Add New User
            </p>
            <form>
              <Grid className="px-8">
                <div className="col-span-6">
                <Input
                  type="text"
                  name="fName"
                  label="First Name"
                  className="!bg-[#fff]"
                  required={true}
                  placeholder=""/>
                </div>
                <div className="col-span-6">
                <Input
                  type="text"
                  name="lName"
                  className="!bg-[#fff]"
                  label="Last Name"
                  required={true}
                  placeholder=""/>
                </div>
                <div className="col-span-6">
                <Input
                  type="email"
                  name="email"
                  className="!bg-[#fff]"
                  label="Email"
                  required={true}
                  placeholder=""/>
                </div>
                <div className="col-span-6">
                <Input
                  type="number"
                  name="phone"
                  label="Phone Number"
                  className="!bg-[#fff]"
                  required={true}
                  placeholder=""/>
                </div>
                <div className="col-span-6">
                <Input
                  type="text"
                  name="position"
                  className="!bg-[#fff]"
                  label="Position"
                  required={true}
                  placeholder=""/>
                </div>
                <div className="col-span-6">
                <p className="text-light-black flex text-[12px] font-semibold mt-3 mb-6">
                      Do you want to create an account?
                      <RadioButton
                        id="yes-create-account"
                        label="Yes"
                        value="yes"
                      />
                      <RadioButton
                        id="no-create-account"
                        label="No"
                        value="no"
                      />
                    </p>
                </div>
              </Grid>
              <Grid className="drop-shadow-5xl">
            <div className="col-span-4">
                          <Button
                            type="button"
                            className="border w-full !border-[#535456] !bg-[transparent] !text-light-black !text-sm !font-Regular"
                            onClick={closeModal1}
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
    </div>
    </>
  );
}

export default DealerDetails;
