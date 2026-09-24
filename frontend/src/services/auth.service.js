import api from "./api.js";

const getErrorMessage = (error) => {
  const backendMessage = error?.response?.data?.message;

  if (typeof backendMessage === "string" && backendMessage.trim()) {
    return backendMessage;
  }

  if (!error?.response) {
    return "Unable to connect to server. Please try again.";
  }

  return "Something went wrong. Please try again.";
};

const login = async ({ email, password }) => {
  try {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data?.data ?? null;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

const forgotPassword = async ({ email, role }) => {
  try {
    await api.post("/api/auth/forgot-password", { email, role });
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

const verifyOtp = async ({ email, otp }) => {
  try {
    const response = await api.post("/api/auth/verify-otp", { email, otp });
    return response.data?.data ?? null;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

const cancelOtp = async ({ email }) => {
  try {
    await api.post("/api/auth/cancel-otp", { email });
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

const resetPassword = async ({ email, resetToken, newPassword }) => {
  try {
    await api.post("/api/auth/reset-password", { email, resetToken, newPassword });
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export { login, forgotPassword, verifyOtp, cancelOtp, resetPassword };