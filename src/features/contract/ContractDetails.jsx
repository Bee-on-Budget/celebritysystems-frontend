import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getContractById } from "./contractService";
import Loading from "../../components/Loading";

const ContractDetails = () => {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        setLoading(true);
        const data = await getContractById(id);
        setContract(data);
      } catch (err) {
        setError(err.message || "Failed to load contract");
      } finally {
        setLoading(false);
      }
    };
    fetchContract();
  }, [id]);

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "N/A";
    const date = new Date(dateTime);
    return date.toLocaleString();
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!contract) return <div className="p-4">Contract not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded-lg">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold">
          Contract Details - {contract.companyName || `ID: ${contract.id}`}
        </h2>
        <Link
          to="/contracts"
          className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition"
        >
          ← Back to Contracts
        </Link>
      </div>

      <div className="space-y-6">
        {/* Basic Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="text-lg font-semibold mb-3 border-b pb-2">Contract Information</h3>
            <div className="space-y-2">
              <p><span className="font-medium">ID:</span> {contract.id}</p>
              <p><span className="font-medium">Info:</span> {contract.info || "N/A"}</p>
              <p><span className="font-medium">Company:</span> {contract.companyName || "N/A"}</p>
              <p><span className="font-medium">Account:</span> {contract.accountName || "N/A"}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 border-b pb-2">Financial & Timing</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Value:</span> ${contract.contractValue?.toLocaleString() || "0"}</p>
              <p><span className="font-medium">Start:</span> {formatDateTime(contract.startContractAt)}</p>
              <p><span className="font-medium">Expires:</span> {formatDateTime(contract.expiredAt)}</p>
              <p><span className="font-medium">Created:</span> {formatDateTime(contract.createdAt)}</p>
              <p><span className="font-medium">Updated:</span> {formatDateTime(contract.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Type Information Section */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Contract Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p><span className="font-medium">Duration:</span> {contract.durationType || "N/A"}</p>
            </div>
            <div>
              <p><span className="font-medium">Operator:</span> {contract.operatorType || "N/A"}</p>
            </div>
            <div>
              <p><span className="font-medium">Supply:</span> {contract.supplyType || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Screen Names Section - Now properly displayed */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">
            Screen Names ({contract.screenNames?.length || 0})
          </h3>
          {contract.screenNames?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {contract.screenNames.map((name, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No screen names available</p>
          )}
        </div>

        {/* Account Permissions Section */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">
            Account Permissions ({contract.accountPermissions?.length || 0})
          </h3>
          {contract.accountPermissions?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Can Read</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Can Edit</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contract.accountPermissions.map((perm, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {perm.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${perm.canRead ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {perm.canRead ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${perm.canEdit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {perm.canEdit ? "Yes" : "No"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic">No account permissions available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;