/**
 * Seeded demo reviews shown on product details. Written customer reviews are
 * stored separately in localStorage by the customerReview service.
 */
const daysAgo = (days) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

const demoReviews = [
  {
    id: "rev-demo-001",
    productId: "prd-001",
    author: "Ayesha Khan",
    rating: 5,
    text: "Tomatoes were incredibly fresh and flavorful. Better than anything at the local market!",
    createdAt: daysAgo(20),
  },
  {
    id: "rev-demo-002",
    productId: "prd-001",
    author: "Bilal Ahmed",
    rating: 4,
    text: "Good quality and delivered on time. Would have loved a bigger box.",
    createdAt: daysAgo(12),
  },
  {
    id: "rev-demo-003",
    productId: "prd-002",
    author: "Sana Malik",
    rating: 5,
    text: "Crisp, sweet and juicy apples. My kids finished the whole bag in two days.",
    createdAt: daysAgo(15),
  },
  {
    id: "rev-demo-004",
    productId: "prd-007",
    author: "Usman Raza",
    rating: 5,
    text: "Real farm milk taste. Thick cream on top shows how fresh it is.",
    createdAt: daysAgo(9),
  },
  {
    id: "rev-demo-005",
    productId: "prd-008",
    author: "Mariam Fatima",
    rating: 5,
    text: "Beautiful raw honey, you can see it's completely unfiltered. Great for tea.",
    createdAt: daysAgo(7),
  },
  {
    id: "rev-demo-006",
    productId: "prd-004",
    author: "Hamza Sheikh",
    rating: 4,
    text: "Very fresh spinach, perfect for saag. Packaging could be a bit firmer.",
    createdAt: daysAgo(5),
  },
  {
    id: "rev-demo-007",
    productId: "prd-018",
    author: "Nimra Ali",
    rating: 5,
    text: "The basmati rice aroma filled the whole kitchen. Cooks perfectly fluffy.",
    createdAt: daysAgo(3),
  },
  {
    id: "rev-demo-008",
    productId: "prd-011",
    author: "Faisal Khan",
    rating: 5,
    text: "Sweet, ripe strawberries — tasted like summer. Will order again.",
    createdAt: daysAgo(2),
  },
];

export default demoReviews;