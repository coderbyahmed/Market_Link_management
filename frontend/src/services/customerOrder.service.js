import { readStorage, writeStorage } from "../utils/storage.js";
import { calculateTotals } from "../utils/totals.js";
import mockOrders from "../components/customer/data/mockOrders.js";

/**
 * Customer orders service backed by localStorage.
 * Async + API-shaped so it can be replaced by a real orders API later.
 */

const ORDERS_KEY = "marketlink_customer_orders";
const LATENCY_MS = 200;

const wait = (ms = LATENCY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const clone = (value) => JSON.parse(JSON.stringify(value));

const readOrders = () => {
  const orders = readStorage(ORDERS_KEY, mockOrders);

  if (!Array.isArray(orders)) {
    return [];
  }

  return orders;
};

const generateOrderId = () => {
  const time = Date.now().toString(36).toUpperCase().slice(-6);
  const random = Math.floor(100 + Math.random() * 900);
  return `ML-${time}${random}`;
};

const getOrders = async () => {
  await wait();
  return clone(readOrders());
};

const getOrder = async (orderId) => {
  await wait();

  const order = readOrders().find((entry) => entry.id === orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  return clone(order);
};

const placeOrder = async ({ items, delivery, payment }) => {
  await wait();

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Your cart is empty");
  }

  const totals = calculateTotals(items);

  const order = {
    id: generateOrderId(),
    status: "pending",
    createdAt: new Date().toISOString(),
    items: items.map((entry) => ({
      productId: entry.productId,
      name: entry.name,
      image: entry.image,
      price: entry.price,
      unit: entry.unit,
      quantity: entry.quantity,
    })),
    delivery: clone(delivery),
    payment,
    subtotal: totals.subtotal,
    deliveryFee: totals.deliveryFee,
    total: totals.total,
  };

  const orders = readOrders();
  const next = [order, ...orders];
  writeStorage(ORDERS_KEY, next);

  return clone(order);
};

export { getOrders, getOrder, placeOrder };