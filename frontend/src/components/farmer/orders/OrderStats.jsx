import {
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaBoxOpen,
  FaFlagCheckered,
  FaWallet,
} from "react-icons/fa";
import FarmerStatCard from "../dashboard/FarmerStatCard.jsx";
import { formatMoney } from "./data/orderOptions.js";

const OrderStats = ({ orders }) => {
  const total = orders.length;
  const pending = orders.filter((order) => order.status === "pending").length;
  const accepted = orders.filter((order) => order.status === "accepted").length;
  const ready = orders.filter((order) => order.status === "ready").length;
  const completed = orders.filter(
    (order) => order.status === "completed"
  ).length;

  const revenue = orders
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <FarmerStatCard
        title="Total Orders"
        value={total}
        icon={FaClipboardList}
        accent="bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-400"
      />
      <FarmerStatCard
        title="Pending Orders"
        value={pending}
        icon={FaClock}
        accent="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
      />
      <FarmerStatCard
        title="Accepted Orders"
        value={accepted}
        icon={FaCheckCircle}
        accent="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
      />
      <FarmerStatCard
        title="Ready for Pickup"
        value={ready}
        icon={FaBoxOpen}
        accent="bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400"
      />
      <FarmerStatCard
        title="Completed Orders"
        value={completed}
        icon={FaFlagCheckered}
        accent="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
      />
      <FarmerStatCard
        title="Revenue Summary"
        value={formatMoney(revenue)}
        icon={FaWallet}
        accent="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
      />
    </div>
  );
};

export default OrderStats;
