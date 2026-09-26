import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaChevronRight } from "react-icons/fa";
import { Tabs, Skeleton } from "antd";
import EmptyState from "../../components/farmer/common/EmptyState.jsx";
import Button from "../../components/common/Button.jsx";
import { getOrders } from "../../services/customerOrder.service.js";
import { getOrderStatusMeta } from "../../components/customer/data/orderStatus.js";
import { formatPrice } from "../../components/customer/data/productMeta.js";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrders()
      .then((list) => {
        setOrders(list);
        setError("");
      })
      .catch((loadError) => {
        setError(loadError.message || "Unable to load orders");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = (key) => {
    if (key === "all") return orders;
    if (key === "delivered") return orders.filter((order) => order.status === "delivered");
    if (key === "cancelled") return orders.filter((order) => order.status === "cancelled");
    return orders.filter(
      (order) => order.status !== "delivered" && order.status !== "cancelled"
    );
  };

  const formattedDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const renderList = (key) => {
    const list = filteredOrders(key);

    if (list.length === 0) {
      return (
        <EmptyState
          icon={<FaBoxOpen className="h-10 w-10 text-brand-300" />}
          title="No orders here yet"
          description="When you shop the marketplace, your orders will show up here."
          actionLabel="Go Shopping"
          onAction={() => navigate("/customer/products")}
        />
      );
    }

    return (
      <div className="mt-6 space-y-4">
        {list.map((order) => {
          const meta = getOrderStatusMeta(order.status);
          return (
            <button
              key={order.id}
              type="button"
              onClick={() => navigate(`/customer/orders/${order.id}`)}
              className="block w-full rounded-2xl border border-stone-200/80 bg-white p-5 text-left transition-all hover:border-brand-300 hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-stone-900">{order.id}</p>
                  <p className="text-xs text-stone-500">
                    Placed on {formattedDate(order.createdAt)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${meta.badge}`}
                >
                  {meta.label}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex -space-x-2">
                  {order.items.slice(0, 4).map((item) => (
                    <img
                      key={item.productId}
                      src={item.image}
                      alt={item.name}
                      className="h-10 w-10 rounded-full border-2 border-white object-cover"
                      title={item.name}
                    />
                  ))}
                  {order.items.length > 4 && (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-stone-100 text-xs font-semibold text-stone-500">
                      +{order.items.length - 4}
                    </span>
                  )}
                </div>
                <span className="text-sm text-stone-500">
                  {order.items.length} {order.items.length === 1 ? "item" : "items"} •{" "}
                  <span className="font-semibold text-stone-900">
                    {formatPrice(order.total)}
                  </span>
                </span>
                <FaChevronRight className="h-4 w-4 text-stone-300" />
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-cream/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream/40">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-stone-900">
              My Orders
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              Track and manage everything you've ordered.
            </p>
          </div>
          <Button to="/customer/products" variant="outline" size="sm">
            Shop More
          </Button>
        </div>

        {error ? (
          <EmptyState
            title="Could not load orders"
            description={error}
            actionLabel="Try Again"
            onAction={() => window.location.reload()}
          />
        ) : (
          <Tabs
            defaultActiveKey="all"
            items={[
              { key: "all", label: "All", children: renderList("all") },
              { key: "active", label: "Active", children: renderList("active") },
              { key: "delivered", label: "Delivered", children: renderList("delivered") },
              { key: "cancelled", label: "Cancelled", children: renderList("cancelled") },
            ]}
            className="orders-tabs"
          />
        )}
      </div>
    </div>
  );
};

export default Orders;