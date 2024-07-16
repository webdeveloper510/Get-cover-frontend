import React, { useEffect, useState } from "react";
import Grid from "../../../../common/grid";
import Button from "../../../../common/button";
import Cross from "../../../../assets/images/Cross.png";
import LineChart from "../../../../common/lineChart";
import Modal from "../../../../common/model";
import SelectedDateRangeComponent from "../../../../common/dateFilter";
import { getAllClaims } from "../../../../services/reportingServices";
import { useMyContext } from "../../../../context/context";
import { useLocation } from "react-router-dom";

function ClaimContent({
  activeTab,
  selectedRange,
  setSelectedRange,
  activeButton,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [graphDataCount, setGraphDataCount] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [flag, setFlag] = useState("daily");
  const location = useLocation();
  const isServicerClaims = location.pathname.includes("/servicer/claims");
  const isResellerClaims = location.pathname.includes("/reseller/claim");

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const {
    filtersClaimCategory,
    filtersClaimServicer,
    filtersClaimDealer,
    flag1,
    toggleFilterFlag,
  } = useMyContext();

  const openModal = () => {
    setIsModalOpen(true);
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
    setFlag(flag);

    let dealerId = "";
    let categoryId = "";
    let servicerId = "";
    let priceBookId = [];

    if (activeButton === "dealer") {
      dealerId = filtersClaimDealer.dealerId;
      categoryId = filtersClaimDealer.categoryId;
      priceBookId = filtersClaimDealer.priceBookId;
      servicerId = filtersClaimDealer.servicerId;
    } else if (activeButton === "servicer") {
      dealerId = filtersClaimServicer.dealerId;
      categoryId = filtersClaimServicer.categoryId;
      priceBookId = filtersClaimServicer.priceBookId;
      servicerId = filtersClaimServicer.servicerId;
    } else if (activeButton === "category") {
      dealerId = filtersClaimCategory.dealerId;
      categoryId = filtersClaimCategory.categoryId;
      priceBookId = filtersClaimCategory.priceBookId;
      servicerId = filtersClaimCategory.servicerId;
    }

    let data = {
      startDate: startDateStr,
      endDate: endDateStr,
      dealerId: dealerId,
      priceBookId: priceBookId,
      categoryId: categoryId,
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
      flag: flag,
    });
  }, [selectedRange]);

  useEffect(() => {
    if (flag1) {
      getDatasetAtEvent({
        startDate: selectedRange.startDate.toISOString().split("T")[0],
        endDate: selectedRange.endDate.toISOString().split("T")[0],
        primary: activeButton,
        flag: flag,
      });
    }
  }, [flag1]);

  const getDatasetAtEvent = async (value) => {
    let dealerId = "";
    let categoryId = "";
    let servicerId = "";
    let priceBookId = [];

    if (activeButton === "dealer") {
      dealerId = filtersClaimDealer.dealerId;
      categoryId = filtersClaimDealer.categoryId;
      priceBookId = filtersClaimDealer.priceBookId;
      servicerId = filtersClaimDealer.servicerId;
    } else if (activeButton === "servicer") {
      dealerId = filtersClaimServicer.dealerId;
      categoryId = filtersClaimServicer.categoryId;
      priceBookId = filtersClaimServicer.priceBookId;
      servicerId = filtersClaimServicer.servicerId;
    } else if (activeButton === "category") {
      dealerId = filtersClaimCategory.dealerId;
      categoryId = filtersClaimCategory.categoryId;
      priceBookId = filtersClaimCategory.priceBookId;
      servicerId = filtersClaimCategory.servicerId;
    }

    let data = {
      startDate: value.startDate,
      endDate: value.endDate,
      dealerId: dealerId,
      priceBookId: priceBookId,
      categoryId: categoryId,
      servicerId: servicerId,
      primary: activeButton,
      flag: flag,
    };
    try {
      const res = await getAllClaims(
        data,
        isResellerClaims
          ? "resellerPortal"
          : isServicerClaims
          ? "servicerPortal"
          : "user"
      );
      const amountData = res?.result?.graphData?.map((item) => {
        const {
          total_claim,
          total_paid_claim,
          total_unpaid_claim,
          total_rejected_claim,
          ...rest
        } = item;
        return rest;
      });

      const countData = res?.result?.graphData?.map((item) => {
        return {
          weekStart: item.weekStart,
          total_claim: item.total_claim,
          total_paid_claim: item.total_paid_claim,
          total_unpaid_claim: item.total_unpaid_claim,
          total_rejected_claim: item.total_rejected_claim,
        };
      });

      toggleFilterFlag();
      setGraphData(amountData);
      setGraphDataCount(countData);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
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
      alert("Date range cannot exceed one year.");
    }
  };

  return (
    <>
      <Grid className="mt-3">
        <div className="col-span-12">
          <div className="bg-light-black text-white rounded-[20px] p-3 my-4 border-[1px] border-Light-Grey">
            <Grid className="!gap-4">
              <div className="col-span-5 flex pl-3">
                <h3 className="text-base self-center font-semibold">
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
                  className="!bg-white border-[1px] !text-[#333] font-normal py-2 border-Light-Grey"
                  onClick={openModal}
                >
                  Date Filter
                </Button>
              </div>
              <div className="col-span-12">
                <LineChart
                  graphData={activeTab == "Amount" ? graphData : graphDataCount}
                />
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
