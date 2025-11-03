// src/features/subcontract/SubContractService.js
import api from "../axios";

// GET endpoints
export const getSubContracts = async (params = {}) => {
    try {
        const response = await api.get('/subcontract', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error fetching subcontracts";
    }
};

export const getSubContractById = async (id) => {
    try {
        const response = await api.get(`/subcontracts/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error fetching subcontract";
    }
};

export const searchSubContracts = async (query) => {
    try {
        const response = await api.get('/subcontract/search', { 
            params: { query } 
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error searching subcontracts";
    }
};

// POST endpoint
export const createSubContract = async (subContractData) => {
    try {
        console.log(subContractData);
        const response = await api.post('/subcontract', subContractData);
        return response.data;
    } catch (error) {
        console.error('Error details:', error);
        throw error.response?.data?.message || error.message || "Error creating subcontract";
    }
};

// PUT endpoint
export const updateSubContract = async (id, subContractData) => {
    try {
        const payload = {
            mainCompanyId: subContractData.mainCompanyId,
            controllerCompanyId: subContractData.controllerCompanyId,
            contractId: subContractData.contractId,
            createdAt: subContractData.createdAt,
            expiredAt: subContractData.expiredAt
        };
        const response = await api.put(`/subcontracts/${id}`, payload);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error updating subcontract";
    }
};

// DELETE endpoint
export const deleteSubContract = async (id) => {
    try {
        const response = await api.delete(`/subcontract/${id}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Error deleting subcontract";
        throw new Error(errorMessage);
    }
};

// Additional endpoints as needed
export const getSubContractsByCompany = async (companyId) => {
    try {
        const response = await api.get(`/subcontracts/company/${companyId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error fetching company subcontracts";
    }
};

export const getSubContractsByContract = async (contractId) => {
    try {
        const response = await api.get(`/subcontracts/contract/${contractId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error fetching contract subcontracts";
    }
};