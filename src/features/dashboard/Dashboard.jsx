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
  const [customersCount, setCustomersCount] = useState(0);
  const [screensCount, setScreensCount] = useState(0);
  const [ticketsCount, setTicketsCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [salesData, setSalesData] = useState({});
  // const [salesData, setSalesData] = useState({
  //   currentMonth: [
  //     { date: "2024-06-01", screens: 5 },
  //     { date: "2024-06-02", screens: 3 },
  //     { date: "2024-06-03", screens: 4 },
  //     { date: "2024-06-04", screens: 6 },
  //     { date: "2024-06-05", screens: 7 },
  //     { date: "2024-06-06", screens: 5 },
  //     { date: "2024-06-07", screens: 2 },
  //     { date: "2024-06-08", screens: 8 },
  //     { date: "2024-06-09", screens: 4 },
  //     { date: "2024-06-10", screens: 3 },
  //     { date: "2024-06-11", screens: 6 },
  //     { date: "2024-06-12", screens: 5 },
  //     { date: "2024-06-13", screens: 7 },
  //     { date: "2024-06-14", screens: 6 },
  //     { date: "2024-06-15", screens: 4 },
  //     { date: "2024-06-16", screens: 3 },
  //     { date: "2024-06-17", screens: 6 },
  //     { date: "2024-06-18", screens: 5 },
  //     { date: "2024-06-19", screens: 4 },
  //     { date: "2024-06-20", screens: 7 },
  //     { date: "2024-06-21", screens: 8 },
  //     { date: "2024-06-22", screens: 6 },
  //     { date: "2024-06-23", screens: 5 },
  //     { date: "2024-06-24", screens: 3 },
  //     { date: "2024-06-25", screens: 4 },
  //     { date: "2024-06-26", screens: 7 },
  //     { date: "2024-06-27", screens: 5 },
  //     { date: "2024-06-28", screens: 6 },
  //     { date: "2024-06-29", screens: 3 },
  //     { date: "2024-06-30", screens: 4 }
  //   ],
  //   lastMonth: [
  //     { date: "2024-05-01", screens: 2 },
  //     { date: "2024-05-02", screens: 4 },
  //     { date: "2024-05-03", screens: 3 },
  //     { date: "2024-05-04", screens: 5 },
  //     { date: "2024-05-05", screens: 6 },
  //     { date: "2024-05-06", screens: 2 },
  //     { date: "2024-05-07", screens: 3 },
  //     { date: "2024-05-08", screens: 4 },
  //     { date: "2024-05-09", screens: 5 },
  //     { date: "2024-05-10", screens: 3 },
  //     { date: "2024-05-11", screens: 2 },
  //     { date: "2024-05-12", screens: 6 },
  //     { date: "2024-05-13", screens: 5 },
  //     { date: "2024-05-14", screens: 4 },
  //     { date: "2024-05-15", screens: 3 },
  //     { date: "2024-05-16", screens: 4 },
  //     { date: "2024-05-17", screens: 5 },
  //     { date: "2024-05-18", screens: 6 },
  //     { date: "2024-05-19", screens: 4 },
  //     { date: "2024-05-20", screens: 3 },
  //     { date: "2024-05-21", screens: 2 },
  //     { date: "2024-05-22", screens: 4 },
  //     { date: "2024-05-23", screens: 5 },
  //     { date: "2024-05-24", screens: 3 },
  //     { date: "2024-05-25", screens: 6 },
  //     { date: "2024-05-26", screens: 4 },
  //     { date: "2024-05-27", screens: 3 },
  //     { date: "2024-05-28", screens: 5 },
  //     { date: "2024-05-29", screens: 2 },
  //     { date: "2024-05-30", screens: 4 },
  //     { date: "2024-05-31", screens: 3 }
  //   ]
  // });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customers, tickets, screens, revenue, sales] = await dashboardServices();
        
        setCustomersCount(customers || 0);
        setTicketsCount(tickets || 0);
        setScreensCount(screens || 0);
        setRevenue(revenue || 0);
        setSalesData(sales || {
          currentMonth: [],
          lastMonth: []
        });
        
        // const sales = [];
        // Process sales data
        // if (Array.isArray(sales)) {
        //   const currentDate = new Date();
        //   const currentMonth = currentDate.getMonth();
        //   const currentYear = currentDate.getFullYear();
          
        //   const currentMonthData = sales.filter(sale => {
        //     const saleDate = new Date(sale.date);
        //     return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
        //   });
          
        //   const lastMonthData = sales.filter(sale => {
        //     const saleDate = new Date(sale.date);
        //     const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        //     const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        //     return saleDate.getMonth() === lastMonth && saleDate.getFullYear() === lastMonthYear;
        //   });

        //   setSalesData({
        //     currentMonth: currentMonthData,
        //     lastMonth: lastMonthData
        //   });
        // }
        
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
      <Feeds title="Recent Activity" items={customFeeds} />
      <MonthlySalesStats salesData={salesData} />
    </div>
  );
};

export default Dashboard;
