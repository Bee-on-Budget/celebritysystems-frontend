import React, { useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaUserTag } from 'react-icons/fa';
import Input from "../../components/Input";
import DropdownInput from "../../components/DropdownInput";
import { createUser } from "../../api/creation";
import { showToast } from "../../components/ToastNotifier";
import { searchCompanies } from "../../api/services/CompanyService";
import MultiSearchBar from "../../components/MultiSearchBar";
import { CustomCheckbox, FormsContainer } from "../../components";
import { useTranslation } from "react-i18next";

const AddUserToCompany = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [searchedCompanies, setSearchedCompanies] = useState([]);
  // const [selectedCompany, setSelectedCompany] = useState(null);
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
        showToast(t("companoes.messages.errorSearchingCompanies"), "error");
        return [];
      }
    },
    [t]
  );

  const handleCompanySelect = (companyName) => {
    const company = searchedCompanies.find(c => c.name === companyName);
    if (company) {
      // setSelectedCompany(company);
      setForm(prev => ({ ...prev, companyId: company.id }));
      if (errors.companyId) setErrors({ ...errors, companyId: null });
    }
  };

  const handleOnClear = () => {
    // setSelectedCompany(null);
    setForm(prev => ({ ...prev, companyId: "" }));
    setSearchedCompanies([]);
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.companyId) newErrors.companyId = t("companies.validationMessages.companyRequired");
    if (!form.fullName.trim()) newErrors.fullName = t("companies.validationMessages.fullNameRequired");
    if (!form.name.trim()) newErrors.name = t("companies.validationMessages.usernameRequired");
    if (!form.email.trim()) newErrors.email = t("companies.validationMessages.emailRequired");
    else if (!emailRegex.test(form.email)) newErrors.email = t("companies.validationMessages.errorValidEmail");
    if (!form.password) newErrors.password = t("companies.validationMessages.passwordRequired");
    else if (form.password.length < 8) newErrors.password = t("companies.validationMessages.errorValidPassword");
    if (!form.role) newErrors.role = t("companies.validationMessages.roleRequired");

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
      showToast(t('companies.messages.userCreated'), "success");
      navigate('/companies');
    } catch (error) {
      showToast(t('companies.messages.errorCreatingUser'), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormsContainer
      title={t('companies.addUserToCompanyTitle')}
      onSubmit={handleSubmit}
      isLoading={loading}
      actionTitle={t('companies.actions.addUser')}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('companies.company')} <span className="text-red-500">*</span>
          </label>
          <MultiSearchBar
            onSearch={handleSearch}
            onSelectResult={handleCompanySelect}
            onClear={handleOnClear}
            placeholder="Search and select a company"
          />
          {/* {selectedCompany && (
              <div className="mt-2 text-sm text-gray-600">
                Selected: {selectedCompany.name}
              </div>
            )} */}
          {errors.companyId && (
            <p className="mt-1 text-sm text-red-600">{errors.companyId}</p>
          )}
        </div>

        <Input
          label={t('companies.userForm.fullName')}
          name="fullName"
          type="text"
          icon={<FaIdCard className="text-gray-400" />}
          value={form.fullName}
          onChange={handleChange}
          error={errors.fullName}
          placeholder={t('companies.userForm.fullNamePlaceholder')}
          required
        />

        <Input
          label={t('companies.userForm.username')}
          name="name"
          type="text"
          icon={<FaUser className="text-gray-400" />}
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          placeholder={t('companies.userForm.usernamePlaceholder')}
          required
        />
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <Input
          label={t('companies.userForm.email')}
          name="email"
          type="email"
          icon={<FaEnvelope className="text-gray-400" />}
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          placeholder={t('companies.userForm.emailPlaceholder')}
          required
        />

        <Input
          label={t('companies.userForm.password')}
          name="password"
          type="password"
          icon={<FaLock className="text-gray-400" />}
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          placeholder={t('companies.userForm.passwordPlaceholder')}
          required
        />

        <DropdownInput
          label={t('companies.userForm.role')}
          name="role"
          value={form.role}
          onChange={handleChange}
          icon={<FaUserTag className="text-gray-400" />}
          options={[
            { value: "COMPANY", label: t('companies.userForm.roles.COMPANY') },

          ]}
        />

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            {t('companies.userForm.permissions')}
          </label>
          <CustomCheckbox
            id="canRead"
            name="canRead"
            label={t('companies.userForm.canRead')}
            checked={form.canRead}
            onChange={handleChange}
          />
          <CustomCheckbox
            id="canEdit"
            name="canEdit"
            label={t('companies.userForm.canEdit')}
            checked={form.canEdit}
            onChange={handleChange}
          />
        </div>
      </div>
    </FormsContainer>
  );
};

export default AddUserToCompany;