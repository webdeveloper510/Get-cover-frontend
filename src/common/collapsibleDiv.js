import React, { useState, useRef, useEffect } from "react";
import Delete from "../assets/images/icons/deleteIcons.svg";
import Add from "../assets/images/icons/addIcon.svg";

const CollapsibleDiv = ({
  title,
  children,
  index,
  activeIndex,
  setActiveIndex,
  ShowData,
  imageClass,
}) => {
  const contentRef = useRef(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleToggleCollapse = () => {
    const newIsCollapsed = !isCollapsed;

    // If opening this collapsible, close any others
    if (!newIsCollapsed) {
      setActiveIndex(index);
    } else if (activeIndex === index) {
      setActiveIndex(null);
    }

    setIsCollapsed(newIsCollapsed);
  };

  useEffect(() => {
    // Set the collapsed state based on activeIndex prop
    setIsCollapsed(activeIndex !== index);
  }, [activeIndex, index]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isCollapsed ? "0px" : `${contentRef.current.scrollHeight}px`;
    }
  }, [isCollapsed]);

  return (
    <div className="my-8">
      <div
        className={`w-full justify-between items-center relative ${isCollapsed ? "border-b border-black" : ""
          }`}
      >
        {title}
        {ShowData && (
          <div className="absolute top-0 right-0" onClick={handleToggleCollapse}>
            {isCollapsed ? <img src={Add} className={imageClass} alt="Add" /> : <img src={Delete} className={imageClass} alt="Delete" />}
          </div>
        )}
      </div>
      <div
        className={`ease-in-out transition-max-height duration-500 overflow-hidden`}
        ref={contentRef}
        style={{
          maxHeight: isCollapsed ? "0px" : `${contentRef.current?.scrollHeight}px`,
          transition: "max-height 0.5s ease-in-out",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default CollapsibleDiv;
