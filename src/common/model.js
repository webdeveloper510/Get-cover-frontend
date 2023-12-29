import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 h-full w-full flex items-center justify-center z-50 bg-[#333333c7] backdrop-blur-xl	 ">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-container w-[700px] max-w-[95%] relative">
        <div className="bg-white rounded-[50px] shadow-lg p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
