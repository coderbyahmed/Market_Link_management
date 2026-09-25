import { Rate, Tag, Button } from "antd";
import { FaComments, FaEdit } from "react-icons/fa";
import { formatShortDate } from "../../../utils/date.js";

const ReviewList = ({
  reviews,
  onView,
  onRespond,
}) => {
  const initials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="space-y-3">
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-14 text-center rounded-2xl border border-stone-200/70 bg-white dark:border-stone-800 dark:bg-stone-900">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500">
            <FaComments className="h-7 w-7" />
          </span>
          <p className="mt-4 text-sm font-semibold text-stone-700 dark:text-stone-300">
            No reviews found
          </p>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Customer reviews will appear here.
          </p>
        </div>
      ) : (
        reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-2xl border border-stone-200/70 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-400 shrink-0">
                  {initials(review.customer.name)}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-stone-800 dark:text-stone-200 truncate">
                      {review.customer.name}
                    </p>
                    <Rate
                      disabled
                      defaultValue={review.rating}
                      className="text-amber-500"
                      size={18}
                    />
                    <Tag
                      size="small"
                      color={review.response ? "green" : "gold"}
                      className="!m-0 !rounded-full"
                    >
                      {review.response ? "Answered" : "Unanswered"}
                    </Tag>
                  </div>
                  <p className="mt-1 text-sm text-stone-600 dark:text-stone-400 line-clamp-2">
                    {review.comment}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
                    <span>{review.productName}</span>
                    <span>{formatShortDate(review.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onView(review)}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  variant={review.response ? "secondary" : "primary"}
                  onClick={() => onRespond(review)}
                >
                  {review.response ? (
                    <>
                      <FaEdit className="h-3.5 w-3.5" /> Edit Response
                    </>
                  ) : (
                    <>
                      <FaComments className="h-3.5 w-3.5" /> Respond
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;