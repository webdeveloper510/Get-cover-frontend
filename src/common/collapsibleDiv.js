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
    setIsCollapsed(newIsCollapsed);
    if (!newIsCollapsed) {
      localStorage.setItem("activeIndex", index);
      setActiveIndex(index);
    } else {
      localStorage.removeItem("activeIndex");
      setActiveIndex(null);
    }
  };

  useEffect(() => {
    const storedActiveIndex = localStorage.getItem("activeIndex");
    if (storedActiveIndex !== null) {
      setIsCollapsed(index !== parseInt(storedActiveIndex, 10));
    }
  }, [index]);

  useEffect(() => {
    if (activeIndex !== null && activeIndex !== index) {
      setIsCollapsed(true);
    }
  }, [activeIndex, index]);

  useEffect(() => {
    if (contentRef.current) {
      if (isCollapsed) {
        contentRef.current.style.maxHeight = "0px";
      } else {
        contentRef.current.style.maxHeight = `${contentRef.current.scrollHeight}px`;
      }
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
