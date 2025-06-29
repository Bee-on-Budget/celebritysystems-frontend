import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import Loading from "../components/Loading";
import { removeToken } from "../utils/token";


const ProtectedRoute = ({ children, allowedRoles}) => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  // If no user, redirect to login with return location
  if (!user || !allowedRoles) {
    removeToken();
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default ProtectedRoute;
