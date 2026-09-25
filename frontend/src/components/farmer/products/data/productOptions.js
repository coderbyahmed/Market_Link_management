const CATEGORIES = [
  { value: "vegetables", label: "Vegetables" },
  { value: "fruits", label: "Fruits" },
  { value: "dairy", label: "Dairy" },
  { value: "herbs", label: "Herbs" },
  { value: "grains", label: "Grains" },
  { value: "organic", label: "Organic" },
  { value: "other", label: "Other" },
];

const UNITS = [
  { value: "kg", label: "kg" },
  { value: "g", label: "g" },
  { value: "piece", label: "piece" },
  { value: "dozen", label: "dozen" },
  { value: "liter", label: "liter" },
  { value: "bundle", label: "bundle" },
  { value: "box", label: "box" },
];

const AVAILABILITY = {
  available: "available",
  soldOut: "sold_out",
  unavailable: "unavailable",
};

const AVAILABILITY_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "sold_out", label: "Sold Out" },
  { value: "unavailable", label: "Temporarily Unavailable" },
];

const AVAILABILITY_META = {
  available: { label: "Available", tagColor: "green" },
  sold_out: { label: "Sold Out", tagColor: "red" },
  unavailable: { label: "Temporarily Unavailable", tagColor: "orange" },
};

const STATUS_META = {
  pending: { label: "Pending", tagColor: "gold" },
  approved: { label: "Approved", tagColor: "blue" },
  rejected: { label: "Rejected", tagColor: "red" },
};

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A-Z" },
  { value: "name_desc", label: "Name: Z-A" },
  { value: "stock_asc", label: "Stock: Low to High" },
  { value: "stock_desc", label: "Stock: High to Low" },
];

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const categoryLabel = (value) =>
  CATEGORIES.find((category) => category.value === value)?.label || value;

const unitLabel = (value) =>
  UNITS.find((unit) => unit.value === value)?.label || value;

const availabilityLabel = (value) =>
  AVAILABILITY_META[value]?.label || value;

const statusLabel = (value) => STATUS_META[value]?.label || value;

const filterOptions = (options, withAllLabel) => [
  ...(withAllLabel ? [{ value: "all", label: withAllLabel }] : []),
  ...options,
];

export {
  CATEGORIES,
  UNITS,
  AVAILABILITY,
  AVAILABILITY_OPTIONS,
  AVAILABILITY_META,
  STATUS_META,
  STATUS_OPTIONS,
  SORT_OPTIONS,
  WEEK_DAYS,
  categoryLabel,
  unitLabel,
  availabilityLabel,
  statusLabel,
  filterOptions,
};
