import React, { useState } from "react";
import { Link } from "react-router-dom";

// Project Imports
import Logo from "../assets/images/dashboardLogo.png";
import DashboardImage from "../assets/images/side-bar/Dashboard.svg";
import CustomerImage from "../assets/images/side-bar/Customer.svg";
import DealerImage from "../assets/images/side-bar/Dealer.svg";
import OrderImage from "../assets/images/side-bar/Order.svg";
import ServicerImage from "../assets/images/side-bar/Servicer.svg";
import ClaimImage from "../assets/images/side-bar/claim.svg";
import PriceImage from "../assets/images/side-bar/Price.svg";
import LogoutImage from "../assets/images/side-bar/logout-black.svg";
import ProductImage from "../assets/images/side-bar/product.svg";
import ReportImage from "../assets/images/side-bar/report.svg";
import DropdownArrowImage from "../assets/images/side-bar/downarrow.svg"
import Dropdown1 from "../assets/images/side-bar/dropdownsecond.svg"
import Dropdown2 from "../assets/images/side-bar/dropdown-2.svg"


function SidebarItem({ item, active, expandedItem, onToggleExpand }) {
  const hasItems = item.items && item.items.length > 0;

  return (
    <li className={`border-t-[#474747] w-full rounded-ss-[30px] p-0 border-t-[0.5px] ${hasItems ? 'relative bg-[#2B2B2B] rounded-s-[30px]' : ''}`}>
      <Link
        to={item.url}
        className={`flex cursor-pointer d-flex ps-[20px] relative z-[2] mb-[3px] py-[19px] pe-3 ${
          (active === item.url || active === item.name) ? "bg-[#FFF] text-[#000]" : "text-[#999999]"
        }`}
        onClick={() => hasItems && onToggleExpand(item.name)}
      >
        <img src={item.image} className="w-[22px] h-[22px]" alt={item.image} />
        <span className="self-center text-left w-full text-[14px] font-Regular pl-[12px]">
          {item.name}
        </span>
        {hasItems && (
          <img
            src={DropdownArrowImage}
            className={`ml-auto w-3 h-3 mt-2 transition-transform transform ${expandedItem === item.name ? 'rotate-180 dropdown-expanded' : 'dropdown-collapsed'}`}
            alt="Dropdown Arrow"
          />
        )}
      </Link>

      {hasItems && (
        <ul className={`${expandedItem === item.name ? 'block' : 'hidden'}`}>
          {item.items.map((subItem, subIndex) => (
            <li key={subIndex} className={`ps-[19px]`}>
              <Link
                to={subItem.url}
                className={`rounded-[25px] flex ${
                  active === subItem.url ? "bg-[#FFF] text-[#000]" : "text-[#999999]"
                }`}
              >
                <img src={subItem.image} className={`bg-cover ${(subIndex == 0) ? 
                "mt-[-19%]" : "mt-[-35%]" } w-[24px] `} alt={subItem.image} />
                <span className={`self-center text-left text-[12px] font-medium w-full opacity-50 pl-0 ml-[19px] p-[19px] pr-0 ${(subIndex == item.items.length - 1)
              ? ""
              : "border-b-2 border-[#474747]"}`}>
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
  const [active, setActive] = useState(true);
  const [expandedItem, setExpandedItem] = useState(null);

  const handleToggleExpand = (itemName) => {
    setExpandedItem((prevExpandedItem) =>
      prevExpandedItem === itemName ? null : itemName
    );
  };

  const Lists = [
    {
      name: "Dashboard",
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
          image : Dropdown1,
        },
        {
          name: "Add Dealer",
          url: "/dealer",
          image : Dropdown2,
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
      image : ClaimImage,
      items: [
        {
          name: "Claim Listing",
          url: "/extensions",
          image : Dropdown1,
        },
        {
          name: "Add Bulk Claim",
          url: "/Queues",
          image : Dropdown2,
        }
      ],
    },
    {
      name: "Price Book",
      image: PriceImage,
      items: [
        {
          name: "Dealer Book",
          url: "/Add-Dealer-Book",
          image : Dropdown1,
        },
        {
          name: "Company Price Book",
          url: "/Queues",
          image : Dropdown2,
        },
        {
          name: "Upload Dealer Price Book",
          url: "/Queues",
          image : Dropdown2,
        },
        {
          name: "Category",
          url: "/category",
          image : Dropdown2,
        },
      ],
    },
    {
      name: "Reporting",
      url: "/dashboard",
      image : ReportImage
    },
    {
      name: "Product",
      url: "/Product",
      image : ProductImage
    },
  ];

  return (
    <div className="w-[260px] min-h-[96vh] xl:h-full mb-8">
      <div className="bg-light-black min-h-[95vh] rounded-3xl relative pl-[30px]">
        <img src={Logo} className="mx-auto py-12 w-[160px] " alt="logo" />
        <hr className=" border-[#474747] border-[1px]" />
        <div className="shadow-sm h-full ">
          <div className="mx-auto h-full mt-12">
            <ul className="pb-5">
              {Lists.map((bar, index) => (
                <SidebarItem
                  key={index}
                  item={bar}
                  active={active}
                  expandedItem={expandedItem}
                  onToggleExpand={handleToggleExpand}
                />
              ))}
              <li className="cursor-pointer border-t-[#474747] mb-4 ps-[19px] rounded-s-[36px] border-t w-full bg-[#FFF] text-[#000]">
                <div className="py-[22px] pe-3 ps-[19px] flex">
                  <img src={LogoutImage} className="w-6 h-6 text-black" alt={LogoutImage} />
                  <span className="self-center font-semibold text-left w-full pl-6 text-[#1A1E24] ml-1">
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
