import React, { useEffect, useState } from "react";
import { getSetting, getUserDetailsFromLocalStorage } from "../services/extraServices";

const InActiveButton = ({ onClick, type, children, className, disabled }) => {
    const [buttonTextColor, setButtonTextColor] = useState('');
    const [backGroundColor, setBackGroundColor] = useState('');

    useEffect(() => {
        const storedUserDetails = getUserDetailsFromLocalStorage();

        if (storedUserDetails) {
            const colorScheme = storedUserDetails.colorScheme;
            colorScheme?.forEach(color => {
                switch (color.colorType) {
                    case 'inActiveButtonBackgroundColor':
                        setBackGroundColor(color.colorCode);
                        break;
                    case 'inActiveButtonColor':
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
                .inactive {
                 backgroundColor: ${backGroundColor} !important; color:  ${buttonTextColor} !important;
                }
            .inactive div {
                background: ${buttonTextColor} !important;
            }
        `}
            </style>
            <button
                onClick={onClick}
                type={type || "button"}
                disabled={disabled}
                style={{ backgroundColor: backGroundColor, color: ` ${buttonTextColor} !important` }}
                className={`bg-[${backGroundColor}] text-[${buttonTextColor}] inactive font-semibold py-2 px-2 rounded ${className}`}
            >
                {children}
            </button>
        </>
    );
};

export default InActiveButton
