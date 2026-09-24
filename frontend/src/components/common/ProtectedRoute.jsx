import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../../utils/auth.js";

const ProtectedRoute = ({ role, children }) => {
  const token = getToken();
  const user = getUser();

  const isAuthenticated = Boolean(token && user);
  const hasRole = !role || user?.role === role;

  if (!isAuthenticated || !hasRole) {
    return <Navigate to={role ? `/login/${role}` : "/login"} replace />;
  }

  return children;
};

export default ProtectedRoute;