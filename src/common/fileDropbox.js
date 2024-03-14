import React, { useState, useRef } from "react";

// media imports
import Dropbox from "../assets/images/icons/dropBox.svg";
import csvFile from "../assets/images/icons/csvFile.svg";
const FileDropdown = ({
  className = "",
  accept,
  onFileSelect,
  label,
  className1,
  labelAccept,
  value,
}) => {
  console.log(value);
  const [selectedFile, setSelectedFile] = useState(value);
  const fileInputRef = useRef(null);
  const handleDropdownClick = () => {
    if (fileInputRef) {
      fileInputRef.current.click();
      onFileSelect(null);
      setSelectedFile(null);
    }
  };

  console.log(selectedFile);
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    console.log(file);
    console.log(selectedFile, "------------------");
    if (file) {
      setSelectedFile(file);
      if (onFileSelect) {
        onFileSelect(file);
      }
    } else {
      onFileSelect(null);
      setSelectedFile(null);
    }

    event.target.value = null;
  };
  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleDropdownClick}
        className={`bg-[#F2F2F2] border-[1px] border-[#D1D9E2] border-dashed px-8	py-10 w-full rounded-md focus:outline-none focus:border-gray-300 ${className}`}
      >
        {selectedFile ? (
          <div className="self-center flex text-center relative bg-white border w-full p-3">
            {/* <img src={cross} className="absolute -right-2 -top-2 mx-auto mb-3" alt="Dropbox" /> */}
            <img src={csvFile} className="mr-2" alt="Dropbox" />
            <div className="flex justify-between w-full">
              <p className="self-center">{selectedFile.name}</p>
              <p className="self-center">
                {(selectedFile.size / 1000).toFixed(2)} kb
              </p>
            </div>
          </div>
        ) : (
          <>
            <img src={Dropbox} className="mx-auto mb-3" alt="Dropbox" />
            <p className={`text-[#5D6E66]`}>
              Accepted file types:{" "}
              {labelAccept == null ? "csv, xlsx, xls" : <>{labelAccept}</>}{" "}
              <br /> Max. file size: 50 MB.
            </p>
          </>
        )}
      </button>
      {label == null ? (
        ""
      ) : (
        <label
          className={`absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-[#f9f9f9] left-2 px-1 -translate-y-4 scale-75 ${className1}  `}
        >
          {label}
        </label>
      )}

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
