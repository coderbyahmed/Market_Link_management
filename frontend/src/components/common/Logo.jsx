import { Link } from "react-router-dom";
import { GiSeedling } from "react-icons/gi";

const Logo = ({ to = "/", light = false, className = "" }) => {
  return (
    <Link to={to} className={`group inline-flex items-center gap-2 ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700 text-white shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5">
        <GiSeedling className="h-5 w-5" />
      </span>
      <span
        className={`font-display text-xl font-semibold tracking-tight ${
          light ? "text-white" : "text-stone-900"
        }`}
      >
        Market<span className="text-brand-500">Link</span>
      </span>
    </Link>
  );
};

export default Logo;