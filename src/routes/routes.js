import React from "react";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import Layout from "../layout/layout";
import Dashboard from "../pages/dashboard/index";
import ForgotPassword from "../pages/auth/forgotPassword";
import NewPassword from "../pages/auth/newPassword";
import DealerRegister from "../pages/auth/dealerRegister";
import Dealer from "../pages/dashboard/dealer";
import AddCustomer from "../pages/dashboard/addCustomer";

const routes = [
  {
    path: "/",
    children: [
      { path: "/", index: true, element: <Login /> },
      { path: "/forgot", index: true, element: <ForgotPassword /> },
      { path: "/new-password", index: true, element: <NewPassword /> },
      { path: "/registerDealer", index: true, element: <DealerRegister /> },
      { path: "/registerProvider", index: true, element: <DealerRegister /> },
      { path: "/register", element: <Register /> },
    ],
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/dealer", element: <Dealer /> },
      { path: "/Add-Customer", element: <AddCustomer /> },
    ],
  },
];

export default routes;
