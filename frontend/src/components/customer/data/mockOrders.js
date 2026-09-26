import { products } from "./products.js";

const daysAgo = (days) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

const item = (productId, quantity) => {
  const product = products.find((entry) => entry.id === productId);

  return {
    productId,
    name: product.name,
    image: product.image,
    price: product.price,
    unit: product.unit,
    quantity,
  };
};

/**
 * Demo orders seeded into the customer's order history so the Orders, Order
 * Details and Reviews pages have realistic content on first login.
 */
const mockOrders = [
  {
    id: "ML-demo-1003",
    status: "delivered",
    createdAt: daysAgo(14),
    items: [item("prd-001", 2), item("prd-009", 3)],
    delivery: {
      name: "Demo Customer",
      phone: "0300 1234567",
      address: "House 12, Street 5, DHA Phase 2",
      city: "Lahore",
      location: "Main Boulevard",
      instructions: "Leave with the security guard if I am not home.",
    },
    payment: "Cash on Delivery",
    subtotal: 680,
    deliveryFee: 100,
    total: 780,
  },
  {
    id: "ML-demo-1002",
    status: "delivered",
    createdAt: daysAgo(21),
    items: [item("prd-007", 4), item("prd-017", 1)],
    delivery: {
      name: "Demo Customer",
      phone: "0300 1234567",
      address: "House 12, Street 5, DHA Phase 2",
      city: "Lahore",
      location: "Main Boulevard",
      instructions: "",
    },
    payment: "Cash on Delivery",
    subtotal: 1380,
    deliveryFee: 0,
    total: 1380,
  },
  {
    id: "ML-demo-1001",
    status: "out_for_delivery",
    createdAt: daysAgo(2),
    items: [item("prd-011", 1), item("prd-002", 1)],
    delivery: {
      name: "Demo Customer",
      phone: "0300 1234567",
      address: "House 12, Street 5, DHA Phase 2",
      city: "Lahore",
      location: "Main Boulevard",
      instructions: "",
    },
    payment: "Cash on Delivery",
    subtotal: 1070,
    deliveryFee: 0,
    total: 1070,
  },
];

export default mockOrders;