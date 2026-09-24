import { useState } from "react";
import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { Button as AntButton } from "antd";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import AuthInput from "../../components/auth/AuthInput.jsx";
import AlertMessage from "../../components/common/feedback/AlertMessage.jsx";
import { notifySuccess } from "../../components/common/feedback/NotificationProvider.jsx";
import { ROLES, roleMeta } from "../../components/auth/roleMeta.js";
import { validateForgotPassword } from "../../validations/auth.validation.js";
import { forgotPassword } from "../../services/auth.service.js";
import { saveOtpExpiry, OTP_VALIDITY_MINUTES } from "../../utils/auth.js";

const ForgotPassword = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const meta = roleMeta[role];

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);

  if (!ROLES.includes(role)) {
    return <Navigate to="/404" replace />;
  }

  const isAdminFlow = role === "admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (isAdminFlow) {
      const { errors, isValid } = validateForgotPassword({ email });
      if (!isValid) {
        setAlert(errors.email);
        return;
      }

      setLoading(true);
      setAlert("");

      try {
        await forgotPassword({ email: email.trim(), role });

        saveOtpExpiry(Date.now() + OTP_VALIDITY_MINUTES * 60 * 1000);

        notifySuccess({
          message: "OTP Sent Successfully",
          description:
            "A verification code has been sent to your registered admin email address. Please check your email and enter the OTP within 5 minutes.",
        });

        navigate(`/verify-otp/${role}?email=${encodeURIComponent(email.trim())}`, {
          replace: true,
        });
      } catch (submitError) {
        setAlert(submitError.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    setLoading(true);
    navigate(`/verify-otp/${role}`);
  };

  return (
    <AuthLayout
      title="We'll help you back in"
      subtitle="Enter your account email and we'll send you a secure OTP to reset your password."
    >
      <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
        <meta.icon className="h-3.5 w-3.5" />
        {meta.capitalized} Account
      </span>

      <h1 className="mt-5 font-display text-3xl font-semibold text-stone-900">
        Forgot Password
      </h1>
      <p className="mt-2 text-sm text-stone-600">
        {meta.capitalized} password recovery. We'll email a verification code to
        the address below.
      </p>

      {isAdminFlow && alert && (
        <div className="mt-6">
          <AlertMessage type="error" message={alert} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <AuthInput
          label="Email Address"
          type="email"
          icon={FaEnvelope}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
            setAlert("");
          }}
          error={isAdminFlow ? undefined : error}
          autoComplete="email"
        />
        <AntButton
          htmlType="submit"
          type="primary"
          size="large"
          block
          loading={loading}
          className="!rounded-xl !border-transparent !bg-brand-700 !text-white !font-semibold shadow-sm hover:!bg-brand-800"
        >
          Send OTP
        </AntButton>
      </form>

      <div className="mt-6 space-y-4">
        <Link
          to={`/login/${role}`}
          className="flex items-center justify-center gap-2 text-sm font-medium text-stone-600 hover:text-brand-700"
        >
          <FaArrowLeft className="h-3.5 w-3.5" />
          Back to Login
        </Link>
        <div className="border-t border-stone-200 pt-4 text-center">
          <Link to="/" className="text-sm font-medium text-stone-500 hover:text-stone-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;