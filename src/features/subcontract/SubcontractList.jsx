import React, { useState, useEffect, useCallback } from 'react';
import { DataList, Pagination } from '../../components';
import { getSubContracts } from '../../api/services/SubContractService';
import { useNavigate } from 'react-router-dom';

const SubContractList = () => {
  const [subContracts, setSubContracts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalSubContracts, setTotalSubContracts] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const fetchSubContracts = useCallback(async (page = 0) => {
    setIsLoading(true);
    try {
      const response = await getSubContracts({ page, size: pageSize });
      const data = response.content || [];
      setSubContracts(data);
      setFiltered(data);
      setTotalPages(response.totalPages || 0);
      setTotalSubContracts(response.totalElements || 0);
      setCurrentPage(response.pageNumber || 0);
      setPageSize(response.pageSize || 10);
    } catch (e) {
      setError("Failed to load subcontracts");
    } finally {
      setIsLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchSubContracts(currentPage);
  }, [currentPage, fetchSubContracts]);

  const handleSearch = useCallback(
    async (query) => {
      return subContracts
        .filter((subContract) =>
          subContract.mainCompany?.name?.toLowerCase().includes(query.toLowerCase()) ||
          subContract.controllerCompany?.name?.toLowerCase().includes(query.toLowerCase()) ||
          subContract.contract?.id?.toString().includes(query)
        )
        .map((sc) => `${sc.mainCompany?.name} - ${sc.controllerCompany?.name}`);
    },
    [subContracts]
  );

  const handleResultClick = (query) => {
    const result = subContracts.filter((subContract) =>
      `${subContract.mainCompany?.name} - ${subContract.controllerCompany?.name}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
    setFiltered(result);
  };

  const handleClearSearch = () => {
    setFiltered([...subContracts]);
  };

  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : 'N/A';

  const renderSubContractItem = (list) => {
    const headerStyle = "px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider";
    const nameStyle = "px-3 py-2 text-sm text-dark font-bold";
    const bodyStyle = "px-3 py-2 text-sm text-dark max-w-xs whitespace-nowrap overflow-hidden text-ellipsis";
    const rowStyle = "h-14 hover:bg-gray-100 transition cursor-pointer";

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={`${headerStyle} w-72`}>Main Company</th>
              <th className={`${headerStyle} w-72`}>Controller Company</th>
              <th className={`${headerStyle} w-32`}>Contract ID</th>
              <th className={`${headerStyle} w-32`}>Expiry Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {list.map((subContract) => (
              <tr
                key={subContract.id}
                className={rowStyle}
                onClick={() => navigate(`/subcontract/${subContract.id}`, { state: { subContract } })}
              >
                <td className={nameStyle}>{subContract.mainCompany?.name || 'N/A'}</td>
                <td className={bodyStyle}>{subContract.controllerCompany?.name || 'N/A'}</td>
                <td className={bodyStyle}>{subContract.contract?.id || 'N/A'}</td>
                <td className={bodyStyle}>{formatDate(subContract.expiredAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <DataList
      title="Subcontract Management"
      label="subcontracts"
      error={error}
      isLoading={isLoading}
      onSearch={handleSearch}
      onResultClick={handleResultClick}
      onClearSearch={handleClearSearch}
      totalElements={filtered.length}
    >
      {renderSubContractItem(filtered)}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalSubContracts}
          itemsPerPage={pageSize}
          onPageChange={(newPage) => {
            if (newPage >= 0 && newPage < totalPages) {
              setCurrentPage(newPage);
            }
          }}
          className={"mt-8"}
        />
      )}
    </DataList>
  );
};

export default SubContractList;