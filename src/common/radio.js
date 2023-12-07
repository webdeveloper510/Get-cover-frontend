import React from 'react';

const RadioButton = ({ id, label, value, checked, onChange }) => {
  return (
    <div className="flex items-center px-3">
      <input
        type="radio"
        id={id}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mr-2 accent-teal-900	"
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default RadioButton;
