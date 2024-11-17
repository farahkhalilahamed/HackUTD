import React from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const Dashboard = () => {
  const data = {
    labels: [
      'Bugatti', 'Aston Martin', 'Chevrolet', 'BMW', // Replace with actual data
    ],
    datasets: [
      {
        label: 'City Fuel Efficiency (MPG)',
        data: [8, 12, 16, 24], // Replace with actual data
        backgroundColor: 'skyblue',
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        title: { display: true, text: 'City Fuel Efficiency (MPG)' },
      },
      y: {
        title: { display: true, text: 'Manufacturer' },
      },
    },
  };

  return (
    <div>
      <h2>Average City Fuel Efficiency by Manufacturer</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Dashboard;
