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
import AddReseller from "../pages/dashboard/Reseller/addReseller";
import ResellerList from "../pages/dashboard/Reseller/resellerList";
import Sale from "../pages/dashboard/Reporting/sale";
import OrderDetails from "../pages/dashboard/Order/order-details";
import Claims from "../pages/dashboard/Reporting/claims";
import ResellerDetails from "../pages/dashboard/Reseller/resellerDetails";
import Account from "../pages/dashboard/Manage-account/account";
import DealerDashboard from "../pages/Dealer-screens/dashboard";
import DealerUser from "../pages/Dealer-screens/user";
import DealerContract from "../pages/Dealer-screens/contract";
import DealerPriceBook from "../pages/Dealer-screens/priceBook";
import DealerSale from "../pages/Dealer-screens/Reporting/sale";
import DealerClaims from "../pages/Dealer-screens/Reporting/claims";
import DealerClaimList from "../pages/Dealer-screens/Claim/claimList";
import ServicerUser from "../pages/Servicer-screens/user";
import ServicerDashboard from "../pages/Servicer-screens/dashboard";
import ServicerClaimList from "../pages/Servicer-screens/Claim/claimList";
import ServicerClaims from "../pages/Servicer-screens/Reporting/claims";
import ServicerAddClaim from "../pages/Servicer-screens/Claim/addClaim";
import ServicerAddBulkClaim from "../pages/Servicer-screens/Claim/addBulkClaim";
import DealerAddClaim from "../pages/Dealer-screens/Claim/addClaim";
import DealerAddBulkClaim from "../pages/Dealer-screens/Claim/addBulkClaim";
import DealerAddCustomer from "../pages/Dealer-screens/Customer/addCustomer";
import DealerCustomerList from "../pages/Dealer-screens/Customer/customerList";
import DealerAddReseller from "../pages/Dealer-screens/Reseller/addReseller";
import DealerResellerList from "../pages/Dealer-screens/Reseller/resellerList";
import DealerAddOrder from "../pages/Dealer-screens/Order/addOrder";
import DealerOrderList from "../pages/Dealer-screens/Order/orderList";
import DealerContractList from "../pages/Dealer-screens/Contract/contractList";
import DealerEditContract from "../pages/Dealer-screens/Contract/editContract";
import DealerAddServicer from "../pages/Dealer-screens/Servicer/addServicer";
import DealerServicerList from "../pages/Dealer-screens/Servicer/servicerList";
import DealerServicerDetails from "../pages/Dealer-screens/Servicer/servicerDetails";
import ArchiveOrderList from "../pages/dashboard/Order/order-archive";
import ServicerDealerList from "../pages/Servicer-screens/Dealer/dealerLIst";
import DealerResellerDetails from "../pages/Dealer-screens/Reseller/resellerDetails";
import DealerCustomerDetails from "../pages/Dealer-screens/Customer/customerDetails";
import ResellerAddBulkClaim from "../pages/Reseller-screens/Claim/addBulkClaim";
import ResellerAddClaim from "../pages/Reseller-screens/Claim/addClaim";
import ResellerClaimList from "../pages/Reseller-screens/Claim/claimList";
import ResellerClaims from "../pages/Reseller-screens/Reporting/claims";
import ResellerSale from "../pages/Reseller-screens/Reporting/sale";
import ResellerContractList from "../pages/Reseller-screens/Contract/contractList";
import ResellerPriceBook from "../pages/Reseller-screens/priceBook";
import ResellerCustomerDetails from "../pages/Reseller-screens/Customer/customerDetails";
import ResellerServicerDetails from "../pages/Reseller-screens/Servicer/servicerDetails";
import ResellerServicerList from "../pages/Reseller-screens/Servicer/servicerList";
import ResellerAddServicer from "../pages/Reseller-screens/Servicer/addServicer";
import ResellerOrderList from "../pages/Reseller-screens/Order/orderList";
import ResellerAddOrder from "../pages/Reseller-screens/Order/addOrder";
import ResellerEditContract from "../pages/Reseller-screens/Contract/editContract";
import ResellerCustomerList from "../pages/Reseller-screens/Customer/customerList";
import ResellerAddCustomer from "../pages/Reseller-screens/Customer/addCustomer";
import ResellerUser from "../pages/Reseller-screens/user";
import ResellerDashboard from "../pages/Reseller-screens/dashboard";
import CustomerDashboard from "../pages/Customer-screens/dashboard";
import CustomerUser from "../pages/Customer-screens/user";
import CustomerAddClaim from "../pages/Customer-screens/Claim/addClaim";
import CustomerClaimList from "../pages/Customer-screens/Claim/claimList";
import CustomerContractList from "../pages/Customer-screens/Contract/contractList";
import CustomerAddBulkClaim from "../pages/Customer-screens/Claim/addBulkClaim";
import CustomerEditContract from "../pages/Customer-screens/Contract/editContract";
import CustomerOrderList from "../pages/Customer-screens/Order/orderList";
import CustomerAddOrder from "../pages/Customer-screens/Order/addOrder";
import CustomerOrderDetails from "../pages/Customer-screens/Order/order-details";
import CustomerAddDealerBook from "../pages/Dealer-screens/Price-Book/addDealerBook";
import ResellerOrderDetails from "../pages/Reseller-screens/Order/order-details";
import DealerOrderDetails from "../pages/Dealer-screens/Order/order-details";

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

      // With Login URLS =========>
    ],
  },

  //
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
        path: "/orderDetails/:orderId",
        index: true,
        element: <PrivateRoute element={<OrderDetails />} />,
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
      {
        path: "/dealerDetails/:id",
        index: true,
        element: <PrivateRoute element={<DealerDetails />} />,
      },

      {
        path: "/addDealer/:id?",
        element: <PrivateRoute element={<Dealer />} />,
      },
      {
        path: "/addCustomer/:dealerValueId?/:typeofUser?",
        element: <PrivateRoute element={<AddCustomer />} />,
      },
      {
        path: "/addDealerBook/:dealerIdValue?",
        element: <PrivateRoute element={<AddDealerBook />} />,
      },
      {
        path: "/addOrderforReseller/:resellerId?/:dealerValue?",
        element: <PrivateRoute element={<AddOrder />} />,
      },
      {
        path: "/addOrderforCustomer/:customerId?/:dealerValue?/:resellerId?",
        element: <PrivateRoute element={<AddOrder />} />,
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
        path: "/addOrder/:dealerId?",
        element: <PrivateRoute element={<AddOrder />} />,
      },
      {
        path: "/editOrder/:orderId?",
        element: <PrivateRoute element={<AddOrder />} />,
      },
      {
        path: "/orderList",
        element: <PrivateRoute element={<OrderList />} path="/orderList" />,
      },
      {
        path: "/contractList",
        element: (
          <PrivateRoute element={<ContractList />} path="/contractList" />
        ),
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
        element: (
          <PrivateRoute element={<ResellerList />} path="/resellerList" />
        ),
      },
      {
        path: "/addReseller/:dealerValueId?",
        element: <PrivateRoute element={<AddReseller />} />,
      },
      {
        path: "/addBulkClaim",
        element: (
          <PrivateRoute element={<AddBulkClaim />} path="/addBulkClaim" />
        ),
      },
      {
        path: "/sale",
        element: <PrivateRoute element={<Sale />} path="/sale" />,
      },
      {
        path: "/claims",
        element: <PrivateRoute element={<Claims />} path="/claims" />,
      },
      {
        path: "/archiveOrder",
        element: (
          <PrivateRoute element={<ArchiveOrderList />} path="/archiveOrder" />
        ),
      },
      {
        path: "/manageAccount",
        element: <PrivateRoute element={<Account />} path="/manageAccount" />,
      },

      // Dealer Routs ---------------------------------------------------------------
      {
        path: "/dealer/orderDetails",
        element: (
          <PrivateRoute
            element={<DealerOrderDetails />}
            path="/dealer/orderDetails"
          />
        ),
      },
      {
        path: "/dealer/dashboard",
        element: (
          <PrivateRoute
            element={<DealerDashboard />}
            path="/dealer/dashboard"
          />
        ),
      },
      {
        path: "/dealer/user",
        element: <PrivateRoute element={<DealerUser />} path="/dealer/user" />,
      },
      {
        path: "/dealer/addCustomer",
        element: (
          <PrivateRoute
            element={<DealerAddCustomer />}
            path="/dealer/addCustomer"
          />
        ),
      },
      {
        path: "/dealer/customerList",
        element: (
          <PrivateRoute
            element={<DealerCustomerList />}
            path="/dealer/customerList"
          />
        ),
      },
      {
        path: "/dealer/contractList",
        element: (
          <PrivateRoute
            element={<DealerContractList />}
            path="/dealer/contractList"
          />
        ),
      },
      {
        path: "/dealer/editContract",
        element: (
          <PrivateRoute
            element={<DealerEditContract />}
            path="/dealer/editContract"
          />
        ),
      },
      {
        path: "/dealer/addOrder",
        element: (
          <PrivateRoute element={<DealerAddOrder />} path="/dealer/addOrder" />
        ),
      },
      {
        path: "/dealer/orderList",
        element: (
          <PrivateRoute
            element={<DealerOrderList />}
            path="/dealer/orderList"
          />
        ),
      },
      {
        path: "/dealer/addReseller",
        element: (
          <PrivateRoute
            element={<DealerAddReseller />}
            path="/dealer/addReseller"
          />
        ),
      },
      {
        path: "/dealer/resellerList",
        element: (
          <PrivateRoute
            element={<DealerResellerList />}
            path="/dealer/resellerList"
          />
        ),
      },
      {
        path: "/dealer/addServicer",
        element: (
          <PrivateRoute
            element={<DealerAddServicer />}
            path="/dealer/addServicer"
          />
        ),
      },
      {
        path: "/dealer/servicerList",
        element: (
          <PrivateRoute
            element={<DealerServicerList />}
            path="/dealer/servicerList"
          />
        ),
      },
      {
        path: "/dealer/resellerDetails/:resellerId",
        index: true,
        element: <PrivateRoute element={<DealerResellerDetails />} />,
      },
      {
        path: "/dealer/servicerDetails",
        element: (
          <PrivateRoute
            element={<DealerServicerDetails />}
            path="/dealer/servicerDetails"
          />
        ),
      },
      {
        path: "/dealer/customerDetails/:customerId",
        element: (
          <PrivateRoute
            element={<DealerCustomerDetails />}
          />
        ),
      },
      {
        path: "/dealer/customerDetails/:customerId",
        element: (
          <PrivateRoute
            element={<DealerCustomerList />}
            path="/dealer/customerDetails/:customerId"
          />
        ),
      },
      {
        path: "/dealer/priceBook",
        element: (
          <PrivateRoute
            element={<DealerPriceBook />}
            path="/dealer/priceBook"
          />
        ),
      },
      {
        path: "/dealer/contract",
        element: (
          <PrivateRoute element={<DealerContract />} path="/dealer/contract" />
        ),
      },
      {
        path: "/dealer/sale",
        element: <PrivateRoute element={<DealerSale />} path="/dealer/sale" />,
      },
      {
        path: "/dealer/claim",
        element: (
          <PrivateRoute element={<DealerClaims />} path="/dealer/claim" />
        ),
      },
      {
        path: "/dealer/claimList",
        element: (
          <PrivateRoute
            element={<DealerClaimList />}
            path="/dealer/claimList"
          />
        ),
      },
      {
        path: "/dealer/addClaim",
        element: (
          <PrivateRoute element={<DealerAddClaim />} path="/dealer/addClaim" />
        ),
      },
      {
        path: "/dealer/addBulkClaim",
        element: (
          <PrivateRoute
            element={<DealerAddBulkClaim />}
            path="/dealer/addBulkClaim"
          />
        ),
      },
      {
        path: "/dealer/addPriceBook",
        element: (
          <PrivateRoute
            element={<CustomerAddDealerBook />}
            path="/dealer/addPriceBook"
          />
        ),
      },

      // Servicer Routs ---------------------------------------------------------------

      {
        path: "/servicer/user",
        element: (
          <PrivateRoute element={<ServicerUser />} path="/servicer/user" />
        ),
      },
      {
        path: "/servicer/dashboard",
        element: (
          <PrivateRoute
            element={<ServicerDashboard />}
            path="/servicer/dashboard"
          />
        ),
      },
      {
        path: "/servicer/dealerList",
        element: (
          <PrivateRoute
            element={<ServicerDealerList />}
            path="/servicer/dealerList"
          />
        ),
      },
      {
        path: "/servicer/claimList",
        element: (
          <PrivateRoute
            element={<ServicerClaimList />}
            path="/servicer/claimList"
          />
        ),
      },
      {
        path: "/servicer/claims",
        element: (
          <PrivateRoute element={<ServicerClaims />} path="/servicer/claims" />
        ),
      },
      {
        path: "/servicer/addClaim",
        element: (
          <PrivateRoute
            element={<ServicerAddClaim />}
            path="/dealer/addClaim"
          />
        ),
      },
      {
        path: "/servicer/addBulkClaim",
        element: (
          <PrivateRoute
            element={<ServicerAddBulkClaim />}
            path="/servicer/claimList"
          />
        ),
      },

 // Reseller Routs ---------------------------------------------------------------

      {
        path: "/reseller/dashboard",
        element: (
          <PrivateRoute
            element={<ResellerDashboard />}
            path="/reseller/dashboard"
          />
        ),
      },
      {
        path: "/reseller/user",
        element: <PrivateRoute element={<ResellerUser />} path="/dealer/user" />,
      },
      {
        path: "/reseller/addCustomer",
        element: (
          <PrivateRoute
            element={<ResellerAddCustomer />}
            path="/reseller/addCustomer"
          />
        ),
      },
      {
        path: "/reseller/customerList",
        element: (
          <PrivateRoute
            element={<ResellerCustomerList />}
            path="/reseller/customerList"
          />
        ),
      },
      {
        path: "/reseller/contractList",
        element: (
          <PrivateRoute
            element={<ResellerContractList />}
            path="/reseller/contractList"
          />
        ),
      },
      {
        path: "/reseller/editContract",
        element: (
          <PrivateRoute
            element={<ResellerEditContract />}
            path="/reseller/editContract"
          />
        ),
      },
      {
        path: "/reseller/addOrder",
        element: (
          <PrivateRoute element={<ResellerAddOrder />} path="/reseller/addOrder" />
        ),
      },
      {
        path: "/reseller/orderList",
        element: (
          <PrivateRoute
            element={<ResellerOrderList />}
            path="/reseller/orderList"
          />
        ),
      },
      {
        path: "/reseller/addServicer",
        element: (
          <PrivateRoute
            element={<ResellerAddServicer />}
            path="/reseller/addServicer"
          />
        ),
      },
      {
        path: "/reseller/servicerList",
        element: (
          <PrivateRoute
            element={<ResellerServicerList />}
            path="/reseller/servicerList"
          />
        ),
      },
      {
        path: "/reseller/servicerDetails",
        element: (
          <PrivateRoute
            element={<ResellerServicerDetails />}
            path="/reseller/servicerDetails"
          />
        ),
      },
      {
        path: "/reseller/customerDetails/:customerId",
        element: (
          <PrivateRoute
            element={<ResellerCustomerDetails />}
            path="/reseller/customerDetails/:customerId"
          />
        ),
      },
      {
        path: "/reseller/priceBook",
        element: (
          <PrivateRoute
            element={<ResellerPriceBook />}
            path="/reseller/priceBook"
          />
        ),
      },
      {
        path: "/reseller/contract",
        element: (
          <PrivateRoute element={<ResellerContractList />} path="/reseller/contract" />
        ),
      },
      {
        path: "/reseller/sale",
        element: <PrivateRoute element={<ResellerSale />} path="/reseller/sale" />,
      },
      {
        path: "/reseller/claim",
        element: (
          <PrivateRoute element={<ResellerClaims />} path="/reseller/claim" />
        ),
      },
      {
        path: "/reseller/claimList",
        element: (
          <PrivateRoute
            element={<ResellerClaimList />}
            path="/reseller/claimList"
          />
        ),
      },
      {
        path: "/reseller/addClaim",
        element: (
          <PrivateRoute element={<ResellerAddClaim />} path="/reseller/addClaim" />
        ),
      },
      {
        path: "/reseller/addBulkClaim",
        element: (
          <PrivateRoute
            element={<ResellerAddBulkClaim />}
            path="/reseller/addBulkClaim"
          />
        ),
      },
      {
        path: "/reseller/orderDetails",
        element: (
          <PrivateRoute
            element={<ResellerOrderDetails />}
            path="/reseller/orderDetails"
          />
        ),
      },

       // Customer Routs ---------------------------------------------------------------

       {
        path: "/customer/dashboard",
        element: (
          <PrivateRoute
            element={<CustomerDashboard />}
            path="/customer/dashboard"
          />
        ),
      },
      {
        path: "/customer/user",
        element: <PrivateRoute element={<CustomerUser />} path="/customer/user" />,
      },
      {
        path: "/customer/addClaim",
        element: (
          <PrivateRoute
            element={<CustomerAddClaim />}
            path="/customer/addClaim"
          />
        ),
      },
      {
        path: "/customer/claimList",
        element: (
          <PrivateRoute
            element={<CustomerClaimList />}
            path="/customer/claimList"
          />
        ),
      },
      {
        path: "/customer/addBulkClaim",
        element: (
          <PrivateRoute
            element={<CustomerAddBulkClaim />}
            path="/customer/addBulkClaim"
          />
        ),
      },
      {
        path: "/customer/contractList",
        element: (
          <PrivateRoute
            element={<CustomerContractList />}
            path="/customer/contractList"
          />
        ),
      },
      {
        path: "/customer/editContract",
        element: (
          <PrivateRoute
            element={<CustomerEditContract />}
            path="/customer/editContract"
          />
        ),
      },
      {
        path: "/customer/orderList",
        element: (
          <PrivateRoute
            element={<CustomerOrderList />}
            path="/customer/orderList"
          />
        ),
      },
      {
        path: "/customer/addOrder",
        element: (
          <PrivateRoute
            element={<CustomerAddOrder />}
            path="/customer/addOrder"
          />
        ),
      },
      {
        path: "/customer/orderDetails",
        element: (
          <PrivateRoute
            element={<CustomerOrderDetails />}
            path="/customer/orderDetails"
          />
        ),
      },
    ],
  },
];

export default routes;
