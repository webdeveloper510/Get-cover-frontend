import React, { useEffect } from "react";

const Input = ({
  type,
  placeholder,
  label,
  defaultValue,
  onChange,
  onBlur,
  name,
  minLength,
  maxLength,
}) => {
  const handleWheelCapture = (event) => {
    event.preventDefault();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Backspace") {
      return;
    }

    if (type === "number" && (event.key === "e" || event.key === "E")) {
      event.preventDefault();
    }

    if (maxLength && event.target.value.length >= maxLength) {
      event.preventDefault();
    }
  };
  useEffect(() => {
    const inputElement = document.getElementById(name);
    if (inputElement) {
      inputElement.addEventListener("wheel", handleWheelCapture, {
        passive: false,
      });
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener("wheel", handleWheelCapture);
      }
    };
  }, [handleWheelCapture, name]);
  return (
    <>
      <div className="relative mt-4">
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          id={name}
          onBlur={onBlur}
          minLength={minLength}
          maxLength={maxLength}
          pattern={type === "number" ? "[0-9]*" : undefined}
          className="block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold text-gray-900 bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 peer"
          placeholder={placeholder}
          onChange={onChange}
          onWheel={(e) => e.preventDefault()}
          onKeyDown={handleKeyDown}
          onWheelCapture={handleWheelCapture}
        />
        <label
          htmlFor={name}
          className="absolute text-base text-gray-500 dark:text-gray-400 leading-6 duration-300 transform -translate-y-4 text-lg scale-75 top-1 z-10 origin-[0] bg-[#f9f9f9] dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-gray-600 peer-focus:dark:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-2"
        >
          {" "}
          {label}
        </label>
      </div>
    </>
  );
};

export default Input;
