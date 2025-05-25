import React, { useState } from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaUserShield, 
  FaUserTie, 
  FaIdCard
} from 'react-icons/fa';
import Input from '../components/Input';
import Button from '../components/Button';
import DropdownInput from './DropdownInput';

const UserForm = ({ onSubmit, currentUserRole }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
    role: 'WORKER'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="Full Name"
          name="fullName"
          type="text"
          icon={<FaIdCard className="text-gray-400" />}
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          placeholder="John Doe"
          required
          autoFocus
        />

        <Input
          label="Username"
          name="username"
          type="text"
          icon={<FaUser className="text-gray-400" />}
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          placeholder="johndoe123"
          required
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          icon={<FaEnvelope className="text-gray-400" />}
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="john@example.com"
          required
        />

        <DropdownInput
          label="User Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          icon={
            formData.role === 'ADMIN' ? (
              <FaUserShield className="h-5 w-5 text-gray-400" />
            ) : formData.role === 'SUPERVISOR' ? (
              <FaUserTie className="h-5 w-5 text-gray-400" />
            ) : (
              <FaUser className="h-5 w-5 text-gray-400" />
            )
          }
          options={[
            { value: "WORKER", label: "Worker" },
            { value: "SUPERVISOR", label: "Supervisor" },
            ...(currentUserRole === "ADMIN"
              ? [{ value: "ADMIN", label: "Administrator" }]
              : []),
          ]}
          error={errors.role}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          icon={<FaLock className="text-gray-400" />}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="••••••••"
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
          placeholder="••••••••"
          required
        />
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="min-w-[150px]"
        >
          {isSubmitting ? 'Creating...' : 'Create Account'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;