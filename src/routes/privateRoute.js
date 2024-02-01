// PrivateRoute.js
import React, { useState, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import Login from "../pages/auth/login";
import Dashboard from "../pages/dashboard";

const PrivateRoute = ({ element, path, withoutLogin }) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const checkAuthentication = async () => {
      const userToken = localStorage.getItem("userDetails");
      console.log(userToken)
      setIsLoggedIn(!!userToken);
      setLoading(false);
      if (!!userToken === false && withoutLogin) {
        navigate(path, { replace: true });
      } else if (withoutLogin && !!userToken === true) {
        if (userToken?.role === "Super Admin") {
          console.log('Super Admin')
          navigate("/dashboard", { replace: true });
        } else if (userToken?.role === "Servicer") {
          console.log('Servicer')
          navigate("/servicer/dashboard", { replace: true });
        } else if (userToken?.role === "Dealer") {
          navigate("/dealer/dashboard", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } else if (!withoutLogin && !!userToken === false) {
        navigate("/", { replace: true });
      } else {
        navigate(path, { replace: true });
      }
    };

    checkAuthentication();
  }, [withoutLogin]);

  if (loading) {
    return null;
  }
  console.log(path)

  return <>
  {element}</>;
};

export default PrivateRoute;
