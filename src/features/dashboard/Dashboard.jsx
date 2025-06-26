import React, { useState } from "react";
import StatsCard from './widgets/StatsCard';
import Feeds from './widgets/Feeds';
import MonthlySalesStats from './widgets/MonthlySalesStats';
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
  const [customerCount, setCustomerCount] = useState(0);
  const [screenCount, setScreenCount] = useState(0);
  const [salesData, setSalesData] = useState({
    currentMonth: [],
    lastMonth: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customers, screens, sales] = await dashboardServices();
        setCustomerCount(Array.isArray(customers) ? customers.length : 0);
        setScreenCount(Array.isArray(screens) ? screens.length : 0);
        
        // Process sales data
        if (Array.isArray(sales)) {
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();
          
          const currentMonthData = sales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
          });
          
          const lastMonthData = sales.filter(sale => {
            const saleDate = new Date(sale.date);
            const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            return saleDate.getMonth() === lastMonth && saleDate.getFullYear() === lastMonthYear;
          });

          setSalesData({
            currentMonth: currentMonthData,
            lastMonth: lastMonthData
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setCustomerCount(0);
        setScreenCount(0);
        setSalesData({ currentMonth: [], lastMonth: [] });
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
      <p className="text-gray-500">Welcome back! Here's a quick overview.</p>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatsCard label="Customers" value={customerCount?.toString() || "0"} color="orange" icon={<FaUser />} />
        <StatsCard label="Screens" value={screenCount?.toString() || "0"} color="green" icon={<FaCreditCard />} />
        <StatsCard label="Tickets" value="42" color="red" icon={<FaTicketAlt />} />
        <StatsCard label="Orders" value="$5,242" color="blue" icon={<FaShoppingCart />} />
      </div>

      {/* Other Widgets */}
      <Feeds title="Recent Activity" items={customFeeds} />
      <MonthlySalesStats salesData={salesData} />
    </div>
  );
};

export default Dashboard;
