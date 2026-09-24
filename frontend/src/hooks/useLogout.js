import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../utils/auth.js";

const useLogout = () => {
  const navigate = useNavigate();

  const logout = useCallback(() => {
    clearAuth();
    navigate("/login/admin", { state: { logout: true }, replace: true });
  }, [navigate]);

  return logout;
};

export default useLogout;