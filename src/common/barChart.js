import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getSetting } from "../services/extraServices";

const BarChart = ({ graphData }) => {
  console.log(graphData);
  const [sideBarColor, setSideBarColor] = useState('');
  const [sideBarTextColor, setSideBarTextColor] = useState('');

  const labels = graphData.map((data) =>
    new Date(data.weekStart).toLocaleDateString()
  );
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
  const keys = [
    {
      key: "total_orders",
      label: "Total Order Amount",
      borderColor: "#fff",
    },
    {
      key: "total_claims",
      label: "Total Claim Amount",
      borderColor: "#fff",
    },
  ];

  const datasets = keys
    .filter(({ key }) => graphData.some((data) => data[key] !== undefined))
    .map(({ key, label }) => ({
      label: label,
      data: graphData.map((data) => (data[key] !== undefined ? data[key] : 0)),
      backgroundColor: "white",
      borderWidth: 1,
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
        display: false, // Set display to false to remove the top label
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            label += `$${context.raw}`;
            return label;
          },
        },
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    },
    barPercentage: 0.9,
    categoryPercentage: 0.8,
    borderRadius: 20,
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
