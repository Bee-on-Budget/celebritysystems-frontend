import React, { useState, useEffect, useCallback } from 'react';
import { DataList, Pagination } from '../../components';
import { getScreens, searchScreens } from '../../api/ScreenService';
import { useNavigate } from 'react-router-dom';

const ScreensPage = () => {
  const [screens, setScreens] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalScreens, setTotalScreens] = useState(0);
  const [pageSize, setPageSize] = useState(4);
  const navigate = useNavigate();


  const fetchScreens = useCallback(async (page = 0) => {
    setIsLoading(true);
    try {
      const data = await getScreens({ page, size: pageSize });
      setScreens(data.content || []);
      setFiltered(data.content || []);
      setTotalPages(data.totalPages);
      setTotalScreens(data.totalElements);
      setCurrentPage(data.pageNumber);
      setPageSize(data.pageSize)
    } catch (e) {
      setError("Failed to load screens");
    } finally {
      setIsLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchScreens(currentPage);
  }, [currentPage, fetchScreens]);

  const handleSearch = useCallback(
    async (query) => {
      try {
        const results = await searchScreens(query);
        return (results || []).map((screen) => screen.name);
      } catch (e) {
        setError('Failed to search screens');
        return [];
      }
    },
    []
  );

  const handleResultClick = async (query) => {
    try {
      const results = await searchScreens(query);
      setFiltered(results || []);
    } catch (e) {
      setError('Failed to search screens');
    }
  };

  const handleClearSearch = () => {
    setFiltered([...screens]);
  };

  const labelStyle = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
  const labelColor1 = "bg-orange-100 text-orange-800";
  const labelColor2 = "bg-purple-100 text-purple-800";
  const labelColor3 = "bg-gray-100 text-gray-800";
  const labelColor4 = "bg-green-100 text-green-800";
  const labelColor5 = "bg-blue-100 text-blue-800";

  const getScreenTypeLabel = (type) => {
    switch (type) {
      case 'IN_DOOR': return <span className={`${labelStyle} ${labelColor4}`}>In Door</span>;
      case 'OUT_DOOR': return <span className={`${labelStyle} ${labelColor5}`}>Out Door</span>;
      default: return <span className={`${labelStyle} ${labelColor3}`}>N/A</span>;
    }
  }

  const getScreenSolutionLabel = (type) => {

    switch (type) {
      case 'CABINET_SOLUTION': return <span className={`${labelStyle} ${labelColor1}`}>Cabinet</span>;
      case 'MODULE_SOLUTION': return <span className={`${labelStyle} ${labelColor2}`}>Module</span>;
      default: return <span className={`${labelStyle} ${labelColor3}`}>N/A</span>;
    }
  }

  const renderScreenItem = (list) => {
    const headerStyle = "px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider";
    const nameStyle = "px-3 py-2 text-sm text-dark font-bold";
    const bodyStyle = "px-3 py-2 text-sm text-dark";
    const rowStyle = "hover:bg-gray-100 transition h-14 cursor-pointer";

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={`${headerStyle} w-72`}>Name</th>
              <th className={`${headerStyle} w-32`}>Screen Type</th>
              <th className={`${headerStyle} w-32`}>Solution</th>
              <th className={headerStyle}>Location</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {list.map((screen) => (
              <tr key={screen.id} className={rowStyle} onClick={() => navigate(`/screens/${screen.id}`)}>
                <td
                  className={nameStyle}>
                  {screen.name}
                </td>
                <td className={bodyStyle}>{getScreenTypeLabel(screen.screenType)}</td>
                <td className={bodyStyle}>{getScreenSolutionLabel(screen.solutionType)}</td>
                <td className={bodyStyle}>{screen.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <DataList
      title="LED Screen Inventory"
      label="screens"
      error={error}
      isLoading={isLoading}
      onSearch={handleSearch}
      onResultClick={handleResultClick}
      onClearSearch={handleClearSearch}
      totalElements={Array.isArray(filtered) ? filtered.length : 0}
    >
      {renderScreenItem(filtered)}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalScreens}
        itemsPerPage={pageSize}
        onPageChange={(newPage) => {
          if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
          }
        }}
        className={"mt-8"}
      />
    </DataList>
  );
};

export default ScreensPage;
