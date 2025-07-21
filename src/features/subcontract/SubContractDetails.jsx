import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { deleteSubContract } from '../../api/services/SubContractService';
import { FiArrowLeft, FiCalendar, FiFileText, FiTrash2, FiMonitor, FiUser, FiHome } from 'react-icons/fi';
import { Button, Loading, showToast, ConfirmationModal } from '../../components';

const SubContractDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [subContract, setSubContract] = useState(location.state?.subContract || null);
    const [loading, setLoading] = useState(!subContract);
    const [error, setError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

useEffect(() => {
    const fetchSubContract = async () => {
        setLoading(true);
        setError('');

        if (location.state?.subContract) {
            setSubContract(location.state.subContract);
            setLoading(false);
            return;
        } else {
            navigate(-1);
            showToast("Failed to load subcontract info, please try again!", "error");
        }
    };

    if (!subContract && id) {
        fetchSubContract();
    }
}, [id, subContract, location.state?.subContract, navigate]);

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteSubContract(id);
            showToast('Sub-Contract deleted successfully', 'success');
            navigate('/subcontract');
        } catch (err) {
            showToast(err.message || 'Failed to delete sub-screen', 'error');
        } finally {
            setShowDeleteModal(false);
        }
    };

    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : 'N/A';

    if (loading) return <Loading />;

    if (error) return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p>{error}</p>
        </div>
    );

    if (!subContract) return (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">Subcontract not found</p>
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Subcontract"
                message="Are you sure you want to delete this subcontract? This action cannot be undone."
                confirmText="Delete"
                danger={true}
            />

            <div className="mb-6 flex items-center justify-between">
                <Button
                    onClick={() => navigate(-1)}
                    variant='text'
                    icon={<FiArrowLeft />}
                    size='sm'
                >
                    Back to Subcontracts
                </Button>
                <Button
                    onClick={handleDeleteClick}
                    variant='danger'
                    icon={<FiTrash2 />}
                >
                    Delete
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header Section */}
                <div className="bg-primary bg-opacity-10 p-6 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-primary">Subcontract #{subContract.id}</h1>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center">
                                    <FiMonitor className="mr-1" />
                                    Subcontract ID: {subContract.id}
                                </span>
                                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center">
                                    <FiCalendar className="mr-1" />
                                    Created: {formatDate(subContract.createdAt)}
                                </span>
                                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full flex items-center">
                                    <FiCalendar className="mr-1" />
                                    Expires: {formatDate(subContract.expiredAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-6">
                    {/* Basic Information Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                            Subcontract Information
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Company Card */}
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                                <div className="flex items-center mb-4">
                                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                        <FiHome className="text-blue-600 text-xl" />
                                    </div>
                                    <h3 className="text-base font-semibold text-dark">Main Company</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-dark-light">Company Name:</span>
                                        <span className="text-sm font-medium text-dark">{subContract.mainCompany?.name || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-dark-light">Email:</span>
                                        <span className="text-sm font-medium text-dark">{subContract.mainCompany?.email || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-dark-light">Phone:</span>
                                        <span className="text-sm font-medium text-dark">{subContract.mainCompany?.phone || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-dark-light">Location:</span>
                                        <span className="text-sm font-medium text-dark">{subContract.mainCompany?.location || 'N/A'}</span>
                                    </div>
                                    <div className="pt-3 border-t border-gray-100">
                                        <div className="flex justify-between">
                                            <span className="text-xs text-dark-light">Status:</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${subContract.mainCompany?.activated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {subContract.mainCompany?.activated ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Controller Company Card */}
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                                <div className="flex items-center mb-4">
                                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                                        <FiUser className="text-green-600 text-xl" />
                                    </div>
                                    <h3 className="text-base font-semibold text-dark">Controller Company</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-dark-light">Company Name:</span>
                                        <span className="text-sm font-medium text-dark">{subContract.controllerCompany?.name || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-dark-light">Email:</span>
                                        <span className="text-sm font-medium text-dark">{subContract.controllerCompany?.email || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-dark-light">Phone:</span>
                                        <span className="text-sm font-medium text-dark">{subContract.controllerCompany?.phone || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-dark-light">Location:</span>
                                        <span className="text-sm font-medium text-dark">{subContract.controllerCompany?.location || 'N/A'}</span>
                                    </div>
                                    <div className="pt-3 border-t border-gray-100">
                                        <div className="flex justify-between">
                                            <span className="text-xs text-dark-light">Status:</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${subContract.controllerCompany?.activated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {subContract.controllerCompany?.activated ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contract Details Card */}
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                                <div className="flex items-center mb-4">
                                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                                        <FiFileText className="text-purple-600 text-xl" />
                                    </div>
                                    <h3 className="text-base font-semibold text-dark">Contract Details</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-dark-light">Contract Info:</span>
                                        <span className="text-sm font-medium text-dark">{subContract.contract?.info || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-dark-light">Start Date:</span>
                                        <span className="text-sm font-medium text-dark">
                                            {formatDate(subContract.contract?.startContractAt)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-dark-light">Expiry Date:</span>
                                        <span className="text-sm font-medium text-dark">
                                            {formatDate(subContract.contract?.expiredAt)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-dark-light">Duration Type:</span>
                                        <span className="text-sm font-medium text-dark">
                                            {subContract.contract?.durationType || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="pt-3 border-t border-gray-100">
                                        <div className="flex justify-between">
                                            <span className="text-xs text-dark-light">Days Remaining:</span>
                                            <span className={`text-xs font-medium ${subContract.expiredAt && new Date(subContract.expiredAt) < new Date()
                                                    ? 'text-red-600'
                                                    : 'text-green-600'
                                                }`}>
                                                {subContract.expiredAt
                                                    ? Math.ceil((new Date(subContract.expiredAt) - new Date()) / (1000 * 60 * 60 * 24))
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Users Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                            Main Company Users ({subContract.mainCompany?.userList?.length || 0})
                        </h2>
                        {subContract.mainCompany?.userList?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {subContract.mainCompany?.userList.map((user, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {user.username || 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {user.fullName || 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {user.email || 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="flex gap-2">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.canRead ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {user.canRead ? 'Can Read' : 'No Read'}
                                                        </span>
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.canEdit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {user.canEdit ? 'Can Edit' : 'No Edit'}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <p className="text-gray-500">No users found for the main company</p>
                            </div>
                        )}
                    </div>

                    {/* Contract Permissions Section */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                            Contract Permissions ({subContract.contract?.accountPermissions?.length || 0})
                        </h2>
                        {subContract.contract?.accountPermissions?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Can Read</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Can Edit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {subContract.contract?.accountPermissions.map((permission, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {permission.name || 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${permission.canRead ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {permission.canRead ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${permission.canEdit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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

export default SubContractDetails;