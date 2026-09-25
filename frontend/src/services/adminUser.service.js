import api, { getApiErrorMessage } from "./api.js";

const getAllUsers = async () => {
  try {
    const response = await api.get("/api/admin/users");
    return response.data?.data ?? [];
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const getFarmers = async () => {
  try {
    const response = await api.get("/api/admin/users/farmers");
    return response.data?.data ?? [];
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const getUserById = async (userId) => {
  try {
    const response = await api.get(`/api/admin/users/${userId}`);
    return response.data?.data ?? null;
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const approveFarmer = async (userId) => {
  try {
    const response = await api.patch(`/api/admin/users/${userId}/approve`);
    return response.data?.data ?? null;
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const deactivateUser = async (userId) => {
  try {
    const response = await api.patch(`/api/admin/users/${userId}/deactivate`);
    return response.data?.data ?? null;
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const activateUser = async (userId) => {
  try {
    const response = await api.patch(`/api/admin/users/${userId}/activate`);
    return response.data?.data ?? null;
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

export { getAllUsers, getFarmers, getUserById, approveFarmer, deactivateUser, activateUser };