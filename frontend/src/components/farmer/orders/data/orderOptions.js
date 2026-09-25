const ORDER_STATUS_META = {
  pending: { label: "Pending", tagColor: "gold" },
  accepted: { label: "Accepted", tagColor: "blue" },
  ready: { label: "Ready for Pickup", tagColor: "purple" },
  completed: { label: "Completed", tagColor: "green" },
  cancelled: { label: "Cancelled", tagColor: "default" },
  declined: { label: "Declined", tagColor: "red" },
};

const HISTORY_STATUSES = ["completed", "cancelled", "declined"];

const STATUS_OPTIONS_ALL = [
  { value: "all", label: "All" },
  ...Object.entries(ORDER_STATUS_META).map(([value, meta]) => ({
    value,
    label: meta.label,
  })),
];

const STATUS_OPTIONS_ACTIVE = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "ready", label: "Ready for Pickup" },
];

const STATUS_OPTIONS_HISTORY = [
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "declined", label: "Declined" },
];

const ORDER_DATE_OPTIONS = [
  { value: "all", label: "All Dates" },
  { value: "today", label: "Today" },
  { value: "last7", label: "Last 7 Days" },
  { value: "last30", label: "Last 30 Days" },
];

const PICKUP_DATE_OPTIONS = [
  { value: "all", label: "All Dates" },
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "week", label: "This Week" },
];

const ORDER_SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "total_desc", label: "Total: High to Low" },
  { value: "total_asc", label: "Total: Low to High" },
];

/** Status change actions available inside the Orders table / drawer. */
const STATUS_ACTIONS = {
  pending: [
    { action: "accept", label: "Accept", tone: "primary" },
    { action: "decline", label: "Decline", tone: "danger" },
  ],
  accepted: [{ action: "ready", label: "Mark Ready", tone: "primary" }],
  ready: [{ action: "complete", label: "Mark Completed", tone: "primary" }],
  completed: [],
  cancelled: [],
  declined: [],
};

const STATUS_CHANGE_META = {
  accept: {
    next: "accepted",
    title: "Accept Order?",
    confirmText: "Accept",
    success: "Order accepted.",
    buildMessage: (order) =>
      `Are you sure you want to accept order ${order.id} from ${order.customer.name}? The customer will be notified for pickup.`,
  },
  decline: {
    next: "declined",
    title: "Decline Order?",
    confirmText: "Decline",
    danger: true,
    success: "Order declined.",
    buildMessage: (order) =>
      `Are you sure you want to decline order ${order.id} from ${order.customer.name}? This action cannot be undone.`,
  },
  ready: {
    next: "ready",
    title: "Mark Ready?",
    confirmText: "Mark Ready",
    success: "Order marked ready for pickup.",
    buildMessage: (order) =>
      `Mark order ${order.id} as ready for pickup at ${order.pickupSlot} on ${order.pickupLabel}?`,
  },
  complete: {
    next: "completed",
    title: "Mark Completed?",
    confirmText: "Mark Completed",
    success: "Order marked completed.",
    buildMessage: (order) =>
      `Mark order ${order.id} as completed? Payment of ${formatMoney(
        order.total
      )} is collected at pickup.`,
  },
};

const PASSIVE_PAYMENT_LABEL = "Pay at Pickup";

function formatMoney(value) {
  return `Rs. ${Number(value || 0).toLocaleString()}`;
}

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const dayDiff = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return Math.round((date - startOfToday()) / 86400000);
};

const matchesOrderDateFilter = (order, filter) => {
  if (filter === "all") return true;

  const diff = startOfToday() - new Date(order.orderDate);
  const days = Math.floor(diff / 86400000);

  if (filter === "today") return days === 0;
  if (filter === "last7") return days >= 0 && days <= 7;
  if (filter === "last30") return days >= 0 && days <= 30;
  return true;
};

const matchesPickupDateFilter = (order, filter) => {
  if (filter === "all") return true;

  const diff = dayDiff(order.pickupDate);

  if (filter === "today") return diff === 0;
  if (filter === "tomorrow") return diff === 1;
  if (filter === "week") return diff >= -7 && diff <= 7;
  return true;
};

export {
  ORDER_STATUS_META,
  HISTORY_STATUSES,
  STATUS_OPTIONS_ALL,
  STATUS_OPTIONS_ACTIVE,
  STATUS_OPTIONS_HISTORY,
  ORDER_DATE_OPTIONS,
  PICKUP_DATE_OPTIONS,
  ORDER_SORT_OPTIONS,
  STATUS_ACTIONS,
  STATUS_CHANGE_META,
  PASSIVE_PAYMENT_LABEL,
  formatMoney,
  matchesOrderDateFilter,
  matchesPickupDateFilter,
};
