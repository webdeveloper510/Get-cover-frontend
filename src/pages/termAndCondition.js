import React from 'react';
import { DownloadTC } from '../services/orderServices';
import download from "../assets/images/download.png";

function FileDownloader(props, className) {
    const handleClick = async () => {
        try {
          // Make an API request to fetch the file URL
          const response = await DownloadTC(props.data);
      
          if (response.code === 200) {
            const url = window.URL.createObjectURL(new Blob([response.result]));

      // Create a link element
      const link = document.createElement('a');
      link.href = url;
            link.setAttribute('download', 'Term_And_Condition.pdf'); // Set the filename here
            document.body.appendChild(link);
      
            // Trigger the click event to initiate download
            link.click();
      
            // Clean up
            link.parentNode.removeChild(link);
          } else {
            console.error('Failed to fetch file: Unexpected response status', response.code);
          }
        } catch (error) {
          console.error('Error fetching file:', error);
        }
      };

  return (
    <div>
        <div
      className={`text-left flex py-1 px-2 cursor-pointer hover:font-semibold  ${className}`}
      onClick={handleClick}
    >
      <img src={download} className="w-4 h-4 mr-2" />
      <button className="">Terms</button>
    </div>
    </div>
  );
}

export default FileDownloader;