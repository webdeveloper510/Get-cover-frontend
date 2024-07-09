import React, { useState } from 'react'
import Grid from '../../../../common/grid'
import Arrow from '../../../../assets/images/Reporting/icons/arrows.svg'
import Select from '../../../../common/select'
import Button from '../../../../common/button'
import drop from '../../../../assets/images/icons/dropwhite.svg'
import ChartComponent from '../../../../common/chart'
import BarChart from '../../../../common/barChart'
import Modal from '../../../../common/model'
import MyComponent from '../../../../common/dateFilter'
import Cross from "../../../../assets/images/Cross.png";
import SelectedDateRangeComponent from '../../../../common/dateFilter'
// import Cross from "../../../../assets/images/Cross.png";

function Broker() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleApply = () => {
    setIsModalOpen(false);
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
          <div className="bg-light-black text-white rounded-[20px] p-3 my-4 border-[1px] border-Light-Grey">
            <Grid>
              <div className="col-span-3 self-center">
                <p className="text-xl font-bold">
                  Total sales
                  <span className="text-sm font-normal"> Monthly </span>
                </p>
                <p className="text-sm">
                  {`Selected Range: ${selectedRange.startDate.toLocaleDateString()} - ${selectedRange.endDate.toLocaleDateString()}`}
                </p>
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

              <BarChart/>
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
    </>
  )
}

export default Broker