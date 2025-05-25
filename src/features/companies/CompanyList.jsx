import React, { useEffect, useState, useCallback } from "react";
import { getAllCompanies, deleteCompany } from "./CompanyService";
import Button from "../../components/Button";
import MultiSearchBar from "../../components/MultiSearchBar";
import { FaChevronDown, FaChevronUp, FaTrash, FaUser } from "react-icons/fa";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [expandedCompany, setExpandedCompany] = useState(null);

  const fetchCompanies = async () => {
    const res = await getAllCompanies();
    setCompanies(res.data);
    setFiltered(res.data);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteCompany(id);
      fetchCompanies();
    }
  };

  const toggleExpandCompany = (companyId) => {
    setExpandedCompany(expandedCompany === companyId ? null : companyId);
  };

  const handleSearch = useCallback(
    async (query) => {
      return companies
        .filter((company) =>
          company.name.toLowerCase().includes(query.toLowerCase())
        )
        .map((c) => c.name);
    },
    [companies]
  );

  const handleResultClick = (query) => {
    const result = companies.filter((company) =>
      company.name.toLowerCase().startsWith(query.toLowerCase())
    );
    setFiltered(result);
  };

  const handleClearSearch = () => {
    setFiltered(companies);
  };

  return (
    <div className="my-2">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold">Companies</h1>
        <div className="w-full sm:w-64">
          <MultiSearchBar
            onSearch={handleSearch}
            onSelectResult={handleResultClick}
            onClear={handleClearSearch}
          />
        </div>
      </div>

      <div className="bg-white shadow rounded overflow-hidden mt-5">
        {filtered.length === 0 ? (
          <p className="p-4 text-gray-500">No companies found.</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {filtered.map((company) => (
              <div key={company.id} className="p-4">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleExpandCompany(company.id)}>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{company.name}</h3>
                    <p className="text-sm text-gray-500">{company.email} | {company.phone}</p>
                    <p className="text-sm text-gray-500">{company.location}</p>
                    <p className="text-xs mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {company.userList?.length || 0} users
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(company.id);
                      }}
                      className="text-sm px-2 py-1"
                      icon={<FaTrash size={12} />}
                    >
                      Delete
                    </Button>
                    {expandedCompany === company.id ? (
                      <FaChevronUp className="text-gray-500" />
                    ) : (
                      <FaChevronDown className="text-gray-500" />
                    )}
                  </div>
                </div>

                {expandedCompany === company.id && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-200">
                    <h4 className="text-md font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FaUser className="text-gray-500" /> Users
                    </h4>
                    {company.userList?.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {company.userList.map((user) => (
                              <tr key={user.id}>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{user.fullName}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    user.role === 'ADMIN' 
                                      ? 'bg-purple-100 text-purple-800' 
                                      : 'bg-green-100 text-green-800'
                                  }`}>
                                    {user.role}
                                  </span>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                  <div className="flex gap-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      user.canRead ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {user.canRead ? 'Can Read' : 'No Read'}
                                    </span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      user.canEdit ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {user.canEdit ? 'Can Edit' : 'No Edit'}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No users in this company</p>
                    )}
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

export default CompanyList;