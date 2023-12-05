import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import SideBar from "../sidebar/sidebar";

function Layout() {
  // const navigate = useNavigate();
  // useEffect(() => {
  //   if (!localStorage.getItem("token")) {
  //     navigate("/login");
  //   }
  // }, []);

  return (
    <div className="w-full flex">
      <div className="w-3/12 h-full	bg-gradient-to-r from-[#c850c0] to-[#4158d0] sidebar">
        <SideBar/>
      </div>
      <div className="w-9/12 h-full position-relative">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
