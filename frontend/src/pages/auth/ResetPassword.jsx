import { useState } from "react";
import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { Button as AntButton } from "antd";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import AuthInput from "../../components/auth/AuthInput.jsx";
import AlertMessage from "../../components/common/feedback/AlertMessage.jsx";
import { notifySuccess } from "../../components/common/feedback/NotificationProvider.jsx";
import { ROLES, roleMeta } from "../../components/auth/roleMeta.js";
import { validateResetPassword } from "../../validations/auth.validation.js";
import { getResetVerification, clearResetVerification } from "../../utils/auth.js";
import {
  cancelOtp as adminCancelOtp,
  resetPassword as adminResetPassword,
} from "../../services/auth.service.js";
import {
  cancelOtp as farmerCancelOtp,
  resetPassword as farmerResetPassword,
} from "../../services/farmerAuth.service.js";

const ResetPassword = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const meta = roleMeta[role];

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);

  if (!ROLES.includes(role)) {
    return <Navigate to="/404" replace />;
  }

  const resetVerification =
    typeof window !== "undefined" ? getResetVerification() : { email: "", resetToken: "" };

  if (!resetVerification?.resetToken) {
    return <Navigate to={`/forgot-password/${role}`} replace />;
  }

  const submitReset =
    role === "farmer" ? farmerResetPassword : adminResetPassword;
  const submitCancel =
    role === "farmer" ? farmerCancelOtp : adminCancelOtp;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const { errors: nextErrors, isValid } = validateResetPassword({
      newPassword,
      confirmPassword,
    });
    setErrors(nextErrors);

    if (!isValid) return;

    setLoading(true);
    setAlert("");

    try {
      await submitReset({
        email: resetVerification?.email,
        resetToken: resetVerification?.resetToken,
        newPassword,
        role,
      });

      clearResetVerification();

      notifySuccess({
        message: "Password Reset Successful",
        description:
          "Your password has been reset successfully. Please log in with your new password.",
      });

      navigate(`/login/${role}`, { replace: true });
    } catch (resetError) {
      setAlert(resetError.message);
    } finally {
      setLoading(false);
    }
  };

  const clearAttempt = async () => {
    try {
      await submitCancel({ email: resetVerification?.email, role });
    } catch {
      // best effort: clear local state even if backend cancel fails
    }
    clearResetVerification();
  };

  const handleBackToHome = async (event) => {
    event.preventDefault();
    await clearAttempt();
    navigate("/");
  };

  return (
    <AuthLayout
      title="One more step"
      subtitle="Create a strong, new password for your MarketLink account."
    >
      <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
        <meta.icon className="h-3.5 w-3.5" />
        {meta.capitalized} Account
      </span>

      <h1 className="mt-5 font-display text-3xl font-semibold text-stone-900">
        Reset Password
      </h1>
      <p className="mt-2 text-sm text-stone-600">
        Set a fresh password for your {meta.label} account.
      </p>

      {alert && (
        <div className="mt-6">
          <AlertMessage type="error" message={alert} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <AuthInput
          label="New Password"
          type="password"
          icon={FaLock}
          placeholder="At least 6 characters"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={errors.newPassword}
          showPasswordToggle
          autoComplete="new-password"
        />
        <AuthInput
          label="Confirm Password"
          type="password"
          icon={FaLock}
          placeholder="Re-enter your new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          showPasswordToggle
          autoComplete="new-password"
        />
        <AntButton
          htmlType="submit"
          type="primary"
          size="large"
          block
          loading={loading}
          className="!rounded-xl !border-transparent !bg-brand-700 !text-white !font-semibold shadow-sm hover:!bg-brand-800"
        >
          Reset Password
        </AntButton>
      </form>

      <div className="mt-6 border-t border-stone-200 pt-4 text-center">
        <Link
          to="/"
          onClick={handleBackToHome}
          className="text-sm font-medium text-stone-500 hover:text-stone-700"
        >
          ← Back to Home
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;