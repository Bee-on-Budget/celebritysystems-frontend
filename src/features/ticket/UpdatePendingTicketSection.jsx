import { useState, useEffect } from "react";
import { FaSave } from "react-icons/fa";
import { Button, DropdownInput, showToast } from "../../components";
import CustomSelect from "../../components/CustomSelect";
import { updateTicket } from "../../api/services/TicketService";

const UpdatePendingTicketSection = ({ 
  ticket, 
  isLoading, 
  supervisors = [], 
  workers = [], 
  onUpdateSuccess 
}) => {
  const [formData, setFormData] = useState({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Update formData when ticket prop changes
  useEffect(() => {
    if (ticket) {
      setFormData({
        status: ticket.status || "",
        assignedBySupervisorId: ticket.assignedBySupervisorId || "",
        assignedToWorkerId: ticket.assignedToWorkerId || ""
      });
    }
  }, [ticket]);

  const statusOptions = [
    { value: "OPEN", label: "Open" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "RESOLVED", label: "Resolved" },
    { value: "CLOSED", label: "Closed" },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.assignedToWorkerId) newErrors.assignedToWorkerId = "Worker assignment is required";
    if (!formData.assignedBySupervisorId) newErrors.assignedBySupervisorId = "Supervisor assignment is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStatusChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormData(prev => ({
      ...prev,
      [name]: selectedOption?.value || ""
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast("Please fix the form errors", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateTicket(ticket.id, formData);
      
      showToast("Ticket updated successfully!");
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (error) {
      console.error("Update failed:", error);
      showToast(error.response?.data?.message || "Failed to update ticket", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DropdownInput
            name="status"
            label="Status"
            value={formData.status}
            options={statusOptions}
            onChange={handleStatusChange}
            error={errors.status}
            required
          />
          
          <CustomSelect
            name="assignedBySupervisorId"
            label="Assigned by supervisor"
            options={supervisors.map(supervisor => ({
              value: supervisor.id,
              label: supervisor.username,
            }))}
            value={supervisors.find(s => s.id === formData.assignedBySupervisorId) || null}
            onChange={(option) => handleSelectChange('assignedBySupervisorId', option)}
            placeholder="Select supervisor"
            error={errors.assignedBySupervisorId}
            required
          />
          
          <CustomSelect
            name="assignedToWorkerId"
            label="Assigned to worker"
            options={workers.map(worker => ({
              value: worker.id,
              label: worker.username,
            }))}
            value={workers.find(w => w.id === formData.assignedToWorkerId) || null}
            onChange={(option) => handleSelectChange('assignedToWorkerId', option)}
            placeholder="Select worker"
            error={errors.assignedToWorkerId}
            required
          />
        </div>
        
        <Button
          icon={<FaSave />}
          isLoading={isSubmitting || isLoading}
          type="submit"
          className="mt-8"
          disabled={isSubmitting || isLoading}
        >
          Update ticket
        </Button>
      </form>
    </div>
  );
};

export default UpdatePendingTicketSection;