import FarmerStatCard from "../dashboard/FarmerStatCard.jsx";
import {
  FaBox,
  FaCheckCircle,
  FaBan,
  FaClock,
  FaHourglassHalf,
} from "react-icons/fa";

const ProductStats = ({ products, pendingRequests }) => {
  const total = products.length;
  const available = products.filter(
    (product) => product.availability === "available"
  ).length;
  const soldOut = products.filter(
    (product) => product.availability === "sold_out"
  ).length;
  const unavailable = products.filter(
    (product) => product.availability === "unavailable"
  ).length;

  const stats = [
    { title: "Total Products", value: total, icon: FaBox },
    {
      title: "Available",
      value: available,
      icon: FaCheckCircle,
      accent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40",
    },
    {
      title: "Sold Out",
      value: soldOut,
      icon: FaBan,
      accent: "bg-amber-100 text-amber-700 dark:bg-amber-900/40",
    },
    {
      title: "Temporarily Unavailable",
      value: unavailable,
      icon: FaClock,
      accent: "bg-rose-100 text-rose-700 dark:bg-rose-900/40",
    },
    {
      title: "Pending Requests",
      value: pendingRequests,
      icon: FaHourglassHalf,
      accent: "bg-sky-100 text-sky-700 dark:bg-sky-900/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat) => (
        <FarmerStatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};

export default ProductStats;
