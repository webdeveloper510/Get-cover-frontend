import React, { useState } from "react";
import DropdownArrowImage from "../assets/images/icons/Drop.svg";

const Select = ({
  label,
  options,
  selectedValue,
  onChange,
  className,
  required,
  className1,
  name,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(!!selectedValue);

  const handleFocus = () => {
    setIsFocused(true);
  };
  console.log(error);
  const handleBlur = () => {
    setIsFocused(false);
    setIsFilled(!!selectedValue);
  };

  const handleInputChange = (e) => {
    setIsFilled(!!e.target.value);
    onChange(name, e.target.value);
  };

  return (
    <div className="relative">
      <div className="select-container relative">
        <select
          id={label}
          value={selectedValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`block px-2.5 pb-2.5 pr-8 pt-4 w-full text-base font-semibold text-gray-900 bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer ${className1}  ${
            error ? "border-[red]" : " border-gray-300 "
          }`}
        >
          <option value="">Select...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="arrow-container absolute top-1/2 right-3 pointer-events-none transform -translate-y-1/2">
          <img
            src={DropdownArrowImage}
            alt="DropdownArrowImage"
            className="w-4 h-4"
          />
        </div>
        <label
          className={`absolute text-base text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-[#f9f9f9] left-2 px-1 -translate-y-4 scale-75 ${
            isFocused || isFilled ? "text-[#5D6E66]" : "text-[#5D6E66]"
          } ${className} ${error ? "text-[red]" : " text-[#5D6E66] "}`}
          htmlFor={label}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>
    </div>
  );
};

export default Select;
