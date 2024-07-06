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
import DealerContract from "../pages/Dealer-screens/Contract/contractList";
import DealerPriceBook from "../pages/Dealer-screens/priceBook";
import DealerSale from "../pages/Dealer-screens/Reporting/sale";
import DealerClaims from "../pages/Dealer-screens/Reporting/claims";
import ServicerUser from "../pages/Servicer-screens/user";
import ServicerDashboard from "../pages/Servicer-screens/dashboard";
import ServicerClaims from "../pages/Servicer-screens/Reporting/claims";
import ServicerAddClaim from "../pages/Servicer-screens/Claim/addClaim";
import ServicerAddBulkClaim from "../pages/Servicer-screens/Claim/addBulkClaim";
import NotFoundPage from "./notFoundPage";
import DealerAddCustomer from "../pages/Dealer-screens/Customer/addCustomer";
import DealerCustomerList from "../pages/Dealer-screens/Customer/customerList";
import DealerAddReseller from "../pages/Dealer-screens/Reseller/addReseller";
import DealerResellerList from "../pages/Dealer-screens/Reseller/resellerList";
import DealerAddOrder from "../pages/Dealer-screens/Order/addOrder";
import DealerOrderList from "../pages/Dealer-screens/Order/orderList";
import DealerContractList from "../pages/Dealer-screens/Contract/contractList";
import DealerAddServicer from "../pages/Dealer-screens/Servicer/addServicer";
import DealerServicerList from "../pages/Dealer-screens/Servicer/servicerList";
import DealerServicerDetails from "../pages/Dealer-screens/Servicer/servicerDetails";
import ArchiveOrderList from "../pages/dashboard/Order/order-archive";
import ServicerDealerList from "../pages/Servicer-screens/Dealer/dealerLIst";
import DealerResellerDetails from "../pages/Dealer-screens/Reseller/resellerDetails";
import DealerCustomerDetails from "../pages/Dealer-screens/Customer/customerDetails";

