import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Dropbox from "../assets/images/icons/dropBox.svg";
import info from "../assets/images/info.svg";
import csvFile from "../assets/images/icons/csvFile.svg";
import CommonTooltip from "./toolTip";
import { PatternFormat } from "react-number-format";


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
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    }
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const handleInput = (values) => {
    const { value = "", formattedValue = "" } = values;
    let inputValue = formattedValue;

    switch (type) {
      case "tel": {
        const rawValue = value.replace(/[^0-9]/g, "");
        inputValue = formatPhoneNumber(rawValue);
        break;
      }

      case "text": {
        inputValue = value.replace(/[|&;$%*"<>()+,]/g, "");
        inputValue = inputValue.replace(/\s+/g, " ").trim();
        break;
      }

      case "email": {
        inputValue = value.replace(/\s/g, "");
        break;
      }

      default: {
        if (zipcode) {
          inputValue = value.replace(/\D/g, "");
        }
        break;
      }
    }

    setInputValue(inputValue);

    if (onChange) {
      onChange({
        target: {
          name,
          value: type === "tel" ? value.replace(/[^0-9]/g, "") : inputValue,
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
              {type === "tel" ? (
                <>
                  {nonumber && (
                    <div className="text-base font-semibold absolute top-[17px] left-[10px]">
                      +1
                    </div>
                  )}
                  <PatternFormat
                    format="(###) ###-####"
                    mask="_"
                    value={inputValue}
                    onValueChange={handleInput}
                    placeholder={placeholder}
                    className={`${nonumber ? "pl-[30px]" : 'pl-2.5'
                      } block pr-2.5 pb-2.5 pt-4 w-full text-base font-semibold rounded-lg border-[1px] border-gray-300 appearance-none peer ${className1} ${error ? "border-[red]" : "border-gray-300"
                      } ${disabled
                        ? "text-[#5D6E66] !bg-[#ebebebc4]"
                        : "text-light-black bg-white"
                      }`}
                    disabled={disabled}
                  />
                </>
              ) : (
                <input
                  type={type}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (onChange) {
                      onChange({
                        target: {
                          name,
                          value: e.target.value,
                        },
                      });
                    }
                  }}
                  placeholder={placeholder}
                  disabled={disabled}
                  className={`block px-2.5  pb-2.5 pt-4 w-full text-base font-semibold rounded-lg border-[1px] border-gray-300 appearance-none peer ${className1} ${error ? "border-red-500" : "border-gray-300"} ${disabled ? "bg-gray-200 text-gray-500" : "bg-white text-black"}`}
                />
              )}
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
