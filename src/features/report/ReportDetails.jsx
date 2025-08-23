import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getReportById, deleteReport } from '../../api/services/TicketService';
import { FiArrowLeft, FiCalendar, FiFileText, FiTrash2, FiEdit2, FiCheckSquare, FiAlertTriangle, FiClipboard, FiImage, FiMoreVertical } from 'react-icons/fi';
import { Button, Loading, showToast, ConfirmationModal } from '../../components';
import ReportPDF from './components/ReportPDF';

const ReportDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [report, setReport] = useState(location.state?.report || null);
    const [loading, setLoading] = useState(!report);
    const [error, setError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const data = await getReportById(id);
                setReport(data);
            } catch (err) {
                setError(err.message || 'Failed to load report details');
            } finally {
                setLoading(false);
            }
        };

        if (!report && id) {
            fetchReport();
        }
    }, [id, report]);

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
        setShowMobileMenu(false);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteReport(id);
            showToast('Report deleted successfully', 'success');
            navigate('/reports');
        } catch (err) {
            showToast(err.message || 'Failed to delete report', 'error');
        } finally {
            setShowDeleteModal(false);
        }
    };

    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
    const formatDateTime = (dateString) => dateString ? new Date(dateString).toLocaleString() : 'N/A';

    if (loading) return <Loading />;

    if (error) return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p>{error}</p>
        </div>
    );

    if (!report) return (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">Report not found</p>
        </div>
    );

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Report"
                message="Are you sure you want to delete this report? This action cannot be undone."
                confirmText="Delete"
                danger={true}
            />

            {/* Header with Mobile Menu */}
            <div className="mb-4 md:mb-6">
                <div className="flex items-center justify-between">
                    {/* Back Button */}
                    <Button
                        onClick={() => navigate("/reports")}
                        variant='text'
                        icon={<FiArrowLeft />}
                        size='sm'
                        className="flex-shrink-0"
                    >
                        <span className="hidden sm:inline">Back to Reports</span>
                        <span className="sm:hidden">Back</span>
                    </Button>

                    {/* Desktop Action Buttons */}
                    <div className="hidden sm:flex items-center gap-2">
                        <Button
                            onClick={() => navigate(`/reports/${id}/edit`, { state: { report } })}
                            variant='primary'
                            icon={<FiEdit2 />}
                            size="sm"
                        >
                            Edit
                        </Button>
                        <Button
                            onClick={handleDeleteClick}
                            variant='danger'
                            icon={<FiTrash2 />}
                            size="sm"
                        >
                            Delete
                        </Button>
                        <ReportPDF report={report} />
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
                                        navigate(`/reports/${id}/edit`, { state: { report } });
                                        setShowMobileMenu(false);
                                    }}
                                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100"
                                >
                                    <FiEdit2 />
                                    Edit Report
                                </button>
                                <button
                                    onClick={handleDeleteClick}
                                    className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-b border-gray-100"
                                >
                                    <FiTrash2 />
                                    Delete Report
                                </button>
                                <div className="w-full px-4 py-3 border-b border-gray-100">
                                    <ReportPDF report={report} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header Section */}
                <div className="bg-primary bg-opacity-10 p-4 md:p-6 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-primary break-words">Service Report #{report.id}</h1>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center">
                                    <FiFileText className="mr-1" />
                                    Ticket ID: {report.ticketId}
                                </span>
                                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center">
                                    <FiCalendar className="mr-1" />
                                    Report Date: {formatDate(report.reportDate)}
                                </span>
                                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full flex items-center">
                                    <FiCheckSquare className="mr-1" />
                                    {report.serviceType}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-4 md:p-6">
                    {/* Report Information Section */}
                    <div className="mb-6 md:mb-8">
                        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 pb-2 border-b border-gray-100">
                            Report Information
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                            {/* Service Details Card */}
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-5">
                                <div className="flex items-center mb-3 md:mb-4">
                                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                        <FiCalendar className="text-blue-600 text-lg md:text-xl" />
                                    </div>
                                    <h3 className="text-base font-semibold text-dark">Service Details</h3>
                                </div>
                                <div className="space-y-2 md:space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-dark-light">Report ID:</span>
                                        <span className="text-sm font-medium text-dark">{report.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-dark-light">Ticket ID:</span>
                                        <span className="text-sm font-medium text-dark">{report.ticketId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-dark-light">Service Type:</span>
                                        <span className="text-sm font-medium text-dark">{report.serviceType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-dark-light">Service Date:</span>
                                        <span className="text-sm font-medium text-dark">
                                            {formatDateTime(report.dateTime)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Card */}
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-5">
                                <div className="flex items-center mb-3 md:mb-4">
                                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                                        <FiFileText className="text-green-600 text-lg md:text-xl" />
                                    </div>
                                    <h3 className="text-base font-semibold text-dark">Timeline</h3>
                                </div>
                                <div className="space-y-2 md:space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-dark-light">Created:</span>
                                        <span className="text-sm font-medium text-dark">
                                            {formatDateTime(report.createdAt)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-dark-light">Last Updated:</span>
                                        <span className="text-sm font-medium text-dark">
                                            {formatDateTime(report.updatedAt)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-dark-light">Report Date:</span>
                                        <span className="text-sm font-medium text-dark">
                                            {formatDateTime(report.reportDate)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Signatures Card */}
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-5">
                                <div className="flex items-center mb-3 md:mb-4">
                                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                                        <FiClipboard className="text-purple-600 text-lg md:text-xl" />
                                    </div>
                                    <h3 className="text-base font-semibold text-dark">Signatures</h3>
                                </div>
                                <div className="space-y-2 md:space-y-3">
                                    <div>
                                        <p className="text-sm text-dark-light">Service Supervisor</p>
                                        <p className="text-sm font-medium text-dark break-words">{report.serviceSupervisorSignatures || 'Not signed'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-dark-light">Technician</p>
                                        <p className="text-sm font-medium text-dark break-words">{report.technicianSignatures || 'Not signed'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-dark-light">Authorized Person</p>
                                        <p className="text-sm font-medium text-dark break-words">{report.authorizedPersonSignatures || 'Not signed'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Checklist Section */}
                    <div className="mb-6 md:mb-8">
                        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 pb-2 border-b border-gray-100">
                            Checklist
                        </h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                            {Object.entries(report.checklist || {}).map(([key, value], index) => (
                                <div key={index} className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-100">
                                    <div className='flex flex-col gap-2 justify-start items-start'>
                                        <span className="text-sm font-medium text-gray-700 break-words">{key}</span>
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            value === 'OK' 
                                                ? 'bg-green-100 text-green-800' 
                                                : value === 'N/A' 
                                                    ? 'bg-gray-100 text-gray-800' 
                                                    : 'bg-blue-100 text-dark-light'
                                        }`}>
                                            {value || 'Not checked'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Defects & Solutions Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-5">
                            <div className="flex items-center mb-3 md:mb-4">
                                <div className="p-2 bg-red-100 rounded-lg mr-3">
                                    <FiAlertTriangle className="text-red-600 text-lg md:text-xl" />
                                </div>
                                <h3 className="text-base font-semibold text-dark">Defects Found</h3>
                            </div>
                            <div className="bg-gray-50 p-3 md:p-4 rounded min-h-[120px] md:min-h-[150px]">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                                    {report.defectsFound || 'No defects reported'}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-5">
                            <div className="flex items-center mb-3 md:mb-4">
                                <div className="p-2 bg-green-100 rounded-lg mr-3">
                                    <FiCheckSquare className="text-green-600 text-lg md:text-xl" />
                                </div>
                                <h3 className="text-base font-semibold text-dark">Solutions Provided</h3>
                            </div>
                            <div className="bg-gray-50 p-3 md:p-4 rounded min-h-[120px] md:min-h-[150px]">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                                    {report.solutionsProvided || 'No solutions documented'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Solution Image Section */}
                    {report.solutionImage && (
                        <div className="mb-6 md:mb-8">
                            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 pb-2 border-b border-gray-100">
                                Solution Image
                            </h2>
                            <div className="flex flex-col items-center">
                                <div className="p-2 bg-blue-100 rounded-lg mb-3">
                                    <FiImage className="text-blue-600 text-lg md:text-xl" />
                                </div>
                                <div className="bg-gray-100 border-2 border-dashed rounded-xl w-full h-48 md:h-64 flex items-center justify-center">
                                    {report.solutionImage ? (
                                        <img 
                                            src={report.solutionImage} 
                                            alt="Solution" 
                                            className="max-h-44 md:max-h-60 max-w-full object-contain"
                                        />
                                    ) : (
                                        <span className="text-gray-500">No image available</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportDetails;