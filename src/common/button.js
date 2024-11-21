import React, { useEffect, useState } from "react";
import { getSetting, getUserDetailsFromLocalStorage } from "../services/extraServices";

const Button = ({ onClick, type, children, className, disabled }) => {
  const [buttonTextColor, setButtonTextColor] = useState('');
  const [backGroundColor, setBackGroundColor] = useState('');

  useEffect(() => {
    const storedUserDetails = getUserDetailsFromLocalStorage();

    if (storedUserDetails) {
      const colorScheme = storedUserDetails.colorScheme;
      colorScheme?.forEach(color => {
        switch (color.colorType) {
          case 'buttonColor':
            setBackGroundColor(color.colorCode);
            break;
          case 'buttonTextColor':
            setButtonTextColor(color.colorCode);
            break;
          default:
            break;
        }
      });
    }
  }, []);

  return (
    <>
      <style>
        {`
                .activeButton {
                 backgroundColor: ${backGroundColor} !important; color:  ${buttonTextColor} !important;
                }
            .activeButton div {
                background: ${buttonTextColor} !important;
            }
        `}
      </style>
      <button
        onClick={onClick}
        type={type || "button"}
        disabled={disabled}
        style={{ backgroundColor: backGroundColor, color: buttonTextColor }}
        className={`bg-[${backGroundColor}] text-[${buttonTextColor}] activeButton font-semibold py-2 px-4 rounded ${className}`}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
