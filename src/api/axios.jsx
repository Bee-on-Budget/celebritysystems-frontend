// axios.jsx
import axios from "axios";
// import { getToken, removeToken } from "../utils/token";
import { getToken } from "../utils/token";
import { classifyError, handleAuthError, handleValidationError } from "../utils/errorHandler";
import { navigate } from "../utils/navigationService";
// import { showToast } from "../components/ToastNotifier";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "/api",
  withCredentials: true,
  timeout: 10000,
});

// Track if we've shown the server error notification
let serverErrorNotificationShown = false;

// Request Interceptor
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    if (process.env.REACT_APP_NODE_ENV === 'development') {
      console.debug('Auth token attached to request');
      console.log(token);
    }
  }

  // Reset server error notification for each new request
  serverErrorNotificationShown = false;

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error (server down, no internet, etc.)
    if (!error.response) {
      if (!serverErrorNotificationShown) {
        // Show a user-friendly message
        // showToast("Somthing went wrong, please try again later!!", 'error');
        serverErrorNotificationShown = true;

        // Optionally redirect to a maintenance page
        navigate('/server-error');
      }
      return Promise.reject({
        ...error,
        isNetworkError: true,
        userMessage: 'Service unavailable. Please try again later.'
      });
    }

    const errorType = classifyError(error);

    // Handle token expiration
    // if (error.response?.status === 401 && getToken()) {
    //   removeToken();
    //   handleAuthError(error, navigate);
    //   return;
    //   return Promise.reject(error);
    // }

    switch (errorType) {
      case "auth":
        handleAuthError(error, navigate);
        break;
      case "validation":
        handleValidationError(error);
        break;
      case "server":
        // For server errors (500+), show a generic error message
        // if (!serverErrorNotificationShown) {
        //   showToast('Something went wrong on our end. We\'re working to fix it.', 'error');
        //   serverErrorNotificationShown = true;
        // }
        break;
      default:
        // showToast('Connection Error', 'error');
        console.error("Unhandled error type:", error);
    }

    return Promise.reject(error);
  }
);

export default api;