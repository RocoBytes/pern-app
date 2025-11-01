import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function SimpleBarChart({ data, height = 300, barColor = '#8884d8' }) {
  // Datos por defecto si no se proporcionan
  const defaultData = [
    {
      name: 'Iniciado',
      Total: 40,
      uv: 40,
    },
    {
      name: 'Vigente',
      Total: 30,
      uv: 30,
    },
    {
      name: 'Terminado',
      Total: 20,
      uv: 20,
    },
    {
      name: 'Reparado',
      Total: 27,
      uv: 27,
    },
  ];

  const chartData = data || defaultData;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Total" fill={barColor} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default SimpleBarChart;