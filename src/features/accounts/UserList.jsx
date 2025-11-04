import React, { useEffect, useState, useCallback } from "react";
import { updateUser, deleteUser, resetUserPassword, getUsersPaginated } from "../../api/services/UserService";
import { getAllCompanies } from "../../api/services/CompanyService";
import { DataList, Pagination } from "../../components";
import UserTable from "./UserTable";
import { filterUsersByRole, searchUsers } from "./userUtils";
import { showToast } from "../../components/ToastNotifier";
import { useTranslation } from "react-i18next";

const UserList = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    canRead: false,
    canEdit: false
  });

  const roleOptions = [
    { value: "COMPANY", label: t("accounts.roles.COMPANY_USER") },
    { value: "CELEBRITY_SYSTEM_WORKER", label: t("accounts.roles.CELEBRITY_SYSTEM_WORKER") },
    { value: "ADMIN", label: t("accounts.roles.ADMIN") },
    { value: "SUPERVISOR", label: t("accounts.roles.SUPERVISOR") },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [usersRes, companiesRes] = await Promise.all([
        getUsersPaginated(currentPage, pageSize),
        getAllCompanies()
      ]);

      const pageUsers = Array.isArray(usersRes?.content) ? usersRes.content : [];
      setUsers(pageUsers);
      setCompanies(companiesRes?.data || []);
      setFiltered(filterUsersByRole(pageUsers, selectedRoleFilter));
      setTotalPages(usersRes?.totalPages ?? 0);
      setTotalItems(usersRes?.totalElements ?? 0);
      setCurrentPage(usersRes?.number ?? 0);
      setHasNext(!usersRes?.last);
      setHasPrevious(!usersRes?.first);
    } catch (error) {
      console.error("Error fetching data:", error);
      setUsers([]);
      setFiltered([]);
      setCompanies([]);
      setTotalPages(0);
      setTotalItems(0);
      setHasNext(false);
      setHasPrevious(false);
      setError(typeof error === 'string' ? error : (error?.message || 'Failed to load users'));
    } finally {
      setLoading(false);
    }
  }, [selectedRoleFilter, currentPage, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        fetchData();
        showToast("User deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting user:", error);
        showToast("Error deleting user: " + (error || "Unknown error"), "error");
      }
    }
  };

  const handleResetPassword = async (id, newPassword) => {
    try {
      await resetUserPassword(id, newPassword);
      // Success toast is handled in UserRow component
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error; // Re-throw to let UserRow handle the error toast
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
      showToast("User updated successfully!", "success");
    } catch (error) {
      console.error("Error updating user:", error);
      showToast("Error updating user: " + (error || "Unknown error"), "error");
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
    <DataList
      title={t('navigation.users')}
      error={error}
      isLoading={loading}
      label={t('navigation.users')}
      onSearch={handleSearch}
      onResultClick={handleResultClick}
      onClearSearch={handleClearSearch}
      totalElements={totalItems}
    >
      {/* Filters */}
      <div className="flex items-center justify-end gap-2 mb-4">
        <select
          value={selectedRoleFilter}
          onChange={handleRoleFilterChange}
          className="border rounded px-3 py-2 w-full sm:w-48 text-sm"
        >
          <option value="ALL">{t('accounts.allTypes')}</option>
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded overflow-hidden">
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
          handleResetPassword={handleResetPassword}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={pageSize}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          onPageChange={(newPage) => {
            if (newPage >= 0 && newPage < totalPages) {
              setCurrentPage(newPage);
            }
          }}
          className="mt-8"
        />
      )}
    </DataList>
  );
};

export default UserList;