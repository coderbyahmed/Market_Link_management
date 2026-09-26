import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getToken, getUser } from "../../utils/auth.js";
import { hasValidSession, destroySession } from "../../hooks/useSessionGuard.js";

const ProtectedRoute = ({ role, children }) => {
  const navigate = useNavigate();
  const token = getToken();
  const user = getUser();

  const isAuthenticated = Boolean(token && user);
  const hasRole = !role || user?.role === role;

  // Check session validity on mount and on location change
  useEffect(() => {
    if (!hasValidSession()) {
      destroySession();
      if (role === "admin") {
        navigate(`/admin/login/${import.meta.env.VITE_ADMIN_ACCESS_ID || ""}`, { replace: true });
      } else {
        navigate(role ? `/login/${role}` : "/login", { replace: true });
      }
    }
  }, [navigate, role]);

  if (!isAuthenticated || !hasRole) {
    if (role === "admin") {
      return (
        <Navigate
          to={`/admin/login/${import.meta.env.VITE_ADMIN_ACCESS_ID || ""}`}
          replace
        />
      );
    }
    return <Navigate to={role ? `/login/${role}` : "/login"} replace />;
  }

  return children;
};

export default ProtectedRoute;