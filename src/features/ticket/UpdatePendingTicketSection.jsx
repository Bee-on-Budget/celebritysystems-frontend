import { useState, useEffect, useCallback } from "react";
import { FaSave } from "react-icons/fa";
import { Button, DropdownInput, showToast, SelectionInputDialog, Input } from "../../components";
import { updateTicket, getUsersByRole } from "../../api/services/TicketService";

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
  const [isSupervisorDialogOpen, setIsSupervisorDialogOpen] = useState(false);
  const [isWorkerDialogOpen, setIsWorkerDialogOpen] = useState(false);

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

  // Fetch supervisors for search dialog
  const fetchSupervisors = useCallback(async (searchQuery) => {
    try {
      // Fetch all supervisors by role
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

  // Fetch workers for search dialog
  const fetchWorkers = useCallback(async (searchQuery) => {
    try {
      // Fetch all workers by role
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

  // Get selected supervisor display value
  const selectedSupervisor = supervisors.find(s => s.id === formData.assignedBySupervisorId);
  const supervisorDisplayValue = selectedSupervisor 
    ? selectedSupervisor.username || selectedSupervisor.fullName || ""
    : "";

  // Get selected worker display value
  const selectedWorker = workers.find(w => w.id === formData.assignedToWorkerId);
  const workerDisplayValue = selectedWorker 
    ? selectedWorker.username || selectedWorker.fullName || ""
    : "";

  const handleSubmit = async (e) => {
    e.preventDefault();

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
          />
          
          <div className="relative">
            <Input
              id="assignedBySupervisorId"
              label="Assigned by supervisor"
              value={supervisorDisplayValue}
              readOnly
              onClick={() => setIsSupervisorDialogOpen(true)}
              className="cursor-pointer"
              placeholder="Click to select supervisor"
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
              label="Select Supervisor"
              searchPlaceholder="Search by username, name, or email..."
            />
          </div>
          
          <div className="relative">
            <Input
              id="assignedToWorkerId"
              label="Assigned to worker"
              value={workerDisplayValue}
              readOnly
              onClick={() => setIsWorkerDialogOpen(true)}
              className="cursor-pointer"
              placeholder="Click to select worker"
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
              label="Select Worker"
              searchPlaceholder="Search by username, name, or email..."
            />
          </div>
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