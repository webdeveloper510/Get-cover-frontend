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
    let { startDate, endDate } = ranges.selection;
    
    // Check if the end date is in the future
    if (endDate > new Date()) {
      endDate = new Date(); // Set end date to current date
    }
    console.log(ranges)
    setSelectedRange([{ startDate, endDate, key: 'selection' }]);
  };


  return (
    <div className="bg-white rounded-[20px] relative p-3 my-4 border-[1px] border-Light-Grey">
      <DateRangePicker
        onChange={handleSelect}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={2}
        direction="horizontal"
        preventSnapRefocus={true}
        calendarFocus="backwards"
        ranges={selectedRange}
        // showMonthAndYearPickers={true} // Show only month and year select boxes
        maxDate={new Date()} // Prevent selecting future dates
      />
    </div>
  );
}

export default MyComponent;
