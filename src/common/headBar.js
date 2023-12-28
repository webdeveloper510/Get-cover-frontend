import React, { useEffect, useState } from "react";
import Grid from "./grid";
import { Link, useLocation, useNavigate } from "react-router-dom";
// media Import
import Logout from "../assets/images/side-bar/logout-black.svg";
import Nonotification from "../assets/images/icons/readed-noti.svg";
import NotificationImage from "../assets/images/icons/Notification-icon.svg";
import ProfileImage from "../assets/images/icons/Profile.svg";
import Down from "../assets/images/icons/Drop.svg";
import {
  getNotifications,
  updateNotifications,
} from "../services/extraServices";
function Headbar({ className = "" }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  // const [ToChecklengthFalse, setToChecklengthFalse] = useState([])
  const location = useLocation();
  const navigate = useNavigate();
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/");
  };

  const getNotificationsData = () => {
    let ArrayData = []
    getNotifications().then((response) => {
      setNotificationList(response.result.notification);
      response.result.notification.map((data)=>{
        if (!data.notificationData.status){
          ArrayData.push(data)
        }
      })
      // setToChecklengthFalse(ArrayData)
      localStorage.setItem('lengthofNotifications', ArrayData.length)
    });
  };
  const lengthofNotifications = localStorage.getItem("lengthofNotifications")
  useEffect(() => {
    getNotificationsData();
  }, []);

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
                  <p className="text-[11px] right-[-8px] font-semibold -top-2 rounded-full text-white absolute bg-[red] h-5 w-5 pt-[0px] text-center border-2 border-[#333333]">{lengthofNotifications}</p>
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
              <div className="self-center relative" onClick={handleLogOut}>
                <img src={Logout} className="cursor-pointer" alt="Logout"/>
              </div>
            </div>
          </Grid>
        </div>
      </Grid>
    </div>
  );
}

export default Headbar;
