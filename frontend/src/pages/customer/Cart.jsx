import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaTruck, FaArrowLeft, FaShoppingBasket } from "react-icons/fa";
import useCartStore from "../../hooks/useCartStore.js";
import { updateQuantity, removeFromCart } from "../../services/cart.service.js";
import { calculateTotals, FREE_DELIVERY_THRESHOLD } from "../../utils/totals.js";
import { formatPrice } from "../../components/customer/data/productMeta.js";
import QuantityStepper from "../../components/customer/common/QuantityStepper.jsx";
import EmptyState from "../../components/farmer/common/EmptyState.jsx";
import Button from "../../components/common/Button.jsx";
import { showError } from "../../components/common/feedback/MessageProvider.jsx";

const Cart = () => {
  const navigate = useNavigate();
  const cart = useCartStore();
  const { subtotal, deliveryFee, total } = calculateTotals(cart.items);
  const remainingForFreeDelivery = Math.max(
    0,
    FREE_DELIVERY_THRESHOLD - subtotal
  );

  const handleUpdate = async (productId, next) => {
    try {
      await updateQuantity(productId, next);
    } catch (err) {
      showError(err.message || "Unable to update quantity");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (err) {
      showError(err.message || "Unable to remove product");
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="bg-cream/40 pt-4">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <EmptyState
            icon={<FaShoppingBasket className="h-10 w-10 text-brand-300" />}
            title="Your cart is empty"
            description="Looks like you haven't added anything yet. Explore the marketplace and fill your basket with farm-fresh goodness."
            actionLabel="Browse Marketplace"
            onAction={() => navigate("/customer/products")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-stone-900">
            Your Cart
          </h1>
          <span className="text-sm text-stone-500">
            {getTotalQuantity(cart.items)} {getTotalQuantity(cart.items) === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cart.items.map((item) => {
              const lineTotal = Number(item.price) * Number(item.quantity);
              return (
                <div
                  key={item.productId}
                  className="flex flex-wrap items-center gap-4 rounded-2xl border border-stone-200/80 bg-white p-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 shrink-0 cursor-pointer rounded-xl object-cover"
                    onClick={() => navigate(`/customer/products/${item.productId}`)}
                  />
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => navigate(`/customer/products/${item.productId}`)}
                      className="text-left font-display text-base font-semibold text-stone-900 hover:text-brand-700"
                    >
                      {item.name}
                    </button>
                    <p className="mt-0.5 text-sm text-stone-500">
                      {formatPrice(item.price)} / {item.unit}
                    </p>
                    <p className="mt-0.5 text-xs text-stone-400">
                      by {item.farmer?.name || "Local Farmer"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <QuantityStepper
                      quantity={item.quantity}
                      onChange={(next) => handleUpdate(item.productId, next)}
                      max={item.stock}
                      compact
                    />
                    <p className="w-24 text-right font-semibold text-brand-700">
                      {formatPrice(lineTotal)}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.productId)}
                      aria-label={`Remove ${item.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <FaTrashAlt className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            <Button to="/customer/products" variant="outline">
              <FaArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Button>
          </div>

          <div>
            <div className="sticky top-24 rounded-2xl border border-stone-200/80 bg-white p-6">
              <h2 className="font-display text-lg font-semibold text-stone-900">
                Order Summary
              </h2>

              {remainingForFreeDelivery > 0 ? (
                <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
                  <FaTruck className="mb-1 h-4 w-4" />
                  Add <strong>{formatPrice(remainingForFreeDelivery)}</strong> more
                  to unlock free delivery.
                </div>
              ) : (
                <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700">
                  <FaTruck className="mb-1 h-4 w-4" />
                  You’ve unlocked <strong>free delivery</strong> on this order!
                </div>
              )}

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-stone-600">
                  <dt>Subtotal</dt>
                  <dd className="font-medium text-stone-900">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-stone-600">
                  <dt>Delivery fee</dt>
                  <dd className="font-medium text-stone-900">
                    {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-semibold text-stone-900">
                  <dt>Total</dt>
                  <dd>{formatPrice(total)}</dd>
                </div>
              </dl>

              <Button
                to="/customer/checkout"
                className="mt-6 !w-full"
                variant="primary"
                size="lg"
              >
                Proceed to Checkout
              </Button>
              <p className="mt-3 text-center text-xs text-stone-400">
                Cash on delivery • Returns accepted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getTotalQuantity = (items) =>
  items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

export default Cart;