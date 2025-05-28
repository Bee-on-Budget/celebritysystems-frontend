import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { showToast } from '../../components/ToastNotifier';
import { createContract } from './contractService';
import { getAllCompanies } from '../../features/companies/CompanyService';
import { getScreens } from '../../api/ScreenService';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash/debounce';

const CreateContract = () => {
  const [form, setForm] = useState({
    info: '',
    startContractAt: '',
    expiredAt: '',
    companyId: '',
    screenIds: [],
    supplyType: 'CELEBRITY_SYSTEMS',
    operatorType: 'OWNER',
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

  // Fetch companies on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const companiesRes = await getAllCompanies();
        // Handle both array and paginated response
        let companiesData = [];
        if (Array.isArray(companiesRes)) {
          companiesData = companiesRes;
        } else if (companiesRes?.content) {
          companiesData = companiesRes.content;
        } else if (companiesRes?.data) {
          companiesData = companiesRes.data;
        } else {
          console.error('Unexpected companies response format:', companiesRes);
          showToast('Unexpected companies data format', 'warning');
        }
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error fetching companies:', error);
        showToast('Failed to load companies', 'error');
      } finally {
        setFetching(false);
      }
    };
    fetchInitialData();
  }, []);

  // Load screens with pagination and search
  const loadScreens = async (search = '', page = 0) => {
    try {
      const screensRes = await getScreens({ 
        page, 
        size: 20,
        search 
      });
      
      // Handle both array and paginated response
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
      showToast('Failed to load screens', 'error');
      return [];
    }
  };

  // Debounced screen search function
  const debouncedLoadScreens = useMemo(
    () => debounce((inputValue, callback) => {
      loadScreens(inputValue, 0).then(options => callback(options));
    }, 500),
    []
  );

  // Load more screens when scrolling
  const handleScreenMenuScrollToBottom = useCallback(() => {
    const newPage = screenPage + 1;
    loadScreens(screenSearch, newPage);
    setScreenPage(newPage);
  }, [screenPage, screenSearch]);

  // Handle screen selection change
  const handleScreenChange = (selectedOptions) => {
    setForm(prev => ({
      ...prev,
      screenIds: selectedOptions ? selectedOptions.map(opt => opt.value) : []
    }));
  };

  // Handle company selection
  const handleCompanyChange = (selectedOption) => {
    setForm(prev => ({ ...prev, companyId: selectedOption?.value || '' }));
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Account permissions management
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

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createContract({
        ...form,
        contractValue: parseFloat(form.contractValue),
        startContractAt: form.startContractAt || null,
        expiredAt: form.expiredAt || null,
        
        accountPermissions: form.accountPermissions.map(perm => ({
          accountIdentifier: perm.accountIdentifier,
          permissions: {
            read: perm.canRead,
            write: perm.canEdit
          }
        }))
      });
      showToast('Contract created successfully!');
      navigate('/contracts');
    } catch (error) {
      showToast(error.message || 'Failed to create contract', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-4">Loading initial data...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <h1 className="text-2xl font-semibold mb-6">Create New Contract</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Contract Information"
          name="info"
          value={form.info}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            name="startContractAt"
            type="date"
            value={form.startContractAt}
            onChange={handleChange}
            required
          />
          <Input
            label="Expiry Date"
            name="expiredAt"
            type="date"
            value={form.expiredAt}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Company</label>
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
              placeholder="Select company"
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Screens</label>
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
              placeholder="Search and select screens..."
              noOptionsMessage={({ inputValue }) =>
                inputValue ? 'No screens found' : 'Start typing to search screens'
              }
              className="react-select-container"
              classNamePrefix="react-select"
            />
            {form.screenIds.length > 0 && (
              <div className="mt-2 text-sm text-gray-500">
                {form.screenIds.length} screen(s) selected
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Supply Type</label>
            <select
              className="w-full p-2 border rounded"
              name="supplyType"
              value={form.supplyType}
              onChange={handleChange}
              required
            >
              <option value="CELEBRITY_SYSTEMS">Celebrity Systems</option>
              <option value="THIRD_PARTY">Third Party</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Operator Type</label>
            <select
              className="w-full p-2 border rounded"
              name="operatorType"
              value={form.operatorType}
              onChange={handleChange}
              required
            >
              <option value="OWNER">Owner</option>
              <option value="THIRD_PARTY">Rental</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-semibold">Account Permissions</label>
          {form.accountPermissions.map((perm, idx) => (
            <div key={idx} className="mb-2 p-2 border rounded flex flex-col md:flex-row gap-2 items-center">
              <Input
                type="text"
                placeholder="Account email or username"
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
                  Read
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={perm.canEdit}
                    onChange={(e) => handleAccountPermissionChange(idx, 'canEdit', e.target.checked)}
                  />
                  Edit
                </label>
                
                <button
                  type="button"
                  className="text-red-500 ml-2"
                  onClick={() => handleRemoveAccountPermission(idx)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            onClick={handleAddAccountPermission}
            className="mt-2"
          >
            + Add Account Permission
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Duration Type</label>
            <select
              className="w-full p-2 border rounded"
              name="durationType"
              value={form.durationType}
              onChange={handleChange}
              required
            >
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>
          
          <Input
            label="Contract Value ($)"
            name="contractValue"
            type="number"
            step="0.01"
            value={form.contractValue}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit" isLoading={loading}>
          Create Contract
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