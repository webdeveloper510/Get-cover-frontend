import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useParams } from "react-router";
import SideBar from "../sidebar/sidebar";
import { getSetting, getUserDetailsFromLocalStorage } from "../services/extraServices";
import { RotateLoader } from "react-spinners";

function Layout() {
  const [isSidebarSticky, setIsSidebarSticky] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('');
  const [textColor, setTextColor] = useState('');

  const scrollThreshold = 200;

  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    setIsSidebarSticky(scrollY > scrollThreshold);
  };

  const location = useLocation();
  const { id, customerId, servicerId, resellerId, orderId } = useParams();

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const storedUserDetails = getUserDetailsFromLocalStorage();
    setUserDetails(storedUserDetails);
    setBackgroundColor(storedUserDetails.colorScheme.colorType ==="backGroundColor" ? storedUserDetails.colorScheme.colorCode : null)
    setTextColor(storedUserDetails.colorScheme.colorType ==="textColor" ? storedUserDetails.colorScheme.colorCode : null)
  }, []);

  const shouldShowSidebar = () => {
    const excludedPaths = [
      `/dealerDetails/${id}`,
      `/customerDetails/${customerId}`,
      `/servicerDetails/${servicerId}`,
      `/orderDetails/${orderId}`,
      `/resellerDetails/${resellerId}`,
      `/dealer/customerDetails/${customerId}`,
      `/reseller/customerDetails/${customerId}`,
      `/dealer/resellerDetails/${resellerId}`,
      `/reseller/orderDetails/${orderId}`,
      `/customer/orderDetails/${orderId}`,
      `/dealer/orderDetails/${orderId}`,
    ];

    return !excludedPaths.includes(location.pathname);
  };

  return (
    <>
      {loading ? (
        <div className="h-[500px] w-full flex py-5">
          <div className="self-center mx-auto">
            <RotateLoader color="#333" />
          </div>
        </div>
      ) : (
        <div
          style={{ backgroundColor, color: textColor }}
          className={`w-full flex bg-cover h-full ${
            shouldShowSidebar() ? "p-4" : "p-0 max-h-[100vh] overflow-hidden"
          } pl-0 relative w-full`}
        >
          {shouldShowSidebar() && (
            <div className="xl:w-[260px] 2xl:w-[320px] w-[260px] relative h-full s:hidden md:hidden xl:block">
              <SideBar />
            </div>
          )}
          <div
            className={`${
              shouldShowSidebar() ? "w-[calc(100%-10px)] pl-3" : "w-[100%]"
            } h-full min-h-[94vh]`}
          >
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
}

export default Layout;
