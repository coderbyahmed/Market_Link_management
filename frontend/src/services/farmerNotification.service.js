import api, { getApiErrorMessage } from "./api.js";

const getNotifications = async () => {
  try {
    const response = await api.get("/api/farmer/notifications");
    return response.data?.data ?? [];
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const getUnreadCount = async () => {
  try {
    const response = await api.get("/api/farmer/notifications/unread-count");
    return response.data?.data ?? 0;
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const markAsRead = async (id) => {
  try {
    const response = await api.patch(`/api/farmer/notifications/${id}/read`);
    return response.data?.data ?? null;
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const markAllAsRead = async () => {
  try {
    await api.patch("/api/farmer/notifications/read-all");
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const deleteNotification = async (id) => {
  try {
    await api.delete(`/api/farmer/notifications/${id}`);
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

const deleteAllNotifications = async () => {
  try {
    await api.delete("/api/farmer/notifications");
  } catch (error) {
    throw new Error(getApiErrorMessage(error), { cause: error });
  }
};

export {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
};