import React from 'react';
import { DownloadTC } from '../services/orderServices';
import download from "../assets/images/download.png";

function FileDownloader(props) {
    const handleClick = async (apiUrlData) => {
        try {
            // Make an API request to fetch the file URL
            const response = await DownloadTC(props.data, apiUrlData);

            if (response.code === 200) {
                // Create a link element
                const link = document.createElement('a');
                link.href = response.result;
                link.setAttribute('download', 'Term_And_Condition.pdf'); // Set the filename here
                document.body.appendChild(link);

                // Trigger the click event to initiate download
                link.click();

                // Clean up
                document.body.removeChild(link);
            } else {
                console.error('Failed to fetch file: Unexpected response status', response.code);
            }
        } catch (error) {
            console.error('Error fetching file:', error);
        }
    };

    return (
            <div
                className={`text-left flex py-1 px-2  ${props.className}`}
                onClick={() => handleClick(props.apiUrlData)}
            >
                <img src={download} className="w-4 h-4 mr-2" alt="Download Icon" />T&C
            </div>
    );
}

export default FileDownloader;
