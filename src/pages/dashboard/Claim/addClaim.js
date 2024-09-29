import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileImage,
  faFilePdf,
  faFileWord,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import Headbar from "../../../common/headBar";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Select from "../../../common/select";
import Grid from "../../../common/grid";
import disapprove from "../../../assets/images/Disapproved.png";
import AddDealer from "../../../assets/images/dealer-book.svg";
import Input from "../../../common/input";

// Media Include
import BackImage from "../../../assets/images/icons/backArrow.svg";
import Dropbox from "../../../assets/images/icons/dropBox.svg";
import shorting from "../../../assets/images/icons/shorting.svg";
import Edit from "../../../assets/images/Dealer/EditIcon.svg";
import dummyImage from "../../../assets/images/attachment.png";
import Cross from "../../../assets/images/Cross.png";
import selectIcon from "../../../assets/images/select.png";
import View from "../../../assets/images/eye.png";
import ActiveIcon from "../../../assets/images/icons/iconAction.svg";
import check from "../../../assets/images/icons/check.svg";
import Button from "../../../common/button";
import RadioButton from "../../../common/radio";
import FileDropdown from "../../../common/fileDropbox";
import SelectBoxWIthSerach from "../../../common/selectBoxWIthSerach";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "../../../common/model";
import { date } from "yup";

import CustomPagination from "../../pagination";

import {
  addClaim,
  getContractList,
  getContractValues,
  uploadClaimEvidence,
  getContractPrice,
} from "../../../services/claimServices";
import { getServicerListInOrders } from "../../../services/orderServices";
import { RotateLoader } from "react-spinners";
import SelectBoxWithSearch from "../../../common/selectBoxWIthSerach";
import DataTable from "react-data-table-component";
import Card from "../../../common/card";

