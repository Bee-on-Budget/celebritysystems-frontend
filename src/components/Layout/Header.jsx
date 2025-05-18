import React from 'react';
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../auth/useAuth";

const Header = ({ setSidebarOpen }) => {
    const { logout } = useAuth();
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
            <button className="md:hidden text-2xl" onClick={() => setSidebarOpen(true)}>
                <FaBars />
            </button>
            <h1 className="text-xl font-semibold text-dark">Welcome to the Dashboard</h1>
            <button
                onClick={logout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-800 font-medium"
            >
                <FaSignOutAlt />
                <span>Logout</span>
            </button>
        </header>
    );
};

export default Header;