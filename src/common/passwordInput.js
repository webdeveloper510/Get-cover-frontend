import React, { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

const PasswordInput = ({ type, placeholder, label, defaultValue, required, onChange, name, className, isPassword }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="relative">
        <input
          type={showPassword ? "text" : type}
          name={name}
          defaultValue={defaultValue}
          id={name}
          className="block px-2.5 pb-2.5 pr-10 pt-4 w-full text-base font-semibold text-light-black bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 peer"
          placeholder={placeholder}
          onChange={onChange}
        />
        {isPassword && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {showPassword ? (
              <LuEyeOff
                onClick={handleTogglePassword}
                className="h-5 w-5 text-gray-500 cursor-pointer"
              />
            ) : (
              <LuEye
                onClick={handleTogglePassword}
                className="h-5 w-5 text-gray-500 cursor-pointer"
              />
            )}
          </div>
        )}
        <label
          htmlFor={name}
          className={`absolute text-base text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-[#f9f9f9] left-2 px-1 -translate-y-4 scale-75  ${className}`}
        >
          {label}{required && <span className="text-red-500">*</span>}
        </label>
      </div>
    </>
  );
};

export default PasswordInput;
