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