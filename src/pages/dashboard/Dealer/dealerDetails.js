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
import Input from "../../../common/input";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import Select from "../../../common/select";
import {
  editDealerData,
  getDealersDetailsByid,
} from "../../../services/dealerServices";
import { cityData } from "../../../stateCityJson";

function DealerDetails() {
  const [activeTab, setActiveTab] = useState("tab1"); // Set the initial active tab
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dealerDetails, setDealerDetails] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    dealerData();
  }, [id.id]);

  const dealerData = async () => {
    const result = await getDealersDetailsByid(id.id);
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
      const result = await editDealerData(values);
      console.log(result.code);
      if (result.code == 200) {
        dealerData();
        setMessage("Dealer updated Successfully");
        setLoading(false);
        setIsModalOpen(false);
      }
      // else if (
      //   result.message == "Servicer already exist with this account name"
      // ) {
      //   setLoading(false);
      //   formik.setFieldError("accountName", "Name Already Used");
      //   setMessage("Some Errors Please Check Form Validations ");
      //   setIsModalOpen(true);
      // } else {
      //   setLoading(false);
      //   setIsModalOpen(true);
      //   setMessage(result.message);
      // }
    },
  });
  const city = [
    { label: "Country", value: "country" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ];

  const tabs = [
    {
      id: "tab1",
      label: "Orders",
      icons: Order,
      Activeicons: OrderActive,
      content: <OrderList />,
    },
    {
      id: "tab2",
      label: "Contracts",
      icons: Contract,
      Activeicons: ContractsActive,
      content: <ContractList />,
    },
    {
      id: "tab3",
      label: "Claims",
      icons: Claim,
      Activeicons: ClaimActive,
      content: <ClaimList />,
    },
    {
      id: "tab4",
      label: "Servicer",
      icons: Servicer,
      Activeicons: ServicerActive,
      content: <ServicerList />,
    },
    {
      id: "tab5",
      label: "Customers",
      icons: Customer,
      Activeicons: CustomerActive,
      content: <CustomerList />,
    },
    {
      id: "tab6",
      label: "Users",
      icons: User,
      Activeicons: UserActive,
      content: <UserList />,
    },
    {
      id: "tab7",
      label: "PriceBook",
      icons: PriceBook,
      Activeicons: PriceBookActive,
      content: <PriceBookList />,
    },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };
  return (
    <div className="py-8 px-3 relative overflow-x-hidden bg-[#F9F9F9]">
      <Headbar />

      <div className="flex">
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
              Dealer Detail (Price Book)
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
                <p className="text-sm text-neutral-grey font-Regular">Email</p>
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
              <Button className="!bg-white flex self-center h-full  mb-4 rounded-xl ml-auto border-[1px] border-[#D1D1D1]">
                {" "}
                <Link to={"#"} className="flex self-center">
                  {" "}
                  <img
                    src={AddItem}
                    className="self-center"
                    alt="AddItem"
                  />{" "}
                  <span className="text-black ml-3 text-[14px] font-Regular !font-[700]">
                    Add Order
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
    </div>
  );
}

export default DealerDetails;
