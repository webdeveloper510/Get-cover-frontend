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
    
    setSelectedRange([{ startDate, endDate, key: 'selection' }]);
  };

  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 1); // Set minDate to 2 years ago

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
        showMonthAndYearPickers={true} // Show only month and year select boxes
        minDate={minDate} // Limit selectable dates to past 2 years
        maxDate={new Date()} // Prevent selecting future dates
      />
    </div>
  );
}

export default MyComponent;
