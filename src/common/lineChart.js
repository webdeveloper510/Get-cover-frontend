import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getSetting } from "../services/extraServices";

const LineChart = ({ graphData, flag }) => {
  const [sideBarColor, setSideBarColor] = useState('');
  const [sideBarTextColor, setSideBarTextColor] = useState('');
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        console.log("Fetching user details...");
        const userDetails = await getSetting();
        console.log("User details fetched:", userDetails);

        if (userDetails && userDetails.result && userDetails.result.length > 0) {
          const fetchedData = userDetails.result[0];
          localStorage.setItem("siteSettings", JSON.stringify(fetchedData));
          const colorScheme = fetchedData.colorScheme;
          colorScheme.forEach(color => {
            switch (color.colorType) {
              case 'sideBarColor':
                setSideBarColor(color.colorCode);
                break;
              case 'sideBarTextColor':
                setSideBarTextColor(color.colorCode);
                break;
              default:
                break;
            }
          })
        } else {
          console.log("User details are invalid or empty.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);
  if (!graphData || graphData.length === 0) {
    return <div>No data available for the selected range.</div>;
  }

  const labels = graphData.map((data) =>
    flag === "daily"
      ? new Date(data.date).toLocaleDateString()
      : new Date(data.weekStart).toLocaleDateString()
  );

  const keys = [
    { key: "total_amount", label: "Claim Amount", borderColor: "rgba(255,99,132,1)" },
    { key: "total_paid_amount", label: "Paid Amount", borderColor: "rgba(255,206,86,1)" },
    { key: "total_unpaid_amount", label: "Unpaid Claim Amount", borderColor: "rgba(75,192,192,1)" },
    { key: "total_claim", label: "Claim", borderColor: "rgba(255,99,132,1)" },
    { key: "total_paid_claim", label: "Paid Claim", borderColor: "rgba(255,206,86,1)" },
    { key: "total_unpaid_claim", label: "Unpaid Claim", borderColor: "rgba(75,192,192,1)" },
    { key: "total_rejected_claim", label: "Rejected Claim", borderColor: "#808080" },
    { key: "total_order_amount", label: "Order Amount", borderColor: "rgba(75,192,192,1)" },
    { key: "total_broker_fee", label: "Broker Fee", borderColor: "rgba(255,99,132,1)" },
    { key: "total_broker_fee1", label: "Total Income", borderColor: "rgba(255,99,132,1)" },
    { key: "wholesale_price", label: "Wholesale Price", borderColor: "rgba(255,206,86,1)" },
    { key: "total_reinsurance_fee", label: "Reinsurance Fee", borderColor: "rgba(255,255,255,1)" },
    { key: "total_fronting_fee", label: "Fronting Fee", borderColor: "rgba(75,192,192,1)" },
    { key: "total_reserve_future_fee", label: "Reserve Future Fee", borderColor: "rgba(153,102,255,1)" },
    { key: "total_orders", label: "Total Orders", borderColor: "rgba(54,162,235,1)" },
    { key: "total_contracts", label: "Total Contracts", borderColor: "rgba(255,99,132,1)" },
  ];

  const datasets = keys
    .filter(({ key }) => graphData.some((data) => data[key] !== undefined))
    .map(({ key, label, borderColor }) => ({
      label: label,
      data: graphData.map((data) => (data[key] !== undefined ? data[key] : 0)),
      fill: false,
      borderColor: borderColor,
      borderWidth: 2,
    }));

  const data = {
    labels: labels,
    datasets: datasets,
  };

  const options = {
    scales: {
      x: {
        type: "category",
        ticks: {
          color: sideBarTextColor, // Change x-axis text color
        },
        border: {
          color: sideBarTextColor,
        },
      },
      y: {
        type: "linear",
        position: "left",
        beginAtZero: true,
        ticks: {
          color: sideBarTextColor,
          callback: function (value) {
            return `$${value}`;
          },
          border: {
            color: sideBarTextColor,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: sideBarTextColor, // Change legend label color
        },
      },
    },
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
