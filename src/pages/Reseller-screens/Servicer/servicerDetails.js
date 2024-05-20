// import React, { useEffect, useState } from "react";
// import Headbar from "../../../common/headBar";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import Grid from "../../../common/grid";
// import Button from "../../../common/button";

// // Media Import
// import BackImage from "../../../assets/images/icons/backArrow.svg";
// import address from "../../../assets/images/Dealer/Address.svg";
// import name from "../../../assets/images/Dealer/Name.svg";
// import AddItem from "../../../assets/images/icons/addItem.svg";
// // import Bank from "../../../assets/images/icons/bankIcon.svg";
// // import DealerActive from "../../../assets/images/icons/dealerDetails.svg";
// // import ClaimActive from "../../../assets/images/Dealer/Claim-active.svg";
// // import UserActive from "../../../assets/images/Dealer/User-active.svg";
// // import Dealer from "../../../assets/images/icons/dealer.svg";
// // import Unpaid from "../../../assets/images/icons/Unpaid.svg";
// // import UnpaidActive from "../../../assets/images/icons/unpaidActive.svg";
// // import Claim from "../../../assets/images/Dealer/Claim.svg";
// // import User from "../../../assets/images/Dealer/Users.svg";
// // import ClaimList from "../Dealer/Dealer-Details/claim";
// // import UserList from "../Dealer/Dealer-Details/user";
// // import DealerDetailList from "../Dealer/Dealer-Details/dealer";
// import email from "../../../assets/images/Dealer/Email.svg";
// import phone from "../../../assets/images/Dealer/Phone.svg";
// import Modal from "../../../common/model";
// import Input from "../../../common/input";
// import Select from "../../../common/select";
// import { getUserListByDealerId } from "../../../services/userServices";
// import RadioButton from "../../../common/radio";
// import { useFormik } from "formik";
// import DataTable from "react-data-table-component";
// import { MyContextProvider, useMyContext } from "../../../context/context";
// import * as Yup from "yup";
// import {
//   addUserByServicerId,
//   changeServicerStatus,
//   createRelationWithServicer,
//   getDealerListByServicerId,
//   getServicerDetailsByServicerId,
// } from "../../../services/servicerServices";
// import { RotateLoader } from "react-spinners";
// import Primary from "../../.././assets/images/SetPrimary.png";
// import { cityData } from "../../../stateCityJson";
// import shorting from "../../../assets/images/icons/shorting.svg";

// function ResellerServicerDetails() {
//   const getInitialActiveTab = () => {
//     const storedTab = localStorage.getItem("servicer");
//     return storedTab ? storedTab : "Claims";
//   };
//   const [activeTab, setActiveTab] = useState(getInitialActiveTab()); // Set the initial active tab
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState("");
//   const [isModalOpen1, setIsModalOpen1] = useState(false);
//   const [isUserModalOpen, setIsUserModalOpen] = useState(false);
//   const [refreshList, setRefreshUserList] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const { servicerId } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [firstMessage, setFirstMessage] = useState("");
//   const [secondMessage, setSecondMessage] = useState("");
//   const [servicerDetails, setServicerDetails] = useState({});
//   const [createAccountOption, setCreateAccountOption] = useState("yes");
//   const [timer, setTimer] = useState(3);
//   const { flag, toggleFlag } = useMyContext();
//   const [dealerList, setDealerList] = useState([]);
//   const [flagValue, setFlagValue] = useState(false);
//   const [initialUserFormValues, setInitialUserFormValues] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phoneNumber: "",
//     position: "",
//     status: "yes",
//     servicerId: servicerId,
//     isPrimary: false,
//   });
//   const [initialFormValues, setInitialFormValues] = useState({
//     name: "",
//     dealerId: "",
//     street: "",
//     city: "",
//     zip: "",
//     state: "",
//     country: "USA",
//     oldName: "",
//   });
//   const state = cityData;
//   // const { flag } = useMyContext();
//   const emailValidationRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
//   const modalOpen1 = () => {
//     getDealerList();
//     setIsModalOpen1(true);
//   };
//   const routeToPage = (data) => {
//     // console.log(data, id.id);
//     switch (data) {
//       case "Users":
//         openUserModal();
//         localStorage.setItem("servicer", "Users");
//         break;
//       case "Dealer":
//         modalOpen1();
//         localStorage.setItem("servicer", "Dealer");
//         break;
//       default:
//         console.log("Invalid data, no navigation");
//     }
//   };
//   const closeModal = () => {
//     setIsModalOpen(false);
//     formik.resetForm();
//   };
//   useEffect(() => {
//     localStorage.setItem("servicer", activeTab);
//   }, [activeTab]);

