import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Dropbox from "../assets/images/icons/dropBox.svg";
import info from "../assets/images/info.svg";
import csvFile from "../assets/images/icons/csvFile.svg";
import CommonTooltip from "./toolTip";

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
  tooltip,
  className1,
  disabled,
  placeholder,
  zipcode,
  classBox,
  nonumber,
  content,
  maxDate,
  onKeyDown,
}) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, ""); // Remove non-digit characters
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    }
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const handleInput = (event) => {
    let inputValue = event.target.value;

    if (type === "tel") {
      // Format phone number for type 'tel'
      const rawValue = inputValue.replace(/[^0-9]/g, ""); // Keep only numbers
      const formattedValue = formatPhoneNumber(rawValue);
      inputValue = formattedValue;
    }

    if (zipcode) {
      inputValue = inputValue.replace(/\D/g, ""); // Remove any non-digit characters
    }

    setInputValue(inputValue);

    if (onChange) {
      onChange({
        target: {
          name: event.target.name,
          value: type === "tel" ? inputValue.replace(/[^0-9]/g, "") : inputValue, // Raw value for 'tel'
        },
      });
    }
  };

  return (
    <div className={`relative ${classBox} rounded-lg`}>
      {type === "date" ? (
        <DatePicker
          selected={inputValue ? new Date(inputValue) : null}
          onChange={(date) =>
            onChange &&
            onChange({
              target: {
                name: name,
                value: date ? date : "",
              },
            })
          }
          dateFormat="MM/dd/yyyy"
          maxDate={maxDate ? new Date() : null}
          placeholderText="mm/dd/yyyy"
          className={`block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer ${className1} ${error ? "border-[red]" : "border-gray-300"
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
                {!inputValue ? (
                  <>
                    <img src={Dropbox} className="w-6 h-6 mr-5" alt="Dropbox" />
                    Choose File
                  </>
                ) : (
                  <>
                    <img src={csvFile} className="w-6 h-6 mr-2" alt="csvFile" />
                    {inputValue.name}
                  </>
                )}
              </label>
              <input
                id="file-upload"
                type="file"
                className="absolute hidden"
                onChange={(e) => {
                  setInputValue(e.target.files[0]);
                  onChange &&
                    onChange({
                      target: {
                        name,
                        value: e.target.files[0],
                      },
                    });
                }}
              />
            </div>
          ) : (
            <>
              {type === "tel" &&
                (nonumber && (
                  <div className="text-base font-semibold absolute top-[17px] left-[10px]">
                    +1
                  </div>
                ))}
              <input
                type={type}
                name={name}
                value={inputValue}
                id={name}
                onBlur={onBlur}
                minLength={minLength}
                maxLength={type === "tel" ? "14" : maxLength} // Match US phone length
                pattern={type === "number" ? "[0-9]*" : undefined}
                step={type === "number" ? "1" : undefined}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold rounded-lg border-[1px] border-gray-300 appearance-none peer ${className1} ${error ? "border-[red]" : "border-gray-300"
                  } ${disabled
                    ? "text-[#5D6E66] !bg-[#ebebebc4]"
                    : "text-light-black bg-white"
                  } ${type === "tel" && 'pl-[30px]'}`}
                onChange={handleInput}
                disabled={disabled}
                required={required}
                placeholder={placeholder}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
            </>
          )}
        </>
      )}
      <label
        htmlFor={name}
        className={`absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-grayf9 left-2 px-1 -translate-y-4 scale-75 self-center ${className}`}
      >
        {label} {required && <span className="text-red-500">*</span>}
        {type === "color" && (
          <CommonTooltip place="top" id={`tooltip-${tooltip}`} content={content}>
            <img src={info} className="h-5 w-5 ml-1 self-center" alt="Info" />
          </CommonTooltip>
        )}
      </label>
    </div>
  );
};

export default Input;
