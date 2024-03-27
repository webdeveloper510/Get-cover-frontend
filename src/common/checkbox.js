import React from 'react';

function Checkbox({ label, name }) {
  return (
    <div className="flex items-center gap-x-3 ">
      <input
        id={`push-nothing-${name}`}
        name={`push-notifications-${name}`}
        type="checkbox"
        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
      />
      <label
        htmlFor={`push-nothing-${name}`}
        className="block text-base text-neutral-grey font-medium leading-6"
      >
        {label}
      </label>
    </div>
  );
}

export default Checkbox;
