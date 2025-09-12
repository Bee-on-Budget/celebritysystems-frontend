import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { deleteSubContract } from '../../api/services/SubContractService';
import { FiArrowLeft, FiCalendar, FiFileText, FiTrash2, FiMonitor, FiUser, FiHome, FiMoreVertical, FiEdit2, FiExternalLink, FiLock } from 'react-icons/fi';
import { Button, Loading, showToast, ConfirmationModal } from '../../components';
import { getScreenById } from '../../api/services/ScreenService';

const SubContractDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [subContract,] = useState(location.state?.subContract || null);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(!subContract);
  const [screenLoading, setScreenLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const fetchSubContract = async () => {
      setLoading(true);
      setError('');

      if (subContract) {
        console.log(subContract);

        // Fetch screen details if screenIds exist
        if (subContract.contract.screenIds && subContract.contract.screenIds.length > 0) {
          setScreenLoading(true);
          const screenPromises = subContract.contract.screenIds.map(screenId =>
            getScreenById(screenId).catch(err => {
              console.error(`Error fetching screen ${screenId}:`, err);
              return null;
            })
          );

          const screenResults = await Promise.all(screenPromises);
          setScreens(screenResults.filter(screen => screen !== null));
          setScreenLoading(false);
        }

        setLoading(false);
        return;
      } else {
        navigate(-1);
        showToast("Failed to load subcontract info, please try again!", "error");
      }
    };

    if (id) {
      fetchSubContract();
    }
  }, [id, subContract, location.state?.subContract, navigate]);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setShowMobileMenu(false);
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
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
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
            <span className="hidden sm:inline">Back to Subcontracts</span>
            <span className="sm:hidden">Back</span>
          </Button>

          {/* Desktop Action Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <Button
              onClick={() => navigate(`/subcontract/${id}/edit`, { state: { subContract } })}
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
                    navigate(`/subcontract/${id}/edit`, { state: { subContract } });
                    setShowMobileMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100"
                >
                  <FiEdit2 />
                  Edit Subcontract
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <FiTrash2 />
                  Delete Subcontract
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
              <h1 className="text-xl md:text-2xl font-bold text-primary break-words">Subcontract #{subContract.id}</h1>
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
        <div className="p-4 md:p-6">
          {/* Basic Information Section */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 pb-2 border-b border-gray-100">
              Subcontract Information
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Main Company Card */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-5">
                <div className="flex items-center mb-3 md:mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <FiHome className="text-blue-600 text-lg md:text-xl" />
                  </div>
                  <h3 className="text-base font-semibold text-dark">Main Company</h3>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-light">Company Name:</span>
                    <span className="text-sm font-medium text-dark break-words text-right max-w-[50%]">{subContract.mainCompany?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-light">Email:</span>
                    <span className="text-sm font-medium text-dark break-words text-right max-w-[50%]">{subContract.mainCompany?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-light">Phone:</span>
                    <span className="text-sm font-medium text-dark break-words text-right max-w-[50%]">{subContract.mainCompany?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-light">Location:</span>
                    {subContract.mainCompany?.location ? (
                      <a
                        href={subContract.mainCompany.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:text-primary-hover font-medium transition-colors text-sm"
                      >
                        View on Maps
                        <FiExternalLink className="text-xs" />
                      </a>
                    ) : (
                      <span className="text-sm font-medium text-dark">N/A</span>
                    )}
                  </div>
                  <div className="pt-2 md:pt-3 border-t border-gray-100">
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
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-5">
                <div className="flex items-center mb-3 md:mb-4">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <FiUser className="text-green-600 text-lg md:text-xl" />
                  </div>
                  <h3 className="text-base font-semibold text-dark">Controller Company</h3>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-light">Company Name:</span>
                    <span className="text-sm font-medium text-dark break-words text-right max-w-[50%]">{subContract.controllerCompany?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-light">Email:</span>
                    <span className="text-sm font-medium text-dark break-words text-right max-w-[50%]">{subContract.controllerCompany?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-light">Phone:</span>
                    <span className="text-sm font-medium text-dark break-words text-right max-w-[50%]">{subContract.controllerCompany?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-light">Location:</span>
                    {subContract.controllerCompany?.location ? (
                      <a
                        href={subContract.controllerCompany.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:text-primary-hover font-medium transition-colors text-sm"
                      >
                        View on Maps
                        <FiExternalLink className="text-xs" />
                      </a>
                    ) : (
                      <span className="text-sm font-medium text-dark">N/A</span>
                    )}
                  </div>
                  <div className="pt-2 md:pt-3 border-t border-gray-100">
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
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-5">
                <div className="flex items-center mb-3 md:mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <FiFileText className="text-purple-600 text-lg md:text-xl" />
                  </div>
                  <h3 className="text-base font-semibold text-dark">Contract Details</h3>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-light">Contract Info:</span>
                    <span className="text-sm font-medium text-dark break-words text-right max-w-[50%]">{subContract.contract?.info || 'N/A'}</span>
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
                  <div className="pt-2 md:pt-3 border-t border-gray-100">
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
          {/* Main Company Users Section */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 pb-2 border-b border-gray-100">
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
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            <FiUser className="mr-2 text-indigo-500" />
                            {user.username || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.fullName || 'N/A'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email || 'N/A'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-col sm:flex-row gap-2">
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
          ---
          {/* Controller Company Users Section */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 pb-2 border-b border-gray-100">
              Controller Company Users ({subContract.controllerCompany?.userList?.length || 0})
            </h2>
            {subContract.controllerCompany?.userList?.length > 0 ? (
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
                    {subContract.controllerCompany?.userList.map((user, index) => (
                      <tr key={index}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            <FiUser className="mr-2 text-indigo-500" />
                            {user.username || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.fullName || 'N/A'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email || 'N/A'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-col sm:flex-row gap-2">
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
                <p className="text-gray-500">No users found for the controller company</p>
              </div>
            )}
          </div>
          ---
          {/* Contract Permissions Section */}
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 pb-2 border-b border-gray-100">
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
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            <FiLock className="mr-2 text-red-500" />
                            {permission.name || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${permission.canRead ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {permission.canRead ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
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