// src/api/services/contract/contractService.js
import axios from "../axios";

const CONTRACT_API_URL = "/contracts";

export const createContract = async (contractData) => {
  try {
    const response = await axios.post(CONTRACT_API_URL, {
      ...contractData,
      contractValue: parseFloat(contractData.contractValue),
      startContractAt: contractData.startContractAt ? `${contractData.startContractAt}T00:00:00` : null,
      expiredAt: contractData.expiredAt ? `${contractData.expiredAt}T23:59:59` : null
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error creating contract";
  }
};

export const getAllContracts = async (params = {}) => {
  try {
    const response = await axios.get(`${CONTRACT_API_URL}/paginated`, params);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error fetching contracts";
  }
};

export const getContractById = async (id) => {
  try {
    const response = await axios.get(`${CONTRACT_API_URL}/${id}`, {
      params: {
        includeCompany: true,
        includeScreens: true,
        includePermissions: true
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error fetching contract";
  }
};

export const getContractsByCompany = async (companyId) => {
  try {
    const response = await axios.get(`${CONTRACT_API_URL}/company/${companyId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error fetching company contracts";
  }
};

export const getContractsByScreen = async (screenId) => {
  try {
    const response = await axios.get(`${CONTRACT_API_URL}/screen/${screenId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error fetching screen contracts";
  }
};

export const getCurrentContractForScreen = async (screenId) => {
  try {
    const response = await axios.get(`${CONTRACT_API_URL}/screen/${screenId}/current`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error fetching current contract";
  }
};

export const updateContract = async (id, contractData) => {
  try {
    const response = await axios.put(`${CONTRACT_API_URL}/${id}`, {
      ...contractData,
      contractValue: contractData.contractValue ? parseFloat(contractData.contractValue) : null,
      startContractAt: contractData.startContractAt ? `${contractData.startContractAt}T00:00:00` : null,
      expiredAt: contractData.expiredAt ? `${contractData.expiredAt}T23:59:59` : null
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error updating contract";
  }
};

export const deleteContract = async (id) => {
  try {
    const response = await axios.delete(`${CONTRACT_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error deleting contract";
  }
};

export const checkContractExists = async (companyId, screenId) => {
  try {
    const response = await axios.get(`${CONTRACT_API_URL}/exists`, {
      params: { companyId, screenId }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error checking contract existence";
  }
};

export const searchContracts = async (query) => {
  try {
    const response = await axios.get(`${CONTRACT_API_URL}/search`, {
      params: { query }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error searching contracts";
  }
};

export const getCompanyById = async (id) => {
  try {
    const response = await axios.get(`/company/id/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error fetching company";
  }
};

export const searchContractsByCompanyName = async (companyName) => {
  try {
    const response = await axios.get(`/contracts/search/company`, {
      params: { companyName }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error searching contracts by company name";
  }
};

export const getActiveScreensByCompany = async (companyId) => {
  try {
    const response = await axios.get(`${CONTRACT_API_URL}/company/${companyId}/screens/active`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error fetching active screens for company";
  }
};