import { Link } from "react-router-dom";
import { Empty, Spin } from "antd";
import { FaChevronRight } from "react-icons/fa";
import NotificationItem from "./NotificationItem.jsx";

const NotificationDropdown = ({ notifications, loading }) => {
  return (
    <div className="w-80 max-w-[92vw]">
      <p className="border-b border-stone-100 px-4 py-3 text-sm font-semibold text-stone-800 dark:border-stone-800 dark:text-stone-100">
        Notifications
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Spin size="small" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="px-4 py-8">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-sm text-stone-500 dark:text-stone-400">
                No notifications yet
              </span>
            }
          />
        </div>
      ) : (
        <ul className="max-h-72 divide-y divide-stone-100 overflow-y-auto dark:divide-stone-800">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              compact
            />
          ))}
        </ul>
      )}

      <Link
        to="/admin/notifications"
        className="flex items-center justify-between border-t border-stone-100 px-4 py-3 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50 dark:border-stone-800 dark:text-brand-300 dark:hover:bg-stone-800"
      >
        View All Notifications
        <FaChevronRight className="h-3 w-3" />
      </Link>
    </div>
  );
};

export default NotificationDropdown;