function AddClaim() {
  // do this
  const data = JSON.parse(localStorage.getItem("userDetails"));
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading21, setLoading21] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading123, setLoading123] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [pageValue, setPageValue] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(3);
  const [currentStep, setCurrentStep] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [role, setRole] = useState(null);
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(10);
  const [contractList, setContractList] = useState([]);
  const [price, setPrice] = useState(null);
  const [contractDetail, setContractDetails] = useState({});
  const [servicerData, setServicerData] = useState([]);
  const [images, setImages] = useState([]);
  const [sendNotifications, setSendNotifications] = useState(true);
  const navigate = useNavigate();
  const [selectedAction, setSelectedAction] = useState(null);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const [selectedActions, setSelectedActions] = useState([]);
  const { username } = useParams();
  console.log(username);

  const handleToggleDropdown = (index) => {
    const newSelectedActions = [...selectedActions];
    newSelectedActions[index] = !newSelectedActions[index];
    setSelectedActions(newSelectedActions);
  };
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
    setIsModalOpen(false);
  };

  const handleRadioChange = (value) => {
    setSendNotifications(value);
  };

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    setRole(userDetails.role);
    document.addEventListener("click", handleClickOutside);

    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const closeCreate = () => {
    setIsCreateOpen(false);
  };

  useEffect(() => {
    let intervalId;
    if (isCreateOpen && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0) {
      // do this
      closeCreate();
      let navigatePath = "/claimList";
      if (data.role == "Dealer") {
        navigatePath = "/dealer/claimList";
      } else if (data.role == "Reseller") {
        navigatePath = "/reseller/claimList";
      } else if (data.role == "Customer") {
        navigatePath = "/customer/claimList";
      }
      navigate(navigatePath);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isCreateOpen, timer]);

  const isFormEmpty = () => {
    return Object.values(formik.values).every((value) => !value);
  };

  const todayDate = new Date().toISOString().split("T")[0];

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

  const handleImageChange = (e) => {
    const files = e.target.files;
    console.log(files, "------------");

    if (files) {
      const newFiles = Array.from(files)
        .slice(0, 5 - formikStep2.values.images.length)
        .map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          fileType: getFileType(file.type),
        }));

      const updatedImages = [...formikStep2.values.images, ...newFiles];
      formikStep2.setFieldValue("images", updatedImages);
      formikStep2.setFieldValue("file", updatedImages.file);
      setImages(updatedImages);
      console.log(updatedImages, "------------");
      uploadEvidence(updatedImages);
    }
  };

  const getFileType = (fileType) => {
    if (fileType.includes("image")) {
      return "image";
    } else if (fileType.includes("pdf")) {
      return "pdf";
    } else if (
      fileType.includes("spreadsheetml.sheet") ||
      fileType.includes("excel")
    ) {
      return "xlsx";
    } else if (fileType.includes("csv")) {
      return "csv";
    } else if (fileType.includes("ms-excel")) {
      return "xls";
    } else {
      return "other";
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    formikStep2.setFieldValue("images", newImages);
    uploadEvidence(newImages);
    setImages(newImages);
  };

  const uploadEvidence = async (d) => {
    setLoading21(true);
  
    try {
      const formData = new FormData();
      d.forEach((file, index) => {
        formData.append(`file`, file.file);
      });
  
      const data = await uploadClaimEvidence(formData); 
  
      formikStep2.setFieldValue("file", data.file); 
  
    } catch (error) {
      console.error("Error uploading evidence:", error); 
    } finally {
      setLoading21(false); 
    }
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const formik = useFormik({
    initialValues: {
      contractId: "",
      customerName: "",
      serial: "",
      orderId: "",
      venderOrder: "",
      servicerId: "",
    },

    onSubmit: async (values) => {
      setShowTable(true);
      let data = {
        ...values,
        page: 1,
        pageLimit: recordsPerPage,
      };
      getClaimList(data);
    },
  });

  useEffect(() => {
    if (username) {
      formik.setFieldValue("customerName", `${username}`);
    }
  }, [username]);

  const getClaimList = async (data) => {
    setLoading123(true);
    setPageValue(data.page);
    const response = await getContractList(data);

    setTotalRecords(response.totalCount);
    setContractList(response.result);
    setLoading123(false);
  };

  const getClaimPrice = async (id) => {
    const response = await getContractPrice(id);
    setPrice(response.result);
    setLoading(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      default:
        return null;
    }
  };

  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setSelectedActions(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = (row) => {
    setLoading2(true);
    setIsModalOpen(true);
    getContractValues(row._id).then((row) => {
      setContractDetails(row.result);
      getServicerList(
        {
          dealerId: row?.result?.order[0]?.dealerId,
          resellerId: row?.result?.order[0]?.resellerId,
        },
        row.result?.order[0]?.servicerId
      );
      setLoading2(false);
    });
  };

  // Get the current date
  const currentDate = new Date();

  // Get the year, month, and day components of the current date
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-indexed
  const day = currentDate.getDate().toString().padStart(2, "0");

  // Format the date as "YYYY-MM-DD"
  const maxDate = `${year}-${month}-${day}`;

  const getServicerList = async (data, servicerId) => {
    let arr = [];

    const result = await getServicerListInOrders(data);

    const filteredServicers = result.result;
    filteredServicers?.map((res) => {
      arr.push({
        label: res.name,
        value: res._id,
      });
    });
    setServicerData(arr);
    console.log(servicerId);
    formikStep2.setFieldValue("servicerId", servicerId);
  };

  const handleSelectValue = (res) => {
    setLoading21(true);
    getClaimPrice(res._id);
    console.log(loading1, "------------loading21");
    getContractValues(res._id).then((res) => {
      setContractDetails(res.result);
      getServicerList(
        {
          dealerId: res?.result?.order[0]?.dealerId,
          resellerId: res?.result?.order[0]?.resellerId,
        },
        res?.result?.order[0]?.servicerId
      );
    });
    const timer = setTimeout(() => {
      setLoading21(false);
    }, 3000);

    nextStep();
    console.log(loading1, "------------loading21");
  };

  const handlePageChange = async (page, rowsPerPage) => {
    setRecordsPerPage(rowsPerPage);
    // if (formik.values.contractId !== "") {
    let data = {
      ...formik.values,
      page: page,
      pageLimit: rowsPerPage,
    };
    getClaimList(data);
    // }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSelectedAction(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderStep1 = () => {
    // Step 1 content
    return (
      <>
        {loading ? (
          <div className=" h-[400px] w-full flex py-5">
            <div className="self-center mx-auto">
              <RotateLoader color="#333" />
            </div>
          </div>
        ) : (
          <Card className="px-8 pb-8 pt-4 mb-8 drop-shadow-4xl border-[1px] border-Light-Grey rounded-xl">
            <p className="text-xl font-bold mb-4">Step 1</p>
            <Grid>
              <div className="col-span-12">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!isFormEmpty()) {
                      formik.handleSubmit(e);
                      setShowTable(true);
                    }
                  }}
                >
                  <Grid>
                    <div className="col-span-4">
                      <Input
                        label="Contract ID"
                        name="contractId"
                        placeholder=""
                        className="!bg-white"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.contractId}
                      />
                      {formik.touched.contractId && formik.errors.contractId ? (
                        <div className="text-red-500">
                          {formik.errors.contractId}
                        </div>
                      ) : null}
                    </div>
                    {!location.pathname.includes("/customer/addClaim") && (
                      <div className="col-span-4">
                        <Input
                          label="Customer Name"
                          name="customerName"
                          placeholder=""
                          className="!bg-white"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.customerName}
                        />
                      </div>
                    )}

                    <div className="col-span-4">
                      <Input
                        label="Serial # / Device ID"
                        name="serial"
                        placeholder=""
                        className="!bg-white"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.serial}
                      />
                    </div>
                    <div className="col-span-4">
                      <Input
                        label="Order #"
                        name="orderId"
                        placeholder=""
                        className="!bg-white"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.orderId}
                      />
                    </div>

                    <div className="col-span-4">
                      <Input
                        label="Dealer P.O. #"
                        name="venderOrder"
                        placeholder=""
                        className="!bg-white"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.venderOrder}
                      />
                    </div>
                    {location.pathname.includes("/customer/addClaim") && (
                      <div className="col-span-4"></div>
                    )}

                    <div
                      className={`col-span-4 self-end justify-end flex ${
                        isFormEmpty() == true ? "opacity-0" : "opacity-1"
                      }`}
                    >
                      <Button type="submit" disabled={isFormEmpty()}>
                        Search
                      </Button>
                    </div>
                  </Grid>
                </form>
              </div>
              {showTable && (
                <>
                  <div className="col-span-12 relative ">
                    {loading123 ? (
                      <div className="h-[400px] w-full flex py-5">
                        <div className="self-center mx-auto">
                          <RotateLoader color="#333" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <table className="w-full border text-center table-auto">
                          <thead className="bg-grayf9">
                            <tr className=" border-b-[1px]">
                              <th className="font-semibold">Contract ID</th>
                              {!location.pathname.includes(
                                "/customer/addClaim"
                              ) && (
                                <th className="font-semibold !py-3">
                                  Customer Name
                                </th>
                              )}
                              <th className="font-semibold">
                                Serial # / Device ID
                              </th>
                              <th className="font-semibold">Order #</th>
                              <th className="font-semibold">Dealer P.O. #</th>
                              <th className="font-semibold">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {contractList?.length !== 0 ? (
                              contractList?.map((res, index) => (
                                <tr
                                  key={res.unique_key}
                                  className="text-[13px] text-[#626662] font-[400] border-b-[1px]"
                                >
                                  <td className="py-3">{res.unique_key}</td>
                                  {!location.pathname.includes(
                                    "/customer/addClaim"
                                  ) && <td>{res.order.customers.username}</td>}
                                  <td>{res.serial}</td>
                                  <td>{res.order.unique_key}</td>
                                  <td>{res.order.venderOrder}</td>
                                  <td className="mx-auto">
                                    <div className="relative">
                                      <div
                                        onClick={() =>
                                          setSelectedAction(
                                            selectedAction === res.unique_key
                                              ? null
                                              : res.unique_key
                                          )
                                        }
                                      >
                                        <img
                                          src={ActiveIcon}
                                          className="cursor-pointer w-[35px] mx-auto"
                                          alt="Active Icon"
                                        />
                                      </div>
                                      {selectedAction === res.unique_key && (
                                        <div
                                          ref={dropdownRef}
                                          className="absolute z-[2] w-[90px] drop-shadow-5xl right-0 mt-2 py-1 bg-white border rounded-lg shadow-md top-[1rem]"
                                        >
                                          <div
                                            className="text-left border-b text-[12px] border-[#E6E6E6] text-light-black cursor-pointer"
                                            onClick={() => {
                                              handleSelectValue(res);
                                              setSelectedAction(null); // Close dropdown after action
                                            }}
                                          >
                                            <p className="flex px-3 py-1 hover:font-semibold">
                                              <img
                                                src={selectIcon}
                                                className="w-4 h-4 mr-2"
                                                alt="selectIcon"
                                              />
                                              Select
                                            </p>
                                          </div>
                                          <div
                                            className="text-center text-[12px] border-[#E6E6E6] text-light-black cursor-pointer"
                                            onClick={() => {
                                              openModal(res);
                                              setSelectedAction(null); // Close dropdown after action
                                            }}
                                          >
                                            <p className="flex hover:font-semibold py-1 px-3">
                                              <img
                                                src={View}
                                                className="w-4 h-4 mr-2"
                                                alt="View"
                                              />{" "}
                                              View
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colspan="6" className="py-3 text-center">
                                  <p>No Record Found</p>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </>
                    )}
                  </div>
                  <div className="col-span-12">
                    {contractList?.length !== 0 ? (
                      <>
                        <div className="mt-2">
                          <CustomPagination
                            totalRecords={totalRecords}
                            page={pageValue}
                            className={loading123 ? "opacity-0" : "opacity-100"}
                            rowsPerPageOptions={[10, 20, 50, 100]}
                            onPageChange={handlePageChange}
                            setRecordsPerPage={setRecordsPerPage}
                          />
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </>
              )}
            </Grid>
          </Card>
        )}
      </>
    );
  };

  const validationSchemaStep2 = Yup.object({
    lossDate: Yup.date().required("Damage Date is required"),
    images: Yup.array().test("fileSize", "File size is too large", (value) => {
      if (!value || value.length === 0) return true;

      const maxSize = 5 * 1024 * 1024; // 5MB
      return value.every((image) => image.file.size <= maxSize);
    }),
    diagnosis: Yup.string()
      .transform((originalValue) => originalValue.trim())
      .required("Diagnosis is required"),
  });

  const handleChange = (name, value) => {
    formikStep2.setFieldValue(name, value);
  };

  const back = () => {
    // do this
    if (location.pathname.includes("singleView")) {
      navigate(-1);
    } else if (data.role == "Dealer") {
      navigate("/dealer/claimList");
    } else if (data.role == "Reseller") {
      navigate("/reseller/claimList");
    } else {
      navigate("/claimList");
    }
  };

  const formikStep2 = useFormik({
    initialValues: {
      servicerId: "",
      lossDate: "",
      images: [],
      diagnosis: "",
      file: [],
      claimType: "New",
      servicePaymentStatus: true,
      contractId: contractDetail?._id,
    },
    validationSchema: validationSchemaStep2,
    onSubmit: (values) => {
      const selectedDate = new Date(values.lossDate);
      selectedDate.setDate(selectedDate.getDate() + 1);
      const formattedDate = selectedDate.toISOString().split("T")[0];
      values.lossDate = formattedDate;
      setLoading1(true);
      values.servicePaymentStatus = sendNotifications;
      values.contractId = contractDetail?._id;

      addClaim(values).then((res) => {
        if (res.code == 200) {
          setCode("200");
          setIsCreateOpen(true);
          setTimer(3);
          setMessage("New Claim Created Successfully");
          setLoading1(false);
        } else {
          setTimer(null);
          setCode(res.code);
          setIsCreateOpen(true);
          setMessage(res.message);
        }
        setLoading1(false);
      });
    },
  });

  const renderStep2 = () => {
    return (
      <>
        <Card className="px-8 pb-8 pt-4 mb-8 drop-shadow-4xl border-[1px] border-Light-Grey rounded-xl">
          <p className="text-2xl font-bold mb-4">Enter Required Info</p>
          {loading21 ? (
            <div className=" h-[400px] w-full flex py-5">
              <div className="self-center mx-auto">
                <RotateLoader color="#333" />
              </div>
            </div>
          ) : (
            <form onSubmit={formikStep2.handleSubmit}>
              <Grid>
                <div className="col-span-12">
                  <Grid className="!grid-cols-8 my-3">
                    <div className="col-span-2">
                      <div className="bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1">
                        <p className="text-sm m-0 p-0">Model</p>
                        <p className="font-semibold">
                          {" "}
                          {contractDetail?.model}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1">
                        <p className="text-sm m-0 p-0">Serial # / Device ID</p>
                        <p className="font-semibold">
                          {" "}
                          {contractDetail?.serial}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1">
                        <p className="text-sm m-0 p-0">Manufacturer</p>
                        <p className="font-semibold">
                          {" "}
                          {contractDetail?.manufacture}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-1">
                      <div className="bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1">
                        <p className="text-sm m-0 p-0">Retail Price</p>
                        <p className="font-semibold">
                          $
                          {contractDetail?.productValue === undefined
                            ? parseInt(0).toLocaleString(2)
                            : formatOrderValue(
                                Number(contractDetail?.productValue) ??
                                  parseInt(0)
                              )}
                          {/* ? parseInt(0).toLocaleString(2)
                          : formatOrderValue(
                              contractDetail?.productValue ?? parseInt(0)
                            )} */}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <div className="bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1">
                        <p className="text-sm m-0 p-0">Condition</p>
                        <p className="font-semibold">
                          {" "}
                          {contractDetail?.condition}
                        </p>
                      </div>
                    </div>
                  </Grid>
                  <Grid>
                    <div className="col-span-3">
                      <div className="bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1">
                        <p className="text-sm m-0 p-0">Contract ID</p>
                        <p className="font-semibold">
                          {contractDetail?.unique_key}
                        </p>
                      </div>
                    </div>

                    {role !== "Reseller" &&
                      role !== "Customer" &&
                      role !== "Dealer" && (
                        <div className="col-span-3">
                          <div className="bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1">
                            <p className="text-sm m-0 p-0">Dealer Name</p>
                            <p className="font-semibold">
                              {contractDetail?.order?.[0]?.dealer?.[0]?.name}
                            </p>
                          </div>
                        </div>
                      )}

                    {role !== "Reseller" && role !== "Customer" && (
                      <div className="col-span-3">
                        <div className="bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1">
                          <p className="text-sm m-0 p-0">Reseller Name</p>
                          <p className="font-semibold">
                            {" "}
                            {contractDetail?.order?.[0]?.reseller?.[0]?.name}
                          </p>
                        </div>
                      </div>
                    )}

                    {role !== "Customer" && (
                      <div className="col-span-3">
                        <div className="bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1">
                          <p className="text-sm m-0 p-0">Customer Name</p>
                          <p className="font-semibold">
                            {" "}
                            {
                              contractDetail?.order?.[0]?.customer?.[0]
                                ?.username
                            }
                          </p>
                        </div>
                      </div>
                    )}
                  </Grid>
                </div>
              </Grid>

              <div className="my-4">
                <p className="text-2xl font-bold mb-4">
                  {" "}
                  Upload Receipt or Image{" "}
                </p>
                <Grid>
                  <div className="col-span-6 mt-5">
                    <Grid className="my-3">
                      <div className="col-span-6">
                        <SelectBoxWithSearch
                          label="Servicer Name"
                          name="servicerId"
                          className="!bg-white"
                          onChange={handleChange}
                          options={servicerData}
                          value={formikStep2.values.servicerId}
                          onBlur={formikStep2.handleBlur}
                          // do this
                          isDisabled={data.role != "Super Admin"}
                        />
                      </div>
                      <div className="col-span-6">
                        <Input
                          label="Damage Date"
                          type="date"
                          name="lossDate"
                          maxDate={maxDate}
                          required
                          onChange={formikStep2.handleChange}
                          onBlur={formikStep2.handleBlur}
                          value={formikStep2.values.lossDate}
                          className="!bg-white"
                        />
                        {formikStep2.touched.lossDate &&
                          formikStep2.errors.lossDate && (
                            <div className="text-red-500">
                              {formikStep2.errors.lossDate}
                            </div>
                          )}
                      </div>
                    </Grid>

                    <div>
                      <div>
                        <div className="border border-dashed w-full relative py-8">
                          <label
                            className={`absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-white left-2 px-1 -translate-y-4 scale-75   `}
                          >
                            Add Files
                          </label>
                          <input
                            type="file"
                            multiple
                            accept="image/*,application/pdf,.xlsx,.xls,.csv"
                            onChange={handleImageChange}
                            className="hidden"
                            id="fileInput"
                          />

                          <label
                            htmlFor="fileInput"
                            className="self-center text-center cursor-pointer"
                          >
                            <img
                              src={Dropbox}
                              className="mx-auto mb-3"
                              alt="Dropbox"
                            />
                            <p>
                              Max. # of files : 5, file size: 5 MB
                              <small> (each) </small>.
                            </p>
                          </label>
                        </div>
                        {formikStep2.touched.images &&
                          formikStep2.errors.images && (
                            <div className="text-red-500">
                              {formikStep2.errors.images}
                            </div>
                          )}
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {formikStep2.values.images.map((file, index) => (
                            <div key={index} className="relative">
                              {file.fileType === "image" && (
                                <img
                                  src={file.preview}
                                  alt={`Preview ${index}`}
                                  className="w-full h-auto"
                                />
                              )}
                              {file.fileType === "pdf" && (
                                <FontAwesomeIcon icon={faFilePdf} size="4x" />
                              )}
                              {file.fileType === "csv" && (
                                <FontAwesomeIcon icon={faFileImage} size="4x" />
                              )}
                              {file.fileType === "word" && (
                                <FontAwesomeIcon icon={faFileWord} size="4x" />
                              )}
                              {file.fileType === "excel" && (
                                <FontAwesomeIcon icon={faFileExcel} size="4x" />
                              )}
                              {file.fileType === "xlsx" && (
                                <FontAwesomeIcon icon={faFileWord} size="4x" />
                              )}
                              {file.fileType === "docx" && (
                                <FontAwesomeIcon icon={faFileWord} size="4x" />
                              )}
                              <button
                                onClick={() => handleRemoveImage(index)}
                                className="absolute -top-2 -right-2"
                              >
                                <img
                                  src={Cross}
                                  className="w-6 rounded-[16px] cursor-pointer"
                                  alt="Cross"
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-6">
                    {window.location.pathname.includes("/customer/addClaim") ? (
                      ""
                    ) : (
                      <p className=" mb-2">
                        {" "}
                        Max Claim amount is $
                        {price == null
                          ? parseInt(0).toLocaleString(2)
                          : formatOrderValue(price ?? parseInt(0))}
                      </p>
                    )}

                    <div className="relative">
                      <label
                        htmlFor="description"
                        className="absolute text-base text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-white left-2 px-1 -translate-y-4 scale-75"
                      >
                        Diagnosis <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        rows="11"
                        name="diagnosis"
                        maxLength={150}
                        className="block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold text-light-black bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer resize-none"
                        onChange={formikStep2.handleChange}
                        onBlur={formikStep2.handleBlur}
                        value={formikStep2.values.diagnosis}
                      ></textarea>
                    </div>
                    {formikStep2.touched.diagnosis &&
                      formikStep2.errors.diagnosis && (
                        <div className="text-red-500">
                          {formikStep2.errors.diagnosis}
                        </div>
                      )}
                  </div>
                  <div className="col-span-6">
                    <p className="text-light-black flex text-[12px] font-semibold mt-3 mb-6">
                      Do you want to send notifications?
                      <RadioButton
                        id="yes-create-account"
                        label="Yes"
                        value={true}
                        checked={sendNotifications === true}
                        onChange={() => handleRadioChange(true)}
                      />
                      <RadioButton
                        id="no-create-account"
                        label="No"
                        value={false}
                        checked={sendNotifications === false}
                        onChange={() => handleRadioChange(false)}
                      />
                    </p>
                  </div>
                </Grid>
                <Button className="!bg-white !text-black" onClick={prevStep}>
                  Previous
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          )}
        </Card>
      </>
    );
  };

  return (
    <div className="my-8 ml-3">
      <Headbar />
      <div className="flex mt-2">
        <div
          className="h-[60px] w-[60px] flex border-[1px] bg-white border-Light-Grey cursor-pointer rounded-[25px]"
          onClick={back}
        >
          <img
            src={BackImage}
            className="m-auto my-auto self-center bg-white"
            alt="BackImage"
          />
        </div>
        <div className="pl-3">
          <p className="font-bold text-[36px] leading-9 mb-[3px]">Add Claim</p>
          <ul className="flex self-center">
            <li className="text-sm text-neutral-grey font-Regular">
              <Link to={"/"}>Home </Link>/{" "}
            </li>
            <li className="text-sm text-neutral-grey font-semibold ml-1 pt-[1px]">
              {" "}
              Add Claim{" "}
            </li>
          </ul>
        </div>
      </div>

      {/* Form Start */}
      <div className="flex my-4 ml-3">
        <div className="text-center">
          {currentStep > 1 ? (
            <img src={check} className="text-center mx-auto" />
          ) : (
            <p className="border border-black rounded-full mx-auto w-[26px]">
              1
            </p>
          )}

          <p
            className={` ${
              currentStep == 1 ? "text-black" : "text-[#ADADAD] "
            } text-sm font-bold`}
          >
            Step 1
          </p>
        </div>
        <hr className="w-[150px] border-black mt-3" />
        <div className="text-center">
          {currentStep > 2 ? (
            <img src={check} className="text-center mx-auto" />
          ) : (
            <p
              className={`border ${
                currentStep > 1
                  ? "text-black border-black"
                  : "text-[#ADADAD] border-[#ADADAD]"
              }  rounded-full mx-auto w-[26px]`}
            >
              2
            </p>
          )}

          <p
            className={` ${
              currentStep == 2 ? "text-black" : "text-[#ADADAD] "
            } text-sm font-bold`}
          >
            Step 2
          </p>
        </div>
      </div>
      {loading1 ? (
        <div className="h-[400px] w-full flex py-5">
          <div className="self-center mx-auto">
            <RotateLoader color="#333" />
          </div>
        </div>
      ) : (
        <>{renderStep()}</>
      )}

      {/* Modal Email Popop */}

      <Modal isOpen={isCreateOpen} onClose={closeCreate}>
        {code === "200" ? (
          <></>
        ) : (
          <Button
            onClick={closeCreate}
            className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-Granite-Gray"
          >
            <img
              src={Cross}
              className="w-full h-full text-black rounded-full p-0"
            />
          </Button>
        )}

        <div className="text-center py-3">
          {code === "200" ? (
            <>
              <img src={AddDealer} alt="email Image" className="mx-auto" />
              <p className="text-3xl mb-0 mt-4 font-semibold text-neutral-grey">
                Submitted
                <span className="text-light-black"> Successfully </span>
              </p>
              <p className="text-neutral-grey text-base font-medium mt-2">
                {message}
              </p>
              <p className="text-neutral-grey text-base font-medium mt-2">
                Redirecting you on Claim List Page {timer} seconds.
              </p>
            </>
          ) : (
            <>
              <img src={disapprove} alt="email Image" className="mx-auto" />
              <p className="text-3xl mb-0 mt-4 font-semibold text-neutral-grey">
                Error
              </p>
              <p className="text-neutral-grey text-base font-medium mt-2">
                {message}
              </p>
            </>
          )}
        </div>
      </Modal>

      <Modal isOpen={isModalOpen} onClose={closeModal} className="!w-[1100px]">
        <Button
          onClick={closeModal}
          className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-Granite-Gray"
        >
          <img
            src={Cross}
            className="w-full h-full text-black rounded-full p-0"
          />
        </Button>

        <div className="text-center mt-2">
          <p className="text-3xl font-semibold mb-4">Contract Details</p>
          <div>
            {loading2 ? (
              <div className="h-[400px] w-full flex py-5">
                <div className="self-center mx-auto">
                  <RotateLoader color="#333" />
                </div>
              </div>
            ) : (
              <>
                <Grid className="bg-light-black !gap-2 !grid-cols-11 !px-3 rounded-t-xl">
                  <div className="col-span-3 self-center text-left bg-contract bg-contain bg-right bg-no-repeat rounded-ss-xl">
                    <p className="text-white py-2 font-Regular">
                      Contract ID : <b> {contractDetail?.unique_key} </b>
                    </p>
                  </div>
                  <div className="col-span-3 self-center text-left bg-contract bg-contain bg-right bg-no-repeat ">
                    <p className="text-white py-2 font-Regular">
                      Order ID :{" "}
                      <b> {contractDetail?.order?.[0]?.unique_key} </b>
                    </p>
                  </div>
                  <div className="col-span-4 self-center text-left bg-contract bg-contain bg-right bg-no-repeat ">
                    <p className="text-white py-2 font-Regular">
                      Dealer P.O. # :{" "}
                      <b> {contractDetail?.order?.[0]?.venderOrder} </b>
                    </p>
                  </div>
                  {/* <div className="col-span-1"></div> */}
                  <div className="col-span-1 self-center justify-end rounded-[20px] text-center">
                    <Button
                      className="!bg-[#817f7f] !text-white !py-[5px] !px-[20px] !rounded-[30px] !my-[4px] !font-Regular"
                      onClick={() => {
                        handleSelectValue(contractDetail);
                      }}
                    >
                      Select
                    </Button>
                  </div>
                </Grid>

                <Grid className="!gap-0 !grid-cols-5 bg-grayf9 mb-5 ">
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Manufacturer
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {contractDetail?.manufacture}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Model
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {contractDetail?.model}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Serial # / Device ID
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {contractDetail?.serial}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Condition
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {contractDetail?.condition}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Retail Price
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {/* ${contractDetail?.productValue} */}$
                        {contractDetail?.productValue === undefined
                          ? parseInt(0).toLocaleString(2)
                          : formatOrderValue(
                              Number(contractDetail?.productValue) ??
                                parseInt(0)
                            )}
                      </p>
                    </div>
                  </div>

                  {role !== "Reseller" &&
                    role !== "Customer" &&
                    role !== "Dealer" && (
                      <div className="col-span-1 border border-Light-Grey">
                        <div className="py-4 pl-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            Dealer Name
                          </p>
                          <p className="text-light-black text-base font-semibold">
                            {contractDetail?.order?.[0]?.dealer?.[0]?.name}
                          </p>
                        </div>
                      </div>
                    )}

                  {role !== "Reseller" && role !== "Customer" && (
                    <div className="col-span-1 border border-Light-Grey">
                      <div className="py-4 pl-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Reseller Name
                        </p>
                        <p className="text-light-black text-base font-semibold">
                          {contractDetail?.order?.[0]?.reseller?.[0]?.name}
                        </p>
                      </div>
                    </div>
                  )}

                  {role !== "Customer" && (
                    <div className="col-span-1 border border-Light-Grey">
                      <div className="py-4 pl-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Customer Name
                        </p>
                        <p className="text-light-black text-base font-semibold">
                          {contractDetail?.order?.[0]?.customer?.[0]?.username}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Servicer Name
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {contractDetail?.order?.[0]?.servicer?.[0]?.name}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Status
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {contractDetail?.status}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Product Category
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {
                          contractDetail?.order?.[0]?.productsArray?.[0]
                            ?.priceBook?.[0]?.category?.name
                        }
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Product SKU
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {
                          contractDetail?.order?.[0]?.productsArray?.[0]
                            ?.priceBook?.[0]?.name
                        }
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Dealer SKU
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {
                          contractDetail?.order?.[0]?.productsArray?.[0]
                            ?.priceBook?.[0]?.dealerSku
                        }
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Product Name
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {
                          contractDetail?.order?.[0]?.productsArray?.[0]
                            ?.priceBook?.[0]?.pName
                        }
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Price Type
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {
                          contractDetail?.order?.[0]?.productsArray?.[0]
                            ?.priceType
                        }
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Product Description
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {
                          contractDetail?.order?.[0]?.productsArray?.[0]
                            ?.priceBook?.[0]?.description
                        }
                      </p>
                    </div>
                  </div>

                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Eligibility
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {contractDetail?.eligibilty === true
                          ? "Eligible"
                          : "Not Eligible "}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Claim Amount
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        $
                        {contractDetail?.claimAmount === undefined
                          ? parseInt(0).toLocaleString(2)
                          : formatOrderValue(
                              Number(contractDetail?.claimAmount) ?? parseInt(0)
                            )}
                      </p>
                    </div>
                  </div>

                  {contractDetail?.order?.[0]?.productsArray?.[0]?.priceType ==
                  "Flat Pricing" ? (
                    <>
                      <div className="col-span-1 border border-Light-Grey">
                        <div className="py-4 pl-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            Start Range
                          </p>
                          <p className="text-light-black text-base font-semibold">
                            $
                            {contractDetail?.order?.[0]?.productsArray?.[0]
                              ?.rangeStart === undefined
                              ? parseInt(0).toLocaleString(2)
                              : formatOrderValue(
                                  contractDetail?.order?.[0]?.productsArray?.[0]
                                    ?.rangeStart ?? parseInt(0)
                                )}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-1 border border-Light-Grey">
                        <div className="py-4 pl-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            End Range
                          </p>
                          <p className="text-light-black text-base font-semibold">
                            $
                            {contractDetail?.order?.[0]?.productsArray?.[0]
                              ?.rangeEnd === undefined
                              ? parseInt(0).toLocaleString(2)
                              : formatOrderValue(
                                  contractDetail?.order?.[0]?.productsArray?.[0]
                                    ?.rangeEnd ?? parseInt(0)
                                )}{" "}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                  <div className="col-span-1 border border-Light-Grey ">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Coverage Start Date
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {new Date(
                          contractDetail?.order?.[0]?.productsArray?.[0]?.coverageStartDate
                        ).toLocaleDateString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Coverage End Date
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {new Date(
                          contractDetail?.order?.[0]?.productsArray?.[0]?.coverageEndDate
                        ).toLocaleDateString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey ">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Labour Warranty Start Date
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {new Date(
                          contractDetail?.labourWarranty
                        ).toLocaleDateString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey ">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Part Warranty Start Date
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {new Date(
                          contractDetail?.partsWarranty
                        ).toLocaleDateString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey ">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Purchase Date
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {new Date(
                          contractDetail?.purchaseDate
                        ).toLocaleDateString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  {contractDetail?.order?.[0]?.productsArray?.[0]?.priceType ==
                  "Quantity Pricing" ? (
                    <>
                      <div className="col-span-5 border border-Light-Grey ">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th colSpan={4}>Quantity Pricing List</th>
                            </tr>
                            <tr>
                              <th>Sr.#</th>
                              <th>Name</th>
                              <th>Max Quantity Per Unit</th>
                              <th>Quantity</th>
                            </tr>
                          </thead>
                          {contractDetail?.order?.[0].productsArray?.[0]
                            ?.QuantityPricing.length !== 0 &&
                            contractDetail?.order?.[0].productsArray?.[0]?.QuantityPricing.map(
                              (item, index) => (
                                <tr key={index} className="border">
                                  <td>{index + 1}</td>
                                  <td>{item.name}</td>
                                  <td>{item.quantity}</td>
                                  <td>{item.enterQuantity}</td>
                                </tr>
                              )
                            )}
                        </table>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </Grid>
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AddClaim;
