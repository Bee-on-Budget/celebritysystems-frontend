import api from "../../api/axios";

export const createCompany = (data) => api.post("/company", data);

// GET endpoints
export const getAllCompanies = async (params = {}) => {
    try {
        const response = await api.get('/company/paginated', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error fetching companies";
    }
};

export const getCompaniesFoo = async () => {
    try {
        const response = await api.get('/company');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error fetching companies";
    }
};

export const deleteCompany = (id) => api.delete(`/company/${id}`);

// Ensure we return the response data for details views
export const getCompanyById = async (id) => {
    const response = await api.get(`/company/id/${id}`);
    return response.data;
};

export const getCompanyByName = (name) => api.get(`/company/name/${name}`);

// Update company
export const updateCompany = async (id, data) => {
    try {
        const response = await api.put(`/company/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error updating company";
    }
};

// Search companies by name
export const searchCompanies = async (name) => {
    try {
        const response = await api.get(`/company/search/${name}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to search companies";
    }
};
