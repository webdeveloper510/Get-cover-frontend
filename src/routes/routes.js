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
import AddDealerBook from "../pages/dashboard/Price-Book/addDealerBook";
import AddCompanyPriceBook from "../pages/dashboard/Price-Book/AddCompanyPriceBook";
import UploadDealerBook from "../pages/dashboard/Price-Book/uploadDealerBook";
import AddCategory from "../pages/dashboard/Price-Book/addCategory";
const routes = [
  {
    path: "/",
    children: [
      { path: "/", index: true, element: <Login /> },
      { path: "/forgot", index: true, element: <ForgotPassword /> },
      {
        path: "/newPassword/:id/:token",
        index: true,
        element: <NewPassword />,
      },
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
      { path: "/add-Customer", element: <AddCustomer /> },
      { path: "/add-Dealer-Book", element: <AddDealerBook /> },
      { path: "/add-Company-Price-Book", element: <AddCompanyPriceBook /> },
      { path: "/upload-Dealer-Book", element: <UploadDealerBook /> },
      { path: "/add-Category", element: <AddCategory /> },
    ],
  },
];

export default routes;