//   useEffect(() => {
//     setLoading(true);
//     let intervalId;

//     if (modalOpen && timer > 0) {
//       intervalId = setInterval(() => {
//         setTimer((prevTimer) => prevTimer - 1);
//       }, 1000);
//     }

//     if (timer === 0) {
//       closeModal10();
//     }

//     if (!modalOpen) {
//       clearInterval(intervalId);
//       setTimer(3);
//     }

//     setLoading(false);

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [modalOpen, timer]);
//   const openUserModal = () => {
//     setIsUserModalOpen(true);
//   };
//   const closeModal10 = () => {
//     setModalOpen(false);
//   };
//   const openModal = () => {
//     setIsModalOpen(true);
//   };
//   const closeModal1 = () => {
//     setIsModalOpen1(false);
//   };
//   const closeUserModal = () => {
//     setIsUserModalOpen(false);
//     userValues.resetForm();
//   };
//   const getUserList = async () => {
//     const result = await getUserListByDealerId(servicerId, {});
//     console.log(result.result, "----------");
//     setRefreshUserList(result.result);
//   };
//   const handleSelectChange1 = (label, value) => {
//     setSelectedProduct(value);
//   };
//   const handleRadioChange = (event) => {
//     const selectedValue = event.target.value;
//     userValues.setFieldValue("status", selectedValue === "yes" ? true : false);
//     setCreateAccountOption(selectedValue);
//   };

//   const CustomNoDataComponent = () => (
//     <div className="text-center">
//       <p>No records found.</p>
//     </div>
//   );
//   const columns = [
//     {
//       name: "Dealer ID",
//       selector: (row) => row.unique_key,
//       sortable: true,
//       minWidth: "33%",
//       center: true,
//     },
//     {
//       name: "Dealer Name",
//       selector: (row) => row.name,
//       sortable: true,
//       minWidth: "50%",
//       center: true,
//     },
//     {
//       name: "Action",
//       center: true,
//       minWidth: "12%",
//       cell: (row, index) => {
//         return (
//           <div>
//             <input
//               type="checkbox"
//               className="accent-gray-600"
//               checked={row.check}
//               onChange={(e) => {
//                 const checked = e.target.checked;
//                 const itemId = dealerList[index]._id;
//                 dealerList[index].check = checked;
//                 const selectedItems = checked
//                   ? [...dealerForm.values.selectedItems, itemId]
//                   : dealerForm.values.selectedItems.filter(
//                       (id) => id !== itemId
//                     );

//                 dealerForm.setFieldValue("selectedItems", selectedItems);
//               }}
//             />
//           </div>
//         );
//       },
//     },
//   ];
//    const tabs = [
//   //   {
//   //     id: "Claims",
//   //     label: "Claims",
//   //     icons: Claim,
//   //     Activeicons: ClaimActive,
//   //     content: <ClaimList />,
//   //   },
//   //   {
//   //     id: "Dealer",
//   //     label: "Dealer",
//   //     icons: Dealer,
//   //     Activeicons: DealerActive,
//   //     content: <DealerDetailList id={servicerId} flag={flagValue} activeTab={activeTab} />,
//   //   },
//   //   {
//   //     id: "Users",
//   //     label: "Users",
//   //     icons: User,
//   //     Activeicons: UserActive,
//   //     content: (
//   //       <UserList flag={"servicer"} id={servicerId} data={refreshList} activeTab={activeTab} />
//   //     ),
//   //   },
//   //   {
//   //     id: "Unpaid Claims",
//   //     label: "Unpaid Claims",
//   //     icons: Unpaid,
//   //     Activeicons: UnpaidActive,
//   //     content: <UserList />,
//   //   },
//    ];
//   const handleSelectChange = async (name, value) => {
//     formik.setFieldValue(name, value);
//   };
//   const getDealerList = async () => {
//     // setLoading(true);
//     const result = await getDealerListByServicerId(servicerId);
//     setDealerList(result.result);
//     console.log(result.result);
//     // setLoading(false);
//   };
//   useEffect(() => {
//     servicerDetail();
//     getDealerList();
//   }, [servicerId, flag]);

