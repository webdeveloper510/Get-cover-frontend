import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Dropbox from "../assets/images/icons/dropBox.svg";
import csvFile from "../assets/images/icons/csvFile.svg";
const Input = ({
  type,
  error,
  label,
  value,
  onChange,
  onBlur,
  name,
  minLength,
  maxLength,
  required,
  className,
  className1,
  disabled,
  maxDecimalPlaces,
  placeholder,
  maxDate,
}) => {
  const [inputValue, setInputValue] = useState(formatDate(value));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedFile, setSelectedFile] = useState(value);

  function formatDate(dateString) {
    if (!dateString || typeof dateString !== "string") {
      return dateString; // Return the original value if it's null, undefined, or not a string
    }
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${year}/${month.padStart(2, "0")}/${day.padStart(2, "0")}`;
    }
    return dateString;
  }
  const handleDateChange = (date) => {
    setInputValue(date);
    setSelectedDate(date);
    if (onChange) {
      onChange({
        target: {
          name: name,
          value: date ? date.toISOString().split("T")[0] : "",
        },
      });
    }
  };

  const handleChange = (e) => {
    // Handle file selection logic here
    console.log(e.target.files);
    setSelectedFile(e.target.files[0]);
  };

  const handleInput = (event) => {
    let inputValue = event.target.value;

    if (type === "date") {
      inputValue = formatDate(inputValue);
    }

    setInputValue(inputValue);

    if (onChange) {
      onChange({
        target: {
          name: event.target.name,
          value: inputValue,
        },
      });
    }
  };

  return (
    <>
      <div className="relative">
        {type === "date" ? (
          <DatePicker
            selected={inputValue ? new Date(inputValue) : null}
            onChange={handleDateChange}
            dateFormat="MM/dd/yyyy"
            maxDate={maxDate ? new Date() : null}
            placeholderText="mm/dd/yyyy"
            className={`block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer ${className1} ${
              error ? "border-[red]" : "border-gray-300 "
            } ${disabled ? "text-[#5D6E66]" : "text-light-black"}`}
          />
        ) : (
          <>
            {type === "file" ? (
              <div className="relative">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer px-2.5 pb-2.5 flex pt-4 w-full text-base font-semibold bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none"
                >
                  {!selectedFile ? (
                    <>
                      <img src={Dropbox} className="  w-6 h-6 mr-5" />
                      Choose File
                    </>
                  ) : (
                    <>
                      <img
                        src={csvFile}
                        className=" w-6 h-6 mr-2"
                        alt="Dropbox"
                      />
                      {selectedFile.name}
                    </>
                  )}
                </label>
                <input
                  id="file-upload"
                  type="file"
                  className="absolute hidden"
                  onChange={handleChange}
                />
              </div>
            ) : (
              <>
              {type === "tel" && <div className="text-base font-semibold absolute top-[17px] left-[10px]">
                +1 
              </div>}
              <input
                type={type}
                name={name}
                value={type == "date" ? inputValue : value}
                id={name}
                onBlur={onBlur}
                minLength={minLength}
                maxLength={maxLength}
                pattern={type === "number" ? "[0-9]*" : undefined}
                className={`${type === "tel" && 'pl-[30px]' } block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer ${className1} ${
                  error ? "border-[red]" : " border-gray-300 "
                } ${disabled ? "text-[#5D6E66]" : "text-light-black"}`}
                onChange={handleInput}
                disabled={disabled}
                placeholder={placeholder}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    // Optionally, you can add additional logic here if needed
                  }
                }}
              />
              </>
            )}
          </>
        )}
        <label
          htmlFor={name}
          className={`absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-[#f9f9f9] left-2 px-1 -translate-y-4 scale-75 ${className}  `}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>
    </>
  );
};

export default Input;
