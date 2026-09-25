const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const OTP_REGEX = /^\d{6}$/;
const PHONE_REGEX = /^[0-9+\-()\s.]{6,20}$/;
const MIN_PASSWORD_LENGTH = 6;

const validateLogin = ({ email, password }) => {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = "Please enter a valid email";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
};

const validateForgotPassword = ({ email }) => {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
};

const validateOtp = ({ otp }) => {
  const errors = {};

  if (!otp || !OTP_REGEX.test(otp)) {
    errors.otp = "Please enter the 6-digit verification code.";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
};

const validateResetPassword = ({ newPassword, confirmPassword }) => {
  const errors = {};

  if (!newPassword) {
    errors.newPassword = "New password is required.";
  } else if (newPassword.length < MIN_PASSWORD_LENGTH || /\s/.test(newPassword)) {
    errors.newPassword =
      "Password must be at least 6 characters long and must not contain spaces.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your new password.";
  } else if (/\s/.test(confirmPassword)) {
    errors.confirmPassword = "Password must not contain spaces.";
  } else if (confirmPassword !== newPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
};

const validateSignup = (
  { name, email, phone, specialization, password, confirmPassword },
  { requireSpecialization = true } = {}
) => {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = "Full name is required";
  } else if (name.trim().length < 2 || name.trim().length > 60) {
    errors.name = "Full name must be between 2 and 60 characters";
  }

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  if (!phone || !phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!PHONE_REGEX.test(phone.trim())) {
    errors.phone = "Phone number must contain only digits, spaces, and + - ( ) characters";
  }

  if (requireSpecialization && !specialization) {
    errors.specialization = "Please choose a specialization";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = "Password must be at least 6 characters";
  } else if (/\s/.test(password) || !password.trim()) {
    errors.password = "Password must not contain spaces";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (/\s/.test(confirmPassword)) {
    errors.confirmPassword = "Password must not contain spaces";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
};

export { validateLogin, validateForgotPassword, validateOtp, validateResetPassword, validateSignup };