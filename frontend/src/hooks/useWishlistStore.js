import { useSyncExternalStore } from "react";
import {
  getState as getWishlistState,
  subscribe as subscribeWishlist,
} from "../services/wishlist.service.js";

const useWishlistStore = () => {
  const items = useSyncExternalStore(subscribeWishlist, getWishlistState);
  return { items };
};

export default useWishlistStore;