import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Input from '../../components/Input';
import { showToast, SelectionInputDialog, DropdownInput, MultiSelectionInputDialog, FormsContainer } from '../../components';
import { createContract } from '../../api/services/ContractService';
import { searchCompanies } from '../../api/services/CompanyService';
import { getScreenWithoutContracts } from '../../api/services/ScreenService';

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
  const [allScreensWithoutContracts, setAllScreensWithoutContracts] = useState([]);
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

  // Fetch all screens without contracts on component mount
  useEffect(() => {
    const loadScreensWithoutContracts = async () => {
      try {
        const screensRes = await getScreenWithoutContracts();
        
        let screensData = [];
        if (Array.isArray(screensRes)) {
          screensData = screensRes;
        } else if (screensRes?.content) {
          screensData = screensRes.content;
        } else if (screensRes?.data) {
          screensData = screensRes.data;
        } else {
          console.error('Unexpected screens response format:', screensRes);
          screensData = [];
        }
        
        setAllScreensWithoutContracts(screensData);
      } catch (error) {
        console.error('Error loading screens without contracts:', error);
        showToast(t('screens.messages.errorLoadingScreens'), 'error');
      }
    };

    loadScreensWithoutContracts();
  }, [t]);

  // Filter screens without contracts based on search query
  const fetchScreens = useCallback(async (searchQuery) => {
    try {
      // If no search query, return all screens without contracts
      if (!searchQuery || searchQuery.trim() === '') {
        return allScreensWithoutContracts;
      }

      // Filter screens client-side based on search query
      const query = searchQuery.toLowerCase().trim();
      const filteredScreens = allScreensWithoutContracts.filter(screen => {
        const screenName = screen.name?.toLowerCase() || '';
        return screenName.includes(query);
      });

      return filteredScreens;
    } catch (error) {
      console.error('Error filtering screens:', error);
      return [];
    }
  }, [allScreensWithoutContracts]);

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
    // Get screen details for selected IDs from the stored screens
    if (selectedIds.length > 0) {
      try {
        const selected = allScreensWithoutContracts.filter(screen => 
          selectedIds.includes(String(screen.id))
        );
        setSelectedScreens(selected);
      } catch (error) {
        console.error('Error getting selected screens:', error);
      }
    } else {
      setSelectedScreens([]);
    }
  }, [allScreensWithoutContracts]);

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
      showToast(t('contracts.messages.contractCreated'), 'success');
      navigate('/contracts');
    } catch (error) {
      const errorMessage = typeof error === 'string' 
        ? error 
        : error?.message || error?.response?.data?.message || t('contracts.messages.errorCreatingContract');
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FormsContainer
        title={t('contracts.createContract')}
        onSubmit={handleSubmit}
        actionTitle={t('contracts.createContract')}
        isLoading={loading}
      >
        {/* Full width fields on mobile, 2 columns on desktop */}
        <div className="col-span-1 md:col-span-2 w-full">
          <Input
            label={t('contracts.contractForm.info')}
            name="info"
            value={form.info}
            onChange={handleChange}
            error={errors.info}
            required
          />
        </div>

        {/* Date fields - stack on mobile, side by side on tablet+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full col-span-1 md:col-span-2">
          <div className="w-full">
            <Input
              label={t('contracts.contractForm.startDate')}
              name="startContractAt"
              type="date"
              value={form.startContractAt}
              onChange={handleChange}
              error={errors.startContractAt}
              required
            />
          </div>
          <div className="w-full">
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
        </div>

        {/* Account name - full width */}
        <div className="col-span-1 md:col-span-2 w-full">
          <Input
            label={t('contracts.contractForm.accountName')}
            name="accountName"
            value={form.accountName}
            onChange={handleChange}
            placeholder={t('contracts.contractForm.accountNamePlaceholder')}
          />
        </div>

        {/* Company and Screens - stack on mobile, side by side on tablet+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full col-span-1 md:col-span-2">
          <div className="w-full">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {t('common.company')}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              name="companyId"
              value={companyDisplayValue}
              onChange={() => {}} // Prevent direct editing
              onClick={() => setIsCompanyDialogOpen(true)}
              placeholder={t('contracts.contractForm.companyPlaceholder')}
              readOnly
              error={errors.companyId}
              required
              className="cursor-pointer bg-white"
            />
          </div>

          <div className="w-full">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {t('contracts.contractForm.screens')}
            </label>
            <Input
              name="screenIds"
              value={selectedScreens.map(s => s.name).join(', ') || ''}
              onChange={() => {}} // Prevent direct editing
              onClick={() => setIsScreensDialogOpen(true)}
              placeholder={t('contracts.contractForm.screensPlaceholder')}
              readOnly
              error={errors.screenIds}
              className="cursor-pointer bg-white"
            />
            {form.screenIds.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                {t('contracts.contractForm.screensSelected', { count: form.screenIds.length })}
              </div>
            )}
          </div>
        </div>

        {/* Supply Type and Operator Type - stack on mobile, side by side on tablet+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full col-span-1 md:col-span-2">
          <div className="w-full">
            <DropdownInput
              name="supplyType"
              value={form.supplyType}
              options={supplyTypeOptions}
              onChange={handleChange}
              label={t('contracts.contractForm.supplyType')}
              error={errors.supplyType}
              required
            />
          </div>
          <div className="w-full">
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
        </div>

        {/* Account Permissions - full width */}
        <div className="col-span-1 md:col-span-2 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              {t('contracts.contractForm.accountPermissions')}
            </label>
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium flex items-center justify-center gap-2"
              onClick={handleAddAccountPermission}
            >
              <span>+</span>
              <span>{t('contracts.contractForm.addAccountPermission')}</span>
            </button>
          </div>
          
          <div className="space-y-3">
            {form.accountPermissions.map((perm, idx) => (
              <div key={idx} className="p-3 sm:p-4 border border-gray-200 rounded-lg bg-gray-50/50 w-full">
                <div className="flex flex-col gap-3 w-full">
                  {/* Account Identifier - full width */}
                  <div className="w-full">
                    <Input
                      type="text"
                      placeholder={t('contracts.contractForm.accountIdentifierPlaceholder')}
                      value={perm.accountIdentifier}
                      onChange={(e) => handleAccountPermissionChange(idx, 'accountIdentifier', e.target.value)}
                      error={errors[`accountPermissions_${idx}_accountIdentifier`]}
                      className="w-full"
                      required
                    />
                  </div>
                  
                  {/* Permissions and Remove button - responsive layout */}
                  <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 w-full">
                    <div className="flex flex-wrap items-center gap-4">
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={perm.canRead}
                          onChange={(e) => handleAccountPermissionChange(idx, 'canRead', e.target.checked)}
                          className="cursor-pointer w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span>{t('common.canRead')}</span>
                      </label>
                      
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={perm.canEdit}
                          onChange={(e) => handleAccountPermissionChange(idx, 'canEdit', e.target.checked)}
                          className="cursor-pointer w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span>{t('common.canEdit')}</span>
                      </label>
                    </div>
                    
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 border border-red-200 rounded-md hover:bg-red-50 transition-colors whitespace-nowrap self-start xs:self-auto"
                      onClick={() => handleRemoveAccountPermission(idx)}
                    >
                      {t('common.remove')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {form.accountPermissions.length === 0 && (
              <div className="text-center py-6 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                {t('contracts.contractForm.noAccountPermissions')}
              </div>
            )}
          </div>
        </div>

        {/* Duration Type and Contract Value - stack on mobile, side by side on tablet+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full col-span-1 md:col-span-2">
          <div className="w-full">
            <DropdownInput
              name="durationType"
              value={form.durationType}
              options={durationTypeOptions}
              onChange={handleChange}
              label={t('contracts.contractForm.durationType')}
              error={errors.durationType}
              required
            />
          </div>
          
          <div className="w-full">
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
        </div>
      </FormsContainer>

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
    </>
  );
};

export default CreateContract;