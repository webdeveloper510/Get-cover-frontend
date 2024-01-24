import React, { useState } from 'react';
import Delete from '../assets/images/icons/deleteIcons.svg';
import Add from '../assets/images/icons/addIcon.svg';
const CollapsibleDiv = ({ title, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className=" mt-8">
      <div className={`w-full justify-between items-center relative ${isCollapsed ? 'border-b border-black' : '' }`}>
       {title}
        <div className='absolute top-0 right-0'   onClick={handleToggleCollapse}>
        {isCollapsed ? <img src={Add} alt="Delete" /> :  <img src={Delete} alt="Delete" />}     
                  </div>
      </div>
      {!isCollapsed && (
        <div className="">
          {/* Content goes here */}
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleDiv;
