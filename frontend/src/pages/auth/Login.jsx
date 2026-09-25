import { useEffect, useRef, useState } from "react";
import { Link, useParams, Navigate, useNavigate, useLocation } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import AuthInput from "../../components/auth/AuthInput.jsx";
import Button from "../../components/common/Button.jsx";
import { ROLES, roleMeta } from "../../components/auth/roleMeta.js";
import { validateLogin } from "../../validations/auth.validation.js";
import {
  login as adminLogin,
  loginCustomer,
} from "../../services/auth.service.js";
import { login as farmerLogin } from "../../services/farmerAuth.service.js";
import { saveAuth } from "../../utils/auth.js";
import { showError, showSuccess } from "../../components/common/feedback/MessageProvider.jsx";
import { notifySuccess } from "../../components/common/feedback/NotificationProvider.jsx";
import AlertMessage from "../../components/common/feedback/AlertMessage.jsx";

const Login = () => {
  const { role } = useParams();
  const meta = roleMeta[role];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const consumedLogoutKey = useRef(null);

  useEffect(() => {
    if (
      role === "admin" &&
      location.state?.logout &&
      consumedLogoutKey.current !== location.key
    ) {
      consumedLogoutKey.current = location.key;
      showSuccess("Admin Logout Successful");
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [role, location, navigate]);

  if (!ROLES.includes(role)) {
    return <Navigate to="/404" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const { errors: nextErrors, isValid } = validateLogin({ email, password });
    setErrors(nextErrors);

    if (!isValid) return;

    setLoading(true);
    setAlert(null);

    try {
      let session;

      if (role === "customer") {
        session = await loginCustomer({
          email: email.trim().toLowerCase(),
          password,
        });
      } else if (role === "farmer") {
        session = await farmerLogin({ email: email.trim(), password });
      } else {
        session = await adminLogin({ email: email.trim(), password });
      }

      if (!session?.token) {
        throw new Error("Something went wrong. Please try again.");
      }

      if (role === "customer" && session.user?.role !== "customer") {
        throw new Error("This account is not registered as a customer.");
      }

      saveAuth(session);
      setPassword("");

      if (role === "customer") {
        showSuccess("Login successful.");
      }

      notifySuccess({
        message: "Login successful",
        description: `Welcome back, ${session.user?.name || meta.label}. Redirecting to your dashboard...`,
      });

      const dashboardPaths = {
        customer: "/customer",
        farmer: "/farmer",
        admin: "/admin",
      };

      navigate(dashboardPaths[role], { replace: true });
    } catch (error) {
      const errorMessage =
        error.message || "Something went wrong. Please try again.";

      if (
        role === "farmer" &&
        errorMessage.includes("awaiting admin approval")
      ) {
        setAlert({
          type: "warning",
          message:
            "Your account is awaiting admin approval. You will be able to log in once an admin approves your farmer account.",
        });
      } else if (
        error?.cause?.response?.data?.code === "ACCOUNT_DEACTIVATED"
      ) {
        setAlert({
          type: "error",
          message: "Account Deactivated",
          description:
            "Your account has been deactivated by the administrator. You cannot log in while your account is inactive. Please contact the administrator for further assistance.",
        });
      } else if (role === "customer") {
        setAlert({ type: "error", message: errorMessage });
      } else {
        showError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const showSignup = role === "farmer" || role === "customer";

  return (
    <AuthLayout
      title="Fresh food, straight from local farms"
      subtitle="Sign in to continue trading on the MarketLink marketplace."
    >
      <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
        <meta.icon className="h-3.5 w-3.5" />
        {meta.capitalized} Account
      </span>

      <h1 className="mt-5 font-display text-3xl font-semibold text-stone-900">
        {meta.capitalized} Login
      </h1>
      <p className="mt-2 text-sm text-stone-600">
        Welcome back! Enter your details to access your account.
      </p>

      {alert && (
        <div className="mt-6">
          <AlertMessage
            type={alert.type}
            message={alert.message}
            description={alert.description}
          />
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
            setAlert(null);
          }}
          error={errors.email}
          autoComplete="email"
        />
        <AuthInput
          label="Password"
          type="password"
          icon={FaLock}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setAlert(null);
          }}
          error={errors.password}
          showPasswordToggle
          autoComplete="current-password"
        />

        <div className="flex items-center justify-end">
          <Link
            to={`/forgot-password/${role}`}
            className="text-sm font-medium text-brand-700 hover:text-brand-800"
          >
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Login
        </Button>
      </form>

      {showSignup && (
        <p className="mt-6 text-center text-sm text-stone-600">
          Don't have an account?{" "}
          <Link
            to={`/signup/${role}`}
            className="font-semibold text-brand-700 hover:text-brand-800"
          >
            Create {meta.capitalized} Account
          </Link>
        </p>
      )}

      <div className="mt-8 border-t border-stone-200 pt-6 text-center">
        <Link to="/" className="text-sm font-medium text-stone-500 hover:text-stone-700">
          ← Back to Home
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;