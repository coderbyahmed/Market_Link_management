const TOKEN_KEY = "marketlink_token";
const USER_KEY = "marketlink_user";
const RESET_EMAIL_KEY = "marketlink_reset_email";
const RESET_TOKEN_KEY = "marketlink_reset_token";
const OTP_EXPIRY_KEY = "marketlink_otp_expiry";

const OTP_VALIDITY_MINUTES = 5;

const saveAuth = ({ token, user }) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

const getToken = () => localStorage.getItem(TOKEN_KEY);

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
};

const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const updateStoredUser = (partial) => {
  const user = getUser();

  if (!user) return null;

  const nextUser = { ...user, ...partial };
  localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  return nextUser;
};

const saveOtpExpiry = (expiresAt) => {
  sessionStorage.setItem(OTP_EXPIRY_KEY, String(expiresAt));
};

const getOtpExpiry = () => {
  const value = sessionStorage.getItem(OTP_EXPIRY_KEY);
  return value ? Number(value) : null;
};

const clearOtpExpiry = () => {
  sessionStorage.removeItem(OTP_EXPIRY_KEY);
};

const saveResetVerification = ({ email, resetToken }) => {
  if (email) {
    sessionStorage.setItem(RESET_EMAIL_KEY, email);
  }
  if (resetToken) {
    sessionStorage.setItem(RESET_TOKEN_KEY, resetToken);
  }
};

const getResetVerification = () => ({
  email: sessionStorage.getItem(RESET_EMAIL_KEY),
  resetToken: sessionStorage.getItem(RESET_TOKEN_KEY),
});

const clearResetVerification = () => {
  sessionStorage.removeItem(RESET_EMAIL_KEY);
  sessionStorage.removeItem(RESET_TOKEN_KEY);
  sessionStorage.removeItem(OTP_EXPIRY_KEY);
};

export {
  saveAuth,
  getToken,
  getUser,
  clearAuth,
  updateStoredUser,
  saveOtpExpiry,
  getOtpExpiry,
  clearOtpExpiry,
  saveResetVerification,
  getResetVerification,
  clearResetVerification,
  OTP_VALIDITY_MINUTES,
};