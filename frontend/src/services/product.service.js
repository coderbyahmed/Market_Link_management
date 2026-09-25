import mockProducts from "../components/farmer/products/data/mockProducts.js";
import mockProductRequests from "../components/farmer/products/data/mockProductRequests.js";
import mockWeeklyStock from "../components/farmer/products/data/mockWeeklyStock.js";

/**
 * Frontend-only product service.
 * Every function is async and mirrors the shape of a real API call, so the
 * mock state can later be swapped for Axios requests without touching the UI.
 */

const PRODUCTS_KEY = "marketlink_farmer_products";
const REQUESTS_KEY = "marketlink_farmer_product_requests";
const WEEKLY_STOCK_KEY = "marketlink_farmer_weekly_stock";

const LATENCY_MS = 250;

const wait = (ms = LATENCY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const clone = (value) => JSON.parse(JSON.stringify(value));

const read = (key, seed) => {
  try {
    const raw = localStorage.getItem(key);

    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
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

const getProducts = async () => {
  await wait();
  return read(PRODUCTS_KEY, mockProducts);
};

const createProduct = async (input) => {
  await wait();

  const now = new Date().toISOString();
  const id = `prd-${Date.now()}`;

  const product = {
    id,
    status: "pending",
    adminRemark: "",
    createdAt: now,
    updatedAt: now,
    ...input,
  };

  write(PRODUCTS_KEY, [product, ...read(PRODUCTS_KEY, mockProducts)]);

  const request = {
    id: `req-${Date.now()}`,
    productId: product.id,
    productName: product.name,
    category: product.category,
    price: product.price,
    unit: product.unit,
    type: "New Listing",
    status: "pending",
    remark: "",
    submittedAt: now,
  };

  write(REQUESTS_KEY, [request, ...read(REQUESTS_KEY, mockProductRequests)]);

  return product;
};

const updateProduct = async (id, input) => {
  await wait();

  const products = read(PRODUCTS_KEY, mockProducts);
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    throw new Error("Product not found.");
  }

  const updated = {
    ...products[index],
    ...input,
    id,
    updatedAt: new Date().toISOString(),
  };

  const next = [...products];
  next[index] = updated;
  write(PRODUCTS_KEY, next);

  const requests = read(REQUESTS_KEY, mockProductRequests);
  const linkedIndex = requests.findIndex(
    (request) => request.productId === id
  );

  if (linkedIndex !== -1) {
    const linked = { ...requests[linkedIndex] };
    linked.productName = updated.name;
    linked.category = updated.category;
    linked.price = updated.price;
    linked.unit = updated.unit;

    const nextRequests = [...requests];
    nextRequests[linkedIndex] = linked;
    write(REQUESTS_KEY, nextRequests);
  }

  return updated;
};

const deleteProduct = async (id) => {
  await wait();

  write(
    PRODUCTS_KEY,
    read(PRODUCTS_KEY, mockProducts).filter((product) => product.id !== id)
  );

  write(
    REQUESTS_KEY,
    read(REQUESTS_KEY, mockProductRequests).filter(
      (request) => request.productId !== id
    )
  );

  return { id };
};

const updateAvailability = async (id, availability) => {
  await wait();

  const products = read(PRODUCTS_KEY, mockProducts);
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    throw new Error("Product not found.");
  }

  const updated = {
    ...products[index],
    availability,
    updatedAt: new Date().toISOString(),
  };

  const next = [...products];
  next[index] = updated;
  write(PRODUCTS_KEY, next);

  return updated;
};

const getProductRequests = async () => {
  await wait();
  return read(REQUESTS_KEY, mockProductRequests);
};

const resubmitRequest = async (id) => {
  await wait();

  const requests = read(REQUESTS_KEY, mockProductRequests);
  const index = requests.findIndex((request) => request.id === id);

  if (index === -1) {
    throw new Error("Request not found.");
  }

  const updated = {
    ...requests[index],
    status: "pending",
    remark: "",
    submittedAt: new Date().toISOString(),
  };

  const next = [...requests];
  next[index] = updated;
  write(REQUESTS_KEY, next);

  const products = read(PRODUCTS_KEY, mockProducts);
  const productIndex = products.findIndex(
    (product) => product.id === updated.productId
  );

  if (productIndex !== -1) {
    const nextProducts = [...products];
    nextProducts[productIndex] = {
      ...products[productIndex],
      status: "pending",
      adminRemark: "",
      updatedAt: new Date().toISOString(),
    };
    write(PRODUCTS_KEY, nextProducts);
  }

  return updated;
};

const getWeeklyStock = async () => {
  await wait();
  return read(WEEKLY_STOCK_KEY, mockWeeklyStock);
};

const updateWeeklyStock = async (items) => {
  await wait();
  write(WEEKLY_STOCK_KEY, items);
  return items;
};

export {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateAvailability,
  getProductRequests,
  resubmitRequest,
  getWeeklyStock,
  updateWeeklyStock,
};
