import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ element, path, withoutLogin, role }) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      const userToken = JSON.parse(localStorage.getItem("userDetails"));
      const isUserLoggedIn = !!userToken;
      setIsLoggedIn(isUserLoggedIn);
      setLoading(false);

      if (!isUserLoggedIn && withoutLogin) {
        navigate(path, { replace: true });
        return;
      }

      if (isUserLoggedIn && withoutLogin) {
        navigate("/dashboard", { replace: true });
        return;
      }

      if (!isUserLoggedIn && !withoutLogin) {
        navigate("/", { replace: true });
        return;
      }

      if (role && userToken?.role !== role) {
        const rolePaths = {
          Dealer: "/dealer/dashboard",
          Servicer: "/servicer/dashboard",
          Reseller: "/reseller/dashboard",
          Customer: "/customer/dashboard",
        };
        const redirectionPath = rolePaths[userToken?.role] || "/dashboard";
        navigate(redirectionPath, { replace: true });
        return;
      }

      navigate(path, { replace: true });
    };

    checkAuthentication();
  }, [navigate, path, role, withoutLogin]);

  if (loading) {
    return null;
  }

  return <>{element}</>;
};

export default PrivateRoute;