//   const dealerForm = useFormik({
//     initialValues: {
//       selectedItems: [],
//     },

//     onSubmit: async (values) => {
//       setFlagValue(false);
//       setLoading(true);
//       const selectedData = dealerList.map((item) => ({
//         _id: item._id,
//         status: values.selectedItems.includes(item._id) || item.check,
//       }));

//       console.log("Selected Data: ", selectedData);

//       const result = await createRelationWithServicer(servicerId, {
//         dealers: selectedData,
//       });
//       console.log(result);
//       if (result.code === 200) {
//         setLoading(false);
//         setFlagValue(true);
//         setModalOpen(true);
//         setFirstMessage("Dealer Assigned Successfully");
//         setSecondMessage("Dealer Assigned Successfully");
//         getDealerList();
//         setTimer(3);
//         closeModal1();
//       } else {
//         setLoading(false);
//         getDealerList();
//         closeModal1();
//       }

//       closeModal1();
//       dealerForm.resetForm();
//     },
//   });
//   const servicerDetail = async () => {
//     setLoading(true);
//     const res = await getServicerDetailsByServicerId(servicerId);
//     setServicerDetails(res.message);
//     console.log(res.message);
//     setInitialFormValues({
//       name: res?.message?.meta?.name,
//       oldName: res?.message?.meta?.name,
//       servicerId: servicerId,
//       street: res?.message?.meta?.street,
//       city: res?.message?.meta?.city,
//       zip: res?.message?.meta?.zip,
//       state: res?.message?.meta?.state,
//       country: "USA",
//     });
//     setLoading(false);
//   };
//   const userValues = useFormik({
//     initialValues: initialUserFormValues,
//     enableReinitialize: true,
//     validationSchema: Yup.object({
//       firstName: Yup.string()
//         .transform((originalValue) => originalValue.trim())
//         .required("Required")
//         .max(500, "Must be exactly 500 characters"),
//       lastName: Yup.string()
//         .transform((originalValue) => originalValue.trim())
//         .required("Required")
//         .max(500, "Must be exactly 500 characters"),
//       phoneNumber: Yup.string()
//         .required("Required")
//         .min(10, "Must be at least 10 characters")
//         .max(10, "Must be exactly 10 characters")
//         .matches(/^[0-9]+$/, "Must contain only digits"),
//       email: Yup.string()
//         .transform((originalValue) => originalValue.trim())
//         .matches(emailValidationRegex, "Invalid email address")
//         .required("Required"),
//     }),

//     onSubmit: async (values, { setFieldError }) => {
//       localStorage.setItem("servicer", "Users");
//       console.log(values);
//       setLoading(true);
//       if (values.status === "yes") {
//         values.status = true;
//       }
//       const result = await addUserByServicerId(values, servicerId);
//       console.log(result.code);
//       if (result.code == 200) {
//         getUserList();
//         setLoading(false);
//         closeUserModal();
//         setTimer(3);
//         setModalOpen(true);
//         setFirstMessage("New User Added Successfully");
//         setSecondMessage("New User Added Successfully");
//       } else {
//         console.log(result);
//         console.log("here");
//         if (result.code === 401) {
//           console.log("here12");
//           setFieldError("email", "Email already in use");
//         }
//         setLoading(false);
//       }
//     },
//   });
//   const handleTabClick = (tabId) => {
//     setActiveTab(tabId);
//   };
//   const formik = useFormik({
//     initialValues: initialFormValues,
//     enableReinitialize: true,
//     validationSchema: Yup.object({
//       // dealerId: Yup.string().required("Required"),
//       name: Yup.string()
//         .transform((originalValue) => originalValue.trim())
//         .required("Required")
//         .max(500, "Must be exactly 500 characters"),
//       street: Yup.string()
//         .transform((originalValue) => originalValue.trim())
//         .required("Required")
//         .max(500, "Must be exactly 500 characters"),
//       state: Yup.string()
//         .transform((originalValue) => originalValue.trim())
//         .required("Required"),
//       city: Yup.string()
//         .transform((originalValue) => originalValue.trim())
//         .required("Required"),
//       country: Yup.string().required("Required"),
//       zip: Yup.string()
//         .required("Required")
//         .min(5, "Must be at least 5 characters")
//         .max(6, "Must be exactly 6 characters"),
//     }),

