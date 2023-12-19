import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import Button from "../../../common/button";

import ActiveIcon from "../../../assets/images/icons/iconAction.svg";
import AddItem from "../../../assets/images/icons/addItem.svg";
import Search from "../../../assets/images/icons/SearchIcon.svg";
import shorting from "../../../assets/images/icons/shorting.svg";
import Headbar from "../../../common/headBar";
import clearFilter from "../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import Grid from "../../../common/grid";
import Input from "../../../common/input";
import Select from "../../../common/select";
import DataTable from "react-data-table-component";
import Loader from "../../../assets/images/Loader.gif";
import {
  editCompanyList,
  getCompanyPriceList,
  getCategoryList,
} from "../../../services/priceBookService";
import { useFormik } from "formik";
import * as Yup from "yup";

function CompanyPriceBook() {
  // const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedAction, setSelectedAction] = useState(null);
  const [companyPriceList, setCompanyPriceList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // const handleSelectChange1 = (label, value) => {
  //   console.log(label, value, "selected");
  //   setSelectedProduct(value);
  // };

  const formik = useFormik({
    initialValues: {
      name: "",
      status: "",
      category: "",
    },
    validationSchema: Yup.object({
      name: Yup.string(),
      status: Yup.boolean(),
      category: Yup.string(),
    }),
    onSubmit: (values) => {
      console.log("Form submitted with values:", values);
      getPriceBookListData(values);
    },
  });

  useEffect(() => {
    getPriceBookListData();
    getCategoryListData();
    window.scrollTo(0, 0);
  }, []);

  const getPriceBookListData = async (data) => {
    try {
      setLoading(true);
      const res = await getCompanyPriceList(data);
      setCompanyPriceList(res.result);
    } catch (error) {
      console.error("Error fetching category list:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryListData = async () => {
    try {
      const res = await getCategoryList();
      let arr = [];
      res?.result?.length > 0 &&
        res?.result?.map((item) => {
          arr.push({ label: item.name, value: item.name });
        });

      setCategoryList(arr);
    } catch (error) {
      console.error("Error fetching category list:", error);
    }
  };

  const handleStatusChange = async (row, newStatus) => {
    try {
      const updatedCompanyPriceList = companyPriceList.map((category) => {
        if (category._id === row._id) {
          return { ...category, status: newStatus === "active" ? true : false };
        }
        return category;
      });

      setCompanyPriceList(updatedCompanyPriceList);

      const result = await editCompanyList(row._id, {
        priceCatId: row.category._id,
        reinsuranceFee: row.reinsuranceFee,
        adminFee: row.adminFee,
        reserveFutureFee: row.reserveFutureFee,
        frontingFee: row.frontingFee,
        description: row.description,
        status: newStatus === "active" ? true : false,
      });

      console.log(result);

      if (result.code === 200 || result.code === 401) {
        console.log("Status updated successfully");
        getPriceBookListData();
      } else {
        getPriceBookListData();
      }
    } catch (error) {
      console.error("Error updating category status:", error);
      getPriceBookListData();
    }
  };

  const handleFilterIconClick = () => {
    formik.resetForm();
    console.log(formik.values);
    getPriceBookListData();
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const calculateDropdownPosition = (index) => {
    const isCloseToBottom = companyPriceList.length - index <= 2;
    return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
  };

  const handleActionChange = (action, row) => {
    console.log(`Selected action: ${action} for Category ID: ${row._id}`);
  };
  const country = [
    { label: "Country1", value: "country" },
    { label: "Option 2", value: "option21" },
    { label: "Option 3", value: "option3" },
  ];

  const status = [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ];

  const paginationOptions = {
    rowsPerPageText: 'Rows per page:',
    rangeSeparatorText: 'of',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'All',
  };

  const columns = [
    {
      name: "Product ID",
      selector: (row) => row.unique_key,
      sortable: true,
    reorder: true
    },
    {
      name: "Product Category",
      selector: (row) => row.category.name,
      sortable: true,
      minWidth: 'auto',  // Set a custom minimum width
      maxWidth: '200px',  // Set a custom maximum width
      cell: (row) => (
        <span title={row.category.name}>
          {truncateText(row.category.name, 20)}
        </span>
      ),
    },
    {
      name: "Product Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => <span title={row.name}>{truncateText(row.name, 20)}</span>,
    },
    {
      name: "Product Term",
      selector: (row) => row.term + " Months",
      sortable: true,
      minWidth: 'auto', 
      maxWidth: '170px', 
    },
    {
      name: "WholeSale Cost",
      selector: (row) => {
        const totalCost =
          row.frontingFee +
          row.reserveFutureFee +
          row.reinsuranceFee +
          row.adminFee;
        const formattedCost = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(totalCost);

        return formattedCost;
      },
      sortable: true,
      minWidth: 'auto', 
      maxWidth: '170px',
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
            disabled={row.category.status === false ? true : false}
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
      right: true,
      reorder: true,
      minWidth: 'auto', 
      maxWidth: '90px',
      cell: (row, index) => {
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
                  onClick={() => navigate(`/editCompanyPriceBook/${row._id}`)}
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

  return (
    <>
      <div className="my-8 ml-3">
        <Headbar />
        <div className="flex mt-14">
          <div className="pl-3">
            <p className="font-semibold text-[36px] leading-9	mb-[3px]">
              Company Price Book
            </p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/"}>Price Book </Link> /{" "}
              </li>
              <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
                {" "}
                Company Price Book{" "}
              </li>
            </ul>
          </div>
        </div>
        <Button className="!bg-white flex self-center mb-4 rounded-xl ml-auto border-[1px] border-[#D1D1D1]">
          {" "}
          <Link to={"/addCompanyPriceBook"} className="flex">
            {" "}
            <img src={AddItem} className="self-center" alt="AddItem" />{" "}
            <span className="text-black ml-3 text-[14px] font-semibold">
              Add Company Price Book{" "}
            </span>{" "}
          </Link>
        </Button>

        <div className="bg-white border-[1px] border-[#D1D1D1] rounded-xl">
          <form onSubmit={formik.handleSubmit}>
            <Grid className="!px-[26px] !pt-[14px] !pb-0">
              <div className="col-span-4 self-center">
                <p className="text-xl font-semibold">Product Price List</p>
              </div>
              <div className="col-span-8">
                <div className="bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                  <Grid className="!grid-cols-11">
                    <div className="col-span-3 self-center">
                      <Input
                        name="name"
                        type="text"
                        placeholder="Product Name"
                        className="!text-[14px] !bg-[#f7f7f7]"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                        label=""
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>

                    <div className="col-span-3 self-center">
                      <Select
                        name="category"
                        label=""
                        options={categoryList}
                        OptionName="Category"
                        color="text-[#1B1D21] opacity-50"
                        className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                        className="!text-[14px]  !bg-[#f7f7f7]"
                        value={formik.values.category}
                        onChange={formik.setFieldValue}
                      />
                    </div>
                    <div className="col-span-3 self-center">
                      <Select
                        name="status"
                        label=""
                        options={status}
                        OptionName="Status"
                        color="text-[#1B1D21] opacity-50"
                        className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                        className="!text-[14px] !bg-[#f7f7f7]"
                        value={formik.values.status}
                        onChange={formik.setFieldValue}
                      />
                    </div>
                    <div className="col-span-2 self-center flex justify-center">
                      <button type="submit">
                        <img
                          src={Search}
                          className="cursor-pointer	mx-auto "
                          alt="Search"
                        />
                      </button>
                      <Button
                        type="submit"
                        className="!bg-transparent !ml-2 !p-0"
                        onClick={handleFilterIconClick}
                      >
                        <img
                          src={clearFilter}
                          className="cursor-pointer	mx-auto"
                          alt="clearFilter"
                        />
                      </Button>
                    </div>
                  </Grid>
                </div>
              </div>
            </Grid>
          </form>
          <div className="overflow-x-auto mb-5">
          {loading ? (
              <div className="bg-[#f1f2f3] py-5">
                <img src={Loader} className="mx-auto bg-transparent" alt="Loader" />
                </div>
            ) : (
            <DataTable columns={columns} sortIcon={<> <img src={shorting}  className="ml-2" alt="shorting"/>
              </>} data={companyPriceList} pagination  paginationPerPage={10} paginationComponentOptions={paginationOptions} paginationRowsPerPageOptions={[10, 20, 50, 100,]}/>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CompanyPriceBook;
