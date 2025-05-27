// src/features/contract/ContractDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showToast } from '../../components/ToastNotifier';
import { getContractById } from '../contract/contractService';

const ContractDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const data = await getContractById(id);
        setContract(data);
      } catch (error) {
        showToast(error.message || 'Failed to load contract', 'error');
        navigate('/contracts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchContract();
  }, [id, navigate]);

  if (loading) return <div>Loading contract details...</div>;
  if (!contract) return <div>Contract not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contract Details</h1>
        <button 
          onClick={() => navigate('/contracts')} 
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to Contracts
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Basic Information</h2>
            <p><span className="font-medium">Company:</span> {contract.company?.name}</p>
            <p><span className="font-medium">Screen:</span> {contract.screen?.name}</p>
            <p><span className="font-medium">Account Name:</span> {contract.accountName}</p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">Contract Terms</h2>
            <p><span className="font-medium">Start Date:</span> {new Date(contract.startContractAt).toLocaleDateString()}</p>
            <p><span className="font-medium">End Date:</span> {new Date(contract.expiredAt).toLocaleDateString()}</p>
            <p><span className="font-medium">Value:</span> ${contract.contractValue?.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Additional Information</h2>
          <p>{contract.info}</p>
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;