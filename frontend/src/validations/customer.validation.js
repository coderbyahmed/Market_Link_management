const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const PHONE_REGEX = /^[0-9+\-()\s.]{6,20}$/;
const MIN_PASSWORD_LENGTH = 6;

const validateCheckout = ({
  name,
  email,
  phone,
  address,
  city,
  location,
}) => {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = "Full name is required";
  } else if (name.trim().length < 2) {
    errors.name = "Full name is too short";
  }

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = "Please enter a valid email";
  }

  if (!phone || !phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!PHONE_REGEX.test(phone.trim())) {
    errors.phone = "Please enter a valid phone number";
  }

  if (!address || !address.trim()) {
    errors.address = "Delivery address is required";
  } else if (address.trim().length < 5) {
    errors.address = "Please enter a complete address";
  }

  if (!city || !city.trim()) {
    errors.city = "City is required";
  }

  if (!location || !location.trim()) {
    errors.location = "Area / location is required";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
};

const validateQuantity = ({ quantity, stock }) => {
  const errors = {};

  if (!Number.isInteger(quantity) || quantity < 1) {
    errors.quantity = "Quantity must be at least 1";
  } else if (quantity > stock) {
    errors.quantity = `Only ${stock} available in stock`;
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
};

const validateReview = ({ rating, text }) => {
  const errors = {};

  if (!rating || rating < 1 || rating > 5) {
    errors.rating = "Please select a rating from 1 to 5 stars";
  }

  if (!text || !text.trim()) {
    errors.text = "Please write a short review";
  } else if (text.trim().length < 10) {
    errors.text = "Review must be at least 10 characters";
  } else if (text.trim().length > 600) {
    errors.text = "Review cannot exceed 600 characters";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
};

const validateProfile = ({ name, email, phone, address, location }) => {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = "Full name is required";
  } else if (name.trim().length < 2) {
    errors.name = "Full name is too short";
  }

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = "Please enter a valid email";
  }

  if (phone && !PHONE_REGEX.test(phone.trim())) {
    errors.phone = "Please enter a valid phone number";
  }

  if (address && address.trim() && address.trim().length < 5) {
    errors.address = "Please enter a complete address";
  }

  if (location && location.trim() && location.trim().length < 3) {
    errors.location = "Please enter a valid area / location";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
};

const validatePasswordChange = ({ newPassword, confirmPassword }) => {
  const errors = {};

  if (!newPassword) {
    errors.newPassword = "New password is required";
  } else if (newPassword.length < MIN_PASSWORD_LENGTH) {
    errors.newPassword = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  } else if (/\s/.test(newPassword)) {
    errors.newPassword = "Password must not contain spaces";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your new password";
  } else if (confirmPassword !== newPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
};

export {
  validateCheckout,
  validateQuantity,
  validateReview,
  validateProfile,
  validatePasswordChange,
};