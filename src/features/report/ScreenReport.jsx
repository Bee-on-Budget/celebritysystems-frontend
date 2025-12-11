import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth/useAuth';
import { getTicketAnalaticSummary, getScreensHistory } from '../../api/services/ReportingService';
import { getActiveScreensByCompany } from '../../api/services/ContractService';
import { Loading, showToast, MultiSelectionInputDialog } from '../../components';
import { FiBarChart2, FiCalendar, FiMonitor, FiRefreshCw } from 'react-icons/fi';
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

    // Fetch ticket analytics summary (filtered)
    const fetchAnalyticsSummary = useCallback(async () => {
        // Require filters before calling API
        if (!startDate || !endDate || selectedScreenIds.length === 0) {
            // Do not show a toast here to avoid noise on initial mount; just skip.
            return;
        }

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
                ) : screensHistory ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">
                                    {t('reports.screenReport.totalTickets') || 'Total Tickets'}
                                </p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {screensHistory.totalTickets || 0}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">
                                    {t('reports.screenReport.averageResolutionTime') || 'Avg Resolution Time'}
                                </p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {formatDuration(screensHistory.averageResolutionTimeFormatted || screensHistory.averageResolutionTime)}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">
                                    {t('reports.screenReport.serviceTypeCounts') || 'Service Types'}
                                </p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {Object.keys(screensHistory.serviceTypeCounts || {}).length}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">
                                    {t('reports.screenReport.averageTimeByServiceType') || 'Avg Time by Type'}
                                </p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {Object.keys(screensHistory.averageTimeByServiceType || {}).length}
                                </p>
                            </div>
                        </div>

                        {/* Service Type Counts Details */}
                        {screensHistory.serviceTypeCounts && Object.keys(screensHistory.serviceTypeCounts).length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                    {t('reports.screenReport.serviceTypeBreakdown') || 'Service Type Breakdown'}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {Object.entries(screensHistory.serviceTypeCounts).map(([type, count]) => (
                                        <div key={type} className="bg-white p-3 rounded border border-gray-200">
                                            <p className="text-sm font-medium text-gray-700">{type}</p>
                                            <p className="text-xl font-bold text-primary">{count}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Average Time by Service Type */}
                        {screensHistory.averageTimeByServiceType && Object.keys(screensHistory.averageTimeByServiceType).length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                    {t('reports.screenReport.averageTimeBreakdown') || 'Average Time by Service Type'}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {Object.entries(screensHistory.averageTimeByServiceType).map(([type, time]) => (
                                        <div key={type} className="bg-white p-3 rounded border border-gray-200">
                                            <p className="text-sm font-medium text-gray-700">{type}</p>
                                            <p className="text-lg font-bold text-primary">
                                                {formatDuration(time)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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

