import React, { useState } from 'react';
import { FaFileContract, FaHome, FaBars, FaUsers, FaBuilding, FaDesktop, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import CompanyLogo from '../../CompanyLogo';
import NavButton from '../../NavButton';
import SidebarDropdown from './SidebarDropdown';
import { useAuth } from '../../../auth/useAuth';
import Button from '../../Button';
import LanguageSwitcher from '../../LanguageSwitcher';
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ open, setOpen }) => {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const isRtl = i18n.dir() === "rtl";

  const handleLogout = () => setShowLogoutConfirm(true);
  const confirmLogout = () => { logout(); setShowLogoutConfirm(false); };
  const cancelLogout = () => setShowLogoutConfirm(false);

  const handleDropdownToggle = (key) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const dir = i18n.dir(); // "ltr" or "rtl"

  return (
    <div
      className={`fixed inset-y-0 ${dir === "rtl" ? "right-0" : "left-0"} z-30 w-64 
      bg-gradient-to-b from-green-900 to-emerald-950 backdrop-blur-lg shadow-2xl
      transform ${open ? "translate-x-0" : dir === "rtl" ? "translate-x-full" : "-translate-x-full"}
      transition-transform duration-200 ease-in-out 
      md:translate-x-0 md:static md:inset-0 
      flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-dark">
        <a href="/">
          <CompanyLogo />
        </a>
        <button
          className="md:hidden text-white hover:text-primary transition-colors duration-200"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        >
          <FaBars className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto mt-1 flex flex-col space-y-2 pr-[calc(1.5rem-8px)] pl-4 pb-4 pt-1 scrollbar-gutter-stable">
        <div className="pr-2">
          {user?.role !== "COMPANY" && (
            <NavButton to={"/dashboard"} icon={<FaHome />} label={t('sidebar.home')} onClick={() => setOpen(false)} />
          )}

          {user?.role === "COMPANY" && (
            <NavButton to={"/profile"} icon={<FaUser />} label={t('profile.title')} onClick={() => setOpen(false)} />
          )}

          {user?.role === "ADMIN" && (
            <SidebarDropdown
              icon={FaUsers}
              label={t('sidebar.accounts')}
              isOpen={openDropdowns["accounts"]}
              onToggle={() => handleDropdownToggle("accounts")}
              items={[
                { label: t('sidebar.createUser'), href: "/create-user", onClick: () => setOpen(false) },
                { label: t('sidebar.manageUsers'), href: "/manage-users", onClick: () => setOpen(false) },
              ]}
            />
          )}

          {user?.role !== "COMPANY" && (
            <SidebarDropdown
              icon={FaBuilding}
              label={t('sidebar.allCompanies')}
              isOpen={openDropdowns["companies"]}
              onToggle={() => handleDropdownToggle("companies")}
              items={[
                { label: t('sidebar.allCompanies'), href: "/companies", onClick: () => setOpen(false) },
                { label: t('sidebar.createCompany'), href: "/companies/create", onClick: () => setOpen(false) },
                { label: t('sidebar.addUser'), href: "/companies/add-user", onClick: () => setOpen(false) }
              ]}
            />
          )}

          {user?.role !== "COMPANY" && (
            <SidebarDropdown
              icon={FaDesktop}
              label={t('sidebar.allScreens')}
              isOpen={openDropdowns["screens"]}
              onToggle={() => handleDropdownToggle("screens")}
              items={[
                { label: t('sidebar.allScreens'), href: "/screen", onClick: () => setOpen(false) },
                { label: t('sidebar.createScreen'), href: "/screen/add", onClick: () => setOpen(false) }
              ]}
            />
          )}

          <SidebarDropdown
            icon={FaFileContract}
            label={t('sidebar.allTickets')}
            isOpen={openDropdowns["tickets"]}
            onToggle={() => handleDropdownToggle("tickets")}
            items={[
              { label: t('sidebar.allTickets'), href: "/tickets", onClick: () => setOpen(false) },
              // Always allow Create Ticket for company users
              { label: t('sidebar.createTicket'), href: "/tickets/create", onClick: () => setOpen(false) },
              ...(user?.role !== "COMPANY" && user?.role !== "COMPANY_USER" ? [
                { label: t('sidebar.pendingTickets'), href: "/tickets/pending", onClick: () => setOpen(false) },
                { label: t('sidebar.resolvedTickets'), href: "/tickets/resolved", onClick: () => setOpen(false) },
              ] : []),
            ]}
          />

          {user?.role === "COMPANY" && (
            <NavButton to={"/company-reports"} icon={<FaFileContract />} label={t('sidebar.createTicket')} onClick={() => setOpen(false)} />
          )}

          {user?.role !== "COMPANY" && (
            <SidebarDropdown
              icon={FaFileContract}
              label={t('sidebar.allContracts')}
              isOpen={openDropdowns["contracts"]}
              onToggle={() => handleDropdownToggle("contracts")}
              items={[
                { label: t('sidebar.allContracts'), href: "/contracts", onClick: () => setOpen(false) },
                { label: t('sidebar.createContract'), href: "/contracts/create", onClick: () => setOpen(false) }
              ]}
            />
          )}

          {user?.role !== "COMPANY" && (
            <SidebarDropdown
              icon={FaFileContract}
              label={t('sidebar.allSubcontracts')}
              isOpen={openDropdowns["subcontracts"]}
              onToggle={() => handleDropdownToggle("subcontracts")}
              items={[
                { label: t('sidebar.allSubcontracts'), href: "/subcontract", onClick: () => setOpen(false) },
                { label: t('sidebar.createSubcontract'), href: "/subcontract/create", onClick: () => setOpen(false) }
              ]}
            />
          )}

          {user?.role !== "COMPANY" && (
            <SidebarDropdown
              icon={FaFileContract}
              label={t('reports.title')}
              isOpen={openDropdowns['reports']}
              onToggle={() => handleDropdownToggle("reports")}
              items={[
                { label: t('reports.allReports'), href: "/reports", onClick: () => setOpen(false) },
                { label: t('reports.reportSummaryTab'), href: "/reports-summary", onClick: () => setOpen(false) },
              ]}
            />
          )}
        </div>
      </nav>

      {/* Mobile footer actions (move header buttons here) */}
      <div className="md:hidden border-t border-dark/40 px-4 py-3 flex items-center justify-between relative gap-1">
        <LanguageSwitcher />
        <div className="relative">
          <Button
            icon={<FaSignOutAlt />}
            size='sm'
            variant='text'
            onClick={handleLogout}
          >
            {t('auth.logout')}
          </Button>
          <AnimatePresence>
            {showLogoutConfirm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`absolute ${isRtl ? "left" : "right"}-0 bottom-full mb-2 w-56 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200`}
              >
                <div className="p-4">
                  <p className="mb-3 font-medium text-dark">{t('auth.logoutMessage')}</p>
                  <div className="flex justify-start space-x-2">
                    <Button
                      onClick={cancelLogout}
                      size='sm'
                      variant='ghost'
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button
                      onClick={confirmLogout}
                      size='sm'
                    >
                      {t('auth.ok')}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
