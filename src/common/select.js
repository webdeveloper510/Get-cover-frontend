import React, { useState } from "react";

const Select = ({ label, options, selectedValue, onChange, name }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="relative my-3">
      <label
        className={`absolute left-2 text-base text-gray-500 dark:text-gray-400 duration-300 transform origin-0 bg-[#f9f9f9] dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-gray-600 peer-focus:dark:text-gray-500 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-4 ${
          isFocused || selectedValue
            ? "text-sm -translate-y-2 bg-white z-10"
            : "text-lg top-1/2 -translate-y-1/2"
        } ${isFocused || selectedValue ? "text-primary" : "text-gray-500"}`}
        htmlFor={label}
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={label}
          value={selectedValue}
          onChange={(e) => onChange(name, e.target.value)}
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
      </div>
    </div>
  );
};

export default Select;
