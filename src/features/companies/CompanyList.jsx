import React, { useEffect, useState } from "react";
import { getAllCompanies, deleteCompany } from "./CompanyService";
import Input from "../../components/Input";
import Button from "../../components/Button";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");

  const fetchCompanies = async () => {
    const res = await getAllCompanies();
    setCompanies(res.data);
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

  const filtered = companies.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Companies</h1>
        <Input
          id="search"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
      </div>

      <div className="bg-white shadow rounded overflow-hidden">
        {filtered.length === 0 ? (
          <p className="p-4 text-gray-500">No companies found.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-left text-sm font-semibold text-gray-700">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filtered.map((company) => (
                <tr key={company.id}>
                  <td className="px-4 py-2">{company.name}</td>
                  <td className="px-4 py-2">{company.email}</td>
                  <td className="px-4 py-2">{company.phone}</td>
                  <td className="px-4 py-2">{company.location}</td>
                  <td className="px-4 py-2">
                    <Button variant="danger" onClick={() => handleDelete(company.id)} className="text-sm px-2 py-1">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CompanyList;
