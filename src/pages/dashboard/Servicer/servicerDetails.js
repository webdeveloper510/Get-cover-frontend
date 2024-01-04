import React, { useEffect, useState } from "react";
import Headbar from "../../../common/headBar";
import { Link, useNavigate, useParams } from "react-router-dom";
import Grid from "../../../common/grid";
import Button from "../../../common/button";

// Media Import
import BackImage from "../../../assets/images/icons/backArrow.svg";
import Bank from "../../../assets/images/icons/bankIcon.svg";
import address from "../../../assets/images/Dealer/Address.svg";
import name from "../../../assets/images/Dealer/Name.svg";
import AddItem from "../../../assets/images/icons/addItem.svg";
import DealerActive from "../../../assets/images/icons/dealerDetails.svg";
import ClaimActive from "../../../assets/images/Dealer/Claim-active.svg";
import UserActive from "../../../assets/images/Dealer/User-active.svg";
import Dealer from "../../../assets/images/icons/dealer.svg";
import Unpaid from "../../../assets/images/icons/Unpaid.svg";
import UnpaidActive from "../../../assets/images/icons/unpaidActive.svg";
import Claim from "../../../assets/images/Dealer/Claim.svg";
import User from "../../../assets/images/Dealer/Users.svg";
import email from "../../../assets/images/Dealer/Email.svg";
import phone from "../../../assets/images/Dealer/Phone.svg";
import ClaimList from "../Dealer/Dealer-Details/claim";
import UserList from "../Dealer/Dealer-Details/user";
import Modal from "../../../common/model";
import Input from "../../../common/input";
import Select from "../../../common/select";
import DealerDetailList from "../Dealer/Dealer-Details/dealer";
import { getUserListByDealerId } from "../../../services/userServices";
import RadioButton from "../../../common/radio";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addUserByServicerId } from "../../../services/servicerServices";
import { RotateLoader } from "react-spinners";
import Primary from "../../.././assets/images/SetPrimary.png";

