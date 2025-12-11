import api from '../axios';
import dayjs from "dayjs";
import { getScreens } from './ScreenService';

// function extractSalesData(apiResponse) {
//   const today = dayjs();
//   const currentMonth = today.format("YYYY-MM");
//   const lastMonth = today.subtract(1, "month").format("YYYY-MM");

//   const currentMonthCounts = {};
//   const lastMonthCounts = {};

//   apiResponse.content.forEach((screen) => {
//     const date = dayjs(screen.createdAt).format("YYYY-MM-DD");
//     const month = date.slice(0, 7); // "YYYY-MM"

//     if (month === currentMonth) {
//       currentMonthCounts[date] = (currentMonthCounts[date] || 0) + 1;
//     } else if (month === lastMonth) {
//       lastMonthCounts[date] = (lastMonthCounts[date] || 0) + 1;
//     }
//   });

//   const toArray = (counts) =>
//     Object.entries(counts)
//       .map(([date, count]) => ({ date, screens: count }))
//       .sort((a, b) => a.date.localeCompare(b.date));

//   return {
//     currentMonth: toArray(currentMonthCounts),
//     lastMonth: toArray(lastMonthCounts),
//   };
// }

const getCustomersCount = async () => {
  try {
    const users = await api.get("/users");

    const customers = users.data.filter((user) =>
      user.role === 'COMPANY'
    );

    return customers.length;
  } catch (error) {
    throw error.response?.data?.message || "Faild to load customers"
  }
};

const getTicketsCount = async () => {
  try {
    const ticketsCount = await api.get("/tickets/statistic/total");
    return ticketsCount.data;
  } catch (error) {
    throw error.response?.data?.message || "Faild to get total tickets";
  }
};

const getScreensCount = async () => {
  try {
    const screensCount = await api.get("/screens/statistic/total");
    return screensCount.data;
  } catch (error) {
    throw error.response?.data?.message || "Faild to get total screen";
  }
};

const getRevenue = async () => {
  try {
    const response = await api.get('/contracts/total-value');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Faild to get total revenue";
  }
}

const lastTwoMonthsScreens = async () => {
  try {
    // Fetch screens (use a large page size to cover current + last month)
    const response = await getScreens({ size: 100, page: 0 });
    const screens = response?.content || response?.data?.content || [];

    const today = dayjs();
    const currentMonth = today.format("YYYY-MM");
    const lastMonth = today.subtract(1, "month").format("YYYY-MM");

    const currentMonthCounts = {};
    const lastMonthCounts = {};

    screens.forEach((screen) => {
      if (!screen?.createdAt) return;
      const createdAt = dayjs(screen.createdAt);
      if (!createdAt.isValid()) return;

      const month = createdAt.format("YYYY-MM");
      const date = createdAt.format("YYYY-MM-DD");

      if (month === currentMonth) {
        currentMonthCounts[date] = (currentMonthCounts[date] || 0) + 1;
      } else if (month === lastMonth) {
        lastMonthCounts[date] = (lastMonthCounts[date] || 0) + 1;
      }
    });

    const toArray = (counts) =>
      Object.entries(counts)
        .map(([date, count]) => ({ date, screens: count }))
        .sort((a, b) => a.date.localeCompare(b.date));

    return {
      currentMonth: toArray(currentMonthCounts),
      lastMonth: toArray(lastMonthCounts),
    };
  } catch (error) {
    throw error.response?.data?.message || "Faild to get last two months screens";
  }
}

const getScreensSales = async () => {
  try {
    const response = await lastTwoMonthsScreens();
    return response;
  } catch (error) {
    throw error.response?.data?.message || "Faild to get screens data";
  }
}

const getTicketsStatus = async () => {
  try {
    const response = await api.get('/tickets/statistic/status-counts');
    
    // Convert the response data to the required format
    console.log(response.data);
    const statusData = Object.entries(response.data).map((statusKey, statusValue) => ({
      name: statusKey,
      value: statusValue,
    }));
    
    return statusData;
  } catch (error) {
    throw error.response?.data?.message || "Faild to tickets status";
  }
}

const dashboardServices = async () => {
  const [customers, tickets, screens, revenue, sales, ticketsStatus] = await Promise.all([
    getCustomersCount(),
    getTicketsCount(),
    getScreensCount(),
    getRevenue(),
    getScreensSales(),
    getTicketsStatus(),
  ]);
  return [customers, tickets, screens, revenue, sales, ticketsStatus];
};

export default dashboardServices;