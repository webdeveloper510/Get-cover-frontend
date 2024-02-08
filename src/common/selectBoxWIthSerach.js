import React, { useEffect, useState } from "react";
import Select from "react-select";

const SelectBoxWithSearch = ({
  label,
  value,
  onChange,
  required,
  className,
  options,
  className1,
  name,
  isDisabled,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(!!value);
  const [localDefaultValue, setLocalDefaultValue] = useState(value);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setIsFilled(!!value);
  };

  useEffect(() => {
    setLocalDefaultValue(value ? value : "");
  }, [value, localDefaultValue]);

  // Adding an "unselect" option
  const extendedOptions = [
    { value: null, label: "Unselect" }, // Change the label as per your preference
    ...options,
  ];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: "100%",
      margin: "0px 0",
      borderWidth: "1px",
      borderRadius: "10px",
      padding: "0.425rem",
      borderColor: state.isFocused ? "#80808085" : provided.borderColor,
      boxShadow: state.isFocused
        ? "0 0 0 0px #80808085"
        : provided.boxShadow,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#00bcd4" : provided.backgroundColor,
      color: state.isSelected ? "white" : provided.color,
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: "#f9f9f9",
    }),
  };

  return (
    <div className="relative w-full">
      <Select
        options={extendedOptions}
        onChange={(selectedOption) => onChange(name, selectedOption?.value)}
        styles={customStyles}
        isSearchable
        value={
          value !== null
            ? extendedOptions.find((option) => option?.value === value)
            : null
        }
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`!w-full ${className1}`}
        isDisabled={isDisabled}
        defaultValue={localDefaultValue}
        placeholder="Search..."
      />
      <label
        className={`absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-[#f9f9f9] left-2 px-1 -translate-y-4 !hover:bg-[#f9f9f9] scale-75 ${className} text-[#5D6E66]`}
        htmlFor={label}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    </div>
  );
};

export default SelectBoxWithSearch;
