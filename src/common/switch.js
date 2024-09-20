import React from 'react';

const SwitchButton = ({ isOn, handleToggle }) => {
    return (
        <div className="flex items-center justify-center  bg-gray-100">
            <div
                onClick={handleToggle}
                className={`w-16 h-8 flex items-center rounded-full p-1 cursor-pointer ${isOn ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
                <div
                    className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${isOn ? 'translate-x-8' : 'translate-x-0'}`}
                />
            </div>
        </div>
    );
};

export default SwitchButton;
