import React, { useState } from "react";
import { createCompany } from "../../api/services/CompanyService";
import { Input, showToast, FormsContainer } from "../../components";

const CreateCompany = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim()) newErrors.name = "Company name is required";
    if (!form.location.trim()) newErrors.location = "Location is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s-()]{8,}$/.test(form.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await createCompany(form);
      showToast("Company created successfully", "success");
      setForm({ name: "", email: "", phone: "", location: "" });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error creating company";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormsContainer
      title="Create New Company"
      onSubmit={handleSubmit}
      actionTitle={"Create Company"}
      isLoading={loading}
    >
      <Input label="Name" name="name" value={form.name} onChange={handleChange} error={errors.name} required />
      <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required />
      <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} required />
      <Input label="Location" name="location" value={form.location} onChange={handleChange} error={errors.location} required />
    </FormsContainer>
  );
};

export default CreateCompany;
