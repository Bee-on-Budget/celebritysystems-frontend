import React from 'react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const PieChart = ({
  data,
  colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#A4DE6C'],
  innerRadius = 60,
  outerRadius = 80,
  legend = true,
  tooltip = true,
  className = '',
}) => {
  // Filter out zero or negative values
  const chartData = data.filter(item => (item.value > 0));

  return (
    <div className={`w-full h-[300px] ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || colors[index % colors.length]} 
              />
            ))}
          </Pie>
          {tooltip && <Tooltip 
            contentStyle={{
              borderRadius: '0.5rem',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            }}
            formatter={(value, name, props) => [
              `${value}`,
              `${name}`,
            ]}
          />}
          {legend && <Legend 
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              paddingTop: '20px',
            }}
          />}
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;