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
    <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
      {/* Header - Responsive flex layout */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2 text-dark">
          <FaChartLine className="text-primary text-sm sm:text-base" />
          <span className="truncate">Daily Screen Sales</span>
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-dark-light flex items-center">
            <FaCalendarAlt className="mr-1 text-xs sm:text-sm" /> 
            <span className="hidden xs:inline">Last 30 Days</span>
            <span className="xs:hidden">30 Days</span>
          </span>
        </div>
      </div>

      {/* MoM Comparison Badge - Responsive layout */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 mb-4 rounded-lg gap-2 sm:gap-0 ${
        isPositive ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
      }`}>
        <div className="flex items-center gap-2">
          {isPositive ? (
            <FaArrowUp className="text-sm sm:text-lg flex-shrink-0" />
          ) : (
            <FaArrowDown className="text-sm sm:text-lg flex-shrink-0" />
          )}
          <span className="font-medium text-xs sm:text-sm">
            {Math.abs(percentChange).toFixed(1)}% {isPositive ? 'increase' : 'decrease'} 
            <span className="hidden sm:inline"> vs last month</span>
            <span className="sm:hidden"> vs last mo.</span>
          </span>
        </div>
        {isPositive && currentMonthTotal > 15 && (
          <span className="flex items-center text-orange-500 text-xs sm:text-sm self-start sm:self-center">
            <FaFire className="mr-1 text-xs sm:text-sm" /> 
            <span className="hidden sm:inline">Hot streak!</span>
            <span className="sm:hidden">Hot!</span>
          </span>
        )}
      </div>

      {/* Line Chart - Responsive height */}
      <div className="h-48 sm:h-56 md:h-64 lg:h-72 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={currentMonthData}
            margin={{ 
              top: 5, 
              right: 5, 
              left: 0, 
              bottom: 5 
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#f0f0f0"
            />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
              tickMargin={8}
              interval={window.innerWidth < 640 ? 2 : 0}
            />
            <YAxis 
              tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
              tickMargin={8}
              width={window.innerWidth < 640 ? 30 : 40}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                fontSize: window.innerWidth < 640 ? '12px' : '14px'
              }}
              labelFormatter={(value) => `Day ${value}`}
              formatter={(value) => [value, 'Screens']}
            />
            <Line 
              type="monotone" 
              dataKey="screens" 
              stroke="#E83D29" 
              strokeWidth={window.innerWidth < 640 ? 1.5 : 2}
              dot={{ r: window.innerWidth < 640 ? 3 : 4 }}
              activeDot={{ 
                r: window.innerWidth < 640 ? 5 : 6, 
                stroke: '#801a0e' 
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats - Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-center text-dark">
        <div className="p-2 sm:p-3 bg-blue-50 rounded">
          <div className="text-xs sm:text-sm text-blue-600 mb-1">
            Current Month
          </div>
          <div className="text-lg sm:text-xl font-bold">
            {currentMonthTotal.toLocaleString()}
          </div>
        </div>
        <div className="p-2 sm:p-3 bg-gray-50 rounded">
          <div className="text-xs sm:text-sm text-gray-600 mb-1">
            Last Month
          </div>
          <div className="text-lg sm:text-xl font-bold">
            {lastMonthTotal.toLocaleString()}
          </div>
        </div>
        <div className={`p-2 sm:p-3 rounded ${
          isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          <div className="text-xs sm:text-sm mb-1">
            Difference
          </div>
          <div className="text-lg sm:text-xl font-bold">
            {isPositive ? '+' : ''}{(currentMonthTotal - lastMonthTotal).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlySalesStats;