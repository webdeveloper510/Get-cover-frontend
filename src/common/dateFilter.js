import React, { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

function MyComponent() {
  const [selectedRange, setSelectedRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    }
  ]);

  const handleSelect = (ranges) => {
    console.log(ranges , "-------------------------<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>")
    setSelectedRange([ranges.selection]);
  };

  return (
    <div className="bg-[#fff] rounded-[20px] relative p-3 my-4 border-[1px] border-[#D1D1D1]">
        <DateRangePicker
          onChange={handleSelect}
          showSelectionPreview={true}
          moveRangeOnFirstSelection={false}
          months={2}
          direction="horizontal"
          preventSnapRefocus={true}
          calendarFocus="backwards"
          ranges={selectedRange}
        />
    </div>
  );
}

export default MyComponent;
