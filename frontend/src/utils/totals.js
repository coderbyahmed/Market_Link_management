/**
 * Shared marketplace money helpers used by the Cart and Checkout.
 */
const FREE_DELIVERY_THRESHOLD = 2000;
const BASE_DELIVERY_FEE = 100;

const getDeliveryFee = (subtotal) =>
  subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : BASE_DELIVERY_FEE;

const calculateTotals = (items) => {
  const raw = items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return sum + price * quantity;
  }, 0);

  const subtotal = Math.round(raw * 100) / 100;
  const deliveryFee = getDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;

  return { subtotal, deliveryFee, total };
};

export { FREE_DELIVERY_THRESHOLD, BASE_DELIVERY_FEE, getDeliveryFee, calculateTotals };