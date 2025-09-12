import api from '../axios';

const REPORT_URL = "/reporting"

// GET endpoints
export const getReportsDashboardSummary = async (params = {}) => {
    try {
        const response = await api.get(`${REPORT_URL}/dashboard/summary`, { params });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error fetching report summury";
    }
};