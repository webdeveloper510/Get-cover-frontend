import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Project Imports
import Logo from "../assets/images/Get-Cover-REV-svg.png";
import DashboardImage from "../assets/images/side-bar/Dashboard.svg";
import CustomerImage from "../assets/images/side-bar/Customer.svg";
import resellerImage from "../assets/images/side-bar/Dealer.svg";
import DealerImage from "../assets/images/Dealer.svg";
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
import manageAccount from "../assets/images/side-bar/activeAccount.svg";
import ActiveAccount from "../assets/images/side-bar/manageAccount.svg";

// Active Images icons

import ActiveProduct from "../assets/images/side-bar/activeProduct.svg";
import ActiveDashboard from "../assets/images/side-bar/activeDashboard.svg";
import ActiveReport from "../assets/images/side-bar/activeReporting.svg";
import ActivePriceBook from "../assets/images/side-bar/activePrize.svg";
import ActiveCustomer from "../assets/images/side-bar/activeCustomer.svg";
import ActiveOrder from "../assets/images/side-bar/activeOrder.svg";
import ActiveClaim from "../assets/images/side-bar/activeClaim.svg";
import ActiveReseller from "../assets/images/side-bar/activeDealer.svg";
import ActiveDealer from "../assets/images/ActiveDealer.svg";
import ActiveServicer from "../assets/images/side-bar/activeServicer.svg";
import ForthActive from "../assets/images/side-bar/fourthDropdown.svg";
import SeacondActive from "../assets/images/side-bar/220Active.svg";
import lastActive from "../assets/images/side-bar/250active.svg";
import { useLocation } from "react-router-dom";
import { checkWordsExist } from "../utils/helper";
import { getSetting, getUserDetailsFromLocalStorage } from "../services/extraServices";

