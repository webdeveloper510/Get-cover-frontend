import React from 'react';
import Select from 'react-select';

const SelectBoxWithSearch = ({ label, value, onSelect, required, className, options }) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: '100%',
      margin: '0px 0',
      borderWidth: '1px',
      borderRadius:'10px',
      padding: '0.425rem',
      borderColor: state.isFocused ? '#f9f9f9' : provided.borderColor, // Change the focus color
      boxShadow: state.isFocused ? '0 0 0 2px rgba(0, 188, 212, 0.5)' : provided.boxShadow,
    }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? '#00bcd4' : provided.backgroundColor,
          color: state.isSelected ? 'white' : provided.color,
        }),
        indicatorSeparator: (provided) => ({
          ...provided,
          backgroundColor: '#00bcd4',
        }),
      };
    
      return (
        <div className="relative">
          <Select
            options={options}
            onChange={(selectedOption) => onSelect(selectedOption?.value || null)}
            styles={customStyles}
            isSearchable
            isClearable={true}
            placeholder="Search..."
          />
          <label
            className={`absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-[#f9f9f9] left-2 px-1 -translate-y-4 scale-75 ${className} text-[#5D6E66]`}
            htmlFor={label}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        </div>
      );
    };
    
    export default SelectBoxWithSearch;
    
