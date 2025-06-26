import React, { useState } from 'react';
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../auth/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import Button from '../Button';

const Header = ({ setSidebarOpen }) => {
  const { logout, user } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  // Get user's display name from various possible fields
  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.username || user.fullName || user.email || user.username || 'User';
  };

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="sticky top-0 z-10 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <button
              className="md:hidden text-dark text-xl p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <FaBars />
            </button>

            {/* Welcome message */}
            <div className="hidden md:block">
              <h2 className="text-lg font-semibold text-gray-900">
                {getGreeting()}, {getUserDisplayName()}!
              </h2>
              <p className="text-sm text-gray-600">
                Welcome to Celebrity Systems
              </p>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
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
                      <p className="mb-3 font-medium text-dark">Confirm logout?</p>
                      <div className="flex justify-end space-x-2">
                        <Button
                          onClick={() => setShowLogoutConfirm(false)}
                          size='sm'
                          variant='ghost'
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={confirmLogout}
                          size='sm'
                        >
                          Logout
                        </Button>
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