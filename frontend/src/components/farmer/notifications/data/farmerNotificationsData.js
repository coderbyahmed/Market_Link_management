const minutesAgo = (minutes) =>
  new Date(Date.now() - minutes * 60 * 1000).toISOString();

const farmerNotificationsData = [
  {
    id: "farmer-noti-1",
    title: "Welcome to MarketLink",
    message:
      "Your farmer account is active. Start by listing your first crop so customers near you can find it.",
    createdAt: minutesAgo(18),
    isRead: false,
  },
  {
    id: "farmer-noti-2",
    title: "New order received",
    message:
      "Order #ML-1042 for 12 kg of fresh tomatoes was placed by a local customer.",
    createdAt: minutesAgo(95),
    isRead: false,
  },
  {
    id: "farmer-noti-3",
    title: "Product approved",
    message:
      "Your listing \"Organic Wheat - 25kg\" has been approved and is now visible in the marketplace.",
    createdAt: minutesAgo(600),
    isRead: true,
  },
  {
    id: "farmer-noti-4",
    title: "Payment released",
    message:
      "Payment for order #ML-1018 has been released to your account.",
    createdAt: minutesAgo(2600),
    isRead: true,
  },
  {
    id: "farmer-noti-5",
    title: "Profile review completed",
    message:
      "Your farm profile details have been verified by the MarketLink team.",
    createdAt: minutesAgo(7000),
    isRead: true,
  },
];

export default farmerNotificationsData;
