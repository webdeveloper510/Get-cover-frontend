import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
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

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  // const navigate = useNavigate();
  // useEffect(() => {
  //   if (!localStorage.getItem("token")) {
  //     navigate("/login");
  //   }
  // }, []);

  return (
    <div className={`w-full flex bg-[#F9F9F9] bg-cover  h-full p-7`}>
      <div className={`xl:w-[260px] 2xl:w-[320px] w-[260px] relative h-full max-h-screen`}>
        <SideBar/>
      </div>
      <div className="w-[calc(100%-10px)] h-full relative pl-3">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
