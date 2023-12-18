import React, { useEffect, useState } from "react";
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
  OptionName,
  color,
  error,
  defaultValue,
  value,
  disabled,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(!!value);
  const [localDefaultValue, setLocalDefaultValue] = useState(value);

  console.log("defaultValue", disabled);

  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
    setIsFilled(!!value);
  };

  const handleInputChange = (e) => {
    const value = e?.target?.value || "";
    setIsFilled(!!value);
    onChange && onChange(name, value);
  };
  useEffect(() => {
    setLocalDefaultValue(value);
  }, [value]);
  return (
    <div className="relative">
      <div className="select-container relative">
        <select
          id={label}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={`block px-2.5 pb-2.5 pr-8 pt-4 w-full text-base font-semibold text-gray-900 bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer ${className1}  ${
            error ? "border-[red]" : " border-gray-300 "
          }`}
          defaultValue={localDefaultValue}
        >
          <option className={color} value="">
            Select {OptionName}
          </option>
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
          className={`absolute text-base text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-[#f9f9f9] left-2 px-1 -translate-y-4 scale-75 ${className} ${
            isFocused || isFilled ? "text-[#5D6E66]" : "text-[#5D6E66]"
          } `}
          htmlFor={label}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>
    </div>
  );
};

export default Select;
