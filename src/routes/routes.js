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
import RequestServicer from "../pages/dashboard/Servicer/requestServicer";
import Notification from "../pages/notification/notification";
import DealerDetails from "../pages/dashboard/Dealer/dealerDetails";
import AddOrder from "../pages/dashboard/Order/addOrder";
import OrderList from "../pages/dashboard/Order/orderList";
import ServicerDetails from "../pages/dashboard/Servicer/servicerDetails";
import CustomerDetails from "../pages/dashboard/Customer/customerDetails";
import ContractList from "../pages/dashboard/Contract/contractList";
import EditContract from "../pages/dashboard/Contract/editContract";
import ClaimList from "../pages/dashboard/Claim/claimList";
import AddClaim from "../pages/dashboard/Claim/addClaim";
import AddBulkClaim from "../pages/dashboard/Claim/addBulkClaim";
import EditClaim from "../pages/dashboard/Claim/editClaim";
import AddReseller from "../pages/dashboard/Reseller/addReseller";
import ResellerList from "../pages/dashboard/Reseller/resellerList";
import Sale from "../pages/dashboard/Reporting/sale";
import OrderDetails from "../pages/dashboard/Order/order-details";
import Claims from "../pages/dashboard/Reporting/claims";
import ResellerDetails from "../pages/dashboard/Reseller/resellerDetails";

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
        element: <NewPassword />,
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
      {
        path: "/notifications",
        index: true,
        element: (
          <PrivateRoute element={<Notification />} path="/notifications" />
        ),
      },
      {
        path: "/editContract",
        index: true,
        element: (
          <PrivateRoute element={<EditContract />} path="/editContract" />
        ),
      },
      {
        path: "/orderDetails",
        index: true,
        element: (
          <PrivateRoute element={<OrderDetails />} path="/orderDetails" />
        ),
      },
      {
        path: "/editClaim",
        index: true,
        element: (
          <PrivateRoute element={<EditClaim />} path="/editclaim" />
        ),
      },
      {
        path: "/servicerDetails/:servicerId",
        index: true,
        element: <PrivateRoute element={<ServicerDetails />} />,
      },
      {
        path: "/resellerDetails/:resellerId",
        index: true,
        element: <PrivateRoute element={<ResellerDetails />} />,
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
        path: "/dealerDetails/:id",
        index: true,
        element: <PrivateRoute element={<DealerDetails />} />,
      },

      {
        path: "/dealer/:id?",
        element: <PrivateRoute element={<Dealer />} />,
      },
      {
        path: "/addCustomer/:dealerValueId?",
        element: <PrivateRoute element={<AddCustomer />} />,
      },
      {
        path: "/addDealerBook/:dealerIdValue?",
        element: <PrivateRoute element={<AddDealerBook />} />,
      },
      
      {
        path: "/editDealerBook/:id/:dealerIdValue?",
        element: <PrivateRoute element={<AddDealerBook />} />,
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
        path: "/editCompanyPriceBook/:id",
        element: <AddCompanyPriceBook />,
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
        element: <AddCategory />,
      },
      {
        path: "/dealerList",
        element: <PrivateRoute element={<DealerList />} />,
      },
      {
        path: "/dealerPriceList/:dealerName?",
        element: <PrivateRoute element={<DealerPriceList />} />,
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
          <PrivateRoute element={<NewDealerList />} path="/newDealerList" />
        ),
      },
      {
        path: "/customerList",
        element: (
          <PrivateRoute element={<CustomerList />} path="/customerList" />
        ),
      },
      {
        path: "/addServicer/:id?",
        element: <PrivateRoute element={<AddServicer />} />,
      },
      {
        path: "/servicerList",
        element: (
          <PrivateRoute element={<ServicerList />} path="/servicerList" />
        ),
      },
      {
        path: "/customerDetails/:customerId",
        index: true,
        element: <PrivateRoute element={<CustomerDetails />} />,
      },
      {
        path: "/servicerRequestList",
        element: (
          <PrivateRoute
            element={<RequestServicer />}
            path="/servicerRequestList"
          />
        ),
      },
      {
        path: "/addOrder",
        element: <PrivateRoute element={<AddOrder />} path="/addOrder" />,
      },
      {
        path: "/orderList",
        element: <PrivateRoute element={<OrderList />} path="/orderList" />,
      },
      {
        path: "/contractList",
        element: <PrivateRoute element={<ContractList />} path="/contractList" />,
      },
      {
        path: "/claimList",
        element: <PrivateRoute element={<ClaimList />} path="/claimList" />,
      },
      {
        path: "/addClaim",
        element: <PrivateRoute element={<AddClaim />} path="/addClaim" />,
      },
      {
        path: "/resellerList",
        element: <PrivateRoute element={<ResellerList />} path="/resellerList" />,
      },
      {
        path: "/addReseller/:dealerValueId?",
        element: <PrivateRoute element={<AddReseller />} />,
      },
      {
        path: "/addBulkClaim",
        element: <PrivateRoute element={<AddBulkClaim />} path="/addBulkClaim" />,
      },
      {
        path: "/sale",
        element: <PrivateRoute element={<Sale />} path="/sale" />,
      },
      {
        path: "/claims",
        element: <PrivateRoute element={<Claims />} path="/claims" />,
      },
    ],
  },
];

export default routes;
