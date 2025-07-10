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
    // console.log(salesData);
    return salesData;
  } catch (error) {
    console.log(error)
    throw error.response?.data?.message || "Faild to get screens data";
  }
}

const dashboardServices = async () => {
  const [customers, tickets, screens, revenue, sales] = await Promise.all([
    getCustomersCount(),
    getTicketsCount(),
    getScreensCount(),
    getRevenue(),
    getScreensSales(),
  ]);
  return [customers, tickets, screens, revenue, sales];
};

export default dashboardServices;