import React, { useCallback, useEffect, useState } from 'react';
import { Calendar, BarChart3, Filter, Eye, Settings } from 'lucide-react';
import { Button, Loading, showToast } from '../../components';
import { getReportsDashboardSummary } from '../../api/services/ReportingService';
import { FaDownload, FaSyncAlt } from 'react-icons/fa';

const ComponentSummaryDashboard = () => {
  // Initialize with empty data structure
  const [reportData, setReportData] = useState({
    reportType: "",
    startDate: "",
    endDate: "",
    componentSummaries: [],
    detailedRecords: null,
    totalCounts: {
      componentTotals: {},
      overallTotal: 0
    }
  });

  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [filterText, setFilterText] = useState('');
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  const loadInitialValues = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getReportsDashboardSummary({ startDate, endDate });
      setReportData(response);

      // Update date fields if they're empty
      if (!startDate) setStartDate(response.startDate);
      if (!endDate) setEndDate(response.endDate);
    } catch (error) {
      showToast(error);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    // Initialize with default dates if not set
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    if (!startDate) setStartDate(oneYearAgo.toISOString().split('T')[0]);
    if (!endDate) setEndDate(today.toISOString().split('T')[0]);

    if (startDate && endDate) {
      loadInitialValues();
    }
  }, [loadInitialValues, startDate, endDate]);

  const getComponentIcon = useCallback((componentName) => {
    if (componentName.includes('Power') || componentName.includes('LED')) return '⚡';
    if (componentName.includes('Cooling')) return '❄️';
    if (componentName.includes('Cable') || componentName.includes('Data')) return '🔌';
    if (componentName.includes('Software') || componentName.includes('Computer')) return '💻';
    if (componentName.includes('Video') || componentName.includes('Media')) return '📹';
    return '⚙️';
  }, []);

  const filteredComponents = React.useMemo(() => {
    return reportData.componentSummaries
      .filter(component =>
        component.componentName.toLowerCase().includes(filterText.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'name') return a.componentName.localeCompare(b.componentName);
        if (sortBy === 'changes') return b.totalChanges - a.totalChanges;
        return 0;
      });
  }, [reportData.componentSummaries, filterText, sortBy]);

  const handleRefresh = () => {
    loadInitialValues();
  };

  const handleExport = () => {
    // Simulate export action
    console.log('Exporting data...');
    showToast("Export feature coming soon!");
  };

  const handleDateRangeUpdate = () => {
    // This will trigger the useEffect that calls loadInitialValues
    showToast("Date range updated");
  };

  if (isLoading)
    return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Component Summary Report</h1>
              <p className="text-gray-600">
                Monitoring period: {formatDate(reportData.startDate)} - {formatDate(reportData.endDate)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={handleRefresh}
                icon={<FaSyncAlt />}
              >Refresh</Button>
              <Button
                onClick={handleExport}
                icon={<FaDownload />}
              >Export</Button>
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Date Range */}
            <div className="lg:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar size={16} />
                Date Range
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Button
                onClick={handleDateRangeUpdate}
                fullWidth={true}
                >
                  Update
                </Button>
              </div>
            </div>

            {/* Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Filter size={16} />
                Filter Components
              </label>
              <input
                type="text"
                placeholder="Search components..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Sort & View */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Settings size={16} />
                Sort & View
              </label>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="name">Name</option>
                  <option value="changes">Changes</option>
                </select>
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                  aria-label="Toggle view mode"
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Components</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.componentSummaries.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BarChart3 className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Overall Total Changes</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.totalCounts.overallTotal}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FaSyncAlt className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Components</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.componentSummaries.filter(c => c.totalChanges > 0).length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Settings className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Components List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Component Details</h2>
          </div>

          <div className={`p-4 md:p-6 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}`}>
            {filteredComponents.length > 0 ? (
              filteredComponents.map((component, index) => (
                <div
                  key={index}
                  className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${viewMode === 'list' ? 'flex items-center justify-between' : ''
                    }`}
                >
                  <div className={`flex items-center gap-3 ${viewMode === 'list' ? 'flex-1' : 'mb-3'}`}>
                    <span className="text-2xl">{getComponentIcon(component.componentName)}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">{component.componentName}</h3>
                      {viewMode === 'grid' && (
                        <p className="text-sm text-gray-600">
                          {Object.keys(component.changesPerScreen).length} screens monitored
                        </p>
                      )}
                    </div>
                  </div>

                  <div className={`flex items-center gap-4 ${viewMode === 'list' ? '' : 'justify-between'}`}>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Changes</p>
                      <p className={`text-lg font-bold ${component.totalChanges === 0 ? 'text-gray-400' : 'text-blue-600'}`}>
                        {component.totalChanges}
                      </p>
                    </div>

                    {component.totalChanges === 0 ? (
                      <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Stable
                      </div>
                    ) : (
                      <div className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Active
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No components found matching your criteria
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Report generated on {formatDate(new Date().toISOString().split('T')[0])} •
              Showing {filteredComponents.length} of {reportData.componentSummaries.length} components
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentSummaryDashboard;