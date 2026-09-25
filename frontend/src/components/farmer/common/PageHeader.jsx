const PageHeader = ({ title, description, actions }) => {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-stone-900 dark:text-white">
          {title}
        </h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
          {description}
        </p>
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
};

export default PageHeader;
