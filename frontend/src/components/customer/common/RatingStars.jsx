import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const RatingStars = ({ rating = 0, size = "text-sm" }) => {
  const normalized = Math.max(0, Math.min(5, Number(rating) || 0));
  const full = Math.floor(normalized);
  const half = normalized - full >= 0.4 && normalized - full < 0.9;

  const renderStar = (index) => {
    if (index < full) {
      return <FaStar key={index} className={`${size} text-amber-400`} />;
    }

    if (half && index === full) {
      return <FaStarHalfAlt key={index} className={`${size} text-amber-400`} />;
    }

    return <FaRegStar key={index} className={`${size} text-amber-300`} />;
  };

  return (
    <span className="inline-flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map(renderStar)}
    </span>
  );
};

export default RatingStars;