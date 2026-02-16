import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiBarChart2, FiActivity, FiAlertCircle, FiCalendar, FiRefreshCcw } from 'react-icons/fi';
import { Button, Loading, showToast, SelectionInputDialog, DropdownInput } from '../../components';
import { getComponentChangesForScreen } from '../../api/services/ReportingService';
import { searchScreens } from '../../api/services/ScreenService';

const COMPONENT_OPTIONS = [
  'Control Systems',
  'Cooling Systems',
  'Data Cables (Cat6/RJ45)',
  'LED Modules',
  'Media Converters',
  'Operating Computers',
  'Power Cable',
  'Power DBs',
  'Power Supplies',
  'Service Lights & Sockets',
  'Software',
  'Video Processors',
];

const ComponentScreenReport = () => {
  const { t } = useTranslation();
  const { componentName: componentNameParam, screenId: screenIdParam } = useParams();

  const initialComponent =
    componentNameParam && COMPONENT_OPTIONS.includes(componentNameParam)
      ? componentNameParam
      : COMPONENT_OPTIONS[0];
  const initialScreenId = screenIdParam || '';

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedComponent, setSelectedComponent] = useState(initialComponent);
  const [selectedScreenId, setSelectedScreenId] = useState(initialScreenId);
  const [selectedScreenLabel, setSelectedScreenLabel] = useState(
    initialScreenId ? `#${initialScreenId}` : ''
  );
  const [isScreenDialogOpen, setIsScreenDialogOpen] = useState(false);

  // Initialize default date range (last 30 days)
  useEffect(() => {
    if (!startDate || !endDate) {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);

      setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    }
  }, [startDate, endDate]);

  const fetchScreens = useCallback(async (searchQuery) => {
    try {
      const res = await searchScreens(searchQuery);
      const screensArray = Array.isArray(res) ? res : (res?.content || res?.data || []);
      return screensArray;
    } catch (error) {
      console.error('Error fetching screens:', error);
      throw error;
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!selectedComponent || !selectedScreenId || !startDate || !endDate) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await getComponentChangesForScreen({
        componentName: selectedComponent,
        screenId: selectedScreenId,
        startDate,
        endDate,
      });
      setData(response);
    } catch (err) {
      const message =
        err?.message || t('common.errorFetchingData') || 'Failed to load component changes';
      console.error('Error loading component changes:', err);
      setError(message);
      showToast(message, 'error');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedComponent, selectedScreenId, startDate, endDate, t]);

  const handleComponentChange = (e) => {
    setSelectedComponent(e.target.value);
  };

  const handleScreenChange = (e) => {
    const value = e.target.value;
    setSelectedScreenId(value);
    setSelectedScreenLabel(value ? `#${value}` : '');
  };

  const handleScreenSelect = (item, value, label) => {
    setSelectedScreenId(value);
    setSelectedScreenLabel(item?.name || label || `#${value}`);
  };

  const componentOptions = COMPONENT_OPTIONS.map((name) => ({
    value: name,
    label: name,
  }));

  const hasData = !!data;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {t('reports.componentScreenReport.title')}
              </h1>
            <p className="text-gray-600">
              {t('reports.componentScreenReport.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded">
          <div className="flex items-center gap-2">
            <FiAlertCircle className="text-red-500" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <DropdownInput
              name="componentName"
              value={selectedComponent}
              onChange={handleComponentChange}
              options={componentOptions}
              label={t('reports.componentScreenReport.component') || 'Component'}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('reports.componentScreenReport.screen') || 'Screen'}
            </label>
            <input
              type="text"
              name="screenId"
              value={selectedScreenLabel}
              onChange={() => {}}
              onClick={() => setIsScreenDialogOpen(true)}
              placeholder={
                t('reports.screenReport.selectScreensPlaceholder') || 'Click to select screens...'
              }
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer bg-white text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-2">
              <FiCalendar className="text-gray-500" />
              {t('reports.componentScreenReport.dateRange') || 'Date Range'}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            onClick={fetchData}
            icon={<FiRefreshCcw />}
          >
            {t('common.refresh')}
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {!data && !isLoading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-200 p-8 text-center text-gray-500">
          <FiActivity className="mx-auto mb-3 text-2xl text-gray-400" />
          <p className="text-sm md:text-base">
            {t('reports.componentScreenReport.noData') ||
              'No changes recorded for this component on this screen for the selected period.'}
          </p>
        </div>
      )}

      {/* Data cards */}
      {hasData && (
        <div className="space-y-6">
          {/* Totals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    {t('reports.componentScreenReport.totalChanges') || 'Total Changes'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{data.totalChanges}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FiBarChart2 className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                {t('reports.componentScreenReport.changesPerScreen') || 'Changes per Screen'}
              </p>
              <ul className="space-y-1 text-sm text-gray-800">
                {Object.entries(data.changesPerScreen || {}).map(([id, count]) => (
                  <li key={id} className="flex justify-between">
                    <span>{t('reports.componentScreenReport.screen') || 'Screen'} #{id}</span>
                    <span className="font-semibold">{count}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                {t('reports.componentScreenReport.changeTypeDistribution') || 'Change Type Distribution'}
              </p>
              <ul className="space-y-1 text-sm text-gray-800">
                {Object.entries(data.changeTypeDistribution || {}).map(([type, count]) => (
                  <li key={type} className="flex justify-between">
                    <span>{type}</span>
                    <span className="font-semibold">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      </div>

      <SelectionInputDialog
        isOpen={isScreenDialogOpen}
        onClose={() => setIsScreenDialogOpen(false)}
        fetchItems={fetchScreens}
        getItemLabel={(item) => item.name || String(item)}
        getItemValue={(item) => item.id}
        onChange={handleScreenChange}
        onSelect={handleScreenSelect}
        value={selectedScreenId}
        id="screenId"
        label={t('reports.componentScreenReport.screen') || 'Screen'}
        searchPlaceholder={t('tickets.placeholders.searchScreens') || 'Search screens...'}
      />
    </>
  );
};

export default ComponentScreenReport;