//     onSubmit: async (values) => {
//       console.log(values);
//       setLoading(true);
//       const result = await changeServicerStatus(servicerId, values);

//       console.log(result);
//       if (result.code == 200) {
//         setLoading(false);
//         setModalOpen(true);
//         servicerDetail();
//         setIsModalOpen(false);
//         setTimer(3);
//         setFirstMessage("Edited Successfully");
//         setSecondMessage("Servicer edited Successfully");

//         // setMessage("Dealer updated Successfully");
//       } else if (result.message == "Servicer already exist with this name") {
//         setLoading(false);
//         formik.setFieldError("name", "Name Already Used");
//       } else {
//         setLoading(false);
//         setTimer(3);
//       }
//     },
//   });
//   const navigate = useNavigate();
//   const handleGOBack = () => {
//     localStorage.removeItem("servicer");
//     navigate(-1);
//   };
//   const serviceData = async () => {
//     // const result =await
//   };
//   return (
//     <>
//       {loading && (
//         <div className=" fixed z-[999999] bg-[#333333c7] backdrop-blur-xl  h-screen w-full flex py-5">
//           <div className="self-center mx-auto">
//             <RotateLoader color="#fff" />
//           </div>
//         </div>
//       )}
//       <div className="py-8 px-3 relative overflow-x-hidden bg-grayf9">
//         <Headbar />

//         <div className="flex">
//           <Link
//             onClick={handleGOBack}
//             className="h-[60px] w-[60px] flex border-[1px] bg-white border-Light-Grey rounded-[25px]"
//           >
//             <img
//               src={BackImage}
//               className="m-auto my-auto self-center bg-white"
//               alt="BackImage"
//             />
//           </Link>
//           <div className="pl-3">
//             <p className="font-bold text-[36px] leading-9 mb-[3px]">
//               Servicer Details
//             </p>
//             <ul className="flex self-center">
//               <li className="text-sm text-neutral-grey font-Regular">
//                 <Link onClick={handleGOBack}>Servicer / </Link>{" "}
//               </li>
//               <li className="text-sm text-neutral-grey font-Regular">
//                 <Link onClick={handleGOBack}> Servicer List / </Link>{" "}
//               </li>
//               <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
//                 {" "}
//                 Servicer Details ({activeTab})
//               </li>
//             </ul>
//           </div>
//         </div>