function ServicerDetails() {
  const [activeTab, setActiveTab] = useState("Claims"); // Set the initial active tab
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [refreshList, setRefreshUserList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { servicerId } = useParams();
  const [loading, setLoading] = useState(false);
  const [firstMessage, setFirstMessage] = useState("");
  const [secondMessage, setSecondMessage] = useState("");
  const [createAccountOption, setCreateAccountOption] = useState("yes");
  const [timer, setTimer] = useState(3);
  const [initialUserFormValues, setInitialUserFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    position: "",
    status: "yes",
    servicerId: servicerId,
    isPrimary: false,
  });
  // const { flag } = useMyContext();
  const emailValidationRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const routeToPage = (data) => {
    // console.log(data, id.id);
    switch (data) {
      case "Users":
        openUserModal();
        break;

      default:
        console.log("Invalid data, no navigation");
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    setLoading(true);
    let intervalId;

    if (modalOpen && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0) {
      closeModal10();
    }

    if (!modalOpen) {
      clearInterval(intervalId);
      setTimer(3);
    }

    setLoading(false);

    return () => {
      clearInterval(intervalId);
    };
  }, [modalOpen, timer]);
  const openUserModal = () => {
    setIsUserModalOpen(true);
  };
  const closeModal10 = () => {
    setModalOpen(false);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal1 = () => {
    setIsModalOpen1(false);
  };
  const closeUserModal = () => {
    setIsUserModalOpen(false);
  };
  const getUserList = async () => {
    const result = await getUserListByDealerId(servicerId, {});
    console.log(result.result, "----------");
    setRefreshUserList(result.result);
  };
  const handleSelectChange1 = (label, value) => {
    setSelectedProduct(value);
  };
  const handleRadioChange = (event) => {
    const selectedValue = event.target.value;
    userValues.setFieldValue("status", selectedValue);
    setCreateAccountOption(selectedValue);
  };
  const city = [
    { label: "Country", value: "country" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ];

  const tabs = [
    {
      id: "Claims",
      label: "Claims",
      icons: Claim,
      Activeicons: ClaimActive,
      content: <ClaimList />,
    },
    {
      id: "Dealer",
      label: "Dealer",
      icons: Dealer,
      Activeicons: DealerActive,
      content: <DealerDetailList />,
    },
    {
      id: "Users",
      label: "Users",
      icons: User,
      Activeicons: UserActive,
      content: (
        <UserList flag={"servicer"} id={servicerId} data={refreshList} />
      ),
    },
    {
      id: "Unpaid Claims",
      label: "Unpaid Claims",
      icons: Unpaid,
      Activeicons: UnpaidActive,
      content: <UserList />,
    },
  ];
  const userValues = useFormik({
    initialValues: initialUserFormValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      firstName: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .required("Required")
        .max(500, "Must be exactly 500 characters"),
      lastName: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .required("Required")
        .max(500, "Must be exactly 500 characters"),
      phoneNumber: Yup.string()
        .required("Required")
        .min(10, "Must be at least 10 characters")
        .max(10, "Must be exactly 10 characters")
        .matches(/^[0-9]+$/, "Must contain only digits"),
      email: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .matches(emailValidationRegex, "Invalid email address")
        .required("Required"),
    }),

    onSubmit: async (values, { setFieldError }) => {
      localStorage.setItem("menu", "Users");
      console.log(values);
      setLoading(true);
      const result = await addUserByServicerId(values, servicerId);
      console.log(result.code);
      if (result.code == 200) {
        getUserList();
        // dealerData();
        setModalOpen(true);
        setFirstMessage("New User Added Successfully");
        setSecondMessage("New User Added Successfully");
        // setMessage("Dealer updated Successfully");
        setLoading(false);
        closeUserModal();
        // window.location.reload();
        // setIsModalOpen(false);
      } else {
        console.log(result);
        console.log("here");
        if (result.code === 401) {
          console.log("here12");
          setFieldError("email", "Email already in use");
        }
        setLoading(false);
      }
    },
  });
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };
  return (
    <div className="py-8 px-3 relative overflow-x-hidden bg-[#F9F9F9]">
      {loading && (
        <div className=" fixed z-[999999] bg-[#333333c7] backdrop-blur-xl  h-screen w-full flex py-5">
          <div className="self-center mx-auto">
            <RotateLoader color="#fff" />
          </div>
        </div>
      )}
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
            Servicer Details
          </p>
          <ul className="flex self-center">
            <li className="text-sm text-neutral-grey font-Regular">
              <Link to={"/"}>Servicer / </Link>{" "}
            </li>
            <li className="text-sm text-neutral-grey font-Regular">
              <Link to={"/"}> Servicer List / </Link>{" "}
            </li>
            <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
              {" "}
              Servicer Details ({activeTab})
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
                  Edward26wilson
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
                  1515 Holcombe Blvd, Houston, TX 77030, USA
                </p>
              </div>
            </div>
            <div className="flex my-4">
              <img
                src={Bank}
                className="mr-3 bg-[#383838] rounded-[14px] self-start mt-3"
                alt="Bank"
              />
              <div>
                <p className="text-sm text-neutral-grey font-Regular mt-3">
                  Bank Details
                </p>
                <div className="bg-[#383838] border border-[#D1D9E24D] rounded-lg px-2.5 py-2 mt-1">
                  <Grid className="!gap-1">
                    <div className="col-span-6">
                      <p className="text-[10px] text-neutral-grey font-Regular">
                        Bank Name:
                      </p>
                      <p className="text-sm text-white font-semibold leading-5">
                        XYZ Bank
                      </p>
                    </div>
                    <div className="col-span-6">
                      <p className="text-[10px] text-neutral-grey font-Regular">
                        Account Number:
                      </p>
                      <p className="text-sm text-white font-semibold leading-5">
                        987654321
                      </p>
                    </div>
                    <div className="col-span-6">
                      <p className="text-[10px] text-neutral-grey font-Regular">
                        ABA Routing Number:
                      </p>
                      <p className="text-sm text-white font-semibold leading-5">
                        123456789
                      </p>
                    </div>
                    <div className="col-span-6">
                      <p className="text-[10px] text-neutral-grey font-Regular">
                        Account Holder:
                      </p>
                      <p className="text-sm text-white font-semibold leading-5">
                        John Doe
                      </p>
                    </div>
                  </Grid>
                </div>
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
                  Edward Wilson
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
                  26edward26@gmail.com
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
                  +1 (869) 985-6741
                </p>
              </div>
            </div>
            <Grid className="mt-5">
              <div className="col-span-6 ">
                <div className="bg-[#2A2A2A] self-center px-4 py-6 rounded-xl">
                  <p className="text-white text-lg !font-[600]">3,843</p>
                  <p className="text-[#999999] text-sm font-Regular">
                    Total number of Claims
                  </p>
                </div>
              </div>
              <div className="col-span-6 ">
                <div className="bg-[#2A2A2A] self-center px-4 py-6 rounded-xl">
                  <p className="text-white text-lg  !font-[600]">$35,859.00</p>
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
            <div className="col-span-8">
              <div className="bg-[#fff] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                <Grid className="!grid-cols-4 !gap-1">
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
            <div className="col-span-4">
              <Button className="!bg-white flex self-center h-full  mb-4 rounded-xl ml-auto border-[1px] border-[#D1D1D1]">
                {" "}
                <div
                  className="col-span-2"
                  onClick={() => routeToPage(activeTab)}
                >
                  {" "}
                  <img
                    src={AddItem}
                    className="self-center"
                    alt="AddItem"
                  />{" "}
                  <span className="text-black ml-3 text-[14px] font-Regular !font-[700]">
                    Add {activeTab}
                  </span>{" "}
                </div>
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
      {/* user popup */}
      <Modal isOpen={isUserModalOpen} onClose={closeUserModal}>
        <div className="text-center py-3">
          <p className="text-3xl mb-5 mt-2 font-bold text-light-black">
            Add New User
          </p>
          <form onSubmit={userValues.handleSubmit}>
            <Grid className="px-8">
              <div className="col-span-6">
                <Input
                  type="text"
                  name="firstName"
                  label="First Name"
                  required={true}
                  placeholder=""
                  className="!bg-white"
                  maxLength={"30"}
                  value={userValues.values.firstName}
                  onBlur={userValues.handleBlur}
                  onChange={userValues.handleChange}
                  error={
                    userValues.touched.firstName && userValues.errors.firstName
                  }
                />
                {userValues.touched.firstName &&
                  userValues.errors.firstName && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {userValues.errors.firstName}
                    </div>
                  )}
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  name="lastName"
                  label="Last Name"
                  required={true}
                  placeholder=""
                  className="!bg-white"
                  maxLength={"30"}
                  value={userValues.values.lastName}
                  onBlur={userValues.handleBlur}
                  onChange={userValues.handleChange}
                  error={
                    userValues.touched.lastName && userValues.errors.lastName
                  }
                />
                {userValues.touched.lastName && userValues.errors.lastName && (
                  <div className="text-red-500 text-sm pl-2 pt-2">
                    {userValues.errors.lastName}
                  </div>
                )}
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  name="email"
                  label="Email"
                  placeholder=""
                  className="!bg-white"
                  required={true}
                  value={userValues.values.email}
                  onBlur={userValues.handleBlur}
                  onChange={userValues.handleChange}
                  error={userValues.touched.email && userValues.errors.email}
                />
                {userValues.touched.email && userValues.errors.email && (
                  <div className="text-red-500 text-sm pl-2 pt-2">
                    {userValues.errors.email}
                  </div>
                )}
              </div>
              <div className="col-span-6">
                <Input
                  type="tel"
                  name="phoneNumber"
                  label="Phone"
                  required={true}
                  className="!bg-white"
                  placeholder=""
                  value={userValues.values.phoneNumber}
                  onChange={(e) => {
                    const sanitizedValue = e.target.value.replace(
                      /[^0-9]/g,
                      ""
                    );
                    console.log(sanitizedValue);
                    userValues.handleChange({
                      target: {
                        name: "phoneNumber",
                        value: sanitizedValue,
                      },
                    });
                  }}
                  onBlur={userValues.handleBlur}
                  minLength={"10"}
                  maxLength={"10"}
                  error={
                    userValues.touched.phoneNumber &&
                    userValues.errors.phoneNumber
                  }
                />
                {(userValues.touched.phoneNumber ||
                  userValues.submitCount > 0) &&
                  userValues.errors.phoneNumber && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {userValues.errors.phoneNumber}
                    </div>
                  )}
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  name="position"
                  label="Position"
                  className="!bg-white"
                  placeholder=""
                  maxLength={"50"}
                  value={userValues.values.position}
                  onBlur={userValues.handleBlur}
                  onChange={userValues.handleChange}
                  error={
                    userValues.touched.position && userValues.errors.position
                  }
                />
              </div>
              <div className="col-span-6">
                <p className="text-light-black flex text-[12px] font-semibold mt-3 mb-6">
                  Do you want to create an account?
                  <RadioButton
                    id="yes-create-account"
                    label="Yes"
                    value="yes"
                    checked={createAccountOption === "yes"}
                    onChange={handleRadioChange}
                  />
                  <RadioButton
                    id="no-create-account"
                    label="No"
                    value="no"
                    checked={createAccountOption === "no"}
                    onChange={handleRadioChange}
                  />
                </p>
              </div>
            </Grid>
            <Grid className="drop-shadow-5xl">
              <div className="col-span-4">
                <Button
                  type="button"
                  className="border w-full !border-[#535456] !bg-[transparent] !text-light-black !text-sm !font-Regular"
                  onClick={closeUserModal}
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
      {/* Modal Email Popop */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center px-8 py-4">
          <p className="text-3xl font-bold mb-8">Edit Servicer Details</p>
          <Grid>
            <div className="col-span-6">
              <Input
                name="accountName"
                className="!bg-[#fff]"
                type="text"
                label="Account Name"
              />
            </div>
            <div className="col-span-6">
              <Input
                name="streetAddress"
                className="!bg-[#fff]"
                type="text"
                label="Street Address"
              />
            </div>
            <div className="col-span-6">
              <Input
                name="zipCode"
                type="number"
                className="!bg-[#fff]"
                label="Zip Code"
              />
            </div>
            <div className="col-span-6">
              <Select
                label="City"
                options={city}
                className="!bg-[#fff]"
                selectedValue={selectedProduct}
                onChange={handleSelectChange1}
              />
            </div>
            <div className="col-span-6">
              <Select
                label="State"
                options={city}
                className="!bg-[#fff]"
                selectedValue={selectedProduct}
                onChange={handleSelectChange1}
              />
            </div>
            <div className="col-span-6">
              <Select
                label="Country"
                options={city}
                className="!bg-[#fff]"
                selectedValue={selectedProduct}
                onChange={handleSelectChange1}
              />
            </div>
            <div className="col-span-12">
              <div className="flex w-full my-2">
                <p className="text-sm mr-3 text-[#999999] font-Regular">
                  BANK DETAILS
                </p>
                <hr className="self-center border-[#999999] w-[80%]" />
              </div>
            </div>
            <div className="col-span-6">
              <Input
                name="bankName"
                type="text"
                className="!bg-[#fff]"
                label="Bank Name"
              />
            </div>
            <div className="col-span-6">
              <Input
                name="routingNumber"
                type="number"
                className="!bg-[#fff]"
                label="ABA Routing Number"
              />
            </div>
            <div className="col-span-6">
              <Input
                name="accountNumber"
                type="number"
                className="!bg-[#fff]"
                label="Account Number"
              />
            </div>
            <div className="col-span-6">
              <Input
                name="accountHolder"
                type="text"
                className="!bg-[#fff]"
                label="Account Holder"
              />
            </div>
            <div className="col-span-4">
              <Button
                className="border w-full !border-[#535456] !bg-[transparent] !text-light-black !text-sm !font-Regular"
                onClick={closeModal}
              >
                Cancel
              </Button>
            </div>
            <div className="col-span-8">
              <Button className="w-full">Submit</Button>
            </div>
          </Grid>
        </div>
      </Modal>
      <Modal isOpen={modalOpen} onClose={closeModal10}>
        <div className="text-center py-3">
          <img src={Primary} alt="email Image" className="mx-auto" />
          <p className="text-3xl mb-0 mt-2 font-bold text-light-black">
            {firstMessage}
          </p>
          <p className="text-neutral-grey text-base font-medium mt-4">
            {secondMessage} {""} <br /> Redirecting Back to Detail page {timer}
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default ServicerDetails;
