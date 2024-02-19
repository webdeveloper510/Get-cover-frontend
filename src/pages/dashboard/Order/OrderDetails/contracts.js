import React, { useState } from "react";
import Button from "../../../../common/button";
import Grid from "../../../../common/grid";
import Input from "../../../../common/input";

// Media Includes
import Search from "../../../../assets/images/icons/SearchIcon.svg";
import Edit from "../../../../assets/images/Dealer/EditIcon.svg";
import clearFilter from "../../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import { format, addMonths } from "date-fns";
import CustomPagination from "../../../pagination";
import { getContracts } from "../../../../services/orderServices";
import { useEffect } from "react";
import { RotateLoader } from "react-spinners";
import { Link } from "react-router-dom";

function Contracts(props) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [contractDetails, setContractDetails] = useState();
  const [loading, setLoading] = useState(false);

  const handlePageChange = async (page, rowsPerPage) => {
    console.log(page, rowsPerPage);
    setLoading(true);
    try {
      await getOrdersContracts(page, rowsPerPage);
    } finally {
      setLoading(false);
    }
  };

  const getOrdersContracts = async (page = 1, rowsPerPage = 10) => {
    let data = {
      page: page,
      pageLimit: rowsPerPage,
    };

    try {
      const result = await getContracts(props.orderId, data);
      setContractDetails(result);
      setTotalRecords(result?.contractCount);
      console.log(result);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  useEffect(() => {
    if (props?.flag == "contracts") {
      getOrdersContracts();
    }
  }, [props?.flag]);

  return (
    <>
      <div className="my-8">
        <div className="bg-white mt-6 border-[1px] border-[#D1D1D1] rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className="col-span-5 self-center">
              <p className="text-xl font-semibold">Contracts List</p>
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
                    <Button type="submit" className="!p-0">
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

          <div className="px-3 mt-5">
          {loading ? (
              <div className=" h-[400px] w-full flex py-5">
                <div className="self-center mx-auto">
                  <RotateLoader color="#333" />
                </div>
              </div>
            ) : (<>
            {contractDetails &&
              contractDetails.result &&
              contractDetails.result.map((res) => (
                <div>
                  <Grid className="bg-[#333333] !gap-2 !grid-cols-9 rounded-t-xl">
                    <div className="col-span-3 self-center text-center bg-contract bg-cover bg-right bg-no-repeat rounded-ss-xl">
                      <p className="text-white py-2 font-Regular">
                        Contract ID : <b> CI-2024-1000 </b>
                      </p>
                    </div>
                    <div className="col-span-5"></div>

                    <div className="col-span-1 self-center justify-end">
                      <Link to={`/editContract/${res?._id}`}>
                      <img src={Edit} className="ml-auto mr-2" alt="edit" />
                      </Link>
                    </div>
                  </Grid>

                  <Grid className="!gap-0 !grid-cols-5 bg-[#F9F9F9] mb-5">
                    <div className="col-span-1 border border-[#D1D1D1]">
                      <div className="py-4 pl-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Manufacturer
                        </p>
                        <p className="text-[#333333] text-base font-semibold">
                          {res?.manufacture}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-1 border border-[#D1D1D1]">
                      <div className="py-4 pl-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Model
                        </p>
                        <p className="text-[#333333] text-base font-semibold">
                          {res?.model}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-1 border border-[#D1D1D1]">
                      <div className="py-4 pl-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Serial
                        </p>
                        <p className="text-[#333333] text-base font-semibold">
                          {res?.serial}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-2 border border-[#D1D1D1]">
                      <div className="py-4 pl-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Product Description
                        </p>
                        <p className="text-[#333333] text-base font-semibold">
                          Laptops are designed to be portable computers.
                        </p>
                      </div>
                    </div>
                    <div className="col-span-1 border border-[#D1D1D1]">
                      <div className="py-4 pl-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Retail Price
                        </p>
                        <p className="text-[#333333] text-base font-semibold">
                          ${parseInt(res?.productValue).toLocaleString(2)}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-1 border border-[#D1D1D1]">
                      <div className="py-4 pl-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Condition
                        </p>
                        <p className="text-[#333333] text-base font-semibold">
                          {res?.condition}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-1 border border-[#D1D1D1]">
                      <div className="py-4 pl-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Coverage Start Date
                        </p>
                        <p className="text-[#333333] text-base font-semibold">
                          {/* format(
        new Date(
          type === "start" ? product.coverageStartDate : product.coverageEndDate
        ),
        "MM-dd-yyyy"
      );  {findDate(res, "start")} */}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-1 border border-[#D1D1D1]">
                      <div className="py-4 pl-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Coverage End Date
                        </p>
                        <p className="text-[#333333] text-base font-semibold">
                          {/* {findDate(res, "end")} */}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-1 border border-[#D1D1D1]">
                      <div className="py-4 pl-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Claim Amount
                        </p>
                        <p className="text-[#333333] text-base font-semibold">
                          $ {parseInt(res?.claimAmount).toLocaleString(2)}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-1 border border-[#D1D1D1] rounded-es-xl	">
                      <div className="py-4 pl-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Status
                        </p>
                        <p className="text-[#333333] text-base font-semibold">
                          {res?.status}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-1 border border-[#D1D1D1]">
                      <div className="py-4 pl-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Eligibility
                        </p>
                        <p className="text-[#333333] text-base font-semibold">
                          {res?.eligibilty}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-3 border border-[#D1D1D1] rounded-ee-xl"></div>
                  </Grid>
                </div>
              )) }
            </> ) }
          </div>
          <CustomPagination
            totalRecords={contractDetails?.contractCount}
            rowsPerPageOptions={[10, 20, 50, 100]}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}

export default Contracts;
