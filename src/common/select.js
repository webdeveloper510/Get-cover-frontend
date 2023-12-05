// FloatingLabelSelect.js

import React, { useState } from 'react';

const Select = ({ label, options, selectedValue, onChange }) => {
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
        className={`absolute left-2 transition-all duration-300 ${
          isFocused || selectedValue ? 'text-sm top-1' : 'text-base top-3'
        } ${isFocused || selectedValue ? 'text-primary' : 'text-gray-500'}`}
        htmlFor={label}
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={label}
          value={selectedValue}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full px-2.5 pb-2.5 pt-4 text-base font-semibold text-gray-900 bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 peer"
        >
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
