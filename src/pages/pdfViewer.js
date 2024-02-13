import React from "react";
import { jsPDF } from "jspdf";

const PdfGenerator = (props) => {
  const generatePdf = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Add content to the PDF
    doc.text("Hello, this is a sample PDF!", 10, 10);

    // Save the PDF as a Blob
    const pdfBlob = doc.output("blob");

    // Create a download link
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(pdfBlob);
    downloadLink.download = "sample.pdf";

    downloadLink.click();
  };

  return (
    <div>
      <button onClick={generatePdf}>Invoice</button>
    </div>
  );
};

export default PdfGenerator;
