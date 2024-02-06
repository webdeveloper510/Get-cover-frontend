import React, { useState } from 'react';

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div>
      <div className="bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1] flex w-[34%] justify-center">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex self-center w-full !px-2 !py-1 rounded-xl border-[1px] mr-3 cursor-pointer border-[#D1D1D1] ${
              activeTab === tab.id ? "!bg-[#2A2A2A] !text-white"
              : "!bg-[#F9F9F9] !text-black"
            }`}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${activeTab !== tab.id ? 'hidden' : ''}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
