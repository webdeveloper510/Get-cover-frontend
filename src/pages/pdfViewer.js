import React from 'react';
import html2pdf from 'html2pdf.js';
import logo from '../assets/images/logo.png'
class PdfGenerator extends React.Component {

  convertToPDF = () => {
    const opt = {
      margin:       0,
      filename:     'invoice.pdf',
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
                                    <td colspan="2" style="text-align: right; padding-right: 20px; padding-bottom: 40px;"> <b style="margin: 0; padding-bottom: 40px; font-size:30px">Invoice</b></td>
                                </tr>
                                <tr>
                                    <td style="border: none; padding: 4px;"><b>Invoice Date:</b></td>
                                    <td style="border: none; padding: 4px;">20/06/2024</td>
                                </tr>
                                <tr>
                                    <td style="border: none; padding: 4px;"><b>Invoice Number:</b></td>
                                    <td style="border: none; padding: 4px;"> CI-2024-10000</td>
                                </tr>
                                <tr>
                                    <td style="border: none; padding: 4px;"><b>Invoice Total:</b></td>
                                    <td style="border: none; padding: 4px;">$250.00</td>
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
            </tbody>
        </table>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tbody>
            <tr>
            <td colspan="2">
        <h4 style="margin: 0; padding: 0;"><b> Customer : </b> Bergen Science Charter High School </h4>
        <p><b>Purchase Order:</b> 215_002</p>
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
            <tr>
                <td style="border-bottom: 1px solid #ddd; padding: 8px;">1</td>
                <td style="border-bottom: 1px solid #ddd; padding: 8px;">Product</td>
                <td style="border-bottom: 1px solid #ddd; padding: 8px;">10</td>
                <td style="border-bottom: 1px solid #ddd; padding: 8px;">$50.00</td>
                <td style="border-bottom: 1px solid #ddd; padding: 8px;">$100.00</td>
            </tr>
            <tr>
                <td style="border-bottom: 1px solid #ddd; padding: 8px;">2</td>
                <td style="border-bottom: 1px solid #ddd; padding: 8px;">Product</td>
                <td style="border-bottom: 1px solid #ddd; padding: 8px;">10</td>
                <td style="border-bottom: 1px solid #ddd; padding: 8px;">$75.00</td>
                <td style="border-bottom: 1px solid #ddd; padding: 8px;">$150.00</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="4" style="font-weight: bold; padding: 8px; text-align: right;">Total:</td>
                <td style="font-weight: bold; padding: 8px;">$250.00</td>
            </tr>
        </tfoot>
    </table>
      </div>
    `;
  }

  render() {
    return (
      <div>
        <button onClick={this.convertToPDF}>Invoice</button>
      </div>
    )
    }
  }
export default PdfGenerator;
