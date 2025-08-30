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
import EditCompany from "../features/companies/EditCompany";
import CompanyList from "../features/companies/CompanyList";
import AddUserToCompany from "../features/companies/AddUserToCompany";
import CompanyDetails from "../features/companies/CompanyDetails";

// Screen management
import AddScreen from "../features/screen/";
import ScreenDetails from "../features/screen/components/ScreenDetails";
import ScreensList from "../features/screen/ScreensList";

// Test
import TestPage from "../features/test/TestPage";
import LanguageDemo from "../features/demo/LanguageDemo";

// Contract management
import CreateContract from "../features/contract/CreateContract";
import ContractList from "../features/contract/ContractList";
import ContractDetails from "../features/contract/ContractDetails";
import EditContract from "../features/contract/EditContract";

// Ticket management
import TicketList from "../features/ticket/TicketList";
import CreateTicket from "../features/ticket/CreateTicket";
import TicketDetails from "../features/ticket/TicketDetails";
import PendingTicketsList from "../features/ticket/PendingTicketsList";
import PendingTicketDetails from "../features/ticket/PendingTicketDetails";

// Report management
import ReportList from "../features/report/ReportList";
import ReportDetails from "../features/report/ReportDetails";
import CreateReport from "../features/report/CreateReport";

// Sub-Contract management
import SubcontractList from "../features/subcontract/SubcontractList";
import CreateSubContract from "../features/subcontract/CreateSubContract";
import SubContractDetails from '../features/subcontract/SubContractDetails';

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
        <Route path="language-demo" element={<LanguageDemo />} />

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
          path="companies/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <EditCompany />
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
              <ScreensList />
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
        <Route
          path="contracts/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <ContractDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="contracts/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <EditContract />
            </ProtectedRoute>
          }
        />
        
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
        <Route
          path="tickets/pending"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <PendingTicketsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="tickets/pending/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <PendingTicketDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="tickets/pending/:id/create-report"
          element={
            <ProtectedRoute allowedRoles={["SUPERVISOR"]}>
              <CreateReport />
            </ProtectedRoute>
          }
        />

        {/* Report management */}
        <Route
          path="reports"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <ReportList />
            </ProtectedRoute>
          }
        />
        <Route
          path="reports/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <ReportDetails />
            </ProtectedRoute>
          }
        />

        {/* Sub-Contract management */}
        <Route
          path="subcontract"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <SubcontractList />
            </ProtectedRoute>
          }
        />
        <Route
          path="subcontract/create"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <CreateSubContract />
            </ProtectedRoute>
          }
        />
        <Route
          path="subcontract/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <SubContractDetails />
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
