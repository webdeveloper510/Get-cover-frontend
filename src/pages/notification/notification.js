import React, { useEffect, useState } from "react";
import Headbar from "../../common/headBar";
import BackImage from "../../assets/images/icons/backArrow.svg";
import date from "../../assets/images/icons/date.svg";
import Loader from "../../assets/images/Loader.gif";
import unRead from "../../assets/images/Unread.svg";
import Read from "../../assets/images/Readed.svg";
import time from "../../assets/images/icons/time.svg";
import { Link, useNavigate } from "react-router-dom";

import {
  getNotifications,
  updateNotifications,
} from "../../services/extraServices";
import { RotateLoader } from "react-spinners";
import Grid from "../../common/grid";
import Button from "../../common/button";

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
          : navigate("/servicerRequestList");
      }
    });
  };

  const getNotificationsData = () => {
    getNotifications().then((response) => {
      setNotificationList(response.result?.notification);
      console.log(response.result?.notification);
      setLoading(false);
    });
  };
  
  return (
    <div className="py-8 pl-3 relative overflow-x-hidden min-h-screen bg-grayf9">
      <Headbar />
      <div className="flex">
        <Link
          to={"/"}
          className="h-[60px] w-[60px] flex border-[1px] bg-white border-Light-Grey rounded-[25px]"
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
            {/* <li className="text-sm text-neutral-grey font-Regular">
              <Link to={"/"}>Servicer </Link> /{" "}
            </li> */}
            <li className="text-sm text-neutral-grey font-semibold pt-[1px]">
              {" "}
              Notifications{" "}
            </li>
          </ul>
        </div>
      </div>
          
      <div className="mt-2 overflow-y-scroll min-h-[80vh] h-[80vh] pr-2">
        <div className="flex justify-end mb-3">
           <Button className='!text-light-black !bg-[#1B1D2126]'>Mark all as read</Button>
        </div>

        
        {/* Unread Box */}
        <Grid className="border-2 p-2 rounded-xl mb-3 bg-[#D9D9D9] relative">
           <div className="col-span-1 self-center">
            <img src={unRead} alt="read"/>
           </div>
           <div className="col-span-9 self-center">
            <p className="text-light-black text-xl font-semibold">New Registration: Finibus Bonorum et Malorum</p>
            <p className="text-base text-neutral-grey font-Regular">In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. </p>
           </div>
           <div className="col-span-2 self-center">
              <div className="">
                    <div className="flex mr-10 font-Regular">
                      <img src={date} className="mr-2" alt="date" />
                      <p>
                        <b> Date : </b>{" "}
                        24 Nov 2023
                      </p>
                    </div>
                    <div className="flex font-Regular">
                      <img src={time} className="mr-2" alt="Time" />
                      <p>
                        <b> Time : </b>{" "}
                        9:30 AM
                      </p>
                    </div>
              </div>
              <div className="bg-light-black absolute right-0 top-0 text-[12px] px-[13px] py-[5px] rounded-tr-[12px]">
                <p className="text-white">New</p>
              </div>
           </div>
        </Grid>
        {/* read Box */}
        <Grid className="border-2 p-2 rounded-xl bg-white relative">
           <div className="col-span-1 self-center">
            <img src={Read} alt="read"/>
           </div>
           <div className="col-span-9 self-center">
            <p className="text-light-black text-xl font-semibold">New Registration: Finibus Bonorum et Malorum</p>
            <p className="text-base text-neutral-grey font-Regular">In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. </p>
           </div>
           <div className="col-span-2 self-center">
              <div className="">
                    <div className="flex mr-10 font-Regular">
                      <img src={date} className="mr-2" alt="date" />
                      <p>
                        <b> Date : </b>{" "}
                        24 Nov 2023
                      </p>
                    </div>
                    <div className="flex font-Regular">
                      <img src={time} className="mr-2" alt="Time" />
                      <p>
                        <b> Time : </b>{" "}
                        9:30 AM
                      </p>
                    </div>
              </div>
           </div>
        </Grid>


        {loading ? (
          <div className=" fixed top-0 h-screen bg-[#cfcfcf8f] left-0 w-full flex py-5">
            <div className="self-center mx-auto">
              <RotateLoader color="#333" />
            </div>
          </div>
        ) : (
          <>
            {notificationList?.length !== 0 ? (
              notificationList?.map((data, key) => (
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
                      data.notificationData?.status !== true
                        ? "font-semibold text-lg"
                        : "font-Regular text-lg"
                    } `}
                  >
                    {data?.notificationData?.title}: {data?.name}
                  </p>
                  <p
                    className={`${
                      data.notificationData?.status !== true
                        ? "mb-6 text-base text-neutral-grey font-semibold"
                        : "mb-6 text-base text-neutral-grey font-Regular"
                    }  `}
                  >
                    {data?.notificationData?.description}
                  </p>
                  <div className="flex">
                    <div className="flex mr-10 font-Regular">
                      <img src={date} className="mr-2" alt="date" />
                      <p>
                        <b> Date : </b>{" "}
                        {new Date(
                          data.notificationData?.createdAt
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
