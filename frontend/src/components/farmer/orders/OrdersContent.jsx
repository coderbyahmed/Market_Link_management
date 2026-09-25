import { useEffect, useMemo, useState } from "react";
import { Tabs } from "antd";
import { FaSyncAlt } from "react-icons/fa";
import PageHeader from "../common/PageHeader.jsx";
import Button from "../../common/Button.jsx";
import SearchInput from "../common/SearchInput.jsx";
import FilterBar from "../common/FilterBar.jsx";
import ConfirmModal from "../common/ConfirmModal.jsx";
import OrderStats from "./OrderStats.jsx";
import OrderTable from "./OrderTable.jsx";
import OrderDetailsDrawer from "./OrderDetailsDrawer.jsx";
import PickupSettings from "./PickupSettings.jsx";
import {
  showSuccess,
  showError,
} from "../../common/feedback/MessageProvider.jsx";
import {
  getOrders,
  updateOrderStatus,
  getPickupSettings,
} from "../../../services/order.service.js";
import {
  STATUS_OPTIONS_ACTIVE,
  ORDER_DATE_OPTIONS,
  PICKUP_DATE_OPTIONS,
  ORDER_SORT_OPTIONS,
  HISTORY_STATUSES,
  STATUS_CHANGE_META,
  matchesOrderDateFilter,
  matchesPickupDateFilter,
} from "./data/orderOptions.js";

const DEFAULT_FILTERS = {
  status: "all",
  orderDate: "all",
  pickupDate: "all",
  sort: "newest",
};

const FILTER_FIELDS = [
  { key: "status", label: "Status", options: STATUS_OPTIONS_ACTIVE },
  { key: "orderDate", label: "Date", options: ORDER_DATE_OPTIONS },
  { key: "pickupDate", label: "Pickup Date", options: PICKUP_DATE_OPTIONS },
  { key: "sort", label: "Sort", options: ORDER_SORT_OPTIONS },
];

const SORTERS = {
  newest: (a, b) => new Date(b.orderDate) - new Date(a.orderDate),
  oldest: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
  total_desc: (a, b) => b.total - a.total,
  total_asc: (a, b) => a.total - b.total,
};

const OrdersContent = () => {
  const [orders, setOrders] = useState([]);
  const [pickupSettings, setPickupSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [detailsOrder, setDetailsOrder] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [list, settings] = await Promise.all([
          getOrders(),
          getPickupSettings(),
        ]);
        setOrders(list);
        setPickupSettings(settings);
      } catch (error) {
        showError(error.message || "Unable to load orders");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleRefresh = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const [list, settings] = await Promise.all([
        getOrders(),
        getPickupSettings(),
      ]);
      setOrders(list);
      setPickupSettings(settings);
    } catch (error) {
      showError(error.message || "Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  const setFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const resetFilters = () => {
    setSearch("");
    setFilters(DEFAULT_FILTERS);
  };

  const activeOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    const matchesSearch = (order) =>
      !query ||
      order.id.toLowerCase().includes(query) ||
      order.customer.name.toLowerCase().includes(query) ||
      order.customer.phone.toLowerCase().includes(query) ||
      order.items.some((item) => item.name.toLowerCase().includes(query));

    const filtered = orders.filter(
      (order) =>
        !HISTORY_STATUSES.includes(order.status) &&
        matchesSearch(order) &&
        (filters.status === "all" || order.status === filters.status) &&
        matchesOrderDateFilter(order, filters.orderDate) &&
        matchesPickupDateFilter(order, filters.pickupDate)
    );

    return [...filtered].sort(SORTERS[filters.sort] || SORTERS.newest);
  }, [orders, search, filters]);

  const historyOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = orders.filter(
      (order) =>
        HISTORY_STATUSES.includes(order.status) &&
        (!query ||
          order.id.toLowerCase().includes(query) ||
          order.customer.name.toLowerCase().includes(query) ||
          order.customer.phone.toLowerCase().includes(query) ||
          order.items.some((item) => item.name.toLowerCase().includes(query)))
    );

    return [...filtered].sort(SORTERS.oldest);
  }, [orders, search]);

  const hasActiveFilters =
    Boolean(search.trim()) ||
    filters.status !== "all" ||
    filters.orderDate !== "all" ||
    filters.pickupDate !== "all" ||
    filters.sort !== "newest";

  const handleAction = (action, order) => {
    setPendingAction({ action, order });
  };

  const handleConfirmAction = async () => {
    if (!pendingAction || acting) return;

    const meta = STATUS_CHANGE_META[pendingAction.action];
    if (!meta) return;

    setActing(true);

    try {
      const updated = await updateOrderStatus(pendingAction.order.id, meta.next);
      setOrders((prev) =>
        prev.map((order) => (order.id === updated.id ? updated : order))
      );
      setDetailsOrder((prev) =>
        prev && prev.id === updated.id ? updated : prev
      );
      setPendingAction(null);
      showSuccess(meta.success);
    } catch (error) {
      showError(error.message || "Unable to update the order");
    } finally {
      setActing(false);
    }
  };

  const ordersTab = (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by order ID, customer or product..."
        />
        <FilterBar
          fields={FILTER_FIELDS}
          values={filters}
          onChange={setFilter}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      <OrderTable
        orders={activeOrders}
        loading={loading}
        onView={setDetailsOrder}
        onAction={handleAction}
        emptyTitle={
          orders.length === 0 ? "No orders yet" : "No orders found"
        }
        emptyDescription={
          orders.length === 0
            ? "Incoming customer pre-orders will appear here."
            : "Try changing your search or filters."
        }
      />
    </div>
  );

  const historyTab = (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search order history..."
        />
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {historyOrders.length} record{historyOrders.length === 1 ? "" : "s"}
        </p>
      </div>

      <OrderTable
        orders={historyOrders}
        loading={loading}
        onView={setDetailsOrder}
        onAction={handleAction}
        emptyTitle="No order history yet"
        emptyDescription="Completed, cancelled and declined orders will be kept here."
      />
    </div>
  );

  const pendingMeta = pendingAction
    ? STATUS_CHANGE_META[pendingAction.action]
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Manage incoming pre-orders, pickup slots and order history."
        actions={
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            aria-label="Refresh orders"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} /> Refresh
          </Button>
        }
      />

      <OrderStats orders={orders} />

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "orders",
            label: `All Orders (${activeOrders.length})`,
            children: ordersTab,
          },
          {
            key: "history",
            label: `Order History (${historyOrders.length})`,
            children: historyTab,
          },
          {
            key: "pickup",
            label: "Pickup Settings",
            children: (
              <PickupSettings
                key={pickupSettings ? "pickup-ready" : "pickup-loading"}
                settings={pickupSettings}
                loading={loading}
                onSettingsChange={setPickupSettings}
              />
            ),
          },
        ]}
      />

      <OrderDetailsDrawer
        order={detailsOrder}
        open={Boolean(detailsOrder)}
        onClose={() => setDetailsOrder(null)}
        onAction={handleAction}
      />

      <ConfirmModal
        open={Boolean(pendingAction && pendingMeta)}
        title={pendingMeta?.title || "Confirm"}
        message={
          pendingAction && pendingMeta
            ? pendingMeta.buildMessage(pendingAction.order)
            : ""
        }
        confirmText={pendingMeta?.confirmText || "Confirm"}
        danger={pendingMeta?.danger || false}
        confirmLoading={acting}
        onCancel={() => setPendingAction(null)}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default OrdersContent;
