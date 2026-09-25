import { getUser } from "../../../utils/auth.js";
import FarmerDashboardStats from "./FarmerDashboardStats.jsx";

const FarmerDashboardContent = () => {
  const user = getUser();
  const farmerName = user?.name || "Farmer";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-stone-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Welcome back, {farmerName}. Here is what&apos;s happening on your
          farm today.
        </p>
      </div>
      <FarmerDashboardStats />
    </div>
  );
};

export default FarmerDashboardContent;
