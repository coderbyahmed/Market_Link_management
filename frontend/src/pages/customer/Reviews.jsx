import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Popconfirm, Skeleton } from "antd";
import { FaStar, FaPen, FaTrashAlt } from "react-icons/fa";
import EmptyState from "../../components/farmer/common/EmptyState.jsx";
import RatingStars from "../../components/customer/common/RatingStars.jsx";
import ReviewModal from "../../components/customer/reviews/ReviewModal.jsx";
import { showSuccess, showError } from "../../components/common/feedback/MessageProvider.jsx";
import {
  getUserReviews,
  deleteReview,
} from "../../services/customerReview.service.js";
import useCustomerProducts from "../../hooks/useCustomerProducts.js";

const Reviews = () => {
  const navigate = useNavigate();
  const { products } = useCustomerProducts();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editTarget, setEditTarget] = useState(null);

  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products]
  );

  const load = () => {
    getUserReviews()
      .then((list) => {
        setReviews(list);
        setError("");
      })
      .catch((loadError) => {
        setError(loadError.message || "Unable to load your reviews");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      showSuccess("Review deleted");
      load();
    } catch (deleteError) {
      showError(deleteError.message || "Unable to delete review");
    }
  };

  const handleEdit = (review) => {
    const product = productMap.get(review.productId);

    if (!product) {
      showError("This product is no longer available");
      return;
    }

    setEditTarget({ review, product });
  };

  const handleCloseEdit = () => {
    setEditTarget(null);
    load();
  };

  const formattedDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="bg-cream/40">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div>
          <h1 className="flex items-center gap-3 font-display text-3xl font-semibold tracking-tight text-stone-900">
            <FaStar className="h-7 w-7 text-amber-400" />
            My Reviews
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Everything you've shared about the products you've received.
          </p>
        </div>

        <div className="mt-8">
          {loading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : error ? (
            <EmptyState
              title="Could not load your reviews"
              description={error}
              actionLabel="Try Again"
              onAction={load}
            />
          ) : reviews.length === 0 ? (
            <EmptyState
              title="No reviews yet"
              description="After you receive your order, you can rate and review each product. Your reviews will appear here."
              actionLabel="Browse Marketplace"
              onAction={() => navigate("/customer/products")}
            />
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => {
                const product = productMap.get(review.productId);
                return (
                  <div
                    key={review.id}
                    className="rounded-2xl border border-stone-200/80 bg-white p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {product && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-9 w-9 rounded-lg object-cover"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-stone-900">
                              {product?.name || `Product #${review.productId}`}
                            </p>
                            <p className="text-xs text-stone-500">
                              Reviewed on {formattedDate(review.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <RatingStars rating={review.rating} />
                        </div>
                        {review.text && (
                          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">
                            {review.text}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(review)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-600 transition-colors hover:border-brand-400 hover:text-brand-700"
                        >
                          <FaPen className="h-3 w-3" />
                          Edit
                        </button>
                        <Popconfirm
                          title="Delete this review?"
                          description="This cannot be undone."
                          okText="Delete"
                          cancelText="Cancel"
                          okButtonProps={{ danger: true }}
                          onConfirm={() => handleDelete(review.id)}
                        >
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-600 transition-colors hover:border-red-300 hover:text-red-600"
                          >
                            <FaTrashAlt className="h-3 w-3" />
                            Delete
                          </button>
                        </Popconfirm>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ReviewModal
        open={editTarget !== null}
        onClose={handleCloseEdit}
        product={
          editTarget?.product || { name: "", image: "", unit: "", farmer: {} }
        }
        existingReview={editTarget?.review || null}
      />
    </div>
  );
};

export default Reviews;