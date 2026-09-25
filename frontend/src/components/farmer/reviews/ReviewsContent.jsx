import { useCallback, useEffect, useMemo, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import PageHeader from "../common/PageHeader.jsx";
import Button from "../../common/Button.jsx";
import SearchInput from "../common/SearchInput.jsx";
import FilterBar from "../common/FilterBar.jsx";
import ReviewSummary from "./ReviewSummary.jsx";
import ReviewList from "./ReviewList.jsx";
import ReviewDetailsModal from "./ReviewDetailsModal.jsx";
import ReviewResponseModal from "./ReviewResponseModal.jsx";
import { showSuccess, showError } from "../../common/feedback/MessageProvider.jsx";
import { getReviews, respondToReview, updateResponse } from "../../../services/review.service.js";
import mockProducts from "../products/data/mockProducts.js";

const RATING_OPTIONS = [
  { value: "all", label: "All Reviews" },
  { value: "5", label: "5 Stars" },
  { value: "4", label: "4 Stars" },
  { value: "3", label: "3 Stars" },
  { value: "2", label: "2 Stars" },
  { value: "1", label: "1 Star" },
];

const RESPONSE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "answered", label: "Answered" },
  { value: "unanswered", label: "Unanswered" },
];

const DEFAULT_FILTERS = {
  rating: "all",
  response: "all",
  product: "all",
  sort: "newest",
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "rating_desc", label: "Highest Rated" },
  { value: "rating_asc", label: "Lowest Rated" },
];

const ReviewsContent = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [detailsReview, setDetailsReview] = useState(null);
  const [responseReview, setResponseReview] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getReviews();
        setReviews(list);
      } catch (error) {
        showError(error.message || "Unable to load reviews");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleRefresh = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const list = await getReviews();
      setReviews(list);
    } catch (error) {
      showError(error.message || "Unable to load reviews");
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const setFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const resetFilters = () => {
    setSearch("");
    setFilters(DEFAULT_FILTERS);
  };

  const productOptions = useMemo(
    () => [
      { value: "all", label: "All Products" },
      ...mockProducts.map((p) => ({ value: p.id, label: p.name })),
    ],
    []
  );

  const FILTER_FIELDS = useMemo(
    () => [
      { key: "rating", label: "Rating", options: RATING_OPTIONS },
      { key: "response", label: "Response", options: RESPONSE_OPTIONS },
      { key: "product", label: "Product", options: productOptions },
      { key: "sort", label: "Sort", options: SORT_OPTIONS },
    ],
    [productOptions]
  );

  const hasActiveFilters =
    Boolean(search.trim()) ||
    filters.rating !== "all" ||
    filters.response !== "all" ||
    filters.product !== "all" ||
    filters.sort !== "newest";

  const SORTERS = useMemo(
    () => ({
      newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      rating_desc: (a, b) => b.rating - a.rating,
      rating_asc: (a, b) => a.rating - b.rating,
    }),
    []
  );

  const visibleReviews = useMemo(() => {
    const filtered = reviews.filter((review) => {
      const matchesSearch =
        !search.trim() ||
        review.customer.name.toLowerCase().includes(search.trim().toLowerCase()) ||
        review.productName.toLowerCase().includes(search.trim().toLowerCase()) ||
        review.comment.toLowerCase().includes(search.trim().toLowerCase());

      const matchesRating =
        filters.rating === "all" || review.rating === Number(filters.rating);
      const matchesResponse =
        filters.response === "all" ||
        (filters.response === "answered" && review.response) ||
        (filters.response === "unanswered" && !review.response);
      const matchesProduct =
        filters.product === "all" || review.productId === filters.product;

      return matchesSearch && matchesRating && matchesResponse && matchesProduct;
    });

    return [...filtered].sort(SORTERS[filters.sort] || SORTERS.newest);
  }, [reviews, search, filters, SORTERS]);

  const handleRespond = async (reviewId, responseText) => {
    if (responseReview?.response) {
      await updateResponse(reviewId, responseText);
      showSuccess("Response updated.");
    } else {
      await respondToReview(reviewId, responseText);
      showSuccess("Response posted.");
    }
  };

  const handleRespondClose = () => setResponseReview(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reviews"
        description="View and respond to customer reviews for your products."
        actions={
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            aria-label="Refresh reviews"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} /> Refresh
          </Button>
        }
      />

      <ReviewSummary reviews={reviews} />

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by customer, product, or comment..."
        />
        <FilterBar
          fields={FILTER_FIELDS}
          values={filters}
          onChange={setFilter}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      <ReviewList
        reviews={visibleReviews}
        onView={setDetailsReview}
        onRespond={setResponseReview}
      />

      <ReviewDetailsModal
        review={detailsReview}
        open={Boolean(detailsReview)}
        onClose={() => setDetailsReview(null)}
      />

      <ReviewResponseModal
        review={responseReview}
        open={Boolean(responseReview)}
        onClose={handleRespondClose}
        onSubmit={handleRespond}
      />
    </div>
  );
};

export default ReviewsContent;