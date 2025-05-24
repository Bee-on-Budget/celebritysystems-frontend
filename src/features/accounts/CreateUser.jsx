import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

  return (      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-xl p-8 sm:p-10 border border-gray-100">
          <div className="text-center mb-10">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2"
            >
              Create New User
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-500 max-w-md mx-auto"
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
  );
};

export default CreateUser;