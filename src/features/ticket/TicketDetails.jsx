import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getTicketById, deleteTicket, downloadTicketImage, downloadTicketAttachment } from '../../api/services/TicketService';
import { FiArrowLeft, FiDownload, FiCalendar, FiUser, FiCheckCircle, FiAlertCircle, FiTrash2, FiImage, FiPaperclip } from 'react-icons/fi';
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
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [downloading, setDownloading] = useState(false);

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

  const downloadFile = (blob, filename) => {
    try {
      // Validate blob
      if (!blob) {
        throw new Error('No file data received');
      }
      
      if (blob.size === 0) {
        throw new Error('Empty file content');
      }

      console.log(`Downloading file: ${filename}, size: ${blob.size} bytes, type: ${blob.type}`);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      link.setAttribute('download', filename); // Ensure download attribute is set
      
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      console.log(`Download triggered for: ${filename}`);
    } catch (error) {
      console.error('Error in downloadFile:', error);
      throw error;
    }
  };

  const getFileExtension = (filename, url, defaultExt = 'bin') => {
    // Try to get extension from filename first
    if (filename) {
      const match = filename.match(/\.([0-9a-z]+)$/i);
      if (match) return match[1];
    }
    
    // Try to get extension from URL
    if (url) {
      const urlMatch = url.match(/\.([0-9a-z]+)(?:\?|$)/i);
      if (urlMatch) return urlMatch[1];
    }
    
    return defaultExt;
  };

  const validateBlobResponse = (blob, expectedType = 'any') => {
    if (!blob) {
      throw new Error('No file data received');
    }
    
    if (blob.size === 0) {
      throw new Error('File is empty');
    }
    
    // Basic validation for image blobs
    if (expectedType === 'image' && !blob.type.startsWith('image/')) {
      console.warn('Expected image but got:', blob.type);
    }
    
    return true;
  };

  const handleDownloadAttachment = async (downloadType = 'both') => {
    const hasImage = ticket.ticketImageUrl;
    const hasAttachment = ticket.attachmentFileName || ticket.attachmentUrl;
    
    if (!hasImage && !hasAttachment) {
      showToast(t('tickets.messages.noAttachmentAvailable'), 'warning');
      return;
    }

    // If user wants to download specific type, check availability
    if (downloadType === 'image' && !hasImage) {
      showToast(t('tickets.messages.noImageAvailable'), 'warning');
      return;
    }
    
    if (downloadType === 'attachment' && !hasAttachment) {
      showToast(t('tickets.messages.noAttachmentAvailable'), 'warning');
      return;
    }

    setDownloading(true);
    setShowDownloadOptions(false);

    try {
      showToast(t('tickets.messages.attachmentDownloading') || 'Preparing download...', 'info');
      
      const downloadPromises = [];
      const downloadTypes = [];

      // Download ticket image if available and requested
      if (hasImage && (downloadType === 'both' || downloadType === 'image')) {
        downloadPromises.push(
          downloadTicketImage(id)
            .then((imageBlob) => {
              console.log('Image blob received:', imageBlob);
              validateBlobResponse(imageBlob, 'image');
              const imageExtension = getFileExtension(null, ticket.ticketImageUrl, 'jpg');
              const filename = `ticket-${id}-image.${imageExtension}`;
              downloadFile(imageBlob, filename);
              return { type: 'image', success: true };
            })
            .catch(async (apiError) => {
              console.error('Error downloading image via API:', apiError);
              console.error('Error details:', {
                message: apiError.message,
                response: apiError.response,
                status: apiError.response?.status
              });
              
              // Fallback: try to download from URL directly
              if (ticket.ticketImageUrl) {
                try {
                  console.log('Attempting fallback download from URL:', ticket.ticketImageUrl);
                  const response = await fetch(ticket.ticketImageUrl);
                  if (!response.ok) throw new Error(`HTTP ${response.status}`);
                  const blob = await response.blob();
                  validateBlobResponse(blob, 'image');
                  const imageExtension = getFileExtension(null, ticket.ticketImageUrl, 'jpg');
                  const filename = `ticket-${id}-image.${imageExtension}`;
                  downloadFile(blob, filename);
                  return { type: 'image', success: true, fallback: true };
                } catch (fallbackError) {
                  console.error('Fallback image download also failed:', fallbackError);
                  showToast(t('tickets.messages.errorDownloadingImage') || 'Failed to download image', 'error');
                  return { type: 'image', success: false, error: fallbackError };
                }
              }
              
              showToast(t('tickets.messages.errorDownloadingImage') || 'Failed to download image', 'error');
              return { type: 'image', success: false, error: apiError };
            })
        );
        downloadTypes.push('image');
      }

      // Download attachment file if available and requested
      if (hasAttachment && (downloadType === 'both' || downloadType === 'attachment')) {
        downloadPromises.push(
          downloadTicketAttachment(id)
            .then((attachmentBlob) => {
              validateBlobResponse(attachmentBlob);
              const originalFilename = ticket.attachmentFileName || `ticket-${id}-attachment`;
              const extension = getFileExtension(originalFilename, ticket.attachmentUrl);
              const filename = originalFilename.includes('.') ? originalFilename : `${originalFilename}.${extension}`;
              downloadFile(attachmentBlob, filename);
              return { type: 'attachment', success: true };
            })
            .catch(async (apiError) => {
              console.error('Error downloading attachment via API:', apiError);
              
              // Fallback: try to download from attachment URL if available
              if (ticket.attachmentUrl) {
                try {
                  const response = await fetch(ticket.attachmentUrl);
                  if (!response.ok) throw new Error(`HTTP ${response.status}`);
                  const blob = await response.blob();
                  validateBlobResponse(blob);
                  const originalFilename = ticket.attachmentFileName || `ticket-${id}-attachment`;
                  const extension = getFileExtension(originalFilename, ticket.attachmentUrl);
                  const filename = originalFilename.includes('.') ? originalFilename : `${originalFilename}.${extension}`;
                  downloadFile(blob, filename);
                  return { type: 'attachment', success: true, fallback: true };
                } catch (fallbackError) {
                  console.error('Fallback attachment download also failed:', fallbackError);
                  showToast(t('tickets.messages.errorDownloadingAttachment') || 'Failed to download attachment', 'error');
                  return { type: 'attachment', success: false, error: fallbackError };
                }
              }
              
              showToast(t('tickets.messages.errorDownloadingAttachment') || 'Failed to download attachment', 'error');
              return { type: 'attachment', success: false, error: apiError };
            })
        );
        downloadTypes.push('attachment');
      }

      // Wait for all downloads to complete
      const results = await Promise.allSettled(downloadPromises);

      // Show success message if at least one download succeeded
      const successCount = results.filter(r => 
        r.status === 'fulfilled' && r.value && r.value.success
      ).length;

      if (successCount > 0) {
        const successTypes = results
          .filter(r => r.status === 'fulfilled' && r.value && r.value.success)
          .map(r => r.value.type);
        
        let successMessage = t('tickets.messages.downloadComplete') || 'Download completed';
        if (successTypes.length === 1) {
          const typeName = successTypes[0] === 'image' ? 'Image' : 'Attachment';
          successMessage = `${typeName} downloaded successfully`;
        } else if (successTypes.length === 2) {
          successMessage = 'Both files downloaded successfully';
        }
        
        showToast(successMessage, 'success');
      } else {
        // Log all errors for debugging
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.error(`Download ${index} failed:`, result.reason);
          } else if (result.status === 'fulfilled' && result.value && !result.value.success) {
            console.error(`Download ${index} failed:`, result.value.error);
          }
        });
        showToast(t('tickets.messages.errorDownloading') || 'Failed to download files', 'error');
      }

    } catch (error) {
      console.error('Error in download process:', error);
      showToast(t('tickets.messages.errorDownloading') || 'Error downloading files', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const DownloadButton = () => {
    const hasImage = ticket.ticketImageUrl;
    const hasAttachment = ticket.attachmentFileName || ticket.attachmentUrl;

    if (!hasImage && !hasAttachment) return null;

    const handleOptionSelect = (type) => {
      handleDownloadAttachment(type);
    };

    // If only one type is available, download directly
    if ((hasImage && !hasAttachment) || (!hasImage && hasAttachment)) {
      return (
        <Button
          onClick={() => handleDownloadAttachment('both')}
          variant="secondary"
          icon={<FiDownload />}
          disabled={downloading}
        >
          {downloading ? t('common.downloading') : t('common.download')}
        </Button>
      );
    }

    // If both types are available, show dropdown
    return (
      <div className="relative">
        <Button
          onClick={() => setShowDownloadOptions(!showDownloadOptions)}
          variant="secondary"
          icon={<FiDownload />}
          disabled={downloading}
        >
          {downloading ? t('common.downloading') : t('common.download')}
        </Button>

        {showDownloadOptions && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-10">
            <div className="py-1">
              {hasImage && (
                <button
                  onClick={() => handleOptionSelect('image')}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FiImage className="mr-2 text-blue-500" />
                  <div>
                    <div className="font-medium">Download Image</div>
                    <div className="text-xs text-gray-500">Ticket screenshot or photo</div>
                  </div>
                </button>
              )}
              {hasAttachment && (
                <button
                  onClick={() => handleOptionSelect('attachment')}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FiPaperclip className="mr-2 text-green-500" />
                  <div>
                    <div className="font-medium">Download Attachment</div>
                    <div className="text-xs text-gray-500">Additional files or documents</div>
                  </div>
                </button>
              )}
              {(hasImage && hasAttachment) && (
                <button
                  onClick={() => handleOptionSelect('both')}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-t border-gray-100"
                >
                  <FiDownload className="mr-2 text-purple-500" />
                  <div>
                    <div className="font-medium">Download Both</div>
                    <div className="text-xs text-gray-500">Image and attachment files</div>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
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
          <DownloadButton />
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

            {/* Ticket Image Section */}
            {ticket.ticketImageUrl && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  {t('tickets.ticketForm.ticketImage') || 'Ticket Image'}
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-center items-center">
                    <img
                      src={ticket.ticketImageUrl}
                      alt={t('tickets.ticketForm.ticketImage') || 'Ticket Image'}
                      className="max-w-full h-auto max-h-96 rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity object-contain"
                      onClick={() => window.open(ticket.ticketImageUrl, '_blank')}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EFailed to load image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Attachment Section */}
            {(ticket.attachmentFileName || ticket.attachmentUrl) && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  {t('tickets.ticketForm.attachment') || 'Attachment'}
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FiPaperclip className="text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {ticket.attachmentFileName || 'Attachment File'}
                        </p>
                        {ticket.attachmentUrl && (
                          <p className="text-sm text-gray-500 break-all">
                            {ticket.attachmentUrl}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDownloadAttachment('attachment')}
                      variant="text"
                      icon={<FiDownload />}
                      size="sm"
                      disabled={downloading}
                    >
                      {downloading ? t('common.downloading') : t('common.download')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
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