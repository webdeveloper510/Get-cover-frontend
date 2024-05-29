import React, { useEffect, useRef, useState } from "react";
import Headbar from "../../../common/headBar";
import { Link, useNavigate, useParams } from "react-router-dom";
import Grid from "../../../common/grid";
import Button from "../../../common/button";

// Media Import
import BackImage from "../../../assets/images/icons/backArrow.svg";
import DealerList from "../../../assets/images/icons/dealerList.svg";
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
import OrderList from "../Dealer/Dealer-Details/order";
import ContractList from "../Contract/contractList";
import ServicerList from "../Dealer/Dealer-Details/servicer";
import UserList from "../Dealer/Dealer-Details/user";
import PriceBookList from "../Dealer/Dealer-Details/priceBook";
import CustomerList from "../Dealer/Dealer-Details/customer";
import Modal from "../../../common/model";
import shorting from "../../../assets/images/icons/shorting.svg";
import Input from "../../../common/input";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "../../../common/select";
import {
  createRelationWithDealer,
  editDealerData,
  getDealersDetailsByid,
} from "../../../services/dealerServices";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { cityData } from "../../../stateCityJson";
import { RotateLoader } from "react-spinners";
import DataTable from "react-data-table-component";
import RadioButton from "../../../common/radio";
import DealerIcons from "../../../assets/images/icons/DealerIcons.svg";
import { getUserListByDealerId } from "../../../services/userServices";
import Primary from "../../.././assets/images/SetPrimary.png";
import { MyContextProvider, useMyContext } from "../../../context/context";
import { getServicerListForDealer } from "../../../services/servicerServices";
import {
  addUserByResellerId,
  editResellerData,
  getResellerListByResellerId,
  getResellerUsersById,
} from "../../../services/reSellerServices";
import ClaimList from "../Claim/claimList";
// import Reseller from "../Dealer/Dealer-Details/reseller";
import ClaimList12 from "../Dealer/Dealer-Details/claim";
import Cross from "../../../assets/images/Cross_Button.png";
import Unpaid from "../../../assets/images/icons/Unpaid.svg";
import UnpaidActive from "../../../assets/images/icons/unpaidActive.svg";
import Paid from "../../../assets/images/icons/Paid.svg";
import ActivePaid from "../../../assets/images/icons/ActivePaid.svg";

