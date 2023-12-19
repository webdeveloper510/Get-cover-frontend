import React from "react";
import Grid from "./grid";

// media Import
import SearchImage from "../assets/images/icons/search.svg";
import Nonotification from "../assets/images/icons/readed-noti.svg";
import NotificationImage from "../assets/images/icons/Notification.svg";
import ProfileImage from "../assets/images/icons/Profile.svg";
import Down from "../assets/images/icons/Drop.svg";
import { Link, useLocation } from "react-router-dom";

function Headbar({ className = "" }) {
  const location = useLocation();
  console.log(location.pathname === "/notifications");
  return (
    <div className="">
      <Grid className={`absolute right-[-1%] top-[5%]  ${className}`}>
        <div className="col-span-4"></div>
        <div className="col-span-2"></div>
        <div className="col-span-6 ml-auto ">
          <Grid className="border-2 w-[250px] bg-white ms-auto border-[#D1D1D1] flex self-center py-3 px-4 rounded-xl">
            <div className="col-span-4 flex self-center justify-around border-r-2 border-[#D1D1D1]">
              {/* <div>
                <img src={SearchImage} className='cursor-pointer' alt="SearchImage" />
              </div> */}
              <div>
                <Link to={"/notifications"}>
                  <img
                    src={Nonotification}
                    className="cursor-pointer"
                    alt="NotificationImage"
                  />{" "}
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
              <img src={Down} className="cursor-pointer" alt="ProfileImage" />
            </div>
          </Grid>
        </div>
      </Grid>
    </div>
  );
}

export default Headbar;
