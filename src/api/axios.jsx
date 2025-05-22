import axios from 'axios';
import { getToken } from '../utils/token';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "/api",
  withCredentials: true,
});

// Request interceptor to add auth token to headers if it exists
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    console.log(token);
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log("No Token!!!!");
  }
  return config;
});

export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};


export default api;