import ResellerSale from "../pages/Reseller-screens/Reporting/sale";
import ResellerContractList from "../pages/Reseller-screens/Contract/contractList";
import ResellerPriceBook from "../pages/Reseller-screens/priceBook";
import ResellerCustomerDetails from "../pages/Reseller-screens/Customer/customerDetails";
import ResellerServicerDetails from "../pages/Reseller-screens/Servicer/servicerDetails";
import ResellerServicerList from "../pages/Reseller-screens/Servicer/servicerList";
import ResellerAddServicer from "../pages/Reseller-screens/Servicer/addServicer";
import ResellerOrderList from "../pages/Reseller-screens/Order/orderList";
import ResellerAddOrder from "../pages/Reseller-screens/Order/addOrder";
import ResellerCustomerList from "../pages/Reseller-screens/Customer/customerList";
import ResellerAddCustomer from "../pages/Reseller-screens/Customer/addCustomer";
import ResellerUser from "../pages/Reseller-screens/user";
import ResellerDashboard from "../pages/Reseller-screens/dashboard";
import CustomerDashboard from "../pages/Customer-screens/dashboard";
import CustomerUser from "../pages/Customer-screens/user";
import CustomerContractList from "../pages/Customer-screens/Contract/contractList";
import CustomerOrderList from "../pages/Customer-screens/Order/orderList";
import CustomerAddOrder from "../pages/Customer-screens/Order/addOrder";
import CustomerOrderDetails from "../pages/Customer-screens/Order/order-details";
import CustomerAddDealerBook from "../pages/Dealer-screens/Price-Book/addDealerBook";
import DealerOrderDetails from "../pages/Dealer-screens/Order/order-details";
import ClaimList12 from "../pages/Dealer-screens/Claim/claimList";
import ResellerClaimList from "../pages/Reseller-screens/Claim/claimList";
import AllList from "../pages/Servicer-screens/Reporting/claims";

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
          <PrivateRoute
            element={<Dashboard />}
            role={"admin"}
            exact
            path="/dashboard"
          />
        ),
      },

      {
        path: "/notifications",
        index: true,
        element: (
          <PrivateRoute
            element={<Notification />}
            role={"admin"}
            path="/notifications"
          />
        ),
      },
      {
        path: "/editContract/:id",
        index: true,
        element: <PrivateRoute element={<EditContract />} role={"admin"} />,
      },
      {
        path: "/orderDetails/:orderId",
        index: true,
        element: <PrivateRoute element={<OrderDetails />} role={"admin"} />,
      },
      {
        path: "/servicerDetails/:servicerId",
        index: true,
        element: <PrivateRoute element={<ServicerDetails />} role={"admin"} />,
      },
      {
        path: "/resellerDetails/:resellerId",
        index: true,
        element: <PrivateRoute element={<ResellerDetails />} role={"admin"} />,
      },
      {
        path: "/dealerDetails/:id",
        index: true,
        element: <PrivateRoute element={<DealerDetails />} role={"admin"} />,
      },

      {
        path: "/addDealer/:id?",
        element: <PrivateRoute element={<Dealer />} role={"admin"} />,
      },
      {
        path: "/addCustomer/:dealerValueId?/:typeofUser?",
        element: <PrivateRoute element={<AddCustomer />} role={"admin"} />,
      },
      {
        path: "/addDealerBook/:dealerIdValue?",
        element: <PrivateRoute element={<AddDealerBook />} role={"admin"} />,
      },
      {
        path: "/addOrderforReseller/:resellerId?/:dealerValue?",
        element: <PrivateRoute element={<AddOrder />} role={"admin"} />,
      },
      {
        path: "/addOrderforCustomer/:customerId?/:dealerValue?/:resellerId?",
        element: <PrivateRoute element={<AddOrder />} role={"admin"} />,
      },
      {
        path: "/editDealerBook/:id/:dealerIdValue?",
        element: <PrivateRoute element={<AddDealerBook />} role={"admin"} />,
      },
      {
        path: "/addCompanyPriceBook",
        element: (
          <PrivateRoute
            element={<AddCompanyPriceBook />}
            role={"admin"}
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
            role={"admin"}
            path="/uploadDealerBook"
          />
        ),
      },
      {
        path: "/addCategory",
        element: (
          <PrivateRoute
            element={<AddCategory />}
            role={"admin"}
            path="/addCategory"
          />
        ),
      },
      {
        path: "/editCategory/:id",
        element: <PrivateRoute element={<AddCategory />} role={"admin"} />,
      },
      {
        path: "/dealerList",
        element: <PrivateRoute element={<DealerList />} role={"admin"} />,
      },
      {
        path: "/dealerPriceList/:dealerName?",
        element: <PrivateRoute element={<DealerPriceList />} role={"admin"} />,
      },
      {
        path: "/category",
        element: (
          <PrivateRoute
            element={<Category />}
            role={"admin"}
            path="/category"
          />
        ),
      },
      {
        path: "/companyPriceBook",
        element: (
          <PrivateRoute
            element={<CompanyPriceBook />}
            role={"admin"}
            path="/companyPriceBook"
          />
        ),
      },
      {
        path: "/newDealerList",
        element: (
          <PrivateRoute
            element={<NewDealerList />}
            role={"admin"}
            path="/newDealerList"
          />
        ),
      },
      {
        path: "/customerList",
        element: (
          <PrivateRoute
            element={<CustomerList />}
            role={"admin"}
            path="/customerList"
          />
        ),
      },
      {
        path: "/addServicer/:id?",
        element: <PrivateRoute element={<AddServicer />} role={"admin"} />,
      },
      {
        path: "/servicerList",
        element: (
          <PrivateRoute
            element={<ServicerList />}
            role={"admin"}
            path="/servicerList"
          />
        ),
      },
      {
        path: "/customerDetails/:customerId",
        index: true,
        element: <PrivateRoute element={<CustomerDetails />} role={"admin"} />,
      },
      {
        path: "/servicerRequestList",
        element: (
          <PrivateRoute
            element={<RequestServicer />}
            role={"admin"}
            path="/servicerRequestList"
          />
        ),
      },
      {
        path: "/addOrder/:dealerId?",
        element: <PrivateRoute element={<AddOrder />} role={"admin"} />,
      },
      {
        path: "/editOrder/:orderId",
        element: <PrivateRoute element={<AddOrder />} role={"admin"} />,
      },
      {
        path: "/editOrder/:orderId?/:customerId?/customer",
        element: <PrivateRoute element={<AddOrder />} role={"admin"} />,
      },
      {
        path: "/editOrder/:orderId?/:dealerId?/dealer",
        element: <PrivateRoute element={<AddOrder />} role={"admin"} />,
      },
      {
        path: "/editOrder/:orderId?/:resellerId?/reseller",
        element: <PrivateRoute element={<AddOrder />} role={"admin"} />,
      },
      {
        path: "/orderList",
        element: (
          <PrivateRoute
            element={<OrderList />}
            role={"admin"}
            path="/orderList"
          />
        ),
      },
      {
        path: "/contractList",
        element: (
          <PrivateRoute
            element={<ContractList />}
            role={"admin"}
            path="/contractList"
          />
        ),
      },
      {
        path: "/claimList/:claimIdValue?",
        element: <PrivateRoute element={<ClaimList />} role={"admin"} />,
      },

      {
        path: "/addClaim",
        element: (
          <PrivateRoute
            element={<AddClaim />}
            role={"admin"}
            path="/addClaim"
          />
        ),
      },
      {
        path: "/customer/addClaim/:username",
        element: <PrivateRoute element={<AddClaim />} role={"admin"} />,
      },
      {
        path: "/resellerList",
        element: (
          <PrivateRoute
            element={<ResellerList />}
            role={"admin"}
            path="/resellerList"
          />
        ),
      },
      {
        path: "/addReseller/:dealerValueId?",
        element: <PrivateRoute element={<AddReseller />} role={"admin"} />,
      },
      {
        path: "/addBulkClaim",
        element: <PrivateRoute element={<AddBulkClaim />} role={"admin"} />,
      },
      {
        path: "/Reporting/sale",
        element: (
          <PrivateRoute
            element={<Sale />}
            role={"admin"}
            path="/Reporting/sale"
          />
        ),
      },
      {
        path: "/Reporting/claims",
        element: <PrivateRoute element={<Claims />} path="/Reporting/claims" />,
      },
      {
        path: "/archiveOrder",
        element: (
          <PrivateRoute
            element={<ArchiveOrderList />}
            role={"admin"}
            path="/archiveOrder"
          />
        ),
      },
      {
        path: "/manageAccount",
        element: (
          <PrivateRoute
            element={<Account />}
            role={"admin"}
            path="/manageAccount"
          />
        ),
      },

      // Dealer Routs ---------------------------------------------------------------
      {
        path: "/dealer/notifications",
        index: true,
        element: (
          <PrivateRoute
            element={<Notification />}
            role={"dealer"}
            path="/dealer/notifications"
          />
        ),
      },
      {
        path: "/dealer/orderDetails/:orderId",
        element: (
          <PrivateRoute element={<DealerOrderDetails />} role={"dealer"} />
        ),
      },
      {
        path: "/dealer/addOrderforReseller/:resellerId?",
        element: <PrivateRoute element={<DealerAddOrder />} role={"dealer"} />,
      },
      {
        path: "/dealer/addOrderforCustomer/:customerId?/:resellerId?",
        element: <PrivateRoute element={<DealerAddOrder />} role={"dealer"} />,
      },
      {
        path: "/dealer/dashboard",
        element: (
          <PrivateRoute
            element={<DealerDashboard />}
            role={"dealer"}
            path="/dealer/dashboard"
          />
        ),
      },
      {
        path: "/dealer/user",
        element: (
          <PrivateRoute
            element={<DealerUser />}
            role={"dealer"}
            path="/dealer/user"
          />
        ),
      },
      {
        path: "/dealer/addCustomer/:resellerId?/:typeofUser?",
        element: (
          <PrivateRoute element={<DealerAddCustomer />} role={"dealer"} />
        ),
      },
      {
        path: "/dealer/customerList",
        element: (
          <PrivateRoute
            element={<DealerCustomerList />}
            role={"dealer"}
            path="/dealer/customerList"
          />
        ),
      },
      {
        path: "/dealer/archiveOrder",
        element: (
          <PrivateRoute
            element={<ArchiveOrderList />}
            role={"dealer"}
            path="/dealer/archiveOrder"
          />
        ),
      },
      {
        path: "/dealer/contractList",
        element: (
          <PrivateRoute
            element={<DealerContractList />}
            role={"dealer"}
            path="/dealer/contractList"
          />
        ),
      },
      {
        path: "/dealer/editOrder/:orderId?/:typeValue?",
        element: <PrivateRoute element={<DealerAddOrder />} role={"dealer"} />,
      },
      {
        path: "/dealer/addOrder",
        element: (
          <PrivateRoute
            element={<DealerAddOrder />}
            role={"dealer"}
            path="/dealer/addOrder"
          />
        ),
      },
      {
        path: "/dealer/orderList",
        element: (
          <PrivateRoute
            element={<DealerOrderList />}
            role={"dealer"}
            path="/dealer/orderList"
          />
        ),
      },
      {
        path: "/dealer/addReseller",
        element: (
          <PrivateRoute
            element={<DealerAddReseller />}
            role={"dealer"}
            path="/dealer/addReseller"
          />
        ),
      },
      {
        path: "/dealer/resellerList",
        element: (
          <PrivateRoute
            element={<DealerResellerList />}
            role={"dealer"}
            path="/dealer/resellerList"
          />
        ),
      },
      {
        path: "/dealer/addServicer",
        element: (
          <PrivateRoute
            element={<DealerAddServicer />}
            role={"dealer"}
            path="/dealer/addServicer"
          />
        ),
      },
      {
        path: "/dealer/servicerList",
        element: (
          <PrivateRoute
            element={<DealerServicerList />}
            role={"dealer"}
            path="/dealer/servicerList"
          />
        ),
      },
      {
        path: "/dealer/resellerDetails/:resellerId",
        index: true,
        element: (
          <PrivateRoute element={<DealerResellerDetails />} role={"dealer"} />
        ),
      },
      {
        path: "/dealer/servicerDetails",
        element: (
          <PrivateRoute
            element={<DealerServicerDetails />}
            role={"dealer"}
            path="/dealer/servicerDetails"
          />
        ),
      },
      {
        path: "/dealer/customerDetails/:customerId",
        element: (
          <PrivateRoute element={<DealerCustomerDetails />} role={"dealer"} />
        ),
      },
      {
        path: "/dealer/priceBook",
        element: (
          <PrivateRoute
            element={<DealerPriceBook />}
            role={"dealer"}
            path="/dealer/priceBook"
          />
        ),
      },
      {
        path: "/dealer/contract",
        element: (
          <PrivateRoute
            element={<DealerContract />}
            role={"dealer"}
            path="/dealer/contract"
          />
        ),
      },
      {
        path: "/dealer/sale",
        element: (
          <PrivateRoute
            element={<DealerSale />}
            role={"dealer"}
            path="/dealer/sale"
          />
        ),
      },
      {
        path: "/dealer/claim",
        element: (
          <PrivateRoute
            element={<DealerClaims />}
            role={"dealer"}
            path="/dealer/claim"
          />
        ),
      },
      {
        path: "/dealer/claimList",
        element: (
          <PrivateRoute
            element={<ClaimList12 />}
            role={"dealer"}
            path="/dealer/claimList"
          />
        ),
      },
      {
        path: "/dealer/unPaidClaimList",
        element: (
          <PrivateRoute
            element={<ClaimList />}
            role={"dealer"}
            path="/dealer/unPaidClaimList"
          />
        ),
      },
      {
        path: "/dealer/paidClaimList",
        element: (
          <PrivateRoute
            element={<ClaimList />}
            role={"dealer"}
            path="/dealer/paidClaimList"
          />
        ),
      },
      {
        path: "/dealer/addClaim/:username?",
        element: <PrivateRoute element={<AddClaim />} role={"dealer"} />,
      },
      {
        path: "/dealer/addBulkClaim",
        element: (
          <PrivateRoute
            element={<AddBulkClaim />}
            path="/dealer/addBulkClaim"
            role={"dealer"}
          />
        ),
      },
      {
        path: "/dealer/addPriceBook",
        element: (
          <PrivateRoute
            element={<CustomerAddDealerBook />}
            path="/dealer/addPriceBook"
            role={"dealer"}
          />
        ),
      },

      // Servicer Routs ---------------------------------------------------------------
      {
        path: "/servicer/notifications",
        index: true,
        element: (
          <PrivateRoute
            element={<Notification />}
            role={"servicer"}
            path="/servicer/notifications"
          />
        ),
      },
      {
        path: "/servicer/user",
        element: (
          <PrivateRoute
            element={<ServicerUser />}
            role={"servicer"}
            path="/servicer/user"
          />
        ),
      },
      {
        path: "/servicer/dashboard",
        element: (
          <PrivateRoute
            element={<ServicerDashboard />}
            role={"servicer"}
            path="/servicer/dashboard"
          />
        ),
      },
      {
        path: "/servicer/dealerList",
        element: (
          <PrivateRoute
            element={<ServicerDealerList />}
            role={"servicer"}
            path="/servicer/dealerList"
          />
        ),
      },
      {
        path: "/servicer/claimList",
        element: (
          <PrivateRoute
            element={<AllList />}
            role={"servicer"}
            path="/servicer/claimList"
          />
        ),
      },
      {
        path: "/servicer/claims",
        element: (
          <PrivateRoute
            element={<ServicerClaims />}
            role={"servicer"}
            path="/servicer/claims"
          />
        ),
      },
      {
        path: "/servicer/addClaim",
        element: (
          <PrivateRoute element={<ServicerAddClaim />} role={"servicer"} />
        ),
      },
      {
        path: "/servicer/addBulkClaim",
        element: (
          <PrivateRoute
            element={<ServicerAddBulkClaim />}
            role={"servicer"}
            path="/servicer/claimList"
          />
        ),
      },

      // Reseller Routs ---------------------------------------------------------------
      {
        path: "/reseller/notifications",
        index: true,
        element: (
          <PrivateRoute
            element={<Notification />}
            role={"reseller"}
            path="/reseller/notifications"
          />
        ),
      },
      {
        path: "/reseller/dashboard",
        element: (
          <PrivateRoute
            element={<ResellerDashboard />}
            role={"reseller"}
            path="/reseller/dashboard"
          />
        ),
      },
      {
        path: "/reseller/user",
        element: (
          <PrivateRoute
            element={<ResellerUser />}
            role={"reseller"}
            path="/reseller/user"
          />
        ),
      },
      {
        path: "/reseller/addCustomer",
        element: (
          <PrivateRoute
            element={<ResellerAddCustomer />}
            role={"reseller"}
            path="/reseller/addCustomer"
          />
        ),
      },
      {
        path: "/reseller/customerList",
        element: (
          <PrivateRoute
            element={<ResellerCustomerList />}
            role={"reseller"}
            path="/reseller/customerList"
          />
        ),
      },
      {
        path: "/reseller/contractList",
        element: (
          <PrivateRoute
            element={<ContractList />}
            role={"reseller"}
            path="/reseller/contractList"
          />
        ),
      },
      {
        path: "/reseller/addOrder",
        element: (
          <PrivateRoute element={<ResellerAddOrder />} role={"reseller"} />
        ),
      },
      {
        path: "/reseller/addOrder/:customerId",
        element: (
          <PrivateRoute element={<ResellerAddOrder />} role={"reseller"} />
        ),
      },
      {
        path: "/reseller/editOrder/:orderId?",
        element: (
          <PrivateRoute element={<ResellerAddOrder />} role={"reseller"} />
        ),
      },
      {
        path: "/reseller/orderList",
        element: (
          <PrivateRoute
            element={<ResellerOrderList />}
            role={"reseller"}
            path="/reseller/orderList"
          />
        ),
      },
      {
        path: "/reseller/archiveOrder",
        element: (
          <PrivateRoute
            element={<ArchiveOrderList />}
            role={"reseller"}
            path="/reseller/archiveOrder"
          />
        ),
      },
      {
        path: "/reseller/addServicer",
        element: (
          <PrivateRoute
            element={<ResellerAddServicer />}
            role={"reseller"}
            path="/reseller/addServicer"
          />
        ),
      },
      {
        path: "/reseller/servicerList",
        element: (
          <PrivateRoute
            element={<ResellerServicerList />}
            role={"reseller"}
            path="/reseller/servicerList"
          />
        ),
      },
      {
        path: "/reseller/servicerDetails",
        element: (
          <PrivateRoute
            element={<ResellerServicerDetails />}
            role={"reseller"}
            path="/reseller/servicerDetails"
          />
        ),
      },
      {
        path: "/reseller/customerDetails/:customerId",
        element: (
          <PrivateRoute
            element={<ResellerCustomerDetails />}
            role={"reseller"}
          />
        ),
      },
      {
        path: "/reseller/priceBook",
        element: (
          <PrivateRoute
            element={<ResellerPriceBook />}
            role={"reseller"}
            path="/reseller/priceBook"
          />
        ),
      },
      {
        path: "/reseller/contract",
        element: (
          <PrivateRoute
            element={<ResellerContractList />}
            role={"reseller"}
            path="/reseller/contract"
          />
        ),
      },
      {
        path: "/reseller/sale",
        element: (
          <PrivateRoute
            element={<ResellerSale />}
            role={"reseller"}
            path="/reseller/sale"
          />
        ),
      },
      {
        path: "/reseller/claim",
        element: <PrivateRoute element={<ClaimList />} role={"reseller"} />,
      },
      {
        path: "/reseller/claimList",
        element: (
          <PrivateRoute element={<ResellerClaimList />} role={"reseller"} />
        ),
      },
      {
        path: "/reseller/addClaim/:username?",
        element: <PrivateRoute element={<AddClaim />} role={"reseller"} />,
      },
      {
        path: "/reseller/addBulkClaim",
        element: <PrivateRoute element={<AddBulkClaim />} role={"reseller"} />,
      },
      {
        path: "/reseller/orderDetails/:orderId",
        element: (
          <PrivateRoute element={<DealerOrderDetails />} role={"reseller"} />
        ),
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
      // Customer Routs ---------------------------------------------------------------
      {
        path: "/customer/notifications",
        index: true,
        element: (
          <PrivateRoute
            element={<Notification />}
            role={"customer"}
            path="/customer/notifications"
          />
        ),
      },
      {
        path: "/customer/dashboard",
        element: (
          <PrivateRoute
            element={<CustomerDashboard />}
            role={"customer"}
            path="/customer/dashboard"
          />
        ),
      },
      {
        path: "/customer/user",
        element: (
          <PrivateRoute
            element={<CustomerUser />}
            role={"customer"}
            path="/customer/user"
          />
        ),
      },
      {
        path: "/customer/addClaim",
        element: <PrivateRoute element={<AddClaim />} role={"customer"} />,
      },
      {
        path: "/customer/claimList",
        element: <PrivateRoute element={<ClaimList />} role={"customer"} />,
      },
      {
        path: "/customer/addBulkClaim",
        element: <PrivateRoute element={<AddBulkClaim />} role={"customer"} />,
      },
      {
        path: "/customer/contractList",
        element: (
          <PrivateRoute
            element={<CustomerContractList />}
            role={"customer"}
            path="/customer/contractList"
          />
        ),
      },
      {
        path: "/customer/orderList",
        element: (
          <PrivateRoute
            element={<CustomerOrderList />}
            role={"customer"}
            path="/customer/orderList"
          />
        ),
      },
      {
        path: "/customer/addOrder",
        element: (
          <PrivateRoute
            element={<CustomerAddOrder />}
            role={"customer"}
            path="/customer/addOrder"
          />
        ),
      },
      {
        path: "/customer/orderDetails/:orderId",
        element: (
          <PrivateRoute element={<CustomerOrderDetails />} role={"customer"} />
        ),
      },
    ],
  },
];

export default routes;
