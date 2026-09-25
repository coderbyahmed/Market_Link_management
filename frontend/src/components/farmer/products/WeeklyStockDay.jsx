import { Switch } from "antd";
import { FaPlus } from "react-icons/fa";
import AvailabilityBadge from "./AvailabilityBadge.jsx";
import Button from "../../common/Button.jsx";
import { unitLabel } from "./data/productOptions.js";

const WeeklyStockDay = ({ day, items, onAdd, onEdit, onToggle, onRemove }) => {
  return (
    <section className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight text-stone-900 dark:text-white">
            {day}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {items.length} {items.length === 1 ? "item" : "items"} scheduled
          </p>
        </div>

        <Button size="sm" variant="outline" onClick={() => onAdd(day)}>
          <FaPlus className="h-3 w-3" /> Add
        </Button>
      </header>

      {items.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-stone-200 px-4 py-6 text-center text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400">
          No stock planned for this day.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-stone-100 dark:divide-stone-800">
          {items.map((item) => (
            <li
              key={item.id}
              className={`flex flex-wrap items-center gap-3 py-3 ${
                item.enabled ? "" : "opacity-60"
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-stone-800 dark:text-stone-200">
                  {item.productName}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {item.quantity} {unitLabel(item.unit)} · Rs.{" "}
                  {Number(item.price).toLocaleString()}
                </p>
              </div>

              <AvailabilityBadge availability={item.availability} />

              <Switch
                size="small"
                checked={item.enabled}
                onChange={() => onToggle(item)}
                checkedChildren="On"
                unCheckedChildren="Off"
              />

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="!border-red-300 !text-red-600 hover:!bg-red-50"
                  onClick={() => onRemove(item)}
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default WeeklyStockDay;
