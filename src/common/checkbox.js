import React from 'react';

function Checkbox({ label, name }) {
  return (
    <div className="flex items-center gap-x-3 ">
      <input
        id={`push-nothing-${name}`}
        name={`push-notifications-${name}`}
        type="checkbox"
        className="h-4 w-4 py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
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
