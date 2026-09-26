import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaTruck, FaShieldAlt, FaMoneyBillWave, FaArrowLeft } from "react-icons/fa";
import EmptyState from "../../components/farmer/common/EmptyState.jsx";
import { showSuccess, showError } from "../../components/common/feedback/MessageProvider.jsx";
import useCartStore from "../../hooks/useCartStore.js";
import { placeOrder } from "../../services/customerOrder.service.js";
import { clearCart } from "../../services/cart.service.js";
import { getProfile } from "../../services/customer.service.js";
import { validateCheckout } from "../../validations/customer.validation.js";
import { calculateTotals } from "../../utils/totals.js";
import { formatPrice } from "../../components/customer/data/productMeta.js";

const Checkout = () => {
  const navigate = useNavigate();
  const cart = useCartStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    location: "",
    payment: "cod",
  });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    getProfile()
      .then((storedProfile) => {
        setForm((prev) => ({
          ...prev,
          name: storedProfile?.name || prev.name,
          email: storedProfile?.email || prev.email,
          phone: storedProfile?.phone || prev.phone,
          address: storedProfile?.delivery?.address || prev.address,
          city: storedProfile?.delivery?.city || prev.city,
          location: storedProfile?.delivery?.location || prev.location,
        }));
      })
      .catch(() => {});
  }, []);

  const { subtotal, deliveryFee, total } = calculateTotals(cart.items);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const { errors: validationErrors, isValid } = validateCheckout({
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      location: form.location,
    });

    setErrors(validationErrors);

    if (!isValid) return;

    setPlacing(true);

    try {
      const order = await placeOrder({
        items: cart.items,
        delivery: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          location: form.location,
        },
        payment: {
          method: form.payment,
          label: "Cash on Delivery",
        },
      });

      await clearCart();
      showSuccess(`Order ${order.id} placed successfully`);
      navigate(`/customer/orders/${order.id}`);
    } catch (placeError) {
      showError(placeError.message || "Unable to place order");
      setPlacing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="bg-cream/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <EmptyState
            title="Nothing to check out"
            description="Your cart is empty, so there's nothing to order yet."
            actionLabel="Browse Marketplace"
            onAction={() => navigate("/customer/products")}
          />
        </div>
      </div>
    );
  }

  const inputClass = (field) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm text-stone-700 outline-none transition-colors focus:border-brand-400 ${
      errors[field] ? "!border-red-400 bg-red-50/40" : "border-stone-200 bg-white"
    }`;

  const labelClass = "mb-1.5 block text-sm font-medium text-stone-600";

  return (
    <div className="bg-cream/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-6 font-display text-3xl font-semibold tracking-tight text-stone-900">
          Checkout
        </h1>

        <form onSubmit={handlePlaceOrder} className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl border border-stone-200/80 bg-white p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-stone-900">
                <FaTruck className="h-5 w-5 text-brand-700" />
                Delivery Details
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Where should we deliver your order?
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="checkout-name">
                    Full name
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="e.g. Ahmed Khan"
                    className={inputClass("name")}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <label className={labelClass} htmlFor="checkout-email">
                    Email
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass("email")}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>
                <div>
                  <label className={labelClass} htmlFor="checkout-phone">
                    Phone
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="e.g. 0300 1234567"
                    className={inputClass("phone")}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                </div>
                <div>
                  <label className={labelClass} htmlFor="checkout-city">
                    City
                  </label>
                  <input
                    id="checkout-city"
                    type="text"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="e.g. Islamabad"
                    className={inputClass("city")}
                  />
                  {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="checkout-address">
                    Complete address
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="House, street, area..."
                    className={inputClass("address")}
                  />
                  {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="checkout-location">
                    Area / location landmark
                  </label>
                  <input
                    id="checkout-location"
                    type="text"
                    value={form.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    placeholder="e.g. Near F-10 Markaz"
                    className={inputClass("location")}
                  />
                  {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-stone-200/80 bg-white p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-stone-900">
                <FaMoneyBillWave className="h-5 w-5 text-brand-700" />
                Payment Method
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Pay easily when your order arrives.
              </p>

              <label className="mt-5 flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-brand-700 bg-brand-50/50 p-4">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={form.payment === "cod"}
                  onChange={() => handleChange("payment", "cod")}
                  className="accent-brand-700"
                />
                <span>
                  <span className="block text-sm font-semibold text-stone-900">
                    Cash on Delivery
                  </span>
                  <span className="block text-xs text-stone-500">
                    Pay the rider when your order reaches your door.
                  </span>
                </span>
              </label>
            </section>
          </div>

          <div>
            <div className="sticky top-24 rounded-2xl border border-stone-200/80 bg-white p-6">
              <h2 className="font-display text-lg font-semibold text-stone-900">
                Order Summary
              </h2>

              <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
                {cart.items.map((item) => (
                  <li key={item.productId} className="flex items-center gap-3 text-sm">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-stone-800">{item.name}</p>
                      <p className="text-xs text-stone-500">
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <span className="font-semibold text-stone-800">
                      {formatPrice(Number(item.price) * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mt-5 space-y-3 border-t border-stone-200 pt-4 text-sm">
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

              <button
                type="submit"
                disabled={placing}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-60"
              >
                {placing ? "Placing order..." : `Place Order • ${formatPrice(total)}`}
              </button>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-stone-400">
                <FaShieldAlt className="h-3.5 w-3.5 text-brand-600" />
                Secure checkout — no advance payment needed.
              </p>
            </div>
          </div>
        </form>

        <div className="mt-8">
          <Link
            to="/customer/cart"
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition-colors hover:text-brand-700"
          >
            <FaArrowLeft className="h-3.5 w-3.5" />
            Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Checkout;