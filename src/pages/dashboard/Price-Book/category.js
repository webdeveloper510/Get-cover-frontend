import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import Button from "../../../common/button";

import ActiveIcon from "../../../assets/images/icons/iconAction.svg";
import AddItem from "../../../assets/images/icons/addItem.svg";
import clearFilter from "../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import shorting from "../../../assets/images/icons/shorting.svg";
import Search from "../../../assets/images/icons/SearchIcon.svg";
import Headbar from "../../../common/headBar";
import Grid from "../../../common/grid";
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

function Category() {
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCategoryListData();
    window.scrollTo(0, 0);
  }, []);

  const handleSelectChange1 = (label, value) => {
    console.log(label, value, "selected");
    setSelectedProduct(value);
  };
  const handleFilterIconClick = () => {
    formik.resetForm();
    console.log(formik.values);
    getCategoryListData();
  };
  const paginationOptions = {
    rowsPerPageText: 'Rows per page:',
    rangeSeparatorText: 'of',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'All',
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
    const isCloseToBottom = categoryList.length - index <= 2;
    return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
  };

  const status = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];

  const handleActionChange = (action, row) => {
    console.log(`Selected action: ${action} for Category ID: ${row._id}`);
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };
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

  
  const columns = [
    {
      name: "Category ID",
      selector: (row) => row.unique_key,
      sortable: true,
      reorder: true
    },
    {
      name: "Category Name",
      selector: (row) => row.name,
      sortable: true,
      minWidth: '100px',  // Set a custom minimum width
      maxWidth: '170px',  // Set a custom maximum width
      cell: (row) => <span title={row.name}>{truncateText(row.name, 20)}</span>,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      cell: (row) => (
        <span title={row.description}>{truncateText(row.description, 30)}</span>
      ),
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
      cell: (row, index) => {
        console.log("===>>", index);
        return (
          <div className="relative">
            <div onClick={() => setSelectedAction(row.unique_key)}>
              <img
                src={ActiveIcon}
                className="cursor-pointer	w-[35px]"
                alt="Active Icon"
              />
            </div>
            {selectedAction === row.unique_key && (
              <div
                className={`absolute z-[2] w-[80px] drop-shadow-5xl -right-3 mt-2 p-2 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                  index
                )}`}
              >
                <div
                  className="text-center py-1 cursor-pointer"
                  onClick={() => navigate(`/editCategory/${row._id}`)}
                >
                  Edit
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
        getCategoryListData();
      } else {
        getCategoryListData();
      }
    } catch (error) {
      console.error("Error updating category status:", error);
      getCategoryListData();
    }
  };

  return (
    <>
      <div className="my-8 ml-3">
        <Headbar />
        <div className="flex mt-14">
          <div className="pl-3">
            <p className="font-semibold text-[36px] leading-9	mb-[3px]">
              Category
            </p>
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
        <Button className="!bg-white flex self-center mb-4 rounded-xl ml-auto border-[1px] border-[#D1D1D1]">
          {" "}
          <Link to={"/addCategory"} className="flex">
            {" "}
            <img src={AddItem} className="self-center" alt="AddItem" />{" "}
            <span className="text-black ml-3 text-[14px] font-semibold">
              Add Category{" "}
            </span>{" "}
          </Link>
        </Button>

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
                      <Button type="submit" className="!p-0 mr-2">
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
          <div className="mb-5">
            {loading ? (
              <p>Loading</p>
            ) : (
              <DataTable columns={columns} highlightOnHover sortIcon={<> <img src={shorting}  className="ml-2" alt="shorting"/>
              </>} data={categoryList} pagination  paginationPerPage={10} paginationComponentOptions={paginationOptions} paginationRowsPerPageOptions={[10, 20, 50, 100, 200]} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default Category;
