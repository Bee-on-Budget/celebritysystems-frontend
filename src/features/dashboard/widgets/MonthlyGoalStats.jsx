// features/dashboard/widgets/MonthlySalesStats.jsx
import React from 'react';
import { FaArrowUp, FaArrowDown, FaEquals } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const MonthlyGoalStats = () => {
  // Sample data - replace with API data
  const salesData = [
    { week: 'Week 1', screens: 12, goal: 15 },
    { week: 'Week 2', screens: 18, goal: 15 },
    { week: 'Week 3', screens: 9, goal: 15 },
    { week: 'Week 4', screens: 16, goal: 15 },
  ];

  const totalSold = salesData.reduce((sum, week) => sum + week.screens, 0);
  const monthlyGoal = 60;
  const achievementRate = Math.round((totalSold / monthlyGoal) * 100);
  const trend = totalSold > monthlyGoal ? 'up' : totalSold < monthlyGoal ? 'down' : 'equal';

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg">Screen Sales - Last Month</h3>
        <div className={`px-3 py-1 rounded-full text-sm ${
          trend === 'up' ? 'bg-green-100 text-green-800' : 
          trend === 'down' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {trend === 'up' ? <FaArrowUp className="inline mr-1" /> : 
           trend === 'down' ? <FaArrowDown className="inline mr-1" /> : 
           <FaEquals className="inline mr-1" />}
          {achievementRate}% of goal
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4 text-center">
        {salesData.map((week, index) => (
          <div key={index} className="p-2 border rounded">
            <div className="text-xs text-gray-500">{week.week}</div>
            <div className="font-bold">{week.screens}</div>
            <div className={`text-xs ${week.screens >= week.goal ? 'text-green-500' : 'text-red-500'}`}>
              {week.screens >= week.goal ? '✓' : `${week.goal - week.screens} left`}
            </div>
          </div>
        ))}
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesData}>
            <XAxis dataKey="week" />
            <YAxis />
            <Bar 
              dataKey="screens" 
              fill="#3B82F6" 
              radius={[4, 4, 0, 0]} 
              name="Screens Sold"
            />
            <Bar 
              dataKey="goal" 
              fill="#E5E7EB" 
              radius={[4, 4, 0, 0]} 
              name="Weekly Goal"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-between text-sm">
        <div>
          <span className="font-medium">{totalSold}</span> screens sold
        </div>
        <div>
          <span className="font-medium">{monthlyGoal - totalSold}</span> remaining to goal
        </div>
      </div>
    </div>
  );
};

export default MonthlyGoalStats;