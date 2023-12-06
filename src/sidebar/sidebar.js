import React, { useState } from "react";
import { Link } from "react-router-dom";

// Project Imports
import Logo from "../assets/images/dashboardLogo.png";
import DashboardImage from "../assets/images/side-bar/Dashbaord.png";
import CustomerImage from "../assets/images/side-bar/Customer.svg";
import DealerImage from "../assets/images/side-bar/Dealer.svg";
import OrderImage from "../assets/images/side-bar/Order.svg";
import ServicerImage from "../assets/images/side-bar/Servicer.svg";
import LogoutImage from "../assets/images/side-bar/logout.png";
import ProductImage from "../assets/images/side-bar/product.png";
import ReportImage from "../assets/images/side-bar/report.svg";
import DropdownArrowImage from "../assets/images/side-bar/downarrow.svg"
function SidebarItem({ item, active, expandedItem, onToggleExpand }) {
  const hasItems = item.items && item.items.length > 0;

  return (
    <li className={`border-t-[#ffffff4f] ps-[19px] w-full rounded-ss-[30px] pt-1 border-t ${hasItems ? 'relative' : ''}`}>
      <Link
        to={item.url}
        className={`flex cursor-pointer rounded-[25px] d-flex  p-3 ${
          (active === item.url || active === item.name) ? "bg-[#FFF] text-[#000]" : "text-white"
        }`}
        onClick={() => hasItems && onToggleExpand(item.name)}
      >
        <img src={item.image} className="w-6 h-6" alt={item.image} />
        <span className="self-center text-left w-full pl-6">
          {item.name}
        </span>
        {hasItems && (
          <img
            src={DropdownArrowImage}
            className={`ml-auto w-4 h-4 transition-transform transform ${expandedItem === item.name ? 'rotate-180 dropdown-expanded' : 'dropdown-collapsed'}`}
            alt="Dropdown Arrow"
          />
        )}
      </Link>

      {hasItems && (
        <ul className={`ml-3 ${expandedItem === item.name ? 'block' : 'hidden'}`}>
          {item.items.map((subItem, subIndex) => (
            <li key={subIndex}>
              <Link
                to={subItem.url}
                className={`rounded-[25px] flex p-1 mb-3 mt-3 ${
                  active === subItem.url ? "bg-[#FFF] text-[#000]" : "text-white"
                }`}
              >
                <span className="self-center text-left w-full pl-12">
                  {subItem.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function SideBar() {
  const [active, setActive] = useState("");
  const [expandedItem, setExpandedItem] = useState(null);

  const handleToggleExpand = (itemName) => {
    setExpandedItem((prevExpandedItem) =>
      prevExpandedItem === itemName ? null : itemName
    );
  };

  const Lists = [
    {
      name: "Home",
      url: "/dashboard",
      image : DashboardImage
    },
    {
      name: "Dealer",
      image: DealerImage,
      items: [
        {
          name: "Dealer List",
          url: "/dealer",
        },
        {
          name: "Add Dealer",
          url: "/dealer",
        },
      ],
    },
    {
      name: "Servicer",
      url: "/dashboard",
      image : ServicerImage
    },
    {
      name: "Customer",
      url: "/dashboard",
      image : CustomerImage
    },
    {
      name: "Order",
      url: "/dashboard",
      image : OrderImage
    },
    {
      name: "Claim",
      url: "/dashboard",
      image : DashboardImage
    },
    {
      name: "Reporting",
      url: "/dashboard",
      image : ReportImage
    },
    {
      name: "Product",
      image: ProductImage,
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
    <div className="fixed w-[260px] h-[96vh]">
      <div className="bg-light-black h-full rounded-3xl relative pl-[38px]">
        <img src={Logo} className="mx-auto py-4 pt-8 w-[180px] " alt="logo" />
        <hr className="opacity-20" />
        <div className="shadow-sm min-h-[93vh] h-full">
          <div className="mx-auto pt-8">
            <ul>
              {Lists.map((bar, index) => (
                <SidebarItem
                  key={index}
                  item={bar}
                  active={active}
                  expandedItem={expandedItem}
                  onToggleExpand={handleToggleExpand}
                />
              ))}
              <li className="cursor-pointer absolute bottom-4 border-t-[#ffffff4f] ps-[19px] rounded-ss-[36px] pt-1 border-t w-full">
                <div className=" p-3 flex">
                  <img src={LogoutImage} className="w-6 h-6" alt={LogoutImage} />
                  <span className="self-center text-left w-full pl-6 text-white ml-1">
                    Logout
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
