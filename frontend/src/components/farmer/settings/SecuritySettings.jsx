import { useState, useEffect } from "react";
import { Switch, Tag, Button } from "antd";
import { FaShieldAlt, FaMobileAlt, FaDesktop, FaSignOutAlt, FaKey } from "react-icons/fa";
import { showSuccess, showError } from "../../common/feedback/MessageProvider.jsx";
import { getSettings, updateSecurity, removeSession } from "../../../services/settings.service.js";

const SecuritySettings = () => {
  const [security, setSecurity] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [pwdSaving, setPwdSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const settings = await getSettings();
      setSecurity(settings.security);
    };
    load();
  }, []);

  const handle2FAChange = async (checked) => {
    try {
      await updateSecurity({ twoFactor: checked });
      setSecurity((prev) => ({ ...prev, twoFactor: checked }));
      showSuccess(`Two-factor authentication ${checked ? "enabled" : "disabled"} (demo).`);
    } catch (error) {
      showError(error.message || "Unable to update 2FA");
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      showError("Please fill all password fields.");
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      showError("New passwords do not match.");
      return;
    }
    if (passwordForm.new.length < 8) {
      showError("New password must be at least 8 characters.");
      return;
    }

    setPwdSaving(true);
    try {
      // Mock - in real app would call backend
      await new Promise((r) => setTimeout(r, 500));
      showSuccess("Password updated successfully (demo mode).");
      setPasswordForm({ current: "", new: "", confirm: "" });
    } catch (error) {
      showError(error.message || "Unable to change password");
    } finally {
      setPwdSaving(false);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    try {
      await removeSession(sessionId);
      setSecurity((prev) => ({
        ...prev,
        sessions: prev.sessions.filter((s) => s.id !== sessionId),
      }));
      showSuccess("Session revoked.");
    } catch (error) {
      showError(error.message || "Unable to revoke session");
    }
  };

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <div className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400">
              <FaShieldAlt className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-base font-semibold text-stone-900 dark:text-white">
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Add an extra layer of security to your account.
              </p>
            </div>
          </div>
          <Switch
            size="small"
            checked={security?.twoFactor}
            onChange={handle2FAChange}
          />
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <h3 className="font-display text-base font-semibold text-stone-900 dark:text-white flex items-center gap-2">
          <FaKey className="h-5 w-5" /> Change Password
        </h3>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Your new password must be at least 8 characters.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="current-password" className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400">
              Current Password
            </label>
            <input
              id="current-password"
              type="password"
              value={passwordForm.current}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, current: e.target.value }))}
              className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label htmlFor="new-password" className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={passwordForm.new}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, new: e.target.value }))}
              className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400">
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirm: e.target.value }))}
              className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={handlePasswordChange} loading={pwdSaving}>
            Update Password
          </Button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <h3 className="font-display text-base font-semibold text-stone-900 dark:text-white flex items-center gap-2">
          <FaMobileAlt className="h-5 w-5" /> Active Sessions
        </h3>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Manage devices currently logged into your account.
        </p>

        <ul className="mt-4 space-y-3">
          {security?.sessions?.map((session) => (
            <li key={session.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200/70 p-3 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-400">
                  {session.device.includes("Mobile") ? (
                    <FaMobileAlt className="h-5 w-5" />
                  ) : (
                    <FaDesktop className="h-5 w-5" />
                  )}
                </span>
                <div>
                  <p className="font-medium text-stone-800 dark:text-stone-200">{session.device}</p>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    {session.location} • Last active: {new Date(session.lastActive).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {session.current && (
                  <Tag color="green" className="!m-0 !rounded-full">
                    Current Device
                  </Tag>
                )}
                {!session.current && (
                  <Button
                    size="sm"
                    variant="text"
                    danger
                    onClick={() => handleRevokeSession(session.id)}
                  >
                    <FaSignOutAlt className="h-3.5 w-3.5" /> Sign Out
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SecuritySettings;