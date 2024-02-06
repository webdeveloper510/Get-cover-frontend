import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation, useParams } from "react-router";
import SideBar from "../sidebar/sidebar";

function Layout() {
  const [isSidebarSticky, setIsSidebarSticky] = useState(false);

  // You can adjust the threshold value based on your design
  const scrollThreshold = 200;

  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;

    // Check if the user has scrolled past the threshold
    setIsSidebarSticky(scrollY > scrollThreshold);
  };

  const Location = useLocation();
  const { id, customerId, servicerId, resellerId, orderId } = useParams();
  const checkUrl = Location.pathname + "/" + id;

  console.log(checkUrl, "yes, Got here----------------");

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`w-full flex bg-[#F9F9F9] bg-cover h-full ${
        Location.pathname !== "/dealerDetails/" + id &&
        Location.pathname !== "/customerDetails/" + customerId &&
        Location.pathname !== "/servicerDetails/" + servicerId &&
        Location.pathname !== "/orderDetails/" + orderId &&
        Location.pathname !== "/resellerDetails/" + resellerId &&
        Location.pathname !== "/notifications"
          ? "p-4"
          : "p-0"
      } pl-0 relative w-full`}
    >
      {Location.pathname !== "/dealerDetails/" + id &&
      Location.pathname !== "/customerDetails/" + customerId &&
      Location.pathname !== "/servicerDetails/" + servicerId &&
      Location.pathname !== "/orderDetails/" + orderId &&
      Location.pathname !== "/resellerDetails/" + resellerId &&
      Location.pathname !== "/notifications" ? (
        <div
          className={`xl:w-[260px] 2xl:w-[320px] w-[260px] relative h-full `}
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
          Location.pathname !== "/orderDetails/" + orderId &&
          Location.pathname !== "/resellerDetails/" + resellerId &&
          Location.pathname !== "/notifications"
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
