import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { createUser } from '../../api/creation';
import { showToast } from '../../components/ToastNotifier';
import { DropdownInput, FormsContainer, Input } from '../../components';
import { FaEnvelope, FaIdCard, FaLock, FaUser, FaUserShield, FaUserTie } from 'react-icons/fa';

const CreateUser = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
    role: 'CELEBRITY_SYSTEM_WORKER'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await createUser(formData);
      showToast("User created successfully!", "success");
      navigate('/manage-users');
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to create user", "error");
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <FormsContainer
      title={"Create New User Account"}
      actionTitle={"Create User Account"}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
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
          { value: "CELEBRITY_SYSTEM_WORKER", label: "Worker" },
          { value: "SUPERVISOR", label: "Supervisor" },
          ...(user.role === "ADMIN"
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
    </FormsContainer>
  );
};

export default CreateUser;