import React, { useEffect, useRef, useState } from "react";
import Button from "../../../../common/button";

import ActiveIcon from "../../../../assets/images/icons/iconAction.svg";
import Search from "../../../../assets/images/icons/SearchIcon.svg";
import clearFilter from "../../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import shorting from "../../../../assets/images/icons/shorting.svg";
import Grid from "../../../../common/grid";
import Input from "../../../../common/input";
import Edit from "../../../../assets/images/Dealer/EditIcon.svg";
import Cross from "../../../../assets/images/Cross.png";
import view from "../../../../assets/images/eye.png";
import edit from "../../../../assets/images/edit-text.png";
import DataTable from "react-data-table-component";
import {
  editDealerPriceBook,
  getDealerPriceBookByDealerId,
  getFilterPriceBookByDealer,
  getDealerPricebookDetailById,
} from "../../../../services/dealerServices";
import {
  getCategoryList,
  getTermList,
} from "../../../../services/priceBookService";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import Select from "../../../../common/select";
import { RotateLoader } from "react-spinners";
import * as Yup from "yup";
import Modal from "../../../../common/model";
import { getPriceBookListByResellerId } from "../../../../services/reSellerServices";
import Card from "../../../../common/card";
function PriceBookList(props) {
  console.log(props);
  const [dealerPriceBook, setDealerPriceBook] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [priceBookList, setPriceBookList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [dealerPriceBookDetail, setDealerPriceBookDetail] = useState({});
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

  const pricetype = [
    { label: "Regular Pricing", value: "Regular Pricing" },
    { label: "Flat Pricing", value: "Flat Pricing" },
    { label: "Quantity Pricing", value: "Quantity Pricing" },
  ];

  const handleStatusChange = async (row, newStatus) => {
    try {
      setPriceBookList((prevDealerPriceBook) => {
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

      console.log(result);
    } catch (error) {
      console.error("Error in handleStatusChange:", error);
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

  const columns =
    props.flag === "reseller"
      ? [
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
              SKU
            </div>
          ),
          selector: (row) => row?.priceBooks?.name,
          sortable: true,
        },
        {
          name: "Category",
          selector: (row) => row?.priceBooks?.category[0]?.name,
          sortable: true,
        },
        {
          name: "Term",
          selector: (row) => {
            const months = row.priceBooks?.term;
            if (months) {
              const years = months / 12;
              return `${years} ${years == 1 ? "Year" : "Years"} `;
            }
            return "N/A";
          },
          sortable: true,
        },
        {
          name: "WholeSale Cost",
          selector: (row) =>
            `$${row?.wholesalePrice === undefined
              ? parseInt(0).toLocaleString(2)
              : formatOrderValue(row?.wholesalePrice ?? parseInt(0))
            }`,
          sortable: true,
        },
        {
          name: "Retail Cost",
          selector: (row) =>
            `$${row?.retailPrice === undefined
              ? parseInt(0).toLocaleString(2)
              : formatOrderValue(row?.retailPrice ?? parseInt(0))
            }`,
          sortable: true,
        },
      ]
      : [
        {
          name: "Sr.#",
          selector: (row, index) => index + 1,
          sortable: true,
          minWidth: "auto",
          maxWidth: "90px",
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
              SKU
            </div>
          ),
          selector: (row) => row?.priceBooks?.name,
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
          name: "Term",
          selector: (row) => {
            const months = row.priceBooks?.term;
            if (months) {
              const years = months / 12;
              return `${years} ${years == 1 ? "Year" : "Years"} `;
            }
            return "N/A";
          },
          sortable: true,
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
              : formatOrderValue(row?.wholesalePrice)
            }`,
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
            `$${row?.retailPrice === undefined
              ? parseInt(0).toLocaleString(2)
              : formatOrderValue(row?.retailPrice)
            }`,
          sortable: true,
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
                  row.priceBooks.category[0].status === false ||
                  row.dealer?.accountStatus === false ||
                  row.priceBooks?.status === false
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
          minWidth: "auto", // Set a custom minimum width
          maxWidth: "70px", // Set a custom maximum width
          cell: (row, index) => {
            return (
              <div className="relative">
                <div onClick={() => setSelectedAction(row._id)}>
                  <img
                    src={ActiveIcon}
                    className="cursor-pointer	w-[35px]"
                    alt="Active Icon"
                  />
                </div>
                {selectedAction === row._id && (
                  <div
                    ref={dropdownRef}
                    className={`absolute z-[2] w-[70px] drop-shadow-5xl -right-3 mt-2 py-1 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                      index
                    )}`}
                  >
                    {/* <img src={arrowImage} className={`absolute  object-contain left-1/2 w-[12px] ${index%10 === 9 ? 'bottom-[-5px] rotate-180' : 'top-[-5px]'} `} alt='up arror'/> */}
                    <div
                      onClick={() => {
                        routeToEditPage(row);
                      }}
                      className="text-left cursor-pointer flex border-b hover:font-semibold py-1 px-2"
                    >
                      <img src={edit} className="w-4 h-4 mr-2" /> Edit
                    </div>
                    <div
                      onClick={() => openView(row._id)}
                      className="text-left cursor-pointer flex hover:font-semibold py-1 px-2"
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

  const coverage = [
    { label: "Breakdown", value: "Breakdown" },
    { label: "Accidental", value: "Accidental" },
    { label: "Breakdown & Accidental", value: "Breakdown & Accidental" },
  ];

  const priceBookData = async () => {
    setLoading1(true);
    let data = {
      ...formik.values,
    };
    const result =
      props.flag === "reseller"
        ? await getPriceBookListByResellerId(props.id, data)
        : await getDealerPriceBookByDealerId(props.id);
    setPriceBookList(result.result);
    console.log(result);
    setLoading1(false);
  };

  const getCategoryListData = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  const [isViewOpen, setIsViewOpen] = useState(false);

  const closeView = () => {
    setIsViewOpen(false);
  };

  const openView = async (id) => {
    const result = await getDealerPricebookDetailById(id);
    setDealerPriceBookDetail(result.result[0]);
    console.log(result);
    setIsViewOpen(true);
  };
  const navigte = useNavigate();
  useEffect(() => {
    if (props.activeTab === "PriceBook") {
      priceBookData();
    }
  }, [props]);
  useEffect(() => {
    getTermListData();
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
      try {
        closeDisapproved();
        setLoading(true);
        const res = await getPriceBookListByResellerId(props.id, values);
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
    } else {
      values.dealerId = props.id;
      try {
        setLoading(true);
        const res = await getFilterPriceBookByDealer(values);
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
    }
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      pName: "",
      status: "",
      dealerSku: "",
      category: "",
      priceType: "",
      coverageType: "",
      term: "",
      range: "",
      dealerSku: "",
    },
    validationSchema: Yup.object({
      name: Yup.string(),
      pName: Yup.string(),
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
      console.log("Form submitted with values:", values);
      filterDealerPriceBook(values);
      setIsDisapprovedOpen(false);
    },
  });

  const handleFilterIconClick = () => {
    formik.resetForm();
  };

  useEffect(() => {
    if (
      JSON.stringify(formik.values) === JSON.stringify(formik.initialValues)
    ) {
      console.log(formik.values, "======");
      priceBookData();
    }
  }, [formik.values]);

  const getTermListData = async () => {
    try {
      const res = await getTermList();
      console.log(res.result.terms, "===========");
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

  const closeDisapproved = () => {
    setIsDisapprovedOpen(false);
  };
  const openDisapproved = () => {
    setIsDisapprovedOpen(true);
  };
  return (
    <>
      <div className="my-8">
        <Card className="bg-white mt-6 border-[1px] border-Light-Grey rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div
              className={` ${props.flag === "reseller"
                  ? "col-span-4 self-center"
                  : "col-span-3 self-center"
                }`}
            >
              <p className="text-xl font-semibold">Price Book List</p>
            </div>
            <div
              className={` ${props.flag === "reseller" ? "col-span-8" : "col-span-9"
                }`}
            >
              <div className="bg-grayf9 rounded-[30px] p-3 border-[1px] border-Light-Grey">
                <form onSubmit={formik.handleSubmit}>
                  <Grid
                    className={` ${props.flag === "reseller"
                        ? "!grid-cols-10"
                        : "!grid-cols-10"
                      }`}
                  >
                    <div
                      className={`${props.flag === "reseller"
                          ? "col-span-3 self-center"
                          : "col-span-3 self-center"
                        }`}
                    >
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

                    <div
                      className={`${props.flag === "reseller"
                          ? "col-span-3 self-center"
                          : "col-span-3 self-center"
                        }`}
                    >
                      <Select
                        name="category"
                        label=""
                        options={categoryList}
                        OptionName="Category"
                        color="text-Black-Russian opacity-50"
                        className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                        className="!text-[14px]  !bg-White-Smoke"
                        value={formik.values.category}
                        onChange={formik.setFieldValue}
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
                        className="!bg-transparent !p-0 mr-3"
                        onClick={() => handleFilterIconClick()}
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
            {loading || loading1 ? (
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
                draggableColumns={false}
                sortIcon={
                  <>
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

      <Modal className="!w-[900px]" isOpen={isViewOpen} onClose={closeView}>
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
          onClick={()=>{
            routeToEditPage(dealerPriceBookDetail)
          }}
          className="absolute left-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-gradient-to-r !from-[#424242] !to-[#5c5c5c]"
        >
          <img
            src={Edit}
            className="w-full h-full text-black rounded-full p-0"
          />
        </Button>
        <div className="py-3">
          <p className="text-center text-3xl font-semibold  w-[70%] mx-auto">
            View Dealer Price Book Details
          </p>
          <div className="overflow-y-scroll max-h-[500px]">
            <Grid className="mt-5 px-6">
              <div className="col-span-4">
                <p className="text-lg  font-semibold">Product Category</p>
                <p className="text-base font-bold">
                  {dealerPriceBookDetail?.priceBooks?.category[0].name}{" "}
                </p>
              </div>
              <div className="col-span-4">
                <p className="text-lg font-semibold">Wholesale Price</p>
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
                <p className="text-lg font-semibold">Retail Price</p>
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
                  {dealerPriceBookDetail?.priceBooks?.status === true
                    ? "Active"
                    : "UnActive"}
                </p>
              </div>
              <div className="col-span-4">
                <p className="text-lg font-semibold">Price Type</p>
                <p className="text-base font-bold">
                  {dealerPriceBookDetail?.priceBooks?.priceType}
                </p>
              </div>
              <div className="col-span-4">
                <p className="text-lg font-semibold">Product SKU</p>
                <p className="text-base font-semibold">
                  {dealerPriceBookDetail?.priceBooks?.name}
                </p>
              </div>

              <div className="col-span-8">
                <p className="text-lg font-semibold">Description</p>
                <p className="text-base font-bold">
                  {dealerPriceBookDetail?.priceBooks?.category[0].description}
                </p>
              </div>

              {dealerPriceBookDetail?.priceBooks?.priceType ==
                "Flat Pricing" && (
                  <>
                    <div className="col-span-4">
                      <p className="text-lg font-semibold">Start Range</p>
                      <p className="text-base font-semibold">
                        {" "}
                        $
                        {dealerPriceBookDetail?.priceBooks?.rangeStart ===
                          undefined
                          ? parseInt(0).toLocaleString(2)
                          : formatOrderValue(
                            dealerPriceBookDetail?.priceBooks?.rangeStart ??
                            parseInt(0)
                          )}
                      </p>
                    </div>
                    <div className="col-span-4">
                      <p className="text-lg  font-semibold">End Range</p>
                      <p className="text-base  font-semibold">
                        $
                        {dealerPriceBookDetail?.priceBooks?.rangeEnd === undefined
                          ? parseInt(0).toLocaleString(2)
                          : formatOrderValue(
                            dealerPriceBookDetail?.priceBooks?.rangeEnd ??
                            parseInt(0)
                          )}
                      </p>
                    </div>
                    <div className="col-span-4"></div>
                  </>
                )}
              <div className="col-span-4">
                <p className="text-base mb-3 font-semibold">
                  # of Claims Over the Certain <br /> Period
                </p>
                <p className="text-[14px] font-semibold">
                  {dealerPriceBookDetail?.noOfClaim?.period} -{" "}
                  {dealerPriceBookDetail?.noOfClaim?.value == -1
                    ? "Unlimited"
                    : dealerPriceBookDetail?.noOfClaim?.value}
                </p>
              </div>
              <div className="col-span-4">
                <p className="text-base mb-3 font-semibold">
                  # of Claims in Coverage <br /> Period
                </p>
                <p className="text-[14px] font-semibold">
                  {dealerPriceBookDetail?.noOfClaimPerPeriod == -1
                    ? "Unlimited"
                    : dealerPriceBookDetail?.noOfClaimPerPeriod}
                </p>
              </div>
              <div className="col-span-4">
                <p className=" text-base mb-3 font-semibold">
                  {" "}
                  Is Include manufacturer <br /> warranty?
                </p>
                <p className="text-[14px] font-semibold">
                  {dealerPriceBookDetail?.isManufacturerWarranty == true
                    ? "Yes"
                    : "No"}
                </p>
              </div>
              <div className="col-span-12">
                <table className="w-full border text-center">
                  <tr className="border bg-[#9999]">
                    <th>Coverage Type</th>
                    <th>Waiting Days</th>
                    <th>Deductible</th>
                  </tr>

                  {dealerPriceBookDetail?.adhDays1 &&
                    dealerPriceBookDetail?.adhDays1.length > 0 && (
                      <>
                        {dealerPriceBookDetail?.adhDays1.map((type, index) => (
                          <tr key={index} className="border ">
                            <td className="font-semibold  mx-[19px]">
                              {type.label}
                            </td>
                            <td className="font-semibold  mx-[19px]">
                              {type.waitingDays}
                            </td>
                            <td className="font-semibold  mx-[19px]">
                              {type.amountType != "percentage" && "$"}
                              {type.amountType === "percentage"
                                ? type.deductible
                                : type.deductible === undefined
                                  ? (0).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                  })
                                  : formatOrderValue(type.deductible ?? 0)}
                              {type.amountType == "percentage" && "%"}
                            </td>
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
          </div>
        </div>
      </Modal>

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

export default PriceBookList;
