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
    <div className="w-full flex bg-[#F6F5F1] p-3">
      <div className="w-[320px] relative">
        <SideBar/>
      </div>
      <div className="w-[calc(100%-10px)] h-full position-relative pl-3">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
