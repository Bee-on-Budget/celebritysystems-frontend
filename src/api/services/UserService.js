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

export const getUsersPaginated = async (params = {}) => {
    try {
        const {
            page = 0,
            size = 10,
            role,         // Optional: string, array, or comma-separated string
            companyId,    // Optional: string or number
            search        // Optional: string
        } = params;

        // Build query parameters with required fields
        const queryParams = {
            page,
            size
        };

        // Add optional role filter if provided and not empty
        if (role !== undefined && role !== null && role !== '') {
            if (Array.isArray(role) && role.length > 0) {
                queryParams.role = role.join(',');
            } else if (typeof role === 'string' && role.trim() !== '') {
                queryParams.role = role.trim();
            }
        }

        // Add optional companyId filter if provided and not empty
        if (companyId !== undefined && companyId !== null && companyId !== '') {
            queryParams.companyId = companyId;
        }

        // Add optional search query if provided and not empty
        if (search !== undefined && search !== null && search !== '') {
            const trimmedSearch = typeof search === 'string' ? search.trim() : String(search).trim();
            if (trimmedSearch !== '') {
                queryParams.search = trimmedSearch;
            }
        }

        const response = await axios.get(`${API_URL}/paginated`, {
            params: queryParams
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error fetching users (paginated)";
    }
};