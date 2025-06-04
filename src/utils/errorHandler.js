// errorHandler.js
import { showToast } from "../components/ToastNotifier";
import { removeToken } from "./token";

export const classifyError = (error) => {
  if (!error.response) {
    return error.code === 'ECONNABORTED' ? 'timeout' : 'network';
  }

  const { status } = error.response;

  if (status === 401 || status === 403) return "auth";
  if (status === 422 || status === 400) return "validation";
  if (status >= 500) return "server";

  return "unknown";
};

export const handleAuthError = (error, navigate) => {
  // showErrorMessage(`There is an error: ${error.response?.status}`);
  const status = error.response?.status;

  // window.location.reload();

  if (status === 401) {
    showErrorMessage('Your session has expired. Please log in again.');
    removeToken();
    navigate('/login');
  } else if (status === 403) {
    if (process.env.REACT_APP_NODE_ENV === 'development') {
      console.log(error);
    }
    // showErrorMessage('Your unauthorized for this type of action');
  }
};

export const handleValidationError = (error, setFormErrors) => {
  const errors = error.response?.data?.errors || {};
  if (setFormErrors && typeof setFormErrors === "function") {
    setFormErrors(errors);
  } else {
    // Default behavior if no form error handler provided
    const firstError = Object.values(errors)[0]?.[0];
    if (firstError) {
      showErrorMessage(`Validation error: ${firstError}`);
    }
  }
};

function showErrorMessage(message) {
  showToast(message, 'error');
} 