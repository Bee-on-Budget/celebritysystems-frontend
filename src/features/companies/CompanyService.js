// src/features/companies/CompanyService.js
import axios from "../../api/axios";

export const createCompany = (data) => axios.post("/company", data);
export const getAllCompanies = () => axios.get("/company");
export const deleteCompany = (id) => axios.delete(`/company/${id}`);
export const getCompanyById = (id) => axios.get(`/company/id/${id}`);
export const getCompanyByName = (name) => axios.get(`/company/name/${name}`);
