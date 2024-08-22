import React from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

function SelectedDateRangeComponent({ selectedRange, onRangeChange }) {
  return (
    <div className="bg-white rounded-[20px] relative p-3 my-4 border-[1px] border-Light-Grey">
      <DateRangePicker
        onChange={onRangeChange}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={2}
        direction="horizontal"
        preventSnapRefocus={true}
        calendarFocus="backwards"
        ranges={[{ ...selectedRange, key: "selection" }]}
        maxDate={new Date()}
      />
    </div>
  );
}

export default SelectedDateRangeComponent;
