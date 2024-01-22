import React from 'react';
import { Line } from 'react-chartjs-2';

const ChartComponent = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'My Dataset',
        data: [10, 25, 20, 30, 15],
        borderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: ['red', 'blue', 'green', 'orange', 'purple'],
        pointStyle: ['circle', 'triangle', 'rect', 'star', 'cross'],
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'category',
      },
      y: {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
      },
    },
  };
  

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default ChartComponent;
