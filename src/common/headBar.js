import React, { useState } from "react";
import Grid from "./grid";
import { Link, useLocation, useNavigate } from "react-router-dom";
// media Import
import Logout from "../assets/images/side-bar/logout-black.svg";
import Nonotification from "../assets/images/icons/readed-noti.svg";
import NotificationImage from "../assets/images/icons/notificationIcon.svg";
import ProfileImage from "../assets/images/icons/Profile.svg";
import Down from "../assets/images/icons/Drop.svg";

function Headbar({ className = "" }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/");
  };


  return (
    <div className="">
      <Grid className={`absolute right-[-1%] top-[24px]  ${className}`}>
        <div className="col-span-4"></div>
        <div className="col-span-2"></div>
        <div className="col-span-6 ml-auto ">
          <Grid className="border-2 w-[250px] bg-white ms-auto border-[#D1D1D1] flex self-center py-2 px-4 rounded-xl">
            <div className="col-span-4 flex self-center justify-around border-r-2 border-[#D1D1D1]">
              {/* <div>
                <img src={SearchImage} className='cursor-pointer' alt="SearchImage" />
              </div> */}
              <div>
                <Link to={"/notifications"} className="relative">
                  <img
                    src={NotificationImage}
                    className="cursor-pointer mt-[-2%] "
                    alt="NotificationImage"
                  />{" "}
                  <p className="text-[10px] right-[6px] top-0 text-white absolute">9</p>
                </Link>
              </div>
              {/* <div>
                <img src={SettingImage} className='cursor-pointer' alt="SettingImage" />
              </div> */}
            </div>
            <div className="col-span-8 self-center flex justify-around">
              {/* <img src={ProfileImage} alt='ProfileImage'/> */}
              <p className="text-light-black font-semibold text-base self-center">
                Veronica
              </p>
              <div className="self-center relative" onClick={toggleDropdown}>
                <img src={Down} className={`cursor-pointer ${isDropdownOpen == false  ? '' : 'rotate-180'}`} alt="ProfileImage" />
                </div>
                {isDropdownOpen && (
                    <div className="absolute  bg-white ml-3 mt-6">
                      {/* Your dropdown content goes here */}
                      <ul>
                        <li className="text-light-black bg-white drop-shadow-5xl rounded-lg p-3 cursor-pointer font-semibold flex text-base"  onClick={handleLogOut}> <img src={Logout} className="mr-2" alt="Logout"/>Logout</li>
                      </ul>
                    </div>
                  )}
            </div>
          </Grid>
        </div>
      </Grid>
    </div>
  );
}

export default Headbar;
