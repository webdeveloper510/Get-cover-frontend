import React from 'react';

const Card = ({ children, className }) => {
  return (
    <div className={`bg-white p-2 rounded-xl h-full ${className}`}>
        {children}
    </div>
  );
};

export default Card;
