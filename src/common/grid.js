import React from 'react';

const Grid = ({ className = '', children }) => (
    <div className={`grid grid-cols-12 justify-between gap-4 ${className}`}>
        {children}
    </div>
);

export default Grid;