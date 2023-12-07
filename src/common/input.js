import React from "react";

const Input = ({ type, placeholder, label, defaultValue, onChange, name }) => {
  return (
    <>
      <div class="relative mt-4">
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          id={name}
          className="block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold text-light-black bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 peer"
          placeholder={placeholder}
          onChange={onChange}
        />
        <label
          for={name}
          className="absolute text-base text-light-black dark:text-gray-400 leading-6 duration-300 transform -translate-y-4 text-lg scale-75 top-1 z-10 origin-[0] bg-[#f9f9f9] dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-light-black peer-focus:dark:text-light-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-2"
        >
          {" "}
          {label}
        </label>
      </div>
    </>
  );
};

export default Input;
