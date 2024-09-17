import React, { useEffect, useRef, useState } from "react";
import Button from "../../common/button";

import ActiveIcon from "../../assets/images/icons/iconAction.svg";
import Search from "../../assets/images/icons/SearchIcon.svg";
import clearFilter from "../../assets/images/icons/Clear-Filter-Icon-White.svg";
import shorting from "../../assets/images/icons/shorting.svg";
import Grid from "../../common/grid";
import Input from "../../common/input";
import Cross from "../../assets/images/Cross.png";
import DataTable from "react-data-table-component";
import { getDealerPricebookDetailById } from "../../services/dealerServices";
import { getCategoryList, getTermList } from "../../services/priceBookService";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import Select from "../../common/select";
import { RotateLoader } from "react-spinners";
import * as Yup from "yup";
import Modal from "../../common/model";
import {
  getPriceBookListByResellerId,
  getResellerPortalPriceBook,
} from "../../services/reSellerServices";
import view from "../../assets/images/eye.png";
import Headbar from "../../common/headBar";
import {
  getPriceBookDetailsForDealerPortal,
  getPriceBookForDealer,
  priceBookFilter,
} from "../../services/dealerServices/priceBookServices";
import Card from "../../common/card";
function ResellerPriceBook(props) {
  console.log(props);
  const [dealerPriceBook, setDealerPriceBook] = useState();
  const [selectedAction, setSelectedAction] = useState(null);
  const [priceBookList, setPriceBookList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const calculateDropdownPosition = (index) => {
    const isCloseToBottom = priceBookList.length - index <= 10000;
    return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
  };
  const [termList, setTermList] = useState([]);
  const [isDisapprovedOpen, setIsDisapprovedOpen] = useState(false);
  const status = [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ];
  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
  };

  const pricetype = [
    { label: "Regular Pricing", value: "Regular Pricing" },
    { label: "Flat Pricing", value: "Flat Pricing" },
    { label: "Quantity Pricing", value: "Quantity Pricing" },
  ];

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
  const [isViewOpen, setIsViewOpen] = useState(false);

  const closeView = () => {
    setIsViewOpen(false);
  };
  const openView = async (id) => {
    setLoading(true);
    try {
      const result = await getPriceBookDetailsForDealerPortal(id);
      if (
        result?.result &&
        Array.isArray(result.result) &&
        result.result.length > 0
      ) {
        setDealerPriceBook(result.result[0]);
      }
      setIsViewOpen(true);
    } catch (error) {
      console.error("Error fetching price book details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSelectedAction(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const columns = [
    {
      name: "ID",
      selector: (row) => row.priceBooks.unique_key,
      sortable: true,
      minWidth: "auto",
      maxWidth: "70px",
    },
    {
      name: (
        <div>
          Dealer <br />
          SKU
        </div>
      ),
      selector: (row) => row?.dealerSku,
      sortable: true,
    },
    {
      name: (
        <div>
          Product <br />
          Name
        </div>
      ),
      selector: (row) => row?.priceBooks?.pName,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row?.priceBooks?.category?.[0]?.name,
      sortable: true,
    },
    {
      name: "Term",
      selector: (row) => {
        const months = row.priceBooks?.term;
        if (months) {
          const years = (months / 12);
          return `${years} ${years == 1 ? 'Year' : 'Years'} `;
        }
        return "N/A";
      },
      sortable: true,
    },
    // {
    //   name: "WholeSale Cost",
    //   selector: (row) => `$${row.wholesalePrice.toFixed(2)} `,
    //   sortable: true,
    // },
    {
      name: (
        <div>
          Retail <br />
          Cost
        </div>
      ),
      selector: (row) => `$${row.retailPrice.toFixed(2)} `,
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
                className={`absolute z-[2] w-[80px] justify-center drop-shadow-5xl -right-3 py-1 mt-2 bg-white border rounded-lg text-light-black shadow-md ${calculateDropdownPosition(
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
  useEffect(() => {
    priceBookData();
    getTermListData();
    getCategoryListData();
  }, []);

  const handleFilterIconClick = () => {
    formik.resetForm();
    priceBookData({
      name: "",
      status: "",
      pName: "",
      category: "",
      coverageType: "",
      priceType: "",
      term: "",
      range: "",
    });
  };

  const priceBookData = async (
    data = {
      name: "",
      status: "",
      pName: "",
      category: "",
      coverageType: "",
      priceType: "",
      term: "",
      range: "",
    }
  ) => {
    setLoading(true);

    const result = await getResellerPortalPriceBook(data);
    setPriceBookList(result.result);
    console.log(result.result);
    setLoading(false);
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
    } catch (error) {
      setLoading(false);
      console.error("Error fetching category list:", error);
    } finally {
      setLoading(false);
    }
  };

  const coverage = [
    { label: "Breakdown", value: "Breakdown" },
    { label: "Accidental", value: "Accidental" },
    { label: "Breakdown & Accidental", value: "Breakdown & Accidental" },
  ];
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
      status: Yup.boolean(),
      category: Yup.string(),
      dealerSku: Yup.string(),
    }),
    onSubmit: (values) => {
      closeDisapproved();
      console.log("Form submitted with values:", values);
      priceBookData(values);
    },
  });
  const closeDisapproved = () => {
    setIsDisapprovedOpen(false);
  };
  const openDisapproved = () => {
    setIsDisapprovedOpen(true);
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
            <div className="col-span-4 self-center">
              <p className="text-xl font-semibold">Price Book List</p>
            </div>
            <div className="col-span-8">
              <div className="bg-grayf9 rounded-[30px] p-3 border-[1px] border-Light-Grey">
                <form onSubmit={formik.handleSubmit}>
                  <Grid className="!grid-cols-10">
                    <div className="col-span-3 self-center">
                      <Input
                        name="dealerSku"
                        type="text"
                        placeholder="Dealer SKU"
                        className="!text-[14px] !bg-White-Smoke"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
                        label=""
                        value={formik.values.dealerSku}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>

                    <div className="col-span-3 self-center">
                      <Input
                        name="category"
                        type="text"
                        placeholder="Category"
                        className="!text-[14px] !bg-White-Smoke"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
                        label=""
                        value={formik.values.category}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    <div className="col-span-4 self-center flex justify-center">
                      <Button type="submit" className="!p-2">
                        <img
                          src={Search}
                          className="cursor-pointer	mx-auto "
                          alt="Search"
                        />
                      </Button>
                      <Button
                        type="button"
                        className="!bg-transparent !p-0 mr-4"
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
          <div className="mb-5 relative dealer-detail">
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
            {dealerPriceBook?.priceBooks?.name}
          </p>
          <Grid className="mt-5 px-6">
            <div className="col-span-4">
              <p className="text-lg font-bold">
                Product Name
              </p>
              <p className="text-base font-semibold">
                {dealerPriceBook?.priceBooks?.pName}
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg font-bold">
                Price Type
              </p>
              <p className="text-base font-semibold">
                {dealerPriceBook?.priceBooks?.priceType}
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg font-bold">
                Product Category
              </p>
              <p className="text-base font-semibold">
                {dealerPriceBook?.priceBooks?.category[0].name}{" "}
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg font-bold">
                Retail Price
              </p>
              <p className="text-base font-semibold">
                $
                {dealerPriceBook?.retailPrice === undefined
                  ? parseInt(0).toLocaleString(2)
                  : formatOrderValue(
                    dealerPriceBook?.retailPrice ?? parseInt(0)
                  )}
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg font-bold">Term</p>
              <p className="text-base font-semibold">
                {dealerPriceBook?.priceBooks?.term} Months
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg font-bold">
                Coverage Type
              </p>
              <p className="text-base font-semibold">
                {dealerPriceBook?.priceBooks?.coverageType}{" "}
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg font-semibold">
                Dealer SKU
              </p>
              <p className="text-base font-semibold">
                {dealerPriceBook?.dealerSku}
              </p>
            </div>
            <div className="col-span-8">
              <p className="text-lg font-bold">
                Description
              </p>
              <p className="text-base font-semibold">
                {dealerPriceBook?.priceBooks?.category[0].description}
              </p>
            </div>

            {dealerPriceBook?.priceBooks?.priceType == "Flat Pricing" && (
              <>
                <div className="col-span-4">
                  <p className="text-lg font-bold">
                    Start Range
                  </p>
                  <p className="text-base font-semibold">
                    {" "}
                    $
                    {dealerPriceBook?.priceBooks?.rangeStart === undefined
                      ? parseInt(0).toLocaleString(2)
                      : formatOrderValue(
                        dealerPriceBook?.priceBooks?.rangeStart ?? parseInt(0)
                      )}
                  </p>
                </div>
                <div className="col-span-4">
                  <p className="text-lg font-bold">
                    End Range
                  </p>
                  <p className="text-base font-semibold">
                    $
                    {dealerPriceBook?.priceBooks?.rangeEnd === undefined
                      ? parseInt(0).toLocaleString(2)
                      : formatOrderValue(
                        dealerPriceBook?.priceBooks?.rangeEnd ?? parseInt(0)
                      )}
                  </p>
                </div>
              </>
            )}


            {dealerPriceBook?.priceBooks?.priceType == "Quantity Pricing" && (
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
                    {dealerPriceBook?.priceBooks?.quantityPriceDetail.length !==
                      0 &&
                      dealerPriceBook?.priceBooks?.quantityPriceDetail.map(
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

export default ResellerPriceBook;
