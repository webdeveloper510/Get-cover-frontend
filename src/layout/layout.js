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



  // useEffect(() => {
  //   fetchUserDetails();
  // }, []);

  const fetchUserDetails = async () => {
    try {
      console.log("Fetching user details...");
      const userDetails = await getSetting();
      console.log("User details fetched:---****-->", userDetails.result[0]);
      const fetchedData = userDetails.result[0];
      let local = JSON.parse(localStorage.getItem("siteSettings"));
      // localStorage.removeItem('userDetails')
      local.siteSettings = fetchedData
      localStorage.setItem("siteSettings", JSON.stringify(local));


      const colorScheme = fetchedData.colorScheme;
      colorScheme.forEach(color => {
        switch (color.colorType) {
          case 'backGroundColor':
            setBackgroundColor(color.colorCode);
            break;
            case 'titleColor':
              setTextColor(color.colorCode);
              break;
            default:
              break;
        }
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

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
