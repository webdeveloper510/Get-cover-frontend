import React from "react";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import Layout from "../layout/layout";
import Dashboard from "../pages/dashboard/index";
import ForgotPassword from "../pages/auth/forgotPassword";
import NewPassword from "../pages/auth/newPassword";
import DealerRegister from "../pages/auth/dealerRegister";
import Dealer from "../pages/dashboard/Dealer/dealer";
import AddCustomer from "../pages/dashboard/Customer/addCustomer";
import AddDealerBook from "../pages/dashboard/Price-Book/addDealerBook";
import AddCompanyPriceBook from "../pages/dashboard/Price-Book/AddCompanyPriceBook";
import UploadDealerBook from "../pages/dashboard/Price-Book/uploadDealerBook";
import AddCategory from "../pages/dashboard/Price-Book/addCategory";
import DealerPriceList from "../pages/dashboard/Price-Book/dealerList";
import CompanyPriceBook from "../pages/dashboard/Price-Book/companyPriceBook";
import Category from "../pages/dashboard/Price-Book/category";
import DealerList from "../pages/dashboard/Dealer/dealerList";
import PrivateRoute from "./privateRoute";
import NewDealerList from "../pages/dashboard/Dealer/newDealerList";
import CustomerList from "../pages/dashboard/Customer/customerList";
import AddServicer from "../pages/dashboard/Servicer/addServicer";
import ServicerList from "../pages/dashboard/Servicer/servicerList";

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
          <NewPassword />
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
        path: "registerProvider",
        index: true,
        element: (
          <PrivateRoute
            withoutLogin={1}
            element={<DealerRegister />}
            path="/registerProvider"
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
        path: "/addCustomer",
        element: <PrivateRoute element={<AddCustomer />} path="/addCustomer" />,
      },
      {
        path: "/addDealerBook",
        element: (
          <PrivateRoute element={<AddDealerBook />} path="/addDealerBook" />
        ),
      },
      {
        path: "/addCompanyPriceBook",
        element: (
          <PrivateRoute
            element={<AddCompanyPriceBook />}
            path="/addCompanyPriceBook"
          />
        ),
      },
      {
        path: "/uploadDealerBook",
        element: (
          <PrivateRoute
            element={<UploadDealerBook />}
            path="/uploadDealerBook"
          />
        ),
      },
      {
        path: "/addCategory",
        element: <PrivateRoute element={<AddCategory />} path="/addCategory" />,
      },
      {
        path: "/editCategory/:id",
        element: <PrivateRoute element={<AddCategory />} path="//editCategory/:id" />,
      },
      {
        path: "/dealerList",
        element: <PrivateRoute element={<DealerList />} path="/dealerList" />,
      },
      {
        path: "/dealerPriceList",
        element: (
          <PrivateRoute element={<DealerPriceList />} path="/dealerPriceList" />
        ),
      },
      {
        path: "/category",
        element: <PrivateRoute element={<Category />} path="/category" />,
      },
      {
        path: "/companyPriceBook",
        element: (
          <PrivateRoute
            element={<CompanyPriceBook />}
            path="/companyPriceBook"
          />
        ),
      },
      {
        path: "/newDealerList",
        element: (
          <PrivateRoute
            element={<NewDealerList />}
            path="/newDealerList"
          />
        ),
      },
      {
        path: "/customerList",
        element: (
          <PrivateRoute
            element={<CustomerList />}
            path="/customerList"
          />
        ),
      },
      {
        path: "/addServicer",
        element: (
          <PrivateRoute
            element={<AddServicer />}
            path="/addServicer"
          />
        ),
      },
      {
        path: "/servicerList",
        element: (
          <PrivateRoute
            element={<ServicerList />}
            path="/servicerList"
          />
        ),
      },
    ],
  },
];

export default routes;
