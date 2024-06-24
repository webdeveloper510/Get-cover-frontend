import React, { useEffect, useState } from "react";
import Grid from "../../../../common/grid";
import Administration from "../../../../assets/images/Administration.png";
import Fronting from "../../../../assets/images/Fronting.png";
import insurance from "../../../../assets/images/Re-insurance.png";
import Reserves from "../../../../assets/images/Reserves.png";
import Broker from "../../../../assets/images/Broker.png";
import Button from "../../../../common/button";
import SelectedDateRangeComponent from "../../../../common/dateFilter";
import Modal from "../../../../common/model";
import Cross from "../../../../assets/images/Cross.png";
import LineChart from "../../../../common/lineChart";
import { getAllSales } from "../../../../services/reportingServices";

function All({ activeTab }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 14)), // 2 weeks ago
    endDate: new Date(),
  });
  const [graphData, setGraphData] = useState([]);
  const [totalFees, setTotalFees] = useState({});

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const formatOrderValue = (orderValue) => {
    if (Math.abs(orderValue) >= 1e6) {
      return (orderValue / 1e6).toFixed(2) + "M";
    } else {
      return orderValue?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  };

  const handleApply = () => {
    const { startDate, endDate } = selectedRange;

    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let flag = "daily";
    if (diffDays > 30) {
      flag = "daily";
    } else {
      flag = "weekly";
    }

    let data = {
      startDate: startDateStr,
      endDate: endDateStr,
      dealerId: "",
      priceBookId: [],
      categoryId: [],
      flag: flag,
    };

    getDatasetAtEvent(data);
    setIsModalOpen(false);
  };

  useEffect(() => {
    getDatasetAtEvent({
      startDate: selectedRange.startDate.toISOString().split("T")[0],
      endDate: selectedRange.endDate.toISOString().split("T")[0],
      dealerId: "",
      priceBookId: [],
      categoryId: [],
      flag: "daily",
    });
  }, [selectedRange, activeTab]);

  const getDatasetAtEvent = async (data) => {
    try {
      const res = await getAllSales(data);
      console.log(res.result.graphData);
      setGraphData(res.result.graphData);
      setTotalFees(res.result.totalFees);
      console.log(res);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };
  const isValidDateRange = (startDate, endDate) => {
    const oneYear = 365 * 24 * 60 * 60 * 1000; // milliseconds in a year
    return endDate - startDate <= oneYear;
  };
  const handleRangeChange = (ranges) => {
    const { startDate, endDate } = ranges.selection;

    if (isValidDateRange(startDate, endDate)) {
      setSelectedRange({
        startDate: startDate > new Date() ? new Date() : startDate,
        endDate: endDate > new Date() ? new Date() : endDate,
      });
    } else {
      alert("Selected date range should not exceed 365 days.");
    }
  };

  return (
    <>
      <Grid>
        <div className="col-span-12">
          <div className="bg-[#333333] text-white rounded-[20px] p-3 my-4 border-[1px] border-Light-Grey">
            <Grid>
              <div className="col-span-6 self-center">
                <p className="text-xl font-bold">Total sales</p>
              </div>
              <div className="col-span-6 self-center flex ml-auto">
                <p className="text-sm self-center mr-5">
                  {`Selected Range: ${selectedRange.startDate.toLocaleDateString()} - ${selectedRange.endDate.toLocaleDateString()}`}
                </p>
                <Button className="!bg-white !text-black" onClick={openModal}>
                  {/* <img src={Broker} className="pr-1 py-1" alt="Filter" /> */}
                  <span className="py-1">Filter</span>
                </Button>
              </div>

              <div className="col-span-12 mt-4">
                <LineChart graphData={graphData} />
              </div>
            </Grid>
          </div>
        </div>
      </Grid>

      <div className="bg-white rounded-[20px] p-3 my-4 border-[1px] border-Light-Grey">
        <Grid className="!grid-cols-5">
          <div className="col-span-1 border-r bg-gradient-to-t from-[#FFFFFF00] via-[#AAAAAA] to-[#FFFFFF00] pr-[1px]">
            <div className="bg-white h-full px-2">
              <div className="flex w-full justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold">
                    $
                    {totalFees?.total_admin_fee === undefined
                      ? parseInt(0).toLocaleString(2)
                      : formatOrderValue(
                          totalFees?.total_admin_fee ?? parseInt(0)
                        )}
                  </p>
                  <p className="text-sm text-neutral-grey font-bold self-center">
                    Administration <br /> Fees
                  </p>
                </div>
                <div>
                  <img
                    src={Administration}
                    className="w-[55px]"
                    alt="Administration"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 border-r bg-gradient-to-t from-[#FFFFFF00] via-[#AAAAAA] to-[#FFFFFF00] pr-[1px]">
            <div className="bg-white h-full px-2">
              <div className="flex w-full justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold">
                    $
                    {totalFees?.total_fronting_fee === undefined
                      ? parseInt(0).toLocaleString(2)
                      : formatOrderValue(
                          totalFees?.total_fronting_fee ?? parseInt(0)
                        )}
                  </p>
                  <p className="text-sm font-bold text-neutral-grey self-center">
                    Fronting <br /> Fees
                  </p>
                </div>
                <div>
                  <img
                    src={Fronting}
                    className="w-[55px]"
                    alt="Administration"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 border-r bg-gradient-to-t from-[#FFFFFF00] via-[#AAAAAA] to-[#FFFFFF00] pr-[1px]">
            <div className="bg-white h-full px-2">
              <div className="flex w-full justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold">
                    $
                    {totalFees?.total_reinsurance_fee === undefined
                      ? parseInt(0).toLocaleString(2)
                      : formatOrderValue(
                          totalFees?.total_reinsurance_fee ?? parseInt(0)
                        )}
                  </p>
                  <p className="text-sm font-bold text-neutral-grey self-center">
                    Re-insurance <br /> Fees
                  </p>
                </div>
                <div>
                  <img
                    src={insurance}
                    className="w-[55px]"
                    alt="Administration"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 border-r bg-gradient-to-t from-[#FFFFFF00] via-[#AAAAAA] to-[#FFFFFF00] pr-[1px]">
            <div className="bg-white h-full px-2">
              <div className="flex w-full justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold">
                    $
                    {totalFees?.total_reserve_future_fee === undefined
                      ? parseInt(0).toLocaleString(2)
                      : formatOrderValue(
                          totalFees?.total_reserve_future_fee ?? parseInt(0)
                        )}
                  </p>
                  <p className="text-sm font-bold text-neutral-grey self-center">
                    Reserves Future <br /> Claims
                  </p>
                </div>
                <div>
                  <img
                    src={Reserves}
                    className="w-[55px]"
                    alt="Administration"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 h-full px-2">
            <div className="flex w-full justify-between mb-4">
              <div>
                <p className="text-2xl font-bold">
                  $
                  {totalFees?.total_broker_fee === undefined
                    ? parseInt(0).toLocaleString(2)
                    : formatOrderValue(
                        totalFees?.total_broker_fee ?? parseInt(0)
                      )}
                </p>
                <p className="text-sm font-bold text-neutral-grey self-center">
                  Broker <br /> Fees
                </p>
              </div>
              <div>
                <img src={Broker} className="w-[55px]" alt="Administration" />
              </div>
            </div>
          </div>
        </Grid>
      </div>

      <Modal isOpen={isModalOpen} className="w-[72vw]" onClose={closeModal}>
        <Button
          onClick={closeModal}
          className="absolute right-[-13px] z-10 top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-Granite-Gray"
        >
          <img
            src={Cross}
            className="w-full h-full text-black rounded-full p-0"
          />
        </Button>
        <SelectedDateRangeComponent
          selectedRange={selectedRange}
          onRangeChange={handleRangeChange}
          onApply={handleApply}
        />
        <div className="flex justify-end mb-4">
          <Button onClick={closeModal} className="mr-3">
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </Modal>
    </>
  );
}

export default All;
