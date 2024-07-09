import React, { useState } from "react";
import Button from "../../../../common/button";
import Grid from "../../../../common/grid";
import Input from "../../../../common/input";

// Media Includes
import Search from "../../../../assets/images/icons/SearchIcon.svg";
import Edit from "../../../../assets/images/Dealer/EditIcon.svg";
import Cross from "../../../../assets/images/Cross.png";
import view from "../../../../assets/images/whiteView.png";
import clearFilter from "../../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import { format, addMonths } from "date-fns";
import CustomPagination from "../../../pagination";
// import { getContracts } from "../../../../services/orderServices";
import { useEffect } from "react";
import { RotateLoader } from "react-spinners";
import { Link } from "react-router-dom";
import Modal from "../../../../common/model";
import { getContractValues } from "../../../../services/extraServices";
import Select from "../../../../common/select";

function Contracts(props) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [singleContract, setSingleContract] = useState([]);
  const [contractDetails, setContractDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const handlePageChange = async (page, rowsPerPage) => {
    setLoading(true);
    try {
      await getOrdersContracts(page, rowsPerPage);
    } finally {
      setLoading(false);
    }
  };
  const [isViewOpen, setIsViewOpen] = useState(false);
  const closeView = () => {
    setIsViewOpen(false);
  };

  const openView = (data) => {
    setIsViewOpen(true);
    getContractDetails(data);
  };

  const getContractDetails = async (data) => {
    setLoading(true);
    const result = await getContractValues(data);
    setSingleContract(result.result);
    setLoading(false);
    console.log("by ID -------------------", result);
  };
  const getOrdersContracts = async (page = 1, rowsPerPage = 10) => {
    let data = {
      page: page,
      pageLimit: rowsPerPage,
    };

    try {
      // const result = await getContracts(props.orderId, data);
      // setContractDetails(result);
      // setTotalRecords(result?.contractCount);
      // console.log(result);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };
  const findDate = (data, index, type) => {
    if (contractDetails) {
      let foundDate = "Date Not Found";

      contractDetails.result.forEach((contract) => {
        const productsArray = contract?.order[0]?.productsArray;

        if (productsArray) {
          const matchingProduct = productsArray.find(
            (product) => product._id === data.orderProductId
          );
          console.log(productsArray);
          if (matchingProduct) {
            foundDate = format(
              new Date(
                type === "start"
                  ? matchingProduct.coverageStartDate
                  : matchingProduct.coverageEndDate
              ),
              "MM/dd/yyyy"
            );
          }
        }
      });

      return foundDate;
    }

    return "Date Not Found";
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
    if (props?.flag == "contracts") {
      getOrdersContracts();
    }
  }, [props?.flag]);

  const status = [
    { label: "Active", value: "Active" },
    { label: "Pending", value: "Pending" },
    { label: "Waiting", value: "waiting" },
  ];
  return (
    <>
      <div className="my-8">
        <div className="bg-white mt-6 border-[1px] border-Light-Grey rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className="col-span-5 self-center">
              <p className="text-xl font-semibold">Contracts List</p>
            </div>
            <div className="col-span-7">
              <div className="bg-grayf9 rounded-[30px] p-3 border-[1px] border-Light-Grey">
                <Grid className="!grid-cols-11">
                  <div className="col-span-3 self-center">
                    <Input
                      name="Name"
                      type="text"
                      className="!text-[14px] !bg-White-Smoke"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
                      label=""
                      placeholder="Contract ID"
                    />
                  </div>
                  <div className="col-span-3 self-center">
                    <Input
                      name="Email"
                      type="email"
                      className="!text-[14px] !bg-White-Smoke"
                      className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
                      label=""
                      placeholder="Serial #"
                    />
                  </div>
                  <div className="col-span-3 self-center">
                    <Select
                      label=""
                      options={status}
                      color="text-Black-Russian opacity-50"
                      className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                      className="!text-[14px] !bg-White-Smoke"
                      // onChange={handleSelectChange}
                      OptionName="Status"
                      name="status"
                      // value={formik.values.status}
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
            ) : (
              <>
                {contractDetails &&
                  contractDetails.result &&
                  contractDetails.result.map((res, index) => (
                    <div>
                      <Grid className="bg-light-black !gap-2 !grid-cols-9 rounded-t-xl">
                        <div className="col-span-3 self-center text-center bg-contract bg-cover bg-right bg-no-repeat rounded-ss-xl">
                          <p className="text-white py-2 font-Regular">
                            Contract ID : <b>{res?.unique_key} </b>
                          </p>
                        </div>
                        <div className="col-span-5"></div>

                        <div className="col-span-1 self-center flex justify-end">
                          <div
                            onClick={() => openView(res._id)}
                            className="self-center bg-[#464646] rounded-full cursor-pointer mr-2 p-1 text-center"
                          >
                            {" "}
                            <img
                              src={view}
                              className="ml-auto w-[23px] h-[23px] "
                              alt="edit"
                            />{" "}
                          </div>
                          <Link to={`/editContract/${res?._id}`}>
                            <img
                              src={Edit}
                              className="ml-auto mr-2"
                              alt="edit"
                            />
                          </Link>
                        </div>
                      </Grid>

                      <Grid className="!gap-0 !grid-cols-8 bg-grayf9 mb-5">
                        <div className="col-span-2 border border-Light-Grey rounded-es-xl">
                          <div className="py-4 pl-3">
                            <p className="text-[#5D6E66] text-sm font-Regular">
                              Manufacturer
                            </p>
                            <p className="text-light-black text-base font-semibold">
                              {res?.manufacture}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-2 border border-Light-Grey">
                          <div className="py-4 pl-3">
                            <p className="text-[#5D6E66] text-sm font-Regular">
                              Model
                            </p>
                            <p className="text-light-black text-base font-semibold">
                              {res?.model}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-2 border border-Light-Grey">
                          <div className="py-4 pl-3">
                            <p className="text-[#5D6E66] text-sm font-Regular">
                              Serial
                            </p>
                            <p className="text-light-black text-base font-semibold">
                              {res?.serial}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-2 border border-Light-Grey">
                          <div className="py-4 pl-3">
                            <p className="text-[#5D6E66] text-sm font-Regular">
                              Product Description
                            </p>
                            <p className="text-light-black text-base font-semibold">
                              Laptops are designed to be portable computers.
                            </p>
                          </div>
                        </div>
                        <div className="col-span-1 border border-Light-Grey">
                          <div className="py-4 pl-3">
                            <p className="text-[#5D6E66] text-sm font-Regular">
                              Retail Price
                            </p>
                            <p className="text-light-black text-base font-semibold">
                              $
                              {res.productValue === undefined
                                ? parseInt(0).toLocaleString(2)
                                : formatOrderValue(
                                    res.productValue ?? parseInt(0)
                                  )}
                              {/* ${parseInt(res?.productValue).toLocaleString(2)} */}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-1 border border-Light-Grey">
                          <div className="py-4 pl-3">
                            <p className="text-[#5D6E66] text-sm font-Regular">
                              Condition
                            </p>
                            <p className="text-light-black text-base font-semibold">
                              {res?.condition}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-1 border border-Light-Grey">
                          <div className="py-4 pl-3">
                            <p className="text-[#5D6E66] text-sm font-Regular">
                              Coverage Start Date
                            </p>
                            <p className="text-light-black text-base font-semibold">
                              {findDate(res, index, "start")}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-1 border border-Light-Grey">
                          <div className="py-4 pl-3">
                            <p className="text-[#5D6E66] text-sm font-Regular">
                              Coverage End Date
                            </p>
                            <p className="text-light-black text-base font-semibold">
                              {findDate(res, index, "end")}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-1 border border-Light-Grey">
                          <div className="py-4 pl-3">
                            <p className="text-[#5D6E66] text-sm font-Regular">
                              Claim Amount
                            </p>
                            <p className="text-light-black text-base font-semibold">
                              ${parseInt(res?.claimAmount).toLocaleString(2)}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-1 border border-Light-Grey rounded-es-xl	">
                          <div className="py-4 pl-3">
                            <p className="text-[#5D6E66] text-sm font-Regular">
                              Status
                            </p>
                            <p className="text-light-black text-base font-semibold">
                              {res?.status}
                            </p>
                            Contracts List
                          </div>
                        </div>
                        <div className="col-span-1 border border-Light-Grey rounded-ee-xl">
                          <div className="py-4 pl-3">
                            <p className="text-[#5D6E66] text-sm font-Regular">
                              Eligibility
                            </p>
                            <p className="text-light-black text-base font-semibold">
                              {res?.eligibilty}
                            </p>
                          </div>
                        </div>
                      </Grid>
                    </div>
                  ))}
              </>
            )}
          </div>
          <CustomPagination
            totalRecords={contractDetails?.contractCount}
            rowsPerPageOptions={[10, 20, 50, 100]}
            className={loading ? "opacity-0" : "opacity-100"}
            onPageChange={handlePageChange}
            setRecordsPerPage={setRecordsPerPage}
          />
        </div>
      </div>

      <Modal isOpen={isViewOpen} onClose={closeView} className="!w-[1100px]">
        <Button
          onClick={closeView}
          className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-Granite-Gray"
        >
          <img
            src={Cross}
            className="w-full h-full text-black rounded-full p-0"
          />
        </Button>
        <div className="text-center mt-2">
          <p className="text-3xl font-semibold mb-4">Contract Details </p>
          <div>
            {loading ? (
              <div className=" h-[400px] w-full flex py-5">
                <div className="self-center mx-auto">
                  <RotateLoader color="#333" />
                </div>
              </div>
            ) : (
              <>
                <Grid className="bg-light-black !gap-2 !grid-cols-11 !px-3 rounded-t-xl">
                  <div className="col-span-3 self-center text-left bg-contract bg-contain bg-right bg-no-repeat rounded-ss-xl">
                    <p className="text-white py-2 font-Regular">
                      Contract ID : <b> {singleContract?.unique_key} </b>
                    </p>
                  </div>
                  <div className="col-span-3 self-center text-left bg-contract bg-contain bg-right bg-no-repeat ">
                    <p className="text-white py-2 font-Regular">
                      Order ID :{" "}
                      <b> {singleContract?.order?.[0]?.unique_key} </b>
                    </p>
                  </div>
                  <div className="col-span-3 self-center text-left bg-contract bg-contain bg-right bg-no-repeat ">
                    <p className="text-white py-2 font-Regular">
                      Dealer P.O. # :{" "}
                      <b> {singleContract?.order?.[0]?.venderOrder} </b>
                    </p>
                  </div>
                  <div className="col-span-1"></div>
                  <div className="col-span-1 self-center justify-end self-center rounded-[20px] text-center bg-contract bg-cover bg-right bg-no-repeat"></div>
                </Grid>

                <Grid className="!gap-0 !grid-cols-5 bg-grayf9 mb-5">
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Dealer Name
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {singleContract?.order?.[0]?.customer?.[0]?.dealerName}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Reseller Name
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {singleContract?.order?.[0]?.reseller?.[0]?.name}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Customer Name
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {singleContract?.order?.[0]?.customer?.[0]?.username}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Servicer Name
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {singleContract?.order?.[0]?.servicer?.[0]?.username}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Claim Amount
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        $
                        {singleContract?.claimAmount === undefined
                          ? parseInt(0).toLocaleString(2)
                          : formatOrderValue(
                              singleContract?.claimAmount ?? parseInt(0)
                            )}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey ">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Product Category
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {
                          singleContract?.order?.[0]?.productsArray?.[0]
                            ?.priceBook?.[0].category.name
                        }
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Product Name
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {singleContract?.productName}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Product Description
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {
                          singleContract?.order?.[0]?.productsArray?.[0]
                            ?.description
                        }
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Price Type
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {
                          singleContract?.order?.[0]?.productsArray?.[0]
                            ?.priceType
                        }{" "}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey ">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Condition
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {singleContract.condition}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey rounded-es-xl">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Retail Price
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        $
                        {singleContract.productValue === undefined
                          ? parseInt(0).toLocaleString(2)
                          : formatOrderValue(
                              singleContract.productValue ?? parseInt(0)
                            )}
                      </p>
                    </div>
                  </div>
                  {singleContract?.order?.[0]?.productsArray?.[0]?.priceType ==
                  "Flat Pricing" ? (
                    <>
                      <div className="col-span-1 border border-Light-Grey">
                        <div className="py-4 pl-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            Start Range
                          </p>
                          <p className="text-light-black text-base font-semibold">
                            $
                            {singleContract?.order?.[0]?.productsArray?.[0]
                              ?.rangeStart === undefined
                              ? parseInt(0).toLocaleString(2)
                              : formatOrderValue(
                                  singleContract?.order?.[0]?.productsArray?.[0]
                                    ?.rangeStart ?? parseInt(0)
                                )}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-1 border border-Light-Grey">
                        <div className="py-4 pl-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            End Range
                          </p>
                          <p className="text-light-black text-base font-semibold">
                            $
                            {singleContract?.order?.[0]?.productsArray?.[0]
                              ?.rangeEnd === undefined
                              ? parseInt(0).toLocaleString(2)
                              : formatOrderValue(
                                  singleContract?.order?.[0]?.productsArray?.[0]
                                    ?.rangeEnd ?? parseInt(0)
                                )}{" "}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}

                  <div className="col-span-1 border border-Light-Grey ">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Coverage Start Date
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {new Date(
                          singleContract?.order?.[0]?.productsArray?.[0]?.coverageStartDate
                        ).toLocaleDateString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 border border-Light-Grey rounded-ee-xl">
                    <div className="py-4 pl-3">
                      <p className="text-[#5D6E66] text-sm font-Regular">
                        Coverage End Date
                      </p>
                      <p className="text-light-black text-base font-semibold">
                        {new Date(
                          singleContract?.order?.[0]?.productsArray?.[0]?.coverageEndDate
                        ).toLocaleDateString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  {singleContract?.order?.[0]?.productsArray?.[0]?.priceType ==
                  "Quantity Pricing" ? (
                    <>
                      <div className="col-span-5">
                        <table className="w-full border text-center">
                          <tr className="border bg-[#9999]">
                            <th colSpan={"3"}>Quantity Pricing List </th>
                          </tr>
                          <tr className="border bg-[#9999]">
                            <th>Name</th>
                            <th> Quantity Per Unit</th>
                            <th> Quantity</th>
                          </tr>
                          {singleContract?.order?.[0].productsArray?.[0]
                            ?.QuantityPricing.length !== 0 &&
                            singleContract?.order?.[0].productsArray?.[0]?.QuantityPricing.map(
                              (item, index) => (
                                <tr key={index} className="border">
                                  <td>{item.name}</td>
                                  <td>{item.quantity}</td>
                                  <td>{item.enterQuantity}</td>
                                </tr>
                              )
                            )}
                        </table>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </Grid>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Contracts;
