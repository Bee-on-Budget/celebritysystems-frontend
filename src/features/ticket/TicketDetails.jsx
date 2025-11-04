import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getTicketById, deleteTicket } from '../../api/services/TicketService';
import { FiArrowLeft, FiDownload, FiCalendar, FiUser, FiCheckCircle, FiAlertCircle, FiTrash2 } from 'react-icons/fi';
import { Button, Loading, showToast, ConfirmationModal } from '../../components';
import { useAuth } from '../../auth/useAuth';

const TicketDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isCompanyUser = user?.role === 'COMPANY' || user?.role === 'COMPANY_USER';
  const userCompanyId = user?.companyId || user?.company?.id || user?.companyID;
  const [ticket, setTicket] = useState(location.state?.ticket || null);
  const [loading, setLoading] = useState(!ticket);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await getTicketById(id);
        
        // For COMPANY users, verify the ticket belongs to their company
        if (isCompanyUser && userCompanyId) {
          const ticketCompanyId = data?.companyId || data?.company?.id;
          if (ticketCompanyId && ticketCompanyId !== userCompanyId) {
            setAccessDenied(true);
            setError(t('tickets.messages.accessDenied') || 'You do not have access to this ticket');
            setLoading(false);
            return;
          }
        }
        
        setTicket(data);
      } catch (err) {
        setError(err.message || t('tickets.messages.errorFetchingTicket'));
      } finally {
        setLoading(false);
      }
    };

    if (!ticket && id) {
      fetchTicket();
    } else if (ticket && isCompanyUser && userCompanyId) {
      // Validate ticket from location state
      const ticketCompanyId = ticket?.companyId || ticket?.company?.id;
      if (ticketCompanyId && ticketCompanyId !== userCompanyId) {
        setAccessDenied(true);
        setError(t('tickets.messages.accessDenied') || 'You do not have access to this ticket');
      }
    }
  }, [id, ticket, t, isCompanyUser, userCompanyId]);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTicket(id);
      showToast(t('tickets.messages.ticketDeleted'), 'success');
      navigate('/tickets');
    } catch (err) {
      showToast(err.message || t('tickets.messages.errorDeletingTicket'), 'error');
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

  const handleDownloadAttachment = () => {
    if (ticket.attachmentFileName) {
      // Implement your download logic here
      showToast(t('tickets.messages.attachmentDownloading'), 'info');
    } else {
      showToast(t('tickets.messages.noAttachmentAvailable'), 'warning');
    }
  };

  if (loading) return <Loading />;

  if (accessDenied || error) return (
    <div className="py-6 px-2 max-w-7xl mx-auto">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
        <p className="font-medium">{error || t('tickets.messages.accessDenied')}</p>
      </div>
      <Button
        onClick={() => navigate('/tickets')}
        variant='text'
        icon={<FiArrowLeft />}
        size='sm'
      >
        {t('tickets.actions.backToTickets')}
      </Button>
    </div>
  );

  if (!ticket) return (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <p className="text-gray-600">{t('tickets.messages.ticketNotFound')}</p>
    </div>
  );

  return (
    <div className="py-6 px-2 max-w-7xl mx-auto">
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title={t('tickets.deleteDialog.title')}
        message={t('tickets.deleteDialog.message')}
        confirmText={t('common.delete')}
        danger={true}
      />

      <div className="mb-6 flex items-center justify-between">
        <Button
          onClick={() => navigate(-1)}
          variant='text'
          icon={<FiArrowLeft />}
          size='sm'
        >
          {t('tickets.actions.backToTickets')}
        </Button>
        <div className="flex gap-2">
          {ticket.attachmentFileName && (
            <Button
              onClick={handleDownloadAttachment}
              variant="secondary"
              icon={<FiDownload />}
            >
              {t('common.download')}
            </Button>
          )}
          {!isCompanyUser && (
            <Button
              onClick={handleDeleteClick}
              variant="danger"
              icon={<FiTrash2 />}
            >
              {t('common.delete')}
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-primary bg-opacity-10 p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary">{ticket.title}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                {getStatusBadge(ticket.status)}
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full flex items-center">
                  <FiCalendar className="mr-1" />
                  {t('tickets.details.created')}: {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
                {ticket.companyName && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {t('common.company')}: {ticket.companyName}
                  </span>
                )}
                {ticket.screenName && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                    {t('screens.title')}: {ticket.screenName}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Basic Information Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              {t('tickets.ticketDetails')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">{t('common.description')}</h3>
                <p className="break-words break-all">{ticket.description || t('tickets.details.noDescription')}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                    <FiUser /> {t('tickets.details.createdBy')}
                  </h3>
                  <p className="font-medium">{t('tickets.details.userId')}: {ticket.createdBy}</p>
                </div>

                {ticket.assignedToWorkerName && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                      <FiUser /> {t('tickets.details.assignedTo')}
                    </h3>
                    <p className="font-medium">{ticket.assignedToWorkerName}</p>
                  </div>
                )}

                {ticket.assignedBySupervisorName && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                      <FiUser /> {t('tickets.details.assignedBy')}
                    </h3>
                    <p className="font-medium">{ticket.assignedBySupervisorName}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              {t('tickets.details.activityTimeline')}
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-4">

                {ticket.openedAt && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-green-500 rounded-full p-1 mt-1">
                      <FiCheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{t('tickets.details.ticketOpened')}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(ticket.openedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {ticket.inProgressAt && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-yellow-500 rounded-full p-1 mt-1">
                      <FiAlertCircle className="h-4 w-4 text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{t('tickets.details.inProgress')}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(ticket.inProgressAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {ticket.resolvedAt && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-500 rounded-full p-1 mt-1">
                      <FiCheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{t('tickets.details.resolved')}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(ticket.resolvedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {ticket.closedAt && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-gray-500 rounded-full p-1 mt-1">
                      <FiCheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{t('tickets.details.closed')}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(ticket.closedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;