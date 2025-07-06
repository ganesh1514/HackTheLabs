import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="verifying authentication..." />;
  }

  if (!isAuthenticated) {
    // Redirect to auth page with the current location
    return (
      <Navigate
        to={`/auth?redirect=${encodeURIComponent(
          location.pathname + location.search
        )}`}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
