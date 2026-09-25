import mockProducts from "../../products/data/mockProducts.js";

/**
 * Deterministic mock pre-orders for the Farmer Panel.
 * Every order references real products from the Products module and is paid
 * at pickup (the SRS excludes payment gateways).
 */

const CUSTOMERS = [
  { name: "Ali Khan", phone: "+92 300 1234567", email: "ali.khan@example.com" },
  {
    name: "Sara Ahmed",
    phone: "+92 321 9876543",
    email: "sara.ahmed@example.com",
  },
  { name: "Bilal Raza", phone: "+92 333 4567890", email: "bilal.raza@example.com" },
  { name: "Hina Malik", phone: "+92 345 1122334", email: "hina.malik@example.com" },
  { name: "Usman Tariq", phone: "+92 301 5566778", email: "usman.tariq@example.com" },
  { name: "Fatima Noor", phone: "+92 312 6677889", email: "fatima.noor@example.com" },
  {
    name: "Zeeshan Iqbal",
    phone: "+92 336 2233445",
    email: "zeeshan.iqbal@example.com",
  },
  {
    name: "Ayesha Siddiqui",
    phone: "+92 300 9988776",
    email: "ayesha.siddiqui@example.com",
  },
];

const PICKUP_SLOTS = ["09:00 - 11:00", "11:00 - 13:00", "16:00 - 18:00"];

const TOTAL_ORDERS = 45;

const daysAgoFor = (index) => {
  if (index < 6) return Math.floor(index / 3);
  return 2 + Math.round((index - 6) * 1.25);
};

const statusFor = (daysAgo, index) => {
  if (daysAgo <= 2) return ["pending", "accepted", "pending", "ready"][index % 4];
  if (daysAgo <= 5) return ["accepted", "ready", "completed"][index % 3];
  if (index % 9 === 3) return "cancelled";
  if (index % 11 === 5) return "declined";
  return "completed";
};

const buildItems = (index, count) => {
  const items = [];

  for (let cursor = 0; cursor < count; cursor += 1) {
    const product = mockProducts[(index * 5 + cursor * 7) % mockProducts.length];

    if (items.some((item) => item.productId === product.id)) continue;

    items.push({
      productId: product.id,
      name: product.name,
      unit: product.unit,
      price: product.price,
      quantity: 1 + ((index + cursor * 3) % 6),
    });
  }

  return items;
};

const buildOrders = () => {
  const orders = [];

  for (let index = 0; index < TOTAL_ORDERS; index += 1) {
    const daysAgo = daysAgoFor(index);

    const orderDate = new Date();
    orderDate.setHours(9 + (index % 8), (index * 7) % 60, 0, 0);
    orderDate.setDate(orderDate.getDate() - daysAgo);

    const status = statusFor(daysAgo, index);
    const items = buildItems(index, 1 + ((index * 2) % 3));
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const isActive = ["pending", "accepted", "ready"].includes(status);
    const pickupDate = new Date();
    pickupDate.setHours(0, 0, 0, 0);

    if (isActive) {
      pickupDate.setDate(pickupDate.getDate() + (index % 2));
    } else {
      pickupDate.setDate(pickupDate.getDate() - daysAgo + 1);
    }

    orders.push({
      id: `ORD-${2100 - index}`,
      customer: CUSTOMERS[(index * 3) % CUSTOMERS.length],
      items,
      total,
      orderDate: orderDate.toISOString(),
      pickupDate: pickupDate.toISOString(),
      pickupLabel: pickupDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      pickupSlot: PICKUP_SLOTS[index % PICKUP_SLOTS.length],
      status,
      paymentMethod: "Pay at Pickup",
      note: index % 7 === 0 ? "Please pack the items separately." : "",
    });
  }

  return orders;
};

const mockOrders = buildOrders();

export default mockOrders;
