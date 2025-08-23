import { useState, useEffect } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const StatusPieChart = () => {
  // Your data
  const rawData = {"IN_PROGRESS":0,"NULL":0,"CLOSED":0,"RESOLVED":1,"OPEN":21};
  
  // State to track window size for responsive adjustments
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Transform data for recharts and filter out zero values
  const data = Object.entries(rawData)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      name: key.replace('_', ' '),
      value: value,
      originalKey: key
    }));

  // Color scheme for different statuses
  const colors = {
    'IN_PROGRESS': '#0088FE', // Blue
    'NULL': '#C0C4C3',        // Gray
    'CLOSED': '#FF8042',     // Orange
    'RESOLVED': '#FFBB28',    // Yellow
    'OPEN': '#A4DE6C'         // Green
  };

  // Calculate total for percentages
  const total = Object.values(rawData).reduce((sum, val) => sum + val, 0);

  // Custom tooltip to show more information
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.payload.name}</p>
          <p className="text-sm text-gray-600">
            Count: <span className="font-medium">{data.value}</span>
          </p>
          <p className="text-sm text-gray-600">
            Percentage: <span className="font-medium">{((data.value / total) * 100).toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label function - responsive based on screen size
  const renderLabel = (entry) => {
    // On small screens, don't show labels on the chart to avoid clutter
    if (windowSize.width < 640) return null;
    
    const percentage = ((entry.value / total) * 100).toFixed(1);
    return `${entry.name}: ${percentage}%`;
  };

  // Responsive outer radius for the pie chart
  const getOuterRadius = () => {
    if (windowSize.width < 640) return 70;  // Small screens
    if (windowSize.width < 1024) return 80; // Medium screens
    return 100; // Large screens
  };

  // Responsive legend height
  const getLegendHeight = () => {
    if (windowSize.width < 640) return 72;  // More height for stacked legend on small screens
    return 36;
  };

  return (
    <div className="w-full h-80 sm:h-96 p-2 sm:p-4">
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={getOuterRadius()}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[entry.originalKey]} 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            layout={windowSize.width < 640 ? "vertical" : "horizontal"}
            verticalAlign="bottom"
            align="center"
            height={getLegendHeight()}
            formatter={(value, entry) => (
              <span className="text-xs sm:text-sm">
                {value} ({entry.payload.value})
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Summary stats */}
      <div className="mt-2 sm:mt-4 text-center text-xs sm:text-sm text-gray-600">
        Total Items: {total}
      </div>
    </div>
  );
};

export default StatusPieChart;