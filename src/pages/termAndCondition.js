import React from "react";
import { DownloadTC } from "../services/orderServices";
import download from "../assets/images/download.png";
import { apiUrl } from "../services/authServices";
import { downloadFile } from "../services/userServices";

function FileDownloader(props) {
  const { setLoading } = props;
  console.log(props);
  const handleClick = async (apiUrlData) => {
    setLoading(true);
    console.log(apiUrlData);
    try {
      const response = await DownloadTC(props.data, apiUrlData);
      console.log(response);

      if (response.code === 200) {
        let data = {
          key: `mergedFile/${response.result.fileName}`,
        };
        const binaryString = await downloadFile(data);
        const blob = new Blob([binaryString]);
        const blobUrl = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = blobUrl;
        anchor.download = "Term_And_Condition.pdf";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(blobUrl);

        setLoading(false);
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
    <span
      className={`text-left flex py-1 px-2 cursor-pointer ${props.className}`}
      onClick={() => handleClick(props)}
    >
      <div
        style={{
          maskImage: `url(${download})`,
          WebkitMaskImage: `url(${download})`,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskSize: "contain",
          WebkitMaskSize: "contain",
        }}
        className="self-center pr-1 py-1 h-4 w-4 mr-2 "
      />
      <button className="">T&C</button>
    </span>
  );
}

export default FileDownloader;
