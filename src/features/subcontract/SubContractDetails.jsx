import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { deleteSubContract } from '../../api/services/SubContractService';
import { FiArrowLeft, FiCalendar, FiFileText, FiTrash2, FiMonitor, FiUser, FiHome, FiMoreVertical, FiEdit2, FiExternalLink, FiLock } from 'react-icons/fi';
import { Button, Loading, showToast, ConfirmationModal } from '../../components';
import { getScreenById } from '../../api/services/ScreenService';

const SubContractDetails = () => {
  const { t } = useTranslation();
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
        showToast(t('subcontracts.messages.failedToLoadInfo'), "error");
      }
    };

    if (id) {
      fetchSubContract();
    }
  }, [id, subContract, location.state?.subContract, navigate, t]);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setShowMobileMenu(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteSubContract(id);
      showToast(t('subcontracts.messages.subcontractDeleted'), 'success');
      navigate('/subcontract');
    } catch (err) {
      showToast(err.message || t('subcontracts.messages.errorDeletingSubcontract'), 'error');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : t('subcontracts.details.na');

  if (loading) return <Loading />;

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
      <p>{error}</p>
    </div>
  );

  if (!subContract) return (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <p className="text-gray-600">{t('subcontracts.messages.subcontractNotFound')}</p>
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title={t('subcontracts.confirmations.deleteTitle')}
        message={t('subcontracts.confirmations.deleteMessage')}
        confirmText={t('subcontracts.confirmations.deleteConfirm')}
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
            <span className="hidden sm:inline">{t('subcontracts.actions.backToSubcontracts')}</span>
            <span className="sm:hidden">{t('subcontracts.actions.back')}</span>
          </Button>

          {/* Desktop Action Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <Button
              onClick={() => navigate(`/subcontract/${id}/edit`, { state: { subContract } })}
              variant='primary'
              icon={<FiEdit2 />}
              size="sm"
            >
              {t('subcontracts.actions.edit')}
            </Button>
            <Button
              onClick={handleDeleteClick}
              variant='danger'
              icon={<FiTrash2 />}
              size="sm"
            >
              {t('subcontracts.actions.delete')}
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
                  {t('subcontracts.editSubcontract')}
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <FiTrash2 />
                  {t('subcontracts.confirmations.deleteTitle')}
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
              <h1 className="text-xl md:text-2xl font-bold text-primary break-words">{t('subcontracts.details.subcontractInfo')} #{subContract.id}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center">
                  <FiMonitor className="mr-1" />
                  {t('subcontracts.details.subcontractId')}: {subContract.id}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center">
                  <FiCalendar className="mr-1" />
                  {t('subcontracts.details.created')}: {formatDate(subContract.createdAt)}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full flex items-center">
                  <FiCalendar className="mr-1" />
                  {t('subcontracts.details.expires')}: {formatDate(subContract.expiredAt)}
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
              {t('subcontracts.details.subcontractInfo')}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Main Company Card */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-5">
                <div className="flex items-center mb-3 md:mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <FiHome className="text-blue-600 text-lg md:text-xl" />
                  </div>
                  <h3 className="text-base font-semibold text-dark">{t('subcontracts.details.mainCompany')}</h3>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-light">{t('subcontracts.details.companyName')}:</span>
                    <span className="text-sm font-medium text-dark break-words text-right max-w-[50%]">{subContract.mainCompany?.name || t('subcontracts.details.na')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-light">{t('subcontracts.details.email')}:</span>
                    <span className="text-sm font-medium text-dark break-words text-right max-w-[50%]">{subContract.mainCompany?.email || t('subcontracts.details.na')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-light">{t('subcontracts.details.phone')}:</span>
                    <span className="text-sm font-medium text-dark break-words text-right max-w-[50%]">{subContract.mainCompany?.phone || t('subcontracts.details.na')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-light">{t('subcontracts.details.location')}:</span>
                    {subContract.mainCompany?.location ? (
                      <a
                        href={subContract.mainCompany.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:text-primary-hover font-medium transition-colors text-sm"
                      >
                        {t('subcontracts.details.viewOnMaps')}
                        <FiExternalLink className="text-xs" />
                      </a>
                    ) : (
                      <span className="text-sm font-medium text-dark">{t('subcontracts.details.na')}</span>
                    )}
                  </div>
                  <div className="pt-2 md:pt-3 border-t border-gray-100">
                    <div className="flex justify-between">
                      <span className="text-xs text-dark-light">{t('subcontracts.details.status')}:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${subContract.mainCompany?.activated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {subContract.mainCompany?.activated ? t('subcontracts.details.active') : t('subcontracts.details.inactive')}
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
                  <h3 className="text-base font-semibold text-dark">{t('subcontracts.details.controllerCompany')}</h3>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-light">{t('subcontracts.details.companyName')}:</span>
                    <span className="text-sm font-medium text-dark break-words text-right max-w-[50%]">{subContract.controllerCompany?.name || t('subcontracts.details.na')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-light">{t('subcontracts.details.email')}:</span>
                    <span className="text-sm font-medium text-dark break-words text-right max-w-[50%]">{subContract.controllerCompany?.email || t('subcontracts.details.na')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-light">{t('subcontracts.details.phone')}:</span>
                    <span className="text-sm font-medium text-dark break-words text-right max-w-[50%]">{subContract.controllerCompany?.phone || t('subcontracts.details.na')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-light">{t('subcontracts.details.location')}:</span>
                    {subContract.controllerCompany?.location ? (
                      <a
                        href={subContract.controllerCompany.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:text-primary-hover font-medium transition-colors text-sm"
                      >
                        {t('subcontracts.details.viewOnMaps')}
                        <FiExternalLink className="text-xs" />
                      </a>
                    ) : (
                      <span className="text-sm font-medium text-dark">{t('subcontracts.details.na')}</span>
                    )}
                  </div>
                  <div className="pt-2 md:pt-3 border-t border-gray-100">
                    <div className="flex justify-between">
                      <span className="text-xs text-dark-light">{t('subcontracts.details.status')}:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${subContract.controllerCompany?.activated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {subContract.controllerCompany?.activated ? t('subcontracts.details.active') : t('subcontracts.details.inactive')}
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
                  <h3 className="text-base font-semibold text-dark">{t('subcontracts.details.contractDetails')}</h3>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-light">{t('subcontracts.details.contractInfo')}:</span>
                    <span className="text-sm font-medium text-dark break-words text-right max-w-[50%]">{subContract.contract?.info || t('subcontracts.details.na')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-light">{t('subcontracts.details.startDate')}:</span>
                    <span className="text-sm font-medium text-dark">
                      {formatDate(subContract.contract?.startContractAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-light">{t('subcontracts.details.expiryDate')}:</span>
                    <span className="text-sm font-medium text-dark">
                      {formatDate(subContract.contract?.expiredAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-light">{t('subcontracts.details.durationType')}:</span>
                    <span className="text-sm font-medium text-dark">
                      {subContract.contract?.durationType || t('subcontracts.details.na')}
                    </span>
                  </div>
                  <div className="pt-2 md:pt-3 border-t border-gray-100">
                    <div className="flex justify-between">
                      <span className="text-xs text-dark-light">{t('subcontracts.details.daysRemaining')}:</span>
                      <span className={`text-xs font-medium ${subContract.expiredAt && new Date(subContract.expiredAt) < new Date()
                        ? 'text-red-600'
                        : 'text-green-600'
                        }`}>
                        {subContract.expiredAt
                          ? Math.ceil((new Date(subContract.expiredAt) - new Date()) / (1000 * 60 * 60 * 24))
                          : t('subcontracts.details.na')}
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
              {t('subcontracts.details.screens')} ({screens.length || 0})
            </h2>

            {screenLoading ? (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-500">{t('subcontracts.messages.loadingScreenDetails')}</p>
              </div>
            ) : screens.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('subcontracts.details.name')}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('subcontracts.details.screenType')}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('subcontracts.details.solutionType')}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('subcontracts.details.resolution')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {screens.map((screen, index) => (
                      <tr key={index}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            <FiMonitor className="mr-2 text-blue-500" />
                            {screen.name || t('subcontracts.details.na')}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {screen.screenType || t('subcontracts.details.na')}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {screen.solutionType || t('subcontracts.details.na')}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {screen.resolution || t('subcontracts.details.na')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-500">{t('subcontracts.messages.noScreensAssociated')}</p>
              </div>
            )}
          </div>
          {/* Main Company Users Section */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 pb-2 border-b border-gray-100">
              {t('subcontracts.details.mainCompanyUsers')} ({subContract.mainCompany?.userList?.length || 0})
            </h2>
            {subContract.mainCompany?.userList?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('subcontracts.details.username')}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('subcontracts.details.fullName')}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('subcontracts.details.email')}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('subcontracts.details.permissions')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subContract.mainCompany?.userList.map((user, index) => (
                      <tr key={index}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            <FiUser className="mr-2 text-indigo-500" />
                            {user.username || t('subcontracts.details.na')}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.fullName || t('subcontracts.details.na')}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email || t('subcontracts.details.na')}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.canRead ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {user.canRead ? t('subcontracts.details.canRead') : t('subcontracts.details.noRead')}
                            </span>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.canEdit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {user.canEdit ? t('subcontracts.details.canEdit') : t('subcontracts.details.noEdit')}
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
                <p className="text-gray-500">{t('subcontracts.messages.noUsersFound')} {t('subcontracts.details.mainCompany')}</p>
              </div>
            )}
          </div>
          {/* Controller Company Users Section */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 pb-2 border-b border-gray-100">
              {t('subcontracts.details.controllerCompanyUsers')} ({subContract.controllerCompany?.userList?.length || 0})
            </h2>
            {subContract.controllerCompany?.userList?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('subcontracts.details.username')}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('subcontracts.details.fullName')}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('subcontracts.details.email')}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('subcontracts.details.permissions')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subContract.controllerCompany?.userList.map((user, index) => (
                      <tr key={index}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            <FiUser className="mr-2 text-indigo-500" />
                            {user.username || t('subcontracts.details.na')}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.fullName || t('subcontracts.details.na')}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email || t('subcontracts.details.na')}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.canRead ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {user.canRead ? t('subcontracts.details.canRead') : t('subcontracts.details.noRead')}
                            </span>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.canEdit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {user.canEdit ? t('subcontracts.details.canEdit') : t('subcontracts.details.noEdit')}
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
                <p className="text-gray-500">{t('subcontracts.messages.noUsersFound')} {t('subcontracts.details.controllerCompany')}</p>
              </div>
            )}
          </div>
          {/* Contract Permissions Section */}
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 pb-2 border-b border-gray-100">
              {t('subcontracts.details.contractPermissions')} ({subContract.contract?.accountPermissions?.length || 0})
            </h2>
            {subContract.contract?.accountPermissions?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('subcontracts.details.name')}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('subcontracts.details.canRead')}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('subcontracts.details.canEdit')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subContract.contract?.accountPermissions.map((permission, index) => (
                      <tr key={index}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            <FiLock className="mr-2 text-red-500" />
                            {permission.name || t('subcontracts.details.na')}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${permission.canRead ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {permission.canRead ? t('subcontracts.details.yes') : t('subcontracts.details.no')}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${permission.canEdit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {permission.canEdit ? t('subcontracts.details.yes') : t('subcontracts.details.no')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-500">{t('subcontracts.messages.noPermissionsSet')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubContractDetails;