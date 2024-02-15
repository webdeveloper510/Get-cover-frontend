import React from "react";
import html2pdf from "html2pdf.js";
import logo from "../assets/images/logo.png";
import { format } from "date-fns";

function PdfMake(props) {
  console.log(props);

  const convertToPDF = () => {
    const opt = {
      margin: 0.1,
      filename: "Export_Order.pdf",
      image: { type: "pdf", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", userUnit: 0.1, putOnlyUsedFonts: true, orientation: 'p' },
    };
    const htmlContent = generateHTML(props.data);

    html2pdf().from(htmlContent).set(opt).save();
  };

  const generateHTML = (data) => {
    const contracts = data?.result?.contract || data?.contract || [];
    const pageSize = 10; // Number of contracts per page
    let pageCount = Math.ceil(contracts.length / pageSize);
    let htmlContent = `<div style=" max-width: 100%; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
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
                        <td colspan="2" style="text-align: right; padding-right: 20px; padding-bottom: 40px;"> <b style="margin: 0; padding-bottom: 40px; font-size:30px;">Export Order</b></td>
                    </tr>
                        <tr>
                            <td> <b> Order ID : </b> </td> 
                            <td>
                            ${data?.result?.venderOrder
        ? data.result.venderOrder
        : data.venderOrder
      }
                            </td>
                        </tr>
                        <tr>
                            <td> <b> Dealer P.O. # : </b> </td> 
                            <td>
                            ${data?.result?.venderOrder
        ? data.result.venderOrder
        : data.venderOrder
      }
                            </td>
                        </tr>
                        <tr>
                          <td> <b>Service Coverage : </b> </td>
                          <td>
                          ${data?.result?.serviceCoverageType
        ? data.result.serviceCoverageType
        : data.serviceCoverageType
      }
                          </td>
                          </tr>
                          <tr>
                          <td> <b> Coverage Type : </b> </td>
                          <td>  ${data?.result?.coverageType
        ? data.result.coverageType
        : data.coverageType
      }</td>
                        </tr>
        
                    </tbody>
                </table>
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
                    <h4 style="margin: 0; padding: 0;"><b>  ${data?.orderUserData?.dealerData?.name ??
                          data?.dealerName?.name
                          }</b></h4>
                    <small style="margin: 0; padding: 0;">Bill To: UserName <br/>
                    ${data?.orderUserData?.dealerData?.street ??
                    data?.dealerName?.street
                    } ${data?.orderUserData?.dealerData?.city ??
                    data?.dealerName?.city
                    } ,${data?.orderUserData?.dealerData?.state ??
                    data?.dealerName?.state
                    } ${data?.orderUserData?.dealerData?.zip ?? data?.dealerName?.zip
                    }
                      <br/>
                      9874563210 | Example@gmail.com
                        </small>
                </td>
                <td style="text-align: left; width: 50%;">
                    <h4 style="margin: 0; padding: 0;"><b>Reseller Details:</b></h4>
                    <h4 style="margin: 0; padding: 0;"><b> ${data?.orderUserData?.resellerData?.name
                        ? data?.orderUserData?.resellerData?.name
                        : data?.resellerName?.name
                      }</b></h4>
                    <small style="margin: 0; padding: 0;">Bill To: UserName <br/>
                    ${data?.orderUserData?.dealerData?.street ??
                    data?.dealerName?.street
                    } ${data?.orderUserData?.dealerData?.city ??
                    data?.dealerName?.city
                    } ,${data?.orderUserData?.dealerData?.state ??
                    data?.dealerName?.state
                    } ${data?.orderUserData?.dealerData?.zip ?? data?.dealerName?.zip
                    }
                    <br/>
                    9874563210 | Example@gmail.com
                      </small>
                </td>
                </tr>
                </tbody>
            </table>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tbody>
                    <tr>
            <td style="text-align: left; margin-top:40px; width: 50%;">
            <h4 style="margin: 0; padding: 0;"><b>Customer Details: </b></h4>
            <h4 style="margin: 0; padding: 0;"><b> ${data?.orderUserData?.customerData?.username
                    ? data?.orderUserData?.customerData?.username
                    : data?.customerName?.username
                  } </b></h4>
                        <small style="margin: 0; padding: 0;"> ${data?.orderUserData?.customerData?.street
                    ? data?.orderUserData?.customerData?.street
                    : data?.customerName?.street
                  } 
                        ${data?.orderUserData?.customerData?.city
                    ? data?.orderUserData?.customerData?.city
                    : data?.customerName?.city
                  }, 
                        ${data?.orderUserData?.customerData?.state
                    ? data?.orderUserData?.customerData?.state
                    : data?.customerName?.state
                  } 
                        ${data?.orderUserData?.customerData?.zip
                    ? data?.orderUserData?.customerData?.zip
                    : data?.customerName?.zip
                  } <br/>
          
                </small>
        </td>
        <td style="text-align: left; width: 50%;">
            <h4 style="margin: 0; padding: 0;"><b>Servicer Details:</b></h4>
            <h4 style="margin: 0; padding: 0;"><b> ${data?.orderUserData?.servicerData?.name
        ? data?.orderUserData?.servicerData?.name
        : data.servicerName?.name
      } </b></h4>
            <small style="margin: 0; padding: 0;"> ${data?.orderUserData?.servicerData?.street
        ? data?.orderUserData?.servicerData?.street
        : data.servicerName?.street
      } 
              ${data?.orderUserData?.servicerData?.city
        ? data?.orderUserData?.servicerData?.city
        : data.servicerName?.city
      }, 
              ${data?.orderUserData?.servicerData?.state
        ? data?.orderUserData?.servicerData?.state
        : data.servicerName?.state
      } 
              ${data?.orderUserData?.servicerData?.zip
        ? data?.orderUserData?.servicerData?.zip
        : data.servicerName?.zip
      } <br/>
                </small>
        </td>
            </tr>
        </tbody>
    </table>

    <table style="width: 100%; border-collapse: collapse;">
      <tbody style=" text-align: left;">
        <tr>
          <td><b>Product Category</b> : product-001</td>
          <td><b> Product Name </b> : product-001</td>
        </tr>
        </tbody>
        </table>
        <table style= "">
        <tbody>
        <tr>
        <td><b> Product Description </b> : product-001</td>
        </tr>
        </tbody>
        </table>
        <table style="width: 100%; border-collapse: collapse; margin-bottom:40px">
        <tbody style=" text-align: left;">
        <tr>
          <td><b> Term </b>: product-001</td>
          <td><b> Unit Price </b> : product-001</td>
          <td><b> # of Products </b> : product-001</td>
        </tr>
        <tr>
          <td><b> Price </b>: product-001</td>
          <td><b> Coverage Start Date </b> : 02/14/2024 </td>
          <td><b> Coverage End Date </b> : 02/14/2030 </td>
        </tr>
      </tbody>
    </table> 
   `;

    for (let page = 0; page < pageCount; page++) {
      // Start of a new page
      htmlContent += `
          
            <table  style=" page-break-before: ${page === 0 ? 'auto' : 'always'}; width: 100%; border-collapse: collapse;">
                <thead style="background-color: #f4f4f4; text-align: left;">
                    <tr>
                        <th style="border-bottom: 1px solid #ddd; padding: 8px;">S.no.</th>
                        <th style="border-bottom: 1px solid #ddd; padding: 8px;">Brand</th>
                        <th style="border-bottom: 1px solid #ddd; padding: 8px;">Model</th>
                        <th style="border-bottom: 1px solid #ddd; padding: 8px;">Serial</th>
                        <th style="border-bottom: 1px solid #ddd; padding: 8px;">Retail Price</th>
                        <th style="border-bottom: 1px solid #ddd; padding: 8px;">Condition</th>
                        <th style="border-bottom: 1px solid #ddd; padding: 8px;">Claimed Value</th>
                    </tr>
                </thead>
                <tbody>
                ${contracts
          ?.slice(page * pageSize, (page + 1) * pageSize)
          ?.map(
            (contract, index) => `
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">${index + 1
              }</td>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">${contract.manufacture
              } </td>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">${contract.manufacture
              }</td>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">${contract.serial
              }</td>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">$ ${parseInt(
                contract.productValue
              ).toFixed(2)}</td>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">${contract.condition
              }</td>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">$ ${parseInt(
                contract.claimAmount
              ).toFixed(2)}</td>
                  </tr>
                `
          )
          .join("")}
              </tbody>
            </table>
            `;
           
    }

    return htmlContent;
  };

  return (
    <div>
      <button onClick={convertToPDF}>Export Order</button>
    </div>
  );
}
export default PdfMake;
