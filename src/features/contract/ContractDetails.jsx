import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContractById, deleteContract, getCompanyById } from '../../api/services/ContractService';
import { FiArrowLeft, FiCalendar, FiDollarSign, FiFileText, FiTrash2, FiBriefcase, FiEdit2, FiMoreVertical, FiMonitor } from 'react-icons/fi';
import { Button, Loading, showToast, ConfirmationModal } from '../../components';
import { getScreenById } from '../../api/services/ScreenService';

const ContractDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contract, setContract] = useState(null);
    const [companyName, setCompanyName] = useState(null);
    const [screens, setScreens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [screenLoading, setScreenLoading] = useState(false);
    const [error, setError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        const fetchContract = async () => {
            try {
                setLoading(true);
                const data = await getContractById(id);
                const company = await getCompanyById(data.companyId);
                
                setContract(data);
                setCompanyName(company.name);
                
                // Fetch screen details if screenIds exist
                if (data.screenIds && data.screenIds.length > 0) {
                    setScreenLoading(true);
                    const screenPromises = data.screenIds.map(screenId => 
                        getScreenById(screenId).catch(err => {
                            console.error(`Error fetching screen ${screenId}:`, err);
                            return null;
                        })
                    );
                    
                    const screenResults = await Promise.all(screenPromises);
                    setScreens(screenResults.filter(screen => screen !== null));
                    setScreenLoading(false);
                }
            } catch (err) {
                setError(err.message || 'Failed to load contract details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchContract();
        }
    }, [id]);

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
        setShowMobileMenu(false);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteContract(id);
            showToast('Contract deleted successfully', 'success');
            navigate('/contracts');
        } catch (err) {
            showToast(err.message || 'Failed to delete contract', 'error');
        } finally {
            setShowDeleteModal(false);
        }
    };

    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
    const formatDateTime = (dateString) => dateString ? new Date(dateString).toLocaleString() : 'N/A';
    const formatCurrency = (value) => value ? `$${value.toLocaleString()}` : 'N/A';

    if (loading) return <Loading />;

    if (error) return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p>{error}</p>
        </div>
    );

    if (!contract) return (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">Contract not found</p>
        </div>
    );

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Contract"
                message="Are you sure you want to delete this contract? This action cannot be undone."
                confirmText="Delete"
                danger={true}
            />

            {/* Header with Mobile Menu */}
            <div className="mb-4 md:mb-6">
                <div className="flex items-center justify-between">
                    {/* Back Button */}
                    <Button
                        onClick={() => navigate("/contracts")}
                        variant='text'
                        icon={<FiArrowLeft />}
                        size='sm'
                        className="flex-shrink-0"
                    >
                        <span className="hidden sm:inline">Back to Contracts</span>
                        <span className="sm:hidden">Back</span>
                    </Button>

                    {/* Desktop Action Buttons */}
                    <div className="hidden sm:flex items-center gap-2">
                        <Button
                            onClick={() => navigate(`/contracts/${id}/edit`, { state: { contract } })}
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
                                        navigate(`/contracts/${id}/edit`, { state: { contract } });
                                        setShowMobileMenu(false);
                                    }}
                                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100"
                                >
                                    <FiEdit2 />
                                    Edit Contract
                                </button>
                                <button
                                    onClick={handleDeleteClick}
                                    className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <FiTrash2 />
                                    Delete Contract
                                </button>
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
                            <h1 className="text-xl md:text-2xl font-bold text-primary break-words">{contract.info || 'Untitled Contract'}</h1>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center">
                                    <FiFileText className="mr-1" />
                                    Contract ID: {contract.id}
                                </span>
                                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center">
                                    <FiDollarSign className="mr-1" />
                                    Value: {formatCurrency(contract.contractValue)}
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full flex items-center">
                                    <FiCalendar className="mr-1" />
                                    Created: {formatDate(contract.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-4 md:p-6">
                    {/* Contract Information Section */}
                    <div className="mb-6 md:mb-8">
                        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 pb-2 border-b border-gray-100">
                            Contract Information
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                            {/* Company & Basic Info Card */}
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-5">
                                <div className="flex items-center mb-3 md:mb-4">
                                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                        <FiBriefcase className="text-blue-600 text-lg md:text-xl" />
                                    </div>
                                    <h3 className="text-base font-semibold text-dark">Company & Account</h3>
                                </div>
                                <div className="space-y-2 md:space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-dark-light">Company Name:</span>
                                        <span className="text-sm font-medium text-dark break-words text-right max-w-[50%]">{companyName || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-dark-light">Account Name:</span>
                                        <span className="text-sm font-medium text-dark break-words text-right max-w-[50%]">{contract.accountName || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Financial & Dates Card */}
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-5">
                                <div className="flex items-center mb-3 md:mb-4">
                                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                                        <FiDollarSign className="text-green-600 text-lg md:text-xl" />
                                    </div>
                                    <h3 className="text-base font-semibold text-dark">Financial & Dates</h3>
                                </div>
                                <div className="space-y-2 md:space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-dark-light">Contract Value:</span>
                                        <span className="text-sm font-medium text-dark">
                                            {formatCurrency(contract.contractValue)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-dark-light">Start Date:</span>
                                        <span className="text-sm font-medium text-dark">
                                            {formatDate(contract.startContractAt)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-dark-light">Expiry Date:</span>
                                        <span className="text-sm font-medium text-dark">
                                            {formatDate(contract.expiredAt)}
                                        </span>
                                    </div>
                                    <div className="pt-2 md:pt-3 border-t border-gray-100">
                                        <div className="flex justify-between">
                                            <span className="text-xs text-dark-light">Days Remaining:</span>
                                            <span className={`text-xs font-medium ${contract.expiredAt && new Date(contract.expiredAt) < new Date()
                                                ? 'text-red-600'
                                                : 'text-green-600'
                                                }`}>
                                                {contract.expiredAt
                                                    ? Math.ceil((new Date(contract.expiredAt) - new Date()) / (1000 * 60 * 60 * 24))
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contract Types & Metadata Card */}
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-5">
                                <div className="flex items-center mb-3 md:mb-4">
                                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                                        <FiFileText className="text-purple-600 text-lg md:text-xl" />
                                    </div>
                                    <h3 className="text-base font-semibold text-dark">Contract Details</h3>
                                </div>
                                <div className="space-y-2 md:space-y-3">
                                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                                        <div>
                                            <p className="text-xs md:text-sm text-dark-light">Duration Type</p>
                                            <p className="text-xs md:text-sm font-medium text-dark">{contract.durationType || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs md:text-sm text-dark-light">Operator Type</p>
                                            <p className="text-xs md:text-sm font-medium text-dark">{contract.operatorType || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs md:text-sm text-dark-light">Supply Type</p>
                                            <p className="text-xs md:text-sm font-medium text-dark">{contract.supplyType || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="pt-2 md:pt-3 border-t border-gray-100 space-y-1 md:space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-xs text-dark-light">Created:</span>
                                            <span className="text-xs font-medium text-dark">
                                                {formatDateTime(contract.createdAt)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs text-dark-light">Last Updated:</span>
                                            <span className="text-xs font-medium text-dark">
                                                {formatDateTime(contract.updatedAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Screens Section */}
                    <div className="mb-6 md:mb-8">
                        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 pb-2 border-b border-gray-100">
                            Screens ({screens.length || 0})
                        </h2>
                        
                        {screenLoading ? (
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <p className="text-gray-500">Loading screen details...</p>
                            </div>
                        ) : screens.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Screen Type</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solution Type</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolution</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {screens.map((screen, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    <div className="flex items-center">
                                                        <FiMonitor className="mr-2 text-blue-500" />
                                                        {screen.name || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {screen.screenType || 'N/A'}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {screen.solutionType || 'N/A'}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {screen.resolution || 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <p className="text-gray-500">No screens associated with this contract</p>
                            </div>
                        )}
                    </div>

                    {/* Permissions Section */}
                    <div>
                        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 pb-2 border-b border-gray-100">
                            Account Permissions ({contract.accountPermissions?.length || 0})
                        </h2>
                        {contract.accountPermissions?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Can Read</th>
                                            <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Can Edit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {contract.accountPermissions.map((permission, index) => (
                                            <tr key={index}>
                                                <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900 break-words max-w-[120px] md:max-w-none">
                                                    {permission.name || 'N/A'}
                                                </td>
                                                <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${permission.canRead ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {permission.canRead ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${permission.canEdit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {permission.canEdit ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <p className="text-gray-500">No permissions set for this contract</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContractDetails;