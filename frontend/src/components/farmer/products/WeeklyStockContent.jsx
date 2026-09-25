import { useEffect, useMemo, useState } from "react";
import { Spin } from "antd";
import { FaBoxes } from "react-icons/fa";
import PageHeader from "../common/PageHeader.jsx";
import WeeklyStockDay from "./WeeklyStockDay.jsx";
import WeeklyStockItemModal from "./WeeklyStockItemModal.jsx";
import ConfirmModal from "../common/ConfirmModal.jsx";
import Button from "../../common/Button.jsx";
import {
  showSuccess,
  showError,
} from "../../common/feedback/MessageProvider.jsx";
import {
  getWeeklyStock,
  updateWeeklyStock,
  getProducts,
} from "../../../services/product.service.js";
import { WEEK_DAYS } from "./data/productOptions.js";

const newItemId = () =>
  `wks-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const WeeklyStockContent = () => {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, item: null, day: "Monday" });
  const [saving, setSaving] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [stock, productList] = await Promise.all([
          getWeeklyStock(),
          getProducts(),
        ]);
        setItems(stock);
        setProducts(productList);
      } catch (error) {
        showError(error.message || "Unable to load weekly stock");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const persist = async (next) => {
    setItems(next);

    try {
      await updateWeeklyStock(next);
    } catch (error) {
      showError(error.message || "Unable to save weekly stock");
    }
  };

  const openAdd = (day) => setModal({ open: true, item: null, day });
  const openEdit = (item) =>
    setModal({ open: true, item, day: item.day || "Monday" });
  const closeModal = () => setModal((prev) => ({ ...prev, open: false }));

  const handleSubmit = async (values) => {
    if (saving) return;

    setSaving(true);

    try {
      if (modal.item) {
        const next = items.map((item) =>
          item.id === modal.item.id
            ? { ...item, ...values, productName: values.productName }
            : item
        );
        await persist(next);
        showSuccess("Weekly stock updated successfully.");
      } else {
        const next = [
          ...items,
          {
            id: newItemId(),
            productName: values.productName,
            enabled: true,
            ...values,
          },
        ];
        await persist(next);
        showSuccess("Product added to weekly stock.");
      }

      closeModal();
    } catch (error) {
      showError(error.message || "Unable to save the stock item");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (item) => {
    await persist(
      items.map((entry) =>
        entry.id === item.id ? { ...entry, enabled: !entry.enabled } : entry
      )
    );
  };

  const handleRemove = async () => {
    if (!removeTarget) return;

    await persist(items.filter((item) => item.id !== removeTarget.id));
    setRemoveTarget(null);
    showSuccess("Weekly stock item removed.");
  };

  const handleSaveTemplate = async () => {
    if (savingTemplate) return;

    setSavingTemplate(true);

    try {
      await updateWeeklyStock(items);
      showSuccess("Weekly stock updated successfully.");
    } catch (error) {
      showError(error.message || "Unable to save the weekly template");
    } finally {
      setSavingTemplate(false);
    }
  };

  const grouped = useMemo(() => {
    const map = Object.fromEntries(WEEK_DAYS.map((day) => [day, []]));

    items.forEach((item) => {
      if (map[item.day]) map[item.day].push(item);
    });

    return map;
  }, [items]);

  const enabledCount = items.filter((item) => item.enabled).length;
  const configuredDays = WEEK_DAYS.filter(
    (day) => grouped[day].length > 0
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weekly Stock"
        description="Plan the recurring stock you publish for every day of the week."
        actions={
          <Button onClick={handleSaveTemplate} loading={savingTemplate}>
            Save Template
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2 text-xs font-semibold">
        <span className="rounded-full bg-brand-50 px-3 py-1.5 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
          {items.length} scheduled {items.length === 1 ? "item" : "items"}
        </span>
        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          {enabledCount} enabled
        </span>
        <span className="rounded-full bg-stone-100 px-3 py-1.5 text-stone-600 dark:bg-stone-800 dark:text-stone-300">
          {configuredDays} of 7 days configured
        </span>
      </div>

      {items.length === 0 && (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-10 text-center dark:border-stone-700 dark:bg-stone-900">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500">
            <FaBoxes className="h-7 w-7" />
          </span>
          <p className="mt-4 text-sm font-semibold text-stone-700 dark:text-stone-300">
            No weekly stock has been configured yet.
          </p>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Start by adding a product to a day below.
          </p>
          <div className="mt-4">
            <Button onClick={() => openAdd("Monday")}>Add Monday Stock</Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {WEEK_DAYS.map((day) => (
          <WeeklyStockDay
            key={day}
            day={day}
            items={grouped[day]}
            onAdd={openAdd}
            onEdit={openEdit}
            onToggle={handleToggle}
            onRemove={setRemoveTarget}
          />
        ))}
      </div>

      <WeeklyStockItemModal
        open={modal.open}
        item={modal.item}
        defaultDay={modal.day}
        products={products}
        saving={saving}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        open={Boolean(removeTarget)}
        title="Remove Stock Item?"
        message={`Are you sure you want to remove "${
          removeTarget?.productName || ""
        }" from ${removeTarget?.day || "this day"}? This action cannot be undone.`}
        confirmText="Remove"
        danger
        onCancel={() => setRemoveTarget(null)}
        onConfirm={handleRemove}
      />
    </div>
  );
};

export default WeeklyStockContent;
