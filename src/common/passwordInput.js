import React, { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

const PasswordInput = ({ type, placeholder, label, defaultValue, onChange, name, isPassword }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="relative my-3">
        <input
          type={showPassword ? "text" : type}
          name={name}
          defaultValue={defaultValue}
          id="floating_outlined"
          className="block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold text-gray-900 bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 peer"
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
          htmlFor="floating_outlined"
          className="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 text-lg fo scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-gray-600 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
        >
          {label}
        </label>
      </div>
    </>
  );
};

export default PasswordInput;
