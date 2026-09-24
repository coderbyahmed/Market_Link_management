import { FaUsers, FaShoppingBasket, FaBox } from "react-icons/fa";
import { GiFarmTractor } from "react-icons/gi";
import StatCard from "./StatCard.jsx";

const stats = [
  {
    title: "Total Users",
    value: "1,248",
    icon: FaUsers,
    accent: "bg-brand-100 text-brand-700 dark:bg-brand-900/40",
    trend: "+2.4%",
  },
  {
    title: "Total Farmers",
    value: "320",
    icon: GiFarmTractor,
    accent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40",
    trend: "+1.8%",
  },
  {
    title: "Total Customers",
    value: "928",
    icon: FaShoppingBasket,
    accent: "bg-amber-100 text-amber-700 dark:bg-amber-900/40",
    trend: "+3.2%",
  },
  {
    title: "Total Products",
    value: "586",
    icon: FaBox,
    accent: "bg-sky-100 text-sky-700 dark:bg-sky-900/40",
    trend: "+5.1%",
  },
];

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;