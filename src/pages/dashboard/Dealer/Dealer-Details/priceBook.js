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
import DataTable from "react-data-table-component";
import {
  editDealerPriceBook,
  getDealerPriceBookByDealerId,
  getFilterPriceBookByDealer,
  getDealerPricebookDetailById,
} from "../../../../services/dealerServices";
import { getCategoryList } from "../../../../services/priceBookService";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import Select from "../../../../common/select";
import { RotateLoader } from "react-spinners";
import * as Yup from "yup";
import Modal from "../../../../common/model";
import { getPriceBookListByResellerId } from "../../../../services/reSellerServices";
function PriceBookList(props) {
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
            name: "Term",
            selector: (row) => row?.priceBooks?.term + " " + "Months",
            sortable: true,
          },
          {
            name: "WholeSale Cost",
            selector: (row) => "$ " + row.wholesalePrice.toFixed(2),
            sortable: true,
          },
          {
            name: "Retail Cost",
            selector: (row) => "$  " + row.retailPrice.toFixed(2),
            sortable: true,
          },
          // {
          //   name: "Status",
          //   selector: (row) => row.status,
          //   sortable: true,

          //   cell: (row) => (
          //     <div className="relative">
          //       <div
          //         className={` ${
          //           row.status === true ? "bg-[#6BD133]" : "bg-[#FF4747]"
          //         } absolute h-3 w-3 rounded-full top-[33%] ml-[8px]`}
          //       ></div>
          //       <select
          //         value={row.status === true ? "active" : "inactive"}
          //         disabled={
          //           row.priceBooks.category[0].status === false ||
          //           row.dealer?.accountStatus === false ||
          //           row.priceBooks?.status === false
          //         }
          //         onChange={(e) => handleStatusChange(row, e.target.value)}
          //         className="text-[12px] border border-gray-300 text-[#727378] rounded pl-[20px] py-2 pr-1 font-semibold rounded-xl"
          //       >
          //         <option value="active">Active</option>
          //         <option value="inactive">Inactive</option>
          //       </select>
          //     </div>
          //   ),
          // },
        ]
      : [
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
            name: "Term",
            selector: (row) => row?.priceBooks?.term + " " + "Months",
            sortable: true,
          },
          {
            name: "WholeSale Cost",
            selector: (row) => "$ " + row.wholesalePrice.toFixed(2),
            sortable: true,
          },
          {
            name: "Retail Cost",
            selector: (row) => "$  " + row.retailPrice.toFixed(2),
            sortable: true,
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
                    row.priceBooks.category[0].status === false ||
                    row.dealer?.accountStatus === false ||
                    row.priceBooks?.status === false
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
            minWidth: "auto", // Set a custom minimum width
            maxWidth: "70px", // Set a custom maximum width
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
                      className={`absolute z-[2] w-[70px] drop-shadow-5xl -right-3 mt-2 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                        index
                      )}`}
                    >
                      {/* <img src={arrowImage} className={`absolute  object-contain left-1/2 w-[12px] ${index%10 === 9 ? 'bottom-[-5px] rotate-180' : 'top-[-5px]'} `} alt='up arror'/> */}
                      <div
                        className="text-center py-3 border-b cursor-pointer"
                        onClick={() => {
                          routeToEditPage(row);
                        }}
                      >
                        Edit
                      </div>
                      <div
                        className="text-center py-3 cursor-pointer"
                        onClick={() => openView(row._id)}
                      >
                        View
                      </div>
                    </div>
                  )}
                </div>
              );
            },
          },
        ];
  // const columns = [
  //   {
  //     name: "ID",
  //     selector: (row) => row.unique_key,
  //     sortable: true,
  //     minWidth: "auto", // Set a custom minimum width
  //     maxWidth: "70px", // Set a custom maximum width
  //   },
  //   {
  //     name: "Name",
  //     selector: (row) => row?.priceBooks?.name,
  //     sortable: true,
  //   },
  //   {
  //     name: "Category",
  //     selector: (row) => row?.priceBooks?.category[0]?.name,
  //     sortable: true,
  //   },
  //   {
  //     name: "Term",
  //     selector: (row) => row?.priceBooks?.term + " " + "Months",
  //     sortable: true,
  //   },
  //   {
  //     name: "WholeSale Cost",
  //     selector: (row) => "$ " + row.wholesalePrice.toFixed(2),
  //     sortable: true,
  //   },
  //   {
  //     name: "Retail Cost",
  //     selector: (row) => "$  " + row.retailPrice.toFixed(2),
  //     sortable: true,
  //   },
  //   {
  //     name: "Status",
  //     selector: (row) => row.status,
  //     sortable: true,

  //     cell: (row) => (
  //       <div className="relative">
  //         <div
  //           className={` ${
  //             row.status === true ? "bg-[#6BD133]" : "bg-[#FF4747]"
  //           } absolute h-3 w-3 rounded-full top-[33%] ml-[8px]`}
  //         ></div>
  //         <select
  //           value={row.status === true ? "active" : "inactive"}
  //           disabled={
  //             row.priceBooks.category[0].status === false ||
  //             row.dealer?.accountStatus === false ||
  //             row.priceBooks?.status === false
  //           }
  //           onChange={(e) => handleStatusChange(row, e.target.value)}
  //           className="text-[12px] border border-gray-300 text-[#727378] rounded pl-[20px] py-2 pr-1 font-semibold rounded-xl"
  //         >
  //           <option value="active">Active</option>
  //           <option value="inactive">Inactive</option>
  //         </select>
  //       </div>
  //     ),
  //   },
  //   {
  //     name: "Action",
  //     minWidth: "auto", // Set a custom minimum width
  //     maxWidth: "70px", // Set a custom maximum width
  //     cell: (row, index) => {
  //       return (
  //         <div className="relative">
  //           <div onClick={() => setSelectedAction(row.unique_key)}>
  //             <img
  //               src={ActiveIcon}
  //               className="cursor-pointer	w-[35px]"
  //               alt="Active Icon"
  //             />
  //           </div>
  //           {selectedAction === row.unique_key && (
  //             <div
  //               ref={dropdownRef}
  //               className={`absolute z-[2] w-[70px] drop-shadow-5xl -right-3 mt-2 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
  //                 index
  //               )}`}
  //             >
  //               {/* <img src={arrowImage} className={`absolute  object-contain left-1/2 w-[12px] ${index%10 === 9 ? 'bottom-[-5px] rotate-180' : 'top-[-5px]'} `} alt='up arror'/> */}
  //               <div
  //                 className="text-center py-3 border-b cursor-pointer"
  //                 onClick={() => {
  //                   routeToEditPage(row);
  //                 }}
  //               >
  //                 Edit
  //               </div>
  //               <div
  //                 className="text-center py-3 cursor-pointer"
  //                 onClick={() => openView(row._id)}
  //               >
  //                 View
  //               </div>
  //             </div>
  //           )}
  //         </div>
  //       );
  //     },
  //   },
  // ];

  const priceBookData = async () => {
    setLoading(true);
    const result =
      props.flag === "reseller"
        ? await getPriceBookListByResellerId(props.id)
        : await getDealerPriceBookByDealerId(props.id);
    setPriceBookList(result.result);
    console.log(result);
    setLoading(false);
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
    setLoading(true);
    if (props.activeTab === "PriceBook") {
      priceBookData();
    }
    setLoading(false);
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
      try {
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
        <div className="bg-white mt-6 border-[1px] border-[#D1D1D1] rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className={` ${props.flag === "reseller" ? ('col-span-6 self-center') : ('col-span-4 self-center') }`}>
              <p className="text-xl font-semibold">Price Book List</p>
            </div>
            <div className={` ${props.flag === "reseller" ? ('col-span-6') : ('col-span-8') }`}>
              <div className="bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                <form onSubmit={formik.handleSubmit}>
                  <Grid className={` ${props.flag === "reseller" ? ('!grid-cols-8') : ('!grid-cols-11')}`}>
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
                    {  props.flag === "reseller" ? (<></>) : ( <div className="col-span-3 self-center">
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
                    </div>)}
                   
                    <div className="col-span-2 self-center flex justify-center">
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
          <div className="mb-5 relative dealer-detail">
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
        <Button
          onClick={() => {
            navigte(`/editCompanyPriceBook/${dealerPriceBookDetail._id}`);
          }}
          className="absolute left-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]"
        >
          <img
            src={Edit}
            className="w-full h-full text-black rounded-full p-0"
          />
        </Button>
        <div className="py-3">
          <p className="text-center text-3xl font-semibold  w-[70%] mx-auto ">
            {dealerPriceBookDetail?.dealer?.name}/
            {dealerPriceBookDetail?.priceBooks?.name}
          </p>
          <Grid className="mt-5 px-6">
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
                Wholesale Price($)
              </p>
              <p className="text-base text-neutral-grey font-semibold">
                ${dealerPriceBookDetail?.wholesalePrice?.toFixed(2)}
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg text-light-black font-semibold">
                Retail Price ($)
              </p>
              <p className="text-base text-neutral-grey font-semibold">
                ${dealerPriceBookDetail?.retailPrice?.toFixed(2)}
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg text-light-black font-semibold">Term</p>
              <p className="text-base text-neutral-grey font-semibold">
                {dealerPriceBookDetail?.priceBooks?.term} Months
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg text-light-black font-semibold">Status</p>
              <p className="text-base text-neutral-grey font-semibold">
                {" "}
                {dealerPriceBookDetail?.priceBooks?.status === true
                  ? "Active"
                  : "UnActive"}
              </p>
            </div>
            <div className="col-span-4">
              <p className="text-lg text-light-black font-semibold">
                Price Type
              </p>
              <p className="text-base text-neutral-grey font-semibold">
                {dealerPriceBookDetail?.priceBooks?.priceType}
              </p>
            </div>
            <div className="col-span-6">
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
                    Range Start
                  </p>
                  <p className="text-base text-neutral-grey font-semibold">
                    {" "}
                    {dealerPriceBookDetail?.priceBooks?.rangeStart?.toFixed(2)}
                  </p>
                </div>
                <div className="col-span-4">
                  <p className="text-lg text-light-black font-semibold">
                    Range End
                  </p>
                  <p className="text-base text-neutral-grey font-semibold">
                    {" "}
                    {dealerPriceBookDetail?.priceBooks?.rangeEnd?.toFixed(2)}
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

export default PriceBookList;
