import React, { useState, useRef, useEffect } from 'react';
import Delete from '../assets/images/icons/deleteIcons.svg';
import Add from '../assets/images/icons/addIcon.svg';

const CollapsibleDiv = ({ title, children, index, activeIndex, setActiveIndex }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const contentRef = useRef(null);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    setActiveIndex(isCollapsed ? index : null);
    localStorage.setItem('activeIndex', index);

  };

  useEffect(() => {
    if (contentRef.current) {
      // Set max-height on initial mount to enable animation
      contentRef.current.style.maxHeight = isCollapsed ? '0px' : `${contentRef.current.scrollHeight}px`;
    }
  }, [isCollapsed]);
console.log(isCollapsed)
  useEffect(() => {
    const storedActiveIndex = localStorage.getItem('activeIndex');
    // setActiveIndex(storedActiveIndex)
    console.log(activeIndex, '-------><<<<>>>><<<<<<<<<')
    console.log(index, '-------><<<<>>>>index<<<<<<<<<')
    console.log(storedActiveIndex, '-------><<<<>>>>storedActiveIndex<<<<<<<<<')
    console.log(isCollapsed, '-------><<<<>>>>setIsCollapsed<<<<<<<<<')
    if (activeIndex === null ) {
      if (index !== storedActiveIndex) {
        console.log('354543')
        setIsCollapsed(true);
        console.log(isCollapsed, '-------><<<<>>>>setIsCollapsed 123 end<<<<<<<<<')
      } else {
        setIsCollapsed(false);
        console.log(isCollapsed, '-------><<<<>>>>setIsCollapsed 1234 end<<<<<<<<<')
      }
    } else 
    if (index !== activeIndex) {
        console.log('3545432323')
        setIsCollapsed(true);
        console.log(isCollapsed, '-------><<<<>>>>setIsCollapsed 12345 end<<<<<<<<<')
      } 
  }, [index, activeIndex]);
  return (
    <div className="my-8">
      <div className={`w-full justify-between items-center relative ${isCollapsed ? 'border-b border-black' : ''}`}>
        {title}
        <div className='absolute top-0 right-0' onClick={handleToggleCollapse}>
          {isCollapsed ? <img src={Add} alt="Add" /> : <img src={Delete} alt="Delete" />}
        </div>
      </div>
      <div
        className={`transition-duration-${isCollapsed ? '500 overflow-hidden' : '2000 overflow-visible '} ease-in-out`}
        ref={contentRef}
        style={{
          maxHeight: isCollapsed ? '0px' : '100%',
          transition: isCollapsed ? '' : 'max-height 0.5s ease-in-out', 
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default CollapsibleDiv;
