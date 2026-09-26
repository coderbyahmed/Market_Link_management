import api, { getApiErrorMessage } from "./api.js";

const getAllProducts = async (params = {}) => {
  try {
    const response = await api.get("/api/admin/products", { params });
    return response.data?.data ?? [];
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const getPendingProducts = async (params = {}) => {
  try {
    const response = await api.get("/api/admin/products/pending", { params });
    return response.data?.data ?? [];
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const getApprovedProducts = async (params = {}) => {
  try {
    const response = await api.get("/api/admin/products/approved", { params });
    return response.data?.data ?? [];
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const getProductById = async (id) => {
  try {
    const response = await api.get(`/api/admin/products/${id}`);
    return response.data?.data ?? null;
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const approveProduct = async (id) => {
  try {
    const response = await api.patch(`/api/admin/products/${id}/approve`);
    return response.data?.data ?? null;
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const rejectProduct = async (id, reason) => {
  try {
    const response = await api.patch(`/api/admin/products/${id}/reject`, {
      reason,
    });
    return response.data?.data ?? null;
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

export {
  getAllProducts,
  getPendingProducts,
  getApprovedProducts,
  getProductById,
  approveProduct,
  rejectProduct,
};