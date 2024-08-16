import React, { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

const PasswordInput = ({
  type,
  error,
  label,
  defaultValue,
  required,
  onChange,
  name,
  className,
  onBlur,
  isPassword,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="relative bg-white rounded-lg">
        <input
          type={showPassword ? "text" : type}
          name={name}
          defaultValue={defaultValue}
          id={name}
          onBlur={onBlur}
          className="block px-2.5 pb-2.5 pt-4 pr-8 w-full text-base font-semibold bg-white text-light-black rounded-lg border-[1px] border-gray-300 appearance-none "
          // placeholder={placeholder}
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
          className={`absolute text-base text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-grayf9 left-2 px-1 -translate-y-4 scale-75  ${className}`}
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </>
  );
};

export default PasswordInput;
