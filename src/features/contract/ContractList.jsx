import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAllContracts } from './contractService';
import { MultiSearchBar, Loading, NavButton, showToast } from '../../components';
import { FaChevronDown, FaChevronUp, FaPlus } from 'react-icons/fa';

const ContractList = () => {
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedContract, setExpandedContract] = useState(null);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const data = await getAllContracts();
      setContracts(data);
      setFilteredContracts(data);
    } catch (error) {
      showToast(error.message || 'Failed to load contracts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const toggleExpandContract = (contractId) => {
    setExpandedContract(expandedContract === contractId ? null : contractId);
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
  };

  const handleSearch = useCallback(
    (query) => {
      return contracts
        .filter((contract) =>
          contract.info?.toLowerCase().includes(query.toLowerCase())
        )
        .map((c) => c.info);
    },
    [contracts]
  );

  const handleResultClick = (query) => {
    const result = contracts.filter((contract) =>
      contract.info?.toLowerCase().startsWith(query.toLowerCase())
    );
    setFilteredContracts(result);
  };

  const handleClearSearch = () => {
    setFilteredContracts(contracts);
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Contracts</h1>
        <NavButton
          to="/contracts/create"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
          label={
            <>
              <FaPlus className="text-sm" />
              Create New Contract
            </>
          }
        />
      </div>

      <div className="mb-4 w-full md:w-1/3">
        <MultiSearchBar
          onSearch={handleSearch}
          onSelectResult={handleResultClick}
          onClear={handleClearSearch}
          placeholder="Search contracts by info..."
        />
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {filteredContracts.length === 0 ? (
          <div className="p-4 text-center text-dark-light">
            {contracts.length === 0 ? 'No contracts found' : 'No matching contracts found'}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredContracts.map((contract) => (
              <div key={contract.id} className="p-4 hover:bg-gray-50">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleExpandContract(contract.id)}
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {contract.info || 'Untitled Contract'}
                    </h3>
                    <div className="flex gap-4 mt-1">
                      <span className="text-sm text-gray-600">
                        <span className="font-semibold">Start:</span> {formatDate(contract.startContractAt)}
                      </span>
                      <span className="text-sm text-gray-600">
                        <span className="font-semibold">Expires:</span> {formatDate(contract.expiredAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link
                      to={`/contracts/${contract.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View
                    </Link>
                    {expandedContract === contract.id ? (
                      <FaChevronUp className="text-gray-400" />
                    ) : (
                      <FaChevronDown className="text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedContract === contract.id && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-2">Details</h4>
                        <div className="space-y-1 text-sm text-gray-700">
                          <p><span className="font-medium">Supply Type:</span> {contract.supplyType}</p>
                          <p><span className="font-medium">Operator Type:</span> {contract.operatorType}</p>
                          <p><span className="font-medium">Duration Type:</span> {contract.durationType}</p>
                          <p><span className="font-medium">Account Name:</span> {contract.accountName}</p>
                          <p><span className="font-medium">Contract Value:</span> ${contract.contractValue?.toLocaleString()}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-2">
                          Screens ({contract.screenIds?.length || 0})
                        </h4>
                        {contract.screenIds?.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {contract.screenIds.map(screenId => (
                              <span
                                key={screenId}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                              >
                                Screen #{screenId}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">No screens assigned</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-md font-medium text-gray-700 mb-2">Account Permissions</h4>
                      {contract.accountPermissions?.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-gray-700">
                          {contract.accountPermissions.map((perm, index) => (
                            <li key={index}>
                              <span className="font-medium">{perm.name}</span> – Read: {perm.canRead ? 'Yes' : 'No'}, Edit: {perm.canEdit ? 'Yes' : 'No'}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No account permissions defined</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractList;
