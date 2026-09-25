const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const OTP_REGEX = /^\d{6}$/;
const PHONE_REGEX = /^[0-9+\-()\s.]{6,20}$/;
const MIN_PASSWORD_LENGTH = 6;

const FARM_SPECIALIZATIONS = [
    "Vegetables",
    "Fruits",
    "Grains",
    "Dairy",
    "Livestock",
    "Organic Farming",
    "Mixed Farming",
    "Other",
];

const sendValidationError = (res, message) => {
    return res.status(400).json({
        success: false,
        message,
        error: null,
    });
};

const validateFarmerRegister = (req, res, next) => {
    const { name, email, phone, farmSpecialization, password, confirmPassword } =
        req.body;

    if (
        !name ||
        !email ||
        !phone ||
        !farmSpecialization ||
        !password
    ) {
        return sendValidationError(res, "All fields are required");
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
        return sendValidationError(res, "Full name is required");
    }

    if (trimmedName.length < 2 || trimmedName.length > 60) {
        return sendValidationError(
            res,
            "Full name must be between 2 and 60 characters"
        );
    }

    if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
        return sendValidationError(res, "Please enter a valid email address");
    }

    const trimmedPhone = phone.trim();

    if (!PHONE_REGEX.test(trimmedPhone)) {
        return sendValidationError(
            res,
            "Phone number must contain only digits, spaces, and + - ( ) characters"
        );
    }

    if (!FARM_SPECIALIZATIONS.includes(farmSpecialization)) {
        return sendValidationError(res, "Please choose a valid farm specialization");
    }

    if (
        typeof password !== "string" ||
        password.length < MIN_PASSWORD_LENGTH
    ) {
        return sendValidationError(
            res,
            `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
        );
    }

    if (/\s/.test(password) || !password.trim()) {
        return sendValidationError(
            res,
            "Password must not contain spaces"
        );
    }

    if (confirmPassword && confirmPassword !== password) {
        return sendValidationError(res, "Passwords do not match");
    }

    next();
};

const validateFarmerLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return sendValidationError(res, "Email and password are required");
    }

    if (!EMAIL_REGEX.test(email)) {
        return sendValidationError(res, "Please enter a valid email address");
    }

    next();
};

const validateFarmerForgotPassword = (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return sendValidationError(res, "Please enter your email address");
    }

    if (!EMAIL_REGEX.test(email)) {
        return sendValidationError(res, "Please enter a valid email address");
    }

    next();
};

const validateFarmerVerifyOtp = (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return sendValidationError(res, "Email and OTP are required");
    }

    if (!EMAIL_REGEX.test(email)) {
        return sendValidationError(res, "Please enter a valid email address");
    }

    if (!OTP_REGEX.test(typeof otp === "string" ? otp : "")) {
        return sendValidationError(res, "OTP must be a 6-digit code");
    }

    next();
};

const validateFarmerCancelOtp = (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return sendValidationError(res, "Email is required");
    }

    if (!EMAIL_REGEX.test(email)) {
        return sendValidationError(res, "Please enter a valid email address");
    }

    next();
};

const validateFarmerResetPassword = (req, res, next) => {
    const { email, resetToken, newPassword } = req.body;

    if (!email || !resetToken || !newPassword) {
        return sendValidationError(
            res,
            "Email, reset token, and new password are required"
        );
    }

    if (!EMAIL_REGEX.test(email)) {
        return sendValidationError(res, "Please enter a valid email address");
    }

    if (
        typeof newPassword !== "string" ||
        newPassword.length < MIN_PASSWORD_LENGTH
    ) {
        return sendValidationError(
            res,
            `Password must be at least ${MIN_PASSWORD_LENGTH} characters long and must not contain spaces`
        );
    }

    if (/\s/.test(newPassword) || !newPassword.trim()) {
        return sendValidationError(res, "Password must not contain spaces");
    }

    next();
};

export {
    validateFarmerRegister,
    validateFarmerLogin,
    validateFarmerForgotPassword,
    validateFarmerVerifyOtp,
    validateFarmerCancelOtp,
    validateFarmerResetPassword,
};