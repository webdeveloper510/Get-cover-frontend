import React from "react";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import Layout from "../layout/layout";
import Dashboard from "../pages/dashboard";
import ForgotPassword from "../pages/auth/forgotPassword";
import NewPassword from "../pages/auth/newPassword";

const routes = [
  {
    path: "/",
    children: [
      { path: "/login", index: true, element: <Login /> },
      { path: "/forgot", index: true, element: <ForgotPassword /> },
      { path: "/new-password", index: true, element: <NewPassword /> },
      { path: "/register", element: <Register /> },
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
