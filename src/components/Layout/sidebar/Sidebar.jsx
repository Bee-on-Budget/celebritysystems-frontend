import React, { useState } from 'react';
import { FaFileContract, FaHome, FaUser, FaBars, FaUsers, FaBuilding, FaDesktop } from "react-icons/fa";
import CompanyLogo from '../../CompanyLogo';
import NavButton from '../../NavButton';
import SidebarDropdown from './SidebarDropdown';

const Sidebar = ({ open, setOpen }) => {
  const [openDropdowns, setOpenDropdowns] = useState({});

  const handleDropdownToggle = (label) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-slate-900 to-blue-950 backdrop-blur-lg shadow-2xl 
      transform ${open ? "translate-x-0" : "-translate-x-full"} 
      transition-transform duration-200 ease-in-out 
      md:translate-x-0 md:static md:inset-0 
      flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <a href="/dashboard"><CompanyLogo /></a>
        <button
          className="md:hidden text-gray-400 hover:text-white transition-colors"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        >
          <FaBars className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto mt-4 flex flex-col space-y-2 pr-[calc(1.5rem-8px)] pl-6 pb-4 scrollbar-gutter-stable">
        <div className="pr-2">
          <NavButton to={"/dashboard"} icon={<FaHome />} label="Home" />
          <NavButton to={"/profile"} icon={<FaUser />} label="Profile" />

          <SidebarDropdown
            icon={FaUsers}
            label="Accounts"
            isOpen={openDropdowns["Accounts"]}
            onToggle={() => handleDropdownToggle("Accounts")}
            items={[
              { label: "Create User", href: "/create-user" },
              { label: "Manage Users", href: "/manage-users" },
              { label: "Manage Supervisors", href: "/manage-supervisors" },
              { label: "View Workers", href: "/view-workers" },
            ]}
          />
          <SidebarDropdown
            icon={FaBuilding}
            label="Companies"
            isOpen={openDropdowns["Companies"]}
            onToggle={() => handleDropdownToggle("Companies")}
            items={[
              { label: "All Companies", href: "/companies" },
              { label: "Create Company", href: "/companies/create" },
              { label: "Add User", href: "/companies/add-user" }
            ]}
          />
          <SidebarDropdown
            icon={FaDesktop}
            label="Screens"
            isOpen={openDropdowns["Screens"]}
            onToggle={() => handleDropdownToggle("Screens")}
            items={[
              { label: "All Screens", href: "/screen" },
              { label: "Create Screen", href: "/screen/AddScreen" }
            ]}
          />
          <SidebarDropdown
            icon={FaFileContract}
            label="Contracts"
            isOpen={openDropdowns["Contracts"]}
            onToggle={() => handleDropdownToggle("Contracts")}
            items={[
              { label: "All Contracts", href: "/contracts" },
              { label: "Create Contract", href: "/contracts/create" }
            ]}
          />
        </div>
      </nav>
    </div>
  );
};


export default Sidebar;