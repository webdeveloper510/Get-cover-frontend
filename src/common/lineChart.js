import React from "react";
import { Line } from "react-chartjs-2";

const LineChart = ({ graphData, flag }) => {
  console.log(graphData, flag);
  if (!graphData || graphData.length === 0) {
    return <div>No data available for the selected range.</div>;
  }

  const labels = graphData.map((data) =>
    flag === "daily"
      ? new Date(data.date).toLocaleDateString()
      : new Date(data.weekStart).toLocaleDateString()
  );

  const keys = [
    {
      key: "total_amount",
      label: "Claim Amount",
      borderColor: "rgba(255,99,132,1)",
    },
    {
      key: "total_paid_amount",
      label: "Paid Amount",
      borderColor: "rgba(255,206,86,1)",
    },
    {
      key: "total_unpaid_amount",
      label: "Unpaid Claim Amount",
      borderColor: "rgba(75,192,192,1)",
    },

    {
      key: "total_claim",
      label: "Claim",
      borderColor: "rgba(255,99,132,1)",
    },
    {
      key: "total_paid_claim",
      label: "Paid Claim",
      borderColor: "rgba(255,206,86,1)",
    },
    {
      key: "total_unpaid_claim",
      label: "Unpaid Claim",
      borderColor: "rgba(75,192,192,1)",
    },
    {
      key: "total_rejected_claim",
      label: "Rejected Claim",
      borderColor: "#fff700",
    },
    {
      key: "total_order_amount",
      label: "Order Amount",
      borderColor: "rgba(75,192,192,1)",
    },
    {
      key: "total_broker_fee",
      label: "Broker Fee",
      borderColor: "rgba(255,99,132,1)",
    },
    {
      key: "total_admin_fee",
      label: "Admin Fee",
      borderColor: "rgba(255,206,86,1)",
    },
    {
      key: "total_fronting_fee",
      label: "Fronting Fee",
      borderColor: "rgba(75,192,192,1)",
    },
    {
      key: "total_reserve_future_fee",
      label: "Reserve Future Fee",
      borderColor: "rgba(153,102,255,1)",
    },
    {
      key: "total_reinsurance_fee",
      label: "Reinsurance Fee",
      borderColor: "rgba(255,159,64,1)",
    },
    {
      key: "total_orders",
      label: "Total Orders",
      borderColor: "rgba(54,162,235,1)",
    },
    {
      key: "total_contracts",
      label: "Total Contracts",
      borderColor: "rgba(255,99,132,1)",
    },
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
      },
      y: {
        type: "linear",
        position: "left",
        beginAtZero: true,
      },
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
