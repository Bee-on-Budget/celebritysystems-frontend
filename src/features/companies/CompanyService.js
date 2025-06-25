import api from "../../api/axios";

export const createCompany = (data) => api.post("/company", data);

// GET endpoints
export const getAllCompanies = async (params = {}) => {
    try {
        const response = await api.get('/company', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error fetching company";
    }
};
export const deleteCompany = (id) => api.delete(`/company/${id}`);
export const getCompanyById = (id) => api.get(`/company/id/${id}`);
export const getCompanyByName = (name) => api.get(`/company/name/${name}`);


// Add this to your existing companyService.js
export const searchCompanies = async (name) => {
    try {
        const response = await api.get(`/company/search/${name}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to search companies";
    }
};
