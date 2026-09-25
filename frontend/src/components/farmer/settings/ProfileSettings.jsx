import { useState } from "react";
import { Input } from "antd";
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Button from "../../common/Button.jsx";
import { showSuccess, showError } from "../../common/feedback/MessageProvider.jsx";
import { useFarmerProfileImage } from "../../../context/useFarmerProfileImage.js";
import { updateFarmerProfile } from "../../../services/farmerProfile.service.js";

const ProfileSettings = () => {
  const { avatar, setAvatar } = useFarmerProfileImage();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateFarmerProfile({
        name: form.name,
        email: form.email,
        phone: form.phone,
      });
      showSuccess("Profile updated successfully.");
    } catch (error) {
      showError(error.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={avatar}
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <label className="absolute bottom-0 right-0 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => setAvatar(reader.result);
                  reader.readAsDataURL(file);
                }
              }}
            />
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-brand-700 text-white text-sm font-medium shadow-md hover:bg-brand-800">
              ✎
            </span>
          </label>
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg font-semibold text-stone-900 dark:text-white">
            Profile Picture
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Click the pen icon to change your profile photo.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="profile-name" className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400">
            Full Name
          </label>
          <Input
            id="profile-name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            prefix={<FaUser className="text-stone-400" />}
            className="w-full"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label htmlFor="profile-phone" className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400">
            Contact Number
          </label>
          <Input
            id="profile-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            prefix={<FaPhone className="text-stone-400" />}
            className="w-full"
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <label htmlFor="profile-email" className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400">
            Email Address
          </label>
          <Input
            id="profile-email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            prefix={<FaEnvelope className="text-stone-400" />}
            className="w-full"
            placeholder="Enter email address"
          />
        </div>
        <div>
          <label htmlFor="profile-address" className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400">
            Address
          </label>
          <Input
            id="profile-address"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            prefix={<FaMapMarkerAlt className="text-stone-400" />}
            className="w-full"
            placeholder="Enter your address"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-stone-200/70 dark:border-stone-800">
        <Button variant="outline" onClick={() => setForm({ name: "", phone: "", email: "", address: "" })}>
          Cancel
        </Button>
        <Button onClick={handleSave} loading={saving}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettings;