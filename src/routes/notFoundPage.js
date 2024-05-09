import React from "react";
import { Navigate } from "react-router-dom";

const NotFoundPage = () => {
  let userDetails = JSON.parse(localStorage.getItem("userDetails"));

  let redirectionPath;

  switch (userDetails?.role) {
    case "Dealer":
      redirectionPath = "/dealer/dashboard";
      break;
    default:
      redirectionPath = "/dashboard";
  }
  return <Navigate to={redirectionPath} />;
};

export default NotFoundPage;
