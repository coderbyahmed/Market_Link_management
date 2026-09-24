import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GiSeedling } from "react-icons/gi";
import AdminNavigation from "../navigation/AdminNavigation.jsx";

const AdminSidebar = ({
  variant = "desktop",
  collapsed = false,
  onToggle = () => {},
  onNavigate = () => {},
}) => {
  const isDesktop = variant === "desktop";
  const iconsOnly = isDesktop && collapsed;

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-stone-200 px-4 dark:border-stone-800">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white shadow-sm">
            <GiSeedling className="h-5 w-5" />
          </span>
          {!iconsOnly && (
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-semibold tracking-tight text-stone-900 dark:text-white">
                Market<span className="text-brand-500">Link</span>
              </p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-stone-400">
                Admin Panel
              </p>
            </div>
          )}
        </div>
      </div>

      <AdminNavigation collapsed={iconsOnly} onNavigate={onNavigate} />

      <div className="flex shrink-0 items-center justify-between border-t border-stone-200 p-4 dark:border-stone-800">
        {!iconsOnly ? (
          <p className="text-xs text-stone-400 dark:text-stone-500">v1.0.0</p>
        ) : (
          <span className="mx-auto" />
        )}
        {isDesktop && (
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-stone-100 hover:text-brand-700 dark:hover:bg-stone-800"
          >
            {collapsed ? (
              <FaChevronRight className="h-4 w-4" />
            ) : (
              <FaChevronLeft className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;