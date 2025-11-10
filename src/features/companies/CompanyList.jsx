import React, { useState, useEffect, useCallback } from 'react';
import { DataList, Pagination } from '../../components';
import { getAllCompanies, searchCompanies } from '../../api/services/CompanyService';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CompanyList = () => {
  const { t } = useTranslation();
  const [companies, setCompanies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const navigate = useNavigate();

  const pageSize = 10;

  const fetchCompanies = useCallback(async (page = 0) => {
    setIsLoading(true);
    try {
      const data = await getAllCompanies({ page, size: pageSize });
      setCompanies(data.content ?? []);
      setFiltered(data.content ?? []);
      setTotalPages(data.totalPages ?? 0);
      setTotalCompanies(data.totalElements ?? 0);
      setCurrentPage(data.number ?? 0);
      setHasNext(!data.last);
      setHasPrevious(!data.first);
    } catch (e) {
      setError("Failed to load companies");
    } finally {
      setIsLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchCompanies(currentPage);
  }, [currentPage, fetchCompanies]);

  const handleSearch = useCallback(
    async (query) => {
      try {
        const results = await searchCompanies(query);
        return (results || []).map((company) => company.name);
      } catch (e) {
        setError(e);
        // setError('Failed to search companies!!!');
        return [];
      }
    },
    []
  );

  const handleResultClick = async (query) => {
    try {
      const results = await searchCompanies(query);
      setFiltered(results || []);
    } catch (e) {
      setError('Failed to search companies');
    }
  };

  const handleClearSearch = () => {
    setFiltered([...companies]);
  };

  const renderCompanyItem = (list) => {
    const headerStyle = "px-3 py-2 text-start text-sm font-medium text-gray-500 uppercase tracking-wider";
    const nameStyle = "px-3 py-2 text-sm text-dark font-bold";
    const bodyStyle = "px-3 py-2 text-sm text-dark max-w-xs whitespace-nowrap overflow-hidden text-ellipsis";
    const rowStyle = "h-14 hover:bg-gray-100 transition cursor-pointer";

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={headerStyle}>{t('companies.companyForm.name')}</th>
              <th className={headerStyle}>{t('companies.companyForm.email')}</th>
              <th className={headerStyle}>{t('companies.companyForm.phone')}</th>
              <th className={headerStyle}>{t('companies.companyForm.address')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {list.map((company, idx) => (
              <tr
                key={idx}
                className={rowStyle}
                onClick={() => navigate(`/companies/${company.id}`, { state: { company } })}
              >
                <td className={nameStyle}>{company.name}</td>
                <td className={bodyStyle}>{company.email}</td>
                <td className={bodyStyle}>{company.phone}</td>
                <td className={bodyStyle}>
                {company.location?.startsWith("http") ? (
                    <a
                      href={company.location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline hover:text-primary-hover"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(company.location, "_blank", "noopener,noreferrer");
                      }}
                    >
                      View Location
                    </a>
                  ) : (
                    company.location || <span className="text-gray-400">No location</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <DataList
      title={t('companies.title')}
      label="companies"
      error={error}
      isLoading={isLoading}
      onSearch={handleSearch}
      onResultClick={handleResultClick}
      onClearSearch={handleClearSearch}
      totalElements={Array.isArray(filtered) ? filtered.length : 0}
    >
      {renderCompanyItem(filtered)}
      {
        totalPages > 1 && <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalCompanies}
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

export default CompanyList;