import mockProducts from "../components/farmer/products/data/mockProducts.js";
import mockWeeklyStock from "../components/farmer/products/data/mockWeeklyStock.js";

const LISTINGS_KEY = "marketlink_farmer_crop_listings";
const LATENCY_MS = 150;

const wait = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

const clone = (value) => JSON.parse(JSON.stringify(value));

const read = (key, seed) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch {
    // ignore
  }
  const seeded = clone(seed);
  localStorage.setItem(key, JSON.stringify(seeded));
  return seeded;
};

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
};

const getDefaultMarket = () => "Sunday Farmers Market";

const getDefaultDays = () => {
  const uniqueDays = [...new Set(mockWeeklyStock.map((ws) => ws.day))];
  return uniqueDays.length > 0 ? uniqueDays : ["Saturday", "Sunday"];
};

const seedListingMeta = () => {
  const market = getDefaultMarket();
  const days = getDefaultDays();

  return mockProducts.reduce((meta, product) => {
    meta[product.id] = {
      visibility: product.status === "approved" ? "published" : "unpublished",
      market,
      days,
    };
    return meta;
  }, {});
};

const getCropListings = async () => {
  await wait();

  const meta = read(LISTINGS_KEY, seedListingMeta());

  const listings = mockProducts.map((product) => {
    const m = meta[product.id] || seedListingMeta()[product.id] || {
      visibility: product.status === "approved" ? "published" : "unpublished",
      market: getDefaultMarket(),
      days: getDefaultDays(),
    };

    return {
      productId: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      unit: product.unit,
      quantity: product.quantity,
      availability: product.availability,
      image: product.image,
      market: m.market,
      days: m.days,
      visibility: m.visibility,
      updatedAt: product.updatedAt || product.createdAt,
    };
  });

  return listings;
};

const setVisibility = async (productId, visibility) => {
  await wait();

  const meta = read(LISTINGS_KEY, seedListingMeta());
  if (!meta[productId]) return;

  meta[productId] = { ...meta[productId], visibility };
  write(LISTINGS_KEY, meta);

  return meta[productId];
};

const updateListing = async (productId, patch) => {
  await wait();

  const meta = read(LISTINGS_KEY, seedListingMeta());
  if (!meta[productId]) return;

  meta[productId] = { ...meta[productId], ...patch };
  write(LISTINGS_KEY, meta);

  return meta[productId];
};

export { getCropListings, setVisibility, updateListing };