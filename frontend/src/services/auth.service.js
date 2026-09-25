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

const registerCustomer = async ({
  name,
  email,
  phone,
  password,
  confirmPassword,
}) => {
  try {
    const response = await api.post("/api/auth/customer/register", {
      name,
      email,
      phone,
      password,
      confirmPassword,
    });
    return response.data?.data ?? null;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

const loginCustomer = async ({ email, password }) => {
  try {
    const response = await api.post("/api/auth/customer/login", {
      email,
      password,
    });
    return response.data?.data ?? null;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
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

const verifyOtp = async ({ email, otp, role }) => {
  try {
    const response = await api.post("/api/auth/verify-otp", { email, otp, role });
    return response.data?.data ?? null;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

const cancelOtp = async ({ email, role }) => {
  try {
    await api.post("/api/auth/cancel-otp", { email, role });
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

const resetPassword = async ({ email, resetToken, newPassword, role }) => {
  try {
    await api.post("/api/auth/reset-password", {
      email,
      resetToken,
      newPassword,
      role,
    });
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export {
  registerCustomer,
  loginCustomer,
  login,
  forgotPassword,
  verifyOtp,
  cancelOtp,
  resetPassword,
};