// axios.jsx
import axios from "axios";
import { getToken } from "../utils/token";
import { classifyError, handleAuthError, handleValidationError } from "../utils/errorHandler";
import { navigate } from "../utils/navigationService";
import { showToast } from "../components/ToastNotifier";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "/api",
  withCredentials: true,
  timeout: 10000,
});

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

  return config;
}, (error) => Promise.reject(error));

let serverErrorNotificationShown = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      if (!serverErrorNotificationShown) {
        serverErrorNotificationShown = true;

        showToast("Network error. Please try again later.", "error");
        navigate('/server-error');
      }
      return Promise.reject({
        ...error,
        isNetworkError: true,
        userMessage: 'Service unavailable. Please try again later.'
      });
    }

    const errorType = classifyError(error);

    switch (errorType) {
      case "auth":
        // handleAuthError(error, navigate);
        break;
      case "validation":
        // handleValidationError(error);
        break;
      case "server":
        // For server errors (500+), show a generic error message
        if (!serverErrorNotificationShown) {
          showToast('Something went wrong on our end. We\'re working to fix it.', 'error');
          serverErrorNotificationShown = true;
        }
        break;
      default:
        showToast('Connection Error', 'error');
        console.error("Unhandled error type:", error);
    }

    return Promise.reject(error);
  }
);

export default api;