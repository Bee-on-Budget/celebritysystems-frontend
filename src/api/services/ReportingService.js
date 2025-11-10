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

export const getDailyActivity = async ({ startDate, endDate }) => {
    try {
        const response = await api.get(`${REPORT_URL}/daily-activity`, {
            params: { startDate, endDate }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error fetching daily activity";
    }
};

export const getTicketAnalaticSummary = async ({ screenIds = [], startDate, endDate } = {}) => {
    try {
        const params = new URLSearchParams();
        
        if (startDate) {
            params.append('startDate', startDate);
        }
        
        if (endDate) {
            params.append('endDate', endDate);
        }
        
        // Add screenIds as multiple parameters without brackets
        if (screenIds && screenIds.length > 0) {
            screenIds.forEach((id) => {
                params.append('screenIds', id);
            });
        }
        
        const queryString = params.toString();
        const url = queryString 
            ? `/tickets/analytics/summary?${queryString}`
            : '/tickets/analytics/summary';
        
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error fetching ticket analytics summary";
    }
};

export const getScreensHistory = async ({ screenIds = [], startDate, endDate }) => {
    try {
        const params = new URLSearchParams();
        
        if (startDate) {
            params.append('startDate', startDate);
        }
        
        if (endDate) {
            params.append('endDate', endDate);
        }
        
        // Add screenIds as multiple parameters without brackets
        if (screenIds && screenIds.length > 0) {
            screenIds.forEach((id) => {
                params.append('screenIds', id);
            });
        }
        
        const response = await api.get(`${REPORT_URL}/screens/history?${params.toString()}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error fetching screens history";
    }
};