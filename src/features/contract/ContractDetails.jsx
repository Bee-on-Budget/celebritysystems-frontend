import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContractById, getCompanyById } from './contractService';
import { showToast } from '../../components/ToastNotifier';
import { Loading } from '../../components';

const FullyContractDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const data = await getContractById(id);

        // If company has only ID, fetch the full company info
        if (data.company?.id && !data.company.name) {
          try {
            const company = await getCompanyById(data.company.id);
            data.company = company;
          } catch (err) {
            showToast("Failed to fetch company details", "error");
          }
        }

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

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }) : 'N/A';

  if (loading) return <Loading />;
  if (!contract) return <div className="text-red-500">Contract not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Contract #{contract.id}</h1>
        <button
          onClick={() => navigate('/contracts')}
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md"
        >
          Back to Contracts
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">General Info</h2>
          <Detail label="Info" value={contract.info} />
          <Detail label="Account Name" value={contract.accountName} />
          <Detail label="Operator Type" value={contract.operatorType} />
          <Detail label="Supply Type" value={contract.supplyType} />
          <Detail label="Duration Type" value={contract.durationType} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Timeline & Value</h2>
          <Detail label="Start Date" value={formatDate(contract.startContractAt)} />
          <Detail label="Expiry Date" value={formatDate(contract.expiredAt)} />
          <Detail label="Contract Value" value={contract.contractValue ? `$${contract.contractValue.toLocaleString()}` : 'N/A'} />
          <Detail label="Created At" value={formatDate(contract.createdAt)} />
          <Detail label="Updated At" value={formatDate(contract.updatedAt)} />
        </div>
      </div>

      <Section title="Company Information">
        {contract.company ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Detail label="Company Name" value={contract.company.name} />
            <Detail label="Company ID" value={contract.company.id} />
            <Detail label="Contact Email" value={contract.company.email} />
            <Detail label="Phone Number" value={contract.company.phone} />
          </div>
        ) : (
          <EmptyText text="No company information available" />
        )}
      </Section>

      <Section title="Screens">
        {contract.screens?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Screen ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contract.screens.map((screen) => (
                  <tr key={screen.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{screen.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{screen.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{screen.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{screen.status || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyText text="No screens associated with this contract" />
        )}
      </Section>

      <Section title="Account Permissions">
        {contract.accountPermissions?.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {contract.accountPermissions.map((perm, index) => (
              <li key={index} className="py-3">
                <p><span className="font-medium">Name:</span> {perm.name}</p>
                <p><span className="font-medium">Can Read:</span> {perm.canRead ? 'Yes' : 'No'}</p>
                <p><span className="font-medium">Can Edit:</span> {perm.canEdit ? 'Yes' : 'No'}</p>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyText text="No account permissions defined" />
        )}
      </Section>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <p className="text-sm text-gray-800 mb-1">
    <span className="font-medium">{label}:</span> {value || 'N/A'}
  </p>
);

const Section = ({ title, children }) => (
  <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h2 className="text-lg font-semibold text-gray-700 mb-4">{title}</h2>
    {children}
  </div>
);

const EmptyText = ({ text }) => (
  <p className="text-sm text-gray-500 italic">{text}</p>
);

export default FullyContractDetails;
