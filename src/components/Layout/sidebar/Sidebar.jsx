import React, { useState } from 'react';
import { FaFileContract, FaHome, FaUser, FaBars, FaUsers, FaBuilding, FaDesktop } from "react-icons/fa";
import CompanyLogo from '../../CompanyLogo';
import NavButton from '../../NavButton';
import SidebarDropdown from './SidebarDropdown';
import { useAuth } from '../../../auth/useAuth';

const Sidebar = ({ open, setOpen }) => {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const {user} = useAuth();

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
          <NavButton to={"/dashboard"} icon={<FaHome />} label="Home" onClick={() => setOpen(false)} />
          {/* <NavButton to={"/profile"} icon={<FaUser />} label="Profile" onClick={() => setOpen(false)} /> */}

          {user?.role === "ADMIN" && (
            <SidebarDropdown
              icon={FaUsers}
              label="Accounts"
              isOpen={openDropdowns["Accounts"]}
              onToggle={() => handleDropdownToggle("Accounts")}
              items={[
                { label: "Create User", href: "/create-user", onClick: () => setOpen(false) },
                { label: "Manage Users", href: "/manage-users", onClick: () => setOpen(false) },
              ]}
            />
           )}
          <SidebarDropdown
            icon={FaBuilding}
            label="Companies"
            isOpen={openDropdowns["Companies"]}
            onToggle={() => handleDropdownToggle("Companies")}
            items={[
              { label: "All Companies", href: "/companies", onClick: () => setOpen(false) },
              { label: "Create Company", href: "/companies/create", onClick: () => setOpen(false) },
              { label: "Add User", href: "/companies/add-user", onClick: () => setOpen(false) }
            ]}
          />
          <SidebarDropdown
            icon={FaDesktop}
            label="Screens"
            isOpen={openDropdowns["Screens"]}
            onToggle={() => handleDropdownToggle("Screens")}
            items={[
              { label: "All Screens", href: "/screen", onClick: () => setOpen(false) },
              { label: "Create Screen", href: "/screen/AddScreen", onClick: () => setOpen(false) }
            ]}
          />
          <SidebarDropdown
            icon={FaFileContract}
            label="Tickets"
            isOpen={openDropdowns["Tickets"]}

            onToggle={() => handleDropdownToggle("Tickets")}
            items={[
              { label: "All Tickets", href: "/tickets" },
              { label: "Create Ticket", href: "/tickets/create" }
            ]}
          />

          <SidebarDropdown
            icon={FaFileContract}
            label="Contracts"
            isOpen={openDropdowns["Contracts"]}
            onToggle={() => handleDropdownToggle("Contracts")}
            items={[
              { label: "All Contracts", href: "/contracts", onClick: () => setOpen(false) },
              { label: "Create Contract", href: "/contracts/create", onClick: () => setOpen(false) }
            ]}
          />
        </div>
      </nav>
    </div>
  );
};


export default Sidebar;