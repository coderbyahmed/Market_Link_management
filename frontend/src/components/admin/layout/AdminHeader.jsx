import { Badge, Popover } from "antd";
import { FaBars, FaBell, FaMoon, FaSun } from "react-icons/fa";
import AdminProfileMenu from "../profile/AdminProfileMenu.jsx";

const notifications = [
  { title: "New farmer registered: Green Valley Farm.", time: "2 minutes ago" },
  { title: "3 products awaiting approval.", time: "1 hour ago" },
  { title: "New customer order placed.", time: "3 hours ago" },
];

const currentDate = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const AdminHeader = ({ onToggleSidebar, theme, onToggleTheme }) => {
  const bellContent = (
    <div className="w-72">
      <p className="border-b border-stone-100 px-3 py-2 text-sm font-semibold text-stone-800 dark:border-stone-800 dark:text-stone-100">
        Notifications
      </p>
      <ul className="max-h-72 divide-y divide-stone-100 overflow-y-auto dark:divide-stone-800">
        {notifications.map((n, i) => (
          <li key={i} className="px-3 py-2.5">
            <p className="text-sm text-stone-700 dark:text-stone-300">{n.title}</p>
            <p className="mt-0.5 text-xs text-stone-400 dark:text-stone-500">{n.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-stone-200 bg-white/85 px-4 backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/85 sm:px-6">
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-600 transition-colors hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800 lg:hidden"
      >
        <FaBars className="h-4.5 w-4.5" />
      </button>

      <div className="min-w-0">
        <h2 className="truncate font-display text-lg font-semibold tracking-tight text-stone-900 dark:text-white">
          Admin Panel
        </h2>
        <p className="hidden text-xs text-stone-400 dark:text-stone-500 sm:block">
          MarketLink Management
        </p>
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <span className="mr-2 hidden text-sm text-stone-500 dark:text-stone-400 md:block">
          {currentDate}
        </span>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-600 transition-colors hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
        >
          {theme === "dark" ? <FaSun className="h-4 w-4" /> : <FaMoon className="h-4 w-4" />}
        </button>

        <Popover content={bellContent} trigger="click" placement="bottomRight">
          <button
            type="button"
            aria-label="Notifications"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-600 transition-colors hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
          >
            <Badge count={notifications.length} size="small" offset={[2, -2]}>
              <FaBell className="h-4 w-4" />
            </Badge>
          </button>
        </Popover>

        <AdminProfileMenu />
      </div>
    </header>
  );
};

export default AdminHeader;