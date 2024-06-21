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

  const handleRangeChange = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setSelectedRange({
      startDate: startDate > new Date() ? new Date() : startDate,
      endDate: endDate > new Date() ? new Date() : endDate,
    });
  };

  return (
    <>
      <Grid>
        <div className="col-span-12">
          <div className="bg-[#333333] text-white rounded-[20px] p-3 my-4 border-[1px] border-Light-Grey">
            <Grid>
              <div className="col-span-3 self-center">
                <p className="text-xl font-bold">Total sales</p>
                <p className="text-sm">
                  {`Selected Range: ${selectedRange.startDate.toLocaleDateString()} - ${selectedRange.endDate.toLocaleDateString()}`}
                </p>
              </div>
              <div className="col-span-9 self-center">
                <Grid className="!gap-3">
                  <div className="col-span-3 self-center">
                    <Grid className="!gap-2">
                      <div className="col-span-1 self-center">
                        <img src={Administration} alt="Admin" />
                      </div>
                      <div className="col-span-2 self-center">
                        <p className="text-lg font-bold">
                          {formatOrderValue(totalFees?.totalAdminFee)}
                        </p>
                        <p className="text-sm">Total sales</p>
                      </div>
                    </Grid>
                  </div>
                  <div className="col-span-3 self-center">
                    <Grid className="!gap-2">
                      <div className="col-span-1 self-center">
                        <img src={Fronting} alt="Fronting" />
                      </div>
                      <div className="col-span-2 self-center">
                        <p className="text-lg font-bold">
                          {formatOrderValue(totalFees?.totalFrontingFee)}
                        </p>
                        <p className="text-sm">Total Discounts</p>
                      </div>
                    </Grid>
                  </div>
                  <div className="col-span-3 self-center">
                    <Grid className="!gap-2">
                      <div className="col-span-1 self-center">
                        <img src={insurance} alt="Insurance" />
                      </div>
                      <div className="col-span-2 self-center">
                        <p className="text-lg font-bold">
                          {formatOrderValue(totalFees?.totalInsuranceFee)}
                        </p>
                        <p className="text-sm">Tax Amount</p>
                      </div>
                    </Grid>
                  </div>
                  <div className="col-span-3 self-center">
                    <Grid className="!gap-2">
                      <div className="col-span-1 self-center">
                        <img src={Reserves} alt="Reserves" />
                      </div>
                      <div className="col-span-2 self-center">
                        <p className="text-lg font-bold">
                          {formatOrderValue(totalFees?.totalReserveFee)}
                        </p>
                        <p className="text-sm">Total Fees</p>
                      </div>
                    </Grid>
                  </div>
                </Grid>
              </div>
            </Grid>
          </div>
        </div>
        <div className="col-span-12 flex justify-between">
          <p className="text-lg font-bold">Sale Overview</p>
          <Button className="!bg-white !text-black" onClick={openModal}>
            <img src={Broker} className="pr-1 py-1" alt="Filter" />
            <span className="py-1">Filter</span>
          </Button>
        </div>
        <div className="col-span-12 mt-4">
          <LineChart graphData={graphData} />
        </div>
      </Grid>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="flex justify-between">
          <h2 className="text-lg font-bold">Select Date Range</h2>
          <button className="text-lg font-bold" onClick={closeModal}>
            <img src={Cross} alt="Close" />
          </button>
        </div>
        <SelectedDateRangeComponent
          selectedRange={selectedRange}
          onRangeChange={handleRangeChange}
          onApply={handleApply}
        />
      </Modal>
    </>
  );
}

export default All;
