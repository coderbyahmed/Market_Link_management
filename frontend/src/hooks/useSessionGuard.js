import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../utils/auth.js";

const SESSION_KEY = "marketlink_session";

/**
 * Initializes a new session on login.
 * Call this after successful authentication.
 */
export const initSession = () => {
  const sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  sessionStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
};

/**
 * Checks if a valid session exists.
 */
export const hasValidSession = () => {
  return sessionStorage.getItem(SESSION_KEY) !== null;
};

/**
 * Clears the current session.
 */
export const destroySession = () => {
  sessionStorage.removeItem(SESSION_KEY);
  clearAuth();
};

/**
 * Hook to guard routes against browser back/forward navigation.
 * On popstate (back/forward), destroys session and redirects to login.
 * 
 * @param {Object} options
 * @param {string} options.loginPath - Path to redirect on session destroy (default: "/login")
 * @param {boolean} options.enabled - Enable/disable the guard (default: true)
 */
export const useSessionGuard = ({ loginPath = "/login", enabled = true } = {}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!enabled) return;

    // Verify session on mount
    if (!hasValidSession()) {
      navigate(loginPath, { replace: true });
      return;
    }

    const handlePopState = () => {
      // Browser back/forward button pressed
      destroySession();
      navigate(loginPath, { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate, loginPath, enabled]);

  // Expose session helpers for manual use (e.g., logout button)
  return {
    initSession,
    destroySession,
    hasValidSession,
  };
};

export default useSessionGuard;