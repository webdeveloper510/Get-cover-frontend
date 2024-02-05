import React, { useEffect, useState } from 'react'
import Headbar from '../../common/headBar'
import { Link } from 'react-router-dom'
import Grid from '../../common/grid'
import ChartComponent from '../../common/chart'
import Button from '../../common/button'
import Input from '../../common/input'
import BarChart from '../../common/barChart'
import drop from '../../assets/images/icons/dropwhite.svg'
import Administration from '../../assets/images/Reporting/Breakdown.svg'
import Fronting from '../../assets/images/Reporting/Fronting.svg'
import insurance from '../../assets/images/Reporting/insurance.svg'
import Reserves from '../../assets/images/Reporting/Reserves.svg'
import Broker from '../../assets/images/Reporting/Broker.svg'
import Select from '../../common/select'

function Dashboard() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isRangeOpen, setIsRangeOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const toggleRange = () => {
        setIsRangeOpen(!isRangeOpen);
    };
    const time = [
        { label: "march 2024", value: true },
        { label: "Inactive", value: false },
    ];
    useEffect(() => {
        console.log("yes")
    })
    return (
        <>
            <div className='my-8 ml-3'>
                <Headbar />
                <div className='flex mt-2'>
                    <div className='pl-3'>
                        <p className='font-bold text-[36px] leading-9	mb-[3px]'>Dashboard</p>
                    </div>
                </div>
                <div className='mt-5'>
                    <Grid>
                        <div className='col-span-3 bg-gradient-to-r from-[#000000] cursor-pointer to-[#333333] text-white rounded-xl p-8'>
                            <p className='text-2xl font-bold'>6,359</p>
                            <p className='text-[#999999] text-sm'>Total Number of Orders</p>
                        </div>
                        <div className='col-span-3 bg-gradient-to-r from-[#000000] to-[#333333] cursor-pointer text-white rounded-xl p-8'>
                            <p className='text-2xl font-bold'>$96,859.00</p>
                            <p className='text-[#999999] text-sm'>Total Value of Orders</p>
                        </div>
                        <div className='col-span-3 bg-gradient-to-r from-[#000000] to-[#333333] cursor-pointer text-white rounded-xl p-8'>
                            <p className='text-2xl font-bold'>6,359</p>
                            <p className='text-[#999999] text-sm'>Total Number of Claims</p>
                        </div>
                        <div className='col-span-3 bg-gradient-to-r from-[#000000] to-[#333333] cursor-pointer text-white rounded-xl p-8'>
                            <p className='text-2xl font-bold'>$35,859.00</p>
                            <p className='text-[#999999] text-sm'>Total Value of Claims</p>
                        </div>
                    </Grid>
                    <Grid>
                        <div className='col-span-12'>
                            <div className="bg-[#333333] text-white rounded-[20px] p-3 my-4 border-[1px] border-[#D1D1D1]">
                                <Grid>
                                    <div className='col-span-3 self-center'>
                                        <p className='text-xl font-bold'>Total Order Value <span className='text-sm font-normal'> Monthly </span></p>
                                    </div>
                                    <div className='col-span-9 self-center'>
                                        <Grid className='!grid-cols-9 !gap-1'>
                                            <div className='col-span-3 text-right'>
                                                <Button className='!bg-[#FFFFFF2B] !text-white !text-[11px] !rounded-xl'>Compare Years by Month</Button>
                                            </div>
                                            <div className='col-span-2 text-center'>
                                                <Button className='!bg-[#FFFFFF2B] !text-white !text-[11px] ml-1 !rounded-xl'>Year To Date</Button>
                                            </div>
                                            <div className='col-span-2'>
                                                <div className='flex border border-white px-2 py-1 h-full rounded-xl justify-between relative'>
                                                    <div className='flex justify-between w-full cursor-pointer' onClick={toggleDropdown}>
                                                        <p className='self-center text-[13px]'>
                                                            Period
                                                        </p>
                                                        <img src={drop} className='w-4 h-4 self-center justify-end' alt='drop' />
                                                    </div>
                                                    {isDropdownOpen && (
                                                        <div className='absolute top-8 w-full text-center '>
                                                            <div className='bg-[#fff] text-light-black border rounded-xl py-2 px-4'>
                                                                <p className='font-semibold border-b'>Period</p>
                                                                <p className='border-b'>Days</p>
                                                                <p>Monthly</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className='col-span-2'>
                                                <div className='flex border border-white px-2 py-1 h-full rounded-xl justify-between relative'>
                                                    <div className='flex justify-between w-full cursor-pointer ' onClick={toggleRange}>
                                                        <p className='self-center text-[13px] '>
                                                            Date Range
                                                        </p>
                                                        <img src={drop} className='w-4 h-4 self-center' alt='drop' />
                                                    </div>
                                                    {isRangeOpen && (
                                                        <div className='absolute top-10 w-full right-[100%]'>
                                                            <div className='bg-[#fff] w-[350px] p-3 text-light-black border rounded-xl py-2 px-4'>
                                                                <p className='font-semibold text-base border-b pb-2 mb-3'>Date Range</p>
                                                                <Grid>
                                                                    <div className='col-span-6'>
                                                                        <Input type='date' />
                                                                    </div>
                                                                    <div className='col-span-6'>
                                                                        <Input type='date' />
                                                                    </div>
                                                                </Grid>
                                                                <div className='mt-4'>
                                                                    <Button>Show Results</Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Grid>
                                    </div>
                                </Grid>

                                <BarChart />
                            </div>
                        </div>
                    </Grid>
                    <div className="bg-[#fff] rounded-[20px] p-3 my-4 border-[1px] border-[#D1D1D1]">
                        <Grid>
                            <div className='col-span-2 my-3'>
                                <Select
                                    label=""
                                    name="state"
                                    placeholder=""
                                    className="!bg-white"
                                    className1='!p-1'
                                    options={time}
                                />
                            </div>
                        </Grid>
                        <Grid className='!grid-cols-5'>
                            <div className='col-span-1 border-r bg-gradient-to-t from-[#FFFFFF00] via-[#AAAAAA] to-[#FFFFFF00] pr-[1px]'>
                                <div className='bg-white pl-2'>
                                    <div className='flex mb-4'>
                                        <img src={Administration} alt='Administration' />
                                        <p className='text-sm font-bold self-center pl-3'>Breakdown for Administration</p>
                                    </div>
                                    <div>
                                        <p className='text-3xl font-bold'>$5666159.00</p>
                                        <p className='text-base opacity-50 font-normal'>$10,000.00</p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-span-1 border-r bg-gradient-to-t from-[#FFFFFF00] via-[#AAAAAA] to-[#FFFFFF00] pr-[1px]'>
                                <div className='bg-white pl-4'>
                                    <div className='flex mb-4'>
                                        <img src={Fronting} alt='Administration' />
                                        <p className='text-sm font-bold self-center pl-3'>Fronting <br /> Fees</p>
                                    </div>
                                    <div>
                                        <p className='text-3xl font-bold'>$232159.00</p>
                                        <p className='text-base opacity-50 font-normal'>$10,000.00</p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-span-1 border-r bg-gradient-to-t from-[#FFFFFF00] via-[#AAAAAA] to-[#FFFFFF00] pr-[1px]'>
                                <div className='bg-white pl-4'>
                                    <div className='flex mb-4'>
                                        <img src={insurance} alt='Administration' />
                                        <p className='text-sm font-bold self-center pl-3'>Re-insurance Premium</p>
                                    </div>
                                    <div>
                                        <p className='text-3xl font-bold'>$1523239.00</p>
                                        <p className='text-base opacity-50 font-normal'>$10,000.00</p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-span-1 border-r bg-gradient-to-t from-[#FFFFFF00] via-[#AAAAAA] to-[#FFFFFF00] pr-[1px]'>
                                <div className='bg-white pl-3'>
                                    <div className='flex mb-4'>
                                        <img src={Reserves} alt='Administration' />
                                        <p className='text-sm font-bold self-center pl-3'>Reserves Future Claims</p>
                                    </div>
                                    <div>
                                        <p className='text-3xl font-bold'>$123259.00</p>
                                        <p className='text-base opacity-50 font-normal'>$10,000.00</p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-span-1 pl-5'>
                                <div className='flex mb-4'>
                                    <img src={Broker} alt='Administration' />
                                    <p className='text-sm font-bold self-center pl-3'>Broker <br /> Fees</p>
                                </div>
                                <div>
                                    <p className='text-3xl font-bold'>$1552369.00</p>
                                    <p className='text-base opacity-50 font-normal'>$10,000.00</p>
                                </div>
                            </div>
                        </Grid>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard