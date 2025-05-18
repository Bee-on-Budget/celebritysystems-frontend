import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import Loading from "../components/Loading";

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <Loading />;

    return !user ? children : <Navigate to="/dashboard" replace />;
};

export default PublicRoute;
