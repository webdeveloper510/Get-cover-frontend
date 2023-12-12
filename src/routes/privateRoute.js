// PrivateRoute.js
import React, { useState, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import Login from "../pages/auth/login";

const PrivateRoute = ({ element, path }) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = async () => {
      const userToken = localStorage.getItem("userDetails");
      setIsLoggedIn(!!userToken);
      setLoading(false);

      if (!!userToken === false) {
        navigate("/", { replace: true });
      }
    };

    checkAuthentication();
  }, [navigate]);

  if (loading) {
    return null;
  }

  if (isLoggedIn) {
    return (
      <Routes>
        <Route path={path} element={<Navigate to="/dashboard" replace />} />
      </Routes>
    );
  } else {
    console.log("here");
    // Return the Route component for users who are not logged in
    return (
      <Routes>
        <Route path={path} element={<Login />} />
      </Routes>
    );
  }
};

export default PrivateRoute;
