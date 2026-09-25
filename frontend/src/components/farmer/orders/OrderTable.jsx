import { Table, Tag } from "antd";
import { FaClipboardList } from "react-icons/fa";
import Button from "../../common/Button.jsx";
import { formatShortDate } from "../../../utils/date.js";
import {
  ORDER_STATUS_META,
  STATUS_ACTIONS,
  formatMoney,
} from "./data/orderOptions.js";

const toneClass = {
  primary:
    "bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-900 border border-transparent",
  danger:
    "border border-red-300 bg-white text-red-600 hover:bg-red-50 dark:bg-transparent",
};

const OrderTable = ({
  orders,
  loading = false,
  onView,
  onAction,
  emptyTitle = "No orders found",
  emptyDescription = "Try changing your search or filters.",
  emptyAction = null,
}) => {
  const columns = [
    {
      title: "Order",
      key: "order",
      width: 150,
      render: (_, order) => (
        <div>
          <p className="font-medium text-stone-800 dark:text-stone-200">
            {order.id}
          </p>
          <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
            {formatShortDate(order.orderDate)}
          </p>
        </div>
      ),
    },
    {
      title: "Customer",
      key: "customer",
      width: 180,
      render: (_, order) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-stone-800 dark:text-stone-200">
            {order.customer.name}
          </p>
          <p className="mt-0.5 truncate text-xs text-stone-500 dark:text-stone-400">
            {order.customer.phone}
          </p>
        </div>
      ),
    },
    {
      title: "Items",
      key: "items",
      width: 220,
      render: (_, order) => {
        const first = order.items[0];
        const extra = order.items.length - 1;

        return (
          <div className="min-w-0">
            <p className="truncate text-sm text-stone-700 dark:text-stone-300">
              {first.name} × {first.quantity}
            </p>
            {extra > 0 && (
              <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                +{extra} more item{extra > 1 ? "s" : ""}
              </p>
            )}
          </div>
        );
      },
    },
    {
      title: "Total",
      key: "total",
      width: 120,
      render: (_, order) => (
        <span className="whitespace-nowrap font-semibold text-stone-800 dark:text-stone-200">
          {formatMoney(order.total)}
        </span>
      ),
    },
    {
      title: "Pickup",
      key: "pickup",
      width: 170,
      render: (_, order) => (
        <div>
          <p className="whitespace-nowrap text-sm text-stone-700 dark:text-stone-300">
            {order.pickupLabel}
          </p>
          <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
            {order.pickupSlot}
          </p>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 150,
      render: (_, order) => (
        <Tag className="!m-0 !rounded-full" color={ORDER_STATUS_META[order.status].tagColor}>
          {ORDER_STATUS_META[order.status].label}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      width: 300,
      render: (_, order) => (
        <div className="flex flex-wrap items-center justify-end gap-2">
          {(STATUS_ACTIONS[order.status] || []).map((entry) => (
            <button
              key={entry.action}
              type="button"
              onClick={() => onAction(entry.action, order)}
              className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 ${toneClass[entry.tone]}`}
            >
              {entry.label}
            </button>
          ))}
          <Button size="sm" variant="outline" onClick={() => onView(order)}>
            View
          </Button>
        </div>
      ),
    },
  ];

  const emptyNode = (
    <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500">
        <FaClipboardList className="h-7 w-7" />
      </span>
      <p className="mt-4 text-sm font-semibold text-stone-700 dark:text-stone-300">
        {emptyTitle}
      </p>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
        {emptyDescription}
      </p>
      {emptyAction && <div className="mt-4">{emptyAction}</div>}
    </div>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200/70 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <Table
        rowKey="id"
        dataSource={orders}
        columns={columns}
        loading={loading}
        locale={{ emptyText: emptyNode }}
        scroll={{ x: 1240 }}
        pagination={{ pageSize: 8, showSizeChanger: false }}
      />
    </div>
  );
};

export default OrderTable;
