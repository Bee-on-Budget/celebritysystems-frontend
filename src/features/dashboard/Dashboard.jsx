import React from "react";
import StatsCard from './widgets/StatsCard';

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
      <p className="text-gray-500">Welcome back! Here's a quick overview.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Total Systems" value="12" color="text-blue-600" />
        <StatsCard title="Active Users" value="37" color="text-green-600" />
        <StatsCard title="Pending Tasks" value="5" color="text-red-600" />
      </div>

      {/* You can keep the recent activity section here as before */}
    </div>
  );
};

export default Dashboard;
