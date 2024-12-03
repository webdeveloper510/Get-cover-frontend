import React, { useState } from "react";

const USPhoneNumberInput = ({ label, onChange, name, required, placeholder, className }) => {
    const [value, setValue] = useState("");

    const formatPhoneNumber = (inputValue) => {
        const numericValue = inputValue.replace(/\D/g, "");

        if (numericValue.length <= 3) {
            return numericValue;
        } else if (numericValue.length <= 6) {
            return `(${numericValue.slice(0, 3)}) ${numericValue.slice(3)}`;
        } else {
            return `(${numericValue.slice(0, 3)}) ${numericValue.slice(3, 6)}-${numericValue.slice(6, 10)}`;
        }
    };

    const handleChange = (e) => {
        const rawValue = e.target.value;
        const formattedValue = formatPhoneNumber(rawValue);

        setValue(formattedValue);

        if (onChange) {
            onChange(rawValue.replace(/\D/g, ""));
        }
    };

    return (
        <div className="relative">
            <div className="text-base font-semibold absolute top-[17px] left-[10px]">
                +1
            </div>
            <input
                id="phoneInput"
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                maxLength={14}
                className="block pl-[30px] pb-2.5 pt-4 pr-8 w-full text-base font-semibold bg-white text-light-black rounded-lg border-[1px] border-gray-300 appearance-none "
            />
            <label
                htmlFor={name}
                className={`absolute text-base text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-grayf9 left-2 px-1 -translate-y-4 scale-75  ${className}`}
            >
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
        </div>
    );
};

export default USPhoneNumberInput;
