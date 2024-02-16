import React from "react";
import html2pdf from "html2pdf.js";
import logo from "../assets/images/logo.png";
import { format } from "date-fns";
function PdfGenerator(props) {
  console.log(props.data);
  const convertToPDF = () => {
    const opt = {
      margin: 0,
      filename: "invoice.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(generateHTML()).set(opt).save();
  };

  const generateHTML = () => {
    return `
      <div style="max-width: 100%; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tbody>
                <tr>
                    <td style="text-align: left; width: 50%;">
                        <img src=${logo} style="margin-bottom: 20px;"/>
                        <h1 style="margin: 0; padding: 0; font-size:20px"><b>Get Cover </b></h1>
                        <p style="margin: 0; padding: 0;">13th Street <br/>
                        47 W 13th St, New York,<br/>
                        NY 10011, USA</p>
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
                                      new Date(props?.data?.createdAt),
                                      "MM-dd-yyyy"
                                    )}</td>
                                </tr>
                                <tr>
                                    <td style="border: none; padding: 4px;"><b>Invoice Number:</b></td>
                                    <td style="border: none; padding: 4px;"> ${
                                      props?.data?.unique_key
                                    }</td>
                                </tr>
                                <tr>
                                    <td style="border: none; padding: 4px;"><b>Invoice Total:</b></td>
                                    <td style="border: none; padding: 4px;">$  ${props?.data?.totalOrderAmount?.toLocaleString()}</td>
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
                          props.data?.dealerName?.name
                        } </b></h4>
                        <small style="margin: 0; padding: 0;">Bill To: ${
                          props.data?.dealerName?.street
                        } ${props.data?.dealerName?.city} ,${
      props.data?.dealerName?.state
    } ${props.data?.dealerName?.zip} <br/>
                           
                            </small>
                    </td>
                    <td style="text-align: left; width: 50%;">
                    <h4 style="margin: 0; padding: 0;"><b>Reseller Details:</b></h4>
                    <h4 style="margin: 0; padding: 0;"><b>${
                      props?.data?.resellerName?.name ?? ""
                    }</b></h4>
                    <small style="margin: 0; padding: 0;">Bill To:
                      ${props?.data?.resellerName?.street ?? ""} 
                      ${props?.data?.resellerName?.city ?? ""}, 
                      ${props?.data?.resellerName?.state ?? ""} 
                      ${props?.data?.resellerName?.zip ?? ""} <br/>
                     
                    </small>
                  </td>
                </tr>
            </tbody>
        </table>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tbody>
            <tr>
            <td colspan="2">
        <h4 style="margin: 0; padding: 0;"><b> Customer : </b> ${
          props?.data?.customerName?.username
            ? props?.data?.customerName?.username
            : ""
        } </h4>
        <p><b>Dealer Purchase Order #:</b> ${props.data.venderOrder}</p>
        </td>
        </tr>
        </tbody>
        </table>
        <table style="width: 100%; border-collapse: collapse;">
        <thead style="background-color: #f4f4f4; text-align: left;">
          <tr>
            <th style="border-bottom: 1px solid #ddd; padding: 8px;">S.no.</th>
            <th style="border-bottom: 1px solid #ddd; padding: 8px;">Product Warranty Details</th>
            <th style="border-bottom: 1px solid #ddd; padding: 8px;">Qty</th>
            <th style="border-bottom: 1px solid #ddd; padding: 8px;">Unit Price</th>
            <th style="border-bottom: 1px solid #ddd; padding: 8px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${props?.data?.productsArray
            ?.map(
              (product, index) => `
            <tr key="${index}">
              <td style="border-bottom: 1px solid #ddd; padding: 8px;">${
                index + 1
              }</td>
              <td style="border-bottom: 1px solid #ddd; padding: 8px;">${
                product.description
              }</td>
              <td style="border-bottom: 1px solid #ddd; padding: 8px;">${
                product.noOfProducts
              }</td>
              <td style="border-bottom: 1px solid #ddd; padding: 8px;">$${product.unitPrice
                .toFixed(2)
                .toLocaleString()}</td>
              <td style="border-bottom: 1px solid #ddd; padding: 8px;">$${product.price
                .toFixed(2)
                .toLocaleString()}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4" style="font-weight: bold; padding: 8px; text-align: right;">Total:</td>
            <td style={{ fontWeight: 'bold', padding: '8px' }}>
            $${Number(
              props?.data?.productsArray
                .reduce(
                  (total, product) =>
                    total + product.noOfProducts * product.unitPrice,
                  0
                )
                .toFixed(2)
            ).toLocaleString()}
        
          </td>
          </tr>
        </tfoot>
      </table>
      </div>
    `;
  };

  return (
    <div>
      <button onClick={convertToPDF} className="hover:font-semibold">
        Invoice
      </button>
    </div>
  );
}
export default PdfGenerator;
