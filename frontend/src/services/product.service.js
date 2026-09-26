import api, { getApiErrorMessage } from "./api.js";

const getProducts = async () => {
  try {
    const response = await api.get("/api/farmer/products");
    return response.data?.data ?? [];
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const getProduct = async (id) => {
  try {
    const response = await api.get(`/api/farmer/products/${id}`);
    return response.data?.data ?? null;
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const createProduct = async (values) => {
  try {
    const response = await api.post("/api/farmer/products", values);
    return response.data?.data ?? null;
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const updateProduct = async (id, values) => {
  try {
    const response = await api.put(`/api/farmer/products/${id}`, values);
    return response.data?.data ?? null;
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const deleteProduct = async (id) => {
  try {
    await api.delete(`/api/farmer/products/${id}`);
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const updateAvailability = async (id, availability) => {
  try {
    const response = await api.patch(`/api/farmer/products/${id}/availability`, {
      availability,
    });
    return response.data?.data ?? null;
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const getProductRequests = async () => {
  try {
    const response = await api.get("/api/farmer/products/requests");
    return response.data?.data ?? [];
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const resubmitRequest = async (productId) => {
  try {
    const response = await api.patch(`/api/farmer/products/${productId}/resubmit`);
    return response.data?.data ?? null;
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const uploadProductImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post("/api/farmer/products/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data?.data ?? null;
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const getWeeklyStock = async () => {
  try {
    const response = await api.get("/api/farmer/products/weekly-stock");
    return response.data?.data ?? [];
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const addWeeklyStockItem = async (values) => {
  try {
    const response = await api.post("/api/farmer/products/weekly-stock", values);
    return response.data?.data ?? [];
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const updateWeeklyStockItem = async (id, values) => {
  try {
    const response = await api.put(
      `/api/farmer/products/weekly-stock/${id}`,
      values
    );
    return response.data?.data ?? [];
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const toggleWeeklyStockItem = async (id, enabled) => {
  try {
    const response = await api.patch(
      `/api/farmer/products/weekly-stock/${id}/toggle`,
      { enabled }
    );
    return response.data?.data ?? [];
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const removeWeeklyStockItem = async (id) => {
  try {
    const response = await api.delete(`/api/farmer/products/weekly-stock/${id}`);
    return response.data?.data ?? [];
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const saveWeeklyStock = async (items) => {
  try {
    const response = await api.put("/api/farmer/products/weekly-stock", { items });
    return response.data?.data ?? [];
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

export {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateAvailability,
  getProductRequests,
  resubmitRequest,
  uploadProductImage,
  getWeeklyStock,
  addWeeklyStockItem,
  updateWeeklyStockItem,
  toggleWeeklyStockItem,
  removeWeeklyStockItem,
  saveWeeklyStock,
};