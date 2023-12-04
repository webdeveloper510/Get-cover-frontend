import React, { useState } from "react";
import { Link } from "react-router-dom";

// Project Imports 
import Logo from "../assets/images/logo.png";


function SideBar() {
  const [active, setActive] = useState("");

  const Lists = [
    {
      name: "Home",
      url: "/dashboard",
    },
    {
      name: "Administration",
      items: [
        {
          name: "Extensions",
          url: "/extensions",
        },
        {
          name: "Queues",
          url: "/Queues",
        },
        {
          name: "Routes",
          url: "/Routes",
        },
      ],
    },
  ];

  return (
    <div className="h-full">
      <div className="bg-gradient-to-r from-[#c850c0] to-[#4158d0] min-h-[100vh] h-full sidebars">
        <img src={Logo} className="mx-auto py-4" alt="logo" />
        <div className="shadow-sm min-h-[93vh] h-full">
          <div className="w-[280px] mx-auto pt-8">
            <ul>
              {Lists.map((bar, index) => (
                <li key={index}>
                  <Link
                    to={bar.url}
                    className={`flex cursor-pointer rounded-[25px] p-1 mb-3 ${
                      active === bar.url || active === bar.name
                        ? "bg-[#FFF] text-[#000]"
                        : " text-white"
                    }`}
                   
                  >
                    <span className="self-center text-left w-full pl-12">
                      {bar.name}
                    </span>
                  </Link>
                </li>
              ))}
              <li className="cursor-pointer">
                <span className="self-center text-left w-full pl-12 text-white ml-1">
                  Logout
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
