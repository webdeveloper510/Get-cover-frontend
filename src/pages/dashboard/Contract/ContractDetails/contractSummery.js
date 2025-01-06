import React from 'react'
import SingleView from '../../../../common/singleView'
import Grid from '../../../../common/grid'
import CommonTooltip from '../../../../common/toolTip'
import Card from '../../../../common/card';

function ContractSummary(props) {
  console.log(props.data, 'data');
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
  return (
    // <></>
    <Card className="mt-6 border-[1px] border-Light-Grey rounded-xl">

      <div className=" my-5 ">
        <Grid className="!gap-0 !grid-cols-5 ">
          <div className="col-span-1 border border-Light-Grey">
            <div className="py-4 px-3">
              <p className=" text-sm font-Regular">
                Manufacturer
              </p>
              <p className=" text-base font-semibold">
                {props.data?.manufacture}
              </p>
            </div>
          </div>
          <div className="col-span-1 border border-Light-Grey">
            <div className="py-4 px-3">
              <p className=" text-sm font-Regular">
                Model
              </p>
              <p className=" text-base font-semibold">
                {props.data?.model}
              </p>
            </div>
          </div>
          <div className="col-span-1 border border-Light-Grey">
            <div className="py-4 px-3">
              <p className=" text-sm font-Regular">
                Serial # / Device ID
              </p>
              <p className=" text-base font-semibold break-words">
                {props.data?.serial}
              </p>
            </div>
          </div>
          <div className="col-span-1 border border-Light-Grey ">
            <div className="py-4 px-3">
              <p className=" text-sm font-Regular">
                Condition
              </p>
              <p className=" text-base font-semibold">
                {props.data.condition}
              </p>
            </div>
          </div>
          {props.type == "customer" ? <></> :
            <div className="col-span-1 border border-Light-Grey ">
              <div className="py-4 px-3">
                <p className=" text-sm font-Regular">
                  Retail Price
                </p>
                <p className=" text-base font-semibold">
                  $
                  {props.data.productValue === undefined
                    ? parseInt(0).toLocaleString(2)
                    : formatOrderValue(
                      Number(props.data.productValue) ??
                      parseInt(0)
                    )}
                </p>
              </div>
            </div>}

          <div className="col-span-1 border border-Light-Grey">
            <div className="py-4 px-3">
              <p className=" text-sm font-Regular">
                Product Category
              </p>
              <p className=" text-base font-semibold">
                {
                  props.data?.order?.[0]?.productsArray?.[0]
                    ?.priceBook?.[0].category.name
                }
              </p>
            </div>
          </div>
          <div className="col-span-1 border border-Light-Grey">
            <div className="py-4 px-3">
              <p className=" text-sm font-Regular">
                Product SKU
              </p>
              <p className=" text-base font-semibold">
                {props.data?.productName}
              </p>
            </div>
          </div>
          <div className="col-span-1 border border-Light-Grey">
            <div className="py-4 px-3">
              <p className=" text-sm font-Regular">
                Dealer SKU
              </p>
              <p className=" text-base font-semibold">
                {props.data?.dealerSku}
              </p>
            </div>
          </div>
          <div className="col-span-2 border border-Light-Grey">
            <div className="py-4 px-3">
              <p className=" text-sm font-Regular">
                Product Name
              </p>
              <p className=" text-base font-semibold">
                {props.data?.pName}
              </p>
            </div>
          </div>
          <div className="col-span-2 border border-Light-Grey">
            <div className="py-4 px-3">
              <p className=" text-sm font-Regular">
                Product Description
              </p>
              <p className=" text-base font-semibold">
                {
                  props.data?.order?.[0]?.productsArray?.[0]
                    ?.description
                }
              </p>
            </div>
          </div>
          <div className="col-span-1 border border-Light-Grey">
            <div className="py-4 px-3">
              <p className=" text-sm font-Regular">
                Price Type
              </p>
              <p className=" text-base font-semibold">
                {
                  props.data?.order?.[0]?.productsArray?.[0]
                    ?.priceType
                }
              </p>
            </div>
          </div>
          {props.type == "customer" ? <></> :
            <div className="col-span-1 border border-Light-Grey">
              <div className="py-4 px-3">
                <p className=" text-sm font-Regular">
                  Claim Amount
                </p>
                <p className=" text-base font-semibold">
                  $
                  {props.data.claimAmount === undefined
                    ? parseInt(0).toLocaleString(2)
                    : formatOrderValue(
                      props.data.claimAmount ?? parseInt(0)
                    )}
                </p>
              </div>
            </div>}
          {props.data?.order?.[0]?.productsArray?.[0]
            ?.priceType == "Flat Pricing" ? (
            <>
              <div className="col-span-1 border border-Light-Grey">
                <div className="py-4 px-3">
                  <p className=" text-sm font-Regular">
                    Start Range
                  </p>
                  <p className=" text-base font-semibold">
                    $
                    {props.data?.order?.[0]?.productsArray?.[0]
                      ?.rangeStart === undefined
                      ? parseInt(0).toLocaleString(2)
                      : formatOrderValue(
                        props.data?.order?.[0]
                          ?.productsArray?.[0]?.rangeStart ??
                        parseInt(0)
                      )}
                  </p>
                </div>
              </div>
              <div className="col-span-1 border border-Light-Grey">
                <div className="py-4 px-3">
                  <p className=" text-sm font-Regular">
                    End Range
                  </p>
                  <p className=" text-base font-semibold">
                    $
                    {props.data?.order?.[0]?.productsArray?.[0]
                      ?.rangeEnd === undefined
                      ? parseInt(0).toLocaleString(2)
                      : formatOrderValue(
                        props.data?.order?.[0]
                          ?.productsArray?.[0]?.rangeEnd ??
                        parseInt(0)
                      )}{" "}
                  </p>
                </div>
              </div>
            </>
          ) : (
            ""
          )}
          <div className="col-span-1 border border-Light-Grey ">
            <div className="py-4 px-3">
              <p className=" text-sm font-Regular">
                Coverage Start Date
              </p>
              <p className=" text-base font-semibold">
                {new Date(
                  props.data?.order?.[0]?.productsArray?.[0]?.coverageStartDate1
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
              <p className=" text-sm font-Regular">
                Coverage End Date
              </p>
              <p className=" text-base font-semibold">
                {new Date(
                  props.data?.order?.[0]?.productsArray?.[0]?.coverageEndDate1
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
              <p className=" text-sm font-Regular">
                Manufacturer Labour Warranty End Date
              </p>
              <p className=" text-base font-semibold">
                {new Date(
                  props.data?.labourWarranty
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
              <p className=" text-sm font-Regular">
                Manufacturer Parts Warranty End Date
              </p>
              <p className=" text-base font-semibold">
                {new Date(
                  props.data?.partsWarranty
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
              <p className=" text-sm font-Regular">
                Purchase Date
              </p>
              <p className=" text-base font-semibold">
                {new Date(
                  props.data?.purchaseDate
                ).toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          {props.data?.order?.[0]?.productsArray?.[0]
            ?.priceType == "Quantity Pricing" ? (
            <>
              <div className="col-span-5">
                <table className="w-full border text-center">
                  <tr className="border staticTable">
                    <th colSpan={"3"}>Quantity Pricing List </th>
                  </tr>
                  <tr className="border staticTable">
                    <th className="w-1/3">Name</th>
                    <th className="w-1/3"> Quantity Per Unit</th>
                    <th className="w-1/3"> Quantity</th>
                  </tr>
                  {props.data?.order?.[0].productsArray?.[0]
                    ?.QuantityPricing.length !== 0 &&
                    props.data?.order?.[0].productsArray?.[0]?.QuantityPricing.map(
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
                props.data?.noOfClaim?.value == "-1"
                  ? ""
                  : `${props.data?.noOfClaim?.period} - `
              }
              {" "}
              {props.data?.noOfClaim?.value == -1
                ? "Unlimited"
                : props.data?.noOfClaim?.value}
            </p>
          </div>
          <div className="col-span-3 border border-Light-Grey pl-4">
            <p className="text-base mb-2 text-left font-semibold">
              # of Claims in Coverage<br /> Period
            </p>
            <p className="text-[14px] text-left font-semibold">
              {props.data?.noOfClaimPerPeriod == -1
                ? "Unlimited"
                : props.data?.noOfClaimPerPeriod}
            </p>
          </div>
          <div className="col-span-3 border border-Light-Grey pl-4">
            <p className=" text-base mb-2 text-left font-semibold">
              {" "}
              Is manufacturer warranty included?
            </p>
            <p className="text-[14px] text-left font-semibold">
              {props.data?.isManufacturerWarranty == true
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
              {props.data?.isMaxClaimAmount == true
                ? "Yes"
                : "No"}
            </p>
          </div>
          <div className="col-span-12">
            <table className="w-full border text-center">
              <tr className="border staticTable">
                <th>Coverage Type</th>
                <th>Waiting Days</th>
                <th>Deductible</th>
              </tr>

              {props.data?.mergedData &&
                props.data?.mergedData.length > 0 && (
                  <>
                    {props.data?.mergedData.map((type, index) => (
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
    </Card>
  )
}

export default ContractSummary
