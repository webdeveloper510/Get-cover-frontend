import React from 'react';
import { Bar } from 'react-chartjs-2';

const MultiLineChart = () => {
  const labels = Array.from({ length: 31 }, (_, index) => (index + 1).toString());
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Total Value of Orders',
        data: [9000, 8563, 8000, 7010, 8120, 6242, 7562, 8563, 8000, 3010, 8120, 4242, 5562, 8563, 8000, 8010, 5120, 6242, 7562,11233, 8563, 2000, 8010, 9120, 8242, 8562,8563, 7000, 8010, 7120, 6242],  
        backgroundColor: 'white',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
      {
        label: 'Total Value of Orders1',
        data: [5120, 6242, 7562,11233, 8563, 2000, 8010, 9120, 8242, 8562,8563, 7000, 8010, 7120, 6242, 9000, 8563, 8000, 7010, 8120, 6242, 7562, 8563, 8000, 3010, 8120, 4242, 5562, 8563, 8000, 8010],  
        backgroundColor: 'white',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: [
        {
          type: 'category',
        },
      ],
      y: [
        {
          type: 'linear',
          position: 'left',
          beginAtZero: true,
        },
      ],
    },
    plugins: {
        legend: {
          display: true,
          position: 'top',
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
      borderRadius : 20
    };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default MultiLineChart