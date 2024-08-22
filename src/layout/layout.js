import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation, useParams } from "react-router";
import SideBar from "../sidebar/sidebar";

function Layout() {
  const [isSidebarSticky, setIsSidebarSticky] = useState(false);

  const scrollThreshold = 200;

  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;

    setIsSidebarSticky(scrollY > scrollThreshold);
  };

  const Location = useLocation();
  const { id, customerId, servicerId, resellerId, orderId } = useParams();
  const checkUrl = Location.pathname + "/" + id;

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`w-full flex bg-grayf9 bg-cover h-full ${
        Location.pathname !== "/dealerDetails/" + id &&
        Location.pathname !== "/customerDetails/" + customerId &&
        Location.pathname !== "/servicerDetails/" + servicerId &&
        Location.pathname !== "/orderDetails/" + orderId &&
        Location.pathname !== "/resellerDetails/" + resellerId &&
        Location.pathname !== "/dealer/customerDetails/" + customerId &&
        Location.pathname !== "/reseller/customerDetails/" + customerId &&
        Location.pathname !== "/dealer/resellerDetails/" + resellerId &&
        // Location.pathname !== "/notifications" &&  
        Location.pathname !== "/reseller/orderDetails/" + orderId &&
        Location.pathname !== "/customer/orderDetails/" + orderId &&
        Location.pathname !== "/dealer/orderDetails/" + orderId
          ? "p-4 "
          : "p-0 max-h-[100vh] overflow-hidden"
      } pl-0 relative w-full`}
    >
      {Location.pathname !== "/dealerDetails/" + id &&
      Location.pathname !== "/customerDetails/" + customerId &&
      Location.pathname !== "/servicerDetails/" + servicerId &&
      Location.pathname !== "/orderDetails/" + orderId &&
      Location.pathname !== "/resellerDetails/" + resellerId &&
      Location.pathname !== "/dealer/customerDetails/" + customerId &&
      Location.pathname !== "/reseller/customerDetails/" + customerId &&
      Location.pathname !== "/dealer/resellerDetails/" + resellerId &&
      // Location.pathname !== "/notifications" &&
      Location.pathname !== "/reseller/orderDetails/" + orderId &&
      Location.pathname !== "/customer/orderDetails/" + orderId &&
      Location.pathname !== "/dealer/orderDetails/" + orderId ? (
        <div
          className={`xl:w-[260px] 2xl:w-[320px] w-[260px] relative h-full s:hidden md:block xl:block `}
        >
          <SideBar />
        </div>
      ) : (
        <></>
      )}
      <div
        className={`${
          Location.pathname !== "/dealerDetails/" + id &&
          Location.pathname !== "/customerDetails/" + customerId &&
          Location.pathname !== "/servicerDetails/" + servicerId &&
          Location.pathname !== "/dealer/customerDetails/" + customerId &&
          Location.pathname !== "/dealer/resellerDetails/" + resellerId &&
          Location.pathname !== "/orderDetails/" + orderId &&
          Location.pathname !== "/reseller/customerDetails/" + customerId &&
          Location.pathname !== "/resellerDetails/" + resellerId &&
          // Location.pathname !== "/notifications" &&
          Location.pathname !== "/reseller/orderDetails/"+ orderId &&
          Location.pathname !== "/customer/orderDetails/" + orderId &&
          Location.pathname !== "/dealer/orderDetails/" + orderId
            ? "w-[calc(100%-10px)] pl-3"
            : "w-[100%]"
        } h-full min-h-[94vh]`}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
