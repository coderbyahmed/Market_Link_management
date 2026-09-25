import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../utils/auth.js";

const useLogout = (role = "admin") => {
  const navigate = useNavigate();

  const logout = useCallback(() => {
    clearAuth();
    navigate(`/login/${role}`, { state: { logout: true }, replace: true });
  }, [navigate, role]);

  return logout;
};

export default useLogout;
