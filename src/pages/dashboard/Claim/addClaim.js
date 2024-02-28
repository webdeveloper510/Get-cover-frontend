import React, { useEffect, useRef, useState } from "react";
import Headbar from "../../../common/headBar";
import { Link } from "react-router-dom";
import Select from "../../../common/select";
import Grid from "../../../common/grid";
import Input from "../../../common/input";

// Media Include
import BackImage from "../../../assets/images/icons/backArrow.svg";
import Dropbox from "../../../assets/images/icons/dropBox.svg";
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
  getContractList,
  getContractValues,
} from "../../../services/claimServices";
import { getServicerListInOrders } from "../../../services/orderServices";
import { RotateLoader } from "react-spinners";

function AddClaim() {
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [contractList, setContractList] = useState([]);
  const [contractDetail, setContractDetails] = useState({});
  const [servicerData, setServicerData] = useState([]);
  const [images, setImages] = useState([]);

  const dropdownRef = useRef(null);

  const [selectedActions, setSelectedActions] = useState([]);

  const handleToggleDropdown = (index) => {
    const newSelectedActions = [...selectedActions];
    newSelectedActions[index] = !newSelectedActions[index];
    setSelectedActions(newSelectedActions);
  };
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
    setIsModalOpen(false);
  };

  const isFormEmpty = () => {
    return Object.values(formik.values).every((value) => !value);
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

  const handleImageChange = (e) => {
    const files = e.target.files;

    if (files) {
      const newImages = Array.from(files)
        .slice(0, 5 - images.length)
        .map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        }));

      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
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
    },

    onSubmit: async (values) => {
      setLoading(true);
      setShowTable(true);
      let data = {
        ...values,
        page: 1,
        pageLimit: 10,
      };
      const response = await getContractList(data);
      //console.log(response);
      setContractList(response.result);
      setLoading(false);
    },
  });

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

  const handleSelect = (selectedOption) => {
    console.log("Selected Option:", selectedOption);
  };
  const [item, setItem] = useState({
    requested_order_ship_date: "2024-01-25",
  });

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setSelectedActions(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = (res) => {
    // setContractDetails(res);
    console.log(res._id);
    getContractValues(res._id).then((res) => {
      console.log(res.result);
      getServicerList({
        dealerId: res.result.order[0].dealerId,
        resellerId: res.result.order[0].resellerId,
      });
      setContractDetails(res.result);
    });
    setIsModalOpen(true);
  };

  const getServicerList = async (data) => {
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
  };

  const handleSelectValue = (res) => {
    getContractValues(res._id).then((res) => {
      console.log(res.result);
      getServicerList({
        dealerId: res.result.order[0].dealerId,
        resellerId: res.result.order[0].resellerId,
      });
      setContractDetails(res.result);

      nextStep();
    });
  };
  const handlePageChange = async (page, rowsPerPage) => {
    if (formik.values.contractId !== "") {
      let data = {
        ...formik.values,
        page: page,
        pageLimit: rowsPerPage,
      };
      try {
        const response = await getContractList(data);
        console.log(response);
        setContractList(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
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
          <div className="px-8 pb-8 pt-4 mb-8 drop-shadow-4xl bg-white border-[1px] border-[#D1D1D1]  rounded-xl">
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
                    <div className="col-span-4">
                      <Input
                        label="Serial Number"
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

                    <div className="col-span-4 self-end justify-end flex">
                      <Button type="submit" disabled={isFormEmpty()}>
                        Search
                      </Button>
                    </div>
                  </Grid>
                </form>
              </div>
              {showTable && (
                <div className="col-span-12">
                  <table className="w-full border text-center">
                    <thead className="bg-[#F9F9F9] ">
                      <tr className="py-2">
                        <th>Contract ID</th>
                        <th className="!py-2">Customer Name</th>
                        <th>Serial Number</th>
                        <th>Order #</th>
                        <th>Dealer P.O. #</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contractList?.result?.length != 0 &&
                        contractList?.result?.map((res, index) => {
                          return (
                            <tr>
                              <td className="py-1">{res.unique_key}</td>
                              <td>{res.order.customers.username}</td>
                              <td> {res.serial}</td>
                              <td>{res.order.unique_key}</td>
                              <td>{res.order.venderOrder}</td>
                              <td>
                                <div className="relative">
                                  <div
                                    onClick={() => handleToggleDropdown(index)}
                                  >
                                    <img
                                      src={ActiveIcon}
                                      className="cursor-pointer w-[35px] mx-auto"
                                      alt="Active Icon"
                                    />
                                  </div>
                                  {selectedActions[index] && (
                                    <div className="absolute z-[2] w-[90px] drop-shadow-5xl -right-3 mt-2 p-3 bg-white border rounded-lg shadow-md top-[1rem]">
                                      <div
                                        className="text-left pb-1 border-b text-[12px] border-[#E6E6E6] text-light-black cursor-pointer"
                                        onClick={() => {
                                          handleSelectValue(res);
                                        }}
                                      >
                                        <p className="flex hover:font-semibold">
                                          {" "}
                                          <img
                                            src={selectIcon}
                                            className="w-4 h-4 mr-2"
                                            alt="selectIcon"
                                          />{" "}
                                          Select
                                        </p>
                                      </div>
                                      <div
                                        className="text-center pt-1 text-[12px] border-[#E6E6E6] text-light-black cursor-pointer"
                                        onClick={() => openModal(res)}
                                      >
                                        <p className="flex hover:font-semibold">
                                          {" "}
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
                          );
                        })}
                    </tbody>
                  </table>
                  <div className="mt-5">
                    <CustomPagination
                      totalRecords={contractList?.totalCount}
                      rowsPerPageOptions={[10, 20, 50, 100]}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </div>
              )}
            </Grid>
          </div>
        )}
      </>
    );
  };

  const renderStep2 = () => {
    // Step 2 content
    return (
      <div className="px-8 pb-8 pt-4 mb-8 drop-shadow-4xl bg-white border-[1px] border-[#D1D1D1]  rounded-xl">
        <p className="text-2xl font-bold mb-4">Enter Required Info</p>
        <Grid>
          <div className="col-span-12">
            <Grid>
              <div className="col-span-3">
                <div className="bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1">
                  <p className="text-sm m-0 p-0">Contract ID</p>
                  <p className="font-semibold">{contractDetail?.unique_key}</p>
                </div>
              </div>
              <div className="col-span-3">
                <div className="bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1">
                  <p className="text-sm m-0 p-0">Dealer Name</p>
                  <p className="font-semibold">
                    {contractDetail?.order?.[0]?.dealer?.[0]?.name}
                  </p>
                </div>
              </div>
              <div className="col-span-3">
                <div className="bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1">
                  <p className="text-sm m-0 p-0">Reseller Name</p>
                  <p className="font-semibold">
                    {" "}
                    {contractDetail?.order?.[0]?.reseller?.[0]?.name}
                  </p>
                </div>
              </div>
              <div className="col-span-3">
                <div className="bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1">
                  <p className="text-sm m-0 p-0">Customer Name</p>
                  <p className="font-semibold">
                    {" "}
                    {contractDetail?.order?.[0]?.customer?.[0]?.username}
                  </p>
                </div>
              </div>
            </Grid>
            <Grid className="!grid-cols-8 mt-3">
              <div className="col-span-2">
                <div className="bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1">
                  <p className="text-sm m-0 p-0">Model</p>
                  <p className="font-semibold"> {contractDetail?.model}</p>
                </div>
              </div>
              <div className="col-span-2">
                <div className="bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1">
                  <p className="text-sm m-0 p-0">Serial #</p>
                  <p className="font-semibold"> {contractDetail?.serial}</p>
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
                    {" "}
                    $
                    {contractDetail?.productValue === undefined
                      ? parseInt(0).toLocaleString(2)
                      : formatOrderValue(
                          contractDetail?.productValue ?? parseInt(0)
                        )}
                  </p>
                </div>
              </div>
              <div className="col-span-1">
                <div className="bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1">
                  <p className="text-sm m-0 p-0">Condition</p>
                  <p className="font-semibold"> {contractDetail?.condition}</p>
                </div>
              </div>
            </Grid>
          </div>
        </Grid>

        <div className="my-4">
          <p className="text-2xl font-bold mb-4"> Upload Receipt or Image </p>
          <Grid>
            <div className="col-span-6">
              <Grid className="my-3">
                <div className="col-span-6">
                  <SelectBoxWIthSerach
                    options={servicerData}
                    label="Servicer Name"
                    name="servicerName"
                    className="!bg-[#fff]"
                    onChange={handleSelect}
                  />
                </div>
                <div className="col-span-6">
                  <Input
                    label="Loss Date"
                    type="date"
                    name="lossDate"
                    required
                    item={item}
                    setItem={setItem}
                    className="!bg-[#fff]"
                  />
                </div>
              </Grid>

              <div>
                <div>
                  <div className="border border-dashed w-full relative py-8">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
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
                      <p>Accepted Max. file size: 5 MB.</p>
                    </label>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.preview}
                          alt={`Preview ${index}`}
                          className="w-full h-auto"
                        />
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
              <div className="relative">
                <label
                  htmlFor="description"
                  className="absolute text-base text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-[#fff] left-2 px-1 -translate-y-4 scale-75"
                >
                  Diagonsis <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="note"
                  rows="11"
                  name="Note"
                  maxLength={150}
                  className="block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold text-light-black bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer resize-none	"
                ></textarea>
              </div>
              <p className="text-[10px] text-neutral-grey">
                {" "}
                <span className="text-red-500"> Note : </span> Max Claim amount
                is $123.00
              </p>
            </div>
            <div className="col-span-6">
              <p className="text-light-black flex text-[12px] font-semibold mt-3 mb-6">
                Do you want to send notifications?
                <RadioButton
                  id="yes-create-account"
                  label="Yes"
                  value="yes"
                  // checked={createAccountOption === "yes"}
                  // onChange={handleRadioChange}
                />
                <RadioButton
                  id="no-create-account"
                  label="No"
                  value="no"
                  // checked={createAccountOption === "no"}
                  // onChange={handleRadioChange}
                />
              </p>
            </div>
          </Grid>
          <Button className="!bg-white !text-black" onClick={prevStep}>
            Previous
          </Button>
          <Button>Submit</Button>
        </div>
      </div>
    );
  };

  return (
    <div className="my-8 ml-3">
      <Headbar />
      <div className="flex mt-2">
        <Link
          to={"/claimList"}
          className="h-[60px] w-[60px] flex border-[1px] bg-white border-[#D1D1D1] rounded-[25px]"
        >
          <img
            src={BackImage}
            className="m-auto my-auto self-center bg-white"
            alt="BackImage"
          />
        </Link>
        <div className="pl-3">
          <p className="font-bold text-[36px] leading-9 mb-[3px]">Add Claim</p>
          <ul className="flex self-center">
            <li className="text-sm text-neutral-grey font-Regular">
              <Link to={"/"}>Claim </Link> /{" "}
            </li>
            <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
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

      {renderStep()}

      <Modal isOpen={isModalOpen} onClose={closeModal} className="!w-[1100px]">
        <Button
          onClick={closeModal}
          className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]"
        >
          <img
            src={Cross}
            className="w-full h-full text-black rounded-full p-0"
          />
        </Button>
        <div className="text-center mt-2">
          <p className="text-3xl font-semibold mb-4">Contract Details</p>
          <div>
            <Grid className="bg-[#333333] !gap-2 !grid-cols-9 !px-3 rounded-t-xl">
              <div className="col-span-2 self-center text-left bg-contract bg-contain bg-right bg-no-repeat rounded-ss-xl">
                <p className="text-white py-2 font-Regular">
                  Contract ID : <b> {contractDetail.unique_key} </b>
                </p>
              </div>
              <div className="col-span-2 self-center text-left bg-contract bg-contain bg-right bg-no-repeat ">
                <p className="text-white py-2 font-Regular">
                  Order ID : <b> {contractDetail?.order?.[0]?.unique_key} </b>
                </p>
              </div>
              <div className="col-span-3 self-center text-left bg-contract bg-contain bg-right bg-no-repeat ">
                <p className="text-white py-2 font-Regular">
                  Dealer P.O. # :{" "}
                  <b> {contractDetail?.order?.[0]?.venderOrder} </b>
                </p>
              </div>
              <div className="col-span-1"></div>
              <div className="col-span-1 self-center justify-end self-center rounded-[20px] text-center">
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

            <Grid className="!gap-0 !grid-cols-5 bg-[#F9F9F9] mb-5 h-[400px] wax-h-[400px] overflow-y-scroll no-scrollbar">
              <div className="col-span-1 border border-[#D1D1D1]">
                <div className="py-4 pl-3">
                  <p className="text-[#5D6E66] text-sm font-Regular">
                    Manufacturer
                  </p>
                  <p className="text-[#333333] text-base font-semibold">
                    {contractDetail?.manufacture}
                  </p>
                </div>
              </div>
              <div className="col-span-1 border border-[#D1D1D1]">
                <div className="py-4 pl-3">
                  <p className="text-[#5D6E66] text-sm font-Regular">Model</p>
                  <p className="text-[#333333] text-base font-semibold">
                    {contractDetail?.model}
                  </p>
                </div>
              </div>
              <div className="col-span-1 border border-[#D1D1D1]">
                <div className="py-4 pl-3">
                  <p className="text-[#5D6E66] text-sm font-Regular">Serial</p>
                  <p className="text-[#333333] text-base font-semibold">
                    {contractDetail?.serial}
                  </p>
                </div>
              </div>
              <div className="col-span-1 border border-[#D1D1D1]">
                <div className="py-4 pl-3">
                  <p className="text-[#5D6E66] text-sm font-Regular">
                    Condition
                  </p>
                  <p className="text-[#333333] text-base font-semibold">
                    {contractDetail?.condition}
                  </p>
                </div>
              </div>
              <div className="col-span-1 border border-[#D1D1D1]">
                <div className="py-4 pl-3">
                  <p className="text-[#5D6E66] text-sm font-Regular">
                    Retail Price
                  </p>
                  <p className="text-[#333333] text-base font-semibold">
                    ${contractDetail?.productValue}
                  </p>
                </div>
              </div>

              <div className="col-span-1 border border-[#D1D1D1]">
                <div className="py-4 pl-3">
                  <p className="text-[#5D6E66] text-sm font-Regular">
                    Dealer Name
                  </p>
                  <p className="text-[#333333] text-base font-semibold">
                    {contractDetail?.order?.[0]?.dealer?.[0]?.name}
                  </p>
                </div>
              </div>
              <div className="col-span-1 border border-[#D1D1D1]">
                <div className="py-4 pl-3">
                  <p className="text-[#5D6E66] text-sm font-Regular">
                    Reseller Name
                  </p>
                  <p className="text-[#333333] text-base font-semibold">
                    {contractDetail?.order?.[0]?.reseller?.[0]?.name}
                  </p>
                </div>
              </div>
              <div className="col-span-1 border border-[#D1D1D1]">
                <div className="py-4 pl-3">
                  <p className="text-[#5D6E66] text-sm font-Regular">
                    Customer Name
                  </p>
                  <p className="text-[#333333] text-base font-semibold">
                    {contractDetail?.order?.[0]?.customer?.[0]?.username}
                  </p>
                </div>
              </div>
              <div className="col-span-1 border border-[#D1D1D1]">
                <div className="py-4 pl-3">
                  <p className="text-[#5D6E66] text-sm font-Regular">
                    Servicer Name
                  </p>
                  <p className="text-[#333333] text-base font-semibold">
                    {contractDetail?.order?.[0]?.servicer?.[0]?.username}
                  </p>
                </div>
              </div>
              <div className="col-span-1 border border-[#D1D1D1]">
                <div className="py-4 pl-3">
                  <p className="text-[#5D6E66] text-sm font-Regular">Status</p>
                  <p className="text-[#333333] text-base font-semibold">
                    {contractDetail.status}
                  </p>
                </div>
              </div>
              <div className="col-span-1 border border-[#D1D1D1]">
                <div className="py-4 pl-3">
                  <p className="text-[#5D6E66] text-sm font-Regular">
                    Product Category
                  </p>
                  <p className="text-[#333333] text-base font-semibold">
                    {
                      contractDetail?.order?.[0]?.productsArray?.[0]
                        ?.priceBook?.[0]?.category?.name
                    }
                  </p>
                </div>
              </div>
              <div className="col-span-1 border border-[#D1D1D1]">
                <div className="py-4 pl-3">
                  <p className="text-[#5D6E66] text-sm font-Regular">
                    Product Name
                  </p>
                  <p className="text-[#333333] text-base font-semibold">
                    {
                      contractDetail?.order?.[0]?.productsArray?.[0]
                        ?.priceBook?.[0]?.name
                    }
                  </p>
                </div>
              </div>
              <div className="col-span-1 border border-[#D1D1D1]">
                <div className="py-4 pl-3">
                  <p className="text-[#5D6E66] text-sm font-Regular">
                    Product Description
                  </p>
                  <p className="text-[#333333] text-base font-semibold">
                    {
                      contractDetail?.order?.[0]?.productsArray?.[0]
                        ?.priceBook?.[0]?.description
                    }
                  </p>
                </div>
              </div>
              <div className="col-span-1 border border-[#D1D1D1]">
                <div className="py-4 pl-3">
                  <p className="text-[#5D6E66] text-sm font-Regular">
                    Price Type
                  </p>
                  <p className="text-[#333333] text-base font-semibold">
                    {contractDetail?.order?.[0]?.productsArray?.[0]?.priceType}
                  </p>
                </div>
              </div>
              <div className="col-span-1 border border-[#D1D1D1]">
                <div className="py-4 pl-3">
                  <p className="text-[#5D6E66] text-sm font-Regular">
                    Eligibility
                  </p>
                  <p className="text-[#333333] text-base font-semibold"></p>
                </div>
              </div>
              <div className="col-span-1 border border-[#D1D1D1]">
                <div className="py-4 pl-3">
                  <p className="text-[#5D6E66] text-sm font-Regular">
                    Claim Amount
                  </p>
                  <p className="text-[#333333] text-base font-semibold">
                    $0.00
                  </p>
                </div>
              </div>

              {contractDetail?.order?.[0]?.productsArray?.[0]?.priceType ==
              "Flat Pricing" ? (
                <>
                  <div className="col-span-1 border border-[#D1D1D1]">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Start Range
                      </p>
                      <p className="text-[#333333] text-base font-semibold">
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
                  <div className="col-span-1 border border-[#D1D1D1]">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        End Range
                      </p>
                      <p className="text-[#333333] text-base font-semibold">
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
              <div className="col-span-1 border border-[#D1D1D1] ">
                <div className="py-4 pl-3">
                  <p className="text-[#5D6E66] text-sm font-Regular">
                    Coverage Start Date
                  </p>
                  <p className="text-[#333333] text-base font-semibold">
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
              <div className="col-span-1 border border-[#D1D1D1]">
                <div className="py-4 pl-3">
                  <p className="text-[#5D6E66] text-sm font-Regular">
                    Coverage End Date
                  </p>
                  <p className="text-[#333333] text-base font-semibold">
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
              {contractDetail?.order?.[0]?.productsArray?.[0]?.priceType ==
              "Quantity Pricing" ? (
                <>
                  <div className="col-span-5 border border-[#D1D1D1] ">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th colSpan={4}>Quantity Pricing List</th>
                        </tr>
                        <tr>
                          <th>S.#</th>
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
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AddClaim;
