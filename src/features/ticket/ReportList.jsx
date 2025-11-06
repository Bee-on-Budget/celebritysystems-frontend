import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getTicketsByCompany } from '../../api/services/TicketService';
import { useAuth } from '../../auth/useAuth';
import { DataList, Loading } from '../../components';
import { FiFileText, FiCalendar, FiUser, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const ReportList = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const userCompanyId = user?.companyId || user?.company?.id || user?.companyID;

  useEffect(() => {
    const fetchReports = async () => {
      if (!userCompanyId) {
        setError(t('tickets.messages.companyNotFound') || 'Company ID not found');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError('');
      try {
        const data = await getTicketsByCompany(userCompanyId);
        const tickets = Array.isArray(data) ? data : (data?.data || data?.content || []);
        
        // Filter tickets that have worker reports
        const ticketsWithReports = tickets.filter(ticket => ticket.workerReport);
        
        setReports(ticketsWithReports);
        setFiltered(ticketsWithReports);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError(err.message || t('tickets.messages.errorFetchingTickets'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [userCompanyId, t]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFiltered(reports);
      return;
    }

    const filteredReports = reports.filter(report => {
      const searchLower = term.toLowerCase();
      return (
        report.title?.toLowerCase().includes(searchLower) ||
        report.description?.toLowerCase().includes(searchLower) ||
        report.screenName?.toLowerCase().includes(searchLower) ||
        report.assignedToWorkerName?.toLowerCase().includes(searchLower) ||
        report.status?.toLowerCase().includes(searchLower) ||
        report.serviceTypeDisplayName?.toLowerCase().includes(searchLower)
      );
    });

    setFiltered(filteredReports);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFiltered(reports);
  };

  const handleResultClick = (result) => {
    // Navigate to ticket details
    navigate(`/tickets/${result.id}`, { state: { ticket: result } });
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
      <span className={`${bgColor} ${textColor} px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center`}>
        {icon}
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderReportItem = (list) => {
    const headerStyle = "px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider";
    const nameStyle = "px-6 py-4 text-sm text-dark font-medium";
    const bodyStyle = "px-6 py-4 text-sm text-gray-600 max-w-xs whitespace-nowrap overflow-hidden text-ellipsis";
    const rowStyle = "h-16 hover:bg-gray-50 transition cursor-pointer border-b border-gray-200";

    if (!list || list.length === 0) {
      return (
        <div className="text-center py-12">
          <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">{t('tickets.messages.noReportsFound') || 'No reports found'}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('tickets.messages.noReportsDescription') || 'There are no worker reports available for your company.'}</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={`${headerStyle} w-64`}>{t('tickets.table.title')}</th>
              <th className={headerStyle}>{t('tickets.table.screen')}</th>
              <th className={headerStyle}>{t('tickets.table.worker')}</th>
              <th className={headerStyle}>{t('tickets.table.serviceType')}</th>
              <th className={headerStyle}>{t('tickets.table.reportDate')}</th>
              <th className={headerStyle}>{t('tickets.table.status')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {list.map((report) => (
              <tr
                key={report.id}
                className={rowStyle}
                onClick={() => navigate(`/tickets/${report.id}`, { state: { ticket: report } })}
              >
                <td className={nameStyle} title={report.title}>
                  {report.title}
                </td>
                <td className={bodyStyle} title={report.screenName}>
                  {report.screenName || 'N/A'}
                </td>
                <td className={bodyStyle} title={report.assignedToWorkerName}>
                  <div className="flex items-center gap-2">
                    <FiUser className="text-gray-400" />
                    <span>{report.assignedToWorkerName || 'N/A'}</span>
                  </div>
                </td>
                <td className={bodyStyle}>
                  {report.serviceTypeDisplayName || report.serviceType || 'N/A'}
                </td>
                <td className={bodyStyle}>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-gray-400" />
                    <span>{formatDate(report.workerReport?.reportDate || report.workerReport?.createdAt)}</span>
                  </div>
                </td>
                <td className={bodyStyle}>
                  {getStatusBadge(report.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <DataList
      title={t('tickets.reportsList') || 'Worker Reports'}
      label="reports"
      error={error}
      isLoading={isLoading}
      onSearch={handleSearch}
      onResultClick={handleResultClick}
      onClearSearch={handleClearSearch}
      totalElements={filtered.length}
    >
      {renderReportItem(filtered)}
    </DataList>
  );
};

export default ReportList;



