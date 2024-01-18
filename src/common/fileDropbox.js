import React, { useState, useRef } from "react";

// media imports
import Dropbox from "../assets/images/icons/dropBox.svg";

import cross from "../assets/images/icons/CrossButton.svg";
import csvFile from "../assets/images/icons/csvFile.svg";
const FileDropdown = ({ className = "", accept, onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDropdownClick = () => {
    fileInputRef.current.click();
  };

  console.log(selectedFile);
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      setSelectedFile(file);
      if (onFileSelect) {
        onFileSelect(file);
      }
    }

    event.target.value = null;
  };
  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleDropdownClick}
        className={`bg-[#F2F2F2] border-[1px] border-[#D1D9E2] border-dashed px-8	py-10 w-full rounded-md focus:outline-none focus:border-blue-500 ${className}`}
      >
        {selectedFile ? (
         <div className='self-center flex text-center relative bg-white border w-full p-3'>
         <img src={cross} className="absolute -right-2 -top-2 mx-auto mb-3" alt="Dropbox" />
         <img src={csvFile} className="mr-2" alt="Dropbox" />
         <div className='flex justify-between w-full'>
           <p className='self-center'>{selectedFile.name}</p>
           <p className='self-center'>4MB</p>
         </div>
       </div> 
        ) : (
          <>
            <img src={Dropbox} className="mx-auto mb-3" alt="Dropbox" />
            <p className="text-[#5D6E66]">
              Accepted file types: csv, xlsx, xls Max. file size: 50 MB.
            </p>
          </>
        )}
      </button>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default FileDropdown;
