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
import { uploadDealerBookInBulk } from "../../../services/priceBookService";
import { RotateLoader } from "react-spinners";
import DealerList from "../Dealer/dealerList";
import Card from "../../../common/card";

function UploadDealerBook() {
  const [selectedFile, setSelectedFile] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [activeDealers, SetActiveDealers] = useState([]);
  const [error, setError] = useState("");
  const [tags, setTags] = useState([]);
  const [timer, setTimer] = useState(3);
  const [dealerName, setDealerName] = useState("");
  const [dealerID, setDealerID] = useState("");
  const navigate = useNavigate();
  const openModal = () => {
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
      navigate(`/dealerDetails/${dealerID}`);
      localStorage.setItem("menu", "PriceBook");
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isModalOpen, timer]);
  const emailValidationRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const KeyCodes = {
    comma: 188,
    enter: 13,
  };
  const delimiters = [KeyCodes.comma, KeyCodes.enter];
  useEffect(() => {
    getDealerDetails();
  }, []);
  const handleDelete = (i) => {
    const updatedTags = [...tags];
    updatedTags.splice(i, 1);
    setTags(updatedTags);
    formik.setFieldValue(
      "email",
      updatedTags.map((tag) => tag.text)
    );
  };

  const fileInputRef = useRef(null);
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
  const handleAddition = (tag) => {
    const updatedTags = [...tags, tag];
    setTags(updatedTags);
    formik.setFieldValue(
      "email",
      updatedTags.map((tag) => tag.text)
    );
  };
  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
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
        arr.push({ label: item.dealerData.name, value: item.accountId });
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
      email: Yup.array()
        .of(
          Yup.string()
            .matches(emailValidationRegex, "Invalid email address")
          
        ),
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

  const downloadCSVTemplate = async () => {
    window.open(
      "https://docs.google.com/spreadsheets/d/1hwQfZ-5f80JwcocWAbPF7texOezSAXi-UEp_qSnSQa0/edit#gid=0",
      "_blank"
    );
  };

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
                Upload Dealer Book
              </p>
              <ul className="flex self-center">
                <li className="text-sm text-neutral-grey font-Regular">
                  <Link to={"/"}>Price Book </Link>{" "}
                  <span className="mx-2"> /</span>
                </li>
                <li className="text-sm text-neutral-grey font-semibold ml-1">
                  {" "}
                  Upload Dealer Book{" "}
                </li>
              </ul>
            </div>
          </div>

          {/* Form Start */}
          
          <form className="mt-8" onSubmit={formik.handleSubmit}>
            <Card className="px-8 pb-8 pt-5 drop-shadow-4xl border-[1px] border-Light-Grey rounded-xl">
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
                </div>
                <div className="col-span-12">
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
                      Clicking here
                    </span>
                    The file must be saved with csv , xls and xlsx Format.
                  </p>
                </div>
              </Grid>
              <Button
                type="submit"
                className="mt-12 font-normal rounded-[25px]"
              >
                Submit
              </Button>
            </Card>
          </form>

          {/* Modal Email Popop */}
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