function ResellerDetails() {
  const getInitialActiveTab = () => {
    const storedTab = localStorage.getItem("Resellermenu");
    return storedTab ? storedTab : "Orders";
  };
  const id = useParams();
  console.log(id);
  const [activeTab, setActiveTab] = useState(getInitialActiveTab()); // Set the initial active tab
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatus, setIsStatus] = useState(false);
  const [resellerStatus, setResellerStatus] = useState(false);
  const [resellerStatusMain, setResellerStatusMain] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [createServicerAccountOption, setServicerCreateAccountOption] =
    useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  const [refreshList, setRefreshUserList] = useState([]);
  const [scrolling, setScrolling] = useState(false);
  const [resellerDetail, setResllerDetails] = useState([]);
  const [firstMessage, setFirstMessage] = useState("");
  const [secondMessage, setSecondMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(3);
  const [servicerList, setServicerList] = useState([]);
  const [flagValue, setFlagValue] = useState(false);
  const navigate = useNavigate();
  const { servicerId } = useParams();
  const [createAccountOption, setCreateAccountOption] = useState("no");
  const [initialUserFormValues, setInitialUserFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    position: "",
    status: createAccountOption === "yes" ? true : false,
    resellerId: id.resellerId,
    isPrimary: false,
  });
  const { flag } = useMyContext();
  const [initialFormValues, setInitialFormValues] = useState({
    accountName: "",
    resellerId: id.resellerId,
    street: "",
    city: "",
    isServicer: createServicerAccountOption,
    isAccountCreate: createAccount,
    zip: "",
    state: "",
    country: "USA",
    oldName: "",
  });

  const state = cityData;

  const closeModal = () => {
    setIsModalOpen(false);
    setServicerCreateAccountOption(resellerDetail.resellerData?.isServicer);
    formik.resetForm();
  };
  const closeModal10 = () => {
    setModalOpen(false);
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
  const handleRadioChange = (event) => {
    const selectedValue = event.target.value;
    userValues.setFieldValue("status", selectedValue === "yes" ? true : false);
    setCreateAccountOption(selectedValue);
  };
  const getUserList = async () => {
    const result = await getResellerUsersById(id.resellerId, {});
    setRefreshUserList(result.result);
  };

  useEffect(() => {
    getUserList();
  }, []);

  const closeModal1 = () => {
    setIsModalOpen1(false);
  };
  const modalOpen1 = () => {
    resellerDetails(true);
    setIsModalOpen1(true);
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
      slidesToSlide: 5, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4,
      slidesToSlide: 1, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };
  const closeUserModal = () => {
    setActiveTab("Users");
    setIsUserModalOpen(false);
    userValues.resetForm();
  };
  const getServicerList = async () => {
    const result = await getServicerListForDealer(id.resellerId);
    setServicerList(result.result);
    console.log(result.result);
  };
  console.log(
    isStatus,
    resellerStatus,
    createAccount,
    "<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>"
  );
  useEffect(() => {
    resellerDetails();
    getServicerList();
  }, [id.resellerId, flag]);
  const carouselRef = useRef(null);
  useEffect(() => {
    localStorage.setItem("Resellermenu", activeTab);
    if (
      activeTab === "Users" ||
      activeTab === "PriceBook" ||
      activeTab === "Paid Claims" ||
      activeTab === "Unpaid Claims"
    ) {
      if (carouselRef.current) {
        carouselRef.current.next(4);
      }
    }
  }, [activeTab, carouselRef]);

  const resellerDetails = async (showLoader) => {
    if (!showLoader) {
      setLoading(true);
    }
    const result = await getResellerListByResellerId(id.resellerId);
    setResllerDetails(result.reseller[0]);
    setIsStatus(result?.dealerStatus);
    setResellerStatus(result?.reseller[0].status);
    console.log(
      result.reseller[0].resellerData.status,
      "---------------------<<<<<<<<result?.reseller[0]?.resellerData?.isServicer>>>>>>>>>>>>>>>>>>"
    );
    setResellerStatusMain(result.reseller[0].resellerData.status);
    setServicerCreateAccountOption(
      result?.reseller[0]?.resellerData?.isServicer
    );
    setCreateAccount(result?.reseller[0]?.resellerData?.isAccountCreate);
    setInitialFormValues({
      accountName: result?.reseller[0]?.resellerData?.name,
      oldName: result?.reseller[0]?.resellerData?.name,
      resellerId: id.resellerId,
      street: result?.reseller[0]?.resellerData?.street,
      city: result?.reseller[0]?.resellerData?.city,
      zip: result?.reseller[0]?.resellerData?.zip,
      state: result?.reseller[0]?.resellerData?.state,
      isServicer: result?.reseller[0]?.resellerData?.isServicer,
      isAccountCreate: result?.reseller[0].status,
      country: "USA",
    });
    setLoading(false);
  };
  // const dealerData = async () => {
  //   setLoading(true);
  //   console.log(id);
  //   const result = await getDealersDetailsByid(id?.id);
  //   setDealerDetails(result.result[0]);
  //   console.log(result.result[0].dealerData);
  // setInitialFormValues({
  //   accountName: result?.result[0]?.dealerData?.name,
  //   oldName: result?.result[0]?.dealerData?.name,
  //   dealerId: id.id,
  //   street: result?.result[0]?.dealerData?.street,
  //   city: result?.result[0]?.dealerData?.city,
  //   zip: result?.result[0]?.dealerData?.zip,
  //   state: result?.result[0]?.dealerData?.state,
  //   country: "USA",
  // });
  //   setLoading(false);
  // };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const emailValidationRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  const handleSelectChange = async (name, value) => {
    formik.setFieldValue(name, value);
  };
  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      resellerId: Yup.string().required("Required"),
      accountName: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .required("Required")
        .max(500, "Must be exactly 500 characters"),
      street: Yup.string()
        .transform((originalValue) => originalValue.trim())
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
      const result = await editResellerData(values, id.resellerId);

      console.log(result);
      if (result.code == 200) {
        setLoading(false);
        setModalOpen(true);
        resellerDetails(true);
        // dealerData();
        setIsModalOpen(false);
        setFirstMessage("Edited Successfully");
        setSecondMessage("Dealer edited Successfully");
        setTimer(3);

        setMessage("Dealer updated Successfully");
      } else if (result.message == "Account name is not available") {
        setLoading(false);
        formik.setFieldError("accountName", "Name Already Used");
      }
    },
  });

  const servicerForm = useFormik({
    initialValues: {
      selectedItems: [],
    },

    onSubmit: async (values) => {
      setFlagValue(false);
      setLoading(true);
      const selectedData = servicerList.map((item) => ({
        _id: item._id,
        status: values.selectedItems.includes(item._id) || item.check,
      }));

      console.log("Selected Data: ", selectedData);

      const result = await createRelationWithDealer(id.resellerId, {
        servicers: selectedData,
      });
      console.log(result);
      if (result.code === 200) {
        setLoading(false);
        setFlagValue(true);
        setModalOpen(true);
        setFirstMessage("Servicer Updated Successfully");
        setSecondMessage("Servicer Updated Successfully");
        getServicerList();
        closeModal1();
        setTimer(3);
      } else {
        setLoading(false);
        getServicerList();
        closeModal1();
      }

      closeModal1();
      servicerForm.resetForm();
    },
  });

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
      if (values.status === "yes") {
        values.status = true;
      }
      setLoading(true);
      const result = await addUserByResellerId(values);
      console.log(result.code);
      if (result.code == 200) {
        getUserList();
        // dealerData();
        setModalOpen(true);
        setFirstMessage("New User Added Successfully");
        setSecondMessage("New User Added Successfully");
        setMessage("Dealer updated Successfully");
        setLoading(false);
        closeUserModal();
        setTimer(3);
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
  const openUserModal = () => {
    setActiveTab("Users123");
    userValues.resetForm();
    setIsUserModalOpen(true);
  };
  const columns = [
    {
      name: "Servicer ID",
      selector: (row) => row.unique_key,
      sortable: true,
      minWidth: "33%",
      center: true,
    },
    {
      name: "Servicer Name",
      selector: (row) => row.name,
      sortable: true,
      minWidth: "50%",
      center: true,
    },
    {
      name: "Action",
      center: true,
      minWidth: "12%",
      cell: (row, index) => {
        return (
          <div>
            <input
              type="checkbox"
              className="accent-gray-600"
              checked={row.check}
              onChange={(e) => {
                const checked = e.target.checked;
                const itemId = servicerList[index]._id;
                servicerList[index].check = checked;
                const selectedItems = checked
                  ? [...servicerForm.values.selectedItems, itemId]
                  : servicerForm.values.selectedItems.filter(
                      (id) => id !== itemId
                    );

                servicerForm.setFieldValue("selectedItems", selectedItems);
              }}
            />
          </div>
        );
      },
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
      content: activeTab === "Orders" && (
        <OrderList flag={"reseller"} id={id.resellerId} activeTab={activeTab} />
      ),
    },
    {
      id: "Contracts",
      label: "Contracts",
      icons: Contract,
      Activeicons: ContractsActive,
      content: activeTab === "Contracts" && (
        <ContractList
          flag={"reseller"}
          id={id.resellerId}
          activeTab={activeTab}
        />
      ),
    },
    {
      id: "Claims",
      label: "Claims",
      icons: Claim,
      Activeicons: ClaimActive,
      content: activeTab === "Claims" && (
        <ClaimList id={id.resellerId} flag={"reseller"} activeTab={activeTab} />
      ),
    },
    {
      id: "Customer",
      label: "Customer",
      icons: Customer,
      Activeicons: CustomerActive,
      content: activeTab === "Customer" && (
        <CustomerList
          flag={"reseller"}
          id={id.resellerId}
          activeTab={activeTab}
        />
      ),
    },
    {
      id: "Servicer",
      label: "Servicer",
      icons: Servicer,
      Activeicons: ServicerActive,
      content: activeTab === "Servicer" && (
        <ServicerList
          flag={"reseller"}
          id={id.resellerId}
          activeTab={activeTab}
        />
      ),
    },
    {
      id: "Users",
      label: "Users",
      icons: User,
      Activeicons: UserActive,
      content: (
        <UserList flag={"reseller"} id={id.resellerId} activeTab={activeTab} />
      ),
    },

    {
      id: "PriceBook",
      label: "PriceBook",
      icons: PriceBook,
      Activeicons: PriceBookActive,
      content: activeTab === "PriceBook" && (
        <PriceBookList
          id={id.resellerId}
          flag={"reseller"}
          dealerId={resellerDetail.resellerData?.dealerId}
          activeTab={activeTab}
        />
      ),
    },
  ];

  if (createServicerAccountOption === true) {
    tabs.push(
      {
        id: "Unpaid Claims",
        label: "Unpaid Claims",
        icons: Unpaid,
        Activeicons: UnpaidActive,
        content: activeTab === "Unpaid Claims" && (
          <ClaimList12
            id={id.resellerId}
            flag="reseller"
            activeTab={activeTab}
          />
        ),
      },
      {
        id: "Paid Claims",
        label: "Paid Claims",
        icons: Paid,
        Activeicons: ActivePaid,
        content: activeTab === "Paid Claims" && (
          <ClaimList12
            id={id.resellerId}
            flag="reseller"
            activeTab={activeTab}
          />
        ),
      }
    );
  }

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };
  const routeToPage = (data) => {
    console.log(resellerDetail?.resellerData?.dealerId, id.resellerId);

    switch (data) {
      case "Orders":
        localStorage.setItem("Resellermenu", "Orders");
        navigate(
          `/addOrderforReseller/${id.resellerId}/${resellerDetail?.resellerData?.dealerId}`
        );
        break;
      case "Claims":
        localStorage.setItem("Resellermenu", "Claims");
        navigate(`/addClaim`);
        break;
      case "PriceBook":
        localStorage.setItem("Resellermenu", "PriceBook");
        navigate(`/addDealerBook/${id.resellerId}`);
        break;
      case "Customer":
        localStorage.setItem("Resellermenu", "Customer");
        navigate(`/addCustomer/${id.resellerId}/reseller`);
        break;
      case "Users":
        openUserModal();
        break;
      case "Servicer":
        modalOpen1();
        break;

      default:
        console.log("Invalid data, no navigation");
    }
  };

  const formatPhoneNumber = (phoneNumber) => {
    const cleaned = ("" + phoneNumber).replace(/\D/g, ""); // Remove non-numeric characters
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/); // Match groups of 3 digits

    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    return phoneNumber; // Return original phone number if it couldn't be formatted
  };
  const handleServiceChange = (event) => {
    const valueAsBoolean = JSON.parse(event.target.value.toLowerCase());
    setServicerCreateAccountOption(valueAsBoolean);
    formik.setFieldValue("isServicer", valueAsBoolean);
  };

  const handleAccountChange = (event) => {
    const valueAsBoolean = JSON.parse(event.target.value.toLowerCase());
    setCreateAccount(valueAsBoolean);
    formik.setFieldValue("isAccountCreate", valueAsBoolean);
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

  // const handleTransitionEnd = () => {
  //   if (containerRef.current) {
  //     containerRef.current.classList.remove("scroll-transition");
  //     setScrolling(false);
  //   }
  // };

  const containerRef = useRef(null);
  const handleGOBack = () => {
    navigate(`/resellerList`);
    // navigate(-1);
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
      <div className="py-8 pl-3 relative overflow-x-hidden bg-grayf9">
        <Headbar />

        <div className="flex">
          <div onClick={() => localStorage.removeItem("Resellermenu")}>
            <div
              onClick={handleGOBack}
              className="h-[60px] w-[60px] flex border-[1px] bg-white border-Light-Grey rounded-[25px]"
            >
              <img
                src={BackImage}
                className="m-auto my-auto self-center bg-white"
                alt="BackImage"
              />
            </div>
          </div>
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9 mb-[3px]">
              Reseller Details
            </p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/"}>Reseller / </Link>{" "}
              </li>
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/resellerList"}> Reseller List / </Link>{" "}
              </li>
              <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
                {" "}
                Reseller Detail ({activeTab})
              </li>
            </ul>
          </div>
        </div>

        <Grid className="!grid-cols-4 mt-5">
          <div className="col-span-1 max-h-[85vh] overflow-y-scroll">
            <div className=" bg-Dealer-details bg-cover p-5 rounded-[20px]">
              <Grid>
                <div className="col-span-9">
                  <p className="text-sm text-neutral-grey font-Regular">
                    Account Name
                  </p>
                  <p className="text-xl text-white font-semibold break-words">
                    {resellerDetail?.resellerData?.name}
                  </p>
                </div>
                <div className="col-span-3 text-end">
                  <Button
                    className="border !border-Bright-Grey !text-sm !font-Regular"
                    onClick={openModal}
                  >
                    Edit
                  </Button>
                </div>
              </Grid>
              <div className="flex my-4">
                <img
                  src={address}
                  className="mr-3 bg-Onyx rounded-[14px] my-auto"
                  alt="Address"
                />
                <div>
                  <p className="text-sm text-neutral-grey font-Regular mt-3">
                    Address
                  </p>
                  <p className="text-base text-white font-semibold leading-5">
                    {resellerDetail?.resellerData?.street},{" "}
                    {resellerDetail?.resellerData?.city},{" "}
                    {resellerDetail?.resellerData?.state}{" "}
                    {resellerDetail?.resellerData?.zip}, USA
                  </p>
                </div>
              </div>
              <div className="flex w-full my-4">
                <p className="text-[10px] mr-3 text-neutral-grey font-Regular">
                  PRIMARY CONTACT DETAILS
                </p>
                <hr className="self-center border-[#999999] w-[40%]" />
              </div>
              <div className="flex mb-4">
                <div className="relative">
                  <img
                    src={DealerIcons}
                    className="mr-3 bg-Onyx rounded-[14px]"
                    alt="DealerIcons"
                  />
                  <Link
                    to={`/dealerDetails/${resellerDetail?.resellerData?.dealerId}`}
                  >
                    {" "}
                    <img
                      src={DealerList}
                      className="mr-3 bg-Onyx cursor-pointer rounded-[14px] absolute top-3 -right-2"
                      alt="DealerList"
                    />{" "}
                  </Link>
                </div>
                <div className="w-[75%]">
                  <p className="text-sm text-neutral-grey font-Regular">
                    Dealer Name
                  </p>
                  <p className="text-base text-white font-semibold ">
                    {resellerDetail?.resellerData?.dealerName}
                  </p>
                </div>
              </div>
              <div className="flex mb-4">
                <img
                  src={name}
                  className="mr-3 bg-Onyx rounded-[14px]"
                  alt="Name"
                />
                <div>
                  <p className="text-sm text-neutral-grey font-Regular">Name</p>
                  <p className="text-base text-white font-semibold ">
                    {resellerDetail?.firstName} {resellerDetail?.lastName}
                  </p>
                </div>
              </div>
              <div className="flex mb-4">
                <img
                  src={email}
                  className="mr-3 bg-Onyx rounded-[14px]"
                  alt="email"
                />
                <div className="w-[80%]">
                  <p className="text-sm text-neutral-grey font-Regular">
                    Email
                  </p>
                  <p className="text-base text-white leading-[13px] font-semibold break-words">
                    {resellerDetail?.email}
                  </p>
                </div>
              </div>
              <div className="flex mb-4">
                <img
                  src={phone}
                  className="mr-3 bg-Onyx rounded-[14px]"
                  alt="name"
                />
                <div>
                  <p className="text-sm text-neutral-grey font-Regular">
                    Phone Number
                  </p>
                  <p className="text-base text-white font-semibold ">
                    +1 {formatPhoneNumber(resellerDetail?.phoneNumber)}
                  </p>
                </div>
              </div>
              <Grid className="mt-5">
                <div className="col-span-6 ">
                  <div className="bg-[#2A2A2A] self-center px-4 py-6 rounded-xl">
                    <p className="text-white text-lg font-semibold ">
                      {" "}
                      {resellerDetail?.orderData?.noOfOrders ?? 0}{" "}
                    </p>
                    <p className="text-neutral-grey text-sm font-Regular ">
                      Total Number of Orders
                    </p>
                  </div>
                </div>
                <div className="col-span-6 ">
                  <div className="bg-[#2A2A2A] self-center px-4 py-6 rounded-xl">
                    <p className="text-white text-lg  !font-[600]">
                      $
                      {formatOrderValue(
                        resellerDetail?.orderData?.orderAmount ??
                          parseInt(0).toLocaleString(2)
                      )}
                    </p>
                    <p className="text-neutral-grey text-sm font-Regular">
                      Total Value of Orders
                    </p>
                  </div>
                </div>
                <div className="col-span-6 ">
                  <div className="bg-[#2A2A2A] self-center px-4 py-6 rounded-xl">
                    <p className="text-white text-lg !font-[600]">
                      {resellerDetail?.claimData?.numberOfClaims ?? 0}
                    </p>
                    <p className="text-neutral-grey text-sm font-Regular">
                      Total number of Claims
                    </p>
                  </div>
                </div>
                <div className="col-span-6 ">
                  <div className="bg-[#2A2A2A] self-center px-4 py-6 rounded-xl">
                    <p className="text-white text-lg  !font-[600]">
                      {" "}
                      $
                      {formatOrderValue(
                        resellerDetail?.claimData?.valueClaim ??
                          parseInt(0).toLocaleString(2)
                      )}
                    </p>
                    <p className="text-neutral-grey text-sm font-Regular">
                      Total Value of Claims
                    </p>
                  </div>
                </div>
              </Grid>
            </div>
          </div>
          <div className="col-span-3 max-h-[85vh] pr-3 overflow-y-scroll">
            <Grid className="">
              <div
                className={`${
                  isStatus == true && resellerStatusMain == true
                    ? "col-span-10"
                    : "col-span-10"
                }`}
              >
                <div
                  className={`relative rounded-[30px] px-2 py-3 border-[1px] border-Light-Grey`}

                  // onTransitionEnd={handleTransitionEnd}
                >
                  <Carousel
                    className="!gap-1 reseller"
                    ssr={true}
                    responsive={responsive}
                    ref={carouselRef}
                  >
                    {tabs.map((tab) => (
                      <Button
                        className={`flex self-center mr-2 w-full !px-2 !py-1 rounded-xl border-[1px] border-Light-Grey ${
                          activeTab === tab.id
                            ? "!bg-[#2A2A2A] !text-white"
                            : "!bg-grayf9 !text-black"
                        }`}
                        onClick={() => handleTabClick(tab.id)}
                      >
                        <img
                          src={
                            activeTab === tab.id ? tab.Activeicons : tab.icons
                          }
                          className="self-center pr-1 py-1 border-Light-Grey border-r-[1px]"
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
                    ))}
                  </Carousel>
                  <div className="absolute h-full bg-grayf9 right-[5px] flex top-0 self-center  shadow-6xl">
                    {" "}
                  </div>
                </div>
              </div>
              {isStatus && resellerStatusMain ? (
                <>
                  {activeTab !== "Servicer" &&
                  activeTab !== "PriceBook" &&
                  activeTab !== "Contracts" &&
                  activeTab !== "Unpaid Claims" &&
                  activeTab !== "Paid Claims" ? (
                    <div
                      className="col-span-2"
                      onClick={() => routeToPage(activeTab)}
                    >
                      <Button className="!bg-white flex self-center h-full mb-4 rounded-xl ml-auto border-[1px] border-Light-Grey">
                        <img
                          src={AddItem}
                          className="self-center"
                          alt="AddItem"
                        />
                        <span className="text-black ml-1 text-[13px] self-center font-Regular !font-[700]">
                          Add {activeTab}
                        </span>
                      </Button>
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              ) : activeTab === "Claims" ? (
                <div
                  className="col-span-2"
                  onClick={() => routeToPage(activeTab)}
                >
                  <Button className="!bg-white flex self-center h-full mb-4 rounded-xl ml-auto border-[1px] border-Light-Grey">
                    <img src={AddItem} className="self-center" alt="AddItem" />
                    <span className="text-black ml-1 text-[13px] self-center font-Regular !font-[700]">
                      Add Claim
                    </span>
                  </Button>
                </div>
              ) : (
                <></>
              )}
            </Grid>

            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`${activeTab !== tab.id ? "hidden" : "pb-20"}`}
              >
                {tab.content}
              </div>
            ))}
          </div>
        </Grid>
      </div>

      {/* Modal Email Popop */}
      <Modal isOpen={isModalOpen} className="!w-[730px]" onClose={closeModal}>
        <div className="p-8">
          <p className="text-3xl text-center font-semibold mb-4">
            Edit Reseller Details
          </p>
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
                <div className="mt-3">
                  <Input
                    type="text"
                    name="country"
                    label="Country"
                    required={true}
                    className="!bg-white"
                    placeholder=""
                    value={formik.values.country}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    defaultValue="USA"
                    error={formik.touched.country && formik.errors.country}
                    disabled
                  />
                </div>
              </div>
              <div className="col-span-6">
                <p className="text-light-black flex text-[11px] mb-3 mt-2 font-semibold ">
                  Do you want to create an account?
                  <RadioButton
                    id="yes-create-account"
                    label="Yes"
                    value={true}
                    checked={createAccount === true}
                    onChange={handleAccountChange}
                  />
                  <RadioButton
                    id="no-create-account"
                    label="No"
                    value={false}
                    checked={createAccount === false}
                    onChange={handleAccountChange}
                  />
                </p>
                <p className="text-light-black flex text-[11px] mb-7 font-semibold self-center">
                  {" "}
                  <span className="mr-[2px]">
                    {" "}
                    Do you want to work as a servicer?
                  </span>
                  <RadioButton
                    id="yes"
                    label="Yes"
                    value={true}
                    disabled={resellerDetail?.resellerData?.isServicer === true}
                    checked={createServicerAccountOption === true}
                    onChange={handleServiceChange}
                  />
                  <RadioButton
                    id="no"
                    label="No"
                    value={false}
                    disabled={createServicerAccountOption === true}
                    checked={createServicerAccountOption === false}
                    onChange={handleServiceChange}
                  />
                </p>
              </div>
              <div className="col-span-4">
                <Button
                  type="button"
                  className="border w-full !border-Bright-Grey !bg-[transparent] !text-light-black !text-sm !font-Regular"
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

      {/* Modal Primary Popop */}
      <Modal isOpen={isModalOpen1} onClose={closeModal1}>
        <form onSubmit={servicerForm.handleSubmit}>
          <div className="text-center py-3">
            <p className="text-3xl mb-0 mt-2 font-bold text-light-black">
              Assign Servicer
            </p>
            <div className="my-4 h-[350px] max-h-[350px] overflow-y-scroll">
              <DataTable
                columns={columns}
                data={servicerList}
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
                  className="border w-full !border-Bright-Grey !bg-[transparent] !text-light-black !text-sm !font-Regular"
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
        </form>
      </Modal>

      {/* Modal Add User Popop */}
      <Modal isOpen={isUserModalOpen} onClose={closeUserModal}>
        <div className=" py-3">
          <p className=" text-center text-3xl mb-5 mt-2 font-bold text-light-black">
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
                    disabled={
                      resellerDetail.resellerData?.isAccountCreate === false
                    }
                    // value={true}
                    checked={createAccountOption === "yes"}
                    onChange={handleRadioChange}
                  />
                  <RadioButton
                    id="no-create-account"
                    label="No"
                    value="no"
                    disabled={
                      resellerDetail.resellerData?.isAccountCreate === false
                    }
                    // value={false}
                    checked={createAccountOption === "no"}
                    // checked={createAccount === "no"}
                    onChange={handleRadioChange}
                  />
                </p>
              </div>
            </Grid>
            <Grid className="drop-shadow-5xl px-8">
              <div className="col-span-4">
                <Button
                  type="button"
                  className="border w-full !border-Bright-Grey !bg-[transparent] !text-light-black !text-sm !font-Regular"
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

      <Modal isOpen={modalOpen} onClose={closeModal10}>
        <div className="text-center py-3">
          <img src={Primary} alt="email Image" className="mx-auto" />
          <p className="text-3xl mb-0 mt-2 font-bold text-light-black">
            {firstMessage}
          </p>
          <p className="text-neutral-grey text-base font-medium mt-4">
            {secondMessage} {""} <br /> Redirecting Back to Detail page in{" "}
            {timer} Seconds
          </p>
        </div>
      </Modal>
    </>
  );
}

export default ResellerDetails;
