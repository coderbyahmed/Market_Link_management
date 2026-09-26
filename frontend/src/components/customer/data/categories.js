/**
 * Customer market categories.
 * `accent` provides a Tailwind-safe "from/to" gradient for category tiles and
 * `chip` a soft background pair. Emoji keep tiles light without external images.
 */
const categories = [
  {
    id: "vegetables",
    name: "Vegetables",
    emoji: "🥕",
    tagline: "Garden fresh greens & roots",
    from: "from-green-100",
    to: "to-emerald-200",
    text: "text-green-700",
  },
  {
    id: "fruits",
    name: "Fruits",
    emoji: "🍎",
    tagline: "Naturally sweet & juicy",
    from: "from-red-100",
    to: "to-rose-200",
    text: "text-red-600",
  },
  {
    id: "grains",
    name: "Grains",
    emoji: "🌾",
    tagline: "Farm staple harvests",
    from: "from-amber-100",
    to: "to-yellow-200",
    text: "text-amber-700",
  },
  {
    id: "dairy",
    name: "Dairy",
    emoji: "🥛",
    tagline: "Milk, cream & cheese",
    from: "from-sky-100",
    to: "to-blue-200",
    text: "text-sky-700",
  },
  {
    id: "herbs",
    name: "Herbs",
    emoji: "🌿",
    tagline: "Fresh-cut aromatics",
    from: "from-lime-100",
    to: "to-green-200",
    text: "text-lime-700",
  },
  {
    id: "organic",
    name: "Organic",
    emoji: "🌱",
    tagline: "Certified chemical-free",
    from: "from-emerald-100",
    to: "to-teal-200",
    text: "text-emerald-700",
  },
  {
    id: "livestock",
    name: "Livestock",
    emoji: "🐄",
    tagline: "Healthy farm animals",
    from: "from-orange-100",
    to: "to-amber-200",
    text: "text-orange-700",
  },
  {
    id: "other",
    name: "Other",
    emoji: "🧺",
    tagline: "Everything else from the farm",
    from: "from-stone-100",
    to: "to-stone-200",
    text: "text-stone-600",
  },
];

const getCategoryById = (categoryId) =>
  categories.find((category) => category.id === categoryId) || null;

export { categories, getCategoryById };