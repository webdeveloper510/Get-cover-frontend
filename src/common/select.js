import React, { useState } from "react";
import DropdownArrowImage from "../assets/images/icons/Drop.svg";

const Select = ({ label, options, selectedValue, onChange, name }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(!!selectedValue);

  const handleFocus = () => {
    setIsFocused(true);
  };

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
      <label
        className={`absolute left-2 text-base text-light-black dark:text-gray-400 duration-300 transform origin-0 bg-[#f9f9f9] dark:bg-gray-900 px-2 
        peer-focus:px-2 
        peer-focus:text-light-black 
        peer-focus:dark:text-light-black 
        peer-placeholder-shown:top-1/2 
        peer-focus:top-2 
        peer-focus:-translate-y-4 
 text-sm -translate-y-2 bg-white z-10
 ${
          (isFocused || isFilled) ? "text-light-black" : "text-light-black"
        }`}
        htmlFor={label}
      >
        {label}
      </label>
      <div className="select-container relative">
        <select
          id={label}
          value={selectedValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold text-gray-900 bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 peer"
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
      </div>
    </div>
  );
};

export default Select;
