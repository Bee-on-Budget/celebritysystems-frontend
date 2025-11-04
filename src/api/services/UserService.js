import axios from "../axios";

const API_URL = "/users";

export const getAllUsers = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error fetching users";
    }
};

export const updateUser = async (id, userData) => {
    try {
        const response = await axios.put(`${API_URL}/id/${id}`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error updating user";
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error deleting user";
    }
};

export const resetUserPassword = async (id, newPassword) => {
    try {
        const response = await axios.put(`${API_URL}/id/${id}/reset-password`, {
            newPassword: newPassword
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.response?.data?.message || "Error resetting password";
    }
};

export const getUsersPaginated = async (page = 0, size = 10) => {
    try {
        const response = await axios.get(`${API_URL}/paginated`, {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error fetching users (paginated)";
    }
};