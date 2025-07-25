import React, { useEffect, useState, useCallback } from "react";
import { getAllUsers, updateUser, deleteUser } from "../../api/services/UserService";
import { getAllCompanies } from "../../api/services/CompanyService";
import MultiSearchBar from "../../components/MultiSearchBar";
import UserTable from "./UserTable";
import { roleOptions } from "./constants";
import { filterUsersByRole, searchUsers } from "./userUtils";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    canRead: false,
    canEdit: false
  });

  const fetchData = useCallback(async () => {
    try {
      const [usersRes, companiesRes] = await Promise.all([
        getAllUsers(),
        getAllCompanies()
      ]);
      
      setUsers(usersRes);
      setCompanies(companiesRes.data);
      setFiltered(filterUsersByRole(usersRes, selectedRoleFilter));
    } catch (error) {
      console.error("Error fetching data:", error);
      setUsers([]);
      setFiltered([]);
      setCompanies([]);
    }
  }, [selectedRoleFilter]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
      fetchData();
    }
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditFormData({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      canRead: user.canRead || false,
      canEdit: user.canEdit || false
    });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSaveEdit = async (userId) => {
    try {
      await updateUser(userId, editFormData);
      setEditingUserId(null);
      fetchData();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleSearch = useCallback(
    async (query) => {
      const results = searchUsers(users, query);
      return results.map((u) => `${u.fullName} (${u.email})`);
    },
    [users]
  );
  
  const handleResultClick = (query) => {
    let result = searchUsers(users, query);
    result = filterUsersByRole(result, selectedRoleFilter);
    setFiltered(result);
  };

  const handleClearSearch = () => {
    setFiltered(filterUsersByRole(users, selectedRoleFilter));
  };

  const handleRoleFilterChange = (e) => {
    const role = e.target.value;
    setSelectedRoleFilter(role);
    setFiltered(filterUsersByRole(users, role));
  };

  return (
    <div className="my-2">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold">Users</h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <MultiSearchBar
              onSearch={handleSearch}
              onSelectResult={handleResultClick}
              onClear={handleClearSearch}
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              value={selectedRoleFilter}
              onChange={handleRoleFilterChange}
              className="border rounded px-3 py-2 w-full text-sm"
            >
              <option value="ALL">All Types</option>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded overflow-hidden mt-5">
        {filtered.length === 0 ? (
          <p className="p-4 text-gray-500">No users found.</p>
        ) : (
          <UserTable
            users={filtered}
            companies={companies}
            editingUserId={editingUserId}
            editFormData={editFormData}
            handleEditFormChange={handleEditFormChange}
            handleEditClick={handleEditClick}
            handleSaveEdit={handleSaveEdit}
            handleCancelEdit={handleCancelEdit}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default UserList;