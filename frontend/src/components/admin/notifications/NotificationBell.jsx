import { useCallback, useEffect, useState } from "react";
import { Badge, Popover } from "antd";
import { FaBell } from "react-icons/fa";
import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
} from "../../../services/notification.service.js";
import NotificationDropdown from "./NotificationDropdown.jsx";

const MAX_VISIBLE_NOTIFICATIONS = 5;
const POLL_INTERVAL_MS = 60000;
const NOTIFICATIONS_CHANGED_EVENT = "marketlink:notifications-changed";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refreshCount = useCallback(async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch {
      // ignore background count failures
    }
  }, []);

  const refreshData = async () => {
    const [list, count] = await Promise.all([
      getNotifications(),
      getUnreadCount(),
    ]);
    setNotifications(list.slice(0, MAX_VISIBLE_NOTIFICATIONS));
    setUnreadCount(count);
  };

  const handleOpenChange = async (nextOpen) => {
    setOpen(nextOpen);
    if (!nextOpen) return;

    try {
      setLoading(true);
      await refreshData();
      await markAllAsRead();
      await refreshData();
    } catch {
      // ignore dropdown load failures
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialDelay = window.setTimeout(refreshCount, 0);

    const interval = window.setInterval(refreshCount, POLL_INTERVAL_MS);
    const onChange = () => refreshCount();
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, onChange);

    return () => {
      window.clearTimeout(initialDelay);
      window.clearInterval(interval);
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, onChange);
    };
  }, [refreshCount]);

  return (
    <Popover
      content={<NotificationDropdown notifications={notifications} loading={loading} />}
      trigger="click"
      placement="bottomRight"
      open={open}
      onOpenChange={handleOpenChange}
      styles={{ body: { padding: 0, overflow: "hidden", borderRadius: "1rem" } }}
    >
      <button
        type="button"
        aria-label="Notifications"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-600 transition-colors hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
      >
        <Badge count={unreadCount} size="small" offset={[2, -2]}>
          <FaBell className="h-4 w-4" />
        </Badge>
      </button>
    </Popover>
  );
};

export default NotificationBell;