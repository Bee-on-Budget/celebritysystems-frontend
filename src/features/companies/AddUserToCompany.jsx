import React, { useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaUserTag } from 'react-icons/fa';
import Input from "../../components/Input";
import DropdownInput from "../../components/DropdownInput";
import { createUser } from "../../api/creation";
import { showToast } from "../../components/ToastNotifier";
import { searchCompanies } from "../../api/services/CompanyService";
import MultiSearchBar from "../../components/MultiSearchBar";
import { FormsContainer } from "../../components";

const AddUserToCompany = () => {
  const [loading, setLoading] = useState(false);
  const [searchedCompanies, setSearchedCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [form, setForm] = useState({
    companyId: "",
    name: "",
    email: "",
    password: "",
    fullName: "",
    role: "COMPANY",
    canRead: false,
    canEdit: false,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleSearch = useCallback(
    async (query) => {
      if (!query.trim()) {
        setSearchedCompanies([]);
        return [];
      }
      try {
        const results = await searchCompanies(query);
        setSearchedCompanies(results || []);
        return (results || []).map((company) => company.name);
      } catch (e) {
        showToast("Failed to search for companies.", "error");
        return [];
      }
    },
    []
  );

  const handleCompanySelect = (companyName) => {
    const company = searchedCompanies.find(c => c.name === companyName);
    if (company) {
      setSelectedCompany(company);
      setForm(prev => ({ ...prev, companyId: company.id }));
      if (errors.companyId) setErrors({ ...errors, companyId: null });
    }
  };

  const handleOnClear = () => {
    setSelectedCompany(null);
    setForm(prev => ({ ...prev, companyId: "" }));
    setSearchedCompanies([]);
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.companyId) newErrors.companyId = 'Please select a company';
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.name.trim()) newErrors.name = 'Username is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(form.email)) newErrors.email = 'Invalid email format';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!form.role) newErrors.role = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        email: form.email,
        username: form.name,
        password: form.password,
        fullName: form.fullName,
        role: form.role.toUpperCase(),
        canRead: form.canRead,
        canEdit: form.canEdit,
        company: {
          id: parseInt(form.companyId),
        },
      };

      await createUser(payload);
      showToast("User added to company successfully!", "success");
      setTimeout(() => navigate('/companies'), 1500);
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to create user", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormsContainer
      title="Add User to a Company"
      onSubmit={handleSubmit}
      isLoading={loading}
      actionTitle="Add User to Company"
    >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company <span className="text-red-500">*</span>
            </label>
            <MultiSearchBar
              onSearch={handleSearch}
              onSelectResult={handleCompanySelect}
              onClear={handleOnClear}
              placeholder="Search and select a company"
            />
            {selectedCompany && (
              <div className="mt-2 text-sm text-gray-600">
                Selected: {selectedCompany.name}
              </div>
            )}
            {errors.companyId && (
              <p className="mt-1 text-sm text-red-600">{errors.companyId}</p>
            )}
          </div>

          <Input
            label="Full Name"
            name="fullName"
            type="text"
            icon={<FaIdCard className="text-gray-400" />}
            value={form.fullName}
            onChange={handleChange}
            error={errors.fullName}
            placeholder="Enter user's full name"
            required
          />

          <Input
            label="Username"
            name="name"
            type="text"
            icon={<FaUser className="text-gray-400" />}
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Enter username"
            required
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Input
            label="Email"
            name="email"
            type="email"
            icon={<FaEnvelope className="text-gray-400" />}
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="user@company.com"
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            icon={<FaLock className="text-gray-400" />}
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Minimum 8 characters"
            required
          />

          <DropdownInput
            label="User Role"
            name="role"
            value={form.role}
            onChange={handleChange}
            icon={<FaUserTag className="text-gray-400" />}
            options={[
              { value: "COMPANY", label: "Company User" },

            ]}
          />

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Permissions
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="canRead"
                name="canRead"
                checked={form.canRead}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="canRead" className="ml-2 block text-sm text-gray-700">
                Can Read
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="canEdit"
                name="canEdit"
                checked={form.canEdit}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="canEdit" className="ml-2 block text-sm text-gray-700">
                Can Edit
              </label>
            </div>
          </div>
        </div>
    </FormsContainer>
  );
};

export default AddUserToCompany;