import React from "react";
import { DownloadTC } from "../services/orderServices";
import download from "../assets/images/download.png";
import { apiUrl } from "../services/authServices";

function FileDownloader(props) {
  const { setLoading } = props;
  const baseUrl = apiUrl();
  const handleClick = async (apiUrlData) => {
    setLoading(true);
    try {
      // Make an API request to fetch the file URL
      const response = await DownloadTC(props.data, apiUrlData);

      if (response.code === 200) {
        // Create a link element
        console.log(response.result.fileName);
        const fileUrl = `${baseUrl.baseUrl}/uploads/mergedFile/${response.result.fileName}`;
        const fileName = "Term_And_Condition.pdf";

        fetch(fileUrl, {
          headers: baseUrl.headers,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Failed to fetch the file. Status: ${response.status}`
              );
            }
            return response.blob();
          })
          .then((blob) => {
            const blobUrl = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = blobUrl;
            anchor.download = fileName;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            URL.revokeObjectURL(blobUrl);
          })
          .catch((error) => {
            console.error("Error fetching the file:", error);
          });
       
      } else {
        console.error(
          "Failed to fetch file: Unexpected response status",
          response.code
        );
      }
    } catch (error) {
      console.error("Error fetching file:", error);
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div>
      <div
        className={`text-left flex py-1 px-2 cursor-pointer hover:font-semibold ${props.className}`}
        onClick={() => handleClick(props.apiUrlData)}>
        <img src={download} className="w-4 h-4 mr-2" alt="Download Icon" />
        <button className="">T&C</button>
      </div>
    </div>
  );
}

export default FileDownloader;
