/**
 * Shared empty / no-results state used across the Farmer Panel modules.
 * `icon` accepts any react-icons component.
 */
const EmptyState = ({
  icon: Icon,
  title,
  description,
  action = null,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center px-4 py-14 text-center ${className}`}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500">
        {Icon && <Icon className="h-7 w-7" />}
      </span>
      <p className="mt-4 text-sm font-semibold text-stone-700 dark:text-stone-300">
        {title}
      </p>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
