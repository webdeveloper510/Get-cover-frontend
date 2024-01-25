// SelectWithSearch.js

import React from 'react';
import Select from 'react-select';

const SelectBoxWIthSerach = ({ label, options, onSelect, required,className }) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: '100%', // Adjust the width as needed
      margin: '0px 0',
      borderwidth:'0',
      padding:'0.425rem'
    }),
  };

  return (
    <div className="relative">
    <Select
      options={options.map((option) => ({ label: option, value: option }))}
      onChange={(selectedOption) => onSelect(selectedOption.value)}
      styles={customStyles}
      isSearchable
      placeholder="Search..."
    />
     <label
          className={`absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-[#f9f9f9] left-2 px-1 -translate-y-4 scale-75 ${className}
           text-[#5D6E66]`}
          htmlFor={label}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
    </div>
  );
};

export default SelectBoxWIthSerach