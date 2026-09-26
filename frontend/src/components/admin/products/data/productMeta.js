const CATEGORIES = [
  { value: "vegetables", label: "Vegetables" },
  { value: "fruits", label: "Fruits" },
  { value: "dairy", label: "Dairy" },
  { value: "herbs", label: "Herbs" },
  { value: "grains", label: "Grains" },
  { value: "organic", label: "Organic" },
  { value: "other", label: "Other" },
];

const AVAILABILITY_OPTIONS = [
  { value: "all", label: "All Availability" },
  { value: "available", label: "Available" },
  { value: "sold_out", label: "Sold Out" },
  { value: "unavailable", label: "Temporarily Unavailable" },
];

const AVAILABILITY_META = {
  available: { label: "Available", tagColor: "green" },
  sold_out: { label: "Sold Out", tagColor: "red" },
  unavailable: { label: "Unavailable", tagColor: "orange" },
};

const STATUS_META = {
  pending: { label: "Pending", tagColor: "gold" },
  approved: { label: "Approved", tagColor: "blue" },
  rejected: { label: "Rejected", tagColor: "red" },
};

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const categoryLabel = (value) =>
  CATEGORIES.find((category) => category.value === value)?.label || value;

const unitLabel = (value) => value || "";

const availabilityLabel = (value) =>
  AVAILABILITY_META[value]?.label || value;

const statusLabel = (value) => STATUS_META[value]?.label || value;

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export {
  CATEGORIES,
  AVAILABILITY_OPTIONS,
  AVAILABILITY_META,
  STATUS_META,
  STATUS_OPTIONS,
  categoryLabel,
  unitLabel,
  availabilityLabel,
  statusLabel,
  formatDate,
};