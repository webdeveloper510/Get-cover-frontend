import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";

const PrivateRoute = ({ element, path, withoutLogin, role }) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const checkAuthentication = async () => {
      const userToken = JSON.parse(localStorage.getItem("userDetails"));
      setIsLoggedIn(!!userToken);
      setLoading(false);
      console.log(role, userToken);

      if (!!userToken === false && withoutLogin) {
        navigate(path, { replace: true });
      } else if (withoutLogin && !!userToken === true) {
        navigate("/dashboard", { replace: true });
      } else if (!withoutLogin && !!userToken === false) {
        navigate("/", { replace: true });
      } else {
        navigate(path, { replace: true });
      }

      // console.log(userToken?.role === role.charAt(0).toUpperCase() + role.slice(1));
      if (
        role &&
        userToken?.role !== role.charAt(0).toUpperCase() + role.slice(1)
      ) {
        const rolePaths = {
          Dealer: "/dealer/dashboard",
          Servicer: "/servicer/dashboard",
          Reseller: "/reseller/dashboard",
          Customer: "/customer/dashboard",
        };

        const redirectionPath = rolePaths[userToken?.role] || "/dashboard";
        console.log(redirectionPath);
        navigate(redirectionPath, { replace: true });
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
