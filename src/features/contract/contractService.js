// src/services/contract/contractService.js
import axios from "../../api/axios";

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

export const getAllContracts = async () => {
  try {
    const response = await axios.get(CONTRACT_API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error fetching contracts";
  }
};

export const getContractById = async (id) => {
  try {
    const response = await axios.get(`${CONTRACT_API_URL}/${id}`);
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
