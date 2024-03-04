import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import React from 'react';
import { saveAs } from 'file-saver';
import download from "../assets/images/download.png";
// import { Document, Packer, Paragraph } from 'docx';
// import { createDocx } from 'html-to-docx';
import { getExportOrderHtml } from "../services/orderServices";

const DocMakeOrder = async (props) => {
  try {
    const {setLoading} = props
    setLoading(true)
    const response = await getExportOrderHtml(props?.data);

    // Check if response and response.result are defined
    if (response && response.html) {
    console.log("🚀 ~ DocMakeOrder ~ response.result:", response.html)
    //   const doc = new Document();

      // Check if 'creator' property exists in response.result
      if (response.html) {
        var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
        var postHtml = "</body></html>";

        var html = preHtml +response.html + postHtml;

        var blob = new Blob(['\ufeff', html], {
            type: 'application/msword'
        });

        var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);


        let filename ='document.doc';


        var downloadLink = document.createElement("a");

        document.body.appendChild(downloadLink);

        if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {

            downloadLink.href = url;
            downloadLink.download = filename;
            downloadLink.click();
        }

        document.body.removeChild(downloadLink);
        setLoading(false)
    //     function createDocxFromHtml(htmlContent) {
    //         const zip = new PizZip(htmlContent);
    //         const doc = new Docxtemplater(zip);
    //         doc.render(); // Render the document (no data required)
    //         const docxBuffer = doc.getZip().generate({ type: 'nodebuffer' });
    //         return docxBuffer;
    //       }
          
    //       const docxBuffer = createDocxFromHtml(response.html);
    //       const blob = new Blob([docxBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    // saveAs(blob, 'convertedFile.docx');
        
        // mammoth.convert({ html: response.html })
        // .then((result) => {
        //   const blob = new Blob([result.value], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        //   saveAs(blob, 'convertedFile.docx');
        // })
        // .catch((error) => {
        //   console.error('Error converting HTML to DOCX:', error);
        // });
    //     const convertedContent = htmlDocx.asBlob(htmlContent);
    // saveAs(convertedContent, 'convertedFile.docx');
        // Add paragraphs from HTML content
        // const paragraphs = response.result.split('\n').map(text => new Paragraph(text));
        // doc.addSection({ properties: {}, children: paragraphs });

        // // Convert the document to a Buffer
        // const buffer = await Packer.toBuffer(doc);

        // // Save the generated DOCX file
        // saveAs(new Blob([buffer]), 'document.docx');
      } else {
        console.error("No 'creator' property found in response.result");
      }
    } else {
      console.error("Invalid response or response.result is undefined");
    }
  } catch (error) {
    console.error("Error fetching data from API:", error);
  }
};

const DocMakeOrderContainer = (props, className) => {
  const handleButtonClick = async () => {
    try {
      // Call the asynchronous function to generate the DOCX file
      await DocMakeOrder(props);
    } catch (error) {
      console.error("Error generating DOCX:", error);
    }
  };

  return (
    <div className={`text-left flex py-1 px-2 cursor-pointer hover:font-semibold  ${className}`} onClick={handleButtonClick}>
        <img src={download} className="w-4 h-4 mr-2" />
      <button >Order</button>
    </div>
  );
};

export default DocMakeOrderContainer;
