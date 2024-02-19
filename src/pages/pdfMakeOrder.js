import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import { getExportOrderHtml } from "../services/orderServices";
import download from "../assets/images/download.png";
import logo from "../assets/images/logo.png";
import { RotateLoader } from "react-spinners";
const PdfMake = (props) => {
  const [loading, setLoading] = useState(false);
  const downloadAsPDF = async () => {
    try {
      setLoading(true);
      const response = await getExportOrderHtml(props?.data);

      console.log(response);
      const opt = {
        margin: 0.5,
        filename: `${response?.orderWithContracts?.[0]?.unique_key}Export-Order.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      const element = document.getElementById("pdfContent");
      html2pdf().from(response.result).set(opt).save();
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  return (
    <div>
      <div id="pdfContent" />
      <div
        className="text-left py-1 flex cursor-pointer hover:font-semibold"
        onClick={downloadAsPDF}
      >
        <img src={download} className="w-4 h-4 mr-2" />{" "}
        <button className="">   {loading ? 'Downloading' :'Order'}</button>
      </div>
    </div>
  );
};

export default PdfMake;
