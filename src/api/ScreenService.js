import api from "./axios";

export const createScreen = async (formData) => {
    try {
        const response = await api.post(`/screens`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error creating screen";
    }
};

export const createModules = async (moduleData) => {
    console.log("Create Module");
    console.log(moduleData);
    try {
        const response = await api.post(`/module`, moduleData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error creating module";
    }
};

export const createCabinets = async (cabinetData) => {
    console.log("Create Cabinet");
    console.log(cabinetData);
    try {
        const response = await api.post(`/cabin`, cabinetData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error creating cabin";
    }
};