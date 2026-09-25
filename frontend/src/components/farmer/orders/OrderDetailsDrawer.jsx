import { Drawer, Tag, Descriptions } from "antd";
import Button from "../../common/Button.jsx";
import { formatShortDate } from "../../../utils/date.js";
import {
  ORDER_STATUS_META,
  STATUS_ACTIONS,
  PASSIVE_PAYMENT_LABEL,
  formatMoney,
} from "./data/orderOptions.js";

const OrderDetailsDrawer = ({ order, open, onClose, onAction }) => {
  const actions = order ? STATUS_ACTIONS[order.status] || [] : [];
  const primaryAction = actions[0];

  return (
    <Drawer
      title={
        order ? (
          <span className="flex items-center gap-2">
            {order.id}
            <Tag
              className="!m-0 !rounded-full"
              color={ORDER_STATUS_META[order.status].tagColor}
            >
              {ORDER_STATUS_META[order.status].label}
            </Tag>
          </span>
        ) : (
          "Order Details"
        )
      }
      placement="right"
      open={open}
      onClose={onClose}
      width={440}
      className="max-w-full"
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {order && primaryAction && (
            <Button onClick={() => onAction(primaryAction.action, order)}>
              {primaryAction.label}
            </Button>
          )}
        </div>
      }
    >
      {order && (
        <div className="space-y-5">
          <section className="rounded-2xl border border-stone-200/70 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-950">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Customer
            </p>
            <p className="mt-1.5 font-medium text-stone-800 dark:text-stone-200">
              {order.customer.name}
            </p>
            <p className="mt-0.5 text-sm text-stone-600 dark:text-stone-400">
              {order.customer.phone}
            </p>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              {order.customer.email}
            </p>
          </section>

          <section>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Ordered Products
            </p>
            <ul className="mt-2 space-y-2">
              {order.items.map((item) => (
                <li
                  key={item.productId}
                  className="flex items-start justify-between gap-3 rounded-xl border border-stone-200/70 px-3 py-2.5 dark:border-stone-800"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-stone-800 dark:text-stone-200">
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                      {item.quantity} × {formatMoney(item.price)}
                    </p>
                  </div>
                  <span className="whitespace-nowrap text-sm font-semibold text-stone-800 dark:text-stone-200">
                    {formatMoney(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-stone-200/70 p-4 dark:border-stone-800">
            <div className="flex items-center justify-between text-sm text-stone-600 dark:text-stone-400">
              <span>Subtotal</span>
              <span>{formatMoney(order.total)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-stone-200 pt-2 dark:border-stone-800">
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                Total
              </span>
              <span className="font-semibold text-stone-900 dark:text-white">
                {formatMoney(order.total)}
              </span>
            </div>
          </section>

          <Descriptions
            column={1}
            size="small"
            labelStyle={{ color: "inherit" }}
            items={[
              {
                key: "orderDate",
                label: "Order Date",
                children: formatShortDate(order.orderDate),
              },
              {
                key: "pickupDate",
                label: "Pickup Date",
                children: order.pickupLabel,
              },
              {
                key: "pickupSlot",
                label: "Pickup Slot",
                children: order.pickupSlot,
              },
              {
                key: "status",
                label: "Order Status",
                children: ORDER_STATUS_META[order.status].label,
              },
              {
                key: "payment",
                label: "Payment Method",
                children: (
                  <span className="font-medium text-stone-800 dark:text-stone-200">
                    {PASSIVE_PAYMENT_LABEL}
                  </span>
                ),
              },
              ...(order.note
                ? [
                    {
                      key: "note",
                      label: "Note",
                      children: order.note,
                    },
                  ]
                : []),
            ]}
          />
        </div>
      )}
    </Drawer>
  );
};

export default OrderDetailsDrawer;
