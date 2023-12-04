import React from 'react';

const Button = ({ onClick, type, children, className }) => {
  return (
    <button
      onClick={onClick}
      type={type || 'button'}
      className={`bg-light-black text-white font-semibold py-2 px-4 rounded ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
