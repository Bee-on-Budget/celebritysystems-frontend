import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getTicketById, deleteTicket } from '../../api/services/TicketService';
import { FiArrowLeft, FiCalendar, FiUser, FiCheckCircle, FiAlertCircle, FiTrash2, FiEdit3, FiX, FiMoreVertical } from 'react-icons/fi';
import { Button, Loading, showToast, ConfirmationModal } from '../../components';
import { getUsersByRole } from '../../api/services/TicketService';
import UpdatePendingTicketSection from './UpdatePendingTicketSection';

const PendingTicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [ticket, setTicket] = useState(location.state?.ticket || null);
  const [loading, setLoading] = useState(!ticket);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [ticketRes, workerRes, supervisorRes] = await Promise.all([
          getTicketById(id),
          getUsersByRole("CELEBRITY_SYSTEM_WORKER"),
          getUsersByRole("SUPERVISOR"),
        ]);

        setTicket(ticketRes);
        setWorkers(workerRes || []);
        setSupervisors(supervisorRes || []);
      } catch (error) {
        setError("Error fetching initial data");
        showToast("Error fetching initial data", "error");
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id]);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setShowMobileMenu(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTicket(id);
      showToast('Ticket deleted successfully', 'success');
      navigate('/tickets');
    } catch (err) {
      showToast(err.message || 'Failed to delete ticket', 'error');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const getStatusBadge = (status) => {
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-800';
    let icon = <FiAlertCircle className="mr-1" />;

    switch (status) {
      case 'OPEN':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        icon = <FiCheckCircle className="mr-1" />;
        break;
      case 'IN_PROGRESS':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        icon = <FiAlertCircle className="mr-1" />;
        break;
      case 'CLOSED':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        icon = <FiCheckCircle className="mr-1" />;
        break;
      default:
        break;
    }

    return (
      <span className={`${bgColor} ${textColor} px-3 py-1 rounded-full text-sm flex items-center`}>
        {icon}
        {status}
      </span>
    );
  };

  if (loading) return <Loading />;

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
      <p>{error}</p>
    </div>
  );

  if (!ticket) return (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <p className="text-gray-600">Ticket not found</p>
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Ticket"
        message="Are you sure you want to delete this ticket? This action cannot be undone."
        confirmText="Delete"
        danger={true}
      />

      {/* Header with Mobile Menu */}
      <div className="mb-4 md:mb-6">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <Button
            onClick={() => navigate(-1)}
            variant='text'
            icon={<FiArrowLeft />}
            size='sm'
            className="flex-shrink-0"
          >
            <span className="hidden sm:inline">Back to Tickets</span>
            <span className="sm:hidden">Back</span>
          </Button>

          {/* Desktop Action Buttons */}
          <div className="hidden sm:flex gap-2">
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="primary"
              icon={isEditing ? <FiX /> : <FiEdit3 />}
              size="sm"
            >
              {isEditing ? 'Cancel' : 'Update Ticket'}
            </Button>
            <Button
              onClick={handleDeleteClick}
              variant="danger"
              icon={<FiTrash2 />}
              size="sm"
            >
              Delete
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="relative sm:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <FiMoreVertical className="text-lg" />
            </button>

            {/* Mobile Dropdown Menu */}
            {showMobileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setShowMobileMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100"
                >
                  {isEditing ? <FiX /> : <FiEdit3 />}
                  {isEditing ? 'Cancel Edit' : 'Update Ticket'}
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <FiTrash2 />
                  Delete Ticket
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <UpdatePendingTicketSection
          ticket={ticket}
          isLoading={loading}
          supervisors={supervisors}
          workers={workers}
        // onUpdateSuccess={setIsEditing(false)}
        />
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-primary bg-opacity-10 p-4 md:p-6 border-b border-gray-100">
          <h1 className="text-xl md:text-2xl font-bold text-primary break-words">{ticket.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {getStatusBadge(ticket.status)}
            <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full flex items-center">
              <FiCalendar className="mr-1" />
              Created: {new Date(ticket.createdAt).toLocaleDateString()}
            </span>
            {ticket.companyName && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full truncate max-w-[180px] md:max-w-none">
                Company: {ticket.companyName}
              </span>
            )}
            {ticket.screenName && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full truncate max-w-[160px] md:max-w-none">
                Screen: {ticket.screenName}
              </span>
            )}
          </div>
        </div>

        {/* Ticket Details */}
        <div className="p-4 md:p-6">
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Ticket Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p className="break-words break-all">{ticket.description || 'No description provided'}</p>
              </div>
              <div className="space-y-3 md:space-y-4">
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                    <FiUser /> Created By
                  </h3>
                  <p>User ID: {ticket.createdBy}</p>
                </div>
                {ticket.assignedToWorkerName && (
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                      <FiUser /> Assigned To
                    </h3>
                    <p className="truncate">{ticket.assignedToWorkerName}</p>
                  </div>
                )}
                {ticket.assignedBySupervisorName && (
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                      <FiUser /> Assigned By
                    </h3>
                    <p className="truncate">{ticket.assignedBySupervisorName}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div>
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Activity Timeline</h2>
            <div className="bg-gray-50 p-3 md:p-4 rounded-lg space-y-3 md:space-y-4">
              {ticket.openedAt && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-500 rounded-full p-1 mt-1">
                    <FiCheckCircle className="h-3 w-3 md:h-4 md:w-4 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Ticket Opened</p>
                    <p className="text-xs md:text-sm text-gray-500">{new Date(ticket.openedAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
              {ticket.inProgressAt && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-yellow-500 rounded-full p-1 mt-1">
                    <FiAlertCircle className="h-3 w-3 md:h-4 md:w-4 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">In Progress</p>
                    <p className="text-xs md:text-sm text-gray-500">{new Date(ticket.inProgressAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
              {ticket.resolvedAt && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-500 rounded-full p-1 mt-1">
                    <FiCheckCircle className="h-3 w-3 md:h-4 md:w-4 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Resolved</p>
                    <p className="text-xs md:text-sm text-gray-500">{new Date(ticket.resolvedAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
              {ticket.closedAt && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-gray-500 rounded-full p-1 mt-1">
                    <FiCheckCircle className="h-3 w-3 md:h-4 md:w-4 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Closed</p>
                    <p className="text-xs md:text-sm text-gray-500">{new Date(ticket.closedAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingTicketDetails;