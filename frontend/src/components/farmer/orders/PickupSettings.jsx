import { useState } from "react";
import { Switch, Tag } from "antd";
import { FaPlus, FaPen, FaTrashAlt, FaClock } from "react-icons/fa";
import Button from "../../common/Button.jsx";
import EmptyState from "../common/EmptyState.jsx";
import ConfirmModal from "../common/ConfirmModal.jsx";
import PickupSlotModal from "./PickupSlotModal.jsx";
import {
  showSuccess,
  showError,
} from "../../common/feedback/MessageProvider.jsx";
import {
  updatePickupSettings,
  saveSlot,
  deleteSlot,
  toggleSlot,
} from "../../../services/order.service.js";

const PickupSettings = ({
  settings,
  loading = false,
  onSettingsChange,
}) => {
  const [cutoff, setCutoff] = useState(settings?.cutoff || "18:00");
  const [savingCutoff, setSavingCutoff] = useState(false);
  const [slotModal, setSlotModal] = useState(null); // null | { mode: "add" } | { mode: "edit", slot }
  const [savingSlot, setSavingSlot] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fieldClass =
    "w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-200";

  const handleSaveCutoff = async () => {
    if (!cutoff) {
      showError("Please select an order cutoff time.");
      return;
    }

    setSavingCutoff(true);

    try {
      const updated = await updatePickupSettings({ cutoff });
      onSettingsChange(updated);
      showSuccess("Pickup settings updated successfully.");
    } catch (error) {
      showError(error.message || "Unable to update pickup settings");
    } finally {
      setSavingCutoff(false);
    }
  };

  const handleSlotSubmit = async (values) => {
    if (savingSlot) return;

    setSavingSlot(true);

    try {
      const updated = await saveSlot(
        slotModal?.slot ? { id: slotModal.slot.id, ...values } : values
      );
      onSettingsChange(updated);
      setSlotModal(null);
      showSuccess(
        slotModal?.mode === "edit"
          ? "Pickup slot updated."
          : "Pickup slot added."
      );
    } catch (error) {
      showError(error.message || "Unable to save the pickup slot");
    } finally {
      setSavingSlot(false);
    }
  };

  const handleToggleSlot = async (slot) => {
    try {
      const updated = await toggleSlot(slot.id);
      onSettingsChange(updated);
      showSuccess(
        `Pickup slot ${slot.label} ${
          updated.slots.find((entry) => entry.id === slot.id)?.enabled
            ? "enabled"
            : "disabled"
        }.`
      );
    } catch (error) {
      showError(error.message || "Unable to update the pickup slot");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleting) return;

    setDeleting(true);

    try {
      const updated = await deleteSlot(deleteTarget.id);
      onSettingsChange(updated);
      setDeleteTarget(null);
      showSuccess("Pickup slot deleted.");
    } catch (error) {
      showError(error.message || "Unable to delete the pickup slot");
    } finally {
      setDeleting(false);
    }
  };

  const slots = settings?.slots || [];

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      {/* Order cutoff time */}
      <div className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
            <FaClock className="h-4.5 w-4.5" />
          </span>
          <div>
            <h3 className="font-display text-base font-semibold text-stone-900 dark:text-white">
              Order Cutoff Time
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Pre-orders close at this time each day.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-end gap-3">
          <div className="w-full sm:w-44">
            <label
              htmlFor="cutoff-time"
              className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400"
            >
              Cutoff Time
            </label>
            <input
              id="cutoff-time"
              type="time"
              value={cutoff}
              disabled={loading}
              onChange={(event) => setCutoff(event.target.value)}
              className={fieldClass}
            />
          </div>

          <Button
            onClick={handleSaveCutoff}
            loading={savingCutoff}
            disabled={loading}
          >
            Save Changes
          </Button>
        </div>

        <p className="mt-4 rounded-xl bg-stone-50 px-3 py-2.5 text-xs text-stone-500 dark:bg-stone-950 dark:text-stone-400">
          Customers cannot place pre-orders after {cutoff || "—"} on the
          selected pickup day.
        </p>
      </div>

      {/* Pickup slots */}
      <div className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-base font-semibold text-stone-900 dark:text-white">
              Pickup Slots
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Enable the time windows customers can reserve.
            </p>
          </div>

          <Button size="sm" onClick={() => setSlotModal({ mode: "add" })}>
            <FaPlus className="h-3.5 w-3.5" /> Add Slot
          </Button>
        </div>

        {slots.length === 0 ? (
          <EmptyState
            icon={FaClock}
            title="No pickup slots"
            description="Add a time window so customers can pick a slot."
            action={
              <Button size="sm" onClick={() => setSlotModal({ mode: "add" })}>
                <FaPlus className="h-3.5 w-3.5" /> Add Slot
              </Button>
            }
          />
        ) : (
          <ul className="mt-4 space-y-2.5">
            {slots.map((slot) => (
              <li
                key={slot.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200/70 px-4 py-3 dark:border-stone-800"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-stone-800 dark:text-stone-200">
                    {slot.label}
                  </span>
                  <Tag
                    className="!m-0 !rounded-full"
                    color={slot.enabled ? "green" : "default"}
                  >
                    {slot.enabled ? "Enabled" : "Disabled"}
                  </Tag>
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    size="small"
                    checked={slot.enabled}
                    onChange={() => handleToggleSlot(slot)}
                    aria-label={`Toggle slot ${slot.label}`}
                  />
                  <button
                    type="button"
                    onClick={() => setSlotModal({ mode: "edit", slot })}
                    aria-label={`Edit slot ${slot.label}`}
                    className="rounded-lg p-2 text-stone-500 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-stone-800"
                  >
                    <FaPen className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(slot)}
                    aria-label={`Delete slot ${slot.label}`}
                    className="rounded-lg p-2 text-stone-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                  >
                    <FaTrashAlt className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <PickupSlotModal
        key={slotModal ? (slotModal.slot?.id || "slot-add") : "slot-closed"}
        slot={slotModal?.slot}
        open={Boolean(slotModal)}
        saving={savingSlot}
        onClose={() => setSlotModal(null)}
        onSubmit={handleSlotSubmit}
      />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Pickup Slot?"
        message={`Are you sure you want to delete the "${deleteTarget?.label || ""}" pickup slot? Customers will no longer see it.`}
        confirmText="Delete Slot"
        danger
        confirmLoading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default PickupSettings;
