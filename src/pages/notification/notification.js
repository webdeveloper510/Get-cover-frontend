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
    setLoading(true);
    getNotifications({ readFlag: activeTab === 'unread' ? false : '' }).then((response) => {
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
      
          
      <div className="mt-[8%]  bg-white p-3  rounded-[20px] pr-2 mx-auto">
        <div className="flex justify-between mb-3">
          <div>
          <p className="font-semibold text-[25px] leading-9 mb-[3px]">
            Notifications
          </p>
            <div className="flex">
            <button
          className={`tab-button ${activeTab === 'all' ? 'active mr-3 bg-[#DDDDDE] text-light-black font-semibold py-1 px-4 rounded' : ' border-b-2 mr-3 text-light-black font-semibold py-1 px-4 text-sm rounded'} `}
          onClick={() => handleTabClick('all')}
        >
          All
        </button>
        <button
          className={`tab-button ${activeTab === 'unread' ? 'active mr-3 bg-[#DDDDDE] text-light-black font-semibold py-1 px-4 rounded' : ' border-b-2 text-light-black font-semibold py-1 px-4 text-sm rounded'} `}
          onClick={() => handleTabClick('unread')}
        >
          Unread
        </button>
            </div>
          </div>
          <Button className='!text-light-black !bg-[#1B1D2126] self-center'>Mark all as read</Button>
        </div>


        {loading ? (
          <div className="h-[500px] bg-[#fff] left-0 w-full flex py-5">
            <div className="self-center mx-auto">
              <RotateLoader color="#333" />
            </div>
          </div>
        ) : (
          <>
           <div className="tab-content  overflow-y-scroll min-h-[70vh] h-[70vh]">
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
                      <Grid className="border-[1px] p-2 border-[#D1D1D2] bg-[#E8E8E9] relative">
                     
                        <div className="col-span-9 self-center flex w-full">
                          <img src={unReadDot} className="mr-2 w-3 h-3 my-auto" alt="Time" />
                          <img src={unRead} className="mr-2 w-6 h-6" alt="Time" />
                          <p className="text-light-black text-base font-semibold">{data?.title}: {data?.flag}</p>
                          <p className="text-sm text-neutral-grey font-Regular self-center pl-4 pt-1">{data?.description}</p>
                        
                        </div>
                        <div className="col-span-3">
                          <div className="flex justify-end">
                        <p className="flex text-sm mr-3"> <img src={time} className="mr-2" alt="Time" /> {new Date(
                                        data.createdAt
                                      ).toLocaleTimeString()} </p>
                          <p className="mr-3 flex text-sm">  <img src={date} className="mr-2" alt="date" /> {new Date( data?.createdAt ).toLocaleDateString()} </p>

                          
                          </div>
                        </div>
                        
                      </Grid> 
                      :   
                       <Grid className="border-[1px] p-2 border-[#D1D1D2] bg-white relative">
                        <div className="col-span-9 self-center flex w-full">
                          <img src={ReadDot} className="mr-2 w-3 h-3 my-auto" alt="Time" />
                          <img src={Read} className="mr-2 w-6 h-6" alt="Time" />
                          <p className="text-light-black text-base font-semibold">{data?.title}: {data?.flag}</p>
                          <p className="text-sm text-neutral-grey font-Regular self-center pl-4 pt-1">{data?.description}</p>
                        
                        </div>
                        <div className="col-span-3">
                          <div className="flex justify-end">
                        <p className="flex text-sm mr-3"> <img src={time} className="mr-2" alt="Time" /> {new Date(
                                        data.createdAt
                                      ).toLocaleTimeString()} </p>
                          <p className="mr-3 flex text-sm">  <img src={date} className="mr-2" alt="date" /> {new Date( data?.createdAt ).toLocaleDateString()} </p>

                          
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
                     <Grid className="border-[1px] p-2 border-[#D1D1D2] bg-[#E8E8E9] relative">
                     
                     <div className="col-span-9 self-center flex w-full">
                       <img src={unReadDot} className="mr-2 w-3 h-3 my-auto" alt="Time" />
                       <img src={unRead} className="mr-2 w-6 h-6" alt="Time" />
                       <p className="text-light-black text-base font-semibold">{data?.title}: {data?.flag}</p>
                       <p className="text-sm text-neutral-grey font-Regular self-center pl-4 pt-1">{data?.description}</p>
                     
                     </div>
                     <div className="col-span-3">
                       <div className="flex justify-end">
                     <p className="flex text-sm mr-3"> <img src={time} className="mr-2" alt="Time" /> {new Date(
                                     data.createdAt
                                   ).toLocaleTimeString()} </p>
                       <p className="mr-3 flex text-sm">  <img src={date} className="mr-2" alt="date" /> {new Date( data?.createdAt ).toLocaleDateString()} </p>

                       
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
