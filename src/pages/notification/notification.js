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
  const updateNotification = async (id, type) => {
    console.log(id,type);
    updateNotifications(id).then((res) => {
      if (res) {
        if(type === "dealer") {
          navigate("/newDealerList")
        } else if (type === "servicer")
          navigate("/servicerRequestList")
          else if (type === "Customer") {
            navigate("/customerList")
          }
            else if (type === "Order") {
              navigate("/orderList")
            }
            else if (type === "claim") {
              navigate("/claimList")
            }
            else if (type === "pricebook") {
              navigate("/dealerPriceList")
            }
          else {
            navigate("/contractList")
            
          }
      }
    });
  };
  const [activeTab, setActiveTab] = useState('all');

  const getNotificationsData = () => {
    getNotifications({ readFlag: activeTab === 'all' ? true : false }).then((response) => {
      setNotificationList(response.result);
      console.log(response.result?.notification);
      setLoading(false);
    });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    getNotificationsData();
  };
  return (
    <div className=" relative overflow-x-hidden min-h-screen bg-grayf9">
      <Headbar />
      <div className="flex bg-white drop-shadow-header py-[22px] px-[18px]">
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
          
      <div className="mt-2 overflow-y-scroll w-[750px] bg-white p-3  rounded-[20px] min-h-[80vh] h-[80vh] pr-2 mx-auto">
        <div className="flex justify-between mb-3">
          <div>
          <p className="font-semibold text-[25px] leading-9 mb-[3px]">
            Notifications
          </p>
            <div className="flex">
            <button
          className={`tab-button ${activeTab === 'all' ? 'active mr-3 bg-light-black text-white font-semibold py-1 px-4 rounded' : 'border-b-light-black border-b-2 mr-3 text-light-black font-semibold py-1 px-4 text-sm rounded'} `}
          onClick={() => handleTabClick('all')}
        >
          All
        </button>
        <button
          className={`tab-button ${activeTab === 'unread' ? 'active mr-3 bg-light-black text-white font-semibold py-1 px-4 rounded' : 'border-b-light-black border-b-2 text-light-black font-semibold py-1 px-4 text-sm rounded'} `}
          onClick={() => handleTabClick('unread')}
        >
          Unread
        </button>
            </div>
          </div>
          <Button className='!text-light-black !bg-[#1B1D2126] self-center'>Mark all as read</Button>
        </div>


        {loading ? (
          <div className=" fixed top-0 h-screen bg-[#cfcfcf8f] left-0 w-full flex py-5">
            <div className="self-center mx-auto">
              <RotateLoader color="#333" />
            </div>
          </div>
        ) : (
          <>
           <div className="tab-content">
        {activeTab === 'all' && <div> {notificationList?.length !== 0 ? (
              notificationList?.map((data, key) => (
                <div
                  key={key}
                  className=""
                  onClick={() =>
                    updateNotification(data?._id, data.flag)
                  }
                  style={{ cursor: "pointer" }}
                >
                  { data?.isRead !== true ?        
                      <Grid className="border-2 p-2 rounded-xl mb-3 bg-white border-[#a5a5a585] relative">
                        <div className="col-span-1 self-center">
                          <img src={unRead} alt="read"/>
                        </div>
                        <div className="col-span-11 self-center">
                          <p className="text-light-black text-base font-semibold">{data?.title}: {data?.flag}</p>
                          <p className="text-sm text-neutral-grey font-Regular">{data?.description}</p>
                          <div className="flex justify-end">
                          <p className="mr-3 flex text-sm">  <img src={date} className="mr-2" alt="date" /> {new Date(
                                        data?.createdAt
                                      ).toLocaleDateString()} </p>

                          <p className="flex text-sm"> <img src={time} className="mr-2" alt="Time" /> {new Date(
                                        data.createdAt
                                      ).toLocaleTimeString()} </p>
                          </div>
                        </div>
                        
                      </Grid> 
                      :   
                       <Grid className="border-0 p-2 rounded-xl mb-3 bg-white relative">
                          <div className="col-span-1 self-center">
                            <img src={Read} alt="read"/>
                          </div>
                        <div className="col-span-11 self-center">
                          <p className="text-light-black text-base font-semibold">{data?.title}: {data?.flag}</p>
                          <p className="text-sm text-neutral-grey font-Regular">{data?.description}</p>
                          <div className="flex justify-end">
                          <p className="mr-3 flex text-sm">  <img src={date} className="mr-2" alt="date" /> {new Date(
                                        data?.createdAt
                                      ).toLocaleDateString()} </p>

                          <p className="flex text-sm"> <img src={time} className="mr-2" alt="Time" /> {new Date(
                                        data.createdAt
                                      ).toLocaleTimeString()} </p>
                          </div>
                        </div>
                       </Grid>}
         
                </div>
              ))
            ) : (
              <p className="py-8 text-xl text-center font-semibold">
                No Notification Yet
              </p>
            )}</div>}
        {activeTab === 'unread' && <div> {notificationList?.length !== 0 ? (
              notificationList?.map((data, key) => (
                <div
                  key={key}
                  className=""
                  onClick={() =>
                    updateNotification(data?._id, data.flag)
                  }
                  style={{ cursor: "pointer" }}
                >       
                      <Grid className="border-2 p-2 rounded-xl mb-3 bg-white border-[#a5a5a585] relative">
                        <div className="col-span-1 self-center">
                          <img src={unRead} alt="read"/>
                        </div>
                        <div className="col-span-11 self-center">
                          <p className="text-light-black text-base font-semibold">{data?.title}: {data?.flag}</p>
                          <p className="text-sm text-neutral-grey font-Regular">{data?.description}</p>
                          <div className="flex justify-end">
                          <p className="mr-3 flex text-sm">  <img src={date} className="mr-2" alt="date" /> {new Date(
                                        data?.createdAt
                                      ).toLocaleDateString()} </p>

                          <p className="flex text-sm"> <img src={time} className="mr-2" alt="Time" /> {new Date(
                                        data.createdAt
                                      ).toLocaleTimeString()} </p>
                          </div>
                        </div>
                        
                      </Grid> 
                    
         
                </div>
              ))
            ) : (
              <p className="py-8 text-xl text-center font-semibold">
                No Notification Yet
              </p>
            )}</div>}
      </div>
           
          </>
        )}
      </div>
    </div>
  );
}

export default Notification;
