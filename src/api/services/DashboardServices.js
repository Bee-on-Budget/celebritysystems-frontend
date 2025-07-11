import api from '../axios';
import dayjs from "dayjs";

function extractSalesData(apiResponse) {
  const today = dayjs();
  const currentMonth = today.format("YYYY-MM");
  const lastMonth = today.subtract(1, "month").format("YYYY-MM");

  const currentMonthCounts = {};
  const lastMonthCounts = {};

  apiResponse.content.forEach((screen) => {
    const date = dayjs(screen.createdAt).format("YYYY-MM-DD");
    const month = date.slice(0, 7); // "YYYY-MM"

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
}

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

const getScreensSales = async () => {
  try {
    const response = await api.get('screens/');
    console.log(response.data);
    const salesData = extractSalesData(response.data.content);
    console.log(salesData);
    return salesData;
  } catch (error) {
    console.log(error);
    throw error.response?.data?.message || "Faild to get screens data";
  } finally {
    return {
      currentMonth: [
        { date: "2024-06-01", screens: 5 },
        { date: "2024-06-02", screens: 3 },
        { date: "2024-06-03", screens: 4 },
        { date: "2024-06-04", screens: 6 },
        { date: "2024-06-05", screens: 7 },
        { date: "2024-06-06", screens: 5 },
        { date: "2024-06-07", screens: 2 },
        { date: "2024-06-08", screens: 8 },
        { date: "2024-06-09", screens: 4 },
        { date: "2024-06-10", screens: 3 },
        { date: "2024-06-11", screens: 6 },
        { date: "2024-06-12", screens: 5 },
        { date: "2024-06-13", screens: 7 },
        { date: "2024-06-14", screens: 6 },
        { date: "2024-06-15", screens: 4 },
        { date: "2024-06-16", screens: 3 },
        { date: "2024-06-17", screens: 6 },
        { date: "2024-06-18", screens: 5 },
        { date: "2024-06-19", screens: 4 },
        { date: "2024-06-20", screens: 7 },
        { date: "2024-06-21", screens: 8 },
        { date: "2024-06-22", screens: 6 },
        { date: "2024-06-23", screens: 5 },
        { date: "2024-06-24", screens: 3 },
        { date: "2024-06-25", screens: 4 },
        { date: "2024-06-26", screens: 7 },
        { date: "2024-06-27", screens: 5 },
        { date: "2024-06-28", screens: 6 },
        { date: "2024-06-29", screens: 3 },
        { date: "2024-06-30", screens: 4 }
      ],
      lastMonth: [
        { date: "2024-05-01", screens: 2 },
        { date: "2024-05-02", screens: 4 },
        { date: "2024-05-03", screens: 3 },
        { date: "2024-05-04", screens: 5 },
        { date: "2024-05-05", screens: 6 },
        { date: "2024-05-06", screens: 2 },
        { date: "2024-05-07", screens: 3 },
        { date: "2024-05-08", screens: 4 },
        { date: "2024-05-09", screens: 5 },
        { date: "2024-05-10", screens: 3 },
        { date: "2024-05-11", screens: 2 },
        { date: "2024-05-12", screens: 6 },
        { date: "2024-05-13", screens: 5 },
        { date: "2024-05-14", screens: 4 },
        { date: "2024-05-15", screens: 3 },
        { date: "2024-05-16", screens: 4 },
        { date: "2024-05-17", screens: 5 },
        { date: "2024-05-18", screens: 6 },
        { date: "2024-05-19", screens: 4 },
        { date: "2024-05-20", screens: 3 },
        { date: "2024-05-21", screens: 2 },
        { date: "2024-05-22", screens: 4 },
        { date: "2024-05-23", screens: 5 },
        { date: "2024-05-24", screens: 3 },
        { date: "2024-05-25", screens: 6 },
        { date: "2024-05-26", screens: 4 },
        { date: "2024-05-27", screens: 3 },
        { date: "2024-05-28", screens: 5 },
        { date: "2024-05-29", screens: 2 },
        { date: "2024-05-30", screens: 4 },
        { date: "2024-05-31", screens: 3 }
      ]
    };
  }
}

const getTicketsStatus = async () => {
  try {
    const response = await api.get('/tickets/statistic/status-counts');
    
    // Convert the response data to the required format
    console.log(response.data);
    const statusData = Object.entries(response.data).map((statusKey, statusValue) => ({
      name: statusKey,
      value: statusValue
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