// features/dashboard/widgets/MonthlySalesStats.jsx
import React from 'react';
import { 
  FaArrowUp, 
  FaArrowDown, 
  FaFire, 
  FaChartLine,
  FaCalendarAlt
} from 'react-icons/fa';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer 
} from 'recharts';

const MonthlySalesStats = ({ salesData }) => {
  // Process the sales data for the chart
  const processChartData = (sales) => {
    const dailyData = {};
    
    // Initialize all days of the month with 0
    const daysInMonth = new Date().getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      dailyData[i] = 0;
    }
    
    // Sum up sales for each day
    sales.forEach(sale => {
      const day = new Date(sale.date).getDate();
      dailyData[day] = (dailyData[day] || 0) + sale.screens;
    });
    
    // Convert to array format for the chart
    return Object.entries(dailyData).map(([day, screens]) => ({
      day,
      screens
    }));
  };

  const currentMonthData = processChartData(salesData.currentMonth);
  const lastMonthData = processChartData(salesData.lastMonth);

  // Calculate totals
  const currentMonthTotal = currentMonthData.reduce((sum, day) => sum + day.screens, 0);
  const lastMonthTotal = lastMonthData.reduce((sum, day) => sum + day.screens, 0);
  
  // Calculate percentage change
  const percentChange = lastMonthTotal === 0 ? 0 : ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
  const isPositive = percentChange >= 0;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg flex items-center gap-2 text-dark">
          <FaChartLine className="text-primary" />
          Daily Screen Sales
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-dark-light flex items-center">
            <FaCalendarAlt className="mr-1" /> Last 30 Days
          </span>
        </div>
      </div>

      {/* MoM Comparison Badge */}
      <div className={`flex items-center justify-between p-3 mb-4 rounded-lg ${
        isPositive ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
      }`}>
        <div className="flex items-center gap-2">
          {isPositive ? (
            <FaArrowUp className="text-lg" />
          ) : (
            <FaArrowDown className="text-lg" />
          )}
          <span className="font-medium">
            {Math.abs(percentChange).toFixed(1)}% {isPositive ? 'increase' : 'decrease'} 
          </span>
          vs last month
        </div>
        {isPositive && currentMonthTotal > 15 && (
          <span className="flex items-center text-orange-500">
            <FaFire className="mr-1" /> Hot streak!
          </span>
        )}
      </div>

      {/* Line Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={currentMonthData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="screens" 
              stroke="#E83D29" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6, stroke: '#801a0e' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 text-center text-dark">
        <div className="p-2 bg-blue-50 rounded">
          <div className="text-sm text-blue-600">Current Month</div>
          <div className="text-xl font-bold">{currentMonthTotal}</div>
        </div>
        <div className="p-2 bg-gray-50 rounded">
          <div className="text-sm text-gray-600">Last Month</div>
          <div className="text-xl font-bold">{lastMonthTotal}</div>
        </div>
        <div className={`p-2 rounded ${
          isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          <div className="text-sm">Difference</div>
          <div className="text-xl font-bold">
            {isPositive ? '+' : ''}{currentMonthTotal - lastMonthTotal}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlySalesStats;