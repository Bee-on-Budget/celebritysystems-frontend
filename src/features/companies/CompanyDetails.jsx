import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getCompanyById, deleteCompany } from '../../api/services/CompanyService';
import { FiArrowLeft, FiTrash2, FiUsers, FiMail, FiPhone, FiMapPin, FiClock, FiCheckCircle, FiEdit2 } from 'react-icons/fi';
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
  };

  // const handleDelete = async () => {
  //     if (window.confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
  //         try {
  //             await deleteCompany(id);
  //             showToast('Company deleted successfully.', 'success');
  //             navigate('/companies');
  //         } catch (err) {
  //             showToast(err.message || 'Failed to delete company. Please try again.', 'error');
  //             console.error('Error deleting company:', err);
  //         }
  //     }
  // };

  if (loading) return <Loading />;

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
      <p>{error}</p>
    </div>
  );

  if (!company) return (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <p className="text-gray-600">Company not found</p>
    </div>
  );

  //   const LabelContainer = ({ children }) => (
  //     <span className="px-3 py-1 bg-primary bg-opacity-20 text-primary text-sm rounded-full">
  //       {children}
  //     </span>
  //   );

  //   const getCompanyTypeLabel = (type) => {
  //     switch (type) {
  //       case 'MANUFACTURER': return "Manufacturer";
  //       case 'DISTRIBUTOR': return "Distributor";
  //       case 'CLIENT': return "Client";
  //       default: return "N/A";
  //     }
  //   };

  const getActivationStatus = (activated) => (
    <span className={`px-3 py-1 rounded-full text-sm ${activated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
      {activated ? 'Active' : 'Inactive'}
    </span>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Company"
        message="Are you sure you want to delete this company? This action cannot be undone."
        confirmText="Delete"
      />
      <div className="mb-6 flex items-center justify-between">
        <Button
          onClick={() => navigate(-1)}
          variant='text'
          icon={<FiArrowLeft />}
          size='sm'
        >
          Back to Companies
        </Button>
        <div className="flex gap-2">
          <Button
            onClick={handleEditClick}
            variant='outline'
            icon={<FiEdit2 />}
          >
            Edit
          </Button>
          <Button
            onClick={handleDeleteClick}
            variant='danger'
            icon={<FiTrash2 />}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-primary bg-opacity-10 p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary">{company.name}</h1>
            </div>
            <div className="mt-4 sm:mt-0 text-right">
              <p className="text-lg font-semibold flex items-center justify-end gap-2">
                <FiUsers className="text-primary" />
                {company.userList?.length || 0} Users
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Basic Information Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Company Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <FiMail /> Email
                </h3>
                <p className="font-medium">{company.email || 'N/A'}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <FiPhone /> Phone
                </h3>
                <p className="font-medium">{company.phone || 'N/A'}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <FiMapPin /> Location
                </h3>
                {company.location?.startsWith("http") ? (
                  <a
                    href={company.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(company.location, "_blank", "noopener,noreferrer");
                    }}
                    className="text-primary underline hover:text-primary-hover"
                  >
                    View Location
                  </a>
                ) : (
                  <p className="text-gray-600">{company.location || 'N/A'}</p>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <FiCheckCircle /> Status
                </h3>
                <p className="font-medium">{getActivationStatus(company.activated)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <FiClock /> Created
                </h3>
                <p className="font-medium">
                  {new Date(company.createdAt).toLocaleDateString()}
                </p>
              </div>

              {company.updatedAt && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                    <FiClock /> Last Updated
                  </h3>
                  <p className="font-medium">
                    {new Date(company.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Users Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Users ({company.userList?.length || 0})
            </h2>

            {company.userList?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {company.userList.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.fullName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                            }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex gap-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.canRead ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                              {user.canRead ? 'Can Read' : 'No Read'}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.canEdit ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                              {user.canEdit ? 'Can Edit' : 'No Edit'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-500">No users found for this company</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;