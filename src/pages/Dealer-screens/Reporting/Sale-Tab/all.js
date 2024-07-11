import React, { useEffect, useState } from "react";
import Grid from "../../../../common/grid";
import Button from "../../../../common/button";
import SelectedDateRangeComponent from "../../../../common/dateFilter";
import Modal from "../../../../common/model";
import Cross from "../../../../assets/images/Cross.png";
import LineChart from "../../../../common/lineChart";
import {
  getAllSalesForDealer,
  getAllSalesForReporting,
} from "../../../../services/reportingServices";
import { RotateLoader } from "react-spinners";
import { useMyContext } from "../../../../context/context";
import { useLocation } from "react-router-dom";

function DealerAll({ activeTab, activeButton }) {
  const location = useLocation();
  const isResellerReporting = location.pathname.includes("/reseller/sale");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState("daily");
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 14)),
    endDate: new Date(),
  });
  const [graphDataCount, setGraphDataCount] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const { filters, flag1, toggleFilterFlag, filtersCategoryTab1 } =
    useMyContext();

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };
  console.log(flag1, activeButton);

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
    setFlag(flag);
    let data = {
      startDate: startDateStr,
      endDate: endDateStr,
      dealerId: "",
      priceBookId: filtersCategoryTab1.priceBookId,
      categoryId: filtersCategoryTab1.categoryId,
      flag: flag,
    };

    getDatasetAtEvent(data);
    setIsModalOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    getDatasetAtEvent({
      startDate: selectedRange.startDate.toISOString().split("T")[0],
      endDate: selectedRange.endDate.toISOString().split("T")[0],
      dealerId: "",
      priceBookId: filtersCategoryTab1.priceBookId,
      categoryId: filtersCategoryTab1.categoryId,
      flag: flag,
    });
    setLoading(false);
  }, [selectedRange]);

  useEffect(() => {
    if (flag1) {
      setLoading(true);
      getDatasetAtEvent({
        startDate: selectedRange.startDate.toISOString().split("T")[0],
        endDate: selectedRange.endDate.toISOString().split("T")[0],
        dealerId: "",
        priceBookId: filtersCategoryTab1.priceBookId,
        categoryId: filtersCategoryTab1.categoryId,
        flag: flag,
      });
      setLoading(false);
    }
  }, [flag1]);

  const getDatasetAtEvent = async (data) => {
    setLoading(true);
    try {
      const res = await getAllSalesForReporting(
        data,
        isResellerReporting ? "resellerPortal" : "dealerPortal"
      );
      const amountData = res.result.graphData.map((item) => {
        const {
          total_orders,
          total_contracts,
          total_reserve_future_feem,
          total_reinsurance_fee,
          Filter,
          total_reserve_future_fee,
          total_fronting_fee,
          total_broker_fee,
          wholesale_price,
          total_broker_fee1,
          ...rest
        } = item;
        console.log(rest);
        return {
          ...rest,
          ...(!isResellerReporting && {
            total_broker_fee1,
            wholesale_price,
          }),
        };
      });

      const countData = res.result.graphData.map((item) => {
        return {
          weekStart: item.weekStart,
          total_orders: item.total_orders,
          total_contracts: item.total_contracts,
        };
      });

      console.log(amountData, countData);
      setGraphData(amountData);
      setGraphDataCount(countData);
      toggleFilterFlag();
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
    setLoading(false);
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
      {loading ? (
        <div className=" h-[400px] w-full flex py-5">
          <div className="self-center mx-auto">
            <RotateLoader color="#333" />
          </div>
        </div>
      ) : (
        <Grid>
          <div className="col-span-12">
            <div className="bg-[#333333] text-white rounded-[20px] p-3 my-4 border-[1px] border-Light-Grey">
              <Grid className="!gap-1">
                <div className="col-span-6 self-center">
                  <p className="text-xl font-bold">Total sales</p>
                </div>
                <div className="col-span-6 self-center flex ml-auto">
                  <p className="text-sm self-center mr-5">
                    {`Selected Range: ${selectedRange.startDate.toLocaleDateString()} - ${selectedRange.endDate.toLocaleDateString()}`}
                  </p>
                  <Button className="!bg-white !text-black" onClick={openModal}>
                    <span className="py-1">Date Filter</span>
                  </Button>
                </div>

                <div className="col-span-12">
                  <LineChart
                    graphData={
                      activeTab == "Amount" ? graphData : graphDataCount
                    }
                  />
                </div>
              </Grid>
            </div>
          </div>
        </Grid>
      )}

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

export default DealerAll;
