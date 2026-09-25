import { FaBell, FaTrash } from "react-icons/fa";
import { Button } from "antd";
import {
  formatTimeAgo,
  formatNotificationDateTime,
} from "../../../utils/date.js";

const FarmerNotificationItem = ({
  notification,
  compact = false,
  onDelete,
  deleting = false,
}) => {
  const unread = !notification.isRead;

  if (compact) {
    return (
      <li
        className={`flex gap-3 px-3 py-3 ${
          unread
            ? "bg-brand-50/60 dark:bg-brand-950/40"
            : "bg-white dark:bg-stone-900"
        }`}
      >
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-100">
          <FaBell className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p
              className={`text-sm font-medium ${
                unread
                  ? "text-stone-900 dark:text-white"
                  : "text-stone-700 dark:text-stone-300"
              }`}
            >
              {notification.title}
            </p>
            {unread && (
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-600" />
            )}
          </div>
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
            {notification.message}
          </p>
          <p className="mt-1 text-xs text-stone-400 dark:text-stone-500">
            {formatTimeAgo(notification.createdAt)}
          </p>
        </div>
      </li>
    );
  }

  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${
        unread
          ? "border-brand-200 bg-brand-50/50 dark:border-brand-800 dark:bg-brand-950/40"
          : "border-stone-200/70 bg-white dark:border-stone-800 dark:bg-stone-900"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-100">
          <FaBell className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p
              className={`flex items-center gap-2 text-sm font-semibold ${
                unread
                  ? "text-stone-900 dark:text-white"
                  : "text-stone-800 dark:text-stone-200"
              }`}
            >
              {notification.title}
              {unread && <span className="h-2 w-2 rounded-full bg-brand-600" />}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-stone-400 dark:text-stone-500">
                {formatNotificationDateTime(notification.createdAt)}
              </span>
              {onDelete && (
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<FaTrash className="h-3 w-3" />}
                  loading={deleting}
                  onClick={onDelete}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
            {notification.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FarmerNotificationItem;
