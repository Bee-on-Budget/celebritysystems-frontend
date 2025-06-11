import React, { useState, useEffect } from 'react';
import { getScreens, searchScreens } from '../../../api/ScreenService';
import { FiSearch } from 'react-icons/fi';

const ScreenList = () => {
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const fetchScreens = async (pageNumber) => {
    setLoading(true);
    setError('');
    try {
      const data = await getScreens({ page: pageNumber });
      setScreens(data.content || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.pageNumber || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError('Failed to load screens. Please try again later.');
      console.error('Error fetching screens:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      fetchScreens(0);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const results = await searchScreens(searchQuery);
      setScreens(results || []);
      setIsSearching(true);
      setTotalPages(1);
      setPage(0);
      setTotalElements(results.length || 0);
    } catch (err) {
      setError('Failed to search screens. Please try again.');
      console.error('Error searching screens:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isSearching) {
      fetchScreens(page);
    }
  }, [page, isSearching]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    fetchScreens(0);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">LED Screen Inventory</h2>
        
        <div className="relative w-full sm:w-64">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search screens..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <FiSearch className="absolute left-3 text-gray-400" />
          </div>
          {isSearching && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2 top-2 text-xs text-blue-600 hover:text-blue-800"
            >
              Clear
            </button>
          )}
        </div>

        <span className="text-sm text-gray-600">
          Total: {totalElements} screens
        </span>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {screens.length === 0 && !loading ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600">
            {isSearching 
              ? `No screens found matching "${searchQuery}"`
              : 'No screens found. Create a new one to get started.'}
          </p>
          {isSearching && (
            <button
              onClick={handleClearSearch}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {screens.map((screen) => (
              <div
                key={screen.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-700">
                      {screen.name}
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {screen.screenType}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {screen.solutionType}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(screen.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{screen.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resolution:</span>
                    <span className="font-medium">
                      {screen.resolution ? `${screen.resolution.toLocaleString()}px` : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Components</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600">Power Supply:</span>
                      <span className="block font-medium">
                        {screen.powerSupplyQuantity} (+{screen.sparePowerSupplyQuantity})
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Receiving Cards:</span>
                      <span className="block font-medium">
                        {screen.receivingCardQuantity} (+{screen.spareReceivingCardQuantity})
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Cables:</span>
                      <span className="block font-medium">
                        {screen.cableQuantity} (+{screen.spareCableQuantity})
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Power Cables:</span>
                      <span className="block font-medium">
                        {screen.powerCableQuantity} (+{screen.sparePowerCableQuantity})
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Data Cables:</span>
                      <span className="block font-medium">
                        {screen.dataCableQuantity} (+{screen.spareDataCableQuantity})
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Media:</span>
                      <span className="block font-medium">
                        {screen.mediaQuantity} (+{screen.spareMediaQuantity})
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Fans:</span>
                      <span className="block font-medium">
                        {screen.fanQuantity}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Cabinets</h4>
                  <ul className="space-y-2 text-sm">
                    {screen.cabinList?.map((cabin) => (
                      <li key={cabin.id} className="bg-gray-50 p-2 rounded">
                        <div className="font-medium">{cabin.cabinName}</div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Qty: {cabin.quantity}</span>
                          <span>Size: {cabin.width}cm × {cabin.height}cm</span>
                        </div>
                        {cabin.module && (
                          <div className="mt-1 text-xs">
                            <div className="text-gray-600">Module: {cabin.module.batchNumber}</div>
                            <div className="flex justify-between">
                              <span>Qty: {cabin.module.quantity}</span>
                              <span>Size: {cabin.module.width}cm × {cabin.module.height}cm</span>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination - only show if not searching */}
          {!isSearching && totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                Showing {screens.length} of {totalElements} screens
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page + 1 >= totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ScreenList;