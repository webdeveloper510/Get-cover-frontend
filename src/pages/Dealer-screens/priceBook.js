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
import {
  getDealerPricebookDetailById,
  getTermList,
} from "../../services/dealerServices";
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
import { getCategoryAndPriceBooksforDealerPortal } from "../../services/dealerServices/orderListServices";
import Card from "../../common/card";
function DealerPriceBook(props) {
  console.log(props);
  const [dealerPriceBook, setDealerPriceBook] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [priceBookList, setPriceBookList] = useState([]);
  const [isDisapprovedOpen, setIsDisapprovedOpen] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [termList, setTermList] = useState([]);
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
      name: (
        <div>
          Dealer
          <br />
          SKU
        </div>
      ),
      selector: (row) => row?.dealerSku,
      sortable: true,
    },
    {
      name: (
        <div>
          Product
          <br />
          Name
        </div>
      ),
      selector: (row) => row?.priceBooks?.pName,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row?.priceBooks?.category[0]?.name,
      sortable: true,
    },
    {
      name: (
        <div>
          Price <br /> Type{" "}
        </div>
      ),
      selector: (row) => row?.priceBooks?.priceType,
      sortable: true,
    },
    {
      name: "Term",
      selector: (row) => row?.priceBooks?.term + " " + "Months",
      sortable: true,
    },
    {
      name: (
        <div>
          Retail
          <br />
          Cost
        </div>
      ),
      selector: (row) =>
        `$${row.retailPrice === undefined
          ? parseInt(0).toLocaleString(2)
          : formatOrderValue(row.retailPrice ?? parseInt(0))
        }`,
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
                className={`absolute z-[2] w-[80px] justify-center drop-shadow-5xl -right-3 py-1 mt-2 bg-white border text-light-black rounded-lg shadow-md ${calculateDropdownPosition(
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
      const res = await getCategoryAndPriceBooksforDealerPortal();
      let arr = [];
      console.log(res);
      res?.result?.priceCategories.length > 0 &&
        res?.result?.priceCategories?.map((item) => {
          arr.push({ label: item.name, value: item.name });
        });

      setCategoryList(arr);
      console.log(res, "----------------------->>>>>>>>>>>>>");
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

  const getTermListData = async () => {
    try {
      const res = await getTermList();
      console.log(res.result.terms, "==============");
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

  const navigte = useNavigate();
  const pricetype = [
    { label: "Regular Pricing", value: "Regular Pricing" },
    { label: "Flat Pricing", value: "Flat Pricing" },
    { label: "Quantity Pricing", value: "Quantity Pricing" },
  ];
  const coverage = [
    { label: "Breakdown", value: "Breakdown" },
    { label: "Accidental", value: "Accidental" },
    { label: "Breakdown & Accidental", value: "Breakdown & Accidental" },
  ];
  useEffect(() => {
    getTermListData();
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

  const closeDisapproved = () => {
    setIsDisapprovedOpen(false);
  };
  const openDisapproved = () => {
    setIsDisapprovedOpen(true);
  };

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
      dealerSku: "",
      status: "",
      pName: "",
      category: "",
      coverageType: "",
      priceType: "",
      term: "",
      range: "",
      dealerSku: "",
    },
    validationSchema: Yup.object({
      dealerSku: Yup.string(),
      pName: Yup.string(),
      status: Yup.boolean(),
      category: Yup.string(),
      priceType: Yup.string(),
      term: Yup.string(),
      range: Yup.string(),
      dealerSku: Yup.string(),
    }),
    onSubmit: (values) => {
      console.log("Form submitted with values:", values);
      filterDealerPriceBook(values);
      closeDisapproved();
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
              <li className="text-sm text-neutral-grey font-semibold ml-1 pt-[1px]">
                {" "}
                Price Book{" "}
              </li>
            </ul>
          </div>
        </div>
        <Card className="mt-6 border-[1px] border-Light-Grey rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className="col-span-3 self-center">
              <p className="text-xl font-semibold">Price Book List</p>
            </div>
            <div className="col-span-9">
              <div className="bg-grayf9 rounded-[30px] p-3 border-[1px] border-Light-Grey">
                <form onSubmit={formik.handleSubmit}>
                  <Grid className="!grid-cols-9">
                    <div className="col-span-2 self-center">
                      <Input
                        name="pName"
                        type="text"
                        placeholder="Product Name"
                        className="!text-[14px] !bg-White-Smoke"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
                        label=""
                        value={formik.values.pName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    <div className="col-span-2 self-center">
                      <Select
                        name="term"
                        label=""
                        options={termList}
                        OptionName="Term"
                        color="text-Black-Russian opacity-50"
                        className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                        className="!text-[14px]  !bg-White-Smoke"
                        value={formik.values.term}
                        onChange={formik.setFieldValue}
                      />
                    </div>

                    <div className="col-span-2 self-center">
                      <Select
                        name="priceType"
                        label=""
                        options={pricetype}
                        OptionName="Price Type"
                        color="text-Black-Russian opacity-50"
                        className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                        className="!text-[14px]  !bg-White-Smoke"
                        value={formik.values.priceType}
                        onChange={formik.setFieldValue}
                      />
                    </div>
                    <div className="col-span-3 self-center flex justify-center">
                      <Button type="submit" className="!p-2">
                        <img
                          src={Search}
                          className="cursor-pointer	mx-auto "
                          alt="Search"
                        />
                      </Button>
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
                draggableColumns={false}
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
        </Card>
      </div>

      <Modal isOpen={isViewOpen} onClose={closeView}>
        <Button
          onClick={closeView}
          className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-Granite-Gray"
        >
          <img
            src={Cross}
            className="w-full h-full text-black rounded-full p-0"
          />
        </Button>
        <div className="py-3">
          <p className="text-center text-3xl font-semibold ">

          </p>
          <Grid className="mt-5 px-6">
            <div className="col-span-4">
              <p className="text-lg font-bold">
                Product Name
              </p>
              <p className="text-base font-semibold">
                {dealerPriceBookDetail?.priceBooks?.pName}
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg font-bold">
                Product SKU
              </p>
              <p className="text-base font-semibold">
                {dealerPriceBookDetail?.priceBooks?.name}
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg font-bold">
                Dealer SKU
              </p>
              <p className="text-base font-semibold">
                {dealerPriceBookDetail?.dealerSku}
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg font-bold">
                Price Type
              </p>
              <p className="text-base font-semibold">
                {dealerPriceBookDetail?.priceBooks?.priceType}
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg font-bold">
                Product Category
              </p>
              <p className="text-base font-semibold">
                {dealerPriceBookDetail?.priceBooks?.category[0].name}{" "}
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg text-light-black font-semibold">
                Product SKU
              </p>
              <p className="text-base text-neutral-grey font-semibold">
                {dealerPriceBookDetail?.priceBooks?.pName}{" "}
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg text-light-black font-semibold">
                Retail Price
              </p>
              <p className="text-base font-semibold">
                $
                {dealerPriceBookDetail?.retailPrice === undefined
                  ? parseInt(0).toLocaleString(2)
                  : formatOrderValue(
                    dealerPriceBookDetail?.retailPrice ?? parseInt(0)
                  )}
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg font-bold">Term</p>
              <p className="text-base font-semibold">
                {dealerPriceBookDetail?.priceBooks?.term} Months
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg font-bold">
                Coverage Type
              </p>
              <p className="text-base font-semibold">
                {dealerPriceBookDetail?.priceBooks?.coverageType}{" "}
              </p>
            </div>
            <div className="col-span-12">
              <p className="text-lg font-bold">
                Description
              </p>
              <p className="text-base font-semibold">
                {dealerPriceBookDetail?.priceBooks?.category[0].description}
              </p>
            </div>

            {
              dealerPriceBookDetail?.priceBooks?.priceType == "Flat Pricing" && (
                <>
                  <div className="col-span-4">
                    <p className="text-lg font-bold">
                      Start Range
                    </p>
                    <p className="text-base font-semibold">
                      {" "}
                      $
                      {dealerPriceBookDetail?.priceBooks?.rangeStart === undefined
                        ? parseInt(0).toLocaleString(2)
                        : formatOrderValue(
                          dealerPriceBookDetail?.priceBooks?.rangeStart ??
                          parseInt(0)
                        )}
                    </p>
                  </div>
                  <div className="col-span-4">
                    <p className="text-lg font-bold">
                      End Range
                    </p>
                    <p className="text-base font-semibold">
                      $
                      {dealerPriceBookDetail?.priceBooks?.rangeEnd === undefined
                        ? parseInt(0).toLocaleString(2)
                        : formatOrderValue(
                          dealerPriceBookDetail?.priceBooks?.rangeEnd ??
                          parseInt(0)
                        )}
                    </p>
                  </div>
                </>
              )
            }
            {
              dealerPriceBookDetail?.priceBooks?.priceType ==
              "Quantity Pricing" && (
                <>
                  <div className="col-span-12">
                    <table className="w-full border text-center">
                      <tr className="border bg-[#9999]">
                        <th colSpan={"2"}>Quantity Pricing List </th>
                      </tr>
                      <tr className="border bg-[#9999]">
                        <th className="w-[50%]">Name</th>
                        <th className="w-[50%]">Max Quantity</th>
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
              )
            }
          </Grid >
        </div >
      </Modal >

      <Modal isOpen={isDisapprovedOpen} onClose={closeDisapproved}>
        <Button
          onClick={closeDisapproved}
          className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-Granite-Gray"
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
                  name="dealerSku"
                  className="!bg-white"
                  label="Dealer SKU"
                  placeholder=""
                  value={formik.values.dealerSku}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div className="col-span-6">
                <Input
                  type="text"
                  name="pName"
                  className="!bg-white"
                  label="Product Name"
                  placeholder=""
                  value={formik.values.pName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="col-span-6">
                <Select
                  name="coverageType"
                  label="Coverage Type"
                  options={coverage}
                  OptionName="Coverage Type"
                  color="text-Black-Russian opacity-50"
                  className="!text-[14px] !bg-white"
                  value={formik.values.coverageType}
                  onChange={formik.setFieldValue}
                />
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  name="category"
                  className="!bg-white"
                  label="Category"
                  placeholder=""
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {/* <Select
                        name="category"
                        label="Category"
                        options={categoryList}
                        OptionName="Category"
                        color="text-Black-Russian opacity-50"
                        className="!text-[14px] !bg-white"
                        value={formik.values.category}
                        onChange={formik.setFieldValue}
                      /> */}
              </div>
              <div className="col-span-6">
                <Select
                  name="priceType"
                  label="Price Type"
                  options={pricetype}
                  OptionName="Price Type"
                  color="text-Black-Russian opacity-50"
                  className="!text-[14px] !bg-white"
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
                  color="text-Black-Russian opacity-50"
                  className="!text-[14px] !bg-white"
                  value={formik.values.term}
                  onChange={formik.setFieldValue}
                />
              </div>
              {formik.values.priceType == "Flat Pricing" && (
                <div className="col-span-6">
                  <Input
                    type="text"
                    name="range"
                    className="!bg-white"
                    label="Product Retail Price"
                    placeholder=""
                    value={formik.values.range}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
              )}

              {/* <div className="col-span-6">
                  <Select
                        name="status"
                        label="Status"
                        options={status}
                        OptionName="Status"
                        color="text-Black-Russian opacity-50"
                        // className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                        className="!text-[14px] !bg-white"
                        value={formik.values.status}
                        onChange={formik.setFieldValue}
                    />
                  </div> */}
              <div className="col-span-12">
                <Button type="submit" className={"w-full"}>
                  Search
                </Button>
              </div>
            </Grid>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default DealerPriceBook;
