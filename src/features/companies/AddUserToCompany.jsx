import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaUserTag } from 'react-icons/fa';
import Input from "../../components/Input";
import Button from "../../components/Button";
import DropdownInput from "../../components/DropdownInput";
import { createUser } from "../../api/creation";
import { showToast } from "../../components/ToastNotifier";
import { getAllCompanies } from "./CompanyService";
import MultiSearchBar from "../../components/MultiSearchBar";

const AddUserToCompany = () => {
    const [loading, setLoading] = useState(false);
    const [companies, setCompanies] = useState([]);
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

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await getAllCompanies();
                setCompanies(res.data);
            } catch (error) {
                showToast("Failed to load companies", "error");
            }
        };
        fetchCompanies();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) setErrors({ ...errors, [name]: null });
    };

    const handleCompanySearch = useCallback(
        async (query) => {
            return companies
                .filter((company) =>
                    company.name.toLowerCase().includes(query.toLowerCase())
                )
                .map((c) => c.name);
        },
        [companies]
    );

    const handleCompanySelect = (companyName) => {
        const company = companies.find(c => c.name === companyName);
        if (company) {
            setSelectedCompany(company);
            setForm(prev => ({ ...prev, companyId: company.id }));
            if (errors.companyId) setErrors({ ...errors, companyId: null });
        }
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-10 border border-gray-100">
                <div className="text-center mb-8 md:mb-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Add User to Company
                    </h1>
                    <p className="text-gray-600 sm:text-lg">
                        Create a new user account and assign them to a company
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Company <span className="text-red-500">*</span>
                                </label>
                                <MultiSearchBar
                                    onSearch={handleCompanySearch}
                                    onSelectResult={handleCompanySelect}
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
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row justify-end gap-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate(-1)}
                                disabled={loading}
                                className="w-full sm:w-auto"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                isLoading={loading}
                                className="w-full sm:w-auto px-6 py-3"
                            >
                                {loading ? 'Adding User...' : 'Add User to Company'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default AddUserToCompany;