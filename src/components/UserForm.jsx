import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaBuilding, FaUserShield, FaUserTie } from 'react-icons/fa';
import Input from '../components/Input';
import Button from '../components/Button';

const UserForm = ({ onSubmit, currentUserRole }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'WORKER',
    companyId: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    console.log("Form submitted!");
    e.preventDefault();
    if (!validateForm()) return;
  
    console.log('✅ Submitting form with:', formData); // <- ADD THIS
  
    setIsSubmitting(true);
    try {
      await onSubmit({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        companyId: formData.companyId || null
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="Username"
          name="username"
          type="text"
          icon={<FaUser className="text-gray-400" />}
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          placeholder="Enter username"
          required
        />
        
        <Input
          label="Email"
          name="email"
          type="email"
          icon={<FaEnvelope className="text-gray-400" />}
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="Enter email"
          required
        />
        
        <Input
          label="Password"
          name="password"
          type="password"
          icon={<FaLock className="text-gray-400" />}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Enter password"
          required
        />
        
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          icon={<FaLock className="text-gray-400" />}
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="Confirm password"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <div className="relative">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
              <option value="WORKER">Worker</option>
              <option value="SUPERVISOR">Supervisor</option>
              {currentUserRole === 'ADMIN' && (
                <option value="ADMIN">Admin</option>
              )}
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {formData.role === 'ADMIN' ? (
                <FaUserShield className="h-5 w-5 text-gray-400" />
              ) : formData.role === 'SUPERVISOR' ? (
                <FaUserTie className="h-5 w-5 text-gray-400" />
              ) : (
                <FaUser className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>
        </div>
{/* 
        <Input
          label="Company ID (optional)"
          name="companyId"
          type="text"
          icon={<FaBuilding className="text-gray-400" />}
          value={formData.companyId}
          onChange={handleChange}
          placeholder="Enter company ID"
        /> */}
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          Create User
        </Button>
      </div>
    </form>
  );
};

export default UserForm;