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

// User management

import CreateUser from "../features/accounts/CreateUser";
import ManageUsers from "../features/accounts/UserList";



// Company management
import CreateCompany from "../features/companies/CreateCompany";
import CompanyList from "../features/companies/CompanyList";
import AddUserToCompany from "../features/companies/AddUserToCompany";

// Screen management
import AddScreen from "../features/screen/addScreen/";

// Test
import TestPage from "../features/test/TestPage";

// Contratc management
// Contract management
import CreateContract from "../features/contract/CreateContract"; 
import ContractList from "../features/contract/ContractList";
import ContractDetails from "../features/contract/ContractDetails";

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
        <Route path="test" element={<TestPage />} />

        {/* User management */}
        <Route
          path="create-user"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <CreateUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="manage-users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        {/* Company management */}
        <Route
          path="companies"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <CompanyList />
            </ProtectedRoute>
          }
        />
        <Route
          path="companies/create"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <CreateCompany />
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

        {/* Screen management */}
        {/* <Route
          path="screens"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR", "TECHNICIAN"]}>
              <ScreenList />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="screen/AddScreen"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR", "TECHNICIAN"]}>
              <AddScreen />
            </ProtectedRoute>
          }
        />

      {/* Contract management */}
      <Route
          path="contracts"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <ContractList />
            </ProtectedRoute>
          }
        />
        <Route
          path="contracts/create"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <CreateContract />
            </ProtectedRoute>
          }
        />
        <Route
          path="contracts/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <ContractDetails />
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