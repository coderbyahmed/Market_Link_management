import { useState } from "react";
import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaPhoneAlt } from "react-icons/fa";
import { GiCorn } from "react-icons/gi";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import AuthInput from "../../components/auth/AuthInput.jsx";
import Button from "../../components/common/Button.jsx";
import { SIGNUP_ROLES, roleMeta } from "../../components/auth/roleMeta.js";
import { validateSignup } from "../../validations/auth.validation.js";
import { registerCustomer } from "../../services/auth.service.js";
import { register as registerFarmer } from "../../services/farmerAuth.service.js";
import {
  showError,
  showSuccess,
} from "../../components/common/feedback/MessageProvider.jsx";
import { notifySuccess } from "../../components/common/feedback/NotificationProvider.jsx";
import AlertMessage from "../../components/common/feedback/AlertMessage.jsx";

const specializations = [
  "Vegetables",
  "Fruits",
  "Grains",
  "Dairy",
  "Livestock",
  "Organic Farming",
  "Mixed Farming",
  "Other",
];

const Signup = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const meta = roleMeta[role];
  const isFarmer = role === "farmer";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);

  if (!SIGNUP_ROLES.includes(role)) {
    return <Navigate to="/404" replace />;
  }

  const handleChange = (e) => {
    const fieldName = e.target.name;

    setForm((prev) => ({ ...prev, [fieldName]: e.target.value }));
    setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    setAlert("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setAlert("");

    if (isFarmer) {
      const { errors: nextErrors, isValid } = validateSignup({
        name: form.name,
        email: form.email,
        phone: form.phone,
        specialization: form.specialization,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      setErrors(nextErrors);

      if (!isValid) return;

      setLoading(true);

      try {
        await registerFarmer({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          farmSpecialization: form.specialization,
          password: form.password,
        });

        notifySuccess({
          message: "Account Created Successfully",
          description:
            "Your farmer account has been created successfully. However, you cannot log in until an administrator approves your account.",
        });

        navigate(`/login/farmer`, { replace: true });
      } catch (submitError) {
        showError(submitError.message || "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    const { errors: nextErrors, isValid } = validateSignup(
      {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        confirmPassword: form.confirmPassword,
      },
      { requireSpecialization: false }
    );

    setErrors(nextErrors);

    if (!isValid) return;

    setLoading(true);

    try {
      await registerCustomer({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      showSuccess("Account created successfully.");
      notifySuccess({
        message: "Account Created Successfully",
        description:
          "Your customer account has been created successfully. You can now log in using your email address and password.",
      });

      navigate("/login/customer", { replace: true });
    } catch (submitError) {
      const errorMessage =
        submitError.message || "Something went wrong. Please try again.";

      setAlert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={
        isFarmer
          ? "Grow your harvest, grow your reach"
          : "Fresh food, better shopping"
      }
      subtitle={
        isFarmer
          ? "Join MarketLink and start connecting directly with the people who buy what you grow."
          : "Create your MarketLink account to shop directly with trusted local farmers."
      }
    >
      <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
        <meta.icon className="h-3.5 w-3.5" />
        Create {meta.capitalized} Account
      </span>

      <h1 className="mt-5 font-display text-3xl font-semibold text-stone-900">
        {meta.capitalized} Signup
      </h1>
      <p className="mt-2 text-sm text-stone-600">
        Fill in your details to start your MarketLink journey.
      </p>

      {alert && (
        <div className="mt-6">
          <AlertMessage type="error" message={alert} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <AuthInput
          label="Full Name"
          icon={FaUser}
          placeholder="Enter your full name"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          autoComplete="name"
        />
        <AuthInput
          label="Email Address"
          type="email"
          icon={FaEnvelope}
          placeholder="you@example.com"
          name="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />
        <AuthInput
          label="Phone Number"
          type="tel"
          icon={FaPhoneAlt}
          placeholder="+1 555 000 0000"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          error={errors.phone}
          autoComplete="tel"
        />

        {isFarmer && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Farm Specialization
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
                <GiCorn className="h-4.5 w-4.5" />
              </span>
              <select
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                className={`w-full appearance-none rounded-xl border bg-white px-4 py-2.5 pl-10 text-sm text-stone-800 outline-none transition-colors focus:border-brand-500 ${
                  errors.specialization
                    ? "border-red-400"
                    : "border-stone-300"
                }`}
              >
                <option value="">Select specialization</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
            {errors.specialization && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.specialization}
              </p>
            )}
          </div>
        )}

        <AuthInput
          label="Password"
          type="password"
          icon={FaLock}
          placeholder="At least 6 characters"
          name="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          showPasswordToggle
          autoComplete="new-password"
        />
        <AuthInput
          label="Confirm Password"
          type="password"
          icon={FaLock}
          placeholder="Re-enter your password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          showPasswordToggle
          autoComplete="new-password"
        />

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-600">
        Already have an account?{" "}
        <Link
          to={`/login/${role}`}
          className="font-semibold text-brand-700 hover:text-brand-800"
        >
          Login
        </Link>
      </p>

      <div className="mt-8 border-t border-stone-200 pt-6 text-center">
        <Link to="/" className="text-sm font-medium text-stone-500 hover:text-stone-700">
          ← Back to Home
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Signup;