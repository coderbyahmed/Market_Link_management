import { useState, useEffect } from "react";
import { Switch } from "antd";
import { FaBell, FaEnvelope, FaMobileAlt } from "react-icons/fa";
import Button from "../../common/Button.jsx";
import { showSuccess, showError } from "../../common/feedback/MessageProvider.jsx";
import { getSettings, updateNotifications } from "../../../services/settings.service.js";

const NOTIFICATION_TYPES = [
  { key: "newOrder", label: "New Order Notifications", desc: "When a customer places a new pre-order" },
  { key: "orderReady", label: "Order Ready Notifications", desc: "When an order is ready for pickup" },
  { key: "review", label: "Customer Review Notifications", desc: "When a customer leaves a review" },
  { key: "stockAlert", label: "Product/Stock Alerts", desc: "When stock is low or sold out" },
  { key: "weeklyReport", label: "Weekly Report Notifications", desc: "Weekly summary of sales and activity" },
];

const NotificationsSettings = () => {
  const [prefs, setPrefs] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const settings = await getSettings();
      setPrefs(settings.notifications);
    };
    load();
  }, []);

  const handleChange = (type, channel, value) => {
    setPrefs((prev) => ({
      ...prev,
      [type]: { ...prev[type], [channel]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateNotifications(prefs);
      showSuccess("Notification preferences updated.");
    } catch (error) {
      showError(error.message || "Unable to update notifications");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-stone-500 dark:text-stone-400">
        Choose how you want to be notified for each event type.
      </p>

      <div className="overflow-hidden rounded-xl border border-stone-200/70 bg-white dark:border-stone-800">
        <div className="grid grid-cols-3 border-b border-stone-200/70 px-4 py-3 text-sm font-semibold text-stone-600 dark:border-stone-800 dark:text-stone-400">
          <div className="flex items-center gap-2"><FaBell className="h-4 w-4" /> Event</div>
          <div className="text-center"><FaEnvelope className="h-4 w-4" /> Email</div>
          <div className="text-center"><FaMobileAlt className="h-4 w-4" /> In-App</div>
        </div>

        <div className="divide-y divide-stone-200/70 dark:divide-stone-800">
          {NOTIFICATION_TYPES.map(({ key, label, desc }) => (
            <div key={key} className="grid grid-cols-3 px-4 py-4 items-center gap-4">
              <div className="flex flex-col">
                <span className="font-medium text-stone-800 dark:text-stone-200">{label}</span>
                <span className="text-xs text-stone-500 dark:text-stone-400">{desc}</span>
              </div>
              <div className="flex justify-center">
                <Switch
                  size="small"
                  checked={prefs?.[key]?.email}
                  onChange={(checked) => handleChange(key, "email", checked)}
                />
              </div>
              <div className="flex justify-center">
                <Switch
                  size="small"
                  checked={prefs?.[key]?.inApp}
                  onChange={(checked) => handleChange(key, "inApp", checked)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} loading={saving}>
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default NotificationsSettings;