// Layout.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // If using React Router

const Layout = ({ children }) => {
  const location = useLocation(); // If using React Router
  const [pageContent, setPageContent] = useState("");

  useEffect(() => {
    // Fetch the HTML content of the current page or load it from somewhere
    const currentHtmlContent = document.documentElement.outerHTML;
    setPageContent(currentHtmlContent);
  }, []);

  useEffect(() => {
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(pageContent, "text/html");

    // Extract text content from certain elements, adjust as needed
    const relevantText =
      doc.querySelectorAll("p, h1, h2, h3, h4, h5, h6")[0]?.textContent || "";

    // Update the meta description tag
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", relevantText);
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "description";
      newMeta.content = relevantText;
      document.head.appendChild(newMeta);
    }
  }, [pageContent]);

  return <div>{children}</div>;
};

export default Layout;
