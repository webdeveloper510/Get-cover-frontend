import React from "react";
import { Route, Navigate } from "react-router-dom";
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
import PrivateRoute from "./privateRoute";

const routes = [
  {
    path: "/",
    children: [
      {
        path: "/",
        index: true,
        element: (
          <PrivateRoute withoutLogin={1} element={<Login />} exact path="/" />
        ),
      },
      {
        path: "/forgot",
        index: true,
        element: (
          <PrivateRoute
            withoutLogin={1}
            element={<ForgotPassword />}
            path="/forgot"
          />
        ),
      },
      {
        path: "/newPassword/:id/:token",
        index: true,
        element: (
          <PrivateRoute
            withoutLogin={1}
            element={<NewPassword />}
            path="/newPassword/:id/:token"
          />
        ),
      },
      {
        path: "registerDealer",
        index: true,
        element: (
          <PrivateRoute
            withoutLogin={1}
            element={<DealerRegister />}
            path="/registerDealer"
          />
        ),
      },
      {
        path: "/register",
        index: true,
        element: (
          <PrivateRoute
            withoutLogin={1}
            element={<Register />}
            path="/register"
          />
        ),
      },
    ],
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/dashboard",
        element: (
          <PrivateRoute element={<Dashboard />} exact path="/dashboard" />
        ),
      },
      {
        path: "/dealer",
        element: <PrivateRoute element={<Dealer />} path="/dealer" />,
      },
      {
        path: "/add-Customer",
        element: (
          <PrivateRoute element={<AddCustomer />} path="/add-Customer" />
        ),
      },
      {
        path: "/add-Dealer-Book",
        element: (
          <PrivateRoute element={<AddDealerBook />} path="/add-Dealer-Book" />
        ),
      },
      {
        path: "/add-Company-Price-Book",
        element: (
          <PrivateRoute
            element={<AddCompanyPriceBook />}
            path="/add-Company-Price-Book"
          />
        ),
      },
      {
        path: "/upload-Dealer-Book",
        element: (
          <PrivateRoute
            element={<UploadDealerBook />}
            path="/upload-Dealer-Book"
          />
        ),
      },
      {
        path: "/add-Category",
        element: (
          <PrivateRoute element={<AddCategory />} path="/add-Category" />
        ),
      },
      {
        path: "/DealerList",
        element: <PrivateRoute element={<DealerList />} path="/DealerList" />,
      },
      {
        path: "/category",
        element: <PrivateRoute element={<Category />} path="/category" />,
      },
      {
        path: "/CompanyPriceBook",
        element: (
          <PrivateRoute
            element={<CompanyPriceBook />}
            path="/CompanyPriceBook"
          />
        ),
      },
    ],
  },
];

export default routes;
