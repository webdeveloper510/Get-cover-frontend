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
import DealerList from "../pages/dashboard/Price-Book/dealerList";
import CompanyPriceBook from "../pages/dashboard/Price-Book/companyPriceBook";
import Category from "../pages/dashboard/Price-Book/category";

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
      { path: "/addCustomer", element: <AddCustomer /> },
      { path: "/addDealerBook", element: <AddDealerBook /> },
      { path: "/addCompanyPriceBook", element: <AddCompanyPriceBook /> },
      { path: "/uploadDealerBook", element: <UploadDealerBook /> },
      { path: "/addCategory", element: <AddCategory /> },
      { path: "/dealerList", element: <DealerList /> },
      { path: "/companyPriceBook", element: <CompanyPriceBook /> },
      { path: "/category", element: <Category /> },
    ],
  },
];

export default routes;
