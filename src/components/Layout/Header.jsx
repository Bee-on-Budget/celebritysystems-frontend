import React, { useState } from 'react';
import { FaBars, FaSignOutAlt, FaBell, FaSearch } from "react-icons/fa";
import { useAuth } from "../../auth/useAuth";
import { motion, AnimatePresence } from "framer-motion";

const Header = ({ setSidebarOpen }) => {
    const { logout } = useAuth();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleLogout = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        logout();
        setShowLogoutConfirm(false);
    };

    return (
        <header className="sticky top-0 z-50 bg-white shadow-md">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Left section */}
                    <div className="flex items-center space-x-4">
                        <button 
                            className="md:hidden text-gray-600 text-xl p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Open menu"
                        >
                            <FaBars />
                        </button>
                        
                        {/* Search bar */}
                        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 ring-blue-500/50 transition-all duration-200">
                            <FaSearch className="text-gray-500 mr-2" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-transparent border-none outline-none text-gray-700 placeholder-gray-500 w-40 lg:w-64"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    {/* Right section */}
                    <div className="flex items-center space-x-4">
                        <button className="p-2 relative text-gray-600 rounded-full hover:bg-gray-100 transition-colors duration-200">
                            <FaBell className="text-xl" />
                            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                        </button>
                        
                        <div className="relative">
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
                                aria-label="Logout"
                            >
                                <FaSignOutAlt className="text-xl group-hover:rotate-180 transition-transform duration-300" />
                                <span className="hidden lg:inline-block">Logout</span>
                            </button>
                            
                            {/* Logout confirmation */}
                            <AnimatePresence>
                                {showLogoutConfirm && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200"
                                    >
                                        <div className="p-4">
                                            <p className="mb-3 font-medium text-gray-700">Confirm logout?</p>
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => setShowLogoutConfirm(false)}
                                                    className="px-3 py-1 text-sm text-gray-600 rounded hover:bg-gray-100"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={confirmLogout}
                                                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;