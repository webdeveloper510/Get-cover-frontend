import React from "react";
import html2pdf from "html2pdf.js";
import logo from "../assets/images/logo.png";
import { format } from "date-fns";

function PdfMake(props) {
  console.log(props);

  const convertToPDF = () => {
    const opt = {
      margin: 0,
      filename: "Export_Order.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(generateHTML()).set(opt).save();
  };

  const generateHTML = () => {
    const contracts =
      props?.data?.result?.contract || props?.data?.contract || [];
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
                                <td colspan="2" style="text-align: right; padding-right: 20px; padding-bottom: 40px;"> <b style="margin: 0; padding-bottom: 40px; font-size:30px;">Export Order</b></td>
                            </tr>
                                <tr>
                                    <td> <b> Order ID : </b> </td> 
                                    <td>
                                    ${
                                      props?.data?.result?.venderOrder
                                        ? props.data.result.venderOrder
                                        : props.data.venderOrder
                                    }
                                    </td>
                                </tr>
                                <tr>
                                    <td> <b> Dealer P.O. # : </b> </td> 
                                    <td>
                                    ${
                                      props?.data?.result?.venderOrder
                                      ? props.data.result.venderOrder
                                      : props.data.venderOrder
                                    }
                                    </td>
                                </tr>
                                <tr>
                                  <td> <b>Service Coverage : </b> </td>
                                  <td>
                                  ${
                                    props?.data?.result?.serviceCoverageType
                                      ? props.data.result.serviceCoverageType
                                      : props.data.serviceCoverageType
                                  }
                                  </td>
                                  </tr>
                                  <tr>
                                  <td> <b> Coverage Type : </b> </td>
                                  <td>  ${
                                    props?.data?.result?.coverageType
                                      ? props.data.result.coverageType
                                      : props.data.coverageType
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
                            <h4 style="margin: 0; padding: 0;"><b>  ${
                              props?.data?.orderUserData?.dealerData?.name ??
                              props?.data?.dealerName?.name
                            }</b></h4>
                            <small style="margin: 0; padding: 0;">Bill To: UserName <br/>
                            ${
                              props.data?.orderUserData?.dealerData?.street ??
                              props?.data?.dealerName?.street
                            } ${
                                props.data?.orderUserData?.dealerData?.city ??
                                props?.data?.dealerName?.city
                              } ,${
                                props.data?.orderUserData?.dealerData?.state ??
                                props?.data?.dealerName?.state
                              } ${
                                props.data?.orderUserData?.dealerData?.zip ?? props?.data?.dealerName?.zip
                              }
                              <br/>
                              9874563210 | Example@gmail.com
                                </small>
                        </td>
                        <td style="text-align: left; width: 50%;">
                            <h4 style="margin: 0; padding: 0;"><b>Reseller Details:</b></h4>
                            <h4 style="margin: 0; padding: 0;"><b> ${
                              props?.data?.orderUserData?.resellerData?.name
                                ? props?.data?.orderUserData?.resellerData?.name
                                : props?.data?.resellerName?.name
                            }</b></h4>
                            <small style="margin: 0; padding: 0;">Bill To: UserName <br/>
                            ${
                              props.data?.orderUserData?.dealerData?.street ??
                              props?.data?.dealerName?.street
                            } ${
                                props.data?.orderUserData?.dealerData?.city ??
                                props?.data?.dealerName?.city
                              } ,${
                                props.data?.orderUserData?.dealerData?.state ??
                                props?.data?.dealerName?.state
                              } ${
                                props.data?.orderUserData?.dealerData?.zip ?? props?.data?.dealerName?.zip
                              }
                              <br/>
                              9874563210 | Example@gmail.com
                                </small>
                        </td>
                    </tr>
                    <tr >
                    <td style="text-align: left; margin-top:40px; width: 50%;">
                    <h4 style="margin: 0; padding: 0;"><b>Customer Details: </b></h4>
                    <h4 style="margin: 0; padding: 0;"><b> ${
                      props?.data?.orderUserData?.customerData?.username
                        ? props?.data?.orderUserData?.customerData?.username
                        : props?.data?.customerName?.username
                    } </b></h4>
                    <small style="margin: 0; padding: 0;"> ${
                      props?.data?.orderUserData?.customerData?.street
                        ? props?.data?.orderUserData?.customerData?.street
                        : props?.data?.customerName?.street
                    } 
                    ${
                      props?.data?.orderUserData?.customerData?.city
                        ? props?.data?.orderUserData?.customerData?.city
                        : props?.data?.customerName?.city
                    }, 
                    ${
                      props?.data?.orderUserData?.customerData?.state
                        ? props?.data?.orderUserData?.customerData?.state
                        : props?.data?.customerName?.state
                    } 
                    ${
                      props?.data?.orderUserData?.customerData?.zip
                        ? props?.data?.orderUserData?.customerData?.zip
                        : props?.data?.customerName?.zip
                    } <br/>
                  
                        </small>
                </td>
                <td style="text-align: left; width: 50%;">
                    <h4 style="margin: 0; padding: 0;"><b>Servicer Details:</b></h4>
                    <h4 style="margin: 0; padding: 0;"><b> ${
                      props?.data?.orderUserData?.servicerData?.name
                        ? props?.data?.orderUserData?.servicerData?.name
                        : props?.data.servicerName?.name
                    } </b></h4>
                    <small style="margin: 0; padding: 0;"> ${
                      props?.data?.orderUserData?.servicerData?.street
                        ? props?.data?.orderUserData?.servicerData?.street
                        : props?.data.servicerName?.street
                    } 
                      ${
                        props?.data?.orderUserData?.servicerData?.city
                          ? props?.data?.orderUserData?.servicerData?.city
                          : props?.data.servicerName?.city
                      }, 
                      ${
                        props?.data?.orderUserData?.servicerData?.state
                          ? props?.data?.orderUserData?.servicerData?.state
                          : props?.data.servicerName?.state
                      } 
                      ${
                        props?.data?.orderUserData?.servicerData?.zip
                          ? props?.data?.orderUserData?.servicerData?.zip
                          : props?.data.servicerName?.zip
                      } <br/>
                        </small>
                </td>
                    </tr>
                </tbody>
            </table>
        
            <table style="width: 100%; border-collapse: collapse; margin-bottom:40px">
              <tbody style=" text-align: left;">
                <tr>
                  <td><b>Product Category</b> : product-001</td>
                  <td><b> Product Name </b> : product-001</td>
                  <td><b> Product Description </b> : product-001</td>
                </tr>
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
            <table style="width: 100%; border-collapse: collapse;">
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
                  ?.map(
                    (contract, index) => `
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">${
                      index + 1
                    }</td>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">${
                      contract.manufacture
                    } </td>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">${
                      contract.manufacture
                    }</td>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">${
                      contract.serial
                    }</td>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">$ ${parseInt(
                      contract.productValue
                    ).toFixed(2)}</td>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">${
                      contract.condition
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
          </div>
        `;
  };

  return (
    <div>
      <button onClick={convertToPDF}>Export Order</button>
    </div>
  );
}
export default PdfMake;
