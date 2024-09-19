import React, { useEffect, useRef, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";
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
import Edit from "../../../assets/images/Dealer/EditIcon.svg";
import Cross from "../../../assets/images/Cross.png";
import view from "../../../assets/images/eye.png";
import edit from "../../../assets/images/edit-text.png";
import DataTable from "react-data-table-component";
import {
  editDealerPriceBook,
  getDealerPriceBook,
  filterGetPriceBookDetails,
  getDealerPricebookDetailById,
} from "../../../services/dealerServices";
import { RotateLoader } from "react-spinners";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getTermList } from "../../../services/dealerServices";
import axios from "axios";
import Modal from "../../../common/model";
import { getCategoryList } from "../../../services/priceBookService";
import Card from "../../../common/card";
const url = process.env.REACT_APP_API_KEY_LOCAL

function DealerPriceList() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedTearm, setSelectedTearm] = useState(false);
  const [dealerPriceBook, setDealerPriceBook] = useState([]);
  const [dealerPriceBookDetail, setDealerPriceBookDetail] = useState({});
  const { dealerName } = useParams();
  const [termList, setTermList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigte = useNavigate();
  const [isViewOpen, setIsViewOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [categoryList, setCategoryList] = useState([]);
  const [isDisapprovedOpen, setIsDisapprovedOpen] = useState(false);
  useEffect(() => {
    // getDealerList();
    getTermListData();
    filterDataGetPriceBook({
      category: "",
      name: dealerName,
      term: "",
      status: "",
    });
    formik.setFieldValue("name", dealerName);
    getCategoryListData();
  }, []);

  const CustomNoDataComponent = () => (
    <div className="text-center my-5">
      <p>No records found.</p>
    </div>
  );
  const pricetype = [
    { label: "Regular Pricing", value: "Regular Pricing" },
    { label: "Flat Pricing", value: "Flat Pricing" },
    { label: "Quantity Pricing", value: "Quantity Pricing" },
  ];
  const handleFilterIconClick = () => {
    formik.resetForm();
    console.log(formik.values);
    // filterDataGetPriceBook();
  };

  const filterDataGetPriceBook = async () => {
    try {
      let data = {
        ...formik.values,
      };
      closeDisapproved();
      setLoading(true);
      const res = await filterGetPriceBookDetails(data);
      setDealerPriceBook(res.result);
    } catch (error) {
      console.error("Error fetching category list:", error);
    } finally {
      setLoading(false);
    }
  };

  // const getDealerList = async () => {
  //   setLoading(true);
  //   const result = await getDealerPriceBook();
  //   setDealerPriceBook(result.result);
  //   console.log(result.result);
  //   setLoading(false);
  // };
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
    const isCloseToBottom = dealerPriceBook.length - index <= 10000;
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

  const handleSelectChange = (name, selectedValue) => {
    formik.setFieldValue(name, selectedValue);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      pName: "",
      dealerName: "",
      dealerSku: "",
      status: "",
      category: "",
      priceType: "",
      term: "",
      range: "",
      coverageType: "",
      dealerSku: "",
    },
    validationSchema: Yup.object({
      name: Yup.string(),
      dealerName: Yup.string(),
      dealerSku: Yup.string(),
      status: Yup.boolean(),
      category: Yup.string(),
      priceType: Yup.string(),
      coverageType: Yup.string(),
      term: Yup.string(),
      range: Yup.string(),
      dealerSku: Yup.string(),
    }),
    onSubmit: (values) => {
      console.log(values);
      filterDataGetPriceBook(values);
    },
  });

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
  const splitLettersWithBreaks = (name) => {
    if (!name) return "";
    return name.split("").join("<br>");
  };

  const columns = [
    {
      name: "Sr.#",
      selector: (row, index) => (1 - 1) * 10 + index + 1,
      sortable: true,
      minWidth: "auto",
      maxWidth: "90px",
    },
    {
      name: (
        <div>
          Dealer
          <br />
          Name
        </div>
      ),
      selector: (row) => row.dealer[0]?.name,
      sortable: true,
      minWidth: "100px",

      style: {
        whiteSpace: "pre-wrap",
        textAlign: "center",
      },
    },
    {
      name: (
        <div>
          Product
          <br />
          SKU
        </div>
      ),
      selector: (row) => row.priceBooks[0]?.name,
      sortable: true,
      minWidth: "130px",
    },
    {
      name:
        <div>
          Dealer
          <br />
          SKU
        </div>
      ,
      selector: (row) => row.dealerSku,
      sortable: true,
      minWidth: "130px",
    },
    {
      name: "Category",
      selector: (row) => row.priceBooks[0]?.category[0]?.name,
      sortable: true,
      minWidth: "120px",
    },
    {
      name: "Term",
      selector: (row) => {
        const months = row.priceBooks[0]?.term;
        if (months) {
          const years = (months / 12);
          return `${years} ${years == 1 ? 'Year' : 'Years'} `;
        }
        return "N/A";
      },
      sortable: true,
      minWidth: "90px",
    },
    {
      name: (
        <div>
          Wholesale <br /> Cost{" "}
        </div>
      ),
      selector: (row) =>
        `$${row?.wholesalePrice === undefined
          ? parseInt(0).toLocaleString(2)
          : formatOrderValue(row?.wholesalePrice ?? parseInt(0))
        } `,
      sortable: true,
      minWidth: "130px",
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
        `$${row?.retailPrice === undefined
          ? parseInt(0).toLocaleString(2)
          : formatOrderValue(row?.retailPrice ?? parseInt(0))
        } `,
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
            className={` ${row.status === true ? "bg-[#6BD133]" : "bg-[#FF4747]"
              } absolute h-3 w-3 rounded-full top-[33%] ml-[8px]`}
          ></div>
          <select
            value={row.status === true ? "active" : "inactive"}
            disabled={
              row.dealer[0]?.accountStatus === false ||
              row.priceBooks[0]?.status === false ||
              row.priceBooks[0]?.category[0]?.status === false
            }
            onChange={(e) => handleStatusChange(row, e.target.value)}
            className="text-[12px] border border-gray-300 text-[#727378] pl-[20px] py-2 pr-1 font-semibold rounded-xl"
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
        return (
          <div className="relative">
            <div
              onClick={() =>
                setSelectedAction(selectedAction === index ? null : index)
              }
            >
              <img
                src={ActiveIcon}
                className="cursor-pointer w-[35px]"
                alt="Active Icon"
              />
            </div>
            {selectedAction === index && (
              <div
                ref={dropdownRef}
                className={`absolute z-[2] w-[80px] drop-shadow-5xl -right-3 mt-2 py-1 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                  index
                )}`}
              >
                <div
                  onClick={() => editScreen(row)}
                  className="text-left cursor-pointer border-b text-black flex hover:font-semibold py-1 px-2"
                >
                  <img src={edit} className="w-4 h-4 mr-2" /> Edit
                </div>
                <div
                  onClick={() => openView(row._id)}
                  className="text-left cursor-pointer text-black flex hover:font-semibold py-1 px-2"
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

  const closeView = () => {
    setIsViewOpen(false);
  };

  const openView = async (id) => {
    setLoading(true);
    try {
      const result = await getDealerPricebookDetailById(id);
      setDealerPriceBookDetail(result.result[0]);
      console.log(result);
      setIsViewOpen(true);
    } catch (error) {
      console.error("Error fetching dealer price book details:", error);
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

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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

  const closeDisapproved = () => {
    setIsDisapprovedOpen(false);
  };
  const openDisapproved = () => {
    setIsDisapprovedOpen(true);
  };

  const coverage = [
    { label: "Breakdown", value: "Breakdown" },
    { label: "Accidental", value: "Accidental" },
    { label: "Breakdown & Accidental", value: "Breakdown & Accidental" },
  ];

  return (
    <>
      <div className="mb-8 ml-3">
        <Headbar />
        <div className="flex mt-2">
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9	mb-[3px]">
              Dealer Book
            </p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/"}>Home </Link> /{" "}
              </li>
              <li className="text-sm text-neutral-grey font-semibold ml-1 pt-[1px]">
                {" "}
                Dealer Book{" "}
              </li>
            </ul>
          </div>
        </div>
        <Link
          to={"/addPriceBook"}
          className=" w-[190px] !bg-white font-semibold py-2 px-4 flex self-center mb-4 rounded-xl ml-auto border-[1px] border-Light-Grey"
        >
          {" "}
          <img src={AddItem} className="self-center" alt="AddItem" />{" "}
          <span className="text-black ml-3 text-[14px] font-Regular">
            Add Dealer Book{" "}
          </span>{" "}
        </Link>

        <Card className="bg-white  border-[1px] border-Light-Grey rounded-xl">
          <Grid className="!px-[26px] !pt-[14px] !pb-0">
            <div className="col-span-3 self-center">
              <p className="text-xl font-semibold py-4">Dealer Price List</p>
            </div>
            <div className="col-span-9">
              <div className="bg-grayf9 rounded-[30px] p-3 border-[1px] border-Light-Grey">
                <form onSubmit={formik.handleSubmit}>
                  <Grid className="!grid-cols-9">
                    <div className="col-span-2 self-center">
                      <Select
                        name="category"
                        type="text"
                        className="!text-[14px] !bg-White-Smoke"
                        className1="!text-[13px] !pt-1 !pb-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
                        label=""
                        options={categoryList}
                        OptionName="Category"
                        placeholder=""
                        value={formik.values.category}
                        onChange={handleSelectChange}
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
                        className="!text-[14px] !bg-White-Smoke"
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
                        color="text-Black-Russian opacity-50"
                        className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                        className="!text-[14px] !bg-White-Smoke"
                        selectedValue={selectedProduct}
                        value={formik.values.status}
                        onChange={handleSelectChange}
                      />
                    </div>
                    <div className="col-span-3 self-center justify-center flex">
                      <Button type="submit" className="!p-2">
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
                        className="!bg-transparent !p-0 mr-3"
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
        <Button
          onClick={() => {
            navigte(`/editDealerBook/${dealerPriceBookDetail._id}`);
          }}
          className="absolute left-[-13px] top-0 h-[80px] w-[80px] !p-[19px] bg-gradient-to-t from-[#575757] to-[#5e5e5e] mt-[-9px] !rounded-full"
        >
          <img
            src={Edit}
            className="w-full h-full text-black rounded-full p-0"
          />
        </Button>
        <div className="py-3">
          <p className="text-center text-3xl font-semibold  w-[70%] mx-auto">
            View Dealer Price Book Detail
          </p>
          <Grid className="mt-5 px-6">
            <div className="col-span-4">
              <p className="text-lg font-semibold">
                Dealer Name
              </p>
              <p className="text-base font-bold">
                {dealerPriceBookDetail?.dealer?.name}{" "}
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg font-semibold">
                Product Name
              </p>
              <p className="text-base font-bold">
                {dealerPriceBookDetail?.priceBooks?.pName}{" "}
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg font-semibold">
                Product Category
              </p>
              <p className="text-base font-bold">
                {dealerPriceBookDetail?.priceBooks?.category[0].name}{" "}
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg font-semibold">
                Price Type
              </p>
              <p className="text-base font-bold">
                {dealerPriceBookDetail?.priceBooks?.priceType}
              </p>
            </div>

            <div className="col-span-8">
              <p className="text-lg font-semibold">
                Description
              </p>
              <p className="text-base font-bold">
                {dealerPriceBookDetail?.priceBooks?.description}
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg  font-semibold">
                Product SKU
              </p>
              <p className="text-base  font-semibold">
                {dealerPriceBookDetail?.priceBooks?.name}
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg  font-semibold">
                Dealer SKU
              </p>
              <p className="text-base  font-semibold">
                {dealerPriceBookDetail?.dealerSku}
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg font-semibold">
                Wholesale Price
              </p>
              <p className="text-base font-semibold">
                $
                {dealerPriceBookDetail?.wholesalePrice === undefined
                  ? parseInt(0).toLocaleString(2)
                  : formatOrderValue(
                    dealerPriceBookDetail?.wholesalePrice ?? parseInt(0)
                  )}
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg font-semibold">
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
              <p className="text-lg font-semibold">Term</p>
              <p className="text-base font-bold">
                {dealerPriceBookDetail?.priceBooks?.term} Months
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg font-semibold">Status</p>
              <p className="text-base font-bold">
                {" "}
                {dealerPriceBookDetail?.status === true ? "Active" : "Inactive"}
              </p>
            </div>

            {dealerPriceBookDetail?.priceBooks?.priceType == "Flat Pricing" && (
              <>
                <div className="col-span-4">
                  <p className="text-lg font-semibold">
                    Start Range
                  </p>
                  <p className="text-base  font-semibold">
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
                  <p className="text-lg font-semibold">
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
            )}
            <div className="col-span-12">
              <table className="w-full border text-center">
                <tr className="border bg-[#9999]">
                  <th>Coverage Type</th>
                  <th>Waiting Days</th>
                  <th>Deductable</th>
                </tr>

                {dealerPriceBookDetail?.adhDays1 && dealerPriceBookDetail?.adhDays1.length > 0 && (
                  <>
                    {dealerPriceBookDetail?.adhDays1.map((type, index) => (
                      <tr key={index} className="border ">
                        <td className="font-semibold  mx-[19px]" >{type.label}</td>
                        <td className="font-semibold  mx-[19px]" >{type.adhValue}</td>
                        <td className="font-semibold  mx-[19px]" >{type.amountType != 'percentage' && '$'}{
                          type.amountType === 'percentage'
                            ? type.adhValue1
                            : (type.adhValue1 === undefined
                              ? (0).toLocaleString(undefined, { minimumFractionDigits: 2 })
                              : formatOrderValue(type.adhValue1 ?? 0)
                            )
                        }
                          {type.amountType == 'percentage' && '%'}</td>
                      </tr>
                    ))}
                  </>
                )}
              </table>

            </div>
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
                  name="name"
                  className="!bg-white"
                  label="Product SKU"
                  placeholder=""
                  value={formik.values.name}
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
                  type="text"
                  name="category"
                  className="!bg-white"
                  label="Category"
                  options={categoryList}
                  OptionName="Category"
                  placeholder=""
                  value={formik.values.category}
                  onChange={formik.setFieldValue}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  name="dealerName"
                  className="!bg-white"
                  label="Dealer Name"
                  placeholder=""
                  value={formik.values.dealerName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
    </>
  );
}

export default DealerPriceList;
