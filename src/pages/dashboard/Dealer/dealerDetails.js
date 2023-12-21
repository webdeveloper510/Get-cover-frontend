import React, { useEffect, useState } from "react";
import Headbar from "../../../common/headBar";
import BackImage from "../../../assets/images/icons/backArrow.svg";
import { Link, useNavigate } from "react-router-dom";
import Grid from "../../../common/grid";
import Button from "../../../common/button";

function DealerDetails() {

  return (

    <div className="py-8 pl-3 relative overflow-x-hidden bg-[#F9F9F9]">

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
          Dealer Details
          </p>
          <ul className="flex self-center">
            <li className="text-sm text-neutral-grey font-Regular">
              <Link to={"/"}>Dealer  / </Link> /{" "}
            </li>
            <li className="text-sm text-neutral-grey font-Regular">
              <Link to={"/"}>  Dealer List   / </Link> /{" "}
            </li>
            <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
              {" "}
              Dealer Detail (Price Book) 
            </li>
          </ul>
        </div>
      </div>

      <Grid>
        <div className="col-span-4">
            <div className=" bg-Dealer-details bg-cover mt-5 p-5">
            <Grid>
                <div className="col-span-9">
                    <p className="text-sm text-neutral-grey">Account Name</p>
                    <p className="text-2xl text-white">Edward26wilson</p>
                </div>
                <div className="col-span-3 text-end">
                    <Button className='border !border-[#535456] !font-Regular'>Edit</Button>
                </div>
            </Grid>
            <div className="flex">
                <img src="" alt="Address"/>
                <div>
                    <p className="text-sm text-neutral-grey">Address</p>
                    <p className="text-lg text-white">1515 Holcombe Blvd, Houston, TX 77030, USA</p>
                </div>
            </div>
            </div>
        </div>
        <div className="col-span-8"></div>
      </Grid>

    </div>
    
  );
}

export default DealerDetails;
