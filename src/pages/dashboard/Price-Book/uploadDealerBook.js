import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { getDealerList } from "../../../services/extraServices";
import { useFormik } from "formik";
import * as Yup from "yup";

function UploadDealerBook() {
  const [selectedValue, setSelectedValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDealers, SetActiveDealers] = useState([]);
  const [csvFile, setCSVFile] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectChange = (name, selectedValue) => {
    formik.setFieldValue(name, selectedValue);
  };

  const country = [
    { label: "Country", value: "country" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ];
  useEffect(() => {
    getDealerDetails();
  }, []);

  const getDealerDetails = async () => {
    const data = await getDealerList();
    console.log(data.data);
    let arr = [];
    data?.data?.length > 0 &&
      data?.data?.map((item) => {
        arr.push({ label: item.dealerData.name, value: item.accountId });
      });

    SetActiveDealers(arr);
  };
  const formik = useFormik({
    initialValues: {
      dealerId: "",
      email: "",
    },
    validationSchema: Yup.object({
      dealerId: Yup.string().required("Dealer Name is required"),
      email: Yup.string().required("Email is required"),
      csvFile: Yup.mixed().test("file", "CSV file is required", (value) => {
        return value !== undefined && value !== null && value.size > 0;
      }),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("dealerId", values.dealerId);
        formData.append("email", values.email);
        formData.append("csvFile", csvFile);

        const errors = await formik.validateForm(values);
        if (Object.keys(errors).length === 0) {
          console.log("Form Data:", formData);
          openModal();
        } else {
          console.log("Form validation failed:", errors);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  return (
    <div className="my-8 ml-3">
      <Headbar />

      <div className="flex mt-14">
        <div className="pl-3">
          <p className="font-semibold text-[36px] leading-9 mb-[3px]">
            Upload Dealer Book
          </p>
          <ul className="flex self-center">
            <li className="text-sm text-neutral-grey font-Regular">
              <Link to={"/"}>Price Book </Link> <span className="mx-2"> /</span>
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
        <div className="px-8 py-8 drop-shadow-4xl bg-white min-h-screen border-[1px] border-[#D1D1D1]  rounded-xl">
          <Grid className="">
            <div className="col-span-6">
              <div className="col-span-6">
                <Select
                  label="Dealer Name*"
                  name="dealerId"
                  placeholder=""
                  onChange={handleSelectChange}
                  className="!bg-[#fff]"
                  options={activeDealers}
                  value={formik.values.dealerId}
                  onBlur={formik.handleBlur}
                  error={formik.touched.dealerId && formik.errors.dealerId}
                />
                {formik.touched.dealerId && formik.errors.dealerId && (
                  <div className="text-red-500 text-sm pl-2 pt-2">
                    {formik.errors.dealerId}
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-6">
              <Input
                type="text"
                name="email"
                className={`!bg-[#fff] ${
                  formik.errors.email ? "border-red-500" : ""
                }`}
                label="Email Confirmations"
                required={true}
                placeholder=""
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.errors.email && (
                <p className="text-red-500 text-[10px] mt-1 font-medium">
                  {formik.errors.email}
                </p>
              )}
            </div>
            <div className="col-span-12">
              <p className="text-light-black text-base mb-2 font-semibold">
                Upload In Bulk
              </p>
              <input
                type="file"
                name="csvFile"
                onChange={(e) => setCSVFile(e.target.files[0])}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                className={`!bg-[#fff] ${
                  formik.errors.csvFile ? "border-red-500" : ""
                }`}
              />
              {formik.errors.csvFile && (
                <p className="text-red-500 text-[10px] mt-1 font-medium">
                  {formik.errors.csvFile}
                </p>
              )}
              <p className="text-[10px] mt-1 text-[#5D6E66] font-medium">
                Please click on file option and make a copy. Upload the list of
                Product Name and Price using our provided Google Sheets
                template, by<span className="underline">Clicking here </span>.
                The file must be saved with CSV Format.
              </p>
            </div>
          </Grid>
          <Button type="submit" className="mt-12 font-normal rounded-[25px]">
            Submit
          </Button>
        </div>
      </form>

      {/* Modal Email Popop */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <Button
          onClick={closeModal}
          className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]"
        >
          <img
            src={Cross}
            className="w-full h-full text-black rounded-full p-0"
          />
        </Button>
        <div className="text-center py-1">
          <img src={AddDealer} alt="email Image" className="mx-auto" />
          <p className="text-3xl mb-0 mt-4 font-semibold text-neutral-grey">
            Uploaded & Saved
            <span className="text-light-black"> Successfully </span>
          </p>
          <p className="text-neutral-grey text-base font-medium mt-2">
            You have successfully uploaded & saved the <br />{" "}
            <b> Dealer Book </b> with the new data <br /> you have entered.{" "}
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default UploadDealerBook;
