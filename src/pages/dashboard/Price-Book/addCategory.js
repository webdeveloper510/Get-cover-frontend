import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Headbar from "../../../common/headBar";
import Grid from "../../../common/grid";
import Input from "../../../common/input";
import { useFormik } from "formik";
import * as Yup from "yup";

// Media Include
import BackImage from "../../../assets/images/icons/backArrow.svg";
import Button from "../../../common/button";
import Modal from "../../../common/model";
import AddDealer from "../../../assets/images/dealer-book.svg";
import {
  addCategory,
  editCategoryList,
  getCategoryById,
} from "../../../services/priceBookService";
import Select from "../../../common/select";

function AddCategory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [type, setType] = useState("");
  const [timer, setTimer] = useState(5);
  const [categoryDetails, setCategoryDetails] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    let intervalId;
    console.log("navigate", id);
    if (id) {
      setType("Edit");
      getCategoryDetailsById(id);
    } else {
      setType("Add New");
    }
    if (isModalOpen && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    if (timer === 0) {
      closeModal();
      navigate("/category");
    }
    return () => clearInterval(intervalId);
  }, [isModalOpen, timer, id]);

  const status = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      status: categoryDetails.status ? categoryDetails.status : true,
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required("Category Name Required"),
      description: Yup.string().trim().required("Description Required"),
      status: Yup.boolean().required("Status Required"),
    }),
    onSubmit: async (values) => {
      console.log("Form values:", values);
      const result = id
        ? await editCategoryList(id, values)
        : await addCategory(values);
      console.log(result);
      if (result.code !== 200) {
        setError(result.message);
      } else {
        setError(false);
        setIsModalOpen(true);
        setTimer(3);
      }
    },
  });
  const handleSelectChange = (name, selectedValue) => {
    formik.setFieldValue(name, selectedValue);
  };

  const defaultValue = categoryDetails.status;

  useEffect(() => {
    if (type === "Edit" && Object.keys(categoryDetails).length > 0) {
      formik.setValues((prevValues) => ({
        ...prevValues,
        name: categoryDetails.name,
        description: categoryDetails.description,
        status: categoryDetails.status,
      }));
    }
  }, [type, categoryDetails]);

  // const status = [
  //   { label: "Active", value: true },
  //   { label: "Inactive", value: false },
  // ];

  const getCategoryDetailsById = async (id) => {
    const result = await getCategoryById(id);
    setCategoryDetails(result.result);
    console.log(categoryDetails);
  };
  return (
    <div className="my-8 ml-3">
      <Headbar />
      <div className="flex mt-14">
        <Link
          to={"/category"}
          className="h-[60px] w-[60px] flex border-[1px] bg-white border-[#D1D1D1] rounded-[20px]"
        >
          <img
            src={BackImage}
            className="m-auto my-auto self-center bg-white"
            alt="BackImage"
          />{" "}
        </Link>
        <div className="pl-3">
          <p className="font-ExtraBold text-[36px] leading-9 mb-[3px]">
            {type} Category
          </p>
          <ul className="flex self-center">
            <li className="text-sm text-neutral-grey font-Regular">
              <Link to={"/dashboard"}>Price Book </Link>{" "}
              <span className="mx-2"> /</span>{" "}
            </li>
            <li className="text-sm text-neutral-grey font-Regular ml-1">
              <Link
                to={"/category"}
                className="text-sm text-neutral-grey font-Regular"
              >
                Category{" "}
              </Link>{" "}
              <span className="mx-2"> /</span>{" "}
            </li>
            <li className="text-sm text-neutral-grey font-semibold ml-1">
              {" "}
              {type} Category{" "}
            </li>
          </ul>
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-sm pl-2">
          <span className="font-semibold"> {} </span>
        </p>
      )}
      {/* Form Start */}

      <form className="mt-8" onSubmit={formik.handleSubmit}>
        <div className="px-8 py-8 drop-shadow-4xl bg-white border-[1px] border-[#D1D1D1]  rounded-xl">
          <Grid>
            <div className="col-span-12">
              <Input
                type="text"
                name="name"
                label="Category Name"
                placeholder=""
                required={true}
                className="!bg-[#fff]"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-sm pl-2 pt-2">
                  {formik.errors.name}
                </div>
              )}
            </div>
            {Object.keys(categoryDetails).length > 0 && (
              <div className="col-span-12">
                <Select
                  label="Status*"
                  name="status"
                  placeholder=""
                  onChange={handleSelectChange}
                  className="!bg-[#f7f7f7]"
                  options={status}
                  value={formik.values.status}
                  onBlur={formik.handleBlur}
                  error={formik.touched.status && formik.errors.status}
                  defaultValue={defaultValue}
                />
                {formik.touched.status && formik.errors.status && (
                  <div className="text-red-500 text-sm pl-2 pt-2">
                    {formik.errors.status}
                  </div>
                )}
              </div>
            )}
            <div className="col-span-12">
              <div className="relative">
                <label
                  htmlFor="description"
                  className="absolute text-base text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-[#fff] left-2 px-1 -translate-y-4 scale-75"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  rows="4"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="resize-none block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold text-light-black bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer"
                ></textarea>
                {formik.touched.description && formik.errors.description && (
                  <div className="text-red-500 text-sm pl-2 pt-2">
                    {formik.errors.description}
                  </div>
                )}
              </div>
            </div>
          </Grid>
          <Button type="submit" className="mt-12 font-normal rounded-[25px]">
            Submit
          </Button>
        </div>
      </form>

      {/* Modal Email Popop */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center py-3">
          <img src={AddDealer} alt="email Image" className="mx-auto" />
          <p className="text-3xl mb-0 mt-4 font-semibold text-neutral-grey">
            Submitted <span className="text-light-black"> Successfully </span>
          </p>
          <p className="text-neutral-grey text-base font-medium mt-2">
            <b>{type} </b> added successfully.{" "}
          </p>
          <p className="text-neutral-grey text-base font-medium mt-2">
            Redirecting you on Category Page {timer} seconds.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default AddCategory;
