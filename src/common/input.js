import moment from "moment";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
}) => {
  const [inputValue, setInputValue] = useState(formatDate(value));

  function formatDate(dateString) {
    if (!dateString || typeof dateString !== 'string') {
      return dateString; // Return the original value if it's null, undefined, or not a string
    }
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${year}/${month.padStart(2, '0')}/${day.padStart(2, '0')}`;
    }
    return dateString;
  }
  const handleDateChange = (date) => {
    setInputValue(date);
    if (onChange) {
      onChange({
        target: {
          name: name,
          value: date ? date.toISOString().split("T")[0] : "",
        },
      });
    }
  };

  const handleInput = (event) => {
    let inputValue = event.target.value;

    if (type === "date") {
      inputValue = formatDate(inputValue);
      //  inputValue = moment(inputValue, "MM/DD/YYYY").format("MM/DD/YYYY");
      //  console.log(inputValue, "---------------")
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
            placeholderText="MM/dd/yyyy"
            
            className={`block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer ${className1} ${
              error ? "border-[red]" : "border-gray-300 "
            } ${disabled ? "text-[#5D6E66]" : "text-light-black"}`}
          />
        ) : (
          <>
        <input
          type={type}
          name={name}
          value={type=='date'? inputValue : value}
          id={name}
          onBlur={onBlur}
          minLength={minLength}
          maxLength={maxLength}
          pattern={type === "number" ? "[0-9]*" : undefined}
          className={`block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer ${className1} ${
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
