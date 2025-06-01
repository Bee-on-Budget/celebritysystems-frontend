import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserForm from '../../components/UserForm';
import { useAuth } from '../../auth/useAuth';
import { createUser } from '../../api/creation';
import { showToast } from '../../components/ToastNotifier';
import { FaUserPlus } from 'react-icons/fa';

const CreateUser = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (userData) => {
    try {
      await createUser(userData);
      showToast("User created successfully!", "success");
      setTimeout(() => navigate('/manage-users'), 1500);
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to create user", "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-5xl mx-auto px-4 py-8"
    >
      <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10 border border-gray-100">
        <div className="text-center mb-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4"
          >
            <FaUserPlus className="text-2xl text-blue-600" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
          >
            Create New User Account
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Register a new team member with appropriate access permissions and role assignments
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <UserForm 
            onSubmit={handleSubmit} 
            currentUserRole={user?.role} 
            submitButtonText="Create User Account"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreateUser;