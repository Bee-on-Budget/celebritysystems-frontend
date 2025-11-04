import React from "react";
import UserRow from "./UserRow";
import { useTranslation } from "react-i18next";

const UserTable = ({
  users,
  companies,
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
  const headerStyle = "px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider";
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className={headerStyle}>{t('table.name')}</th>
            <th className={headerStyle}>{t('table.username')}</th>
            <th className={headerStyle}>{t('table.email')}</th>
            <th className={headerStyle}>{t('table.company')}</th>
            <th className={headerStyle}>{t('table.role')}</th>
            <th className={headerStyle}>{t('table.permissions')}</th>
            <th className={headerStyle}>{t('table.actions')}</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              // companies={companies}
              editingUserId={editingUserId}
              editFormData={editFormData}
              handleEditFormChange={handleEditFormChange}
              handleEditClick={handleEditClick}
              handleSaveEdit={handleSaveEdit}
              handleCancelEdit={handleCancelEdit}
              handleDelete={handleDelete}
              handleResetPassword={handleResetPassword}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;