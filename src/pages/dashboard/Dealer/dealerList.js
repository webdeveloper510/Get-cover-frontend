import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import Button from "../../../common/button";

import ActiveIcon from "../../../assets/images/icons/iconAction.svg";
import arrowImage from "../../../assets/images/dropdownArrow.png";
import Search from "../../../assets/images/icons/SearchIcon.svg";
import Headbar from "../../../common/headBar";
import Grid from "../../../common/grid";
import Input from "../../../common/input";
import DataTable from "react-data-table-component";
import clearFilter from "../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import { getDealersList } from "../../../services/dealerServices";

function DealerList() {
  const [selectedAction, setSelectedAction] = useState(null);
  const [dealerList, setDealerList] = useState([]);

  const handleActionChange = (action) => {
    // Implement the logic for the selected action (e.g., edit or delete)
    console.log(`Selected action: ${action}`);
    // You can replace the console.log statement with the actual logic you want to perform
  };

  const getDealerList = async () => {
    const result = await getDealersList();
    console.log(result.result);
    setDealerList(result.result);
  };
  const calculateDropdownPosition = (index) => {
    const isCloseToBottom = dealerList.length - index <= 2;
    return isCloseToBottom ? "bottom-[1rem]" : "top-[1rem]";
  };
  useEffect(() => {
    getDealerList();
  }, []);

  const handleStatusChange = async (row, newStatus) => {
    console.log(row, newStatus);
  };

  const columns = [
    {
      name: "Dealer ID",
      selector: (row) => row.accountId,
      sortable: true,
    },
    {
      name: "Dealer Name",
      selector: (row) => row?.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row?.email,
      sortable: true,
    },
    {
      name: "Phone No",
      selector: (row) => row?.phoneNumber,
      sortable: true,
    },
    {
      name: "Orders",
      selector: (row) => row.Orders,
      sortable: true,
    },
    {
      name: "Order Values",
      selector: (row) => row?.Orders,
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
      cell: (row, index) => {
        // console.log(index, index % 10 == 9)
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
                className={`absolute z-[2] w-[80px] drop-shadow-5xl -right-3 mt-2 p-2 bg-white border rounded-lg shadow-md ${calculateDropdownPosition(
                  index
                )}`}
              >
                <img
                  src={arrowImage}
                  className={`absolute  object-contain left-1/2 w-[12px] ${
                    index % 10 === 9 ? "bottom-[-5px] rotate-180" : "top-[-5px]"
                  } `}
                  alt="up arror"
                />
                <div className="text-center py-3">Edit</div>
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

        <div className="flex mt-14">
          <div className="pl-3">
            <p className="font-semibold text-[36px] leading-9	mb-[3px]">
              Dealer
            </p>
            <ul className="flex self-center">
              <li className="text-sm text-neutral-grey font-Regular">
                <Link to={"/"}>Dealer </Link> /{" "}
              </li>
              <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
                {" "}
                Dealer List{" "}
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white mt-10 border-[1px] border-[#D1D1D1] rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className="col-span-5 self-center">
              <p className="text-xl font-semibold">Dealers List</p>
            </div>
            <div className="col-span-7">
              <div className="bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]">
                <Grid className="!grid-cols-8">
                  <div className="col-span-2 self-center">
                    <Input
                      name="Name"
                      type="text"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="Name"
                    />
                  </div>
                  <div className="col-span-2 self-center">
                    <Input
                      name="Email"
                      type="email"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="Email"
                    />
                  </div>
                  <div className="col-span-2 self-center">
                    <Input
                      name="PhoneNo."
                      type="number"
                      className="!text-[14px] !bg-[#f7f7f7]"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-[#1B1D21] !bg-[white]"
                      label=""
                      placeholder="Phone No."
                    />
                  </div>
                  <div className="col-span-2 self-center flex justify-center">
                    <Button className='!p-0'>
                    <img
                      src={Search}
                      className="cursor-pointer	mx-auto"
                      alt="Search"
                    />
                    </Button>
                    <Button type="submit" className='!bg-transparent !ml-2 !p-0'>
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
          <div className="mb-5">
            <DataTable columns={columns} data={dealerList} pagination />
          </div>
        </div>
      </div>
    </>
  );
}

export default DealerList;
