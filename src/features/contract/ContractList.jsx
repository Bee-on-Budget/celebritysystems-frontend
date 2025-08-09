import React, { useState, useEffect, useCallback } from 'react';
import { DataList, Pagination } from '../../components';
import { getAllContracts } from '../../api/services/ContractService';
import { useNavigate } from 'react-router-dom';

const ContractList = () => {
  const [contracts, setContracts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalContracts, setTotalContracts] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const fetchContracts = useCallback(async (page = 0) => {
    setIsLoading(true);
    try {
      const data = await getAllContracts({ page, size: pageSize });
      setContracts(data.content || []);
      setFiltered(data.content || []);
      setTotalPages(data.totalPages);
      setTotalContracts(data.totalElements);
      setCurrentPage(data.number);
      setPageSize(data.pageSize);
    } catch (e) {
      setError("Failed to load contracts");
    } finally {
      setIsLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchContracts(currentPage);
  }, [currentPage, fetchContracts]);

  const handleSearch = useCallback(
    async (query) => {
      return contracts
        .filter((contract) =>
          contract.companyName.toLowerCase().includes(query.toLowerCase()) ||
          contract.accountName.toLowerCase().includes(query.toLowerCase())
        )
        .map((c) => c.companyName);
    },
    [contracts]
  );

  const handleResultClick = (query) => {
    const result = contracts.filter((contract) =>
      contract.companyName.toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(result);
  };

  const handleClearSearch = () => {
    setFiltered([...contracts]);
  };

  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
  const formatCurrency = (value) => value ? `$${value.toLocaleString()}` : 'N/A';

  const renderContractItem = (list) => {
    const headerStyle = "px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider";
    const nameStyle = "px-3 py-2 text-sm text-dark font-bold";
    const bodyStyle = "px-3 py-2 text-sm text-dark max-w-xs whitespace-nowrap overflow-hidden text-ellipsis";
    const rowStyle = "h-14 hover:bg-gray-100 transition cursor-pointer";

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={`${headerStyle} w-72`}>Contract Name</th>
              <th className={`${headerStyle} w-52`}>Account</th>
              <th className={`${headerStyle} w-32`}>Value</th>
              <th className={`${headerStyle} w-32`}>Expiry Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {list.map((contract, idx) => (
              <tr
                key={idx}
                className={rowStyle}
                onClick={() => navigate(`/contracts/${contract.id}`, { state: { contract } })}
              >
                <td className={nameStyle}>{contract.info || 'Untitled Contract'}</td>
                <td className={bodyStyle}>{contract.accountName}</td>
                <td className={bodyStyle}>{formatCurrency(contract.contractValue)}</td>
                <td className={bodyStyle}>{formatDate(contract.expiredAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <DataList
      title="Contract Management"
      label="contracts"
      error={error}
      isLoading={isLoading}
      onSearch={handleSearch}
      onResultClick={handleResultClick}
      onClearSearch={handleClearSearch}
      totalElements={Array.isArray(filtered) ? filtered.length : 0}
    >
      {renderContractItem(filtered)}
      {
        contracts.length > pageSize && <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalContracts}
          itemsPerPage={pageSize}
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

export default ContractList;