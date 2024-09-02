import React, { useEffect, useState } from "react";
import { getUserDetailsFromLocalStorage } from "../services/extraServices";

const Modal = ({ isOpen, onClose, children, className }) => {
  const [buttonTextColor, setButtonTextColor] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');

  useEffect(() => {
    const storedUserDetails = getUserDetailsFromLocalStorage();

    if (storedUserDetails) {
      const { colorScheme } = storedUserDetails;
      colorScheme.forEach(({ colorType, colorCode }) => {
        switch (colorType) {
          case 'modelBackgroundColor':
            setBackgroundColor(colorCode);
            break;
          case 'modelColor':
            setButtonTextColor(colorCode);
            break;
          default:
            break;
        }
      });
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 h-full w-full flex items-center justify-center z-[99999] bg-[#333333c7] backdrop-blur-xl">
      <div className="modal-overlay z-10" onClick={onClose}></div>
      <div className={`modal-container w-[700px] max-w-[95%] relative ${className}`}>
        <div
          className="bg-white rounded-[50px] shadow-lg p-4 h-full"
          style={{ backgroundColor: backgroundColor, color: buttonTextColor }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
