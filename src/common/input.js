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
  required,
  className,
  className1,
  disabled
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
      <div className="relative">
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          id={name}
          onBlur={onBlur}
          minLength={minLength}
          maxLength={maxLength}
          pattern={type === "number" ? "[0-9]*" : undefined}
          className={`block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer ${className1} ${disabled ? 'text-[#5D6E66]' : 'text-light-black' }`}
          // placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          onWheel={(e) => e.preventDefault()}
          onKeyDown={handleKeyDown}
          onWheelCapture={handleWheelCapture}
          required={required}
        />
        <label
          htmlFor={name}
          className={`absolute text-base text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-[#f9f9f9] left-2 px-1 -translate-y-4 scale-75 ${className}`}
        >
          {" "}
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>
    </>
  );
};

export default Input;
