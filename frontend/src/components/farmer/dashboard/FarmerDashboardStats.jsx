import { FaBox, FaClipboardList, FaWallet, FaStar } from "react-icons/fa";
import FarmerStatCard from "./FarmerStatCard.jsx";

const stats = [
  {
    title: "My Products",
    value: "128",
    icon: FaBox,
    accent: "bg-brand-100 text-brand-700 dark:bg-brand-900/40",
    trend: "+4.2%",
  },
  {
    title: "Total Orders",
    value: "342",
    icon: FaClipboardList,
    accent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40",
    trend: "+6.5%",
  },
  {
    title: "Earnings",
    value: "₹84,250",
    icon: FaWallet,
    accent: "bg-amber-100 text-amber-700 dark:bg-amber-900/40",
    trend: "+3.9%",
  },
  {
    title: "Customer Rating",
    value: "4.8",
    icon: FaStar,
    accent: "bg-sky-100 text-sky-700 dark:bg-sky-900/40",
    trend: "+0.2",
  },
];

const FarmerDashboardStats = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <FarmerStatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};

export default FarmerDashboardStats;