//         <Grid className="!grid-cols-4">
//           <div className="col-span-1">
//             <div className=" bg-Dealer-details bg-cover mt-5 p-5 rounded-[20px]">
//               <Grid>
//                 <div className="col-span-9">
//                   <p className="text-sm text-neutral-grey font-Regular">
//                     Account Name
//                   </p>
//                   <p className="text-xl text-white font-semibold">
//                     {servicerDetails?.meta?.name}
//                   </p>
//                 </div>
//                 <div className="col-span-3 text-end">
//                   <Button
//                     className="border !border-[#535456] !text-sm !font-Regular"
//                     onClick={openModal}
//                   >
//                     Edit
//                   </Button>
//                 </div>
//               </Grid>
//               <div className="flex my-4">
//                 <img
//                   src={address}
//                   className="mr-3 bg-[#383838] rounded-[14px] my-auto"
//                   alt="Address"
//                 />
//                 <div>
//                   <p className="text-sm text-neutral-grey font-Regular mt-3">
//                     Address
//                   </p>
//                   <p className="text-base text-white font-semibold leading-5">
//                     {servicerDetails?.meta?.street},{" "}
//                     {servicerDetails?.meta?.city},{" "}
//                     {servicerDetails?.meta?.state} {servicerDetails?.meta?.zip},
//                     USA
//                   </p>
//                 </div>
//               </div>
//               {/* <div className="flex my-4">
//               <img
//                 src={Bank}
//                 className="mr-3 bg-[#383838] rounded-[14px] self-start mt-3"
//                 alt="Bank"
//               />
//               <div>
//                 <p className="text-sm text-neutral-grey font-Regular mt-3">
//                   Bank Details
//                 </p>
//                 <div className="bg-[#383838] border border-[#D1D9E24D] rounded-lg px-2.5 py-2 mt-1">
//                   <Grid className="!gap-1">
//                     <div className="col-span-6">
//                       <p className="text-[10px] text-neutral-grey font-Regular">
//                         Bank Name:
//                       </p>
//                       <p className="text-sm text-white font-semibold leading-5">
//                         XYZ Bank
//                       </p>
//                     </div>
//                     <div className="col-span-6">
//                       <p className="text-[10px] text-neutral-grey font-Regular">
//                         Account Number:
//                       </p>
//                       <p className="text-sm text-white font-semibold leading-5">
//                         987654321
//                       </p>
//                     </div>
//                     <div className="col-span-6">
//                       <p className="text-[10px] text-neutral-grey font-Regular">
//                         ABA Routing Number:
//                       </p>
//                       <p className="text-sm text-white font-semibold leading-5">
//                         123456789
//                       </p>
//                     </div>
//                     <div className="col-span-6">
//                       <p className="text-[10px] text-neutral-grey font-Regular">
//                         Account Holder:
//                       </p>
//                       <p className="text-sm text-white font-semibold leading-5">
//                         John Doe
//                       </p>
//                     </div>
//                   </Grid>
//                 </div>
//               </div>
//             </div> */}
//               <div className="flex w-full my-4">
//                 <p className="text-[10px] mr-3 text-neutral-grey font-Regular">
//                   PRIMARY CONTACT DETAILS
//                 </p>
//                 <hr className="self-center border-[#999999] w-[50%]" />
//               </div>
//               <div className="flex mb-4">
//                 <img
//                   src={name}
//                   className="mr-3 bg-[#383838] rounded-[14px]"
//                   alt="Name"
//                 />
//                 <div>
//                   <p className="text-sm text-neutral-grey font-Regular">Name</p>
//                   <p className="text-base text-white font-semibold ">
//                     {servicerDetails?.firstName} {servicerDetails?.lastName}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex mb-4">
//                 <img
//                   src={email}
//                   className="mr-3 bg-[#383838] rounded-[14px]"
//                   alt="email"
//                 />
//                 <div>
//                   <p className="text-sm text-neutral-grey font-Regular">
//                     Email
//                   </p>
//                   <p className="text-base text-white font-semibold ">
//                     {servicerDetails?.email}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex mb-4">
//                 <img
//                   src={phone}
//                   className="mr-3 bg-[#383838] rounded-[14px]"
//                   alt="name"
//                 />
//                 <div>
//                   <p className="text-sm text-neutral-grey font-Regular">
//                     Phone Number
//                   </p>
//                   <p className="text-base text-white font-semibold ">
//                     +1 {servicerDetails?.phoneNumber}
//                   </p>
//                 </div>
//               </div>
//               <Grid className="mt-5">
//                 <div className="col-span-6 ">
//                   <div className="bg-[#2A2A2A] self-center px-4 py-6 rounded-xl">
//                     <p className="text-white text-lg !font-[600]">0</p>
//                     <p className="text-neutral-grey text-sm font-Regular">
//                       Total number of Claims
//                     </p>
//                   </div>
//                 </div>
//                 <div className="col-span-6 ">
//                   <div className="bg-[#2A2A2A] self-center px-4 py-6 rounded-xl">
//                     <p className="text-white text-lg  !font-[600]">$0.00</p>
//                     <p className="text-neutral-grey text-sm font-Regular">
//                       Total Value of Claims
//                     </p>
//                   </div>
//                 </div>
//               </Grid>
//             </div>
//           </div>
//           <div className="col-span-3">
//             <Grid className="">
//               <div className="col-span-8">
//                 <div className="bg-[#fff] rounded-[30px] p-3 border-[1px] border-Light-Grey">
//                   <Grid className="!grid-cols-4 !gap-1">
//                     {tabs.map((tab) => (
//                       <div className="col-span-1" key={tab.id}>
//                         <Button
//                           className={`flex self-center w-full !px-2 !py-1 rounded-xl border-[1px] border-Light-Grey ${
//                             activeTab === tab.id
//                               ? "!bg-[#2A2A2A] !text-white"
//                               : "!bg-grayf9 !text-black"
//                           }`}
//                           onClick={() => handleTabClick(tab.id)}
//                         >
//                           <img
//                             src={
//                               activeTab === tab.id ? tab.Activeicons : tab.icons
//                             }
//                             className="self-center pr-1 py-1 border-Light-Grey border-r-[1px]"
//                             alt={tab.label}
//                           />
//                           <span
//                             className={`ml-1 py-1 text-sm font-Regular ${
//                               activeTab === tab.id ? "text-white" : "text-black"
//                             }`}
//                           >
//                             {tab.label}
//                           </span>
//                         </Button>
//                       </div>
//                     ))}
//                   </Grid>
//                 </div>
//               </div>
//               <div className="col-span-4">
//                 <Button
//                   onClick={() => routeToPage(activeTab)}
//                   className="!bg-white flex self-center h-full  mb-4 rounded-xl ml-auto border-[1px] border-Light-Grey"
//                 >
//                   {" "}
//                   <img
//                     src={AddItem}
//                     className="self-center"
//                     alt="AddItem"
//                   />{" "}
//                   <span className="text-black ml-2 self-center text-[14px] font-Regular !font-[700]">
//                     Add {activeTab}
//                   </span>{" "}
//                 </Button>
//               </div>
//             </Grid>

