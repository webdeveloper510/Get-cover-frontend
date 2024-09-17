import React from "react";
import { Navigate } from "react-router-dom";

const NotFoundPage = () => {
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));

  const rolePaths = {
    Dealer: "/dealer/dashboard",
    Servicer: "/servicer/dashboard",
    Reseller: "/reseller/dashboard",
    Customer: "/customer/dashboard",
  };

  const redirectionPath = rolePaths[userDetails?.role] || "/dashboard";

  return <Navigate to={redirectionPath} />;
};

export default NotFoundPage;
