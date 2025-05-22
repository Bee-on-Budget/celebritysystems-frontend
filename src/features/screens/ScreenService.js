// ScreenService.js
import axios from "../../api/axios";

export const createScreen = async (formData) => {
    try {
        const response = await axios.post(`/screens`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error creating screen";
    }
};

export const createModule = async (moduleData) => {
    try {
        const response = await axios.post(`/module`, moduleData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error creating module";
    }
};

export const createCabin = async (cabinData) => {
    try {
        const response = await axios.post(`/cabin`, cabinData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error creating cabin";
    }
};