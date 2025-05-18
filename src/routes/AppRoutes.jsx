// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/auth/Login";
import Dashboard from "../features/dashboard/Dashboard";
import Profile from "../features/profile/Profile";
import NotFound from "../features/notfound/NotFound";
import AddSystem from "../features/systems/AddSystem";
import ProtectedRoute from "../auth/ProtectedRoute";
import PublicRoute from "../auth/PublicRoute";
import Layout from "../components/Layout/Layout";
import CreateUser from "../features/accounts/CreateUser";
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route (only for unauthenticated users) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected Layout with nested routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route 
  path="/create-user" 
  element={
    <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR']}>
      <CreateUser />
    </ProtectedRoute>
  } 
/>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="add-system" element={<AddSystem />} />
        <Route path="*" element={<NotFound />} />
        {/* Add more nested routes here */}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
