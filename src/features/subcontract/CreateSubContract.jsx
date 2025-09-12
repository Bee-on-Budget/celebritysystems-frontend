import React, { useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';
import { Input, MultiSearchBar, showToast, FormsContainer } from "../../components";
import { createSubContract } from "../../api/services/SubContractService";
import { searchCompanies } from "../../api/services/CompanyService";
import { searchContractsByCompanyName } from "../../api/services/ContractService";
import { useTranslation } from "react-i18next";

const CreateSubContract = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [contractsLoading, setContractsLoading] = useState(false);
  const [searchedCompanies, setSearchedCompanies] = useState([]);
  const [searchedContracts, setSearchedContracts] = useState([]);
  const [selectedMainCompany, setSelectedMainCompany] = useState(null);

  const [form, setForm] = useState({
    main_company_id: "",
    controller_company_id: "",
    contract_id: "",
    created_at: "",
    expired_at: ""
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleSearchCompanies = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchedCompanies([]);
      return [];
    }
    try {
      const results = await searchCompanies(query);
      setSearchedCompanies(results || []);
      return (results || []).map((company) => company.name);
    } catch (e) {
      showToast(t('subcontracts.messages.errorLoadingCompanies'), "error");
      return [];
    }
  }, [t]);

  const handleSearchContracts = useCallback(async (query) => {
    if (!selectedMainCompany) {
      setErrors((prev) => ({ ...prev, contract_id: t('subcontracts.messages.errorSelectMainCompany') }));
      return [];
    }
    if (!query.trim()) {
      return searchedContracts.map(contract =>
        `ID: ${contract.id} - ${contract.info || 'Unnamed Contract'}`
      );
    }

    const filtered = searchedContracts.filter(contract =>
      contract.id.toString().includes(query) ||
      (contract.info && contract.info.toLowerCase().includes(query.toLowerCase()))
    );
    return filtered.map(contract =>
      `ID: ${contract.id} - ${contract.info || 'Unnamed Contract'}`
    );
  }, [selectedMainCompany, searchedContracts, setErrors, t]);

  const handleMainCompanySelect = async (companyName) => {
    const company = searchedCompanies.find(c => c.name === companyName);
    if (company) {
      setSelectedMainCompany(company);
      setForm(prev => ({ ...prev, main_company_id: company.id }));
      if (errors.main_company_id) setErrors({ ...errors, main_company_id: null });

      // Reset contract selection when changing company
      setForm(prev => ({ ...prev, contract_id: "" }));

      // Load contracts for the selected company
      try {
        setContractsLoading(true);
        const contracts = await searchContractsByCompanyName(company.name);
        setSearchedContracts(contracts || []);
      } catch (error) {
        showToast(t('subcontracts.messages.errorLoadingContracts'), "error");
      } finally {
        setContractsLoading(false);
      }
    }
  };

  const handleControllerCompanySelect = (companyName) => {
    const company = searchedCompanies.find(c => c.name === companyName);
    if (company) {
      setForm(prev => ({ ...prev, controller_company_id: company.id }));
      if (errors.controller_company_id) setErrors({ ...errors, controller_company_id: null });
    }
  };

  const handleContractSelect = (contractDisplay) => {
    // Extract ID from the display string "ID: 123 - Contract Info"
    const idMatch = contractDisplay.match(/^ID: (\d+)/);
    if (idMatch) {
      const contractId = parseInt(idMatch[1]);
      const contract = searchedContracts.find(c => c.id === contractId);

      if (contract) {
        setForm(prev => ({ ...prev, contract_id: contract.id }));
        if (errors.contract_id) setErrors({ ...errors, contract_id: null });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.main_company_id) newErrors.main_company_id = t('subcontracts.validationMessages.mainCompanyRequired');
    if (!form.controller_company_id) newErrors.controller_company_id = t('subcontracts.validationMessages.controllerCompanyRequired');
    if (!form.contract_id) newErrors.contract_id = t('subcontracts.validationMessages.contractRequired');
    if (!form.created_at) newErrors.created_at = t('subcontracts.validationMessages.creationRequired');
    if (!form.expired_at) newErrors.expired_at = t('subcontracts.validationMessages.expirationRequired');
    if (form.expired_at && form.created_at && new Date(form.expired_at) <= new Date(form.created_at)) {
      newErrors.expired_at = t('subcontracts.validationMessages.expireationError');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await createSubContract({
        mainCompanyId: parseInt(form.main_company_id),
        controllerCompanyId: parseInt(form.controller_company_id),
        contractId: parseInt(form.contract_id),
        createdAt: form.created_at,
        expiredAt: form.expired_at
      });

      showToast(t('subcontracts.messages.subcontractCreated'), "success");
      navigate('/subcontract');
    } catch (error) {
      showToast(t('subcontracts.messages.errorCreatingSubcontract'), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormsContainer
      title={t('subcontracts.createSubcontractTitle')}
      onSubmit={handleSubmit}
      isLoading={loading}
      actionTitle={t('subcontracts.actions.create')}
    >
      <div className="space-y-6">
        {/* Main Company Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('subcontracts.subcontractForm.mainCompany')} <span className="text-red-500">*</span>
          </label>
          <MultiSearchBar
            onSearch={handleSearchCompanies}
            onSelectResult={handleMainCompanySelect}
            onClear={() => {
              setSelectedMainCompany(null);
              setForm(prev => ({ ...prev, main_company_id: "" }));
              setSearchedContracts([]);
            }}
            placeholder={t('subcontracts.subcontractForm.mainCompanyPlaceholder')}
          />
          {errors.main_company_id && (
            <p className="mt-1 text-sm text-red-600">{errors.main_company_id}</p>
          )}
        </div>

        {/* Controller Company Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('subcontracts.subcontractForm.controllerCompany')} <span className="text-red-500">*</span>
          </label>
          <MultiSearchBar
            onSearch={handleSearchCompanies}
            onSelectResult={handleControllerCompanySelect}
            onClear={() => {
              setForm(prev => ({ ...prev, controller_company_id: "" }));
            }}
            placeholder={t('subcontracts.subcontractForm.controllerCompanyPlaceholder')}
          />
          {errors.controller_company_id && (
            <p className="mt-1 text-sm text-red-600">{errors.controller_company_id}</p>
          )}
        </div>

        {/* Contract Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('subcontracts.subcontractForm.contract')} <span className="text-red-500">*</span>
          </label>
          {contractsLoading ? (
            <div className="p-2 text-sm text-gray-500">Loading contracts...</div>
          ) : (
            <>
              <MultiSearchBar
                onSearch={handleSearchContracts}
                onSelectResult={handleContractSelect}
                onClear={() => {
                  setForm(prev => ({ ...prev, contract_id: "" }));
                }}
                placeholder={
                  selectedMainCompany
                    ? `${t('subcontracts.subcontractForm.contractPlaceholder')} ${selectedMainCompany.name}`
                    : t('subcontracts.messages.errorSelectMainCompany')
                }
                disabled={!selectedMainCompany}
                options={
                  searchedContracts.map(contract =>
                    `ID: ${contract.id} - ${contract.info || 'Unnamed Contract'}`
                  )
                }
              />
              {searchedContracts.length === 0 && !contractsLoading && selectedMainCompany && (
                <div className="mt-2 text-sm text-gray-500">
                  {t('subcontracts.messages.noContracts')} {selectedMainCompany.name}
                </div>
              )}
              {errors.contract_id && (
                <p className="mt-1 text-sm text-red-600">{errors.contract_id}</p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Creation Date */}
        <Input
          label={t('subcontracts.subcontractForm.startDate')}
          name="created_at"
          type="date"
          icon={<FaCalendarAlt className="text-gray-400" />}
          value={form.created_at}
          onChange={handleChange}
          error={errors.created_at}
          required
        />

        {/* Expiration Date */}
        <Input
          label={t('subcontracts.subcontractForm.endDate')}
          name="expired_at"
          type="date"
          icon={<FaCalendarAlt className="text-gray-400" />}
          value={form.expired_at}
          onChange={handleChange}
          error={errors.expired_at}
          required
        />
      </div>
    </FormsContainer>
  );
};

export default CreateSubContract;