import React from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import Card from "./card";

function SelectedDateRangeComponent({ selectedRange, onRangeChange }) {
  return (
    <Card className=" rounded-[20px] relative p-3 my-4 border-[1px] border-Light-Grey">
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
    </Card>
  );
}

export default SelectedDateRangeComponent;
