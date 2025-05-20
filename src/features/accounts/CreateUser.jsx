import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import UserForm from '../../components/UserForm';
import { useAuth } from '../../auth/useAuth';
import { createUser } from '../../api/axios';
import { showToast } from '../../components/ToastNotifier';

const CreateUser = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (userData) => {
    try {
      await createUser(userData);
      showToast("User created successfully!");
      setTimeout(() => navigate('/manage-users'), 1500);
    } catch (error) {
      showToast("Failed to create user", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl mx-auto"
      >
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-lg dark:shadow-gray-900/20 p-8 sm:p-10 border border-gray-100 dark:border-gray-700">
          <div className="text-center mb-10">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2"
            >
              Create New User
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto"
            >
              Register a new team member with appropriate permissions
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <UserForm onSubmit={handleSubmit} currentUserRole={user?.role} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateUser;