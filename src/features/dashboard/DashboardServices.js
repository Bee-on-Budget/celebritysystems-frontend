import api from '../../api/axios';

const getCustomers = async () => {
  const users = await api.get("/users");

  const customers = users.data.filter((user) =>
    user.role === 'COMPANY'
  );

  return customers;
};

const getScreens = async () => {
  const screens = await api.get("/screens");
  return screens.data;
};

const getScreenSales = async () => {
  const sales = await api.get("/screen-sales");
  return sales.data;
};

const dashboardServices = async () => {
  const [customers, screens, sales] = await Promise.all([
    getCustomers(),
    getScreens(),
    getScreenSales()
  ]);
  return [customers, screens, sales];
};

export default dashboardServices;