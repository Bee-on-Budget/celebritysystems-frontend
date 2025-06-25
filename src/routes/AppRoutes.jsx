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
import AddSystem from "../features/systems/AddSystem";


// Errors
import { NotFound, Forbidden, ServerError } from "../features/errors";

// User management
import CreateUser from "../features/accounts/CreateUser";
import ManageUsers from "../features/accounts/UserList";

// Company management
import CreateCompany from "../features/companies/CreateCompany";
import CompanyList from "../features/companies/CompanyList";
import AddUserToCompany from "../features/companies/AddUserToCompany";
import CompanyDetails from "../features/companies/CompanyDetails";

// Screen management
import AddScreen from "../features/screen/";
import ScreenDetails from "../features/screen/components/ScreenDetails";
// import ScreenList from "../features/screen/components/ScreenList";
import ScreenPage from "../features/screen/ScreenPage";

// Test
import TestPage from "../features/test/TestPage";

// Contract management
import CreateContract from "../features/contract/CreateContract";
import ContractList from "../features/contract/ContractList";
// import ContractDetails from "../features/contract/ContractDetails";
// Ticket management
import TicketList from "../features/ticket/TicketList";
import CreateTicket from "../features/ticket/CreateTicket";
import TicketDetails from "../features/ticket/TicketDetails";
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
          <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
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
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <CreateUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="manage-users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
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
          path="companies/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <CompanyDetails />
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
        <Route
          path="screen" // ✅ updated to plural and matches Sidebar link
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <ScreenPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="screen/AddScreen"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <AddScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="screens/:id" // This will match paths like /screen/1, /screen/2, etc.
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <ScreenDetails />
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
        {/* <Route
          path="contracts/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <ContractDetails />
            </ProtectedRoute>
          }
        /> */}
        {/*Tickets*/}
        <Route
          path="tickets"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <TicketList />
            </ProtectedRoute>
          }
        />
        <Route
          path="tickets/create"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <CreateTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="tickets/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <TicketDetails />
            </ProtectedRoute>
          }
        />
        {/* Catch-all inside layout */}
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/server-error" element={<ServerError />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Catch-all outside layout */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;