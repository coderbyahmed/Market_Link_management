import {
  FaSeedling,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import FarmerStatCard from "../dashboard/FarmerStatCard.jsx";

const CropListingStats = ({ listings }) => {
  const total = listings.length;
  const published = listings.filter((l) => l.visibility === "published").length;
  const unpublished = listings.filter((l) => l.visibility === "unpublished").length;
  const available = listings.filter((l) => l.availability === "available").length;
  const soldOut = listings.filter((l) => l.availability === "sold_out").length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <FarmerStatCard
        title="Total Listings"
        value={total}
        icon={FaSeedling}
        accent="bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-400"
      />
      <FarmerStatCard
        title="Published"
        value={published}
        icon={FaEye}
        accent="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
      />
      <FarmerStatCard
        title="Unpublished"
        value={unpublished}
        icon={FaEyeSlash}
        accent="bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-400"
      />
      <FarmerStatCard
        title="Available"
        value={available}
        icon={FaCheckCircle}
        accent="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
      />
      <FarmerStatCard
        title="Sold Out"
        value={soldOut}
        icon={FaTimesCircle}
        accent="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
      />
    </div>
  );
};

export default CropListingStats;