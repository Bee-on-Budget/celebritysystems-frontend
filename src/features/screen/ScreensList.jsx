import React, { useState, useEffect, useCallback } from 'react';
import { DataList, Pagination } from '../../components';
import { getScreens, searchScreens } from '../../api/services/ScreenService';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ScreensList = () => {
  const { t } = useTranslation();
  const [screens, setScreens] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalScreens, setTotalScreens] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const navigate = useNavigate();


  const fetchScreens = useCallback(async (page = 0) => {
    setIsLoading(true);
    try {
      const data = await getScreens({ page, size: pageSize });
      setHasNext(data.hasNext);
      setHasPrevious(data.hasPrevious);
      setScreens(data.content || []);
      setFiltered(data.content || []);
      setTotalPages(data.totalPages);
      setTotalScreens(data.totalElements);
      setCurrentPage(data.pageNumber);
      setPageSize(data.pageSize);
    } catch (e) {
      setError(t('screens.messages.errorLoadingScreens'));
    } finally {
      setIsLoading(false);
    }
  }, [pageSize, t]);

  useEffect(() => {
    fetchScreens(currentPage);
  }, [currentPage, fetchScreens]);

  const handleSearch = useCallback(
    async (query) => {
      try {
        const results = await searchScreens(query);
        return (results || []).map((screen) => screen.name);
      } catch (e) {
        setError(t('screens.messages.errorSearchingScreens'));
        return [];
      }
    },
    [t]
  );

  const handleResultClick = async (query) => {
    try {
      const results = await searchScreens(query);
      setFiltered(results || []);
    } catch (e) {
      setError(t('screens.messages.errorSearchingScreens'));
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
      case 'IN_DOOR': return <span className={`${labelStyle} ${labelColor4}`}>
        {t('screens.options.indoor')}
      </span>;
      case 'OUT_DOOR': return <span className={`${labelStyle} ${labelColor5}`}>
        {t('screens.options.outdoor')}
      </span>;
      default: return <span className={`${labelStyle} ${labelColor3}`}>N/A</span>;
    }
  }

  const getScreenSolutionLabel = (type) => {
    switch (type) {
      case 'CABINET_SOLUTION': return <span className={`${labelStyle} ${labelColor1}`}>
        {t('screens.options.cabinet')}
      </span>;
      case 'MODULE_SOLUTION': return <span className={`${labelStyle} ${labelColor2}`}>
        {t('screens.options.module')}
      </span>;
      default: return <span className={`${labelStyle} ${labelColor3}`}>N/A</span>;
    }
  }

  const renderScreenItem = (list) => {
    const headerStyle = "px-3 py-2 text-start text-sm font-medium text-gray-500 uppercase tracking-wider";
    const nameStyle = "px-3 py-2 text-sm text-dark font-bold";
    const bodyStyle = "px-3 py-2 text-sm text-dark px-3 py-2 text-sm text-dark max-w-xs whitespace-nowrap overflow-hidden text-ellipsis";
    const rowStyle = "h-14 hover:bg-gray-100 transition cursor-pointer";

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={`${headerStyle} w-80`}>{t('screens.screenForm.name')}</th>
              <th className={`${headerStyle} w-40`}>{t('screens.screenForm.screenType')}</th>
              <th className={`${headerStyle} w-40`}>{t('screens.screenForm.solution')}</th>
              <th className={headerStyle}>{t('screens.screenForm.company')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {list.map((screen, idx) => (
              <tr
                key={idx}
                className={rowStyle}
                onClick={() => navigate(`/screens/${screen.id}`, { state: { screen } })}
              >
                <td
                  className={nameStyle}>
                  {screen.name}
                </td>
                <td className={bodyStyle}>{getScreenTypeLabel(screen.screenType)}</td>
                <td className={bodyStyle}>{getScreenSolutionLabel(screen.solutionType)}</td>
                <td className={bodyStyle}>{screen.companyName || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <DataList
      title={t('screens.screensListTitle')}
      label="screens"
      error={error}
      isLoading={isLoading}
      onSearch={handleSearch}
      onResultClick={handleResultClick}
      onClearSearch={handleClearSearch}
      totalElements={Array.isArray(filtered) ? filtered.length : 0}
    >
      {renderScreenItem(filtered)}

      {
        totalPages > 1 && <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalScreens}
          itemsPerPage={pageSize}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          onPageChange={(newPage) => {
            if (newPage >= 0 && newPage < totalPages) {
              setCurrentPage(newPage);
            }
          }}
          className={"mt-8"}
        />
      }
    </DataList>
  );
};

export default ScreensList;
