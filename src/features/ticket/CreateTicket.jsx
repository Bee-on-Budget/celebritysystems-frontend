// src/components/tickets/CreateTicket.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTicket, prepareTicketFormData } from "./TicketService";

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

  const MAX_FILE_SIZE_MB = 10;
  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'application/pdf'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: value === "" ? null : Number(value) 
    }));
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const validFiles = selected.filter(file =>
      file.size <= MAX_FILE_SIZE_MB * 1024 * 1024 &&
      ALLOWED_TYPES.includes(file.type)
    );
    setFiles(validFiles);
  };

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
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Company ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company ID</label>
            <input
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              name="companyId"
              type="number"
              value={formData.companyId}
              onChange={handleNumberChange}
            />
          </div>

          {/* Screen ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Screen ID</label>
            <input
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              name="screenId"
              type="number"
              value={formData.screenId}
              onChange={handleNumberChange}
            />
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned to Worker ID</label>
            <input
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              name="assignedToWorkerId"
              type="number"
              value={formData.assignedToWorkerId}
              onChange={handleNumberChange}
            />
          </div>

          {/* Assigned By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned by Supervisor ID</label>
            <input
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              name="assignedBySupervisorId"
              type="number"
              value={formData.assignedBySupervisorId}
              onChange={handleNumberChange}
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
    </div>
  );
};

export default CreateTicket;