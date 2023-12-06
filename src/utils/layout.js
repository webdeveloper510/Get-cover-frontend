// Layout.jsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom"; // If using React Router

const Layout = ({ children }) => {
  const location = useLocation(); // If using React Router

  useEffect(() => {
    // Update meta tags based on the current route
    if (location.pathname === "/") {
      updateMetaTags("Login", "Login to our app");
    } else if (location.pathname === "/register") {
      updateMetaTags("Register", "Create a new account");
    }
  }, [location.pathname]);

  return <div>{children}</div>;
};

const updateMetaTags = (title, description) => {
  document.title = title;

  const metaDescription = document.querySelector('meta[name="description"]');
  console.log(metaDescription);
  if (metaDescription) {
    console.log(metaDescription.name);
    metaDescription.setAttribute("content", description);
  } else {
    const newMeta = document.createElement("meta");
    newMeta.name = "description";
    newMeta.content = description;
    document.head.appendChild(newMeta);
  }
};

export default Layout;
