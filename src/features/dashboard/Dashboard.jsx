import React, { useState } from "react";
import StatsCard from './widgets/StatsCard';
import Feeds from './widgets/Feeds';
import MonthlySalesStats from './widgets/MonthlySalesStats';
import PieChart from './widgets/PieChart';
import { Loading } from '../../components';
import { FaShoppingCart, FaCreditCard, FaUser, FaTicketAlt } from "react-icons/fa";
import { useEffect } from "react";
import dashboardServices from "../../api/services/DashboardServices";

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
  const [loading, setLoading] = useState(true);
  const [customersCount, setCustomersCount] = useState(0);
  const [screensCount, setScreensCount] = useState(0);
  const [ticketsCount, setTicketsCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [salesData, setSalesData] = useState({});
  const [ticketsStatus, setTicketStatus] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customers, tickets, screens, revenue, sales, ticketsStatus] = await dashboardServices();

        setCustomersCount(customers || 0);
        setTicketsCount(tickets || 0);
        setScreensCount(screens || 0);
        setRevenue(revenue || 0);
        setSalesData(sales || {
          currentMonth: [],
          lastMonth: []
        });
        setTicketStatus(ticketsStatus || [
          { label: '0', value: 0 },
        ]);
        console.log(ticketsStatus);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setCustomersCount(0);
        setScreensCount(0);
        setSalesData({
          currentMonth: [],
          lastMonth: []
        });
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <Loading />
  );

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
      <p className="text-gray-500">Here's a quick overview.</p>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatsCard label="Customers" value={customersCount} color="orange" icon={<FaUser />} />
        <StatsCard label="Screens" value={screensCount} color="green" icon={<FaCreditCard />} />
        <StatsCard label="Tickets" value={ticketsCount} color="red" icon={<FaTicketAlt />} />
        <StatsCard label="Orders" value={`AED ${revenue}`} color="blue" icon={<FaShoppingCart />} />
      </div>

      {/* Other Widgets */}
      <PieChart
        data={ticketsStatus}
        size={200}
        strokeWidth={20}
        className="mx-auto"
      />
      <Feeds title="Recent Activity" items={customFeeds} />
      <MonthlySalesStats salesData={salesData} />
    </div>
  );
};

export default Dashboard;
