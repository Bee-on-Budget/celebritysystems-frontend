// src/components/tickets/CreateTicket.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createTicket, prepareTicketFormData, getUsersByRole } from "../../api/services/TicketService";
import { searchCompanies } from "../../api/services/CompanyService";
import { getScreens } from "../../api/services/ScreenService";
import { DropdownInput, Input, showToast, SelectionInputDialog, FormsContainer } from "../../components";
import { useAuth } from "../../auth/useAuth";

const CreateTicket = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const isCompanyUser = user?.role === 'COMPANY' || user?.role === 'COMPANY_USER';
  const userCompanyId = user?.companyId || user?.company?.id || user?.companyID || "";
  const userId = user?.id || user?.userId || user?.sub || undefined;
  const [formData, setFormData] = useState({
    title: "",
    serviceType: "",
    description: "",
    status: "OPEN",
    companyId: isCompanyUser ? userCompanyId : "",
    screenId: "",
    assignedToWorkerId: "",
    assignedBySupervisorId: "",
    createdBy: userId,
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [screens, setScreens] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
  const [isScreenDialogOpen, setIsScreenDialogOpen] = useState(false);
  const [isWorkerDialogOpen, setIsWorkerDialogOpen] = useState(false);
  const [isSupervisorDialogOpen, setIsSupervisorDialogOpen] = useState(false);

  const MAX_FILE_SIZE_MB = 10;
  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'application/pdf'];

  const serviceTypes = [
    { value: "REGULAR_SERVICE", label: t('tickets.serviceTypes.REGULAR_SERVICE') },
    { value: "EMERGENCY_SERVICE", label: t('tickets.serviceTypes.EMERGENCY_SERVICE') },
    { value: "PREVENTIVE_MAINTENANCE", label: t('tickets.serviceTypes.PREVENTIVE_MAINTENANCE') },
    { value: "CALL_BACK_SERVICE", label: t('tickets.serviceTypes.CALL_BACK_SERVICE') },
  ];

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if (!isCompanyUser) {
          const [workerRes, supervisorRes] = await Promise.all([
            getUsersByRole("CELEBRITY_SYSTEM_WORKER"),
            getUsersByRole("SUPERVISOR")
          ]);
          setWorkers(workerRes || []);
          setSupervisors(supervisorRes || []);
        }

      } catch (error) {
        showToast(t('tickets.messages.errorFetchingData'), "error")
        console.error("Error fetching initial data:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchInitialData();
  }, [t, isCompanyUser]);

  // Ensure company user enforced fields
  useEffect(() => {
    if (isCompanyUser) {
      setFormData(prev => ({
        ...prev,
        status: "OPEN",
        companyId: userCompanyId,
        assignedToWorkerId: "",
        assignedBySupervisorId: "",
        createdBy: userId,
      }));
    }
  }, [isCompanyUser, userCompanyId, userId]);

  // Fetch companies for SelectionInputDialog
  const fetchCompanies = useCallback(async (searchQuery) => {
    try {
      const res = await searchCompanies(searchQuery);
      const companiesData = Array.isArray(res) ? res : res?.content || res?.data || [];
      setCompanies(companiesData);
      return companiesData;
    } catch (error) {
      console.error("Error fetching companies:", error);
      throw error;
    }
  }, []);

  // Fetch screens for SelectionInputDialog
  const fetchScreens = useCallback(async (searchQuery) => {
    try {
      const screensRes = await getScreens({ search: searchQuery });
      const screensData = Array.isArray(screensRes) ? screensRes :
        screensRes?.content || screensRes?.data || [];
      setScreens(screensData);
      return screensData;
    } catch (error) {
      console.error("Error fetching screens:", error);
      throw error;
    }
  }, []);

  // Fetch workers for SelectionInputDialog
  const fetchWorkers = useCallback(async (searchQuery) => {
    try {
      const allWorkers = await getUsersByRole("CELEBRITY_SYSTEM_WORKER");
      const workersArray = Array.isArray(allWorkers) ? allWorkers : [];
      
      // Filter workers based on search query
      const query = searchQuery.toLowerCase();
      return workersArray.filter(worker => 
        worker.username?.toLowerCase().includes(query) ||
        worker.fullName?.toLowerCase().includes(query) ||
        worker.email?.toLowerCase().includes(query)
      );
    } catch (error) {
      console.error("Error fetching workers:", error);
      throw error;
    }
  }, []);

  // Fetch supervisors for SelectionInputDialog
  const fetchSupervisors = useCallback(async (searchQuery) => {
    try {
      const allSupervisors = await getUsersByRole("SUPERVISOR");
      const supervisorsArray = Array.isArray(allSupervisors) ? allSupervisors : [];
      
      // Filter supervisors based on search query
      const query = searchQuery.toLowerCase();
      return supervisorsArray.filter(supervisor => 
        supervisor.username?.toLowerCase().includes(query) ||
        supervisor.fullName?.toLowerCase().includes(query) ||
        supervisor.email?.toLowerCase().includes(query)
      );
    } catch (error) {
      console.error("Error fetching supervisors:", error);
      throw error;
    }
  }, []);

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

  // Get selected company display value
  const selectedCompany = companies.find(c => c.id === formData.companyId);
  const companyDisplayValue = selectedCompany 
    ? selectedCompany.name || ""
    : "";

  // Get selected screen display value
  const selectedScreen = screens.find(s => s.id === formData.screenId);
  const screenDisplayValue = selectedScreen 
    ? selectedScreen.name || ""
    : "";

  // Get selected worker display value
  const selectedWorker = workers.find(w => w.id === formData.assignedToWorkerId);
  const workerDisplayValue = selectedWorker 
    ? selectedWorker.username || selectedWorker.fullName || ""
    : "";

  // Get selected supervisor display value
  const selectedSupervisor = supervisors.find(s => s.id === formData.assignedBySupervisorId);
  const supervisorDisplayValue = selectedSupervisor 
    ? selectedSupervisor.username || selectedSupervisor.fullName || ""
    : "";

  // Handle file changes
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;

    // Validate file
    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      showToast(`${selectedFile.name}: ${t('tickets.messages.fileSizeExceeded')}`, "error");
      e.target.value = '';
      return;
    }

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      showToast(`${selectedFile.name}: ${t('tickets.messages.invalidFileType')}`, "error");
      e.target.value = '';
      return;
    }

    // Set the single file
    setFile(selectedFile);
    
    // Reset input to allow selecting the same file again
    e.target.value = '';
  };

  // Remove file
  const handleRemoveFile = () => {
    setFile(null);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const ticketData = prepareTicketFormData(formData, file ? [file] : []);
      await createTicket(ticketData);
      // Navigate after successful creation
      navigate('/tickets');
    } catch (error) {
      console.error("Error creating ticket:", error);
      // Error toast is already shown by createTicket service
    } finally {
      setIsSubmitting(false);
    }
  };

  if (fetching) {
    return <div className="p-4 md:p-6 max-w-7xl mx-auto">{t('tickets.messages.loadingTicket')}</div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <FormsContainer
        title={t('tickets.createTicket')}
        actionTitle={isSubmitting ? t('tickets.messages.creatingTicket') : t('tickets.createTicket')}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        error={null}
      >
        {/* Title */}
        <Input
          label={t('tickets.ticketForm.title')}
          name={"title"}
          value={formData.title}
          onChange={handleChange}
          required
        />

        {/* Service Type */}
        {!isCompanyUser && (
          <DropdownInput
            name="serviceType"
            value={formData.serviceType}
            options={serviceTypes}
            onChange={handleChange}
            label={t('tickets.ticketForm.serviceType')}
            required
          />
        )}

        {/* Description */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-dark mb-1">
            {t('tickets.ticketForm.description')} <span className="text-red-500">*</span>
          </label>
          <textarea
            className={`w-full px-4 py-2 mt-2 border rounded focus:outline-none focus:ring-2 ${
              "border-gray-300 focus:ring-primary"
            }`}
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        {/* Company */}
        {!isCompanyUser && (
          <div className="relative">
            <Input
              id="companyId"
              label={t('tickets.ticketForm.company')}
              value={companyDisplayValue}
              readOnly
              onClick={() => setIsCompanyDialogOpen(true)}
              className="cursor-pointer"
              placeholder={t('tickets.ticketForm.companyPlaceholder')}
            />
          </div>
        )}

        {/* Screen */}
        <div className="relative">
          <Input
            id="screenId"
            label={t('tickets.ticketForm.screen')}
            value={screenDisplayValue}
            readOnly
            onClick={() => setIsScreenDialogOpen(true)}
            className="cursor-pointer"
            placeholder={t('tickets.ticketForm.screenPlaceholder')}
          />
        </div>

        {/* Assigned To Worker */}
        {!isCompanyUser && (
          <div className="relative">
            <Input
              id="assignedToWorkerId"
              label={t('tickets.ticketForm.assignedToWorker')}
              value={workerDisplayValue}
              readOnly
              onClick={() => setIsWorkerDialogOpen(true)}
              className="cursor-pointer"
              placeholder={t('tickets.placeholders.selectWorker')}
            />
          </div>
        )}

        {/* Assigned to Supervisor */}
        {!isCompanyUser && (
          <div className="relative">
            <Input
              id="assignedBySupervisorId"
              label={t('tickets.ticketForm.assignedBySupervisor')}
              value={supervisorDisplayValue}
              readOnly
              onClick={() => setIsSupervisorDialogOpen(true)}
              className="cursor-pointer"
              placeholder={t('tickets.placeholders.selectSupervisor')}
            />
          </div>
        )}

        {/* Attachments */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-dark mb-1">
            {t('tickets.ticketForm.attachments')}
          </label>
          <div className="mt-2 flex justify-center px-4 pt-4 pb-5 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
            <div className="space-y-2 text-center w-full">
              <svg className="mx-auto h-10 w-10 text-gray-400 hidden sm:block" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex flex-col sm:flex-row text-sm text-gray-600 justify-center items-center gap-2">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-hover px-3 py-1.5 border border-primary transition-colors">
                  <span>{t('tickets.ticketForm.uploadFiles')}</span>
                  <input
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept=".png,.jpg,.jpeg,.pdf"
                  />
                </label>
                <p className="text-sm text-gray-500">{t('tickets.ticketForm.dragAndDrop')}</p>
              </div>
              <p className="text-xs text-gray-500">
                {t('tickets.ticketForm.fileTypes')}
              </p>
              {file && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-dark mb-2">{t('tickets.ticketForm.selectedFiles')}</p>
                  <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border border-gray-200">
                    <span className="text-sm text-gray-700 truncate flex-1">{file.name}</span>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="ml-2 text-red-500 hover:text-red-700 text-sm font-medium"
                      aria-label={`Remove ${file.name}`}
                    >
                      {t('common.remove')}
                    </button>
                  </div>
                </div>
              )}
            </div>
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
        onChange={(e) => {
          handleSelectChange('companyId', { value: e.target.value });
        }}
        value={formData.companyId}
        id="companyId"
        label={t('tickets.ticketForm.company')}
        searchPlaceholder={t('tickets.placeholders.searchCompanies')}
      />
      <SelectionInputDialog
        isOpen={isScreenDialogOpen}
        onClose={() => setIsScreenDialogOpen(false)}
        fetchItems={fetchScreens}
        getItemLabel={(item) => item.name || String(item)}
        getItemValue={(item) => item.id}
        onChange={(e) => {
          handleSelectChange('screenId', { value: e.target.value });
        }}
        value={formData.screenId}
        id="screenId"
        label={t('tickets.ticketForm.screen')}
        searchPlaceholder={t('tickets.placeholders.searchScreens')}
      />
      <SelectionInputDialog
        isOpen={isWorkerDialogOpen}
        onClose={() => setIsWorkerDialogOpen(false)}
        fetchItems={fetchWorkers}
        getItemLabel={(item) => item.username || item.fullName || item.email || String(item)}
        getItemValue={(item) => item.id}
        onChange={(e) => {
          handleSelectChange('assignedToWorkerId', { value: e.target.value });
        }}
        value={formData.assignedToWorkerId}
        id="assignedToWorkerId"
        label={t('tickets.ticketForm.assignedToWorker')}
        searchPlaceholder="Search by username, name, or email..."
      />
      <SelectionInputDialog
        isOpen={isSupervisorDialogOpen}
        onClose={() => setIsSupervisorDialogOpen(false)}
        fetchItems={fetchSupervisors}
        getItemLabel={(item) => item.username || item.fullName || item.email || String(item)}
        getItemValue={(item) => item.id}
        onChange={(e) => {
          handleSelectChange('assignedBySupervisorId', { value: e.target.value });
        }}
        value={formData.assignedBySupervisorId}
        id="assignedBySupervisorId"
        label={t('tickets.ticketForm.assignedBySupervisor')}
        searchPlaceholder="Search by username, name, or email..."
      />
    </div>
  );
};

export default CreateTicket;