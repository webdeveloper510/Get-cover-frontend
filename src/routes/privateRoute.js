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
      setIsLoggedIn(!!userToken);
      setLoading(false);
      console.log(!!userToken, withoutLogin);
      if (!!userToken === false && withoutLogin) {
        navigate(path, { replace: true });
      } else if (withoutLogin && !!userToken === true) {
        navigate("/dashboard", { replace: true });
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

  return <>{element}</>;
};

export default PrivateRoute;