//             {tabs.map((tab) => (
//               <div
//                 key={tab.id}
//                 className={`${activeTab !== tab.id ? "hidden" : ""}`}
//               >
//                 {tab.content}
//               </div>
//             ))}
//           </div>
//         </Grid>
//         {/* user popup */}
//         <Modal isOpen={isUserModalOpen} onClose={closeUserModal}>
//           <div className="py-3">
//             <p className="text-center  text-3xl mb-5 mt-2 font-bold text-light-black">
//               Add New User
//             </p>
//             <form onSubmit={userValues.handleSubmit}>
//               <Grid className="px-8">
//                 <div className="col-span-6">
//                   <Input
//                     type="text"
//                     name="firstName"
//                     label="First Name"
//                     required={true}
//                     placeholder=""
//                     className="!bg-white"
//                     maxLength={"30"}
//                     value={userValues.values.firstName}
//                     onBlur={userValues.handleBlur}
//                     onChange={userValues.handleChange}
//                     error={
//                       userValues.touched.firstName &&
//                       userValues.errors.firstName
//                     }
//                   />
//                   {userValues.touched.firstName &&
//                     userValues.errors.firstName && (
//                       <div className="text-red-500 text-sm pl-2 pt-2">
//                         {userValues.errors.firstName}
//                       </div>
//                     )}
//                 </div>
//                 <div className="col-span-6">
//                   <Input
//                     type="text"
//                     name="lastName"
//                     label="Last Name"
//                     required={true}
//                     placeholder=""
//                     className="!bg-white"
//                     maxLength={"30"}
//                     value={userValues.values.lastName}
//                     onBlur={userValues.handleBlur}
//                     onChange={userValues.handleChange}
//                     error={
//                       userValues.touched.lastName && userValues.errors.lastName
//                     }
//                   />
//                   {userValues.touched.lastName &&
//                     userValues.errors.lastName && (
//                       <div className="text-red-500 text-sm pl-2 pt-2">
//                         {userValues.errors.lastName}
//                       </div>
//                     )}
//                 </div>
//                 <div className="col-span-6">
//                   <Input
//                     type="text"
//                     name="email"
//                     label="Email"
//                     placeholder=""
//                     className="!bg-white"
//                     required={true}
//                     value={userValues.values.email}
//                     onBlur={userValues.handleBlur}
//                     onChange={userValues.handleChange}
//                     error={userValues.touched.email && userValues.errors.email}
//                   />
//                   {userValues.touched.email && userValues.errors.email && (
//                     <div className="text-red-500 text-sm pl-2 pt-2">
//                       {userValues.errors.email}
//                     </div>
//                   )}
//                 </div>
//                 <div className="col-span-6">
//                   <Input
//                     type="tel"
//                     name="phoneNumber"
//                     label="Phone"
//                     required={true}
//                     className="!bg-white"
//                     placeholder=""
//                     value={userValues.values.phoneNumber}
//                     onChange={(e) => {
//                       const sanitizedValue = e.target.value.replace(
//                         /[^0-9]/g,
//                         ""
//                       );
//                       console.log(sanitizedValue);
//                       userValues.handleChange({
//                         target: {
//                           name: "phoneNumber",
//                           value: sanitizedValue,
//                         },
//                       });
//                     }}
//                     onBlur={userValues.handleBlur}
//                     minLength={"10"}
//                     maxLength={"10"}
//                     error={
//                       userValues.touched.phoneNumber &&
//                       userValues.errors.phoneNumber
//                     }
//                   />
//                   {(userValues.touched.phoneNumber ||
//                     userValues.submitCount > 0) &&
//                     userValues.errors.phoneNumber && (
//                       <div className="text-red-500 text-sm pl-2 pt-2">
//                         {userValues.errors.phoneNumber}
//                       </div>
//                     )}
//                 </div>
//                 <div className="col-span-6">
//                   <Input
//                     type="text"
//                     name="position"
//                     label="Position"
//                     className="!bg-white"
//                     placeholder=""
//                     maxLength={"50"}
//                     value={userValues.values.position}
//                     onBlur={userValues.handleBlur}
//                     onChange={userValues.handleChange}
//                     error={
//                       userValues.touched.position && userValues.errors.position
//                     }
//                   />
//                 </div>
//                 <div className="col-span-6">
//                   <p className="text-light-black flex text-[12px] font-semibold mt-3 mb-6">
//                     Do you want to create an account?
//                     <RadioButton
//                       id="yes-create-account"
//                       label="Yes"
//                       value="yes"
//                       checked={createAccountOption === "yes"}
//                       onChange={handleRadioChange}
//                     />
//                     <RadioButton
//                       id="no-create-account"
//                       label="No"
//                       value="no"
//                       checked={createAccountOption === "no"}
//                       onChange={handleRadioChange}
//                     />
//                   </p>
//                 </div>
//               </Grid>
//               <Grid className="drop-shadow-5xl px-8">
//                 <div className="col-span-4">
//                   <Button
//                     type="button"
//                     className="border w-full !border-[#535456] !bg-[transparent] !text-light-black !text-sm !font-Regular"
//                     onClick={closeUserModal}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//                 <div className="col-span-8">
//                   <Button type="submit" className="w-full">
//                     Submit
//                   </Button>
//                 </div>
//               </Grid>
//             </form>
//           </div>
//         </Modal>

