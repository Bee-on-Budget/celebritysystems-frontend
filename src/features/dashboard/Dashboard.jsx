import React from "react";
import StatsCard from './widgets/StatsCard';
import { FaShoppingCart, FaCreditCard, FaUser, FaTicketAlt } from "react-icons/fa";

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

      {/* You can keep the recent activity section here as before */}
    </div>
  );
};

export default Dashboard;
