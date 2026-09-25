import { Progress } from "antd";
import { FaStar } from "react-icons/fa";
import FarmerStatCard from "../dashboard/FarmerStatCard.jsx";

const ReviewSummary = ({ reviews }) => {
  const total = reviews.length;
  const avg =
    total > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
      : "0.0";

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return { star, count, percentage };
  });

  const answered = reviews.filter((r) => r.response).length;
  const unanswered = total - answered;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <FarmerStatCard
          title="Average Rating"
          value={avg}
          icon={FaStar}
          accent="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
        />
        <FarmerStatCard
          title="Total Reviews"
          value={total}
          icon={FaStar}
          accent="bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-400"
        />
        <FarmerStatCard
          title="5 Star"
          value={distribution[0].count}
          icon={FaStar}
          accent="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
        />
        <FarmerStatCard
          title="4 Star"
          value={distribution[1].count}
          icon={FaStar}
          accent="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
        />
        <FarmerStatCard
          title="3 Star"
          value={distribution[2].count}
          icon={FaStar}
          accent="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
        />
        <FarmerStatCard
          title="1-2 Star"
          value={distribution[3].count + distribution[4].count}
          icon={FaStar}
          accent="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
        />
      </div>

      <div className="rounded-2xl border border-stone-200/70 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
        <h3 className="font-display text-base font-semibold text-stone-900 dark:text-white">
          Rating Distribution
        </h3>
        <div className="mt-4 space-y-3">
          {distribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-3">
              <span className="w-10 text-sm font-medium text-stone-600 dark:text-stone-400">
                {star}★
              </span>
              <Progress
                percent={percentage}
                strokeWidth={10}
                showInfo={false}
                size="small"
                status={percentage > 0 ? "normal" : undefined}
                className="flex-1"
              />
              <span className="w-16 text-sm text-stone-600 dark:text-stone-400 text-right">
                {count}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Answered
            </p>
            <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">
              {answered}
            </p>
          </div>
          <div className="rounded-xl bg-amber-50 p-3 dark:bg-amber-950">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              Unanswered
            </p>
            <p className="text-2xl font-bold text-amber-800 dark:text-amber-300">
              {unanswered}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;