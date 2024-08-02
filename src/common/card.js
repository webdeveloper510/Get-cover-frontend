import React, { useEffect, useState } from 'react';
import { getUserDetailsFromLocalStorage } from '../services/extraServices';

const Card = ({ children, className }) => {
  const [buttonTextColor, setButtonTextColor] = useState('');
  const [backGroundColor, setBackGroundColor] = useState('');

useEffect(() => {
  const storedUserDetails = getUserDetailsFromLocalStorage();

  if (storedUserDetails) {
    const colorScheme = storedUserDetails.colorScheme;
    colorScheme.forEach(color => {
      switch (color.colorType) {
        case 'cardBackGroundColor':
          setBackGroundColor(color.colorCode);
          break;
          case 'cardColor':
            setButtonTextColor(color.colorCode);
            break;
          default:
            break;
      }
    });
  }
}, []);
  return (
    <div className={`bg-white p-2 rounded-xl h-full ${className}`} style={{ backgroundColor: backGroundColor, color: buttonTextColor}}>
        {children}
    </div>
  );
};

export default Card;