function SidebarItem({
  item,
  active,
  expandedItem,
  onToggleExpand,
  onLinkClick,
  setExpandedItem,
  isActiveValue,
  sidebarItems,
}) {

  const [sideBarButtonColor, setSideBarButtonColor] = useState('');
  const [sideBarButtonTextColor, setSideBarButtonTextColor] = useState('');
  const [sideBarTextColor, setSideBarTextColor] = useState('');
  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    const fetchedData = JSON.parse(localStorage.getItem("siteSettings"))
    const colorScheme = fetchedData.colorScheme;
    colorScheme.forEach(color => {
      switch (color.colorType) {
        case 'sideBarTextColor':
          setSideBarTextColor(color.colorCode);
          break;
        case 'sideBarButtonColor':
          setSideBarButtonColor(color.colorCode);
          break;
        case 'sideBarButtonTextColor':
          setSideBarButtonTextColor(color.colorCode);
          break;
        default:
          break;
      }
    });
  }
  const location = useLocation();

  const hasItems = item.items && item.items.length > 0;

  const [isActive, setIsActive] = useState(isActiveValue);

  const locationGet = useLocation();
  useEffect(() => {
    if (isActiveValue === false) {
      const CheckItemsActive = item?.items;

      if (CheckItemsActive) {
        const childActive = CheckItemsActive.some(
          (element) => active === element.url
        );

        if (childActive) {
          setExpandedItem(item.name);
        }
      }
      setIsActive(active === item.url || expandedItem === item.name);
    } else {
      const CheckItemsActive = item?.items;
      if (CheckItemsActive) {
        const childActive = CheckItemsActive.some(
          (element) => active === element.url
        );

        if (childActive) {
          setExpandedItem(item.name);
        }
      }
      setIsActive(active === item.url || expandedItem === item.name);
    }
  }, [active, expandedItem, item, setExpandedItem, isActiveValue]);

  const [activeUrl, setActiveUrl] = useState(false);

  useEffect(() => {
    let urls = [item.url];
    if (hasItems) {
      const urlsItem = item?.items?.map((i) => i.url) || [];
      urls = [...urls, ...urlsItem];
    }

    const itHasUrl = checkWordsExist(locationGet.pathname, urls);
    if (itHasUrl) console.log("item=======>", item);
    setActiveUrl(itHasUrl);
  }, [window.location.pathname]);

  const handleClick = () => {
    if (hasItems) {
      if (expandedItem === item.name) {
        setExpandedItem(null);
      } else {
        onToggleExpand(item.name);
      }
    } else {
      setExpandedItem(null);
    }

    onLinkClick(item.url);
  };


  return (
    <li
      className={`border-t-Gray28 w-full rounded-ss-[30px] p-0 border-t-[0.5px]  ${activeUrl ? `relative bg-[${sideBarButtonColor}] rounded-s-[30px]` : ""
        } ${expandedItem == item.name ? "active" : ""}`}
    >
      <Link
        to={hasItems ? window.location.href : item.url}
        style={{ backgroundColor: activeUrl ? sideBarButtonColor : null, color: activeUrl ? sideBarButtonTextColor : sideBarTextColor }}
        className={`flex cursor-pointer d-flex ps-[20px] relative z-[2] mb-[3px] py-[19px] pe-3 ${activeUrl
          ? `!bg-[${sideBarButtonColor}] !text-[${sideBarButtonTextColor}]  rounded-s-[30px]`
          : `text-[${sideBarTextColor}]`
          }`}
        onClick={handleClick}
      >
        {activeUrl ? (
          <div
            className="w-[22px] h-[22px]"
            style={{
              maskImage: `url(${item.active})`,
              WebkitMaskImage: `url(${item.active})`,
              backgroundColor: sideBarButtonTextColor,
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
              maskSize: 'contain',
              WebkitMaskSize: 'contain'
            }}
          />
        ) : (
          <div
            className="w-[22px] h-[22px]"
            style={{
              maskImage: `url(${item.image})`,
              WebkitMaskImage: `url(${item.image})`,
              backgroundColor: sideBarTextColor,
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
              maskSize: 'contain',
              WebkitMaskSize: 'contain'
            }}
          />
        )}

        <span
          className={`self-center text-left w-full pl-[12px] ${activeUrl
            ? " text-[14px] font-semibold"
            : " text-[14px] font-Regular"
            }`}
        >
          {item.name}
        </span>
        {hasItems && (
          <>
            {activeUrl ? (
              <>
                <div
                  className={`w-4 h-4 ${expandedItem === item.name
                    ? "rotate-180 dropdown-expanded"
                    : "dropdown-collapsed"
                    }`}
                  style={{
                    maskImage: `url(${Down})`,
                    WebkitMaskImage: `url(${Down})`,
                    backgroundColor: sideBarButtonTextColor,
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center',
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain'
                  }}
                />
              </>
            ) : (
              <>
                <div
                  className={`w-4 h-4 ${expandedItem === item.name
                    ? "rotate-180 dropdown-expanded"
                    : "dropdown-collapsed"
                    }`}
                  style={{
                    maskImage: `url(${DropdownArrowImage})`,
                    WebkitMaskImage: `url(${DropdownArrowImage})`,
                    backgroundColor: sideBarTextColor,
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center',
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain'
                  }}
                />
              </>
            )}
          </>
        )}
      </Link>

      {hasItems && (
        <ul
          className={`${activeUrl || expandedItem === item.name ? "block" : "hidden"
            }`}
        >
          {item.items.map((subItem, subIndex) => (
            <li key={subIndex} className={`ps-[19px]`}>
              <Link
                to={subItem.url}
                className={`rounded-[25px] flex ${location.pathname.includes(subItem.url)
                  ? "text-white font-medium"
                  : "text-light-grey"
                  }`}
                onClick={() => {
                  onLinkClick(subItem.url, item.name);
                  console.log(`Sub-Item link to ${subItem.url} clicked`);
                }}
              >
                {location.pathname.includes(subItem.url) ? (
                  <>
                    <div
                      className={` ${subIndex == 0
                        ? "3xl:mt-[-32%] xl:mt-[-31%] mt-[-31%]"
                        : subIndex == 1
                          ? "3xl:mt-[-50%%] xl:mt-[-43%] xl:h-[110px]"
                          : subIndex == 2
                            ? "mt-[-81%]"
                            : "mt-[-99%]"
                        } w-[24px]`}
                      style={{
                        maskImage: `url(${subItem.active})`,
                        WebkitMaskImage: `url(${subItem.active})`,
                        backgroundColor: sideBarTextColor,
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskPosition: 'center',
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain'
                      }}
                    />
                    {/* <img
                      src={subItem.active}
                      className={` ${subIndex == 0
                        ? "3xl:mt-[-32%] xl:mt-[-40%] mt-[-40%]"
                        : subIndex == 1
                          ? "3xl:mt-[-50%%] xl:mt-[-43%] xl:h-[110px]"
                          : subIndex == 2
                            ? "mt-[-95%]"
                            : "mt-[-115%]"
                        } w-[24px]`}
                      style={{ filter: `opacity(0.5) drop-shadow(0 0 0 ${sideBarButtonTextColor})` }}
                      alt={subItem.active}
                    /> */}
                  </>
                ) : (
                  <>
                    <div
                      className={` ${subIndex == 0 ? "mt-[-19%]" : "mt-[-33%]"
                        } w-[24px] `}
                      style={{
                        maskImage: `url(${subItem.image})`,
                        WebkitMaskImage: `url(${subItem.image})`,
                        backgroundColor: sideBarTextColor,
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskPosition: 'center',
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain'
                      }}
                    />
                    {/* <img
                      src={subItem.image}
                      className={` ${subIndex == 0 ? "mt-[-19%]" : "mt-[-42%]"
                        } w-[24px] `}
                      alt={subItem.image}
                    /> */}
                  </>
                )}

                <span
                  style={{ color: location.pathname.includes(subItem.url) ? sideBarTextColor : sideBarTextColor }}
                  className={`self-center text-left text-[12px] font-medium w-full ${location.pathname.includes(subItem.url)
                    ? "opacity-1 !font-bold"
                    : "opacity-80"
                    } pl-0 ml-[10px] p-[19px] pr-0 ${subIndex == item.items.length - 1
                      ? ""
                      : "border-b-2 border-Gray28"
                    }`}
                >
                  {subItem.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )
      }
    </li >
  );
}

const Lists = [
  {
    name: "Dashboard",
    url: "/dashboard",
    image: DashboardImage,
    active: ActiveDashboard,
  },
  {
    name: "Order",
    image: OrderImage,
    active: ActiveOrder,
    // url: "/orderList",
    items: [
      {
        name: "Order List",
        url: "/orderList",
        image: Dropdown1,
        active: Actives,
      },
      {
        name: "Add Order",
        url: "/addOrder",
        image: Dropdown2,
        active: SeacondActive,
      },
      {
        name: "Archive Order List",
        url: "/archiveOrder",
        image: Dropdown2,
        active: ForthActive,
      },
    ],
  },
  {
    name: "Contract",
    url: "/contractList",
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
        url: "/claimList",
        image: Dropdown1,
        active: Actives,
      },
      {
        name: "Add Claim",
        url: "/addClaim",
        image: Dropdown2,
        active: SeacondActive,
      },
      {
        name: "Add Bulk Claim",
        url: "/addBulkClaim",
        image: Dropdown2,
        active: ForthActive,
      },
    ],
  },
  {
    name: "Dealer",
    image: DealerImage,
    active: ActiveDealer,
    // url: "/dealerList",
    items: [
      {
        name: "Dealer List",
        url: "/dealerList",
        image: Dropdown1,
        active: Actives,
      },
      {
        name: "Add Dealer",
        url: "/addDealer",
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
    name: "Reseller",
    image: resellerImage,
    active: ActiveReseller,
    // url: "/resellerList",
    items: [
      {
        name: "Reseller List",
        url: "/resellerList",
        image: Dropdown1,
        active: Actives,
      },
      {
        name: "Add Reseller",
        url: "/addReseller",
        image: Dropdown2,
        active: SeacondActive,
      },
    ],
  },
  {
    name: "Customer",
    image: CustomerImage,
    active: ActiveCustomer,
    // url: "/customerList",
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
    name: "Servicer",
    image: ServicerImage,
    active: ActiveServicer,
    // url: "/servicerList",
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
        url: "/servicerRequestList",
        image: Dropdown2,
        active: ForthActive,
      },
    ],
  },
  {
    name: "Reporting",
    image: ReportImage,
    active: ActiveReport,
    items: [
      {
        name: "Sale",
        url: "/Reporting/sale",
        image: Dropdown1,
        active: Actives,
      },
      {
        name: "Claims",
        url: "/Reporting/claims",
        image: Dropdown2,
        active: SeacondActive,
      },
      // {
      //   name: "Accounting",
      //   url: "#",
      //   image: Dropdown2,
      //   active: ForthActive,
      // },
    ],
  },
  {
    name: "Price Book",
    image: PriceImage,
    active: ActivePriceBook,
    // url: "/dealerPriceList",
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
    name: "Manage Account",
    url: "/manageAccount",
    image: manageAccount,
    active: ActiveAccount,
  },
];

function SideBar() {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const [expandedItem, setExpandedItem] = useState(active);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sideBarColor, setSideBarColor] = useState('');
  const [sideBarTextColor, setSideBarTextColor] = useState('');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle the state when the button is clicked
  };
  const [isActive, setIsActive] = useState(false);
  const [userType, setUserType] = useState(
    JSON.parse(localStorage.getItem("userDetails"))
  );
  const [selectedFile2, setSelectedFile2] = useState('');
  const [url, setUrl] = useState('');
  const [siteDetails, setSiteDetails] = useState({})

  console.log(selectedFile2, '--selectedFile2');



  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("siteSettings"))
    setUrl(data.logoLight ? data.logoLight.baseUrl : null);
    setSelectedFile2(data.logoLight ? data.logoLight.fileName : null);
    const colorScheme = data.colorScheme;
    colorScheme.forEach(color => {
      switch (color.colorType) {
        case 'sideBarColor':
          setSideBarColor(color.colorCode);
          break;
        case 'sideBarTextColor':
          setSideBarTextColor(color.colorCode);
          break;
        default:
          break;
      }
    })
  }, []);




  const navigate = useNavigate();

  const handleLinkClick = (url, dropdownItem) => {
    setActive(url === "#" ? dropdownItem : url);
  };

  const handleToggleExpand = (itemName) => {
    setExpandedItem((prevExpandedItem) =>
      prevExpandedItem === itemName ? null : itemName
    );
    setIsSidebarOpen(true);
  };

  const handleLogOut = () => {
    localStorage.removeItem("userDetails");
    localStorage.removeItem("lengthofNotifications");
    navigate("/");
  };

  const dealer = [
    {
      name: "Dashboard",
      url: "/dealer/dashboard",
      image: DashboardImage,
      active: ActiveDashboard,
    },
    {
      name: "Order",
      image: OrderImage,
      active: ActiveOrder,
      items: [
        {
          name: "Order List",
          url: "/dealer/orderList",
          image: Dropdown1,
          active: Actives,
        },
        {
          name: "Add Order",
          url: "/dealer/addOrder",
          image: Dropdown2,
          active: SeacondActive,
        },
        {
          name: "Archive Order List",
          url: "/dealer/archiveOrder",
          image: Dropdown2,
          active: ForthActive,
        },
      ],
    },
    {
      name: "Contract",
      url: "/dealer/contractList",
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
          url: "/dealer/claimList",
          image: Dropdown1,
          active: Actives,
        },

        {
          name: "Add Claim",
          url: "/dealer/addClaim",
          image: Dropdown2,
          active: SeacondActive,
        },
        {
          name: "Add Bulk Claim",
          url: "/dealer/addBulkClaim",
          image: Dropdown2,
          active: ForthActive,
        },
      ],
    },

    {
      name: "Price Book ",
      url: "/dealer/priceBook",
      image: PriceImage,
      active: ActivePriceBook,
    },
    {
      name: "Reseller",
      image: DealerImage,
      active: ActiveDealer,
      items: [
        {
          name: "Reseller List",
          url: "/dealer/resellerList",
          image: Dropdown1,
          active: Actives,
        },
        {
          name: "Add Reseller",
          url: "/dealer/addReseller",
          image: Dropdown2,
          active: SeacondActive,
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
          url: "/dealer/customerList",
          image: Dropdown1,
          active: Actives,
        },
        {
          name: "Add Customer",
          url: "/dealer/addCustomer",
          image: Dropdown2,
          active: SeacondActive,
        },
      ],
    },
    {
      name: "Servicer List",
      image: ServicerImage,
      active: ActiveServicer,
      url: "/dealer/servicerList",
    },
    {
      name: "Reporting",
      image: ReportImage,
      active: ActiveReport,
      items: [
        {
          name: "Sale",
          url: "/dealer/sale",
          image: Dropdown1,
          active: Actives,
        },
        {
          name: "Claims",
          url: "/dealer/reportingclaim",
          image: Dropdown2,
          active: SeacondActive,
        },
      ],
    },
    {
      name: "Manage Account",
      image: manageAccount,
      active: ActiveAccount,
      url: "/dealer/user",
    },
  ];
  const reseller = [
    {
      name: "Dashboard",
      url: "/reseller/dashboard",
      image: DashboardImage,
      active: ActiveDashboard,
    },
    {
      name: "Order",
      image: OrderImage,
      active: ActiveOrder,
      items: [
        {
          name: "Order List",
          url: "/reseller/orderList",
          image: Dropdown1,
          active: Actives,
        },
        {
          name: "Add Order",
          url: "/reseller/addOrder",
          image: Dropdown2,
          active: SeacondActive,
        },
        {
          name: "Archive Order List",
          url: "/reseller/archiveOrder",
          image: Dropdown2,
          active: ForthActive,
        },
      ],
    },
    {
      name: "Contract",
      url: "/reseller/contractList",
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
          url: "/reseller/claimList",
          image: Dropdown1,
          active: Actives,
        },
        {
          name: "Add Claim",
          url: "/reseller/addClaim",
          image: Dropdown2,
          active: SeacondActive,
        },
        {
          name: "Add Bulk Claim",
          url: "/reseller/addBulkClaim",
          image: Dropdown2,
          active: ForthActive,
        },
      ],
    },
    {
      name: "Price Book ",
      url: "/reseller/priceBook",
      image: PriceImage,
      active: ActivePriceBook,
    },
    {
      name: "Customer",
      image: CustomerImage,
      active: ActiveCustomer,
      items: [
        {
          name: "Customer List",
          url: "/reseller/customerList",
          image: Dropdown1,
          active: Actives,
        },
        {
          name: "Add Customer",
          url: "/reseller/addCustomer",
          image: Dropdown2,
          active: SeacondActive,
        },
      ],
    },
    {
      name: "Servicer List",
      image: ServicerImage,
      active: ActiveServicer,
      url: "/reseller/servicerList",
    },
    {
      name: "Reporting",
      image: ReportImage,
      active: ActiveReport,
      items: [
        {
          name: "Sale",
          url: "/reseller/sale",
          image: Dropdown1,
          active: Actives,
        },
        {
          name: "Claims",
          url: "/reseller/reporting",
          image: Dropdown2,
          active: SeacondActive,
        },
      ],
    },
    {
      name: "Manage Account",
      image: manageAccount,
      active: ActiveAccount,
      url: "/reseller/user",
    },
  ];
  const servicer = [
    {
      name: "Dashboard",
      url: "/servicer/dashboard",
      image: DashboardImage,
      active: ActiveDashboard,
    },
    {
      name: "Dealer List",
      image: DealerImage,
      active: ActiveDealer,
      url: "/servicer/dealerList",
    },
    {
      name: "Claim Listing",
      image: ClaimImage,
      active: ActiveClaim,
      url: "/servicer/claimList",
    },
    {
      name: "Claims Reporting",
      image: ReportImage,
      active: ActiveReport,
      url: "/servicer/claims",
    },
    {
      name: "Manage Account",
      image: manageAccount,
      active: ActiveAccount,
      url: "/servicer/user",
    },
  ];
  const Customer = [
    {
      name: "Dashboard",
      url: "/customer/dashboard",
      image: DashboardImage,
      active: ActiveDashboard,
    },
    {
      name: "Claim",
      image: ClaimImage,
      active: ActiveClaim,
      items: [
        {
          name: "Claim Listing",
          url: "/customer/claimList",
          image: Dropdown1,
          active: Actives,
        },
        {
          name: "Add Claim",
          url: "/customer/addClaim",
          image: Dropdown2,
          active: SeacondActive,
        },
        {
          name: "Add Bulk Claim",
          url: "/customer/addBulkClaim",
          image: Dropdown2,
          active: ForthActive,
        },
      ],
    },
    {
      name: "Order List",
      image: OrderImage,
      active: ActiveOrder,
      url: "/customer/orderList",
    },
    {
      name: "Contract",
      url: "/customer/contractList",
      active: ActiveProduct,
      image: ProductImage,
    },
    {
      name: "Claims Reporting",
      image: ReportImage,
      active: ActiveReport,
      url: "/customer/claims",
    },
    {
      name: "Manage Account",
      image: manageAccount,
      active: ActiveAccount,
      url: "/customer/user",
    },
  ];

  const sidebarItemsByRole = {
    "Super Admin": Lists,
    Dealer: dealer,
    Reseller: reseller,
    Customer: Customer,
    Servicer: servicer,
  };

  const sidebarItems = sidebarItemsByRole[userType?.role] || [];

  const renderSidebarItems = sidebarItems.map((item, index) => (
    <SidebarItem
      key={index}
      item={item}
      active={active}
      expandedItem={expandedItem}
      onToggleExpand={handleToggleExpand}
      onLinkClick={handleLinkClick}
      setExpandedItem={setExpandedItem}
      isActiveValue={isActive}
      sidebarItems={sidebarItems}
    />
  ));

  return (
    <div className="xl:w-[220px] 2xl:w-[260px] min-h-[96vh] xl:h-full mb-8 fixed overflow-y-auto pl-3">
      <div style={{ backgroundColor: sideBarColor, color: sideBarTextColor }} className={` min-h-[95vh] rounded-3xl relative pl-[5px]`}>
        <img
          src={`${url}uploads/logo/${encodeURIComponent(selectedFile2)}`}
          className="mx-auto py-6 w-full px-5"
          alt="logo"
        />
        <hr className="border-Gray28 border-[1px]" />
        <div className="shadow-sm h-full">
          <div className="mx-auto h-full mt-6">
            <ul className="pb-5">
              {renderSidebarItems}
              <li
                className="cursor-pointer border-t-Gray28 mb-4 ps-[10px] rounded-s-[36px] border-t w-full "
                onClick={handleLogOut}
              >
                <div className="py-[22px] pe-3 ps-[10px] flex">
                  <div
                    className="w-[22px] h-[22px]"
                    style={{
                      maskImage: `url(${LogoutImage})`,
                      WebkitMaskImage: `url(${LogoutImage})`,
                      backgroundColor: sideBarTextColor,
                      maskRepeat: 'no-repeat',
                      WebkitMaskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskPosition: 'center',
                      maskSize: 'contain',
                      WebkitMaskSize: 'contain'
                    }}
                  />
                  <span className={`self-center text-[14px] font-light text-left w-full pl-[12px] text-[${sideBarTextColor}] ml-1`}>
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
