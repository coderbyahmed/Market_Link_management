import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { destroySession } from "./useSessionGuard.js";

const useLogout = (role = "admin") => {
  const navigate = useNavigate();

  const logout = useCallback(() => {
    destroySession();
    navigate(`/login/${role}`, { state: { logout: true }, replace: true });
  }, [navigate, role]);

  return logout;
};

export default useLogout;
