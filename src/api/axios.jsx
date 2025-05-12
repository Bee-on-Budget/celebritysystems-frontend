import axios from 'axios';
// import { getToken } from '../utils/token';

const api = axios.create({
  baseURL: "http://localhost:8080/api", // Your Spring Boot backend URL
  withCredentials: true, // Important for cookies
});

// Request interceptor to add auth token to headers if it exists
// api.interceptors.request.use((config) => {
//   const token = getToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;
