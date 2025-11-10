import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { showToast, SelectionInputDialog, DropdownInput, MultiSelectionInputDialog } from '../../components';
import { createContract } from '../../api/services/ContractService';
import { searchCompanies } from '../../api/services/CompanyService';
import { getScreens } from '../../api/services/ScreenService';

const CreateContract = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    info: '',
    startContractAt: '',
    expiredAt: '',
    companyId: '',
    screenIds: [],
    supplyType: 'CELEBRITY_SYSTEMS',
    operatorType: 'OWNER',
    accountName: '',
    durationType: 'MONTHLY',
    contractValue: '',
    accountPermissions: [] 
  });

  // Options for dropdowns
  const supplyTypeOptions = [
    { value: 'CELEBRITY_SYSTEMS', label: t('contracts.supplyTypes.CELEBRITY_SYSTEMS') },
    { value: 'THIRD_PARTY', label: t('contracts.supplyTypes.THIRD_PARTY') }
  ];

  const operatorTypeOptions = [
    { value: 'OWNER', label: t('contracts.operatorTypes.OWNER') },
    { value: 'THIRD_PARTY', label: t('contracts.operatorTypes.THIRD_PARTY') }
  ];

  const durationTypeOptions = [
    { value: 'WEEKLY', label: t('contracts.durationTypes.WEEKLY') },
    { value: 'TWO_WEEKLY', label: t('contracts.durationTypes.TWO_WEEKLY') },
    { value: 'MONTHLY', label: t('contracts.durationTypes.MONTHLY') },
    { value: 'BIMONTHLY', label: t('contracts.durationTypes.BIMONTHLY') },
    { value: 'QUARTERLY', label: t('contracts.durationTypes.QUARTERLY') },
    { value: 'TWICE_A_YEAR', label: t('contracts.durationTypes.TWICE_A_YEAR') }
  ];

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedScreens, setSelectedScreens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
  const [isScreensDialogOpen, setIsScreensDialogOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Fetch companies for SelectionInputDialog
  const fetchCompanies = useCallback(async (searchQuery) => {
    try {
      const res = await searchCompanies(searchQuery);
      const companiesData = Array.isArray(res) ? res : res?.content || res?.data || [];
      return companiesData;
    } catch (error) {
      console.error("Error fetching companies:", error);
      throw error;
    }
  }, []);

  // Fetch screens for MultiSelectionInputDialog
  const fetchScreens = useCallback(async (searchQuery) => {
    try {
      const screensRes = await getScreens({ 
        page: 0, 
        size: 50,
        search: searchQuery 
      });
      
      let screensData = [];
      if (Array.isArray(screensRes)) {
        screensData = screensRes;
      } else if (screensRes?.content) {
        screensData = screensRes.content;
      } else if (screensRes?.data) {
        screensData = screensRes.data;
      } else {
        console.error('Unexpected screens response format:', screensRes);
        return [];
      }
      
      return screensData;
    } catch (error) {
      console.error('Error loading screens:', error);
      showToast(t('screens.messages.errorLoadingScreens'), 'error');
      throw error;
    }
  }, [t]);

  const handleScreenChange = (e) => {
    const selectedIds = Array.isArray(e.target.value) ? e.target.value : [];
    setForm(prev => ({
      ...prev,
      screenIds: selectedIds
    }));
    
    // Update selected screens for display
    if (selectedIds.length > 0) {
      // We'll fetch the screen names when dialog closes
      // For now, just update the count
    } else {
      setSelectedScreens([]);
    }
    
    // Clear error when screens are selected
    if (errors.screenIds) {
      setErrors(prev => ({ ...prev, screenIds: null }));
    }
  };

  const handleScreenConfirm = useCallback(async (selectedIds) => {
    // Fetch screen details for selected IDs to display names
    if (selectedIds.length > 0) {
      try {
        const allScreens = await fetchScreens('');
        const selected = allScreens.filter(screen => 
          selectedIds.includes(String(screen.id))
        );
        setSelectedScreens(selected);
      } catch (error) {
        console.error('Error fetching selected screens:', error);
      }
    } else {
      setSelectedScreens([]);
    }
  }, [fetchScreens]);

  const handleCompanyChange = (e) => {
    setForm(prev => ({ ...prev, companyId: e.target.value || '' }));
    // Clear error when company is selected
    if (errors.companyId) {
      setErrors(prev => ({ ...prev, companyId: null }));
    }
  };

  const handleCompanySelect = (item, value, label) => {
    setSelectedCompany(item);
  };

  // Get selected company display value
  const companyDisplayValue = selectedCompany 
    ? selectedCompany.name || ""
    : "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleAddAccountPermission = () => {
    setForm(prev => ({
      ...prev,
      accountPermissions: [...prev.accountPermissions, {
        accountIdentifier: '',
        canRead: true,
        canEdit: false
      }]
    }));
  };

  const handleAccountPermissionChange = (index, field, value) => {
    const updatedPermissions = [...form.accountPermissions];
    updatedPermissions[index] = {
      ...updatedPermissions[index],
      [field]: value
    };
    setForm(prev => ({
      ...prev,
      accountPermissions: updatedPermissions
    }));
    // Clear error when user starts typing
    const errorKey = `accountPermissions_${index}_accountIdentifier`;
    if (errors[errorKey] && field === 'accountIdentifier') {
      setErrors(prev => ({ ...prev, [errorKey]: null }));
    }
  };

  const handleRemoveAccountPermission = (index) => {
    const updated = [...form.accountPermissions];
    updated.splice(index, 1);
    setForm(prev => ({ ...prev, accountPermissions: updated }));
    // Clear related errors
    const errorKey = `accountPermissions_${index}_accountIdentifier`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate info
    if (!form.info.trim()) {
      newErrors.info = t('contracts.validation.infoRequired');
    }

    // Validate start date
    if (!form.startContractAt) {
      newErrors.startContractAt = t('contracts.validation.startDateRequired');
    }

    // Validate end date
    if (!form.expiredAt) {
      newErrors.expiredAt = t('contracts.validation.endDateRequired');
    } else if (form.startContractAt && new Date(form.expiredAt) <= new Date(form.startContractAt)) {
      newErrors.expiredAt = t('contracts.validation.endDateAfterStartDate');
    }

    // Validate company
    if (!form.companyId) {
      newErrors.companyId = t('contracts.validation.companyRequired');
    }

    // Validate contract value
    if (!form.contractValue) {
      newErrors.contractValue = t('contracts.validation.contractValueRequired');
    } else if (isNaN(parseFloat(form.contractValue)) || parseFloat(form.contractValue) < 0) {
      newErrors.contractValue = t('contracts.validation.contractValuePositive');
    }

    // Validate account permissions if any exist
    form.accountPermissions.forEach((perm, index) => {
      if (!perm.accountIdentifier.trim()) {
        newErrors[`accountPermissions_${index}_accountIdentifier`] = t('contracts.validation.accountIdentifierRequired');
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      showToast(t('contracts.validation.fillRequiredFields'), 'error');
      return;
    }

    setLoading(true);
    try {
      await createContract({
        ...form,
        contractValue: parseFloat(form.contractValue),
        startContractAt: form.startContractAt || null,
        expiredAt: form.expiredAt || null,
        accountName: form.accountName || null,
        accountPermissions: form.accountPermissions.map(perm => ({
          permissionName: perm.accountIdentifier,
          canRead: perm.canRead,
          canEdit: perm.canEdit
        }))
      });
      showToast(t('contracts.messages.contractCreated'));
      navigate('/contracts');
    } catch (error) {
      showToast(error.message || t('contracts.messages.errorCreatingContract'), 'error');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <h1 className="text-2xl font-semibold mb-6">{t('contracts.createContract')}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('contracts.contractForm.info')}
          name="info"
          value={form.info}
          onChange={handleChange}
          error={errors.info}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t('contracts.contractForm.startDate')}
            name="startContractAt"
            type="date"
            value={form.startContractAt}
            onChange={handleChange}
            error={errors.startContractAt}
            required
          />
          <Input
            label={t('contracts.contractForm.endDate')}
            name="expiredAt"
            type="date"
            value={form.expiredAt}
            onChange={handleChange}
            error={errors.expiredAt}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Input
            label={t('contracts.contractForm.accountName')}
            name="accountName"
            value={form.accountName}
            onChange={handleChange}
            placeholder={t('contracts.contractForm.accountNamePlaceholder')}
          />

          <div>
            <label className="block mb-2 text-sm font-medium">{t('common.company')}</label>
            <Input
              name="companyId"
              value={companyDisplayValue}
              onChange={() => {}} // Prevent direct editing
              onClick={() => setIsCompanyDialogOpen(true)}
              placeholder={t('contracts.contractForm.companyPlaceholder')}
              readOnly
              error={errors.companyId}
              required
              className="cursor-pointer"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">{t('contracts.contractForm.screens')}</label>
            <Input
              name="screenIds"
              value={selectedScreens.map(s => s.name).join(', ') || ''}
              onChange={() => {}} // Prevent direct editing
              onClick={() => setIsScreensDialogOpen(true)}
              placeholder={t('contracts.contractForm.screensPlaceholder')}
              readOnly
              error={errors.screenIds}
              className="cursor-pointer"
            />
            {form.screenIds.length > 0 && (
              <div className="mt-2 text-sm text-gray-500">
                {t('contracts.contractForm.screensSelected', { count: form.screenIds.length })}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DropdownInput
            name="supplyType"
            value={form.supplyType}
            options={supplyTypeOptions}
            onChange={handleChange}
            label={t('contracts.contractForm.supplyType')}
            error={errors.supplyType}
            required
          />
          <DropdownInput
            name="operatorType"
            value={form.operatorType}
            options={operatorTypeOptions}
            onChange={handleChange}
            label={t('contracts.contractForm.operatorType')}
            error={errors.operatorType}
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-semibold">{t('contracts.contractForm.accountPermissions')}</label>
          {form.accountPermissions.map((perm, idx) => (
            <div key={idx} className="mb-2 p-2 border rounded flex flex-col md:flex-row gap-2 items-center">
              <Input
                type="text"
                placeholder={t('contracts.contractForm.accountIdentifierPlaceholder')}
                value={perm.accountIdentifier}
                onChange={(e) => handleAccountPermissionChange(idx, 'accountIdentifier', e.target.value)}
                error={errors[`accountPermissions_${idx}_accountIdentifier`]}
                className="w-full md:w-1/2"
                required
              />
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={perm.canRead}
                    onChange={(e) => handleAccountPermissionChange(idx, 'canRead', e.target.checked)}
                  />
                  {t('common.canRead')}
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={perm.canEdit}
                    onChange={(e) => handleAccountPermissionChange(idx, 'canEdit', e.target.checked)}
                  />
                  {t('common.canEdit')}
                </label>
                
                <button
                  type="button"
                  className="text-red-500 ml-2"
                  onClick={() => handleRemoveAccountPermission(idx)}
                >
                  {t('common.remove')}
                </button>
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            onClick={handleAddAccountPermission}
            className="mt-2"
          >
            + {t('contracts.contractForm.addAccountPermission')}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DropdownInput
            name="durationType"
            value={form.durationType}
            options={durationTypeOptions}
            onChange={handleChange}
            label={t('contracts.contractForm.durationType')}
            error={errors.durationType}
            required
          />
          
          <Input
            label={t('contracts.contractForm.contractValue')}
            name="contractValue"
            type="number"
            step="0.01"
            min="0"
            value={form.contractValue}
            onChange={handleChange}
            error={errors.contractValue}
            required
          />
        </div>

        <Button type="submit" isLoading={loading} loadingText={t('common.loading')}>
          {t('contracts.createContract')}
        </Button>
      </form>

      {/* Selection Dialogs */}
      <SelectionInputDialog
        isOpen={isCompanyDialogOpen}
        onClose={() => setIsCompanyDialogOpen(false)}
        fetchItems={fetchCompanies}
        getItemLabel={(item) => item.name || String(item)}
        getItemValue={(item) => item.id}
        onChange={handleCompanyChange}
        onSelect={handleCompanySelect}
        value={form.companyId}
        id="companyId"
        label={t('common.company')}
        searchPlaceholder={t('contracts.contractForm.companyPlaceholder')}
        required
      />

      <MultiSelectionInputDialog
        isOpen={isScreensDialogOpen}
        onClose={() => setIsScreensDialogOpen(false)}
        fetchItems={fetchScreens}
        getItemLabel={(item) => item.name || String(item)}
        getItemValue={(item) => item.id}
        onChange={handleScreenChange}
        onConfirm={handleScreenConfirm}
        value={form.screenIds || []}
        id="screenIds"
        label={t('contracts.contractForm.screens')}
        searchPlaceholder={t('contracts.contractForm.screensPlaceholder')}
      />
    </div>
  );
};

export default CreateContract;