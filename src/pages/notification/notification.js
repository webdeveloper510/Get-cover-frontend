import React, { useEffect, useState } from "react";
import Headbar from "../../common/headBar";
import BackImage from "../../assets/images/icons/backArrow.svg";
import date from "../../assets/images/icons/date.svg";
import time from "../../assets/images/icons/time.svg";
import { Link } from "react-router-dom";

import { getNotifications } from "../../services/extraServices";

function Notification() {
  const [notificationList, setNotificationList] = useState([]);
  useEffect(() => {
    getNotifications().then((response) => {
      setNotificationList(response.result.notification);
      console.log(response.result.notification);
    });
  }, []);
  return (
    <div className="my-8 ml-3 relative overflow-x-hidden">
      <Headbar className="!top-0" />
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
        {notificationList.length !== 0 ? (
          notificationList.map((data, key) => (
            <div
              key={key}
              className="border border-[#D9D9D9] rounded-[25px] mb-5 px-6 py-8 mr-4"
            >
              <p className="font-semibold text-lg">
                {data?.notificationData.title}
              </p>
              <p className="mb-6 text-base text-[#999999] font-Regular">
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
          <p>No Notification</p>
        )}
      </div>
    </div>
  );
}

export default Notification;
