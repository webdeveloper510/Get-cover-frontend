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
  getSuperAdminMembers,
  updateNotifications,
} from "../services/extraServices";
import { checkUserToken } from "../services/userServices";
function Headbar({ className = "" }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPrimary, setIsPrimary] = useState(false);
  // const [ToChecklengthFalse, setToChecklengthFalse] = useState([])
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
  });
  const navigate = useNavigate();
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/");
  };

  const getNotificationsData = () => {
    let ArrayData = [];
    getNotifications().then((response) => {
      setNotificationList(response.result.notification);
      response.result.notification.map((data) => {
        if (!data.notificationData.status) {
          ArrayData.push(data);
        }
      });
      localStorage.setItem("lengthofNotifications", ArrayData.length);
    });
  };
  const lengthofNotifications = localStorage.getItem("lengthofNotifications");

  useEffect(() => {
    checkTokenExpiry();
  }, []);

  const checkTokenExpiry = async () => {
    try {
      const response = await checkUserToken();
      console.log(response.code == 200);
      if (response.code == 200) {
        setIsLoggedIn(true);
        getNotificationsData();
        // fetchUserDetails();
      } else {
        setIsLoggedIn(false);
        localStorage.removeItem("userDetails");
        navigate(`/login`);
      }
    } catch (error) {
      console.error("Error validating token:", error);
      setIsLoggedIn(false);
      navigate(`/login`);
      localStorage.removeItem("userDetails");
    } finally {
      // setIsLoading(false);
    }
  };

  console.log(
    localStorage.getItem("userDetails"),
    "---------------->>>>>>>>>>>>"
  );
  const userData = JSON.parse(localStorage.getItem("userDetails"));
  const firstName = userData.userInfo.firstName;
  const fetchUserDetails = async () => {
    setLoading(true);

    try {
      const userDetails = await getSuperAdminMembers();
      setIsPrimary(userDetails.loginMember.isPrimary);
      const { firstName, lastName, email, phoneNumber, position } =
        userDetails.loginMember;

      setInitialValues({
        firstName,
        lastName,
        email,
        phoneNumber,
        position,
      });
      // setEmail(userDetails?.loginMember.email);
      console.log(userDetails.result);
      setUserList(userDetails.loginMember);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setLoading(false);
    } finally {
      // fetchUserMembers();
      setLoading(false);
    }
  };

  return (
    <div className="">
      {loading ? (
        <></>
      ) : (
        <Grid
          className={` md:right-[0%] xl:right-[0%] s:relative md:absolute xl:absolute s:top-[-12px] s:right-[20%]  md:top-[24px]  xl:top-[24px]  ${className}`}
        >
          <div className="col-span-4"></div>
          <div className="col-span-2"></div>
          <div className="col-span-6 ml-auto ">
            <Grid className="border-2 w-[250px] bg-white ms-auto border-[#D1D1D1] border-r-0 flex self-center py-2 pl-4 rounded-s-xl">
              <div className="col-span-4  flex self-center justify-around border-r-2 border-[#D1D1D1]">
                {/* <div>
                <img src={SearchImage} className='cursor-pointer' alt="SearchImage" />
              </div> */}
                <div className="s:hidden md:block xl:block">
                  <Link
                    to={userData.role == "Super Admin" ? "/notifications" : "#"}
                    className="relative"
                  >
                    <img
                      src={NotificationImage}
                      className="cursor-pointer mt-[-2%]"
                      alt="NotificationImage"
                    />
                    {userData.role == "Super Admin" &&
                      lengthofNotifications !== 0 && (
                        <p className="text-[11px] right-[-8px] font-semibold -top-2 rounded-full text-white absolute bg-[red] h-5 w-5 pt-[0px] text-center border-2 border-[#333333]">
                          {lengthofNotifications > 9
                            ? "9+"
                            : lengthofNotifications}
                        </p>
                      )}
                  </Link>
                </div>
                {/* <div>
                <img src={SettingImage} className='cursor-pointer' alt="SettingImage" />
              </div> */}
              </div>
              <div className="col-span-8 self-center flex justify-around">
                {/* <img src={ProfileImage} alt='ProfileImage'/> */}
                <p className="text-light-black font-semibold text-base self-center">
                  {firstName}
                </p>
                <div className="self-center relative" onClick={handleLogOut}>
                  <img src={Logout} className="cursor-pointer" alt="Logout" />
                </div>
              </div>
            </Grid>
          </div>
        </Grid>
      )}
    </div>
  );
}

export default Headbar;
