import React, { useEffect, useState, useCallback } from "react";
import { getAllUsers, updateUser, deleteUser } from "./UserService";
import Button from "../../components/Button";
import MultiSearchBar from "../../components/MultiSearchBar";
import { FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    canRead: false,
    canEdit: false
  });

  const roleOptions = [
    { value: "ADMIN", label: "Admin" },
    { value: "USER", label: "User" },
  ];

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res);  // Changed from res.data to res
      setFiltered(res);  // Changed from res.data to res
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setFiltered([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
      fetchUsers();
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
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleSearch = useCallback(
    async (query) => {
      return (users || [])
        .filter((user) =>
          user.fullName?.toLowerCase().includes(query.toLowerCase()) ||
          user.email?.toLowerCase().includes(query.toLowerCase()) ||
          user.username?.toLowerCase().includes(query.toLowerCase())
        )
        .map((u) => `${u.fullName} (${u.email})`);
    },
    [users]
  );
  
  const handleResultClick = (query) => {
    const result = (users || []).filter((user) =>
      user.fullName?.toLowerCase().includes(query.toLowerCase()) ||
      user.email?.toLowerCase().includes(query.toLowerCase()) ||
      user.username?.toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(result);
  };

  const handleClearSearch = () => {
    setFiltered(users);
  };

  return (
    <div className="my-2">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold">Users</h1>
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
          <p className="p-4 text-gray-500">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUserId === user.id ? (
                        <input
                          type="text"
                          name="fullName"
                          value={editFormData.fullName}
                          onChange={handleEditFormChange}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUserId === user.id ? (
                        <input
                          type="email"
                          name="email"
                          value={editFormData.email}
                          onChange={handleEditFormChange}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        <div className="text-sm text-gray-500">{user.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUserId === user.id ? (
                        <select
                          name="role"
                          value={editFormData.role}
                          onChange={handleEditFormChange}
                          className="border rounded px-2 py-1 w-full"
                        >
                          {roleOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'ADMIN' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUserId === user.id ? (
                        <div className="flex gap-4 items-center">
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              name="canRead"
                              checked={editFormData.canRead}
                              onChange={handleEditFormChange}
                              className="form-checkbox h-4 w-4 text-blue-600"
                            />
                            <span className="ml-2 text-sm text-gray-700">Read</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              name="canEdit"
                              checked={editFormData.canEdit}
                              onChange={handleEditFormChange}
                              className="form-checkbox h-4 w-4 text-green-600"
                            />
                            <span className="ml-2 text-sm text-gray-700">Edit</span>
                          </label>
                        </div>
                      ) : (
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
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingUserId === user.id ? (
                        <div className="flex gap-2">
                          <Button
                            variant="success"
                            onClick={() => handleSaveEdit(user.id)}
                            className="text-sm px-2 py-1"
                            icon={<FaSave size={12} />}
                          >
                            Save
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={handleCancelEdit}
                            className="text-sm px-2 py-1"
                            icon={<FaTimes size={12} />}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            variant="primary"
                            onClick={() => handleEditClick(user)}
                            className="text-sm px-2 py-1"
                            icon={<FaEdit size={12} />}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(user.id)}
                            className="text-sm px-2 py-1"
                            icon={<FaTrash size={12} />}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;