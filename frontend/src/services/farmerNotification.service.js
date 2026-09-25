import farmerNotificationsData from "../components/farmer/notifications/data/farmerNotificationsData.js";

const STORAGE_KEY = "marketlink_farmer_notifications";

const seedNotifications = () =>
  farmerNotificationsData.map((notification) => ({ ...notification }));

const readAll = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fall through to a fresh seed
  }

  const seeded = seedNotifications();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
};

const persist = (notifications) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  return notifications;
};

const getNotifications = async () => readAll();

const getUnreadCount = async () =>
  readAll().filter((notification) => !notification.isRead).length;

const markAsRead = async (id) => {
  const next = readAll().map((notification) =>
    notification.id === id ? { ...notification, isRead: true } : notification
  );

  persist(next);
  return next.find((notification) => notification.id === id) ?? null;
};

const markAllAsRead = async () => {
  const next = readAll().map((notification) => ({
    ...notification,
    isRead: true,
  }));

  persist(next);
};

const deleteNotification = async (id) => {
  const next = readAll().filter(
    (notification) => notification.id !== id
  );

  persist(next);
};

const deleteAllNotifications = async () => {
  localStorage.removeItem(STORAGE_KEY);
};

export {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
};
