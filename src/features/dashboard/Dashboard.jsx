import React from "react";
import StatsCard from './widgets/StatsCard';
import Feeds from './widgets/Feeds';
import MonthlySalesStats from './widgets/MonthlySalesStats';
import { FaShoppingCart, FaCreditCard, FaUser, FaTicketAlt } from "react-icons/fa";

const customFeeds = [
  {
    type: 'task',
    message: 'Complete user profile implementation',
    time: new Date().toISOString(),
  },
  {
    type: 'order',
    message: 'New subscription purchase',
    time: '2025-05-29T11:20:00',
  },
  {
    type: 'pending',
    message: 'New subscription purchase',
    time: '2025-05-29T11:20:00',
  },
];

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
      <p className="text-gray-500">Welcome back! Here's a quick overview.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      </div>
      <StatsCard label="New Customers" value="852" color="orange" icon={<FaUser />} />
      <StatsCard label="Income" value="$5,852" color="green" icon={<FaCreditCard />} />
      <StatsCard label="Ticket" value="42" color="red" icon={<FaTicketAlt />} />
      <StatsCard label="Orders" value="$5,242" color="blue" icon={<FaShoppingCart />} />

      <Feeds
        title="Recent Activity"
        items={customFeeds}
      />
      <MonthlySalesStats />
    </div>
  );
};

export default Dashboard;
