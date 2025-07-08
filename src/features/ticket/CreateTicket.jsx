// src/components/tickets/CreateTicket.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createTicket, prepareTicketFormData, getUsersByRole } from "../../api/services/TicketService";
import { getAllCompanies } from "../../api/services/CompanyService";
import { getScreens } from "../../api/services/ScreenService";
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash/debounce';
import { showToast } from "../../components";

const CreateTicket = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
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

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [companiesRes, workerRes, supervisorRes] = await Promise.all([
          getAllCompanies(),
          getUsersByRole("CELEBRITY_SYSTEM_WORKER"),
          getUsersByRole("SUPERVISOR")
        ]);

        setCompanies(companiesRes || []);
        setWorkers(workerRes || []);
        setSupervisors(supervisorRes || []);

      } catch (error) {
        showToast("Error fetching initial data", "error")
        console.error("Error fetching initial data:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchInitialData();
  }, []);

  // Load screens with search
  const loadScreens = async (search = '') => {
    try {
      const screensRes = await getScreens({ search });
      const screensData = Array.isArray(screensRes) ? screensRes :
        screensRes?.content || screensRes?.data || [];
      setScreens(screensData);
      return screensData.map(screen => ({
        value: screen.id,
        label: `${screen.name} (${screen.location})`
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
    return <div className="p-6 max-w-4xl mx-auto">Loading initial data...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
            <input
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
            <textarea
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
            <select
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <Select
              options={companies.map(company => ({
                value: company.id,
                label: company.name
              }))}
              value={companies.find(c => c.id === formData.companyId) ? {
                value: formData.companyId,
                label: companies.find(c => c.id === formData.companyId).name
              } : null}
              onChange={(option) => handleSelectChange('companyId', option)}
              isClearable
              placeholder="Select company"
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          {/* Screen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Screen</label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={debouncedLoadScreens}
              value={screens.find(s => s.id === formData.screenId) ? {
                value: formData.screenId,
                label: `${screens.find(s => s.id === formData.screenId).name} (${screens.find(s => s.id === formData.screenId).location})`
              } : null}
              onChange={(option) => handleSelectChange('screenId', option)}
              isClearable
              placeholder="Search screens..."
              noOptionsMessage={({ inputValue }) =>
                inputValue ? 'No screens found' : 'Start typing to search screens'
              }
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          {/* Assigned To Worker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned to Worker</label>
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
              placeholder="Select worker"
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          {/* Assigned By Supervisor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned by Supervisor</label>
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
              placeholder="Select supervisor"
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
        </div>

        {/* Attachments */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                  <span>Upload files</span>
                  <input
                    type="file"
                    multiple
                    className="sr-only"
                    onChange={handleFileChange}
                    accept=".png,.jpg,.jpeg,.pdf"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, PDF up to 10MB
              </p>
              {files.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Selected files:</p>
                  <ul className="text-sm text-gray-500">
                    {files.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/tickets")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? "Creating..." : "Create Ticket"}
          </button>
        </div>
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
      `}</style>
    </div>
  );
};

export default CreateTicket;