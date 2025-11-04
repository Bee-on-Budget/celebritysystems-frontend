import React, { useState } from "react";
import { FaTrash, FaEdit, FaSave, FaTimes, FaKey } from "react-icons/fa";
import Button from "../../components/Button";
import { roleColors } from "./constants";
// import { getUserCompany } from "./userUtils";
import { showToast } from "../../components/ToastNotifier";
import { useTranslation } from "react-i18next";

const UserRow = ({
  user,
  // companies,
  editingUserId,
  editFormData,
  handleEditFormChange,
  handleEditClick,
  handleSaveEdit,
  handleCancelEdit,
  handleDelete,
  handleResetPassword
}) => {
  const { t } = useTranslation();
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

  const roleOptions = [
    { value: "COMPANY", label: t("accounts.roles.COMPANY_USER") },
    { value: "CELEBRITY_SYSTEM_WORKER", label: t("accounts.roles.CELEBRITY_SYSTEM_WORKER") },
    { value: "ADMIN", label: t("accounts.roles.ADMIN") },
    { value: "SUPERVISOR", label: t("accounts.roles.SUPERVISOR") },
  ];


  const isEditing = editingUserId === user.id;

  const handleResetPasswordClick = () => {
    setShowResetPasswordModal(true);
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }

    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters long!", "warning");
      return;
    }

    setResetPasswordLoading(true);
    try {
      await handleResetPassword(user.id, newPassword);
      setShowResetPasswordModal(false);
      setNewPassword("");
      setConfirmPassword("");
      showToast("Password reset successfully!", "success");
    } catch (error) {
      console.error("Error resetting password:", error);
      showToast("Error resetting password: " + (error || "Unknown error"), "error");
    } finally {
      setResetPasswordLoading(false);
    }
  };

  const handleResetPasswordCancel = () => {
    setShowResetPasswordModal(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <>
      <tr key={user.id}>
        <td className="px-6 py-4 whitespace-nowrap">
          {isEditing ? (
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
          {isEditing ? (
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
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {/* {getUserCompany(user.id, companies || [])} */}
          {user.companyName ? user.companyName : 'Celebrity Systems'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {isEditing ? (
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
              roleColors[user.role] || 'bg-green-100 text-green-800'
            }`}>
              {roleOptions?.find(r => r.value === user.role)?.label || user.role}
            </span>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {isEditing ? (
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
          {isEditing ? (
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
                variant="warning"
                onClick={handleResetPasswordClick}
                className="text-sm px-2 py-1"
                icon={<FaKey size={12} />}
              >
                Reset Password
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

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <tr>
          <td colSpan="7" className="px-6 py-4">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Reset Password for {user.fullName}</h3>
              <form onSubmit={handleResetPasswordSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="border rounded px-3 py-2 w-full"
                      placeholder="Enter new password"
                      required
                      minLength="6"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border rounded px-3 py-2 w-full"
                      placeholder="Confirm new password"
                      required
                      minLength="6"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    variant="success"
                    disabled={resetPasswordLoading}
                    className="text-sm px-4 py-2"
                  >
                    {resetPasswordLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleResetPasswordCancel}
                    className="text-sm px-4 py-2"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default UserRow;