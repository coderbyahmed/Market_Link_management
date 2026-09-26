import { readStorage, writeStorage } from "../utils/storage.js";

/**
 * Cart service backed by localStorage.
 * A tiny store keeps the snapshot stable for `useSyncExternalStore`, so the
 * navbar badge and any cart UI update whenever the cart changes anywhere.
 */

const CART_KEY = "marketlink_customer_cart";

const listeners = new Set();
let state = readStorage(CART_KEY, []);

const emit = () => {
  listeners.forEach((listener) => listener());
};

const commit = (next) => {
  state = next;
  writeStorage(CART_KEY, state);
  emit();
};

const getState = () => state;

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getCartCount = () =>
  state.reduce((sum, item) => sum + item.quantity, 0);

const addToCart = async (product, quantity = 1) => {
  if (!product) {
    throw new Error("Product not found");
  }

  if (product.availability !== "available" || !(product.stock > 0)) {
    throw new Error("This product is currently out of stock");
  }

  const item = {
    productId: product.id,
    name: product.name,
    image: product.image,
    category: product.category,
    price: product.price,
    unit: product.unit,
    stock: product.stock,
    farmer: product.farmer,
    quantity,
  };

  const existing = state.find((entry) => entry.productId === product.id);
  const nextQuantity = Math.min(
    (existing?.quantity || 0) + quantity,
    product.stock
  );

  let next;

  if (existing) {
    next = state.map((entry) =>
      entry.productId === product.id
        ? { ...entry, ...item, quantity: nextQuantity }
        : entry
    );
  } else {
    next = [...state, { ...item, quantity: Math.min(quantity, product.stock) }];
  }

  commit(next);
  return next;
};

const updateQuantity = async (productId, quantity) => {
  const existing = state.find((entry) => entry.productId === productId);

  if (!existing) {
    return state;
  }

  let next;

  if (quantity <= 0) {
    next = state.filter((entry) => entry.productId !== productId);
  } else {
    const clamped = Math.min(quantity, existing.stock);
    next = state.map((entry) =>
      entry.productId === productId ? { ...entry, quantity: clamped } : entry
    );
  }

  commit(next);
  return next;
};

const removeFromCart = async (productId) => {
  const next = state.filter((entry) => entry.productId !== productId);
  commit(next);
  return next;
};

const clearCart = async () => {
  commit([]);
  return [];
};

const getCart = async () => state;

export {
  getState,
  subscribe,
  getCartCount,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  getCart,
};