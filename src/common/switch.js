import React from 'react';

const SwitchButton = ({ isOn, handleToggle }) => {
    return (
        <div className="flex items-center justify-center">
            <div
                onClick={handleToggle}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${isOn ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
                <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${isOn ? 'translate-x-6' : 'translate-x-0'}`}
                />
            </div>
        </div>
    );
};

export default SwitchButton;
