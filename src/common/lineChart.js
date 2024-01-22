import React from 'react';
import { Line } from 'react-chartjs-2';

const LineChart = () => {

  const data = {
    labels: ['Jan 23', 'Feb 23', 'Mar 23','Apr 23', 'May 23' , 'Jun 23', 'Jul 23','Aug 23' , 'Sep 23', 'Oct 23',],
    datasets: [
      {
        label: 'Total Value of Orders',
        data: [11000, 11865, 1120, 6500, 7200, 5005, 6000,9999, 6215, 8000], 
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
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
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};



export default LineChart