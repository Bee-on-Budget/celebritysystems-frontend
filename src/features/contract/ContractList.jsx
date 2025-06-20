import React, { useState, useEffect } from 'react';
import { getAllContracts } from './contractService';
import { Loading } from '../../components';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ContractAccordionList = () => {
  const [contracts, setContracts] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getAllContracts();
        setContracts(data || []);
      } catch (err) {
        setError(err.message || 'Failed to load contracts');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  const toggle = (id) => setExpandedId(prev => (prev === id ? null : id));

  const formatDate = s => s ? new Date(s).toLocaleDateString() : 'N/A';
  const formatDateTime = s => s ? new Date(s).toLocaleString() : 'N/A';

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Contracts</h1>
        {/* <NavButton
          to="/contracts/create"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition"
          label={
            <>
              <FaPlus className="text-sm" />
              Create New Contract
            </>
          }
        /> */}
      </div>

      {contracts.length === 0 && (
        <div className="p-4 text-center text-gray-500">No contracts found</div>
      )}

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {contracts.map(c => {
          const isOpen = expandedId === c.id;
          return (
            <div key={c.id}>
              <button
                onClick={() => toggle(c.id)}
                className={`w-full flex justify-between items-center p-4 text-left ${
                  isOpen ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
                aria-expanded={isOpen}
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {c.companyName || 'Untitled Contract'}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-600">
                    <span><b>Account:</b> {c.accountName}</span>
                    <span><b>Value:</b> ${c.contractValue?.toLocaleString()}</span>
                    <span><b>Start:</b> {formatDate(c.startContractAt)}</span>
                    <span><b>Expires:</b> {formatDate(c.expiredAt)}</span>
                    <span><b>Screens:</b> {c.screenNames?.length || 0}</span>
                  </div>
                </div>
                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {isOpen && (
                <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Contract Info</h4>
                      <p><b>ID:</b> {c.id}</p>
                      <p><b>Info:</b> {c.info || 'N/A'}</p>
                      <p><b>Company:</b> {c.companyName}</p>
                      <p><b>Account:</b> {c.accountName}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Finance & Timing</h4>
                      <p><b>Value:</b> ${c.contractValue?.toLocaleString()}</p>
                      <p><b>Start:</b> {formatDateTime(c.startContractAt)}</p>
                      <p><b>Expires:</b> {formatDateTime(c.expiredAt)}</p>
                      <p><b>Created:</b> {formatDateTime(c.createdAt)}</p>
                      <p><b>Updated:</b> {formatDateTime(c.updatedAt)}</p>
                    </div>
                  </div>

                  {/* Types */}
                  <div>
                    <h4 className="font-semibold mb-2">Types</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <p><b>Duration:</b> {c.durationType}</p>
                      <p><b>Operator:</b> {c.operatorType}</p>
                      <p><b>Supply:</b> {c.supplyType}</p>
                    </div>
                  </div>

                  {/* Screens */}
                  <div>
                    <h4 className="font-semibold mb-2">
                      Screen Names ({c.screenNames?.length || 0})
                    </h4>
                    {c.screenNames?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {c.screenNames.map((n,i) => (
                          <span
                            key={i}
                            className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {n}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="italic text-gray-500">No screen names</p>
                    )}
                  </div>

                  {/* Permissions */}
                  <div>
                    <h4 className="font-semibold mb-2">
                      Account Permissions ({c.accountPermissions?.length || 0})
                    </h4>
                    {c.accountPermissions?.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th>Name</th>
                              <th>Can Read</th>
                              <th>Can Edit</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {c.accountPermissions.map((p,i) => (
                              <tr key={i}>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                  {p.name || 'N/A'}
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`px-2 text-xs font-semibold rounded-full ${
                                    p.canRead ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>{p.canRead ? 'Yes' : 'No'}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`px-2 text-xs font-semibold rounded-full ${
                                    p.canEdit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>{p.canEdit ? 'Yes' : 'No'}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="italic text-gray-500">No permissions</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContractAccordionList;
