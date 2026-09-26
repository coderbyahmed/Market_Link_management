import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import AuthInput from "../../components/auth/AuthInput.jsx";
import Button from "../../components/common/Button.jsx";
import { login as adminLogin } from "../../services/auth.service.js";
import { saveAuth } from "../../utils/auth.js";
import { showError } from "../../components/common/feedback/MessageProvider.jsx";
import { notifySuccess } from "../../components/common/feedback/NotificationProvider.jsx";
import { validateLogin } from "../../validations/auth.validation.js";

const AdminLogin = () => {
  const { adminAccessId } = useParams();
  const navigate = useNavigate();
  const validAdminAccessId = import.meta.env.VITE_ADMIN_ACCESS_ID;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!validAdminAccessId || !adminAccessId || adminAccessId !== validAdminAccessId) {
    return <Navigate to="/404" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const { errors: nextErrors, isValid } = validateLogin({ email, password });
    setErrors(nextErrors);

    if (!isValid) return;

    setLoading(true);

    try {
      const session = await adminLogin({ email: email.trim(), password });

      if (!session?.token) {
        throw new Error("Something went wrong. Please try again.");
      }

      if (session.user?.role !== "admin") {
        throw new Error("This account is not registered as an admin.");
      }

      saveAuth(session);
      setPassword("");

      notifySuccess({
        message: "Login successful",
        description: `Welcome back, ${session.user?.name || "Admin"}. Redirecting to your dashboard...`,
      });

      navigate("/admin", { replace: true });
    } catch (error) {
      showError(error?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Fresh food, straight from local farms"
      subtitle="Sign in to continue managing the MarketLink platform."
    >
      <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
        Admin Account
      </span>

      <h1 className="mt-5 font-display text-3xl font-semibold text-stone-900">
        Admin Login
      </h1>
      <p className="mt-2 text-sm text-stone-600">
        Welcome back! Enter your details to access the admin dashboard.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <AuthInput
          label="Email Address"
          type="email"
          icon={FaEnvelope}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
        />
        <AuthInput
          label="Password"
          type="password"
          icon={FaLock}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          showPasswordToggle
          autoComplete="current-password"
        />

        <div className="flex items-center justify-end">
          <Link
            to="/forgot-password/admin"
            className="text-sm font-medium text-brand-700 hover:text-brand-800"
          >
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Login
        </Button>
      </form>

      <div className="mt-8 border-t border-stone-200 pt-6 text-center">
        <Link to="/" className="text-sm font-medium text-stone-500 hover:text-stone-700">
          ← Back to Home
        </Link>
      </div>
    </AuthLayout>
  );
};

export default AdminLogin;