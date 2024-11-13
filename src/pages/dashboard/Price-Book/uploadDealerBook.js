import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Headbar from "../../../common/headBar";
import Select from "../../../common/select";
import Grid from "../../../common/grid";
import Input from "../../../common/input";

// Media Include
import BackImage from "../../../assets/images/icons/backArrow.svg";
import Button from "../../../common/button";
import Modal from "../../../common/model";
import Cross from "../../../assets/images/Cross.png";
import AddDealer from "../../../assets/images/dealer-book.svg";
import FileDropdown from "../../../common/fileDropbox";
import Dropbox from "../../../assets/images/icons/dropBox.svg";
import csvFile from "../../../assets/images/icons/csvFile.svg";
import { getDealerList } from "../../../services/extraServices";
import { useFormik } from "formik";
import * as Yup from "yup";
import { WithContext as ReactTags } from "react-tag-input";
import { uploadCompanyPriceBookInBulk, uploadDealerBookInBulk } from "../../../services/priceBookService";
import { RotateLoader } from "react-spinners";
import DealerList from "../Dealer/dealerList";
import Card from "../../../common/card";

function UploadDealerBook() {
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFile2, setSelectedFile2] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [activeDealers, SetActiveDealers] = useState([]);
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");
  const [tags, setTags] = useState([]);
  const [timer, setTimer] = useState(3);
  const [dealerName, setDealerName] = useState("");
  const [type, setType] = useState("");
  const [dealerID, setDealerID] = useState("");
  const navigate = useNavigate();
  const openModal = (value = "dealer") => {
    setType(value)
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectChange = (name, selectedValue) => {
    console.log(name, selectedValue, "Checking here if exist");
    setDealerID(selectedValue)
    activeDealers?.find((dealer) => {
      if (dealer.value === selectedValue) {
        setDealerName(dealer.label);
      }
    });
    formik.setFieldValue(name, selectedValue);
  };
  const handleSelectChange2 = (name, selectedValue) => {

    formikComapnyPricebook.setFieldValue(name, selectedValue);
  };
  useEffect(() => {
    let intervalId;
    if (isModalOpen && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0) {
      closeModal();
      // navigate(`/dealerPriceList`);
      if (type === "dealer") {
        navigate(`/dealerDetails/${dealerID}`);
        localStorage.setItem("menu", "PriceBook");
      } else {
        navigate(`/companyPriceBook`);
      }
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isModalOpen, timer]);


  useEffect(() => {
    getDealerDetails();
  }, []);


  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);

  const handleDropdownClick = () => {
    if (fileInputRef) {
      fileInputRef.current.click();
      setSelectedFile(null);
      console.log("formik value becomes empty")
      formik.setFieldValue("file", "");
      formik.setFieldTouched("file", false);
      setError(""); // Reset error state
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    formik.setFieldValue("file", file);
    console.log("value becmes null")
    event.target.value = null;
  };


  const handleDropdownClick2 = () => {
    if (fileInputRef2) {
      fileInputRef2.current.click();
      setSelectedFile2(null);
      formikComapnyPricebook.setFieldValue("companyPriceBook", "");
      formikComapnyPricebook.setFieldTouched("companyPriceBook", false);
      setError2(""); // Reset error state
    }
  };

  const handleFileSelect2 = (event) => {
    const file = event.target.files[0];
    setSelectedFile2(file);
    formikComapnyPricebook.setFieldValue("companyPriceBook", file);
    event.target.value = null;
  };

  const getDealerDetails = async () => {
    const data = await getDealerList();
    console.log(data.data);
    let arr = [];
    const filteredDealers = data.data.filter(
      (data) => data.dealerData.accountStatus === true
    );
    console.log(filteredDealers);
    filteredDealers?.length > 0 &&
      filteredDealers?.map((item) => {
        arr.push({ label: item.dealerData.name, value: item.metaId.toString() });
      });

    SetActiveDealers(arr);
  };
  const handleTagClick = (index) => {
    console.log("The tag at index " + index + " was clicked");
  };

  const formik = useFormik({
    initialValues: {
      dealerId: "",
      email: [],
      file: null,
    },
    validationSchema: Yup.object({
      dealerId: Yup.string().required("Dealer name is required"),
      file: Yup.mixed().test("file", "File is required", (value) => {
        return value !== undefined && value !== null && value.size > 0;
      }),
    }),
    onSubmit: async (values) => {
      setLoader(true);
      console.log("values", values.dealerId);
      const formData = new FormData();
      formData.append("dealerId", values.dealerId);
      formData.append("email", JSON.stringify(values.email));
      formData.append("file", values.file);
      var data = { formData };
      console.log(formData);

      try {
        const errors = await formik.validateForm(values);
        console.log("errors====>", errors)
        setError(""); // Reset API error state
        if (Object.keys(errors).length === 0) {
          const result = await uploadDealerBookInBulk(formData);
          console.log(result.message);
          setError(result.message);
          if (result.code === 200) {
            console.log("Form Data:", formData);
            setLoader(false);
            openModal();
            setTimer(3);
          } else {
            console.log("API error:", result.message);
            setLoader(false);
          }
        } else {
          console.log("Form validation failed:", errors);
          setLoader(false);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setLoader(false);
      }
    }
  });

  const formikComapnyPricebook = useFormik({
    initialValues: {
      priceType: "",
      companyPriceBook: null,
    },
    validationSchema: Yup.object({
      priceType: Yup.string().required("Price type is required"),
      companyPriceBook: Yup.mixed().test("companyPriceBook", "File is required", (value) => {
        return value !== undefined && value !== null && value.size > 0;
      }),
    }),
    onSubmit: async (values) => {
      console.log(values)
      setLoader(true);
      const formData = new FormData();
      formData.append("priceType", values.priceType);
      formData.append("companyPriceBook", values.companyPriceBook);
      var data = { formData };
      console.log(formData);

      try {
        const errors = await formikComapnyPricebook.validateForm(values);
        console.log("errors====>", errors)
        setError2(""); // Reset API error state
        if (Object.keys(errors).length === 0) {
          const result = await uploadCompanyPriceBookInBulk(formData);
          console.log(result.message);
          setError2(result.message);
          if (result.code === 200) {
            console.log("Form Data:", formData);
            setLoader(false);
            openModal('uploadCompany');
            setTimer(3);
          } else {
            console.log("API error:", result.message);
            setLoader(false);
          }
        } else {
          console.log("Form validation failed:", errors);
          setLoader(false);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setLoader(false);
      }
    }
  });

  const downloadCSVQuantity = async () => {
    window.open(
      "https://docs.google.com/spreadsheets/d/1fyeInEcdJQWEeTfvtjI2ioJNzzynjLqHeIpNHECI3fs/edit?usp=drive_web",
      "_blank"
    );
  };
  const downloadCSVFlat = async () => {
    window.open(
      "https://docs.google.com/spreadsheets/d/1nOLApCRcKHeXE7y7Ry5AhXX6XizzSKA37ZzHLi9n4X4/edit?usp=drive_web",
      "_blank"
    );
  };
  const downloadCSVReguler = async () => {
    window.open(
      "https://docs.google.com/spreadsheets/d/1EWMjTa_ep2z2x2IS9MxPZsuBZncHq6L0dzFrM71hH-w/edit?usp=drive_web",
      "_blank"
    );
  };


  const downloadCSVTemplate = async () => {
    window.open(
      "https://docs.google.com/spreadsheets/d/1hwQfZ-5f80JwcocWAbPF7texOezSAXi-UEp_qSnSQa0/edit?usp=sharing",
      "_blank"
    );
  };


  const pricetype = [
    { label: "Regular Pricing", value: "Regular Pricing" },
    { label: "Flat Pricing", value: "Flat Pricing" },
    { label: "Quantity Pricing", value: "Quantity Pricing" },
  ];

  return (
    <div className="mb-8 ml-3">
      <Headbar />
      {loader == true ? (
        <div className=" h-screen w-full flex py-5">
          <div className="self-center mx-auto">
            <RotateLoader color="#333" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex mt-2">
            <div className="pl-3">
              <p className="font-bold text-[36px] leading-9 mb-[3px]">
                Upload Price Book
              </p>
              <ul className="flex self-center">
                <li className="text-sm text-neutral-grey font-Regular">
                  <Link to={"/"}>Home </Link>{" "}
                  <span className=""> /</span>
                </li>
                <li className="text-sm text-neutral-grey font-semibold ml-1">
                  {" "}
                  Upload Price Book{" "}
                </li>
              </ul>
            </div>
          </div>

          {/* Form Start */}
          <Grid className="">
            <div className="col-span-6">

              <form className="mt-8" onSubmit={formik.handleSubmit}>
                <Card className="px-8 pb-8 pt-5 border-[1px] !bg-[#ffff] border-Light-Grey rounded-xl">
                  <p className="text-xl font-semibold ">Dealer Price Book</p>
                  {error ? (
                    <p className="text-red-500 text-sm pl-2 mt-3 mb-5">
                      <span className="font-semibold"> {error} </span>
                    </p>
                  ) : (
                    <p className="text-red-500 text-sm pl-2 mt-3 mb-5 opacity-0	">
                      <span className="font-semibold"> error </span>
                    </p>
                  )}
                  <Grid className="">
                    <div className="col-span-12">
                      <Select
                        label="Dealer Name"
                        required={true}
                        name="dealerId"
                        placeholder=""
                        onChange={handleSelectChange}
                        className="!bg-white"
                        options={activeDealers}
                        value={formik.values.dealerId}
                        onBlur={formik.handleBlur}
                        error={formik.touched.dealerId && formik.errors.dealerId}
                      />
                      {formik.touched.dealerId && formik.errors.dealerId && (
                        <div className="text-red-500 text-sm pl-2 pt-2">
                          <span className="font-semibold"> {formik.errors.dealerId} </span>
                        </div>
                      )}
                    </div>
                    {formik.values.dealerId != '' ? <div className="col-span-12">
                      <p className="text-base mb-2 font-semibold">
                        Upload In Bulk
                      </p>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={handleDropdownClick}
                          className={`bg-[#F2F2F2] border-[1px] border-[#D1D9E2] border-dashed	py-10 w-full rounded-md focus:outline-none focus:border-blue-500 !bg-transparent`}
                        >
                          {selectedFile ? (
                            <div className="self-center flex text-center relative bg-white border w-[80%] mx-auto p-3">
                              <img src={csvFile} className="mr-2" alt="Dropbox" />
                              <div className="flex justify-between w-full">
                                <p className="self-center">{selectedFile.name}</p>
                                <p className="self-center">
                                  {(selectedFile.size / 1000).toFixed(2)} kb
                                </p>
                              </div>
                            </div>
                          ) : (
                            <>
                              <img
                                src={Dropbox}
                                className="mx-auto mb-3"
                                alt="Dropbox"
                              />
                              <p className="">
                                Accepted file types: csv, xlsx, xls Max. file size:
                                50 MB.
                              </p>
                            </>
                          )}
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                          style={{ display: "none" }}
                          onChange={handleFileSelect}
                        />
                      </div>
                      {formik.touched.file && formik.errors.file && (
                        <p className="text-red-500 text-sm pl-2 pt-2">
                          <span className="font-semibold">{formik.errors.file} </span>
                        </p>
                      )}
                      <p className="text-[12px] mt-1 font-medium">
                        Please click on file option and make a copy. Upload the list
                        of Product Name and Price using our provided Google Sheets
                        template, by{" "}
                        <span
                          className="underline cursor-pointer"
                          onClick={downloadCSVTemplate}
                        >
                          Clicking here.
                        </span> The file must be saved with csv , xls and xlsx Format.
                      </p>
                    </div> : ''}

                  </Grid>
                  <Button
                    type="submit"
                    className="mt-12 font-normal rounded-[25px]"
                  >
                    Submit
                  </Button>
                </Card>
              </form>
            </div>
            <div className="col-span-6">
              <form className="mt-8" onSubmit={formikComapnyPricebook.handleSubmit}>
                <Card className="px-8 pb-8 pt-5 border-[1px] !bg-[#ffff] border-Light-Grey rounded-xl">
                  <p className="text-xl font-semibold ">Company Price Book</p>
                  {error2 ? (
                    <p className="text-red-500 text-sm pl-2 mt-3 mb-5">
                      <span className="font-semibold"> {error2} </span>
                    </p>
                  ) : (
                    <p className="text-red-500 text-sm pl-2 mt-3 mb-5 opacity-0	">
                      <span className="font-semibold"> error </span>
                    </p>
                  )}
                  <Grid className="">
                    <div className="col-span-12">
                      <Select
                        label="Price Type"
                        name="priceType"
                        required={true}
                        placeholder=""
                        onChange={handleSelectChange2}
                        className="!bg-white"
                        options={pricetype}
                        value={
                          (
                            pricetype.find(
                              (option) =>
                                option.value ==
                                (formikComapnyPricebook.values.priceType
                                  ? formikComapnyPricebook.values.priceType.toString()
                                  : "")
                            ) || {}
                          ).value || ""
                        }
                        onBlur={formikComapnyPricebook.handleBlur}
                        error={formikComapnyPricebook.touched.priceType && formikComapnyPricebook.errors.priceType}
                      />
                      {formikComapnyPricebook.touched.priceType && formikComapnyPricebook.errors.priceType && (
                        <div className="text-red-500 text-sm pl-2 pt-2">
                          {formikComapnyPricebook.errors.priceType}
                        </div>
                      )}
                    </div>
                    {formikComapnyPricebook.values.priceType ? (
                      <div className="col-span-12">
                        <p className="text-base mb-2 font-semibold">Upload In Bulk</p>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={handleDropdownClick2}
                            className={`bg-[#F2F2F2] border-[1px] border-[#D1D9E2] border-dashed py-10 w-full rounded-md focus:outline-none focus:border-blue-500 !bg-transparent`}
                          >
                            {selectedFile2 ? (
                              <div className="self-center flex text-center relative bg-white border w-[80%] mx-auto p-3">
                                <img src={csvFile} className="mr-2" alt="Dropbox" />
                                <div className="flex justify-between w-full">
                                  <p className="self-center">{selectedFile2.name}</p>
                                  <p className="self-center">{(selectedFile2.size / 1000).toFixed(2)} kb</p>
                                </div>
                              </div>
                            ) : (
                              <>
                                <img src={Dropbox} className="mx-auto mb-3" alt="Dropbox" />
                                <p>
                                  Accepted file types: csv, xlsx, xls. Max. file size: 50 MB.
                                </p>
                              </>
                            )}
                          </button>
                          <input
                            type="file"
                            ref={fileInputRef2}
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            style={{ display: "none" }}
                            onChange={handleFileSelect2}
                          />
                        </div>
                        {formikComapnyPricebook.touched.companyPriceBook && formikComapnyPricebook.errors.companyPriceBook && (
                          <p className="text-red-500 text-sm pl-2 pt-2">
                            <span className="font-semibold">{formikComapnyPricebook.errors.companyPriceBook}</span>
                          </p>
                        )}
                        <p className="text-[12px] mt-1 font-medium">
                          Please click on file option and make a copy. Upload the list of Product Name and Price using our provided Google Sheets template, by{" "}
                          <span
                            className="underline cursor-pointer"
                            onClick={() => {
                              if (formikComapnyPricebook.values.priceType === "Regular Pricing") {
                                downloadCSVReguler();
                              } else if (formikComapnyPricebook.values.priceType === "Flat Pricing") {
                                downloadCSVFlat();
                              } else if (formikComapnyPricebook.values.priceType === "Quantity Pricing") {
                                downloadCSVQuantity();
                              }
                            }}
                          >
                            Clicking here.
                          </span>&nbsp;
                          The file must be saved with csv, xls, or xlsx format.
                        </p>
                      </div>
                    ) : null}


                  </Grid>
                  <Button
                    type="submit"
                    className="mt-12 font-normal rounded-[25px]"
                  >
                    Submit
                  </Button>
                </Card>
              </form>
            </div>
          </Grid>
        </>
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center py-1">
          <img src={AddDealer} alt="email Image" className="mx-auto" />
          <p className="text-3xl mb-0 mt-4 font-semibold">
            Uploaded & Saved
            <span className=""> Successfully </span>
          </p>
          <p className=" text-base font-medium mt-2">
            You have successfully uploaded & saved the <br />{" "}
            <b> Dealer Book </b> with the new data <br /> you have entered.{" "}
          </p>
          <p className=" text-base font-medium mt-2">
            Redirecting you on Dealer Price List {timer} seconds.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default UploadDealerBook;
