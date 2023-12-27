import React, { useEffect, useState } from "react";

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
import clearFilter from "../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import Select from "../../../common/select";
import DataTable from "react-data-table-component";
import { getDealerPriceBook } from "../../../services/dealerServices";

function DealerPriceList() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedTearm, setSelectedTearm] = useState(false);
  const [dealerPriceBook, setDealerPriceBook] = useState([]);
  const navigte = useNavigate();

  const handleActionChange = (action) => {
    console.log(`Selected action: ${action}`);
  };
  const handleSelectChange1 = (name, value) => {
    setSelectedProduct(value);
  };

  const handleSelectChange = (name, value) => {
    setSelectedTearm(value);
  };

  useEffect(() => {
    getDealerList();
  }, []);

  const getDealerList = async () => {
    const result = await getDealerPriceBook();
    setDealerPriceBook(result.result);
    console.log(result.result);
  };
  const country = [
    { label: "Country", value: "country" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ];

  const status = [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ];

  const calculateDropdownPosition = (index) => {
    const isCloseToBottom = 10 - index <= 2;
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
    },
    {
      name: "Product Name",
      selector: (row) => row.priceBooks[0]?.name,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Product Category",
      selector: (row) => row.priceBooks[0]?.category[0]?.name,
      sortable: true,
      minWidth: "180px",
    },
    {
      name: "Term",
      selector: (row) => row.priceBooks[0]?.term + " Months",
      sortable: true,
      minWidth: "90px",
    },
    {
      name: "WholeSale Cost",
      selector: (row) => "$" + row?.wholesalePrice?.toFixed(2),
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Retail Cost",
      selector: (row) => "$" + row?.retailPrice?.toFixed(2),
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
            // onChange={(e) => handleStatusChange(row, e.target.value)}
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
            <div onClick={() => setSelectedAction(index)}>
              <img
                src={ActiveIcon}
                className="cursor-pointer	w-[35px]"
                alt="Active Icon"
              />
            </div>
            {selectedAction === index && (
              <div
                className={`absolute z-[2] w-[80px] drop-shadow-5xl -right-3 mt-2 p-2 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                  index
                )}`}
              >
                {/* <img
                  src={arrowImage}
                  className={`absolute  object-contain left-1/2 w-[12px] ${
                    index % 10 === 9 ? "bottom-[-5px] rotate-180" : "top-[-5px]"
                  } `}
                  alt="up arror"
                /> */}
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
        <Button className="!bg-white flex self-center mb-4 rounded-xl ml-auto border-[1px] border-[#D1D1D1]">
          {" "}
          <Link to={"/addDealerBook"} className="flex">
            {" "}
            <img src={AddItem} className="self-center" alt="AddItem" />{" "}
            <span className="text-black ml-3 text-[14px] font-Regular">
              Add Dealer Book{" "}
            </span>{" "}
          </Link>
        </Button>

        <div className="bg-white  border-[1px] border-[#D1D1D1] rounded-xl">
          <Grid className="!px-[26px] !pt-[14px] !pb-0">
            <div className="col-span-5 self-center">
              <p className="text-xl font-semibold">Dealer Price List</p>
            </div>
            <div className="col-span-7">
              <div className="bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                <Grid className="!grid-cols-10">
                  <div className="col-span-2 self-center">
                    <Input
                      name="Category"
                      type="text"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 !pb-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="Category"
                    />
                  </div>
                  <div className="col-span-2 self-center">
                    <Input
                      name="Name"
                      type="text"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 !pb-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="Dealer Name"
                    />
                  </div>
                  <div className="col-span-2 self-center">
                    <Select
                      label=""
                      options={country}
                      OptionName="Term"
                      color="text-[#1B1D21] opacity-50"
                      className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      selectedValue={selectedProduct}
                      onChange={handleSelectChange1}
                    />
                  </div>
                  <div className="col-span-2 self-center">
                    <Select
                      label=""
                      options={status}
                      OptionName="Status"
                      color="text-[#1B1D21] opacity-50"
                      className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      selectedValue={selectedTearm}
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
                      // onClick={() => {
                      //   handleFilterIconClick();
                      // }}
                      className="!bg-transparent !p-0"
                    >
                      <img
                        src={clearFilter}
                        className="cursor-pointer ml-2	mx-auto"
                        alt="clearFilter"
                      />
                    </Button>
                  </div>
                </Grid>
              </div>
            </div>
          </Grid>

          <div className="mb-5 relative">
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
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default DealerPriceList;
