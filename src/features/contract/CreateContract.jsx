import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { showToast } from '../../components/ToastNotifier';
import { createContract } from '../../api/services/ContractService';
import { getAllCompanies } from '../../api/services/CompanyService';
import { getScreens } from '../../api/services/ScreenService';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash/debounce';

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

  const [companies, setCompanies] = useState([]);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [screenPage, setScreenPage] = useState(0);
  const [screenSearch, setScreenSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const companiesRes = await getAllCompanies();
        let companiesData = [];
        if (Array.isArray(companiesRes)) {
          companiesData = companiesRes;
        } else if (companiesRes?.content) {
          companiesData = companiesRes.content;
        } else if (companiesRes?.data) {
          companiesData = companiesRes.data;
        } else {
          console.error('Unexpected companies response format:', companiesRes);
          showToast(t('contracts.messages.unexpectedDataFormat'), 'warning');
        }
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error fetching companies:', error);
        showToast(t('contracts.messages.errorLoadingCompanies'), 'error');
      } finally {
        setFetching(false);
      }
    };
    fetchInitialData();
  }, [t]);

  const loadScreens = useCallback(async (search = '', page = 0) => {
    try {
      const screensRes = await getScreens({ 
        page, 
        size: 20,
        search 
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
      
      if (page === 0) {
        setScreens(screensData);
      } else {
        setScreens(prev => [...prev, ...screensData]);
      }
      
      return screensData.map(screen => ({
        value: screen.id,
        label: `${screen.name} (${screen.location})`
      }));
    } catch (error) {
      console.error('Error loading screens:', error);
      showToast(t('screens.messages.errorLoadingScreens'), 'error');
      return [];
    }
  }, [t]);

  const debouncedLoadScreens = useMemo(
    () => debounce((inputValue, callback) => {
      loadScreens(inputValue, 0).then(options => callback(options));
    }, 500),
    [loadScreens]
  );

  const handleScreenMenuScrollToBottom = useCallback(() => {
    const newPage = screenPage + 1;
    loadScreens(screenSearch, newPage);
    setScreenPage(newPage);
  }, [screenPage, screenSearch, loadScreens]);

  const handleScreenChange = (selectedOptions) => {
    setForm(prev => ({
      ...prev,
      screenIds: selectedOptions ? selectedOptions.map(opt => opt.value) : []
    }));
  };

  const handleCompanyChange = (selectedOption) => {
    setForm(prev => ({ ...prev, companyId: selectedOption?.value || '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
  };

  const handleRemoveAccountPermission = (index) => {
    const updated = [...form.accountPermissions];
    updated.splice(index, 1);
    setForm(prev => ({ ...prev, accountPermissions: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
  

  if (fetching) return <div className="p-4">{t('common.loading')}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <h1 className="text-2xl font-semibold mb-6">{t('contracts.createContract')}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('contracts.contractForm.info')}
          name="info"
          value={form.info}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t('contracts.contractForm.startDate')}
            name="startContractAt"
            type="date"
            value={form.startContractAt}
            onChange={handleChange}
            required
          />
          <Input
            label={t('contracts.contractForm.endDate')}
            name="expiredAt"
            type="date"
            value={form.expiredAt}
            onChange={handleChange}
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
            <Select
              options={companies.map(company => ({
                value: company.id,
                label: company.name
              }))}
              value={form.companyId ? {
                value: form.companyId,
                label: companies.find(c => c.id === form.companyId)?.name || ''
              } : null}
              onChange={handleCompanyChange}
              isSearchable
              placeholder={t('contracts.contractForm.companyPlaceholder')}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">{t('contracts.contractForm.screens')}</label>
            <AsyncSelect
              isMulti
              cacheOptions
              defaultOptions
              loadOptions={debouncedLoadScreens}
              value={screens
                .filter(screen => form.screenIds.includes(screen.id))
                .map(screen => ({
                  value: screen.id,
                  label: `${screen.name} (${screen.location})`
                }))}
              onChange={handleScreenChange}
              onInputChange={newValue => setScreenSearch(newValue)}
              onMenuScrollToBottom={handleScreenMenuScrollToBottom}
              placeholder={t('contracts.contractForm.screensPlaceholder')}
              noOptionsMessage={({ inputValue }) =>
                inputValue ? t('contracts.contractForm.noScreensFound') : t('contracts.contractForm.startTypingScreens')
              }
              className="react-select-container"
              classNamePrefix="react-select"
            />
            {form.screenIds.length > 0 && (
              <div className="mt-2 text-sm text-gray-500">
                {t('contracts.contractForm.screensSelected', { count: form.screenIds.length })}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium">{t('contracts.contractForm.supplyType')}</label>
            <select
              className="w-full p-2 border rounded"
              name="supplyType"
              value={form.supplyType}
              onChange={handleChange}
              required
            >
              <option value="CELEBRITY_SYSTEMS">{t('contracts.supplyTypes.CELEBRITY_SYSTEMS')}</option>
              <option value="THIRD_PARTY">{t('contracts.supplyTypes.THIRD_PARTY')}</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">{t('contracts.contractForm.operatorType')}</label>
            <select
              className="w-full p-2 border rounded"
              name="operatorType"
              value={form.operatorType}
              onChange={handleChange}
              required
            >
              <option value="OWNER">{t('contracts.operatorTypes.OWNER')}</option>
              <option value="THIRD_PARTY">{t('contracts.operatorTypes.THIRD_PARTY')}</option>
            </select>
          </div>
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
          <div>
            <label className="block mb-2 text-sm font-medium">{t('contracts.contractForm.durationType')}</label>
            <select
              className="w-full p-2 border rounded"
              name="durationType"
              value={form.durationType}
              onChange={handleChange}
              required
            >
    <option value="WEEKLY">{t('contracts.durationTypes.WEEKLY')}</option>
<option value="TWO_WEEKLY">{t('contracts.durationTypes.TWO_WEEKLY')}</option>
<option value="MONTHLY">{t('contracts.durationTypes.MONTHLY')}</option>
<option value="BIMONTHLY">{t('contracts.durationTypes.BIMONTHLY')}</option>
<option value="QUARTERLY">{t('contracts.durationTypes.QUARTERLY')}</option>
<option value="TWICE_A_YEAR">{t('contracts.durationTypes.TWICE_A_YEAR')}</option>

            </select>
          </div>
          
          <Input
            label={t('contracts.contractForm.contractValue')}
            name="contractValue"
            type="number"
            step="0.01"
            value={form.contractValue}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit" isLoading={loading} loadingText={t('common.loading')}>
          {t('contracts.createContract')}
        </Button>
      </form>

      <style jsx global>{`
        .react-select-container .react-select__control {
          border: 1px solid #d1d5db;
          min-height: 42px;
        }
        .react-select-container .react-select__control--is-focused {
          border-color: #3b82f6;
          box-shadow: 0 0 0 1px #3b82f6;
        }
        .react-select-container .react-select__multi-value {
          background-color: #e5e7eb;
        }
      `}</style>
    </div>
  );
};

export default CreateContract;