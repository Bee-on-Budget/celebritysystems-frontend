import api from "../../api/axios";

export const createCompany = (data) => api.post("/company", data);
export const getAllCompanies = () => api.get("/company");
export const deleteCompany = (id) => api.delete(`/company/${id}`);
export const getCompanyById = (id) => api.get(`/company/id/${id}`);
export const getCompanyByName = (name) => api.get(`/company/name/${name}`);
