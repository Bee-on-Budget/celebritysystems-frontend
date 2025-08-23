import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getCompanyById, deleteCompany } from '../../api/services/CompanyService';
import { 
  FiArrowLeft, 
  FiTrash2, 
  FiUsers, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiClock, 
  FiCheckCircle, 
  FiEdit2,
  FiMoreVertical,
  FiExternalLink
} from 'react-icons/fi';
import { Button, Loading, showToast } from '../../components';
import ConfirmationModal from '../../components/ConfirmationModal';

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [company, setCompany] = useState(location.state?.company || null);
  const [loading, setLoading] = useState(!company);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await getCompanyById(id);
        setCompany(data);
      } catch (err) {
        setError(err.message || 'Failed to load company details');
      } finally {
        setLoading(false);
      }
    };

    if (!company && id) {
      fetchCompany();
    }
  }, [id, company]);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setShowMobileMenu(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCompany(id);
      showToast('Company deleted successfully.', 'success');
      navigate('/companies');
    } catch (err) {
      showToast(err.message || 'Failed to delete company. Please try again.', 'error');
      console.error('Error deleting company:', err);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleEditClick = () => {
    navigate(`/companies/${id}/edit`, { state: { company } });
    setShowMobileMenu(false);
  };

  if (loading) return <Loading />;

  if (error) return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error}</p>
        </div>
      </div>
    </div>
  );

  if (!company) return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600">Company not found</p>
        </div>
      </div>
    </div>
  );

  const getActivationStatus = (activated) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      activated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
    }`}>
      <FiCheckCircle className="mr-1" />
      {activated ? 'Active' : 'Inactive'}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-2">
        
        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Company"
          message="Are you sure you want to delete this company? This action cannot be undone."
          confirmText="Delete"
        />

        {/* Header Section - Responsive */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <Button
              onClick={() => navigate('/companies')}
              variant='text'
              icon={<FiArrowLeft />}
              size='sm'
              className="flex-shrink-0"
            >
              <span className="hidden sm:inline">Back to Companies</span>
              <span className="sm:hidden">Back</span>
            </Button>

            {/* Desktop Action Buttons */}
            <div className="hidden sm:flex gap-2">
              <Button
                onClick={handleEditClick}
                icon={<FiEdit2 />}
                size="sm"
              >
                <span className="hidden md:inline">Edit</span>
              </Button>
              <Button
                onClick={handleDeleteClick}
                variant='danger'
                icon={<FiTrash2 />}
                size="sm"
              >
                <span className="hidden md:inline">Delete</span>
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
                    onClick={handleEditClick}
                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100"
                  >
                    <FiEdit2 />
                    Edit Company
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <FiTrash2 />
                    Delete Company
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/20 p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary truncate">
                  {company.name}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  {getActivationStatus(company.activated)}
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center sm:justify-end gap-2 text-primary">
                  <FiUsers className="text-lg" />
                  <span className="text-lg sm:text-xl font-semibold">
                    {company.userList?.length || 0}
                  </span>
                  <span className="text-sm sm:text-base text-gray-600">
                    User{(company.userList?.length || 0) !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            
            {/* Basic Information Section */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 pb-2 border-b border-gray-200">
                Company Information
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                
                {/* Email */}
                <div className="bg-gray-50 p-4 sm:p-5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiMail className="text-primary flex-shrink-0" />
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  </div>
                  <p className="font-medium text-gray-900 break-all">
                    {company.email || 'N/A'}
                  </p>
                </div>

                {/* Phone */}
                <div className="bg-gray-50 p-4 sm:p-5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiPhone className="text-primary flex-shrink-0" />
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  </div>
                  <p className="font-medium text-gray-900">
                    {company.phone || 'N/A'}
                  </p>
                </div>

                {/* Location */}
                <div className="bg-gray-50 p-4 sm:p-5 rounded-lg sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FiMapPin className="text-primary flex-shrink-0" />
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  </div>
                  {company.location?.startsWith("http") ? (
                    <a
                      href={company.location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-medium transition-colors"
                    >
                      View on Maps
                      <FiExternalLink className="text-sm" />
                    </a>
                  ) : (
                    <p className="font-medium text-gray-900">
                      {company.location || 'N/A'}
                    </p>
                  )}
                </div>

                {/* Created Date */}
                <div className="bg-gray-50 p-4 sm:p-5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiClock className="text-primary flex-shrink-0" />
                    <h3 className="text-sm font-medium text-gray-500">Created</h3>
                  </div>
                  <p className="font-medium text-gray-900">
                    {new Date(company.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {/* Last Updated */}
                {company.updatedAt && (
                  <div className="bg-gray-50 p-4 sm:p-5 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FiClock className="text-primary flex-shrink-0" />
                      <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                    </div>
                    <p className="font-medium text-gray-900">
                      {new Date(company.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Users Section */}
            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Users ({company.userList?.length || 0})
                </h2>
              </div>

              {company.userList?.length > 0 ? (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Permissions
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {company.userList.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {user.fullName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.role === 'ADMIN'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  user.canRead ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {user.canRead ? 'Read' : 'No Read'}
                                </span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  user.canEdit ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {user.canEdit ? 'Edit' : 'No Edit'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile/Tablet Card View */}
                  <div className="lg:hidden space-y-4">
                    {company.userList.map((user) => (
                      <div key={user.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {user.fullName}
                            </h3>
                            <p className="text-sm text-gray-500 truncate mt-1">
                              {user.email}
                            </p>
                          </div>
                          <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.canRead ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.canRead ? '✓ Read' : '✗ No Read'}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.canEdit ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.canEdit ? '✓ Edit' : '✗ No Edit'}
                          </span>
                        </div>
                        
                        <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                          Created: {new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                  <div className="bg-gray-50 p-6 sm:p-8 rounded-lg text-center">
                  <FiUsers className="mx-auto text-3xl text-primary mb-3" />
                  <p className="text-gray-500 text-sm sm:text-base">
                    No users found for this company
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile bottom spacing */}
        <div className="h-6 sm:hidden"></div>
      </div>
    </div>
  );
};

export default CompanyDetails;