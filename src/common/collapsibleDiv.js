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
}) => {
  const contentRef = useRef(null);

  const handleToggleCollapse = () => {
    const newIsCollapsed = !isCollapsed;
    setIsCollapsed(newIsCollapsed);
    if (newIsCollapsed) {
      localStorage.removeItem("activeIndex");
      setActiveIndex(null);
    } else {
      localStorage.setItem("activeIndex", index);
      setActiveIndex(index);
    }
  };

  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isCollapsed
        ? "0px"
        : `${contentRef.current.scrollHeight}px`;
    }
  }, [isCollapsed]);

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

  return (
    <div className="my-8">
      <div
        className={`w-full justify-between items-center relative ${
          isCollapsed ? "border-b border-black" : ""
        }`}
      >
        {title}
        {ShowData && (
          <div className="absolute top-0 right-0" onClick={handleToggleCollapse}>
            {isCollapsed ? <img src={Add} alt="Add" /> : <img src={Delete} alt="Delete" />}
          </div>
        )}
      </div>
      <div
        className={`ease-in-out transition-duration-${
          isCollapsed ? "500 overflow-hidden" : "2000 overflow-visible"
        } `}
        ref={contentRef}
        style={{
          maxHeight: isCollapsed ? "0px" : "100%",
          transition: "max-height 0.5s ease-in-out",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default CollapsibleDiv;
