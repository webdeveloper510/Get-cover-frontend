import React, { useEffect, useState } from "react";
import Headbar from "../../common/headBar";
import BackImage from "../../assets/images/icons/backArrow.svg";
import date from "../../assets/images/icons/date.svg";
import Loader from "../../assets/images/Loader.gif";
import unRead from "../../assets/images/Msg-Black.svg";
import Read from "../../assets/images/Msg-white.png";
import unReadDot from "../../assets/images/UnReadDot.svg";
import ReadDot from "../../assets/images/ReadDot.svg";
import time from "../../assets/images/icons/time.svg";
import { Link, useNavigate } from "react-router-dom";

import {
  getNotificationMarks,
  getNotifications,
  updateNotifications,
} from "../../services/extraServices";
import { RotateLoader } from "react-spinners";
import Grid from "../../common/grid";
import Button from "../../common/button";

function Notification() {
  const [notificationList, setNotificationList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, [activeTab]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await getNotifications({
        readFlag: activeTab === "unread" ? "false" : "",
      });
      setNotificationList(response.result);
      console.log(response.result?.notification);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNotification = async (id, type) => {
    try {
      const res = await updateNotifications(id);
      if (res) {
        switch (type) {
          case "dealer request":
            navigate("/newDealerList");
            break;
          case "dealer":
            navigate("/dealerList");
            break;
          case "servicer request":
            navigate("/servicerRequestList");
            break;
          case "servicer":
            navigate("/servicerList");
            break;
          case "Customer":
            navigate("/customerList");
            break;
          case "Order":
            navigate("/orderList");
            break;
          case "claim":
            navigate("/claimList");
            break;
          case "pricebook":
            navigate("/dealerPriceList");
            break;
          default:
            navigate("/contractList");
            break;
        }
      }
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    try {
      const response = await getNotificationMarks();
      console.log(response.result?.notification);
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const handleClick = () => {
    navigate("/destination?myProp=Hello, World!");
  };
  return (
    <div className="relative overflow-x-hidden min-h-screen bg-grayf9">
      <Headbar />
      <div className="mt-[8%] bg-white p-3 rounded-[20px] pr-2 mx-auto">
        <div className="flex justify-between mb-3">
          <div>
            <p className="font-semibold text-[25px] leading-9 mb-[3px]">
              Notifications
            </p>
            <div className="flex">
              <button
                className={`tab-button ${
                  activeTab === "all"
                    ? "active mr-3 bg-[#DDDDDE] text-light-black font-semibold py-1 px-4 rounded"
                    : "border-b-2 mr-3 text-light-black font-semibold py-1 px-4 text-sm rounded"
                }`}
                onClick={() => handleTabClick("all")}
              >
                All
              </button>
              <button
                className={`tab-button ${
                  activeTab === "unread"
                    ? "active mr-3 bg-[#DDDDDE] text-light-black font-semibold py-1 px-4 rounded"
                    : "border-b-2 text-light-black font-semibold py-1 px-4 text-sm rounded"
                }`}
                onClick={() => handleTabClick("unread")}
              >
                Unread
              </button>
            </div>
          </div>
          <Button
            className="!text-light-black !bg-[#1B1D2126] self-center"
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </Button>
        </div>
        {loading ? (
          <div className="h-[500px] bg-[#fff] left-0 w-full flex py-5">
            <div className="self-center mx-auto">
              <RotateLoader color="#333" />
            </div>
          </div>
        ) : (
          <>
            <div className="tab-content overflow-y-scroll min-h-[70vh] h-[70vh]">
              {activeTab === "all" && (
                <div>
                  {notificationList?.length !== 0 ? (
                    notificationList?.map((data, key) => (
                      <div
                        key={key}
                        className=""
                        onClick={() =>
                          handleUpdateNotification(data?._id, data.flag)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        {data?.isRead !== true ? (
                          <Grid className="border-[1px] p-2 border-[#D1D1D2] bg-[#E8E8E9] relative">
                            <div className="col-span-9 self-center flex w-full">
                              <img
                                src={unReadDot}
                                className="mr-2 w-[10px] h-[10px] my-auto self-center" 
                                alt="Unread dot"
                              />
                              <img
                                src={unRead}
                                className="mr-2 w-[18px] h-[24px] self-center"
                                alt="Unread icon"
                              />
                              <p className="text-light-black text-base font-semibold">
                                {data?.title}: {data?.userId?.firstName}
                              </p>
                              <p className="text-sm text-neutral-grey font-Regular self-center pl-4 pt-1">
                                {data?.description}
                              </p>
                            </div>
                            <div className="col-span-3">
                              <div className="flex justify-end h-full">
                                <p className="flex text-sm mr-3 w-1/2 self-center">
                                  <img src={time} className="mr-2" alt="Time" />{" "}
                                  {new Date(
                                    data.createdAt
                                  ).toLocaleTimeString()}{" "}
                                </p>
                                <p className="mr-3 flex text-sm w-1/2 self-center">
                                  <img src={date} className="mr-2" alt="Date" />{" "}
                                  {new Date(
                                    data?.createdAt
                                  ).toLocaleDateString()}{" "}
                                </p>
                              </div>
                            </div>
                          </Grid>
                        ) : (
                          <Grid className="border-[1px] p-2 border-[#D1D1D2] bg-white relative">
                            <div className="col-span-9 self-center flex w-full">
                              <img
                                src={ReadDot}
                                className="mr-2 w-[10px] h-[10px] my-auto self-center"
                                alt="Read dot"
                              />
                              <img
                                src={Read}
                                className="mr-2 w-[18px] h-[18px] mt-[3px] self-center"
                                alt="Read icon"
                              />
                              <p className="text-light-black text-base font-semibold ">
                                {data?.title}: {data?.userId?.firstName}
                              </p>
                              <p className="text-sm text-neutral-grey font-Regular self-center pl-4 pt-1">
                                {data?.description}
                              </p>
                            </div>
                            <div className="col-span-3">
                              <div className="flex justify-end h-full">
                                <p className="flex text-sm mr-3 w-1/2  self-center">
                                  <img src={time} className="mr-2" alt="Time" />{" "}
                                  {new Date(
                                    data.createdAt
                                  ).toLocaleTimeString()}{" "}
                                </p>
                                <p className="mr-3 flex text-sm w-1/2  self-center">
                                  <img src={date} className="mr-2" alt="Date" />{" "}
                                  {new Date(
                                    data?.createdAt
                                  ).toLocaleDateString()}{" "}
                                </p>
                              </div>
                            </div>
                          </Grid>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="py-8 text-xl text-center font-semibold">
                      No Notification Yet
                    </p>
                  )}
                </div>
              )}
              {activeTab === "unread" && (
                <div>
                  {notificationList?.length !== 0 ? (
                    notificationList?.map((data, key) => (
                      <div
                        key={key}
                        className=""
                        onClick={() =>
                          handleUpdateNotification(data?._id, data.flag)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <Grid className="border-[1px] p-2 border-[#D1D1D2] bg-[#E8E8E9] relative">
                          <div className="col-span-9 self-center flex w-full">
                            <img
                              src={unReadDot}
                              className="mr-2 w-[10px] h-[10px] my-auto self-center"
                              alt="Unread dot"
                            />
                            <img
                              src={unRead}
                              className="mr-2 w-[18px] h-[24px] self-center"
                              alt="Unread icon"
                            />
                            <p className="text-light-black text-base font-semibold">
                              {data?.title}: {data?.flag}
                            </p>
                            <p className="text-sm text-neutral-grey font-Regular self-center pl-4 pt-1">
                              {data?.description}
                            </p>
                          </div>
                          <div className="col-span-3">
                            <div className="flex justify-end h-full">
                              <p className="flex text-sm mr-3 w-1/2 self-center">
                                <img src={time} className="mr-2" alt="Time" />{" "}
                                {new Date(data.createdAt).toLocaleTimeString()}{" "}
                              </p>
                              <p className="mr-3 flex text-sm w-1/2  self-center">
                                <img src={date} className="mr-2" alt="Date" />{" "}
                                {new Date(data?.createdAt).toLocaleDateString()}{" "}
                              </p>
                            </div>
                          </div>
                        </Grid>
                      </div>
                    ))
                  ) : (
                    <p className="py-8 text-xl text-center font-semibold">
                      No Notification Yet
                    </p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Notification;
