import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth/useAuth';
import { getTicketAnalaticSummary, getScreensHistory } from '../../api/services/ReportingService';
import { getActiveScreensByCompany } from '../../api/services/ContractService';
import { Loading, showToast, MultiSelectionInputDialog } from '../../components';
import { FiBarChart2, FiCalendar, FiMonitor, FiRefreshCw, FiDownload } from 'react-icons/fi';
import { Button } from '../../components';

const ScreenReport = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const isCompanyUser = user?.role === 'COMPANY' || user?.role === 'COMPANY_USER';
    const userCompanyId = user?.companyId || user?.company?.id || user?.companyID || "";

    const [analyticsSummary, setAnalyticsSummary] = useState(null);
    const [screensHistory, setScreensHistory] = useState(null);
    const [availableScreens, setAvailableScreens] = useState([]);
    const [selectedScreenIds, setSelectedScreenIds] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loadingAnalytics, setLoadingAnalytics] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [loadingScreens, setLoadingScreens] = useState(true);
    const [isScreensDialogOpen, setIsScreensDialogOpen] = useState(false);

    // Fetch ticket analytics summary
    const fetchAnalyticsSummary = useCallback(async () => {
        setLoadingAnalytics(true);
        try {
            const data = await getTicketAnalaticSummary({
                screenIds: selectedScreenIds,
                startDate,
                endDate
            });
            setAnalyticsSummary(data);
        } catch (error) {
            console.error('Error fetching analytics summary:', error);
            showToast(error.message || 'Failed to load analytics summary', 'error');
        } finally {
            setLoadingAnalytics(false);
        }
    }, [selectedScreenIds, startDate, endDate]);

    // Fetch available screens for company user
    useEffect(() => {
        const fetchScreens = async () => {
            if (!isCompanyUser || !userCompanyId) {
                setLoadingScreens(false);
                return;
            }

            try {
                setLoadingScreens(true);
                const screens = await getActiveScreensByCompany(userCompanyId);
                const screensArray = Array.isArray(screens) ? screens : (screens?.data || screens?.content || []);
                setAvailableScreens(screensArray);
            } catch (error) {
                console.error('Error fetching screens:', error);
                showToast(error.message || 'Failed to load screens', 'error');
            } finally {
                setLoadingScreens(false);
            }
        };

        fetchScreens();
    }, [isCompanyUser, userCompanyId]);

    // Load analytics summary on mount
    useEffect(() => {
        if (isCompanyUser) {
            fetchAnalyticsSummary();
        }
    }, [isCompanyUser, fetchAnalyticsSummary]);

    // Fetch screens history
    const fetchScreensHistory = useCallback(async () => {
        if (!startDate || !endDate) {
            showToast('Please select both start and end dates', 'warning');
            return;
        }

        if (selectedScreenIds.length === 0) {
            showToast('Please select at least one screen', 'warning');
            return;
        }

        setLoadingHistory(true);
        try {
            const data = await getScreensHistory({
                screenIds: selectedScreenIds,
                startDate,
                endDate
            });
            setScreensHistory(data);
        } catch (error) {
            console.error('Error fetching screens history:', error);
            showToast(error.message || 'Failed to load screens history', 'error');
        } finally {
            setLoadingHistory(false);
        }
    }, [selectedScreenIds, startDate, endDate]);

    // Fetch screens for dialog
    const fetchScreens = useCallback(async (searchQuery) => {
        try {
            const query = searchQuery?.toLowerCase().trim() || '';
            if (!query) {
                return availableScreens;
            }
            
            return availableScreens.filter(screen => 
                screen.name?.toLowerCase().includes(query) ||
                screen.location?.toLowerCase().includes(query)
            );
        } catch (error) {
            console.error('Error filtering screens:', error);
            return [];
        }
    }, [availableScreens]);

    const handleScreenConfirm = (screenIds) => {
        setSelectedScreenIds(screenIds);
    };

    const formatDuration = (duration) => {
        if (!duration || duration === 'PT0S') return '0 seconds';
        return duration || 'N/A';
    };

    const selectedScreens = availableScreens.filter(s => selectedScreenIds.includes(s.id));

    if (loadingScreens) {
        return <Loading />;
    }

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    {t('reports.screenReport.title') || 'Screen Reports'}
                </h1>
                <p className="text-gray-600">
                    {t('reports.screenReport.description') || 'View analytics and history for your company screens'}
                </p>
            </div>

            {/* Ticket Analytics Summary Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FiBarChart2 className="text-blue-600 text-xl" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            {t('reports.screenReport.analyticsSummary') || 'Ticket Analytics Summary'}
                        </h2>
                    </div>
                    <Button
                        onClick={fetchAnalyticsSummary}
                        variant="secondary"
                        icon={<FiRefreshCw />}
                        size="sm"
                        disabled={loadingAnalytics}
                    >
                        {loadingAnalytics ? t('common.loading') || 'Loading...' : t('common.refresh') || 'Refresh'}
                    </Button>
                </div>

                {loadingAnalytics ? (
                    <Loading />
                ) : analyticsSummary ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600 mb-1">
                                {t('reports.screenReport.totalTickets') || 'Total Tickets'}
                            </p>
                            <p className="text-2xl font-bold text-gray-800">
                                {analyticsSummary.totalTickets || 0}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600 mb-1">
                                {t('reports.screenReport.averageResolutionTime') || 'Avg Resolution Time'}
                            </p>
                            <p className="text-2xl font-bold text-gray-800">
                                {formatDuration(analyticsSummary.averageResolutionTimeFormatted || analyticsSummary.averageResolutionTime)}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600 mb-1">
                                {t('reports.screenReport.serviceTypeCounts') || 'Service Types'}
                            </p>
                            <p className="text-2xl font-bold text-gray-800">
                                {Object.keys(analyticsSummary.serviceTypeCounts || {}).length}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600 mb-1">
                                {t('reports.screenReport.averageTimeByServiceType') || 'Avg Time by Type'}
                            </p>
                            <p className="text-2xl font-bold text-gray-800">
                                {Object.keys(analyticsSummary.averageTimeByServiceType || {}).length}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>{t('reports.screenReport.clickRefreshToLoad') || 'Click Refresh to load analytics summary'}</p>
                    </div>
                )}
            </div>

            {/* Screens History Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <FiMonitor className="text-green-600 text-xl" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">
                        {t('reports.screenReport.screensHistory') || 'Screens History'}
                    </h2>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('reports.screenReport.selectScreens') || 'Select Screens'}
                        </label>
                        <input
                            type="text"
                            readOnly
                            value={selectedScreens.map(s => s.name).join(', ') || ''}
                            onClick={() => setIsScreensDialogOpen(true)}
                            placeholder={t('reports.screenReport.selectScreensPlaceholder') || 'Click to select screens...'}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer bg-white"
                        />
                        {selectedScreenIds.length > 0 && (
                            <p className="mt-1 text-sm text-gray-500">
                                {t('reports.screenReport.screensSelected', { count: selectedScreenIds.length }) || `${selectedScreenIds.length} screen(s) selected`}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('reports.screenReport.startDate') || 'Start Date'}
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('reports.screenReport.endDate') || 'End Date'}
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <Button
                        onClick={fetchScreensHistory}
                        variant="primary"
                        icon={<FiCalendar />}
                        disabled={loadingHistory || !startDate || !endDate || selectedScreenIds.length === 0}
                    >
                        {loadingHistory ? t('common.loading') || 'Loading...' : t('reports.screenReport.fetchHistory') || 'Fetch History'}
                    </Button>
                </div>

                {/* History Results */}
                {loadingHistory ? (
                    <Loading />
                ) : screensHistory && Array.isArray(screensHistory) && screensHistory.length > 0 ? (
                    <div className="space-y-6">
                        {screensHistory.map((screen) => (
                            <div key={screen.screenId} className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                                {/* Screen Header */}
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-300">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            {screen.screenName || `Screen ${screen.screenId}`}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Screen ID: {screen.screenId}
                                        </p>
                                    </div>
                                    <div className="bg-primary/10 px-4 py-2 rounded-lg">
                                        <p className="text-sm text-gray-600">
                                            {t('reports.screenReport.totalChanges') || 'Total Changes'}
                                        </p>
                                        <p className="text-2xl font-bold text-primary">
                                            {screen.totalChanges || 0}
                                        </p>
                                    </div>
                                </div>

                                {/* Component Histories */}
                                <div className="space-y-4">
                                    {screen.componentHistories && screen.componentHistories.length > 0 ? (
                                        screen.componentHistories.map((component, index) => (
                                            <div 
                                                key={index} 
                                                className={`bg-white rounded-lg border ${
                                                    component.changeCount > 0 
                                                        ? 'border-orange-300 shadow-sm' 
                                                        : 'border-gray-200'
                                                } p-4`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-lg font-medium text-gray-800">
                                                        {component.componentName}
                                                    </h4>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                        component.changeCount > 0
                                                            ? 'bg-orange-100 text-orange-700'
                                                            : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        {component.changeCount || 0} {component.changeCount === 1 ? 'change' : 'changes'}
                                                    </span>
                                                </div>

                                                {/* Changes List */}
                                                {component.changes && component.changes.length > 0 ? (
                                                    <div className="mt-3 space-y-2">
                                                        {component.changes.map((change, changeIndex) => (
                                                            <div 
                                                                key={changeIndex}
                                                                className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                                                            >
                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                                                                    <div>
                                                                        <p className="text-gray-500 text-xs mb-1">
                                                                            {t('reports.screenReport.changeDate') || 'Change Date'}
                                                                        </p>
                                                                        <p className="font-medium text-gray-800">
                                                                            {change.changeDate 
                                                                                ? new Date(change.changeDate).toLocaleDateString('en-US', {
                                                                                    year: 'numeric',
                                                                                    month: 'short',
                                                                                    day: 'numeric'
                                                                                })
                                                                                : 'N/A'
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-gray-500 text-xs mb-1">
                                                                            {t('reports.screenReport.fromValue') || 'From'}
                                                                        </p>
                                                                        <p className="font-medium text-gray-800">
                                                                            {change.fromValue || <span className="text-gray-400 italic">None</span>}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-gray-500 text-xs mb-1">
                                                                            {t('reports.screenReport.toValue') || 'To'}
                                                                        </p>
                                                                        <p className="font-medium text-primary">
                                                                            {change.toValue || <span className="text-gray-400 italic">None</span>}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-gray-500 text-xs mb-1">
                                                                            {t('reports.screenReport.ticketId') || 'Ticket ID'}
                                                                        </p>
                                                                        <p className="font-medium text-gray-800">
                                                                            {change.ticketId ? (
                                                                                <span className="text-blue-600">#{change.ticketId}</span>
                                                                            ) : (
                                                                                <span className="text-gray-400 italic">N/A</span>
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                {change.workerName && (
                                                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                                                        <p className="text-gray-500 text-xs mb-1">
                                                                            {t('reports.screenReport.workerName') || 'Worker'}
                                                                        </p>
                                                                        <p className="font-medium text-gray-800">
                                                                            {change.workerName}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-500 mt-2 italic">
                                                        {t('reports.screenReport.noChanges') || 'No changes recorded'}
                                                    </p>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 py-4">
                                            {t('reports.screenReport.noComponents') || 'No component histories available'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : screensHistory && Array.isArray(screensHistory) && screensHistory.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>{t('reports.screenReport.noHistoryFound') || 'No history found for the selected screens and date range'}</p>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>{t('reports.screenReport.selectFiltersAndFetch') || 'Select screens and date range, then click Fetch History'}</p>
                    </div>
                )}
            </div>

            {/* Multi Selection Dialog for Screens */}
            <MultiSelectionInputDialog
                isOpen={isScreensDialogOpen}
                onClose={() => setIsScreensDialogOpen(false)}
                fetchItems={fetchScreens}
                getItemLabel={(item) => item.name || String(item)}
                getItemValue={(item) => item.id}
                onChange={() => {}}
                onConfirm={handleScreenConfirm}
                value={selectedScreenIds || []}
                id="screenIds"
                label={t('reports.screenReport.selectScreens') || 'Select Screens'}
                searchPlaceholder={t('reports.screenReport.searchScreens') || 'Search screens...'}
            />
        </div>
    );
};

export default ScreenReport;

