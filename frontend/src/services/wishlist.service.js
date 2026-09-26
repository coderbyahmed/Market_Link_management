import { readStorage, writeStorage } from "../utils/storage.js";

/**
 * Wishlist service backed by localStorage (stores full snapshots of the saved
 * products). Same store pattern as the cart so the navbar badge stays live.
 */

const WISHLIST_KEY = "marketlink_customer_wishlist";

const listeners = new Set();
let state = readStorage(WISHLIST_KEY, []);

const emit = () => {
  listeners.forEach((listener) => listener());
};

const commit = (next) => {
  state = next;
  writeStorage(WISHLIST_KEY, state);
  emit();
};

const getState = () => state;

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const isInWishlist = (productId) =>
  state.some((product) => product.id === productId);

const toggleWishlist = async (product) => {
  if (!product) {
    throw new Error("Product not found");
  }

  const exists = isInWishlist(product.id);

  let next;

  if (exists) {
    next = state.filter((entry) => entry.id !== product.id);
  } else {
    next = [...state, product];
  }

  commit(next);

  return { next, added: !exists };
};

const removeFromWishlist = async (productId) => {
  const next = state.filter((entry) => entry.id !== productId);
  commit(next);
  return next;
};

const clearWishlist = async () => {
  commit([]);
  return [];
};

const getWishlist = async () => state;

export {
  getState,
  subscribe,
  isInWishlist,
  toggleWishlist,
  removeFromWishlist,
  clearWishlist,
  getWishlist,
};