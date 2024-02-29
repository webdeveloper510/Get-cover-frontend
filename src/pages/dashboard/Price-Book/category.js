import React, { useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import Button from "../../../common/button";

import ActiveIcon from "../../../assets/images/icons/iconAction.svg";
import AddItem from "../../../assets/images/icons/addItem.svg";
import clearFilter from "../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import shorting from "../../../assets/images/icons/shorting.svg";
import Search from "../../../assets/images/icons/SearchIcon.svg";
import Headbar from "../../../common/headBar";
import Grid from "../../../common/grid";
import edit from "../../../assets/images/edit-text.png";
import Input from "../../../common/input";
import DataTable from "react-data-table-component";
import { useEffect } from "react";
import {
  editCategoryList,
  getCategoryList,
} from "../../../services/priceBookService";
import Select from "../../../common/select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RotateLoader } from "react-spinners";


function Category() {
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  useEffect(() => {
    getCategoryListData();
    window.scrollTo(0, 0);
  }, []);
  const handleFilterIconClick = () => {
    formik.resetForm();
    console.log(formik.values);
    getCategoryListData();
  };

  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
  };
  const getCategoryListData = async (data) => {
    try {
      setLoading(true);
      const res = await getCategoryList(data);
      setCategoryList(res.result);
    } catch (error) {
      console.error("Error fetching category list:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDropdownPosition = (index) => {
    const isCloseToBottom = categoryList.length - index <= 10000;
    return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
  };

  const status = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];
  const formik = useFormik({
    initialValues: {
      name: "",
      status: "",
    },
    validationSchema: Yup.object({
      name: Yup.string(),
      status: Yup.string(),
    }),
    onSubmit: (values) => {
      console.log("Form submitted with values:", values);
      getCategoryListData(values);
    },
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Close the dropdown if the click is outside of it
        setSelectedAction(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const CustomNoDataComponent = () => (
    <div className="text-center my-5">
      <p>No records found.</p>
    </div>
  );

  const columns = [
    {
      name: "ID",
      selector: (row) => row.unique_key,
      sortable: true,
      minWidth: "auto",
      maxWidth: "90px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      // cell: (row) => <span title={row.name}>{truncateText(row.name, 20)}</span>,
      minWidth: "200px",
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      minWidth: "350px",
      // cell: (row) => (
      //   <span title={row.description}>{truncateText(row.description, 30)}</span>
      // ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <div className="relative">
          <div
            className={` ${
              row.status === true ? "bg-[#6BD133]" : "bg-[#FF4747]"
            } absolute h-3 w-3 rounded-full top-[33%] ml-[8px]`}
          ></div>
          <select
            value={row.status === true ? "active" : "inactive"}
            onChange={(e) => handleStatusChange(row, e.target.value)}
            className="text-[12px] border border-gray-300 text-[#727378] rounded pl-[20px] py-2 pr-1 font-semibold rounded-xl"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      ),
    },
    {
      name: "Action",
      minWidth: "auto",
      maxWidth: "90px",
      cell: (row, index) => {
        // console.log("===>>", index);
        return (
          <div className="relative">
            <div onClick={() => setSelectedAction(selectedAction === row.unique_key ? null : row.unique_key)}>
              <img
                src={ActiveIcon}
                className="cursor-pointer	w-[35px]"
                alt="Active Icon"
              />
            </div>
            {selectedAction === row.unique_key && (
              <div ref={dropdownRef}
                className={`absolute z-[2] w-[80px] drop-shadow-5xl -right-3 mt-2 py-2 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                  index
                )}`}
              >
                <div
                  onClick={() => navigate(`/editCategory/${row._id}`)}
                  className="text-left cursor-pointer flex hover:font-semibold py-1 px-2"
                  >
                   <img src={edit} className="w-4 h-4 mr-2"/> Edit
                </div>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const handleStatusChange = async (row, newStatus) => {
    try {
      const updatedCategoryList = categoryList.map((category) => {
        if (category._id === row._id) {
          return { ...category, status: newStatus === "active" ? true : false };
        }
        return category;
      });

      setCategoryList(updatedCategoryList);

      const result = await editCategoryList(row._id, {
        name: row.name,
        description: row.description,
        status: newStatus === "active" ? true : false,
      });

      console.log(result);

      if (result.code === 200) {
        console.log("Status updated successfully");
        // getCategoryListData();
      } else {
        // getCategoryListData();
      }
    } catch (error) {
      console.error("Error updating category status:", error);
      // getCategoryListData();
    }
  };

  return (
    <>
      <div className="mb-8 ml-3">
        <Headbar />
        <div className="flex mt-2">
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9	mb-[3px]">Category</p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/"}>Price Book </Link> /{" "}
              </li>
              <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
                {" "}
                Category{" "}
              </li>
            </ul>
          </div>
        </div>
        <Link
          to={"/addCategory"}
          className=" w-[180px] !bg-white font-semibold py-2 px-4 ml-auto flex self-center mb-4 rounded-xl ml-auto border-[1px] border-[#D1D1D1]"
        >
          {" "}
          <img src={AddItem} className="self-center" alt="AddItem" />{" "}
          <span className="text-black ml-3 text-[14px] font-Regular">
            Add Category{" "}
          </span>{" "}
        </Link>

        <div className="bg-white  border-[1px] border-[#D1D1D1] rounded-xl ">
          <Grid className="!px-[26px] !pt-[14px] !pb-0">
            <div className="col-span-5 self-center">
              <p className="text-xl font-semibold">Categories List</p>
            </div>
            <div className="col-span-7">
              <div className="bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                <form onSubmit={formik.handleSubmit}>
                  <Grid className="">
                    <div className="col-span-5 self-center">
                      <Input
                        name="name"
                        type="text"
                        placeholder="Category Name"
                        className="!text-[14px] !bg-[#f7f7f7]"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                        label=""
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    <div className="col-span-5 self-center">
                      <Select
                        label=""
                        name="status"
                        OptionName="Status"
                        options={status}
                        color="text-[#1B1D21] opacity-50"
                        className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                        className="!text-[14px] !bg-[#f7f7f7] "
                        value={formik.values.status}
                        onChange={formik.setFieldValue}
                      />
                    </div>
                    <div className="col-span-2 self-center flex ">
                      <Button type="submit" className="!p-0">
                        <img
                          src={Search}
                          className="cursor-pointer	mx-auto "
                          alt="Search"
                        />
                      </Button>
                      <Button
                        type="submit"
                        onClick={() => {
                          handleFilterIconClick();
                        }}
                        className="!bg-transparent !p-0"
                      >
                        <img
                          src={clearFilter}
                          className="cursor-pointer	mx-auto"
                          alt="clearFilter"
                        />
                      </Button>
                    </div>
                  </Grid>
                </form>
              </div>
            </div>
          </Grid>
          <div className="mb-5 relative">
            {loading ? (
              <div className=" h-[400px] w-full flex py-5">
                <div className="self-center mx-auto">
                  <RotateLoader color="#333" />
                </div>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={categoryList}
                highlightOnHover
                sortIcon={
                  <>
                    {" "}
                    <img src={shorting} className="ml-2" alt="shorting" />
                  </>
                }
                noDataComponent={<CustomNoDataComponent />}
                pagination
                paginationPerPage={10}
                paginationComponentOptions={paginationOptions}
                paginationRowsPerPageOptions={[10, 20, 50, 100]}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default Category;