//         {/* <div className="col-span-12">
//               <div className="flex w-full my-2">
//                 <p className="text-sm mr-3 text-neutral-grey font-Regular">
//                   BANK DETAILS
//                 </p>
//                 <hr className="self-center border-[#999999] w-[80%]" />
//               </div>
//             </div>
//             <div className="col-span-6">
//               <Input
//                 name="bankName"
//                 type="text"
//                 className="!bg-[#fff]"
//                 label="Bank Name"
//               />
//             </div>
//             <div className="col-span-6">
//               <Input
//                 name="routingNumber"
//                 type="number"
//                 className="!bg-[#fff]"
//                 label="ABA Routing Number"
//               />
//             </div>
//             <div className="col-span-6">
//               <Input
//                 name="accountNumber"
//                 type="number"
//                 className="!bg-[#fff]"
//                 label="Account Number"
//               />
//             </div>
//             <div className="col-span-6">
//               <Input
//                 name="accountHolder"
//                 type="text"
//                 className="!bg-[#fff]"
//                 label="Account Holder"
//               />
//             </div> */}
//         {/* Modal Email Popop */}
//         <Modal isOpen={isModalOpen} onClose={closeModal}>
//           <div className="text-center px-8 py-4">
//             <p className="text-3xl font-bold mb-8">Edit Servicer Details</p>
//             <form className="mt-8" onSubmit={formik.handleSubmit}>
//               <Grid>
//                 <div className="col-span-12">
//                   <Input
//                     type="text"
//                     name="name"
//                     className="!bg-white"
//                     label="Account Name"
//                     required={true}
//                     placeholder=""
//                     maxLength={"500"}
//                     value={formik.values.name}
//                     onBlur={formik.handleBlur}
//                     onChange={formik.handleChange}
//                     error={formik.touched.name && formik.errors.name}
//                   />
//                   {formik.touched.name && formik.errors.name && (
//                     <div className="text-red-500 text-sm pl-2 pt-2">
//                       {formik.errors.name}
//                     </div>
//                   )}
//                 </div>
//                 <div className="col-span-12">
//                   <Input
//                     type="text"
//                     name="street"
//                     className="!bg-white"
//                     label="Street Address"
//                     required={true}
//                     placeholder=""
//                     maxLength={"500"}
//                     value={formik.values.street}
//                     onBlur={formik.handleBlur}
//                     onChange={formik.handleChange}
//                     error={formik.touched.street && formik.errors.street}
//                   />
//                   {formik.touched.street && formik.errors.street && (
//                     <div className="text-red-500 text-sm pl-2 pt-2">
//                       {formik.errors.street}
//                     </div>
//                   )}
//                 </div>
//                 <div className="col-span-6">
//                   <Input
//                     type="number"
//                     name="zip"
//                     label="Zip Code"
//                     className="!bg-white"
//                     required={true}
//                     placeholder=""
//                     value={formik.values.zip}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     minLength={"5"}
//                     maxLength={"6"}
//                     error={formik.touched.zip && formik.errors.zip}
//                   />
//                   {formik.touched.zip && formik.errors.zip && (
//                     <div className="text-red-500 text-sm pl-2 pt-2">
//                       {formik.errors.zip}
//                     </div>
//                   )}
//                 </div>
//                 <div className="col-span-6">
//                   <Input
//                     type="text"
//                     name="city"
//                     label="City"
//                     className="!bg-white"
//                     placeholder=" "
//                     required={true}
//                     maxLength={"20"}
//                     value={formik.values.city}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     error={formik.touched.city && formik.errors.city}
//                   />
//                   {formik.touched.city && formik.errors.city && (
//                     <div className="text-red-500 text-sm pl-2 pt-2">
//                       {formik.errors.city}
//                     </div>
//                   )}
//                 </div>
//                 <div className="col-span-6">
//                   <Select
//                     label="State"
//                     name="state"
//                     placeholder=""
//                     className="!bg-white"
//                     required={true}
//                     onChange={handleSelectChange}
//                     options={state}
//                     value={formik.values.state}
//                     onBlur={formik.handleBlur}
//                     error={formik.touched.state && formik.errors.state}
//                   />
//                   {formik.touched.state && formik.errors.state && (
//                     <div className="text-red-500 text-sm pl-2 pt-2">
//                       {formik.errors.state}
//                     </div>
//                   )}
//                 </div>
//                 <div className="col-span-6">
//                   <Input
//                     type="text"
//                     name="country"
//                     label="Country"
//                     required={true}
//                     placeholder=""
//                     value={formik.values.country}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     defaultValue="USA"
//                     error={formik.touched.country && formik.errors.country}
//                     disabled
//                   />
//                 </div>
//                 <div className="col-span-4">
//                   <Button
//                     type="button"
//                     className="border w-full !border-[#535456] !bg-[transparent] !text-light-black !text-sm !font-Regular"
//                     onClick={closeModal}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//                 <div className="col-span-8">
//                   <Button type="submit" className="w-full">
//                     Submit
//                   </Button>
//                 </div>
//               </Grid>
//             </form>
//           </div>
//         </Modal>
//         {/* Modal Primary Popop */}
//         <Modal isOpen={isModalOpen1} onClose={closeModal1}>
//           <form onSubmit={dealerForm.handleSubmit}>
//             <div className="text-center py-3">
//               <p className="text-3xl mb-0 mt-2 font-bold text-light-black">
//                 Assign Dealer
//               </p>
//               <div className="my-4 h-[350px] max-h-[350px] overflow-y-scroll">
//                 <DataTable
//                   columns={columns}
//                   data={dealerList}
//                   highlightOnHover
//                   sortIcon={
//                     <>
//                       {" "}
//                       <img src={shorting} className="ml-2" alt="shorting" />
//                     </>
//                   }
//                   noDataComponent={<CustomNoDataComponent />}
//                 />
//               </div>
//               <Grid className="drop-shadow-5xl">
//                 <div className="col-span-4">
//                   <Button
//                     type="button"
//                     className="border w-full !border-[#535456] !bg-[transparent] !text-light-black !text-sm !font-Regular"
//                     onClick={closeModal1}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//                 <div className="col-span-8">
//                   <Button type="submit" className="w-full">
//                     Submit
//                   </Button>
//                 </div>
//               </Grid>
//             </div>
//           </form>
//         </Modal>
//         <Modal isOpen={modalOpen} onClose={closeModal10}>
//           <div className="text-center py-3">
//             <img src={Primary} alt="email Image" className="mx-auto" />
//             <p className="text-3xl mb-0 mt-2 font-bold text-light-black">
//               {firstMessage}
//             </p>
//             <p className="text-neutral-grey text-base font-medium mt-4">
//               {secondMessage} {""} <br /> Redirecting Back to Detail page in{" "}
//               {timer} Seconds
//             </p>
//           </div>
//         </Modal>
//       </div>
//     </>
//   );
// }

// export default ResellerServicerDetails;
