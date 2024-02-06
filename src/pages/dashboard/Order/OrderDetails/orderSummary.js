import React, { useState } from "react";
import Button from "../../../../common/button";
import Grid from "../../../../common/grid";
import Input from "../../../../common/input";

// Media Includes
import Search from "../../../../assets/images/icons/SearchIcon.svg";
import Edit from "../../../../assets/images/Dealer/EditIcon.svg";
import Csv from "../../../../assets/images/icons/csvWhite.svg";
function OrderSummary(props) {
  console.log(props.data);
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <>
      <div className="my-8">
        <div className="bg-white mt-6 border-[1px] border-[#D1D1D1] rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className="col-span-5 self-center">
              <p className="text-xl font-semibold">Orders List</p>
            </div>
            <div className="col-span-7"></div>
          </Grid>

          {props?.data?.length != 0 ? (
            props?.data?.map((res) => {
              console.log(res);
              return (
                <div className="px-3 mt-5">
                  <div>
                    <div>
                      <Grid className="bg-[#333333] !gap-2 !grid-cols-9 rounded-t-xl">
                        <div className="col-span-2 self-center text-center bg-contract bg-cover bg-right bg-no-repeat rounded-ss-xl">
                          <p className="text-white py-2 font-Regular">
                            Product Name : <b> {res.priceBookId} </b>
                          </p>
                        </div>
                      </Grid>

                      <Grid className="!gap-0 bg-[#F9F9F9] mb-5">
                        <div className="col-span-3 border border-[#D1D1D1]">
                          <div className="py-4 pl-3">
                            <p className="text-[#5D6E66] text-sm font-Regular">
                              Product Category
                            </p>
                            <p className="text-[#333333] text-base font-semibold">
                              {res.categoryId}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-9 border border-[#D1D1D1]">
                          <div className="py-4 pl-3">
                            <p className="text-[#5D6E66] text-sm font-Regular">
                              Product Description
                            </p>
                            <p className="text-[#333333] text-base font-semibold">
                              {res.description}
                            </p>
                          </div>
                        </div>

                        <div className="col-span-3 border border-[#D1D1D1]">
                          <div className="py-4 pl-3">
                            <p className="text-[#5D6E66] text-sm font-Regular">
                              Term
                            </p>
                            <p className="text-[#333333] text-base font-semibold">
                              {res.term} Months
                            </p>
                          </div>
                        </div>
                        <div className="col-span-3 border border-[#D1D1D1]">
                          <div className="py-4 pl-3">
                            <p className="text-[#5D6E66] text-sm font-Regular">
                              Unit Price
                            </p>
                            <p className="text-[#333333] text-base font-semibold">
                              $20.00
                            </p>
                          </div>
                        </div>
                        <div className="col-span-3 border border-[#D1D1D1]">
                          <div className="py-4 pl-3">
                            <p className="text-[#5D6E66] text-sm font-Regular">
                              No. of Products
                            </p>
                            <p className="text-[#333333] text-base font-semibold">
                              {res.noOfProducts}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-3 border border-[#D1D1D1]">
                          <div className="py-4 pl-3">
                            <p className="text-[#5D6E66] text-sm font-Regular">
                              Price
                            </p>
                            <p className="text-[#333333] text-base font-semibold">
                              ${res.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-12 border rounded-b-xl	 border-[#D1D1D1]">
                          <Grid className="">
                            <div className="col-span-9 py-4 pl-3">
                              <div className="">
                                <p className="text-[#5D6E66] text-sm font-Regular">
                                  Note
                                </p>
                                <p className="text-[#333333] text-base font-semibold">
                                  {res.additionalNotes}
                                </p>
                              </div>
                            </div>
                            <div className="col-span-3 self-center justify-end flex pr-4">
                              <Button className="!bg-white !text-light-black border flex">
                                <img
                                  src={Csv}
                                  className="mr-3 self-center"
                                  alt="Csv"
                                />{" "}
                                <span className="self-center">
                                  {" "}
                                  Download File{" "}
                                </span>
                              </Button>
                            </div>
                          </Grid>
                        </div>
                      </Grid>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}

export default OrderSummary;
