import React from "react";
import { Line } from "react-chartjs-2";

const LineChart = ({ graphData }) => {
  console.log(graphData);
  if (!graphData || graphData.length === 0) {
    return <div>No data available for the selected range.</div>;
  }

  const labels = graphData.map((data) =>
    new Date(data.weekStart).toLocaleDateString()
  );

  const datasets = [
    {
      label: "Total Order Amount",
      data: graphData.map((data) => data.total_order_amount),
      fill: false,
      borderColor: "rgba(75,192,192,1)",
      borderWidth: 2,
    },
    {
      label: "Total Orders",
      data: graphData.map((data) => data.total_orders),
      fill: false,
      borderColor: "rgba(54,162,235,1)",
      borderWidth: 2,
    },
    {
      label: "Total Broker Fee",
      data: graphData.map((data) => data.total_broker_fee),
      fill: false,
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 2,
    },
    {
      label: "Total Admin Fee",
      data: graphData.map((data) => data.total_admin_fee),
      fill: false,
      borderColor: "rgba(255,206,86,1)",
      borderWidth: 2,
    },
    {
      label: "Total Fronting Fee",
      data: graphData.map((data) => data.total_fronting_fee),
      fill: false,
      borderColor: "rgba(75,192,192,1)",
      borderWidth: 2,
    },
    {
      label: "Total Reserve Future Fee",
      data: graphData.map((data) => data.total_reserve_future_fee),
      fill: false,
      borderColor: "rgba(153,102,255,1)",
      borderWidth: 2,
    },
    {
      label: "Total Reinsurance Fee",
      data: graphData.map((data) => data.total_reinsurance_fee),
      fill: false,
      borderColor: "rgba(255,159,64,1)",
      borderWidth: 2,
    },
    {
      label: "Total Retail Price",
      data: graphData.map((data) => data.total_retail_price),
      fill: false,
      borderColor: "rgba(255,99,71,1)",
      borderWidth: 2,
    },
  ];

  const data = {
    labels: labels,
    datasets: datasets,
  };

  const options = {
    scales: {
      x: [
        {
          type: "category",
        },
      ],
      y: [
        {
          type: "linear",
          position: "left",
          beginAtZero: true,
        },
      ],
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
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
