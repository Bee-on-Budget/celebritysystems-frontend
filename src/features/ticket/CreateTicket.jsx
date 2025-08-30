// src/components/tickets/CreateTicket.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createTicket, prepareTicketFormData, getUsersByRole } from "../../api/services/TicketService";
import { searchCompanies } from "../../api/services/CompanyService";
import { getScreens } from "../../api/services/ScreenService";
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash/debounce';
import { DropdownInput, Input, showToast } from "../../components";

const CreateTicket = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: "",
    serviceType: "",
    description: "",
    status: "OPEN",
    companyId: "",
    screenId: "",
    assignedToWorkerId: "",
    assignedBySupervisorId: "",
    createdBy: 1,
  });
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [screens, setScreens] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [fetching, setFetching] = useState(true);

  const MAX_FILE_SIZE_MB = 10;
  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'application/pdf'];

  const serviceTypes = [
    { value: "REGULAR_SERVICE", label: t('tickets.serviceTypes.REGULAR_SERVICE') },
    { value: "EMERGENCY_SERVICE", label: t('tickets.serviceTypes.EMERGENCY_SERVICE') },
    { value: "PREVENTIVE_MAINTENANCE", label: t('tickets.serviceTypes.PREVENTIVE_MAINTENANCE') },
    { value: "CALL_BACK_SERVICE", label: t('tickets.serviceTypes.CALL_BACK_SERVICE') },
  ];
  

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#E83D29" : provided.borderColor,
      boxShadow: state.isFocused ? "0 0 0 1px #E83D29" : provided.boxShadow,
      "&:hover": { borderColor: "#E83D29" },
      minHeight: '44px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#E83D29" : provided.backgroundColor,
      color: state.isFocused ? "#fff" : provided.color,
      "&:active": {
        backgroundColor: "#E83D29",
        color: "#fff",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#717274FF",
    }),
  }

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [workerRes, supervisorRes] = await Promise.all([
          getUsersByRole("CELEBRITY_SYSTEM_WORKER"),
          getUsersByRole("SUPERVISOR")
        ]);

        setWorkers(workerRes || []);
        setSupervisors(supervisorRes || []);

      } catch (error) {
        showToast(t('tickets.messages.errorFetchingData'), "error")
        console.error("Error fetching initial data:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchInitialData();
  }, [t]);

  // Load companies with search
  const loadCompanies = async (search = '') => {
    if (search.length > 2) {
      try {
        const res = await searchCompanies(search);
        const companiesData = Array.isArray(res) ? res : res?.content || res?.data || [];
        setCompanies(companiesData);
        return companiesData.map(company => ({
          value: company.id,
          label: company.name
        }));
      } catch (error) {
        console.error("Error loading companies:", error);
        return [];
      }
    }
  };

  // Debounced companies search
  const debouncedLoadCompanies = useMemo(
    () => debounce((inputValue, callback) => {
      loadCompanies(inputValue).then(options => callback(options));
    }, 500),
    []
  );

  // Load screens with search
  const loadScreens = async (search = '') => {
    try {
      const screensRes = await getScreens({ search });
      const screensData = Array.isArray(screensRes) ? screensRes :
        screensRes?.content || screensRes?.data || [];
      setScreens(screensData);
      return screensData.map(screen => ({
        value: screen.id,
        label: screen.name
      }));
    } catch (error) {
      console.error("Error loading screens:", error);
      return [];
    }
  };

  // Debounced screen search
  const debouncedLoadScreens = useMemo(
    () => debounce((inputValue, callback) => {
      loadScreens(inputValue).then(options => callback(options));
    }, 500),
    []
  );

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name, selectedOption) => {
    setFormData(prev => ({
      ...prev,
      [name]: selectedOption?.value || ""
    }));
  };

  // Handle file changes
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const validFiles = selected.filter(file =>
      file.size <= MAX_FILE_SIZE_MB * 1024 * 1024 &&
      ALLOWED_TYPES.includes(file.type)
    );
    setFiles(validFiles);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const ticketData = prepareTicketFormData(formData, files);
      const response = await createTicket(ticketData);
      navigate(`/tickets/${response.id}`);
    } catch (error) {
      console.error("Error creating ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (fetching) {
    return <div className="p-4 md:p-6 max-w-7xl mx-auto">{t('tickets.messages.loadingTicket')}</div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">{t('tickets.createTicket')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 bg-white p-4 md:p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Title & Service Type */}
          <div className="col-span-2 md:col-span-1">
            <Input
            label={t('tickets.ticketForm.title')}
            name={"title"}
            value={formData.title}
            onChange={handleChange}
            required
            />
            <DropdownInput
              name="serviceType"
              value={formData.serviceType}
              options={serviceTypes}
              onChange={handleChange}
              label={t('tickets.ticketForm.serviceType')}
              // error={errors.serviceType}
              required
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('tickets.ticketForm.description')}*</label>
            <textarea
              className="w-full border border-gray-300 px-3 py-2 md:px-4 md:py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          {/* Company */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('tickets.ticketForm.company')}</label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={debouncedLoadCompanies}
              value={companies.find(c => c.id === formData.companyId) ? {
                value: formData.companyId,
                label: companies.find(c => c.id === formData.companyId).name
              } : null}
              onChange={(option) => handleSelectChange('companyId', option)}
              isClearable
              placeholder={t('tickets.ticketForm.companyPlaceholder')}
              noOptionsMessage={({ inputValue }) =>
                inputValue ? t('tickets.messages.noCompaniesFound') : t('tickets.placeholders.searchCompanies')
              }
              styles={customStyles}
              className="text-sm"
            />
          </div>

          {/* Screen */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('tickets.ticketForm.screen')}</label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={debouncedLoadScreens}
              value={screens.find(s => s.id === formData.screenId) ? {
                value: formData.screenId,
                label: screens.find(s => s.id === formData.screenId).name
              } : null}
              onChange={(option) => handleSelectChange('screenId', option)}
              isClearable
              placeholder={t('tickets.ticketForm.screenPlaceholder')}
              noOptionsMessage={({ inputValue }) =>
                inputValue ? t('tickets.messages.noScreensFound') : t('tickets.placeholders.searchScreens')
              }
              className="react-select-container text-sm"
              classNamePrefix="react-select"
              styles={customStyles}
            />
          </div>

          {/* Assigned To Worker */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('tickets.ticketForm.assignedToWorker')}</label>
            <Select
              options={workers.map(worker => ({
                value: worker.id,
                label: `${worker.username} (${worker.email})`
              }))}
              value={workers.find(w => w.id === formData.assignedToWorkerId) ? {
                value: formData.assignedToWorkerId,
                label: `${workers.find(w => w.id === formData.assignedToWorkerId).username} (${workers.find(w => w.id === formData.assignedToWorkerId).email})`
              } : null}
              onChange={(option) => handleSelectChange('assignedToWorkerId', option)}
              isClearable
              placeholder={t('tickets.placeholders.selectWorker')}
              className="react-select-container text-sm"
              classNamePrefix="react-select"
              styles={customStyles}
            />
          </div>

          {/* Assigned to Supervisor */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('tickets.ticketForm.assignedBySupervisor')}</label>
            <Select
              options={supervisors.map(supervisor => ({
                value: supervisor.id,
                label: `${supervisor.username} (${supervisor.email})`
              }))}
              value={supervisors.find(s => s.id === formData.assignedBySupervisorId) ? {
                value: formData.assignedBySupervisorId,
                label: `${supervisors.find(s => s.id === formData.assignedBySupervisorId).username} (${supervisors.find(s => s.id === formData.assignedBySupervisorId).email})`
              } : null}
              onChange={(option) => handleSelectChange('assignedBySupervisorId', option)}
              isClearable
              placeholder={t('tickets.placeholders.selectSupervisor')}
              className="react-select-container text-sm"
              classNamePrefix="react-select"
              styles={customStyles}
            />
          </div>
        </div>

        {/* Attachments */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('tickets.ticketForm.attachments')}</label>
          <div className="mt-1 flex justify-center px-4 pt-4 pb-5 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-10 w-10 text-gray-400 hidden sm:block" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex flex-col sm:flex-row text-sm text-gray-600 justify-center items-center">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                  <span>{t('tickets.ticketForm.uploadFiles')}</span>
                  <input
                    type="file"
                    multiple
                    className="sr-only"
                    onChange={handleFileChange}
                    accept=".png,.jpg,.jpeg,.pdf"
                  />
                </label>
                <p className="pl-1">{t('tickets.ticketForm.dragAndDrop')}</p>
              </div>
              <p className="text-xs text-gray-500">
                {t('tickets.ticketForm.fileTypes')}
              </p>
                              {files.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">{t('tickets.ticketForm.selectedFiles')}</p>
                    <ul className="text-sm text-gray-500">
                      {files.map((file, index) => (
                        <li key={index} className="truncate max-w-xs">{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end space-y-3 space-y-reverse sm:space-y-0 sm:space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/tickets")}
            className="mt-3 sm:mt-0 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? t('tickets.messages.creatingTicket') : t('tickets.createTicket')}
          </button>
        </div>
      </form>

      <style jsx global>{`
        .react-select-container .react-select__control {
          border: 1px solid #d1d5db;
          min-height: 44px;
          font-size: 16px; /* Prevents zoom on iOS */
        }
        .react-select-container .react-select__control--is-focused {
          border-color: #3b82f6;
          box-shadow: 0 0 0 1px #3b82f6;
        }
        @media (max-width: 768px) {
          .react-select-container .react-select__control {
            min-height: 48px; /* Larger touch target on mobile */
          }
          .react-select-container .react-select__menu {
            font-size: 16px; /* Prevents zoom on iOS */
          }
        }
      `}</style>
    </div>
  );
};

export default CreateTicket;