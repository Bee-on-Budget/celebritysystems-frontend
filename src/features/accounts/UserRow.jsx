import React from "react";
import { FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import Button from "../../components/Button";
import { roleOptions, roleColors } from "./constants";
import { getUserCompany } from "./userUtils";

const UserRow = ({
  user,
  companies,
  editingUserId,
  editFormData,
  handleEditFormChange,
  handleEditClick,
  handleSaveEdit,
  handleCancelEdit,
  handleDelete
}) => {
  const isEditing = editingUserId === user.id;

  return (
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
        {getUserCompany(user.id, companies || [])}
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
  );
};

export default UserRow;