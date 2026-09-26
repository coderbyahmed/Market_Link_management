import { useEffect, useState } from "react";
import { Avatar, Skeleton } from "antd";
import { FaCheckCircle } from "react-icons/fa";
import EmptyState from "../../farmer/common/EmptyState.jsx";
import RatingStars from "../common/RatingStars.jsx";
import { getProductReviews } from "../../../services/customerReview.service.js";

const ProductReviews = ({ product }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProductReviews(product.id)
      .then((list) => {
        setReviews(list);
        setError("");
      })
      .catch((loadError) => {
        setError(loadError.message || "Unable to load reviews");
      })
      .finally(() => setLoading(false));
  }, [product.id]);

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((review) => review.rating === star).length,
  }));

  const formattedDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <section id="reviews" className="scroll-mt-20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-semibold text-stone-900">
          Reviews
        </h2>
        <span className="text-sm text-stone-500">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </span>
      </div>

      {loading ? (
        <Skeleton active paragraph={{ rows: 3 }} className="mt-6" />
      ) : error ? (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      ) : reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          description="Be the first to share what you thought about this product."
          compact
        />
      ) : (
        <div className="mt-6">
          <div className="mb-8 flex flex-wrap items-center gap-8 rounded-2xl border border-stone-200/80 bg-cream/50 p-6">
            <div className="text-center">
              <p className="font-display text-5xl font-semibold text-brand-800">
                {average.toFixed(1)}
              </p>
              <RatingStars rating={average} size="text-lg" />
              <p className="mt-1 text-xs text-stone-500">
                {reviews.length} {reviews.length === 1 ? "rating" : "ratings"}
              </p>
            </div>
            <div className="flex-1 space-y-1.5">
              {distribution.map(({ star, count }) => {
                const percent = reviews.length
                  ? Math.round((count / reviews.length) * 100)
                  : 0;
                return (
                  <div
                    key={star}
                    className="flex items-center gap-3 text-sm text-stone-600"
                  >
                    <span className="w-8 shrink-0">{star} star</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-200">
                      <div
                        className="h-full rounded-full bg-amber-400"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-8 shrink-0 text-right text-xs text-stone-400">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((review) => {
              const isMine = !review.demo;
              return (
                <div
                  key={review.id}
                  className="rounded-2xl border border-stone-200/80 bg-white p-5"
                >
                  <div className="flex items-center gap-3">
                    <Avatar size={40} src={review.userImage} className="!bg-brand-700">
                      {(review.author || "C").charAt(0).toUpperCase()}
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-stone-800">
                        {review.author}
                        {isMine && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700">
                            <FaCheckCircle className="h-3 w-3" />
                            Yours
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-stone-500">
                        {formattedDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                  <RatingStars rating={review.rating} size="text-sm" className="mt-3" />
                  {review.text && (
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                      {review.text}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductReviews;