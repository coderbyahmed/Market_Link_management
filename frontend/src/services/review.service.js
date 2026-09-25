import mockReviews from "../components/farmer/reviews/data/mockReviews.js";

const REVIEWS_KEY = "marketlink_farmer_reviews";
const LATENCY_MS = 150;

const wait = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

const clone = (value) => JSON.parse(JSON.stringify(value));

const read = (key, seed) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  const seeded = clone(seed);
  localStorage.setItem(key, JSON.stringify(seeded));
  return seeded;
};

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
};

const getReviews = async () => {
  await wait();
  return read(REVIEWS_KEY, mockReviews);
};

const respondToReview = async (reviewId, responseText) => {
  await wait();

  const reviews = read(REVIEWS_KEY, mockReviews);
  const index = reviews.findIndex((r) => r.id === reviewId);

  if (index === -1) throw new Error("Review not found");

  const updated = {
    ...reviews[index],
    response: {
      text: responseText,
      createdAt: new Date().toISOString(),
    },
  };

  const next = [...reviews];
  next[index] = updated;
  write(REVIEWS_KEY, next);

  return updated;
};

const updateResponse = async (reviewId, responseText) => {
  await wait();

  const reviews = read(REVIEWS_KEY, mockReviews);
  const index = reviews.findIndex((r) => r.id === reviewId);

  if (index === -1) throw new Error("Review not found");

  const updated = {
    ...reviews[index],
    response: {
      text: responseText,
      createdAt: new Date().toISOString(),
    },
  };

  const next = [...reviews];
  next[index] = updated;
  write(REVIEWS_KEY, next);

  return updated;
};

export { getReviews, respondToReview, updateResponse };