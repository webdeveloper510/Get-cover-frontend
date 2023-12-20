import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Project Imports
import Logo from "../assets/images/dashboardLogo.png";
import DashboardImage from "../assets/images/side-bar/Dashboard.svg";
import CustomerImage from "../assets/images/side-bar/Customer.svg";
import DealerImage from "../assets/images/side-bar/Dealer.svg";
import OrderImage from "../assets/images/side-bar/Order.svg";
import ServicerImage from "../assets/images/side-bar/Servicer.svg";
import ClaimImage from "../assets/images/side-bar/claim.svg";
import PriceImage from "../assets/images/side-bar/Price.svg";
import LogoutImage from "../assets/images/side-bar/Logout.svg";
import ProductImage from "../assets/images/side-bar/product.svg";
import ReportImage from "../assets/images/side-bar/report.svg";
import Actives from "../assets/images/side-bar/activess.svg";
import Down from "../assets/images/icons/Drop.svg";
import DropdownArrowImage from "../assets/images/side-bar/downarrow.svg";
import Dropdown1 from "../assets/images/side-bar/dropdownsecond.svg";
import Dropdown2 from "../assets/images/side-bar/dropdown-2.svg";
import ActiveDropdown from "../assets/images/side-bar/firstActive.svg";

// Active Images icons

import ActiveProduct from "../assets/images/side-bar/activeProduct.svg";
import ActiveDashboard from "../assets/images/side-bar/activeDashboard.svg";
import ActiveReport from "../assets/images/side-bar/activeReporting.svg";
import ActivePriceBook from "../assets/images/side-bar/activePrize.svg";
import ActiveCustomer from "../assets/images/side-bar/activeCustomer.svg";
import ActiveOrder from "../assets/images/side-bar/activeOrder.svg";
import ActiveClaim from "../assets/images/side-bar/activeClaim.svg";
import ActiveDealer from "../assets/images/side-bar/activeDealer.svg";
import ActiveServicer from "../assets/images/side-bar/activeServicer.svg";
import ForthActive from "../assets/images/side-bar/fourthDropdown.svg";
import SeacondActive from "../assets/images/side-bar/220Active.svg";
import lastActive from "../assets/images/side-bar/250active.svg";
import { useLocation } from "react-router-dom";

