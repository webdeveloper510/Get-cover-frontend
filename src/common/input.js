import React, { useState, useEffect } from "react";

const Input = ({
  type,
  error,
  label,
  value,
  onChange,
  onBlur,
  name,
  minLength,
  maxLength,
  required,
  className,
  className1,
  disabled,
  maxDecimalPlaces,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState(value);
  // console.log(defaultValue);
  const handleWheelCapture = (event) => {
    event.preventDefault();
  };

  const handleInput = (event) => {
    if (
      type === "number" &&
      maxDecimalPlaces !== undefined &&
      maxLength !== undefined
    ) {
      const inputValue = event.target.value;
      const regex = new RegExp(`^-?\\d{0,4}(\\.\\d{0,2})?$`);

      if (!regex.test(inputValue)) {
        return;
      }
      setInputValue(inputValue);

      if (onChange) {
        onChange({
          target: {
            name: event.target.name,
            value: inputValue,
          },
        });
      }
    } else {
      setInputValue(event.target.value);
      if (onChange) {
        onChange(event);
      }
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
          value={value}
          id={name}
          onBlur={onBlur}
          minLength={minLength}
          maxLength={maxLength}
          pattern={type === "number" ? "[0-9]*" : undefined}
          className={`block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer ${className1} ${
            error ? "border-[red]" : " border-gray-300 "
          } ${disabled ? "text-[#5D6E66]" : "text-light-black"}`}
          onChange={handleInput}
          disabled={disabled}
          placeholder={placeholder}
          onWheel={(e) => e.preventDefault()}
          // required={required}
        />
        <label
          htmlFor={name}
          className={`absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-[#f9f9f9] left-2 px-1 -translate-y-4 scale-75 ${className}  `}
        >
          {" "}
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>
    </>
  );
};

export default Input;
