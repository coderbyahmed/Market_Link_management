import { readStorage, writeStorage } from "../utils/storage.js";
import { getUser } from "../utils/auth.js";
import demoReviews from "../components/customer/data/reviews.js";

/**
 * Customer reviews service.
 * Demo reviews come from dummy data; customer-submitted reviews are stored in
 * localStorage (`marketlink_customer_reviews`). One review per product.
 */

const REVIEWS_KEY = "marketlink_customer_reviews";
const LATENCY_MS = 150;

const wait = (ms = LATENCY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const readReviews = () => {
  const reviews = readStorage(REVIEWS_KEY, []);
  return Array.isArray(reviews) ? reviews : [];
};

const getAuthor = () => {
  const user = getUser();
  return user?.name || "You";
};

const findIndex = (list, id) => list.findIndex((review) => review.id === id);

const getProductReviews = async (productId) => {
  await wait();

  const seeded = demoReviews
    .filter((review) => review.productId === productId)
    .map((review) => ({ ...review, demo: true }));

  const userReviews = readReviews().filter(
    (review) => review.productId === productId
  );

  return [...userReviews, ...seeded];
};

const getUserReviews = async () => {
  await wait();

  const reviews = readReviews();
  return [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const getReviewForProduct = async (productId) => {
  await wait();
  return readReviews().find((review) => review.productId === productId) || null;
};

const addOrUpdateReview = async ({ productId, rating, text, reviewId }) => {
  await wait();

  const reviews = readReviews();
  const existingIndex = reviewId
    ? findIndex(reviews, reviewId)
    : reviews.findIndex((review) => review.productId === productId);

  let next;

  if (existingIndex !== -1) {
    const updated = {
      ...reviews[existingIndex],
      rating,
      text,
      updatedAt: new Date().toISOString(),
    };
    next = [...reviews];
    next[existingIndex] = updated;
  } else {
    const created = {
      id: `customer-review-${Date.now()}`,
      productId,
      rating,
      text,
      author: getAuthor(),
      createdAt: new Date().toISOString(),
    };
    next = [...reviews, created];
  }

  writeStorage(REVIEWS_KEY, next);

  return next[existingIndex === -1 ? next.length - 1 : existingIndex];
};

const updateReview = async (reviewId, { rating, text }) => {
  await wait();

  const reviews = readReviews();
  const index = findIndex(reviews, reviewId);

  if (index === -1) {
    throw new Error("Review not found");
  }

  const updated = { ...reviews[index], rating, text };
  const next = [...reviews];
  next[index] = updated;
  writeStorage(REVIEWS_KEY, next);

  return updated;
};

const deleteReview = async (reviewId) => {
  await wait();

  const reviews = readReviews();
  const next = reviews.filter((review) => review.id !== reviewId);
  writeStorage(REVIEWS_KEY, next);

  return next;
};

export {
  getProductReviews,
  getUserReviews,
  getReviewForProduct,
  addOrUpdateReview,
  updateReview,
  deleteReview,
};