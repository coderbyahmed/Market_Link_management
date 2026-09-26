const AVAILABILITY_META = {
  available: {
    label: "In Stock",
    badge: "bg-emerald-100 text-emerald-700",
  },
  sold_out: {
    label: "Sold Out",
    badge: "bg-stone-200 text-stone-600",
  },
  unavailable: {
    label: "Unavailable",
    badge: "bg-red-100 text-red-600",
  },
};

const getAvailabilityMeta = (availability) =>
  AVAILABILITY_META[availability] || AVAILABILITY_META.unavailable;

const formatPrice = (value) => {
  const amount = Number(value) || 0;
  return `Rs ${amount.toLocaleString("en-PK")}`;
};

export { AVAILABILITY_META, getAvailabilityMeta, formatPrice };