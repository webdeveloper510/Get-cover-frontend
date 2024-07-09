import React, { useState } from "react";
import Grid from "../../../../common/grid";
import Button from "../../../../common/button";
import Cross from "../../../../assets/images/Cross.png";
import LineChart from "../../../../common/lineChart";
import Modal from "../../../../common/model";
import SelectedDateRangeComponent from "../../../../common/dateFilter";
function PaidClaim() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 14)),
    endDate: new Date(),
  });
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
    console.log(diffDays < 30);
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
      <Grid className="mt-3">
        <div className="col-span-12">
          <div className="bg-light-black text-white rounded-[20px] p-3 my-4 border-[1px] border-Light-Grey">
            <Grid className="!gap-1">
              <div className="col-span-6 self-center">
                <p className="text-xl font-bold">Total Claims Count</p>
              </div>
              <div className="col-span-6 self-center flex ml-auto">
                <p className="text-sm self-center mr-5">
                  {`Selected Range: ${selectedRange.startDate.toLocaleDateString()} - ${selectedRange.endDate.toLocaleDateString()}`}
                </p>
                <Button className="!bg-white !text-black" onClick={openModal}>
                  {/* <img src={Broker} className="pr-1 py-1" alt="Filter" /> */}
                  <span className="py-1">Date Filter</span>
                </Button>
              </div>

              <div className="col-span-12">
                <LineChart data={{}} />
              </div>
            </Grid>
          </div>
        </div>
      </Grid>

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

export default PaidClaim;