function SidebarItem({
  item,
  active,
  expandedItem,
  onToggleExpand,
  onLinkClick,
  setExpandedItem,
}) {
  const hasItems = item.items && item.items.length > 0;
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (item.name === "Price Book") {
      setIsActive(active === "Price Book" || expandedItem === "Price Book");
      if (active === "Dealer" || expandedItem === "Dealer") {
        setExpandedItem("Dealer");
      }
    } else if (item.name === "Claim") {
      setIsActive(active === "Claim" || expandedItem === "Claim");
      if (active === "Dealer" || expandedItem === "Dealer") {
        setExpandedItem("Dealer");
      }
    } else if (item.name === "Dealer") {
      setIsActive(active === "Dealer" || expandedItem === "Dealer");
    } else if (item.name === "Servicer") {
      setIsActive(active === "Servicer" || expandedItem === "Servicer");
    } else if (item.name === "Customer") {
      setIsActive(active === "Customer" || expandedItem === "Customer");
    } else {
      setIsActive(
        active === item.url ||
          active === item.name ||
          expandedItem === item.name
      );
    }
  }, [active, expandedItem, item, setExpandedItem]);
  // console.log('=================>>>>>>>>>>>',active)

  return (
    <li
      className={`border-t-[#474747] w-full rounded-ss-[30px] p-0 border-t-[0.5px] ${
        hasItems && isActive ? "relative bg-[#2B2B2B] rounded-s-[30px]" : ""
      } ${isActive ? "active" : ""}`}
    >
      <Link
        to={item.url}
        className={`flex cursor-pointer d-flex ps-[20px] relative z-[2] mb-[3px] py-[19px] pe-3 ${
          isActive ? "bg-[#FFF] text-[#000] rounded-s-[30px]" : "text-[#999999]"
        }`}
        onClick={() => {
          onLinkClick(item.url); // Use onLinkClick here
          if (hasItems) {
            onToggleExpand(item.name);
          } else {
            console.log(`Link to ${item.url} clicked`);
          }
        }}
      >
        {isActive ? (
          <img
            src={item.active}
            className="w-[22px]  h-[22px]"
            alt={item.image}
          />
        ) : (
          <img
            src={item.image}
            className="w-[22px] h-[22px]"
            alt={item.image}
          />
        )}
        <span
          className={`self-center text-left w-full pl-[12px] ${
            isActive
              ? " text-[14px] font-semibold"
              : " text-[14px] font-Regular"
          }`}
        >
          {item.name}
        </span>
        {hasItems && (
          <>
            {isActive ? (
              <>
                <img
                  src={Down}
                  className={`ml-auto w-3 h-3 mt-2 transition-transform transform ${
                    expandedItem === item.name
                      ? "rotate-180 dropdown-expanded"
                      : "dropdown-collapsed"
                  }`}
                  alt="Dropdown Arrow"
                />
              </>
            ) : (
              <>
                <img
                  src={DropdownArrowImage}
                  className={`ml-auto w-3 h-3 mt-2 transition-transform transform ${
                    expandedItem === item.name
                      ? "rotate-180 dropdown-expanded"
                      : "dropdown-collapsed"
                  }`}
                  alt="Dropdown Arrow"
                />
              </>
            )}
          </>
        )}
      </Link>

      {hasItems && (
        <ul
          className={`${
            isActive || expandedItem === item.name ? "block" : "hidden"
          }`}
        >
          {item.items.map((subItem, subIndex) => (
            <li key={subIndex} className={`ps-[19px]`}>
              <Link
                to={subItem.url}
                className={`rounded-[25px] flex ${
                  active === subItem.url
                    ? "text-white font-medium"
                    : "text-[#999999]"
                }`}
                onClick={() => {
                  onLinkClick(subItem.url, item.name);
                  console.log(`Sub-Item link to ${subItem.url} clicked`);
                }}
              >
                {active === subItem.url ? (
                  <>
                    <img
                      src={subItem.active}
                      className={` ${
                        subIndex == 0
                          ? "3xl:mt-[-32%] xl:mt-[-40%] mt-[-40%]"
                          : subIndex == 1
                          ? "3xl:mt-[-50%%] xl:mt-[-43%] xl:h-[110px]"
                          : subIndex == 2
                          ? "mt-[-95%]"
                          : "mt-[-115%]"
                      } w-[24px]`}
                      alt={subItem.active}
                    />
                  </>
                ) : (
                  <>
                    {" "}
                    <img
                      src={subItem.image}
                      className={` ${
                        subIndex == 0 ? "mt-[-19%]" : "mt-[-42%]"
                      } w-[24px] `}
                      alt={subItem.image}
                    />
                  </>
                )}

                <span
                  className={`self-center text-left text-[12px] font-medium w-full ${
                    active === subItem.url ? "opacity-1" : "opacity-50"
                  } pl-0 ml-[10px] p-[19px] pr-0 ${
                    subIndex == item.items.length - 1
                      ? ""
                      : "border-b-2 border-[#474747]"
                  }`}
                >
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
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const [expandedItem, setExpandedItem] = useState(null);
  const navigate = useNavigate();

  const handleLinkClick = (url, dropdownItem) => {
    setActive(url === "#" ? dropdownItem : url);
  };

  const handleToggleExpand = (itemName) => {
    setExpandedItem((prevExpandedItem) =>
      prevExpandedItem === itemName ? null : itemName
    );
    console.log("Expanded Item:", itemName);
  };

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/");
  };

  const Lists = [
    {
      name: "Dashboard",
      url: "/dashboard",
      image: DashboardImage,
      active: ActiveDashboard,
    },
    {
      name: "Dealer",
      image: DealerImage,
      active: ActiveDealer,
      items: [
        {
          name: "Dealer List",
          url: "/dealerList",
          image: Dropdown1,
          active: Actives,
        },
        {
          name: "Add Dealer",
          url: "/dealer/null",
          image: Dropdown2,
          active: SeacondActive,
        },
        {
          name: "New Dealer Requests",
          url: "/newDealerList",
          image: Dropdown2,
          active: ForthActive,
        },
      ],
    },
    {
      name: "Servicer",
      image: ServicerImage,
      active: ActiveServicer,
      items: [
        {
          name: "Servicer List",
          url: "/servicerList",
          image: Dropdown1,
          active: Actives,
        },
        {
          name: "Add Servicer",
          url: "/addServicer",
          image: Dropdown2,
          active: SeacondActive,
        },
        {
          name: "New Servicer Requests",
          url: "/requestList",
          image: Dropdown2,
          active: ForthActive,
        },
      ],
    },
    {
      name: "Customer",
      image: CustomerImage,
      active: ActiveCustomer,
      items: [
        {
          name: "Customer List",
          url: "/customerList",
          image: Dropdown1,
          active: Actives,
        },
        {
          name: "Add Customer",
          url: "/addCustomer",
          image: Dropdown2,
          active: SeacondActive,
        },
      ],
    },
    {
      name: "Order",
      url: "#",
      active: ActiveOrder,
      image: OrderImage,
    },
    {
      name: "Contract",
      url: "#",
      active: ActiveProduct,
      image: ProductImage,
    },
    {
      name: "Claim",
      image: ClaimImage,
      active: ActiveClaim,
      items: [
        {
          name: "Claim Listing",
          url: "#",
          image: Dropdown1,
          active: Actives,
        },
        {
          name: "Add Bulk Claim",
          url: "#",
          image: Dropdown2,
          active: SeacondActive,
        },
      ],
    },
    {
      name: "Price Book",
      image: PriceImage,
      active: ActivePriceBook,
      items: [
        {
          name: "Dealer Book",
          url: "/dealerPriceList",
          image: Dropdown1,
          active: Actives,
        },
        {
          name: "Company Price Book",
          url: "/companyPriceBook",
          image: Dropdown2,
          active: SeacondActive,
        },
        {
          name: "Upload Dealer Price Book",
          url: "/uploadDealerBook",
          image: Dropdown2,
          active: ForthActive,
        },
        {
          name: "Category",
          url: "/category",
          image: Dropdown2,
          active: lastActive,
        },
      ],
    },
    {
      name: "Reporting",
      url: "#",
      image: ReportImage,
      active: ActiveReport,
    },
  ];

  return (
    <div className="xl:w-[210px] 2xl:w-[260px] min-h-[96vh] xl:h-full mb-8 fixed overflow-y-auto">
      <div className="bg-light-black min-h-[95vh] rounded-3xl relative pl-[5px]">
        <img src={Logo} className="mx-auto py-6 w-[160px] " alt="logo" />
        <hr className=" border-[#474747] border-[1px]" />
        <div className="shadow-sm h-full ">
          <div className="mx-auto h-full mt-6">
            <ul className="pb-5">
              {Lists.map((bar, index) => (
                <SidebarItem
                  key={index}
                  item={bar}
                  active={active}
                  expandedItem={expandedItem}
                  onToggleExpand={handleToggleExpand}
                  onLinkClick={handleLinkClick}
                  setExpandedItem={setExpandedItem} // Add this line
                />
              ))}
              <li
                className="cursor-pointer border-t-[#474747] mb-4 ps-[10px] rounded-s-[36px] border-t w-full text-[#fff]"
                onClick={handleLogOut}
              >
                <div className="py-[22px] pe-3 ps-[10px] flex">
                  <img
                    src={LogoutImage}
                    className="w-[22px] h-[22px] text-black"
                    alt={LogoutImage}
                  />
                  <span className="self-center  text-[14px] font-light text-left w-full pl-[12px] text-[#999999] ml-1">
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
