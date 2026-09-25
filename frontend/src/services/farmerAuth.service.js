import api, { getApiErrorMessage } from "./api.js";

const register = async ({
  name,
  email,
  phone,
  farmSpecialization,
  password,
}) => {
  try {
    const response = await api.post("/api/auth/farmer/register", {
      name,
      email,
      phone,
      farmSpecialization,
      password,
    });
    return response.data?.data ?? null;
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const login = async ({ email, password }) => {
  try {
    const response = await api.post("/api/auth/farmer/login", {
      email,
      password,
    });
    return response.data?.data ?? null;
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const forgotPassword = async ({ email }) => {
  try {
    await api.post("/api/auth/farmer/forgot-password", { email });
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const verifyOtp = async ({ email, otp }) => {
  try {
    const response = await api.post("/api/auth/farmer/verify-otp", {
      email,
      otp,
    });
    return response.data?.data ?? null;
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const cancelOtp = async ({ email }) => {
  try {
    await api.post("/api/auth/farmer/cancel-otp", { email });
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const resetPassword = async ({ email, resetToken, newPassword }) => {
  try {
    await api.post("/api/auth/farmer/reset-password", {
      email,
      resetToken,
      newPassword,
    });
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

export {
  register,
  login,
  forgotPassword,
  verifyOtp,
  cancelOtp,
  resetPassword,
};