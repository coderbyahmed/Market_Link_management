import { FaShoppingCart, FaClock, FaCheckCircle, FaWallet, FaChartLine, FaBoxOpen } from "react-icons/fa";
import FarmerStatCard from "../dashboard/FarmerStatCard.jsx";
import { formatMoney } from "./data/mockReportOrders.js";

const ReportSummary = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <FarmerStatCard
        title="Total Orders"
        value={summary.totalOrders}
        icon={FaShoppingCart}
        accent="bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-400"
      />
      <FarmerStatCard
        title="Pending Orders"
        value={summary.pendingOrders}
        icon={FaClock}
        accent="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
      />
      <FarmerStatCard
        title="Completed Orders"
        value={summary.completedOrders}
        icon={FaCheckCircle}
        accent="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
      />
      <FarmerStatCard
        title="Revenue Summary"
        value={formatMoney(summary.revenue)}
        icon={FaWallet}
        accent="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
      />
      <FarmerStatCard
        title="Avg Order Value"
        value={formatMoney(summary.avgOrderValue)}
        icon={FaChartLine}
        accent="bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400"
      />
      <FarmerStatCard
        title="Units Sold"
        value={summary.unitsSold}
        icon={FaBoxOpen}
        accent="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
      />
    </div>
  );
};

export default ReportSummary;