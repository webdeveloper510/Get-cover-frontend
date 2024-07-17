import React from "react";
import { Bar } from "react-chartjs-2";

const BarChart = ({ graphData }) => {
  console.log(graphData);

  const labels = graphData.map((data) =>
    new Date(data.weekStart).toLocaleDateString()
  );

  const keys = [
    {
      key: "total_orders",
      label: "Total Order Amount",
    },
    {
      key: "total_claims",
      label: "Total Claim Amount",
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
      },
      y: {
        type: "linear",
        position: "left",
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `$${value}`;
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
