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
import DealerPriceList from "../pages/dashboard/Price-Book/dealerList";
import CompanyPriceBook from "../pages/dashboard/Price-Book/companyPriceBook";
import Category from "../pages/dashboard/Price-Book/category";
import DealerList from "../pages/dashboard/Dealer/dealerList";
import PrivateRoute from "./privateRoute";

const routes = [
  {
    path: "/",
    // children: [
    //   {
    //     path: "/",
    //     index: true,
    //     element: <PrivateRoute element={<Login />} exact path="/" />,
    //   },
    //   {
    //     path: "/forgot",
    //     index: true,
    //     element: <PrivateRoute element={<ForgotPassword />} path="/forgot" />,
    //   },
    //   {
    //     path: "/newPassword/:id/:token",
    //     index: true,
    //     element: (
    //       <PrivateRoute
    //         element={<NewPassword />}
    //         path="/newPassword/:id/:token"
    //       />
    //     ),
    //   },
    //   {
    //     path: "registerDealer",
    //     index: true,
    //     element: (
    //       <PrivateRoute element={<DealerRegister />} path="/registerDealer" />
    //     ),
    //   },
    //   {
    //     path: "/register",
    //     index: true,
    //     element: <PrivateRoute element={<Register />} path="/register" />,
    //   },
    // ],
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
      // {
      //   path: "/dashboard",
      //   element: <PrivateRoute element={<Dashboard />} path="/dashboard" />,
      // },
      // {
      //   path: "/dealer",
      //   element: <PrivateRoute element={<Dealer />} path="/dealer" />,
      // },
      // {
      //   path: "/addCustomer",
      //   element: (
      //     <PrivateRoute element={<AddCustomer />} path="/addCustomer" />
      //   ),
      // },
      // {
      //   path: "/addDealerBook",
      //   element: (
      //     <PrivateRoute element={<AddDealerBook />} path="/addDealerBook" />
      //   ),
      // },
      // {
      //   path: "/addCompanyPriceBook",
      //   element: (
      //     <PrivateRoute
      //       element={<AddCompanyPriceBook />}
      //       path="/addCompanyPriceBook"
      //     />
      //   ),
      // },
      // {
      //   path: "/uploadDealerBook",
      //   element: (
      //     <PrivateRoute
      //       element={<UploadDealerBook />}
      //       path="/uploadDealerBook"
      //     />
      //   ),
      // },
      // {
      //   path: "/addCategory",
      //   element: (
      //     <PrivateRoute element={<AddCategory />} path="/addCategory" />
      //   ),
      // },
      // {
      //   path: "/dealerPriceList",
      //   element: <PrivateRoute element={<DealerPriceList />} path="/dealerPriceList" />,
      // },
      // {
      //   path: "/dealerList",
      //   element: <PrivateRoute element={<DealerList />} path="/dealerList" />,
      // },
      // {
      //   path: "/category",
      //   element: <PrivateRoute element={<Category />} path="/category" />,
      // },
      // {
      //   path: "/companyPriceBook",
      //   element: (
      //     <PrivateRoute
      //       element={<CompanyPriceBook />}
      //       path="/companyPriceBook"
      //     />
      //   ),
      // },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/dealer", element: <Dealer /> },
      { path: "/addCustomer", element: <AddCustomer /> },
      { path: "/addDealerBook", element: <AddDealerBook /> },
      { path: "/addCompanyPriceBook", element: <AddCompanyPriceBook /> },
      { path: "/uploadDealerBook", element: <UploadDealerBook /> },
      { path: "/addCategory", element: <AddCategory /> },
      { path: "/dealerPriceList", element: <DealerPriceList /> },
      { path: "/companyPriceBook", element: <CompanyPriceBook /> },
      { path: "/dealerList", element: <DealerList /> },
      { path: "/category", element: <Category /> },
    ],
  },
];

export default routes;
