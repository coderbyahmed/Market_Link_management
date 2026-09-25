import { useEffect, useState } from "react";
import { Empty, Popconfirm, Spin, Button } from "antd";
import { FaTrash } from "react-icons/fa";
import {
  getNotifications,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../../../services/farmerNotification.service.js";
import FarmerNotificationItem from "./FarmerNotificationItem.jsx";
import {
  showSuccess,
  showError,
} from "../../common/feedback/MessageProvider.jsx";

const FarmerNotificationsContent = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getNotifications();
        setNotifications(list);
        await markAllAsRead();
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      } catch (error) {
        showError(error.message || "Unable to load notifications");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      showSuccess("Notification deleted successfully.");
    } catch (error) {
      showError(error.message || "Unable to delete notification");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAll = async () => {
    try {
      setDeletingAll(true);
      await deleteAllNotifications();
      setNotifications([]);
      showSuccess("All notifications deleted successfully.");
    } catch (error) {
      showError(error.message || "Unable to delete notifications");
    } finally {
      setDeletingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-stone-900 dark:text-white">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Orders, product approvals and farm updates in one place.
          </p>
        </div>

        {notifications.length > 0 && (
          <Popconfirm
            title="Delete all notifications?"
            description="This action cannot be undone."
            onConfirm={handleDeleteAll}
            okText="Delete All"
            okButtonProps={{ danger: true }}
          >
            <Button danger loading={deletingAll} icon={<FaTrash />}>
              Delete All
            </Button>
          </Popconfirm>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-stone-200/70 bg-white py-20 shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <Spin size="small" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-2xl border border-stone-200/70 bg-white px-6 py-20 shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={null} />
          <p className="mt-4 text-center text-sm font-medium text-stone-700 dark:text-stone-300">
            No notifications yet
          </p>
          <p className="mt-1 text-center text-sm text-stone-500 dark:text-stone-400">
            You&apos;re all caught up!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <FarmerNotificationItem
              key={notification.id}
              notification={notification}
              onDelete={() => handleDelete(notification.id)}
              deleting={deletingId === notification.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmerNotificationsContent;
