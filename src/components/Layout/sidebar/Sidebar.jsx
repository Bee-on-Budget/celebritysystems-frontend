import React from 'react';
import { FaHome, FaUser, FaBars, FaUsers, FaPlus } from "react-icons/fa";
import Logo from '../../../assets/logo.png';
import NavButton from '../../NavButton';
import SidebarDropdown from './SidebarDropdown';

const Sidebar = ({ open, setOpen }) => (
    <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-sidebar-bg shadow-lg transform ${open ? "translate-x-0" : "-translate-x-full"} transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-0`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300">
            <a href="/dashboard">
                <img
                    src={Logo}
                    alt="Logo"
                    className="w-28 h-10 object-contain"
                />
            </a>
            <button className="md:hidden" onClick={() => setOpen(false)}>
                <FaBars />
            </button>
        </div>
        <nav className="mt-4 flex flex-col space-y-2 px-6">
            <NavButton
                to={"/dashboard"}
                icon={<FaHome />}
                label="Home"
            />
            <NavButton
                to={"/profile"}
                icon={<FaUser />}
                label="Profile"
            />
      <SidebarDropdown
  icon={FaUsers}
  label="Accounts"
  items={[
    { label: "Create User", href: "/create-user" },
    { label: "Create Supervisor", href: "/create-supervisor" },
    { label: "Create Worker", href: "/create-worker" },
    { label: "Manage Users", href: "/manage-users" },
    { label: "Manage Supervisors", href: "/manage-supervisors" },
    { label: "View Workers", href: "/view-workers" },
  ]}
/>
            <NavButton
                to="/add-system"
                icon={<FaPlus />}
                label="Add System"
            />

            {/* <a href="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-primary font-medium py-2">
                <FaHome />
                <span>Home</span>
            </a>
            <a href="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-primary font-medium py-2">
                <FaUser />
                <span>Profile</span>
            </a>
            <a href="/add-system" className="flex items-center space-x-2 text-gray-700 hover:text-primary font-medium py-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                <span>Add System</span>
            </a> */}
            {/* Add more links as needed */}
        </nav>
    </div>
);

export default Sidebar;