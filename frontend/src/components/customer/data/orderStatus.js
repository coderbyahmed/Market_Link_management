const ORDER_STATUS_META = {
  pending: {
    label: "Pending",
    badge: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
    step: 0,
    description: "Your order has been received and is awaiting confirmation.",
  },
  confirmed: {
    label: "Confirmed",
    badge: "bg-sky-100 text-sky-700",
    dot: "bg-sky-500",
    step: 1,
    description: "The farmer has confirmed your order.",
  },
  processing: {
    label: "Processing",
    badge: "bg-indigo-100 text-indigo-700",
    dot: "bg-indigo-500",
    step: 2,
    description: "Your order is being packed and prepared.",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    badge: "bg-violet-100 text-violet-700",
    dot: "bg-violet-500",
    step: 3,
    description: "Your order is on its way to your address.",
  },
  delivered: {
    label: "Delivered",
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
    step: 4,
    description: "Your order has been delivered. Enjoy your fresh produce!",
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-red-100 text-red-600",
    dot: "bg-red-500",
    step: -1,
    description: "This order was cancelled.",
  },
};

const ORDER_TIMELINE_STEPS = [
  { title: "Pending", description: "Order received" },
  { title: "Confirmed", description: "Farmer confirmed" },
  { title: "Processing", description: "Being packed" },
  { title: "Out for Delivery", description: "On the way" },
  { title: "Delivered", description: "Delivered" },
];

const getOrderStatusMeta = (status) =>
  ORDER_STATUS_META[status] || ORDER_STATUS_META.pending;

const isDelivered = (status) => status === "delivered";

export { ORDER_STATUS_META, ORDER_TIMELINE_STEPS, getOrderStatusMeta, isDelivered };