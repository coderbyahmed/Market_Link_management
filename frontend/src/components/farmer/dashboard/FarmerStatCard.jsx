const FarmerStatCard = ({
  title,
  value,
  icon: Icon,
  accent = "bg-brand-100 text-brand-700",
  trend,
}) => {
  return (
    <div className="group rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-stone-800 dark:bg-stone-900">
      <div className="flex items-center justify-between">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        {trend && (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            {trend}
          </span>
        )}
      </div>
      <p className="mt-4 font-display text-3xl font-semibold tracking-tight text-stone-900 dark:text-white">
        {value}
      </p>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{title}</p>
    </div>
  );
};

export default FarmerStatCard;
