import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom";
import ContractSummary from './ContractDetails/contractSummery';
import ContractClaim from './ContractDetails/contractClaim';
import orderSummary from "../../../assets/images/order/orderSummary.svg";
import contract from "../../../assets/images/order/Contracts.svg";
import Purchase from "../../../assets/images/order/Purchase.svg";
import Coverage from "../../../assets/images/order/Coverage.svg";
import Cross from "../../../assets/images/Cross.png";
import DealerList from "../../../assets/images/icons/dealerList.svg";
import CoverageType from "../../../assets/images/order/CoverageType.svg";
import contractActive from "../../../assets/images/order/ContractsActive.svg";
import orderActive from "../../../assets/images/order/orderSummaryActive.svg";
import category1 from "../../../assets/images/contract/OrderID.svg";
import Name from "../../../assets/images/order/Name.svg";
import BackImage from "../../../assets/images/icons/backArrow.svg";
import { RotateLoader } from 'react-spinners';
import Headbar from '../../../common/headBar';
import Grid from '../../../common/grid';
import SingleView from '../../../common/singleView';
import { getContractValues } from '../../../services/extraServices';
import Button from '../../../common/button';
import InActiveButton from '../../../common/inActiveButton';
function ContractSingleView() {
    const [loading, setLoading] = useState(false);
    const [contractDetails, setContractDetails] = useState({});
    const getInitialActiveTab = () => {
        const storedTab = localStorage.getItem("contractMenu");
        return storedTab ? storedTab : "Contract Summary";
    };
    const { contractId } = useParams();
    const [activeTab, setActiveTab] = useState(getInitialActiveTab);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        getcontractDetails();
        localStorage.setItem("contractMenu", activeTab);
        setLoading(false);
    }, [activeTab]);

    const tabs = [
        {
            id: "Contract Summary",
            label: "Contract Summary",
            icons: orderSummary,
            Activeicons: orderActive,
            content: activeTab === "Contract Summary" && (
                <ContractSummary
                    data={contractDetails}
                />
            ),
        },
        {
            id: "Contract Claims",
            label: "Contract Claims",
            icons: contract,
            Activeicons: contractActive,
            content: activeTab === "Contract Claims" && (
                <ContractClaim />
            ),
        },
    ];
    const handleGOBack = () => {
        localStorage.removeItem("orderMenu");
        navigate(-1);
    };

    const getcontractDetails = async (showLoader) => {
        if (!showLoader) {
            setLoading(true);
        }
        const result = await getContractValues(contractId);
        if (result.code == 200) {
            setContractDetails(result.result);
            console.log(result);
        }
        else {
            navigate(`/`);
        }
        setLoading(false);
    };

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    const InactiveTabButton = ({ tab, onClick }) => (
        <InActiveButton
            className="flex self-center mr-2 w-[95%] !px-2 !py-1 rounded-xl border-[1px] border-Light-Grey "
            onClick={onClick}
        >
            <div
                style={{
                    maskImage: `url(${tab.icons})`,
                    WebkitMaskImage: `url(${tab.icons})`,
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                }}
                className="self-center pr-1 py-1 h-4 w-4"
            />
            <span
                style={{
                    borderLeftWidth: "1px",
                    paddingLeft: "7px",
                }}
                className="ml-1 py-1 text-sm font-Regular"
            >
                {tab.label}
            </span>
        </InActiveButton>
    );

    // ActiveTabButton Component
    const ActiveTabButton = ({ tab, onClick }) => (
        <Button
            className="flex self-center mr-2 w-[95%] !px-2 !py-1 rounded-xl border-[1px] border-Light-Grey"
            onClick={onClick}
        >
            <div
                style={{
                    maskImage: `url(${tab.Activeicons})`,
                    WebkitMaskImage: `url(${tab.Activeicons})`,
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                }}
                className="self-center pr-1 py-1 h-4 w-4"
            />
            <span
                style={{
                    borderLeftWidth: "1px",
                    paddingLeft: "7px",
                }}
                className="ml-1 py-1 text-sm font-Regular"
            >
                {tab.label}
            </span>
        </Button>
    );

    return (
        <>
            {loading && (
                <div className=" fixed z-[999999] bg-[#333333c7] backdrop-blur-xl  h-screen w-full flex py-5">
                    <div className="self-center mx-auto">
                        <RotateLoader color="#fff" />
                    </div>
                </div>
            )}
            <div className="py-8 pl-3 relative ">
                <Headbar />
                <div className="flex">
                    <Link
                        onClick={handleGOBack}
                        className="h-[60px] w-[60px] flex border-[1px] bg-white border-Light-Grey rounded-[25px]"
                    >
                        <img
                            src={BackImage}
                            className="m-auto my-auto self-center bg-white"
                            alt="BackImage"
                        />
                    </Link>
                    <div className="pl-3">
                        <p className="font-bold text-[36px] leading-9 mb-[3px]">
                            Contract Details
                        </p>
                        <ul className="flex self-center">
                            <li className="text-sm  font-Regular">
                                <Link to={"/"}>Home / </Link>
                            </li>
                            <li className="text-sm  font-Regular pl-2">
                                <Link to={"/orderList"}>Contract List / </Link>
                            </li>
                            <li className="text-sm  font-semibold ml-1 pt-[1px]">
                                {activeTab}
                            </li>
                        </ul>
                    </div>
                </div>

                <Grid className="!grid-cols-4 mt-5">
                    <div className="col-span-1 max-h-[85vh] overflow-y-scroll">
                        <SingleView className="p-5 rounded-[20px]">
                            <Grid>
                                <div className="col-span-9">
                                    <p className="text-sm font-Regular">
                                        Contract ID
                                    </p>
                                    <p className="text-xl font-semibold">
                                        {" "}
                                        {contractDetails.unique_key}{" "}
                                    </p>
                                </div>
                                <div className="col-span-3 text-end"></div>
                            </Grid>
                            <div className="flex my-4">
                                <div className="relative">
                                    <img
                                        src={category1}
                                        className="mr-3 bg-Onyx rounded-[14px]"
                                        alt="Name"
                                    />
                                    <Link to={`/orderDetails/${contractDetails.orderId}`}>
                                        {" "}
                                        <img
                                            src={DealerList}
                                            className="mr-3 bg-Onyx cursor-pointer rounded-[14px] absolute top-3 -right-2"
                                            alt="DealerList"
                                        />{" "}
                                    </Link>
                                </div>
                                <div className="w-[75%]">
                                    <p className="text-sm font-Regular">
                                        Order ID
                                    </p>
                                    <p className="text-base font-semibold ">
                                        {contractDetails?.orderUniqueKey}
                                    </p>
                                </div>
                            </div>
                            <div className="flex my-4">
                                <img
                                    src={Purchase}
                                    className="mr-3 bg-Onyx rounded-[14px] my-auto"
                                    alt="Purchase"
                                />
                                <div>
                                    <p className="text-sm font-Regular mt-2">
                                        Dealer Purchase Order
                                    </p>
                                    <p className="text-base font-semibold leading-5 break-words w-[92%]">
                                        {contractDetails.venderOrder}
                                    </p>
                                </div>
                            </div>
                            <Grid className='!grid-cols-1 gap-2'>
                                <div className="flex w-full">
                                    <img
                                        src={Purchase}
                                        className="mr-3 bg-Onyx rounded-[14px] my-auto"
                                        alt="Purchase"
                                    />
                                    <div className='w-full self-center'>
                                        <p className="text-sm font-Regular">
                                            Status
                                        </p>
                                        <p className="text-base font-semibold leading-5 break-words w-[92%]">
                                            {contractDetails.status}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex my-4 w-full">
                                    <img
                                        src={Purchase}
                                        className="mr-3 bg-Onyx rounded-[14px] my-auto"
                                        alt="Purchase"
                                    />
                                    <div className='w-full'>
                                        <p className="text-sm font-Regular mt-2">
                                            Eligibility
                                        </p>
                                        <p className="text-base font-semibold leading-5 break-words w-[92%]">
                                            {contractDetails.eligibilty === false ? 'Not eligibilty' : 'eligibilty'}
                                        </p>
                                    </div>
                                </div>
                            </Grid>


                            <div className="flex mb-4">
                                <div className="relative">
                                    <img
                                        src={Name}
                                        className="mr-3 bg-Onyx rounded-[14px]"
                                        alt="Name"
                                    />
                                    <Link to={`/dealerDetails/${contractDetails.order?.[0]?.dealerId}`}>
                                        {" "}
                                        <img
                                            src={DealerList}
                                            className="mr-3 bg-Onyx cursor-pointer rounded-[14px] absolute top-3 -right-2"
                                            alt="DealerList"
                                        />{" "}
                                    </Link>
                                </div>
                                <div className="w-[75%]">
                                    <p className="text-sm font-Regular">
                                        Dealer Name
                                    </p>
                                    <p className="text-base font-semibold ">
                                        {contractDetails?.order?.[0]?.dealer?.[0]?.name}
                                    </p>
                                </div>
                            </div>
                            <div className="flex mb-4">
                                <div className="relative">
                                    <img
                                        src={Name}
                                        className="mr-3 bg-Onyx rounded-[14px]"
                                        alt="Name"
                                    />
                                    <Link to={`/resellerDetails/${contractDetails.order?.[0]?.resellerId}`}>
                                        {" "}
                                        <img
                                            src={DealerList}
                                            className="mr-3 bg-Onyx cursor-pointer rounded-[14px] absolute top-3 -right-2"
                                            alt="DealerList"
                                        />{" "}
                                    </Link>
                                </div>
                                <div className="w-[75%]">
                                    <p className="text-sm font-Regular">
                                        Reseller Name
                                    </p>
                                    <p className="text-base font-semibold ">
                                        {contractDetails?.order?.[0]?.reseller?.[0]?.name}
                                    </p>
                                </div>
                            </div>
                            <div className="flex mb-4">
                                <div className="relative">
                                    <img
                                        src={Name}
                                        className="mr-3 bg-Onyx rounded-[14px]"
                                        alt="Name"
                                    />
                                    <Link to={`/servicerDetails/${contractDetails.order?.[0]?.servicerId}`}>
                                        {" "}
                                        <img
                                            src={DealerList}
                                            className="mr-3 bg-Onyx cursor-pointer rounded-[14px] absolute top-3 -right-2"
                                            alt="DealerList"
                                        />{" "}
                                    </Link>
                                </div>
                                <div className="w-[75%]">
                                    <p className="text-sm font-Regular">
                                        Servicer Name
                                    </p>
                                    <p className="text-base font-semibold ">
                                        {contractDetails?.order?.[0]?.servicer?.[0]?.name}
                                    </p>
                                </div>
                            </div>
                            <div className="flex mb-4">
                                <div className="relative">
                                    <img
                                        src={Name}
                                        className="mr-3 bg-Onyx rounded-[14px]"
                                        alt="Name"
                                    />
                                    <Link to={`/customerDetails/${contractDetails.order?.[0]?.customerId}`}>
                                        {" "}
                                        <img
                                            src={DealerList}
                                            className="mr-3 bg-Onyx cursor-pointer rounded-[14px] absolute top-3 -right-2"
                                            alt="DealerList"
                                        />{" "}
                                    </Link>
                                </div>
                                <div className="w-[75%]">
                                    <p className="text-sm font-Regular">
                                        Customer Name
                                    </p>
                                    <p className="text-base font-semibold ">
                                        {contractDetails?.order?.[0]?.customer?.[0]?.username}
                                    </p>
                                </div>
                            </div>
                        </SingleView>
                    </div>
                    <div className="col-span-3 max-h-[85vh] pr-3 overflow-y-scroll">
                        <Grid className="">
                            <div className="col-span-5">
                                <div className="!rounded-[30px] px-2 py-3  border-[1px] border-Light-Grey">
                                    <Grid className="!grid-cols-2 !gap-1">
                                        {tabs.map((tab) =>
                                            activeTab === tab.id ? (
                                                <ActiveTabButton key={tab.id} tab={tab} onClick={() => handleTabClick(tab.id)} />
                                            ) : (
                                                <InactiveTabButton key={tab.id} tab={tab} onClick={() => handleTabClick(tab.id)} />
                                            )
                                        )}
                                    </Grid>
                                </div>
                            </div>
                        </Grid>

                        {tabs.map((tab) => (
                            <div
                                key={tab.id}
                                className={`${activeTab !== tab.id ? "hidden" : "pb-20"}`}
                            >
                                {tab.content}
                            </div>
                        ))}
                    </div>
                </Grid >
            </div >
        </>
    )
}

export default ContractSingleView
