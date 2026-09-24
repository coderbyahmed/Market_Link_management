import { FaUserPlus, FaSignInAlt, FaKey } from "react-icons/fa";

const activityItems = [
  {
    label: "Account Created",
    value: "September 20, 2026",
    icon: FaUserPlus,
    accent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  },
  {
    label: "Last Login",
    value: "Today, 08:15 PM",
    icon: FaSignInAlt,
    accent: "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300",
  },
  {
    label: "Last Password Change",
    value: "September 20, 2026",
    icon: FaKey,
    accent: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
];

const AdminActivity = () => {
  return (
    <div className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <h2 className="font-display text-lg font-semibold tracking-tight text-stone-900 dark:text-white">
        Account Activity
      </h2>

      <ul className="mt-5 space-y-3">
        {activityItems.map(({ label, value, icon: Icon, accent }) => (
          <li
            key={label}
            className="flex items-center gap-4 rounded-xl border border-stone-200 p-4 dark:border-stone-800"
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent}`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-stone-400 dark:text-stone-500">
                {label}
              </p>
              <p className="mt-0.5 truncate text-sm font-medium text-stone-800 dark:text-stone-200">
                {value}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminActivity;