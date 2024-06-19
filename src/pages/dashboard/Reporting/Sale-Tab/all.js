import React, { useEffect, useState } from "react";
import Grid from "../../../../common/grid";
import Administration from "../../../../assets/images/Reporting/Breakdown.svg";
import Fronting from "../../../../assets/images/Reporting/Fronting.svg";
import insurance from "../../../../assets/images/Reporting/insurance.svg";
import Reserves from "../../../../assets/images/Reporting/Reserves.svg";
import Broker from "../../../../assets/images/Reporting/Broker.svg";
import Button from "../../../../common/button";
import SelectedDateRangeComponent from "../../../../common/dateFilter";
import Modal from "../../../../common/model";
import Cross from "../../../../assets/images/Cross.png";
import LineChart from "../../../../common/lineChart";
import { getAllSales } from "../../../../services/reportingServices";

function All() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(),
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

  const handleApply = () => {
    const { startDate, endDate } = selectedRange;

    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let flag = "daily";
    if (diffDays > 1) {
      flag = "weekly";
    }

    let data = {
      filterFlag: "All",
      startDate: startDateStr,
      endDate: endDateStr,
      dealerId: null,
      priceBookId: null,
      flag: flag,
    };

    getDatasetAtEvent(data);
    setIsModalOpen(false);
  };

  useEffect(() => {
    getDatasetAtEvent({
      startDate: selectedRange.startDate.toISOString().split("T")[0],
      endDate: selectedRange.endDate.toISOString().split("T")[0],
      filterFlag: "All",
      dealerId: null,
      priceBookId: null,
      flag: "daily",
    });
  }, []);

  const getDatasetAtEvent = async (data) => {
    try {
      const res = await getAllSales(data);
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
                <p className="text-xl font-bold">
                  Total sales
                  <span className="text-sm font-normal"> Monthly </span>
                </p>
                {/* <p className="text-sm">
                  {`Selected Range: ${selectedRange.startDate.toLocaleDateString()} - ${selectedRange.endDate.toLocaleDateString()}`}
                </p> */}
              </div>
              <div className="col-span-9 self-center">
                <Grid className="!grid-cols-9 !gap-1">
                  <div className="col-span-6"></div>
                  <div className="col-span-3 text-right">
                    <Button
                      onClick={openModal}
                      className="!bg-[#FFFFFF2B] !text-white !text-[11px] !rounded-xl"
                    >
                      Filter
                    </Button>
                  </div>
                </Grid>
              </div>
            </Grid>

            <LineChart graphData={graphData} />
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
        />
        <div className="flex justify-end mb-4">
          <Button onClick={closeModal} className="mr-3">
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </Modal>
      <div className="bg-white rounded-[20px] p-3 my-4 border-[1px] border-Light-Grey">
        <Grid className="!grid-cols-5">
          <div className="col-span-1 border-r bg-gradient-to-t from-[#FFFFFF00] via-[#AAAAAA] to-[#FFFFFF00] pr-[1px]">
            <div className="bg-white pl-2">
              <div className="flex mb-4">
                <img src={Administration} alt="Administration" />
                <p className="text-sm font-bold self-center pl-3">
                  Administration <br /> Fees
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold">$5M</p>
              </div>
            </div>
          </div>
          <div className="col-span-1 border-r bg-gradient-to-t from-[#FFFFFF00] via-[#AAAAAA] to-[#FFFFFF00] pr-[1px]">
            <div className="bg-white pl-4">
              <div className="flex mb-4">
                <img src={Fronting} alt="Administration" />
                <p className="text-sm font-bold self-center pl-3">
                  Fronting <br /> Fees
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold">$232,159.00</p>
              </div>
            </div>
          </div>
          <div className="col-span-1 border-r bg-gradient-to-t from-[#FFFFFF00] via-[#AAAAAA] to-[#FFFFFF00] pr-[1px]">
            <div className="bg-white pl-4">
              <div className="flex mb-4">
                <img src={insurance} alt="Administration" />
                <p className="text-sm font-bold self-center pl-3">
                  Re-insurance <br /> Fees
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold">$1.5M</p>
              </div>
            </div>
          </div>
          <div className="col-span-1 border-r bg-gradient-to-t from-[#FFFFFF00] via-[#AAAAAA] to-[#FFFFFF00] pr-[1px]">
            <div className="bg-white pl-3">
              <div className="flex mb-4">
                <img src={Reserves} alt="Administration" />
                <p className="text-sm font-bold self-center pl-3">
                  Reserves Future <br /> Claims
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold">$123,259.00</p>
              </div>
            </div>
          </div>
          <div className="col-span-1 pl-5">
            <div className="flex mb-4">
              <img src={Broker} alt="Administration" />
              <p className="text-sm font-bold self-center pl-3">
                Broker <br /> Fees
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold">$1.55M</p>
            </div>
          </div>
        </Grid>
      </div>
    </>
  );
}

export default All;
