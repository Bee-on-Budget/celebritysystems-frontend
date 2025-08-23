import React, { useState } from "react";
import StatsCard from './widgets/StatsCard';
import Feeds from './widgets/Feeds';
import MonthlySalesStats from './widgets/MonthlySalesStats';
import StatusPieChart from './widgets/PieChart';
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
        setTicketStatus(ticketsStatus);
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
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header Section - Responsive */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 mb-2">
            Dashboard
          </h2>
          <p className="text-sm sm:text-base text-gray-500">
            Here's a quick overview of your business metrics.
          </p>
        </div>

        {/* Stats Cards Grid - Responsive breakpoints */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatsCard 
            label="Customers" 
            value={customersCount} 
            color="orange" 
            icon={<FaUser />} 
          />
          <StatsCard 
            label="Screens" 
            value={screensCount} 
            color="green" 
            icon={<FaCreditCard />} 
          />
          <StatsCard 
            label="Tickets" 
            value={ticketsCount} 
            color="red" 
            icon={<FaTicketAlt />} 
          />
          <StatsCard 
            label="Orders" 
            value={`AED ${revenue}`} 
            color="blue" 
            icon={<FaShoppingCart />} 
          />
        </div>

        {/* Main Content Grid - Responsive layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Left Column - Charts and Analytics */}
          <div className="xl:col-span-8 space-y-6 sm:space-y-8">
            
            {/* Sales Chart - Full width on mobile */}
            <div className="w-full">
              <MonthlySalesStats salesData={salesData} />
            </div>

            {/* Pie Chart Section - Responsive sizing */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
                Ticket Status Overview
              </h3>
              <div className="flex justify-center">
                <StatusPieChart
                  data={ticketsStatus}
                  size={Math.min(250, window.innerWidth * 0.6)} // Responsive size
                  strokeWidth={window.innerWidth < 640 ? 15 : 20} // Responsive stroke
                  className="mx-auto"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Feeds */}
          <div className="xl:col-span-4">
            <div className="sticky top-6">
              <Feeds title="Recent Activity" items={customFeeds} />
            </div>
          </div>
        </div>

        {/* Mobile-only: Additional spacing at bottom */}
        <div className="h-6 sm:hidden"></div>
      </div>
    </div>
  );
};

export default Dashboard;