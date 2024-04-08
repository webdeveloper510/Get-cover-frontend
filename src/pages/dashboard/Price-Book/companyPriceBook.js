import React, { useEffect, useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import Button from "../../../common/button";

import ActiveIcon from "../../../assets/images/icons/iconAction.svg";
import AddItem from "../../../assets/images/icons/addItem.svg";
import Search from "../../../assets/images/icons/SearchIcon.svg";
import shorting from "../../../assets/images/icons/shorting.svg";
import Headbar from "../../../common/headBar";
import Edit from '../../../assets/images/Dealer/EditIcon.svg';
import clearFilter from "../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import Grid from "../../../common/grid";
import Input from "../../../common/input";
import view from "../../../assets/images/eye.png";
import edit from "../../../assets/images/edit-text.png";
import Select from "../../../common/select";
import DataTable from "react-data-table-component";
import Loader from "../../../assets/images/Loader.gif";
import Cross from "../../../assets/images/Cross.png";
import {
  editCompanyList,
  getCompanyPriceList,
  getCategoryList,
  getCompanyPriceBookById,
  getTermList,
} from "../../../services/priceBookService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RotateLoader } from "react-spinners";
import { editDealerPriceBook } from "../../../services/dealerServices";
import Modal from "../../../common/model";

function CompanyPriceBook() {
  const [isDisapprovedOpen, setIsDisapprovedOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [companyPriceList, setCompanyPriceList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [loading1, setLoading1] =useState(false)
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dropdownRef = useRef(null);
  const [termList, setTermList] = useState([]);
  //  options={pricetype}
  // OptionName="Price Type"
  // color="text-[#1B1D21] opacity-50"
  // className="!text-[14px] !bg-[#fff]"
  // value={formik.values.pricetype}
  const formik = useFormik({
    initialValues: {
      name: "",
      status: "",
      category: "",
      priceType: "",
      term: "",
      range:"",

    },
    validationSchema: Yup.object({
      name: Yup.string(),
      status: Yup.boolean(),
      category: Yup.string(),
      priceType: Yup.string(),
      term: Yup.string(),
      range: Yup.string(),
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
    getTermListData();
  }, []);

  const getPriceBookListData = async () => {
    try {
      let data = {
        ...formik.values,
      };
      setLoading(true);
      const res = await getCompanyPriceList(data);
      if (res.code != 200) {
        setError(res.message);
        setLoading(false);
      } else {
        setLoading(false);
        setError("");
      }
      console.log(res);
      setCompanyPriceList(res.result);
      closeDisapproved();
    } catch (error) {
      setLoading(false);
      closeDisapproved();
      console.error("Error fetching category list:", error);
    } finally {
      setLoading(false);
      closeDisapproved();
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
    // console.log(row);
    try {
      setCompanyPriceList((prevDealerPriceBook) => {
        return prevDealerPriceBook.map((category) => {
          if (category._id === row._id) {
            return {
              ...category,
              status: newStatus === "active" ? true : false,
            };
          }
          return category;
        });
      });

      const result = await editCompanyList(row._id, {
        status: newStatus === "active" ? true : false,
        priceCatId: row?.category?._id,
      });

      console.log(result);
    } catch (error) {
      console.error("Error in handleStatusChange:", error);
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
    const isCloseToBottom = companyPriceList.length - index <= 10000;
    return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
  };
  const totalCost =
    data.frontingFee +
    data.reserveFutureFee +
    data.reinsuranceFee +
    data.adminFee;

  const formattedCost = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalCost);
  const status = [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ];

  const pricetype = [
    { label: "Regular Pricing", value: "Regular Pricing" },
    { label: "Flat Pricing", value: "Flat Pricing" },
    { label: "Quantity Pricing", value: "Quantity Pricing" },
  ];

  const getCompanyPriceBook = (id) => {
    getcompanyPriceBookData(id)
  }
  const getcompanyPriceBookData = async (id) => {
    try {
      setLoading1(true);
      const result = await getCompanyPriceBookById(id);
      console.log(result.result);
      setData(result.result)
      setSelectedAction(null);
      setLoading1(false);
    } catch (error) {
      console.error(error);
      setLoading1(false);
    }
  }

  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row.unique_key,
      sortable: true,
      minWidth: "auto",
      maxWidth: "80px",
    },
    {
      name: "Price Type",
      selector: (row) => row.priceType,
      sortable: true,
      minWidth: "auto",
      maxWidth: "300px",
    },
    {
      name: "Category",
      selector: (row) => row.category.name,
      sortable: true,
      minWidth: "auto",
      maxWidth: "300px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      minWidth: "auto",
      maxWidth: "300px",
    },
    {
      name: " Term",
      selector: (row) => row.term + " Months",
      sortable: true,
      minWidth: "auto",
      maxWidth: "100px",
    },
    {
      name: "Cost",
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
      minWidth: "auto",
      maxWidth: "170px",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <div className="relative">
          <div
            className={` ${row.status === true ? "bg-[#6BD133]" : "bg-[#FF4747]"
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
      minWidth: "auto",
      maxWidth: "90px",
      cell: (row, index) => {
        return (
          <div className="relative">
            <div
              onClick={() =>
                setSelectedAction(
                  selectedAction === row.unique_key ? null : row.unique_key
                )
              }
            >
              <img
                src={ActiveIcon}
                className="cursor-pointer	w-[35px]"
                alt="Active Icon"
              />
            </div>
            {selectedAction === row.unique_key && (
              <div
                ref={dropdownRef}
                className={`absolute z-[2] w-[80px] drop-shadow-5xl -right-3 mt-2 py-1 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                  index
                )}`}
              >
                <div
                  onClick={() => navigate(`/editCompanyPriceBook/${row._id}`)}
                  className="text-left cursor-pointer flex hover:font-semibold py-1 px-2"
                  >
                   <img src={edit} className="w-4 h-4 mr-2"/> Edit
                </div>
                <hr />
                <div
                  onClick={() => openView(row._id)}
                  className="text-left cursor-pointer flex hover:font-semibold py-1 px-2"
                  >
                   <img src={view} className="w-4 h-4 mr-2"/> View
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
        setSelectedAction(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const CustomNoDataComponent = () => (
    <div className="text-center my-5">
      <p>No records found.</p>
    </div>
  );
  const [isViewOpen, setIsViewOpen] = useState(false);

  const closeView = () => {
    setIsViewOpen(false);
    setLoading(false);
  };

  const getTermListData = async () => {
    try {
      const res = await getTermList();
      console.log(res);
      setTermList(
        res.result.terms.map((item) => ({
          label: item.terms + " Months",
          value: item.terms,
        }))
      );
    } catch (error) {
      console.error("Error fetching category list:", error);
    }
  };

  const openView = async (id) => {
    try {
      setLoading(true);
      getCompanyPriceBook(id);
      setIsViewOpen(true);
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
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
  const closeDisapproved = () => {
    setIsDisapprovedOpen(false);
  };
  const openDisapproved = () => {
    setIsDisapprovedOpen(true);
  };
  return (
    <>
      <div className="mb-8 ml-3">
        <Headbar />

        <div className="flex mt-2">
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9	mb-[3px]">
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

        <Link
          to={"/addCompanyPriceBook"}
          className=" w-[230px] !bg-white font-semibold py-2 px-4 ml-auto flex self-center mb-4 rounded-xl ml-auto border-[1px] border-[#D1D1D1]"
        >
          {" "}
          <img src={AddItem} className="self-center" alt="AddItem" />{" "}
          <span className="text-black ml-3 text-[14px] font-Regular">
            Add Company Price Book{" "}
          </span>{" "}
        </Link>

        <div className="bg-white border-[1px] border-[#D1D1D1] rounded-xl">
          <form onSubmit={formik.handleSubmit}>
            <Grid className="!px-[26px] !pt-[14px] !pb-0">
              <div className="col-span-3 self-center">
                <p className="text-xl font-semibold">Product Price List</p>
              </div>
              <div className="col-span-9">
                <div className="bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                  <Grid className="!grid-cols-9">
                    <div className="col-span-2 self-center">
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

                    <div className="col-span-2 self-center">
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
                    <div className="col-span-2 self-center">
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
                    <div className="col-span-3 self-center flex justify-center">
                      <button type="submit">
                        <img
                          src={Search}
                          className="cursor-pointer	mx-auto "
                          alt="Search"
                        />
                      </button>
                      <Button
                        type="button"
                        className="!bg-transparent !p-0 mr-3"
                        onClick={handleFilterIconClick}
                      >
                        <img
                          src={clearFilter}
                          className="cursor-pointer	mx-auto"
                          alt="clearFilter"
                        />
                      </Button>
                      <Button
                        className="!text-[13px]"
                        onClick={() => openDisapproved()}
                      >
                        Advance Search
                      </Button>
                    </div>
                  </Grid>
                </div>
              </div>
            </Grid>
          </form>
          <div className="relative mb-5">
            {loading ? (
              <div className=" h-[400px] w-full flex py-5">
                <div className="self-center mx-auto">
                  <RotateLoader color="#333" />
                </div>
              </div>
            ) : (
              <DataTable
                columns={columns}
                sortIcon={
                  <>
                    {" "}
                    <img src={shorting} className="ml-2" alt="shorting" />
                  </>
                }
                data={companyPriceList}
                pagination
                paginationPerPage={10}
                paginationComponentOptions={paginationOptions}
                paginationRowsPerPageOptions={[10, 20, 50, 100]}
                noDataComponent={<CustomNoDataComponent />}
              />
            )}
          </div>

          <Modal isOpen={isViewOpen} onClose={closeView}>
            <Button onClick={closeView} className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]">
              <img src={Cross} className="w-full h-full text-black rounded-full p-0" />
            </Button>
            <Button onClick={() => { navigate(`/editCompanyPriceBook/${data._id}`) }} className="absolute left-[-13px] top-0 h-[80px] w-[80px] !p-[19px] !bg-gradient-to-t !from-[#5f5f5f] !to-[#575757] mt-[-9px] !rounded-full">
              <img src={Edit} className="w-full h-full text-black rounded-full p-0" />
            </Button>
            {loading1 ? (<>
              <div className=" h-[400px] w-full flex py-5">
                <div className="self-center mx-auto">
                  <RotateLoader color="#333" />
                </div>
              </div></>) : (
              <>
              <div className="py-3">
                <p className='text-center text-3xl font-semibold '>
                  View Company Price Book
                </p>
                <Grid className='mt-5 px-6'>
                  <div className='col-span-4'>
                    <p className="text-lg text-light-black font-semibold">Product Category</p>
                    <p className="text-base text-neutral-grey font-semibold"> {data?.category?.name}</p>
                  </div>
                  <div className='col-span-4'>
                    <p className="text-lg text-light-black font-semibold">Product Name</p>
                    <p className="text-base text-neutral-grey font-semibold"> {data.name}</p>
                  </div>
                  <div className='col-span-4'>
                    <p className="text-lg text-light-black font-semibold">Description</p>
                    <p className="text-base text-neutral-grey font-semibold"> {data.description}</p>
                  </div>
                  <div className='col-span-4'>
                    <p className="text-lg text-light-black font-semibold">Term</p>
                    <p className="text-base text-neutral-grey font-semibold"> {data.term} Months</p>
                  </div>
                  <div className='col-span-4'>
                    <p className="text-lg text-light-black font-semibold">Fronting fee</p>
                    <p className="text-base text-neutral-grey font-semibold">
                    ${ data?.frontingFee === undefined
                      ? parseInt(0).toLocaleString(2)
                      : formatOrderValue(data?.frontingFee ?? parseInt(0))}</p>
                  </div>
                  <div className='col-span-4'>
                    <p className="text-lg text-light-black font-semibold">Re-insurance fee</p>
                    <p className="text-base text-neutral-grey font-semibold">
                    ${ data?.reinsuranceFee === undefined
                      ? parseInt(0).toLocaleString(2)
                      : formatOrderValue(data?.reinsuranceFee ?? parseInt(0))} </p>
                  </div>
                  <div className='col-span-6'>
                    <p className="text-lg text-light-black font-semibold">Reserve for future claims</p>
                    <p className="text-base text-neutral-grey font-semibold">
                     ${ data?.reserveFutureFee === undefined
                      ? parseInt(0).toLocaleString(2)
                      : formatOrderValue(data?.reserveFutureFee ?? parseInt(0))} </p>
                  </div>
                  <div className='col-span-6'>
                    <p className="text-lg text-light-black font-semibold">Administration fee</p>
                    <p className="text-base text-neutral-grey font-semibold">
                    ${ data?.adminFee === undefined
                      ? parseInt(0).toLocaleString(2)
                      : formatOrderValue(data?.adminFee ?? parseInt(0))} </p>
                  </div>
                  <div className='col-span-4'>
                    <p className="text-lg text-light-black font-semibold">Wholesale Cost</p>
                    <p className="text-base text-neutral-grey font-semibold">
                    { formattedCost === undefined
                      ? parseInt(0).toLocaleString(2)
                      : formatOrderValue(formattedCost ?? parseInt(0))}</p>
                  </div>
                  <div className='col-span-4'>
                    <p className="text-lg text-light-black font-semibold">Status</p>
                    <p className="text-base text-neutral-grey font-semibold"> {data.status === true ? 'Active' : "inActive"}</p>
                  </div>
                  <div className='col-span-4'>
                    <p className="text-lg text-light-black font-semibold">Price Type</p>
                    <p className="text-base text-neutral-grey font-semibold"> {data.priceType}</p>
                  </div>
                  {
                    data.priceType == "Flat Pricing" && (
                      <>
                        <div className='col-span-4'> 
                          <p className="text-lg text-light-black font-semibold">Range Start</p>
                          <p className="text-base text-neutral-grey font-semibold"> 
                          ${ data?.rangeStart === undefined
                          ? parseInt(0).toLocaleString(2)
                          : formatOrderValue(data?.rangeStart ?? parseInt(0))}</p>
                        </div>
                        <div className='col-span-4'>
                          <p className="text-lg text-light-black font-semibold">Range End</p>
                          <p className="text-base text-neutral-grey font-semibold"> ${ data?.rangeEnd === undefined
                          ? parseInt(0).toLocaleString(2)
                          : formatOrderValue(data?.rangeEnd ?? parseInt(0))}</p>
                        </div></>
                    )
                  }
                  {
                    data.priceType == "Quantity Pricing" && (
                      <>
                        <div className='col-span-12'>
                          <table className="w-full border text-center">
                            <tr className="border bg-[#9999]">
                              <th colSpan={'2'}>Quantity Pricing List </th>
                            </tr>
                            <tr className="border bg-[#9999]">
                              <th className="w-[50%]">Name</th>
                              <th>Max Quantity</th>
                            </tr>
                            {
                              data.quantityPriceDetail.length !== 0 &&
                              data.quantityPriceDetail.map((item, index) => (
                                <tr key={index} className="border">
                                  <td>{item.name}</td>
                                  <td>{item.quantity}</td>
                                </tr>
                              ))
                            }
                          </table>
                        </div>
                      </>
                    )
                  }
                </Grid>
              </div>
              </>
            )}
            
          </Modal>

          <Modal isOpen={isDisapprovedOpen} onClose={closeDisapproved}>
            <Button
              onClick={closeDisapproved}
              className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]"
            >
              <img
                src={Cross}
                className="w-full h-full text-black rounded-full p-0"
              />
            </Button>
            <form onSubmit={formik.handleSubmit}>
              <div className="py-3">
                <p className="text-center text-3xl font-semibold ">
                  Advance Search
                </p>
                <Grid className="mt-5 px-6">
                  <div className="col-span-6">
                    <Input
                      type="text"
                      name="name"
                      className="!bg-[#fff]"
                      label="Product Name"
                      placeholder=""
                      value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                  </div>
                      <div className="col-span-6">
                      <Select
                        name="category"
                        label="Category"
                        options={categoryList}
                        OptionName="Category"
                        color="text-[#1B1D21] opacity-50"
                        className="!text-[14px] !bg-[#fff]"
                        value={formik.values.category}
                        onChange={formik.setFieldValue}
                      />
                      </div>
                      <div className="col-span-6">
                      <Select
                        name="priceType"
                        label="Price Type"
                        options={pricetype}
                        OptionName="Price Type"
                        color="text-[#1B1D21] opacity-50"
                        className="!text-[14px] !bg-[#fff]"
                        value={formik.values.priceType}
                        onChange={formik.setFieldValue}
                      />
                      </div>

                  <div className="col-span-6">
                  <Select
                        name="term"
                        label="Term"
                        options={termList}
                        OptionName="Term"
                        color="text-[#1B1D21] opacity-50"
                        className="!text-[14px] !bg-[#fff]"
                        value={formik.values.term}
                        onChange={formik.setFieldValue}
                      />
                  </div>
                  {formik.values.priceType == 'Flat Pricing' && <div className="col-span-6">
                    <Input
                      type="text"
                      name="range"
                      className="!bg-[#fff]"
                      label="Your Price"
                      placeholder=""
                      value={formik.values.range}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                  </div>}
                  
                  <div className="col-span-6">
                  <Select
                        name="status"
                        label="Status"
                        options={status}
                        OptionName="Status"
                        color="text-[#1B1D21] opacity-50"
                        // className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                        className="!text-[14px] !bg-[#fff]"
                        value={formik.values.status}
                        onChange={formik.setFieldValue}
                    />
                  </div>
                  <div className="col-span-12">
                    <Button type="submit" className={"w-full"}>
                      Search
                    </Button>
                  </div>
                </Grid>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default CompanyPriceBook;
