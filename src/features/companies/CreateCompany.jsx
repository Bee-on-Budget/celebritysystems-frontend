import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCompany } from "../../api/services/CompanyService";
import { Input, showToast, FormsContainer } from "../../components";
import { useTranslation } from "react-i18next";

const CreateCompany = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: ""
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9\s\-()]{8,}$/;
    const mapsUrlRegex = /^https?:\/\/(www\.)?(google\.)?maps\./i;

    if (!form.name.trim()) newErrors.name = t("companies.validationMessages.companyNameRequired");

    if (!form.email.trim()) {
      newErrors.email = t("companies.validationMessages.emailRequired");
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = t("companies.validationMessages.errorValidEmail");
    }

    if (!form.phone.trim()) {
      newErrors.phone = t("companies.validationMessages.phoneRequired");
    } else if (!phoneRegex.test(form.phone)) {
      newErrors.phone = t("companies.validationMessages.errorValidPhone");
    }

    if (!form.location.trim()) {
      newErrors.location = t("companies.validationMessages.locationRequired");
    } else if (!mapsUrlRegex.test(form.location)) {
      newErrors.location = t("companies.validationMessages.errorValidLocation");
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
      showToast(t('companies.message.companyCreated'), "success");
      setForm({ name: "", email: "", phone: "", location: "" });
      setTimeout(() => navigate('/companies'), 1000);
    } catch (err) {
      showToast(t('companies.message.errorCreatingCompany'), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormsContainer
      title={t('companies.createTitle')}
      onSubmit={handleSubmit}
      actionTitle={t('companies.actions.create')}
      isLoading={loading}
    >
      <Input
        label={t('companies.companyForm.name')}
        name="name"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
        required
      />
      <Input
        label={t('companies.companyForm.email')}
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        required
      />
      <Input
        label={t('companies.companyForm.phone')}
        name="phone"
        value={form.phone}
        onChange={handleChange}
        error={errors.phone}
        required
      />
      <Input
        label={t('companies.companyForm.location')}
        name="location"
        type="url"
        placeholder="https://www.google.com/maps/place/..."
        value={form.location}
        onChange={handleChange}
        error={errors.location}
        required
      />
    </FormsContainer>
  );
};

export default CreateCompany;
