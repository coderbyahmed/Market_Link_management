import DashboardStats from "./DashboardStats.jsx";

const DashboardContent = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-stone-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Welcome back, Admin. Here is what's happening on MarketLink today.
        </p>
      </div>
      <DashboardStats />
    </div>
  );
};

export default DashboardContent;