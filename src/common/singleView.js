import React, { useEffect, useState } from 'react';
import { getUserDetailsFromLocalStorage } from '../services/extraServices';

const SingleView = ({ children, className }) => {
    const [buttonTextColor, setButtonTextColor] = useState('');
    const [backGroundColor, setBackGroundColor] = useState('');

    useEffect(() => {
        const storedUserDetails = getUserDetailsFromLocalStorage();

        if (storedUserDetails) {
            const colorScheme = storedUserDetails.colorScheme;
            colorScheme.forEach(color => {
                switch (color.colorType) {
                    case 'sideBarColor':
                        setBackGroundColor(color.colorCode);
                        break;
                    case 'sideBarTextColor':
                        setButtonTextColor(color.colorCode);
                        break;
                    default:
                        break;
                }
            });
        }
    }, []);

    // Define styles for the parent div
    const parentStyle = {
        backgroundColor: backGroundColor,
        color: buttonTextColor,
    };



    return (
        <div className={`${className}`} style={parentStyle}>
            {children}
        </div>
    );
};

export default SingleView
