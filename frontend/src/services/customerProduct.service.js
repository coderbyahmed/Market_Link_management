import { getApprovedProducts, getProductById } from "../components/customer/data/products.js";

/**
 * Customer product service.
 * Currently reads from dummy data; keep the same exported API so it can later
 * be swapped to a real backend endpoint.
 */

const LATENCY_MS = 150;

const wait = (ms = LATENCY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const getProducts = async () => {
  await wait();
  return getApprovedProducts();
};

const getProduct = async (productId) => {
  await wait();

  const product = getProductById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

export { getProducts, getProduct };