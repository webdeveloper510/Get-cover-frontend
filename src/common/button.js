import React, { useEffect, useState } from "react";
import { getSetting } from "../services/extraServices";

const Button = ({ onClick, type, children, className, disabled }) => {
  const [buttonTextColor, setButtonTextColor] = useState('');
  const [backGroundColor, setBackGroundColor] = useState('');
  const fetchUserDetails12 = async () => {
    try {
      const userDetails = await getSetting();
      
      if (userDetails && userDetails.result) {
        const colorScheme = userDetails.result[0].colorScheme;
        colorScheme.forEach(color => {
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
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  useEffect(() => {
    fetchUserDetails12();
  
} ,[]);
  return (
    <button
      onClick={onClick}
      type={type || "button"}
      disabled={disabled}
      style={{ backgroundColor: backGroundColor, color: buttonTextColor}}
      className={`bg-[${backGroundColor}] text-[${buttonTextColor}] font-semibold py-2 px-4 rounded ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
