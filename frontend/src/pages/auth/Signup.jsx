import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaPhoneAlt } from "react-icons/fa";
import { GiCorn } from "react-icons/gi";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import AuthInput from "../../components/auth/AuthInput.jsx";
import Button from "../../components/common/Button.jsx";
import { SIGNUP_ROLES, roleMeta } from "../../components/auth/roleMeta.js";

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

  if (!SIGNUP_ROLES.includes(role)) {
    return <Navigate to="/404" replace />;
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Full name is required";
    if (!form.email.trim()) nextErrors.email = "Email is required";
    if (!form.phone.trim()) nextErrors.phone = "Phone number is required";
    if (isFarmer && !form.specialization)
      nextErrors.specialization = "Please choose a specialization";
    if (!form.password) nextErrors.password = "Password is required";
    if (form.password && form.password.length < 6)
      nextErrors.password = "Password must be at least 6 characters";
    if (form.confirmPassword !== form.password)
      nextErrors.confirmPassword = "Passwords do not match";
    setErrors(nextErrors);
  };

  return (
    <AuthLayout
      title="Grow your harvest, grow your reach"
      subtitle="Join MarketLink and start connecting directly with the people who buy what you grow."
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

        <Button type="submit" className="w-full" size="lg">
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