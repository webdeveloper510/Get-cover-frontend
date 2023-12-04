import React from "react";
import { Navigate } from "react-router-dom";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import Layout from "../layout/layout";
import Dashboard from "../pages/dashboard";

// const errorRoute = () => {
//     if (!localStorage.getItem("token")) {
//       return <Navigate to="/login" />;
//     } else {
//       return <Navigate to="/dashboard" />;
//     }
//   };
  

const routes = [
  {
    path: "/",
    children: [
      { path: "/login", index: true, element: <Login /> },
      { path: "/register", element: <Register /> },
      // { path: "*", element: <Navigate to={errorRoute()} /> },
    ],
  },
  {
    path: "/",
    element: <Layout />,
    children: [
       { path: "/dashboard", element: <Dashboard /> },
    ],
  },
];

export default routes;
