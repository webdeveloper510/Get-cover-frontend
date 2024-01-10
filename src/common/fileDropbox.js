import React, { useState, useRef } from "react";

// media imports
import Dropbox from "../assets/images/icons/dropBox.svg";
const FileDropdown = ({ className = "", accept, onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDropdownClick = () => {
    fileInputRef.current.click();
  };
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (onFileSelect) {
      onFileSelect(file);
    }
    event.target.value = null;
  };
  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleDropdownClick}
        className={`bg-[#F2F2F2] border-[1px] border-[#D1D9E2] border-dashed	py-10 w-full rounded-md focus:outline-none focus:border-blue-500 ${className}`}
      >
        {selectedFile ? (
          selectedFile.name
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
