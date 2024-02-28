import React, { useState, useRef, useEffect } from 'react';
import Delete from '../assets/images/icons/deleteIcons.svg';
import Add from '../assets/images/icons/addIcon.svg';

const CollapsibleDiv = ({ title, children, index, activeIndex, setActiveIndex }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const contentRef = useRef(null);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    setActiveIndex(isCollapsed ? index : null);
  };

  useEffect(() => {
    if (contentRef.current) {
      // Set max-height on initial mount to enable animation
      contentRef.current.style.maxHeight = isCollapsed ? '0px' : `${contentRef.current.scrollHeight}px`;
    }
  }, [isCollapsed]);

  useEffect(() => {
    // Close the current element if its index doesn't match the activeIndex
    if (index !== activeIndex) {
      setIsCollapsed(true);
    }
  }, [index, activeIndex]);

  return (
    <div className="mt-8">
      <div className={`w-full justify-between items-center relative ${isCollapsed ? 'border-b border-black' : ''}`}>
        {title}
        <div className='absolute top-0 right-0' onClick={handleToggleCollapse}>
          {isCollapsed ? <img src={Add} alt="Add" /> : <img src={Delete} alt="Delete" />}
        </div>
      </div>
      <div
        className={` overflow-hidden transition-duration-${isCollapsed ? '500' : '2000'} ease-in-out`}
        ref={contentRef}
        style={{
          maxHeight: isCollapsed ? '0px' : 'auto',
          transition: 'max-height 0.5s ease-in-out', // Animation on opening and closing
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default CollapsibleDiv;
