import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateInput = ({ name, label, required, className1, error, disabled, className, item, setItem }) => {
  const [selectedDate, setSelectedDate] = useState(
    item.requested_order_ship_date ? new Date(item.requested_order_ship_date) : null
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);

    // Update the parent component's state
    setItem((prevItem) => ({
      ...prevItem,
      requested_order_ship_date: date ? date.toISOString().split('T')[0] : '',
    }));
  };

  return (
    <div className="relative">
      <label
        htmlFor={name}
        className={`absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-[#f9f9f9] left-2 px-1 -translate-y-4 z-10 scale-75 ${className}`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="yyyy/MM/dd"
        placeholderText="YYYY/MM/DD"
        isClearable
        className={`block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer ${className1} ${
          error ? "border-[red]" : "border-gray-300 "
        } ${disabled ? "text-[#5D6E66]" : "text-light-black"}`}
      />
    </div>
  );
};

export default DateInput;
