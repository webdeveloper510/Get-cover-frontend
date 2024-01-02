import React, { useEffect, useRef, useState } from "react";
import Button from "../../../../common/button";

import ActiveIcon from "../../../../assets/images/icons/iconAction.svg";
import Search from "../../../../assets/images/icons/SearchIcon.svg";
import clearFilter from "../../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import shorting from "../../../../assets/images/icons/shorting.svg";
import Grid from "../../../../common/grid";
import Input from "../../../../common/input";
import DataTable from "react-data-table-component";
<<<<<<< HEAD
import { getDealerPriceBookByDealerId } from "../../../../services/dealerServices";
import { useNavigate } from "react-router-dom";

=======
import { getDealerPriceBookByDealerId, editDealerPriceBook } from "../../../../services/dealerServices";
>>>>>>> d4af485099b92e7a8e0bcb7dcc76b065dfade3f7
function PriceBookList(props) {
  console.log(props.id);
  const [dealerPriceBook, setDealerPriceBook] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [priceBookList, setPriceBookList] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const calculateDropdownPosition = (index) => {
    const isCloseToBottom = priceBookList.length - index <= 2;
    return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
  };

  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
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

      console.log(result);
    } catch (error) {
      console.error("Error in handleStatusChange:", error);
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
      minWidth: "auto", // Set a custom minimum width
      maxWidth: "70px", // Set a custom maximum width
      cell: (row, index) => {
        // console.log(index, index % 10 == 9)
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
                className={`absolute z-[2] w-[70px] drop-shadow-5xl -right-3 mt-2 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                  index
                )}`}
              >
                {/* <img src={arrowImage} className={`absolute  object-contain left-1/2 w-[12px] ${index%10 === 9 ? 'bottom-[-5px] rotate-180' : 'top-[-5px]'} `} alt='up arror'/> */}
<<<<<<< HEAD
                <div
                  className="text-center py-3"
                  onClick={() => {
                    navigate(`/editCompanyPriceBook/${row.priceBooks._id}`);
                  }}
                >
                  Edit
                </div>
=======
                <div className="text-center py-3 cursor-pointer">Edit</div>
>>>>>>> d4af485099b92e7a8e0bcb7dcc76b065dfade3f7
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const priceBookData = async () => {
    const result = await getDealerPriceBookByDealerId(props.id);
    setPriceBookList(result.result);
    console.log(result.result);
  };
  useEffect(() => {
    priceBookData();
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
      <div className="my-8">
        <div className="bg-white mt-6 border-[1px] border-[#D1D1D1] rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className="col-span-5 self-center">
              <p className="text-xl font-semibold">Price Book List</p>
            </div>
            <div className="col-span-7">
              <div className="bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                <Grid className="!grid-cols-11">
                  <div className="col-span-3 self-center">
                    <Input
                      name="Name"
                      type="text"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="Order ID"
                    />
                  </div>
                  <div className="col-span-3 self-center">
                    <Input
                      name="Email"
                      type="email"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="Dealer Order no."
                    />
                  </div>
                  <div className="col-span-3 self-center">
                    <Input
                      name="PhoneNo."
                      type="text"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="Customer Name"
                    />
                  </div>
                  <div className="col-span-2 self-center flex justify-center">
                    <Button type="submit" className="!p-0 mr-2">
                      <img
                        src={Search}
                        className="cursor-pointer "
                        alt="Search"
                      />
                    </Button>
                    <Button type="submit" className="!bg-transparent !p-0">
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
          <div className="mb-5 relative dealer-detail">
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
              pagination
              paginationPerPage={10}
              paginationComponentOptions={paginationOptions}
              paginationRowsPerPageOptions={[10, 20, 50, 100]}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default PriceBookList;
