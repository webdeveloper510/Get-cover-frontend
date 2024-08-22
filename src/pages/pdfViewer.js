import React from "react";
import html2pdf from "html2pdf.js";
import logo from "../assets/images/Get-Cover.png";
import download from "../assets/images/download.png";
import { format } from "date-fns";
import { orderDetailsById } from "../services/orderServices";
import { useState } from "react";
import { ToWords } from "to-words";
function PdfGenerator(props, className) {
  const { setLoading } = props;

  const toWords = new ToWords({
    localeCode: "en-IN",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
      currencyOptions: {
        name: "Dollar",
        plural: "Dollar",
        symbol: "$",
        fractionalUnit: {
          name: "",
          plural: "",
          symbol: "",
        },
      },
    },
  });

  const formatPhoneNumber = (phoneNumber) => {
    const cleaned = ("" + phoneNumber).replace(/\D/g, ""); // Remove non-numeric characters
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/); // Match groups of 3 digits

    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    return phoneNumber; // Return original phone number if it couldn't be formatted
  };
  const [data, setData] = useState({});
  console.log("props", props);

  const convertToPDF = async () => {
    setLoading(true);
    const result = await orderDetailsById(props.data);
    // console.log(result, '-----Invoice--------------')
    let value = {
      dealerName: result.orderUserData.dealerData,
      customerName: result.orderUserData.customerData,
      resellerName: result.orderUserData.resellerData,
      totalOrderAmount: result.result.orderAmount,
      customerUserData: result.orderUserData.customerUserData,
      username: result.orderUserData.username,
      resellerUsername: result.orderUserData.resellerUsername,
      ...result.result,
    };

    const opt = {
      margin: 0,
      filename: `${value.unique_key}-Invoice.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    try {
      const pdf = html2pdf().from(generateHTML(value)).set(opt);
      pdf.save();
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
    setLoading(false);
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
  const generateHTML = (data) => {
    return `
      <style>
      * {
        text-shadow: none !important;
        font-family: Arial, Helvetica, sans-serif;
      }
    </style>
      <div style="max-width: 100%; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 8px;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tbody>
                <tr>
                    <td style="text-align: left; width: 50%;">
                        <img src=${logo} style="margin-bottom: 20px; width:200px"/>
                        <h1 style="margin: 0; padding: 0; font-size:20px"><b>Get Cover </b></h1>
                        <p style="margin: 0; padding: 0;">9701 Wilshire Blvd., Suite 930 <br/> Beverly Hills, CA 90212 </p>
                    </td>
                    <td style=" width: 50%;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr>
                                    <td colspan="2" style="text-align: right; padding-right: 20px; padding-bottom: 40px;"> <b style="margin: 0; padding-bottom: 40px; font-size:30px">Invoice</b></td>
                                </tr>
                                <tr>
                                    <td style="border: none; padding: 4px;"><b>Invoice Date:</b></td>
                                    <td style="border: none; padding: 4px;">${format(
                                      new Date(data?.createdAt),
                                      "MM/dd/yyyy"
                                    )}</td>
                                </tr>
                                <tr>
                                    <td style="border: none; padding: 4px;"><b>Invoice Number:</b></td>
                                    <td style="border: none; padding: 4px;"> ${
                                      data?.unique_key
                                    }</td>
                                </tr>
                                <tr>
                                    <td style="border: none; padding: 4px;"><b>Invoice Total:</b></td>
                                    <td style="border: none; padding: 4px;">$${
                                      data?.totalOrderAmount === undefined
                                        ? parseInt(0).toLocaleString(2)
                                        : formatOrderValue(
                                            data?.totalOrderAmount
                                          )
                                    }</td>
                                </tr>
                                <tr>
                                    <td style="border: none; padding: 4px;">Currency Type:</td>
                                    <td style="border: none; padding: 4px;">USD</td>
                                </tr>
                            </thead>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tbody>
                <tr>
                    <td style="text-align: left; width: 50%;">
                        <h4 style="margin: 0; padding: 0;"><b>Dealer Details: </b></h4>
                        <h4 style="margin: 0; padding: 0;"><b> ${
                          data?.dealerName?.name
                        } </b></h4>
                        <p style="margin: 0; padding: 0;">${
                          data.billDetail.billTo === "Dealer"
                            ? " <b> Bill To:</b>"
                            : "Address :"
                        } ${data?.username?.firstName} 
                         ${data?.username?.lastName} <br/>
                          ${data?.dealerName?.street}, 
                          ${data?.dealerName?.city}, 
                          ${data?.dealerName?.state},
                          ${data?.dealerName?.zip} <br/>
                           
                            </p>
                            <p> +1 ${formatPhoneNumber(
                              data?.username?.phoneNumber
                            )} | ${data?.username?.email}  </p>
                    </td>
                    ${
                      data?.resellerId != null
                        ? `    <td style="text-align: left; width: 50%;">
                    <h4 style="margin: 0; padding: 0;"><b>Reseller Details:</b></h4>
                    <h4 style="margin: 0; padding: 0;"><b>${
                      data?.resellerName?.name ?? ""
                    }</b></h4>
                    <p style="margin: 0; padding: 0;">${
                      data.billDetail.billTo === "Reseller"
                        ? " <b> Bill To:</b>"
                        : "Address :"
                    } ${data?.resellerUsername?.firstName} ${
                            data?.resellerUsername?.lastName
                          } <br/>
                      ${data?.resellerName?.street ?? ""}, 
                      ${data?.resellerName?.city ?? ""},  
                      ${data?.resellerName?.state ?? ""}, 
                      ${data?.resellerName?.zip ?? ""} <br/>
                     
                    </p>
                    <p> +1 ${formatPhoneNumber(
                      data?.resellerUsername?.phoneNumber
                    )} | ${data?.resellerUsername?.email}  </p>
                  </td> `
                        : ""
                    }
                </tr>
                <tr>
                <td style="text-align: left; width: 50%; padding-top: 20px;">
                ${
                  data?.customerId != null
                    ? `
                <h4 style="margin: 0; padding: 0;"><b>Customer Details: </b></h4>
                <h4 style="margin: 0; padding: 0;"><b> ${
                  data?.customerName?.username
                } </b></h4>
                <p style="margin: 0; padding: 0;">Address: ${
                  data?.customerUserData?.firstName
                } ${data?.customerUserData?.lastName} <br/>
                     ${data?.customerName?.street}, ${
                        data?.customerName?.city
                      }, ${data?.customerName?.state}, ${
                        data?.customerName?.zip
                      } <br/>
                   
                    </p>
                    <p> +1 ${formatPhoneNumber(
                      data?.customerUserData?.phoneNumber
                    )} | ${data?.customerUserData?.email}  </p>
            </td>
            `
                    : ""
                }
         
                </tr>
                </tbody>
                </table>
                ${
                  data.billDetail.billTo === "Custom"
                    ? `
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;text-shadow: none !important;outline: none;">
                    <tbody>
                    <tr>
                <td style="text-align: left; width: 50%;">
                <h4 style="margin: 0; padding: 0;"><b>Billing Details: </b></h4>
                <h4 style="margin: 0; padding: 0;"><b> ${
                  data?.billDetail?.detail?.name
                } </b></h4>
                <p style="margin: 0; padding: 0;">Address : ${
                  data?.billDetail?.detail?.address
                } <br/>
                   
                    </p>
                    <p>
                    ${
                      data?.billDetail?.detail?.phoneNumber !== ""
                        ? `+1 ${formatPhoneNumber(
                            data?.billDetail?.detail?.phoneNumber
                          )} |`
                        : ""
                    }
                       ${
                         data?.billDetail?.detail?.email !== ""
                           ? `${data?.billDetail?.detail?.email}`
                           : ""
                       }   </p>
            </td>
                </tr> 
               
            </tbody>
        </table> `
                    : `  `
                }
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;text-shadow: none !important;outline: none;">
        <tbody>
            <tr>
            <td colspan="2">
        <p><b>Dealer Purchase Order #:</b> ${data.venderOrder}</p>
        </td>
        </tr>
        </tbody>
        </table>
        <table style="width: 100%; border-collapse: collapse;">
        <thead style="background-color: #f4f4f4; text-align: left;">
          <tr>
            <th style="border-bottom: 1px solid #ddd; padding: 8px;">Sr.No.</th>
            <th style="border-bottom: 1px solid #ddd; padding: 8px;">Product Warranty Details</th>
            <th style="border-bottom: 1px solid #ddd; padding: 8px;">Qty</th>
            <th style="border-bottom: 1px solid #ddd; padding: 8px;">Unit Price</th>
            <th style="border-bottom: 1px solid #ddd; padding: 8px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${data?.productsArray
            ?.map(
              (product, index) => `
            <tr key="${index}">
              <td style="border-bottom: 1px solid #ddd; padding: 8px;">${
                index + 1
              }</td>
              <td style="border-bottom: 1px solid #ddd; padding: 8px;">${
                product.name
              }</td>
              <td style="border-bottom: 1px solid #ddd; padding: 8px;">${
                product.noOfProducts
              }</td>
              <td style="border-bottom: 1px solid #ddd; padding: 8px;">$${
                product.unitPrice === undefined
                  ? parseInt(0).toLocaleString(2)
                  : formatOrderValue(product.unitPrice)
              }</td>
              <td style="border-bottom: 1px solid #ddd; padding: 8px;">$${
                product.price === undefined
                  ? parseInt(0).toLocaleString(2)
                  : formatOrderValue(product.price)
              }</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4" style="font-weight: bold; padding: 8px; text-align: right;">Total:</td>
            <td style={{ fontWeight: 'bold', padding: '8px' }}>
            $${
              Number(
                data?.productsArray.reduce(
                  (total, product) =>
                    total + product.noOfProducts * product.unitPrice,
                  0
                )
              ) === undefined
                ? parseInt(0).toLocaleString(2)
                : formatOrderValue(
                    Number(
                      data?.productsArray.reduce(
                        (total, product) =>
                          total + product.noOfProducts * product.unitPrice,
                        0
                      )
                    )
                  )
            }
        
          </td>
         
          </tr>
          <tr>
          <th colspan='5' style="text-align:left; padding-right:20px;">
          ${toWords.convert(
            data?.productsArray.reduce(
              (total, product) =>
                total + product.noOfProducts * product.unitPrice,
              0
            ),
            { currency: true }
          )}
        </th>
          </tr>
        </tfoot>
      </table>
      <table style="width: 80%; border-collapse: collapse; margin-bottom: 20px; margin-top:40px; text-align:left;text-shadow: none !important;outline: none;">
      <tbody>
         <tr>
          <th >
            <p style="font-size:20px;padding-bottom:5px;"><b>Bank Details:</b></p>
            <hr/>
          </th>
          <th></th>
         </tr>
         <tr>
            <th>Bank Name: </th>
            <td>PCB BANK</td>
         </tr>
         <tr>
          <th>Account Name: </th>
          <td> GET COVER LLC</td>
         </tr>
         <tr>
          <th>Account Number:  </th>
          <td>12405759</td>
         </tr>
         <tr>
          <th>Routing Number :  </th>
          <td>122043602</td>
         </tr>
      </tbody>
      </table>
      </div>
    `;
  };

  return (
    <div
      className={`text-left flex py-1 px-2  ${className}`}
      onClick={convertToPDF}
    >
      <img src={download} className="w-4 h-4 mr-2" />
      <button className="">Invoice</button>
    </div>
  );
}
export default PdfGenerator;
