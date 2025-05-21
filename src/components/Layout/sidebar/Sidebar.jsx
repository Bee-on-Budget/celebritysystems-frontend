import React from 'react';
import { FaHome, FaUser, FaBars, FaUsers, FaBuilding } from "react-icons/fa";
import Logo from '../../../assets/logo.png';
import NavButton from '../../NavButton';
import SidebarDropdown from './SidebarDropdown';

const Sidebar = ({ open, setOpen }) => (
    <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-slate-900 to-blue-950 backdrop-blur-lg shadow-2xl transform ${open ? "translate-x-0" : "-translate-x-full"} transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-0`}>
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
                    { label: "Manage Users", href: "/manage-users" },
                    { label: "Manage Supervisors", href: "/manage-supervisors" },
                    { label: "View Workers", href: "/view-workers" },
                ]}
            />
            <SidebarDropdown
                icon={FaBuilding}
                label="Companies"
                items={[
                    { label: "All Companies", href: "/companies" },
                    { label: "Create Company", href: "/companies/create" },
                    { label: "Add User", href: "/companies/add-user" }
                ]}
            />

        </nav>
    </div>
);

export default Sidebar;