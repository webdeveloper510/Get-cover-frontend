import React, { useState, useRef } from 'react';

// media imports 
import Dropbox from "../assets/images/icons/dropBox.svg"
const FileDropdown = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleDropdownClick = () => {
    // Trigger click event on the file input when dropdown is clicked
    fileInputRef.current.click();
  };

  return (
    <div className="relative">
      <button
        onClick={handleDropdownClick}
        className="bg-[#F2F2F2] border-[1px] border-[#D1D9E2] border-dashed	py-10                w-full rounded-md focus:outline-none focus:border-blue-500"
      >
        {selectedFile ? selectedFile.name : (<>
        <img src={Dropbox} className='mx-auto mb-3' alt='Dropbox'/>
        <p className='text-[#5D6E66]'>Accepted file types: csv, Max. file size: 50 MB.</p>
        </>)}
      </button>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default FileDropdown;
