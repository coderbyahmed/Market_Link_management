import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Tabs } from "antd";
import {
  FaMapMarkerAlt,
  FaUserEdit,
  FaKey,
  FaBell,
  FaCheckCircle,
} from "react-icons/fa";
import { showSuccess, showError } from "../../components/common/feedback/MessageProvider.jsx";
import {
  getProfile,
  updateProfile,
  saveProfileImage,
  changePassword,
} from "../../services/customer.service.js";
import { updateStoredUser } from "../../utils/auth.js";
import { validateProfile, validatePasswordChange } from "../../validations/customer.validation.js";
import EmptyState from "../../components/farmer/common/EmptyState.jsx";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [personal, setPersonal] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    location: "",
  });
  const [personalErrors, setPersonalErrors] = useState({});

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    getProfile()
      .then((storedProfile) => {
        setProfile(storedProfile);
        setPersonal({
          name: storedProfile?.name || "",
          email: storedProfile?.email || "",
          phone: storedProfile?.phone || "",
          address: storedProfile?.delivery?.address || "",
          city: storedProfile?.delivery?.city || "",
          location: storedProfile?.delivery?.location || "",
        });
        setError("");
      })
      .catch((loadError) => {
        setError(loadError.message || "Unable to load profile");
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePersonalChange = (field, value) => {
    setPersonal((prev) => ({ ...prev, [field]: value }));
    if (personalErrors[field]) {
      setPersonalErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSavePersonal = async (e) => {
    e.preventDefault();

    const { errors, isValid } = validateProfile({
      name: personal.name,
      email: personal.email,
      phone: personal.phone,
      address: personal.address,
      city: personal.city,
      location: personal.location,
    });

    setPersonalErrors(errors);

    if (!isValid) return;

    setSaving(true);

    try {
      const nextProfile = await updateProfile({
        name: personal.name,
        email: personal.email,
        phone: personal.phone,
        delivery: {
          address: personal.address,
          city: personal.city,
          location: personal.location,
        },
      });

      setProfile(nextProfile);
      updateStoredUser({ name: nextProfile.name });
      showSuccess("Profile updated");
    } catch (saveError) {
      showError(saveError.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showError("Please choose an image file");
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const nextProfile = await saveProfileImage(reader.result);
        setProfile(nextProfile);
        showSuccess("Profile photo updated");
      } catch (saveError) {
        showError(saveError.message || "Unable to save photo");
      }
    };

    reader.readAsDataURL(file);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const { errors, isValid } = validatePasswordChange({
      newPassword: passwords.newPassword,
      confirmPassword: passwords.confirmPassword,
    });

    setPasswordErrors(errors);

    if (!isValid) return;

    setSavingPassword(true);

    try {
      await changePassword({ newPassword: passwords.newPassword });
      setPasswords({ newPassword: "", confirmPassword: "" });
      showSuccess("Password updated (demo — stored in this browser only)");
    } catch (saveError) {
      showError(saveError.message || "Unable to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  const inputClass = (field, errorMap) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm text-stone-700 outline-none transition-colors focus:border-brand-400 ${
      errorMap[field] ? "!border-red-400 bg-red-50/40" : "border-stone-200 bg-white"
    }`;

  const labelClass = "mb-1.5 block text-sm font-medium text-stone-600";

  const personalPanel = (
    <form onSubmit={handleSavePersonal} className="space-y-6">
      <div className="flex flex-wrap items-center gap-6 rounded-2xl bg-brand-50/60 p-6">
        <label className="group relative cursor-pointer" title="Change photo">
          <Avatar
            size={88}
            src={profile?.image || undefined}
            className="!bg-brand-700 !text-3xl"
          >
            {(profile?.name || "C").charAt(0).toUpperCase()}
          </Avatar>
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
            <FaUserEdit className="h-5 w-5" />
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
        <div>
          <p className="font-display text-xl font-semibold text-stone-900">
            {profile?.name || "Customer"}
          </p>
          <p className="text-sm text-stone-500">{profile?.email || "—"}</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700">
            <FaCheckCircle className="h-3.5 w-3.5" />
            Verified customer account
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="profile-name">
            Full name
          </label>
          <input
            id="profile-name"
            type="text"
            value={personal.name}
            onChange={(e) => handlePersonalChange("name", e.target.value)}
            className={inputClass("name", personalErrors)}
          />
          {personalErrors.name && (
            <p className="mt-1 text-xs text-red-500">{personalErrors.name}</p>
          )}
        </div>
        <div>
          <label className={labelClass} htmlFor="profile-email">
            Email
          </label>
          <input
            id="profile-email"
            type="email"
            value={personal.email}
            onChange={(e) => handlePersonalChange("email", e.target.value)}
            className={inputClass("email", personalErrors)}
          />
          {personalErrors.email && (
            <p className="mt-1 text-xs text-red-500">{personalErrors.email}</p>
          )}
        </div>
        <div>
          <label className={labelClass} htmlFor="profile-phone">
            Phone
          </label>
          <input
            id="profile-phone"
            type="tel"
            value={personal.phone}
            onChange={(e) => handlePersonalChange("phone", e.target.value)}
            placeholder="e.g. 0300 1234567"
            className={inputClass("phone", personalErrors)}
          />
          {personalErrors.phone && (
            <p className="mt-1 text-xs text-red-500">{personalErrors.phone}</p>
          )}
        </div>
        <div>
          <label className={labelClass} htmlFor="profile-city">
            City
          </label>
          <input
            id="profile-city"
            type="text"
            value={personal.city}
            onChange={(e) => handlePersonalChange("city", e.target.value)}
            className={inputClass("city", personalErrors)}
          />
          {personalErrors.city && (
            <p className="mt-1 text-xs text-red-500">{personalErrors.city}</p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="profile-address">
            Delivery address
          </label>
          <input
            id="profile-address"
            type="text"
            value={personal.address}
            onChange={(e) => handlePersonalChange("address", e.target.value)}
            placeholder="House, street, area..."
            className={inputClass("address", personalErrors)}
          />
          {personalErrors.address && (
            <p className="mt-1 text-xs text-red-500">{personalErrors.address}</p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="profile-location">
            Area / landmark
          </label>
          <input
            id="profile-location"
            type="text"
            value={personal.location}
            onChange={(e) => handlePersonalChange("location", e.target.value)}
            placeholder="e.g. Near F-10 Markaz"
            className={inputClass("location", personalErrors)}
          />
          {personalErrors.location && (
            <p className="mt-1 text-xs text-red-500">{personalErrors.location}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );

  const passwordPanel = (
    <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-5">
      <div className="rounded-2xl bg-amber-50 p-4 text-xs text-amber-800">
        <FaBell className="mb-1 h-4 w-4" />
        Demo mode: passwords are stored in this browser only and are not sent
        anywhere.
      </div>

      <div>
        <label className={labelClass} htmlFor="profile-new-password">
          New password
        </label>
        <input
          id="profile-new-password"
          type="password"
          value={passwords.newPassword}
          onChange={(e) => {
            setPasswords((prev) => ({ ...prev, newPassword: e.target.value }));
            if (passwordErrors.newPassword) {
              setPasswordErrors((prev) => ({ ...prev, newPassword: undefined }));
            }
          }}
          placeholder="At least 6 characters"
          className={inputClass("newPassword", passwordErrors)}
        />
        {passwordErrors.newPassword && (
          <p className="mt-1 text-xs text-red-500">{passwordErrors.newPassword}</p>
        )}
      </div>

      <div>
        <label className={labelClass} htmlFor="profile-confirm-password">
          Confirm new password
        </label>
        <input
          id="profile-confirm-password"
          type="password"
          value={passwords.confirmPassword}
          onChange={(e) => {
            setPasswords((prev) => ({ ...prev, confirmPassword: e.target.value }));
            if (passwordErrors.confirmPassword) {
              setPasswordErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }
          }}
          placeholder="Re-enter your new password"
          className={inputClass("confirmPassword", passwordErrors)}
        />
        {passwordErrors.confirmPassword && (
          <p className="mt-1 text-xs text-red-500">{passwordErrors.confirmPassword}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={savingPassword}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-60"
        >
          {savingPassword ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  );

  if (loading) {
    return (
      <div className="bg-cream/40">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-cream/40">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <EmptyState
            title="Could not load profile"
            description={error}
            actionLabel="Back to Home"
            onAction={() => navigate("/customer")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream/40">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-6 flex items-center gap-3 font-display text-3xl font-semibold tracking-tight text-stone-900">
          <FaUserEdit className="h-6 w-6 text-brand-700" />
          My Profile
        </h1>

        <Tabs
          defaultActiveKey="personal"
          items={[
            {
              key: "personal",
              label: (
                <span className="inline-flex items-center gap-2">
                  <FaMapMarkerAlt className="h-3.5 w-3.5" />
                  Personal & Delivery
                </span>
              ),
              children: <div className="pt-4">{personalPanel}</div>,
            },
            {
              key: "security",
              label: (
                <span className="inline-flex items-center gap-2">
                  <FaKey className="h-3.5 w-3.5" />
                  Change Password
                </span>
              ),
              children: <div className="pt-4">{passwordPanel}</div>,
            },
          ]}
          className="profile-tabs"
        />
      </div>
    </div>
  );
};

export default Profile;