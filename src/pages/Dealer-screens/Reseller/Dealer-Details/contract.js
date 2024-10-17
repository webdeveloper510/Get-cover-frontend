import React, { useEffect, useState } from "react";
import Button from "../../../../common/button";
import Grid from "../../../../common/grid";
import Input from "../../../../common/input";

// Media Includes
import Search from "../../../../assets/images/icons/SearchIcon.svg";
import view from "../../../../assets/images/whiteView.png";
import Cross from "../../../../assets/images/Cross.png";
import Edit from "../../../../assets/images/Dealer/EditIcon.svg";
import clearFilter from "../../../../assets/images/icons/Clear-Filter-Icon-White.svg";
import { Link } from "react-router-dom";
import { getContractsforDealer } from "../../../../services/dealerServices";
import { getContractsforReseller } from "../../../../services/reSellerServices";
import { RotateLoader } from "react-spinners";
import { format } from "date-fns";
import * as Yup from "yup";
import CustomPagination from "../../../pagination";
import { getContractsforCustomer } from "../../../../services/customerServices";
import Modal from "../../../../common/model";
import { getContractValues } from "../../../../services/extraServices";
import { useFormik } from "formik";
import Select from "../../../../common/select";
import CommonTooltip from "../../../../common/toolTip";
import Card from "../../../../common/card";
import SingleView from "../../../../common/singleView";
function ContractList(props) {
  console.log(props, "-------------------->>>");
  const [showTooltip, setShowTooltip] = useState(false);
  const [contractList, setContractList] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [pageValue, setPageValue] = useState(1);
  const [isDisapprovedOpen, setIsDisapprovedOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [singleContract, setSingleContract] = useState([]);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [value, setValue] = useState(null);
  const closeDisapproved = () => {
    setIsDisapprovedOpen(false);
  };
  const getContracts = async (page = 1, rowsPerPage = 10) => {
    setPageValue(page);
    // return false;
    let data = {
      page: page,
      pageLimit: rowsPerPage,
      ...formik.values,
    };
    setLoading(true);
    console.log(props);
    const result =
      props.flag === "reseller"
        ? await getContractsforReseller(props.id, data)
        : props.flag === "dealer"
          ? await getContractsforDealer(props.id, data)
          : await getContractsforCustomer(props.id, data);

    setContractList(result.result);
    console.log(result);
    setTotalRecords(result?.totalCount);
    setLoading(false);
  };
  const Eligible = [
    { label: "Eligible", value: true },
    { label: "Not Eligible", value: false },
  ];

  const handleSelectChange2 = (label, value) => {
    formik.setFieldValue("eligibilty", value);
    setValue(value);
  };
  useEffect(() => {
    if (props.activeTab === "Contracts") {
      getContracts();
    }
  }, [props]);

  const closeView = () => {
    setIsViewOpen(false);
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

  const openView = (data) => {
    setIsViewOpen(true);
    getsingleContract(data);
  };

  const getsingleContract = async (data) => {
    setLoading(true);
    const result = await getContractValues(data);
    setSingleContract(result.result);
    setLoading(false);
    console.log("by ID -------------------", result);
  };
  const handlePageChange = async (page, rowsPerPage) => {
    console.log(page, rowsPerPage);
    setLoading(true);
    try {
      await getContracts(page, rowsPerPage);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const findDate = (data, type) => {
    const product = contractList?.find((contract) => {
      return contract.order;
    });

    if (product) {
      const selectedProduct = product.order.find(
        (res) => res._id === data.orderId
      );

      if (selectedProduct && selectedProduct.productsArray) {
        const formattedDates = selectedProduct.productsArray.map((res) => {
          return format(
            new Date(
              type === "start" ? res.coverageStartDate1 : res.coverageEndDate1
            ),
            "MM/dd/yyyy"
          );
        });

        return formattedDates[0];
      }
    }

    return "";
  };
  const validationSchema = Yup.object().shape({});

  const initialValues = {
    orderId: "",
    venderOrder: "",
    contractId: "",
    dealerName: "",
    customerName: "",
    servicerName: "",
    manufacture: "",
    status: "",
    model: "",
    serial: "",
    productName: "",
    eligibilty: "",
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      getContracts(1, 10);
      console.log(values);
      setIsDisapprovedOpen(false);
    },
  });

  const handleSelectChange1 = (label, value) => {
    console.log(label, value, "selected");
    formik.setFieldValue("status", value);
    setSelectedProduct(value);
  };

  const status = [
    { label: "Active", value: "Active" },
    { label: "Waiting", value: "Waiting" },
    { label: "Expired", value: "Expired" },
  ];

  const handleFilterIconClick = () => {
    formik.resetForm();
    setValue("");
    console.log(formik.values);
    setSelectedProduct("");
    // getContract();
  };

  const openDisapproved = () => {
    setIsDisapprovedOpen(true);
  };

  return (
    <>
      <div className="my-8">
        <Card className="mt-6 border-[1px] border-Light-Grey rounded-xl">
          <Grid className="!p-[26px] !pt-[14px] !pb-0">
            <div className="col-span-3 self-center">
              <p className="text-xl font-semibold">Contracts List</p>
            </div>
            <div className="col-span-9">
              <form onSubmit={formik.handleSubmit}>
                <div className="bg-grayf9 rounded-[30px] p-3 border-[1px] border-Light-Grey">
                  <Grid className="!grid-cols-9">
                    <div className="col-span-2 self-center">
                      <Input
                        type="text"
                        className="!text-[14px] !bg-White-Smoke"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
                        label=""
                        placeholder="Contract ID"
                        name="contractId"
                        {...formik.getFieldProps("contractId")}
                      />
                    </div>
                    <div className="col-span-2 self-center">
                      <Input
                        name="orderId"
                        type="text"
                        className="!text-[14px] !bg-White-Smoke"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
                        label=""
                        placeholder=" Order ID"
                        {...formik.getFieldProps("orderId")}
                      />
                    </div>
                    <div className="col-span-2 self-center">
                      <Input
                        name="venderOrder"
                        type="text"
                        className="!text-[14px] !bg-White-Smoke"
                        className1="!text-[13px] !pt-1 placeholder-opacity-50 !pb-1 placeholder-Black-Russian !bg-[white]"
                        label=""
                        placeholder="Dealer P.O. #"
                        {...formik.getFieldProps("venderOrder")}
                      />
                    </div>
                    <div className="col-span-1 self-center flex justify-center">
                      <Button type="submit" className="!p-2">
                        <img
                          src={Search}
                          className="cursor-pointer "
                          alt="Search"
                        />
                      </Button>
                      <Button
                        type="submit"
                        className="!bg-transparent !p-0"
                        onClick={() => {
                          handleFilterIconClick();
                        }}
                      >
                        <img
                          src={clearFilter}
                          className="cursor-pointer	mx-auto"
                          alt="clearFilter"
                        />
                      </Button>
                    </div>
                    <div className="col-span-2 self-center">
                      <Button
                        className="!text-[13px]"
                        onClick={() => openDisapproved()}
                      >
                        Advance Search
                      </Button>
                    </div>
                  </Grid>
                </div>
              </form>
            </div>
          </Grid>
          {contractList?.length == 0 && !loading ? (
            <>
              <div className="text-center my-5">
                <p>No records found.</p>
              </div>
            </>
          ) : (
            <div>
              {loading ? (
                <div className=" h-[400px] w-full flex py-5">
                  <div className="self-center mx-auto">
                    <RotateLoader color="#333" />
                  </div>
                </div>
              ) : (
                <>
                  {contractList &&
                    contractList.map((res, index) => {
                      console.log(res);
                      return (
                        <div className="px-3 mt-5">
                          <div>
                            <Grid className="bg-light-black !gap-2 !grid-cols-10 rounded-t-xl">
                              <div className="col-span-3 self-center text-center bg-contract bg-cover bg-right bg-no-repeat rounded-ss-xl">
                                <p className="text-white py-2 font-Regular">
                                  Contract ID : <b> {res.unique_key} </b>
                                </p>
                              </div>
                              <div className="col-span-3 self-center text-center bg-contract bg-cover bg-right bg-no-repeat ">
                                <p className="text-white py-2 font-Regular">
                                  Order ID : <b> {res?.orderUniqueKey} </b>
                                </p>
                              </div>
                              <div className="col-span-3 self-center text-center bg-contract bg-cover bg-right bg-no-repeat ">
                                <p className="text-white py-2 font-Regular">
                                  Dealer P.O. # : <b> {res?.venderOrder} </b>
                                </p>
                              </div>
                              <div className="col-span-1 self-center justify-end">
                                <div
                                  onClick={() => openView(res._id)}
                                  className="self-center rounded-full cursor-pointer mr-2 p-1 text-center"
                                >
                                  {" "}
                                  <img
                                    src={view}
                                    className="ml-auto w-[23px] h-[23px] "
                                    alt="edit"
                                  />{" "}
                                </div>
                              </div>
                            </Grid>

                            <Grid className="!gap-0 !grid-cols-5 bg-grayf9 mb-5">
                              <div className="col-span-1 border border-Light-Grey rounded-es-xl">
                                <div className="py-4 px-3">
                                  <p className="text-[#5D6E66] text-sm font-Regular">
                                    Manufacturer
                                  </p>
                                  <p className="text-light-black text-base font-semibold">
                                    {res.manufacture}
                                  </p>
                                </div>
                              </div>
                              <div className="col-span-1 border border-Light-Grey">
                                <div className="py-4 px-3">
                                  <p className="text-[#5D6E66] text-sm font-Regular">
                                    Model
                                  </p>
                                  <p className="text-light-black text-base font-semibold">
                                    {res.model}
                                  </p>
                                </div>
                              </div>
                              <div className="col-span-1 border border-Light-Grey">
                                <div className="py-4 px-3">
                                  <p className="text-[#5D6E66] text-sm font-Regular">
                                    Serial
                                  </p>
                                  <p className="text-light-black text-base font-semibold">
                                    {res.serial}
                                  </p>
                                </div>
                              </div>
                              <div className="col-span-1 border border-Light-Grey">
                                <div className="py-4 px-3">
                                  <p className="text-[#5D6E66] text-sm font-Regular">
                                    Status
                                  </p>
                                  <p className="text-light-black text-base font-semibold">
                                    {res.status}
                                  </p>
                                </div>
                              </div>
                              <div className="col-span-1 border border-Light-Grey rounded-ee-xl">
                                <div className="py-4 px-3">
                                  <p className="text-[#5D6E66] text-sm font-Regular">
                                    Eligibility
                                  </p>
                                  {res?.eligibilty === false ? (
                                    <>
                                      <CommonTooltip
                                        place="left"
                                        id={`tooltip-${index}`}
                                        content={res?.reason}
                                      >
                                        <p className="text-light-black cursor-pointer text-base font-semibold">
                                          Not Eligible
                                        </p>
                                      </CommonTooltip>
                                    </>
                                  ) : (
                                    <p className="text-light-black text-base font-semibold">
                                      Eligible
                                    </p>
                                  )}
                                </div>
                              </div>
                            </Grid>
                          </div>
                        </div>
                      );
                    })}
                </>
              )}

              <CustomPagination
                totalRecords={totalRecords}
                page={pageValue}
                className={loading ? "opacity-0" : "opacity-100"}
                rowsPerPageOptions={[10, 20, 50, 100]}
                onPageChange={handlePageChange}
                setRecordsPerPage={setRecordsPerPage}
              />
            </div>
          )}
        </Card>
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
          <p className="text-3xl font-semibold mb-4">Contract Details : </p>
          <div>
            {loading ? (
              <div className=" h-[400px] w-full flex py-5">
                <div className="self-center mx-auto">
                  <RotateLoader color="#333" />
                </div>
              </div>
            ) : (
              <>
                <SingleView className='rounded-t-xl'>
                  <Grid className="!gap-2 !grid-cols-11">
                    <div className="col-span-3 self-center text-left bg-contract bg-contain bg-right bg-no-repeat rounded-ss-xl">
                      <p className="text-white py-2 font-Regular">
                        Contract ID : <b> {singleContract.unique_key} </b>
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
                    <div className="col-span-1 self-center justify-end ">
                      {/* <Link to={`/editContract/${singleContract._id}`}>
                              {" "}
                              <img
                                src={Edit}
                                className="ml-auto mr-2"
                                alt="edit"
                              />{" "}
                            </Link> */}
                    </div>
                  </Grid>
                </SingleView>
                <div className="bg-grayf9 mb-5 max-h-[70vh] overflow-y-scroll">
                  <Grid className="!gap-0 !grid-cols-5 mb-5">
                    <div className="col-span-1 border border-Light-Grey">
                      <div className="py-4 px-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Manufacturer
                        </p>
                        <p className="text-light-black text-base font-semibold">
                          {singleContract?.manufacture}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-1 border border-Light-Grey">
                      <div className="py-4 px-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Model
                        </p>
                        <p className="text-light-black text-base font-semibold">
                          {singleContract?.model}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-1 border border-Light-Grey">
                      <div className="py-4 px-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Serial
                        </p>
                        <p className="text-light-black text-base font-semibold">
                          {singleContract?.serial}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-1 border border-Light-Grey">
                      <div className="py-4 px-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Status
                        </p>
                        <p className="text-light-black text-base font-semibold">
                          {singleContract?.status}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-1 border border-Light-Grey">
                      <div className="py-4 px-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Eligibility
                        </p>
                        {singleContract?.eligibilty === false ? (
                          <>
                            <CommonTooltip
                              place="top"
                              id="tooltip-default"
                              content={singleContract?.reason}
                            >
                              <p className="text-light-black cursor-pointer text-base font-semibold">
                                Not Eligible
                              </p>
                            </CommonTooltip>
                          </>
                        ) : (
                          <p className="text-light-black text-base font-semibold">
                            Eligible
                          </p>
                        )}
                      </div>
                    </div>

                    {!window.location.pathname.includes("/customerDetails") ? (
                      <div className="col-span-1 border border-Light-Grey">
                        <div className="py-4 px-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            Reseller Name
                          </p>
                          <p className="text-light-black text-base font-semibold">
                            {singleContract?.order?.[0]?.reseller?.[0]?.name}
                          </p>
                        </div>
                      </div>
                    ) : null}

                    {!window.location.pathname.includes("/customerDetails") ? (
                      <div className="col-span-1 border border-Light-Grey">
                        <div className="py-4 px-3">
                          <p className="text-[#5D6E66] text-sm font-Regular">
                            Customer Name
                          </p>
                          <p className="text-light-black text-base font-semibold">
                            {singleContract?.order?.[0]?.customer?.[0]?.username}
                          </p>
                        </div>
                      </div>
                    ) : null}
                    <div className="col-span-1 border border-Light-Grey">
                      <div className="py-4 px-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Servicer Name
                        </p>
                        <p className="text-light-black text-base font-semibold">
                          {singleContract?.order?.[0]?.servicer?.[0]?.username}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-1 border border-Light-Grey ">
                      <div className="py-4 px-3">
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
                      <div className="py-4 px-3">
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

                    <div className="col-span-1 border border-Light-Grey">
                      <div className="py-4 px-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Product SKU
                        </p>
                        <p className="text-light-black text-base font-semibold">
                          {singleContract?.productName}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-1 border border-Light-Grey">
                      <div className="py-4 px-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Product Name
                        </p>
                        <p className="text-light-black text-base font-semibold">
                          {singleContract?.pName}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-2 border border-Light-Grey">
                      <div className="py-4 px-3">
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
                      <div className="py-4 px-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Price Type
                        </p>
                        <p className="text-light-black text-base font-semibold">
                          {
                            singleContract?.order?.[0]?.productsArray?.[0]
                              ?.priceType
                          }
                        </p>
                      </div>
                    </div>
                    <div className="col-span-1 border border-Light-Grey ">
                      <div className="py-4 px-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Condition
                        </p>
                        <p className="text-light-black text-base font-semibold">
                          {singleContract.condition}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-1 border border-Light-Grey">
                      <div className="py-4 px-3">
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
                          <div className="py-4 px-3">
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
                          <div className="py-4 px-3">
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

                    <div className="col-span-1 border border-Light-Grey">
                      <div className="py-4 px-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Coverage Start Date
                        </p>
                        <p className="text-light-black text-base font-semibold">
                          {new Date(
                            singleContract?.order?.[0]?.productsArray?.[0]?.coverageStartDate1
                          ).toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-1 border border-Light-Grey">
                      <div className="py-4 px-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Coverage End Date
                        </p>
                        <p className="text-light-black text-base font-semibold">
                          {new Date(
                            singleContract?.order?.[0]?.productsArray?.[0]?.coverageEndDate1
                          ).toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-1 border border-Light-Grey ">
                      <div className="py-4 px-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Manufacturer Labour Warranty End Date
                        </p>
                        <p className="text-light-black text-base font-semibold">
                          {new Date(
                            singleContract?.labourWarranty
                          ).toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-1 border border-Light-Grey ">
                      <div className="py-4 px-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Manufacturer Parts Warranty End Date
                        </p>
                        <p className="text-light-black text-base font-semibold">
                          {new Date(
                            singleContract?.partsWarranty
                          ).toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-1 border border-Light-Grey ">
                      <div className="py-4 px-3">
                        <p className="text-[#5D6E66] text-sm font-Regular">
                          Purchase Date
                        </p>
                        <p className="text-light-black text-base font-semibold">
                          {new Date(
                            singleContract?.purchaseDate
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
                  <Grid className="!gap-0 ">
                    <div className="col-span-3 border border-Light-Grey pl-4">
                      <p className="text-base mb-2 text-left font-semibold">
                        # of Claims Over the Certain Period
                      </p>
                      <p className="text-[14px] mb-2 text-left font-semibold">

                        {
                          singleContract?.noOfClaim?.value == "-1"
                            ? ""
                            : `${singleContract?.noOfClaim?.period} - `
                        }
                        {" "}
                        {singleContract?.noOfClaim?.value == -1
                          ? "Unlimited"
                          : singleContract?.noOfClaim?.value}
                      </p>
                    </div>
                    <div className="col-span-3 border border-Light-Grey pl-4">
                      <p className="text-base mb-2 text-left font-semibold">
                        # of Claims in Coverage<br /> Period
                      </p>
                      <p className="text-[14px] text-left font-semibold">
                        {singleContract?.noOfClaimPerPeriod == -1
                          ? "Unlimited"
                          : singleContract?.noOfClaimPerPeriod}
                      </p>
                    </div>
                    <div className="col-span-3 border border-Light-Grey pl-4">
                      <p className=" text-base mb-2 text-left font-semibold">
                        {" "}
                        Is manufacturer warranty included?
                      </p>
                      <p className="text-[14px] text-left font-semibold">
                        {singleContract?.isManufacturerWarranty == true
                          ? "Yes"
                          : "No"}
                      </p>
                    </div>
                    <div className="col-span-3 border border-Light-Grey pl-4">
                      <p className=" text-base mb-2 text-left font-semibold">
                        {" "}
                        Is There a Maximum Claim <br /> Amount ?
                      </p>
                      <p className="text-[14px] text-left font-semibold">
                        {singleContract?.isMaxClaimAmount == true
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

                        {singleContract?.mergedData &&
                          singleContract?.mergedData.length > 0 && (
                            <>
                              {singleContract?.mergedData.map((type, index) => (
                                <tr key={index} className="border ">
                                  <td className="font-semibold  mx-[19px]">
                                    {type.label}
                                  </td>
                                  <td className="font-semibold mx-[19px]">
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
                  </Grid>
                </div>
              </>
            )}
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
                  name="contractId"
                  className="!bg-white"
                  label="Contract ID"
                  placeholder=""
                  {...formik.getFieldProps("contractId")}
                />
              </div>
              {props.orderId == null ? (
                <>
                  <div className="col-span-6">
                    <Input
                      type="text"
                      name="orderId"
                      className="!bg-white"
                      label="Order ID"
                      {...formik.getFieldProps("orderId")}
                      placeholder=""
                    />
                  </div>
                  <div className="col-span-6">
                    <Input
                      type="text"
                      name="venderOrder"
                      className="!bg-white"
                      label="Dealer P.O. #"
                      {...formik.getFieldProps("venderOrder")}
                      placeholder=""
                    />
                  </div>
                </>
              ) : (
                ""
              )}

              <div className="col-span-6">
                <Input
                  type="text"
                  name="serial"
                  className="!bg-white"
                  label="Serial # / Device ID"
                  placeholder=""
                  {...formik.getFieldProps("serial")}
                />
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  name="productName"
                  className="!bg-white"
                  label="Product Name"
                  placeholder=""
                  {...formik.getFieldProps("productName")}
                />
              </div>
              {props.orderId == null ? (
                <>
                  {" "}
                  {/* <div className="col-span-6">
                          <Input
                            type="text"
                            name="dealerName"
                            className="!bg-white"
                            label="Dealer Name"
                            {...formik.getFieldProps("dealerName")}
                            placeholder=""
                          />
                        </div> */}
                  {!window.location.pathname.includes("/customerDetails") && (
                    <div className="col-span-6">
                      <Input
                        type="text"
                        name="customerName"
                        className="!bg-white"
                        label="Customer Name"
                        {...formik.getFieldProps("customerName")}
                        placeholder=""
                      />
                    </div>
                  )}
                  <div className="col-span-6">
                    <Input
                      type="text"
                      name="servicerName"
                      className="!bg-white"
                      label="Servicer Name"
                      {...formik.getFieldProps("servicerName")}
                      placeholder=""
                    />
                  </div>
                </>
              ) : (
                ""
              )}

              <div className="col-span-6">
                <Input
                  type="text"
                  name="model"
                  className="!bg-white"
                  label="Model"
                  placeholder=""
                  {...formik.getFieldProps("model")}
                />
              </div>
              <div className="col-span-6">
                <Input
                  type="text"
                  name="manufacture"
                  className="!bg-white"
                  label="Manufacturer"
                  placeholder=""
                  {...formik.getFieldProps("manufacture")}
                />
              </div>
              <div className="col-span-6">
                <Select
                  label="Status"
                  options={status}
                  color="text-Black-Russian opacity-50"
                  value={selectedProduct}
                  // className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                  className="!text-[14px] !bg-white"
                  selectedValue={selectedProduct}
                  onChange={handleSelectChange1}
                />
              </div>
              <div className="col-span-6">
                <Select
                  label="Eligibility"
                  options={Eligible}
                  color="text-Black-Russian opacity-50"
                  value={value}
                  // className1="!pt-1 !pb-1 !text-[13px] !bg-[white]"
                  className="!text-[14px] !bg-white"
                  selectedValue={value}
                  onChange={handleSelectChange2}
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

export default ContractList;
