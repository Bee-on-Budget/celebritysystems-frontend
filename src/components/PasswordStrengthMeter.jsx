import React from 'react';
import { motion } from 'framer-motion';

const PasswordStrengthMeter = ({ score }) => {
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-teal-500'
  ];

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Password Strength
        </span>
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          {strengthLabels[score]}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
        <motion.div
          className={`h-1.5 rounded-full ${colors[score]}`}
          initial={{ width: 0 }}
          animate={{ width: `${(score / 5) * 100}%` }}
          transition={{ duration: 0.5, type: 'spring' }}
        />
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;