import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaThLarge,
  FaUsers,
  FaBox,
  FaClipboardList,
  FaTags,
  FaStar,
  FaChartBar,
  FaCog,
  FaChevronDown,
} from "react-icons/fa";

const navItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: FaThLarge },
  {
    label: "Users",
    icon: FaUsers,
    children: ["All Users", "Farmers", "Customers"],
  },
  {
    label: "Products",
    icon: FaBox,
    children: ["All Products", "Pending Products", "Approved Products"],
  },
  { label: "Orders", icon: FaClipboardList, soon: true },
  { label: "Categories", icon: FaTags, soon: true },
  { label: "Reviews", icon: FaStar, soon: true },
  { label: "Reports", icon: FaChartBar, soon: true },
  { label: "Settings", icon: FaCog, soon: true },
];

const soonBadge = (
  <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-stone-400 dark:bg-stone-800 dark:text-stone-500">
    Soon
  </span>
);

const AdminNavigation = ({ collapsed = false, onNavigate = () => {} }) => {
  const [openGroups, setOpenGroups] = useState({ Users: true, Products: false });

  const toggleGroup = (label) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? "bg-brand-700 text-white shadow-sm"
        : "text-stone-600 hover:bg-brand-50 hover:text-brand-800 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-brand-400"
    }`;

  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {navItems.map((item) => {
        if (item.to) {
          return (
            <NavLink
              key={item.label}
              to={item.to}
              end
              className={linkClass}
              onClick={onNavigate}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        }

        if (item.children) {
          const open = Boolean(openGroups[item.label]);
          return (
            <div key={item.label}>
              <button
                type="button"
                onClick={() => toggleGroup(item.label)}
                className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-brand-50 hover:text-brand-800 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-brand-400"
              >
                <span className="flex items-center gap-3">
                  <item.icon className="h-4.5 w-4.5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </span>
                {!collapsed && (
                  <FaChevronDown
                    className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
                  />
                )}
              </button>
              {!collapsed && open && (
                <div className="ml-5 mt-1 space-y-1 border-l border-stone-200 pl-3 dark:border-stone-800">
                  {item.children.map((child) => (
                    <span
                      key={child}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-stone-500 dark:text-stone-400"
                    >
                      {child}
                      {soonBadge}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        }

        return (
          <button
            key={item.label}
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-brand-50 hover:text-brand-800 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-brand-400"
          >
            <item.icon className="h-4.5 w-4.5 shrink-0" />
            {!collapsed && (
              <span className="flex flex-1 items-center justify-between">
                {item.label}
                {soonBadge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default AdminNavigation;