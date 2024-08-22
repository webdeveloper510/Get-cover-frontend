import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, registerables } from 'chart.js';
Chart.register(ArcElement, ...registerables);

const ChartComponent = () => {
  const data = {
    labels: ['2022', '2023'],
    datasets: [
      {
        label: 'Years Comparison',
        data: [150, 300,],
        backgroundColor: [ '#939393', '#3D3D3D'],
        hoverOffset: 4,
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
  };

  return (
    <div>
      <Pie className='mb-5' data={data} options={options} />
    </div>
  );
};

export default ChartComponent;
