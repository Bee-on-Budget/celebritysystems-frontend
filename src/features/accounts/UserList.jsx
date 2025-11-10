import React, { useEffect, useState, useCallback, useMemo } from "react";
import { updateUser, deleteUser, resetUserPassword, getUsersPaginated, getAllUsers } from "../../api/services/UserService";
import { getAllCompanies } from "../../api/services/CompanyService";
import { DataList, Pagination } from "../../components";
import UserTable from "./UserTable";
import { showToast } from "../../components/ToastNotifier";
import { useTranslation } from "react-i18next";

const UserList = () => {
  const { t } = useTranslation();
  const [allUsers, setAllUsers] = useState([]); // All users for search
  const [users, setUsers] = useState([]); // Paginated/filtered users to display
  const [companies, setCompanies] = useState([]);
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
  const [searchQuery, setSearchQuery] = useState("");
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

  // Fetch all users for search functionality and companies
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [allUsersData, companiesRes] = await Promise.all([
          getAllUsers(),
          getAllCompanies()
        ]);
        
        const usersArray = Array.isArray(allUsersData) 
          ? allUsersData 
          : (allUsersData?.data || allUsersData?.content || []);
        setAllUsers(usersArray);
        
        const companiesData = companiesRes?.data || companiesRes || [];
        setCompanies(Array.isArray(companiesData) ? companiesData : []);
      } catch (error) {
        console.error("Error loading initial data:", error);
        // Try to load companies separately if getAllUsers fails
        try {
          const companiesRes = await getAllCompanies();
          const companiesData = companiesRes?.data || companiesRes || [];
          setCompanies(Array.isArray(companiesData) ? companiesData : []);
        } catch (companiesError) {
          console.error("Error loading companies:", companiesError);
        }
      }
    };
    loadInitialData();
  }, []);

  // Filter and paginate users client-side when search is active
  const filteredAndPaginatedUsers = useMemo(() => {
    let filtered = allUsers;

    // Apply role filter
    if (selectedRoleFilter && selectedRoleFilter !== "ALL") {
      filtered = filtered.filter(user => user.role === selectedRoleFilter);
    }

    // Apply search filter
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(user => {
        const fullName = (user.fullName || '').toLowerCase();
        const email = (user.email || '').toLowerCase();
        return fullName.includes(query) || email.includes(query);
      });
    }

    // Calculate pagination
    const total = filtered.length;
    const totalPagesCount = Math.ceil(total / pageSize);
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = filtered.slice(startIndex, endIndex);

    return {
      users: paginated,
      total,
      totalPages: totalPagesCount,
      hasNext: currentPage < totalPagesCount - 1,
      hasPrevious: currentPage > 0
    };
  }, [allUsers, selectedRoleFilter, searchQuery, currentPage, pageSize]);

  // Fetch paginated data when NOT searching (server-side pagination)
  const fetchData = useCallback(async () => {
    // If search is active, use client-side filtering
    if (searchQuery && searchQuery.trim()) {
      setUsers(filteredAndPaginatedUsers.users);
      setTotalPages(filteredAndPaginatedUsers.totalPages);
      setTotalItems(filteredAndPaginatedUsers.total);
      setHasNext(filteredAndPaginatedUsers.hasNext);
      setHasPrevious(filteredAndPaginatedUsers.hasPrevious);
      return;
    }

    setLoading(true);
    setError("");
    try {
      // Build API params for server-side pagination (no search, only role filter)
      const apiParams = {
        page: currentPage,
        size: pageSize
      };

      // Add role filter if not "ALL" and not empty
      if (selectedRoleFilter && 
          selectedRoleFilter !== "ALL" && 
          typeof selectedRoleFilter === 'string' && 
          selectedRoleFilter.trim() !== "") {
        apiParams.role = selectedRoleFilter.trim();
      }

      const usersRes = await getUsersPaginated(apiParams);

      const pageUsers = Array.isArray(usersRes?.content) ? usersRes.content : [];
      setUsers(pageUsers);
      setTotalPages(usersRes?.totalPages ?? 0);
      setTotalItems(usersRes?.totalElements ?? 0);
      setCurrentPage(usersRes?.number ?? 0);
      setHasNext(!usersRes?.last);
      setHasPrevious(!usersRes?.first);
    } catch (error) {
      console.error("Error fetching data:", error);
      setUsers([]);
      setCompanies([]);
      setTotalPages(0);
      setTotalItems(0);
      setHasNext(false);
      setHasPrevious(false);
      setError(typeof error === 'string' ? error : (error?.message || 'Failed to load users'));
    } finally {
      setLoading(false);
    }
  }, [selectedRoleFilter, currentPage, pageSize, searchQuery, filteredAndPaginatedUsers]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        // Refresh all users list for search
        try {
          const allUsersData = await getAllUsers();
          const usersArray = Array.isArray(allUsersData) 
            ? allUsersData 
            : (allUsersData?.data || allUsersData?.content || []);
          setAllUsers(usersArray);
        } catch (error) {
          console.error("Error refreshing all users:", error);
        }
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
      // Refresh all users list for search
      try {
        const allUsersData = await getAllUsers();
        const usersArray = Array.isArray(allUsersData) 
          ? allUsersData 
          : (allUsersData?.data || allUsersData?.content || []);
        setAllUsers(usersArray);
      } catch (error) {
        console.error("Error refreshing all users:", error);
      }
      fetchData();
      showToast("User updated successfully!", "success");
    } catch (error) {
      console.error("Error updating user:", error);
      showToast("Error updating user: " + (error || "Unknown error"), "error");
    }
  };

  const handleSearch = useCallback(
    async (query) => {
      // Provide autocomplete suggestions from all users
      if (!query || query.trim() === '') {
        return [];
      }
      
      const queryLower = query.toLowerCase().trim();
      const suggestions = allUsers
        .filter((user) => {
          const fullName = (user.fullName || '').toLowerCase();
          const email = (user.email || '').toLowerCase();
          return fullName.includes(queryLower) || email.includes(queryLower);
        })
        .map((u) => `${u.fullName || ''} (${u.email || ''})`.trim())
        .filter(Boolean);
      
      return suggestions;
    },
    [allUsers]
  );

  const handleResultClick = (query) => {
    // Extract the search term from the selected suggestion
    // Format is usually "Full Name (email)" or just the query
    let searchTerm = query;
    
    // If it's in the format "Name (email)", extract just the name for better search results
    const match = query.match(/^(.+?)\s*\((.+?)\)$/);
    if (match) {
      // Use the name part for search (client-side search will search in both name and email)
      searchTerm = match[1].trim();
    } else {
      // If it's just a plain query, use it as is
      searchTerm = query.trim();
    }
    
    // Set search query and reset to first page
    if (searchTerm) {
      setSearchQuery(searchTerm);
      setCurrentPage(0);
    } else {
      // If empty, clear the search
      setSearchQuery("");
      setCurrentPage(0);
    }
    // fetchData will be called automatically via useEffect
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(0);
    // fetchData will be called automatically via useEffect
  };

  const handleRoleFilterChange = (e) => {
    const role = e.target.value;
    setSelectedRoleFilter(role);
    setCurrentPage(0); // Reset to first page when filter changes
    // fetchData will be called automatically via useEffect
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
          users={users}
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