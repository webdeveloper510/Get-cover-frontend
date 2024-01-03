import React, { useEffect, useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import Button from "../../../common/button";

import AddItem from "../../../assets/images/icons/addItem.svg";
import Search from "../../../assets/images/icons/SearchIcon.svg";
// import clearFilter from "../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import ActiveIcon from "../../../assets/images/icons/iconAction.svg";
import Headbar from "../../../common/headBar";
import shorting from "../../../assets/images/icons/shorting.svg";
import Grid from "../../../common/grid";
import Input from "../../../common/input";
import Loader from "../../../assets/images/Loader.gif";
import clearFilter from "../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import Select from "../../../common/select";
import DataTable from "react-data-table-component";
import {
  editDealerPriceBook,
  getDealerPriceBook,
  filterGetPriceBookDetails
} from "../../../services/dealerServices";
import { RotateLoader } from "react-spinners";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getTermList } from "../../../services/dealerServices";
import axios from "axios";
const url = process.env.REACT_APP_API_KEY || "fallback_value";

function DealerPriceList() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedTearm, setSelectedTearm] = useState(false);
  const [dealerPriceBook, setDealerPriceBook] = useState([]);
  const [termList, setTermList] = useState([]);

  const [loading, setLoading] = useState(false);
  const navigte = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    getDealerList();
    getTermListData();
    filterDataGetPriceBook();
  }, []);


  const CustomNoDataComponent = () => (
    <div className="text-center my-5">
      <p>No records found.</p>
    </div>
  );

  const handleFilterIconClick = () => {
    formik.resetForm();
    console.log(formik.values);
    getDealerList();
  };

  const filterDataGetPriceBook = async (data)=>{
    try {
      setLoading(true);
      const res = await filterGetPriceBookDetails(data);
      setDealerPriceBook(res.result)
    }catch(error){
      console.error("Error fetching category list:", error);
    } finally {
      setLoading(false);
    }
  }


  const getDealerList = async () => {
    setLoading(true);
    const result = await getDealerPriceBook();
    setDealerPriceBook(result.result);
    console.log(result.result);
    setLoading(false);
  };
  const handleStatusChange = async (row, newStatus) => {
    try {
      const updatedCompanyPriceList = dealerPriceBook.map((category) => {
        if (category._id === row._id) {
          return { ...category, status: newStatus === "active" };
        }
        return category;
      });

      setDealerPriceBook(updatedCompanyPriceList);
      console.log(row);
      const result = await editDealerPriceBook(row._id, {
        retailPrice: row?.retailPrice?.toFixed(2),
        priceBook: row?.priceBook,
        dealerId: row?.dealerId,

        status: newStatus === "active" ? true : false,
        categoryId: row?.priceBooks[0]?.category[0]?._id,
        wholesalePrice: row?.wholesalePrice,
        term: row?.priceBooks[0]?.term,
        brokerFee: row?.brokerFee,
      });

    } catch (error) {
      console.error("Error in handleStatusChange:", error);
    }
  };

  const status = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];

  const calculateDropdownPosition = (index) => {
    const isCloseToBottom = dealerPriceBook.length - index <= 2;
    return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
  };

  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
  };

  const editScreen = (row) => {
    navigte(`/editDealerBook/${row._id}`);
    console.log(row);
  };

  const getTermListData = async () => {
    setLoading(true);
    try {
      const res = await getTermList();
      console.log(res.result.terms, "==============");
      setTermList(
        res.result.terms.map((item) => ({
          label: item.terms + " Months",
          value: item.terms,
        }))
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching category list:", error);
    }
  };

  const handleSelectChange =(name,selectedValue )=>{
    formik.setFieldValue(name, selectedValue) 
    }
  

  const formik = useFormik({
    initialValues: {
      Category: "",
      name: "",
      term: "",
      status: "",
    },
    validationSchema: Yup.object({
      Category: Yup.string(),
      name: Yup.string(),
      term: Yup.number(),
      status: Yup.boolean(),
    }),
    onSubmit: (values) => {
      console.log(values)
      filterDataGetPriceBook(values)
    },
  })


   
  


  const columns = [
    {
      name: "ID",
      selector: (row, index) => index + 1,
      sortable: true,
      minWidth: "auto",
      maxWidth: "70px",
    },
    {
      name: "Name",
      selector: (row) => row.dealer[0]?.name,
      sortable: true,
      minWidth: "100px",
    },
    {
      name: "Product Name",
      selector: (row) => row.priceBooks[0]?.name,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Category",
      selector: (row) => row.priceBooks[0]?.category[0]?.name,
      sortable: true,
      minWidth: "120px",
    },
    {
      name: "Term",
      selector: (row) => row.priceBooks[0]?.term + " Months",
      sortable: true,
      minWidth: "90px",
    },
    {
      name: "Wholesale Cost",
      selector: (row) => "$" + row?.wholesalePrice?.toFixed(2),
      sortable: true,
      minWidth: "160px",
    },
    {
      name: "Retail Cost",
      selector: (row) => "$" + row?.retailPrice?.toFixed(2),
      sortable: true,
      minWidth: "120px",
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
            disabled={
              row.priceBooks[0]?.category[0]?.status === false ? true : false
            }
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
      maxWidth: "80px",
      cell: (row, index) => {
        // console.log(index, index % 10 == 9)
        return (
          <div className="relative">
            <div onClick={() => setSelectedAction(selectedAction === index ? null : index)}>
              <img
                src={ActiveIcon}
                className="cursor-pointer	w-[35px]"
                alt="Active Icon"
              />
            </div>
            {selectedAction === index && (
              <div ref={dropdownRef}
                className={`absolute z-[2] w-[80px] drop-shadow-5xl -right-3 mt-2 p-2 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                  index
                )}`}
              >
                <div
                  className="text-center py-3 cursor-pointer"
                  onClick={() => editScreen(row)}
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

  return (
    <>
      <div className="my-8 ml-3">
        <Headbar />
        <div className="flex mt-2">
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9	mb-[3px]">
              Dealer Book
            </p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/"}>Price Book </Link> /{" "}
              </li>
              <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
                {" "}
                Dealer Book{" "}
              </li>
            </ul>
          </div>
        </div>
          <Link to={"/addDealerBook"} className=" w-[230px] !bg-white font-semibold py-2 px-4 ml-auto flex self-center mb-4 rounded-xl ml-auto border-[1px] border-[#D1D1D1]">
            {" "}
            <img src={AddItem} className="self-center" alt="AddItem" />{" "}
            <span className="text-black ml-3 text-[14px] font-Regular">
              Add Dealer Book{" "}
            </span>{" "}
          </Link>

        <div className="bg-white  border-[1px] border-[#D1D1D1] rounded-xl">
          <Grid className="!px-[26px] !pt-[14px] !pb-0">
            <div className="col-span-5 self-center">
              <p className="text-xl font-semibold py-4">Dealer Price List</p>
            </div>
           <div className="col-span-7">
              <div className="bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                <form onSubmit={formik.handleSubmit}>
                <Grid className="!grid-cols-10">
                  <div className="col-span-2 self-center">
                    <Input
                      name="Category"
                      type="text"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 !pb-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="Category"
                      value={formik.values.Category}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="col-span-2 self-center">
                    <Input
                      name="name"
                      type="text"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 !pb-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      onChange={formik.handleChange}
                      value={formik.values.name}
                      placeholder="Dealer Name"
                    />
                  </div>
                  <div className="col-span-2 self-center">
                    <Select
                      name="term"
                      label=""
                      options={termList}
                      OptionName="Term"
                      color="text-[#1B1D21] opacity-50"
                      className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      selectedValue={selectedTearm}
                      value={formik.values.term}
                      onChange={handleSelectChange}
                    />
                  </div>
                  <div className="col-span-2 self-center">
                    <Select
                      name="status"
                      label=""
                      options={status}
                      OptionName="Status"
                      color="text-[#1B1D21] opacity-50"
                      className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      selectedValue={selectedProduct}
                      value={formik.values.status}
                      onChange={handleSelectChange}
                    />
                  </div>
                  <div className="col-span-2 self-center justify-center flex">
                    <Button type="submit" className="!p-0">
                      <img
                        src={Search}
                        className="cursor-pointer  mx-auto"
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
                data={dealerPriceBook}
                highlightOnHover
                sortIcon={
                  <>
                    <img src={shorting} className="ml-2" alt="shorting" />
                  </>
                }
                pagination
                paginationPerPage={10}
                paginationComponentOptions={paginationOptions}
                paginationRowsPerPageOptions={[10, 20, 50, 100]}
                noDataComponent={<CustomNoDataComponent />}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default DealerPriceList;
