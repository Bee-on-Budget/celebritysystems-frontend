// src/features/contract/ContractList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { showToast } from '../../components/ToastNotifier';
import { getContractsByCompany } from '../contract/contractService';

const ContractList = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        // You might want to fetch all contracts or by some filter
        const data = await getContractsByCompany(''); // Adjust as needed
        setContracts(data);
      } catch (error) {
        showToast(error.message || 'Failed to load contracts', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchContracts();
  }, []);

  if (loading) return <div>Loading contracts...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contracts</h1>
        <Link 
          to="/contracts/create" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Contract
        </Link>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Screen</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contracts.map(contract => (
              <tr key={contract.id}>
                <td className="px-6 py-4 whitespace-nowrap">{contract.company?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{contract.screen?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(contract.startContractAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(contract.expiredAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link 
                    to={`/contracts/${contract.id}`} 
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContractList;