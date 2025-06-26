// src/features/screen/ScreenService.js
import api from "../axios";

// GET endpoints
export const getScreens = async (params = {}) => {
    try {
        const response = await api.get('/screens', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error fetching screens";
    }
};

export const getScreenById = async (id) => {
    try {
        const response = await api.get(`/screens/screen_id/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error fetching screen";
    }
};
// Add this to your existing ScreenService.js
export const searchScreens = async (name) => {
    try {
        const response = await api.get('/screens/search', { params: { name } });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error searching screens";
    }
};

// POST endpoints (existing)
export const createScreen = async (screenData) => {
    try {
        const formData = new FormData();

        // 1. Add ALL regular fields (including empty ones)
        const fields = [
            'name', 'screenType', 'solutionTypeInScreen', 'location',
            'powerSupply', 'receivingCard', 'cable', 'powerCable', 'dataCable',
            'media', 'fan', 'powerSupplyQuantity', 'sparePowerSupplyQuantity',
            'receivingCardQuantity', 'spareReceivingCardQuantity', 'cableQuantity',
            'spareCableQuantity', 'powerCableQuantity', 'sparePowerCableQuantity',
            'dataCableQuantity', 'spareDataCableQuantity', 'mediaQuantity',
            'spareMediaQuantity', 'fanQuantity'
        ];

        fields.forEach(field => {
            formData.append(field, screenData[field] || ''); // Handle undefined
        });

        // 2. Properly handle solution-specific data
        if (screenData.solutionTypeInScreen === 'MODULE_SOLUTION') {
            if (!screenData.modulesDto) {
                throw new Error("modulesDto is required for MODULE_SOLUTION");
            }
            formData.append(
                'moduleDtoListJson',
                JSON.stringify(screenData.modulesDto.map(m => ({
                    moduleBatchNumber: m.moduleBatchNumber,
                    widthQuantity: Number(m.widthQuantity),
                    heightQuantity: Number(m.heightQuantity),
                    width: Number(m.width),
                    height: Number(m.height)
                })))
            );
        } else if (screenData.solutionTypeInScreen === 'CABINET_SOLUTION') {
            if (!screenData.cabinDtoListJson) {
                throw new Error("cabinDtoListJson is required for CABINET_SOLUTION");
            }
            formData.append('cabinDtoListJson', screenData.cabinDtoListJson);
        }

        // 3. Handle files - ensure they're proper File objects
        ['connectionFile', 'configFile', 'versionFile'].forEach(fileField => {
            if (screenData[fileField] instanceof File) {
                formData.append(fileField, screenData[fileField]);
            }
        });

        // 4. Debug before sending
        console.log('FormData contents:');
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        const response = await api.post('/screens', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error details:', error);
        throw error.response?.data?.message || error.message || "Error creating screen";
    }
};

export const createModules = async (moduleData) => {
    console.log("Create Module");
    console.log(moduleData);
    try {
        const response = await api.post('/module', moduleData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error creating module";
    }
};

export const createCabinets = async (cabinetData) => {
    console.log("Create Cabinet");
    console.log(cabinetData);
    try {
        const response = await api.post('/cabin', cabinetData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error creating cabin";
    }
};

export const deleteScreen = async (id) => {
    try {
        const response = await api.delete(`/screens/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error deleting screen";
    }
};