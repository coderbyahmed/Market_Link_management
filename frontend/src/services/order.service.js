import mockOrders from "../components/farmer/orders/data/mockOrders.js";
import mockPickupSettings from "../components/farmer/orders/data/mockPickupSettings.js";

/**
 * Frontend-only orders service.
 * Async + API-shaped so the mock state can later be replaced by Axios calls.
 */

const ORDERS_KEY = "marketlink_farmer_orders";
const PICKUP_KEY = "marketlink_farmer_pickup_settings";

const LATENCY_MS = 200;

const wait = (ms = LATENCY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const clone = (value) => JSON.parse(JSON.stringify(value));

const read = (key, seed) => {
  try {
    const raw = localStorage.getItem(key);

    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch {
    // corrupted storage falls back to the seed data
  }

  const seeded = clone(seed);
  localStorage.setItem(key, JSON.stringify(seeded));
  return seeded;
};

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
};

const getOrders = async () => {
  await wait();
  return read(ORDERS_KEY, mockOrders);
};

const updateOrderStatus = async (id, status) => {
  await wait();

  const orders = read(ORDERS_KEY, mockOrders);
  const index = orders.findIndex((order) => order.id === id);

  if (index === -1) {
    throw new Error("Order not found.");
  }

  const updated = { ...orders[index], status };
  const next = [...orders];
  next[index] = updated;
  write(ORDERS_KEY, next);

  return updated;
};

const getPickupSettings = async () => {
  await wait();
  return read(PICKUP_KEY, mockPickupSettings);
};

const updatePickupSettings = async (patch) => {
  await wait();

  const current = read(PICKUP_KEY, mockPickupSettings);
  const updated = { ...current, ...patch };
  write(PICKUP_KEY, updated);

  return updated;
};

const saveSlot = async (slot) => {
  await wait();

  const current = read(PICKUP_KEY, mockPickupSettings);
  const label = `${slot.start} - ${slot.end}`;

  const index = current.slots.findIndex((entry) => entry.id === slot.id);
  let nextSlots;

  if (index === -1) {
    const created = {
      id: `slot-${Date.now()}`,
      enabled: true,
      ...slot,
      label,
    };
    nextSlots = [...current.slots, created];
  } else {
    nextSlots = current.slots.map((entry) =>
      entry.id === slot.id ? { ...entry, ...slot, label } : entry
    );
  }

  const updated = { ...current, slots: nextSlots };
  write(PICKUP_KEY, updated);

  return updated;
};

const deleteSlot = async (id) => {
  await wait();

  const current = read(PICKUP_KEY, mockPickupSettings);
  const updated = {
    ...current,
    slots: current.slots.filter((slot) => slot.id !== id),
  };
  write(PICKUP_KEY, updated);

  return updated;
};

const toggleSlot = async (id) => {
  await wait();

  const current = read(PICKUP_KEY, mockPickupSettings);
  const updated = {
    ...current,
    slots: current.slots.map((slot) =>
      slot.id === id ? { ...slot, enabled: !slot.enabled } : slot
    ),
  };
  write(PICKUP_KEY, updated);

  return updated;
};

export {
  getOrders,
  updateOrderStatus,
  getPickupSettings,
  updatePickupSettings,
  saveSlot,
  deleteSlot,
  toggleSlot,
};
