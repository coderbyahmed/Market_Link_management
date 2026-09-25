import { useState, useEffect } from "react";
import { Input } from "antd";
import { FaBuilding, FaUserTie, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Button from "../../common/Button.jsx";
import { showSuccess, showError } from "../../common/feedback/MessageProvider.jsx";
import { getSettings, updateSettings } from "../../../services/settings.service.js";

const BusinessSettings = () => {
  const [form, setForm] = useState({
    stallName: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    businessAddress: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const settings = await getSettings();
      setForm(settings.business);
    };
    load();
  }, []);

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings("business", form);
      showSuccess("Business information updated successfully.");
    } catch (error) {
      showError(error.message || "Unable to update business information");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="stall-name" className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400">
            Stall / Business Name
          </label>
          <Input
            id="stall-name"
            value={form.stallName}
            onChange={(e) => handleChange("stallName", e.target.value)}
            prefix={<FaBuilding className="text-stone-400" />}
            className="w-full"
            placeholder="Enter business name"
          />
        </div>
        <div>
          <label htmlFor="contact-person" className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400">
            Contact Person
          </label>
          <Input
            id="contact-person"
            value={form.contactPerson}
            onChange={(e) => handleChange("contactPerson", e.target.value)}
            prefix={<FaUserTie className="text-stone-400" />}
            className="w-full"
            placeholder="Enter contact person name"
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400">
            Contact Number
          </label>
          <Input
            id="contact-phone"
            type="tel"
            value={form.contactPhone}
            onChange={(e) => handleChange("contactPhone", e.target.value)}
            prefix={<FaPhone className="text-stone-400" />}
            className="w-full"
            placeholder="Enter contact number"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400">
            Email
          </label>
          <Input
            id="contact-email"
            type="email"
            value={form.contactEmail}
            onChange={(e) => handleChange("contactEmail", e.target.value)}
            prefix={<FaEnvelope className="text-stone-400" />}
            className="w-full"
            placeholder="Enter email"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="business-address" className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400">
            Business Address
          </label>
          <Input
            id="business-address"
            value={form.businessAddress}
            onChange={(e) => handleChange("businessAddress", e.target.value)}
            prefix={<FaMapMarkerAlt className="text-stone-400" />}
            className="w-full"
            placeholder="Enter business address"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-stone-200/70 dark:border-stone-800">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Cancel
        </Button>
        <Button onClick={handleSave} loading={saving}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default BusinessSettings;