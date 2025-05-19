// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Auth and layout
import ProtectedRoute from "../auth/ProtectedRoute";
import PublicRoute from "../auth/PublicRoute";
import Layout from "../components/Layout/Layout";

// Features
import Login from "../features/auth/Login";
import Dashboard from "../features/dashboard/Dashboard";
import Profile from "../features/profile/Profile";
import NotFound from "../features/notfound/NotFound";
import AddSystem from "../features/systems/AddSystem";
import CreateUser from "../features/accounts/CreateUser";

// Company management
import CreateCompany from "../features/companies/CreateCompany";
import CompanyList from "../features/companies/CompanyList";
import AddUserToCompany from "../features/companies/AddUserToCompany";

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
        {/* Redirect root to dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Core app pages */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="add-system" element={<AddSystem />} />

        {/* User management */}
        <Route
          path="create-user"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <CreateUser />
            </ProtectedRoute>
          }
        />

        {/* Company management */}
        <Route
          path="companies/create"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <CreateCompany />
            </ProtectedRoute>
          }
        />
        <Route
          path="companies/list"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <CompanyList />
            </ProtectedRoute>
          }
        />
        <Route
          path="companies/add-user"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <AddUserToCompany />
            </ProtectedRoute>
          }
        />

        {/* Catch-all inside layout */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Catch-all outside layout */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
