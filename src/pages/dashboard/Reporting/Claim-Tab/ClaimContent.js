import React, { useState } from "react";
import Grid from "../../../../common/grid";
import Button from "../../../../common/button";
import Cross from "../../../../assets/images/Cross.png";
import LineChart from "../../../../common/lineChart";
import Modal from "../../../../common/model";
import SelectedDateRangeComponent from "../../../../common/dateFilter";

function ClaimContent({ activeTab, selectedRange, setSelectedRange }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [graphData, setGraphData] = useState([]);

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
    if (diffDays < 30) {
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

    // getDatasetAtEvent(data);
    setIsModalOpen(false);
  };

  const isValidDateRange = (startDate, endDate) => {
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    return endDate - startDate <= oneYear;
  };

  const handleDateChange = (startDate, endDate) => {
    if (isValidDateRange(startDate, endDate)) {
      setSelectedRange({ startDate, endDate });
    } else {
      alert("Date range cannot exceed one year.");
    }
  };

  return (
    <>
      <div className="col-span-4 self-center pl-3">
        <Button
          className="!bg-white border-[1px] text-[#2A2A2A] font-normal py-2 w-full border-Light-Grey"
          onClick={openModal}
        >
          {`${selectedRange.startDate.toISOString().split("T")[0]} to ${
            selectedRange.endDate.toISOString().split("T")[0]
          }`}
        </Button>
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Date Range Filter"
          className="rounded-[20px]"
          mainClassName="rounded-[20px]"
          crossIcon={Cross}
        >
          <SelectedDateRangeComponent
            selectedRange={selectedRange}
            handleDateChange={handleDateChange}
          />
          <Button
            className="border-[#2A2A2A] !text-[#2A2A2A] border-[1px] mt-8"
            onClick={handleApply}
          >
            Apply
          </Button>
        </Modal>
      </div>
      <Grid className="!gap-4 mt-4">
        <div className="col-span-5 bg-white rounded-[24px] p-3 border-[1px] border-Light-Grey">
          <Grid className="!gap-4">
            <div className="col-span-5 mb-2">
              <h3 className="text-base font-semibold">
                {activeTab === "Amount"
                  ? "Claims Amount Data"
                  : "Claims Count Data"}
              </h3>
            </div>
            <div className="col-span-5">
              <LineChart
                data={graphData}
                xAxisKey="date"
                lineKey={activeTab === "Amount" ? "amount" : "count"}
              />
            </div>
          </Grid>
        </div>
      </Grid>
    </>
  );
}

export default ClaimContent;
