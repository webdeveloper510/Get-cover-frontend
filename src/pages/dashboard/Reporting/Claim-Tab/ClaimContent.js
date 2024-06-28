import React, { useEffect, useState } from "react";
import Grid from "../../../../common/grid";
import Button from "../../../../common/button";
import Cross from "../../../../assets/images/Cross.png";
import LineChart from "../../../../common/lineChart";
import Modal from "../../../../common/model";
import SelectedDateRangeComponent from "../../../../common/dateFilter";
import { getAllClaims } from "../../../../services/reportingServices";

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

    getDatasetAtEvent(data);
    setIsModalOpen(false);
  };

  useEffect(() => {
    // setLoading(true);
    getDatasetAtEvent({
      startDate: selectedRange.startDate.toISOString().split("T")[0],
      endDate: selectedRange.endDate.toISOString().split("T")[0],
      dealerId: "",
      priceBookId: [],
      categoryId: [],
      flag: "daily",
    });
    // setLoading(false);
  }, [selectedRange, activeTab]);

  const getDatasetAtEvent = async (data) => {
    console.log(activeTab);

    try {
      const res = await getAllClaims(data);
      let filteredGraphData;
      if (activeTab === "Amount") {
        filteredGraphData = res.result.graphData.map((item) => {
          const { total_claim, total_paid_claim, total_unpaid_claim, ...rest } =
            item;
          console.log(rest);
          return rest;
        });
      } else {
        filteredGraphData = res.result.graphData.map((item) => {
          return {
            weekStart: item.weekStart,
            total_claim: item.total_claim,
            total_paid_claim: item.total_paid_claim,
            total_unpaid_claim: item.total_unpaid_claim,
          };
        });
      }
      console.log(filteredGraphData);
      setGraphData(filteredGraphData);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
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
  const handleRangeChange = (ranges) => {
    const { startDate, endDate } = ranges.selection;

    if (isValidDateRange(startDate, endDate)) {
      setSelectedRange({
        startDate: startDate > new Date() ? new Date() : startDate,
        endDate: endDate > new Date() ? new Date() : endDate,
      });
    } else {
      alert("Date range cannot exceed one year.");
    }
  };
  return (
    <>
      <Grid className="mt-3">
        <div className="col-span-12">
          <div className="bg-[#333333] text-white rounded-[20px] p-3 my-4 border-[1px] border-Light-Grey">
            <Grid className="!gap-4">
              <div className="col-span-5 mb-2">
                <h3 className="text-base font-semibold">
                  {activeTab === "Amount"
                    ? "Claims Amount Data"
                    : "Claims Count Data"}
                </h3>
              </div>
              <div className="col-span-7 justify-end flex">
                <p className="pr-4 self-center">
                  {`Selected Range: ${selectedRange.startDate.toLocaleDateString()} - ${selectedRange.endDate.toLocaleDateString()}`}
                </p>
                <Button
                  className="!bg-white border-[1px] text-[#333] font-normal py-2 border-Light-Grey"
                  onClick={openModal}
                >
                  Date Filter
                </Button>
              </div>
              <div className="col-span-12">
                <LineChart graphData={graphData} />
              </div>
            </Grid>
          </div>
        </div>
      </Grid>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Date Range Filter"
        className="rounded-[20px] w-[72vw]"
        mainClassName="rounded-[20px] w-[72vw]"
        crossIcon={Cross}
      >
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

export default ClaimContent;
