import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/useAuth';
import { useTranslation } from 'react-i18next';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiGlobe,
  FiUser,
  FiCheckCircle
} from 'react-icons/fi';
import { Loading } from '../../components';
import { getCompanyById } from '../../api/services/CompanyService';
import { showToast } from '../../components/ToastNotifier';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      // Get companyId from user object
      const companyId = user?.companyId || user?.company?.id || user?.companyID;
      
      if (!companyId) {
        setLoading(false);
        setError(t('profile.messages.companyNotFound'));
        return;
      }

      try {
        setLoading(true);
        setError('');
        const companyData = await getCompanyById(companyId);
        setCompany(companyData);
      } catch (err) {
        console.error('Error fetching company details:', err);
        setError(t('profile.messages.errorLoadingCompany') || 'Failed to load company information');
        showToast(t('profile.messages.errorLoadingCompany') || 'Failed to load company information', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchCompanyDetails();
    }
  }, [user, authLoading, t]);

  if (authLoading || loading) return <Loading />;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">{t('profile.messages.userNotFound')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Get company information from fetched company data or fallback to user object
  const companyName = company?.name || user?.companyName || user?.company?.name || 'N/A';
  const companyEmail = company?.email || user?.companyEmail || user?.company?.email || 'N/A';
  const companyPhone = company?.phone || user?.companyPhone || user?.company?.phone || 'N/A';
  const companyLocation = company?.location || user?.companyLocation || user?.company?.location || 'N/A';
  const companyAddress = company?.address || user?.companyAddress || user?.company?.address || null;
  const companyWebsite = company?.website || user?.companyWebsite || user?.company?.website || null;
  const companyDescription = company?.description || null;
  const isActivated = company?.activated !== undefined ? company.activated : true;

  const getActivationStatus = () => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActivated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
      <FiCheckCircle className="mx-1" />
      {isActivated ? t('companies.statuses.ACTIVE') : t('companies.statuses.INACTIVE')}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-2">
        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p>{error}</p>
          </div>
        )}

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/20 p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary truncate">
                  {companyName}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  {getActivationStatus()}
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className={`flex items-center gap-2 text-primary ${isRtl ? "justify-start" : "justify-end"}`}>
                  {isRtl ? (
                    <>
                      <span className="text-sm sm:text-base text-gray-600">
                        {t("profile.userInfo")}
                      </span>
                      <span className="text-lg sm:text-xl font-semibold">
                        {user?.fullName || user?.username || 'N/A'}
                      </span>
                      <FiUser className="text-lg" />
                    </>
                  ) : (
                    <>
                      <FiUser className="text-lg" />
                      <span className="text-lg sm:text-xl font-semibold">
                        {user?.fullName || user?.username || 'N/A'}
                      </span>
                      <span className="text-sm sm:text-base text-gray-600">
                        {t("profile.userInfo")}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Company Information Section */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 pb-2 border-b border-gray-200">
                {t("companies.companyInformation")}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Company Name */}
                <div className="bg-gray-50 p-4 sm:p-5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiBriefcase className="text-primary flex-shrink-0" />
                    <h3 className="text-sm font-medium text-gray-500">{t("companies.companyForm.name")}</h3>
                  </div>
                  <p className="font-medium text-gray-900 break-all">
                    {companyName}
                  </p>
                </div>

                {/* Email */}
                <div className="bg-gray-50 p-4 sm:p-5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiMail className="text-primary flex-shrink-0" />
                    <h3 className="text-sm font-medium text-gray-500">{t("companies.companyForm.email")}</h3>
                  </div>
                  <p className="font-medium text-gray-900 break-all">
                    {companyEmail}
                  </p>
                </div>

                {/* Phone */}
                <div className="bg-gray-50 p-4 sm:p-5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiPhone className="text-primary flex-shrink-0" />
                    <h3 className="text-sm font-medium text-gray-500">{t("companies.companyForm.phone")}</h3>
                  </div>
                  <p className="font-medium text-gray-900">
                    {companyPhone}
                  </p>
                </div>

                {/* Location */}
                <div className="bg-gray-50 p-4 sm:p-5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiMapPin className="text-primary flex-shrink-0" />
                    <h3 className="text-sm font-medium text-gray-500">{t("companies.companyForm.location")}</h3>
                  </div>
                  {companyLocation?.startsWith("http") ? (
                    <a
                      href={companyLocation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline hover:text-primary-hover font-medium break-all"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(companyLocation, "_blank", "noopener,noreferrer");
                      }}
                    >
                      {t("companies.viewOnMaps")}
                    </a>
                  ) : (
                    <p className="font-medium text-gray-900 break-all">
                      {companyLocation}
                    </p>
                  )}
                </div>

                {/* Address */}
                {companyAddress && (
                  <div className="bg-gray-50 p-4 sm:p-5 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FiMapPin className="text-primary flex-shrink-0" />
                      <h3 className="text-sm font-medium text-gray-500">{t("companies.companyForm.address")}</h3>
                    </div>
                    <p className="font-medium text-gray-900 break-all">
                      {companyAddress}
                    </p>
                  </div>
                )}

                {/* Website */}
                {companyWebsite && (
                  <div className="bg-gray-50 p-4 sm:p-5 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FiGlobe className="text-primary flex-shrink-0" />
                      <h3 className="text-sm font-medium text-gray-500">{t("companies.companyForm.website")}</h3>
                    </div>
                    <a
                      href={companyWebsite.startsWith('http') ? companyWebsite : `https://${companyWebsite}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline hover:text-primary-hover font-medium break-all"
                    >
                      {companyWebsite}
                    </a>
                  </div>
                )}

                {/* Description */}
                {companyDescription && (
                  <div className="bg-gray-50 p-4 sm:p-5 rounded-lg sm:col-span-2 lg:col-span-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FiBriefcase className="text-primary flex-shrink-0" />
                      <h3 className="text-sm font-medium text-gray-500">{t("companies.companyForm.description")}</h3>
                    </div>
                    <p className="font-medium text-gray-900 break-all">
                      {companyDescription}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* User Information Section */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 pb-2 border-b border-gray-200">
                {t("profile.personalInfo")}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Full Name */}
                <div className="bg-gray-50 p-4 sm:p-5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiUser className="text-primary flex-shrink-0" />
                    <h3 className="text-sm font-medium text-gray-500">{t("profile.profileForm.fullName")}</h3>
                  </div>
                  <p className="font-medium text-gray-900">
                    {user?.fullName || 'N/A'}
                  </p>
                </div>

                {/* Username */}
                <div className="bg-gray-50 p-4 sm:p-5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiUser className="text-primary flex-shrink-0" />
                    <h3 className="text-sm font-medium text-gray-500">{t("profile.profileForm.username")}</h3>
                  </div>
                  <p className="font-medium text-gray-900">
                    {user?.username || 'N/A'}
                  </p>
                </div>

                {/* Email */}
                <div className="bg-gray-50 p-4 sm:p-5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiMail className="text-primary flex-shrink-0" />
                    <h3 className="text-sm font-medium text-gray-500">{t("profile.profileForm.email")}</h3>
                  </div>
                  <p className="font-medium text-gray-900 break-all">
                    {user?.email || 'N/A'}
                  </p>
                </div>

                {/* Role */}
                <div className="bg-gray-50 p-4 sm:p-5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiUser className="text-primary flex-shrink-0" />
                    <h3 className="text-sm font-medium text-gray-500">{t("table.role")}</h3>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user?.role || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Company Users Section */}
            {company?.userList && company.userList.length > 0 && (
              <div className="mb-8 sm:mb-12">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 pb-2 border-b border-gray-200">
                  {t("companies.users")} ({company.userList.length})
                </h2>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t("profile.profileForm.fullName")}
                          </th>
                          <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t("profile.profileForm.email")}
                          </th>
                          <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t("table.role")}
                          </th>
                          <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t("table.permissions")}
                          </th>
                          <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t("table.created")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {company.userList.map((companyUser) => (
                          <tr key={companyUser.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {companyUser.fullName || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {companyUser.email || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                companyUser.role === 'ADMIN'
                                  ? 'bg-purple-100 text-purple-800'
                                  : companyUser.role === 'COMPANY' || companyUser.role === 'COMPANY_USER'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {companyUser.role || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  companyUser.canRead ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {companyUser.canRead ? t('common.yes') : t('common.no')}
                                </span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  companyUser.canEdit ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {companyUser.canEdit ? t('common.yes') : t('common.no')}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {companyUser.createdAt ? new Date(companyUser.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              }) : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    );
};

export default Profile;
