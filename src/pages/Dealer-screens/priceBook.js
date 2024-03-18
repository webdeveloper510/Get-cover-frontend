import React, { useEffect, useRef, useState } from "react";
import Button from "../../common/button";

import ActiveIcon from "../../assets/images/icons/iconAction.svg";
import Search from "../../assets/images/icons/SearchIcon.svg";
import clearFilter from "../../assets/images/icons/Clear-Filter-Icon-White.svg";
import shorting from "../../assets/images/icons/shorting.svg";
import AddItem from "../../assets/images/icons/addItem.svg";
import Grid from "../../common/grid";
import Input from "../../common/input";
import Cross from "../../assets/images/Cross.png";
import DataTable from "react-data-table-component";
import { getDealerPricebookDetailById } from "../../services/dealerServices";
import { getCategoryList } from "../../services/priceBookService";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "../../common/select";
import { RotateLoader } from "react-spinners";

import Modal from "../../common/model";
import { getPriceBookListByResellerId } from "../../services/reSellerServices";
import Headbar from "../../common/headBar";
import view from "../../assets/images/eye.png";
import {
  getPriceBookDetailsForDealerPortal,
  getPriceBookForDealer,
  priceBookFilter,
} from "../../services/dealerServices/priceBookServices";
function DealerPriceBook(props) {
  console.log(props);
  const [dealerPriceBook, setDealerPriceBook] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [priceBookList, setPriceBookList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dealerPriceBookDetail, setDealerPriceBookDetail] = useState({});
  const [error, setError] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const calculateDropdownPosition = (index) => {
    const isCloseToBottom = priceBookList.length - index <= 10000;
    return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
  };
  const status = [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ];
  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
  };

  const routeToEditPage = (value) => {
    localStorage.setItem("menu", "PriceBook");
    console.log(value);
    navigate(`/editDealerBook/${value._id}/${props.id}`);
  };

  const CustomNoDataComponent = () => (
    <div className="text-center my-5">
      <p>No records found.</p>
    </div>
  );

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

  const columns = [
    {
      name: "ID",
      selector: (row) => row.unique_key,
      sortable: true,
      minWidth: "auto", // Set a custom minimum width
      maxWidth: "70px", // Set a custom maximum width
    },
    {
      name: "Name",
      selector: (row) => row?.priceBooks?.name,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row?.priceBooks?.category[0]?.name,
      sortable: true,
    },
    {
      name: "Price Type",
      selector: (row) => row?.priceBooks?.priceType,
      sortable: true,
    },
    {
      name: "Term",
      selector: (row) => row?.priceBooks?.term + " " + "Months",
      sortable: true,
    },
    {
      name: "Retail Cost",
      selector: (row) =>  `$${
        row.retailPrice === undefined
          ? parseInt(0).toLocaleString(2)
          : formatOrderValue(row.retailPrice ?? parseInt(0))}`,
      sortable: true,
    },

    {
      name: "Action",
      minWidth: "auto",
      maxWidth: "100px",
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
                ref={dropdownRef}
                className={`absolute z-[2] w-[80px] justify-center drop-shadow-5xl -right-3 py-1 mt-2 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                  index
                )}`}
              >
                <div
                  className="text-left py-1 px-2 cursor-pointer hover:font-semibold w-full flex justify-start"
                  onClick={() => openView(row._id)}
                >
                  <img src={view} className="w-4 h-4 mr-2" /> View
                </div>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const priceBookData = async () => {
    setLoading(true);
    const result =
      props.flag === "reseller"
        ? await getPriceBookListByResellerId(props.id)
        : await getPriceBookForDealer(props.id);
    setPriceBookList(result.result);
    console.log(result.result);
    setLoading(false);
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

  const [isViewOpen, setIsViewOpen] = useState(false);

  const closeView = () => {
    setIsViewOpen(false);
  };

  const openView = async (id) => {
    const result = await getPriceBookDetailsForDealerPortal(id);
    setDealerPriceBookDetail(result?.result[0]);
    console.log(result);
    setIsViewOpen(true);
  };

  const navigte = useNavigate();

  useEffect(() => {
    
    priceBookData();
  }, [props]);

  useEffect(() => {
    getCategoryListData();
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Close the dropdown if the click is outside of it
        setSelectedAction(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const filterDealerPriceBook = async (values) => {
    if (props.flag === "reseller") {
      values.dealerId = props.dealerId;
    } else {
      values.dealerId = props.id;
    }
    try {
      setLoading(true);
      const res = await priceBookFilter(values);
      if (res.code != 200) {
        setError(res.message);
        setLoading(false);
      } else {
        setLoading(false);
        setError("");
      }
      console.log(res);
      setPriceBookList(res.result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching category list:", error);
    } finally {
      setLoading(false);
    }
  };

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
      filterDealerPriceBook(values);
    },
  });

  const handleFilterIconClick = () => {
    formik.resetForm();
    console.log(formik.values);
    priceBookData();
  };

  return (
    <>
      <div className="my-8">
        <Headbar />
        <div className="flex mt-2">
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9	mb-[3px]">
              Price Book
            </p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
                {" "}
                Price Book{" "}
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-white mt-6 border-[1px] border-[#D1D1D1] rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className="col-span-3 self-center">
              <p className="text-xl font-semibold">Price Book List</p>
            </div>
            <div className="col-span-9">
              <div className="bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                <form onSubmit={formik.handleSubmit}>
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
                        OptionName="Term"
                        color="text-[#1B1D21] opacity-50"
                        className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                        className="!text-[14px]  !bg-[#f7f7f7]"
                        value={formik.values.category}
                        onChange={formik.setFieldValue}
                      />
                    </div>

                    <div className="col-span-2 self-center">
                      <Select
                        name="category"
                        label=""
                        options={categoryList}
                        OptionName="Price Type"
                        color="text-[#1B1D21] opacity-50"
                        className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                        className="!text-[14px]  !bg-[#f7f7f7]"
                        value={formik.values.category}
                        onChange={formik.setFieldValue}
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
                    <div className="col-span-1 self-center flex justify-center">
                      <button type="submit">
                        <img
                          src={Search}
                          className="cursor-pointer	mx-auto "
                          alt="Search"
                        />
                      </button>
                      <Button
                        type="button"
                        className="!bg-transparent !p-0"
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
                data={priceBookList}
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

      <Modal isOpen={isViewOpen} onClose={closeView}>
        <Button
          onClick={closeView}
          className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]"
        >
          <img
            src={Cross}
            className="w-full h-full text-black rounded-full p-0"
          />
        </Button>
        <div className="py-3">
          <p className="text-center text-3xl font-semibold ">
            {dealerPriceBookDetail?.priceBooks?.name}
          </p>
          <Grid className="mt-5 px-6">
          <div className="col-span-4">
              <p className="text-lg text-light-black font-semibold">
                Price Type
              </p>
              <p className="text-base text-neutral-grey font-semibold">
                {dealerPriceBookDetail?.priceBooks?.priceType}
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg text-light-black font-semibold">
                Product Category
              </p>
              <p className="text-base text-neutral-grey font-semibold">
                {dealerPriceBookDetail?.priceBooks?.category[0].name}{" "}
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg text-light-black font-semibold">
                Retail Price
              </p>
              <p className="text-base text-neutral-grey font-semibold">
              ${
        dealerPriceBookDetail?.retailPrice === undefined
          ? parseInt(0).toLocaleString(2)
          : formatOrderValue(dealerPriceBookDetail?.retailPrice ?? parseInt(0))}
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg text-light-black font-semibold">Term</p>
              <p className="text-base text-neutral-grey font-semibold">
                {dealerPriceBookDetail?.priceBooks?.term} Months
              </p>
            </div>
           
            <div className="col-span-8">
              <p className="text-lg text-light-black font-semibold">
                Description
              </p>
              <p className="text-base text-neutral-grey font-semibold">
                {dealerPriceBookDetail?.priceBooks?.category[0].description}
              </p>
            </div>
            {dealerPriceBookDetail?.priceBooks?.priceType == "Flat Pricing" && (
              <>
                <div className="col-span-4">
                  <p className="text-lg text-light-black font-semibold">
                  Start Range 
                  </p>
                  <p className="text-base text-neutral-grey font-semibold">
                    {" "}
                    ${
        dealerPriceBookDetail?.priceBooks?.rangeStart === undefined
          ? parseInt(0).toLocaleString(2)
          : formatOrderValue(dealerPriceBookDetail?.priceBooks?.rangeStart ?? parseInt(0))}
                  </p>
                </div>
                <div className="col-span-4">
                  <p className="text-lg text-light-black font-semibold">
                  End Range 
                  </p>
                  <p className="text-base text-neutral-grey font-semibold">
                  ${
        dealerPriceBookDetail?.priceBooks?.rangeEnd === undefined
          ? parseInt(0).toLocaleString(2)
          : formatOrderValue(dealerPriceBookDetail?.priceBooks?.rangeEnd ?? parseInt(0))}
                
                  </p>
                </div>
              </>
            )}
            {dealerPriceBookDetail?.priceBooks?.priceType ==
              "Quantity Pricing" && (
              <>
                <div className="col-span-12">
                  <table className="w-full border text-center">
                    <tr className="border bg-[#9999]">
                      <th colSpan={"2"}>Quantity Pricing List </th>
                    </tr>
                    <tr className="border bg-[#9999]">
                      <th>Name</th>
                      <th>Max Quantity</th>
                    </tr>
                    {dealerPriceBookDetail?.priceBooks?.quantityPriceDetail
                      .length !== 0 &&
                      dealerPriceBookDetail?.priceBooks?.quantityPriceDetail.map(
                        (item, index) => (
                          <tr key={index} className="border">
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                          </tr>
                        )
                      )}
                  </table>
                </div>
              </>
            )}
          </Grid>
        </div>
      </Modal>
    </>
  );
}

export default DealerPriceBook;
