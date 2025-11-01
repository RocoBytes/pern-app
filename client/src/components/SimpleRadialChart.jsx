import React from 'react';
import {
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function SimpleRadialChart({ data, height = 300 }) {
  // Datos por defecto si no se proporcionan
  const defaultData = [
    {
      name: 'Iniciado',
      uv: 300,
      pv: 450,
      fill: '#8884d8',
    },
    {
      name: 'Vigente',
      uv: 500,
      pv: 600,
      fill: '#83a6ed',
    },
    {
      name: 'En Revisión',
      uv: 400,
      pv: 500,
      fill: '#8dd1e1',
    },
    {
      name: 'Finalizado',
      uv: 700,
      pv: 800,
      fill: '#82ca9d',
    },
  ];

  const chartData = data || defaultData;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius={20}
        outerRadius={140}
        barSize={10}
        data={chartData}
        startAngle={90}
        endAngle={-270}
      >
        <RadialBar
          minAngle={15}
          label={{ position: 'insideStart', fill: '#fff' }}
          background
          clockWise
          dataKey="uv"
        />
        <Legend
          iconSize={10}
          layout="vertical"
          verticalAlign="middle"
          align="right"
        />
        <Tooltip />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

export default SimpleRadialChart;