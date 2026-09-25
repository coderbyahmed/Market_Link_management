import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams, Navigate, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Button as AntButton } from "antd";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import AlertMessage from "../../components/common/feedback/AlertMessage.jsx";
import { notifySuccess } from "../../components/common/feedback/NotificationProvider.jsx";
import { ROLES, roleMeta } from "../../components/auth/roleMeta.js";
import { validateOtp } from "../../validations/auth.validation.js";
import {
  forgotPassword as adminForgotPassword,
  verifyOtp as adminVerifyOtp,
  cancelOtp as adminCancelOtp,
} from "../../services/auth.service.js";
import {
  forgotPassword as farmerForgotPassword,
  verifyOtp as farmerVerifyOtp,
  cancelOtp as farmerCancelOtp,
} from "../../services/farmerAuth.service.js";
import {
  saveOtpExpiry,
  getOtpExpiry,
  saveResetVerification,
  clearOtpExpiry,
  clearResetVerification,
  OTP_VALIDITY_MINUTES,
} from "../../utils/auth.js";

const OTP_LENGTH = 6;

const formatTime = (totalSeconds) => {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const VerifyOTP = () => {
  const { role } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const meta = roleMeta[role];

  const email = (searchParams.get("email") || "").trim();

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);
  const [expiresAt, setExpiresAt] = useState(() => {
    const stored = getOtpExpiry();
    return stored && stored > Date.now()
      ? stored
      : Date.now() + OTP_VALIDITY_MINUTES * 60 * 1000;
  });
  const [secondsLeft, setSecondsLeft] = useState(0);
  const inputsRef = useRef([]);

  const sendOtp = role === "farmer" ? farmerForgotPassword : adminForgotPassword;
  const verifyOtp =
    role === "farmer" ? farmerVerifyOtp : adminVerifyOtp;
  const cancelOtp = role === "farmer" ? farmerCancelOtp : adminCancelOtp;

  useEffect(() => {
    const tick = () => {
      setSecondsLeft(Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)));
    };

    tick();
    const timerId = setInterval(tick, 1000);

    return () => clearInterval(timerId);
  }, [expiresAt]);

  if (!ROLES.includes(role)) {
    return <Navigate to="/404" replace />;
  }

  if (!email) {
    return <Navigate to={`/forgot-password/${role}`} replace />;
  }

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setAlert("");

    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...otp];
    pasted.split("").forEach((digit, i) => {
      next[i] = digit;
    });
    setOtp(next);
    setAlert("");
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const code = otp.join("");

    const { errors, isValid } = validateOtp({ otp: code });
    if (!isValid) {
      setAlert(errors.otp);
      return;
    }

    setLoading(true);
    setAlert("");

    try {
      const data = await verifyOtp({ email, otp: code, role });

      saveResetVerification({ email, resetToken: data?.resetToken });
      clearOtpExpiry();

      notifySuccess({
        message: "OTP Verified Successfully",
        description:
          "Your OTP has been verified successfully. You can now reset your password.",
      });

      navigate(`/reset-password/${role}`, { replace: true });
    } catch (error) {
      if (error.message === "Invalid OTP") {
        setAlert(
          "The OTP you entered is incorrect. Please check your email and enter the correct verification code."
        );
      } else {
        setAlert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (loading) return;
    if (secondsLeft > 0) return;

    setLoading(true);
    setAlert("");

    try {
      await sendOtp({ email, role });

      const nextExpiry = Date.now() + OTP_VALIDITY_MINUTES * 60 * 1000;
      saveOtpExpiry(nextExpiry);
      setExpiresAt(nextExpiry);
      setOtp(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();

      notifySuccess({
        message: "OTP Sent Successfully",
        description: `A new verification code has been sent to your registered ${meta.label} email address. Please check your email and enter the OTP within 5 minutes.`,
      });
    } catch (error) {
      setAlert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const invalidateAttempt = async () => {
    if (!email) return;
    try {
      await cancelOtp({ email, role });
    } catch {
      // best effort: continue clearing local state even if cancel fails
    }
    clearResetVerification();
  };

  const handleBackToForgot = async (event) => {
    event.preventDefault();
    await invalidateAttempt();
    navigate(`/forgot-password/${role}`);
  };

  const handleBackToHome = async (event) => {
    event.preventDefault();
    await invalidateAttempt();
    navigate("/");
  };

  return (
    <AuthLayout
      title="Almost there"
      subtitle="Verify your email to continue securing your account."
    >
      <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
        <meta.icon className="h-3.5 w-3.5" />
        {meta.capitalized} Verification
      </span>

      <h1 className="mt-5 font-display text-3xl font-semibold text-stone-900">
        Verify OTP
      </h1>
      <p className="mt-2 text-sm text-stone-600">
        Enter the 6-digit code we sent to your email to verify your identity.
      </p>

      <p className="mt-1 text-xs text-stone-500">
        A verification code was sent to <span className="font-medium text-stone-700">{email}</span>.
      </p>

      {alert && (
        <div className="mt-6">
          <AlertMessage type="error" message={alert} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              inputMode="numeric"
              maxLength={1}
              autoFocus={index === 0}
              className="h-12 w-full max-w-12 rounded-xl border border-stone-300 bg-white text-center text-lg font-semibold text-stone-800 outline-none transition-colors focus:border-brand-500 sm:h-14 sm:max-w-14"
            />
          ))}
        </div>

        <AntButton
          htmlType="submit"
          type="primary"
          size="large"
          block
          loading={loading}
          className="!rounded-xl !border-transparent !bg-brand-700 !text-white !font-semibold shadow-sm hover:!bg-brand-800"
        >
          Verify OTP
        </AntButton>
      </form>

      <div className="mt-6 flex flex-col items-center justify-between gap-3 text-sm sm:flex-row">
        <button
          type="button"
          onClick={handleResend}
          disabled={secondsLeft > 0}
          className="font-semibold text-brand-700 hover:text-brand-800 disabled:cursor-not-allowed disabled:text-stone-400"
        >
          Resend OTP
        </button>
        <Link
          to={`/forgot-password/${role}`}
          onClick={handleBackToForgot}
          className="flex items-center gap-2 font-medium text-stone-600 hover:text-brand-700"
        >
          <FaArrowLeft className="h-3.5 w-3.5" />
          Back to Forgot Password
        </Link>
      </div>

      <p className="mt-2 text-center text-sm text-stone-600">
        {secondsLeft > 0 ? (
          <>
            Code expires in{" "}
            <span className="font-semibold text-stone-800">{formatTime(secondsLeft)}</span>
          </>
        ) : (
          "Code expired. You can request a new one."
        )}
      </p>

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

export default VerifyOTP;