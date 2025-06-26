// src/api/services/TicketService.js
import axios from "../axios";
import { showToast } from "../../components/ToastNotifier";

const TICKET_API_URL = "/tickets";
const ATTACHMENT_API_URL = "/attachments";

const handleApiError = (error, defaultMessage) => {
  const errorMessage = error.response?.data?.message || defaultMessage;
  showToast(errorMessage, "error");
  throw new Error(errorMessage);
};

export const getAllTickets = async () => {
  try {
    const response = await axios.get(TICKET_API_URL);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to load tickets");
  }
};

export const getTicketById = async (id) => {
  try {
    const response = await axios.get(`${TICKET_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to load ticket details");
  }
};

export const createTicket = async (ticketData) => {
  try {
    const isFormData = ticketData instanceof FormData;
    const config = isFormData ? {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    } : {};

    const response = await axios.post(TICKET_API_URL, ticketData, config);
    showToast("Ticket created successfully", "success");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to create ticket");
  }
};

export const updateTicket = async (id, ticketData) => {
  try {
    const response = await axios.put(`${TICKET_API_URL}/${id}`, ticketData);
    showToast("Ticket updated successfully", "success");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to update ticket");
  }
};

export const deleteTicket = async (id) => {
  try {
    const response = await axios.delete(`${TICKET_API_URL}/${id}`);
    showToast("Ticket deleted successfully", "success");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to delete ticket");
  }
};

export const getAttachmentById = async (id) => {
  try {
    const response = await axios.get(`${ATTACHMENT_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to load attachment");
  }
};

export const addAttachment = async (ticketId, file, note = '') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ticketId', ticketId);
    if (note) formData.append('note', note);

    const response = await axios.post(ATTACHMENT_API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    showToast("Attachment added successfully", "success");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to add attachment");
  }
};

export const deleteAttachment = async (id) => {
  try {
    const response = await axios.delete(`${ATTACHMENT_API_URL}/${id}`);
    showToast("Attachment deleted successfully", "success");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to delete attachment");
  }
};

export const prepareTicketFormData = (ticketData, files = []) => {
  const formData = new FormData();

  // Append all ticket data fields
  Object.entries(ticketData).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      formData.append(key, value);
    }
  });

  // Append files
  files.forEach(file => {
    formData.append('file', file);
  });

  return formData;
};


export const getUsersByRole = async (role) => {
    const response = await axios.get(`/users/roles/${role}`); // <-- roles not role
    return response.data;
  };
  
