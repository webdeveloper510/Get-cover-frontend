import React from 'react';
import html2pdf from 'html2pdf.js';
import logo from '../assets/images/logo.png'
class PdfMake extends React.Component {
  convertToPDF = () => {
    const opt = {
      margin:       0,
      filename:     'Export_Order.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(this.generateHTML()).set(opt).save();
  }

  generateHTML = () => {
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
                            <td colspan="2" style="text-align: right; padding-right: 20px; padding-bottom: 40px;"> <b style="margin: 0; padding-bottom: 40px; font-size:30px">Export Order</b></td>
                        </tr>
                                <tr>
                                    <td style="border: none; padding: 4px;">Invoice Date:</td>
                                    <td style="border: none; padding: 4px;">20/06/2024</td>
                                </tr>
                                <tr>
                                    <td style="border: none; padding: 4px;"><b>Invoice Number:</b></td>
                                    <td style="border: none; padding: 4px;"><b> CI-2024-10000</b></td>
                                </tr>
                                <tr>
                                    <td style="border: none; padding: 4px;"><b>Invoice Total:</b></td>
                                    <td style="border: none; padding: 4px;"><b>$250.00</b></td>
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
                        <h4 style="margin: 0; padding: 0;"><b> Vertex Leadership </b></h4>
                        <small style="margin: 0; padding: 0;">Bill To: Vertex Leadership Group 2528 Ave Germantown, Tennessee 38139 <br/>
                            Amanda Foley | afoley@vertexlg.com <br/>
                            </small>
                    </td>
                    <td style="text-align: left; width: 50%;">
                        <h4 style="margin: 0; padding: 0;"><b>Reseller Details:</b></h4>
                        <h4 style="margin: 0; padding: 0;"><b> Vertex Leadership </b></h4>
                        <small style="margin: 0; padding: 0;">Bill To: Vertex Leadership Group 2528 Ave Germantown, Tennessee 38139 <br/>
                            Amanda Foley | afoley@vertexlg.com 
                            </small>
                    </td>
                </tr>
                <tr >
                <td style="text-align: left; margin-top:40px; width: 50%;">
                <h4 style="margin: 0; padding: 0;"><b>Customer Details: </b></h4>
                <h4 style="margin: 0; padding: 0;"><b> Vertex Leadership </b></h4>
                <small style="margin: 0; padding: 0;">Bill To: Vertex Leadership Group 2528 Ave Germantown, Tennessee 38139 <br/>
                    Amanda Foley | afoley@vertexlg.com <br/>
                    </small>
            </td>
            <td style="text-align: left; width: 50%;">
                <h4 style="margin: 0; padding: 0;"><b>Servicer Details:</b></h4>
                <h4 style="margin: 0; padding: 0;"><b> Vertex Leadership </b></h4>
                <small style="margin: 0; padding: 0;">Bill To: Vertex Leadership Group 2528 Ave Germantown, Tennessee 38139 <br/>
                    Amanda Foley | afoley@vertexlg.com 
                    </small>
            </td>
                </tr>
            </tbody>
        </table>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tbody>
                <tr>
                    <td> <b> Dealer P.O. # : </b> NIK-001</td>
                    <td> <b>Service Coverage : </b> Parts</td>
                    <td> <b> Coverage Type : </b> Accidental</td>
                </tr>
                
            </tbody>
        </table>
        <table style="width: 100%; border-collapse: collapse;">
            <thead style="background-color: #f4f4f4; text-align: left;">
                <tr>
                    <th style="border-bottom: 1px solid #ddd; padding: 8px;">S.no.</th>
                    <th style="border-bottom: 1px solid #ddd; padding: 8px;">Manufacturer</th>
                    <th style="border-bottom: 1px solid #ddd; padding: 8px;">Model</th>
                    <th style="border-bottom: 1px solid #ddd; padding: 8px;">Serial</th>
                    <th style="border-bottom: 1px solid #ddd; padding: 8px;">Retail Price</th>
                    <th style="border-bottom: 1px solid #ddd; padding: 8px;">Condition</th>
                    <th style="border-bottom: 1px solid #ddd; padding: 8px;">Coverage Start and End Date</th>
                    <th style="border-bottom: 1px solid #ddd; padding: 8px;">Claimed Value</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">1</td>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">Apple </td>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">Apple iPad 5th Gen, 30GB</td>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">GG7W212JHLF12</td>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">$182.00</td>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">Used</td>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">11/09/2026 11/09/2030</td>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">$0.00</td>
                </tr>
                <tr>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">2</td>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">Apple </td>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">Apple iPad 5th Gen, 30GB</td>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">GG7W212JHLF12</td>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">$182.00</td>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">Used</td>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">11/09/2026 11/09/2030</td>
                    <td style="border-bottom: 1px solid #ddd; padding: 8px;">$0.00</td>
                </tr>
            </tbody>
        </table>
      </div>
    `;
  }

  render() {
    return (
      <div>
        <button onClick={this.convertToPDF}>Export Order</button>
      </div>
    )
    }
  }
export default PdfMake;
