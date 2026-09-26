import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Breadcrumb, Steps, Skeleton, Alert } from "antd";
import {
  FaChevronLeft,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUserCircle,
  FaMoneyBillWave,
  FaStar,
  FaClipboardCheck,
} from "react-icons/fa";
import EmptyState from "../../components/farmer/common/EmptyState.jsx";
import ReviewModal from "../../components/customer/reviews/ReviewModal.jsx";
import {
  getOrderStatusMeta,
  ORDER_TIMELINE_STEPS,
  isDelivered,
} from "../../components/customer/data/orderStatus.js";
import { getOrder } from "../../services/customerOrder.service.js";
import { getReviewForProduct } from "../../services/customerReview.service.js";
import { formatPrice } from "../../components/customer/data/productMeta.js";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewProduct, setReviewProduct] = useState(null);
  const [existingReview, setExistingReview] = useState(null);

  useEffect(() => {
    getOrder(orderId)
      .then((found) => {
        setOrder(found);
        setError("");
      })
      .catch((loadError) => {
        setError(loadError.message || "Order not found");
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="bg-cream/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-cream/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <EmptyState
            title="Order not found"
            description={error || "This order could not be found."}
            actionLabel="Back to My Orders"
            onAction={() => navigate("/customer/orders")}
          />
        </div>
      </div>
    );
  }

  const meta = getOrderStatusMeta(order.status);
  const cancelled = order.status === "cancelled";
  const delivered = isDelivered(order.status);
  const paymentLabel =
    typeof order.payment === "string"
      ? order.payment
      : order.payment?.label || "Cash on Delivery";

  const formattedDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleOpenReview = async (item) => {
    const product = {
      id: item.productId,
      name: item.name,
      image: item.image,
      unit: item.unit,
      farmer: {},
    };

    try {
      const existing = await getReviewForProduct(item.productId);
      setExistingReview(existing);
    } catch {
      setExistingReview(null);
    }

    setReviewProduct(product);
  };

  const handleCloseReview = () => {
    setReviewProduct(null);
    setExistingReview(null);
  };

  return (
    <div className="bg-cream/40">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { title: <Link to="/customer">Home</Link> },
            { title: <Link to="/customer/orders">My Orders</Link> },
            { title: order.id },
          ]}
          className="mb-6"
        />

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-stone-900">
              {order.id}
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              Placed on {formattedDate(order.createdAt)}
            </p>
          </div>
          <span
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${meta.badge}`}
          >
            {meta.label}
          </span>
        </div>

        {cancelled ? (
          <Alert
            type="error"
            showIcon
            message="This order was cancelled"
            description={meta.description}
            className="mt-6"
          />
        ) : (
          <div className="mt-8 rounded-2xl border border-stone-200/80 bg-white p-6">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-brand-800">
              <FaClipboardCheck className="h-4 w-4" />
              Order Status
            </div>
            <Steps
              size="small"
              current={meta.step}
              items={ORDER_TIMELINE_STEPS}
              status={delivered ? "finish" : "process"}
              className="order-steps"
            />
            <p className="mt-4 text-sm text-stone-500">{meta.description}</p>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl border border-stone-200/80 bg-white p-6">
              <h2 className="font-display text-lg font-semibold text-stone-900">
                Items ({order.items.length})
              </h2>
              <ul className="mt-4 divide-y divide-stone-100">
                {order.items.map((item) => (
                  <li key={item.productId} className="flex items-center gap-4 py-4">
                    <Link to={`/customer/products/${item.productId}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/customer/products/${item.productId}`}
                        className="font-medium text-stone-900 hover:text-brand-700"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-stone-500">
                        {item.quantity} × {formatPrice(item.price)} / {item.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-stone-900">
                        {formatPrice(Number(item.price) * item.quantity)}
                      </p>
                      {delivered && (
                        <button
                          type="button"
                          onClick={() => handleOpenReview(item)}
                          className="mt-1 inline-flex items-center gap-1 rounded-lg border border-brand-200 bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-100"
                        >
                          <FaStar className="h-3 w-3" />
                          Write a Review
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-stone-200/80 bg-white p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-stone-900">
                <FaUserCircle className="h-5 w-5 text-brand-700" />
                Delivery Details
              </h2>
              <div className="mt-4 space-y-3 text-sm text-stone-600">
                <p className="font-semibold text-stone-800">{order.delivery?.name}</p>
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt className="h-4 w-4 text-brand-700" />
                  {order.delivery?.address}, {order.delivery?.location || "—"}, {order.delivery?.city}
                </p>
                <p className="flex items-center gap-2">
                  <FaPhoneAlt className="h-4 w-4 text-brand-700" />
                  {order.delivery?.phone}
                </p>
                <p className="flex items-center gap-2">
                  <FaMoneyBillWave className="h-4 w-4 text-brand-700" />
                  {paymentLabel}
                </p>
              </div>
            </section>
          </div>

          <div>
            <div className="rounded-2xl border border-stone-200/80 bg-white p-6">
              <h2 className="font-display text-lg font-semibold text-stone-900">
                Summary
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between text-stone-600">
                  <dt>Subtotal</dt>
                  <dd className="font-medium text-stone-900">{formatPrice(order.subtotal)}</dd>
                </div>
                <div className="flex justify-between text-stone-600">
                  <dt>Delivery fee</dt>
                  <dd className="font-medium text-stone-900">
                    {order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-semibold text-stone-900">
                  <dt>Total</dt>
                  <dd>{formatPrice(order.total)}</dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => navigate("/customer/products")}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
              >
                Order More
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/customer/orders")}
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition-colors hover:text-brand-700"
        >
          <FaChevronLeft className="h-3.5 w-3.5" />
          Back to My Orders
        </button>
      </div>

      <ReviewModal
        open={reviewProduct !== null}
        onClose={handleCloseReview}
        product={reviewProduct || { name: "", image: "", unit: "", farmer: {} }}
        existingReview={existingReview}
      />
    </div>
  );
};

export default OrderDetails;