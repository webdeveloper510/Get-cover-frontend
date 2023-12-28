import React, { useEffect, useState } from "react";
import Headbar from "../../common/headBar";
import BackImage from "../../assets/images/icons/backArrow.svg";
import date from "../../assets/images/icons/date.svg";
import Loader from "../../assets/images/Loader.gif";
import time from "../../assets/images/icons/time.svg";
import { Link, useNavigate } from "react-router-dom";

import {
  getNotifications,
  updateNotifications,
} from "../../services/extraServices";
import { RotateLoader } from "react-spinners";

function Notification() {
  const [notificationList, setNotificationList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    getNotificationsData();
  }, []);
  const updateNotification = async (type) => {
    console.log(type);
    updateNotifications(type).then((res) => {
      if (res) {
        type === "dealer"
          ? navigate("/newDealerList")
          : navigate("/requestList");
      }
    });
  };

  const getNotificationsData = () => {
    getNotifications().then((response) => {
      setNotificationList(response.result.notification);
      console.log(response.result.notification);
      setLoading(false);
    });
  };
  return (
    <div className="py-8 pl-3 relative overflow-x-hidden min-h-screen bg-[#F9F9F9]">
      <Headbar />
      <div className="flex">
        <Link
          to={"/dashboard"}
          className="h-[60px] w-[60px] flex border-[1px] bg-white border-[#D1D1D1] rounded-[25px]"
        >
          <img
            src={BackImage}
            className="m-auto my-auto self-center bg-white"
            alt="BackImage"
          />
        </Link>
        <div className="pl-3">
          <p className="font-semibold text-[36px] leading-9 mb-[3px]">
            Notifications
          </p>
          <ul className="flex self-center">
            <li className="text-sm text-neutral-grey font-Regular">
              <Link to={"/"}>Servicer </Link> /{" "}
            </li>
            <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
              {" "}
              Notifications{" "}
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className=" fixed top-0 h-screen bg-[#cfcfcf8f] left-0 w-full flex py-5">
          <div className="self-center mx-auto">
            <RotateLoader color="#333" />
          </div>
       </div>
        ) : (
          <>
            {notificationList.length !== 0 ? (
              notificationList.map((data, key) => (
                <div
                  key={key}
                  className="border border-[#D9D9D9] rounded-[25px] my-3 px-6 py-8 mr-4"
                  onClick={() =>
                    updateNotification(data?.notificationData?.flag)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <p
                    className={`${
                      data.notificationData.status !== true
                        ? "font-semibold text-lg"
                        : "font-Regular text-lg"
                    } `}
                  >
                    {data?.notificationData.title}: {data?.name}
                  </p>
                  <p
                    className={`${
                      data.notificationData.status !== true
                        ? "mb-6 text-base text-[#999999] font-semibold"
                        : "mb-6 text-base text-[#999999] font-Regular"
                    }  `}
                  >
                    {data?.notificationData.description}
                  </p>
                  <div className="flex">
                    <div className="flex mr-10 font-Regular">
                      <img src={date} className="mr-2" alt="date" />
                      <p>
                        <b> Date : </b>{" "}
                        {new Date(
                          data.notificationData.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex font-Regular">
                      <img src={time} className="mr-2" alt="Time" />
                      <p>
                        <b> Time : </b>{" "}
                        {new Date(
                          data.notificationData.createdAt
                        ).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-8 text-xl text-center font-semibold">
                No Notification Yet
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Notification;
