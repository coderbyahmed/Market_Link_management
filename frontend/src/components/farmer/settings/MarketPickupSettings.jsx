import { useState, useEffect } from "react";
import { Switch } from "antd";
import { FaPlus, FaPen, FaTrashAlt, FaGlobe, FaMapPin, FaClock } from "react-icons/fa";
import Button from "../../common/Button.jsx";
import EmptyState from "../common/EmptyState.jsx";
import ConfirmModal from "../common/ConfirmModal.jsx";
import { showSuccess, showError } from "../../common/feedback/MessageProvider.jsx";
import {
  getSettings,
  addMarket,
  updateMarket,
  deleteMarket,
  updateOperationDays,
  updateLocation,
} from "../../../services/settings.service.js";

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const MarketPickupSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marketModal, setMarketModal] = useState(null);
  const [savingMarket, setSavingMarket] = useState(false);
  const [marketForm, setMarketForm] = useState({
    name: "",
    address: "",
    days: [],
    open: "08:00",
    close: "14:00",
    lat: "",
    lng: "",
  });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [opDays, setOpDays] = useState([]);
  const [savingDays, setSavingDays] = useState(false);
  const [locationForm, setLocationForm] = useState({
    address: "",
    lat: "",
    lng: "",
  });
  const [savingLocation, setSavingLocation] = useState(false);

  useEffect(() => {
    const load = async () => {
      const s = await getSettings();
      setSettings(s);
      setOpDays(s.operations.days);
      setLocationForm(s.location);
      setLoading(false);
    };
    load();
  }, []);

  // Market modal
  const handleOpenMarketModal = (market = null) => {
    if (market) {
      setMarketForm({
        name: market.name,
        address: market.address,
        days: market.days,
        open: market.open,
        close: market.close,
        lat: market.lat?.toString() || "",
        lng: market.lng?.toString() || "",
      });
      setMarketModal({ mode: "edit", market });
    } else {
      setMarketForm({ name: "", address: "", days: [], open: "08:00", close: "14:00", lat: "", lng: "" });
      setMarketModal({ mode: "add" });
    }
  };

  const handleMarketFormChange = (key, value) => {
    if (key === "days") {
      setMarketForm((prev) => ({ ...prev, days: value }));
    } else {
      setMarketForm((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleDayToggle = (day) => {
    setMarketForm((prev) => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day],
    }));
  };

  const handleSaveMarket = async () => {
    if (!marketForm.name || !marketForm.address || marketForm.days.length === 0) {
      showError("Please fill all required fields and select at least one day.");
      return;
    }
    if (marketForm.close <= marketForm.open) {
      showError("Closing time must be later than opening time.");
      return;
    }

    setSavingMarket(true);
    try {
      if (marketModal.mode === "edit") {
        await updateMarket(marketModal.market.id, marketForm);
        showSuccess("Market updated.");
      } else {
        await addMarket(marketForm);
        showSuccess("Market added.");
      }
      setMarketModal(null);
      const s = await getSettings();
      setSettings(s);
    } catch (error) {
      showError(error.message || "Unable to save market");
    } finally {
      setSavingMarket(false);
    }
  };

  const handleDeleteMarket = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await deleteMarket(deleteTarget.id);
      showSuccess("Market deleted.");
      setDeleteTarget(null);
      const s = await getSettings();
      setSettings(s);
    } catch (error) {
      showError(error.message || "Unable to delete market");
    } finally {
      setDeleting(false);
    }
  };

  // Operating days
  const handleOpDayChange = (day, field, value) => {
    setOpDays((prev) =>
      prev.map((d) => (d.day === day ? { ...d, [field]: value } : d))
    );
  };

  const handleSaveDays = async () => {
    setSavingDays(true);
    try {
      await updateOperationDays(opDays);
      showSuccess("Operating days updated.");
    } catch (error) {
      showError(error.message || "Unable to update operating days");
    } finally {
      setSavingDays(false);
    }
  };

  // Location
  const handleLocationChange = (key, value) =>
    setLocationForm((prev) => ({ ...prev, [key]: value }));

  const handleSaveLocation = async () => {
    setSavingLocation(true);
    try {
      await updateLocation(locationForm);
      showSuccess("Location updated.");
    } catch (error) {
      showError(error.message || "Unable to update location");
    } finally {
      setSavingLocation(false);
    }
  };

  if (loading) return null;

  return (
    <div className="space-y-6">
      {/* Markets */}
      <div className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-display text-base font-semibold text-stone-900 dark:text-white flex items-center gap-2">
              <FaGlobe className="h-5 w-5" /> Markets
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400">Manage your market locations</p>
          </div>
          <Button onClick={() => handleOpenMarketModal()}>
            <FaPlus className="h-3.5 w-3.5" /> Add Market
          </Button>
        </div>

        {settings?.markets?.length === 0 ? (
          <EmptyState
            icon={FaGlobe}
            title="No markets added"
            description="Add your first market location so customers know where to find you."
            action={
              <Button onClick={() => handleOpenMarketModal()}>
                <FaPlus className="h-3.5 w-3.5" /> Add Market
              </Button>
            }
          />
        ) : (
          <ul className="space-y-3">
            {settings.markets.map((market) => (
              <li key={market.id} className="rounded-xl border border-stone-200/70 p-4 dark:border-stone-800">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-800 dark:text-stone-200">{market.name}</p>
                    <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{market.address}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
                      <span className="flex items-center gap-1">
                        <FaMapPin className="h-3 w-3" /> {market.lat.toFixed(4)}, {market.lng.toFixed(4)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock className="h-3 w-3" /> {market.open} - {market.close}
                      </span>
                      <span>
                        {market.days.map((d) => d.slice(0, 3)).join(", ")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenMarketModal(market)}
                      aria-label={`Edit ${market.name}`}
                      className="rounded-lg p-2 text-stone-500 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-stone-800"
                    >
                      <FaPen className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(market)}
                      aria-label={`Delete ${market.name}`}
                      className="rounded-lg p-2 text-stone-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                    >
                      <FaTrashAlt className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Operating Days & Pickup Windows */}
      <div className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <h3 className="font-display text-base font-semibold text-stone-900 dark:text-white flex items-center gap-2">
          <FaClock className="h-5 w-5" /> Operating Days & Pickup Windows
        </h3>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Enable days and set pickup time windows for each day.
        </p>

        <div className="mt-4 space-y-3">
          {WEEK_DAYS.map((day) => {
            const dayConfig = opDays.find((d) => d.day === day) || { day, enabled: false, start: "08:00", end: "14:00" };
            return (
              <div key={day} className="flex flex-wrap items-center gap-3 rounded-xl border border-stone-200/70 p-3 dark:border-stone-800">
                <div className="flex items-center gap-3 w-40 shrink-0">
                  <Switch
                    size="small"
                    checked={dayConfig.enabled}
                    onChange={(checked) => handleOpDayChange(day, "enabled", checked)}
                  />
                  <span className={`font-medium ${dayConfig.enabled ? "text-stone-800 dark:text-stone-200" : "text-stone-500"}`}>
                    {day}
                  </span>
                </div>
                {dayConfig.enabled && (
                  <div className="flex items-center gap-3">
                    <div className="w-44">
                      <label className="text-xs text-stone-500 dark:text-stone-400">Start</label>
                      <input
                        type="time"
                        value={dayConfig.start}
                        onChange={(e) => handleOpDayChange(day, "start", e.target.value)}
                        className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="w-44">
                      <label className="text-xs text-stone-500 dark:text-stone-400">End</label>
                      <input
                        type="time"
                        value={dayConfig.end}
                        onChange={(e) => handleOpDayChange(day, "end", e.target.value)}
                        className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      {dayConfig.end <= dayConfig.start ? "End must be after start" : "✓ Valid"}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={handleSaveDays} loading={savingDays}>
            Save Operating Days
          </Button>
        </div>
      </div>

      {/* Location */}
      <div className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <h3 className="font-display text-base font-semibold text-stone-900 dark:text-white flex items-center gap-2">
          <FaMapPin className="h-5 w-5" /> Pickup Location
        </h3>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Set the exact pickup location for customers.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="location-address" className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400">
              Address
            </label>
            <input
              id="location-address"
              type="text"
              value={locationForm.address}
              onChange={(e) => handleLocationChange("address", e.target.value)}
              className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm"
              placeholder="Pickup address"
            />
          </div>
          <div>
            <label htmlFor="location-lat" className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400">
              Latitude
            </label>
            <input
              id="location-lat"
              type="number"
              step="0.000001"
              value={locationForm.lat}
              onChange={(e) => handleLocationChange("lat", e.target.value)}
              className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm"
              placeholder="31.5204"
            />
          </div>
          <div>
            <label htmlFor="location-lng" className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400">
              Longitude
            </label>
            <input
              id="location-lng"
              type="number"
              step="0.000001"
              value={locationForm.lng}
              onChange={(e) => handleLocationChange("lng", e.target.value)}
              className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm"
              placeholder="74.3587"
            />
          </div>
        </div>

        {/* Mock Map Preview */}
        <div className="mt-4 rounded-xl border border-stone-200/70 bg-stone-50 p-6 dark:border-stone-800 dark:bg-stone-950">
          <div className="aspect-video rounded-lg bg-stone-200 flex items-center justify-center relative overflow-hidden dark:bg-stone-800">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-100 to-brand-50 dark:from-brand-900/30 dark:to-brand-800/30" />
            <div className="relative z-10 text-center text-stone-600 dark:text-stone-400">
              <FaMapPin className="mx-auto h-12 w-12 text-brand-500" />
              <p className="mt-2 font-medium">Map Preview (Mock)</p>
              <p className="text-sm">Lat: {locationForm.lat || "—"} / Lng: {locationForm.lng || "—"}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={handleSaveLocation} loading={savingLocation}>
            Save Location
          </Button>
        </div>
      </div>

      {/* Modals */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" style={{ display: marketModal ? "flex" : "none" }}>
        <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-stone-900">
          <h3 className="font-display text-lg font-semibold text-stone-900 dark:text-white mb-4">
            {marketModal?.mode === "edit" ? "Edit Market" : "Add Market"}
          </h3>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400">Market Name</label>
              <input
                type="text"
                value={marketForm.name}
                onChange={(e) => handleMarketFormChange("name", e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400">Address</label>
              <input
                type="text"
                value={marketForm.address}
                onChange={(e) => handleMarketFormChange("address", e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400">Operating Days</label>
              <div className="flex flex-wrap gap-2">
                {WEEK_DAYS.map((day) => (
                  <label key={day} className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-3 py-1.5 text-sm cursor-pointer dark:border-stone-700">
                    <input
                      type="checkbox"
                      checked={marketForm.days.includes(day)}
                      onChange={() => handleDayToggle(day)}
                      className="h-4 w-4 text-brand-600 rounded"
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400">Opening Time</label>
                <input
                  type="time"
                  value={marketForm.open}
                  onChange={(e) => handleMarketFormChange("open", e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400">Closing Time</label>
                <input
                  type="time"
                  value={marketForm.close}
                  onChange={(e) => handleMarketFormChange("close", e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400">Latitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={marketForm.lat}
                  onChange={(e) => handleMarketFormChange("lat", e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400">Longitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={marketForm.lng}
                  onChange={(e) => handleMarketFormChange("lng", e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm"
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setMarketModal(null)}>Cancel</Button>
            <Button onClick={handleSaveMarket} loading={savingMarket}>
              {marketModal?.mode === "edit" ? "Save Market" : "Add Market"}
            </Button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Market?"
        message={`Are you sure you want to delete "${deleteTarget?.name || ""}"? This action cannot be undone.`}
        confirmText="Delete Market"
        danger
        confirmLoading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteMarket}
      />
    </div>
  );
};

export default MarketPickupSettings;