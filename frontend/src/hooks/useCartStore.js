import { useSyncExternalStore } from "react";
import {
  getState as getCartState,
  subscribe as subscribeCart,
  getCartCount,
} from "../services/cart.service.js";

const useCartStore = () => {
  const items = useSyncExternalStore(subscribeCart, getCartState);
  const count = getCartCount();

  return { items, count };
};

export default useCartStore;